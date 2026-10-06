"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../../../lib/mongodb";
import Asesmen, {
  JenisAsesmen,
  ISoalAsesmen,
} from "../../../models/Asesmen";
import { getSession } from "../../../lib/auth";

function bersihkan(value: FormDataEntryValue | null): string {
  return String(value || "").trim();
}

function validJenis(value: string): JenisAsesmen {
  return value === "pg" ? "pg" : "esai";
}

function parseSoal(raw: string): ISoalAsesmen[] {
  if (!raw) {
    return [];
  }

  try {
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map((item) => {
        const opsi = Array.isArray(item?.opsi)
          ? item.opsi
              .map((o: unknown) => String(o || "").trim())
              .filter(Boolean)
          : [];

        const jawabanBenar = Number(item?.jawabanBenar);

        return {
          pertanyaan: String(item?.pertanyaan || "").trim(),
          opsi,
          jawabanBenar: Number.isInteger(jawabanBenar)
            ? jawabanBenar
            : -1,
          kunciJawaban: String(
            item?.kunciJawaban || ""
          ).trim(),
        };
      })
      .filter((item) => item.pertanyaan);
  } catch {
    return [];
  }
}

export async function createAsesmen(formData: FormData) {
  try {
    await connectDB();

    const session = await getSession();

    const judul = bersihkan(formData.get("judul"));
    const deskripsi = bersihkan(formData.get("deskripsi"));
    const mataPelajaran = bersihkan(
      formData.get("mataPelajaran")
    );
    const kelas = bersihkan(formData.get("kelas"));
    const jenis = validJenis(bersihkan(formData.get("jenis")));

    const durasi = Number(formData.get("durasi") || 60);
    const poin = Number(formData.get("poin") || 100);

    const soal = parseSoal(bersihkan(formData.get("soal")));

    if (!judul || !mataPelajaran || !kelas) {
      return {
        success: false,
        message: "Judul, mata pelajaran, dan kelas wajib diisi.",
      };
    }

    if (soal.length === 0) {
      return {
        success: false,
        message: "Minimal harus ada satu soal.",
      };
    }

    if (jenis === "pg") {
      const pgKurangOpsi = soal.some(
        (s) => s.opsi.length < 2 || s.jawabanBenar < 0
      );

      if (pgKurangOpsi) {
        return {
          success: false,
          message:
            "Setiap soal pilihan ganda wajib punya minimal 2 opsi dan satu jawaban benar.",
        };
      }
    }

    await Asesmen.create({
      judul,
      deskripsi,
      mataPelajaran,
      kelas,
      jenis,
      durasi: Number.isFinite(durasi) ? durasi : 60,
      poin: Number.isFinite(poin) ? poin : 100,
      soal,
      guru: session?.nama || "",
      aktif: true,
    });

    revalidatePath("/guru/asesmen");

    return {
      success: true,
      message: "Asesmen berhasil ditambahkan.",
    };
  } catch (error) {
    console.error("CREATE ASESMEN ERROR:", error);

    return {
      success: false,
      message: "Gagal menambahkan asesmen.",
    };
  }
}

export async function updateAsesmen(formData: FormData) {
  try {
    await connectDB();

    const id = bersihkan(formData.get("id"));

    const judul = bersihkan(formData.get("judul"));
    const deskripsi = bersihkan(formData.get("deskripsi"));
    const mataPelajaran = bersihkan(
      formData.get("mataPelajaran")
    );
    const kelas = bersihkan(formData.get("kelas"));
    const jenis = validJenis(bersihkan(formData.get("jenis")));

    const durasi = Number(formData.get("durasi") || 60);
    const poin = Number(formData.get("poin") || 100);

    const soal = parseSoal(bersihkan(formData.get("soal")));

    if (!id) {
      return {
        success: false,
        message: "ID asesmen tidak ditemukan.",
      };
    }

    if (!judul || !mataPelajaran || !kelas) {
      return {
        success: false,
        message: "Judul, mata pelajaran, dan kelas wajib diisi.",
      };
    }

    if (soal.length === 0) {
      return {
        success: false,
        message: "Minimal harus ada satu soal.",
      };
    }

    if (jenis === "pg") {
      const pgKurangOpsi = soal.some(
        (s) => s.opsi.length < 2 || s.jawabanBenar < 0
      );

      if (pgKurangOpsi) {
        return {
          success: false,
          message:
            "Setiap soal pilihan ganda wajib punya minimal 2 opsi dan satu jawaban benar.",
        };
      }
    }

    const updated = await Asesmen.findByIdAndUpdate(
      id,
      {
        judul,
        deskripsi,
        mataPelajaran,
        kelas,
        jenis,
        durasi: Number.isFinite(durasi) ? durasi : 60,
        poin: Number.isFinite(poin) ? poin : 100,
        soal,
      },
      { new: true }
    );

    if (!updated) {
      return {
        success: false,
        message: "Asesmen tidak ditemukan.",
      };
    }

    revalidatePath("/guru/asesmen");

    return {
      success: true,
      message: "Asesmen berhasil diperbarui.",
    };
  } catch (error) {
    console.error("UPDATE ASESMEN ERROR:", error);

    return {
      success: false,
      message: "Gagal memperbarui asesmen.",
    };
  }
}

export async function deleteAsesmen(formData: FormData) {
  try {
    await connectDB();

    const id = bersihkan(formData.get("id"));

    if (!id) {
      return {
        success: false,
        message: "ID asesmen tidak ditemukan.",
      };
    }

    const deleted = await Asesmen.findByIdAndDelete(id);

    if (!deleted) {
      return {
        success: false,
        message: "Asesmen tidak ditemukan.",
      };
    }

    revalidatePath("/guru/asesmen");

    return {
      success: true,
      message: "Asesmen berhasil dihapus.",
    };
  } catch (error) {
    console.error("DELETE ASESMEN ERROR:", error);

    return {
      success: false,
      message: "Gagal menghapus asesmen.",
    };
  }
}