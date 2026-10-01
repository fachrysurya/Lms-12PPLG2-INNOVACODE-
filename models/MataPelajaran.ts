import mongoose, { Model, Schema } from "mongoose";

export interface IMataPelajaran {
  namaMapel: string;
  kodeMapel: string;
  kelompok: string;
  guruPengampu: string;
  aktif: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const MataPelajaranSchema =
  new Schema<IMataPelajaran>(
    {
      namaMapel: {
        type: String,
        required: true,
        trim: true,
      },

      kodeMapel: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
      },

      kelompok: {
        type: String,
        required: true,
        trim: true,
      },

      guruPengampu: {
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

const MataPelajaran: Model<IMataPelajaran> =
  mongoose.models.MataPelajaran ||
  mongoose.model<IMataPelajaran>(
    "MataPelajaran",
    MataPelajaranSchema
  );

export default MataPelajaran;