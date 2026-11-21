"use client";

import { useEffect, useState } from "react";

import Icon from "../../components/Icon";

import {
  createLaporan,
  updateLaporan,
  deleteLaporan,
} from "./actions";

type Laporan = {
  _id: string;
  judul: string;
  jenis: string;
  periode: string;
  deskripsi: string;
  dibuatOleh: string;
  aktif: boolean;
  createdAt?: string;
};

const jenisList = [
  "Pemberitahuan",
  "Pengumuman",
  "Update Akademik",
  "Evaluasi",
  "Kegiatan",
  "Umum",
];

const periodeList = [
  "Tahun Ajaran 2025/2026",
  "Semester Ganjil 2025/2026",
  "Semester Genap 2025/2026",
  "Tahun Ajaran 2024/2025",
];

export default function LaporanPage() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Laporan | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<Laporan | null>(
    null
  );

  async function loadData() {
    try {
      const resLaporan = await fetch("/api/admin/laporan", {
        cache: "no-store",
      });
      const dataLaporan = await resLaporan.json();
      if (dataLaporan.success) {
        setLaporan(dataLaporan.laporan);
      } else {
        setMessage(
          dataLaporan.message ||
            "Gagal mengambil data laporan."
        );
      }

    } catch (error) {
      console.error(error);
      setMessage("Gagal mengambil data laporan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, []);

  function openCreateForm() {
    setEditing(null);
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(item: Laporan) {
    setEditing(item);
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

    const result = editing
      ? await updateLaporan(formData)
      : await createLaporan(formData);

    setMessage(result.message);

    if (result.success) {
      setShowForm(false);
      setEditing(null);

      form.reset();

      setLoading(true);
      await loadData();
    }
  }

  async function handleDelete(id: string) {
    const yakin = confirm(
      "Apakah Anda yakin ingin menghapus laporan ini?"
    );

    if (!yakin) {
      return;
    }

    const formData = new FormData();
    formData.append("id", id);

    const result = await deleteLaporan(formData);

    setMessage(result.message);

    if (result.success) {
      setLoading(true);
      await loadData();
    }
  }

  function unduhTeks(item: Laporan) {
    const isi = [
      "========================================",
      "           EDU CLASS",
      "========================================",
      "",
      item.judul.toUpperCase(),
      "",
      `Jenis Laporan : ${item.jenis}`,
      `Periode       : ${item.periode}`,
      `Dibuat Oleh   : ${item.dibuatOleh}`,
      "",
      "----------------------------------------",
      "ISI LAPORAN",
      "----------------------------------------",
      "",
      item.deskripsi || "-",
      "",
      "========================================",
      "Laporan dibuat melalui sistem Edu Class.",
      "========================================",
      "",
    ].join("\n");

    const blob = new Blob([isi], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${item.jenis
      .replaceAll(" ", "-")
      .toLowerCase()}-${item.periode
      .replaceAll(" ", "-")
      .replaceAll("/", "-")
      .toLowerCase()}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  const kartu = [
    {
      icon: "tugas" as const,
      label: "Pemberitahuan",
      nilai: laporan.filter((item) => item.jenis === "Pemberitahuan").length,
    },
    {
      icon: "nilai" as const,
      label: "Pengumuman",
      nilai: laporan.filter((item) => item.jenis === "Pengumuman").length,
    },
    {
      icon: "kelas" as const,
      label: "Update Akademik",
      nilai: laporan.filter((item) => item.jenis === "Update Akademik").length,
    },
    {
      icon: "tugas" as const,
      label: "Total Laporan",
      nilai: laporan.length,
    },
  ];

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Laporan</h1>

          <p>
            Buat, kelola, preview, dan unduh laporan akademik sekolah.
          </p>
        </div>

        <button
          type="button"
          className="add-button"
          onClick={openCreateForm}
        >
          <Icon name="plus" />
          Buat Laporan
        </button>
      </div>

      <div className="dashboard-cards">
        {kartu.map((item) => (
          <div className="dashboard-card" key={item.label}>
            <div className="dashboard-card-icon">
              <Icon name={item.icon} />
            </div>

            <div className="dashboard-card-body">
              <span>{item.label}</span>
              <strong>{item.nilai}</strong>
            </div>
          </div>
        ))}
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
                <Icon name="tugas" />
              </div>

              <div>
                <h2>
                  {editing
                    ? "Edit Laporan"
                    : "Buat Laporan"}
                </h2>

                <p>
                  {editing
                    ? "Perbarui data laporan."
                    : "Buat laporan baru untuk sistem."}
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
              <label>Judul Laporan</label>

              <input
                type="text"
                name="judul"
                defaultValue={editing?.judul || ""}
                placeholder="Contoh: Laporan Akademik Semester Ganjil"
                required
              />
            </div>

            <div className="form-group">
              <label>Jenis Laporan</label>

              <select
                name="jenis"
                defaultValue={editing?.jenis || ""}
                required
              >
                <option value="">Pilih Jenis</option>

                {jenisList.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Periode</label>

              <select
                name="periode"
                defaultValue={editing?.periode || ""}
                required
              >
                <option value="">Pilih Periode</option>

                {periodeList.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Dibuat Oleh</label>

              <input
                type="text"
                name="dibuatOleh"
                defaultValue={
                  editing?.dibuatOleh || "Administrator"
                }
                placeholder="Nama pembuat laporan"
              />
            </div>

            <div className="form-group form-group-full">
              <label>Deskripsi</label>

              <textarea
                name="deskripsi"
                rows={3}
                defaultValue={editing?.deskripsi || ""}
                placeholder="Ringkasan isi laporan"
              />
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

              <button
                type="submit"
                className="save-button"
              >
                <Icon name="edit" />
                {editing
                  ? "Simpan Perubahan"
                  : "Simpan Laporan"}
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
                <th>Judul Laporan</th>
                <th>Jenis</th>
                <th>Periode</th>
                <th>Dibuat Oleh</th>
                <th>Tanggal</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="empty-table">
                    Memuat data...
                  </td>
                </tr>
              ) : laporan.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-table">
                    Belum ada laporan. Klik &quot;Buat
                    Laporan&quot; untuk menambahkan.
                  </td>
                </tr>
              ) : (
                laporan.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>

                    <td>{item.judul}</td>

                    <td>
                      <span className="role-badge">
                        {item.jenis}
                      </span>
                    </td>

                    <td>{item.periode}</td>

                    <td>{item.dibuatOleh}</td>

                    <td>
                      {item.createdAt
                        ? new Date(
                            item.createdAt
                          ).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => setPreview(item)}
                        >
                          <Icon name="eye" />
                          Lihat
                        </button>

                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => openEditForm(item)}
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

      {preview && (
        <div
          className="report-modal-overlay"
          onClick={() => setPreview(null)}
        >
          <div
            className="report-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="report-modal-header">
              <div>
                <span>LAPORAN SEKOLAH</span>
                <h2>{preview.judul}</h2>
              </div>

              <button
                type="button"
                className="report-close-button"
                onClick={() => setPreview(null)}
              >
                ×
              </button>
            </div>

            <div className="report-document">
              <div className="report-document-title">
                <h1>EDU CLASS</h1>
                <h2>{preview.judul}</h2>
                <p>{preview.periode}</p>
              </div>

              <div className="report-document-line"></div>

              <div className="report-document-section">
                <h3>Informasi Laporan</h3>

                <p>
                  Jenis: {preview.jenis} — Dibuat oleh{" "}
                  {preview.dibuatOleh}
                </p>
              </div>

              <div className="report-document-section">
                <h3>Deskripsi</h3>

                <p>{preview.deskripsi || "-"}</p>
              </div>

              <div className="report-document-section">
                <h3>Keterangan</h3>

                <p>
                  Laporan ini dibuat melalui sistem
                  Edu Class dan dapat diunduh untuk
                  keperluan administrasi sekolah.
                </p>
              </div>
            </div>

            <div className="report-modal-footer">
              <button
                type="button"
                className="report-cancel-button"
                onClick={() => setPreview(null)}
              >
                Tutup
              </button>

              <button
                type="button"
                className="report-download-button"
                onClick={() => unduhTeks(preview)}
              >
                Download Laporan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}