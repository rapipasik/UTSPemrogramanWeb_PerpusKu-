/* ==========================================================
   main.js - Fungsi umum (navbar, tab, modal, helper)
   Pemilik: Anggota 1
   ========================================================== */

const COVER_EMOJI = { Novel: "📖", Teknologi: "💻", Sejarah: "🏛️", "Pengembangan Diri": "🌱" };

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

async function apiFetch(url, options = {}) {
  const response = await fetch(url, { credentials: "same-origin", ...options });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || "Terjadi kesalahan.");
  return payload;
}

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
  document.querySelectorAll('a').forEach((link) => {
    if (link.textContent.trim() === "Keluar") {
      link.addEventListener("click", async (event) => {
        event.preventDefault();
        try {
          await apiFetch("api/auth.php?action=logout", { method: "POST" });
        } catch (_) {}
        location.href = "login.html";
      });
    }
  });
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
        <span class="badge">${escapeHTML(book.kategori)}</span>
        <h3>${escapeHTML(book.judul)}</h3>
        <p class="author">${escapeHTML(book.penulis)} • ${escapeHTML(book.tahun)}</p>
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
  return `<div class="book-cover" data-cat="${escapeHTML(book.kategori)}" aria-hidden="true">
    <span class="cover-title">${escapeHTML(book.judul)}</span>
    <span class="cover-author">${escapeHTML(book.penulis)}</span>
  </div>`;
}
