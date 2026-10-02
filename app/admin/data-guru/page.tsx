"use client";

import { useEffect, useState } from "react";

import {
  createGuru,
  updateGuru,
  deleteGuru,
} from "./actions";

type Guru = {
  _id: string;
  nama: string;
  nip: string;
  email: string;
  noTelepon: string;
  mataPelajaran: string;
  aktif: boolean;
};

export default function DataGuruPage() {
  const [guru, setGuru] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingGuru, setEditingGuru] =
    useState<Guru | null>(null);

  const [message, setMessage] = useState("");

  async function loadGuru() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/data-guru",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (data.success) {
        setGuru(data.guru);
      } else {
        setMessage(
          data.message ||
            "Gagal mengambil data guru."
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Gagal mengambil data guru."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGuru();
  }, []);

  function openCreateForm() {
    setEditingGuru(null);
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(item: Guru) {
    setEditingGuru(item);
    setShowForm(true);
    setMessage("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(
      event.currentTarget
    );

    const result = editingGuru
      ? await updateGuru(formData)
      : await createGuru(formData);

    setMessage(result.message);

    if (result.success) {
      setShowForm(false);
      setEditingGuru(null);

      event.currentTarget.reset();

      await loadGuru();
    }
  }

  async function handleDelete(id: string) {
    const yakin = confirm(
      "Apakah Anda yakin ingin menghapus data guru ini?"
    );

    if (!yakin) {
      return;
    }

    const formData = new FormData();

    formData.append("id", id);

    const result = await deleteGuru(formData);

    setMessage(result.message);

    if (result.success) {
      await loadGuru();
    }
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Data Guru</h1>

          <p>
            Kelola data guru yang terdaftar
            di Edu Class.
          </p>
        </div>

        <button
          type="button"
          className="add-button"
          onClick={openCreateForm}
        >
          + Tambah Guru
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
                {editingGuru
                  ? "Edit Data Guru"
                  : "Tambah Guru"}
              </h2>

              <p>
                {editingGuru
                  ? "Perbarui data guru."
                  : "Tambahkan data guru baru."}
              </p>
            </div>

            <button
              type="button"
              className="close-form"
              onClick={() => {
                setShowForm(false);
                setEditingGuru(null);
              }}
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="user-form"
          >
            {editingGuru && (
              <input
                type="hidden"
                name="id"
                value={editingGuru._id}
              />
            )}

            <div className="form-group">
              <label>Nama Guru</label>

              <input
                type="text"
                name="nama"
                defaultValue={
                  editingGuru?.nama || ""
                }
                placeholder="Masukkan nama guru"
                required
              />
            </div>

            <div className="form-group">
              <label>NIP</label>

              <input
                type="text"
                name="nip"
                defaultValue={
                  editingGuru?.nip || ""
                }
                placeholder="Masukkan NIP"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                defaultValue={
                  editingGuru?.email || ""
                }
                placeholder="guru@educlass.com"
                required
              />
            </div>

            <div className="form-group">
              <label>No. Telepon</label>

              <input
                type="tel"
                name="noTelepon"
                defaultValue={
                  editingGuru?.noTelepon || ""
                }
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>

            <div className="form-group">
              <label>Mata Pelajaran</label>

              <input
                type="text"
                name="mataPelajaran"
                defaultValue={
                  editingGuru?.mataPelajaran || ""
                }
                placeholder="Contoh: Matematika"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowForm(false);
                  setEditingGuru(null);
                }}
              >
                Batal
              </button>

              <button
                type="submit"
                className="save-button"
              >
                {editingGuru
                  ? "Simpan Perubahan"
                  : "Simpan Guru"}
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
                <th>Nama Guru</th>
                <th>NIP</th>
                <th>Email</th>
                <th>No. Telepon</th>
                <th>Mata Pelajaran</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="empty-table"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : guru.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="empty-table"
                  >
                    Belum ada data guru.
                  </td>
                </tr>
              ) : (
                guru.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>

                    <td>{item.nama}</td>

                    <td>{item.nip}</td>

                    <td>{item.email}</td>

                    <td>{item.noTelepon}</td>

                    <td>
                      <span className="role-badge">
                        {item.mataPelajaran}
                      </span>
                    </td>

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
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDelete(item._id)
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