/**
 * Generator file Excel sederhana tanpa dependency eksternal.
 *
 * Menghasilkan file berformat SpreadsheetML (XML) yang dapat
 * dibuka oleh Microsoft Excel, LibreOffice, dan Google Sheets.
 */

type ExcelKolom = {
  key: string;
  label: string;
};

type ExcelBaris = Record<string, unknown>;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function ambilNilai(baris: ExcelBaris, key: string): string {
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
 * Membuat Blob berisi file Excel (.xls) berisi tabel data.
 */
export function buatExcel(
  judul: string,
  kolom: ExcelKolom[],
  baris: ExcelBaris[]
): Blob {
  const barisXml: string[] = [];

  // Judul di baris pertama, digabung sepanjang kolom
  barisXml.push(
    `<Row><Cell ss:MergeAcross="${Math.max(
      0,
      kolom.length - 1
    )}" ss:StyleID="judul"><Data ss:Type="String">${escapeXml(
      judul
    )}</Data></Cell></Row>`
  );

  // Sub-judul tanggal cetak
  barisXml.push(
    `<Row><Cell ss:MergeAcross="${Math.max(
      0,
      kolom.length - 1
    )}" ss:StyleID="subJudul"><Data ss:Type="String">${escapeXml(
      `Dicetak: ${new Date().toLocaleString("id-ID")}`
    )}</Data></Cell></Row>`
  );

  // Baris kosong
  barisXml.push("<Row></Row>");

  // Header kolom
  const headerCells = kolom
    .map(
      (k) =>
        `<Cell ss:StyleID="header"><Data ss:Type="String">${escapeXml(
          k.label
        )}</Data></Cell>`
    )
    .join("");

  barisXml.push(`<Row>${headerCells}</Row>`);

  // Baris data
  baris.forEach((item) => {
    const cells = kolom
      .map((k) => {
        const teks = ambilNilai(item, k.key);

        return `<Cell><Data ss:Type="String">${escapeXml(
          teks
        )}</Data></Cell>`;
      })
      .join("");

    barisXml.push(`<Row>${cells}</Row>`);
  });

  const kolomXml = kolom
    .map(() => '<Column ss:AutoFitWidth="1" ss:Width="140"/>')
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="judul">
   <Font ss:Bold="1" ss:Size="14"/>
  </Style>
  <Style ss:ID="subJudul">
   <Font ss:Size="10" ss:Color="#666666"/>
  </Style>
  <Style ss:ID="header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#1261D6" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${escapeXml(
    judul.slice(0, 31)
  )}">
  <Table>
   ${kolomXml}
   ${barisXml.join("\n   ")}
  </Table>
 </Worksheet>
</Workbook>`;

  return new Blob([xml], {
    type: "application/vnd.ms-excel",
  });
}
