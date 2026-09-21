export default function ManajemenKelasPage() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">EduClass</div>

        <nav className="sidebar-menu">
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/manajemen-user">Manajemen User</a>
          <a href="/admin/manajemen-kelas" className="active">
            Manajemen Kelas
          </a>
          <a href="/admin/mata-pelajaran">Mata Pelajaran</a>
          <a href="/admin/data-siswa">Data Siswa</a>
          <a href="/admin/data-guru">Data Guru</a>
          <a href="/admin/laporan">Laporan</a>
        </nav>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <h2>Manajemen Kelas</h2>

          <div className="dashboard-user">
            <span>Administrator</span>
            <div className="dashboard-user-avatar">A</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Manajemen Kelas</h1>
          <p>Kelola data kelas siswa.</p>

          <div className="dashboard-table">
            <button className="add-button">
              + Tambah Kelas
            </button>

            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Kelas</th>
                  <th>Jurusan</th>
                  <th>Wali Kelas</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>X RPL 1</td>
                  <td>RPL</td>
                  <td>Budi Santoso</td>
                  <td>
                    <button className="edit-button">Edit</button>
                    <button className="delete-button">Delete</button>
                  </td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>XI RPL 1</td>
                  <td>RPL</td>
                  <td>Andi Wijaya</td>
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