export default function MateriSiswaPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Materi Pembelajaran</h2>
          <p>
            Lihat materi pembelajaran yang diberikan oleh guru.
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
                <th>Materi</th>
                <th>Guru</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Basis Data</td>
                <td>Database Relasional</td>
                <td>Budi Santoso</td>
                <td>
                  <button className="edit-button">
                    Lihat Materi
                  </button>
                </td>
              </tr>

              <tr>
                <td>2</td>
                <td>PWPB</td>
                <td>HTML dan CSS</td>
                <td>Siti Rahma</td>
                <td>
                  <button className="edit-button">
                    Lihat Materi
                  </button>
                </td>
              </tr>

              <tr>
                <td>3</td>
                <td>Bahasa Inggris</td>
                <td>Presentation</td>
                <td>Andi Wijaya</td>
                <td>
                  <button className="edit-button">
                    Lihat Materi
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