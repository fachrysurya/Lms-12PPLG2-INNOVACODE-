export default function MataPelajaranPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Mata Pelajaran</h2>
          <p>
            Daftar mata pelajaran yang digunakan
            dalam pembelajaran.
          </p>
        </div>

        <button className="add-button">
          + Tambah
        </button>
      </div>

      <div className="dashboard-panel">
        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Mata Pelajaran</th>
                <th>Kode</th>
                <th>Guru</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Bahasa Indonesia</td>
                <td>BIND</td>
                <td>Siti Aminah</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>

              <tr>
                <td>2</td>
                <td>Bahasa Inggris</td>
                <td>BING</td>
                <td>Budi Santoso</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>

              <tr>
                <td>3</td>
                <td>Matematika</td>
                <td>MTK</td>
                <td>Andi Wijaya</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>

              <tr>
                <td>4</td>
                <td>Basis Data</td>
                <td>BD</td>
                <td>Rizky Maulana</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}