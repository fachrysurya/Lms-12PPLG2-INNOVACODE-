import Link from "next/link";

export default function GuruDashboard() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          EduClass
        </div>

        <nav className="sidebar-menu">
          <Link href="/guru/dashboard" className="active">
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

          <Link href="/guru/download-data">
            Download Data
          </Link>

          <Link href="/guru/profile">
            Profile
          </Link>
        </nav>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <h2>Dashboard</h2>

          <div className="dashboard-user">
            <span>Guru</span>

            <div className="dashboard-user-avatar">
              G
            </div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Selamat Datang, Guru</h1>

          <p>
            Kelola proses pembelajaran dan aktivitas siswa.
          </p>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <span>Total Materi</span>
              <strong>18</strong>
            </div>

            <div className="dashboard-card">
              <span>Total Tugas</span>
              <strong>12</strong>
            </div>

            <div className="dashboard-card">
              <span>Total Asesmen</span>
              <strong>8</strong>
            </div>

            <div className="dashboard-card">
              <span>Total Siswa</span>
              <strong>120</strong>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}