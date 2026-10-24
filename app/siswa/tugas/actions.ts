"use server";

import { revalidatePath } from "next/cache";

import { connectDB } from "../../../lib/mongodb";
import Tugas, { ISoalIsian } from "../../../models/Tugas";
import PengumpulanTugas, {
  IJawabanSiswa,
} from "../../../models/Pengumpulan";
import { getSiswaIdentity } from "../../actions/siswaIdentity";

function bersihkan(value: FormDataEntryValue | null): string {
  return String(value || "").trim();
}

type JawabanInput = {
  pertanyaan?: string;
  jawaban?: string;
};

function parseJawaban(raw: string): JawabanInput[] | null {
  if (!raw) {
    return [];
  }

  try {
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      return null;
    }

    return data.map((item) => ({
      pertanyaan: String(item?.pertanyaan || "").trim(),
      jawaban: String(item?.jawaban || "").trim(),
    }));
  } catch {
    return null;
  }
}

/**
 * Siswa mengumpulkan tugas. Bila tugas memiliki soal isian,
 * jawaban siswa dicocokkan dengan kunci untuk penilaian otomatis.
 */
export async function kumpulkanTugas(formData: FormData) {
  try {
    const identitas = await getSiswaIdentity();

    if (!identitas) {
      return {
        success: false,
        message: "Sesi siswa tidak ditemukan, silakan login ulang.",
      };
    }

    await connectDB();

    const tugasId = bersihkan(formData.get("tugasId"));

    if (!tugasId) {
      return {
        success: false,
        message: "ID tugas tidak ditemukan.",
      };
    }

    const tugas = await Tugas.findById(tugasId).lean();

    if (!tugas) {
      return {
        success: false,
        message: "Tugas tidak ditemukan.",
      };
    }

    if (!tugas.aktif || tugas.kelas.trim() !== identitas.kelas.trim()) {
      return {
        success: false,
        message: "Tugas ini tidak tersedia untuk kelas Anda.",
      };
    }

    if (tugas.tenggat) {
      const tenggat = new Date(tugas.tenggat).getTime();
      if (!Number.isFinite(tenggat) || tenggat < Date.now()) {
        return {
          success: false,
          message: "Tenggat tugas sudah lewat. Pengumpulan tidak dapat dilakukan.",
        };
      }
    }

    const pengumpulanSebelumnya = await PengumpulanTugas.findOne({
      tugasId,
      siswaId: identitas.siswaId,
    })
      .select("pdfUrl pdfNama dinilai")
      .lean();

    if (pengumpulanSebelumnya?.dinilai) {
      return {
        success: false,
        message: "Tugas ini sudah dinilai dan tidak dapat diubah lagi.",
      };
    }

    const catatan = bersihkan(formData.get("catatan"));
    const linkJawaban = bersihkan(formData.get("linkJawaban"));
    const pdfUrl = bersihkan(formData.get("pdfUrl"));
    const pdfNama = bersihkan(formData.get("pdfNama"));

    const jawabanInput = parseJawaban(bersihkan(formData.get("jawaban")));

    if (!jawabanInput) {
      return {
        success: false,
        message: "Format jawaban tidak valid. Muat ulang halaman lalu coba lagi.",
      };
    }

    if (tugas.jenis === "link" && !linkJawaban) {
      return {
        success: false,
        message: "Link jawaban wajib diisi.",
      };
    }

    if (tugas.jenis === "link") {
      try {
        const url = new URL(linkJawaban);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          throw new Error("Invalid link protocol");
        }
      } catch {
        return {
          success: false,
          message: "Link jawaban harus berupa URL HTTP atau HTTPS yang valid.",
        };
      }
    }

    if (pdfUrl) {
      const pdfMatch = pdfUrl.match(
        /^data:application\/pdf;base64,([A-Za-z0-9+/]+={0,2})$/
      );
      if (!pdfMatch || Buffer.from(pdfMatch[1], "base64").byteLength > 4 * 1024 * 1024) {
        return {
          success: false,
          message: "File jawaban harus berupa PDF dengan ukuran maksimal 4 MB.",
        };
      }
    }

    const soal: ISoalIsian[] = tugas.soal || [];
    if (
      jawabanInput.length < soal.length ||
      soal.some((_, index) => !jawabanInput[index]?.jawaban?.trim())
    ) {
      return {
        success: false,
        message: "Semua soal tugas wajib dijawab sebelum dikumpulkan.",
      };
    }

    if (
      tugas.jenis === "teks" &&
      soal.length === 0 &&
      !catatan
    ) {
      return {
        success: false,
        message: "Jawaban tugas wajib diisi.",
      };
    }

    if (
      tugas.jenis === "pdf" &&
      !pdfUrl &&
      !catatan &&
      !pengumpulanSebelumnya?.pdfUrl
    ) {
      return {
        success: false,
        message: "Unggah berkas jawaban atau isi catatan terlebih dahulu.",
      };
    }

    // Nilai otomatis dari soal isian (bila ada).
    const jawaban: IJawabanSiswa[] = soal.map((item, index) => {
      const input = jawabanInput[index];
      const teks = input?.jawaban || "";
      const kunci = (item.kunciJawaban || "").trim();

      return {
        pertanyaan: item.pertanyaan,
        jawaban: teks,
        benar:
          kunci.length > 0 &&
          teks.toLowerCase() === kunci.toLowerCase(),
      };
    });

    const totalKunci = soal.filter(
      (item) => (item.kunciJawaban || "").trim().length > 0
    ).length;

    const totalBenar = jawaban.filter((item) => item.benar).length;

    const nilai =
      totalKunci > 0
        ? Math.round((totalBenar / totalKunci) * 100)
        : 0;

    await PengumpulanTugas.findOneAndUpdate(
      { tugasId, siswaId: identitas.siswaId },
      {
        tugasId,
        siswaId: identitas.siswaId,
        namaSiswa: identitas.nama,
        kelas: tugas.kelas || identitas.kelas,
        mataPelajaran: tugas.mataPelajaran,
        jawaban,
        catatan,
        linkJawaban: linkJawaban || undefined,
        pdfUrl: pdfUrl || pengumpulanSebelumnya?.pdfUrl,
        pdfNama: pdfUrl
          ? pdfNama || undefined
          : pengumpulanSebelumnya?.pdfNama,
        dinilai: false,
        nilai,
        umpanBalik: "",
        $unset: {
          metodePenilaian: "",
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    revalidatePath("/siswa/tugas");
    revalidatePath("/siswa/dashboard");

    return {
      success: true,
      message: "Tugas berhasil dikumpulkan.",
      nilai,
    };
  } catch (error) {
    console.error("KUMPULKAN TUGAS ERROR:", error);

    return {
      success: false,
      message: "Gagal mengumpulkan tugas.",
    };
  }
}
