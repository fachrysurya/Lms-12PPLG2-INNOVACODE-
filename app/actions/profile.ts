"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { connectDB } from "../../lib/mongodb";
import User from "../../models/User";
import {
  getSession,
  type SessionUser,
} from "../../lib/auth";
import { roleLabel, rolePath } from "./roleLabels";

const SESSION_COOKIE = "edu_class_session";

export type ProfileData = SessionUser & {
  email: string;
  roleLabel: string;
};

/**
 * Ambil profil user yang sedang login.
 * Data diambil dari MongoDB, dengan cookie session sebagai
 * penentu akun mana yang sedang aktif.
 */
export async function getProfile(): Promise<ProfileData | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const dasar: ProfileData = {
    ...session,
    email: "",
    roleLabel: roleLabel[session.role],
  };

  try {
    await connectDB();

    const user = await User.findOne({
      username: session.username,
    })
      .select("nama username email role")
      .lean();

    if (!user) {
      return dasar;
    }

    return {
      id: user._id.toString(),
      nama: user.nama,
      username: user.username,
      role: user.role,
      email: user.email ?? "",
      roleLabel: roleLabel[user.role],
    };
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return dasar;
  }
}

export async function updateProfile(formData: FormData) {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      message: "Sesi tidak ditemukan, silakan login ulang.",
    };
  }

  const nama = String(formData.get("nama") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  if (!nama) {
    return {
      success: false,
      message: "Nama wajib diisi.",
    };
  }

  if (email && !email.includes("@")) {
    return {
      success: false,
      message: "Format email tidak valid.",
    };
  }

  try {
    await connectDB();

    const updated = await User.findOneAndUpdate(
      { username: session.username },
      {
        nama,
        email: email || undefined,
      },
      { new: true }
    );

    // Sesi selalu diperbarui supaya nama di header ikut berubah,
    // walaupun akun belum ada di database.
    const cookieStore = await cookies();

    const sessionBaru = {
      id: session.id,
      nama: updated ? updated.nama : nama,
      username: session.username,
      role: session.role,
    };

    cookieStore.set(
      SESSION_COOKIE,
      JSON.stringify(sessionBaru),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      }
    );

    revalidatePath(`/${rolePath[session.role]}/profile`);

    return {
      success: true,
      message: updated
        ? "Profil berhasil diperbarui."
        : "Nama profil berhasil diperbarui.",
      nama: sessionBaru.nama,
      email,
    };
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return {
      success: false,
      message: "Gagal memperbarui profil.",
    };
  }
}