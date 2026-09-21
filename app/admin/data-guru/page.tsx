export default function DataGuruPage() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">EduClass</div>

        <nav className="sidebar-menu">
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/manajemen-user">Manajemen User</a>
          <a href="/admin/manajemen-kelas">Manajemen Kelas</a>
          <a href="/admin/mata-pelajaran">Mata Pelajaran</a>
          <a href="/admin/data-siswa">Data Siswa</a>
          <a href="/admin/data-guru" className="active">
            Data Guru
          </a>
          <a href="/admin/laporan">Laporan</a>
        </nav>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <h2>Data Guru</h2>

          <div className="dashboard-user">
            <span>Administrator</span>
            <div className="dashboard-user-avatar">A</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Data Guru</h1>
          <p>Kelola seluruh data guru.</p>

          <div className="dashboard-table">
            <button className="add-button">
              + Tambah Guru
            </button>

            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>NIP</th>
                  <th>Mata Pelajaran</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>Budi Santoso</td>
                  <td>19800101</td>
                  <td>Matematika</td>
                  <td>
                    <button className="edit-button">Edit</button>
                    <button className="delete-button">Delete</button>
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