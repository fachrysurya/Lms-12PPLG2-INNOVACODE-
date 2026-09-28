export default function MonitoringPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Monitoring Pembelajaran</h2>
          <p>
            Memantau kegiatan pembelajaran yang
            berjalan di sekolah.
          </p>
        </div>
      </div>

      <div className="dashboard-panel">
        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Kelas</th>
                <th>Mata Pelajaran</th>
                <th>Guru</th>
                <th>Materi</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>X RPL 1</td>
                <td>Basis Data</td>
                <td>Rizky Maulana</td>
                <td>Database MySQL</td>
                <td>Berjalan</td>
              </tr>

              <tr>
                <td>2</td>
                <td>X RPL 2</td>
                <td>PWPB</td>
                <td>Budi Santoso</td>
                <td>HTML & CSS</td>
                <td>Berjalan</td>
              </tr>

              <tr>
                <td>3</td>
                <td>XI RPL 1</td>
                <td>Matematika</td>
                <td>Andi Wijaya</td>
                <td>Persamaan</td>
                <td>Selesai</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}