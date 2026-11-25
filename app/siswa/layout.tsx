import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import RoleLayout, { MenuItem } from "../components/RoleLayout";

const SISWA_MENU: MenuItem[] = [
  { href: "/siswa/dashboard", label: "Dashboard" },
  { href: "/siswa/materi", label: "Materi Pembelajaran" },
  { href: "/siswa/tugas", label: "Tugas & Pengumpulan" },
  { href: "/siswa/asesment", label: "Asesment" },
  { href: "/siswa/nilai", label: "Nilai" },
  { href: "/siswa/profile", label: "Profile" },
];

export default async function SiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "siswa") {
    redirect(`/${session.role}/dashboard`);
  }

  return (
    <RoleLayout
      role="siswa"
      rolePrefix="siswa"
      roleBadge="SISWA"
      headerLabel="LEARNING MANAGEMENT SYSTEM"
      headerTitle="Dashboard Siswa"
      user={{
        nama: session.nama,
        roleLabel: "Siswa",
      }}
      menuItems={SISWA_MENU}
    >
      {children}
    </RoleLayout>
  );
}
