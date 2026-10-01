"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../../../lib/mongodb";
import MataPelajaran from "../../../models/MataPelajaran";

type MataPelajaranData = {
  namaMapel: string;
  kodeMapel: string;
  kelompok: string;
  guruPengampu: string;
};

export async function createMataPelajaran(
  formData: FormData
) {
  try {
    await connectDB();

    const namaMapel = String(
      formData.get("namaMapel") || ""
    ).trim();

    const kodeMapel = String(
      formData.get("kodeMapel") || ""
    )
      .trim()
      .toUpperCase();

    const kelompok = String(
      formData.get("kelompok") || ""
    ).trim();

    const guruPengampu = String(
      formData.get("guruPengampu") || ""
    ).trim();

    if (
      !namaMapel ||
      !kodeMapel ||
      !kelompok ||
      !guruPengampu
    ) {
      return {
        success: false,
        message: "Semua data wajib diisi.",
      };
    }

    const existingMapel =
      await MataPelajaran.findOne({
        $or: [
          { namaMapel },
          { kodeMapel },
        ],
      });

    if (existingMapel) {
      return {
        success: false,
        message:
          "Nama atau kode mata pelajaran sudah digunakan.",
      };
    }

    await MataPelajaran.create({
      namaMapel,
      kodeMapel,
      kelompok,
      guruPengampu,
      aktif: true,
    });

    revalidatePath("/admin/mata-pelajaran");

    return {
      success: true,
      message:
        "Mata pelajaran berhasil ditambahkan.",
    };
  } catch (error) {
    console.error(
      "CREATE MATA PELAJARAN ERROR:",
      error
    );

    return {
      success: false,
      message:
        "Gagal menambahkan mata pelajaran.",
    };
  }
}

export async function updateMataPelajaran(
  formData: FormData
) {
  try {
    await connectDB();

    const id = String(
      formData.get("id") || ""
    );

    const namaMapel = String(
      formData.get("namaMapel") || ""
    ).trim();

    const kodeMapel = String(
      formData.get("kodeMapel") || ""
    )
      .trim()
      .toUpperCase();

    const kelompok = String(
      formData.get("kelompok") || ""
    ).trim();

    const guruPengampu = String(
      formData.get("guruPengampu") || ""
    ).trim();

    if (
      !id ||
      !namaMapel ||
      !kodeMapel ||
      !kelompok ||
      !guruPengampu
    ) {
      return {
        success: false,
        message: "Semua data wajib diisi.",
      };
    }

    const existingMapel =
      await MataPelajaran.findOne({
        $or: [
          { namaMapel },
          { kodeMapel },
        ],
        _id: {
          $ne: id,
        },
      });

    if (existingMapel) {
      return {
        success: false,
        message:
          "Nama atau kode mata pelajaran sudah digunakan.",
      };
    }

    const updateData: MataPelajaranData = {
      namaMapel,
      kodeMapel,
      kelompok,
      guruPengampu,
    };

    const updatedMapel =
      await MataPelajaran.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
        }
      );

    if (!updatedMapel) {
      return {
        success: false,
        message:
          "Mata pelajaran tidak ditemukan.",
      };
    }

    revalidatePath("/admin/mata-pelajaran");

    return {
      success: true,
      message:
        "Mata pelajaran berhasil diperbarui.",
    };
  } catch (error) {
    console.error(
      "UPDATE MATA PELAJARAN ERROR:",
      error
    );

    return {
      success: false,
      message:
        "Gagal memperbarui mata pelajaran.",
    };
  }
}

export async function deleteMataPelajaran(
  formData: FormData
) {
  try {
    await connectDB();

    const id = String(
      formData.get("id") || ""
    );

    if (!id) {
      return {
        success: false,
        message:
          "ID mata pelajaran tidak ditemukan.",
      };
    }

    const deletedMapel =
      await MataPelajaran.findByIdAndDelete(id);

    if (!deletedMapel) {
      return {
        success: false,
        message:
          "Mata pelajaran tidak ditemukan.",
      };
    }

    revalidatePath("/admin/mata-pelajaran");

    return {
      success: true,
      message:
        "Mata pelajaran berhasil dihapus.",
    };
  } catch (error) {
    console.error(
      "DELETE MATA PELAJARAN ERROR:",
      error
    );

    return {
      success: false,
      message:
        "Gagal menghapus mata pelajaran.",
    };
  }
}