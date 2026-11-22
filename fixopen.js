(function(){
var _l=logV;
logV=function(){
 var h=_l();
 var a=allE().filter(function(e){return e.type==="opening"}).sort(function(x,y){return y.t-x.t});
 if(!a.length)return h;
 return '<div class="card"><b>শুরুর টাকার এন্ট্রি</b><div class="note">ভুল থাকলে মুছুন</div>'+a.map(function(e){
  return '<div class="row"><div><b>'+fmt(e.amt)+'</b> <span class="note">'+(e.acct==="bank"?"ব্যাংক":"ক্যাশ")+' · '+esc(e.date)+'</span></div><button class="s" data-xod="'+esc(e.id)+'" data-xu="'+esc(e.uid)+'">মুছুন</button></div>'}).join("")+'</div>'+h;
};
document.addEventListener("click",async function(ev){
 var el=ev.target.closest("button");if(!el||!el.dataset.xod)return;
 if(!confirm("এই শুরুর টাকার এন্ট্রি মুছবেন?"))return;
 await mutate(el.dataset.xu,function(x,lg){
  var o=x.entries.find(function(e){return e.id===el.dataset.xod});
  x.entries=x.entries.filter(function(e){return e.id!==el.dataset.xod});
  if(o)lg("del",o)});
});
})();
