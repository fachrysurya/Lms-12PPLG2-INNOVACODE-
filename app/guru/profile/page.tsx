export default function GuruProfilePage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Profile Guru</h2>
          <p>Kelola informasi akun guru.</p>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          G
        </div>

        <div className="profile-info">
          <div className="profile-row">
            <span>Nama</span>
            <strong>Guru</strong>
          </div>

          <div className="profile-row">
            <span>Username</span>
            <strong>guru</strong>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <strong>guru@educlass.com</strong>
          </div>

          <div className="profile-row">
            <span>Role</span>
            <strong>Guru</strong>
          </div>
        </div>

        <button className="edit-profile-button">
          Edit Profile
        </button>
      </div>
    </div>
  );
}