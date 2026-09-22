export default function AsesmenSiswaPage() {
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
          <h2>Asesmen</h2>

          <div className="dashboard-user">
            <span>Andi</span>
            <div className="dashboard-user-avatar">S</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Asesmen</h1>

          <p>
            Lihat asesmen yang diberikan oleh guru.
          </p>

          <div className="dashboard-table">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Mata Pelajaran</th>
                  <th>Asesmen</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>Basis Data</td>
                  <td>Quiz Database</td>
                  <td>20 September 2026</td>
                  <td>Selesai</td>
                  <td>
                    <button className="edit-button">
                      Lihat
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>PWPB</td>
                  <td>Quiz HTML</td>
                  <td>24 September 2026</td>
                  <td>Belum Dikerjakan</td>
                  <td>
                    <button className="edit-button">
                      Mulai
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>3</td>
                  <td>Matematika</td>
                  <td>Ulangan Harian</td>
                  <td>28 September 2026</td>
                  <td>Belum Dikerjakan</td>
                  <td>
                    <button className="edit-button">
                      Mulai
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