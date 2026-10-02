"use client";

import { useEffect, useState } from "react";

import Icon from "../../components/Icon";

import {
  createSiswa,
  updateSiswa,
  deleteSiswa,
} from "./actions";

type Siswa = {
  _id: string;
  nama: string;
  nis: string;
  jenisKelamin: string;
  kelas: string;
  email?: string;
  noTelepon?: string;
  aktif: boolean;
};

export default function DataSiswaPage() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingSiswa, setEditingSiswa] =
    useState<Siswa | null>(null);

  const [message, setMessage] = useState("");

  async function loadSiswa() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/data-siswa",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (data.success) {
        setSiswa(data.siswa);
      } else {
        setMessage(
          data.message ||
            "Gagal mengambil data siswa."
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Gagal mengambil data siswa."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSiswa();
  }, []);

  function openCreateForm() {
    setEditingSiswa(null);
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(item: Siswa) {
    setEditingSiswa(item);
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

    const result = editingSiswa
      ? await updateSiswa(formData)
      : await createSiswa(formData);

    setMessage(result.message);

    if (result.success) {
      setShowForm(false);
      setEditingSiswa(null);

      form.reset();

      await loadSiswa();
    }
  }

  async function handleDelete(id: string) {
    const yakin = confirm(
      "Apakah Anda yakin ingin menghapus data siswa ini?"
    );

    if (!yakin) {
      return;
    }

    const formData = new FormData();

    formData.append("id", id);

    const result = await deleteSiswa(formData);

    setMessage(result.message);

    if (result.success) {
      await loadSiswa();
    }
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Data Siswa</h1>

          <p>
            Kelola seluruh data siswa yang
            terdaftar.
          </p>
        </div>

        <button
          type="button"
          className="add-button"
          onClick={openCreateForm}
        >
          <Icon name="plus" />
          Tambah Siswa
        </button>
      </div>

      <div className="management-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="users" />
          </div>

          <div>
            <span>Total Siswa</span>
            <strong>{siswa.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="user" />
          </div>

          <div>
            <span>Siswa Aktif</span>
            <strong>
              {
                siswa.filter((item) => item.aktif)
                  .length
              }
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="kelas" />
          </div>

          <div>
            <span>Jumlah Kelas</span>
            <strong>
              {
                new Set(
                  siswa.map((item) => item.kelas)
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
                  {editingSiswa
                    ? "Edit Data Siswa"
                    : "Tambah Siswa"}
                </h2>

                <p>
                  {editingSiswa
                    ? "Perbarui data siswa."
                    : "Tambahkan data siswa baru."}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="close-form"
              onClick={() => {
                setShowForm(false);
                setEditingSiswa(null);
              }}
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="user-form"
          >
            {editingSiswa && (
              <input
                type="hidden"
                name="id"
                value={editingSiswa._id}
              />
            )}

            <div className="form-group">
              <label>Nama Siswa</label>

              <input
                type="text"
                name="nama"
                defaultValue={
                  editingSiswa?.nama || ""
                }
                placeholder="Masukkan nama siswa"
                required
              />
            </div>

            <div className="form-group">
              <label>NIS</label>

              <input
                type="text"
                name="nis"
                defaultValue={
                  editingSiswa?.nis || ""
                }
                placeholder="Contoh: 2026001"
                required
              />
            </div>

            <div className="form-group">
              <label>Jenis Kelamin</label>

              <select
                name="jenisKelamin"
                defaultValue={
                  editingSiswa?.jenisKelamin || ""
                }
                required
              >
                <option value="">
                  Pilih Jenis Kelamin
                </option>

                <option value="Laki-laki">
                  Laki-laki
                </option>

                <option value="Perempuan">
                  Perempuan
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Kelas</label>

              <input
                type="text"
                name="kelas"
                defaultValue={
                  editingSiswa?.kelas || ""
                }
                placeholder="Contoh: X RPL 1"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                defaultValue={
                  editingSiswa?.email || ""
                }
                placeholder="siswa@educlass.com"
              />
            </div>

            <div className="form-group">
              <label>No. Telepon</label>

              <input
                type="tel"
                name="noTelepon"
                defaultValue={
                  editingSiswa?.noTelepon || ""
                }
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowForm(false);
                  setEditingSiswa(null);
                }}
              >
                Batal
              </button>

              <button
                type="submit"
                className="save-button"
              >
                <Icon name="edit" />
                {editingSiswa
                  ? "Simpan Perubahan"
                  : "Simpan Siswa"}
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
                <th>NIS</th>
                <th>Jenis Kelamin</th>
                <th>Kelas</th>
                <th>Email</th>
                <th>No. Telepon</th>
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
              ) : siswa.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="empty-table"
                  >
                    Belum ada data siswa.
                  </td>
                </tr>
              ) : (
                siswa.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>

                    <td>{item.nama}</td>

                    <td>{item.nis}</td>

                    <td>{item.jenisKelamin}</td>

                    <td>
                      <span className="role-badge">
                        {item.kelas}
                      </span>
                    </td>

                    <td>{item.email || "-"}</td>

                    <td>{item.noTelepon || "-"}</td>

                    <td>
                      <span
                        className={
                          item.aktif
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {item.aktif
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
                            openEditForm(item)
                          }
                        >
                          <Icon name="edit" />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDelete(item._id)
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
