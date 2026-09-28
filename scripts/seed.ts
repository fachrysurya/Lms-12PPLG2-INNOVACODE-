import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";

// Baca file .env.local
dotenv.config({
  path: ".env.local",
});

const MONGODB_URI: string = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI belum diatur di file .env.local"
  );
}

const users = [
  {
    nama: "Administrator",
    username: "admin",
    password: "admin123",
    role: "admin" as const,
    email: "admin@educlass.com",
  },
  {
    nama: "Guru Edu Class",
    username: "guru",
    password: "guru123",
    role: "guru" as const,
    email: "guru@educlass.com",
  },
  {
    nama: "Siswa Edu Class",
    username: "siswa",
    password: "siswa123",
    role: "siswa" as const,
    email: "siswa@educlass.com",
  },
  {
    nama: "Kurikulum Edu Class",
    username: "kurikulum",
    password: "kurikulum123",
    role: "kurikulum" as const,
    email: "kurikulum@educlass.com",
  },
  {
    nama: "Kepala Sekolah",
    username: "kepalasekolah",
    password: "kepalasekolah123",
    role: "kepala-sekolah" as const,
    email: "kepalasekolah@educlass.com",
  },
];

async function seed() {
  try {
    console.log("================================");
    console.log("Menghubungkan ke MongoDB...");
    console.log("================================");

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB berhasil terhubung.");
    console.log("");

    // Hapus semua user lama
    await User.deleteMany({});

    console.log("Data user lama berhasil dibersihkan.");
    console.log("");

    // Membuat 5 akun
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(
        user.password,
        10
      );

      await User.create({
        nama: user.nama,
        username: user.username,
        password: hashedPassword,
        role: user.role,
        email: user.email,
        aktif: true,
      });

      console.log(
        `✓ User ${user.username} berhasil dibuat`
      );
    }

    console.log("");
    console.log("================================");
    console.log("SEED DATABASE BERHASIL");
    console.log("================================");
    console.log("5 akun berhasil dibuat.");
    console.log("");
    console.log("Akun login:");
    console.log("admin        / admin123");
    console.log("guru         / guru123");
    console.log("siswa        / siswa123");
    console.log("kurikulum    / kurikulum123");
    console.log(
      "kepalasekolah / kepalasekolah123"
    );
    console.log("================================");
  } catch (error) {
    console.error("");
    console.error("================================");
    console.error("SEED DATABASE GAGAL");
    console.error("================================");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("");
    console.log("Koneksi MongoDB ditutup.");
  }
}

seed();