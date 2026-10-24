"use client";

import { useEffect, useState } from "react";
import { nilaiHasilAsesmen, nilaiPengumpulanTugas } from "./actions";

type PengumpulanNilai = {
  _id: string;
  namaSiswa: string;
  kelas: string;
  mataPelajaran: string;
  tugasId: string;
  judulTugas: string;
  jawaban: { pertanyaan: string; jawaban: string }[];
  catatan: string;
  linkJawaban?: string;
  pdfUrl?: string;
  pdfNama?: string;
  dapatDinilaiOtomatis: boolean;
  dinilai: boolean;
  nilai: number;
  metodePenilaian: string;
  umpanBalik: string;
  dikumpulkanPada?: string;
};

type PengumpulanResponse = {
  success: boolean;
  message?: string;
  pengumpulan?: PengumpulanNilai[];
};

type HasilAsesmenGuru = {
  _id: string;
  namaSiswa: string;
  kelas: string;
  mataPelajaran: string;
  asesmenId: string;
  judulAsesmen: string;
  jenis: "esai" | "pg";
  soal: { pertanyaan: string; jawaban: string }[];
  skor: number;
  dinilai: boolean;
  umpanBalik: string;
  dikerjakanPada?: string;
};

type HasilAsesmenResponse = {
  success: boolean;
  message?: string;
  hasil?: HasilAsesmenGuru[];
};

function formatAngka(nilai: number): string {
  return Number.isInteger(nilai) ? String(nilai) : nilai.toFixed(2);
}

function formatTanggal(value?: string): string {
  if (!value) return "-";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function GuruNilaiPage() {
  const [pengumpulan, setPengumpulan] = useState<PengumpulanNilai[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [gradingId, setGradingId] = useState("");
  const [hasilAsesmen, setHasilAsesmen] = useState<HasilAsesmenGuru[]>([]);
  const [loadingAsesmen, setLoadingAsesmen] = useState(true);
  const [asesmenMessage, setAsesmenMessage] = useState("");
  const [gradingAsesmenId, setGradingAsesmenId] = useState("");

  async function muatPengumpulan() {
    try {
      setLoading(true);

      const response = await fetch("/api/guru/nilai/tugas", {
        cache: "no-store",
      });
      const data: PengumpulanResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Gagal mengambil pengumpulan tugas siswa."
        );
      }

      setPengumpulan(
        Array.isArray(data.pengumpulan) ? data.pengumpulan : []
      );
      setMessage("");
    } catch (error) {
      console.error("GET PENGUMPULAN NILAI GURU ERROR:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal mengambil pengumpulan tugas siswa."
      );
    } finally {
      setLoading(false);
    }
  }

  async function muatHasilAsesmen() {
    try {
      setLoadingAsesmen(true);
      const response = await fetch("/api/guru/nilai/asesmen", {
        cache: "no-store",
      });
      const data: HasilAsesmenResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal mengambil hasil asesmen.");
      }

      setHasilAsesmen(Array.isArray(data.hasil) ? data.hasil : []);
      setAsesmenMessage("");
    } catch (error) {
      console.error("GET HASIL ASESMEN GURU ERROR:", error);
      setAsesmenMessage(
        error instanceof Error
          ? error.message
          : "Gagal mengambil hasil asesmen."
      );
    } finally {
      setLoadingAsesmen(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => {
      void muatPengumpulan();
      void muatHasilAsesmen();
    });
  }, []);

  async function simpanPenilaian(
    formData: FormData,
    item: PengumpulanNilai,
    metode: "otomatis" | "manual"
  ) {
    setGradingId(item._id);
    setMessage("");
    formData.set("pengumpulanId", item._id);
    formData.set("metode", metode);

    try {
      const result = await nilaiPengumpulanTugas(formData);
      setMessage(result.message);

      if (result.success) {
        await muatPengumpulan();
      }
    } catch (error) {
      console.error("SIMPAN PENILAIAN TUGAS ERROR:", error);
      setMessage("Gagal menyimpan penilaian tugas.");
    } finally {
      setGradingId("");
    }
  }

  async function handleNilaiManual(
    event: React.FormEvent<HTMLFormElement>,
    item: PengumpulanNilai
  ) {
    event.preventDefault();
    await simpanPenilaian(
      new FormData(event.currentTarget),
      item,
      "manual"
    );
  }

  async function handleNilaiAsesmen(
    event: React.FormEvent<HTMLFormElement>,
    item: HasilAsesmenGuru
  ) {
    event.preventDefault();
    setGradingAsesmenId(item._id);
    setAsesmenMessage("");
    const formData = new FormData(event.currentTarget);
    formData.set("hasilId", item._id);

    try {
      const result = await nilaiHasilAsesmen(formData);
      setAsesmenMessage(result.message);
      if (result.success) {
        await muatHasilAsesmen();
      }
    } catch (error) {
      console.error("SIMPAN NILAI ASESMEN GURU ERROR:", error);
      setAsesmenMessage("Gagal menyimpan nilai asesmen.");
    } finally {
      setGradingAsesmenId("");
    }
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Penilaian Tugas</h1>
          <p>
            Tinjau pengumpulan tugas dan berikan nilai secara otomatis
            atau manual.
          </p>
        </div>
        <button
          type="button"
          className="add-button"
          onClick={muatPengumpulan}
          disabled={loading}
        >
          {loading ? "Memuat..." : "Muat ulang"}
        </button>
      </div>

      {message && (
        <div className="management-message" role="status">
          {message}
        </div>
      )}

      <div className="dashboard-table nilai-tabel">
        {loading ? (
          <p className="guru-panel-empty">Memuat pengumpulan tugas...</p>
        ) : pengumpulan.length === 0 ? (
          <p className="guru-panel-empty">
            Belum ada tugas yang dikumpulkan siswa untuk tugas Anda.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Siswa</th>
                <th>Tugas</th>
                <th>Hasil Pengerjaan</th>
                <th>Penilaian</th>
              </tr>
            </thead>
            <tbody>
              {pengumpulan.map((item) => (
                <tr key={item._id}>
                  <td>
                    <strong>{item.namaSiswa}</strong>
                    <small className="nilai-nis">{item.kelas || "-"}</small>
                  </td>
                  <td>
                    <strong>{item.judulTugas}</strong>
                    <small className="nilai-nis">
                      {item.mataPelajaran || "-"}
                    </small>
                    <small className="nilai-nis">
                      Dikumpulkan: {formatTanggal(item.dikumpulkanPada)}
                    </small>
                  </td>
                  <td>
                    {item.jawaban.length > 0 && (
                      <div>
                        {item.jawaban.map((jawaban, index) => (
                          <p key={`${item._id}-jawaban-${index}`}>
                            <strong>{jawaban.pertanyaan}</strong>
                            <br />
                            {jawaban.jawaban || "-"}
                          </p>
                        ))}
                      </div>
                    )}
                    {item.catatan && <p>{item.catatan}</p>}
                    {item.linkJawaban && isHttpUrl(item.linkJawaban) && (
                      <p>
                        <a
                          href={item.linkJawaban}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Buka link jawaban
                        </a>
                      </p>
                    )}
                    {item.pdfUrl && (
                      <p>
                        <a
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Lihat PDF {item.pdfNama || "jawaban"}
                        </a>
                      </p>
                    )}
                    {item.jawaban.length === 0 &&
                      !item.catatan &&
                      !item.linkJawaban &&
                      !item.pdfUrl && <span>-</span>}
                  </td>
                  <td>
                    <form
                      className="nilai-penilaian-form"
                      onSubmit={(event) => handleNilaiManual(event, item)}
                    >
                      <label>
                        Nilai manual (0-100)
                        <input
                          type="number"
                          name="nilai"
                          min={0}
                          max={100}
                          step="0.01"
                          defaultValue={item.dinilai ? item.nilai : ""}
                          required
                        />
                      </label>
                      <label>
                        Umpan balik
                        <textarea
                          name="umpanBalik"
                          rows={2}
                          defaultValue={item.umpanBalik}
                        />
                      </label>
                      <div className="action-buttons">
                        <button
                          type="submit"
                          className="edit-button"
                          disabled={gradingId === item._id}
                        >
                          {gradingId === item._id
                            ? "Menyimpan..."
                            : "Simpan manual"}
                        </button>
                        {item.dapatDinilaiOtomatis && (
                          <button
                            type="button"
                            className="nilai-final-btn kecil"
                            disabled={gradingId === item._id}
                            onClick={(event) => {
                              const form = event.currentTarget.form;
                              if (form) {
                                void simpanPenilaian(
                                  new FormData(form),
                                  item,
                                  "otomatis"
                                );
                              }
                            }}
                          >
                            Nilai otomatis
                          </button>
                        )}
                      </div>
                    </form>
                    <small className="nilai-nis">
                      {item.dinilai
                        ? `Sudah dinilai (${item.metodePenilaian || "manual"}): ${formatAngka(item.nilai)}`
                        : "Belum dinilai"}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <h2>Hasil Asesmen (Khusus Guru)</h2>
            <p>
              Nilai asesmen hanya dapat dilihat dan dikelola oleh guru.
              Nilai ini tidak ditampilkan pada halaman Nilai siswa.
            </p>
          </div>
          <button
            type="button"
            className="add-button"
            onClick={muatHasilAsesmen}
            disabled={loadingAsesmen}
          >
            {loadingAsesmen ? "Memuat..." : "Muat ulang"}
          </button>
        </div>

        {asesmenMessage && (
          <div className="management-message" role="status">
            {asesmenMessage}
          </div>
        )}

        <div className="dashboard-table nilai-tabel">
          {loadingAsesmen ? (
            <p className="guru-panel-empty">Memuat hasil asesmen...</p>
          ) : hasilAsesmen.length === 0 ? (
            <p className="guru-panel-empty">
              Belum ada hasil asesmen dari siswa untuk asesmen Anda.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Siswa</th>
                  <th>Asesmen</th>
                  <th>Jawaban Siswa</th>
                  <th>Nilai &amp; Umpan Balik</th>
                </tr>
              </thead>
              <tbody>
                {hasilAsesmen.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.namaSiswa}</strong>
                      <small className="nilai-nis">{item.kelas || "-"}</small>
                    </td>
                    <td>
                      <strong>{item.judulAsesmen}</strong>
                      <small className="nilai-nis">
                        {item.mataPelajaran || "-"} ·{" "}
                        {item.jenis === "pg" ? "Pilihan Ganda" : "Esai"}
                      </small>
                      <small className="nilai-nis">
                        Dikerjakan: {formatTanggal(item.dikerjakanPada)}
                      </small>
                    </td>
                    <td>
                      {item.soal.map((soal, index) => (
                        <p key={`${item._id}-soal-${index}`}>
                          <strong>
                            {index + 1}. {soal.pertanyaan}
                          </strong>
                          <br />
                          {soal.jawaban || "-"}
                        </p>
                      ))}
                    </td>
                    <td>
                      <form
                        className="nilai-penilaian-form"
                        onSubmit={(event) =>
                          handleNilaiAsesmen(event, item)
                        }
                      >
                        <small className="nilai-nis">
                          {item.dinilai
                            ? `Sudah dinilai: ${formatAngka(item.skor)}/100`
                            : `Skor sementara pilihan ganda: ${formatAngka(item.skor)}/100 · Menunggu penilaian guru`}
                        </small>
                        <label>
                          Nilai asesmen (0-100)
                          <input
                            type="number"
                            name="nilai"
                            min={0}
                            max={100}
                            step="0.01"
                            defaultValue={item.dinilai ? item.skor : ""}
                            required
                          />
                        </label>
                        <label>
                          Umpan balik
                          <textarea
                            name="umpanBalik"
                            rows={2}
                            defaultValue={item.umpanBalik}
                          />
                        </label>
                        <button
                          type="submit"
                          className="edit-button"
                          disabled={gradingAsesmenId === item._id}
                        >
                          {gradingAsesmenId === item._id
                            ? "Menyimpan..."
                            : item.dinilai
                              ? "Perbarui nilai"
                              : "Simpan nilai"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
