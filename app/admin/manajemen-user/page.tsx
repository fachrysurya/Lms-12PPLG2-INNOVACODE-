export default function ManajemenUserPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Manajemen User</h2>
          <p>Kelola seluruh pengguna sistem.</p>
        </div>
      </div>

      <div className="dashboard-panel">
        <button className="add-button">
          + Tambah User
        </button>

        <div className="dashboard-table">
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
                <td>Budi Santoso</td>
                <td>budi</td>
                <td>Guru</td>
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
                <td>Andi</td>
                <td>andi</td>
                <td>Siswa</td>
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