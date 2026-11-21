# PerpusKu - Sistem Informasi Peminjaman Buku Perpustakaan

Prototipe aplikasi web untuk **UTS Pemrograman Web** (Informatika UMM, Semester Ganjil 2026/2027).
Front-end HTML/CSS/JS + backend **PHP 8.x OOP tanpa framework**.

> Status: **Backend PHP OOP dan integrasi frontend telah tersedia.**

## Struktur Folder

```
perpustakaan-digital/
├── public/                 # Yang diakses browser
│   ├── index.html          # Beranda
│   ├── katalog.html        # Katalog + pencarian & filter
│   ├── detail.html         # Detail buku (?id=)
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html      # Dashboard member
│   ├── admin.html          # Panel admin
│   └── assets/
│       ├── css/style.css
│       ├── js/             # main, katalog, validation, dashboard
│       └── img/
├── src/                    # Backend PHP OOP (namespace App\...)
│   ├── Core/
│   ├── Interfaces/
│   ├── Models/
│   ├── Services/
│   ├── Controllers/
│   └── Traits/
├── data/                   # Penyimpanan JSON (e-book, user, peminjaman)
├── docs/                   # Dokumentasi tambahan
├── JOBDESK.md              # Pembagian tugas 2 anggota
└── README.md
```

## Cara Menjalankan

1. Pastikan PHP 8.1 atau lebih baru sudah terpasang dan dapat dijalankan melalui terminal.
2. Buka terminal pada folder proyek `perpustakaan-digital`.
3. Jalankan server PHP dari folder `public`:

```bash
cd public
php -S localhost:8000
```

4. Buka `http://localhost:8000` pada browser.
5. Pilih fitur yang ingin digunakan:
   - Halaman beranda menampilkan buku pilihan dan pencarian.
   - Menu **Katalog** menampilkan pencarian, filter kategori, dan tipe buku.
   - Menu **Daftar** membuat akun member baru.
   - Menu **Masuk** mengakses halaman dashboard atau panel admin.
   - Anggota dapat meminjam buku, melihat riwayat peminjaman, dan mengembalikan buku.
   - Admin dapat menambah atau menghapus buku serta melihat daftar anggota dan transaksi.

Untuk pengujian cepat, gunakan akun bawaan berikut:

| Peran | Email | Password |
| --- | --- | --- |
| Member | `budi@mail.com` | `password123` |
| Admin | `admin@mail.com` | `admin123` |

Frontend membaca data dari API PHP melalui `fetch()` dan menyimpan perubahan ke file JSON pada folder `data/`.

## Kebutuhan

- PHP 8.1+ (untuk tahap backend)
- Browser modern

## Tim

| Nama | NIM | Fokus |
| --- | --- | --- |
| Muhammad Rafif Al Hakim | 202410370110091 | Katalog & Buku |
| Jatmiko Eka Pratama | 202410370110087 | Akun, Peminjaman & Admin |

Detail tugas: lihat [JOBDESK.md](JOBDESK.md).

---

## Panduan Git untuk Tim

### Pertama kali (Anggota 1 membuat repo)

```bash
cd perpustakaan-digital
git init
git add .
git commit -m "chore: inisialisasi project front-end"
git branch -M main
git remote add origin https://github.com/USERNAME/perpustakaan-digital.git
git push -u origin main
```

Lalu undang Anggota 2 di GitHub: **Settings → Collaborators → Add people**.

### Anggota 2 mengambil project

```bash
git clone https://github.com/USERNAME/perpustakaan-digital.git
d
```

### Alur kerja harian (WAJIB agar tidak bentrok)

Jangan langsung kerja di `main`. Pakai **branch per fitur**:

```bash
git checkout main
git pull origin main                  # selalu ambil terbaru dulu
git checkout -b feat/katalog-filter   # buat branch baru

# ...kerjakan, lalu:
git add .
git commit -m "feat: tambah filter kategori di katalog"
git push origin feat/katalog-filter
```

Kemudian buka **Pull Request** di GitHub, minta rekan satu tim me-review, lalu **Merge**.

### Penamaan branch & commit

| Awalan      | Arti           | Contoh                            |
| ----------- | -------------- | --------------------------------- |
| `feat:`     | fitur baru     | `feat: tambah class EBook`        |
| `fix:`      | perbaikan bug  | `fix: validasi NIM salah`         |
| `style:`    | CSS / tampilan | `style: rapikan navbar mobile`    |
| `docs:`     | dokumentasi    | `docs: update README`             |
| `refactor:` | rapikan kode   | `refactor: pisah Storage ke Core` |

Branch: `feat/<nama-fitur>`, `fix/<nama-bug>`.

### Jika terjadi conflict

1. `git pull origin main` ke branch kamu
2. Buka file yang conflict, pilih kode yang benar (hapus tanda `<<<<<<<`, `=======`, `>>>>>>>`)
3. `git add .` → `git commit` → `git push`
