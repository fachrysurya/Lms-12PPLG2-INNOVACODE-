export default function LaporanPage() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">EduClass</div>

        <nav className="sidebar-menu">
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/manajemen-user">Manajemen User</a>
          <a href="/admin/manajemen-kelas">Manajemen Kelas</a>
          <a href="/admin/mata-pelajaran">Mata Pelajaran</a>
          <a href="/admin/data-siswa">Data Siswa</a>
          <a href="/admin/data-guru">Data Guru</a>
          <a href="/admin/laporan" className="active">
            Laporan
          </a>
        </nav>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <h2>Laporan</h2>

          <div className="dashboard-user">
            <span>Administrator</span>
            <div className="dashboard-user-avatar">A</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Laporan</h1>
          <p>Lihat dan kelola laporan sistem.</p>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <span>Laporan Siswa</span>
              <strong>320</strong>
            </div>

            <div className="dashboard-card">
              <span>Laporan Guru</span>
              <strong>24</strong>
            </div>

            <div className="dashboard-card">
              <span>Laporan Kelas</span>
              <strong>18</strong>
            </div>

            <div className="dashboard-card">
              <span>Laporan Tugas</span>
              <strong>42</strong>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}