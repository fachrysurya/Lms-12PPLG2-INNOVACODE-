export default function NilaiSiswaPage() {
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
          <h2>Nilai</h2>

          <div className="dashboard-user">
            <span>Andi</span>
            <div className="dashboard-user-avatar">S</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Nilai</h1>

          <p>
            Lihat hasil nilai pembelajaran kamu.
          </p>

          <div className="dashboard-table">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Mata Pelajaran</th>
                  <th>Tugas</th>
                  <th>Asesmen</th>
                  <th>Nilai Akhir</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>Basis Data</td>
                  <td>90</td>
                  <td>88</td>
                  <td>89</td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>PWPB</td>
                  <td>85</td>
                  <td>90</td>
                  <td>88</td>
                </tr>

                <tr>
                  <td>3</td>
                  <td>Bahasa Inggris</td>
                  <td>88</td>
                  <td>85</td>
                  <td>87</td>
                </tr>

                <tr>
                  <td>4</td>
                  <td>Matematika</td>
                  <td>86</td>
                  <td>84</td>
                  <td>85</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </section>
    </div>
  );
}