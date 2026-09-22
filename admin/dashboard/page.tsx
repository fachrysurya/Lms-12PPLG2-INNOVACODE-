import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          EduClass
        </div>

        <nav className="sidebar-menu">
          <Link href="/admin/dashboard" className="active">
            Dashboard
          </Link>

          <Link href="/admin/manajemen-user">
            Manajemen User
          </Link>

          <Link href="/admin/manajemen-kelas">
            Manajemen Kelas
          </Link>

          <Link href="/admin/mata-pelajaran">
            Mata Pelajaran
          </Link>

          <Link href="/admin/data-siswa">
            Data Siswa
          </Link>

          <Link href="/admin/data-guru">
            Data Guru
          </Link>

          <Link href="/admin/laporan">
            Laporan
          </Link>

          <Link href="/admin/download-data">
            Download Data
          </Link>

          <Link href="/admin/profile">
            Profile
          </Link>
        </nav>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <h2>Dashboard</h2>

          <div className="dashboard-user">
            <span>Administrator</span>

            <div className="dashboard-user-avatar">
              A
            </div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Selamat Datang, Administrator</h1>

          <p>
            Kelola sistem pendidikan melalui dashboard admin.
          </p>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <span>Total Siswa</span>
              <strong>320</strong>
            </div>

            <div className="dashboard-card">
              <span>Total Guru</span>
              <strong>24</strong>
            </div>

            <div className="dashboard-card">
              <span>Total Kelas</span>
              <strong>18</strong>
            </div>

            <div className="dashboard-card">
              <span>Total Tugas</span>
              <strong>42</strong>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}