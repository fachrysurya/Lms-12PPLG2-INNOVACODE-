import mongoose, { Model, Schema } from "mongoose";

/**
 * Hasil pengerjaan asesmen oleh siswa.
 */
export interface IHasilAsesmen {
  asesmenId: string;
  siswaId: string;
  namaSiswa: string;
  kelas: string;
  mataPelajaran: string;
  /** Jawaban per soal: untuk PG berisi indeks opsi, esai berisi teks */
  jawaban: string[];
  /** Skor otomatis dari soal PG (0-100) */
  skor: number;
  /** Sudah dinilai guru? (esai dinilai manual) */
  dinilai: boolean;
  /** Umpan balik guru */
  umpanBalik: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const HasilAsesmenSchema = new Schema<IHasilAsesmen>(
  {
    asesmenId: {
      type: String,
      required: true,
      trim: true,
    },

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

    kelas: {
      type: String,
      trim: true,
      default: "",
    },

    mataPelajaran: {
      type: String,
      trim: true,
      default: "",
    },

    jawaban: {
      type: [String],
      default: [],
    },

    skor: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    dinilai: {
      type: Boolean,
      default: false,
    },

    umpanBalik: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Satu siswa hanya boleh mengerjakan satu kali per asesmen.
HasilAsesmenSchema.index(
  { asesmenId: 1, siswaId: 1 },
  { unique: true }
);

const HasilAsesmen: Model<IHasilAsesmen> =
  mongoose.models.HasilAsesmen ||
  mongoose.model<IHasilAsesmen>(
    "HasilAsesmen",
    HasilAsesmenSchema
  );

export default HasilAsesmen;
