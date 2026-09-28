export default function GuruAsesmenPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Asesmen</h2>
          <p>Kelola asesmen dan penilaian siswa.</p>
        </div>
      </div>

      <div className="dashboard-panel">
        <button className="add-button">
          + Tambah Asesmen
        </button>

        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Asesmen</th>
                <th>Mata Pelajaran</th>
                <th>Kelas</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Ujian Tengah Semester</td>
                <td>Matematika</td>
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