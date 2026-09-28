export default function LaporanPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Laporan</h2>
          <p>Data dan laporan kurikulum sekolah.</p>
        </div>
      </div>

      <div className="download-grid">
        <div className="download-card">
          <div>
            <h3>Data Mata Pelajaran</h3>
            <p>
              Download seluruh data mata pelajaran
              yang tersedia di sekolah.
            </p>
          </div>

          <button className="download-button">
            Download
          </button>
        </div>

        <div className="download-card">
          <div>
            <h3>Data Jadwal</h3>
            <p>
              Download data jadwal pembelajaran
              setiap kelas.
            </p>
          </div>

          <button className="download-button">
            Download
          </button>
        </div>

        <div className="download-card">
          <div>
            <h3>Data Materi</h3>
            <p>
              Download data materi pembelajaran
              yang dibuat oleh guru.
            </p>
          </div>

          <button className="download-button">
            Download
          </button>
        </div>

        <div className="download-card">
          <div>
            <h3>Data Kurikulum</h3>
            <p>
              Download data kurikulum yang
              digunakan oleh sekolah.
            </p>
          </div>

          <button className="download-button">
            Download
          </button>
        </div>

        <div className="download-card">
          <div>
            <h3>Data Monitoring</h3>
            <p>
              Download hasil monitoring
              kegiatan pembelajaran.
            </p>
          </div>

          <button className="download-button">
            Download
          </button>
        </div>

        <div className="download-card">
          <div>
            <h3>Data Guru</h3>
            <p>
              Download data guru yang
              berkaitan dengan pembelajaran.
            </p>
          </div>

          <button className="download-button">
            Download
          </button>
        </div>
      </div>
    </div>
  );
}