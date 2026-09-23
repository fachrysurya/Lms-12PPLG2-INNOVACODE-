"use client";

import Link from "next/link";

export default function KurikulumDashboard() {
  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          EduClass
        </div>

        <nav className="sidebar-menu">
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
            Kurikulum
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

        {/* LOGOUT */}
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          <span>↪</span>
          Logout
        </button>

      </aside>


      {/* CONTENT */}
      <main className="dashboard-content">

        {/* HEADER */}
        <header className="dashboard-header">

          <div>
            <h2>Dashboard</h2>

            <p>
              Selamat datang di sistem Edu Class
            </p>
          </div>

          <div className="dashboard-user">

            <span>Kurikulum</span>

            <div className="dashboard-user-avatar">
              K
            </div>

          </div>

        </header>


        {/* MAIN */}
        <section className="dashboard-main">

          <h1>
            Dashboard Kurikulum
          </h1>

          <p>
            Kelola dan pantau kegiatan kurikulum sekolah.
          </p>


          {/* STATISTICS */}
          <div className="dashboard-cards">

            <div className="dashboard-card">

              <span>
                Mata Pelajaran
              </span>

              <strong>
                12
              </strong>

              <small>
                Mata pelajaran aktif
              </small>

            </div>


            <div className="dashboard-card">

              <span>
                Total Materi
              </span>

              <strong>
                48
              </strong>

              <small>
                Materi pembelajaran
              </small>

            </div>


            <div className="dashboard-card">

              <span>
                Total Kelas
              </span>

              <strong>
                18
              </strong>

              <small>
                Kelas aktif
              </small>

            </div>


            <div className="dashboard-card">

              <span>
                Total Guru
              </span>

              <strong>
                24
              </strong>

              <small>
                Guru aktif
              </small>

            </div>

          </div>


          {/* INFORMASI KURIKULUM */}
          <div className="dashboard-panel">

            <h2>
              Informasi Kurikulum
            </h2>

            <p>
              Ringkasan kegiatan kurikulum sekolah.
            </p>


            <div className="dashboard-table">

              <table>

                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kegiatan</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td>1</td>
                    <td>Penyusunan Jadwal</td>
                    <td>Selesai</td>
                  </tr>

                  <tr>
                    <td>2</td>
                    <td>Pengecekan Materi</td>
                    <td>Berjalan</td>
                  </tr>

                  <tr>
                    <td>3</td>
                    <td>Monitoring Pembelajaran</td>
                    <td>Berjalan</td>
                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}