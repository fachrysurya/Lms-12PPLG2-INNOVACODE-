import mongoose, { Model, Schema } from "mongoose";

export interface ILaporan {
  judul: string;
  jenis: string;
  periode: string;
  deskripsi: string;
  dibuatOleh: string;
  aktif: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const LaporanSchema = new Schema<ILaporan>(
  {
    judul: {
      type: String,
      required: true,
      trim: true,
    },

    jenis: {
      type: String,
      required: true,
      trim: true,
    },

    periode: {
      type: String,
      required: true,
      trim: true,
    },

    deskripsi: {
      type: String,
      default: "",
      trim: true,
    },

    dibuatOleh: {
      type: String,
      default: "Administrator",
      trim: true,
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

const Laporan: Model<ILaporan> =
  mongoose.models.Laporan ||
  mongoose.model<ILaporan>("Laporan", LaporanSchema);

export default Laporan;