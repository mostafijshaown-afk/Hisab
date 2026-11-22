(function(){
var _c=calc;
calc=function(list){
 var r=_c(list);
 list.forEach(function(e){
  if(e.type==="opening"){
   var a=+e.amt||0;
   if(e.acct==="bank")r.bank+=a;else r.cash+=a;
  }
 });
 return r;
};
})();
