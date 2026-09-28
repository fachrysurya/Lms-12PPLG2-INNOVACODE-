"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const accounts = [
  {
    id: "1",
    nama: "Administrator",
    username: "admin",
    password: "admin123",
    role: "admin",
  },
  {
    id: "2",
    nama: "Guru Edu Class",
    username: "guru",
    password: "guru123",
    role: "guru",
  },
  {
    id: "3",
    nama: "Siswa Edu Class",
    username: "siswa",
    password: "siswa123",
    role: "siswa",
  },
  {
    id: "4",
    nama: "Kurikulum Edu Class",
    username: "kurikulum",
    password: "kurikulum123",
    role: "kurikulum",
  },
  {
    id: "5",
    nama: "Kepala Sekolah",
    username: "kepalasekolah",
    password: "kepalasekolah123",
    role: "kepala-sekolah",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const account = accounts.find(
      (item) =>
        item.username === username &&
        item.password === password
    );

    if (!account) {
      setError("Username atau password salah.");
      setLoading(false);
      return;
    }

    const session = {
      id: account.id,
      nama: account.nama,
      username: account.username,
      role: account.role,
    };

    document.cookie =
      `edu_class_session=${encodeURIComponent(
        JSON.stringify(session)
      )}; path=/; max-age=86400; samesite=lax`;

    const redirectPath = searchParams.get("redirect");

    router.push(
      redirectPath || `/${account.role}/dashboard`
    );

    router.refresh();
  }

  return (
    <main className="login-page">
      <div className="login-container">

        {/* BAGIAN KIRI */}
        <div className="login-info">

          <Link href="/" className="login-logo">
            Edu<span>Class</span>
          </Link>

          <div className="login-info-content">

            <p className="login-label">
              LEARNING MANAGEMENT SYSTEM
            </p>

            <h1>
              Smart Education
              <br />
              Management System
            </h1>

            <p>
              Kelola pembelajaran, materi, tugas,
              asesmen, dan nilai dalam satu platform.
            </p>

          </div>

          <div className="login-info-footer">
            © 2026 Edu Class
          </div>

        </div>


        {/* BAGIAN KANAN */}
        <div className="login-box">

          <div className="login-header">
            <h2>Selamat Datang</h2>

            <p>
              Silakan masuk ke akun Edu Class Anda
            </p>
          </div>


          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            {/* USERNAME */}
            <div className="form-group">

              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                required
              />

            </div>


            {/* PASSWORD */}
            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

            </div>


            {/* ERROR */}
            {error && (
              <p
                style={{
                  margin: "0",
                  color: "#dc3c3c",
                  fontSize: "13px",
                }}
              >
                {error}
              </p>
            )}


            {/* LOGIN */}
            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading
                ? "Memproses..."
                : "Login"}
            </button>

          </form>


          <div className="login-back">

            <Link href="/">
              ← Kembali ke halaman utama
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}