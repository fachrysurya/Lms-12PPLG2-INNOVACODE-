export default function TugasSiswaPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Tugas & Pengumpulan</h2>
          <p>
            Lihat tugas dan lakukan pengumpulan tugas melalui halaman ini.
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
                <th>Judul Tugas</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Basis Data</td>
                <td>ERD Database</td>
                <td>25 September 2026</td>
                <td>Belum Dikumpulkan</td>
                <td>
                  <button className="edit-button">
                    Kumpulkan
                  </button>
                </td>
              </tr>

              <tr>
                <td>2</td>
                <td>PWPB</td>
                <td>Membuat Website</td>
                <td>27 September 2026</td>
                <td>Sudah Dikumpulkan</td>
                <td>
                  <button className="edit-button">
                    Lihat
                  </button>
                </td>
              </tr>

              <tr>
                <td>3</td>
                <td>Bahasa Inggris</td>
                <td>English Presentation</td>
                <td>30 September 2026</td>
                <td>Belum Dikumpulkan</td>
                <td>
                  <button className="edit-button">
                    Kumpulkan
                  </button>
                </td>
              </tr>

              <tr>
                <td>4</td>
                <td>Matematika</td>
                <td>Persamaan Kuadrat</td>
                <td>2 Oktober 2026</td>
                <td>Belum Dikumpulkan</td>
                <td>
                  <button className="edit-button">
                    Kumpulkan
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