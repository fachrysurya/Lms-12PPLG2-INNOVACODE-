"use client";

import Link from "next/link";

export default function KepalaSekolahDashboard() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          Edu<span>Class</span>
        </div>

        <div className="sidebar-role">KEPALA SEKOLAH</div>

        <nav className="sidebar-menu">
          <Link href="/kepala-sekolah/dashboard" className="active">
            <span>▣</span>
            Dashboard
          </Link>

          <Link href="/kepala-sekolah/monitoring">
            <span>◉</span>
            Monitoring
          </Link>

          <Link href="/kepala-sekolah/laporan">
            <span>▤</span>
            Laporan
          </Link>

          <Link href="/kepala-sekolah/profile">
            <span>◯</span>
            Profile
          </Link>
        </nav>

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

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-header-label">
              KEPALA SEKOLAH
            </p>

            <h1>Dashboard</h1>

            <p>
              Selamat datang di sistem informasi Edu Class.
            </p>
          </div>

          <div className="profile-mini">
            <div className="profile-avatar">KS</div>

            <div>
              <strong>Kepala Sekolah</strong>
              <span>Administrator Sekolah</span>
            </div>
          </div>
        </header>

        <section className="dashboard-main">
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <div className="dashboard-card-icon">👨‍🏫</div>

              <div>
                <span>Total Guru</span>
                <strong>24</strong>
                <small>Guru aktif</small>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">👨‍🎓</div>

              <div>
                <span>Total Siswa</span>
                <strong>320</strong>
                <small>Siswa aktif</small>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">▤</div>

              <div>
                <span>Total Kelas</span>
                <strong>12</strong>
                <small>Kelas aktif</small>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">📚</div>

              <div>
                <span>Total Materi</span>
                <strong>18</strong>
                <small>Materi tersedia</small>
              </div>
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Ringkasan Sekolah</h2>
                <p>Informasi umum kondisi sekolah</p>
              </div>

              <Link
                href="/kepalasekolah/monitoring"
                className="panel-action"
              >
                Lihat Monitoring
              </Link>
            </div>

            <div className="school-summary">
              <div className="summary-item">
                <span>Guru Aktif</span>
                <strong>24 Guru</strong>
                <small>Seluruh guru terdaftar</small>
              </div>

              <div className="summary-item">
                <span>Siswa Aktif</span>
                <strong>320 Siswa</strong>
                <small>Seluruh siswa terdaftar</small>
              </div>

              <div className="summary-item">
                <span>Kelas Aktif</span>
                <strong>12 Kelas</strong>
                <small>Kelas yang tersedia</small>
              </div>

              <div className="summary-item">
                <span>Materi</span>
                <strong>18 Materi</strong>
                <small>Materi pembelajaran</small>
              </div>
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Aktivitas Terbaru</h2>
                <p>Aktivitas terbaru dalam sistem</p>
              </div>
            </div>

            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">📚</div>

                <div>
                  <strong>Materi pembelajaran diperbarui</strong>
                  <span>Guru menambahkan materi baru</span>
                </div>

                <small>Hari ini</small>
              </div>

              <div className="activity-item">
                <div className="activity-icon">📝</div>

                <div>
                  <strong>Tugas baru tersedia</strong>
                  <span>Terdapat tugas baru untuk siswa</span>
                </div>

                <small>Kemarin</small>
              </div>

              <div className="activity-item">
                <div className="activity-icon">👨‍🎓</div>

                <div>
                  <strong>Data siswa diperbarui</strong>
                  <span>Data siswa berhasil diperbarui</span>
                </div>

                <small>2 hari lalu</small>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}