export default function SiswaDashboard() {
  return (
    <div className="siswa-dashboard">
      <div className="dashboard-welcome">
        <h1>Selamat Datang, Andi</h1>

        <p>
          Pantau kegiatan pembelajaran dan tugas kamu melalui dashboard.
        </p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span>Total Materi</span>
          <strong>18</strong>
        </div>

        <div className="dashboard-card">
          <span>Tugas</span>
          <strong>8</strong>
        </div>

        <div className="dashboard-card">
          <span>Asesmen</span>
          <strong>5</strong>
        </div>

        <div className="dashboard-card">
          <span>Nilai Rata-rata</span>
          <strong>87</strong>
        </div>
      </div>
    </div>
  );
}