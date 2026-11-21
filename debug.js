window.addEventListener("error",function(e){
 var d=document.getElementById("dbg");
 if(!d){d=document.createElement("div");d.id="dbg";d.style.cssText="position:fixed;top:0;left:0;right:0;z-index:9999;background:#b00;color:#fff;font-size:12px;padding:6px;max-height:40vh;overflow:auto";document.body.appendChild(d)}
 d.textContent+="\n"+e.message+" ("+(e.filename||"").split("/").pop()+":"+e.lineno+")";
});
