"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../../../lib/mongodb";
import Kelas from "../../../models/Kelas";

export async function createKelas(formData: FormData) {
  try {
    await connectDB();

    const namaKelas = String(
      formData.get("namaKelas") || ""
    ).trim();

    const tingkat = String(
      formData.get("tingkat") || ""
    ).trim();

    const jurusan = String(
      formData.get("jurusan") || ""
    ).trim();

    const waliKelas = String(
      formData.get("waliKelas") || ""
    ).trim();

    if (
      !namaKelas ||
      !tingkat ||
      !jurusan ||
      !waliKelas
    ) {
      return {
        success: false,
        message: "Semua data wajib diisi.",
      };
    }

    const existingKelas = await Kelas.findOne({
      namaKelas,
    });

    if (existingKelas) {
      return {
        success: false,
        message: "Nama kelas sudah digunakan.",
      };
    }

    await Kelas.create({
      namaKelas,
      tingkat,
      jurusan,
      waliKelas,
      aktif: true,
    });

    revalidatePath("/admin/manajemen-kelas");

    return {
      success: true,
      message: "Kelas berhasil ditambahkan.",
    };
  } catch (error) {
    console.error("CREATE KELAS ERROR:", error);

    return {
      success: false,
      message: "Gagal menambahkan kelas.",
    };
  }
}

export async function updateKelas(formData: FormData) {
  try {
    await connectDB();

    const id = String(
      formData.get("id") || ""
    );

    const namaKelas = String(
      formData.get("namaKelas") || ""
    ).trim();

    const tingkat = String(
      formData.get("tingkat") || ""
    ).trim();

    const jurusan = String(
      formData.get("jurusan") || ""
    ).trim();

    const waliKelas = String(
      formData.get("waliKelas") || ""
    ).trim();

    if (
      !id ||
      !namaKelas ||
      !tingkat ||
      !jurusan ||
      !waliKelas
    ) {
      return {
        success: false,
        message: "Semua data wajib diisi.",
      };
    }

    const existingKelas = await Kelas.findOne({
      namaKelas,
      _id: { $ne: id },
    });

    if (existingKelas) {
      return {
        success: false,
        message: "Nama kelas sudah digunakan.",
      };
    }

    const updatedKelas =
      await Kelas.findByIdAndUpdate(
        id,
        {
          namaKelas,
          tingkat,
          jurusan,
          waliKelas,
        },
        {
          new: true,
        }
      );

    if (!updatedKelas) {
      return {
        success: false,
        message: "Data kelas tidak ditemukan.",
      };
    }

    revalidatePath("/admin/manajemen-kelas");

    return {
      success: true,
      message: "Kelas berhasil diperbarui.",
    };
  } catch (error) {
    console.error("UPDATE KELAS ERROR:", error);

    return {
      success: false,
      message: "Gagal memperbarui kelas.",
    };
  }
}

export async function deleteKelas(formData: FormData) {
  try {
    await connectDB();

    const id = String(
      formData.get("id") || ""
    );

    if (!id) {
      return {
        success: false,
        message: "ID kelas tidak ditemukan.",
      };
    }

    const deletedKelas =
      await Kelas.findByIdAndDelete(id);

    if (!deletedKelas) {
      return {
        success: false,
        message: "Data kelas tidak ditemukan.",
      };
    }

    revalidatePath("/admin/manajemen-kelas");

    return {
      success: true,
      message: "Kelas berhasil dihapus.",
    };
  } catch (error) {
    console.error("DELETE KELAS ERROR:", error);

    return {
      success: false,
      message: "Gagal menghapus kelas.",
    };
  }
}