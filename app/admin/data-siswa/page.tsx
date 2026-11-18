"use client";

import { useEffect, useState } from "react";

import Icon from "../../components/Icon";

import {
  createSiswa,
  updateSiswa,
  deleteSiswa,
} from "./actions";

const DAFTAR_JURUSAN = ["RPL", "DKV", "MPLB", "TJKT", "BDR"];
const DAFTAR_TINGKAT = ["X", "XI", "XII"];

type Siswa = {
  _id: string;
  nama: string;
  nis: string;
  jenisKelamin: string;
  jurusan?: string;
  kelas: string;
  email?: string;
  noTelepon?: string;
  aktif: boolean;
};

type Kelas = {
  _id: string;
  namaKelas: string;
  jurusan: string;
  tingkat: string;
};

export default function DataSiswaPage() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [kelasLoading, setKelasLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingSiswa, setEditingSiswa] =
    useState<Siswa | null>(null);

  const [selectedJurusan, setSelectedJurusan] = useState("");
  const [selectedTingkat, setSelectedTingkat] = useState("");
  const [selectedKelasId, setSelectedKelasId] = useState("");

  const [message, setMessage] = useState("");

  const kelasTersedia = kelasList.filter(
    (item) =>
      item.jurusan === selectedJurusan &&
      item.tingkat === selectedTingkat
  );

  async function loadSiswa() {
    try {
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
    void Promise.resolve().then(loadKelas).then(loadSiswa);
  }, []);

  function openCreateForm() {
    setEditingSiswa(null);
    setSelectedJurusan("");
    setSelectedTingkat("");
    setSelectedKelasId("");
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(item: Siswa) {
    setEditingSiswa(item);
    const kelasSiswa = kelasList.find(
      (kelas) =>
        kelas.namaKelas === item.kelas &&
        kelas.jurusan === item.jurusan
    ) || kelasList.find((kelas) => kelas.namaKelas === item.kelas);
    setSelectedJurusan(item.jurusan || kelasSiswa?.jurusan || "");
    setSelectedTingkat(kelasSiswa?.tingkat || "");
    setSelectedKelasId(kelasSiswa?._id || "");
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
      setSelectedJurusan("");
      setSelectedTingkat("");
      setSelectedKelasId("");

      form.reset();

      setLoading(true);
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
      setLoading(true);
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
              <label>NISN</label>

              <input
                type="text"
                name="nis"
                inputMode="numeric"
                maxLength={10}
                pattern="[0-9]{10}"
                title="NISN harus terdiri dari 10 angka."
                defaultValue={
                  editingSiswa?.nis || ""
                }
                placeholder="10 digit NISN"
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
              <label htmlFor="siswa-jurusan">Jurusan</label>
              <select
                id="siswa-jurusan"
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
              <label htmlFor="siswa-tingkat">Tingkat Kelas</label>
              <select
                id="siswa-tingkat"
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
              <label htmlFor="siswa-kelas">Nama Kelas</label>
              <select
                id="siswa-kelas"
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
                <th>NISN</th>
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
