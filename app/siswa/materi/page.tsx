"use client";

import { useEffect, useMemo, useState } from "react";

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
  createdAt?: string;
};

type MateriResponse = {
  success: boolean;
  message?: string;
  kelas?: string;
  materi?: Materi[];
};

function youtubeEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    let id: string | null = null;

    if (host === "youtu.be" || host === "www.youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0] || null;
    } else if (
      host === "youtube.com" ||
      host === "www.youtube.com" ||
      host === "m.youtube.com"
    ) {
      if (url.pathname === "/watch") {
        id = url.searchParams.get("v");
      } else {
        id = url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] || null;
      }
    }

    return id && /^[\w-]{11}$/.test(id)
      ? `https://www.youtube.com/embed/${id}`
      : null;
  } catch {
    return null;
  }
}

function tanggalMateri(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(date);
}

export default function MateriSiswaPage() {
  const [daftar, setDaftar] = useState<Materi[]>([]);
  const [kelas, setKelas] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cari, setCari] = useState("");
  const [preview, setPreview] = useState<Materi | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/siswa/materi", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const data: MateriResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Gagal mengambil data materi.");
        }

        if (controller.signal.aborted) return;
        setDaftar(Array.isArray(data.materi) ? data.materi : []);
        setKelas(data.kelas || "");
        setInfo(data.message || "");
      })
      .catch((fetchError: unknown) => {
        if (controller.signal.aborted) return;
        console.error("GET MATERI SISWA ERROR:", fetchError);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Gagal mengambil data materi."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  const hasil = useMemo(() => {
    const kataKunci = cari.trim().toLocaleLowerCase("id-ID");
    if (!kataKunci) return daftar;

    return daftar.filter((item) =>
      [
        item.judul,
        item.mataPelajaran,
        item.deskripsi,
        item.guru,
      ].some((value) => value?.toLocaleLowerCase("id-ID").includes(kataKunci))
    );
  }, [daftar, cari]);
  const previewVideoUrl =
    preview?.tipe === "youtube" && preview.youtubeUrl
      ? youtubeEmbedUrl(preview.youtubeUrl)
      : null;

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Materi Pembelajaran</h1>
          <p>
            Materi dari guru untuk kelas {kelas || "Anda"}.
          </p>
        </div>
      </div>

      <div className="guru-toolbar">
        <div className="guru-search">
          <input
            type="search"
            aria-label="Cari materi"
            placeholder="Cari judul, mata pelajaran, atau guru..."
            value={cari}
            onChange={(event) => setCari(event.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="management-message" role="alert">
          <p>{error}</p>
          <button
            type="button"
            className="edit-button"
            onClick={() => {
              setLoading(true);
              setError("");
              setReloadKey((current) => current + 1);
            }}
          >
            Coba lagi
          </button>
        </div>
      )}

      {!error && info && (
        <div className="management-message" role="status">
          {info}
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
                <th>Guru</th>
                <th>Tipe</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="empty-table">
                    Memuat materi...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="empty-table">
                    Materi belum dapat dimuat.
                  </td>
                </tr>
              ) : hasil.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-table">
                    {daftar.length > 0
                      ? "Materi yang cocok tidak ditemukan."
                      : "Belum ada materi untuk kelas Anda."}
                  </td>
                </tr>
              ) : (
                hasil.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{item.judul}</strong>
                      {item.deskripsi && <div>{item.deskripsi}</div>}
                    </td>
                    <td>{item.mataPelajaran}</td>
                    <td>{item.guru || "-"}</td>
                    <td>
                      <span className={`guru-badge guru-badge-${item.tipe}`}>
                        {item.tipe === "youtube"
                          ? "YouTube"
                          : item.tipe === "pdf"
                            ? "PDF"
                            : "Teks"}
                      </span>
                    </td>
                    <td>{tanggalMateri(item.createdAt)}</td>
                    <td>
                      <button
                        type="button"
                        className="view-button"
                        onClick={() => setPreview(item)}
                      >
                        Lihat Materi
                      </button>
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
          <section
            className="guru-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="materi-preview-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="guru-modal-head">
              <div>
                <h2 id="materi-preview-title">{preview.judul}</h2>
                <small>
                  {preview.mataPelajaran} • {preview.kelas} •{" "}
                  {preview.guru || "Guru"}
                </small>
              </div>
              <button
                type="button"
                className="close-form"
                aria-label="Tutup materi"
                onClick={() => setPreview(null)}
              >
                ×
              </button>
            </div>
            <div className="guru-modal-body">
              {preview.deskripsi && <p>{preview.deskripsi}</p>}

              {preview.tipe === "youtube" &&
                (previewVideoUrl ? (
                  <iframe
                    className="materi-video"
                    src={previewVideoUrl}
                    title={preview.judul}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <p role="alert">
                    Link video tidak valid. Hubungi guru untuk memperbaikinya.
                  </p>
                ))}

              {preview.tipe === "pdf" &&
                (preview.pdfUrl ? (
                  <>
                    <iframe
                      className="materi-pdf"
                      src={preview.pdfUrl}
                      title={preview.pdfNama || preview.judul}
                    />
                    <p>
                      <a
                        href={preview.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Buka {preview.pdfNama || "PDF"} di tab baru
                      </a>
                    </p>
                  </>
                ) : (
                  <p role="alert">
                    File PDF belum tersedia. Hubungi guru untuk memperbaikinya.
                  </p>
                ))}

              {preview.tipe === "teks" &&
                (preview.konten ? (
                  <div className="materi-teks">{preview.konten}</div>
                ) : (
                  <p role="alert">Isi materi belum tersedia.</p>
                ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
