# PerpusKu - Sistem Informasi Peminjaman Buku Perpustakaan

Prototipe aplikasi web untuk **UTS Pemrograman Web** (Informatika UMM, Semester Ganjil 2026/2027).
Front-end HTML/CSS/JS + backend **PHP 8.x OOP tanpa framework**.

> Status: **Tahap 1 — Front-end mentahan.** Backend PHP (`src/`) masih kosong dan dikerjakan di tahap berikutnya.

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

## Cara Menjalankan (tahap front-end)

Cukup buka `public/index.html` di browser, atau dengan server bawaan PHP:

```bash
cd public
php -S localhost:8000
```

lalu buka http://localhost:8000

Data buku saat ini masih **dummy** di `public/assets/js/main.js` (`DUMMY_BOOKS`).
Akan diganti dengan `fetch()` ke backend PHP.

## Kebutuhan

- PHP 8.1+ (untuk tahap backend)
- Browser modern

## Tim

| Nama | Fokus |
|---|---|
| Anggota 1 | Katalog & Buku |
| Anggota 2 | Akun, Peminjaman & Admin |

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
cd perpustakaan-digital
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

| Awalan | Arti | Contoh |
|---|---|---|
| `feat:` | fitur baru | `feat: tambah class EBook` |
| `fix:` | perbaikan bug | `fix: validasi NIM salah` |
| `style:` | CSS / tampilan | `style: rapikan navbar mobile` |
| `docs:` | dokumentasi | `docs: update README` |
| `refactor:` | rapikan kode | `refactor: pisah Storage ke Core` |

Branch: `feat/<nama-fitur>`, `fix/<nama-bug>`.

### Jika terjadi conflict

1. `git pull origin main` ke branch kamu
2. Buka file yang conflict, pilih kode yang benar (hapus tanda `<<<<<<<`, `=======`, `>>>>>>>`)
3. `git add .` → `git commit` → `git push`
