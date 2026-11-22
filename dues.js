(function(){
var open={g:false,o:false};
function rows(){
 var E=allE();
 return allP().map(function(p){
  return {p:p,b:balOf(E.filter(function(e){return e.party===p.id}))};
 });
}
function phoneOf(p){
 var d=String(p.phone||"").replace(/\D/g,"");
 if(!d)return "";
 if(d.indexOf("880")===0)return d;
 if(d.charAt(0)==="0")return "88"+d;
 return "880"+d;
}
function items(kind){
 var pos=kind==="g";
 return rows().filter(function(x){return pos?x.b>0:x.b<0})
  .sort(function(a,b){return Math.abs(b.b)-Math.abs(a.b)});
}
function block(kind,title,cls){
 var a=items(kind),sum=a.reduce(function(s,x){return s+Math.abs(x.b)},0),o=open[kind];
 var h='<div class="row"><button class="s" data-xdt="'+kind+'" style="text-align:left;flex:1">'+(o?"▲ ":"▼ ")+title+'</button><b class="'+cls+'">'+fmt(sum)+'</b></div>';
 if(!o)return h;
 if(!a.length)return h+'<div class="note" style="padding:6px 0">কেউ নেই</div>';
 return h+a.map(function(x){
  var p=x.p,amt=Math.abs(x.b),ph=phoneOf(p),msg="আসসালামু আলাইকুম, "+(kind==="g"?"আপনার কাছে আমার "+Math.round(amt)+" টাকা বাকি আছে। অনুগ্রহ করে পরিশোধ করবেন।":"আপনাকে "+Math.round(amt)+" টাকা দেওয়া বাকি আছে।");
  var links=ph?' <a href="tel:'+esc(p.phone)+'">📞</a> <a href="https://wa.me/'+ph+'?text='+encodeURIComponent(msg)+'" target="_blank">💬</a>':"";
  return '<div class="row" style="padding-left:10px"><div><button class="s" data-xled="'+esc(p.id)+'">'+esc(p.name)+'</button> <span class="tag">'+t("k_"+p.kind)+'</span>'+links+'</div><b class="'+cls+'">'+fmt(amt)+'</b></div>';
 }).join("");
}
function newCard(){
 return '<div class="card"><b>🤝 বাকির হিসাব</b>'
  +block("g","কাস্টমারদের কাছে পাবো","pos")
  +block("o","পাইকার/সাপ্লায়ারকে দেব","neg")+'</div>';
}
var _d=dash;
dash=function(){
 var s=_d();
 if(!isOwner())return s;
 var m='<div class="card"><b>🤝 বাকির হিসাব</b>',i=s.indexOf(m);
 if(i<0)return s;
 var e='</b></div>',j=s.indexOf(e,i);
 j=s.indexOf(e,j+1);
 if(j<0)return s;
 var end=j+e.length+'</div>'.length;
 return s.slice(0,i)+newCard()+s.slice(end);
};
document.addEventListener("click",function(ev){
 var el=ev.target.closest("button");if(!el)return;
 if(el.dataset.xdt){open[el.dataset.xdt]=!open[el.dataset.xdt];render();return}
 if(el.dataset.xled){tab="party";pSel=el.dataset.xled;render()}
});
})();
