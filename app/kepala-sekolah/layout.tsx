import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import KepalaSekolahSidebar from "./components/KepalaSekolahSidebar";

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
      <KepalaSekolahSidebar />


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