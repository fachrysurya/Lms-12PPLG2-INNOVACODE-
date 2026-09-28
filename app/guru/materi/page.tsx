export default function GuruMateriPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Materi Pembelajaran</h2>
          <p>
            Tambahkan dan kelola materi pembelajaran siswa.
          </p>
        </div>
      </div>

      <div className="dashboard-panel">
        <button className="add-button">
          + Tambah Materi
        </button>

        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Materi</th>
                <th>Mata Pelajaran</th>
                <th>Kelas</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Dasar Pemrograman</td>
                <td>Basis Data</td>
                <td>X RPL 1</td>
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