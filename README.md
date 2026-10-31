# Undangan Arfid & Arin

Jalankan `npm start` atau `node server.mjs`, lalu buka http://localhost:8787.
Tidak perlu memasang dependency tambahan.

## Detail
- Pria: Arfid Gamal S.T (Arfid), ditampilkan lebih dahulu.
- Wanita: dr. Vanetka Daarin Haya (Arin).
- Acara: Intimate Dinner, Sabtu, 5 Desember 2026 pukul 19.00 WITA.
- Tempat: Grand Ballroom Hotel Aruna Senggigi Resort & Convention.
- Data nama orang tua, alamat lengkap, dan Maps ada di `personalization.js`.
- Foto masih menggunakan contoh demo; pemilik akan memilih fotonya sendiri.
- Footer: custom invitation by riungin.id.

## Perilaku lokal
RSVP disimpan di browser ini pada `arfid-arin:rsvps:v1`, tanpa backend bersama.
Countdown menggunakan waktu acara `2026-12-05T19:00:00+08:00`.
Tautan Maps dan kalender memakai data acara tersebut.
Semua aset tampilan tersimpan lokal. Peta/kalender terbuka saat tombolnya ditekan.

Pembuka menampilkan monogram A & A. Lapisan video dan poster tidak ditampilkan sebelum gambar A & A selesai didekode dan posisinya siap, sehingga inisial lama tidak berkedip saat pemuatan. Posisi monogram mengikuti gerakan segel video. Tombol Lewati pembuka tetap tersedia.

## Berkas
- `personalization.js`: data acara dan komponen tambahan.
- `personalization.css`: tata letak dan gaya personalisasi.
- `local.js`: monogram pembuka dan kesiapan aset.
- `assets/index-C7F6jN74.js`: presentasi dan interaksi dasar dalam bentuk terkompilasi.
- `asset-manifest.json`: daftar aset lokal; lisensi font berada di `licenses/`.

Artwork pihak ketiga tetap milik pemilik masing-masing. Segel A & A dibuat menggunakan imagegen; prompt dan hasilnya tercatat di `generated-assets.json`.
