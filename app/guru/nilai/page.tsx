export default function GuruNilaiPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Nilai Siswa</h2>
          <p>
            Kelola dan lihat nilai siswa.
          </p>
        </div>
      </div>

      <div className="dashboard-panel">
        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Siswa</th>
                <th>Kelas</th>
                <th>Tugas</th>
                <th>Asesmen</th>
                <th>Nilai Akhir</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Andi</td>
                <td>X RPL 1</td>
                <td>85</td>
                <td>90</td>
                <td>88</td>
              </tr>

              <tr>
                <td>2</td>
                <td>Budi</td>
                <td>X RPL 1</td>
                <td>80</td>
                <td>85</td>
                <td>83</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}