import mongoose, { Model, Schema } from "mongoose";

export interface IGuru {
  nama: string;
  nip: string;
  email: string;
  noTelepon: string;
  mataPelajaran: string;
  aktif: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const GuruSchema = new Schema<IGuru>(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
    },

    nip: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    noTelepon: {
      type: String,
      required: true,
      trim: true,
    },

    mataPelajaran: {
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

const Guru: Model<IGuru> =
  mongoose.models.Guru ||
  mongoose.model<IGuru>("Guru", GuruSchema);

export default Guru;