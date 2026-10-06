"use client";

import { useEffect, useMemo, useState } from "react";

import Icon from "../../components/Icon";

import {
  createAsesmen,
  updateAsesmen,
  deleteAsesmen,
} from "./actions";

type JenisAsesmen = "esai" | "pg";

type SoalAsesmen = {
  pertanyaan: string;
  opsi: string[];
  jawabanBenar: number;
  kunciJawaban: string;
};

type Asesmen = {
  _id: string;
  judul: string;
  deskripsi: string;
  mataPelajaran: string;
  kelas: string;
  jenis: JenisAsesmen;
  durasi: number;
  poin: number;
  soal: SoalAsesmen[];
  guru: string;
  aktif: boolean;
  createdAt?: string;
};

function soalKosong(jenis: JenisAsesmen): SoalAsesmen {
  return {
    pertanyaan: "",
    opsi: jenis === "pg" ? ["", "", "", ""] : [],
    jawabanBenar: jenis === "pg" ? 0 : -1,
    kunciJawaban: "",
  };
}

export default function GuruAsesmenPage() {
  const [daftar, setDaftar] = useState<Asesmen[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Asesmen | null>(null);

  const [jenis, setJenis] = useState<JenisAsesmen>("esai");
  const [soal, setSoal] = useState<SoalAsesmen[]>([
    soalKosong("esai"),
  ]);

  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState("semua");

  const [detail, setDetail] = useState<Asesmen | null>(null);

  async function muat() {
    try {
      setLoading(true);

      const res = await fetch("/api/guru/asesmen", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setDaftar(data.asesmen);
      } else {
        setMessage(
          data.message || "Gagal mengambil data asesmen."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Gagal mengambil data asesmen.");
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
    const pg = daftar.filter((item) => item.jenis === "pg").length;
    const esai = daftar.filter(
      (item) => item.jenis === "esai"
    ).length;

    return { total, pg, esai };
  }, [daftar]);

  function bukaTambah() {
    setEditing(null);
    setJenis("esai");
    setSoal([soalKosong("esai")]);
    setShowForm(true);
    setMessage("");
  }

  function bukaEdit(item: Asesmen) {
    setEditing(item);
    setJenis(item.jenis);
    setSoal(
      item.soal?.length
        ? item.soal.map((s) => ({
          pertanyaan: s.pertanyaan,
          opsi:
            s.opsi?.length
              ? s.opsi
              : item.jenis === "pg"
                ? ["", "", "", ""]
                : [],
          jawabanBenar:
            typeof s.jawabanBenar === "number"
              ? s.jawabanBenar
              : -1,
          kunciJawaban: s.kunciJawaban || "",
        }))
        : [soalKosong(item.jenis)]
    );
    setShowForm(true);
    setMessage("");
  }

  function gantiJenis(nilai: JenisAsesmen) {
    setJenis(nilai);

    setSoal((prev) =>
      prev.map((s) => ({
        ...s,
        opsi:
          nilai === "pg"
            ? s.opsi.length
              ? s.opsi
              : ["", "", "", ""]
            : [],
        jawabanBenar: nilai === "pg" ? s.jawabanBenar : -1,
      }))
    );
  }

  function ubahSoal(
    index: number,
    field: "pertanyaan" | "kunciJawaban",
    nilai: string
  ) {
    setSoal((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: nilai } : item
      )
    );
  }

  function ubahOpsi(
    index: number,
    opsiIndex: number,
    nilai: string
  ) {
    setSoal((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            opsi: item.opsi.map((o, oi) =>
              oi === opsiIndex ? nilai : o
            ),
          }
          : item
      )
    );
  }

  function tambahOpsi(index: number) {
    setSoal((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, opsi: [...item.opsi, ""] }
          : item
      )
    );
  }

  function hapusOpsi(index: number, opsiIndex: number) {
    setSoal((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        const opsi = item.opsi.filter(
          (_, oi) => oi !== opsiIndex
        );

        let jawabanBenar = item.jawabanBenar;

        if (jawabanBenar === opsiIndex) {
          jawabanBenar = 0;
        } else if (jawabanBenar > opsiIndex) {
          jawabanBenar -= 1;
        }

        return { ...item, opsi, jawabanBenar };
      })
    );
  }

  function pilihJawaban(index: number, opsiIndex: number) {
    setSoal((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, jawabanBenar: opsiIndex } : item
      )
    );
  }

  function tambahSoal() {
    setSoal((prev) => [...prev, soalKosong(jenis)]);
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

    const soalBersih = soal
      .filter((s) => s.pertanyaan.trim())
      .map((s) => ({
        pertanyaan: s.pertanyaan.trim(),
        opsi:
          jenis === "pg"
            ? s.opsi.map((o) => o.trim()).filter(Boolean)
            : [],
        jawabanBenar: jenis === "pg" ? s.jawabanBenar : -1,
        kunciJawaban: s.kunciJawaban.trim(),
      }));

    formData.set("soal", JSON.stringify(soalBersih));

    const result = editing
      ? await updateAsesmen(formData)
      : await createAsesmen(formData);

    setMessage(result.message);

    if (result.success) {
      setShowForm(false);
      setEditing(null);
      setJenis("esai");
      setSoal([soalKosong("esai")]);
      form.reset();
      await muat();
    }
  }

  async function handleDelete(id: string) {
    const yakin = confirm(
      "Apakah Anda yakin ingin menghapus asesmen ini?"
    );

    if (!yakin) return;

    const formData = new FormData();
    formData.append("id", id);

    const result = await deleteAsesmen(formData);

    setMessage(result.message);

    if (result.success) {
      await muat();
    }
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Asesmen</h1>
          <p>Buat dan kelola asesmen pilihan ganda & esai.</p>
        </div>

        <button
          type="button"
          className="add-button"
          onClick={bukaTambah}
        >
          <Icon name="plus" />
          Tambah Asesmen
        </button>
      </div>

      <div className="management-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="asesmen" />
          </div>
          <div>
            <span>Total Asesmen</span>
            <strong>{ringkas.total}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="check" />
          </div>
          <div>
            <span>Pilihan Ganda</span>
            <strong>{ringkas.pg}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="file" />
          </div>
          <div>
            <span>Esai</span>
            <strong>{ringkas.esai}</strong>
          </div>
        </div>
      </div>

      <div className="guru-toolbar">
        <div className="guru-search">
          <Icon name="search" />
          <input
            type="text"
            placeholder="Cari asesmen, mapel, atau kelas..."
            value={cari}
            onChange={(e) => setCari(e.target.value)}
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="semua">Semua Jenis</option>
          <option value="pg">Pilihan Ganda</option>
          <option value="esai">Esai</option>
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
                <Icon name="asesmen" />
              </div>

              <div>
                <h2>
                  {editing ? "Edit Asesmen" : "Tambah Asesmen"}
                </h2>
                <p>
                  {editing
                    ? "Perbarui data asesmen."
                    : "Buat asesmen baru untuk siswa."}
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
              <label>Judul Asesmen</label>
              <input
                type="text"
                name="judul"
                defaultValue={editing?.judul || ""}
                placeholder="Contoh: Ujian Tengah Semester"
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
                placeholder="Penjelasan singkat asesmen (opsional)"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Durasi (menit)</label>
                <input
                  type="number"
                  name="durasi"
                  min={0}
                  defaultValue={editing?.durasi ?? 60}
                />
              </div>

              <div className="form-group">
                <label>Total Poin</label>
                <input
                  type="number"
                  name="poin"
                  min={0}
                  defaultValue={editing?.poin ?? 100}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Jenis Asesmen</label>
              <div className="tipe-pilihan">
                <button
                  type="button"
                  className={jenis === "esai" ? "tipe-aktif" : ""}
                  onClick={() => gantiJenis("esai")}
                >
                  <Icon name="file" />
                  Esai
                </button>

                <button
                  type="button"
                  className={jenis === "pg" ? "tipe-aktif" : ""}
                  onClick={() => gantiJenis("pg")}
                >
                  <Icon name="check" />
                  Pilihan Ganda
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>
                {jenis === "pg"
                  ? "Soal Pilihan Ganda"
                  : "Soal Esai"}
              </label>

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
                        ubahSoal(
                          index,
                          "pertanyaan",
                          e.target.value
                        )
                      }
                      placeholder="Pertanyaan..."
                    />

                    {jenis === "pg" ? (
                      <div className="opsi-list">
                        {item.opsi.map((opsi, oi) => (
                          <div
                            className="opsi-item"
                            key={oi}
                          >
                            <label className="opsi-pilih">
                              <input
                                type="radio"
                                name={`jawaban-${index}`}
                                checked={
                                  item.jawabanBenar === oi
                                }
                                onChange={() =>
                                  pilihJawaban(index, oi)
                                }
                              />
                              <span className="opsi-label">
                                {String.fromCharCode(65 + oi)}
                              </span>
                            </label>

                            <input
                              type="text"
                              value={opsi}
                              onChange={(e) =>
                                ubahOpsi(
                                  index,
                                  oi,
                                  e.target.value
                                )
                              }
                              placeholder={`Opsi ${String.fromCharCode(
                                65 + oi
                              )}`}
                            />

                            {item.opsi.length > 2 && (
                              <button
                                type="button"
                                className="opsi-hapus"
                                onClick={() =>
                                  hapusOpsi(index, oi)
                                }
                              >
                                <Icon name="trash" />
                              </button>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          className="opsi-tambah"
                          onClick={() => tambahOpsi(index)}
                        >
                          <Icon name="plus" />
                          Tambah Opsi
                        </button>

                        <small className="opsi-hint">
                          Pilih radio di kiri untuk menandai
                          jawaban benar.
                        </small>
                      </div>
                    ) : (
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
                        placeholder="Kunci / pembahasan jawaban (opsional)"
                      />
                    )}
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
                {editing ? "Simpan Perubahan" : "Simpan Asesmen"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="guru-kartu-grid">
        {loading ? (
          <p className="guru-panel-empty">Memuat data...</p>
        ) : hasil.length === 0 ? (
          <p className="guru-panel-empty">Belum ada asesmen.</p>
        ) : (
          hasil.map((item) => (
            <div className="guru-kartu" key={item._id}>
              <div className="guru-kartu-top">
                <span
                  className={`guru-badge guru-badge-${item.jenis}`}
                >
                  {item.jenis === "pg"
                    ? "Pilihan Ganda"
                    : "Esai"}
                </span>

                <span
                  className={`guru-status guru-status-${item.aktif ? "aktif" : "selesai"
                    }`}
                >
                  {item.aktif ? "Aktif" : "Nonaktif"}
                </span>
              </div>

              <h3>{item.judul}</h3>

              <p>{item.deskripsi || "Tanpa deskripsi."}</p>

              <div className="guru-kartu-meta">
                <span>{item.mataPelajaran}</span>
                <span>{item.kelas}</span>
                <span>{item.durasi} menit</span>
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
          ))
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
                  {detail.durasi} menit • {detail.poin} poin
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

              {detail.soal?.length > 0 && (
                <div className="soal-preview">
                  <h4>
                    {detail.jenis === "pg"
                      ? "Soal Pilihan Ganda"
                      : "Soal Esai"}
                  </h4>

                  {detail.soal.map((s, i) => (
                    <div key={i} className="soal-preview-item">
                      <strong>
                        {i + 1}. {s.pertanyaan}
                      </strong>

                      {detail.jenis === "pg" &&
                        s.opsi?.length > 0 && (
                          <ul className="soal-preview-opsi">
                            {s.opsi.map((o, oi) => (
                              <li
                                key={oi}
                                className={
                                  s.jawabanBenar === oi
                                    ? "opsi-benar"
                                    : ""
                                }
                              >
                                {String.fromCharCode(65 + oi)}.{" "}
                                {o}
                              </li>
                            ))}
                          </ul>
                        )}

                      {detail.jenis === "esai" &&
                        s.kunciJawaban && (
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