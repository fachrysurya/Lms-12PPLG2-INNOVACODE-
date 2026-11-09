"use client";

import { FormEvent, useEffect, useState } from "react";
import Icon from "../../components/Icon";

type Jadwal = { _id: string; hari: string; jamMulai: string; jamSelesai: string; kelas: string; mataPelajaran: string; guru: string; ruang: string; aktif: boolean };
type Option = { _id?: string; namaKelas?: string; namaMapel?: string; nama?: string };
const hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function JadwalPelajaranAdminPage() {
  const [jadwal, setJadwal] = useState<Jadwal[]>([]);
  const [kelas, setKelas] = useState<Option[]>([]);
  const [mapel, setMapel] = useState<Option[]>([]);
  const [guru, setGuru] = useState<Option[]>([]);
  const [editing, setEditing] = useState<Jadwal | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    const [jadwalRes, kelasRes, mapelRes, guruRes] = await Promise.all([
      fetch("/api/admin/jadwal", { cache: "no-store" }), fetch("/api/admin/kelas", { cache: "no-store" }),
      fetch("/api/admin/mata-pelajaran", { cache: "no-store" }), fetch("/api/admin/data-guru", { cache: "no-store" }),
    ]);
    const [jadwalData, kelasData, mapelData, guruData] = await Promise.all([jadwalRes.json(), kelasRes.json(), mapelRes.json(), guruRes.json()]);
    if (jadwalData.success) setJadwal(jadwalData.jadwal);
    if (kelasData.success) setKelas(kelasData.kelas);
    if (mapelData.success) setMapel(mapelData.data);
    if (guruData.success) setGuru(guruData.guru);
    setLoading(false);
  }

  useEffect(() => { void Promise.resolve().then(load); }, []);

  function bukaTambah() { setEditing(null); setShowForm(true); setMessage(""); }
  function bukaEdit(item: Jadwal) { setEditing(item); setShowForm(true); setMessage(""); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      id: editing?._id,
      hari: form.get("hari"), jamMulai: form.get("jamMulai"), jamSelesai: form.get("jamSelesai"),
      kelas: form.get("kelas"), mataPelajaran: form.get("mataPelajaran"), guru: form.get("guru"), ruang: form.get("ruang"), aktif: true,
    };
    const response = await fetch("/api/admin/jadwal", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json();
    setMessage(data.message || "Jadwal tidak berhasil disimpan.");
    if (data.success) { setShowForm(false); setEditing(null); setLoading(true); await load(); }
  }

  async function hapus(item: Jadwal) {
    if (!confirm(`Hapus jadwal ${item.mataPelajaran} pada hari ${item.hari}?`)) return;
    const response = await fetch("/api/admin/jadwal", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item._id }) });
    const data = await response.json(); setMessage(data.message); if (data.success) { setLoading(true); await load(); }
  }

  return <div className="management-page">
    <div className="management-header"><div><h1>Jadwal Pelajaran</h1><p>Kelola jadwal pembelajaran yang akan dilihat oleh Kurikulum.</p></div><button className="add-button" onClick={bukaTambah}><Icon name="plus" /> Tambah Jadwal</button></div>
    {message && <div className="management-message">{message}</div>}
    {showForm && <div className="user-form-card"><form className="user-form" onSubmit={submit}>
      <div className="form-group"><label>Hari</label><select name="hari" defaultValue={editing?.hari || ""} required><option value="" disabled>Pilih hari</option>{hari.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div className="form-group"><label>Jam Mulai</label><input type="time" name="jamMulai" defaultValue={editing?.jamMulai || ""} required /></div>
      <div className="form-group"><label>Jam Selesai</label><input type="time" name="jamSelesai" defaultValue={editing?.jamSelesai || ""} required /></div>
      <div className="form-group"><label>Kelas</label><select name="kelas" defaultValue={editing?.kelas || ""} required><option value="" disabled>Pilih kelas</option>{kelas.map((item) => <option key={item._id} value={item.namaKelas}>{item.namaKelas}</option>)}</select></div>
      <div className="form-group"><label>Mata Pelajaran</label><select name="mataPelajaran" defaultValue={editing?.mataPelajaran || ""} required><option value="" disabled>Pilih mata pelajaran</option>{mapel.map((item) => <option key={item._id} value={item.namaMapel}>{item.namaMapel}</option>)}</select></div>
      <div className="form-group"><label>Guru Pengajar</label><select name="guru" defaultValue={editing?.guru || ""} required><option value="" disabled>Pilih guru</option>{guru.map((item) => <option key={item._id} value={item.nama}>{item.nama}</option>)}</select></div>
      <div className="form-group"><label>Ruang Kelas</label><input name="ruang" defaultValue={editing?.ruang || ""} placeholder="Contoh: Lab RPL 1" required /></div>
      <div className="form-actions"><button type="button" className="cancel-button" onClick={() => setShowForm(false)}>Batal</button><button type="submit" className="save-button">Simpan Jadwal</button></div>
    </form></div>}
    <div className="management-card"><div className="table-wrapper"><table className="dashboard-table"><thead><tr><th>No</th><th>Hari</th><th>Jam</th><th>Kelas</th><th>Mata Pelajaran</th><th>Guru</th><th>Ruang</th><th>Aksi</th></tr></thead><tbody>
      {loading ? <tr><td className="empty-table" colSpan={8}>Memuat jadwal...</td></tr> : jadwal.length === 0 ? <tr><td className="empty-table" colSpan={8}>Belum ada jadwal pelajaran.</td></tr> : jadwal.map((item, index) => <tr key={item._id}><td>{index + 1}</td><td>{item.hari}</td><td>{item.jamMulai} - {item.jamSelesai}</td><td>{item.kelas}</td><td>{item.mataPelajaran}</td><td>{item.guru}</td><td>{item.ruang}</td><td><div className="action-buttons"><button className="edit-button" onClick={() => bukaEdit(item)}>Edit</button><button className="delete-button" onClick={() => hapus(item)}>Hapus</button></div></td></tr>)}
    </tbody></table></div></div>
  </div>;
}
