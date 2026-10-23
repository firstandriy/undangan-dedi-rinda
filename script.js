/* DEDI & RINDA — INTERACTIONS */
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // Personalized guest name (?to=Nama%20Tamu)
  const params = new URLSearchParams(window.location.search);
  const guest = params.get("to");
  if (guest && $("#guestName")) $("#guestName").textContent = guest.replace(/\+/g, " ").trim();

  // Preloader: short branded intro
  const preloader = $("#preloader");
  const loaderBar = $("#loaderBar");
  const loaderText = $("#loaderText");
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

  // Reveal on scroll
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

  // Music: browsers generally require a user gesture; start when opening invitation.
  const music = $("#bgMusic");
  const musicToggle = $("#musicToggle");
  const musicLabel = $("#musicLabel");
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
  $("#openInvitation")?.addEventListener("click", async () => {
    await playMusic();
    $("#intro")?.scrollIntoView({ behavior: "smooth" });
  });
  musicToggle?.addEventListener("click", () => {
    if (music?.paused) playMusic(); else pauseMusic();
  });

  // Countdown to local Indonesia time (WIB)
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

  // Gallery: 11 images, featured image, thumbnail navigation, lightbox, keyboard and swipe.
  const photoPaths = Array.from({ length: 11 }, (_, i) => `foto-galeri-${i + 1}.jpg`);
  const featured = $("#featuredPhoto");
  const thumbsWrap = $("#galleryThumbs");
  const count = $("#galleryCount");
  const lightbox = $("#photoLightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCounter = $("#lightboxCounter");
  let photoIndex = 0;
  let touchX = 0, touchY = 0;

  // Use thumbnail assets as filenames; a missing photo will show a clear fallback rather than breaking controls.
  function renderThumbs() {
    if (!thumbsWrap) return;
    thumbsWrap.innerHTML = "";
    photoPaths.forEach((src, i) => {
      const button = document.createElement("button");
      button.className = "gallery-thumb" + (i === photoIndex ? " active" : "");
      button.type = "button";
      button.setAttribute("aria-label", `Pilih foto ${i + 1}`);
      const img = document.createElement("img");
      img.src = src; img.alt = `Galeri Dedi dan Rinda ${i + 1}`; img.loading = "lazy";
      img.onerror = () => { button.style.display = "none"; };
      button.appendChild(img);
      button.addEventListener("click", () => showPhoto(i));
      thumbsWrap.appendChild(button);
    });
  }
  function showPhoto(i) {
    photoIndex = (i + photoPaths.length) % photoPaths.length;
    const src = photoPaths[photoIndex];
    if (featured) {
      featured.src = src;
      featured.alt = `Foto Dedi dan Rinda ${photoIndex + 1}`;
      featured.onerror = () => { featured.alt = `Pastikan file ${src} tersedia di repositori`; };
    }
    if (count) count.textContent = `${photoIndex + 1} / ${photoPaths.length}`;
    $$(".gallery-thumb", thumbsWrap || document).forEach((el, idx) => el.classList.toggle("active", idx === photoIndex));
    if (lightbox?.classList.contains("active")) {
      lightboxImage.src = src;
      lightboxImage.alt = `Foto Dedi dan Rinda ${photoIndex + 1}`;
      if (lightboxCounter) lightboxCounter.textContent = `${photoIndex + 1} / ${photoPaths.length}`;
    }
  }
  function openLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = photoPaths[photoIndex];
    lightboxImage.alt = `Foto Dedi dan Rinda ${photoIndex + 1}`;
    if (lightboxCounter) lightboxCounter.textContent = `${photoIndex + 1} / ${photoPaths.length}`;
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox?.classList.remove("active");
    lightbox?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  renderThumbs(); showPhoto(0);
  $("#galleryPrev")?.addEventListener("click", () => showPhoto(photoIndex - 1));
  $("#galleryNext")?.addEventListener("click", () => showPhoto(photoIndex + 1));
  $("#galleryOpen")?.addEventListener("click", openLightbox);
  featured?.addEventListener("click", openLightbox);
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
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) showPhoto(photoIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });

  // RSVP via WhatsApp
  $("#rsvpForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#rsvpName")?.value.trim() || "";
    const guests = $("#rsvpCount")?.value || "1";
    const status = $("#rsvpStatus")?.value || "Hadir";
    const message = $("#rsvpMessage")?.value.trim() || "-";
    const text = `Assalamu'alaikum, saya ${name} ingin mengonfirmasi undangan pernikahan Dedi & Rinda.%0AStatus: ${status}%0AJumlah tamu: ${guests}%0AUcapan & doa: ${message}`;
    window.open(`https://wa.me/6285701221321?text=${encodeURIComponent(decodeURIComponent(text))}`, "_blank", "noopener");
  });

  // Copy bank account numbers
  $$(".copy-button").forEach(button => {
    button.addEventListener("click", async () => {
      const target = document.getElementById(button.dataset.copy);
      const value = target?.textContent.trim();
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        const old = button.textContent;
        button.textContent = "✓ Berhasil disalin";
        setTimeout(() => button.textContent = old, 1800);
      } catch (_) {
        window.prompt("Salin nomor rekening berikut:", value);
      }
    });
  });
})();
