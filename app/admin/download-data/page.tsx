export default function DownloadDataPage() {
  return (
    <div className="management-page">

      {/* JUDUL HALAMAN */}
      <div className="management-header">
        <div>
          <h2>Download Data</h2>
          <p>
            Download data yang diperlukan dari sistem.
          </p>
        </div>
      </div>

      {/* PILIHAN DOWNLOAD */}
      <div className="download-grid">

        <div className="download-card">
          <div>
            <h3>Data Siswa</h3>
            <p>
              Download seluruh data siswa.
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
              Download seluruh data guru.
            </p>
          </div>

          <button className="download-button">
            Download
          </button>
        </div>


        <div className="download-card">
          <div>
            <h3>Data Kelas</h3>
            <p>
              Download seluruh data kelas.
            </p>
          </div>

          <button className="download-button">
            Download
          </button>
        </div>


        <div className="download-card">
          <div>
            <h3>Data Mata Pelajaran</h3>
            <p>
              Download seluruh mata pelajaran.
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