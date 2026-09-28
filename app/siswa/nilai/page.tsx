export default function NilaiSiswaPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Nilai</h2>
          <p>
            Lihat hasil nilai pembelajaran kamu.
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
                <th>Tugas</th>
                <th>Asesmen</th>
                <th>Nilai Akhir</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Basis Data</td>
                <td>90</td>
                <td>88</td>
                <td>89</td>
              </tr>

              <tr>
                <td>2</td>
                <td>PWPB</td>
                <td>85</td>
                <td>90</td>
                <td>88</td>
              </tr>

              <tr>
                <td>3</td>
                <td>Bahasa Inggris</td>
                <td>88</td>
                <td>85</td>
                <td>87</td>
              </tr>

              <tr>
                <td>4</td>
                <td>Matematika</td>
                <td>86</td>
                <td>84</td>
                <td>85</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}