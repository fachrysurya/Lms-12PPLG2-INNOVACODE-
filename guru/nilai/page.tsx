import Link from "next/link";

export default function GuruNilaiPage() {
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

          <Link href="/guru/nilai" className="active">
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
          <h2>Nilai</h2>

          <div className="dashboard-user">
            <span>Guru</span>
            <div className="dashboard-user-avatar">G</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Nilai Siswa</h1>

          <p>
            Kelola dan lihat nilai siswa.
          </p>

          <div className="dashboard-table">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Siswa</th>
                  <th>Kelas</th>
                  <th>Tugas</th>
                  <th>Asesmen</th>
                  <th>Nilai Akhir</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>Andi</td>
                  <td>X RPL 1</td>
                  <td>85</td>
                  <td>90</td>
                  <td>88</td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>Budi</td>
                  <td>X RPL 1</td>
                  <td>80</td>
                  <td>85</td>
                  <td>83</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </section>
    </div>
  );
}