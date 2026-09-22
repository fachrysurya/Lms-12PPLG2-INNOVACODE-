export default function TugasSiswaPage() {
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
          <h2>Tugas</h2>

          <div className="dashboard-user">
            <span>Andi</span>
            <div className="dashboard-user-avatar">S</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Tugas</h1>

          <p>
            Lihat tugas dan lakukan pengumpulan tugas melalui halaman ini.
          </p>

          <div className="dashboard-table">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Mata Pelajaran</th>
                  <th>Judul Tugas</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>Basis Data</td>
                  <td>ERD Database</td>
                  <td>25 September 2026</td>
                  <td>Belum Dikumpulkan</td>
                  <td>
                    <button className="edit-button">
                      Kumpulkan
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>PWPB</td>
                  <td>Membuat Website</td>
                  <td>27 September 2026</td>
                  <td>Sudah Dikumpulkan</td>
                  <td>
                    <button className="edit-button">
                      Lihat
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>3</td>
                  <td>Bahasa Inggris</td>
                  <td>English Presentation</td>
                  <td>30 September 2026</td>
                  <td>Belum Dikumpulkan</td>
                  <td>
                    <button className="edit-button">
                      Kumpulkan
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>4</td>
                  <td>Matematika</td>
                  <td>Persamaan Kuadrat</td>
                  <td>2 Oktober 2026</td>
                  <td>Belum Dikumpulkan</td>
                  <td>
                    <button className="edit-button">
                      Kumpulkan
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