import mongoose, { Schema, Model } from "mongoose";

export type UserRole =
  | "admin"
  | "guru"
  | "siswa"
  | "kurikulum"
  | "kepala-sekolah";

export interface IUser {
  nama: string;
  username: string;
  password: string;
  role: UserRole;
  email?: string;
  aktif: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: [
        "admin",
        "guru",
        "siswa",
        "kurikulum",
        "kepala-sekolah",
      ],
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
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

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

export default User;