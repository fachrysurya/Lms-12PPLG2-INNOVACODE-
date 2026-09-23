"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProfileKepalaSekolah() {
  const [editing, setEditing] = useState(false);

  const [nama, setNama] = useState("Kepala Sekolah");
  const [username, setUsername] = useState("kepsek");
  const [email, setEmail] = useState("kepsek@educlass.com");

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          Edu<span>Class</span>
        </div>

        <div className="sidebar-role">KEPALA SEKOLAH</div>

        <nav className="sidebar-menu">
          <Link href="/kepala-sekolah/dashboard">
            <span>▣</span>
            Dashboard
          </Link>

          <Link href="/kepala-sekolah/monitoring">
            <span>◉</span>
            Monitoring
          </Link>

          <Link href="/kepala-sekolah/laporan">
            <span>▤</span>
            Laporan
          </Link>

          <Link href="/kepala-sekolah/profile" className="active">
            <span>◯</span>
            Profile
          </Link>
        </nav>

        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          <span>↪</span>
          Logout
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-header-label">
              KEPALA SEKOLAH
            </p>

            <h1>Profile</h1>

            <p>Kelola informasi akun Kepala Sekolah.</p>
          </div>

          <div className="profile-mini">
            <div className="profile-avatar">KS</div>

            <div>
              <strong>{nama}</strong>
              <span>Administrator Sekolah</span>
            </div>
          </div>
        </header>

        <section className="dashboard-main">
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
                  onChange={(e) => setNama(e.target.value)}
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
        </section>
      </main>
    </div>
  );
}