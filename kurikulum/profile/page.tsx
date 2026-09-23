export default function ProfilePage() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          Edu<span>Class</span>
        </div>

        <nav className="sidebar-menu">
          <a href="/kurikulum/dashboard">Dashboard</a>
          <a href="/kurikulum/mata-pelajaran">Mata Pelajaran</a>
          <a href="/kurikulum/materi">Materi</a>
          <a href="/kurikulum/jadwal">Jadwal</a>
          <a href="/kurikulum/data-kurikulum">Kurikulum</a>
          <a href="/kurikulum/monitoring">Monitoring</a>
          <a href="/kurikulum/laporan">Laporan</a>
          <a href="/kurikulum/profile">Profile</a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h2>Profile</h2>
            <p>Informasi akun pengguna</p>
          </div>

          <div className="user-info">
            <span>Kurikulum</span>
            <div className="user-avatar">K</div>
          </div>
        </header>

        <h1>Profile</h1>
        <p>Informasi akun Kurikulum.</p>

        <div className="profile-card">
          <div className="profile-avatar">K</div>

          <div className="profile-info">
            <div className="profile-row">
              <span>Nama</span>
              <strong>Kurikulum</strong>
            </div>

            <div className="profile-row">
              <span>Username</span>
              <strong>kurikulum</strong>
            </div>

            <div className="profile-row">
              <span>Email</span>
              <strong>kurikulum@educlass.com</strong>
            </div>

            <div className="profile-row">
              <span>Role</span>
              <strong>Kurikulum</strong>
            </div>
          </div>

          <button className="edit-profile-button">
            Edit Profile
          </button>
        </div>
      </main>
    </div>
  );
}