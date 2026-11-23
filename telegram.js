(function(){
var URL="https://hisab-zeta-livid.vercel.app/api/notify";
function send(text){
 try{
  fetch(URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:text})}).catch(function(){});
 }catch(e){}
}
window.sendTelegram = send;

function getVal(id){
  try{
    var el = document.getElementById(id);
    return el ? el.value : "";
  }catch(e){ return ""; }
}

document.addEventListener("click", function(ev){
  try{
    var btn = ev.target.closest ? ev.target.closest("button") : null;
    if(!btn) return;
    var d = btn.dataset || {};
    // Save, Pay, Salary - jekono save type button
    if(d.save === undefined && d.pay === undefined && !d.sav && btn.textContent.indexOf("Save") === -1 && btn.textContent.indexOf("save") === -1){
      return;
    }
    // Save howar jonno 1.5 sec wait, tarpor pathao
    setTimeout(function(){
      var amt = getVal("e_amt") || getVal("e_pa") || getVal("e_sal") || "";
      var note = getVal("e_note") || getVal("e_nm") || "";
      var type = d.save || d.pay || "hisab";
      var msg = "🔔 Notun Hisab Add Hoyeche!\n\nType: " + type + "\nAmount: " + amt + "\nNote: " + note + "\n\nApp: https://mmhisab.vercel.app";
      send(msg);
    }, 1500);
  }catch(e){}
}, true);
})();
