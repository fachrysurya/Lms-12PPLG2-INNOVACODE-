"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getDashboardByRole,
  type Role,
} from "../../lib/auth";

type LoginState = {
  error?: string;
};

const DEMO_USERS = [
  {
    nama: "Administrator",
    username: "admin",
    password: "admin123",
    role: "admin" as Role,
  },
  {
    nama: "Guru Edu Class",
    username: "guru",
    password: "guru123",
    role: "guru" as Role,
  },
  {
    nama: "Andi",
    username: "siswa",
    password: "siswa123",
    role: "siswa" as Role,
  },
  {
    nama: "Kurikulum Edu Class",
    username: "kurikulum",
    password: "kurikulum123",
    role: "kurikulum" as Role,
  },
  {
    nama: "Kepala Sekolah",
    username: "kepsek",
    password: "kepsek123",
    role: "kepsek" as Role,
  },
];

export async function loginAction(
  previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return {
      error: "Username dan password wajib diisi.",
    };
  }

  const user = DEMO_USERS.find(
    (item) =>
      item.username === username &&
      item.password === password
  );

  if (!user) {
    return {
      error: "Username atau password salah.",
    };
  }

  const session = {
    nama: user.nama,
    username: user.username,
    role: user.role,
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

  redirect(getDashboardByRole(user.role));
}