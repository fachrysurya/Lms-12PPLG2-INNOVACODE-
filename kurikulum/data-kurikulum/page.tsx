export default function DataKurikulumPage() {
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
            <h2>Kurikulum</h2>
            <p>Kelola data kurikulum sekolah</p>
          </div>

          <div className="user-info">
            <span>Kurikulum</span>
            <div className="user-avatar">K</div>
          </div>
        </header>

        <h1>Data Kurikulum</h1>
        <p>Daftar kurikulum yang digunakan oleh sekolah.</p>

        <div className="management-header">
          <h3>Data Kurikulum</h3>
          <button className="add-button">+ Tambah Kurikulum</button>
        </div>

        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Kurikulum</th>
                <th>Tahun Ajaran</th>
                <th>Keterangan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Kurikulum Merdeka</td>
                <td>2025/2026</td>
                <td>Kurikulum utama sekolah</td>
                <td>Aktif</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>

              <tr>
                <td>2</td>
                <td>Kurikulum RPL</td>
                <td>2025/2026</td>
                <td>Kurikulum jurusan RPL</td>
                <td>Aktif</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>

              <tr>
                <td>3</td>
                <td>Kurikulum Kelas XI</td>
                <td>2025/2026</td>
                <td>Kurikulum tingkat XI</td>
                <td>Aktif</td>
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