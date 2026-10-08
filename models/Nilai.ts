import mongoose, { Model, Schema } from "mongoose";

export type SemesterNilai = 1 | 2;

export interface INilai {
  /** Relasi ke Siswa */
  siswaId: string;
  namaSiswa: string;
  nis: string;
  kelas: string;
  mataPelajaran: string;
  /** Semester 1 atau 2 */
  semester: SemesterNilai;

  /** Nilai tugas (0-100), dipisah dari asesmen */
  nilaiTugas: number;
  /** Nilai asesmen/ujian (0-100), dipisah dari tugas */
  nilaiAsesmen: number;

  /**
   * Sudah difinalisasi? Bila true, nilaiAkhir terisi hasil
   * perhitungan otomatis dari nilaiTugas & nilaiAsesmen.
   */
  semesterSelesai: boolean;
  /** Hasil gabungan otomatis (0-100), diisi saat semester selesai */
  nilaiAkhir: number;

  /** Bobot perhitungan tugas terhadap nilai akhir (persen) */
  bobotTugas: number;
  /** Bobot perhitungan asesmen terhadap nilai akhir (persen) */
  bobotAsesmen: number;

  catatan: string;
  guru: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Hitung nilai akhir otomatis dari kedua komponen nilai.
 * Bobot default: tugas 40% + asesmen 60%.
 */
export function hitungNilaiAkhir(
  nilaiTugas: number,
  nilaiAsesmen: number,
  bobotTugas = 40,
  bobotAsesmen = 60
): number {
  const totalBobot = bobotTugas + bobotAsesmen;

  if (totalBobot <= 0) {
    return 0;
  }

  const hasil =
    (nilaiTugas * bobotTugas + nilaiAsesmen * bobotAsesmen) /
    totalBobot;

  return Math.round(hasil * 100) / 100;
}

const NilaiSchema = new Schema<INilai>(
  {
    siswaId: {
      type: String,
      required: true,
      trim: true,
    },

    namaSiswa: {
      type: String,
      required: true,
      trim: true,
    },

    nis: {
      type: String,
      trim: true,
      default: "",
    },

    kelas: {
      type: String,
      required: true,
      trim: true,
    },

    mataPelajaran: {
      type: String,
      required: true,
      trim: true,
    },

    semester: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },

    nilaiTugas: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    nilaiAsesmen: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    semesterSelesai: {
      type: Boolean,
      default: false,
    },

    nilaiAkhir: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    bobotTugas: {
      type: Number,
      default: 40,
      min: 0,
      max: 100,
    },

    bobotAsesmen: {
      type: Number,
      default: 60,
      min: 0,
      max: 100,
    },

    catatan: {
      type: String,
      trim: true,
      default: "",
    },

    guru: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Nilai: Model<INilai> =
  mongoose.models.Nilai ||
  mongoose.model<INilai>("Nilai", NilaiSchema);

export default Nilai;
