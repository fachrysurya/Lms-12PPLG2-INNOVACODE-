export default function DataSiswaPage() {
  return (
    <div className="management-page">

      {/* JUDUL HALAMAN */}
      <div className="management-header">
        <div>
          <h2>Data Siswa</h2>
          <p>Kelola seluruh data siswa.</p>
        </div>
      </div>

      {/* DATA SISWA */}
      <div className="dashboard-panel">

        <button className="add-button">
          + Tambah Siswa
        </button>

        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIS</th>
                <th>Kelas</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Andi</td>
                <td>2026001</td>
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