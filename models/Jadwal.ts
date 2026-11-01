import mongoose, { Model, Schema } from "mongoose";

export interface IJadwal {
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  kelas: string;
  mataPelajaran: string;
  guru: string;
  ruang: string;
  aktif: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const JadwalSchema = new Schema<IJadwal>(
  {
    hari: { type: String, required: true, trim: true },
    jamMulai: { type: String, required: true, trim: true },
    jamSelesai: { type: String, required: true, trim: true },
    kelas: { type: String, required: true, trim: true },
    mataPelajaran: { type: String, required: true, trim: true },
    guru: { type: String, required: true, trim: true },
    ruang: { type: String, required: true, trim: true },
    aktif: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Jadwal: Model<IJadwal> =
  mongoose.models.Jadwal || mongoose.model<IJadwal>("Jadwal", JadwalSchema);

export default Jadwal;
