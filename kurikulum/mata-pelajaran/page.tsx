export default function MataPelajaranPage() {
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
            <h2>Mata Pelajaran</h2>
            <p>Kelola data mata pelajaran</p>
          </div>

          <div className="user-info">
            <span>Kurikulum</span>
            <div className="user-avatar">K</div>
          </div>
        </header>

        <h1>Mata Pelajaran</h1>
        <p>Daftar mata pelajaran yang digunakan dalam pembelajaran.</p>

        <div className="management-header">
          <h3>Data Mata Pelajaran</h3>
          <button className="add-button">+ Tambah</button>
        </div>

        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Mata Pelajaran</th>
                <th>Kode</th>
                <th>Guru</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Bahasa Indonesia</td>
                <td>BIND</td>
                <td>Siti Aminah</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>

              <tr>
                <td>2</td>
                <td>Bahasa Inggris</td>
                <td>BING</td>
                <td>Budi Santoso</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>

              <tr>
                <td>3</td>
                <td>Matematika</td>
                <td>MTK</td>
                <td>Andi Wijaya</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>

              <tr>
                <td>4</td>
                <td>Basis Data</td>
                <td>BD</td>
                <td>Rizky Maulana</td>
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