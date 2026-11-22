"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "../../lib/mongodb";
import {
  getDashboardByRole,
  type Role,
} from "../../lib/auth";
import User from "../../models/User";

type LoginState = {
  error?: string;
};

export async function loginAction(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const identifier = String(formData.get("identifier") || "").trim();
  const password = String(formData.get("password") || "");

  if (!identifier || !password) {
    return {
      error: "Identitas login dan password wajib diisi.",
    };
  }

  let authenticatedUser: {
    id: string;
    nama: string;
    username: string;
    role: Role;
  } | null = null;

  try {
    await connectDB();

    const users = await User.find({
      aktif: true,
      $or: [
        { role: "admin", username: identifier },
        { role: "guru", email: identifier.toLowerCase() },
        { role: "kurikulum", email: identifier.toLowerCase() },
        { role: "siswa", nisn: identifier },
        { role: "kepala-sekolah", nip: identifier },
      ],
    }).select("nama username password role");

    const matchingUsers: typeof users = [];

    for (const user of users) {
      if (await bcrypt.compare(password, user.password)) {
        matchingUsers.push(user);
      }
    }

    if (matchingUsers.length !== 1) {
      return {
        error: "Identitas login atau password salah.",
      };
    }

    const user = matchingUsers[0];
    authenticatedUser = {
      id: user._id.toString(),
      nama: user.nama,
      username: user.username,
      role: user.role,
    };
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return {
      error: "Login tidak dapat diproses saat ini. Silakan coba lagi.",
    };
  }

  if (!authenticatedUser) {
    return {
      error: "Identitas login atau password salah.",
    };
  }

  const session = {
    id: authenticatedUser.id,
    nama: authenticatedUser.nama,
    username: authenticatedUser.username,
    role: authenticatedUser.role,
  };

  const cookieStore = await cookies();

  cookieStore.set(
    "edu_class_session",
    JSON.stringify(session),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    }
  );

  const requestedRedirect = String(formData.get("redirect") || "");
  const redirectPath =
    requestedRedirect.startsWith("/") &&
    !requestedRedirect.startsWith("//") &&
    !requestedRedirect.includes("\\")
      ? requestedRedirect
      : getDashboardByRole(authenticatedUser.role);

  redirect(redirectPath);
}