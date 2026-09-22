export default function DashboardSiswaPage() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">EduClass</div>

        <nav className="sidebar-menu">
          <a href="/siswa/dashboard">Dashboard</a>
          <a href="/siswa/materi">Materi Pembelajaran</a>
          <a href="/siswa/tugas">Tugas</a>
          <a href="/siswa/asesmen">Asesmen</a>
          <a href="/siswa/nilai">Nilai</a>
          <a href="/siswa/download-data">Download Data</a>
          <a href="/siswa/profile">Profile</a>
        </nav>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <h2>Dashboard</h2>

          <div className="dashboard-user">
            <span>Andi</span>
            <div className="dashboard-user-avatar">S</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Selamat Datang, Andi</h1>

          <p>
            Pantau kegiatan pembelajaran dan tugas kamu melalui dashboard.
          </p>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <span>Total Materi</span>
              <strong>18</strong>
            </div>

            <div className="dashboard-card">
              <span>Tugas</span>
              <strong>8</strong>
            </div>

            <div className="dashboard-card">
              <span>Asesmen</span>
              <strong>5</strong>
            </div>

            <div className="dashboard-card">
              <span>Nilai Rata-rata</span>
              <strong>87</strong>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}