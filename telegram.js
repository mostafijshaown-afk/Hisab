(function(){
var URL="https://hisab-zeta-livid.vercel.app/api/notify";
function send(text){
 try{
  fetch(URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:text})}).catch(function(){});
 }catch(e){}
}
document.addEventListener("click", function(ev){
  try{
    var btn = ev.target.closest ? ev.target.closest("button") : null;
    if(!btn) return;
    var txt = btn.textContent || "";
    var d = btn.dataset || {};
    if(d.save === undefined && d.pay === undefined && txt.indexOf("Save") === -1) return;
    setTimeout(function(){ send("🔔 নতুন হিসাব যোগ হইছে! অ্যাপ খুলে দেখো"); }, 1500);
  }catch(e){}
}, true);
})();
