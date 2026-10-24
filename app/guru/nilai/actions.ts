"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../../../lib/auth";
import { connectDB } from "../../../lib/mongodb";
import Asesmen from "../../../models/Asesmen";
import HasilAsesmen from "../../../models/HasilAsesmen";
import PengumpulanTugas from "../../../models/Pengumpulan";
import Tugas from "../../../models/Tugas";

function bersihkan(value: FormDataEntryValue | null): string {
  return String(value || "").trim();
}

export async function nilaiPengumpulanTugas(formData: FormData) {
  try {
    const session = await getSession();

    if (!session || session.role !== "guru") {
      return {
        success: false,
        message: "Akses ditolak. Penilaian hanya dapat dilakukan oleh guru.",
      };
    }

    const pengumpulanId = bersihkan(formData.get("pengumpulanId"));
    const metodeInput = bersihkan(formData.get("metode"));

    if (
      !pengumpulanId ||
      (metodeInput !== "otomatis" && metodeInput !== "manual")
    ) {
      return {
        success: false,
        message: "Data penilaian tidak valid.",
      };
    }

    const metode = metodeInput;

    await connectDB();

    const pengumpulan = await PengumpulanTugas.findById(pengumpulanId);

    if (!pengumpulan) {
      return {
        success: false,
        message: "Pengumpulan tugas tidak ditemukan.",
      };
    }

    const tugas = await Tugas.findOne({
      _id: pengumpulan.tugasId,
      guru: session.nama,
    }).lean();

    if (!tugas) {
      return {
        success: false,
        message: "Tugas tidak ditemukan atau bukan milik Anda.",
      };
    }

    let nilai: number;

    if (metode === "otomatis") {
      const soalDenganKunci = (tugas.soal || []).flatMap(
        (soal, index) =>
          soal.kunciJawaban.trim().length > 0 ? [{ soal, index }] : []
      );

      if (soalDenganKunci.length === 0) {
        return {
          success: false,
          message:
            "Tugas ini tidak memiliki kunci jawaban untuk penilaian otomatis.",
        };
      }

      const benar = soalDenganKunci.filter(({ soal, index }) => {
        const jawabanSiswa = pengumpulan.jawaban[index];

        return (
          jawabanSiswa?.pertanyaan === soal.pertanyaan &&
          jawabanSiswa.jawaban.trim().toLocaleLowerCase("id-ID") ===
            soal.kunciJawaban.trim().toLocaleLowerCase("id-ID")
        );
      }).length;

      nilai = Math.round((benar / soalDenganKunci.length) * 100);
    } else {
      const nilaiRaw = bersihkan(formData.get("nilai"));
      const nilaiInput = nilaiRaw ? Number(nilaiRaw) : Number.NaN;

      if (!Number.isFinite(nilaiInput) || nilaiInput < 0 || nilaiInput > 100) {
        return {
          success: false,
          message: "Nilai manual harus berupa angka antara 0 dan 100.",
        };
      }

      nilai = nilaiInput;
    }

    pengumpulan.nilai = nilai;
    pengumpulan.dinilai = true;
    pengumpulan.metodePenilaian = metode;
    pengumpulan.umpanBalik = bersihkan(formData.get("umpanBalik"));
    await pengumpulan.save();

    revalidatePath("/guru/nilai");
    revalidatePath("/siswa/nilai");
    revalidatePath("/siswa/tugas");
    revalidatePath("/siswa/dashboard");

    return {
      success: true,
      message:
        metode === "otomatis"
          ? `Nilai otomatis ${nilai} berhasil diberikan kepada ${pengumpulan.namaSiswa}.`
          : `Nilai ${nilai} berhasil diberikan kepada ${pengumpulan.namaSiswa}.`,
    };
  } catch (error) {
    console.error("NILAI PENGUMPULAN TUGAS ERROR:", error);

    return {
      success: false,
      message: "Gagal menyimpan penilaian tugas.",
    };
  }
}

export async function nilaiHasilAsesmen(formData: FormData) {
  try {
    const session = await getSession();

    if (!session || session.role !== "guru") {
      return {
        success: false,
        message: "Akses ditolak. Penilaian asesmen hanya dapat dilakukan guru.",
      };
    }

    const hasilId = bersihkan(formData.get("hasilId"));
    const nilaiRaw = bersihkan(formData.get("nilai"));
    const nilai = nilaiRaw ? Number(nilaiRaw) : Number.NaN;

    if (!hasilId || !Number.isFinite(nilai) || nilai < 0 || nilai > 100) {
      return {
        success: false,
        message: "Nilai asesmen harus berupa angka antara 0 dan 100.",
      };
    }

    await connectDB();

    const hasil = await HasilAsesmen.findById(hasilId);

    if (!hasil) {
      return {
        success: false,
        message: "Hasil asesmen tidak ditemukan.",
      };
    }

    const asesmen = await Asesmen.findOne({
      _id: hasil.asesmenId,
      guru: session.nama,
    }).lean();

    if (!asesmen) {
      return {
        success: false,
        message: "Asesmen tidak ditemukan atau bukan milik Anda.",
      };
    }

    hasil.skor = nilai;
    hasil.dinilai = true;
    hasil.umpanBalik = bersihkan(formData.get("umpanBalik"));
    await hasil.save();

    revalidatePath("/guru/nilai");
    revalidatePath("/siswa/asesment");

    return {
      success: true,
      message: `Nilai asesmen ${nilai} berhasil diberikan kepada ${hasil.namaSiswa}.`,
    };
  } catch (error) {
    console.error("NILAI HASIL ASESMEN ERROR:", error);

    return {
      success: false,
      message: "Gagal menyimpan nilai asesmen.",
    };
  }
}
