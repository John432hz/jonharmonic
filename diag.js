// Foutenrapport + network helpers. Errors are kept locally (localStorage) and, on the app server, posted to
// the same server (/api/errors → data/error-log.jsonl). Nothing is sent to any external service.
(function(){
const KEY='jh-errors',MAX=200,rf=window.fetch.bind(window);let last='',lastAt=0,queue=[],timer=0;
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}};
function notice(text){let n=document.getElementById('errnote');if(!n){n=document.createElement('div');n.id='errnote';n.setAttribute('role','status');document.body&&document.body.appendChild(n)}
 n.innerHTML='<span>⚠ '+String(text).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))+'</span> <a href="#/errors">Foutenrapport</a> <button class="ghost" aria-label="Sluiten">✕</button>';
 n.querySelector('button').onclick=()=>n.remove();clearTimeout(n._t);n._t=setTimeout(()=>n.remove(),7000)}
function log(type,msg,where,opt){opt=opt||{};msg=String(msg||'').slice(0,500);const k=type+msg;if(k===last&&Date.now()-lastAt<3000)return;last=k;lastAt=Date.now();
 const e={at:Date.now(),type,msg,where:String(where||location.hash||'/').slice(0,300)};const L=read();L.unshift(e);
 try{localStorage.setItem(KEY,JSON.stringify(L.slice(0,MAX)))}catch(x){}
 if(!opt.silent)notice(opt.notice||msg);
 if(window.JH_SERVER_LOG!==false){queue.push(e);clearTimeout(timer);timer=setTimeout(flush,1500)}}
function flush(){if(!queue.length||!navigator.onLine)return;const b=queue.splice(0);rf('/api/errors',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}).catch(()=>{})}
addEventListener('error',e=>{if(e.target&&e.target!==window&&e.target.tagName){if(e.target.tagName!=='AUDIO')log('resource','Kon niet laden: '+(e.target.src||e.target.href||e.target.tagName),'',{silent:true});return}
 log('js',e.message+(e.lineno?' ('+(e.filename||'').split('/').pop()+':'+e.lineno+')':''))},true);
addEventListener('unhandledrejection',e=>log('js','Promise: '+((e.reason&&e.reason.message)||e.reason)));
window.fetch=async function(i,n){const u=typeof i==='string'?i:i.url;try{const r=await rf(i,n);
  if(!r.ok&&r.status!==206&&!/\/api\/errors/.test(u))log('fetch','HTTP '+r.status+' bij '+u.split('?')[0],'',{silent:r.status===404&&/sw\.js/.test(u)});return r}
 catch(x){if(!/\/api\/errors/.test(u))log(navigator.onLine?'fetch':'network',(navigator.onLine?'Verzoek mislukt: ':'Offline: ')+u.split('?')[0],'',{notice:navigator.onLine?'Verbinding mislukt':'Je bent offline'});throw x}};
// ---- network state ----
const C=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
const NET={
 info(){return C?{type:C.type||'',eff:C.effectiveType||'',saveData:!!C.saveData,down:C.downlink}:{type:'',eff:'',saveData:false}},
 // true when the browser reports a cellular link (4G/5G etc.), a slow link or data-saver. Unknown = false.
 mobile(){const i=NET.info();return i.type==='cellular'||i.saveData||/^(slow-2g|2g|3g)$/.test(i.eff)},
 label(){const i=NET.info();return i.type==='cellular'?'mobile data':i.saveData?'data saver':/2g|3g/.test(i.eff)?'a slow connection ('+i.eff+')':''}};
window.JHNET=NET;
function banner(){let b=document.getElementById('offbar');if(navigator.onLine){b&&b.remove();return}
 if(!b){b=document.createElement('div');b.id='offbar';b.textContent='Je bent offline. Opgeslagen en gedownloade nummers blijven werken; streamen gaat verder zodra je weer verbinding hebt.';document.body.appendChild(b)}}
addEventListener('offline',()=>{banner();log('network','Verbinding weggevallen (offline)','',{silent:true})});
addEventListener('online',()=>{banner();flush()});
addEventListener('DOMContentLoaded',banner);
window.JHERR={log,read,clear(){localStorage.removeItem(KEY)},notice};
})();
