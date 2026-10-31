/**
 * GOOGLE APPS SCRIPT DATABASE - UNDANGAN DIGITAL ARFID & ARIN
 * -------------------------------------------------------------
 * Script ini mengelola:
 * 1. Mode Publik: Tamu mengisi nama sendiri di website (otomatis tambah baris baru).
 * 2. Mode UID: Tamu membuka link khusus dengan /PUB-62787 atau ?uid=UID (otomatis update status baris tamu terkait).
 * 3. Menu Spreadsheet Otomatis: Generate UID & Link Undangan siap kirim WhatsApp.
 * 4. API GET:
 *    - Jika parameter ?uid=... : Lookup data tamu untuk personalisasi ("Dear: Nama Tamu").
 *    - Jika tanpa parameter : Menampilkan daftar Live Wishes secara real-time di website.
 * 5. API POST: Menerima konfirmasi kehadiran & ucapan tanpa terkena blokir CORS.
 *
 * CARA PEMASANGAN:
 * 1. Buka Google Spreadsheet di Google Drive Anda.
 * 2. Klik menu 'Extensions' (Ekstensi) -> 'Apps Script'.
 * 3. Hapus semua kode default, lalu tempelkan (paste) seluruh kode ini.
 * 4. Klik tombol 'Save' (ikon disket / Ctrl + S).
 * 5. Klik 'Deploy' (Terapkan) -> 'Manage deployments' (Kelola penerapan).
 * 6. Klik ikon pensil (Edit) -> Version: 'New version' -> klik 'Deploy'.
 */

// ================= PENGATURAN DASAR =================
// URL website undangan di Vercel (tanpa garis miring di akhir)
const BASE_URL_UNDANGAN = "https://arfid-arin.vercel.app";

const SHEET_NAME = "Daftar Tamu";

/**
 * Menu otomatis saat Spreadsheet dibuka
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    if (ui) {
      ui.createMenu("👰 Undangan Arfid & Arin")
        .addItem("🛠️ 1. Buat Format Sheet Otomatis", "setupSheet")
        .addItem("✨ 2. Generate UID & Link Tamu Baru", "generateUIDAndLinks")
        .addToUi();
    }
  } catch (e) {}
}

/**
 * Fungsi 1: Menyiapkan struktur sheet database tamu otomatis (tanpa kolom pantangan makanan)
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    const sheets = ss.getSheets();
    if (sheets.length > 0 && sheets[0].getLastRow() === 0 && sheets[0].getName().toLowerCase().includes("sheet")) {
      sheets[0].setName(SHEET_NAME);
      sheet = sheets[0];
    } else {
      sheet = ss.insertSheet(SHEET_NAME);
    }
  }

  // 9 Kolom Standar (Kolom Pantangan Makanan dihapus)
  const headers = [
    "UID",
    "Nama Tamu",
    "Kategori / Asal",
    "Nomor WhatsApp",
    "Link Undangan",
    "Status Kehadiran",
    "Pax (Jumlah Tamu)",
    "Ucapan & Doa",
    "Waktu Konfirmasi"
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight("bold")
    .setBackground("#4d4930")
    .setFontColor("#ebdfc7");
  sheet.setFrozenRows(1);

  try {
    const ui = SpreadsheetApp.getUi();
    if (ui) ui.alert("Format Sheet 'Daftar Tamu' berhasil dibuat!");
  } catch (e) {}
}

/**
 * Fungsi 2: Generate UID unik dan Link Undangan personal pendek untuk setiap tamu
 */
function generateUIDAndLinks() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    try {
      SpreadsheetApp.getUi().alert("Sheet 'Daftar Tamu' tidak ditemukan. Jalankan menu 1 (Buat Format Sheet) terlebih dahulu.");
    } catch (e) {}
    return;
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    try {
      SpreadsheetApp.getUi().alert("Belum ada data tamu. Ketik nama tamu di Kolom B (mulai baris 2), lalu jalankan menu ini kembali.");
    } catch (e) {}
    return;
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
  let updatedCount = 0;

  for (let i = 0; i < data.length; i++) {
    let uid = String(data[i][0]).trim();
    const name = String(data[i][1]).trim();
    let link = String(data[i][4]).trim();

    // Lewati baris kosong
    if (!name) continue;

    // Jika UID atau Link belum ada, buatkan otomatis
    if (!uid || !link) {
      if (!uid) {
        // Format UID ramah URL: AA-nama-4digit
        const cleanName = name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .substring(0, 8);
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        uid = "AA-" + (cleanName || "tamu") + "-" + randomCode;
        sheet.getRange(i + 2, 1).setValue(uid);
      }

      // Buat Link Undangan personal pendek (misal: https://arfid-arin.vercel.app/AA-budi-1234)
      link = BASE_URL_UNDANGAN + "/" + uid;
      sheet.getRange(i + 2, 5).setValue(link);
      updatedCount++;
    }
  }

  try {
    const ui = SpreadsheetApp.getUi();
    if (ui) ui.alert("Berhasil membuat UID dan Link Undangan untuk " + updatedCount + " tamu!");
  } catch (e) {}
}

/**
 * Handle API GET:
 * 1. Jika ada parameter ?uid=... : Mengembalikan data nama tamu untuk link pendek (misal /PUB-62787)
 * 2. Jika tanpa parameter : Mengembalikan daftar ucapan (Live Wishes)
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonResponse(e && e.parameter && e.parameter.uid ? { status: "not_found", found: false } : []);
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return jsonResponse(e && e.parameter && e.parameter.uid ? { status: "not_found", found: false } : []);
    }

    // 1. Endpoint lookup data tamu berdasarkan UID (untuk link https://arfid-arin.vercel.app/PUB-62787)
    if (e && e.parameter && e.parameter.uid) {
      const targetUid = String(e.parameter.uid).trim();
      const numCols = Math.max(sheet.getLastColumn(), 9);
      const data = sheet.getRange(2, 1, lastRow - 1, numCols).getValues();
      for (let i = 0; i < data.length; i++) {
        const rowUid = String(data[i][0]).trim();
        if (rowUid.toLowerCase() === targetUid.toLowerCase()) {
          const attendanceVal = String(data[i][5] || "").trim();
          return jsonResponse({
            status: "success",
            found: true,
            uid: rowUid,
            name: String(data[i][1] || "").trim(),
            origin: String(data[i][2] || "").trim(),
            attendance: attendanceVal === "Hadir" || attendanceVal === "attending" ? "attending" : (attendanceVal ? "not_attending" : "")
          });
        }
      }
      return jsonResponse({ status: "success", found: false, uid: targetUid });
    }

    // 2. Endpoint Live Wishes (daftar ucapan)
    const numCols = Math.max(sheet.getLastColumn(), 9);
    const headerRow = sheet.getRange(1, 1, 1, numCols).getValues()[0];
    let msgColIdx = 7;  // Kolom 8 (index 7)
    let timeColIdx = 8; // Kolom 9 (index 8)

    for (let c = 0; c < headerRow.length; c++) {
      const h = String(headerRow[c] || "").toLowerCase();
      if (h.includes("ucapan") || h.includes("doa") || h.includes("message")) msgColIdx = c;
      if (h.includes("waktu") || h.includes("konfirmasi") || h.includes("time")) timeColIdx = c;
    }

    const values = sheet.getRange(2, 1, lastRow - 1, numCols).getValues();
    const wishes = [];

    // Baca dari baris terbaru ke terlama (maksimal 60 ucapan)
    for (let i = values.length - 1; i >= 0; i--) {
      const name = String(values[i][1] || "").trim();
      const status = String(values[i][5] || "").trim();
      const message = String(values[i][msgColIdx] || "").trim();
      const date = values[i][timeColIdx];

      if (name && message) {
        wishes.push({
          name: name,
          rsvpStatus: status === "Hadir" ? "attending" : "not_attending",
          rsvp_message: message,
          createdAt: date instanceof Date ? date.toISOString() : (date || new Date().toISOString())
        });
      }

      if (wishes.length >= 60) break;
    }

    return jsonResponse(wishes);
  } catch (err) {
    return jsonResponse([]);
  }
}

/**
 * Handle API POST: Menerima konfirmasi RSVP dari website
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: "error", message: "No data received" });
    }

    const payload = JSON.parse(e.postData.contents);
    const name = payload.name ? String(payload.name).trim() : "";
    const rsvpStatus = payload.rsvpStatus || "attending";
    const origin = payload.origin || "";
    const message = payload.rsvp_message || payload.message || "";
    const uid = payload.uid ? String(payload.uid).trim() : "";
    const now = new Date();

    if (!name) {
      return jsonResponse({ status: "error", message: "Name is required" });
    }

    // Perhitungan PAX:
    // Tidak Hadir: 0
    // Hadir Sendiri: 1
    // Hadir Berdua (+ pasangan): 2
    // Hadir Bertiga (+ pasangan + anak): 3
    const isAttending = rsvpStatus === "attending" || payload.attendance === "yes";
    let pax = 0;
    if (isAttending) {
      pax = typeof payload.pax === "number" ? payload.pax : (Number(payload.pax) || 1);
      if (pax <= 0) pax = 1;
    } else {
      pax = 0;
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      setupSheet();
      sheet = ss.getSheetByName(SHEET_NAME);
    }

    const lastRow = sheet.getLastRow();
    const numCols = Math.max(sheet.getLastColumn(), 9);
    const headerRow = sheet.getRange(1, 1, 1, numCols).getValues()[0];

    let msgCol = 8;
    let timeCol = 9;
    let hasDietaryCol = false;

    for (let c = 0; c < headerRow.length; c++) {
      const h = String(headerRow[c] || "").toLowerCase();
      if (h.includes("pantangan") || h.includes("dietary")) hasDietaryCol = true;
      if (h.includes("ucapan") || h.includes("doa") || h.includes("message")) msgCol = c + 1;
      if (h.includes("waktu") || h.includes("konfirmasi") || h.includes("time")) timeCol = c + 1;
    }

    let rowIndexToUpdate = -1;

    // Jika UID disertakan, cari baris tamu yang sesuai
    if (uid && lastRow >= 2) {
      const uids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (let i = 0; i < uids.length; i++) {
        if (String(uids[i][0]).trim().toLowerCase() === uid.toLowerCase()) {
          rowIndexToUpdate = i + 2;
          break;
        }
      }
    }

    const statusLabel = isAttending ? "Hadir" : "Tidak Hadir";

    if (rowIndexToUpdate > 0) {
      // Update data tamu yang sudah terdaftar
      sheet.getRange(rowIndexToUpdate, 6).setValue(statusLabel); // Status Kehadiran
      sheet.getRange(rowIndexToUpdate, 7).setValue(pax);         // Pax
      if (message) sheet.getRange(rowIndexToUpdate, msgCol).setValue(message);
      sheet.getRange(rowIndexToUpdate, timeCol).setValue(now);  // Waktu Konfirmasi
    } else {
      // Mode Publik: Tambahkan baris baru
      const newUid = uid || ("PUB-" + Math.floor(10000 + Math.random() * 90000));
      const link = BASE_URL_UNDANGAN + "/" + newUid;

      const newRow = [
        newUid,
        name,
        origin,
        "",          // Nomor WA
        link,
        statusLabel,
        pax
      ];
      if (hasDietaryCol) newRow.push(""); // Jika sheet lama masih ada kolom Pantangan Makanan
      newRow.push(message);
      newRow.push(now);

      sheet.appendRow(newRow);
    }

    return jsonResponse({
      status: "success",
      message: "RSVP recorded successfully",
      data: {
        name: name,
        rsvpStatus: rsvpStatus,
        pax: pax,
        message: message
      }
    });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Helper untuk response JSON dengan CORS bebas
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
