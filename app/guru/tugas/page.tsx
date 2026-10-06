"use client";

import { useEffect, useMemo, useState } from "react";

import Icon from "../../components/Icon";

import {
  createTugas,
  updateTugas,
  deleteTugas,
} from "./actions";

type JenisTugas = "pdf" | "link" | "teks";

type SoalIsian = {
  _id?: string;
  pertanyaan: string;
  kunciJawaban: string;
};

type Tugas = {
  _id: string;
  judul: string;
  deskripsi: string;
  mataPelajaran: string;
  kelas: string;
  jenis: JenisTugas;
  pdfUrl?: string;
  pdfNama?: string;
  linkUrl?: string;
  konten?: string;
  tenggat?: string;
  poin: number;
  soal: SoalIsian[];
  guru: string;
  aktif: boolean;
  createdAt?: string;
};

function statusTenggat(tenggat?: string) {
  if (!tenggat) {
    return { label: "Tanpa Tenggat", kelas: "netral" };
  }

  const waktu = new Date(tenggat).getTime();
  const sisa = waktu - Date.now();

  if (sisa < 0) {
    return { label: "Selesai", kelas: "selesai" };
  }

  const hari = Math.floor(sisa / 86400000);

  if (hari <= 1) {
    return { label: "Mendesak", kelas: "mendesak" };
  }

  return { label: `${hari} hari lagi`, kelas: "aktif" };
}

const soalKosong: SoalIsian = {
  pertanyaan: "",
  kunciJawaban: "",
};

export default function GuruTugasPage() {
  const [daftar, setDaftar] = useState<Tugas[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Tugas | null>(null);

  const [jenis, setJenis] = useState<JenisTugas>("teks");
  const [pdfData, setPdfData] = useState<{
    url: string;
    nama: string;
  } | null>(null);
  const [soal, setSoal] = useState<SoalIsian[]>([
    { ...soalKosong },
  ]);

  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState("semua");

  const [detail, setDetail] = useState<Tugas | null>(null);

  async function muat() {
    try {
      setLoading(true);

      const res = await fetch("/api/guru/tugas", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setDaftar(data.tugas);
      } else {
        setMessage(data.message || "Gagal mengambil data tugas.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Gagal mengambil data tugas.");
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

      const cocokFilter =
        filter === "semua" || item.jenis === filter;

      return cocokCari && cocokFilter;
    });
  }, [daftar, cari, filter]);

  const ringkas = useMemo(() => {
    const total = daftar.length;
    const berjalan = daftar.filter(
      (item) =>
        item.tenggat &&
        new Date(item.tenggat).getTime() > Date.now()
    ).length;
    const selesai = daftar.filter(
      (item) =>
        item.tenggat &&
        new Date(item.tenggat).getTime() <= Date.now()
    ).length;

    return { total, berjalan, selesai };
  }, [daftar]);

  function bukaTambah() {
    setEditing(null);
    setJenis("teks");
    setPdfData(null);
    setSoal([{ ...soalKosong }]);
    setShowForm(true);
    setMessage("");
  }

  function bukaEdit(item: Tugas) {
    setEditing(item);
    setJenis(item.jenis);
    setPdfData(
      item.pdfUrl
        ? { url: item.pdfUrl, nama: item.pdfNama || "tugas.pdf" }
        : null
    );
    setSoal(
      item.soal?.length
        ? item.soal.map((s) => ({
            pertanyaan: s.pertanyaan,
            kunciJawaban: s.kunciJawaban,
          }))
        : [{ ...soalKosong }]
    );
    setShowForm(true);
    setMessage("");
  }

  function tanganiPdf(
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
      setPdfData({ url: String(reader.result), nama: file.name });
      setMessage("");
    };

    reader.readAsDataURL(file);
  }

  function ubahSoal(
    index: number,
    field: keyof SoalIsian,
    nilai: string
  ) {
    setSoal((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: nilai } : item
      )
    );
  }

  function tambahSoal() {
    setSoal((prev) => [...prev, { ...soalKosong }]);
  }

  function hapusSoal(index: number) {
    setSoal((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.set("jenis", jenis);
    formData.set("pdfUrl", pdfData?.url || "");
    formData.set("pdfNama", pdfData?.nama || "");

    const soalBersih = soal.filter((s) =>
      s.pertanyaan.trim()
    );

    formData.set("soal", JSON.stringify(soalBersih));

    const result = editing
      ? await updateTugas(formData)
      : await createTugas(formData);

    setMessage(result.message);

    if (result.success) {
      setShowForm(false);
      setEditing(null);
      setPdfData(null);
      setSoal([{ ...soalKosong }]);
      form.reset();
      await muat();
    }
  }

  async function handleDelete(id: string) {
    const yakin = confirm(
      "Apakah Anda yakin ingin menghapus tugas ini?"
    );

    if (!yakin) return;

    const formData = new FormData();
    formData.append("id", id);

    const result = await deleteTugas(formData);

    setMessage(result.message);

    if (result.success) {
      await muat();
    }
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Tugas</h1>
          <p>Buat dan kelola tugas siswa.</p>
        </div>

        <button
          type="button"
          className="add-button"
          onClick={bukaTambah}
        >
          <Icon name="plus" />
          Tambah Tugas
        </button>
      </div>

      <div className="management-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="tugas" />
          </div>
          <div>
            <span>Total Tugas</span>
            <strong>{ringkas.total}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="check" />
          </div>
          <div>
            <span>Tugas Berjalan</span>
            <strong>{ringkas.berjalan}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="alert" />
          </div>
          <div>
            <span>Sudah Selesai</span>
            <strong>{ringkas.selesai}</strong>
          </div>
        </div>
      </div>

      <div className="guru-toolbar">
        <div className="guru-search">
          <Icon name="search" />
          <input
            type="text"
            placeholder="Cari tugas, mapel, atau kelas..."
            value={cari}
            onChange={(e) => setCari(e.target.value)}
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="semua">Semua Jenis</option>
          <option value="pdf">PDF</option>
          <option value="link">Link</option>
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
                <Icon name="tugas" />
              </div>

              <div>
                <h2>{editing ? "Edit Tugas" : "Tambah Tugas"}</h2>
                <p>
                  {editing
                    ? "Perbarui data tugas."
                    : "Buat tugas baru untuk siswa."}
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
              <label>Judul Tugas</label>
              <input
                type="text"
                name="judul"
                defaultValue={editing?.judul || ""}
                placeholder="Contoh: Tugas Database"
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
              <label>Deskripsi</label>
              <input
                type="text"
                name="deskripsi"
                defaultValue={editing?.deskripsi || ""}
                placeholder="Penjelasan singkat tugas (opsional)"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tenggat</label>
                <input
                  type="datetime-local"
                  name="tenggat"
                  defaultValue={editing?.tenggat || ""}
                />
              </div>

              <div className="form-group">
                <label>Poin Maksimal</label>
                <input
                  type="number"
                  name="poin"
                  min={0}
                  defaultValue={editing?.poin ?? 100}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Jenis Tugas</label>
              <div className="tipe-pilihan">
                <button
                  type="button"
                  className={jenis === "teks" ? "tipe-aktif" : ""}
                  onClick={() => setJenis("teks")}
                >
                  <Icon name="file" />
                  Teks
                </button>

                <button
                  type="button"
                  className={jenis === "pdf" ? "tipe-aktif" : ""}
                  onClick={() => setJenis("pdf")}
                >
                  <Icon name="file" />
                  PDF
                </button>

                <button
                  type="button"
                  className={jenis === "link" ? "tipe-aktif" : ""}
                  onClick={() => setJenis("link")}
                >
                  <Icon name="link" />
                  Link
                </button>
              </div>
            </div>

            {jenis === "teks" && (
              <div className="form-group">
                <label>Instruksi Tugas</label>
                <textarea
                  name="konten"
                  rows={5}
                  defaultValue={editing?.konten || ""}
                  placeholder="Tulis instruksi tugas..."
                  required
                />
              </div>
            )}

            {jenis === "pdf" && (
              <div className="form-group">
                <label>Lampiran PDF</label>

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

            {jenis === "link" && (
              <div className="form-group">
                <label>Link Tugas</label>
                <input
                  type="url"
                  name="linkUrl"
                  defaultValue={editing?.linkUrl || ""}
                  placeholder="https://..."
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Soal Isian (opsional)</label>

              <div className="soal-list">
                {soal.map((item, index) => (
                  <div className="soal-item" key={index}>
                    <div className="soal-head">
                      <span>Soal {index + 1}</span>

                      {soal.length > 1 && (
                        <button
                          type="button"
                          className="soal-hapus"
                          onClick={() => hapusSoal(index)}
                        >
                          <Icon name="trash" />
                        </button>
                      )}
                    </div>

                    <textarea
                      rows={2}
                      value={item.pertanyaan}
                      onChange={(e) =>
                        ubahSoal(index, "pertanyaan", e.target.value)
                      }
                      placeholder="Pertanyaan..."
                    />

                    <input
                      type="text"
                      value={item.kunciJawaban}
                      onChange={(e) =>
                        ubahSoal(
                          index,
                          "kunciJawaban",
                          e.target.value
                        )
                      }
                      placeholder="Kunci jawaban (opsional)"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="soal-tambah"
                onClick={tambahSoal}
              >
                <Icon name="plus" />
                Tambah Soal
              </button>
            </div>

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
                {editing ? "Simpan Perubahan" : "Simpan Tugas"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="guru-kartu-grid">
        {loading ? (
          <p className="guru-panel-empty">Memuat data...</p>
        ) : hasil.length === 0 ? (
          <p className="guru-panel-empty">Belum ada tugas.</p>
        ) : (
          hasil.map((item) => {
            const st = statusTenggat(item.tenggat);

            return (
              <div className="guru-kartu" key={item._id}>
                <div className="guru-kartu-top">
                  <span
                    className={`guru-badge guru-badge-${item.jenis}`}
                  >
                    {item.jenis === "pdf"
                      ? "PDF"
                      : item.jenis === "link"
                        ? "Link"
                        : "Teks"}
                  </span>

                  <span
                    className={`guru-status guru-status-${st.kelas}`}
                  >
                    {st.label}
                  </span>
                </div>

                <h3>{item.judul}</h3>

                <p>{item.deskripsi || "Tanpa deskripsi."}</p>

                <div className="guru-kartu-meta">
                  <span>{item.mataPelajaran}</span>
                  <span>{item.kelas}</span>
                  <span>{item.poin} poin</span>
                  <span>{item.soal?.length || 0} soal</span>
                </div>

                <div className="guru-kartu-aksi">
                  <button
                    type="button"
                    className="view-button"
                    onClick={() => setDetail(item)}
                  >
                    <Icon name="eye" />
                    Detail
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
              </div>
            );
          })
        )}
      </div>

      {detail && (
        <div
          className="guru-modal-backdrop"
          onClick={() => setDetail(null)}
        >
          <div
            className="guru-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="guru-modal-head">
              <div>
                <h2>{detail.judul}</h2>
                <small>
                  {detail.mataPelajaran} • {detail.kelas} •{" "}
                  {detail.poin} poin
                </small>
              </div>

              <button
                type="button"
                className="close-form"
                onClick={() => setDetail(null)}
              >
                ×
              </button>
            </div>

            <div className="guru-modal-body">
              {detail.deskripsi && <p>{detail.deskripsi}</p>}

              {detail.jenis === "teks" && (
                <div className="materi-teks">{detail.konten}</div>
              )}

              {detail.jenis === "pdf" && detail.pdfUrl && (
                <iframe
                  className="materi-pdf"
                  src={detail.pdfUrl}
                  title={detail.judul}
                />
              )}

              {detail.jenis === "link" && detail.linkUrl && (
                <a
                  href={detail.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="link" />
                  Buka Link Tugas
                </a>
              )}

              {detail.soal?.length > 0 && (
                <div className="soal-preview">
                  <h4>Soal Isian</h4>

                  {detail.soal.map((s, i) => (
                    <div key={i} className="soal-preview-item">
                      <strong>
                        {i + 1}. {s.pertanyaan}
                      </strong>

                      {s.kunciJawaban && (
                        <small>
                          Kunci: {s.kunciJawaban}
                        </small>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}