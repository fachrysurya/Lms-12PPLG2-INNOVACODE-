"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

export type MenuItem = {
  href: string;
  label: string;
  extraMatchPrefixes?: string[];
};

export type RoleLayoutProps = {
  role: "admin" | "guru" | "siswa" | "kurikulum" | "kepala-sekolah";
  rolePrefix: "admin" | "guru" | "siswa" | "kurikulum" | "kepsek";
  roleBadge: string;
  headerLabel: string;
  headerTitle: string;
  user: {
    nama: string;
    roleLabel: string;
  };
  menuItems: MenuItem[];
  children: React.ReactNode;
};

export default function RoleLayout({
  role,
  rolePrefix,
  roleBadge,
  headerLabel,
  headerTitle,
  user,
  menuItems,
  children,
}: RoleLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar automatically on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle ESC key and lock body scroll on mobile when sidebar is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.classList.add("sidebar-open-locked");
    } else {
      document.body.classList.remove("sidebar-open-locked");
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("sidebar-open-locked");
    };
  }, [isOpen]);

  const isLinkActive = (item: MenuItem) => {
    if (pathname === item.href) return true;
    if (item.href.endsWith("/dashboard")) return false;
    if (pathname.startsWith(item.href)) return true;
    if (item.extraMatchPrefixes) {
      return item.extraMatchPrefixes.some((prefix) =>
        pathname.startsWith(prefix)
      );
    }
    return false;
  };

  return (
    <div className={`${rolePrefix}-layout`}>
      {/* MOBILE BACKDROP OVERLAY */}
      <div
        className={`sidebar-backdrop ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* SIDEBAR */}
      <aside
        className={`${rolePrefix}-sidebar ${isOpen ? "open" : ""}`}
        aria-label={`${roleBadge} Sidebar Menu`}
      >
        <div className="sidebar-brand-wrapper">
          <div className={`${rolePrefix}-logo`}>
            Edu<span>Class</span>
          </div>

          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Tutup menu navigasi"
            title="Tutup Menu"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className={`${rolePrefix}-role`}>{roleBadge}</div>

        <nav className={`${rolePrefix}-sidebar-menu`}>
          {menuItems.map((item) => {
            const active = isLinkActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "active" : ""}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={`${rolePrefix}-sidebar-bottom`}>
          <Link href="/login" onClick={() => setIsOpen(false)}>
            Logout
          </Link>
        </div>
      </aside>

      {/* CONTENT */}
      <div className={`${rolePrefix}-content`}>
        {/* HEADER */}
        <header className={`${rolePrefix}-header`}>
          <div className="role-header-left">
            {/* THREE-DOTS TOGGLE BUTTON (PAS DI HP) */}
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Buka menu navigasi"
              aria-expanded={isOpen}
              title="Menu Navigasi (Titik Tiga)"
            >
              <Icon name="dots-vertical" />
            </button>

            <div className="role-header-titles">
              <p className={`${rolePrefix}-header-label`}>{headerLabel}</p>
              <h1>{headerTitle}</h1>
            </div>
          </div>

          <div className={`${rolePrefix}-user`}>
            <div className={`${rolePrefix}-user-avatar`}>
              {user.nama ? user.nama.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="role-user-text">
              <strong>{user.nama}</strong>
              <span>{user.roleLabel}</span>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className={`${rolePrefix}-main`}>{children}</main>
      </div>
    </div>
  );
}
