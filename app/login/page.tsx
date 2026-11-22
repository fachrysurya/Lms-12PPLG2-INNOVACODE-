"use client";

import Link from "next/link";
import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "../actions/auth";

function LoginForm() {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(loginAction, {});

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


          <form className="login-form" action={formAction}>
            <input
              type="hidden"
              name="redirect"
              value={searchParams.get("redirect") || ""}
            />

            <div className="form-group">
              <label htmlFor="identifier">Identitas Login</label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="Masukkan NISN, email, NIP, atau username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Masukkan password"
                required
              />
            </div>

            {state.error && (
              <p
                style={{
                  margin: "0",
                  color: "#dc3c3c",
                  fontSize: "13px",
                }}
              >
                {state.error}
              </p>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={isPending}
            >
              {isPending ? "Memproses..." : "Login"}
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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}