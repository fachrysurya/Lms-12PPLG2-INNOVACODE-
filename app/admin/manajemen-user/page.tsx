"use client";

import { useEffect, useState } from "react";
import {
  createUser,
  updateUser,
  deleteUser,
} from "./actions";

type User = {
  _id: string;
  nama: string;
  username: string;
  email?: string;
  role:
    | "admin"
    | "guru"
    | "siswa"
    | "kurikulum"
    | "kepala-sekolah";
  aktif: boolean;
};

const roleLabel: Record<User["role"], string> = {
  admin: "Admin",
  guru: "Guru",
  siswa: "Siswa",
  kurikulum: "Kurikulum",
  "kepala-sekolah": "Kepala Sekolah",
};

export default function ManajemenUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] =
    useState<User | null>(null);

  const [message, setMessage] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/users", {
        cache: "no-store",
      });

      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error(error);
      setMessage("Gagal mengambil data user.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function openCreateForm() {
    setEditingUser(null);
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(user: User) {
    setEditingUser(user);
    setShowForm(true);
    setMessage("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const result = editingUser
      ? await updateUser(formData)
      : await createUser(formData);

    setMessage(result.message);

    if (result.success) {
      setShowForm(false);
      setEditingUser(null);
      event.currentTarget.reset();

      await loadUsers();
    }
  }

  async function handleDelete(id: string) {
    const yakin = confirm(
      "Apakah Anda yakin ingin menghapus user ini?"
    );

    if (!yakin) {
      return;
    }

    const formData = new FormData();
    formData.append("id", id);

    const result = await deleteUser(formData);

    setMessage(result.message);

    if (result.success) {
      await loadUsers();
    }
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Manajemen User</h1>

          <p>
            Kelola akun Admin, Guru, Siswa,
            Kurikulum, dan Kepala Sekolah.
          </p>
        </div>

        <button
          type="button"
          className="add-button"
          onClick={openCreateForm}
        >
          + Tambah User
        </button>
      </div>

      {message && (
        <div className="management-message">
          {message}
        </div>
      )}

      {showForm && (
        <div className="user-form-card">
          <div className="form-header">
            <div>
              <h2>
                {editingUser
                  ? "Edit User"
                  : "Tambah User"}
              </h2>

              <p>
                {editingUser
                  ? "Perbarui data akun user."
                  : "Tambahkan akun user baru."}
              </p>
            </div>

            <button
              type="button"
              className="close-form"
              onClick={() => {
                setShowForm(false);
                setEditingUser(null);
              }}
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="user-form"
          >
            {editingUser && (
              <input
                type="hidden"
                name="id"
                value={editingUser._id}
              />
            )}

            <div className="form-group">
              <label>Nama</label>

              <input
                type="text"
                name="nama"
                defaultValue={editingUser?.nama || ""}
                placeholder="Masukkan nama"
                required
              />
            </div>

            <div className="form-group">
              <label>Username</label>

              <input
                type="text"
                name="username"
                defaultValue={
                  editingUser?.username || ""
                }
                placeholder="Masukkan username"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder={
                  editingUser
                    ? "Kosongkan jika tidak diubah"
                    : "Masukkan password"
                }
                required={!editingUser}
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                defaultValue={
                  editingUser?.email || ""
                }
                placeholder="Masukkan email"
              />
            </div>

            <div className="form-group">
              <label>Role</label>

              <select
                name="role"
                defaultValue={
                  editingUser?.role || "siswa"
                }
                required
              >
                <option value="admin">Admin</option>
                <option value="guru">Guru</option>
                <option value="siswa">Siswa</option>
                <option value="kurikulum">
                  Kurikulum
                </option>
                <option value="kepala-sekolah">
                  Kepala Sekolah
                </option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowForm(false);
                  setEditingUser(null);
                }}
              >
                Batal
              </button>

              <button
                type="submit"
                className="save-button"
              >
                {editingUser
                  ? "Simpan Perubahan"
                  : "Simpan User"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="management-card">
        <div className="table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="empty-table"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="empty-table"
                  >
                    Belum ada data user.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>

                    <td>{user.nama}</td>

                    <td>{user.username}</td>

                    <td>
                      {user.email || "-"}
                    </td>

                    <td>
                      <span className="role-badge">
                        {roleLabel[user.role]}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          user.aktif
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {user.aktif
                          ? "Aktif"
                          : "Nonaktif"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            openEditForm(user)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDelete(user._id)
                          }
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}