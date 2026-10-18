import mongoose, { Model, Schema } from "mongoose";

/**
 * Jawaban siswa untuk satu soal isian pada tugas / asesmen.
 */
export interface IJawabanSiswa {
  pertanyaan: string;
  jawaban: string;
  benar?: boolean;
}

/**
 * Pengumpulan tugas oleh siswa.
 */
export interface IPengumpulanTugas {
  tugasId: string;
  siswaId: string;
  namaSiswa: string;
  kelas: string;
  mataPelajaran: string;
  /** Jawaban isian siswa (bila tugas memiliki soal) */
  jawaban: IJawabanSiswa[];
  /** Catatan / jawaban teks siswa */
  catatan: string;
  /** Link yang dikumpulkan siswa (untuk tugas bertipe link) */
  linkJawaban?: string;
  /** File PDF jawaban siswa (data URL) */
  pdfUrl?: string;
  pdfNama?: string;
  /** Sudah dinilai oleh guru? */
  dinilai: boolean;
  /** Nilai yang diberikan guru (0-100) */
  nilai: number;
  /** Umpan balik dari guru */
  umpanBalik: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const JawabanSiswaSchema = new Schema<IJawabanSiswa>(
  {
    pertanyaan: {
      type: String,
      trim: true,
      default: "",
    },

    jawaban: {
      type: String,
      trim: true,
      default: "",
    },

    benar: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  }
);

const PengumpulanTugasSchema = new Schema<IPengumpulanTugas>(
  {
    tugasId: {
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
      type: [JawabanSiswaSchema],
      default: [],
    },

    catatan: {
      type: String,
      default: "",
    },

    linkJawaban: {
      type: String,
      trim: true,
      default: "",
    },

    pdfUrl: {
      type: String,
      trim: true,
    },

    pdfNama: {
      type: String,
      trim: true,
    },

    dinilai: {
      type: Boolean,
      default: false,
    },

    nilai: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
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

// Satu siswa hanya boleh mengumpulkan satu kali per tugas.
PengumpulanTugasSchema.index(
  { tugasId: 1, siswaId: 1 },
  { unique: true }
);

const PengumpulanTugas: Model<IPengumpulanTugas> =
  mongoose.models.PengumpulanTugas ||
  mongoose.model<IPengumpulanTugas>(
    "PengumpulanTugas",
    PengumpulanTugasSchema
  );

export default PengumpulanTugas;
