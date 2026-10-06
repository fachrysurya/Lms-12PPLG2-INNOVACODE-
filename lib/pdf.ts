/**
 * Generator PDF sederhana tanpa dependency eksternal.
 *
 * Membuat dokumen PDF valid (PDF 1.4) berisi judul + tabel data.
 * Ukuran halaman A4 landscape agar muat banyak kolom.
 */

type PdfKolom = {
  key: string;
  label: string;
};

type PdfBaris = Record<string, unknown>;

const HALAMAN_LEBAR = 842; // A4 landscape (pt)
const HALAMAN_TINGGI = 595;

const MARGIN = 36;
const FONT_SIZE = 9;
const BARIS_TINGGI = 18;
const HEADER_TINGGI = 22;

// Lebar tiap karakter (perkiraan) memakai font Helvetica.
// Cukup akurat untuk memotong teks agar tidak tumpang tindih.
const LEBAR_KARAKTER_RATA = 0.5 * FONT_SIZE;

function escapePdfText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    // PDF standar memakai Latin-1; ganti karakter di luar itu.
    .replace(/[^\x20-\x7E]/g, "?");
}

function potongTeks(text: string, maxLebar: number): string {
  const maxKarakter = Math.max(
    1,
    Math.floor(maxLebar / LEBAR_KARAKTER_RATA)
  );

  if (text.length <= maxKarakter) {
    return text;
  }

  return text.slice(0, Math.max(1, maxKarakter - 1)) + "\u2026";
}

function ambilNilai(baris: PdfBaris, key: string): string {
  const nilai = baris[key];

  if (nilai === null || nilai === undefined) {
    return "";
  }

  if (typeof nilai === "boolean") {
    return nilai ? "Aktif" : "Nonaktif";
  }

  if (Array.isArray(nilai)) {
    return nilai.join(", ");
  }

  if (typeof nilai === "object") {
    return JSON.stringify(nilai);
  }

  return String(nilai);
}

/**
 * Menyusun isi stream PDF (teks + garis tabel) untuk satu halaman.
 */
function buatStreamHalaman(
  judul: string,
  kolom: PdfKolom[],
  baris: PdfBaris[],
  nomorHalaman: number,
  totalHalaman: number
): string {
  const lebarArea = HALAMAN_LEBAR - MARGIN * 2;
  const lebarKolom = lebarArea / kolom.length;

  const parts: string[] = [];

  // Judul
  parts.push("BT");
  parts.push("/F2 14 Tf");
  parts.push(
    `1 0 0 1 ${MARGIN} ${HALAMAN_TINGGI - MARGIN - 12} Tm`
  );
  parts.push(`(${escapePdfText(judul)}) Tj`);
  parts.push("ET");

  // Sub-judul (tanggal cetak)
  parts.push("BT");
  parts.push("/F1 9 Tf");
  parts.push(
    `1 0 0 1 ${MARGIN} ${HALAMAN_TINGGI - MARGIN - 28} Tm`
  );
  parts.push(
    `(${escapePdfText(
      `Dicetak: ${new Date().toLocaleString("id-ID")}`
    )}) Tj`
  );
  parts.push("ET");

  let y = HALAMAN_TINGGI - MARGIN - 48;

  // Header tabel
  parts.push("0.12 0.32 0.71 rg"); // warna biru
  parts.push(
    `${MARGIN} ${y - HEADER_TINGGI + 6} ${lebarArea
    } ${HEADER_TINGGI} re f`
  );
  parts.push("1 1 1 rg"); // teks putih

  kolom.forEach((k, i) => {
    const x = MARGIN + i * lebarKolom + 4;
    const teks = potongTeks(k.label, lebarKolom - 8);

    parts.push("BT");
    parts.push("/F2 9 Tf");
    parts.push(`1 0 0 1 ${x} ${y - 10} Tm`);
    parts.push(`(${escapePdfText(teks)}) Tj`);
    parts.push("ET");
  });

  y -= HEADER_TINGGI;

  // Baris data
  parts.push("0 0 0 rg"); // teks hitam

  baris.forEach((item, indexBaris) => {
    // Latar belang
    if (indexBaris % 2 === 1) {
      parts.push("0.94 0.96 0.99 rg");
      parts.push(
        `${MARGIN} ${y - BARIS_TINGGI + 4} ${lebarArea} ${BARIS_TINGGI} re f`
      );
      parts.push("0 0 0 rg");
    }

    kolom.forEach((k, i) => {
      const x = MARGIN + i * lebarKolom + 4;
      const teks = potongTeks(
        ambilNilai(item, k.key),
        lebarKolom - 8
      );

      parts.push("BT");
      parts.push("/F1 9 Tf");
      parts.push(`1 0 0 1 ${x} ${y - 9} Tm`);
      parts.push(`(${escapePdfText(teks)}) Tj`);
      parts.push("ET");
    });

    // Garis pemisah
    parts.push("0.85 0.87 0.9 RG");
    parts.push("0.5 w");
    parts.push(
      `${MARGIN} ${y - BARIS_TINGGI + 4} m ${MARGIN + lebarArea
      } ${y - BARIS_TINGGI + 4} l S`
    );

    y -= BARIS_TINGGI;
  });

  // Nomor halaman
  parts.push("BT");
  parts.push("/F1 8 Tf");
  parts.push("0.4 0.4 0.4 rg");
  const teksHalaman = `Halaman ${nomorHalaman} dari ${totalHalaman}`;
  const lebarTeks = teksHalaman.length * 0.5 * 8;
  parts.push(
    `1 0 0 1 ${HALAMAN_LEBAR - MARGIN - lebarTeks
    } ${MARGIN - 14} Tm`
  );
  parts.push(`(${escapePdfText(teksHalaman)}) Tj`);
  parts.push("ET");

  return parts.join("\n");
}

/**
 * Membuat Blob PDF berisi tabel data.
 */
export function buatPDF(
  judul: string,
  kolom: PdfKolom[],
  baris: PdfBaris[]
): Blob {
  const tinggiAreaData = HALAMAN_TINGGI - MARGIN * 2 - 48 - HEADER_TINGGI;
  const maksBarisPerHalaman = Math.max(
    1,
    Math.floor(tinggiAreaData / BARIS_TINGGI)
  );

  // Pecah baris ke beberapa halaman
  const halaman: PdfBaris[][] = [];

  for (let i = 0; i < baris.length; i += maksBarisPerHalaman) {
    halaman.push(baris.slice(i, i + maksBarisPerHalaman));
  }

  if (halaman.length === 0) {
    halaman.push([]);
  }

  const objects: string[] = [];

  const jumlahHalaman = halaman.length;

  // Objek 1: Catalog
  // Objek 2: Pages
  // Objek 3: Font F1 (Helvetica)
  // Objek 4: Font F2 (Helvetica-Bold)
  // Selanjutnya: untuk tiap halaman -> Page + Contents
  const idFontF1 = 3;
  const idFontF2 = 4;

  const pageIds: number[] = [];
  let nextId = 5;

  const halamanObjects: { pageId: number; contentId: number; stream: string }[] =
    [];

  halaman.forEach((rows, index) => {
    const pageId = nextId++;
    const contentId = nextId++;

    pageIds.push(pageId);

    halamanObjects.push({
      pageId,
      contentId,
      stream: buatStreamHalaman(
        judul,
        kolom,
        rows,
        index + 1,
        jumlahHalaman
      ),
    });
  });

  // Catalog
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";

  // Pages
  const kids = pageIds.map((id) => `${id} 0 R`).join(" ");
  objects[2] = `<< /Type /Pages /Kids [${kids}] /Count ${pageIds.length} >>`;

  // Fonts
  objects[idFontF1] =
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
  objects[idFontF2] =
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";

  halamanObjects.forEach((h) => {
    objects[h.pageId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${HALAMAN_LEBAR} ${HALAMAN_TINGGI}] ` +
      `/Resources << /Font << /F1 ${idFontF1} 0 R /F2 ${idFontF2} 0 R >> >> ` +
      `/Contents ${h.contentId} 0 R >>`;

    objects[h.contentId] =
      `<< /Length ${h.stream.length} >>\nstream\n${h.stream}\nendstream`;
  });

  // Susun file PDF
  let pdf = "%PDF-1.4\n";

  const offsets: number[] = [];

  for (let i = 1; i < objects.length; i++) {
    const obj = objects[i];

    if (!obj) {
      continue;
    }

    offsets[i] = pdf.length;

    pdf += `${i} 0 obj\n${obj}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  const jumlahObjek = objects.length; // termasuk index 0

  pdf += `xref\n0 ${jumlahObjek}\n`;
  pdf += "0000000000 65535 f \n";

  for (let i = 1; i < objects.length; i++) {
    if (!objects[i]) {
      pdf += "0000000000 65535 f \n";
      continue;
    }

    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${jumlahObjek} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  // Encode sebagai latin1 agar byte sesuai offset
  const bytes = new Uint8Array(pdf.length);

  for (let i = 0; i < pdf.length; i++) {
    bytes[i] = pdf.charCodeAt(i) & 0xff;
  }

  return new Blob([bytes], { type: "application/pdf" });
}
