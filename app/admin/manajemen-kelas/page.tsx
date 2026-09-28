export default function ManajemenKelasPage() {
  return (
    <div className="management-page">

      {/* JUDUL HALAMAN */}
      <div className="management-header">
        <div>
          <h2>Manajemen Kelas</h2>
          <p>Kelola data kelas siswa.</p>
        </div>
      </div>

      {/* DATA KELAS */}
      <div className="dashboard-panel">

        <button className="add-button">
          + Tambah Kelas
        </button>

        <div className="dashboard-table">
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
                  <button className="edit-button">
                    Edit
                  </button>

                  <button className="delete-button">
                    Delete
                  </button>
                </td>
              </tr>

              <tr>
                <td>2</td>
                <td>XI RPL 1</td>
                <td>RPL</td>
                <td>Andi Wijaya</td>
                <td>
                  <button className="edit-button">
                    Edit
                  </button>

                  <button className="delete-button">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}