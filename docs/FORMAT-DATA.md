# Format Data JSON (kesepakatan tim)

Disepakati bersama agar Anggota 1 dan Anggota 2 memakai struktur yang sama.
Jika ingin mengubah, **bicarakan dulu** lalu update file ini.

## data/books.json
```json
{
  "id": 1,
  "judul": "Laskar Pelangi",
  "penulis": "Andrea Hirata",
  "kategori": "Novel",
  "tahun": 2005,
  "tipe": "ebook",
  "stok": 5,
  "deskripsi": "..."
}
```
`tipe` bernilai `ebook` atau `fisik`.

## data/users.json
```json
{
  "id": 1,
  "nama": "Budi Santoso",
  "nim": "202310370311001",
  "email": "budi@mail.com",
  "telepon": "081234567890",
  "password": "<hash dari password_hash()>",
  "role": "member",
  "status": "aktif"
}
```
`role` bernilai `member` atau `admin`. **Jangan simpan password polos.**

## data/loans.json
```json
{
  "id": 101,
  "user_id": 1,
  "book_id": 1,
  "tgl_pinjam": "2026-11-10",
  "jatuh_tempo": "2026-11-17",
  "tgl_kembali": null,
  "status": "dipinjam"
}
```
`status`: `dipinjam`, `terlambat`, atau `dikembalikan`.

## Namespace

| Folder | Namespace |
|---|---|
| `src/Core` | `App\Core` |
| `src/Interfaces` | `App\Interfaces` |
| `src/Models` | `App\Models` |
| `src/Services` | `App\Services` |
| `src/Controllers` | `App\Controllers` |
| `src/Traits` | `App\Traits` |
