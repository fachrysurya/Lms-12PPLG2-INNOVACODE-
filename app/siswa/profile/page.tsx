export default function ProfileSiswaPage() {
  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Profile</h2>
          <p>Informasi akun siswa.</p>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          S
        </div>

        <div className="profile-info">
          <div className="profile-row">
            <span>Nama</span>
            <strong>Andi</strong>
          </div>

          <div className="profile-row">
            <span>Username</span>
            <strong>andi</strong>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <strong>andi@educlass.com</strong>
          </div>

          <div className="profile-row">
            <span>Kelas</span>
            <strong>X RPL 1</strong>
          </div>

          <div className="profile-row">
            <span>Role</span>
            <strong>Siswa</strong>
          </div>
        </div>

        <button className="edit-profile-button">
          Edit Profile
        </button>
      </div>
    </div>
  );
}