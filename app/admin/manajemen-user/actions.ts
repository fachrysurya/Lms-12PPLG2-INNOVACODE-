"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";

type UserRole =
  | "admin"
  | "guru"
  | "siswa"
  | "kurikulum"
  | "kepala-sekolah";

export async function createUser(formData: FormData) {
  try {
    await connectDB();

    const nama = String(formData.get("nama") || "").trim();
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");
    const email = String(formData.get("email") || "").trim();
    const role = String(formData.get("role") || "") as UserRole;

    if (!nama || !username || !password || !role) {
      return {
        success: false,
        message: "Data wajib diisi.",
      };
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return {
        success: false,
        message: "Username sudah digunakan.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      nama,
      username,
      password: hashedPassword,
      email: email || undefined,
      role,
      aktif: true,
    });

    revalidatePath("/admin/manajemen-user");

    return {
      success: true,
      message: "User berhasil ditambahkan.",
    };
  } catch (error) {
    console.error("CREATE USER ERROR:", error);

    return {
      success: false,
      message: "Gagal menambahkan user.",
    };
  }
}

export async function updateUser(formData: FormData) {
  try {
    await connectDB();

    const id = String(formData.get("id") || "");
    const nama = String(formData.get("nama") || "").trim();
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");
    const email = String(formData.get("email") || "").trim();
    const role = String(formData.get("role") || "") as UserRole;

    if (!id || !nama || !username || !role) {
      return {
        success: false,
        message: "Data wajib diisi.",
      };
    }

    const existingUser = await User.findOne({
      username,
      _id: { $ne: id },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Username sudah digunakan.",
      };
    }

    const updateData: {
      nama: string;
      username: string;
      email?: string;
      role: UserRole;
      password?: string;
    } = {
      nama,
      username,
      email: email || undefined,
      role,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return {
        success: false,
        message: "User tidak ditemukan.",
      };
    }

    revalidatePath("/admin/manajemen-user");

    return {
      success: true,
      message: "User berhasil diperbarui.",
    };
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    return {
      success: false,
      message: "Gagal memperbarui user.",
    };
  }
}

export async function deleteUser(formData: FormData) {
  try {
    await connectDB();

    const id = String(formData.get("id") || "");

    if (!id) {
      return {
        success: false,
        message: "ID user tidak ditemukan.",
      };
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return {
        success: false,
        message: "User tidak ditemukan.",
      };
    }

    revalidatePath("/admin/manajemen-user");

    return {
      success: true,
      message: "User berhasil dihapus.",
    };
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return {
      success: false,
      message: "Gagal menghapus user.",
    };
  }
}