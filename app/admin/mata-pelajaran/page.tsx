"use client";

import { useEffect, useState } from "react";

import Icon from "../../components/Icon";

import {
  createMataPelajaran,
  updateMataPelajaran,
  deleteMataPelajaran,
} from "./actions";

type MataPelajaran = {
  _id: string;
  namaMapel?: string;
  kodeMapel?: string;
  kelompok?: string;
  guruPengampu?: string;
  aktif?: boolean;
};

export default function MataPelajaranPage() {
  const [mapel, setMapel] = useState<MataPelajaran[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingMapel, setEditingMapel] =
    useState<MataPelajaran | null>(null);

  const [message, setMessage] = useState("");

  async function loadMapel() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/mata-pelajaran",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (data.success) {
        setMapel(data.data);
      } else {
        setMessage(
          data.message ||
            "Gagal mengambil data mata pelajaran."
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Gagal mengambil data mata pelajaran."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMapel();
  }, []);

  function openCreateForm() {
    setEditingMapel(null);
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(item: MataPelajaran) {
    setEditingMapel(item);
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

    const result = editingMapel
      ? await updateMataPelajaran(formData)
      : await createMataPelajaran(formData);

    setMessage(result.message);

    if (result.success) {
      setShowForm(false);
      setEditingMapel(null);

      form.reset();

      await loadMapel();
    }
  }

  async function handleDelete(id: string) {
    const yakin = confirm(
      "Apakah Anda yakin ingin menghapus mata pelajaran ini?"
    );

    if (!yakin) {
      return;
    }

    const formData = new FormData();

    formData.append("id", id);

    const result = await deleteMataPelajaran(formData);

    setMessage(result.message);

    if (result.success) {
      await loadMapel();
    }
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Mata Pelajaran</h1>

          <p>Kelola mata pelajaran sekolah.</p>
        </div>

        <button
          type="button"
          className="add-button"
          onClick={openCreateForm}
        >
          <Icon name="plus" />
          Tambah Mata Pelajaran
        </button>
      </div>

      <div className="management-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="book" />
          </div>

          <div>
            <span>Total Mata Pelajaran</span>
            <strong>{mapel.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="edit" />
          </div>

          <div>
            <span>Mapel Aktif</span>
            <strong>
              {
                mapel.filter((item) => item.aktif)
                  .length
              }
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="guru" />
          </div>

          <div>
            <span>Kelompok</span>
            <strong>
              {
                new Set(
                  mapel.map((item) => item.kelompok)
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
                <Icon name="book" />
              </div>

              <div>
                <h2>
                  {editingMapel
                    ? "Edit Mata Pelajaran"
                    : "Tambah Mata Pelajaran"}
                </h2>

                <p>
                  {editingMapel
                    ? "Perbarui data mata pelajaran."
                    : "Tambahkan mata pelajaran baru."}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="close-form"
              onClick={() => {
                setShowForm(false);
                setEditingMapel(null);
              }}
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="user-form"
          >
            {editingMapel && (
              <input
                type="hidden"
                name="id"
                value={editingMapel._id}
              />
            )}

            <div className="form-group">
              <label>Nama Mata Pelajaran</label>

              <input
                type="text"
                name="namaMapel"
                defaultValue={
                  editingMapel?.namaMapel || ""
                }
                placeholder="Contoh: Bahasa Indonesia"
                required
              />
            </div>

            <div className="form-group">
              <label>Kode</label>

              <input
                type="text"
                name="kodeMapel"
                defaultValue={
                  editingMapel?.kodeMapel || ""
                }
                placeholder="Contoh: BIND"
                required
              />
            </div>

            <div className="form-group">
              <label>Kelompok</label>

              <select
                name="kelompok"
                defaultValue={
                  editingMapel?.kelompok || ""
                }
                required
              >
                <option value="">
                  Pilih Kelompok
                </option>

                <option value="Umum">
                  Umum
                </option>

                <option value="Kejuruan">
                  Kejuruan
                </option>

                <option value="Muatan Lokal">
                  Muatan Lokal
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Guru Pengampu</label>

              <input
                type="text"
                name="guruPengampu"
                defaultValue={
                  editingMapel?.guruPengampu || ""
                }
                placeholder="Masukkan nama guru pengampu"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowForm(false);
                  setEditingMapel(null);
                }}
              >
                Batal
              </button>

              <button
                type="submit"
                className="save-button"
              >
                <Icon name="edit" />
                {editingMapel
                  ? "Simpan Perubahan"
                  : "Simpan Mata Pelajaran"}
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
                <th>Mata Pelajaran</th>
                <th>Kode</th>
                <th>Kelompok</th>
                <th>Guru Pengampu</th>
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
              ) : mapel.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="empty-table"
                  >
                    Belum ada data mata pelajaran.
                  </td>
                </tr>
              ) : (
                mapel.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>

                    <td>
                      {item.namaMapel || "-"}
                    </td>

                    <td>
                      {item.kodeMapel ? (
                        <span className="role-badge">
                          {item.kodeMapel}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>{item.kelompok || "-"}</td>

                    <td>
                      {item.guruPengampu || "-"}
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
