import type { Role } from "../../lib/auth";

/**
 * Label tampilan tiap role.
 * Dipisah dari file "use server" karena file server action
 * hanya boleh mengekspor fungsi async.
 */
export const roleLabel: Record<Role, string> = {
  admin: "Administrator",
  guru: "Guru",
  siswa: "Siswa",
  kurikulum: "Kurikulum",
  "kepala-sekolah": "Kepala Sekolah",
};

export const rolePath: Record<Role, string> = {
  admin: "admin",
  guru: "guru",
  siswa: "siswa",
  kurikulum: "kurikulum",
  "kepala-sekolah": "kepala-sekolah",
};