"use client";

import { useState } from "react";

export default function ProfileKepalaSekolah() {
  const [editing, setEditing] = useState(false);

  const [nama, setNama] =
    useState("Kepala Sekolah");

  const [username, setUsername] =
    useState("kepsek");

  const [email, setEmail] =
    useState("kepsek@educlass.com");

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Profile</h2>
          <p>
            Kelola informasi akun Kepala Sekolah.
          </p>
        </div>
      </div>

      <div className="profile-page-card">
        <div className="profile-page-top">
          <div className="profile-large-avatar">
            KS
          </div>

          <div>
            <h2>{nama}</h2>
            <p>Kepala Sekolah</p>
          </div>
        </div>

        <div className="profile-divider"></div>

        <div className="profile-form">
          <div className="profile-field">
            <label>Nama Lengkap</label>

            <input
              type="text"
              value={nama}
              disabled={!editing}
              onChange={(e) =>
                setNama(e.target.value)
              }
            />
          </div>

          <div className="profile-field">
            <label>Username</label>

            <input
              type="text"
              value={username}
              disabled={!editing}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />
          </div>

          <div className="profile-field">
            <label>Email</label>

            <input
              type="email"
              value={email}
              disabled={!editing}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="profile-field">
            <label>Role</label>

            <input
              type="text"
              value="Kepala Sekolah"
              disabled
            />
          </div>
        </div>

        <div className="profile-actions">
          {!editing ? (
            <button
              type="button"
              className="profile-edit-button"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                className="profile-cancel-button"
                onClick={() => setEditing(false)}
              >
                Batal
              </button>

              <button
                type="button"
                className="profile-save-button"
                onClick={() => setEditing(false)}
              >
                Simpan Perubahan
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}