import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";

export default async function KepalaSekolahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // ROLE KEPALA SEKOLAH
  if (session.role !== "kepala-sekolah") {
    redirect(`/${session.role}/dashboard`);
  }

  return (
    <div className="kepsek-layout">

      {/* SIDEBAR */}
      <aside className="kepsek-sidebar">

        <div className="kepsek-logo">
          Edu<span>Class</span>
        </div>

        <div className="kepsek-role">
          KEPALA SEKOLAH
        </div>

        <nav className="kepsek-sidebar-menu">

          <Link href="/kepala-sekolah/dashboard">
            Dashboard
          </Link>

          <Link href="/kepala-sekolah/monitoring">
            Monitoring
          </Link>

          <Link href="/kepala-sekolah/laporan">
            Laporan
          </Link>

          <Link href="/kepala-sekolah/profile">
            Profile
          </Link>

        </nav>

        <div className="kepsek-sidebar-bottom">

          <Link href="/login">
            Logout
          </Link>

        </div>

      </aside>


      {/* CONTENT */}
      <div className="kepsek-content">

        {/* HEADER */}
        <header className="kepsek-header">

          <div>

            <p className="kepsek-header-label">
              LEARNING MANAGEMENT SYSTEM
            </p>

            <h1>
              Dashboard Kepala Sekolah
            </h1>

          </div>


          <div className="kepsek-user">

            <div className="kepsek-user-avatar">
              {session.nama.charAt(0).toUpperCase()}
            </div>

            <div>

              <strong>
                {session.nama}
              </strong>

              <span>
                Kepala Sekolah
              </span>

            </div>

          </div>

        </header>


        {/* ISI HALAMAN */}
        <main className="kepsek-main">
          {children}
        </main>

      </div>

    </div>
  );
}