import mongoose, { Model, Schema } from "mongoose";

export interface ISiswa {
  nama: string;
  nis: string;
  jenisKelamin: string;
  kelas: string;
  email?: string;
  noTelepon?: string;
  aktif: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const SiswaSchema = new Schema<ISiswa>(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
    },

    nis: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    jenisKelamin: {
      type: String,
      required: true,
      trim: true,
    },

    kelas: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },

    noTelepon: {
      type: String,
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

const Siswa: Model<ISiswa> =
  mongoose.models.Siswa ||
  mongoose.model<ISiswa>("Siswa", SiswaSchema);

export default Siswa;
