// KONFIGURASI: ganti nomor WhatsApp (format internasional tanpa +) dan detail rekening sebelum undangan dipublikasikan.
const CONFIG = { whatsappNumber: "6281234567890", weddingDate: "2026-11-22T08:00:00+07:00" };
const params = new URLSearchParams(location.search);
const guest = params.get("to");
if (guest) document.getElementById("guest").textContent = guest.replace(/\+/g," ");
function updateCountdown(){
 const diff = new Date(CONFIG.weddingDate).getTime()-Date.now();
 const safe = Math.max(0,diff);
 document.getElementById("days").textContent=Math.floor(safe/86400000);
 document.getElementById("hours").textContent=String(Math.floor(safe/3600000)%24).padStart(2,"0");
 document.getElementById("minutes").textContent=String(Math.floor(safe/60000)%60).padStart(2,"0");
 document.getElementById("seconds").textContent=String(Math.floor(safe/1000)%60).padStart(2,"0");
}
updateCountdown();setInterval(updateCountdown,1000);
document.getElementById("calendarBtn").addEventListener("click",()=>{
 const start="20261122T010000Z",end="20261122T080000Z";
 const url=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Pernikahan Dedi & Rinda")}&dates=${start}/${end}&details=${encodeURIComponent("Akad nikah dan resepsi Dedi & Rinda")}&location=${encodeURIComponent("Bangunrejo")}`;
 window.open(url,"_blank","noopener");
});
document.getElementById("rsvpForm").addEventListener("submit",e=>{
 e.preventDefault();
 const name=document.getElementById("name").value.trim();
 const attendance=document.getElementById("attendance").value;
 const guests=document.getElementById("guests").value;
 const message=document.getElementById("message").value.trim();
 const text=`Assalamu'alaikum, saya ${name}. Konfirmasi: ${attendance}. Jumlah tamu: ${guests}. Ucapan & doa: ${message||"-"}`;
 if(CONFIG.whatsappNumber==="6281234567890") alert("Ganti nomor WhatsApp contoh pada CONFIG di file index.html dengan nomor keluarga yang benar sebelum digunakan.");
 window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`,"_blank","noopener");
});
document.querySelectorAll(".copy").forEach(b=>b.addEventListener("click",async()=>{
 try{await navigator.clipboard.writeText(b.dataset.copy);b.textContent="Tersalin ✓";setTimeout(()=>b.textContent="Salin Nomor",1500)}catch(e){prompt("Salin nomor rekening:",b.dataset.copy)}
}));
document.getElementById("copyAll").addEventListener("click",async()=>{
 const t="BCA: 123456789012 a.n. Dedi Herdianto\nBRI: 987654321098 a.n. Rinda Dwi Mangesti";
 try{await navigator.clipboard.writeText(t);alert("Informasi rekening contoh tersalin. Pastikan ganti data sebelum publikasi.")}catch(e){prompt("Salin informasi rekening:",t)}
});
document.getElementById("videoInfo").addEventListener("click",()=>{const n=document.getElementById("videoNote");n.hidden=!n.hidden});
const modal=document.getElementById("modal"),modalImg=document.getElementById("modalImg");
document.querySelectorAll(".gallery img").forEach(img=>img.addEventListener("click",()=>{modalImg.src=img.src;modal.classList.add("show")}));
modal.addEventListener("click",e=>{if(e.target===modal||e.target.classList.contains("close"))modal.classList.remove("show")});
// Musik tidak disertakan karena hak cipta. Isi src audio dengan file musik berizin milik Anda.
const music=document.getElementById("music"),musicBtn=document.getElementById("musicBtn");
musicBtn.addEventListener("click",async()=>{
 if(!music.src){alert("Tambahkan file musik berizin lalu isi atribut src pada elemen audio di index.html.");return}
 if(music.paused){try{await music.play();musicBtn.textContent="Ⅱ"}catch(e){alert("Musik belum dapat diputar.")}}else{music.pause();musicBtn.textContent="♫"}
});
