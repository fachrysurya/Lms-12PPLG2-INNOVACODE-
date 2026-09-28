export default function DataGuruPage() {
  return (
    <div className="management-page">

      {/* JUDUL HALAMAN */}
      <div className="management-header">
        <div>
          <h2>Data Guru</h2>
          <p>Kelola seluruh data guru.</p>
        </div>
      </div>

      {/* DATA GURU */}
      <div className="dashboard-panel">

        <button className="add-button">
          + Tambah Guru
        </button>

        <div className="dashboard-table">
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