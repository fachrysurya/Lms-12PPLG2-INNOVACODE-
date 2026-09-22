import Link from "next/link";

export default function GuruTugasPage() {
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

          <Link href="/guru/tugas" className="active">
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

          <Link href="/guru/profile">
            Profile
          </Link>
        </nav>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <h2>Tugas</h2>

          <div className="dashboard-user">
            <span>Guru</span>
            <div className="dashboard-user-avatar">G</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Tugas</h1>

          <p>
            Buat dan kelola tugas siswa.
          </p>

          <div className="dashboard-table">
            <button className="add-button">
              + Tambah Tugas
            </button>

            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Judul Tugas</th>
                  <th>Mata Pelajaran</th>
                  <th>Kelas</th>
                  <th>Jenis</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>Tugas Database</td>
                  <td>Basis Data</td>
                  <td>X RPL 1</td>
                  <td>PDF</td>
                  <td>
                    <button className="edit-button">
                      Edit
                    </button>

                    <button className="delete-button">
                      Delete
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