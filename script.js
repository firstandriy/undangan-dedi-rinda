(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const toast = (message) => {
    const el = $('#toast'); if (!el) return;
    el.textContent = message; el.classList.add('show');
    clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2300);
  };

  // Guest name from URL: ?to=Nama%20Tamu
  const params = new URLSearchParams(location.search);
  const guest = params.get('to');
  if (guest && $('#guestName')) $('#guestName').textContent = guest.replace(/[<>]/g, '').slice(0, 90);

  // Open invitation and start music after a real tap (browser autoplay rules).
  const main = $('#mainContent'), music = $('#bgMusic'), musicToggle = $('#musicToggle');
  $('#openInvitation')?.addEventListener('click', async () => {
    main?.classList.remove('locked'); main?.classList.add('open');
    $('#intro')?.scrollIntoView({behavior:'smooth', block:'start'});
    if (music) { try { await music.play(); musicToggle?.classList.add('playing'); $('#musicText').textContent='MUSIK MENYALA'; } catch (_) { toast('Undangan dibuka. Tekan tombol musik untuk memutar lagu.'); } }
    setTimeout(() => $('.intro')?.scrollIntoView({behavior:'smooth', block:'start'}), 100);
  });
  musicToggle?.addEventListener('click', async () => {
    if (!music) return;
    try {
      if (music.paused) { await music.play(); musicToggle.classList.add('playing'); $('#musicText').textContent='MUSIK MENYALA'; }
      else { music.pause(); musicToggle.classList.remove('playing'); $('#musicText').textContent='PUTAR MUSIK'; }
    } catch (_) { toast('Pastikan file musik-baru.mp3 ada di folder utama.'); }
  });

  // Countdown
  const weddingDate = new Date('2026-11-22T08:00:00+07:00').getTime();
  function updateCountdown() {
    let diff = Math.max(0, weddingDate - Date.now());
    const day = Math.floor(diff / 86400000); diff %= 86400000;
    const hour = Math.floor(diff / 3600000); diff %= 3600000;
    const min = Math.floor(diff / 60000); diff %= 60000;
    const sec = Math.floor(diff / 1000);
    [['#days',day],['#hours',hour],['#minutes',min],['#seconds',sec]].forEach(([sel,val]) => { const el=$(sel); if(el) el.textContent=String(val).padStart(2,'0'); });
  }
  updateCountdown(); setInterval(updateCountdown, 1000);

  // Gallery photos: foto-galeri-3.jpg is also the countdown background.
  const gallery = $('#galleryGrid');
  if (gallery) {
    for (let n=1; n<=11; n++) {
      const button=document.createElement('button'); button.className='gallery-item'; button.type='button'; button.setAttribute('aria-label',`Lihat foto galeri ${n}`);
      const img=document.createElement('img'); img.src=`foto-galeri-${n}.jpg`; img.alt=`Momen Dedi dan Rinda ${n}`; img.loading='lazy'; img.decoding='async';
      img.onerror=()=>{button.style.display='none';}; button.appendChild(img);
      button.addEventListener('click',()=>{ const viewer=document.createElement('div'); viewer.className='photo-viewer'; viewer.style.cssText='position:fixed;inset:0;z-index:120;background:#000e;display:grid;place-items:center;padding:20px;'; const big=document.createElement('img'); big.src=img.src; big.alt=img.alt; big.style.cssText='max-width:100%;max-height:88vh;object-fit:contain;border:1px solid #c9a45b;padding:5px;background:#111;'; viewer.appendChild(big); viewer.addEventListener('click',()=>viewer.remove()); viewer.addEventListener('keydown',e=>{if(e.key==='Escape')viewer.remove();}); document.body.appendChild(viewer); });
      gallery.appendChild(button);
    }
  }

  // Auto-moving photo album. Pause while the guest touches or hovers the gallery.
  if (gallery) {
    let galleryPaused = false;
    gallery.addEventListener('pointerenter', () => { galleryPaused = true; });
    gallery.addEventListener('pointerleave', () => { galleryPaused = false; });
    gallery.addEventListener('touchstart', () => { galleryPaused = true; }, {passive:true});
    gallery.addEventListener('touchend', () => { window.setTimeout(() => { galleryPaused = false; }, 1800); }, {passive:true});
    window.setInterval(() => {
      if (galleryPaused || document.hidden || gallery.scrollWidth <= gallery.clientWidth) return;
      const maxScroll = gallery.scrollWidth - gallery.clientWidth;
      if (gallery.scrollLeft >= maxScroll - 4) gallery.scrollTo({left:0,behavior:'smooth'});
      else { const first = gallery.querySelector('.gallery-item'); const gap = parseFloat(getComputedStyle(gallery).columnGap) || 12; gallery.scrollBy({left:(first ? first.getBoundingClientRect().width : 180)+gap,behavior:'smooth'}); }
    }, 3200);
  }

  // Copy account number/address
  $$('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const value=button.getAttribute('data-copy') || '';
    try { await navigator.clipboard.writeText(value); toast('Berhasil disalin'); }
    catch (_) { const input=document.createElement('textarea'); input.value=value; input.style.position='fixed'; input.style.opacity='0'; document.body.appendChild(input); input.select(); try { document.execCommand('copy'); toast('Berhasil disalin'); } catch (e) { toast(value); } input.remove(); }
  }));

  // Shared wedding wishes via Google Apps Script + Google Sheets.
  
const wishesApi = 'https://script.google.com/macros/s/AKfycbzLnElAvJ74sjHFcLQMYx9I67pzdGuYJtuANELMjEGu5qSZM41Pe6mSDfyKzfBqTYKVZw/exec';
  const storageKey='dediRindaLuxuryWishesV2';
  let sharedWishes=[];
  function readLocalWishes(){try{return JSON.parse(localStorage.getItem(storageKey)||'[]')}catch(_){return []}}
  function renderWishes(){
    const list=$('#wishList'); if(!list)return;
    list.replaceChildren();
    const all=[...sharedWishes, ...readLocalWishes()];
    const seen=new Set();
    all.reverse().filter(item=>{const key=[item.name,item.message].join('\u0000');if(seen.has(key))return false;seen.add(key);return true;}).slice(0,8).forEach(item=>{
      const card=document.createElement('article');card.className='wish-item';
      const name=document.createElement('strong');name.textContent=item.name||'Tamu';
      const status=document.createElement('span');status.textContent=item.status||item.kehadiran||'';
      const msg=document.createElement('p');msg.textContent=item.message||item.ucapan||'';
      card.append(name,status,msg);list.append(card);
    });
  }
  function loadSharedWishes(){
    const callbackName='__dediRindaWishesCallback';
    window[callbackName]=(data)=>{
      if(data && data.berhasil && Array.isArray(data.ucapan)){
        sharedWishes=data.ucapan.map(item=>({name:item.nama,status:item.kehadiran,message:item.ucapan,waktu:item.waktu}));
        renderWishes();
      }
      const old=document.getElementById('wishes-api-script');if(old)old.remove();
      try{delete window[callbackName];}catch(_){window[callbackName]=undefined;}
    };
    const old=document.getElementById('wishes-api-script');if(old)old.remove();
    const script=document.createElement('script');script.id='wishes-api-script';
    script.src=wishesApi+'?callback='+callbackName+'&t='+Date.now();
    script.onerror=()=>{script.remove();};
    document.head.appendChild(script);
  }
  $('#wishForm')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const name=$('#wishName').value.trim();
    const selectedStatus=$('#wishStatus').value;
    const message=$('#wishMessage').value.trim();
    if(!name||!message)return;
    const status=selectedStatus==='Insyaallah hadir'?'Hadir':(selectedStatus==='Maaf, belum bisa hadir'?'Tidak Hadir':selectedStatus);
    const button=e.target.querySelector('button[type="submit"]');
    if(button)button.disabled=true;
    try{
      // text/plain is a simple cross-origin request; Apps Script receives JSON in postData.contents.
      await fetch(wishesApi,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({nama:name,kehadiran:status,ucapan:message})});
      e.target.reset();
      toast('Ucapan dikirim. Memperbarui daftar...');
      setTimeout(loadSharedWishes,1800);
    }catch(_){
      const local=readLocalWishes();local.push({name,status:selectedStatus,message,date:new Date().toISOString()});
      try{localStorage.setItem(storageKey,JSON.stringify(local.slice(-60)));renderWishes();toast('Koneksi gagal; ucapan disimpan sementara di perangkat ini.');}catch(__){toast('Gagal mengirim ucapan. Coba lagi.');}
    }finally{if(button)button.disabled=false;}
  });
  loadSharedWishes();
  renderWishes();

  // Light gold dust + petals: capped particles, no canvas or animation library.
  const particleLayer=$('#particles');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPower=window.matchMedia('(max-width: 600px)').matches;
  if(particleLayer && !reduced){
    const max=lowPower?10:17;
    function addParticle(){
      if(document.hidden || !particleLayer.isConnected)return;
      if(particleLayer.childElementCount>=max)return;
      const p=document.createElement('span'); const petal=Math.random()>.55;
      p.className='particle '+(petal?'petal':'dot'); p.style.left=(Math.random()*100)+'vw'; p.style.animationDuration=(lowPower?8+Math.random()*6:7+Math.random()*7)+'s'; p.style.setProperty('--drift',((Math.random()-.5)*(lowPower?90:160))+'px');
      if(!petal){const size=2+Math.random()*2;p.style.width=size+'px';p.style.height=size+'px';}
      particleLayer.appendChild(p); p.addEventListener('animationend',()=>p.remove(),{once:true});
    }
    for(let i=0;i<(lowPower?5:9);i++)setTimeout(addParticle,i*500);
    setInterval(addParticle,lowPower?1700:1100);
  }
  // Scroll reveal + slim progress indicator
  const reveals=$$('.reveal');
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});reveals.forEach(el=>observer.observe(el));}
  else reveals.forEach(el=>el.classList.add('visible'));
  const line=$('#scrollLine');
  function progress(){const max=document.documentElement.scrollHeight-window.innerHeight;const amount=max>0?(window.scrollY/max)*100:0;if(line)line.style.width=amount+'%';}
  window.addEventListener('scroll',progress,{passive:true});progress();
})();
