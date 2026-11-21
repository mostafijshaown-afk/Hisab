(function(){
const $=i=>document.getElementById(i);
setInterval(()=>{
 const m=$("x_memo");if(!m||$("x_im"))return;
 const bar=m.querySelector(".x_np");if(!bar)return;
 const b=document.createElement("button");b.className="p";b.id="x_im";
 b.style.cssText="flex:1 1 100%";b.textContent="📷 ছবি হিসেবে সেভ / শেয়ার";
 bar.style.flexWrap="wrap";bar.insertBefore(b,bar.firstChild);
 b.onclick=async()=>{
  b.textContent="…";
  try{
   if(!window.html2canvas){await new Promise((res,rej)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
   const c=await html2canvas(m.firstElementChild,{backgroundColor:"#fff",scale:2});
   const bl=await new Promise(r=>c.toBlob(r,"image/png"));
   const fl=new File([bl],"memo.png",{type:"image/png"});
   if(navigator.canShare&&navigator.canShare({files:[fl]})){await navigator.share({files:[fl],title:"মেমো"})}
   else{const a=document.createElement("a");a.href=URL.createObjectURL(bl);a.download="memo.png";a.click()}
  }catch(er){alert("ছবি বানানো যায়নি। স্ক্রিনশট নিয়ে নিন।")}
  b.textContent="📷 ছবি হিসেবে সেভ / শেয়ার"
 }
},500);
})();
