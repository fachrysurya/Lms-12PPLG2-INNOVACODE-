import { cookies } from "next/headers";

export type Role =
  | "admin"
  | "guru"
  | "siswa"
  | "kurikulum"
  | "kepala-sekolah";

export type SessionUser = {
  id?: string;
  nama: string;
  username: string;
  role: Role;
};

const SESSION_COOKIE = "edu_class_session";

const validRoles: Role[] = [
  "admin",
  "guru",
  "siswa",
  "kurikulum",
  "kepala-sekolah",
];

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const decodedValue = decodeURIComponent(sessionCookie.value);

    const session = JSON.parse(decodedValue) as SessionUser;

    if (
      !session.nama ||
      !session.username ||
      !session.role ||
      !validRoles.includes(session.role)
    ) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function getDashboardByRole(role: Role): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";

    case "guru":
      return "/guru/dashboard";

    case "siswa":
      return "/siswa/dashboard";

    case "kurikulum":
      return "/kurikulum/dashboard";

    case "kepala-sekolah":
      return "/kepala-sekolah/dashboard";

    default:
      return "/login";
  }
}