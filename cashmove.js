(function(){
var D=[],got=false;
var typ=function(){return typeof typing==="function"&&typing()};
function listen(){
 if(got||!db||!me||!isOwner())return;got=true;
 db.collection("deposits").onSnapshot(function(s){D=s.docs.map(function(d){return d.data()});if(!typ())render()},function(){});
}
var showAll=false;

/* জমা/নেওয়ার তালিকা কার্ড */
function listCard(){
 var a=D.filter(function(d){return d.st==="done"}).sort(function(x,y){return (y.t||0)-(x.t||0)});
 if(!a.length)return "";
 var rows=(showAll?a:a.slice(0,5)).map(function(d){
  var take=d.kind==="take";
  var nm=esc(d.fromName||"");
  var dt=new Date(d.t||0).toLocaleString("bn-BD",{dateStyle:"short",timeStyle:"short"});
  var del=isMaster()?'<button class="s" data-xcdel="'+esc(d.id)+'" style="margin-top:4px">মুছুন</button>':'<button class="s" data-xcreq="'+esc(d.id)+'" style="margin-top:4px">মোছার অনুরোধ</button>';
  return '<div class="row"><div>'+(take?'⬇️ ':'⬆️ ')+nm+' — '+(take?'ক্যাশ থেকে নিলেন':'ক্যাশে রাখলেন')+'<div class="note">'+dt+'</div>'+del+'</div><b>'+fmt(d.amt)+'</b></div>';
 }).join("");
 var more=a.length>5?'<button class="s" data-xcall="1" style="margin-top:6px">'+(showAll?"কম দেখুন":"সব দেখুন ("+a.length+")")+'</button>':'';
 return '<div class="card"><b>🔁 জমা ও নেওয়ার তালিকা</b>'+rows+more+'</div>';
}

/* ক্যাশ থেকে নিলাম বোতাম */
function takeCard(){
 return '<div class="card"><b>⬇️ দোকানের ক্যাশ থেকে নিলাম</b><div class="note">নিলে দোকানের ক্যাশ কমবে, আপনার হাতে যোগ হবে</div><input id="xc_a" type="number" inputmode="decimal" min="0" placeholder="কত টাকা"><button class="p" data-xctake="1">ক্যাশ থেকে নিলাম</button></div>';
}

var _d=dash;
dash=function(){
 var s=_d();
 if(!isOwner())return s;
 var m='<div class="card"><b>🤝 বাকির হিসাব</b>',i=s.indexOf(m);
 var add=takeCard()+listCard();
 if(i<0)return s+add;
 return s.slice(0,i)+add+s.slice(i);
};

document.addEventListener("click",async function(ev){
 var el=ev.target.closest("button");if(!el)return;var d=el.dataset;
 if(d.xcall){showAll=!showAll;render();return}
 if(d.xctake){
  var a=parseFloat((document.getElementById("xc_a")||{}).value);
  if(!(a>0)){alert("টাকার পরিমাণ লিখুন");return}
  if(!confirm("৳"+Math.round(a)+" দোকানের ক্যাশ থেকে নিলেন?"))return;
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
render=function(){_r();listen()};
})();
