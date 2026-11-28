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
 var R=function(l,v,s){return '<div class="row"><div>'+l+(s?'<div class="note">'+s+'</div>':'')+'</div><b>'+v+'</b></div>'};
 return '<div class="card"><b>📦 স্টকের মোট</b>'
  +R("সব মিলিয়ে কত পিস মাল আছে",pcs+" পিস")
  +R("কেনা দামে কত টাকার মাল আছে",fmt(cost))
  +R("বিক্রি দামে কত টাকার মাল আছে",fmt(sell),"গড় বিক্রি দাম ধরে। যে মাল এখনও বিক্রিই হয়নি, তার দাম ধরা হয়নি")
  +'</div>';
}
var _s=stockV;
stockV=function(){return card()+_s()};
})();
