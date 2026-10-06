import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "edu_class_session";

const roleRoutes: Record<string, string> = {
  admin: "/admin",
  guru: "/guru",
  siswa: "/siswa",
  kurikulum: "/kurikulum",
  "kepala-sekolah": "/kepala-sekolah",
};

const dashboardRoutes: Record<string, string> = {
  admin: "/admin/dashboard",
  guru: "/guru/dashboard",
  siswa: "/siswa/dashboard",
  kurikulum: "/kurikulum/dashboard",
  "kepala-sekolah": "/kepala-sekolah/dashboard",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Route yang tidak perlu login
  const publicRoutes = [
    "/",
    "/login",
  ];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Route API tidak boleh di-redirect ke halaman login,
  // karena client mengharapkan respons JSON, bukan HTML.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE);

  // Belum login
  if (!sessionCookie?.value) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set(
      "redirect",
      pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  try {
    const session = JSON.parse(
      decodeURIComponent(sessionCookie.value)
    );

    const role = session.role;

    // Role tidak valid
    if (!role || !roleRoutes[role]) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    // Cek apakah user sedang membuka area role tertentu
    for (const [routeRole, routePath] of Object.entries(
      roleRoutes
    )) {
      if (
        pathname === routePath ||
        pathname.startsWith(`${routePath}/`)
      ) {
        // User mencoba membuka dashboard/halaman role lain
        if (routeRole !== role) {
          return NextResponse.redirect(
            new URL(
              dashboardRoutes[role],
              request.url
            )
          );
        }

        break;
      }
    }

    return NextResponse.next();
  } catch {
    // Cookie rusak / tidak valid
    const response = NextResponse.redirect(
      new URL("/login", request.url)
    );

    response.cookies.delete(SESSION_COOKIE);

    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};