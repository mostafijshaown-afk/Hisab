(function(){
var sumA=function(a){return a.reduce(function(s,e){return s+(+e.amt||0)},0)};
var D=[],H={},PR={},sd=false,lastBeat=0;
var typ=function(){return typeof typing==="function"&&typing()};
var rr=function(){if(!typ())render()};

var _r=render;
render=function(){
 if(tab==="ret")tab="dash";
 _r();
 var n=document.getElementById("nav");
 if(n)n.querySelectorAll('button[data-t="ret"]').forEach(function(b){b.remove()});
 beat();listen();
};

function listen(){
 if(sd||!db||!me||!isOwner())return;sd=true;
 db.collection("presence").onSnapshot(function(s){PR={};s.docs.forEach(function(d){PR[d.id]=d.data()});rr()},function(){});
 db.collection("deposits").onSnapshot(function(s){D=s.docs.map(function(d){return d.data()});rr()},function(){});
 db.collection("holds").onSnapshot(function(s){H={};s.docs.forEach(function(d){H[d.id]=+d.data().amt||0});rr()},function(){});
}
function beat(){
 if(!db||!me||!myUser||myUser.status!=="approved")return;
 if(Date.now()-lastBeat<60000)return;lastBeat=Date.now();
 db.collection("presence").doc(me).set({name:myUser.name||"",t:Date.now()}).catch(function(){});
}
setInterval(beat,60000);
document.addEventListener("visibilitychange",function(){if(!document.hidden){lastBeat=0;beat()}});

function empHand(u){
 return (+H[u]||0)+calc(allE().filter(function(e){return e.uid===u})).cash
  -sumA(D.filter(function(d){return d.from===u&&d.st==="done"}));
}
function shopCash(){
 return calc(allE().filter(function(e){return (S.uinfo[e.uid]||{}).role==="owner"})).cash
  +sumA(D.filter(function(d){return d.st==="done"}));
}
function stockInfo(){
 var ac=avgCost(),v=0,q=0;
 qtyTable(allE()).forEach(function(x){var r=x.b-x.s;
  if(r>0){q+=r;v+=r*(ac[x.n.trim().toLowerCase()]||0)}});
 return {v:v,q:q};
}
function summ(){
 var E=allE(),c=calc(E),dd=dues(),st=stockInfo(),P=profitOf(E);
 var emps=Object.keys(S.uinfo).filter(function(u){var x=S.uinfo[u];return x.role==="employee"&&x.status==="approved"});
 var eh=emps.map(function(u){return [S.uinfo[u].name||"",empHand(u)]});
 var et=eh.reduce(function(s,x){return s+(x[1]>0?x[1]:0)},0);
 var sc=shopCash();
 var td=today(),mo=td.slice(0,7);
 var tS=calc(E.filter(function(e){return e.date===td})).sales;
 var mE=E.filter(function(e){return (e.date||"").slice(0,7)===mo});
 var mS=calc(mE).sales,mP=profitOf(mE).profit;
 var R=function(l,v,cl,sub){return '<div class="row"><div>'+l+(sub?'<div class="note">'+sub+'</div>':'')+'</div><b class="'+(cl||"")+'">'+fmt(v)+'</b></div>'};
 var wealth=sc+c.bank+et+st.v+dd[0]-dd[1];
 return '<div class="card" style="background:var(--ac);color:#fff"><div style="font-size:13px;opacity:.9">ব্যবসার মোট সম্পদ (আনুমানিক)</div><div class="v">'+fmt(wealth)+'</div><div style="font-size:12px;opacity:.85">ক্যাশ + ব্যাংক + কর্মচারীর হাতে + মাল + পাওনা − দেনা</div></div>'
 +'<div class="card"><b>🛒 মাল</b>'
 +R("মোট কত টাকার মাল কেনা হলো",c.pur)
 +R("এখন কত টাকার মাল আছে",st.v,"","মোট "+st.q+" পিস (কেনা দামে)")
 +R("কত টাকার মাল বিক্রি হলো",c.sales)+'</div>'
 +'<div class="card"><b>💰 টাকা কোথায়</b>'
 +R("🟢 দোকানের ক্যাশে",sc)
 +R("🔵 ব্যাংকে",c.bank)
 +R("🟠 কর্মচারীদের কাছে বিক্রির টাকা বাকি (জমা দেয়নি)",et)
 +eh.filter(function(x){return x[1]!==0}).map(function(x){return '<div class="row"><span class="note">• '+esc(x[0])+'</span><b>'+fmt(x[1])+'</b></div>'}).join("")+'</div>'
 +'<div class="card"><b>🤝 বাকির হিসাব</b>'
 +R("কাস্টমারদের কাছে পাবো",dd[0],"pos")
 +R("পাইকার/সাপ্লায়ারকে দেব",dd[1],"neg")+'</div>'
 +'<div class="card"><b>📈 বিক্রি ও লাভ</b>'
 +R("আজকের বিক্রি",tS)
 +R("এই মাসের বিক্রি",mS)
 +R("এই মাসের লাভ (মালের দাম ও খরচ বাদে)",mP,mP>=0?"pos":"neg")
 +R("মোট লাভ এখন পর্যন্ত",P.profit,P.profit>=0?"pos":"neg")+'</div>';
}
var _d=dash;
dash=function(){
 if(!isOwner())return _d();
 var s=_d(),i=s.indexOf('<div class="card"><div class="k">'),j=s.indexOf('<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">');
 return (i>0?s.slice(0,i):"")+summ()+(j>0?s.slice(j):"");
};

function ago(t){var m=Math.floor((Date.now()-t)/60000);
 if(m<3)return "🟢 এখন অনলাইনে";if(m<60)return m+" মিনিট আগে";
 var h=Math.floor(m/60);if(h<24)return h+" ঘণ্টা আগে";return Math.floor(h/24)+" দিন আগে"}
function onl(ids){
 if(!ids.length)return "";
 return '<div class="card"><b>👀 কে কখন ছিল</b>'+ids.map(function(u){var p=PR[u];
  return '<div class="row"><span>'+esc(S.uinfo[u].name||"")+'</span><b>'+(p?ago(p.t):"কখনো ঢোকেনি")+'</b></div>'}).join("")+'</div>'}
var _rq=reqV;
reqV=function(){return onl(Object.keys(S.uinfo).filter(function(u){var x=S.uinfo[u];return x.status==="approved"&&x.role&&!x.deleted}))+_rq()};
var _ev=empV;
empV=function(){var h=_ev();if(empSel)return h;
 return onl(Object.keys(S.uinfo).filter(function(u){var x=S.uinfo[u];return x.role==="employee"&&x.status==="approved"}))+h};
setInterval(function(){if(isOwner()&&(tab==="req"||tab==="emp"))rr()},60000);
})();
