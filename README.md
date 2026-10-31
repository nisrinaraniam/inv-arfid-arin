# Undangan Digital Arfid & Arin (React + Vite + TanStack)

Undangan pernikahan digital berbasis **React 18 / 19**, **Vite**, dan **TanStack Router & Query** (Mode Client-Side Only / SPA).

## 🚀 Memulai (Development & Build)

Anda dapat menggunakan `npm`, `pnpm`, `yarn`, atau `bun`:

### 1. Jalankan Mode Development (Vite Dev Server)
```bash
npm install
npm run dev
```
Akses di browser: `http://localhost:5173` (atau port yang ditentukan Vite).

### 2. Build untuk Produksi (Static Client-Side SPA)
```bash
npm run build
```
Hasil build akan dihasilkan di folder `dist/` dan siap di-deploy langsung ke:
- **Vercel**
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**
- Atau hosting statis lainnya tanpa memerlukan server runtime backend.

### 3. Preview Hasil Build
```bash
npm run preview
# atau jalankan server lokal:
node server.mjs
```

---

## 📁 Struktur Project (React + TypeScript)

```
mother-of-pearl/
├── src/
│   ├── components/         # Komponen Modular React
│   │   ├── Opener.tsx           # Animasi segel video monogram pembuka
│   │   ├── Hero.tsx             # Cover / Hero banner & Personalized greeting (?to=...)
│   │   ├── QuoteVideo.tsx       # Interlude video quote cinta (H.264)
│   │   ├── Family.tsx           # The Couple (Rasio 4:3, nama mempelai kiri-kanan & animasi scroll)
│   │   ├── PearlScratch.tsx     # Card mutiara foto mempelai
│   │   ├── LoveStory.tsx        # Timeline perjalanan cinta Arfid & Arin
│   │   ├── Countdown.tsx        # Hitung mundur real-time & tombol Add to Google Calendar
│   │   ├── IntimateDinner.tsx   # Detail acara, ilustrasi watercolor, dan tombol Google Maps
│   │   ├── Gallery.tsx          # Moments in Frames (6 foto, triptych arches holder & lightbox)
│   │   ├── DressCode.tsx        # Panduan busana Black Formal
│   │   ├── WeddingGift.tsx      # Crystal frame amplop digital (Bank BCA & copy button)
│   │   ├── Rsvp.tsx             # Form RSVP interaktif (Tombol Hadir/Tidak Hadir, plus-one, anak)
│   │   ├── RsvpConfirmation.tsx # Card konfirmasi instan senada warna olive
│   │   ├── LiveWishes.tsx       # Real-time wishes terhubung ke Google Spreadsheet
│   │   ├── ThankYou.tsx         # Ucapan terima kasih & monogram penutup
│   │   └── MusicPlayer.tsx      # Audio player musik latar (loop & mute toggle)
│   ├── data/
│   │   └── wedding.ts           # Data nama, tanggal, lokasi, rekening, foto, dan endpoint Google Apps Script
│   ├── routes/
│   │   └── index.tsx            # Halaman utama undangan
│   ├── styles/
│   │   ├── fonts.css            # Tipografi (Allura, Ballet, Cormorant Garamond, Jost)
│   │   ├── index.css            # Styling dasar
│   │   ├── local.css            # Animasi segel monogram pembuka
│   │   ├── personalization.css  # Layout & styling kustom
│   │   └── earth-palette.css    # Palet warna Earthy (Olive, Cream, Sand, Cognac)
│   ├── router.tsx          # Konfigurasi TanStack Router (Client-Side Only SPA)
│   └── main.tsx            # Entry point React DOM & TanStack Query Provider
├── google-apps-script.js   # Script backend Google Spreadsheet (Database RSVP & Live Wishes)
├── vite.config.ts          # Konfigurasi bundler Vite
├── tsconfig.json           # Konfigurasi TypeScript
├── package.json            # Dependencies & build scripts
└── server.mjs              # Local static server fallback
```

---

## 📊 Database Google Spreadsheet (RSVP & Live Wishes)

Undangan ini telah terintegrasi dengan Google Apps Script:
- File script tersedia di [`google-apps-script.js`](./google-apps-script.js).
- Buka Google Sheets $\rightarrow$ Ekstensi $\rightarrow$ Apps Script $\rightarrow$ Paste kode tersebut $\rightarrow$ Deploy sebagai Web App (`Anyone`).
- Tempelkan URL `/exec` ke `src/data/wedding.ts` pada properti `gasEndpoint`.
- Fitur bawaan:
  1. **Mode UID:** Tamu membuka link dengan `?to=Nama+Tamu&uid=UID-123`, nama langsung terisi otomatis dan status di baris tamu pada spreadsheet langsung ter-update.
  2. **Mode Publik:** Tamu mengisi nama sendiri, data otomatis menambahkan baris baru di spreadsheet.
  3. **Live Wishes:** Ucapan dari tamu langsung tampil di website secara real-time.
