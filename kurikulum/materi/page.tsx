export default function MateriPage() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          Edu<span>Class</span>
        </div>
<nav className="sidebar-menu">
  <a href="/kurikulum/dashboard">Dashboard</a>
  <a href="/kurikulum/mata-pelajaran">Mata Pelajaran</a>
  <a href="/kurikulum/materi">Materi</a>
  <a href="/kurikulum/jadwal">Jadwal</a>
  <a href="/kurikulum/data-kurikulum">Kurikulum</a>
  <a href="/kurikulum/monitoring">Monitoring</a>
  <a href="/kurikulum/laporan">Laporan</a>
  <a href="/kurikulum/profile">Profile</a>
</nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h2>Materi</h2>
            <p>Monitoring materi pembelajaran</p>
          </div>

          <div className="user-info">
            <span>Kurikulum</span>
            <div className="user-avatar">K</div>
          </div>
        </header>

        <h1>Materi Pembelajaran</h1>
        <p>Melihat dan memantau materi yang dibuat oleh guru.</p>

        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Mata Pelajaran</th>
                <th>Judul Materi</th>
                <th>Guru</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Basis Data</td>
                <td>Database MySQL</td>
                <td>Rizky Maulana</td>
                <td>Aktif</td>
              </tr>

              <tr>
                <td>2</td>
                <td>PWPB</td>
                <td>HTML & CSS</td>
                <td>Budi Santoso</td>
                <td>Aktif</td>
              </tr>

              <tr>
                <td>3</td>
                <td>Bahasa Inggris</td>
                <td>Introduction</td>
                <td>Siti Aminah</td>
                <td>Aktif</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}