import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import RoleLayout, { MenuItem } from "../components/RoleLayout";

const ADMIN_MENU: MenuItem[] = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/manajemen-user", label: "Manajemen User" },
  { href: "/admin/manajemen-kelas", label: "Manajemen Kelas" },
  { href: "/admin/mata-pelajaran", label: "Mata Pelajaran" },
  { href: "/admin/data-siswa", label: "Data Siswa" },
  { href: "/admin/data-guru", label: "Data Guru" },
  { href: "/admin/jadwal-pelajaran", label: "Jadwal Pelajaran" },
  { href: "/admin/laporan", label: "Laporan" },
  { href: "/admin/download-data", label: "Download Data" },
  { href: "/admin/profile", label: "Profile" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "admin") {
    redirect(`/${session.role}/dashboard`);
  }

  return (
    <RoleLayout
      role="admin"
      rolePrefix="admin"
      roleBadge="ADMIN"
      headerLabel="ADMINISTRATOR"
      headerTitle="Dashboard"
      user={{
        nama: session.nama,
        roleLabel: "Administrator",
      }}
      menuItems={ADMIN_MENU}
    >
      {children}
    </RoleLayout>
  );
}
