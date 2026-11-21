/* addon.js — নতুন ৫টি ফিচার। index.html-এর </body>-এর ঠিক আগে: <script src="addon.js"></script> */
(function(){
/* ===== মেমোর ডিফল্ট তথ্য — আসল তথ্য অ্যাপের সেটিংস → "মেমোর তথ্য" থেকে বদলানো যায় ===== */
const MEMO={shop:"Clothing Faster Business",addr:"",phones:["MOSTAFIJ: 01XXXXXXXXX","মাসুদ পারভেজ: 01XXXXXXXXX"]};
const X={dep:[],holds:{},rec:[],own:[],on:false,sel:"cash",dto:"",rcd:null,pp:"",dpa:"",oa:""};
const $=i=>document.getElementById(i),v=i=>($(i)||{}).value||"";
const sum=a=>a.reduce((s,e)=>s+(+e.amt||0),0);
const roleOf=u=>u===me?(myUser||{}).role:(S.uinfo[u]||{}).role;
const nameOf=u=>u===me?(myUser||{}).name:((S.uinfo[u]||{}).name||"");
const row=(l,a,tag)=>`<div class="row"><span>${l}${tag?` <span class="tag" style="background:#fde68a;color:#7a5200">${tag}</span>`:""}</span><b>${fmt(a)}</b></div>`;
const people=()=>Object.entries(S.uinfo).filter(([u,x])=>x.status==="approved"&&!x.deleted&&(x.role==="owner"||x.role==="employee"));
const ownerList=()=>X.own.filter(o=>o.status==="approved");

/* ---- হিসাব ---- */
function hand(u){const op=+X.holds[u]||0;if(roleOf(u)!=="employee")return op;
 return op+calc(allE().filter(e=>e.uid===u)).cash-sum(X.dep.filter(d=>d.from===u&&d.st==="done"))}
function shop(){return calc(allE().filter(e=>roleOf(e.uid)==="owner")).cash+sum(X.dep.filter(d=>d.st==="done"))}
const bank=()=>calc(allE()).bank;

/* ---- জমার অনুরোধ কার্ড (মালিকের জন্য) ---- */
function pend(){if(!isOwner())return"";
 return X.dep.filter(d=>d.st==="pending"&&(isMaster()||d.to===me)).sort((a,b)=>a.t-b.t).map(d=>`<div class="card" style="border-color:var(--am)"><b>জমার অনুরোধ</b><div>${esc(d.fromName)} বলছেন ${fmt(d.amt)} দিয়েছেন${d.to!==me?" ("+esc(nameOf(d.to))+"-কে)":""}</div><div style="display:flex;gap:8px;margin-top:8px"><button class="g" style="flex:1" data-xacc="${esc(d.id)}">নিলাম</button><button style="flex:1" data-xrej="${esc(d.id)}">পাইনি</button></div></div>`).join("")}

/* ---- ৩) টাকা কোথায় (শুধু মূল মালিক) ---- */
function holdV(){const P=people(),sh=shop(),bk=bank(),hs=P.map(([u,x])=>[u,x,hand(u)]),tot=sh+bk+hs.reduce((s,h)=>s+h[2],0);
 const ch=[["cash","দোকানের ক্যাশ"],["bank","ব্যাংক"],...P.map(([u,x])=>[u,x.name])];
 return pend()+`<div class="card" style="background:var(--ac);color:#fff"><div style="font-size:13px;opacity:.9">সব মিলিয়ে মোট টাকা</div><div class="v">${fmt(tot)}</div></div>
 <div class="card"><b>টাকা কোথায় আছে</b>${row("🟢 দোকানের ক্যাশ",sh)}${row("🔵 ব্যাংক",bk)}${hs.filter(h=>h[2]!==0||h[1].role==="employee").map(h=>row("🟠 "+esc(h[1].name)+"-এর হাতে",h[2],h[1].role==="employee"&&h[2]>0?"জমা বাকি":"")).join("")}</div>
 <div class="card"><b>শুরুর টাকা লিখুন</b><div class="note">কার কাছে আগে থেকে কত টাকা ছিল। কারো হাতের টাকা: যা লিখবেন সেটাই হবে।</div><label>কোথায় ছিল</label>
 <div style="display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px">${ch.map(([k,l])=>`<button class="s" data-xchip="${esc(k)}" style="${X.sel===k?'background:var(--ac);color:#fff;border-color:var(--ac)':''}">${esc(l)}</button>`).join("")}</div>
 <label>টাকা</label><input id="x_oa" type="number" inputmode="decimal" min="0" value="${esc(X.oa)}"><button class="p" data-xosv="1">সংরক্ষণ</button></div>`}

/* ---- ৫) ক্যাশ মেলানো ---- */
const dlab=d=>{try{return new Date(d+"T00:00:00").toLocaleDateString(L==="bn"?"bn-BD":"en-GB",{day:"numeric",month:"long"})}catch(e){return d}};
function recV(){const ex=shop(),r=X.rcd,h=[...X.rec].sort((a,b)=>(b.date||"").localeCompare(a.date||"")).slice(0,15);
 return `<div class="card"><div class="note">খাতা অনুযায়ী দোকানের ক্যাশে থাকার কথা</div><div class="v">${fmt(ex)}</div><label>হাতে গুনে পেলাম</label><input id="x_ca" type="number" inputmode="decimal" min="0" value="${r?esc(r.c):""}"><button class="p" data-xrc="1">মিলিয়ে দেখুন</button></div>`+
 (r?(r.diff===0?`<div class="card pos" style="text-align:center"><b>✅ ক্যাশ মিলেছে</b></div>`:`<div class="card" style="border-color:var(--rd)"><b class="neg">${fmt(Math.abs(r.diff))} ${r.diff<0?"কম":"বেশি"} আছে</b><div class="note">${r.diff<0?"কোথাও খরচ লেখা বাদ গেছে কি? আজকের এন্ট্রিগুলো আবার দেখুন।":"কোথাও বিক্রি বা জমা লেখা বাদ গেছে কি? আজকের এন্ট্রিগুলো আবার দেখুন।"}</div><div style="display:flex;gap:8px;margin-top:8px"><button class="s" data-xhall="1">আজকের এন্ট্রি দেখুন</button><button class="s" style="background:var(--ac);color:#fff;border-color:var(--ac)" data-xrcr="1">কারণ লিখে বন্ধ করুন</button></div></div>`):"")+
 `<div class="k" style="margin:10px 0 6px">আগের দিনগুলো</div>`+(h.length?`<div class="card">${h.map(x=>`<div class="row"><div>${dlab(x.date)}${x.reason?`<div class="note">${esc(x.reason)}</div>`:""}</div>${x.diff===0?`<span class="tag">মিলেছে</span>`:`<span class="tag" style="background:#fde68a;color:#7a5200">${fmt(Math.abs(x.diff))} ${x.diff>0?"বেশি":"কম"} ছিল</span>`}</div>`).join("")}</div>`:`<p class="note">${t("none")}</p>`)}
async function saveRec(reason){const r=X.rcd;await db.collection("recon").doc(today()).set({date:today(),expected:r.ex,counted:r.c,diff:r.diff,reason:reason||"",by:me,byName:myUser.name||"",t:Date.now()})}

/* ---- ৪) কর্মচারীর জমা ---- */
function depCard(){const h=hand(me),ow=ownerList(),td=today(),mine=X.dep.filter(d=>d.from===me&&d.date===td).sort((a,b)=>b.t-a.t);
 if(!X.dto||!ow.some(o=>o.id===X.dto))X.dto=(ow[0]||{}).id||"";
 const done=sum(mine.filter(d=>d.st==="done"));
 return `<div class="card" style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:8px"><div><div class="k">আমার হাতে আছে</div><div class="v" style="color:var(--am)">${fmt(h)}</div></div><div><div class="k">আজ জমা দিয়েছি (মালিক নিয়েছেন)</div><div class="v">${fmt(done)}</div></div></div>
 <div class="card"><b>দোকানের ক্যাশে জমা দিলাম</b><label>কত টাকা</label><input id="x_da" type="number" inputmode="decimal" min="0" value="${esc(X.dpa!==""?X.dpa:(h>0?h:""))}"><label>কাকে দিলাম</label>
 <div style="display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px">${ow.map(o=>`<button class="s" data-xdto="${esc(o.id)}" style="${X.dto===o.id?'background:var(--ac);color:#fff;border-color:var(--ac)':''}">${esc(o.name)}</button>`).join("")||'<span class="note">মালিক পাওয়া যায়নি</span>'}</div>
 <button class="p" style="background:var(--gr);border-color:var(--gr)" data-xdep="1">জমা দিলাম</button><div class="note" style="margin-top:6px">মালিক "নিলাম" চাপলে তবেই দোকানের ক্যাশে যোগ হবে।</div></div>
 <div class="card"><b>আজকের জমার তালিকা</b>${mine.map(d=>`<div class="row"><b>${fmt(d.amt)} জমা</b><span class="tag" style="${d.st==="pending"?'background:#fde68a;color:#7a5200':d.st==="no"?'background:#fde4e1;color:#b42318':''}">${d.st==="done"?"মালিক নিয়েছেন":d.st==="no"?"মালিক পাননি":"অপেক্ষায়"}</span></div>`).join("")||`<div class="note">${t("none")}</div>`}</div>`}

/* ---- ১) প্রোফাইল ---- */
function prof(){const u=myUser||{},m=isMaster();
 return `<div class="card ctr"><div class="phc"><img id="x_prev" class="av big" src="${sImg(X.pp||u.photo)}"><span>📷</span><input id="x_ph" type="file" accept="image/*" style="position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;margin:0;padding:0;border:0;cursor:pointer"></div>
 <div style="text-align:left"><label>নাম</label><input id="x_n" maxlength="30" value="${esc(u.name||"")}">${m?"":`<label>মোবাইল নম্বর (লগইনের নম্বর)</label><input id="x_m" type="tel" inputmode="numeric" maxlength="15" value="${esc(u.phone||"")}">`}<label>ঠিকানা</label><input id="x_a" maxlength="100" value="${esc(u.address||"")}">${m?"":`<label>এখনকার পাসওয়ার্ড (শুধু নম্বর বদলাতে লাগবে)</label><input id="x_cp" type="password" autocomplete="current-password">`}</div>
 <div class="err" id="x_pe"></div><button class="p" id="x_psv">তথ্য সংরক্ষণ</button></div>
 <div class="card"><b>পাসওয়ার্ড বদলান</b><label>এখনকার পাসওয়ার্ড</label><input id="x_wo" type="password" autocomplete="current-password"><label>নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)</label><input id="x_wn" type="password" autocomplete="new-password"><div class="err" id="x_we"></div><button id="x_wsv" style="width:100%">পাসওয়ার্ড বদলান</button></div>
 <div class="card note" style="background:var(--ac2)">নম্বর বা পাসওয়ার্ড বদলাতে এখনকার পাসওয়ার্ড দিতে হবে, যাতে অন্য কেউ ফোন হাতে পেয়ে বদলাতে না পারে।</div>`}
const em=e=>{const c=(e&&e.code)||"";return /wrong-password|invalid-credential|invalid-login/.test(c)?"এখনকার পাসওয়ার্ড ভুল":c==="auth/email-already-in-use"?"এই নম্বর আগে ব্যবহার হয়েছে":c==="auth/weak-password"?"পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের দিন":c==="auth/network-request-failed"?t("noNet"):t("err")+" ["+(c||"?")+"]"};
const reauth=pw=>auth.currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(auth.currentUser.email,pw));
const say=(i,m)=>{const e=$(i);if(e)e.textContent=m};

/* ---- ২) লোকজনের তালিকা (মুছুন বাটনসহ) ---- */
reqV=function(){const E=Object.entries(S.uinfo).filter(([u,x])=>u!==me&&x.role&&!x.deleted).sort((a,b)=>(b[1].t||0)-(a[1].t||0));
 const grp=(st,title,btns)=>{const l=E.filter(([,x])=>x.status===st);return l.length?`<div class="k" style="margin:12px 0 6px">${title} (${l.length})</div>`+l.map(([u,x])=>`<div class="card"><div style="display:flex;gap:12px;align-items:center"><img class="av" src="${sImg(x.photo)}"><div><b>${esc(x.name)}</b> <span class="tag">${t(x.role==="owner"?"owner":"employee")}</span><div class="note">📞 ${esc(x.phone)}</div><div class="note">📍 ${esc(x.address||"")}</div></div></div><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">${btns(u)}</div></div>`).join(""):""};
 const b=(u,st,cl,lb)=>`<button class="${cl}" style="flex:1" data-ap="${u}" data-st="${st}">${t(lb)}</button>`,del=u=>`<button class="r" style="flex:1" data-xudel="${u}">তালিকা থেকে মুছুন</button>`;
 return (grp("pending",t("pendT"),u=>b(u,"approved","g","accept")+b(u,"rejected","r","reject"))+grp("approved",t("apprT"),u=>b(u,"rejected","","stop")+del(u))+grp("rejected",t("rejT"),u=>b(u,"approved","g","reopen")+del(u)))||`<p class="note">${t("noEmp")}</p>`};

/* ---- বিদ্যমান ফাংশনে জোড়া ---- */
LST.hold=[];LST.rec=[];
const _set=setV;setV=function(){return prof()+memoCard()+_set()};
const _home=homeV;homeV=function(){return _home()+depCard()};
const _dash=dash;dash=function(){return pend()+_dash()};
const _render=render;
render=function(){_render();
 if(!authed||!myUser||myUser.status!=="approved"||!loaded)return;
 const btn=(k,e,l)=>`<button class="${tab===k?'on':''}" data-t="${k}">${e}<br><span style="font-size:15px;font-weight:700">${l}</span></button>`;
 if(isOwner())$("nav").insertAdjacentHTML("beforeend",(isMaster()?btn("hold","💰","টাকা কোথায়"):"")+btn("rec","🧮","ক্যাশ মেলান"))
 if(isOwner())$("nav").insertAdjacentHTML("beforeend",btn("ret","🔄","ফেরত"));
 if(me&&!(books[me]&&books[me].name))return;
 let h=null;if(isOwner()){if(tab==="hold"&&isMaster())h=holdV();else if(tab==="rec")h=recV()}
 if(h!==null)$("app").innerHTML=(toast?`<div class="card note">${toast}</div>`:"")+h
 if(h===null&&tab==="stock"&&isOwner())$("app").insertAdjacentHTML("afterbegin",`<button class="s" style="margin-bottom:10px" data-xnew2="1">🗑️ নষ্ট / হারানো মাল লিখুন</button>`);
 if(h===null&&tab==="ret"&&isOwner())$("app").insertAdjacentHTML("afterbegin",`<button class="p" style="margin-bottom:12px" data-xnew="1">➕ নতুন ফেরত লিখুন</button>`)};

/* ---- ডেটা শোনা ---- */
function sub(){if(X.on||!db||!me)return;X.on=true;
 const rr=()=>{if(!typing())render()},er=e=>console.log("addon",e);
 db.collection("settings").doc("memo").onSnapshot(d=>{if(d.exists){const x=d.data();MEMO.shop=x.shop||MEMO.shop;MEMO.addr=x.addr||"";if(Array.isArray(x.phones))MEMO.phones=x.phones}rr()},er);
 if(isOwner()){
  db.collection("deposits").onSnapshot(s=>{X.dep=s.docs.map(d=>d.data());rr()},er);
  db.collection("holds").onSnapshot(s=>{X.holds={};s.docs.forEach(d=>X.holds[d.id]=+d.data().amt||0);rr()},er);
  db.collection("recon").onSnapshot(s=>{X.rec=s.docs.map(d=>d.data());rr()},er)
 }else{
  db.collection("deposits").where("from","==",me).onSnapshot(s=>{X.dep=s.docs.map(d=>d.data());rr()},er);
  db.collection("holds").doc(me).onSnapshot(d=>{X.holds={[me]:d.exists?+d.data().amt||0:0};rr()},er);
  db.collection("users").where("role","==","owner").onSnapshot(s=>{X.own=s.docs.map(d=>({id:d.id,...d.data()}));rr()},er)
 }}
const _start=start;start=function(){_start();sub()};

/* ---- বাটনের কাজ ---- */
document.addEventListener("change",async ev=>{if(ev.target.id==="x_ph"&&ev.target.files[0]){try{X.pp=await thumbOf(ev.target.files[0],200,.6);const p=$("x_prev");if(p)p.src=X.pp}catch(e){}}});
document.addEventListener("click",async ev=>{const el=ev.target.closest("button");if(!el)return;const d=el.dataset,fail=()=>{toast=t("err");render()};
 if(d.xchip!==undefined){X.sel=d.xchip;X.oa=(d.xchip==="cash"||d.xchip==="bank")?"":(X.holds[d.xchip]||"");render();return}
 if(d.xdto!==undefined){X.dpa=v("x_da");X.dto=d.xdto;render();return}
 if(d.xhall){tab="hall";toast="";render();return}
 if(d.xacc||d.xrej){try{await db.collection("deposits").doc(d.xacc||d.xrej).update({st:d.xacc?"done":"no",by:me,at:Date.now()})}catch(e){fail()}return}
 if(d.xudel){const x=S.uinfo[d.xudel]||{};if(!confirm((x.name||"")+"-কে মুছবেন? তার লগইন বন্ধ হয়ে যাবে। তার আগের সব এন্ট্রি হিসাবে থেকে যাবে।"))return;
  try{await db.collection("users").doc(d.xudel).update({status:"rejected",deleted:true})}catch(e){fail()}return}
 if(d.xosv){const a=parseFloat(v("x_oa"));if(v("x_oa")===""||!(a>=0)){toast="টাকার পরিমাণ লিখুন";render();return}
  if(X.sel==="cash"||X.sel==="bank"){if(!(a>0)){toast="টাকার পরিমাণ লিখুন";render();return}
   const ok=await mutate(me,(x,lg)=>{const ent={id:"e"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),t:Date.now(),type:"opening",amt:a,acct:X.sel,date:today(),note:"শুরুর টাকা"};x.entries.push(ent);lg("add",null,ent)});
   if(ok){X.oa="";toast=t("saved")}render();return}
  try{await db.collection("holds").doc(X.sel).set({amt:a});X.oa=a;toast=t("saved")}catch(e){toast=t("err")}render();return}
 if(d.xrc){const c=parseFloat(v("x_ca"));if(isNaN(c)||c<0){toast="গোনা টাকা লিখুন";render();return}
  const ex=shop();X.rcd={c,ex,diff:Math.round(c-ex)};toast="";
  if(X.rcd.diff===0){try{await saveRec("")}catch(e){toast=t("err")}}render();return}
 if(d.xrcr){const r=prompt("কারণ লিখুন (যেমন: চা-নাস্তায় খরচ, লেখা হয়নি)");if(r===null)return;
  try{await saveRec(r.trim());X.rcd=null;toast=t("saved")}catch(e){toast=t("err")}render();return}
 if(d.xdep){const a=parseFloat(v("x_da")),h=hand(me);X.dpa=v("x_da");
  if(!(a>0)){toast="টাকার পরিমাণ লিখুন";render();return}if(a>h){toast="হাতে থাকা টাকার বেশি লিখেছেন";render();return}if(!X.dto){toast="কাকে দিলেন বাছুন";render();return}
  const id="d"+Date.now().toString(36)+Math.random().toString(36).slice(2,4);
  try{await db.collection("deposits").doc(id).set({id,from:me,fromName:myUser.name||"",to:X.dto,amt:a,date:today(),st:"pending",t:Date.now()});X.dpa="";toast="মালিকের কাছে অনুরোধ গেছে";sendMail(myUser.name||"?","জমার অনুরোধ: "+fmt(a))}catch(e){toast=t("err")}render();return}
 if(el.id==="x_psv"){const n=v("x_n").trim(),ad=v("x_a").trim();if(!n){say("x_pe","নাম লিখুন");return}
  const up={name:n,address:ad};if(X.pp)up.photo=X.pp;say("x_pe","…");
  try{if(!isMaster()){const m=v("x_m").replace(/\D/g,"");if(m.length<10){say("x_pe",t("regErr0"));return}
    if(m!==String(myUser.phone||"").replace(/\D/g,"")){const cp=v("x_cp");if(!cp){say("x_pe","নম্বর বদলাতে এখনকার পাসওয়ার্ড দিন");return}
     await reauth(cp);await auth.currentUser.updateEmail(mail(m));up.phone=m;rset("hphone",m)}}
   await db.collection("users").doc(me).update(up);S.users[me]=n;rset("hname",n);if(X.pp)rset("hphoto",X.pp);X.pp="";toast=t("saved");render()}
  catch(e){console.log(e);say("x_pe",em(e))}return}
 if(el.id==="x_wsv"){const o=v("x_wo"),n=v("x_wn");if(!o||n.length<6){say("x_we","এখনকার পাসওয়ার্ড দিন, নতুনটা কমপক্ষে ৬ অক্ষরের হবে");return}say("x_we","…");
  try{await reauth(o);await auth.currentUser.updatePassword(n);toast="পাসওয়ার্ড বদলেছে";render()}catch(e){console.log(e);say("x_we",em(e))}return}
});

/* ---- বদলানো/মোছার আগে কারণ জিজ্ঞেস ---- */
X.why=null;
const _mut=mutate;
mutate=function(uid,fn){const r=X.why;X.why=null;
 return _mut(uid,r?(x,lg)=>{const n=x.log.length;fn(x,lg);if(x.log.length>n){const l=x.log[x.log.length-1];if(l.a!=="add")l.reason=r}}:fn)};
document.addEventListener("click",ev=>{const el=ev.target.closest("button");if(!el)return;const d=el.dataset;
 const ask=q=>{const r=prompt(q);if(r===null||!r.trim()){if(r!==null)alert("কারণ লিখতে হবে");ev.stopPropagation();ev.preventDefault();return null}return r.trim().slice(0,100)};
 if(d.dl){const r=ask("কেন মুছছেন? কারণ লিখুন");if(r===null)return;X.why=r;setTimeout(()=>{X.why=null},0);return}
 if(el.id==="sv"&&editId){const r=ask("কেন বদলাচ্ছেন? কারণ লিখুন");if(r===null)return;X.why=r;return}
 X.why=null},true);
logV=function(){const a=Object.values(books).flatMap(b=>b.log||[]).sort((x,y)=>y.t-x.t).slice(0,150);if(!a.length)return `<p class="note">${t("none")}</p>`;
 return `<div class="card">`+a.map(l=>`<div class="row"><div><b>${esc(l.by)}</b> ${t("a_"+l.a)}<div>${l.a==="edit"?sm(l.o)+" → "+sm(l.n):sm(l.a==="del"?l.o:l.n)}</div>${l.reason?`<div class="note">কারণ: ${esc(l.reason)}</div>`:""}${(l.a==="del"&&l.o&&isOwner()&&canWrite&&!allE().some(e=>e.id===l.o.id)&&!String(l.o.id).startsWith("xpay"))?`<button class="s" style="margin-top:4px" data-xrest="${esc(l.o.id)}">↩️ ফেরত আনুন</button>`:""}</div><div class="note">${new Date(l.t).toLocaleString(L==="bn"?"bn-BD":"en-GB",{dateStyle:"short",timeStyle:"short"})}</div></div>`).join("")+`</div>`};
notify=function(next,b){const who=(books[me]||{}).name||"?",m=[];
 next.log.slice((b.log||[]).length).forEach(l=>{const w=l.reason?` — কারণ: ${l.reason}`:"";m.push((l.a==="edit"?`বদলেছেন: ${bs(l.o)} → ${bs(l.n)}`:l.a==="del"?`মুছেছেন: ${bs(l.o)}`:`যোগ করেছেন: ${bs(l.n)}`)+w)});
 const op=new Set((b.parties||[]).map(p=>p.id)),np=new Set(next.parties.map(p=>p.id));
 next.parties.filter(p=>!op.has(p.id)).forEach(p=>m.push("নতুন পার্টি: "+p.name));(b.parties||[]).filter(p=>!np.has(p.id)).forEach(p=>m.push("পার্টি মুছেছেন: "+p.name));
 if(m.length)sendMail(who,m.join("\n"))};

/* ---- 🧾 মেমো (ঐচ্ছিক — বাটন চাপলে তবেই খোলে) ---- */
hist=function(ty){let E=allE().filter(e=>ty.includes(e.type));if(flt==="mine")E=E.filter(e=>e.uid===me);
 const tot=E.reduce((a,e)=>a+(+e.amt||0),0),tq=E.reduce((a,e)=>a+(+e.qty||0),0);
 E.sort((a,b)=>(b.date||"").localeCompare(a.date||"")||(b.t||0)-(a.t||0));
 const f=`<select id="flt"><option value="all" ${flt==="all"?'selected':''}>${t("all")}</option><option value="mine" ${flt==="mine"?'selected':''}>${t("mine")}</option></select>`;
 if(!E.length)return f+`<p class="note">${t("none")}</p>`;
 return f+`<div class="card"><b>${t("ltot")}: ${fmt(tot)}${tq?" · "+tq+" "+t("pcs"):""}</b></div><div class="card">`+E.slice(0,300).map(e=>{const own=isOwner()&&canWrite;const out=["purchase","expense","pay","return_in"].includes(e.type);const pr=pd(e);
  return `<div class="row"><div><span class="tag">${lbl(e.type)}</span> <span class="note">${t(e.acct)} · ${esc(e.date)} · ${esc(e.pname)}</span><div>${e.item?`<b>${esc(e.item)}</b> × ${esc(e.qty||0)} ${t("pcs")} `:""}${e.party?`👤 ${esc(pname(e.party))} `:""}${esc(e.note)}</div>${e.paid!==undefined&&e.paid!==""&&pr<(+e.amt)?`<div class="note">💵 ${fmt(pr)} · ${t(isS(e.type)?"toGet":"toGive")} ${fmt(e.amt-pr)}</div>`:(isSP(e.type)&&pr>(+e.amt||0)?`<div class="note neg">⚠️ ${t("paidMore")}: ${fmt(pr)}</div>`:"")}${e.img?`<img class="th" data-img="${esc(e.img)}" src="${sImg(e.thumb)}">`:""}</div>
  <div style="text-align:right"><b class="${out?'neg':'pos'}">${fmt(e.amt)}</b><div>${own?`<button class="s" data-ed="${esc(e.id)}" data-eu="${esc(e.uid)}">${t("edit")}</button> <button class="s" data-dl="${esc(e.id)}" data-du="${esc(e.uid)}">${t("del")}</button>`:`<span class="note">${t("ro")}</span>`}${isS(e.type)?` <button class="s" data-xmemo="${esc(e.id)}" data-xu="${esc(e.uid)}">🧾 মেমো</button>`:""}</div></div></div>`}).join("")+`</div>`};
function memo(id,u){const e=allE().find(x=>x.id===id&&x.uid===u);if(!e)return;
 const p=e.party?allP().find(q=>q.id===e.party):null,paid=pd(e),due=(+e.amt||0)-paid,ln=(a,b)=>`<div style="display:flex;justify-content:space-between;gap:10px;padding:4px 0">${a}<b>${b}</b></div>`;
 if(!$("x_ms")){const st=document.createElement("style");st.id="x_ms";st.textContent="@media print{body>*:not(#x_memo){display:none!important}#x_memo{position:static!important;background:#fff!important;padding:0!important;overflow:visible!important}.x_np{display:none!important}}";document.head.appendChild(st)}
 const o=document.createElement("div");o.id="x_memo";o.style.cssText="position:fixed;inset:0;z-index:99;background:rgba(0,0,0,.6);overflow:auto;padding:12px";
 o.innerHTML=`<div style="max-width:380px;margin:0 auto;background:#fff;color:#111;border-radius:10px;padding:18px;font-size:15px;line-height:1.5">
 <div style="text-align:center"><div style="font-size:21px;font-weight:700">${esc(MEMO.shop)}</div>${MEMO.addr?`<div>${esc(MEMO.addr)}</div>`:""}${MEMO.phones.map(x=>`<div>📞 ${esc(x)}</div>`).join("")}</div>
 <div style="border-top:2px dashed #999;margin:10px 0"></div>
 ${ln("<span>তারিখ</span>",esc(e.date))}${ln("<span>মেমো নং</span>",esc(String(e.id).slice(-5).toUpperCase()))}${p?ln("<span>কাস্টমার</span>",esc(p.name)+(p.phone?" · "+esc(p.phone):"")):""}
 <div style="border-top:1px solid #ccc;margin:8px 0"></div>
 ${e.item?ln("<span>"+esc(e.item)+" × "+(e.qty||0)+" পিস</span>",fmt(e.amt)):""}${e.note?`<div style="color:#555">${esc(e.note)}</div>`:""}
 <div style="border-top:1px solid #ccc;margin:8px 0"></div>
 ${ln("<span>মোট টাকা</span>",fmt(e.amt))}${ln("<span>নগদ পেয়েছি</span>",fmt(paid))}${due>0?ln("<span>বাকি</span>",fmt(due)):""}
 <div style="border-top:2px dashed #999;margin:10px 0"></div><div style="text-align:center">ধন্যবাদ, আবার আসবেন</div></div>
 <div class="x_np" style="max-width:380px;margin:10px auto;display:flex;gap:8px"><button class="p" id="x_pr" style="flex:2">🖨️ প্রিন্ট / PDF</button><button id="x_cl" style="flex:1">বন্ধ</button></div>`;
 document.body.appendChild(o);$("x_pr").onclick=()=>window.print();$("x_cl").onclick=()=>o.remove()}
document.addEventListener("click",ev=>{const el=ev.target.closest("button");if(el&&el.dataset.xmemo)memo(el.dataset.xmemo,el.dataset.xu)});

function memoCard(){if(!isMaster())return"";
 return `<div class="card"><b>🧾 মেমোর তথ্য</b><div class="note">মেমোর ওপরে যা দেখাবে। যখন খুশি বদলাতে পারবেন।</div><label>দোকানের নাম</label><input id="x_mn" maxlength="60" value="${esc(MEMO.shop)}"><label>ঠিকানা (ঐচ্ছিক)</label><input id="x_ma" maxlength="120" value="${esc(MEMO.addr)}"><label>নম্বর (প্রতি লাইনে একটা, যেমন: MOSTAFIJ: 017XXXXXXXX)</label><textarea id="x_mp" rows="3" maxlength="300" style="width:100%;font:inherit;background:var(--bg);color:var(--tx);border:1px solid var(--bd);border-radius:8px;padding:9px;margin:4px 0 8px">${esc(MEMO.phones.join("\n"))}</textarea><div class="err" id="x_mse"></div><button class="p" id="x_msv">সংরক্ষণ</button></div>`}
document.addEventListener("click",async ev=>{const el=ev.target.closest("button");if(!el||el.id!=="x_msv")return;
 const sh=v("x_mn").trim();if(!sh){say("x_mse","দোকানের নাম লিখুন");return}
 const ph=v("x_mp").split("\n").map(x=>x.trim()).filter(Boolean).slice(0,5);
 try{await db.collection("settings").doc("memo").set({shop:sh,addr:v("x_ma").trim(),phones:ph});toast=t("saved");render()}catch(e){console.log(e);say("x_mse",t("err"))}});

/* ---- 🔄 ফেরত (কাস্টমারের মাল ফেরত নেওয়া) ---- */
EM.return_in="🔄";TYPES.push("return_in");LST.ret=["return_in"];
Object.assign(T.bn,{return_in:"ফেরত (কাস্টমারের মাল ফেরত নিলাম)"});Object.assign(T.en,{return_in:"Return (goods taken back)"});
const _calc0=calc;
calc=function(list){const r=_calc0(list);for(const e of list){if(e.type!=="return_in")continue;r.sales-=+e.amt||0;r[e.acct==="bank"?"bank":"cash"]-=pd(e)}return r};
const _dl0=delta;
delta=function(e){return e.type==="return_in"?-((+e.amt||0)-pd(e)):_dl0(e)};
const _qt0=qtyTable;
qtyTable=function(E){const out=_qt0(E);
 E.forEach(e=>{if(e.type!=="return_in"||!e.item)return;const k=e.item.trim().toLowerCase(),q=+e.qty||0;let x=out.find(o=>o.n.toLowerCase()===k);if(!x){x={n:e.item.trim(),b:0,s:0};out.push(x)}x.s-=q});
 return out.sort((a,b)=>a.n.localeCompare(b.n))};
const _pf0=profitOf;
profitOf=function(list){const r=_pf0(list),ac=avgCost();let cg=r.cogs;
 list.forEach(e=>{if(e.type!=="return_in"||!e.item)return;const c=ac[e.item.trim().toLowerCase()];if(c!==undefined)cg-=(+e.qty||0)*c});
 const c=calc(list);return {cogs:cg,profit:c.sales-cg-c.exp}};
syncForm=function(){const ty=$("f_type").value,R=ty==="return_in",g=(i,s)=>{const x=$(i);if(x)x.style.display=s?"":"none"};
 g("itw",isSP(ty)||ty==="open_stock"||R);g("ptw",isSP(ty)||ty==="recv"||ty==="pay"||R);g("pdw",isSP(ty)||R);g("acw",ty!=="deposit"&&ty!=="withdraw"&&ty!=="open_stock");
 const lp=$("pdw")&&$("pdw").querySelector("label"),la=$("f_amt")&&$("f_amt").previousElementSibling;
 if(lp)lp.textContent=R?"কত টাকা ফেরত দিলাম? (ফাঁকা = পুরো টাকা)":t("paid");if(la)la.textContent=R?"ফেরত মালের মোট দাম (৳)":t("amt")};
document.addEventListener("click",async ev=>{const el=ev.target.closest("button");if(!el)return;
 if(el.dataset.xnew){addType="return_in";tab="add";editId=null;toast="";render();return}
 if(el.id!=="sv"||ev.defaultPrevented)return;const f=$("f_type");if(!f||f.value!=="return_in")return;
 ev.stopImmediatePropagation();
 const amt=parseFloat(v("f_amt"));if(!(amt>0)){alert(t("needAmt"));return}
 const item=v("f_item").trim(),qty=parseInt(v("f_qty"))||0;if(!item||!(qty>0)){alert(t("needItem"));return}
 const party=v("f_party"),pv=v("f_paid");if(pv!==""&&parseFloat(pv)>amt){alert(t("paidMore"));return}
 if(!party&&pv!==""&&parseFloat(pv)<amt){alert("পুরো টাকা ফেরত না দিলে পার্টি বাছুন, নইলে বাকিটা হিসাবে ধরা যাবে না");return}
 const old=editId?((books[editUid]||{}).entries||[]).find(x=>x.id===editId):null;
 const ent={id:editId||("e"+Date.now().toString(36)+Math.random().toString(36).slice(2,5)),t:Date.now(),type:"return_in",amt,acct:v("f_acct")||"cash",date:v("f_date")||today(),note:v("f_note").trim(),item,qty};
 if(party)ent.party=party;if(pv!=="")ent.paid=parseFloat(pv);
 const uid=editId?editUid:me;el.disabled=true;el.textContent="…";
 const ok=await mutate(uid,(x,lg)=>{if(editId){x.entries=x.entries.map(e=>e.id===editId?ent:e);lg("edit",old,ent)}else{x.entries.push(ent);lg("add",null,ent)}});
 if(ok){editId=null;addType="";toast=t("saved");tab="ret"}render()},true);

/* ---- 🗑️ নষ্ট / হারানো মাল ---- */
EM.stock_out="🗑️";TYPES.push("stock_out");LST.other.push("stock_out");
Object.assign(T.bn,{stock_out:"নষ্ট / হারানো মাল"});Object.assign(T.en,{stock_out:"Damaged / lost stock"});
const _qt1=qtyTable;
qtyTable=function(E){const out=_qt1(E);
 E.forEach(e=>{if(e.type!=="stock_out"||!e.item)return;const k=e.item.trim().toLowerCase();let x=out.find(o=>o.n.toLowerCase()===k);if(!x){x={n:e.item.trim(),b:0,s:0};out.push(x)}x.b-=+e.qty||0});
 return out.sort((a,b)=>a.n.localeCompare(b.n))};
const _pf1=profitOf;
profitOf=function(list){const r=_pf1(list),ac=avgCost();let cg=r.cogs;
 list.forEach(e=>{if(e.type!=="stock_out"||!e.item)return;const c=ac[e.item.trim().toLowerCase()];if(c!==undefined)cg+=(+e.qty||0)*c});
 const c=calc(list);return {cogs:cg,profit:c.sales-cg-c.exp}};
const _sf=syncForm;
syncForm=function(){_sf();const ty=$("f_type").value,o=ty==="stock_out",am=$("f_amt"),al=am&&am.previousElementSibling;
 [am,al].forEach(x=>{if(x)x.style.display=o?"none":""});
 if(o){const i=$("itw"),a=$("acw");if(i)i.style.display="";if(a)a.style.display="none"}};
document.addEventListener("click",async ev=>{const el=ev.target.closest("button");if(!el)return;
 if(el.dataset.xnew2){addType="stock_out";tab="add";editId=null;toast="";render();return}
 if(el.id!=="sv"||ev.defaultPrevented)return;const f=$("f_type");if(!f||f.value!=="stock_out")return;
 ev.stopImmediatePropagation();
 const item=v("f_item").trim(),qty=parseInt(v("f_qty"))||0,note=v("f_note").trim();
 if(!item||!(qty>0)){alert(t("needItem"));return}if(!note){alert("কেন নষ্ট বা হারালো তা বিবরণে লিখুন");return}
 const old=editId?((books[editUid]||{}).entries||[]).find(x=>x.id===editId):null;
 const ent={id:editId||("e"+Date.now().toString(36)+Math.random().toString(36).slice(2,5)),t:Date.now(),type:"stock_out",amt:0,acct:"",date:v("f_date")||today(),note,item,qty};
 const uid=editId?editUid:me;el.disabled=true;el.textContent="…";
 const ok=await mutate(uid,(x,lg)=>{if(editId){x.entries=x.entries.map(e=>e.id===editId?ent:e);lg("edit",old,ent)}else{x.entries.push(ent);lg("add",null,ent)}});
 if(ok){editId=null;addType="";toast=t("saved");tab="stock"}render()},true);

/* ---- ↩️ মোছা এন্ট্রি ফেরত আনা ---- */
document.addEventListener("click",async ev=>{const el=ev.target.closest("button");if(!el||!el.dataset.xrest)return;
 const id=el.dataset.xrest,g=Object.values(books).flatMap(b=>b.log||[]).filter(q=>q.a==="del"&&q.o&&q.o.id===id).sort((a,b)=>b.t-a.t)[0];
 if(!g||!confirm("এন্ট্রিটা ফেরত আনবেন?"))return;
 const e={...g.o},uid=g.uid||e.uid||me;delete e.uid;delete e.pname;
 await mutate(uid,(x,lg)=>{if(x.entries.some(q=>q.id===e.id))return;x.entries.push(e);lg("add",null,e)})});

/* ---- 💸 অগ্রিম / ধার বেতন ---- */
const _empD=empD;
empD=function(u){return _empD(u)+advCard(u)};
function advCard(u){const M=emon||today().slice(0,7);
 return `<div class="card"><b>💸 অগ্রিম / ধার বেতন</b><div class="note">দিলে টাকাটা ওই মাসের বেতন থেকে নিজে থেকে বাদ যাবে (বাকি বেতনে মিলবে)</div><label>${t("amt")}</label><input id="x_aa" type="number" inputmode="decimal" min="0"><label>কোন মাসের বেতন থেকে কাটবে</label><input id="x_am" type="month" value="${M}"><select id="x_ac"><option value="cash">${t("cash")}</option><option value="bank">${t("bank")}</option></select><input id="x_an" maxlength="60" placeholder="${t("note")}"><button class="p" data-xadv="${u}">অগ্রিম দিলাম</button></div>`}
document.addEventListener("click",async ev=>{const el=ev.target.closest("button");if(!el||!el.dataset.xadv)return;const u=el.dataset.xadv;
 const a=parseFloat(v("x_aa")),mo=v("x_am")||today().slice(0,7),ac=v("x_ac")||"cash",nt=v("x_an").trim();
 if(!(a>0)){toast="টাকার পরিমাণ লিখুন";render();return}
 const td=today(),dt=mo===td.slice(0,7)?td:mo+"-01",id="pay"+Date.now().toString(36)+Math.random().toString(36).slice(2,4),nm=(S.uinfo[u]||{}).name||"";
 const cur=S.pay[u]||{},nx={salary:cur.salary||0,pays:[...(cur.pays||[])],days:[...(cur.days||[])]};
 nx.pays.push({id,date:dt,amt:a,acct:ac,note:"অগ্রিম"+(dt!==td?" (দেওয়া হয়েছে "+td+")":"")+(nt?" — "+nt:""),adv:true,by:me,t:Date.now()});
 try{await db.collection("payroll").doc(u).set(nx)}catch(e){toast=t("err");render();return}
 await mutate(me,(x,lg)=>{const ent={id:"x"+id,t:Date.now(),type:"expense",amt:a,acct:ac,date:td,note:"অগ্রিম বেতন — "+nm+(nt?" ("+nt+")":"")};x.entries.push(ent);lg("add",null,ent)});
 toast="অগ্রিম লেখা হলো";render()});

/* ---- 📴 অফলাইনে চলা ---- */
try{if(db){
 db.enablePersistence({synchronizeTabs:true}).catch(e=>console.log("persist",e&&e.code));
 const F=firebase.firestore,fast=(P,k)=>{if(!P||!P[k])return;const o=P[k];P[k]=function(...a){return Promise.race([o.apply(this,a),new Promise(r=>setTimeout(r,4000))])}};
 fast(F.DocumentReference&&F.DocumentReference.prototype,"set");fast(F.DocumentReference&&F.DocumentReference.prototype,"update");fast(F.WriteBatch&&F.WriteBatch.prototype,"commit");
 const _b=db.batch.bind(db);db.batch=function(){const b=_b(),c=b.commit.bind(b);b.commit=function(){return Promise.race([c(),new Promise(r=>setTimeout(r,4000))])};return b};
 const bar=document.createElement("div");bar.style.cssText="position:fixed;left:0;right:0;bottom:66px;z-index:30;background:#b45309;color:#fff;text-align:center;padding:6px;font-size:13px;display:none";
 bar.textContent="📴 নেট নেই — এন্ট্রি ফোনে জমা থাকছে, নেট এলে নিজে থেকে যাবে";document.body.appendChild(bar);
 const up=()=>{bar.style.display=navigator.onLine?"none":"block"};addEventListener("online",up);addEventListener("offline",up);up()}}catch(e){console.log("offline",e)}

/* ---- 📊 গ্রাফ (রিপোর্ট পাতায়) ---- */
X.gm="day";
const MN=["জানু","ফেব্রু","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টে","অক্টো","নভে","ডিসে"];
function chartSvg(Lb,A,B){const n=Lb.length,W=340,H=170,pl=38,pr=6,pt=10,pb=22,mx=Math.max(1,...A,...B),mn=Math.min(0,...A,...B),rg=mx-mn,y=q=>pt+(H-pt-pb)*(1-(q-mn)/rg),gw=(W-pl-pr)/n,bw=Math.max(1,gw*.4),sh=q=>Math.abs(q)>=1000?Math.round(q/1000)+"k":Math.round(q),st=Math.ceil(n/8);
 let s=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto"><line x1="${pl}" x2="${W-pr}" y1="${y(0)}" y2="${y(0)}" style="stroke:var(--bd)"/><text x="${pl-4}" y="${pt+6}" text-anchor="end" style="fill:var(--mu);font-size:9px">${sh(mx)}</text>${mn<0?`<text x="${pl-4}" y="${H-pb}" text-anchor="end" style="fill:var(--mu);font-size:9px">${sh(mn)}</text>`:""}`;
 const bar=(x,q,c)=>`<rect x="${x.toFixed(1)}" y="${Math.min(y(q),y(0)).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(.5,Math.abs(y(q)-y(0))).toFixed(1)}" style="fill:${c}"/>`;
 for(let i=0;i<n;i++){const x=pl+i*gw+gw*.1;s+=bar(x,A[i],"var(--ac)")+bar(x+bw,B[i],"#f59e0b");if(i%st===0)s+=`<text x="${(pl+i*gw+gw/2).toFixed(1)}" y="${H-6}" text-anchor="middle" style="fill:var(--mu);font-size:9px">${esc(Lb[i])}</text>`}
 return s+"</svg>"}
function chartCard(){const E=allE(),Lb=[],A=[],B=[];
 if(X.gm==="month"){const d=new Date();for(let i=5;i>=0;i--){const z=new Date(d.getFullYear(),d.getMonth()-i,1),ym=z.getFullYear()+"-"+String(z.getMonth()+1).padStart(2,"0"),l=E.filter(e=>(e.date||"").slice(0,7)===ym);Lb.push(MN[z.getMonth()]);A.push(calc(l).sales);B.push(profitOf(l).profit)}}
 else{const f=new Date(rf+"T00:00:00"),to=new Date(rt+"T00:00:00");if(!isNaN(f)&&!isNaN(to)&&f<=to){for(let d=new Date(f),k=0;d<=to&&k<62;d.setDate(d.getDate()+1),k++){const ds=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"),l=E.filter(e=>e.date===ds);Lb.push(String(d.getDate()));A.push(calc(l).sales);B.push(profitOf(l).profit)}}}
 const sw=k=>`<button class="s" data-xgm="${k}" style="${X.gm===k?'background:var(--ac);color:#fff;border-color:var(--ac)':''}">${k==="day"?"দিন ধরে (নিচের তারিখ অনুযায়ী)":"গত ৬ মাস"}</button>`;
 return `<div class="card"><b>📊 বিক্রি ও লাভের গ্রাফ</b><div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0">${sw("day")}${sw("month")}</div>${Lb.length?chartSvg(Lb,A,B):`<p class="note">${t("none")}</p>`}<div class="note"><span style="color:var(--ac)">■</span> বিক্রি &nbsp; <span style="color:#f59e0b">■</span> লাভ (ফেরত ও খরচ বাদে)</div></div>`}
const _rep=repV;repV=function(){const h=_rep();return chartCard()+h};
document.addEventListener("click",ev=>{const el=ev.target.closest("button");if(el&&el.dataset.xgm){X.gm=el.dataset.xgm;render()}});
})();
