"use client";

import { useEffect, useMemo, useState } from "react";

import Icon from "../../components/Icon";

import {
  createNilai,
  updateNilai,
  deleteNilai,
  finalisasiSemester,
  bukaFinalisasi,
} from "./actions";

type SemesterNilai = 1 | 2;

type Nilai = {
  _id: string;
  siswaId: string;
  namaSiswa: string;
  nis: string;
  kelas: string;
  mataPelajaran: string;
  semester: SemesterNilai;
  nilaiTugas: number;
  nilaiAsesmen: number;
  semesterSelesai: boolean;
  nilaiAkhir: number;
  bobotTugas: number;
  bobotAsesmen: number;
  catatan: string;
  guru: string;
  createdAt?: string;
};

function predikat(nilai: number): string {
  if (nilai >= 90) return "A";
  if (nilai >= 80) return "B";
  if (nilai >= 70) return "C";
  if (nilai >= 60) return "D";
  return "E";
}

function formatAngka(nilai: number): string {
  return Number.isInteger(nilai) ? String(nilai) : nilai.toFixed(2);
}

export default function GuruNilaiPage() {
  const [daftar, setDaftar] = useState<Nilai[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Nilai | null>(null);

  const [cari, setCari] = useState("");
  const [filterKelas, setFilterKelas] = useState("semua");
  const [filterMapel, setFilterMapel] = useState("semua");
  const [filterSemester, setFilterSemester] = useState("semua");

  async function muat() {
    try {
      setLoading(true);

      const res = await fetch("/api/guru/nilai", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setDaftar(data.nilai);
      } else {
        setMessage(data.message || "Gagal mengambil data nilai.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Gagal mengambil data nilai.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    muat();
  }, []);

  const opsiKelas = useMemo(() => {
    return Array.from(new Set(daftar.map((n) => n.kelas))).sort();
  }, [daftar]);

  const opsiMapel = useMemo(() => {
    return Array.from(
      new Set(daftar.map((n) => n.mataPelajaran))
    ).sort();
  }, [daftar]);

  const hasil = useMemo(() => {
    return daftar.filter((item) => {
      const cocokCari =
        item.namaSiswa.toLowerCase().includes(cari.toLowerCase()) ||
        item.nis.toLowerCase().includes(cari.toLowerCase()) ||
        item.kelas.toLowerCase().includes(cari.toLowerCase()) ||
        item.mataPelajaran
          .toLowerCase()
          .includes(cari.toLowerCase());

      const cocokKelas =
        filterKelas === "semua" || item.kelas === filterKelas;
      const cocokMapel =
        filterMapel === "semua" ||
        item.mataPelajaran === filterMapel;
      const cocokSemester =
        filterSemester === "semua" ||
        String(item.semester) === filterSemester;

      return cocokCari && cocokKelas && cocokMapel && cocokSemester;
    });
  }, [daftar, cari, filterKelas, filterMapel, filterSemester]);

  const ringkas = useMemo(() => {
    const total = daftar.length;

    const sudahFinal = daftar.filter(
      (n) => n.semesterSelesai
    ).length;

    const belumFinal = total - sudahFinal;

    const sudahAdaAkhir = daftar.filter((n) => n.semesterSelesai);

    const rata =
      sudahAdaAkhir.length > 0
        ? sudahAdaAkhir.reduce((a, b) => a + b.nilaiAkhir, 0) /
          sudahAdaAkhir.length
        : 0;

    return { total, sudahFinal, belumFinal, rata };
  }, [daftar]);

  function bukaTambah() {
    setEditing(null);
    setShowForm(true);
    setMessage("");
  }

  function bukaEdit(item: Nilai) {
    setEditing(item);
    setShowForm(true);
    setMessage("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = editing
      ? await updateNilai(formData)
      : await createNilai(formData);

    setMessage(result.message);

    if (result.success) {
      setShowForm(false);
      setEditing(null);
      form.reset();
      await muat();
    }
  }

  async function handleDelete(id: string) {
    const yakin = confirm(
      "Apakah Anda yakin ingin menghapus nilai ini?"
    );

    if (!yakin) return;

    const formData = new FormData();
    formData.append("id", id);

    const result = await deleteNilai(formData);

    setMessage(result.message);

    if (result.success) {
      await muat();
    }
  }

  async function handleFinalisasi(item: Nilai) {
    const yakin = confirm(
      `Finalisasi semester ${item.semester} untuk ${item.namaSiswa}? ` +
        "Nilai tugas & asesmen akan digabung menjadi nilai akhir."
    );

    if (!yakin) return;

    const formData = new FormData();
    formData.append("id", item._id);

    const result = await finalisasiSemester(formData);

    setMessage(result.message);

    if (result.success) {
      await muat();
    }
  }

  async function handleFinalisasiSemua() {
    if (filterKelas === "semua" || filterMapel === "semua") {
      setMessage(
        "Pilih Kelas dan Mata Pelajaran dulu untuk finalisasi massal."
      );
      return;
    }

    const semester = filterSemester === "semua" ? "1" : filterSemester;

    const yakin = confirm(
      `Finalisasi semester ${semester} untuk kelas ${filterKelas} - ${filterMapel}? ` +
        "Semua nilai siswa pada kelas & mapel ini akan digabung."
    );

    if (!yakin) return;

    const formData = new FormData();
    formData.append("kelas", filterKelas);
    formData.append("mataPelajaran", filterMapel);
    formData.append("semester", semester);

    const result = await finalisasiSemester(formData);

    setMessage(result.message);

    if (result.success) {
      await muat();
    }
  }

  async function handleBukaFinalisasi(item: Nilai) {
    const yakin = confirm(
      `Buka kembali finalisasi untuk ${item.namaSiswa}?`
    );

    if (!yakin) return;

    const formData = new FormData();
    formData.append("id", item._id);

    const result = await bukaFinalisasi(formData);

    setMessage(result.message);

    if (result.success) {
      await muat();
    }
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Nilai Siswa</h1>
          <p>
            Nilai tugas & asesmen dipisah. Saat semester selesai,
            keduanya digabung otomatis menjadi nilai akhir.
          </p>
        </div>

        <div className="nilai-header-aksi">
          <button
            type="button"
            className="nilai-final-btn"
            onClick={handleFinalisasiSemua}
          >
            <Icon name="check" />
            Finalisasi Semester
          </button>

          <button
            type="button"
            className="add-button"
            onClick={bukaTambah}
          >
            <Icon name="plus" />
            Tambah Nilai
          </button>
        </div>
      </div>

      <div className="management-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="nilai" />
          </div>
          <div>
            <span>Total Data Nilai</span>
            <strong>{ringkas.total}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="check" />
          </div>
          <div>
            <span>Sudah Finalisasi</span>
            <strong>{ringkas.sudahFinal}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="alert" />
          </div>
          <div>
            <span>Belum Finalisasi</span>
            <strong>{ringkas.belumFinal}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="nilai" />
          </div>
          <div>
            <span>Rata-rata Nilai Akhir</span>
            <strong>{formatAngka(ringkas.rata)}</strong>
          </div>
        </div>
      </div>

      <div className="guru-toolbar">
        <div className="guru-search">
          <Icon name="search" />
          <input
            type="text"
            placeholder="Cari nama siswa, NIS, kelas, atau mapel..."
            value={cari}
            onChange={(e) => setCari(e.target.value)}
          />
        </div>

        <select
          value={filterKelas}
          onChange={(e) => setFilterKelas(e.target.value)}
        >
          <option value="semua">Semua Kelas</option>
          {opsiKelas.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>

        <select
          value={filterMapel}
          onChange={(e) => setFilterMapel(e.target.value)}
        >
          <option value="semua">Semua Mapel</option>
          {opsiMapel.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={filterSemester}
          onChange={(e) => setFilterSemester(e.target.value)}
        >
          <option value="semua">Semua Semester</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
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
                <Icon name="nilai" />
              </div>

              <div>
                <h2>{editing ? "Edit Nilai" : "Tambah Nilai"}</h2>
                <p>
                  Isi nilai tugas dan nilai asesmen secara terpisah.
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
              <label>Nama Siswa</label>
              <input
                type="text"
                name="namaSiswa"
                defaultValue={editing?.namaSiswa || ""}
                placeholder="Contoh: Andi Pratama"
                required
              />
            </div>

            <div className="form-group">
              <label>NIS</label>
              <input
                type="text"
                name="nis"
                defaultValue={editing?.nis || ""}
                placeholder="Contoh: 12345"
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
              <label>Semester</label>
              <select
                name="semester"
                defaultValue={String(editing?.semester ?? 1)}
              >
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>

            <div className="form-group">
              <label>Bobot Tugas (%)</label>
              <input
                type="number"
                name="bobotTugas"
                min={0}
                max={100}
                defaultValue={editing?.bobotTugas ?? 40}
              />
            </div>

            <div className="form-group">
              <label>Bobot Asesmen (%)</label>
              <input
                type="number"
                name="bobotAsesmen"
                min={0}
                max={100}
                defaultValue={editing?.bobotAsesmen ?? 60}
              />
            </div>

            <div className="form-group">
              <label>Nilai Tugas (0-100)</label>
              <input
                type="number"
                name="nilaiTugas"
                min={0}
                max={100}
                step="0.01"
                defaultValue={editing?.nilaiTugas ?? 0}
                required
              />
            </div>

            <div className="form-group">
              <label>Nilai Asesmen (0-100)</label>
              <input
                type="number"
                name="nilaiAsesmen"
                min={0}
                max={100}
                step="0.01"
                defaultValue={editing?.nilaiAsesmen ?? 0}
                required
              />
            </div>

            <div className="form-group form-group-full">
              <label>Catatan</label>
              <textarea
                name="catatan"
                rows={2}
                defaultValue={editing?.catatan || ""}
                placeholder="Catatan tambahan (opsional)"
              />
            </div>

            {editing?.semesterSelesai && (
              <div className="form-group form-group-full">
                <div className="nilai-info-final">
                  Semester ini sudah difinalisasi. Nilai akhir
                  akan dihitung ulang otomatis saat disimpan.
                </div>
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
                {editing ? "Simpan Perubahan" : "Simpan Nilai"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="dashboard-table nilai-tabel">
        {loading ? (
          <p className="guru-panel-empty">Memuat data...</p>
        ) : hasil.length === 0 ? (
          <p className="guru-panel-empty">Belum ada data nilai.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Siswa</th>
                <th>Kelas</th>
                <th>Mapel</th>
                <th>Smt</th>
                <th>Nilai Tugas</th>
                <th>Nilai Asesmen</th>
                <th>Nilai Akhir</th>
                <th>Predikat</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
            </thead>

            <tbody>
              {hasil.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>

                  <td>
                    <strong>{item.namaSiswa}</strong>
                    {item.nis && (
                      <small className="nilai-nis">
                        NIS: {item.nis}
                      </small>
                    )}
                  </td>

                  <td>{item.kelas}</td>
                  <td>{item.mataPelajaran}</td>
                  <td>S{item.semester}</td>

                  <td className="nilai-kolom-terpisah">
                    {formatAngka(item.nilaiTugas)}
                  </td>

                  <td className="nilai-kolom-terpisah">
                    {formatAngka(item.nilaiAsesmen)}
                  </td>

                  <td>
                    {item.semesterSelesai ? (
                      <strong className="nilai-final">
                        {formatAngka(item.nilaiAkhir)}
                      </strong>
                    ) : (
                      <span className="nilai-belum">—</span>
                    )}
                  </td>

                  <td>
                    {item.semesterSelesai ? (
                      <span
                        className={`nilai-predikat predikat-${predikat(
                          item.nilaiAkhir
                        )}`}
                      >
                        {predikat(item.nilaiAkhir)}
                      </span>
                    ) : (
                      <span className="nilai-belum">—</span>
                    )}
                  </td>

                  <td>
                    {item.semesterSelesai ? (
                      <span className="guru-status guru-status-aktif">
                        Selesai
                      </span>
                    ) : (
                      <span className="guru-status guru-status-mendesak">
                        Dipisah
                      </span>
                    )}
                  </td>

                  <td>
                    <div className="action-buttons">
                      {!item.semesterSelesai ? (
                        <button
                          type="button"
                          className="nilai-final-btn kecil"
                          onClick={() => handleFinalisasi(item)}
                        >
                          <Icon name="check" />
                          Final
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="view-button"
                          onClick={() => handleBukaFinalisasi(item)}
                        >
                          <Icon name="eye" />
                          Buka
                        </button>
                      )}

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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
