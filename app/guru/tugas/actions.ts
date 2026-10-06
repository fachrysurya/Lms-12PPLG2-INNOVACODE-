"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../../../lib/mongodb";
import Tugas, {
  JenisTugas,
  ISoalIsian,
} from "../../../models/Tugas";
import { getSession } from "../../../lib/auth";

function bersihkan(value: FormDataEntryValue | null): string {
  return String(value || "").trim();
}

function validJenis(value: string): JenisTugas {
  if (value === "pdf" || value === "link" || value === "teks") {
    return value;
  }

  return "teks";
}

function parseSoal(raw: string): ISoalIsian[] {
  if (!raw) {
    return [];
  }

  try {
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map((item) => ({
        pertanyaan: String(item?.pertanyaan || "").trim(),
        kunciJawaban: String(
          item?.kunciJawaban || ""
        ).trim(),
      }))
      .filter((item) => item.pertanyaan);
  } catch {
    return [];
  }
}

export async function createTugas(formData: FormData) {
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

    const pdfUrl = bersihkan(formData.get("pdfUrl"));
    const pdfNama = bersihkan(formData.get("pdfNama"));
    const linkUrl = bersihkan(formData.get("linkUrl"));
    const konten = bersihkan(formData.get("konten"));
    const tenggat = bersihkan(formData.get("tenggat"));

    const poin = Number(formData.get("poin") || 100);
    const soal = parseSoal(bersihkan(formData.get("soal")));

    if (!judul || !mataPelajaran || !kelas) {
      return {
        success: false,
        message: "Judul, mata pelajaran, dan kelas wajib diisi.",
      };
    }

    if (jenis === "pdf" && !pdfUrl) {
      return {
        success: false,
        message: "File PDF wajib diunggah untuk tugas bertipe PDF.",
      };
    }

    if (jenis === "link" && !linkUrl) {
      return {
        success: false,
        message: "Link wajib diisi untuk tugas bertipe link.",
      };
    }

    await Tugas.create({
      judul,
      deskripsi,
      mataPelajaran,
      kelas,
      jenis,
      pdfUrl: pdfUrl || undefined,
      pdfNama: pdfNama || undefined,
      linkUrl: linkUrl || undefined,
      konten,
      tenggat,
      poin: Number.isFinite(poin) ? poin : 100,
      soal,
      guru: session?.nama || "",
      aktif: true,
    });

    revalidatePath("/guru/tugas");

    return {
      success: true,
      message: "Tugas berhasil ditambahkan.",
    };
  } catch (error) {
    console.error("CREATE TUGAS ERROR:", error);

    return {
      success: false,
      message: "Gagal menambahkan tugas.",
    };
  }
}

export async function updateTugas(formData: FormData) {
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

    const pdfUrl = bersihkan(formData.get("pdfUrl"));
    const pdfNama = bersihkan(formData.get("pdfNama"));
    const linkUrl = bersihkan(formData.get("linkUrl"));
    const konten = bersihkan(formData.get("konten"));
    const tenggat = bersihkan(formData.get("tenggat"));

    const poin = Number(formData.get("poin") || 100);
    const soal = parseSoal(bersihkan(formData.get("soal")));

    if (!id) {
      return {
        success: false,
        message: "ID tugas tidak ditemukan.",
      };
    }

    if (!judul || !mataPelajaran || !kelas) {
      return {
        success: false,
        message: "Judul, mata pelajaran, dan kelas wajib diisi.",
      };
    }

    const updateData: Record<string, unknown> = {
      judul,
      deskripsi,
      mataPelajaran,
      kelas,
      jenis,
      linkUrl: linkUrl || undefined,
      konten,
      tenggat,
      poin: Number.isFinite(poin) ? poin : 100,
      soal,
    };

    if (pdfUrl) {
      updateData.pdfUrl = pdfUrl;
      updateData.pdfNama = pdfNama || undefined;
    }

    const updated = await Tugas.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return {
        success: false,
        message: "Tugas tidak ditemukan.",
      };
    }

    revalidatePath("/guru/tugas");

    return {
      success: true,
      message: "Tugas berhasil diperbarui.",
    };
  } catch (error) {
    console.error("UPDATE TUGAS ERROR:", error);

    return {
      success: false,
      message: "Gagal memperbarui tugas.",
    };
  }
}

export async function deleteTugas(formData: FormData) {
  try {
    await connectDB();

    const id = bersihkan(formData.get("id"));

    if (!id) {
      return {
        success: false,
        message: "ID tugas tidak ditemukan.",
      };
    }

    const deleted = await Tugas.findByIdAndDelete(id);

    if (!deleted) {
      return {
        success: false,
        message: "Tugas tidak ditemukan.",
      };
    }

    revalidatePath("/guru/tugas");

    return {
      success: true,
      message: "Tugas berhasil dihapus.",
    };
  } catch (error) {
    console.error("DELETE TUGAS ERROR:", error);

    return {
      success: false,
      message: "Gagal menghapus tugas.",
    };
  }
}