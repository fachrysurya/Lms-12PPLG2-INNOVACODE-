export default function MateriPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Materi Pembelajaran</h2>
          <p>
            Melihat dan memantau materi yang dibuat
            oleh guru.
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
                <th>Judul Materi</th>
                <th>Guru</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Basis Data</td>
                <td>Database MySQL</td>
                <td>Rizky Maulana</td>
                <td>Aktif</td>
              </tr>

              <tr>
                <td>2</td>
                <td>PWPB</td>
                <td>HTML & CSS</td>
                <td>Budi Santoso</td>
                <td>Aktif</td>
              </tr>

              <tr>
                <td>3</td>
                <td>Bahasa Inggris</td>
                <td>Introduction</td>
                <td>Siti Aminah</td>
                <td>Aktif</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}