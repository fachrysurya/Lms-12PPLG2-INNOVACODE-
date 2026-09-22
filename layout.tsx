import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Edu Class",
  description: "Learning Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}