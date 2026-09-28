export default function JadwalPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Jadwal Pembelajaran</h2>
          <p>Kelola jadwal pembelajaran setiap kelas.</p>
        </div>

        <button className="add-button">
          + Tambah Jadwal
        </button>
      </div>

      <div className="dashboard-panel">
        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Hari</th>
                <th>Jam</th>
                <th>Kelas</th>
                <th>Mata Pelajaran</th>
                <th>Guru</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Senin</td>
                <td>07:00 - 08:30</td>
                <td>X RPL 1</td>
                <td>Basis Data</td>
                <td>Rizky Maulana</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>

              <tr>
                <td>2</td>
                <td>Selasa</td>
                <td>08:30 - 10:00</td>
                <td>X RPL 2</td>
                <td>PWPB</td>
                <td>Budi Santoso</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>

              <tr>
                <td>3</td>
                <td>Rabu</td>
                <td>10:00 - 11:30</td>
                <td>XI RPL 1</td>
                <td>Matematika</td>
                <td>Andi Wijaya</td>
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