import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";

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
    <div className="guru-layout">
      {/* SIDEBAR GURU */}
      <aside className="guru-sidebar">
        <div className="guru-logo">
          Edu<span>Class</span>
        </div>

        <div className="guru-role">
          GURU
        </div>

        <nav className="guru-sidebar-menu">
          <Link href="/guru/dashboard">
            Dashboard
          </Link>

          <Link href="/guru/materi">
            Materi Pembelajaran
          </Link>

          <Link href="/guru/tugas">
            Tugas
          </Link>

          <Link href="/guru/asesmen">
            Asesmen
          </Link>

          <Link href="/guru/nilai">
            Nilai
          </Link>

          <Link href="/guru/download-data">
            Download Data
          </Link>

          <Link href="/guru/profile">
            Profile
          </Link>
        </nav>

        <div className="guru-sidebar-bottom">
          <Link href="/login">
            Logout
          </Link>
        </div>
      </aside>

      {/* CONTENT */}
      <div className="guru-content">
        {/* HEADER GURU */}
        <header className="guru-header">
          <div>
            <p className="guru-header-label">
              LEARNING MANAGEMENT SYSTEM
            </p>

            <h1>Dashboard Guru</h1>
          </div>

          <div className="guru-user">
            <div className="guru-user-avatar">
              {session.nama.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{session.nama}</strong>
              <span>Guru</span>
            </div>
          </div>
        </header>

        <main className="guru-main">
          {children}
        </main>
      </div>
    </div>
  );
}