export default function LaporanPage() {
  return (
    <div className="dashboard-layout">

      <aside className="sidebar">
        <div className="sidebar-logo">
          Edu<span>Class</span>
        </div>

        <nav className="sidebar-menu">
          <a href="/kurikulum/dashboard">
            Dashboard
          </a>

          <a href="/kurikulum/mata-pelajaran">
            Mata Pelajaran
          </a>

          <a href="/kurikulum/materi">
            Materi
          </a>

          <a href="/kurikulum/jadwal">
            Jadwal
          </a>

          <a href="/kurikulum/data-kurikulum">
            Kurikulum
          </a>

          <a href="/kurikulum/monitoring">
            Monitoring
          </a>

          <a href="/kurikulum/laporan">
            Laporan
          </a>

          <a href="/kurikulum/profile">
            Profile
          </a>
        </nav>
      </aside>

      <main className="dashboard-main">

        <header className="dashboard-header">
          <div>
            <h2>Laporan</h2>
            <p>Data dan laporan kurikulum sekolah</p>
          </div>

          <div className="user-info">
            <span>Kurikulum</span>

            <div className="user-avatar">
              K
            </div>
          </div>
        </header>

        <h1>Laporan</h1>

        <p>
          Lihat dan download berbagai data
          kegiatan kurikulum sekolah.
        </p>

        <div className="download-grid">

          <div className="download-card">
            <div>
              <h3>Data Mata Pelajaran</h3>

              <p>
                Download seluruh data mata pelajaran
                yang tersedia di sekolah.
              </p>
            </div>

            <button className="download-button">
              Download
            </button>
          </div>

          <div className="download-card">
            <div>
              <h3>Data Jadwal</h3>

              <p>
                Download data jadwal pembelajaran
                setiap kelas.
              </p>
            </div>

            <button className="download-button">
              Download
            </button>
          </div>

          <div className="download-card">
            <div>
              <h3>Data Materi</h3>

              <p>
                Download data materi pembelajaran
                yang dibuat oleh guru.
              </p>
            </div>

            <button className="download-button">
              Download
            </button>
          </div>

          <div className="download-card">
            <div>
              <h3>Data Kurikulum</h3>

              <p>
                Download data kurikulum yang
                digunakan oleh sekolah.
              </p>
            </div>

            <button className="download-button">
              Download
            </button>
          </div>

          <div className="download-card">
            <div>
              <h3>Data Monitoring</h3>

              <p>
                Download hasil monitoring
                kegiatan pembelajaran.
              </p>
            </div>

            <button className="download-button">
              Download
            </button>
          </div>

          <div className="download-card">
            <div>
              <h3>Data Guru</h3>

              <p>
                Download data guru yang
                berkaitan dengan pembelajaran.
              </p>
            </div>

            <button className="download-button">
              Download
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}