export default function MonitoringPage() {
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
            <h2>Monitoring</h2>
            <p>Monitoring kegiatan pembelajaran</p>
          </div>

          <div className="user-info">
            <span>Kurikulum</span>
            <div className="user-avatar">K</div>
          </div>
        </header>

        <h1>Monitoring Pembelajaran</h1>
        <p>Memantau kegiatan pembelajaran yang berjalan di sekolah.</p>

        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Kelas</th>
                <th>Mata Pelajaran</th>
                <th>Guru</th>
                <th>Materi</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>X RPL 1</td>
                <td>Basis Data</td>
                <td>Rizky Maulana</td>
                <td>Database MySQL</td>
                <td>Berjalan</td>
              </tr>

              <tr>
                <td>2</td>
                <td>X RPL 2</td>
                <td>PWPB</td>
                <td>Budi Santoso</td>
                <td>HTML & CSS</td>
                <td>Berjalan</td>
              </tr>

              <tr>
                <td>3</td>
                <td>XI RPL 1</td>
                <td>Matematika</td>
                <td>Andi Wijaya</td>
                <td>Persamaan</td>
                <td>Selesai</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}