export default function AsesmenSiswaPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Asesmen</h2>
          <p>
            Lihat asesmen yang diberikan oleh guru.
          </p>
        </div>
      </div>

      <div className="dashboard-panel">
        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Mata Pelajaran</th>
                <th>Asesmen</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Basis Data</td>
                <td>Quiz Database</td>
                <td>20 September 2026</td>
                <td>Selesai</td>
                <td>
                  <button className="edit-button">
                    Lihat
                  </button>
                </td>
              </tr>

              <tr>
                <td>2</td>
                <td>PWPB</td>
                <td>Quiz HTML</td>
                <td>24 September 2026</td>
                <td>Belum Dikerjakan</td>
                <td>
                  <button className="edit-button">
                    Mulai
                  </button>
                </td>
              </tr>

              <tr>
                <td>3</td>
                <td>Matematika</td>
                <td>Ulangan Harian</td>
                <td>28 September 2026</td>
                <td>Belum Dikerjakan</td>
                <td>
                  <button className="edit-button">
                    Mulai
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