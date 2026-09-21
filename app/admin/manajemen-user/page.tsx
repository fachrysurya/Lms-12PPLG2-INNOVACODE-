export default function ManajemenUserPage() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">EduClass</div>

        <nav className="sidebar-menu">
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/manajemen-user" className="active">
            Manajemen User
          </a>
          <a href="/admin/manajemen-kelas">Manajemen Kelas</a>
          <a href="/admin/mata-pelajaran">Mata Pelajaran</a>
          <a href="/admin/data-siswa">Data Siswa</a>
          <a href="/admin/data-guru">Data Guru</a>
          <a href="/admin/laporan">Laporan</a>
        </nav>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <h2>Manajemen User</h2>

          <div className="dashboard-user">
            <span>Administrator</span>
            <div className="dashboard-user-avatar">A</div>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>Manajemen User</h1>
          <p>Kelola seluruh pengguna sistem.</p>

          <div className="dashboard-table">
            <button className="add-button">
              + Tambah User
            </button>

            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>Administrator</td>
                  <td>admin</td>
                  <td>Admin</td>
                  <td>
                    <button className="edit-button">Edit</button>
                    <button className="delete-button">Delete</button>
                  </td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>Budi Santoso</td>
                  <td>budi</td>
                  <td>Guru</td>
                  <td>
                    <button className="edit-button">Edit</button>
                    <button className="delete-button">Delete</button>
                  </td>
                </tr>

                <tr>
                  <td>3</td>
                  <td>Andi</td>
                  <td>andi</td>
                  <td>Siswa</td>
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