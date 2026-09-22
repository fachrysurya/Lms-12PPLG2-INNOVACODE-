export default function ProfileSiswaPage() {
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
          <h2>Profile</h2>

          <div className="dashboard-user">
            <span>Andi</span>
            <div className="dashboard-user-avatar">S</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Profile</h1>

          <p>
            Informasi akun siswa.
          </p>

          <div className="profile-card">
            <div className="profile-avatar">
              S
            </div>

            <div className="profile-info">
              <div className="profile-row">
                <span>Nama</span>
                <strong>Andi</strong>
              </div>

              <div className="profile-row">
                <span>Username</span>
                <strong>andi</strong>
              </div>

              <div className="profile-row">
                <span>Email</span>
                <strong>andi@educlass.com</strong>
              </div>

              <div className="profile-row">
                <span>Kelas</span>
                <strong>X RPL 1</strong>
              </div>

              <div className="profile-row">
                <span>Role</span>
                <strong>Siswa</strong>
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