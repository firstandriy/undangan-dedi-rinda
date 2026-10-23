
document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  // DATA ACARA
  const weddingDate = new Date("2026-11-22T08:00:00+07:00");
  const whatsappNumber = "6285701221321";

  // NAMA TAMU DARI TAUTAN ?to=Nama+Tamu
  const params = new URLSearchParams(window.location.search);
  const guest = params.get("to");

  if (guest && $("guestName")) {
    $("guestName").textContent = guest.trim().slice(0, 100);
  }

  // COUNTDOWN
  function updateCountdown() {
    let distance = weddingDate.getTime() - Date.now();

    if (distance < 0) distance = 0;

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    if ($("days")) $("days").textContent = String(days).padStart(2, "0");
    if ($("hours")) $("hours").textContent = String(hours).padStart(2, "0");
    if ($("minutes")) $("minutes").textContent = String(minutes).padStart(2, "0");
    if ($("seconds")) $("seconds").textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // MUSIK: MULAI SETELAH TOMBOL PEMBUKA DIKLIK
  const music = $("bgMusic");
  const musicBtn = $("musicBtn");
  const cover = $("cover");
  const openBtn = $("openBtn");

  if (music) {
    music.volume = 0.65;
    music.loop = true;
  }

  function updateMusicButton() {
    if (!musicBtn || !music) return;

    const playing = !music.paused;
    musicBtn.classList.toggle("playing", playing);
    musicBtn.textContent = playing ? "Ⅱ" : "♫";
    musicBtn.setAttribute(
      "aria-label",
      playing ? "Jeda musik" : "Putar musik"
    );
  }

  async function playMusic() {
    if (!music) return;

    try {
      await music.play();
    } catch (error) {
      console.info("Musik belum bisa diputar. Tekan tombol musik untuk mencoba lagi.");
    }

    updateMusicButton();
  }

  if (openBtn) {
    openBtn.addEventListener("click", async () => {
      if (cover) cover.classList.add("closed");

      document.body.classList.add("invitation-open");
      await playMusic();

      // Tampilkan undangan utama setelah cover dibuka
      setTimeout(() => {
        if ($("home")) {
          $("home").scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    });
  }

  if (musicBtn) {
    musicBtn.addEventListener("click", async () => {
      if (!music) return;

      if (music.paused) {
        await playMusic();
      } else {
        music.pause();
        updateMusicButton();
      }
    });
  }

  if (music) {
    music.addEventListener("play", updateMusicButton);
    music.addEventListener("pause", updateMusicButton);
    music.addEventListener("ended", updateMusicButton);
  }

  // RSVP WHATSAPP
  const rsvpForm = $("rsvpForm");

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = $("rsvpName")?.value.trim();
      const attendance = $("attendance")?.value;
      const guestCount = $("guestCount")?.value;

      if (!name) {
        alert("Silakan isi nama terlebih dahulu.");
        return;
      }

      const message = [
        "Assalamu'alaikum, Dedi & Rinda.",
        "",
        "Saya ingin mengonfirmasi undangan pernikahan:",
        "Nama: " + name,
        "Konfirmasi: " + attendance,
        "Jumlah tamu: " + guestCount + " orang",
        "",
        "Semoga acara berjalan lancar. Aamiin."
      ].join("\n");

      const url =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(message);

      window.open(url, "_blank", "noopener");
    });
  }

  // SALIN NOMOR REKENING / DANA
  async function copyText(text, label) {
    if (!text || /belum (diisi|tersedia)/i.test(text)) {
      alert("Informasi " + label + " belum dilengkapi.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      alert(label + " berhasil disalin.");
    } catch (error) {
      // Cadangan jika clipboard tidak tersedia
      const field = document.createElement("textarea");
      field.value = text;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();

      const copied = document.execCommand("copy");
      field.remove();

      alert(copied
        ? label + " berhasil disalin."
        : "Silakan salin secara manual: " + text);
    }
  }

  if ($("copyAccount")) {
    $("copyAccount").addEventListener("click", () => {
      copyText($("accountNumber")?.textContent.trim(), "nomor rekening");
    });
  }

  if ($("copyWallet")) {
    $("copyWallet").addEventListener("click", () => {
      copyText($("walletNumber")?.textContent.trim(), "nomor DANA");
    });
  }

  // ANIMASI SAAT SECTION MASUK KE LAYAR
  const revealTargets = document.querySelectorAll(
    ".section, .person, .event, .gallery-photo, .bank-card"
  );

  revealTargets.forEach((element) => element.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add("visible"));
  }

  // LINK DOA & UCAPAN DAN GOOGLE MAPS SUDAH DIATUR DI HTML
});
