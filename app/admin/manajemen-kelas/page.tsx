"use client";

import { useEffect, useState } from "react";

import Icon from "../../components/Icon";

import {
  createKelas,
  updateKelas,
  deleteKelas,
} from "./actions";

const DAFTAR_JURUSAN = ["RPL", "DKV", "MPLB", "TJKT", "BDR"];
const DAFTAR_TINGKAT = ["X", "XI", "XII"];

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
  const [selectedJurusan, setSelectedJurusan] = useState("");
  const [selectedTingkat, setSelectedTingkat] = useState("");
  const [selectedKelasId, setSelectedKelasId] = useState("");
  const [siswaKelas, setSiswaKelas] = useState<string[]>([]);
  const [loadingSiswa, setLoadingSiswa] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingKelas, setEditingKelas] =
    useState<Kelas | null>(null);

  const [message, setMessage] = useState("");

  async function loadKelas() {
    try {
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

  async function loadSiswaKelas(kelasId: string) {
    setLoadingSiswa(true);
    setSiswaKelas([]);

    try {
      const response = await fetch(
        `/api/admin/kelas?kelasId=${encodeURIComponent(kelasId)}`,
        { cache: "no-store" }
      );
      const data = await response.json();

      if (data.success) {
        setSiswaKelas(data.siswa);
      } else {
        setMessage(data.message || "Gagal mengambil daftar siswa.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Gagal mengambil daftar siswa.");
    } finally {
      setLoadingSiswa(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadKelas);
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

    // Simpan referensi form dulu. Setelah `await`, event.currentTarget
    // bisa menjadi null sehingga .reset() melempar error.
    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = editingKelas
      ? await updateKelas(formData)
      : await createKelas(formData);

    setMessage(result.message);

    if (result.success) {
      setShowForm(false);
      setEditingKelas(null);

      form.reset();

      setSelectedJurusan("");
      setSelectedTingkat("");
      setSelectedKelasId("");
      setSiswaKelas([]);
      setLoading(true);
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
      setSelectedJurusan("");
      setSelectedTingkat("");
      setSelectedKelasId("");
      setSiswaKelas([]);
      setLoading(true);
      await loadKelas();
    }
  }

  const kelasTersedia = kelas.filter(
    (item) =>
      item.jurusan === selectedJurusan &&
      item.tingkat === selectedTingkat
  );

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
          <Icon name="plus" />
          Tambah Kelas
        </button>
      </div>

      <div className="management-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="kelas" />
          </div>

          <div>
            <span>Total Kelas</span>
            <strong>{kelas.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="user" />
          </div>

          <div>
            <span>Kelas Aktif</span>
            <strong>
              {
                kelas.filter((item) => item.aktif)
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
            <span>Jurusan</span>
            <strong>
              {
                new Set(
                  kelas.map((item) => item.jurusan)
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

      <div className="management-card" style={{ marginBottom: 25 }}>
        <div className="management-header" style={{ marginTop: 0 }}>
          <div>
            <h2>Daftar Siswa per Kelas</h2>
            <p>Pilih jurusan dan tingkat kelas untuk melihat nama siswa.</p>
          </div>
        </div>

        <div className="user-form">
          <div className="form-group">
            <label htmlFor="filter-jurusan">Jurusan</label>
            <select
              id="filter-jurusan"
              value={selectedJurusan}
              onChange={(event) => {
                setSelectedJurusan(event.target.value);
                setSelectedTingkat("");
                setSelectedKelasId("");
                setSiswaKelas([]);
              }}
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
            <label htmlFor="filter-kelas">Kelas</label>
            <select
              id="filter-kelas"
              value={selectedTingkat}
              onChange={(event) => {
                const tingkat = event.target.value;
                setSelectedTingkat(tingkat);
                setSelectedKelasId("");
                setSiswaKelas([]);
              }}
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
            <label htmlFor="filter-nama-kelas">Nama Kelas</label>
            <select
              id="filter-nama-kelas"
              value={selectedKelasId}
              onChange={(event) => {
                const kelasId = event.target.value;
                setSelectedKelasId(kelasId);
                if (kelasId) {
                  void loadSiswaKelas(kelasId);
                } else {
                  setSiswaKelas([]);
                }
              }}
              disabled={!selectedJurusan || !selectedTingkat}
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
        </div>

        {selectedKelasId && (
          <div className="table-wrapper" style={{ marginTop: 20 }}>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Siswa</th>
                </tr>
              </thead>
              <tbody>
                {loadingSiswa ? (
                  <tr>
                    <td colSpan={2} className="empty-table">
                      Memuat data siswa...
                    </td>
                  </tr>
                ) : siswaKelas.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="empty-table">
                      Belum ada siswa di kelas ini.
                    </td>
                  </tr>
                ) : (
                  siswaKelas.map((nama, index) => (
                    <tr key={`${nama}-${index}`}>
                      <td>{index + 1}</td>
                      <td>{nama}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="user-form-card">
          <div className="form-header">
            <div className="form-title">
              <div className="form-icon">
                <Icon name="kelas" />
              </div>

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
                <Icon name="edit" />
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
                          <Icon name="edit" />
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