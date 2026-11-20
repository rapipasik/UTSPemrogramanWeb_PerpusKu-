/* ==========================================================
   main.js - Fungsi umum (navbar, tab, modal, helper)
   Pemilik: Anggota 1
   ========================================================== */

// Data contoh sementara (nanti diganti fetch ke PHP / data/books.json)
const DUMMY_BOOKS = [
  { id: 1, judul: "Laskar Pelangi", penulis: "Andrea Hirata", kategori: "Novel", tahun: 2005, tipe: "ebook", stok: 5, deskripsi: "Kisah perjuangan sekelompok anak di Belitung untuk mendapatkan pendidikan." },
  { id: 2, judul: "Bumi Manusia", penulis: "Pramoedya Ananta Toer", kategori: "Novel", tahun: 1980, tipe: "ebook", stok: 3, deskripsi: "Roman sejarah tentang Minke di masa kolonial Hindia Belanda." },
  { id: 3, judul: "Algoritma dan Pemrograman", penulis: "Rinaldi Munir", kategori: "Teknologi", tahun: 2016, tipe: "ebook", stok: 8, deskripsi: "Dasar-dasar algoritma dan logika pemrograman untuk pemula." },
  { id: 4, judul: "Pemrograman Web dengan PHP", penulis: "Abdul Kadir", kategori: "Teknologi", tahun: 2019, tipe: "ebook", stok: 6, deskripsi: "Panduan membuat aplikasi web dinamis menggunakan PHP." },
  { id: 5, judul: "Sejarah Indonesia Modern", penulis: "M.C. Ricklefs", kategori: "Sejarah", tahun: 2008, tipe: "fisik", stok: 2, deskripsi: "Ulasan menyeluruh sejarah Indonesia sejak 1200." },
  { id: 6, judul: "Filosofi Teras", penulis: "Henry Manampiring", kategori: "Pengembangan Diri", tahun: 2018, tipe: "ebook", stok: 4, deskripsi: "Pengenalan filsafat Stoa untuk kehidupan sehari-hari." },
  { id: 7, judul: "Basis Data", penulis: "Fathansyah", kategori: "Teknologi", tahun: 2015, tipe: "fisik", stok: 0, deskripsi: "Konsep perancangan dan implementasi basis data relasional." },
  { id: 8, judul: "Atomic Habits", penulis: "James Clear", kategori: "Pengembangan Diri", tahun: 2018, tipe: "ebook", stok: 7, deskripsi: "Cara membangun kebiasaan baik dan menghilangkan kebiasaan buruk." }
];

const COVER_EMOJI = { Novel: "📖", Teknologi: "💻", Sejarah: "🏛️", "Pengembangan Diri": "🌱" };

// ---------- Navbar mobile ----------
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => menu.classList.toggle("open"));
  }

  // Tandai menu aktif sesuai halaman
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a").forEach((a) => {
    if (a.getAttribute("href") === current) a.classList.add("active");
  });

  initTabs();
  initModals();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

// ---------- Tab ----------
function initTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(target)?.classList.add("active");
    });
  });
}

// ---------- Modal ----------
function initModals() {
  document.querySelectorAll("[data-open-modal]").forEach((el) => {
    el.addEventListener("click", () => openModal(el.dataset.openModal));
  });
  document.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", () => closeModal(el.closest(".modal-overlay").id));
  });
  document.querySelectorAll(".modal-overlay").forEach((ov) => {
    ov.addEventListener("click", (e) => { if (e.target === ov) closeModal(ov.id); });
  });
}
function openModal(id) { document.getElementById(id)?.classList.add("open"); }
function closeModal(id) { document.getElementById(id)?.classList.remove("open"); }

// ---------- Helper ----------
function showAlert(el, message, type = "success") {
  el.className = `alert alert-${type} show`;
  el.textContent = message;
}

// Render kartu buku (dipakai index.html & katalog.html)
function renderBookCard(book) {
  const available = book.stok > 0;
  return `
    <article class="card book-card">
      ${coverHTML(book)}
      <div class="card-body">
        <span class="badge">${book.kategori}</span>
        <h3>${book.judul}</h3>
        <p class="author">${book.penulis} • ${book.tahun}</p>
        <p>
          <span class="badge ${available ? "badge-success" : "badge-danger"}">
            ${available ? "Tersedia (" + book.stok + ")" : "Habis"}
          </span>
          <span class="badge badge-warning">${book.tipe === "ebook" ? "E-Book" : "Fisik"}</span>
        </p>
        <div class="card-actions">
          <a class="btn btn-sm btn-outline" href="detail.html?id=${book.id}">Detail</a>
        </div>
      </div>
    </article>`;
}

// Sampul buku bergaya tipografi; warna mengikuti kategori (lihat [data-cat] di style.css)
function coverHTML(book) {
  return `<div class="book-cover" data-cat="${book.kategori}" aria-hidden="true">
    <span class="cover-title">${book.judul}</span>
    <span class="cover-author">${book.penulis}</span>
  </div>`;
}
