export default function AdminProfilePage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Profile Administrator</h2>
          <p>Kelola informasi akun administrator.</p>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          A
        </div>

        <div className="profile-info">
          <div className="profile-row">
            <span>Nama</span>
            <strong>Administrator</strong>
          </div>

          <div className="profile-row">
            <span>Username</span>
            <strong>admin</strong>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <strong>admin@educlass.com</strong>
          </div>

          <div className="profile-row">
            <span>Role</span>
            <strong>Administrator</strong>
          </div>
        </div>

        <button className="edit-profile-button">
          Edit Profile
        </button>
      </div>
    </div>
  );
}