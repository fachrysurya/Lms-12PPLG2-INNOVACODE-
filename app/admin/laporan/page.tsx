export default function LaporanPage() {
  return (
    <div className="management-page">

      {/* JUDUL HALAMAN */}
      <div className="management-header">
        <div>
          <h2>Laporan</h2>
          <p>
            Lihat dan kelola laporan sistem.
          </p>
        </div>
      </div>

      {/* RINGKASAN LAPORAN */}
      <div className="dashboard-cards">

        <div className="dashboard-card">
          <span>Laporan Siswa</span>
          <strong>320</strong>
        </div>

        <div className="dashboard-card">
          <span>Laporan Guru</span>
          <strong>24</strong>
        </div>

        <div className="dashboard-card">
          <span>Laporan Kelas</span>
          <strong>18</strong>
        </div>

        <div className="dashboard-card">
          <span>Laporan Tugas</span>
          <strong>42</strong>
        </div>

      </div>

    </div>
  );
}