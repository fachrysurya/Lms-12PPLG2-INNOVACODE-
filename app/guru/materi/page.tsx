"use client";

import { useEffect, useMemo, useState } from "react";

import Icon from "../../components/Icon";

import {
  createMateri,
  updateMateri,
  deleteMateri,
} from "./actions";

type TipeMateri = "pdf" | "youtube" | "teks";

type Materi = {
  _id: string;
  judul: string;
  deskripsi: string;
  mataPelajaran: string;
  kelas: string;
  tipe: TipeMateri;
  pdfUrl?: string;
  pdfNama?: string;
  youtubeUrl?: string;
  konten?: string;
  guru: string;
  aktif: boolean;
  createdAt?: string;
};

function youtubeId(url: string): string | null {
  if (!url) return null;

  const pola = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];

  for (const p of pola) {
    const match = url.match(p);
    if (match) return match[1];
  }

  return null;
}

export default function GuruMateriPage() {
  const [daftar, setDaftar] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Materi | null>(null);

  const [tipe, setTipe] = useState<TipeMateri>("teks");
  const [pdfData, setPdfData] = useState<{
    url: string;
    nama: string;
  } | null>(null);
  const [cari, setCari] = useState("");
  const [filterTipe, setFilterTipe] = useState("semua");

  const [preview, setPreview] = useState<Materi | null>(null);

  async function muat() {
    try {
      setLoading(true);

      const res = await fetch("/api/guru/materi", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setDaftar(data.materi);
      } else {
        setMessage(data.message || "Gagal mengambil data materi.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Gagal mengambil data materi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    muat();
  }, []);

  const hasil = useMemo(() => {
    return daftar.filter((item) => {
      const cocokCari =
        item.judul.toLowerCase().includes(cari.toLowerCase()) ||
        item.mataPelajaran
          .toLowerCase()
          .includes(cari.toLowerCase()) ||
        item.kelas.toLowerCase().includes(cari.toLowerCase());

      const cocokTipe =
        filterTipe === "semua" || item.tipe === filterTipe;

      return cocokCari && cocokTipe;
    });
  }, [daftar, cari, filterTipe]);

  function bukaTambah() {
    setEditing(null);
    setTipe("teks");
    setPdfData(null);
    setShowForm(true);
    setMessage("");
  }

  function bukaEdit(item: Materi) {
    setEditing(item);
    setTipe(item.tipe);
    setPdfData(
      item.pdfUrl
        ? { url: item.pdfUrl, nama: item.pdfNama || "materi.pdf" }
        : null
    );
    setShowForm(true);
    setMessage("");
  }

  async function tanganiPdf(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage("File harus berformat PDF.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setMessage("Ukuran PDF maksimal 4 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPdfData({
        url: String(reader.result),
        nama: file.name,
      });
      setMessage("");
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.set("tipe", tipe);
    formData.set("pdfUrl", pdfData?.url || "");
    formData.set("pdfNama", pdfData?.nama || "");

    const result = editing
      ? await updateMateri(formData)
      : await createMateri(formData);

    setMessage(result.message);

    if (result.success) {
      setShowForm(false);
      setEditing(null);
      setPdfData(null);
      form.reset();
      await muat();
    }
  }

  async function handleDelete(id: string) {
    const yakin = confirm(
      "Apakah Anda yakin ingin menghapus materi ini?"
    );

    if (!yakin) return;

    const formData = new FormData();
    formData.append("id", id);

    const result = await deleteMateri(formData);

    setMessage(result.message);

    if (result.success) {
      await muat();
    }
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Materi Pembelajaran</h1>
          <p>
            Kelola materi dalam bentuk PDF, video YouTube,
            atau teks.
          </p>
        </div>

        <button
          type="button"
          className="add-button"
          onClick={bukaTambah}
        >
          <Icon name="plus" />
          Tambah Materi
        </button>
      </div>

      <div className="guru-toolbar">
        <div className="guru-search">
          <Icon name="search" />
          <input
            type="text"
            placeholder="Cari materi, mapel, atau kelas..."
            value={cari}
            onChange={(e) => setCari(e.target.value)}
          />
        </div>

        <select
          value={filterTipe}
          onChange={(e) => setFilterTipe(e.target.value)}
        >
          <option value="semua">Semua Tipe</option>
          <option value="pdf">PDF</option>
          <option value="youtube">YouTube</option>
          <option value="teks">Teks</option>
        </select>
      </div>

      {message && (
        <div className="management-message">{message}</div>
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
                  {editing ? "Edit Materi" : "Tambah Materi"}
                </h2>
                <p>
                  {editing
                    ? "Perbarui data materi."
                    : "Tambahkan materi baru untuk siswa."}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="close-form"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="user-form">
            {editing && (
              <input
                type="hidden"
                name="id"
                value={editing._id}
              />
            )}

            <div className="form-group">
              <label>Judul Materi</label>
              <input
                type="text"
                name="judul"
                defaultValue={editing?.judul || ""}
                placeholder="Contoh: Dasar Pemrograman"
                required
              />
            </div>

            <div className="form-group">
              <label>Mata Pelajaran</label>
              <input
                type="text"
                name="mataPelajaran"
                defaultValue={editing?.mataPelajaran || ""}
                placeholder="Contoh: Basis Data"
                required
              />
            </div>

            <div className="form-group">
              <label>Kelas</label>
              <input
                type="text"
                name="kelas"
                defaultValue={editing?.kelas || ""}
                placeholder="Contoh: X RPL 1"
                required
              />
            </div>

            <div className="form-group">
              <label>Deskripsi Singkat</label>
              <input
                type="text"
                name="deskripsi"
                defaultValue={editing?.deskripsi || ""}
                placeholder="Ringkasan materi (opsional)"
              />
            </div>

            <div className="form-group">
              <label>Tipe Materi</label>
              <div className="tipe-pilihan">
                <button
                  type="button"
                  className={
                    tipe === "teks" ? "tipe-aktif" : ""
                  }
                  onClick={() => setTipe("teks")}
                >
                  <Icon name="file" />
                  Teks
                </button>

                <button
                  type="button"
                  className={
                    tipe === "pdf" ? "tipe-aktif" : ""
                  }
                  onClick={() => setTipe("pdf")}
                >
                  <Icon name="file" />
                  PDF
                </button>

                <button
                  type="button"
                  className={
                    tipe === "youtube" ? "tipe-aktif" : ""
                  }
                  onClick={() => setTipe("youtube")}
                >
                  <Icon name="play" />
                  YouTube
                </button>
              </div>
            </div>

            {tipe === "teks" && (
              <div className="form-group">
                <label>Isi Materi</label>
                <textarea
                  name="konten"
                  rows={6}
                  defaultValue={editing?.konten || ""}
                  placeholder="Tulis isi materi di sini..."
                  required
                />
              </div>
            )}

            {tipe === "pdf" && (
              <div className="form-group">
                <label>File PDF</label>

                <label className="upload-drop">
                  <Icon name="upload" />
                  <span>
                    {pdfData
                      ? pdfData.nama
                      : "Pilih file PDF (maks 4 MB)"}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={tanganiPdf}
                    hidden
                  />
                </label>

                {pdfData && (
                  <small className="upload-info">
                    File siap diunggah.
                  </small>
                )}
              </div>
            )}

            {tipe === "youtube" && (
              <div className="form-group">
                <label>Link YouTube</label>
                <input
                  type="url"
                  name="youtubeUrl"
                  defaultValue={editing?.youtubeUrl || ""}
                  placeholder="https://youtube.com/watch?v=..."
                  required
                />
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
              >
                Batal
              </button>

              <button type="submit" className="save-button">
                <Icon name="edit" />
                {editing ? "Simpan Perubahan" : "Simpan Materi"}
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
                <th>Judul Materi</th>
                <th>Mata Pelajaran</th>
                <th>Kelas</th>
                <th>Tipe</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="empty-table">
                    Memuat data...
                  </td>
                </tr>
              ) : hasil.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-table">
                    Belum ada materi.
                  </td>
                </tr>
              ) : (
                hasil.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.judul}</td>
                    <td>{item.mataPelajaran}</td>
                    <td>
                      <span className="role-badge">
                        {item.kelas}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`guru-badge guru-badge-${item.tipe}`}
                      >
                        {item.tipe === "youtube"
                          ? "YouTube"
                          : item.tipe === "pdf"
                            ? "PDF"
                            : "Teks"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="view-button"
                          onClick={() => setPreview(item)}
                        >
                          <Icon name="eye" />
                          Lihat
                        </button>

                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => bukaEdit(item)}
                        >
                          <Icon name="edit" />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleDelete(item._id)}
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

      {preview && (
        <div
          className="guru-modal-backdrop"
          onClick={() => setPreview(null)}
        >
          <div
            className="guru-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="guru-modal-head">
              <div>
                <h2>{preview.judul}</h2>
                <small>
                  {preview.mataPelajaran} • {preview.kelas}
                </small>
              </div>

              <button
                type="button"
                className="close-form"
                onClick={() => setPreview(null)}
              >
                ×
              </button>
            </div>

            <div className="guru-modal-body">
              {preview.deskripsi && <p>{preview.deskripsi}</p>}

              {preview.tipe === "youtube" &&
                (youtubeId(preview.youtubeUrl || "") ? (
                  <iframe
                    className="materi-video"
                    src={`https://www.youtube.com/embed/${youtubeId(
                      preview.youtubeUrl || ""
                    )}`}
                    title={preview.judul}
                    allowFullScreen
                  />
                ) : (
                  <a
                    href={preview.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buka di YouTube
                  </a>
                ))}

              {preview.tipe === "pdf" && preview.pdfUrl && (
                <iframe
                  className="materi-pdf"
                  src={preview.pdfUrl}
                  title={preview.judul}
                />
              )}

              {preview.tipe === "teks" && (
                <div className="materi-teks">
                  {preview.konten}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}