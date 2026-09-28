export default function DataKurikulumPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Data Kurikulum</h2>
          <p>Kelola data kurikulum sekolah.</p>
        </div>

        <button className="add-button">
          + Tambah Kurikulum
        </button>
      </div>

      <div className="dashboard-panel">
        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Kurikulum</th>
                <th>Tahun Ajaran</th>
                <th>Keterangan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Kurikulum Merdeka</td>
                <td>2025/2026</td>
                <td>Kurikulum utama sekolah</td>
                <td>Aktif</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>

              <tr>
                <td>2</td>
                <td>Kurikulum RPL</td>
                <td>2025/2026</td>
                <td>Kurikulum jurusan RPL</td>
                <td>Aktif</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>

              <tr>
                <td>3</td>
                <td>Kurikulum Kelas XI</td>
                <td>2025/2026</td>
                <td>Kurikulum tingkat XI</td>
                <td>Aktif</td>
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