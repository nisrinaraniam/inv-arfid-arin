/**
 * GOOGLE APPS SCRIPT DATABASE - UNDANGAN DIGITAL ARFID & ARIN
 * -------------------------------------------------------------
 * Fitur:
 * 1. Mode Personal Link:
 *    - Link berformat: https://arfid-arin.vercel.app/?to=Nama+Tamu&uid=RandomCode
 *    - Nama tamu langsung tampil seketika di cover & form RSVP tanpa loading/delay.
 *    - Saat tamu submit RSVP, otomatis mengupdate baris tamu terkait di spreadsheet.
 * 2. Mode Publik: Tamu yang membuka link umum otomatis dibuatkan baris baru.
 * 3. UID Acak: Kombinasi huruf besar, huruf kecil, angka, dan simbol (misal: "8k_m9-Xz", "W2_x!7*Q").
 * 4. Perhitungan Pax Akurat:
 *    - Tidak Hadir: 0 pax
 *    - Hadir Sendiri: 1 pax
 *    - Hadir Berdua (+ pasangan): 2 pax
 *    - Hadir Bertiga (+ pasangan + anak): 3 pax
 *    - Hadir Berdua (+ anak): 2 pax
 * 5. Deteksi Kolom Otomatis:
 *    - Menjamin Pax, Ucapan, dan Status masuk ke kolom yang tepat 100%.
 * 6. Fitur Reset Data Tes:
 *    - Menu untuk menghapus seluruh data tes dan ucapan sekali klik.
 *
 * CARA PEMASANGAN / UPDATE:
 * 1. Buka Google Spreadsheet undangan Anda di Google Drive.
 * 2. Klik menu 'Extensions' (Ekstensi) -> 'Apps Script'.
 * 3. Hapus semua kode default (Ctrl + A lalu Delete).
 * 4. Tempelkan (paste) seluruh kode ini (Ctrl + V).
 * 5. Klik tombol 'Save' (ikon disket / Ctrl + S).
 * 6. Klik 'Deploy' (Terapkan) -> 'Manage deployments' (Kelola penerapan).
 * 7. Klik ikon pensil (Edit) -> Version: 'New version' -> klik 'Deploy'.
 */

// URL website undangan di Vercel (tanpa garis miring di akhir)
const BASE_URL_UNDANGAN = "https://arfid-arin.vercel.app";

const SHEET_NAME = "Daftar Tamu";

/**
 * Generator UID acak: kombinasi huruf besar/kecil, angka, dan simbol aman
 * Contoh hasil: "8k_m9-Xz", "W2_x!7*Q", "3a$DZ*_G"
 */
function generateRandomUID(length) {
  length = length || 8;
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "_-$!@~*";
  const allChars = letters + numbers + symbols;

  let result = "";
  // Pastikan ada unsur huruf, angka, dan simbol
  result += letters.charAt(Math.floor(Math.random() * letters.length));
  result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  result += symbols.charAt(Math.floor(Math.random() * symbols.length));

  for (let i = 3; i < length; i++) {
    result += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Acak susunan karakter
  return result.split("").sort(() => 0.5 - Math.random()).join("");
}

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
        .addSeparator()
        .addItem("🧹 3. Reset / Hapus Semua Data Tes & Ucapan", "clearAllWishesAndTestData")
        .addToUi();
    }
  } catch (e) {}
}

/**
 * Fungsi 1: Menyiapkan struktur sheet database tamu otomatis (9 kolom tanpa pantangan makanan)
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
 * Fungsi 2: Generate UID acak (huruf-angka-simbol) dan Link Undangan personal dengan ?to=Nama&uid=UID
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

    // Jika UID belum ada, buatkan UID acak huruf-angka-simbol
    if (!uid) {
      uid = generateRandomUID(8);
      sheet.getRange(i + 2, 1).setValue(uid);
    }

    // Format Link: https://arfid-arin.vercel.app/?to=Nama+Tamu&uid=UID
    const guestEncoded = encodeURIComponent(name);
    const uidEncoded = encodeURIComponent(uid);
    link = BASE_URL_UNDANGAN + "/?to=" + guestEncoded + "&uid=" + uidEncoded;
    sheet.getRange(i + 2, 5).setValue(link);
    updatedCount++;
  }

  try {
    const ui = SpreadsheetApp.getUi();
    if (ui) ui.alert("Berhasil membuat UID dan Link Undangan personal untuk " + updatedCount + " tamu!");
  } catch (e) {}
}

/**
 * Fungsi 3: Menghapus seluruh baris data tes dan ucapan (mereset sheet menjadi kosong bersih)
 */
function clearAllWishesAndTestData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return;
  const lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    sheet.deleteRows(2, lastRow - 1);
    try {
      SpreadsheetApp.getUi().alert("Berhasil! Semua data ucapan dan baris tes telah dihapus. Tabel kembali bersih.");
    } catch (e) {}
  } else {
    try {
      SpreadsheetApp.getUi().alert("Tabel sudah bersih, tidak ada data yang perlu dihapus.");
    } catch (e) {}
  }
}

/**
 * Helper: Mencari letak index kolom secara tepat dari header baris ke-1
 */
function getColumnMapping(sheet) {
  const lastCol = Math.max(sheet.getLastColumn(), 10);
  const headerRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  let colStatus = 6;  // Default F
  let colPax = 7;     // Default G
  let colMessage = -1;
  let colTime = -1;
  let colDietary = -1;

  for (let c = 0; c < headerRow.length; c++) {
    const title = String(headerRow[c] || "").toLowerCase().trim();
    if (title.includes("status") || title.includes("kehadiran")) {
      colStatus = c + 1;
    } else if (title.includes("pax") || title.includes("jumlah")) {
      colPax = c + 1;
    } else if (title.includes("pantangan") || title.includes("diet")) {
      colDietary = c + 1;
    } else if (title.includes("ucapan") || title.includes("doa") || title.includes("pesan") || title.includes("wishes") || title.includes("message")) {
      colMessage = c + 1;
    } else if (title.includes("waktu") || title.includes("konfirmasi") || title.includes("tanggal") || title.includes("time") || title.includes("date")) {
      colTime = c + 1;
    }
  }

  if (colMessage === -1) {
    if (colDietary > 0) {
      colMessage = colDietary + 1;
    } else {
      colMessage = 8;
    }
  }

  if (colTime === -1) {
    colTime = colMessage + 1;
  }

  return {
    status: colStatus,
    pax: colPax,
    dietary: colDietary,
    message: colMessage,
    time: colTime,
    totalCols: lastCol
  };
}

/**
 * Handle API GET:
 * 1. Jika ada parameter ?uid=... : Mengembalikan data tamu untuk lookup
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

    const mapping = getColumnMapping(sheet);
    const data = sheet.getRange(2, 1, lastRow - 1, mapping.totalCols).getValues();

    // 1. Endpoint lookup data tamu berdasarkan UID
    if (e && e.parameter && e.parameter.uid) {
      const targetUid = String(e.parameter.uid).trim();
      for (let i = 0; i < data.length; i++) {
        const rowUid = String(data[i][0]).trim();
        if (rowUid.toLowerCase() === targetUid.toLowerCase()) {
          const attendanceVal = String(data[i][mapping.status - 1] || "").trim();
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
    const wishes = [];
    const msgIdx = mapping.message - 1;
    const timeIdx = mapping.time - 1;
    const statusIdx = mapping.status - 1;

    for (let i = data.length - 1; i >= 0; i--) {
      const name = String(data[i][1] || "").trim();
      const status = String(data[i][statusIdx] || "").trim();
      const message = String(data[i][msgIdx] || "").trim();
      const date = data[i][timeIdx];

      if (name && message && isNaN(Number(message))) {
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

    // Opsi reset semua data via POST jika diminta
    if (payload.action === "clear_all_wishes") {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAME);
      if (sheet && sheet.getLastRow() >= 2) {
        sheet.deleteRows(2, sheet.getLastRow() - 1);
      }
      return jsonResponse({ status: "success", message: "All wishes cleared" });
    }

    const name = payload.name ? String(payload.name).trim() : "";
    const rsvpStatus = payload.rsvpStatus || (payload.attendance === "yes" ? "attending" : "not_attending");
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
    // Hadir Berdua (+ anak): 2
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
    const mapping = getColumnMapping(sheet);

    let rowIndexToUpdate = -1;

    // Prioritas 1: Cari berdasarkan UID (Kolom A)
    if (uid && lastRow >= 2) {
      const uids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (let i = 0; i < uids.length; i++) {
        if (String(uids[i][0]).trim().toLowerCase() === uid.toLowerCase()) {
          rowIndexToUpdate = i + 2;
          break;
        }
      }
    }

    // Prioritas 2: Jika UID belum cocok, cari berdasarkan Nama Tamu (Kolom B)
    if (rowIndexToUpdate === -1 && name && lastRow >= 2) {
      const names = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (let i = 0; i < names.length; i++) {
        if (String(names[i][0]).trim().toLowerCase() === name.toLowerCase()) {
          rowIndexToUpdate = i + 2;
          break;
        }
      }
    }

    const statusLabel = isAttending ? "Hadir" : "Tidak Hadir";

    if (rowIndexToUpdate > 0) {
      sheet.getRange(rowIndexToUpdate, mapping.status).setValue(statusLabel);
      sheet.getRange(rowIndexToUpdate, mapping.pax).setValue(pax);
      sheet.getRange(rowIndexToUpdate, mapping.message).setValue(message);
      sheet.getRange(rowIndexToUpdate, mapping.time).setValue(now);
    } else {
      const newUid = uid || generateRandomUID(8);
      const guestEncoded = encodeURIComponent(name);
      const uidEncoded = encodeURIComponent(newUid);
      const link = BASE_URL_UNDANGAN + "/?to=" + guestEncoded + "&uid=" + uidEncoded;

      const newRow = [];
      for (let c = 1; c <= mapping.totalCols; c++) {
        if (c === 1) newRow.push(newUid);
        else if (c === 2) newRow.push(name);
        else if (c === 3) newRow.push(origin);
        else if (c === 4) newRow.push("");
        else if (c === 5) newRow.push(link);
        else if (c === mapping.status) newRow.push(statusLabel);
        else if (c === mapping.pax) newRow.push(pax);
        else if (c === mapping.message) newRow.push(message);
        else if (c === mapping.time) newRow.push(now);
        else newRow.push("");
      }

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
