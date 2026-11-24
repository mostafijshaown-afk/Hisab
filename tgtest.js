(function(){
var b=document.createElement("button");
b.textContent="📨 টেলিগ্রাম টেস্ট";
b.style.cssText="position:fixed;left:8px;bottom:80px;z-index:9999;padding:8px 12px;background:#0f766e;color:#fff;border:0;border-radius:8px";
b.onclick=function(){
 fetch("/api/notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:"টেস্ট মেসেজ"})})
 .then(function(r){return r.text()}).then(function(t){alert("উত্তর: "+t)})
 .catch(function(e){alert("এরর: "+e)});
};
document.body.appendChild(b);
})();
