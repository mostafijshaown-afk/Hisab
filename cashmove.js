(function(){
var D=[],got=false,showAll=false;
var typ=function(){return typeof typing==="function"&&typing()};
function listen(){
 if(got||!db||!me||!isOwner())return;got=true;
 db.collection("deposits").onSnapshot(function(s){D=s.docs.map(function(d){return d.data()});if(!typ())render()},function(){});
}
function listCard(){
 var a=D.filter(function(d){return d.st==="done"}).sort(function(x,y){return (y.t||0)-(x.t||0)});
 if(!a.length)return "";
 var rows=(showAll?a:a.slice(0,5)).map(function(d){
  var take=d.kind==="take",amt=Math.abs(+d.amt||0);
  var dt=new Date(d.t||0).toLocaleString("bn-BD",{dateStyle:"short",timeStyle:"short"});
  var del=isMaster()?'<button class="s" data-xcdel="'+esc(d.id)+'" style="margin-top:4px">মুছুন</button>':'<button class="s" data-xcreq="'+esc(d.id)+'" style="margin-top:4px">মোছার অনুরোধ</button>';
  return '<div class="row"><div>'+(take?'⬇️ ':'⬆️ ')+esc(d.fromName||"")+' — '+(take?'ক্যাশ থেকে নিলেন':'ক্যাশে রাখলেন')+'<div class="note">'+dt+'</div>'+del+'</div><b>'+fmt(amt)+'</b></div>';
 }).join("");
 var more=a.length>5?'<button class="s" data-xcall="1" style="margin-top:6px">'+(showAll?"কম দেখুন":"সব দেখুন ("+a.length+")")+'</button>':'';
 return '<div class="card"><b>🔁 জমা ও নেওয়ার তালিকা</b>'+rows+more+'</div>';
}
var _d=dash;
dash=function(){
 var s=_d();
 if(!isOwner())return s;
 var m='<div class="card"><b>🤝 বাকির হিসাব</b>',i=s.indexOf(m);
 var add=listCard();
 if(i<0)return s+add;
 return s.slice(0,i)+add+s.slice(i);
};
function addBtns(){
 var card=Array.from(document.querySelectorAll(".card")).find(function(c){var b=c.querySelector("b");return b&&b.textContent.indexOf("টাকা কোথায়")>=0});
 if(!card||card.querySelector("[data-xctake]")||!myUser)return;
 var nm=(myUser.name||"")+"-এর হাতে";
 var rows=card.querySelectorAll(".row");
 for(var i=0;i<rows.length;i++){
  if(rows[i].textContent.indexOf(nm)>=0&&!rows[i].querySelector("[data-xctake]")){
   var d=rows[i].firstElementChild;
   var old=d.querySelector("[data-xdp]");
   if(old&&old.parentElement){
    var w=old.parentElement;
    w.style.cssText="display:flex;gap:6px;flex-wrap:nowrap;margin-top:4px";
    old.style.marginTop="0";
    old.textContent="⬆️ ক্যাশে রাখলাম";
    w.insertAdjacentHTML("beforeend",'<button class="s" data-xctake="1">⬇️ নিলাম</button>');
   }else{
    d.insertAdjacentHTML("beforeend",'<div style="margin-top:4px"><button class="s" data-xctake="1">⬇️ ক্যাশ থেকে নিলাম</button></div>');
   }
   return;
  }
 }
}
document.addEventListener("click",async function(ev){
 var el=ev.target.closest("button");if(!el)return;var d=el.dataset;
 if(d.xcall){showAll=!showAll;render();return}
 if(d.xctake){
  var v=prompt("দোকানের ক্যাশ থেকে কত টাকা নিলেন?");
  var a=parseFloat(v);
  if(!(a>0))return;
  var id="d"+Date.now().toString(36)+Math.random().toString(36).slice(2,4);
  try{await db.collection("deposits").doc(id).set({id:id,from:me,fromName:(myUser&&myUser.name)||"",to:me,amt:-a,kind:"take",date:today(),st:"done",by:me,at:Date.now(),t:Date.now()})}
  catch(e){toast=t("err");render()}
  return;
 }
 if(d.xcdel){
  if(!confirm("এই এন্ট্রি মুছবেন?"))return;
  try{await db.collection("deposits").doc(d.xcdel).delete()}catch(e){toast=t("err");render()}
  return;
 }
 if(d.xcreq){
  var r=prompt("কেন মুছতে চান? কারণ লিখুন");if(!r||!r.trim())return;
  try{await db.collection("deposits").doc(d.xcreq).update({delReq:true,delReason:r.trim().slice(0,100),delBy:(myUser&&myUser.name)||""});
   try{sendMail((myUser&&myUser.name)||"?","জমা মোছার অনুরোধ: "+r.trim())}catch(e){}
   alert("মূল মালিকের কাছে অনুরোধ গেছে")}catch(e){toast=t("err");render()}
 }
});
var _r=render;
render=function(){_r();listen();addBtns()};
})();
