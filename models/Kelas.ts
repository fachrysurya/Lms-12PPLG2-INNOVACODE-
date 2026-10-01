import mongoose, { Model, Schema } from "mongoose";

export interface IKelas {
  namaKelas: string;
  tingkat: string;
  jurusan: string;
  waliKelas: string;
  aktif: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const KelasSchema = new Schema<IKelas>(
  {
    namaKelas: {
      type: String,
      required: true,
      trim: true,
    },

    tingkat: {
      type: String,
      required: true,
      trim: true,
    },

    jurusan: {
      type: String,
      required: true,
      trim: true,
    },

    waliKelas: {
      type: String,
      required: true,
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

const Kelas: Model<IKelas> =
  mongoose.models.Kelas ||
  mongoose.model<IKelas>("Kelas", KelasSchema);

export default Kelas;