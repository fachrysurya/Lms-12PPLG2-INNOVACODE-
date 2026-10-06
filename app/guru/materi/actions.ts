"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../../../lib/mongodb";
import Materi, { TipeMateri } from "../../../models/Materi";
import { getSession } from "../../../lib/auth";

function bersihkan(value: FormDataEntryValue | null): string {
  return String(value || "").trim();
}

function validTipe(value: string): TipeMateri {
  if (value === "pdf" || value === "youtube" || value === "teks") {
    return value;
  }

  return "teks";
}

export async function createMateri(formData: FormData) {
  try {
    await connectDB();

    const session = await getSession();

    const judul = bersihkan(formData.get("judul"));
    const deskripsi = bersihkan(formData.get("deskripsi"));
    const mataPelajaran = bersihkan(
      formData.get("mataPelajaran")
    );
    const kelas = bersihkan(formData.get("kelas"));
    const tipe = validTipe(bersihkan(formData.get("tipe")));

    const pdfUrl = bersihkan(formData.get("pdfUrl"));
    const pdfNama = bersihkan(formData.get("pdfNama"));
    const youtubeUrl = bersihkan(
      formData.get("youtubeUrl")
    );
    const konten = bersihkan(formData.get("konten"));

    if (!judul || !mataPelajaran || !kelas) {
      return {
        success: false,
        message: "Judul, mata pelajaran, dan kelas wajib diisi.",
      };
    }

    if (tipe === "pdf" && !pdfUrl) {
      return {
        success: false,
        message: "File PDF wajib diunggah untuk materi bertipe PDF.",
      };
    }

    if (tipe === "youtube" && !youtubeUrl) {
      return {
        success: false,
        message: "Link YouTube wajib diisi.",
      };
    }

    if (tipe === "teks" && !konten) {
      return {
        success: false,
        message: "Isi materi teks wajib diisi.",
      };
    }

    await Materi.create({
      judul,
      deskripsi,
      mataPelajaran,
      kelas,
      tipe,
      pdfUrl: pdfUrl || undefined,
      pdfNama: pdfNama || undefined,
      youtubeUrl: youtubeUrl || undefined,
      konten,
      guru: session?.nama || "",
      aktif: true,
    });

    revalidatePath("/guru/materi");

    return {
      success: true,
      message: "Materi berhasil ditambahkan.",
    };
  } catch (error) {
    console.error("CREATE MATERI ERROR:", error);

    return {
      success: false,
      message: "Gagal menambahkan materi.",
    };
  }
}

export async function updateMateri(formData: FormData) {
  try {
    await connectDB();

    const id = bersihkan(formData.get("id"));

    const judul = bersihkan(formData.get("judul"));
    const deskripsi = bersihkan(formData.get("deskripsi"));
    const mataPelajaran = bersihkan(
      formData.get("mataPelajaran")
    );
    const kelas = bersihkan(formData.get("kelas"));
    const tipe = validTipe(bersihkan(formData.get("tipe")));

    const pdfUrl = bersihkan(formData.get("pdfUrl"));
    const pdfNama = bersihkan(formData.get("pdfNama"));
    const youtubeUrl = bersihkan(
      formData.get("youtubeUrl")
    );
    const konten = bersihkan(formData.get("konten"));

    if (!id) {
      return {
        success: false,
        message: "ID materi tidak ditemukan.",
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
      tipe,
      youtubeUrl: youtubeUrl || undefined,
      konten,
    };

    // Hanya timpa PDF bila ada file baru
    if (pdfUrl) {
      updateData.pdfUrl = pdfUrl;
      updateData.pdfNama = pdfNama || undefined;
    }

    const updated = await Materi.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return {
        success: false,
        message: "Materi tidak ditemukan.",
      };
    }

    revalidatePath("/guru/materi");

    return {
      success: true,
      message: "Materi berhasil diperbarui.",
    };
  } catch (error) {
    console.error("UPDATE MATERI ERROR:", error);

    return {
      success: false,
      message: "Gagal memperbarui materi.",
    };
  }
}

export async function deleteMateri(formData: FormData) {
  try {
    await connectDB();

    const id = bersihkan(formData.get("id"));

    if (!id) {
      return {
        success: false,
        message: "ID materi tidak ditemukan.",
      };
    }

    const deleted = await Materi.findByIdAndDelete(id);

    if (!deleted) {
      return {
        success: false,
        message: "Materi tidak ditemukan.",
      };
    }

    revalidatePath("/guru/materi");

    return {
      success: true,
      message: "Materi berhasil dihapus.",
    };
  } catch (error) {
    console.error("DELETE MATERI ERROR:", error);

    return {
      success: false,
      message: "Gagal menghapus materi.",
    };
  }
}