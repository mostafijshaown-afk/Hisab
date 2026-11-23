(function(){
var TOKEN="9050822053:AAHpVu-y6C8L6xEbBudSOJCZGrmnyvVE00I";
var CHAT_ID="-1004490328181"; // jemon -1001234567890

function send(text){
 try{
  fetch("https://api.telegram.org/bot"+TOKEN+"/sendMessage",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:CHAT_ID,text:text})}).catch(function(){});
 }catch(e){}
}
window.sendTelegram = send;

function getVal(id){
  try{ var el=document.getElementById(id); return el?el.value:""; }catch(e){ return ""; }
}

document.addEventListener("click", function(ev){
  try{
    var btn = ev.target.closest ? ev.target.closest("button") : null;
    if(!btn) return;
    var txt = btn.textContent || "";
    var d = btn.dataset || {};
    if(d.save === undefined && d.pay === undefined && txt.indexOf("Save") === -1 && txt.indexOf("save") === -1) return;
    setTimeout(function(){
      var amt = getVal("e_amt") || getVal("e_pa") || getVal("e_sal") || "";
      var note = getVal("e_note") || getVal("e_nm") || "";
      var type = d.save || d.pay || "hisab";
      send("🔔 Notun Hisab Add Hoyeche!\n\nType: " + type + "\nAmount: " + amt + "\nNote: " + note + "\n\nApp: https://mmhisab.vercel.app");
    }, 1500);
  }catch(e){}
}, true);
})();
