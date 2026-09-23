"use client";

import Link from "next/link";

export default function MonitoringKepalaSekolah() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          Edu<span>Class</span>
        </div>

        <div className="sidebar-role">KEPALA SEKOLAH</div>

        <nav className="sidebar-menu">
          <Link href="/kepala-sekolah/dashboard">
            <span>▣</span>
            Dashboard
          </Link>

          <Link href="/kepala-sekolah/monitoring" className="active">
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

            <h1>Monitoring</h1>

            <p>
              Pantau aktivitas dan kondisi pembelajaran sekolah.
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
                <span>Guru Aktif</span>
                <strong>24</strong>
                <small>Guru mengajar</small>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">👨‍🎓</div>

              <div>
                <span>Siswa Aktif</span>
                <strong>320</strong>
                <small>Siswa mengikuti pembelajaran</small>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">📚</div>

              <div>
                <span>Materi</span>
                <strong>18</strong>
                <small>Materi tersedia</small>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">📝</div>

              <div>
                <span>Tugas</span>
                <strong>42</strong>
                <small>Tugas tersedia</small>
              </div>
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Monitoring Pembelajaran</h2>
                <p>
                  Ringkasan aktivitas pembelajaran
                </p>
              </div>
            </div>

            <div className="monitoring-list">
              <div className="monitoring-row">
                <div>
                  <strong>Aktivitas Guru</strong>
                  <span>Guru yang aktif dalam pembelajaran</span>
                </div>

                <span className="status-active">
                  24 Aktif
                </span>
              </div>

              <div className="monitoring-row">
                <div>
                  <strong>Aktivitas Siswa</strong>
                  <span>Siswa yang mengikuti pembelajaran</span>
                </div>

                <span className="status-active">
                  320 Aktif
                </span>
              </div>

              <div className="monitoring-row">
                <div>
                  <strong>Materi Pembelajaran</strong>
                  <span>Materi yang tersedia pada sistem</span>
                </div>

                <span className="status-active">
                  18 Materi
                </span>
              </div>

              <div className="monitoring-row">
                <div>
                  <strong>Tugas</strong>
                  <span>Tugas yang tersedia untuk siswa</span>
                </div>

                <span className="status-active">
                  42 Tugas
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Status Sistem</h2>
                <p>
                  Kondisi aktivitas sekolah saat ini
                </p>
              </div>
            </div>

            <div className="status-grid">
              <div className="status-box">
                <span className="status-dot"></span>

                <div>
                  <strong>Pembelajaran</strong>
                  <small>Berjalan</small>
                </div>
              </div>

              <div className="status-box">
                <span className="status-dot"></span>

                <div>
                  <strong>Materi</strong>
                  <small>Aktif</small>
                </div>
              </div>

              <div className="status-box">
                <span className="status-dot"></span>

                <div>
                  <strong>Tugas</strong>
                  <small>Aktif</small>
                </div>
              </div>

              <div className="status-box">
                <span className="status-dot"></span>

                <div>
                  <strong>Sistem</strong>
                  <small>Normal</small>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}