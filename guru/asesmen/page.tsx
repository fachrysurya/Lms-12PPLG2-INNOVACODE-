import Link from "next/link";

export default function GuruAsesmenPage() {
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

          <Link href="/guru/asesmen" className="active">
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
          <h2>Asesmen</h2>

          <div className="dashboard-user">
            <span>Guru</span>
            <div className="dashboard-user-avatar">G</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Asesmen</h1>

          <p>
            Kelola asesmen dan penilaian siswa.
          </p>

          <div className="dashboard-table">
            <button className="add-button">
              + Tambah Asesmen
            </button>

            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Asesmen</th>
                  <th>Mata Pelajaran</th>
                  <th>Kelas</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>Ujian Tengah Semester</td>
                  <td>Matematika</td>
                  <td>X RPL 1</td>
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