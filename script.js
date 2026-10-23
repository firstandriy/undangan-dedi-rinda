(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const whatsappNumber = '6285701221321';
  const galleryFiles = [
    'foto-galeri-1.jpg',
    'foto-galeri-2.jpg',
    'foto-galeri-3.jpg',
    'foto-galeri-4.jpg',
    'foto-galeri-5.jpg',
    'foto-galeri-6.jpg',
    'foto-galeri-7.jpg',
    'foto-galeri-8.jpg',
    'foto-galeri-9.jpg',
    'foto-galeri-10.jpg',
    'foto-galeri-11.jpg',
    'foto-galeri-12.jpg',
    'foto-galeri-13.jpg'
  ];
  const galleryGrid = $('#galleryGrid');
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const toast = $('#toast');
  let activePhoto = 0;
  let toastTimer;

  function guestFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return (params.get('to') || params.get('nama') || params.get('guest') || '').replace(/[<>]/g, '').trim().slice(0, 90);
  }
  // Lightweight falling champagne-gold petals on the cover only.
  const cover = $('#cover');
  if (cover && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let i = 0; i < 13; i++) {
      const petal = document.createElement('span');
      petal.className = 'cinematic-petal';
      petal.setAttribute('aria-hidden', 'true');
      petal.style.setProperty('--x', `${Math.random() * 100}%`);
      petal.style.setProperty('--size', `${4 + Math.random() * 6}px`);
      petal.style.setProperty('--opacity', `${0.22 + Math.random() * 0.42}`);
      petal.style.setProperty('--duration', `${12 + Math.random() * 15}s`);
      petal.style.setProperty('--delay', `${-Math.random() * 24}s`);
      petal.style.setProperty('--rotate', `${Math.round(Math.random() * 360)}deg`);
      cover.appendChild(petal);
    }
  }

  const guestName = guestFromUrl();
  if (guestName) {
    $('#guestCover').textContent = guestName;
    $('#guestName').value = guestName;
    document.title = `Undangan untuk ${guestName} — Dedi & Rinda`;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  galleryFiles.forEach((file, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-item';
    button.setAttribute('aria-label', `Lihat foto ${index + 1}`);
    const img = document.createElement('img');
    img.src = file;
    img.alt = `Kenangan Dedi dan Rinda ${index + 1}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onerror = () => { button.classList.add('image-missing'); button.title = `File ${file} tidak ditemukan`; };
    button.appendChild(img);
    button.addEventListener('click', () => openLightbox(index));
    galleryGrid.appendChild(button);
  });

  function updateLightbox() {
    lightboxImage.src = galleryFiles[activePhoto];
    lightboxImage.alt = `Foto Dedi dan Rinda ${activePhoto + 1}`;
    $('#lightboxCount').textContent = `${activePhoto + 1} / ${galleryFiles.length}`;
  }
  function openLightbox(index) {
    activePhoto = index;
    updateLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('#lightboxClose').focus();
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function movePhoto(direction) {
    activePhoto = (activePhoto + direction + galleryFiles.length) % galleryFiles.length;
    updateLightbox();
  }
  $('#lightboxClose').addEventListener('click', closeLightbox);
  $('#lightboxPrev').addEventListener('click', () => movePhoto(-1));
  $('#lightboxNext').addEventListener('click', () => movePhoto(1));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') movePhoto(-1);
    if (event.key === 'ArrowRight') movePhoto(1);
  });
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
  lightbox.addEventListener('touchend', event => {
    const delta = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 45) movePhoto(delta < 0 ? 1 : -1);
  }, { passive: true });

  const audio = $('#weddingMusic');
  const musicToggle = $('#musicToggle');
  async function toggleMusic() {
    try {
      if (audio.paused) { await audio.play(); }
      else audio.pause();
    } catch (_) { showToast('Musik belum dapat diputar. Coba sentuh tombol musik lagi.'); }
  }
  musicToggle.addEventListener('click', toggleMusic);
  audio.addEventListener('play', () => { musicToggle.classList.add('playing'); musicToggle.setAttribute('aria-label', 'Jeda musik'); $('.music-label', musicToggle).textContent = 'Jeda'; });
  audio.addEventListener('pause', () => { musicToggle.classList.remove('playing'); musicToggle.setAttribute('aria-label', 'Putar musik'); $('.music-label', musicToggle).textContent = 'Musik'; });

  $('#openInvitation').addEventListener('click', async () => {
    const invitation = $('#invitation');
    invitation.classList.add('open');
    invitation.setAttribute('aria-hidden', 'false');
    document.body.classList.remove('is-locked');
    $('#cover').classList.add('cover-opened');
    $('#preloader').classList.add('done');
    try { await audio.play(); } catch (_) { /* Mobile browsers may require another tap. */ }
    setTimeout(() => $('#salam').scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  });

  const weddingDate = new Date('2026-11-22T08:00:00+07:00').getTime();
  function updateCountdown() {
    let remaining = weddingDate - Date.now();
    if (remaining <= 0) {
      $('#days').textContent = '000'; $('#hours').textContent = '00'; $('#minutes').textContent = '00'; $('#seconds').textContent = '00';
      return;
    }
    const day = Math.floor(remaining / 86400000); remaining %= 86400000;
    const hour = Math.floor(remaining / 3600000); remaining %= 3600000;
    const minute = Math.floor(remaining / 60000); remaining %= 60000;
    const second = Math.floor(remaining / 1000);
    $('#days').textContent = String(day).padStart(3, '0');
    $('#hours').textContent = String(hour).padStart(2, '0');
    $('#minutes').textContent = String(minute).padStart(2, '0');
    $('#seconds').textContent = String(second).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  $('#rsvpForm').addEventListener('submit', event => {
    event.preventDefault();
    const name = $('#guestName').value.trim();
    if (!name) { $('#guestName').focus(); return; }
    const count = $('#guestCount').value;
    const attendance = $('#attendance').value;
    const message = `Assalamu'alaikum, saya ${name}.\n\nKonfirmasi undangan pernikahan Dedi Herdianto & Rinda Dwi Mangesti:\nKehadiran: ${attendance}\nJumlah: ${count}\n\nMinggu Pon, 22 November 2026.\nTerima kasih.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });

  $$('.copy-account').forEach(button => button.addEventListener('click', async () => {
    const number = button.dataset.copy;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(number);
      else {
        const temp = document.createElement('textarea'); temp.value = number; temp.style.position = 'fixed'; temp.style.opacity = '0'; document.body.appendChild(temp); temp.select();
        const ok = document.execCommand('copy'); temp.remove(); if (!ok) throw new Error('copy failed');
      }
      $('#copyStatus').textContent = `Nomor rekening ${button.dataset.bank} berhasil disalin.`;
      showToast(`Nomor rekening ${button.dataset.bank} disalin`);
    } catch (_) { $('#copyStatus').textContent = `Nomor rekening: ${number}`; showToast('Salin manual nomor rekening yang tampil.'); }
  }));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    $$('.reveal').forEach(section => observer.observe(section));
  } else $$('.reveal').forEach(section => section.classList.add('visible'));

  window.addEventListener('load', () => setTimeout(() => $('#preloader').classList.add('done'), 350));
})();
