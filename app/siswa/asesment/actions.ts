"use server";

import { revalidatePath } from "next/cache";

import { connectDB } from "../../../lib/mongodb";
import Asesmen from "../../../models/Asesmen";
import HasilAsesmen from "../../../models/HasilAsesmen";
import { getSiswaIdentity } from "../../actions/siswaIdentity";

function bersihkan(value: FormDataEntryValue | null): string {
  return String(value || "").trim();
}

/**
 * Siswa mengerjakan asesmen. Soal PG dinilai otomatis,
 * sedangkan soal esai menunggu penilaian guru.
 */
export async function kirimAsesmen(formData: FormData) {
  try {
    const identitas = await getSiswaIdentity();

    if (!identitas) {
      return {
        success: false,
        message: "Sesi siswa tidak ditemukan, silakan login ulang.",
      };
    }

    await connectDB();

    const asesmenId = bersihkan(formData.get("asesmenId"));

    if (!asesmenId) {
      return {
        success: false,
        message: "ID asesmen tidak ditemukan.",
      };
    }

    const asesmen = await Asesmen.findById(asesmenId).lean();

    if (!asesmen) {
      return {
        success: false,
        message: "Asesmen tidak ditemukan.",
      };
    }

    let jawaban: string[] = [];

    try {
      const parsed = JSON.parse(bersihkan(formData.get("jawaban")));

      if (Array.isArray(parsed)) {
        jawaban = parsed.map((item) => String(item ?? ""));
      }
    } catch {
      jawaban = [];
    }

    const soal = asesmen.soal || [];

    // Hitung skor otomatis dari soal pilihan ganda.
    let totalPg = 0;
    let benarPg = 0;

    soal.forEach((item, index) => {
      if (item.opsi?.length > 0 && item.jawabanBenar >= 0) {
        totalPg += 1;

        if (Number(jawaban[index]) === item.jawabanBenar) {
          benarPg += 1;
        }
      }
    });

    const skor = totalPg > 0 ? Math.round((benarPg / totalPg) * 100) : 0;

    await HasilAsesmen.findOneAndUpdate(
      { asesmenId, siswaId: identitas.siswaId },
      {
        asesmenId,
        siswaId: identitas.siswaId,
        namaSiswa: identitas.nama,
        kelas: asesmen.kelas || identitas.kelas,
        mataPelajaran: asesmen.mataPelajaran,
        jawaban,
        skor,
        // Esai tidak bisa dinilai otomatis -> tunggu guru.
        dinilai: totalPg > 0 && totalPg === soal.length,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    revalidatePath("/siswa/asesment");
    revalidatePath("/siswa/dashboard");

    return {
      success: true,
      message: "Jawaban asesmen berhasil dikirim.",
      skor,
    };
  } catch (error) {
    console.error("KIRIM ASESMEN ERROR:", error);

    return {
      success: false,
      message: "Gagal mengirim jawaban asesmen.",
    };
  }
}
