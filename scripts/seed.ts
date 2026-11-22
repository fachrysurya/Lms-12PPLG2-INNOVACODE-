import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";

dotenv.config({
  path: ".env.local",
});

const MONGODB_URI: string = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI belum diatur di file .env.local");
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);

    const existingAdmin = await User.findOne({
      role: "admin",
      aktif: true,
    });
    if (existingAdmin) {
      console.log("Akun admin sudah tersedia; tidak ada data yang diubah.");
      return;
    }

    const username = process.env.INITIAL_ADMIN_USERNAME?.trim();
    const password = process.env.INITIAL_ADMIN_PASSWORD;

    if (!username || !password) {
      throw new Error(
        "Atur INITIAL_ADMIN_USERNAME dan INITIAL_ADMIN_PASSWORD di .env.local untuk membuat admin awal."
      );
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new Error(
        "Username admin awal sudah dipakai akun dengan role berbeda."
      );
    }

    await User.create({
      nama: process.env.INITIAL_ADMIN_NAME?.trim() || "Administrator",
      username,
      password: await bcrypt.hash(password, 10),
      role: "admin",
      aktif: true,
    });

    console.log("Akun admin awal berhasil dibuat.");
  } catch (error) {
    console.error("SEED DATABASE GAGAL:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
