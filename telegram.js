(function(){
function send(text){
 try{
  fetch("/api/notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:text})}).catch(function(){});
 }catch(e){}
}
var last=0;
function tg(who,txt){
 var now=Date.now();
 if(now-last<3000)return;
 last=now;
 send("🔔 "+who+"\n"+txt+"\n\nঅ্যাপ: https://mmhisab.vercel.app");
}
function hook(){
 if(typeof notify!=="function"||typeof sendMail!=="function"){setTimeout(hook,500);return}
 var _n=notify;
 notify=function(next,b){
  try{
   var who=((books[me]||{}).name)||"?",m=[];
   next.log.slice((b.log||[]).length).forEach(function(l){
    var w=l.reason?" — কারণ: "+l.reason:"";
    m.push((l.a==="edit"?"বদলেছেন: "+bs(l.o)+" → "+bs(l.n):l.a==="del"?"মুছেছেন: "+bs(l.o):"যোগ করেছেন: "+bs(l.n))+w);
   });
   if(m.length)tg(who,m.join("\n"));
  }catch(e){}
  return _n(next,b);
 };
}
hook();
})();
