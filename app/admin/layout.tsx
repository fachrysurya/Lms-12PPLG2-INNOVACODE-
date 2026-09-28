import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";

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
    <div className="admin-layout">
      {/* SIDEBAR ADMIN */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          Edu<span>Class</span>
        </div>

        <div className="admin-role">
          ADMIN
        </div>

        <nav className="admin-sidebar-menu">
          <Link href="/admin/dashboard">
            Dashboard
          </Link>

          <Link href="/admin/manajemen-user">
            Manajemen User
          </Link>

          <Link href="/admin/manajemen-kelas">
            Manajemen Kelas
          </Link>

          <Link href="/admin/mata-pelajaran">
            Mata Pelajaran
          </Link>

          <Link href="/admin/data-siswa">
            Data Siswa
          </Link>

          <Link href="/admin/data-guru">
            Data Guru
          </Link>

          <Link href="/admin/laporan">
            Laporan
          </Link>

          <Link href="/admin/download-data">
            Download Data
          </Link>

          <Link href="/admin/profile">
            Profile
          </Link>
        </nav>

        <div className="admin-sidebar-bottom">
          <Link href="/login">
            Logout
          </Link>
        </div>
      </aside>

      {/* CONTENT */}
      <div className="admin-content">
        {/* HEADER ADMIN */}
        <header className="admin-header">
          <div>
            <p className="admin-header-label">
              ADMINISTRATOR
            </p>

            <h1>Dashboard</h1>
          </div>

          <div className="admin-user">
            <div className="admin-user-avatar">
              {session.nama.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{session.nama}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}