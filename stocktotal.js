(function(){
function card(){
 var ac=avgCost(),E=allE(),sp={},sq={};
 E.forEach(function(e){if(!isS(e.type)||!e.item)return;var k=e.item.trim().toLowerCase();sp[k]=(sp[k]||0)+(+e.amt||0);sq[k]=(sq[k]||0)+(+e.qty||0)});
 var pcs=0,cost=0,sell=0;
 qtyTable(E).forEach(function(x){
  var r=x.b-x.s;if(r<=0)return;
  var k=x.n.trim().toLowerCase();
  pcs+=r;cost+=r*(ac[k]||0);
  if(sq[k]>0)sell+=r*(sp[k]/sq[k]);
 });
 return '<div class="card"><b>📦 স্টকের মোট</b>'
  +'<div style="margin-top:6px;font-size:15px;font-weight:700;line-height:1.7">📦 '+pcs+' পিস · 🛒 কেনা '+fmt(cost)+' · 🟢 বিক্রি '+fmt(sell)+'</div>'
  +'<div class="note" style="margin-top:4px">কেনা = কেনা দামে মালের দাম। বিক্রি = গড় বিক্রি দামে মালের দাম (যে মাল এখনও বিক্রি হয়নি, তার দাম ধরা হয়নি)।</div>'
  +'</div>';
}
var _s=stockV;
stockV=function(){return card()+_s()};
})();
