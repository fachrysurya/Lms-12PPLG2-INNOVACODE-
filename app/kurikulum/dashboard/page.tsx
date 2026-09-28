export default function KurikulumDashboard() {
  return (
    <div className="kurikulum-dashboard">
      <div className="dashboard-welcome">
        <h1>Dashboard Kurikulum</h1>

        <p>
          Kelola dan pantau kegiatan kurikulum sekolah.
        </p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span>Mata Pelajaran</span>

          <strong>12</strong>

          <small>
            Mata pelajaran aktif
          </small>
        </div>

        <div className="dashboard-card">
          <span>Total Materi</span>

          <strong>48</strong>

          <small>
            Materi pembelajaran
          </small>
        </div>

        <div className="dashboard-card">
          <span>Total Kelas</span>

          <strong>18</strong>

          <small>
            Kelas aktif
          </small>
        </div>

        <div className="dashboard-card">
          <span>Total Guru</span>

          <strong>24</strong>

          <small>
            Guru aktif
          </small>
        </div>
      </div>

      <div className="dashboard-panel">
        <h2>Informasi Kurikulum</h2>

        <p>
          Ringkasan kegiatan kurikulum sekolah.
        </p>

        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Kegiatan</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Penyusunan Jadwal</td>
                <td>Selesai</td>
              </tr>

              <tr>
                <td>2</td>
                <td>Pengecekan Materi</td>
                <td>Berjalan</td>
              </tr>

              <tr>
                <td>3</td>
                <td>Monitoring Pembelajaran</td>
                <td>Berjalan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}