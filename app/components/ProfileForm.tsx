"use client";

import { useState } from "react";

import Icon from "./Icon";
import {
  updateProfile,
  type ProfileData,
} from "../actions/profile";

function inisial(nama: string) {
  const bagian = nama.trim().split(/\s+/).filter(Boolean);

  if (bagian.length === 0) {
    return "?";
  }

  if (bagian.length === 1) {
    return bagian[0].slice(0, 2).toUpperCase();
  }

  return (
    bagian[0].charAt(0) + bagian[1].charAt(0)
  ).toUpperCase();
}

export default function ProfileForm({
  profil,
}: {
  profil: ProfileData;
}) {
  const [editing, setEditing] = useState(false);
  const [nama, setNama] = useState(profil.nama);
  const [email, setEmail] = useState(profil.email);
  const [message, setMessage] = useState("");
  const [berhasil, setBerhasil] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);

  function batal() {
    setNama(profil.nama);
    setEmail(profil.email);
    setEditing(false);
    setMessage("");
  }

  async function simpan() {
    setMenyimpan(true);
    setMessage("");

    const formData = new FormData();

    formData.append("nama", nama);
    formData.append("email", email);

    const hasil = await updateProfile(formData);

    setMessage(hasil.message);
    setBerhasil(hasil.success);
    setMenyimpan(false);

    if (hasil.success) {
      setEditing(false);
    }
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Profile</h1>

          <p>
            Kelola informasi akun Anda sebagai{" "}
            {profil.roleLabel}.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={
            berhasil
              ? "profile-message profile-message-success"
              : "profile-message profile-message-error"
          }
        >
          <Icon
            name={berhasil ? "check" : "alert"}
          />
          {message}
        </div>
      )}

      <div className="profile-page-card">
        <div className="profile-page-top">
          <div className="profile-large-avatar">
            {inisial(nama)}
          </div>

          <div>
            <h2>{nama}</h2>
            <p>{profil.roleLabel}</p>
          </div>

          <span className="profile-role-badge">
            {profil.roleLabel}
          </span>
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
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div className="profile-field">
            <label>Username</label>

            <input
              type="text"
              value={profil.username}
              disabled
            />

            <small>
              Username tidak dapat diubah.
            </small>
          </div>

          <div className="profile-field">
            <label>Email</label>

            <input
              type="email"
              value={email}
              disabled={!editing}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@educlass.com"
            />
          </div>

          <div className="profile-field">
            <label>Role</label>

            <input
              type="text"
              value={profil.roleLabel}
              disabled
            />

            <small>
              Role hanya dapat diubah oleh admin.
            </small>
          </div>
        </div>

        <div className="profile-actions">
          {!editing ? (
            <button
              type="button"
              className="profile-edit-button"
              onClick={() => {
                setEditing(true);
                setMessage("");
              }}
            >
              <Icon name="edit" />
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                className="profile-cancel-button"
                onClick={batal}
                disabled={menyimpan}
              >
                Batal
              </button>

              <button
                type="button"
                className="profile-save-button"
                onClick={simpan}
                disabled={menyimpan || !nama.trim()}
              >
                <Icon name="check" />
                {menyimpan
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}