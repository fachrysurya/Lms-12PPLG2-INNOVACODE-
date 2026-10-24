"use client";

import { useEffect, useMemo, useState } from "react";
import { kirimAsesmen } from "./actions";

type JenisAsesmen = "esai" | "pg";
type FilterAsesmen = "semua" | "belum" | "dikerjakan";

type HasilAsesmenSiswa = {
  jawaban: string[];
  dikerjakanPada?: string;
};

type AsesmenSiswa = {
  _id: string;
  judul: string;
  deskripsi: string;
  mataPelajaran: string;
  kelas: string;
  jenis: JenisAsesmen;
  durasi: number;
  poin: number;
  soal: { pertanyaan: string; opsi: string[] }[];
  guru: string;
  createdAt?: string;
  hasil: HasilAsesmenSiswa | null;
};

type AsesmenResponse = {
  success: boolean;
  message?: string;
  kelas?: string;
  asesmen?: AsesmenSiswa[];
};

function formatTanggal(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(date);
}

export default function AsesmenSiswaPage() {
  const [daftar, setDaftar] = useState<AsesmenSiswa[]>([]);
  const [kelas, setKelas] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState<FilterAsesmen>("semua");
  const [selected, setSelected] = useState<AsesmenSiswa | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/siswa/asesmen", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const data: AsesmenResponse = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Gagal mengambil data asesmen.");
        }
        if (controller.signal.aborted) return;
        setDaftar(Array.isArray(data.asesmen) ? data.asesmen : []);
        setKelas(data.kelas || "");
        setInfo(data.message || "");
        setError("");
      })
      .catch((fetchError: unknown) => {
        if (controller.signal.aborted) return;
        console.error("GET ASESMEN SISWA ERROR:", fetchError);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Gagal mengambil data asesmen."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  const hasilFilter = useMemo(() => {
    const kataKunci = cari.trim().toLocaleLowerCase("id-ID");
    return daftar.filter((item) => {
      const cocokCari =
        !kataKunci ||
        [item.judul, item.mataPelajaran, item.deskripsi, item.guru].some(
          (value) => value?.toLocaleLowerCase("id-ID").includes(kataKunci)
        );
      const cocokFilter =
        filter === "semua" ||
        (filter === "belum" && !item.hasil) ||
        (filter === "dikerjakan" && Boolean(item.hasil));
      return cocokCari && cocokFilter;
    });
  }, [daftar, cari, filter]);

  function bukaAsesmen(item: AsesmenSiswa) {
    setSelected(item);
    setAnswers(item.soal.map(() => ""));
    setSubmitMessage("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || selected.hasil) return;

    setIsSubmitting(true);
    setSubmitMessage("");
    const formData = new FormData();
    formData.set("asesmenId", selected._id);
    formData.set("jawaban", JSON.stringify(answers));

    try {
      const result = await kirimAsesmen(formData);
      setSubmitMessage(result.message);
      if (result.success) {
        setSelected(null);
        setLoading(true);
        setReloadKey((current) => current + 1);
      }
    } catch (submitError) {
      console.error("KIRIM ASESMEN ERROR:", submitError);
      setSubmitMessage("Pengiriman jawaban gagal. Silakan coba kembali.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const belumDikerjakan = daftar.filter((item) => !item.hasil).length;
  const sudahDikerjakan = daftar.length - belumDikerjakan;

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Asesmen</h1>
          <p>
            Asesmen dari guru untuk kelas {kelas || "Anda"}. Kerjakan setiap
            asesmen satu kali.
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
          <span>Total asesmen</span>
          <strong>{loading ? "—" : daftar.length}</strong>
        </div>
        <div>
          <span>Belum dikerjakan</span>
          <strong>{loading ? "—" : belumDikerjakan}</strong>
        </div>
        <div>
          <span>Sudah dikerjakan</span>
          <strong>{loading ? "—" : sudahDikerjakan}</strong>
        </div>
      </div>

      {(error || info) && (
        <div
          className={
            error
              ? "management-message siswa-tugas-error"
              : "management-message"
          }
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
          aria-label="Cari asesmen"
          placeholder="Cari judul asesmen, mata pelajaran, atau guru..."
          value={cari}
          onChange={(event) => setCari(event.target.value)}
        />
        <select
          aria-label="Filter asesmen"
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value as FilterAsesmen)
          }
        >
          <option value="semua">Semua asesmen</option>
          <option value="belum">Belum dikerjakan</option>
          <option value="dikerjakan">Sudah dikerjakan</option>
        </select>
      </div>

      <div className="siswa-tugas-grid">
        {loading ? (
          <div className="siswa-tugas-empty" role="status">
            Memuat asesmen...
          </div>
        ) : error ? (
          <div className="siswa-tugas-empty">
            Data asesmen belum dapat dimuat.
          </div>
        ) : hasilFilter.length === 0 ? (
          <div className="siswa-tugas-empty">
            {daftar.length
              ? "Tidak ada asesmen yang cocok dengan filter."
              : "Belum ada asesmen yang dibagikan untuk kelas Anda."}
          </div>
        ) : (
          hasilFilter.map((item) => (
            <article className="siswa-tugas-card" key={item._id}>
              <div className="siswa-tugas-card-top">
                <span className={`guru-badge guru-badge-${item.jenis}`}>
                  {item.jenis === "pg" ? "Pilihan Ganda" : "Esai"}
                </span>
                <span
                  className={`siswa-tugas-status ${
                    item.hasil ? "is-submitted" : "is-pending"
                  }`}
                >
                  {!item.hasil
                    ? "Belum dikerjakan"
                    : "Sudah dikerjakan"}
                </span>
              </div>
              <h2>{item.judul}</h2>
              <p className="siswa-tugas-description">
                {item.deskripsi || "Tidak ada deskripsi tambahan."}
              </p>
              <div className="siswa-tugas-meta">
                <span>{item.mataPelajaran}</span>
                <span>{item.kelas}</span>
                <span>{item.durasi} menit</span>
                <span>{item.soal.length} soal</span>
              </div>
              <div className="siswa-tugas-deadline">
                <strong>Dibagikan</strong>
                <span>{formatTanggal(item.createdAt)}</span>
              </div>
              <button
                type="button"
                className="view-button siswa-tugas-action"
                onClick={() => bukaAsesmen(item)}
              >
                {item.hasil ? "Lihat hasil" : "Mulai asesmen"}
              </button>
            </article>
          ))
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
            aria-labelledby="siswa-asesmen-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="guru-modal-head">
              <div>
                <h2 id="siswa-asesmen-title">{selected.judul}</h2>
                <small>
                  {selected.mataPelajaran} · {selected.kelas} ·{" "}
                  {selected.guru || "Guru"}
                </small>
              </div>
              <button
                type="button"
                className="close-form"
                aria-label="Tutup asesmen"
                onClick={() => setSelected(null)}
              >
                ×
              </button>
            </div>
            <div className="guru-modal-body siswa-tugas-modal-body">
              {selected.deskripsi && <p>{selected.deskripsi}</p>}
              <p>
                {selected.durasi} menit · {selected.soal.length} soal · Maksimal{" "}
                {selected.poin} poin
              </p>

              {selected.hasil ? (
                <>
                  <div className="siswa-tugas-submission-info">
                    <strong>Jawaban sudah dikirim.</strong>
                    {selected.hasil.dikerjakanPada && (
                      <span>
                        Dikerjakan: {formatTanggal(selected.hasil.dikerjakanPada)}
                      </span>
                    )}
                  </div>
                  {selected.soal.map((soal, index) => {
                    const jawaban = selected.hasil?.jawaban[index] || "";
                    const opsiIndex = Number(jawaban);
                    const jawabanTerkirim =
                      selected.jenis === "pg" &&
                      Number.isInteger(opsiIndex) &&
                      opsiIndex >= 0
                        ? soal.opsi[opsiIndex] || "Jawaban tidak tersedia"
                        : jawaban;

                    return (
                      <div className="siswa-asesmen-question" key={index}>
                        <strong>
                          Soal {index + 1}: {soal.pertanyaan}
                        </strong>
                        <p>{jawabanTerkirim || "Tidak ada jawaban."}</p>
                      </div>
                    );
                  })}
                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setSelected(null)}
                    >
                      Tutup
                    </button>
                  </div>
                </>
              ) : (
                <form className="siswa-tugas-form" onSubmit={handleSubmit}>
                  {selected.soal.map((soal, index) => (
                    <div className="form-group" key={`${selected._id}-${index}`}>
                      <label htmlFor={`asesmen-jawaban-${index}`}>
                        Soal {index + 1}: {soal.pertanyaan}
                      </label>
                      {selected.jenis === "pg" ? (
                        <div
                          className="siswa-asesmen-options"
                          role="radiogroup"
                          aria-label={`Jawaban soal ${index + 1}`}
                        >
                          {soal.opsi.map((opsi, opsiIndex) => (
                            <label
                              className="siswa-asesmen-option"
                              key={opsiIndex}
                            >
                              <input
                                type="radio"
                                name={`asesmen-jawaban-${index}`}
                                value={opsiIndex}
                                checked={answers[index] === String(opsiIndex)}
                                onChange={() =>
                                  setAnswers((current) =>
                                    current.map((answer, answerIndex) =>
                                      answerIndex === index
                                        ? String(opsiIndex)
                                        : answer
                                    )
                                  )
                                }
                                required
                              />
                              <span>{opsi}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <textarea
                          id={`asesmen-jawaban-${index}`}
                          rows={4}
                          value={answers[index] || ""}
                          onChange={(event) =>
                            setAnswers((current) =>
                              current.map((answer, answerIndex) =>
                                answerIndex === index
                                  ? event.target.value
                                  : answer
                              )
                            )
                          }
                          required
                        />
                      )}
                    </div>
                  ))}

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
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="save-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Mengirim..." : "Kirim jawaban"}
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
