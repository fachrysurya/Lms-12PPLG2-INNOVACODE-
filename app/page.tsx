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
            <span className="hero-label-dot" />
            LEARNING MANAGEMENT SYSTEM
          </p>

          <h1>
            Smart Education
            <br />
            <span>Management System</span>
          </h1>

          <p className="hero-description">
            Satu platform untuk belajar lebih terarah. Kelola materi, tugas,
            asesmen, dan nilai dengan lebih mudah.
          </p>

          <div className="hero-buttons">
            <Link href="/login" className="primary-button">
              Mulai Sekarang <span aria-hidden="true">→</span>
            </Link>

            <Link href="#fitur" className="secondary-button">
              Lihat Fitur
            </Link>
          </div>

          <div className="stats">
            <div className="stat-item">
              <strong>320</strong>
              <span>Siswa</span>
            </div>

            <div className="stat-item">
              <strong>24</strong>
              <span>Guru</span>
            </div>

            <div className="stat-item">
              <strong>18</strong>
              <span>Materi</span>
            </div>

            <div className="stat-item">
              <strong>42</strong>
              <span>Tugas</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="dashboard-preview">
            <div className="preview-header">
              <div>
                <small>EDU CLASS OVERVIEW</small>
                <h3>Ringkasan Pembelajaran</h3>
              </div>
              <div className="avatar" aria-hidden="true">E</div>
            </div>

            <div className="preview-cards">
              <div className="preview-card">
                <span>Materi aktif</span>
                <strong>18</strong>
                <small className="preview-trend">Siap dipelajari</small>
              </div>
              <div className="preview-card">
                <span>Tugas berjalan</span>
                <strong>42</strong>
                <small className="preview-trend">Tetap terpantau</small>
              </div>
            </div>

            <div className="preview-section">
              <div className="preview-section-heading">
                <h4 className="section-title">Aktivitas pembelajaran</h4>
                <span className="preview-period">Minggu ini</span>
              </div>
              <div className="preview-progress" aria-hidden="true">
                <span />
              </div>
              <div className="activity">
                <div className="activity-icon" aria-hidden="true">M</div>
                <div>
                  <strong>Materi pembelajaran</strong>
                  <small>Terorganisir untuk setiap kelas</small>
                </div>
                <span className="activity-check">✓</span>
              </div>
              <div className="activity">
                <div className="activity-icon" aria-hidden="true">T</div>
                <div>
                  <strong>Tugas &amp; asesmen</strong>
                  <small>Progres belajar lebih terpantau</small>
                </div>
                <span className="activity-check">✓</span>
              </div>
            </div>
          </div>
          <div className="hero-note">
            <span className="hero-note-icon" aria-hidden="true">✓</span>
            Semua kebutuhan belajar, dalam satu tempat
          </div>
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
        <div className="about-points">
          <div className="about-point">
            <span className="about-point-icon" aria-hidden="true">01</span>
            <div>
              <h3>Terpusat</h3>
              <p>Data pembelajaran tersusun rapi dalam satu platform.</p>
            </div>
          </div>
          <div className="about-point">
            <span className="about-point-icon" aria-hidden="true">02</span>
            <div>
              <h3>Terhubung</h3>
              <p>Guru dan siswa mengakses kebutuhan belajar yang sama.</p>
            </div>
          </div>
          <div className="about-point">
            <span className="about-point-icon" aria-hidden="true">03</span>
            <div>
              <h3>Mudah dipantau</h3>
              <p>Aktivitas dan perkembangan belajar lebih terlihat.</p>
            </div>
          </div>
        </div>
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
        <Link href="/login" className="primary-button contact-button">
          Masuk ke Edu Class <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}