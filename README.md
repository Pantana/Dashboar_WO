# PivotTask - Dashboard Progress WO Teknisi (Google Sheets Integration)

PivotTask adalah aplikasi web statis modern, interaktif, dan premium yang dirancang untuk memanajemen tugas (Work Order) teknisi secara real-time langsung dari data Google Sheets Anda.

Aplikasi ini menampilkan tabel pivot silang antara nama teknisi dan kategori pengelompokan (*Grouping*), lengkap dengan kolom khusus untuk memantau status spesifik **Complete PS** secara langsung, serta ringkasan statistik yang sinkron dan papan peringkat (*Leaderboard*) tim berkinerja terbaik.

---

## 🚀 Fitur Utama

1. **Dashboard Pivot Interaktif**:
   - Baris: Nama Teknisi.
   - Kolom: Grouping Tugas (`OGP`, `KENDALA PELANGGAN`, `KENDALA TEKNIS`, `TERPASANG`) + Kolom Khusus `COMPLETE PS`.
   - Sel Pivot: Menampilkan angka jumlah pekerjaan. Jika diklik, akan memunculkan pop-up detail tugas.

2. **Kanban Pop-up Board**:
   - Menampilkan detail informasi pelanggan (Nama, Nomor Internet, Paket, Alat Produksi/ODP, Kontak WA, Alamat, Keterangan).
   - Dilengkapi menu dropdown untuk mengubah **Status** dan **Teknisi** secara langsung. Perubahan ini otomatis memperbarui database.

3. **Sinkronisasi Otomatis Google Sheets**:
   - Terhubung secara real-time via Google Apps Script Web App tanpa server backend (serverless).
   - Perubahan status di aplikasi web otomatis mengupdate kolom `STATUS` dan kolom `Grouping` di Google Sheets.

4. **Statistik Lengkap & Leaderboard**:
   - Grafik ringkasan statistik yang sinkron dengan data pivot.
   - Papan peringkat (*Leaderboard*) tim teraktif berdasarkan akumulasi jumlah *Complete PS* terbanyak.

5. **Aestetika Premium**:
   - Dilengkapi toggle tema gelap (Slate Dark) dan tema terang (Sleek Light).
   - Efek transisi halus dan micro-animations pada kartu detail.

---

## 📂 Struktur Repositori

* **`index.html`**: Kerangka antarmuka pengguna (UI) dashboard.
* **`style.css`**: Sistem desain CSS, variabel warna HSL, dan animasi.
* **`app.js`**: Logika program utama, state management, dan pemrosesan matriks pivot.
* **`google-apps-script.js`**: Kode Apps Script untuk disalin ke Google Sheets Anda.
* **`IMPLEMENTATION_PLAN.md`**: Dokumen desain teknis awal proyek.
* **`WALKTHROUGH.md`**: Dokumen rincian perubahan terakhir, penyelesaian bug modal, dan langkah uji coba.

---

## 🛠️ Panduan Menjalankan & Menghubungkan Google Sheets

Panduan lengkap mengenai cara menjalankan aplikasi ini secara lokal di komputer Anda, serta langkah demi langkah mendeploy script ke Google Sheets, dapat dibaca langsung pada berkas dokumentasi berikut:
👉 **[WALKTHROUGH.md](WALKTHROUGH.md)**
