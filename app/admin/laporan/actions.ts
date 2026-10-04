"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../../../lib/mongodb";
import Laporan from "../../../models/Laporan";

export type RingkasanSekolah = {
  totalSiswa: number;
  totalGuru: number;
  totalKelas: number;
  totalMapel: number;
  totalUser: number;
};

type LaporanData = {
  judul: string;
  jenis: string;
  periode: string;
  deskripsi: string;
};

export async function createLaporan(formData: FormData) {
  try {
    await connectDB();

    const judul = String(
      formData.get("judul") || ""
    ).trim();

    const jenis = String(
      formData.get("jenis") || ""
    ).trim();

    const periode = String(
      formData.get("periode") || ""
    ).trim();

    const deskripsi = String(
      formData.get("deskripsi") || ""
    ).trim();

    const dibuatOleh =
      String(formData.get("dibuatOleh") || "").trim() ||
      "Administrator";

    if (!judul || !jenis || !periode) {
      return {
        success: false,
        message:
          "Judul, jenis, dan periode wajib diisi.",
      };
    }

    await Laporan.create({
      judul,
      jenis,
      periode,
      deskripsi,
      dibuatOleh,
      aktif: true,
    });

    revalidatePath("/admin/laporan");

    return {
      success: true,
      message: "Laporan berhasil dibuat.",
    };
  } catch (error) {
    console.error("CREATE LAPORAN ERROR:", error);

    return {
      success: false,
      message: "Gagal membuat laporan.",
    };
  }
}

export async function updateLaporan(formData: FormData) {
  try {
    await connectDB();

    const id = String(formData.get("id") || "");

    const judul = String(
      formData.get("judul") || ""
    ).trim();

    const jenis = String(
      formData.get("jenis") || ""
    ).trim();

    const periode = String(
      formData.get("periode") || ""
    ).trim();

    const deskripsi = String(
      formData.get("deskripsi") || ""
    ).trim();

    if (!id || !judul || !jenis || !periode) {
      return {
        success: false,
        message:
          "Judul, jenis, dan periode wajib diisi.",
      };
    }

    const updateData: LaporanData = {
      judul,
      jenis,
      periode,
      deskripsi,
    };

    const updated = await Laporan.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );

    if (!updated) {
      return {
        success: false,
        message: "Laporan tidak ditemukan.",
      };
    }

    revalidatePath("/admin/laporan");

    return {
      success: true,
      message: "Laporan berhasil diperbarui.",
    };
  } catch (error) {
    console.error("UPDATE LAPORAN ERROR:", error);

    return {
      success: false,
      message: "Gagal memperbarui laporan.",
    };
  }
}

export async function deleteLaporan(formData: FormData) {
  try {
    await connectDB();

    const id = String(formData.get("id") || "");

    if (!id) {
      return {
        success: false,
        message: "ID laporan tidak ditemukan.",
      };
    }

    const deleted = await Laporan.findByIdAndDelete(id);

    if (!deleted) {
      return {
        success: false,
        message: "Laporan tidak ditemukan.",
      };
    }

    revalidatePath("/admin/laporan");

    return {
      success: true,
      message: "Laporan berhasil dihapus.",
    };
  } catch (error) {
    console.error("DELETE LAPORAN ERROR:", error);

    return {
      success: false,
      message: "Gagal menghapus laporan.",
    };
  }
}