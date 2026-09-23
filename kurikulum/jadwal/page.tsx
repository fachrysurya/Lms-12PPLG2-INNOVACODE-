export default function JadwalPage() {
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
            <h2>Jadwal</h2>
            <p>Kelola jadwal pembelajaran</p>
          </div>

          <div className="user-info">
            <span>Kurikulum</span>
            <div className="user-avatar">K</div>
          </div>
        </header>

        <h1>Jadwal Pembelajaran</h1>
        <p>Daftar jadwal pembelajaran setiap kelas.</p>

        <div className="management-header">
          <h3>Data Jadwal</h3>
          <button className="add-button">+ Tambah Jadwal</button>
        </div>

        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Hari</th>
                <th>Jam</th>
                <th>Kelas</th>
                <th>Mata Pelajaran</th>
                <th>Guru</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Senin</td>
                <td>07:00 - 08:30</td>
                <td>X RPL 1</td>
                <td>Basis Data</td>
                <td>Rizky Maulana</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>

              <tr>
                <td>2</td>
                <td>Selasa</td>
                <td>08:30 - 10:00</td>
                <td>X RPL 2</td>
                <td>PWPB</td>
                <td>Budi Santoso</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>

              <tr>
                <td>3</td>
                <td>Rabu</td>
                <td>10:00 - 11:30</td>
                <td>XI RPL 1</td>
                <td>Matematika</td>
                <td>Andi Wijaya</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}