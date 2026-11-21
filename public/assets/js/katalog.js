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
async function initBeranda() {
  const grid = document.getElementById("featured-books");
  try {
    const payload = await apiFetch("api/books.php");
    grid.innerHTML = payload.data.slice(0, 4).map(renderBookCard).join("");
  } catch (error) {
    grid.innerHTML = `<p>${escapeHTML(error.message)}</p>`;
  }

  document.getElementById("hero-search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("hero-q").value.trim();
    location.href = `katalog.html?q=${encodeURIComponent(q)}`;
  });
}

// ---------- Katalog ----------
async function initKatalog() {
  const grid = document.getElementById("book-grid");
  const search = document.getElementById("search");
  const kategori = document.getElementById("filter-kategori");
  const tipe = document.getElementById("filter-tipe");
  const count = document.getElementById("result-count");

  let books = [];
  try {
    const payload = await apiFetch("api/books.php");
    books = payload.data;
    [...new Set(books.map((b) => b.kategori))].forEach((k) => {
      kategori.insertAdjacentHTML("beforeend", `<option value="${escapeHTML(k)}">${escapeHTML(k)}</option>`);
    });
  } catch (error) {
    grid.innerHTML = `<p>${escapeHTML(error.message)}</p>`;
  }

  // Ambil ?q= dari URL
  const q = new URLSearchParams(location.search).get("q");
  if (q) search.value = q;

  function render() {
    const keyword = search.value.toLowerCase();
    const result = books.filter((b) =>
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
async function initDetail() {
  const id = Number(new URLSearchParams(location.search).get("id"));
  const box = document.getElementById("detail-box");
  let book;
  try {
    const payload = await apiFetch(`api/books.php?id=${encodeURIComponent(id)}`);
    book = payload.data;
  } catch (error) {
    box.innerHTML = `<p>${escapeHTML(error.message)} <a href="katalog.html">Kembali ke katalog</a></p>`;
    return;
  }

  document.title = `${book.judul} - PerpusKu`;
  const available = book.stok > 0;
  box.innerHTML = `
    ${coverHTML(book)}
    <div>
      <span class="badge">${escapeHTML(book.kategori)}</span>
      <h1>${escapeHTML(book.judul)}</h1>
      <ul class="detail-meta">
        <li><strong>Penulis</strong> ${escapeHTML(book.penulis)}</li>
        <li><strong>Tahun terbit</strong> ${escapeHTML(book.tahun)}</li>
        <li><strong>Tipe</strong> ${book.tipe === "ebook" ? "E-Book" : "Buku Fisik"}</li>
        <li><strong>Stok</strong> ${escapeHTML(book.stok)}</li>
      </ul>
      <p>${escapeHTML(book.deskripsi)}</p>
      <div id="detail-alert" class="alert" role="alert"></div>
      <p style="margin-top:1.25rem">
        <button id="btn-pinjam" class="btn" ${available ? "" : "disabled"}>
          ${available ? "Pinjam Buku" : "Stok Habis"}
        </button>
        <a href="katalog.html" class="btn btn-outline">Kembali</a>
      </p>
    </div>`;

  document.getElementById("btn-pinjam")?.addEventListener("click", async () => {
    try {
      await apiFetch("api/loans.php?action=borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_id: book.id })
      });
      showAlert(document.getElementById("detail-alert"), "Buku berhasil dipinjam.", "success");
      setTimeout(() => location.href = "dashboard.html", 700);
    } catch (error) {
      showAlert(document.getElementById("detail-alert"), error.message, "danger");
    }
  });
}
