export default function GuruDownloadPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Download Data</h2>
          <p>Download data pembelajaran.</p>
        </div>
      </div>

      <div className="download-grid">
        <div className="download-card">
          <div>
            <h3>Data Nilai</h3>
            <p>Download data nilai siswa.</p>
          </div>

          <button className="download-button">
            Download
          </button>
        </div>

        <div className="download-card">
          <div>
            <h3>Data Tugas</h3>
            <p>Download data tugas siswa.</p>
          </div>

          <button className="download-button">
            Download
          </button>
        </div>
      </div>
    </div>
  );
}