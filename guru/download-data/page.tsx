import Link from "next/link";

export default function GuruDownloadPage() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          EduClass
        </div>

        <nav className="sidebar-menu">
          <Link href="/guru/dashboard">
            Dashboard
          </Link>

          <Link href="/guru/materi">
            Materi Pembelajaran
          </Link>

          <Link href="/guru/tugas">
            Tugas
          </Link>

          <Link href="/guru/asesmen">
            Asesmen
          </Link>

          <Link href="/guru/nilai">
            Nilai
          </Link>

          <Link href="/guru/download-data" className="active">
            Download Data
          </Link>

          <Link href="/guru/profile">
            Profile
          </Link>
        </nav>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <h2>Download Data</h2>

          <div className="dashboard-user">
            <span>Guru</span>
            <div className="dashboard-user-avatar">G</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Download Data</h1>

          <p>
            Download data pembelajaran.
          </p>

          <div className="download-grid">
            <div className="download-card">
              <div>
                <h3>Data Nilai</h3>
                <p>Download data nilai siswa.</p>
              </div>

              <button className="download-button">
                Download
              </button>
            </div>

            <div className="download-card">
              <div>
                <h3>Data Tugas</h3>
                <p>Download data tugas siswa.</p>
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