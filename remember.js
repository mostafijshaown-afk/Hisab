(function(){
var KEY="x_login_t",LIMIT=60*60*1000;
function now(){return Date.now()}
function stamp(){try{localStorage.setItem(KEY,String(now()))}catch(e){}}
function stamped(){try{return +localStorage.getItem(KEY)||0}catch(e){return 0}}

function init(){
 if(typeof auth==="undefined"||!auth||typeof firebase==="undefined"){setTimeout(init,300);return}
 /* লগইন মনে রাখা চালু */
 try{auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(function(){})}catch(e){}
 auth.onAuthStateChanged(function(u){
  if(!u)return;
  var t=stamped();
  if(!t){stamp();return}
  if(now()-t>LIMIT){
   try{localStorage.removeItem(KEY)}catch(e){}
   auth.signOut().then(function(){location.reload()});
  }
 });
 /* ব্যবহার করলে সময় নতুন করে শুরু হয় না: শুধু লগইনের সময় থেকে ১ ঘণ্টা */
 setInterval(function(){
  var t=stamped();
  if(auth.currentUser&&t&&now()-t>LIMIT){
   try{localStorage.removeItem(KEY)}catch(e){}
   auth.signOut().then(function(){location.reload()});
  }
 },60000);
}
/* নতুন লগইন হলে সময় লেখা */
document.addEventListener("click",function(ev){
 var b=ev.target.closest("button");
 if(b&&b.id==="lgin2")setTimeout(function(){if(typeof auth!=="undefined"&&auth&&auth.currentUser)stamp()},3000);
});
init();
})();
