"use client";

import { useEffect, useState } from "react";
import {
  createKelas,
  updateKelas,
  deleteKelas,
} from "./actions";

type Kelas = {
  _id: string;
  namaKelas: string;
  tingkat: string;
  jurusan: string;
  waliKelas: string;
  aktif: boolean;
};

export default function ManajemenKelasPage() {
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingKelas, setEditingKelas] =
    useState<Kelas | null>(null);

  const [message, setMessage] = useState("");

  async function loadKelas() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/kelas",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (data.success) {
        setKelas(data.kelas);
      } else {
        setMessage(
          data.message ||
            "Gagal mengambil data kelas."
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Gagal mengambil data kelas."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKelas();
  }, []);

  function openCreateForm() {
    setEditingKelas(null);
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(item: Kelas) {
    setEditingKelas(item);
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

    const result = editingKelas
      ? await updateKelas(formData)
      : await createKelas(formData);

    setMessage(result.message);

    if (result.success) {
      setShowForm(false);
      setEditingKelas(null);

      event.currentTarget.reset();

      await loadKelas();
    }
  }

  async function handleDelete(id: string) {
    const yakin = confirm(
      "Apakah Anda yakin ingin menghapus kelas ini?"
    );

    if (!yakin) {
      return;
    }

    const formData = new FormData();

    formData.append("id", id);

    const result =
      await deleteKelas(formData);

    setMessage(result.message);

    if (result.success) {
      await loadKelas();
    }
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Manajemen Kelas</h1>

          <p>
            Kelola data kelas, jurusan,
            tingkat, dan wali kelas.
          </p>
        </div>

        <button
          type="button"
          className="add-button"
          onClick={openCreateForm}
        >
          + Tambah Kelas
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
                {editingKelas
                  ? "Edit Kelas"
                  : "Tambah Kelas"}
              </h2>

              <p>
                {editingKelas
                  ? "Perbarui data kelas."
                  : "Tambahkan data kelas baru."}
              </p>
            </div>

            <button
              type="button"
              className="close-form"
              onClick={() => {
                setShowForm(false);
                setEditingKelas(null);
              }}
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="user-form"
          >
            {editingKelas && (
              <input
                type="hidden"
                name="id"
                value={editingKelas._id}
              />
            )}

            <div className="form-group">
              <label>Nama Kelas</label>

              <input
                type="text"
                name="namaKelas"
                defaultValue={
                  editingKelas?.namaKelas || ""
                }
                placeholder="Contoh: XII RPL 1"
                required
              />
            </div>

            <div className="form-group">
              <label>Tingkat</label>

              <select
                name="tingkat"
                defaultValue={
                  editingKelas?.tingkat || ""
                }
                required
              >
                <option value="">
                  Pilih Tingkat
                </option>

                <option value="X">
                  X
                </option>

                <option value="XI">
                  XI
                </option>

                <option value="XII">
                  XII
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Jurusan</label>

              <input
                type="text"
                name="jurusan"
                defaultValue={
                  editingKelas?.jurusan || ""
                }
                placeholder="Contoh: RPL"
                required
              />
            </div>

            <div className="form-group">
              <label>Wali Kelas</label>

              <input
                type="text"
                name="waliKelas"
                defaultValue={
                  editingKelas?.waliKelas || ""
                }
                placeholder="Masukkan nama wali kelas"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowForm(false);
                  setEditingKelas(null);
                }}
              >
                Batal
              </button>

              <button
                type="submit"
                className="save-button"
              >
                {editingKelas
                  ? "Simpan Perubahan"
                  : "Simpan Kelas"}
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
                <th>Nama Kelas</th>
                <th>Tingkat</th>
                <th>Jurusan</th>
                <th>Wali Kelas</th>
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
              ) : kelas.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="empty-table"
                  >
                    Belum ada data kelas.
                  </td>
                </tr>
              ) : (
                kelas.map((item, index) => (
                  <tr key={item._id}>
                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {item.namaKelas}
                    </td>

                    <td>
                      {item.tingkat}
                    </td>

                    <td>
                      {item.jurusan}
                    </td>

                    <td>
                      {item.waliKelas}
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
                            handleDelete(
                              item._id
                            )
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