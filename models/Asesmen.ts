import mongoose, { Model, Schema } from "mongoose";

export type JenisAsesmen = "esai" | "pg";

export interface ISoalAsesmen {
  pertanyaan: string;
  /** Opsi jawaban untuk soal pilihan ganda */
  opsi: string[];
  /** Indeks opsi yang benar (0-4), -1 bila tidak ada */
  jawabanBenar: number;
  /** Kunci / pembahasan jawaban (untuk esai) */
  kunciJawaban: string;
}

export interface IAsesmen {
  judul: string;
  deskripsi: string;
  mataPelajaran: string;
  kelas: string;
  jenis: JenisAsesmen;
  /** Durasi dalam menit */
  durasi: number;
  /** Total poin */
  poin: number;
  soal: ISoalAsesmen[];
  guru: string;
  aktif: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const SoalAsesmenSchema = new Schema<ISoalAsesmen>(
  {
    pertanyaan: {
      type: String,
      required: true,
      trim: true,
    },

    opsi: {
      type: [String],
      default: [],
    },

    jawabanBenar: {
      type: Number,
      default: -1,
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

const AsesmenSchema = new Schema<IAsesmen>(
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
      enum: ["esai", "pg"],
      default: "esai",
    },

    durasi: {
      type: Number,
      default: 60,
      min: 0,
    },

    poin: {
      type: Number,
      default: 100,
      min: 0,
    },

    soal: {
      type: [SoalAsesmenSchema],
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

const Asesmen: Model<IAsesmen> =
  mongoose.models.Asesmen ||
  mongoose.model<IAsesmen>("Asesmen", AsesmenSchema);

export default Asesmen;