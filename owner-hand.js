(function(){
var CUT="2026-11-23";
var D=[],H={},got=false;
var sumA=function(a){return a.reduce(function(s,e){return s+(+e.amt||0)},0)};
var typ=function(){return typeof typing==="function"&&typing()};
function listen(){
 if(got||!db||!me||!isOwner())return;got=true;
 db.collection("deposits").onSnapshot(function(s){D=s.docs.map(function(d){return d.data()});if(!typ())render()},function(){});
 db.collection("holds").onSnapshot(function(s){H={};s.docs.forEach(function(d){H[d.id]=+d.data().amt||0});if(!typ())render()},function(){});
}
function cashOf(u){return calc(allE().filter(function(e){return e.uid===u})).cash}
function newOf(u){return calc(allE().filter(function(e){return e.uid===u&&(e.date||"")>CUT})).cash}
function depDone(u){return sumA(D.filter(function(d){return d.from===u&&d.st==="done"}))}
function isMain(u){return ((S.uinfo[u]||{}).name||"").trim().toUpperCase()==="MOSTAFIJ"}
function handOf(u,x){
 var v;
 if(x.role==="owner"){v=isMain(u)?newOf(u):cashOf(u)}
 else v=(+H[u]||0)+cashOf(u);
 v-=depDone(u);
 return Math.round(v);
}
function card(){
 var E=allE();
 var R=function(ic,l,v,sub,btn){return '<div class="row"><div>'+ic+' '+l+(sub?'<div class="note">'+sub+'</div>':'')+(btn||'')+'</div><b>'+fmt(v)+'</b></div>'};
 var shop=sumA(D.filter(function(d){return d.st==="done"}));
 Object.keys(S.uinfo).forEach(function(u){
  var x=S.uinfo[u];
  if(x.status==="approved"&&!x.deleted&&x.role==="owner"&&isMain(u))shop+=cashOf(u)-newOf(u);
 });
 shop=Math.round(shop);
 var bank=calc(E).bank,total=shop+bank,out="";
 Object.keys(S.uinfo).forEach(function(u){
  var x=S.uinfo[u];
  if(x.status!=="approved"||x.deleted||!x.role)return;
  var v=handOf(u,x);
  if(v===0)return;
  total+=v;
  var btn=(u===me&&v>0)?'<div><button class="s" data-xdp="1" data-amt="'+v+'" style="margin-top:4px">দোকানের ক্যাশে রাখলাম</button></div>':'';
  out+=R(x.role==="owner"?"👤":"🟠",esc(x.name||"")+"-এর হাতে",v,x.role==="employee"&&v>0?"জমা বাকি":"",btn);
 });
 return '<div class="card"><b>💰 টাকা কোথায়</b>'
  +R("🟢","দোকানের ক্যাশ",shop)
  +R("🔵","ব্যাংকে",bank)
  +out
  +'<div class="row"><b>সব মিলিয়ে</b><b>'+fmt(total)+'</b></div>'
  +'<div class="note">যার হাতে টাকা নেই, তার নাম এখানে আসে না।</div></div>';
}
document.addEventListener("click",async function(ev){
 var el=ev.target.closest("button");if(!el||!el.dataset.xdp)return;
 var a=parseFloat(el.dataset.amt);if(!(a>0))return;
 if(!confirm("৳"+Math.round(a)+" দোকানের ক্যাশে রাখলেন?"))return;
 var id="d"+Date.now().toString(36)+Math.random().toString(36).slice(2,4);
 try{await db.collection("deposits").doc(id).set({id:id,from:me,fromName:(myUser&&myUser.name)||"",to:me,amt:a,date:today(),st:"done",by:me,at:Date.now(),t:Date.now()})}
 catch(e){toast=t("err");render()}
});
var _d=dash;
dash=function(){
 var s=_d();
 if(!isOwner())return s;
 var a=s.indexOf('<div class="card"><b>💰 টাকা কোথায়</b>');
 var b=s.indexOf('<div class="card"><b>🤝 বাকির হিসাব</b>');
 if(a<0||b<0||b<a)return s;
 return s.slice(0,a)+card()+s.slice(b);
};
var _r=render;
render=function(){_r();listen()};
})();
