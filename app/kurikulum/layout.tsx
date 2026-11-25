import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import RoleLayout, { MenuItem } from "../components/RoleLayout";

const KURIKULUM_MENU: MenuItem[] = [
  { href: "/kurikulum/dashboard", label: "Dashboard" },
  {
    href: "/kurikulum/data-sekolah",
    label: "Data Sekolah",
    extraMatchPrefixes: [
      "/kurikulum/data-siswa",
      "/kurikulum/data-guru",
      "/kurikulum/data-kelas",
      "/kurikulum/data-kurikulum",
    ],
  },
  { href: "/kurikulum/mata-pelajaran", label: "Mata Pelajaran" },
  { href: "/kurikulum/jadwal", label: "Jadwal Pelajaran" },
  { href: "/kurikulum/laporan", label: "Laporan" },
  { href: "/kurikulum/profile", label: "Profile" },
];

export default async function KurikulumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "kurikulum") {
    redirect(`/${session.role}/dashboard`);
  }

  return (
    <RoleLayout
      role="kurikulum"
      rolePrefix="kurikulum"
      roleBadge="KURIKULUM"
      headerLabel="LEARNING MANAGEMENT SYSTEM"
      headerTitle="Dashboard Kurikulum"
      user={{
        nama: session.nama,
        roleLabel: "Kurikulum",
      }}
      menuItems={KURIKULUM_MENU}
    >
      {children}
    </RoleLayout>
  );
}
