export default function GuruDashboard() {
  return (
    <div className="guru-dashboard">
      <div className="dashboard-welcome">
        <h1>Selamat Datang, Guru</h1>

        <p>
          Kelola proses pembelajaran dan aktivitas siswa.
        </p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span>Total Materi</span>
          <strong>18</strong>
        </div>

        <div className="dashboard-card">
          <span>Total Tugas</span>
          <strong>12</strong>
        </div>

        <div className="dashboard-card">
          <span>Total Asesmen</span>
          <strong>8</strong>
        </div>

        <div className="dashboard-card">
          <span>Total Siswa</span>
          <strong>120</strong>
        </div>
      </div>
    </div>
  );
}