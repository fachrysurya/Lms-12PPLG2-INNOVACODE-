export default function GuruTugasPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Tugas</h2>
          <p>Buat dan kelola tugas siswa.</p>
        </div>
      </div>

      <div className="dashboard-panel">
        <button className="add-button">
          + Tambah Tugas
        </button>

        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Judul Tugas</th>
                <th>Mata Pelajaran</th>
                <th>Kelas</th>
                <th>Jenis</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Tugas Database</td>
                <td>Basis Data</td>
                <td>X RPL 1</td>
                <td>PDF</td>
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