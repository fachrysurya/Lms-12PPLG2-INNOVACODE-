import Link from "next/link";

export default function GuruProfilePage() {
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

          <Link href="/guru/download-data">
            Download Data
          </Link>

          <Link href="/guru/profile" className="active">
            Profile
          </Link>
        </nav>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <h2>Profile</h2>

          <div className="dashboard-user">
            <span>Guru</span>
            <div className="dashboard-user-avatar">G</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Profile Guru</h1>

          <p>
            Kelola informasi akun guru.
          </p>

          <div className="profile-card">
            <div className="profile-avatar">
              G
            </div>

            <div className="profile-info">
              <div className="profile-row">
                <span>Nama</span>
                <strong>Guru</strong>
              </div>

              <div className="profile-row">
                <span>Username</span>
                <strong>guru</strong>
              </div>

              <div className="profile-row">
                <span>Email</span>
                <strong>guru@educlass.com</strong>
              </div>

              <div className="profile-row">
                <span>Role</span>
                <strong>Guru</strong>
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