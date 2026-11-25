import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import RoleLayout, { MenuItem } from "../components/RoleLayout";

const GURU_MENU: MenuItem[] = [
  { href: "/guru/dashboard", label: "Dashboard" },
  { href: "/guru/materi", label: "Materi Pembelajaran" },
  { href: "/guru/tugas", label: "Tugas" },
  { href: "/guru/asesmen", label: "Asesmen" },
  { href: "/guru/nilai", label: "Nilai" },
  { href: "/guru/download-data", label: "Download Data" },
  { href: "/guru/profile", label: "Profile" },
];

export default async function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "guru") {
    redirect(`/${session.role}/dashboard`);
  }

  return (
    <RoleLayout
      role="guru"
      rolePrefix="guru"
      roleBadge="GURU"
      headerLabel="LEARNING MANAGEMENT SYSTEM"
      headerTitle="Dashboard Guru"
      user={{
        nama: session.nama,
        roleLabel: "Guru",
      }}
      menuItems={GURU_MENU}
    >
      {children}
    </RoleLayout>
  );
}
