/* DEDI & RINDA — INTERACTIONS */
(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // Nama tamu dari tautan ?to=Nama%20Tamu
  const params = new URLSearchParams(window.location.search);
  const guest = params.get("to");
  if (guest && $("#guestName")) $("#guestName").textContent = guest.replace(/\+/g, " ").trim();

  // Preloader
  const preloader = $("#preloader"), loaderBar = $("#loaderBar"), loaderText = $("#loaderText");
  let progress = 0;
  const loadInterval = setInterval(() => {
    progress = Math.min(progress + Math.floor(Math.random() * 15 + 7), 100);
    if (loaderBar) loaderBar.style.width = progress + "%";
    if (loaderText) loaderText.textContent = progress < 45 ? "Menyiapkan ornamen..." : progress < 85 ? "Menyiapkan momen bahagia..." : "Undangan siap dibuka";
    if (progress >= 100) {
      clearInterval(loadInterval);
      setTimeout(() => preloader?.classList.add("done"), 350);
    }
  }, 120);

  // Animasi bagian saat masuk layar; cover tidak memakai class reveal agar langsung terlihat.
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add("visible"));

  // Musik baru dicoba setelah tindakan pengguna karena aturan browser.
  const music = $("#bgMusic"), musicToggle = $("#musicToggle"), musicLabel = $("#musicLabel");
  async function playMusic() {
    if (!music) return;
    try {
      await music.play();
      musicToggle?.classList.add("playing");
      if (musicLabel) musicLabel.textContent = "Musik menyala";
    } catch (_) {
      if (musicLabel) musicLabel.textContent = "Ketuk untuk musik";
    }
  }
  function pauseMusic() {
    music?.pause();
    musicToggle?.classList.remove("playing");
    if (musicLabel) musicLabel.textContent = "Putar Musik";
  }

  // Cover -> ayat Al-Qur'an
  const openButton = $("#openInvitation"), hero = $("#home");
  let invitationOpened = false;
  openButton?.addEventListener("click", () => {
    if (invitationOpened) return;
    invitationOpened = true;
    openButton.disabled = true;
    playMusic();
    hero?.classList.add("opening");
    setTimeout(() => {
      if (hero) hero.classList.add("opened");
      document.body.classList.add("invitation-opened");
      const quranSection = $("#quran");
      if (quranSection) {
        quranSection.classList.add("visible");
        quranSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 1050);
  });
  musicToggle?.addEventListener("click", () => {
    if (music?.paused) playMusic(); else pauseMusic();
  });

  // Countdown WIB
  const weddingDate = new Date("2026-11-22T08:00:00+07:00").getTime();
  const pad = n => String(n).padStart(2, "0");
  function updateCountdown() {
    let diff = Math.max(0, weddingDate - Date.now());
    const days = Math.floor(diff / 86400000); diff %= 86400000;
    const hours = Math.floor(diff / 3600000); diff %= 3600000;
    const minutes = Math.floor(diff / 60000); diff %= 60000;
    const seconds = Math.floor(diff / 1000);
    if ($("#days")) $("#days").textContent = pad(days);
    if ($("#hours")) $("#hours").textContent = pad(hours);
    if ($("#minutes")) $("#minutes").textContent = pad(minutes);
    if ($("#seconds")) $("#seconds").textContent = pad(seconds);
  }
  updateCountdown(); setInterval(updateCountdown, 1000);

  // Galeri 11 foto + lightbox
  const photoPaths = Array.from({ length: 11 }, (_, i) => `foto-galeri-${i + 1}.jpg`);
  const featured = $("#featuredPhoto"), thumbsWrap = $("#galleryThumbs"), count = $("#galleryCount");
  const lightbox = $("#photoLightbox"), lightboxImage = $("#lightboxImage"), lightboxCounter = $("#lightboxCounter");
  let photoIndex = 0, touchX = 0, touchY = 0;
  function renderThumbs() {
    if (!thumbsWrap) return;
    thumbsWrap.innerHTML = "";
    photoPaths.forEach((src, i) => {
      const button = document.createElement("button");
      button.className = "gallery-thumb" + (i === photoIndex ? " active" : "");
      button.type = "button"; button.setAttribute("aria-label", `Pilih foto ${i + 1}`);
      const img = document.createElement("img");
      img.src = src; img.alt = `Galeri Dedi dan Rinda ${i + 1}`; img.loading = "lazy";
      img.onerror = () => { button.style.display = "none"; };
      button.appendChild(img); button.addEventListener("click", () => showPhoto(i));
      thumbsWrap.appendChild(button);
    });
  }
  function showPhoto(i) {
    photoIndex = (i + photoPaths.length) % photoPaths.length;
    const src = photoPaths[photoIndex];
    if (featured) {
      featured.src = src; featured.alt = `Foto Dedi dan Rinda ${photoIndex + 1}`;
      featured.onerror = () => { featured.alt = `Pastikan file ${src} tersedia di repositori`; };
    }
    if (count) count.textContent = `${photoIndex + 1} / ${photoPaths.length}`;
    $$(".gallery-thumb", thumbsWrap || document).forEach((el, idx) => el.classList.toggle("active", idx === photoIndex));
    if (lightbox?.classList.contains("active") && lightboxImage) {
      lightboxImage.src = src; lightboxImage.alt = `Foto Dedi dan Rinda ${photoIndex + 1}`;
      if (lightboxCounter) lightboxCounter.textContent = `${photoIndex + 1} / ${photoPaths.length}`;
    }
  }
  function openLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = photoPaths[photoIndex];
    if (lightboxCounter) lightboxCounter.textContent = `${photoIndex + 1} / ${photoPaths.length}`;
    lightbox.classList.add("active"); lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }
  function closeLightbox() {
    lightbox?.classList.remove("active"); lightbox?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }
  renderThumbs(); showPhoto(0);
  $("#galleryPrev")?.addEventListener("click", () => showPhoto(photoIndex - 1));
  $("#galleryNext")?.addEventListener("click", () => showPhoto(photoIndex + 1));
  $("#galleryOpen")?.addEventListener("click", openLightbox);
  $("#lightboxClose")?.addEventListener("click", closeLightbox);
  $("#lightboxPrev")?.addEventListener("click", () => showPhoto(photoIndex - 1));
  $("#lightboxNext")?.addEventListener("click", () => showPhoto(photoIndex + 1));
  lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => {
    if (!lightbox?.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPhoto(photoIndex - 1);
    if (e.key === "ArrowRight") showPhoto(photoIndex + 1);
  });
  lightbox?.addEventListener("touchstart", e => {
    touchX = e.changedTouches[0].clientX; touchY = e.changedTouches[0].clientY;
  }, { passive: true });
  lightbox?.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - touchX, dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) showPhoto(photoIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });

  // Wedding Wish. Tanpa endpoint server, data disimpan lokal di browser ini saja.
  const WISH_STORAGE_KEY = "dediRindaWeddingWishes";
  const wishForm = $("#rsvpForm"), wishList = $("#wishList");
  function readWishes() {
    try { return JSON.parse(localStorage.getItem(WISH_STORAGE_KEY) || "[]"); }
    catch (_) { return []; }
  }
  function renderWishes() {
    if (!wishList) return;
    const wishes = readWishes();
    if ($("#wishTotal")) $("#wishTotal").textContent = wishes.length;
    if ($("#wishAttending")) $("#wishAttending").textContent = wishes.filter(w => w.status === "Hadir").length;
    if ($("#wishNotAttending")) $("#wishNotAttending").textContent = wishes.filter(w => w.status === "Tidak Hadir").length;
    wishList.innerHTML = "";
    if (!wishes.length) {
      const empty = document.createElement("p");
      empty.className = "wish-item empty-wish"; empty.textContent = "Jadilah yang pertama mengirim ucapan dan doa.";
      wishList.appendChild(empty); return;
    }
    wishes.slice().reverse().forEach(w => {
      const article = document.createElement("article"); article.className = "wish-item";
      const title = document.createElement("h3"); title.textContent = w.name;
      const message = document.createElement("p"); message.textContent = w.message;
      const meta = document.createElement("div"); meta.className = "wish-meta";
      const status = document.createElement("span"); status.className = "status-pill"; status.textContent = w.status;
      const date = document.createElement("span"); date.textContent = w.date || "";
      meta.append(status, date); article.append(title, message, meta); wishList.appendChild(article);
    });
  }
  wishForm?.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#rsvpName")?.value.trim() || "";
    const message = $("#rsvpMessage")?.value.trim() || "";
    const status = $("#rsvpStatus")?.value || "Hadir";
    if (!name || !message) return;
    const wishes = readWishes();
    wishes.push({ name, message, status, date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) });
    try {
      localStorage.setItem(WISH_STORAGE_KEY, JSON.stringify(wishes.slice(-100)));
      wishForm.reset(); renderWishes();
      const note = $("#wishNote");
      if (note) note.textContent = "Ucapan tersimpan di browser perangkat ini. Untuk ditampilkan ke semua tamu, hubungkan Google Sheets.";
    } catch (_) {
      alert("Browser tidak bisa menyimpan ucapan. Coba izinkan penyimpanan situs di pengaturan browser.");
    }
  });
  renderWishes();

  // Salin nomor rekening
  $$(".copy-button").forEach(button => {
    button.addEventListener("click", async () => {
      const target = document.getElementById(button.dataset.copy), value = target?.textContent.trim();
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        const old = button.textContent; button.textContent = "✓ Berhasil disalin";
        setTimeout(() => button.textContent = old, 1800);
      } catch (_) { window.prompt("Salin nomor rekening berikut:", value); }
    });
  });
})();
/* DEDI & RINDA — LUXURY CINEMATIC ADD-ON
   Tambahkan setelah script.js. Animasi ringan; tidak menggantikan fungsi lama. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress line
  const progress = document.createElement('div');
  progress.className = 'lux-scroll-glow';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  let ticking = false;
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + '%';
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(updateProgress); ticking = true; }
  }, { passive: true });
  updateProgress();

  // Petals are decorative and hidden for reduced-motion preference.
  if (!reduceMotion) {
    const layer = document.createElement('div');
    layer.id = 'luxPetals';
    layer.setAttribute('aria-hidden', 'true');
    const count = window.innerWidth < 680 ? 9 : 16;
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('span');
      petal.className = 'lux-petal';
      petal.style.setProperty('--left', (Math.random() * 100) + '%');
      petal.style.setProperty('--size', (5 + Math.random() * (window.innerWidth < 680 ? 7 : 10)) + 'px');
      petal.style.setProperty('--opacity', (0.18 + Math.random() * 0.38).toFixed(2));
      petal.style.setProperty('--rotation', Math.round(Math.random() * 360) + 'deg');
      petal.style.setProperty('--duration', (15 + Math.random() * 17) + 's');
      petal.style.setProperty('--delay', (-Math.random() * 28) + 's');
      layer.appendChild(petal);
    }
    document.body.appendChild(layer);
  }

  // Gentle parallax on cover only; avoid heavy scroll work on mobile.
  const heroBackdrop = $('.hero-backdrop');
  if (heroBackdrop && !reduceMotion) {
    let heroTick = false;
    window.addEventListener('scroll', () => {
      if (heroTick) return;
      heroTick = true;
      window.requestAnimationFrame(() => {
        if (window.scrollY < window.innerHeight * 1.2) {
          heroBackdrop.style.setProperty('--lux-parallax', Math.min(24, window.scrollY * .06) + 'px');
        }
        heroTick = false;
      });
    }, { passive: true });
  }

  // Replace the local-only note with an honest, calm status until Sheets is configured.
  const note = $('#wishNote');
  if (note) {
    note.textContent = 'Buku tamu online belum dihubungkan. Ucapan saat ini hanya tersimpan di browser perangkat ini.';
    note.setAttribute('role', 'status');
  }

  // Official bank logo artwork from Wikimedia Commons (requires internet access).
  // If image loading fails, readable bank-name fallback remains visible.
  const bankLogos = [
    { selector: '.bca-logo', src: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg', alt: 'Logo Bank BCA' },
    { selector: '.bri-logo', src: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Bank_Rakyat_Indonesia_logo.svg', alt: 'Logo Bank BRI' }
  ];
  bankLogos.forEach(item => {
    const holder = $(item.selector);
    if (!holder || holder.querySelector('img')) return;
    const image = document.createElement('img');
    image.src = item.src;
    image.alt = item.alt;
    image.loading = 'lazy';
    image.referrerPolicy = 'no-referrer';
    image.onerror = () => { image.remove(); };
    holder.replaceChildren(image);
  });

  // Animate the active gallery image with a brief cinematic transition.
  const galleryImage = $('#featuredPhoto');
  if (galleryImage && !reduceMotion) {
    galleryImage.addEventListener('load', () => {
      galleryImage.animate(
        [{ opacity: .45, transform: 'scale(1.035)', filter: 'blur(3px)' },
         { opacity: 1, transform: 'scale(1)', filter: 'blur(0)' }],
        { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' }
      );
    });
  }
})();
