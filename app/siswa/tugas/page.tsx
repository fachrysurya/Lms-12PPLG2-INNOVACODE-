"use client";

import { useEffect, useMemo, useState } from "react";
import { kumpulkanTugas } from "./actions";

type JenisTugas = "pdf" | "link" | "teks";
type FilterTugas = "semua" | "belum" | "terkumpul" | "ditutup";

type JawabanTugas = {
  pertanyaan: string;
  jawaban: string;
};

type Pengumpulan = {
  jawaban: JawabanTugas[];
  catatan: string;
  linkJawaban?: string;
  pdfUrl?: string;
  pdfNama?: string;
  dinilai: boolean;
  nilai: number;
  umpanBalik: string;
  dikumpulkanPada?: string;
};

type TugasSiswa = {
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
  soal: { pertanyaan: string }[];
  guru: string;
  createdAt?: string;
  pengumpulan: Pengumpulan | null;
};

type TugasResponse = {
  success: boolean;
  message?: string;
  kelas?: string;
  tugas?: TugasSiswa[];
};

type PdfData = {
  url: string;
  nama: string;
};

function formatTanggal(value?: string): string {
  if (!value) return "Tanpa tenggat";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Tenggat tidak valid"
    : new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function sudahLewat(value?: string): boolean {
  if (!value) return false;
  const date = new Date(value).getTime();
  return !Number.isFinite(date) || date < Date.now();
}

export default function TugasSiswaPage() {
  const [daftar, setDaftar] = useState<TugasSiswa[]>([]);
  const [kelas, setKelas] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState<FilterTugas>("semua");
  const [selected, setSelected] = useState<TugasSiswa | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [catatan, setCatatan] = useState("");
  const [linkJawaban, setLinkJawaban] = useState("");
  const [pdfData, setPdfData] = useState<PdfData | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/siswa/tugas", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const data: TugasResponse = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Gagal mengambil data tugas.");
        }
        if (controller.signal.aborted) return;
        setDaftar(Array.isArray(data.tugas) ? data.tugas : []);
        setKelas(data.kelas || "");
        setInfo(data.message || "");
        setError("");
      })
      .catch((fetchError: unknown) => {
        if (controller.signal.aborted) return;
        console.error("GET TUGAS SISWA ERROR:", fetchError);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Gagal mengambil data tugas."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  const hasil = useMemo(() => {
    const kataKunci = cari.trim().toLocaleLowerCase("id-ID");
    return daftar.filter((item) => {
      const cocokCari =
        !kataKunci ||
        [item.judul, item.mataPelajaran, item.deskripsi, item.guru].some(
          (value) => value?.toLocaleLowerCase("id-ID").includes(kataKunci)
        );
      const ditutup = sudahLewat(item.tenggat);
      const cocokFilter =
        filter === "semua" ||
        (filter === "belum" && !item.pengumpulan && !ditutup) ||
        (filter === "terkumpul" && Boolean(item.pengumpulan)) ||
        (filter === "ditutup" && ditutup && !item.pengumpulan);
      return cocokCari && cocokFilter;
    });
  }, [daftar, cari, filter]);

  function bukaTugas(item: TugasSiswa) {
    setSelected(item);
    setSubmitMessage("");
    setAnswers(
      item.soal.map((soal, index) => {
        const answer = item.pengumpulan?.jawaban[index];
        return answer?.pertanyaan === soal.pertanyaan
          ? answer.jawaban
          : answer?.jawaban || "";
      })
    );
    setCatatan(item.pengumpulan?.catatan || "");
    setLinkJawaban(item.pengumpulan?.linkJawaban || "");
    setPdfData(null);
  }

  function tanganiPdf(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setSubmitMessage("File harus berformat PDF.");
      event.target.value = "";
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setSubmitMessage("Ukuran PDF maksimal 4 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPdfData({ url: String(reader.result), nama: file.name });
      setSubmitMessage("");
    };
    reader.onerror = () => {
      setSubmitMessage("File PDF gagal dibaca. Silakan pilih ulang.");
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;

    setIsSubmitting(true);
    setSubmitMessage("");
    const formData = new FormData();
    formData.set("tugasId", selected._id);
    formData.set("jawaban", JSON.stringify(
      selected.soal.map((soal, index) => ({
        pertanyaan: soal.pertanyaan,
        jawaban: answers[index] || "",
      }))
    ));
    formData.set("catatan", catatan);
    formData.set("linkJawaban", linkJawaban);
    formData.set("pdfUrl", pdfData?.url || "");
    formData.set("pdfNama", pdfData?.nama || "");

    try {
      const result = await kumpulkanTugas(formData);
      setSubmitMessage(result.message);
      if (result.success) {
        setSelected(null);
        setLoading(true);
        setReloadKey((current) => current + 1);
      }
    } catch (submitError) {
      console.error("KUMPULKAN TUGAS ERROR:", submitError);
      setSubmitMessage("Pengumpulan gagal. Silakan coba kembali.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const belum = daftar.filter(
    (item) => !item.pengumpulan && !sudahLewat(item.tenggat)
  ).length;

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Tugas &amp; Pengumpulan</h1>
          <p>
            Tugas dari guru untuk kelas {kelas || "Anda"}. Baca instruksi dan
            kumpulkan jawaban sebelum tenggat.
          </p>
        </div>
        <button
          type="button"
          className="edit-button"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            setReloadKey((current) => current + 1);
          }}
        >
          {loading ? "Memuat..." : "Muat ulang"}
        </button>
      </div>

      <div className="siswa-tugas-summary">
        <div>
          <span>Total tugas</span>
          <strong>{loading ? "—" : daftar.length}</strong>
        </div>
        <div>
          <span>Belum dikumpulkan</span>
          <strong>{loading ? "—" : belum}</strong>
        </div>
        <div>
          <span>Sudah dikumpulkan</span>
          <strong>
            {loading ? "—" : daftar.filter((item) => item.pengumpulan).length}
          </strong>
        </div>
      </div>

      {(error || info) && (
        <div
          className={error ? "management-message siswa-tugas-error" : "management-message"}
          role={error ? "alert" : "status"}
        >
          {error || info}
          {error && (
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
          )}
        </div>
      )}

      <div className="siswa-tugas-toolbar">
        <input
          type="search"
          aria-label="Cari tugas"
          placeholder="Cari judul tugas, mata pelajaran, atau guru..."
          value={cari}
          onChange={(event) => setCari(event.target.value)}
        />
        <select
          aria-label="Filter tugas"
          value={filter}
          onChange={(event) => setFilter(event.target.value as FilterTugas)}
        >
          <option value="semua">Semua tugas</option>
          <option value="belum">Belum dikumpulkan</option>
          <option value="terkumpul">Sudah dikumpulkan</option>
          <option value="ditutup">Tenggat lewat</option>
        </select>
      </div>

      <div className="siswa-tugas-grid">
        {loading ? (
          <div className="siswa-tugas-empty" role="status">
            Memuat tugas...
          </div>
        ) : error ? (
          <div className="siswa-tugas-empty">Data tugas belum dapat dimuat.</div>
        ) : hasil.length === 0 ? (
          <div className="siswa-tugas-empty">
            {daftar.length
              ? "Tidak ada tugas yang cocok dengan filter."
              : "Belum ada tugas yang dibagikan untuk kelas Anda."}
          </div>
        ) : (
          hasil.map((item) => {
            const lewat = sudahLewat(item.tenggat);
            const terkumpul = Boolean(item.pengumpulan);
            return (
              <article className="siswa-tugas-card" key={item._id}>
                <div className="siswa-tugas-card-top">
                  <span className={`guru-badge guru-badge-${item.jenis}`}>
                    {item.jenis === "pdf"
                      ? "PDF"
                      : item.jenis === "link"
                        ? "Link"
                        : "Teks"}
                  </span>
                  <span
                    className={`siswa-tugas-status ${
                      terkumpul
                        ? "is-submitted"
                        : lewat
                          ? "is-closed"
                          : "is-pending"
                    }`}
                  >
                    {terkumpul
                      ? "Sudah dikumpulkan"
                      : lewat
                        ? "Tenggat lewat"
                        : "Belum dikumpulkan"}
                  </span>
                </div>
                <h2>{item.judul}</h2>
                <p className="siswa-tugas-description">
                  {item.deskripsi || "Tidak ada deskripsi tambahan."}
                </p>
                <div className="siswa-tugas-meta">
                  <span>{item.mataPelajaran}</span>
                  <span>{item.kelas}</span>
                  <span>{item.poin} poin</span>
                  <span>{item.soal.length} soal</span>
                </div>
                <div className="siswa-tugas-deadline">
                  <strong>Tenggat</strong>
                  <span>{formatTanggal(item.tenggat)}</span>
                </div>
                <button
                  type="button"
                  className="view-button siswa-tugas-action"
                  onClick={() => bukaTugas(item)}
                >
                  {terkumpul ? "Lihat pengumpulan" : "Lihat & kumpulkan"}
                </button>
              </article>
            );
          })
        )}
      </div>

      {selected && (
        <div
          className="guru-modal-backdrop siswa-tugas-backdrop"
          onClick={() => setSelected(null)}
        >
          <section
            className="guru-modal siswa-tugas-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="siswa-tugas-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="guru-modal-head">
              <div>
                <h2 id="siswa-tugas-title">{selected.judul}</h2>
                <small>
                  {selected.mataPelajaran} · {selected.kelas} ·{" "}
                  {selected.guru || "Guru"}
                </small>
              </div>
              <button
                type="button"
                className="close-form"
                aria-label="Tutup tugas"
                onClick={() => setSelected(null)}
              >
                ×
              </button>
            </div>
            <div className="guru-modal-body siswa-tugas-modal-body">
              {selected.deskripsi && <p>{selected.deskripsi}</p>}
              {selected.konten && (
                <div className="siswa-tugas-instructions">{selected.konten}</div>
              )}
              {selected.jenis === "pdf" && selected.pdfUrl && (
                <p>
                  <a
                    href={selected.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buka lampiran {selected.pdfNama || "PDF"}
                  </a>
                </p>
              )}
              {selected.jenis === "link" && selected.linkUrl && (
                <p>
                  <a
                    href={selected.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buka link tugas
                  </a>
                </p>
              )}
              <p>
                Tenggat: <strong>{formatTanggal(selected.tenggat)}</strong> ·
                Maksimal {selected.poin} poin
              </p>

              {selected.pengumpulan && (
                <div className="siswa-tugas-submission-info">
                  <strong>
                    Jawaban sudah dikumpulkan
                    {selected.pengumpulan.dikumpulkanPada
                      ? ` · ${formatTanggal(selected.pengumpulan.dikumpulkanPada)}`
                      : ""}
                  </strong>
                  {selected.pengumpulan.dinilai && (
                    <span>Nilai: {selected.pengumpulan.nilai}</span>
                  )}
                  {selected.pengumpulan.umpanBalik && (
                    <p>Umpan balik guru: {selected.pengumpulan.umpanBalik}</p>
                  )}
                </div>
              )}

              {selected.pengumpulan?.pdfUrl && !pdfData && (
                <p>
                  <a
                    href={selected.pengumpulan.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Lihat PDF yang sudah dikumpulkan
                  </a>
                </p>
              )}

              {selected.pengumpulan?.dinilai ? (
                <p className="siswa-tugas-closed-note">
                  Tugas sudah dinilai guru dan pengumpulan tidak dapat diubah.
                </p>
              ) : sudahLewat(selected.tenggat) ? (
                <p className="siswa-tugas-closed-note">
                  Tenggat sudah lewat. Pengumpulan dan perubahan jawaban
                  ditutup.
                </p>
              ) : (
                <form className="siswa-tugas-form" onSubmit={handleSubmit}>
                  {selected.soal.map((soal, index) => (
                    <div className="form-group" key={`${selected._id}-${index}`}>
                      <label htmlFor={`jawaban-${index}`}>
                        Soal {index + 1}: {soal.pertanyaan}
                      </label>
                      <textarea
                        id={`jawaban-${index}`}
                        rows={3}
                        value={answers[index] || ""}
                        onChange={(event) =>
                          setAnswers((current) =>
                            current.map((value, answerIndex) =>
                              answerIndex === index
                                ? event.target.value
                                : value
                            )
                          )
                        }
                        required
                      />
                    </div>
                  ))}

                  {selected.jenis === "link" && (
                    <div className="form-group">
                      <label htmlFor="link-jawaban">Link jawaban</label>
                      <input
                        id="link-jawaban"
                        type="url"
                        value={linkJawaban}
                        onChange={(event) => setLinkJawaban(event.target.value)}
                        placeholder="https://..."
                        required
                      />
                    </div>
                  )}

                  {selected.jenis === "pdf" && (
                    <div className="form-group">
                      <label>PDF jawaban (maksimal 4 MB)</label>
                      <label className="upload-drop">
                        <span>
                          {pdfData?.nama ||
                            selected.pengumpulan?.pdfNama ||
                            "Pilih file PDF"}
                        </span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={tanganiPdf}
                          hidden
                        />
                      </label>
                    </div>
                  )}

                  {(selected.jenis !== "link" ||
                    selected.soal.length > 0) && (
                    <div className="form-group">
                      <label htmlFor="catatan-jawaban">
                        {selected.jenis === "teks" && !selected.soal.length
                          ? "Jawaban"
                          : "Catatan tambahan"}
                      </label>
                      <textarea
                        id="catatan-jawaban"
                        rows={4}
                        value={catatan}
                        onChange={(event) => setCatatan(event.target.value)}
                        placeholder="Tulis jawaban atau catatan..."
                        required={
                          selected.jenis === "teks" &&
                          selected.soal.length === 0
                        }
                      />
                    </div>
                  )}

                  {submitMessage && (
                    <p className="siswa-tugas-submit-message" role="alert">
                      {submitMessage}
                    </p>
                  )}

                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setSelected(null)}
                      disabled={isSubmitting}
                    >
                      Tutup
                    </button>
                    <button
                      type="submit"
                      className="save-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Mengirim..."
                        : selected.pengumpulan
                          ? "Perbarui Pengumpulan"
                          : "Kumpulkan Tugas"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
