export default function MateriSiswaPage() {
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
          <h2>Materi Pembelajaran</h2>

          <div className="dashboard-user">
            <span>Andi</span>
            <div className="dashboard-user-avatar">S</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Materi Pembelajaran</h1>

          <p>
            Lihat materi pembelajaran yang diberikan oleh guru.
          </p>

          <div className="dashboard-table">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Mata Pelajaran</th>
                  <th>Materi</th>
                  <th>Guru</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>Basis Data</td>
                  <td>Database Relasional</td>
                  <td>Budi Santoso</td>
                  <td>
                    <button className="edit-button">
                      Lihat Materi
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>PWPB</td>
                  <td>HTML dan CSS</td>
                  <td>Siti Rahma</td>
                  <td>
                    <button className="edit-button">
                      Lihat Materi
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>3</td>
                  <td>Bahasa Inggris</td>
                  <td>Presentation</td>
                  <td>Andi Wijaya</td>
                  <td>
                    <button className="edit-button">
                      Lihat Materi
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </section>
    </div>
  );
}