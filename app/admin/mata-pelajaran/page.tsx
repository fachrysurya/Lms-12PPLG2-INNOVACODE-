export default function MataPelajaranPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Mata Pelajaran</h2>
          <p>Kelola mata pelajaran sekolah.</p>
        </div>
      </div>

      <div className="dashboard-panel">
        <button className="add-button">
          + Tambah Mata Pelajaran
        </button>

        <div className="dashboard-table">
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
                <td>Matematika</td>
                <td>MTK</td>
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
                <td>3</td>
                <td>Bahasa Inggris</td>
                <td>BING</td>
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