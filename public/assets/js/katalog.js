/* ==========================================================
   katalog.js - Pencarian & filter katalog, halaman detail, beranda
   Pemilik: Anggota 1
   TODO (tahap PHP): ganti DUMMY_BOOKS dengan fetch("../src/api/books.php")
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "beranda") initBeranda();
  if (page === "katalog") initKatalog();
  if (page === "detail") initDetail();
});

// ---------- Beranda ----------
function initBeranda() {
  const grid = document.getElementById("featured-books");
  grid.innerHTML = DUMMY_BOOKS.slice(0, 4).map(renderBookCard).join("");

  document.getElementById("hero-search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("hero-q").value.trim();
    location.href = `katalog.html?q=${encodeURIComponent(q)}`;
  });
}

// ---------- Katalog ----------
function initKatalog() {
  const grid = document.getElementById("book-grid");
  const search = document.getElementById("search");
  const kategori = document.getElementById("filter-kategori");
  const tipe = document.getElementById("filter-tipe");
  const count = document.getElementById("result-count");

  // Isi opsi kategori otomatis dari data
  [...new Set(DUMMY_BOOKS.map((b) => b.kategori))].forEach((k) => {
    kategori.insertAdjacentHTML("beforeend", `<option value="${k}">${k}</option>`);
  });

  // Ambil ?q= dari URL
  const q = new URLSearchParams(location.search).get("q");
  if (q) search.value = q;

  function render() {
    const keyword = search.value.toLowerCase();
    const result = DUMMY_BOOKS.filter((b) =>
      (b.judul.toLowerCase().includes(keyword) || b.penulis.toLowerCase().includes(keyword)) &&
      (!kategori.value || b.kategori === kategori.value) &&
      (!tipe.value || b.tipe === tipe.value)
    );
    count.textContent = `${result.length} buku ditemukan`;
    grid.innerHTML = result.length
      ? result.map(renderBookCard).join("")
      : `<p>Tidak ada buku yang cocok dengan pencarian.</p>`;
  }

  [search, kategori, tipe].forEach((el) => el.addEventListener("input", render));
  render();
}

// ---------- Detail ----------
function initDetail() {
  const id = Number(new URLSearchParams(location.search).get("id"));
  const book = DUMMY_BOOKS.find((b) => b.id === id);
  const box = document.getElementById("detail-box");

  if (!book) {
    box.innerHTML = `<p>Buku tidak ditemukan. <a href="katalog.html">Kembali ke katalog</a></p>`;
    return;
  }

  document.title = `${book.judul} - PerpusKu`;
  const available = book.stok > 0;
  box.innerHTML = `
    <div class="book-cover" aria-hidden="true">${COVER_EMOJI[book.kategori] || "📚"}</div>
    <div>
      <span class="badge">${book.kategori}</span>
      <h1>${book.judul}</h1>
      <ul class="detail-meta">
        <li><strong>Penulis</strong> ${book.penulis}</li>
        <li><strong>Tahun terbit</strong> ${book.tahun}</li>
        <li><strong>Tipe</strong> ${book.tipe === "ebook" ? "E-Book" : "Buku Fisik"}</li>
        <li><strong>Stok</strong> ${book.stok}</li>
      </ul>
      <p>${book.deskripsi}</p>
      <div id="detail-alert" class="alert" role="alert"></div>
      <p style="margin-top:1.25rem">
        <button id="btn-pinjam" class="btn" ${available ? "" : "disabled"}>
          ${available ? "Pinjam Buku" : "Stok Habis"}
        </button>
        <a href="katalog.html" class="btn btn-outline">Kembali</a>
      </p>
    </div>`;

  document.getElementById("btn-pinjam")?.addEventListener("click", () => {
    // TODO (tahap PHP): POST ke PeminjamanController
    showAlert(document.getElementById("detail-alert"),
      "Simulasi: permintaan peminjaman dikirim. (Belum terhubung backend)", "success");
  });
}
