/**
 * GOOGLE APPS SCRIPT DATABASE - UNDANGAN DIGITAL ARFID & ARIN
 * -------------------------------------------------------------
 * Script ini mengelola:
 * 1. Mode Publik: Tamu mengisi nama sendiri di website (otomatis tambah baris baru).
 * 2. Mode UID: Tamu membuka link khusus dengan ?to=Nama&uid=UID (otomatis update status baris tamu terkait).
 * 3. Menu Spreadsheet Otomatis: Generate UID & Link Undangan siap kirim WhatsApp.
 * 4. API GET: Menampilkan daftar Live Wishes secara real-time di website.
 * 5. API POST: Menerima konfirmasi kehadiran & ucapan tanpa terkena blokir CORS.
 *
 * CARA PEMASANGAN:
 * 1. Buat Google Spreadsheet baru di Google Drive Anda.
 * 2. Klik menu 'Extensions' (Ekstensi) -> 'Apps Script'.
 * 3. Hapus semua kode default, lalu tempelkan (paste) seluruh kode ini.
 * 4. Ganti konstanta BASE_URL_UNDANGAN di bawah dengan URL website undangan Anda.
 * 5. Klik 'Deploy' (Terapkan) -> 'New deployment' (Penerapan baru).
 * 6. Pilih jenis: 'Web app' (Aplikasi web).
 * 7. Konfigurasi:
 *    - Description: "RSVP Arfid & Arin"
 *    - Execute as: "Me" (Saya)
 *    - Who has access: "Anyone" (Siapa saja - PENTING agar tamu bisa submit tanpa login Google).
 * 8. Klik 'Deploy', izinkan otorisasi (Review permissions -> Advanced -> Go to ...).
 * 9. Salin "Web app URL" (akhiran /exec) dan tempelkan ke personalization.js pada properti gasEndpoint.
 */

// Ganti dengan URL domain website undangan Anda (misal Vercel / GitHub Pages / custom domain)
const BASE_URL_UNDANGAN = "https://arfid-arin.vercel.app";

const SHEET_NAME = "Daftar Tamu";

/**
 * Menu otomatis saat Spreadsheet dibuka
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("👰 Undangan Arfid & Arin")
    .addItem("🛠️ 1. Buat Format Sheet Otomatis", "setupSheet")
    .addItem("✨ 2. Generate UID & Link Undangan Tamu", "generateUIDAndLinks")
    .addToUi();
}

/**
 * Setup header kolom spreadsheet
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  const headers = [
    "UID",
    "Nama Tamu",
    "Kategori / Asal",
    "Nomor WhatsApp",
    "Link Undangan",
    "Status Kehadiran",
    "Pax (Jumlah Tamu)",
    "Pantangan Makanan",
    "Ucapan & Doa",
    "Waktu Konfirmasi"
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight("bold")
    .setBackground("#4d4930")
    .setFontColor("#ebdfc7");
  sheet.setFrozenRows(1);

  SpreadsheetApp.getUi().alert("Format Sheet 'Daftar Tamu' berhasil dibuat!");
}

/**
 * Generate UID unik dan Link Undangan personal untuk setiap tamu
 */
function generateUIDAndLinks() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    SpreadsheetApp.getUi().alert("Sheet 'Daftar Tamu' tidak ditemukan. Jalankan menu 1 (Buat Format Sheet) terlebih dahulu.");
    return;
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert("Belum ada data tamu. Ketik nama tamu di kolom 'Nama Tamu' (Kolom B) terlebih dahulu.");
    return;
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
  let updatedCount = 0;

  for (let i = 0; i < data.length; i++) {
    let uid = data[i][0];
    const name = data[i][1];
    let link = data[i][4];

    if (name && String(name).trim() !== "") {
      // Jika UID kosong, buat UID unik
      if (!uid || String(uid).trim() === "") {
        const rand = Math.floor(1000 + Math.random() * 9000);
        const slug = String(name).trim().toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 4);
        uid = "AA-" + slug + "-" + rand;
        sheet.getRange(i + 2, 1).setValue(uid);
      }

      // Buat Link Undangan personal
      const guestEncoded = encodeURIComponent(String(name).trim());
      link = BASE_URL_UNDANGAN + "/?to=" + guestEncoded + "&uid=" + uid;
      sheet.getRange(i + 2, 5).setValue(link);
      updatedCount++;
    }
  }

  SpreadsheetApp.getUi().alert("Berhasil membuat UID dan Link Undangan untuk " + updatedCount + " tamu!");
}

/**
 * Handle API GET: Mengembalikan daftar ucapan (Live Wishes)
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonResponse([]);
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return jsonResponse([]);
    }

    // Ambil kolom: Nama (B=2), Status Kehadiran (F=6), Ucapan (I=9), Waktu Konfirmasi (J=10)
    const values = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
    const wishes = [];

    for (let i = 0; i < values.length; i++) {
      const name = values[i][1];
      const status = values[i][5];
      const message = values[i][8];
      const time = values[i][9];

      if (name && String(name).trim() !== "" && message && String(message).trim() !== "") {
        wishes.push({
          name: String(name).trim(),
          rsvpStatus: status === "attending" || status === "Hadir" ? "attending" : "not_attending",
          rsvp_message: String(message).trim(),
          createdAt: time ? new Date(time).toISOString() : new Date().toISOString()
        });
      }
    }

    // Urutkan dari yang paling baru
    wishes.reverse();
    return jsonResponse(wishes);
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Handle API POST: Menerima konfirmasi RSVP dari form website
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: "error", message: "No data received" });
    }

    const payload = JSON.parse(e.postData.contents);
    const name = payload.name ? String(payload.name).trim() : "";
    const rsvpStatus = payload.rsvpStatus || "attending";
    const pax = Number(payload.pax) || 1;
    const origin = payload.origin || "";
    const dietary = payload.dietary_requirements || "";
    const message = payload.rsvp_message || payload.message || "";
    const uid = payload.uid ? String(payload.uid).trim() : "";
    const now = new Date();

    if (!name) {
      return jsonResponse({ status: "error", message: "Name is required" });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      setupSheet();
      sheet = ss.getSheetByName(SHEET_NAME);
    }

    const lastRow = sheet.getLastRow();
    let rowIndexToUpdate = -1;

    // Jika UID disertakan, cari baris tamu yang sesuai
    if (uid && lastRow >= 2) {
      const uids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (let i = 0; i < uids.length; i++) {
        if (String(uids[i][0]).trim() === uid) {
          rowIndexToUpdate = i + 2;
          break;
        }
      }
    }

    const statusLabel = rsvpStatus === "attending" ? "Hadir" : "Tidak Hadir";

    if (rowIndexToUpdate > 0) {
      // Update data tamu yang sudah terdaftar
      sheet.getRange(rowIndexToUpdate, 6).setValue(statusLabel); // Status Kehadiran
      sheet.getRange(rowIndexToUpdate, 7).setValue(pax);         // Pax
      if (dietary) sheet.getRange(rowIndexToUpdate, 8).setValue(dietary);
      if (message) sheet.getRange(rowIndexToUpdate, 9).setValue(message);
      sheet.getRange(rowIndexToUpdate, 10).setValue(now);       // Waktu Konfirmasi
    } else {
      // Mode Publik: Tambahkan baris baru
      const newUid = uid || ("PUB-" + Math.floor(10000 + Math.random() * 90000));
      const guestEncoded = encodeURIComponent(name);
      const link = BASE_URL_UNDANGAN + "/?to=" + guestEncoded + "&uid=" + newUid;

      sheet.appendRow([
        newUid,
        name,
        origin,
        "",          // Nomor WA
        link,
        statusLabel,
        pax,
        dietary,
        message,
        now
      ]);
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
