(function(){
var NM=[],lastL="",gotN=false;
var typ=function(){return typeof typing==="function"&&typing()};

var _ev=empV;
empV=function(){var h=_ev();return h.replace(/<div class="card"><b>👀[\s\S]*?<\/div><\/div>/,"")};
var _rq=reqV;
reqV=function(){var h=_rq(),n=(myUser&&myUser.name)||"";
 if(n){var r=new RegExp('<div class="row"><span>'+esc(n).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+'</span><b>[^<]*</b></div>');h=h.replace(r,"")}
 return h};

function syncNames(){
 if(!db||!me||!myUser||myUser.status!=="approved")return;
 if(isOwner()){
  var a=[];allE().forEach(function(e){if(e.item){var k=e.item.trim();if(k&&a.indexOf(k)<0)a.push(k)}});
  a.sort();var s=JSON.stringify(a);
  if(a.length&&s!==lastL){lastL=s;db.collection("items").doc("names").set({list:a}).catch(function(){})}
 }else if(!gotN){gotN=true;
  db.collection("items").doc("names").onSnapshot(function(d){NM=(d.exists&&d.data().list)||[];if(!typ())render()},function(){})}
}
var _in=itemNames;
itemNames=function(){var a=_in();NM.forEach(function(x){if(a.indexOf(x)<0)a.push(x)});return a};

var _r=render;
render=function(){
 _r();
 var n=document.getElementById("nav");
 if(n)n.querySelectorAll('button[data-t="set"]').forEach(function(b){b.remove()});
 var h=document.querySelector("header"),ok=authed&&myUser&&myUser.status==="approved",g=document.getElementById("x_gear");
 if(h&&ok&&!g){
  g=document.createElement("button");g.id="x_gear";g.className="s";g.textContent="⚙️";g.dataset.t="set";
  g.style.cssText="font-size:20px;padding:4px 10px;margin-left:auto;margin-right:8px";
  h.insertBefore(g,document.getElementById("lg"));
 }else if(g&&!ok)g.remove();
 syncNames();
};
})();
