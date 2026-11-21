/* ==========================================================
   validation.js - Validasi form login & register
   Pemilik: Anggota 2
   ========================================================== */

const Validator = {
  required: (v) => (v.trim() ? "" : "Field ini wajib diisi."),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Format email tidak valid."),
  minLength: (n) => (v) => (v.length >= n ? "" : `Minimal ${n} karakter.`),
  nim: (v) => (/^\d{9,12}$/.test(v) ? "" : "NIM harus 9-12 digit angka."),
  phone: (v) => (/^(08|\+628)\d{8,11}$/.test(v) ? "" : "Nomor HP tidak valid (contoh: 081234567890)."),
  strongPassword: (v) =>
    /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v) ? "" : "Minimal 8 karakter, kombinasi huruf dan angka."
};

function setError(input, message) {
  const errEl = input.closest(".form-group").querySelector(".error-text");
  input.classList.toggle("is-invalid", !!message);
  if (errEl) errEl.textContent = message;
  return !message;
}

// rules: { idInput: [fn, fn, ...] }
function validateField(input, rules) {
  for (const rule of rules) {
    const msg = rule(input.value);
    if (msg) return setError(input, msg);
  }
  return setError(input, "");
}

function bindForm(form, rulesMap, onValid) {
  // Validasi realtime saat blur
  Object.entries(rulesMap).forEach(([id, rules]) => {
    const input = form.querySelector("#" + id);
    input.addEventListener("blur", () => validateField(input, rules));
    input.addEventListener("input", () => input.classList.contains("is-invalid") && validateField(input, rules));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    Object.entries(rulesMap).forEach(([id, rules]) => {
      const input = form.querySelector("#" + id);
      if (!validateField(input, rules)) ok = false;
    });
    if (ok) onValid(new FormData(form));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Login ----------
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    bindForm(
      loginForm,
      {
        email: [Validator.required, Validator.email],
        password: [Validator.required, Validator.minLength(6)]
      },
      async () => {
        try {
          const payload = await apiFetch("api/auth.php?action=login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: loginForm.querySelector("#email").value,
              password: loginForm.querySelector("#password").value
            })
          });
          showAlert(document.getElementById("form-alert"), "Login berhasil. Mengalihkan...", "success");
          setTimeout(() => (location.href = payload.data.role === "admin" ? "admin.html" : "dashboard.html"), 700);
        } catch (error) {
          showAlert(document.getElementById("form-alert"), error.message, "danger");
        }
      }
    );
  }

  // ---------- Register ----------
  const regForm = document.getElementById("register-form");
  if (regForm) {
    const pw = regForm.querySelector("#password");
    bindForm(
      regForm,
      {
        nama: [Validator.required, Validator.minLength(3)],
        nim: [Validator.required, Validator.nim],
        email: [Validator.required, Validator.email],
        telepon: [Validator.required, Validator.phone],
        password: [Validator.required, Validator.strongPassword],
        konfirmasi: [
          Validator.required,
          (v) => (v === pw.value ? "" : "Konfirmasi password tidak sama.")
        ]
      },
      async () => {
        try {
          await apiFetch("api/auth.php?action=register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nama: regForm.querySelector("#nama").value,
              nim: regForm.querySelector("#nim").value,
              email: regForm.querySelector("#email").value,
              telepon: regForm.querySelector("#telepon").value,
              password: regForm.querySelector("#password").value,
              konfirmasi: regForm.querySelector("#konfirmasi").value
            })
          });
          showAlert(document.getElementById("form-alert"), "Pendaftaran berhasil. Silakan login.", "success");
          setTimeout(() => (location.href = "login.html"), 900);
        } catch (error) {
          showAlert(document.getElementById("form-alert"), error.message, "danger");
        }
      }
    );
  }
});
