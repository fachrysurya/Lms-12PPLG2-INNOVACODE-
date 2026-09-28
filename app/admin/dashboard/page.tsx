export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-welcome">
        <h1>Selamat Datang, Administrator</h1>

        <p>
          Kelola sistem pendidikan melalui dashboard admin.
        </p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span>Total Siswa</span>
          <strong>320</strong>
        </div>

        <div className="dashboard-card">
          <span>Total Guru</span>
          <strong>24</strong>
        </div>

        <div className="dashboard-card">
          <span>Total Kelas</span>
          <strong>18</strong>
        </div>

        <div className="dashboard-card">
          <span>Total Tugas</span>
          <strong>42</strong>
        </div>
      </div>
    </div>
  );
}