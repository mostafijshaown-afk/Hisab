(function(){
var D=[],H={},got=false;
var sumA=function(a){return a.reduce(function(s,e){return s+(+e.amt||0)},0)};
var typ=function(){return typeof typing==="function"&&typing()};
function listen(){
 if(got||!db||!me||!isOwner())return;got=true;
 db.collection("deposits").onSnapshot(function(s){D=s.docs.map(function(d){return d.data()});if(!typ())render()},function(){});
 db.collection("holds").onSnapshot(function(s){H={};s.docs.forEach(function(d){H[d.id]=+d.data().amt||0});if(!typ())render()},function(){});
}
function cashOf(u){return calc(allE().filter(function(e){return e.uid===u})).cash}
function card(){
 var E=allE();
 var depDone=function(u){return sumA(D.filter(function(d){return d.from===u&&d.st==="done"}))};
 var R=function(ic,l,v,sub){return '<div class="row"><div>'+ic+' '+l+(sub?'<div class="note">'+sub+'</div>':'')+'</div><b>'+fmt(v)+'</b></div>'};
 var mine=Math.max(0,Math.round(+H[me]||0));
 var shop=sumA(D.filter(function(d){return d.st==="done"}))+cashOf(me)-mine;
 var bank=calc(E).bank,total=shop+bank,out="";
 Object.keys(S.uinfo).forEach(function(u){
  var x=S.uinfo[u];
  if(x.status!=="approved"||x.deleted||!x.role)return;
  var v=(u===me)?Math.round(+H[me]||0):(+H[u]||0)+cashOf(u);
  if(x.role==="employee")v-=depDone(u);
  v=Math.round(v);
  if(v===0)return;
  total+=v;
  out+=R(x.role==="owner"?"👤":"🟠",esc(x.name||"")+"-এর হাতে",v,x.role==="employee"&&v>0?"জমা বাকি":"");
 });
 return '<div class="card"><b>💰 টাকা কোথায়</b>'
  +R("🟢","দোকানের ক্যাশ",shop)
  +R("🔵","ব্যাংকে",bank)
  +out
  +'<div class="row"><b>সব মিলিয়ে</b><b>'+fmt(total)+'</b></div>'
  +'<div class="note">যার হাতে টাকা নেই, তার নাম এখানে আসে না।</div></div>';
}
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
