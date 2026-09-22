export default function AdminProfilePage() {
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
          <a href="/admin/download-data">Download Data</a>

          <a href="/admin/profile" className="active">
            Profile
          </a>
        </nav>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <h2>Profile</h2>

          <div className="dashboard-user">
            <span>Administrator</span>
            <div className="dashboard-user-avatar">A</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Profile Administrator</h1>
          <p>Kelola informasi akun administrator.</p>

          <div className="profile-card">
            <div className="profile-avatar">
              A
            </div>

            <div className="profile-info">
              <div className="profile-row">
                <span>Nama</span>
                <strong>Administrator</strong>
              </div>

              <div className="profile-row">
                <span>Username</span>
                <strong>admin</strong>
              </div>

              <div className="profile-row">
                <span>Email</span>
                <strong>admin@educlass.com</strong>
              </div>

              <div className="profile-row">
                <span>Role</span>
                <strong>Administrator</strong>
              </div>
            </div>

            <button className="edit-profile-button">
              Edit Profile
            </button>
          </div>
        </main>
      </section>
    </div>
  );
}