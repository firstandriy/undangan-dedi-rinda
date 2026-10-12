// ===== PENGATURAN UNDANGAN DEDI & RINDA =====
const WEDDING_DATE = "2026-11-22T08:00:00+07:00";
const WHATSAPP_NUMBER = "6285701221321"; // nomor RSVP
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Blumbang%20RT004%20RW001%20Desa%20Semawung%20Andong%20Boyolali";
const WISHES_FORM_URL = "https://forms.google.com/"; // ganti dengan link Google Form ucapan
const BANK_NAME = ""; // lengkapi setelah nama bank dikonfirmasi
const ACCOUNT_NUMBER = ""; // lengkapi setelah nomor rekening dikonfirmasi
const ACCOUNT_OWNER = ""; // lengkapi setelah nama pemilik rekening dikonfirmasi
const WALLET_NAME = "DANA";
const WALLET_NUMBER = ""; // lengkapi setelah nomor DANA dikonfirmasi
const WALLET_OWNER = ""; // lengkapi setelah nama pemilik akun DANA dikonfirmasi
// ============================================

const params = new URLSearchParams(window.location.search);
const guest = params.get("to");
document.getElementById("guestName").textContent = guest ? guest : "Bapak/Ibu/Saudara/i";
document.getElementById("rsvpName").value = guest || "";
document.getElementById("mapsLink").href = MAPS_URL;
document.getElementById("wishLink").href = WISHES_FORM_URL;
document.getElementById("bankName").textContent = BANK_NAME || "Informasi bank belum diisi";
document.getElementById("accountNumber").textContent = ACCOUNT_NUMBER || "Nomor rekening belum tersedia";
document.getElementById("accountOwner").textContent = ACCOUNT_OWNER ? "a.n. " + ACCOUNT_OWNER : "Nama pemilik rekening belum diisi";
document.getElementById("copyAccount").disabled = !ACCOUNT_NUMBER;
document.getElementById("walletName").textContent = WALLET_NAME;
document.getElementById("walletNumber").textContent = WALLET_NUMBER || "Nomor DANA belum tersedia";
document.getElementById("walletOwner").textContent = WALLET_OWNER || "Nama pemilik akun belum diisi";
document.getElementById("copyWallet").disabled = !WALLET_NUMBER;

document.getElementById("openBtn").addEventListener("click", () => {
  document.getElementById("cover").classList.add("hidden");
  const music = document.getElementById("bgMusic");
  music.play().then(() => document.getElementById("musicBtn").textContent = "Ⅱ").catch(() => {});
});
document.getElementById("musicBtn").addEventListener("click", async () => {
  const music = document.getElementById("bgMusic");
  if (music.paused) {
    try { await music.play(); document.getElementById("musicBtn").textContent = "Ⅱ"; } catch(e) {}
  } else {
    music.pause(); document.getElementById("musicBtn").textContent = "♫";
  }
});
document.getElementById("rsvpForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("rsvpName").value.trim();
  const attendance = document.getElementById("attendance").value;
  const count = document.getElementById("guestCount").value;
  const message = `RSVP Pernikahan Dedi Herdianto & Rinda Dwi Mangesti\nNama: ${name}\nKonfirmasi: ${attendance}\nJumlah tamu: ${count}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
});
async function copyGiftNumber(number, buttonId, promptLabel) {
  if (!number) return;
  const button = document.getElementById(buttonId);
  try {
    await navigator.clipboard.writeText(number);
    button.textContent = "Nomor tersalin ✓";
  } catch(e) {
    window.prompt(promptLabel, number);
  }
}
document.getElementById("copyAccount").addEventListener("click", () => copyGiftNumber(ACCOUNT_NUMBER, "copyAccount", "Salin nomor rekening ini:"));
document.getElementById("copyWallet").addEventListener("click", () => copyGiftNumber(WALLET_NUMBER, "copyWallet", "Salin nomor DANA ini:"));
const target = new Date(WEDDING_DATE).getTime();
function tick() {
  let distance = target - Date.now();
  if (distance < 0) distance = 0;
  document.getElementById("days").textContent = String(Math.floor(distance / 86400000)).padStart(2,"0");
  document.getElementById("hours").textContent = String(Math.floor(distance / 3600000) % 24).padStart(2,"0");
  document.getElementById("minutes").textContent = String(Math.floor(distance / 60000) % 60).padStart(2,"0");
  document.getElementById("seconds").textContent = String(Math.floor(distance / 1000) % 60).padStart(2,"0");
}
tick(); setInterval(tick, 1000);


/* ===== ANIMASI FOTO DAN TEKS SAAT DIGULIR ===== */
document.addEventListener("DOMContentLoaded", function () {
  const elemen = document.querySelectorAll(
    ".hero-inner, .quote, .couple, .details, .gallery, " +
    ".rsvp, .wishes, .gift, .closing, .person, " +
    ".photo, .gallery-photo, .event, .bank-card"
  );

  if (!("IntersectionObserver" in window)) {
    elemen.forEach(function (item) {
      item.classList.add("is-visible");
    });
    return;
  }

  const pengamat = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        pengamat.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -25px 0px"
  });

  elemen.forEach(function (item) {
    pengamat.observe(item);
  });
});
/* ===== ANIMASI SAAT HALAMAN DIGULIR ===== */
document.addEventListener("DOMContentLoaded", function () {
  const elemenAnimasi = document.querySelectorAll(
    ".hero-inner, .quote, .couple, .details, .gallery, " +
    ".rsvp, .wishes, .gift, .closing, .person, " +
    ".photo, .gallery-photo, .event"
  );

  /* Browser lama tetap menampilkan seluruh konten */
  if (!("IntersectionObserver" in window)) return;

  const pengamat = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          pengamat.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  elemenAnimasi.forEach(function (elemen) {
    elemen.classList.add("reveal");
    pengamat.observe(elemen);
  });
});
