export default function DownloadDataSiswaPage() {
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
          <h2>Download Data</h2>

          <div className="dashboard-user">
            <span>Andi</span>
            <div className="dashboard-user-avatar">S</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Download Data</h1>

          <p>
            Download data pembelajaran yang tersedia.
          </p>

          <div className="download-grid">
            <div className="download-card">
              <div>
                <h3>Data Nilai</h3>
                <p>
                  Download rekap nilai pembelajaran.
                </p>
              </div>

              <button className="download-button">
                Download
              </button>
            </div>

            <div className="download-card">
              <div>
                <h3>Materi Pembelajaran</h3>
                <p>
                  Download materi yang tersedia.
                </p>
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