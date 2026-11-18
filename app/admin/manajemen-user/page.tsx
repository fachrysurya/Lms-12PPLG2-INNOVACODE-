"use client";

import { useEffect, useState } from "react";

import Icon from "../../components/Icon";

import {
  createUser,
  updateUser,
  deleteUser,
} from "./actions";

const DAFTAR_JURUSAN = ["RPL", "DKV", "MPLB", "TJKT", "BDR"];
const DAFTAR_TINGKAT = ["X", "XI", "XII"];

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
  kelas?: string;
  jurusan?: string;
  aktif: boolean;
};

type Kelas = {
  _id: string;
  namaKelas: string;
  jurusan: string;
  tingkat: string;
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
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [kelasLoading, setKelasLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] =
    useState<User | null>(null);
  const [selectedRole, setSelectedRole] =
    useState<User["role"]>("siswa");
  const [selectedJurusan, setSelectedJurusan] = useState("");
  const [selectedTingkat, setSelectedTingkat] = useState("");
  const [selectedKelasId, setSelectedKelasId] = useState("");

  const [message, setMessage] = useState("");

  const kelasTersedia = kelasList.filter(
    (item) =>
      item.jurusan === selectedJurusan &&
      item.tingkat === selectedTingkat
  );

  async function loadUsers() {
    try {
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

  async function loadKelas() {
    try {
      const response = await fetch("/api/admin/kelas", {
        cache: "no-store",
      });
      const data = await response.json();

      if (data.success) {
        setKelasList(data.kelas);
      } else {
        setMessage(data.message || "Gagal mengambil data kelas.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Gagal mengambil data kelas.");
    } finally {
      setKelasLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadKelas).then(loadUsers);
  }, []);

  function openCreateForm() {
    setEditingUser(null);
    setSelectedRole("siswa");
    setSelectedJurusan("");
    setSelectedTingkat("");
    setSelectedKelasId("");
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(user: User) {
    setEditingUser(user);
    setSelectedRole(user.role);
    setSelectedJurusan(user.jurusan || "");
    const kelasUser = kelasList.find(
      (item) =>
        item.namaKelas === user.kelas &&
        item.jurusan === user.jurusan
    );
    setSelectedTingkat(kelasUser?.tingkat || "");
    setSelectedKelasId(kelasUser?._id || "");
    setShowForm(true);
    setMessage("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    // Simpan referensi form dulu. Setelah `await`, event.currentTarget
    // bisa menjadi null sehingga .reset() melempar error.
    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = editingUser
      ? await updateUser(formData)
      : await createUser(formData);

    setMessage(result.message);

    if (result.success) {
      setShowForm(false);
      setEditingUser(null);
      form.reset();

      setLoading(true);
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
      setLoading(true);
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
          <Icon name="plus" />
          Tambah User
        </button>
      </div>

      <div className="management-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="users" />
          </div>

          <div>
            <span>Total User</span>
            <strong>{users.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="user" />
          </div>

          <div>
            <span>User Aktif</span>
            <strong>
              {
                users.filter((item) => item.aktif)
                  .length
              }
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="book" />
          </div>

          <div>
            <span>Jumlah Role</span>
            <strong>
              {
                new Set(
                  users.map((item) => item.role)
                ).size
              }
            </strong>
          </div>
        </div>
      </div>

      {message && (
        <div className="management-message">
          {message}
        </div>
      )}

      {showForm && (
        <div className="user-form-card">
          <div className="form-header">
            <div className="form-title">
              <div className="form-icon">
                <Icon name="user" />
              </div>

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
                value={selectedRole}
                onChange={(event) => {
                  const role = event.target.value as User["role"];
                  setSelectedRole(role);
                  if (role !== "siswa") {
                    setSelectedJurusan("");
                    setSelectedTingkat("");
                    setSelectedKelasId("");
                  }
                }}
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

            {selectedRole === "siswa" && (
              <>
                <div className="form-group">
                  <label htmlFor="user-jurusan">Jurusan</label>
                  <select
                    id="user-jurusan"
                    name="jurusan"
                    value={selectedJurusan}
                    onChange={(event) => {
                      setSelectedJurusan(event.target.value);
                      setSelectedTingkat("");
                      setSelectedKelasId("");
                    }}
                    required
                    disabled={kelasLoading}
                  >
                    <option value="">Pilih Jurusan</option>
                    {DAFTAR_JURUSAN.map((jurusan) => (
                      <option key={`jurusan-${jurusan}`} value={jurusan}>
                        {jurusan}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="user-tingkat">Tingkat Kelas</label>
                  <select
                    id="user-tingkat"
                    name="tingkat"
                    value={selectedTingkat}
                    onChange={(event) => {
                      setSelectedTingkat(event.target.value);
                      setSelectedKelasId("");
                    }}
                    required
                    disabled={!selectedJurusan}
                  >
                    <option value="">
                      {selectedJurusan
                        ? "Pilih Tingkat"
                        : "Pilih jurusan terlebih dahulu"}
                    </option>
                    {DAFTAR_TINGKAT.map((tingkat) => (
                      <option key={`tingkat-${tingkat}`} value={tingkat}>
                        {tingkat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="user-kelas">Nama Kelas</label>
                  <select
                    id="user-kelas"
                    name="kelasId"
                    value={selectedKelasId}
                    onChange={(event) =>
                      setSelectedKelasId(event.target.value)
                    }
                    required
                    disabled={!selectedJurusan || !selectedTingkat || kelasLoading}
                  >
                    <option value="">
                      {!selectedJurusan || !selectedTingkat
                        ? "Pilih jurusan dan tingkat terlebih dahulu"
                        : kelasTersedia.length
                          ? "Pilih Nama Kelas"
                          : "Belum ada kelas untuk jurusan dan tingkat ini"}
                    </option>
                    {kelasTersedia.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.namaKelas}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

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
                <Icon name="edit" />
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
                <th>Jurusan</th>
                <th>Kelas</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="empty-table"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
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

                    <td>{user.jurusan || "-"}</td>

                    <td>{user.kelas || "-"}</td>

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
                          <Icon name="edit" />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDelete(user._id)
                          }
                        >
                          <Icon name="trash" />
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