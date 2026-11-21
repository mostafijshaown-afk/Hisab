function typing(){var a=document.activeElement;return !!a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)}
function sImg(s){return s||"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="}
function avgCost(){var q={},a={};allE().forEach(function(e){if(e.type!=="purchase"||!e.item)return;var k=e.item.trim().toLowerCase();q[k]=(q[k]||0)+(+e.qty||0);a[k]=(a[k]||0)+(+e.amt||0)});var r={};for(var k in q)if(q[k]>0)r[k]=a[k]/q[k];return r}
function profitOf(list){var ac=avgCost(),cg=0;list.forEach(function(e){if(!isS(e.type)||!e.item)return;var c=ac[e.item.trim().toLowerCase()];if(c!==undefined)cg+=(+e.qty||0)*c});var c=calc(list);return{cogs:cg,profit:c.sales-cg-c.exp}}
Object.assign(T.bn,{needAmt:"টাকার পরিমাণ লিখুন",needItem:"মালের নাম ও পিস লিখুন",paidMore:"মোট টাকার বেশি লিখেছেন"});
Object.assign(T.en,{needAmt:"Enter the amount",needItem:"Enter item name and qty",paidMore:"More than the total"});
