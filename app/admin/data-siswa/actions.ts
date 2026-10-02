"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../../../lib/mongodb";
import Siswa from "../../../models/Siswa";

type SiswaData = {
  nama: string;
  nis: string;
  jenisKelamin: string;
  kelas: string;
  email?: string;
  noTelepon?: string;
};

export async function createSiswa(formData: FormData) {
  try {
    await connectDB();

    const nama = String(
      formData.get("nama") || ""
    ).trim();

    const nis = String(
      formData.get("nis") || ""
    ).trim();

    const jenisKelamin = String(
      formData.get("jenisKelamin") || ""
    ).trim();

    const kelas = String(
      formData.get("kelas") || ""
    ).trim();

    const email = String(
      formData.get("email") || ""
    )
      .trim()
      .toLowerCase();

    const noTelepon = String(
      formData.get("noTelepon") || ""
    ).trim();

    if (!nama || !nis || !jenisKelamin || !kelas) {
      return {
        success: false,
        message: "Semua data wajib diisi.",
      };
    }

    const existingSiswa = await Siswa.findOne({ nis });

    if (existingSiswa) {
      return {
        success: false,
        message: "NIS sudah digunakan.",
      };
    }

    await Siswa.create({
      nama,
      nis,
      jenisKelamin,
      kelas,
      email: email || undefined,
      noTelepon,
      aktif: true,
    });

    revalidatePath("/admin/data-siswa");

    return {
      success: true,
      message: "Data siswa berhasil ditambahkan.",
    };
  } catch (error) {
    console.error("CREATE SISWA ERROR:", error);

    return {
      success: false,
      message: "Gagal menambahkan data siswa.",
    };
  }
}

export async function updateSiswa(formData: FormData) {
  try {
    await connectDB();

    const id = String(
      formData.get("id") || ""
    );

    const nama = String(
      formData.get("nama") || ""
    ).trim();

    const nis = String(
      formData.get("nis") || ""
    ).trim();

    const jenisKelamin = String(
      formData.get("jenisKelamin") || ""
    ).trim();

    const kelas = String(
      formData.get("kelas") || ""
    ).trim();

    const email = String(
      formData.get("email") || ""
    )
      .trim()
      .toLowerCase();

    const noTelepon = String(
      formData.get("noTelepon") || ""
    ).trim();

    if (
      !id ||
      !nama ||
      !nis ||
      !jenisKelamin ||
      !kelas
    ) {
      return {
        success: false,
        message: "Semua data wajib diisi.",
      };
    }

    const existingSiswa = await Siswa.findOne({
      nis,
      _id: { $ne: id },
    });

    if (existingSiswa) {
      return {
        success: false,
        message: "NIS sudah digunakan.",
      };
    }

    const updateData: SiswaData = {
      nama,
      nis,
      jenisKelamin,
      kelas,
      email: email || undefined,
      noTelepon,
    };

    const updatedSiswa = await Siswa.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedSiswa) {
      return {
        success: false,
        message: "Data siswa tidak ditemukan.",
      };
    }

    revalidatePath("/admin/data-siswa");

    return {
      success: true,
      message: "Data siswa berhasil diperbarui.",
    };
  } catch (error) {
    console.error("UPDATE SISWA ERROR:", error);

    return {
      success: false,
      message: "Gagal memperbarui data siswa.",
    };
  }
}

export async function deleteSiswa(formData: FormData) {
  try {
    await connectDB();

    const id = String(
      formData.get("id") || ""
    );

    if (!id) {
      return {
        success: false,
        message: "ID siswa tidak ditemukan.",
      };
    }

    const deletedSiswa = await Siswa.findByIdAndDelete(id);

    if (!deletedSiswa) {
      return {
        success: false,
        message: "Data siswa tidak ditemukan.",
      };
    }

    revalidatePath("/admin/data-siswa");

    return {
      success: true,
      message: "Data siswa berhasil dihapus.",
    };
  } catch (error) {
    console.error("DELETE SISWA ERROR:", error);

    return {
      success: false,
      message: "Gagal menghapus data siswa.",
    };
  }
}
