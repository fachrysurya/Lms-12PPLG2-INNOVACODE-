"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../../../lib/mongodb";
import Guru from "../../../models/Guru";

type GuruData = {
  nama: string;
  nip: string;
  email: string;
  noTelepon: string;
  mataPelajaran: string;
};

export async function createGuru(formData: FormData) {
  try {
    await connectDB();

    const nama = String(
      formData.get("nama") || ""
    ).trim();

    const nip = String(
      formData.get("nip") || ""
    ).trim();

    const email = String(
      formData.get("email") || ""
    )
      .trim()
      .toLowerCase();

    const noTelepon = String(
      formData.get("noTelepon") || ""
    ).trim();

    const mataPelajaran = String(
      formData.get("mataPelajaran") || ""
    ).trim();

    if (
      !nama ||
      !nip ||
      !email ||
      !noTelepon ||
      !mataPelajaran
    ) {
      return {
        success: false,
        message: "Semua data wajib diisi.",
      };
    }

    const existingGuru = await Guru.findOne({
      $or: [{ nip }, { email }],
    });

    if (existingGuru) {
      return {
        success: false,
        message: "NIP atau email guru sudah digunakan.",
      };
    }

    await Guru.create({
      nama,
      nip,
      email,
      noTelepon,
      mataPelajaran,
      aktif: true,
    });

    revalidatePath("/admin/data-guru");

    return {
      success: true,
      message: "Data guru berhasil ditambahkan.",
    };
  } catch (error) {
    console.error("CREATE GURU ERROR:", error);

    return {
      success: false,
      message: "Gagal menambahkan data guru.",
    };
  }
}

export async function updateGuru(formData: FormData) {
  try {
    await connectDB();

    const id = String(
      formData.get("id") || ""
    );

    const nama = String(
      formData.get("nama") || ""
    ).trim();

    const nip = String(
      formData.get("nip") || ""
    ).trim();

    const email = String(
      formData.get("email") || ""
    )
      .trim()
      .toLowerCase();

    const noTelepon = String(
      formData.get("noTelepon") || ""
    ).trim();

    const mataPelajaran = String(
      formData.get("mataPelajaran") || ""
    ).trim();

    if (
      !id ||
      !nama ||
      !nip ||
      !email ||
      !noTelepon ||
      !mataPelajaran
    ) {
      return {
        success: false,
        message: "Semua data wajib diisi.",
      };
    }

    const existingGuru = await Guru.findOne({
      $or: [{ nip }, { email }],
      _id: { $ne: id },
    });

    if (existingGuru) {
      return {
        success: false,
        message: "NIP atau email guru sudah digunakan.",
      };
    }

    const updateData: GuruData = {
      nama,
      nip,
      email,
      noTelepon,
      mataPelajaran,
    };

    const updatedGuru =
      await Guru.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
        }
      );

    if (!updatedGuru) {
      return {
        success: false,
        message: "Data guru tidak ditemukan.",
      };
    }

    revalidatePath("/admin/data-guru");

    return {
      success: true,
      message: "Data guru berhasil diperbarui.",
    };
  } catch (error) {
    console.error("UPDATE GURU ERROR:", error);

    return {
      success: false,
      message: "Gagal memperbarui data guru.",
    };
  }
}

export async function deleteGuru(formData: FormData) {
  try {
    await connectDB();

    const id = String(
      formData.get("id") || ""
    );

    if (!id) {
      return {
        success: false,
        message: "ID guru tidak ditemukan.",
      };
    }

    const deletedGuru =
      await Guru.findByIdAndDelete(id);

    if (!deletedGuru) {
      return {
        success: false,
        message: "Data guru tidak ditemukan.",
      };
    }

    revalidatePath("/admin/data-guru");

    return {
      success: true,
      message: "Data guru berhasil dihapus.",
    };
  } catch (error) {
    console.error("DELETE GURU ERROR:", error);

    return {
      success: false,
      message: "Gagal menghapus data guru.",
    };
  }
}