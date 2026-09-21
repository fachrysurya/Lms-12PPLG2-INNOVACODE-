export default function DownloadDataPage() {
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
          <a href="/admin/laporan">Laporan</a>

          <a href="/admin/download-data" className="active">
            Download Data
          </a>

          <a href="/admin/profile">Profile</a>
        </nav>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <h2>Download Data</h2>

          <div className="dashboard-user">
            <span>Administrator</span>
            <div className="dashboard-user-avatar">A</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Download Data</h1>
          <p>Download data yang diperlukan dari sistem.</p>

          <div className="download-grid">
            <div className="download-card">
              <div>
                <h3>Data Siswa</h3>
                <p>Download seluruh data siswa.</p>
              </div>

              <button className="download-button">
                Download
              </button>
            </div>

            <div className="download-card">
              <div>
                <h3>Data Guru</h3>
                <p>Download seluruh data guru.</p>
              </div>

              <button className="download-button">
                Download
              </button>
            </div>

            <div className="download-card">
              <div>
                <h3>Data Kelas</h3>
                <p>Download seluruh data kelas.</p>
              </div>

              <button className="download-button">
                Download
              </button>
            </div>

            <div className="download-card">
              <div>
                <h3>Data Mata Pelajaran</h3>
                <p>Download seluruh mata pelajaran.</p>
              </div>

              <button className="download-button">
                Download
              </button>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}