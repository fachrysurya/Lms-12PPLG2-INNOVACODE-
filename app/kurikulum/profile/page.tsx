export default function ProfilePage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Profile</h2>
          <p>Informasi akun Kurikulum.</p>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          K
        </div>

        <div className="profile-info">
          <div className="profile-row">
            <span>Nama</span>
            <strong>Kurikulum</strong>
          </div>

          <div className="profile-row">
            <span>Username</span>
            <strong>kurikulum</strong>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <strong>kurikulum@educlass.com</strong>
          </div>

          <div className="profile-row">
            <span>Role</span>
            <strong>Kurikulum</strong>
          </div>
        </div>

        <button className="edit-profile-button">
          Edit Profile
        </button>
      </div>
    </div>
  );
}