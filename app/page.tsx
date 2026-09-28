import Link from "next/link";

export default function Home() {
  return (
    <main className="landing">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          Edu<span>Class</span>
        </div>

        <div className="nav-menu">
          <Link href="/">Home</Link>
          <a href="#tentang">Tentang</a>
          <a href="#fitur">Fitur</a>
          <a href="#kontak">Kontak</a>

          <Link href="/login" className="login-button">
            Login
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">
            LEARNING MANAGEMENT SYSTEM
          </p>

          <h1>
            Smart Education
            <br />
            Management System
          </h1>

          <p className="hero-description">
            Kelola materi, tugas, asesmen, dan nilai dalam satu platform.
          </p>

          <div className="hero-buttons">
            <Link href="/login" className="primary-button">
              Get Started
            </Link>

            <Link href="/login" className="secondary-button">
              Login
            </Link>
          </div>

          <div className="stats">
            <div>
              <strong>320</strong>
              <span>Siswa</span>
            </div>

            <div>
              <strong>24</strong>
              <span>Guru</span>
            </div>

            <div>
              <strong>18</strong>
              <span>Materi</span>
            </div>

            <div>
              <strong>42</strong>
              <span>Tugas</span>
            </div>
          </div>
        </div>

        {/* GAMBAR LAPTOP EDU CLASS */}
        <div className="hero-image">
          <img
            src="/edu-class-laptop.png"
            alt="Edu Class"
          />
        </div>
      </section>

      {/* TENTANG */}
      <section id="tentang" className="info-section">
        <p className="section-label">
          TENTANG
        </p>

        <h2>
          Platform Pendidikan Terintegrasi
        </h2>

        <p>
          Edu Class membantu sekolah mengelola proses pembelajaran secara
          terpusat melalui satu sistem.
        </p>
      </section>

      {/* FITUR */}
      <section id="fitur" className="info-section">
        <p className="section-label">
          FITUR UTAMA
        </p>

        <h2>
          Semua Kebutuhan dalam Satu Platform
        </h2>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-number">
              01
            </div>

            <h3>
              Manajemen Data
            </h3>

            <p>
              Kelola data siswa, guru, kelas, dan pengguna.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">
              02
            </div>

            <h3>
              Materi Pembelajaran
            </h3>

            <p>
              Guru dapat menambahkan dan mengelola materi.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">
              03
            </div>

            <h3>
              Tugas & Asesmen
            </h3>

            <p>
              Kelola tugas, asesmen, dan pengumpulan siswa.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">
              04
            </div>

            <h3>
              Rekap Nilai
            </h3>

            <p>
              Pantau dan kelola nilai siswa dengan mudah.
            </p>
          </div>
        </div>
      </section>

      {/* KONTAK */}
      <section id="kontak" className="contact-section">
        <p className="section-label">
          KONTAK
        </p>

        <h2>
          Edu Class
        </h2>

        <p>
          Learning Management System untuk kebutuhan sekolah.
        </p>
      </section>
    </main>
  );
}