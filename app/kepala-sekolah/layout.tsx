import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import RoleLayout, { MenuItem } from "../components/RoleLayout";

const KEPSEK_MENU: MenuItem[] = [
  { href: "/kepala-sekolah/dashboard", label: "Dashboard" },
  {
    href: "/kepala-sekolah/data-sekolah",
    label: "Data Sekolah",
    extraMatchPrefixes: [
      "/kepala-sekolah/data-siswa",
      "/kepala-sekolah/data-guru",
      "/kepala-sekolah/data-kelas",
    ],
  },
  { href: "/kepala-sekolah/mata-pelajaran", label: "Mata Pelajaran" },
  { href: "/kepala-sekolah/jadwal", label: "Jadwal Pelajaran" },
  { href: "/kepala-sekolah/laporan", label: "Laporan" },
  { href: "/kepala-sekolah/profile", label: "Profile" },
];

export default async function KepalaSekolahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "kepala-sekolah") {
    redirect(`/${session.role}/dashboard`);
  }

  return (
    <RoleLayout
      role="kepala-sekolah"
      rolePrefix="kepsek"
      roleBadge="KEPALA SEKOLAH"
      headerLabel="LEARNING MANAGEMENT SYSTEM"
      headerTitle="Dashboard Kepala Sekolah"
      user={{
        nama: session.nama,
        roleLabel: "Kepala Sekolah",
      }}
      menuItems={KEPSEK_MENU}
    >
      {children}
    </RoleLayout>
  );
}
