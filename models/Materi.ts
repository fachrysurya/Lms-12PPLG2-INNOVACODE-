import mongoose, { Model, Schema } from "mongoose";

export type TipeMateri = "pdf" | "youtube" | "teks";

export interface IMateri {
  judul: string;
  deskripsi: string;
  mataPelajaran: string;
  kelas: string;
  tipe: TipeMateri;
  /** URL file PDF (data URL / link eksternal) */
  pdfUrl?: string;
  /** Nama file PDF asli */
  pdfNama?: string;
  /** URL video YouTube */
  youtubeUrl?: string;
  /** Isi materi teks bebas */
  konten?: string;
  guru: string;
  aktif: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const MateriSchema = new Schema<IMateri>(
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

    tipe: {
      type: String,
      enum: ["pdf", "youtube", "teks"],
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

    youtubeUrl: {
      type: String,
      trim: true,
    },

    konten: {
      type: String,
      default: "",
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

const Materi: Model<IMateri> =
  mongoose.models.Materi ||
  mongoose.model<IMateri>("Materi", MateriSchema);

export default Materi;