(function(){
var URL="https://hisab-zeta-livid.vercel.app/api/notify";
function send(text){
 try{
  fetch(URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:text})}).catch(function(){});
 }catch(e){}
}
window.sendTelegram = send;

function wrap(){
  if(typeof window.sendMail === "function" && !window.sendMail.__tgWrapped){
    var _s = window.sendMail;
    var wrapped = function(who, txt){
      try{ _s(who, txt); }catch(e){}
      send("🔔 " + who + "\n" + txt + "\n\nঅ্যাপ: https://mmhisab.vercel.app");
    };
    wrapped.__tgWrapped = true;
    window.sendMail = wrapped;
    return true;
  }
  return false;
}
if(!wrap()){
  var tries = 0;
  var timer = setInterval(function(){
    tries++;
    if(wrap() || tries > 50){
      clearInterval(timer);
    }
  }, 200);
}
})();
