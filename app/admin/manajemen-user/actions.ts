"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { connectDB } from "../../../lib/mongodb";
import Kelas from "../../../models/Kelas";
import User from "../../../models/User";

type UserRole =
  | "admin"
  | "guru"
  | "siswa"
  | "kurikulum"
  | "kepala-sekolah";

const USER_ROLES: UserRole[] = [
  "admin",
  "guru",
  "siswa",
  "kurikulum",
  "kepala-sekolah",
];

function isUserRole(role: string): role is UserRole {
  return USER_ROLES.includes(role as UserRole);
}

function loginIdentifierError(
  role: UserRole,
  email: string,
  nisn: string,
  nip: string
): string | null {
  if (role === "siswa" && !/^\d{10}$/.test(nisn)) {
    return "NISN siswa harus terdiri dari 10 angka.";
  }

  if (
    (role === "guru" || role === "kurikulum") &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return "Email yang valid wajib diisi untuk role guru dan kurikulum.";
  }

  if (role === "kepala-sekolah" && !nip) {
    return "NIP wajib diisi untuk role kepala sekolah.";
  }

  return null;
}

async function findDuplicateLoginIdentifier(
  role: UserRole,
  email: string,
  nisn: string,
  nip: string,
  excludeId?: string
) {
  const exclude = excludeId ? { _id: { $ne: excludeId } } : {};

  if (role === "siswa") {
    return User.findOne({ role: "siswa", nisn, ...exclude });
  }

  if (role === "kepala-sekolah") {
    return User.findOne({ role: "kepala-sekolah", nip, ...exclude });
  }

  if (role === "guru" || role === "kurikulum") {
    return User.findOne({
      $or: [
        { role: "guru", email },
        { role: "kurikulum", email },
      ],
      ...exclude,
    });
  }

  return null;
}

export async function createUser(formData: FormData) {
  try {
    await connectDB();

    const nama = String(formData.get("nama") || "").trim();
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const nisn = String(formData.get("nisn") || "").trim();
    const nip = String(formData.get("nip") || "").trim();
    const roleValue = String(formData.get("role") || "");
    const jurusan = String(formData.get("jurusan") || "").trim();
    const tingkat = String(formData.get("tingkat") || "").trim();
    const kelasId = String(formData.get("kelasId") || "").trim();

    if (!nama || !username || !password || !isUserRole(roleValue)) {
      return {
        success: false,
        message: "Nama, username, password, dan role wajib diisi.",
      };
    }
    const role = roleValue;

    const identifierError = loginIdentifierError(role, email, nisn, nip);
    if (identifierError) {
      return { success: false, message: identifierError };
    }

    const kelas =
      role === "siswa" && kelasId && jurusan && tingkat
        ? await Kelas.findOne({ _id: kelasId, jurusan, tingkat })
        : null;

    if (role === "siswa" && !kelas) {
      return {
        success: false,
        message: "Pilih kelas yang sesuai dengan jurusan dan tingkat.",
      };
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return {
        success: false,
        message: "Username sudah digunakan.",
      };
    }

    const duplicateIdentifier = await findDuplicateLoginIdentifier(
      role,
      email,
      nisn,
      nip
    );

    if (duplicateIdentifier) {
      return {
        success: false,
        message: "Identitas login sudah digunakan.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      nama,
      username,
      password: hashedPassword,
      email: email || undefined,
      nisn: role === "siswa" ? nisn : undefined,
      nip: role === "kepala-sekolah" ? nip : undefined,
      role,
      ...(kelas && {
        kelas: kelas.namaKelas,
        jurusan: kelas.jurusan,
      }),
      aktif: true,
    });

    revalidatePath("/admin/manajemen-user");
    revalidatePath("/admin/manajemen-kelas");

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
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const nisn = String(formData.get("nisn") || "").trim();
    const nip = String(formData.get("nip") || "").trim();
    const roleValue = String(formData.get("role") || "");
    const jurusan = String(formData.get("jurusan") || "").trim();
    const tingkat = String(formData.get("tingkat") || "").trim();
    const kelasId = String(formData.get("kelasId") || "").trim();

    if (!id || !nama || !username || !isUserRole(roleValue)) {
      return {
        success: false,
        message: "ID, nama, username, dan role wajib diisi.",
      };
    }
    const role = roleValue;

    const identifierError = loginIdentifierError(role, email, nisn, nip);
    if (identifierError) {
      return { success: false, message: identifierError };
    }

    const kelas =
      role === "siswa" && kelasId && jurusan && tingkat
        ? await Kelas.findOne({ _id: kelasId, jurusan, tingkat })
        : null;

    if (role === "siswa" && !kelas) {
      return {
        success: false,
        message: "Pilih kelas yang sesuai dengan jurusan dan tingkat.",
      };
    }

    const duplicateIdentifier = await findDuplicateLoginIdentifier(
      role,
      email,
      nisn,
      nip,
      id
    );

    if (duplicateIdentifier) {
      return {
        success: false,
        message: "Identitas login sudah digunakan.",
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
      nisn?: string;
      nip?: string;
      role: UserRole;
      password?: string;
    } = {
      nama,
      username,
      email: email || undefined,
      role,
      ...(role === "siswa" && { nisn }),
      ...(role === "kepala-sekolah" && { nip }),
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const unsetData: Record<string, 1> = {};
    if (role !== "siswa") {
      unsetData.nisn = 1;
      unsetData.kelas = 1;
      unsetData.jurusan = 1;
    }
    if (role !== "kepala-sekolah") {
      unsetData.nip = 1;
    }

    const updateOperation = {
      $set: {
        ...updateData,
        ...(role === "siswa" && kelas
          ? { kelas: kelas.namaKelas, jurusan: kelas.jurusan }
          : {}),
      },
      ...(Object.keys(unsetData).length > 0 && { $unset: unsetData }),
    };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateOperation,
      { new: true }
    );

    if (!updatedUser) {
      return {
        success: false,
        message: "User tidak ditemukan.",
      };
    }

    revalidatePath("/admin/manajemen-user");
    revalidatePath("/admin/manajemen-kelas");

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