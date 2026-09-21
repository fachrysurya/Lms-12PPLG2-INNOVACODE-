export default function MataPelajaranPage() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">EduClass</div>

        <nav className="sidebar-menu">
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/manajemen-user">Manajemen User</a>
          <a href="/admin/manajemen-kelas">Manajemen Kelas</a>
          <a href="/admin/mata-pelajaran" className="active">
            Mata Pelajaran
          </a>
          <a href="/admin/data-siswa">Data Siswa</a>
          <a href="/admin/data-guru">Data Guru</a>
          <a href="/admin/laporan">Laporan</a>
        </nav>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <h2>Mata Pelajaran</h2>

          <div className="dashboard-user">
            <span>Administrator</span>
            <div className="dashboard-user-avatar">A</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Mata Pelajaran</h1>
          <p>Kelola mata pelajaran sekolah.</p>

          <div className="dashboard-table">
            <button className="add-button">
              + Tambah Mata Pelajaran
            </button>

            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Mata Pelajaran</th>
                  <th>Kode</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>Bahasa Indonesia</td>
                  <td>BIND</td>
                  <td>
                    <button className="edit-button">Edit</button>
                    <button className="delete-button">Delete</button>
                  </td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>Matematika</td>
                  <td>MTK</td>
                  <td>
                    <button className="edit-button">Edit</button>
                    <button className="delete-button">Delete</button>
                  </td>
                </tr>

                <tr>
                  <td>3</td>
                  <td>Bahasa Inggris</td>
                  <td>BING</td>
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