/* ==========================================================
   dashboard.js - Dashboard member & panel admin (data dummy)
   Pemilik: Anggota 2
   TODO (tahap PHP): ganti data dummy dengan fetch ke controller
   ========================================================== */

const DUMMY_LOANS = [
  { id: 101, judul: "Laskar Pelangi", pinjam: "2026-11-10", jatuhTempo: "2026-11-17", status: "terlambat" },
  { id: 102, judul: "Algoritma dan Pemrograman", pinjam: "2026-11-15", jatuhTempo: "2026-11-22", status: "dipinjam" },
  { id: 103, judul: "Atomic Habits", pinjam: "2026-10-01", jatuhTempo: "2026-10-08", status: "dikembalikan" }
];

const DUMMY_MEMBERS = [
  { id: 1, nama: "Budi Santoso", nim: "202310370311001", email: "budi@mail.com", status: "aktif" },
  { id: 2, nama: "Siti Aminah", nim: "202310370311002", email: "siti@mail.com", status: "aktif" },
  { id: 3, nama: "Rizky Pratama", nim: "202310370311003", email: "rizky@mail.com", status: "nonaktif" }
];

const STATUS_BADGE = {
  dipinjam: "badge-warning",
  terlambat: "badge-danger",
  dikembalikan: "badge-success",
  aktif: "badge-success",
  nonaktif: "badge-danger"
};

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "dashboard") initDashboard();
  if (page === "admin") initAdmin();
});

function statusBadge(s) {
  return `<span class="badge ${STATUS_BADGE[s]}">${s}</span>`;
}

// ---------- Dashboard member ----------
function initDashboard() {
  const body = document.getElementById("loan-body");
  body.innerHTML = DUMMY_LOANS.map((l) => `
    <tr>
      <td>${l.judul}</td>
      <td>${l.pinjam}</td>
      <td>${l.jatuhTempo}</td>
      <td>${statusBadge(l.status)}</td>
      <td>${l.status === "dikembalikan" ? "-" :
        `<button class="btn btn-sm" data-return="${l.id}">Kembalikan</button>`}</td>
    </tr>`).join("");

  body.addEventListener("click", (e) => {
    const id = e.target.dataset.return;
    if (!id) return;
    // TODO (tahap PHP): POST ke PeminjamanController::kembalikan()
    e.target.closest("tr").querySelector(".badge").outerHTML = statusBadge("dikembalikan");
    e.target.remove();
  });

  document.getElementById("stat-aktif").textContent =
    DUMMY_LOANS.filter((l) => l.status !== "dikembalikan").length;
  document.getElementById("stat-terlambat").textContent =
    DUMMY_LOANS.filter((l) => l.status === "terlambat").length;
  document.getElementById("stat-total").textContent = DUMMY_LOANS.length;
}

// ---------- Admin ----------
function initAdmin() {
  // Tabel buku
  const bookBody = document.getElementById("admin-book-body");
  const renderBooks = () => {
    bookBody.innerHTML = DUMMY_BOOKS.map((b) => `
      <tr>
        <td>${b.id}</td><td>${b.judul}</td><td>${b.penulis}</td>
        <td>${b.kategori}</td><td>${b.stok}</td>
        <td><button class="btn btn-sm btn-danger" data-del="${b.id}">Hapus</button></td>
      </tr>`).join("");
  };
  renderBooks();

  bookBody.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.del);
    if (!id) return;
    if (confirm("Hapus buku ini? (simulasi)")) {
      DUMMY_BOOKS.splice(DUMMY_BOOKS.findIndex((b) => b.id === id), 1);
      renderBooks();
    }
  });

  // Form tambah buku (validasi sederhana)
  const form = document.getElementById("book-form");
  bindForm(
    form,
    {
      "b-judul": [Validator.required],
      "b-penulis": [Validator.required],
      "b-tahun": [Validator.required, (v) => (v >= 1900 && v <= 2100 ? "" : "Tahun tidak valid.")],
      "b-stok": [Validator.required, (v) => (v >= 0 ? "" : "Stok tidak boleh negatif.")]
    },
    () => {
      // TODO (tahap PHP): POST ke BukuController::tambah()
      DUMMY_BOOKS.push({
        id: Date.now() % 100000,
        judul: form.querySelector("#b-judul").value,
        penulis: form.querySelector("#b-penulis").value,
        kategori: form.querySelector("#b-kategori").value,
        tahun: Number(form.querySelector("#b-tahun").value),
        tipe: form.querySelector("#b-tipe").value,
        stok: Number(form.querySelector("#b-stok").value),
        deskripsi: ""
      });
      renderBooks();
      form.reset();
      closeModal("modal-buku");
    }
  );

  // Tabel anggota
  document.getElementById("admin-member-body").innerHTML = DUMMY_MEMBERS.map((m) => `
    <tr><td>${m.nama}</td><td>${m.nim}</td><td>${m.email}</td><td>${statusBadge(m.status)}</td></tr>`).join("");

  // Tabel transaksi
  document.getElementById("admin-loan-body").innerHTML = DUMMY_LOANS.map((l) => `
    <tr><td>${l.id}</td><td>${l.judul}</td><td>${l.pinjam}</td><td>${l.jatuhTempo}</td><td>${statusBadge(l.status)}</td></tr>`).join("");

  document.getElementById("stat-buku").textContent = DUMMY_BOOKS.length;
  document.getElementById("stat-anggota").textContent = DUMMY_MEMBERS.length;
  document.getElementById("stat-transaksi").textContent = DUMMY_LOANS.length;
}
