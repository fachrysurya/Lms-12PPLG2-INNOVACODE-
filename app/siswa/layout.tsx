import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";

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
    <div className="siswa-layout">
      {/* SIDEBAR SISWA */}
      <aside className="siswa-sidebar">
        <div className="siswa-logo">
          Edu<span>Class</span>
        </div>

        <div className="siswa-role">
          SISWA
        </div>

        <nav className="siswa-sidebar-menu">
          <Link href="/siswa/dashboard">
            Dashboard
          </Link>

          <Link href="/siswa/materi">
            Materi Pembelajaran
          </Link>

          <Link href="/siswa/tugas">
            Tugas & Pengumpulan
          </Link>

          <Link href="/siswa/asesment">
            Asesment
          </Link>

          <Link href="/siswa/nilai">
            Nilai
          </Link>

          <Link href="/siswa/profile">
            Profile
          </Link>
        </nav>

        <div className="siswa-sidebar-bottom">
          <Link href="/login">
            Logout
          </Link>
        </div>
      </aside>

      {/* CONTENT */}
      <div className="siswa-content">
        {/* HEADER SISWA */}
        <header className="siswa-header">
          <div>
            <p className="siswa-header-label">
              LEARNING MANAGEMENT SYSTEM
            </p>

            <h1>Dashboard Siswa</h1>
          </div>

          <div className="siswa-user">
            <div className="siswa-user-avatar">
              {session.nama.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{session.nama}</strong>
              <span>Siswa</span>
            </div>
          </div>
        </header>

        <main className="siswa-main">
          {children}
        </main>
      </div>
    </div>
  );
}