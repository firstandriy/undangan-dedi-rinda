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

document.addEventListener("DOMContentLoaded", function () {
  const musik = document.getElementById("musikUndangan");
  const tombol = document.getElementById("tombolMusik");
  const ikon = document.getElementById("ikonMusik");

  if (!musik || !tombol || !ikon) return;

  tombol.addEventListener("click", async function () {
    if (musik.paused) {
      try {
        await musik.play();
        ikon.textContent = "Ⅱ";
        tombol.setAttribute("aria-label", "Jeda musik");
      } catch (error) {
        ikon.textContent = "♫";
        alert("Musik belum bisa diputar. Periksa file musik.mp3.");
      }
    } else {
      musik.pause();
      ikon.textContent = "♫";
      tombol.setAttribute("aria-label", "Putar musik");
    }
  });

  musik.addEventListener("ended", function () {
    ikon.textContent = "♫";
  });
});
// Putar musik ketika tamu membuka undangan
document.addEventListener("DOMContentLoaded", function () {
  const tombolBuka = document.getElementById("openBtn");
  const musik = document.getElementById("bgMusic");

  if (!tombolBuka || !musik) return;

  tombolBuka.addEventListener("click", function () {
    musik.play().catch(function (error) {
      console.log("Musik belum dapat diputar:", error);
    });
  });
});

/* Animasi elemen saat masuk ke layar */
document.addEventListener("DOMContentLoaded", function () {
  const elemen = document.querySelectorAll(
    ".section, .person, .event, .bank-card, .gallery-photo"
  );

  elemen.forEach(function (item) {
    item.classList.add("reveal-ready");
  });

  const gayaAnimasi = document.createElement("style");
  gayaAnimasi.textContent = `
    .reveal-ready {
      opacity: 0;
      transform: translateY(24px);
      transition:
        opacity .9s ease,
        transform .9s ease;
    }

    .reveal-ready.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal-ready {
        opacity: 1;
        transform: none;
        transition: none;
      }
    }
  `;
  document.head.appendChild(gayaAnimasi);

  if ("IntersectionObserver" in window) {
    const pengamat = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          pengamat.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elemen.forEach(function (item) {
      pengamat.observe(item);
    });
  } else {
    elemen.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }
});
