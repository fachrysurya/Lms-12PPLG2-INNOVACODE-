import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";

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
    <div className="kurikulum-layout">
      {/* SIDEBAR KURIKULUM */}
      <aside className="kurikulum-sidebar">
        <div className="kurikulum-logo">
          Edu<span>Class</span>
        </div>

        <div className="kurikulum-role">
          KURIKULUM
        </div>

        <nav className="kurikulum-sidebar-menu">
          <Link href="/kurikulum/dashboard">
            Dashboard
          </Link>

          <Link href="/kurikulum/mata-pelajaran">
            Mata Pelajaran
          </Link>

          <Link href="/kurikulum/materi">
            Materi
          </Link>

          <Link href="/kurikulum/jadwal">
            Jadwal
          </Link>

          <Link href="/kurikulum/data-kurikulum">
            Data Kurikulum
          </Link>

          <Link href="/kurikulum/monitoring">
            Monitoring
          </Link>

          <Link href="/kurikulum/laporan">
            Laporan
          </Link>

          <Link href="/kurikulum/profile">
            Profile
          </Link>
        </nav>

        <div className="kurikulum-sidebar-bottom">
          <Link href="/login">
            Logout
          </Link>
        </div>
      </aside>

      {/* CONTENT */}
      <div className="kurikulum-content">
        {/* HEADER KURIKULUM */}
        <header className="kurikulum-header">
          <div>
            <p className="kurikulum-header-label">
              LEARNING MANAGEMENT SYSTEM
            </p>

            <h1>Dashboard Kurikulum</h1>
          </div>

          <div className="kurikulum-user">
            <div className="kurikulum-user-avatar">
              {session.nama.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{session.nama}</strong>
              <span>Kurikulum</span>
            </div>
          </div>
        </header>

        <main className="kurikulum-main">
          {children}
        </main>
      </div>
    </div>
  );
}