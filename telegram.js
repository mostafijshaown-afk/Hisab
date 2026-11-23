(function(){
var URL="https://hisab-zeta-livid.vercel.app/api/notify";
function send(text){
 try{
  fetch(URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:text})}).catch(function(){});
 }catch(e){}
}
var _s=sendMail;
sendMail=function(who,txt){
 try{_s(who,txt)}catch(e){}
 send("🔔 "+who+"\n"+txt+"\n\nঅ্যাপ: https://mmhisab.vercel.app");
};
})();
