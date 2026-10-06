import mongoose, { Model, Schema } from "mongoose";

export type JenisTugas = "pdf" | "link" | "teks";

export interface ISoalIsian {
  pertanyaan: string;
  kunciJawaban: string;
}

export interface ITugas {
  judul: string;
  deskripsi: string;
  mataPelajaran: string;
  kelas: string;
  jenis: JenisTugas;
  /** Lampiran PDF (data URL) */
  pdfUrl?: string;
  pdfNama?: string;
  /** Link lampiran / referensi */
  linkUrl?: string;
  /** Instruksi teks */
  konten?: string;
  /** Tenggat pengumpulan */
  tenggat?: string;
  /** Poin maksimal */
  poin: number;
  /** Daftar soal isian (opsional) */
  soal: ISoalIsian[];
  guru: string;
  aktif: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const SoalIsianSchema = new Schema<ISoalIsian>(
  {
    pertanyaan: {
      type: String,
      required: true,
      trim: true,
    },

    kunciJawaban: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: true,
  }
);

const TugasSchema = new Schema<ITugas>(
  {
    judul: {
      type: String,
      required: true,
      trim: true,
    },

    deskripsi: {
      type: String,
      trim: true,
      default: "",
    },

    mataPelajaran: {
      type: String,
      required: true,
      trim: true,
    },

    kelas: {
      type: String,
      required: true,
      trim: true,
    },

    jenis: {
      type: String,
      enum: ["pdf", "link", "teks"],
      required: true,
    },

    pdfUrl: {
      type: String,
      trim: true,
    },

    pdfNama: {
      type: String,
      trim: true,
    },

    linkUrl: {
      type: String,
      trim: true,
    },

    konten: {
      type: String,
      default: "",
    },

    tenggat: {
      type: String,
      trim: true,
      default: "",
    },

    poin: {
      type: Number,
      default: 100,
      min: 0,
    },

    soal: {
      type: [SoalIsianSchema],
      default: [],
    },

    guru: {
      type: String,
      trim: true,
      default: "",
    },

    aktif: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tugas: Model<ITugas> =
  mongoose.models.Tugas ||
  mongoose.model<ITugas>("Tugas", TugasSchema);

export default Tugas;