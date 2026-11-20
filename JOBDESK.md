# Pembagian Tugas (Jobdesk) - PerpusKu

Tema: **Sistem Informasi Peminjaman Buku Perpustakaan**
Tim: **2 orang** — Anggota 1 & Anggota 2

> Ganti "Anggota 1" / "Anggota 2" dengan nama masing-masing setelah disepakati.

Prinsip pembagian: **setiap orang menyentuh Front-End DAN PHP OOP**, supaya nilai kontribusi seimbang dan tidak ada yang hanya mengerjakan satu sisi. Tiap orang punya "wilayah file" sendiri agar **minim konflik saat merge** di GitHub.

---

## Ringkasan

| | Anggota 1 | Anggota 2 |
|---|---|---|
| **Fokus** | Katalog & Buku | Akun, Peminjaman & Admin |
| **Front-End** | Beranda, Katalog, Detail Buku, `style.css` | Login, Register, Dashboard, Admin, validasi form |
| **PHP OOP** | Models buku (inheritance, polymorphism), Repository, Interface | Models user (inheritance), Auth, Peminjaman, Core |

---

## Anggota 1 — Katalog & Buku

### Front-End (sudah ada mentahan, tinggal dipoles)
| File | Tugas |
|---|---|
| `public/index.html` | Poles tampilan beranda, tambah section (mis. kategori populer) |
| `public/katalog.html` | Pencarian, filter, tambah paginasi / sorting |
| `public/detail.html` | Lengkapi halaman detail, tombol baca e-book |
| `public/assets/css/style.css` | Tema, responsif, konsistensi desain seluruh halaman |
| `public/assets/js/main.js` | Fungsi umum (navbar, tab, modal, helper) |
| `public/assets/js/katalog.js` | Ganti `DUMMY_BOOKS` dengan `fetch()` ke PHP |

### PHP OOP (`src/`)
| File | Konsep OOP | Isi |
|---|---|---|
| `src/Interfaces/Peminjamable.php` | Interface | Method `pinjam()`, `kembalikan()`, `isTersedia()` |
| `src/Models/Buku.php` | Abstract class, **Encapsulation** | Properti `private/protected` + getter/setter, method abstrak `getInfo()` |
| `src/Models/EBook.php` | **Inheritance, Polymorphism** | Extends `Buku`, tambah `formatFile`, `ukuranMB`, override `getInfo()` |
| `src/Models/BukuFisik.php` | **Inheritance, Polymorphism** | Extends `Buku`, tambah `rakLokasi`, override `getInfo()` |
| `src/Models/Kategori.php` | Class & Object | Data kategori buku |
| `src/Services/BukuRepository.php` | Class, Namespace | CRUD buku dari `data/books.json` |
| `src/Controllers/BukuController.php` | Class, Namespace | Endpoint daftar, detail, tambah, hapus buku |

---

## Anggota 2 — Akun, Peminjaman & Admin

### Front-End (sudah ada mentahan, tinggal dipoles)
| File | Tugas |
|---|---|
| `public/login.html` | Form login + validasi |
| `public/register.html` | Form daftar + validasi |
| `public/dashboard.html` | Dashboard member, riwayat pinjam |
| `public/admin.html` | Panel admin: kelola buku, anggota, transaksi |
| `public/assets/js/validation.js` | Validasi form (email, NIM, password, dll.) |
| `public/assets/js/dashboard.js` | Ganti data dummy dengan `fetch()` ke PHP |

### PHP OOP (`src/`)
| File | Konsep OOP | Isi |
|---|---|---|
| `src/Models/User.php` | Abstract class, **Encapsulation** | Properti private, hash password, method abstrak `getRole()` |
| `src/Models/Member.php` | **Inheritance, Polymorphism** | Extends `User`, batas maks pinjam (mis. 3 buku) |
| `src/Models/Admin.php` | **Inheritance, Polymorphism** | Extends `User`, hak akses lebih luas |
| `src/Models/Peminjaman.php` | Class & Object | Data transaksi, hitung denda & jatuh tempo |
| `src/Core/Storage.php` | Class, Namespace | Helper baca/tulis file JSON (dipakai Anggota 1 juga) |
| `src/Services/AuthService.php` | Class, Namespace | Register, login, session |
| `src/Services/PeminjamanService.php` | Class, Namespace | Logika pinjam & kembali, update stok |
| `src/Controllers/AuthController.php` | Class, Namespace | Endpoint login / register / logout |
| `src/Controllers/PeminjamanController.php` | Class, Namespace | Endpoint pinjam, kembalikan, riwayat |

---

## Tugas Bersama

- Menyepakati **format JSON** di `data/` (lihat `docs/FORMAT-DATA.md`)
- Menyepakati **namespace** (`App\Models`, `App\Services`, `App\Controllers`, `App\Core`, `App\Interfaces`)
- `public/index.php` / router sederhana & `autoload.php` → **Anggota 2 yang buat, Anggota 1 review**
- Testing akhir, pastikan **tidak ada error** (30 poin kerapian!)
- Review Pull Request satu sama lain

## Checklist Rubrik

- [ ] **Front-End (30)**: validasi form, elemen semantik, responsif, interaktivitas JS
- [ ] **PHP OOP (40)**: Class, Object, Encapsulation, Inheritance, Polymorphism, Namespace
- [ ] **Struktur (30)**: folder `src/` rapi, modular, tidak ada error saat dijalankan

## Timeline Saran

| Tahap | Target | Siapa |
|---|---|---|
| 1. Poles front-end | Selesai duluan | Keduanya |
| 2. Buat class dasar (Models) | Setelah front-end | Keduanya (wilayah masing-masing) |
| 3. Service + Controller + JSON | | Keduanya |
| 4. Hubungkan JS `fetch()` ke PHP | | Keduanya |
| 5. Testing & perapian | H-2 pengumpulan | Keduanya |
