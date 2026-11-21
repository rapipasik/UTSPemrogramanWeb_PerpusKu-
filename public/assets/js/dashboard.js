/* ==========================================================
   dashboard.js - Dashboard member & panel admin (data dummy)
   Pemilik: Anggota 2
   TODO (tahap PHP): ganti data dummy dengan fetch ke controller
   ========================================================== */

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
  return `<span class="badge ${STATUS_BADGE[s] || "badge-warning"}">${escapeHTML(s)}</span>`;
}

// ---------- Dashboard member ----------
async function initDashboard() {
  const body = document.getElementById("loan-body");
  let loans = [];
  try {
    const me = await apiFetch("api/auth.php?action=me");
    if (me.data.role === "admin") location.href = "admin.html";
    const payload = await apiFetch("api/loans.php");
    loans = payload.data;
  } catch (error) {
    location.href = "login.html";
    return;
  }
  body.innerHTML = loans.map((l) => `
    <tr>
      <td>${escapeHTML(l.judul)}</td>
      <td>${escapeHTML(l.tgl_pinjam)}</td>
      <td>${escapeHTML(l.jatuh_tempo)}</td>
      <td>${statusBadge(l.status)}${l.denda ? ` <small>Denda Rp${escapeHTML(l.denda)}</small>` : ""}</td>
      <td>${l.status === "dikembalikan" ? "-" :
        `<button class="btn btn-sm" data-return="${l.id}">Kembalikan</button>`}</td>
    </tr>`).join("");

  body.addEventListener("click", async (e) => {
    const id = e.target.dataset.return;
    if (!id) return;
    try {
      await apiFetch(`api/loans.php?action=return&id=${encodeURIComponent(id)}`, { method: "POST" });
      initDashboard();
    } catch (error) {
      alert(error.message);
    }
  });

  document.getElementById("stat-aktif").textContent =
    loans.filter((l) => l.status !== "dikembalikan").length;
  document.getElementById("stat-terlambat").textContent =
    loans.filter((l) => l.status === "terlambat").length;
  document.getElementById("stat-total").textContent = loans.length;
}

// ---------- Admin ----------
async function initAdmin() {
  let books = [], members = [], loans = [];
  try {
    const me = await apiFetch("api/auth.php?action=me");
    if (me.data.role !== "admin") throw new Error("Akses admin diperlukan.");
    [books, members, loans] = await Promise.all([
      apiFetch("api/books.php").then(p => p.data),
      apiFetch("api/members.php").then(p => p.data),
      apiFetch("api/loans.php?action=all").then(p => p.data)
    ]);
  } catch (error) {
    alert(error.message);
    location.href = "login.html";
    return;
  }
  // Tabel buku
  const bookBody = document.getElementById("admin-book-body");
  const renderBooks = () => {
    bookBody.innerHTML = books.map((b) => `
      <tr>
        <td>${escapeHTML(b.id)}</td><td>${escapeHTML(b.judul)}</td><td>${escapeHTML(b.penulis)}</td>
        <td>${escapeHTML(b.kategori)}</td><td>${escapeHTML(b.stok)}</td>
        <td><button class="btn btn-sm btn-danger" data-del="${b.id}">Hapus</button></td>
      </tr>`).join("");
  };
  renderBooks();

  bookBody.addEventListener("click", async (e) => {
    const id = Number(e.target.dataset.del);
    if (!id) return;
    if (confirm("Hapus buku ini?")) {
      try {
        await apiFetch(`api/books.php?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        books = books.filter((b) => b.id !== id);
        renderBooks();
        document.getElementById("stat-buku").textContent = books.length;
      } catch (error) {
        alert(error.message);
      }
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
    async () => {
      try {
        const payload = await apiFetch("api/books.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            judul: form.querySelector("#b-judul").value,
            penulis: form.querySelector("#b-penulis").value,
            kategori: form.querySelector("#b-kategori").value,
            tahun: Number(form.querySelector("#b-tahun").value),
            tipe: form.querySelector("#b-tipe").value,
            stok: Number(form.querySelector("#b-stok").value),
            deskripsi: ""
          })
        });
        books.push(payload.data);
        renderBooks();
        document.getElementById("stat-buku").textContent = books.length;
        form.reset();
        closeModal("modal-buku");
      } catch (error) {
        alert(error.message);
      }
    }
  );

  // Tabel anggota
  document.getElementById("admin-member-body").innerHTML = members.map((m) => `
    <tr><td>${escapeHTML(m.nama)}</td><td>${escapeHTML(m.nim)}</td><td>${escapeHTML(m.email)}</td><td>${statusBadge(m.status)}</td></tr>`).join("");

  // Tabel transaksi
  document.getElementById("admin-loan-body").innerHTML = loans.map((l) => `
    <tr><td>${escapeHTML(l.id)}</td><td>${escapeHTML(l.judul)}</td><td>${escapeHTML(l.tgl_pinjam)}</td><td>${escapeHTML(l.jatuh_tempo)}</td><td>${statusBadge(l.status)}</td></tr>`).join("");

  document.getElementById("stat-buku").textContent = books.length;
  document.getElementById("stat-anggota").textContent = members.length;
  document.getElementById("stat-transaksi").textContent = loans.length;
}
