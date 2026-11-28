var V="mm-v1";
var FILES=["/","/index.html","/config.js","/compat.js","/addon.js","/memo-fix.js","/extra.js","/extra2.js","/fixcash.js","/fixopen.js","/dues.js","/owner-hand.js","/cashmove.js","/stocktotal.js","/telegram.js","/remember.js","/lang.js"];

self.addEventListener("install",function(e){
 self.skipWaiting();
 e.waitUntil(caches.open(V).then(function(c){
  return Promise.all(FILES.map(function(f){return c.add(f).catch(function(){})}));
 }));
});

self.addEventListener("activate",function(e){
 e.waitUntil(caches.keys().then(function(ks){
  return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}));
 }).then(function(){return self.clients.claim()}));
});

self.addEventListener("fetch",function(e){
 var r=e.request;
 if(r.method!=="GET")return;
 var u=new URL(r.url);
 if(u.origin!==location.origin||u.pathname.indexOf("/api/")===0)return;
 /* আগে নেট থেকে নতুন কোড আনার চেষ্টা, না পারলে ফোনে জমানোটা */
 e.respondWith(
  fetch(r).then(function(res){
   var cp=res.clone();
   caches.open(V).then(function(c){c.put(r,cp)});
   return res;
  }).catch(function(){
   return caches.match(r).then(function(m){return m||caches.match("/index.html")});
  })
 );
});
