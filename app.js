const $=s=>document.querySelector(s),V=$('#view'),eur=c=>'€'+(c/100).toFixed(2).replace('.',','),fmt=s=>{s=Math.floor(s||0);const h=s/3600|0,m=(s%3600)/60|0,x=s%60;return(h?h+':'+String(m).padStart(2,'0'):m)+':'+String(x).padStart(2,'0')};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let email=localStorage.email||'',cat;
const TH={'Focus':['#3fd0ff','Sharpen the signal. Let the noise fall away.'],'Deep Calm':['#4fe3c1','Slow down long enough to hear yourself.'],'Inner Power':['#ffb347','The strength was never outside you.'],'Release':['#ff4fa3','Move it, shake it, let it go.'],'Journey':['#a98bff','No map. Just stay until the end.']};
const hue=s=>[...s].reduce((a,c)=>a*31+c.charCodeAt(0)>>>0,7)%360;
const grad=j=>`linear-gradient(135deg,${(TH[j.theme]||TH.Journey)[0]}cc,hsl(${hue(j.title)},60%,18%) 70%,#07070f)`;
if('serviceWorker'in navigator)navigator.serviceWorker.getRegistrations?.().then(r=>r.forEach(x=>x.unregister()));
async function load(){localStorage.removeItem('tester');try{cat=await(await fetch('/api/catalog')).json()}catch(x){V.innerHTML='<div class="wrap"><section class="hero" style="min-height:50vh"><h1>Can\'t reach the catalog</h1><p>Check your connection and try again.</p><div class="row"><button onclick="load()">Retry</button><a href="#/errors"><button class="ghost">Foutenrapport</button></a></div></section></div>';return}cat.journeys.forEach(j=>{j.unlocked=true});route()}
window.onhashchange=route;
function route(){const h=location.hash.slice(2).split('/');document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#/'+(h[0]||'')));$('#sampler').pause();const k=h[0].split('?')[0];
 ({'':landing,state,feed,all,j:track,circle:support,support,crypto:support,errors:errorsPage,genres,genre}[k]||landing)(decodeURIComponent((h[1]||'').split('?')[0]),k)}
const tracks=()=>cat.journeys.filter(j=>!j.free&&j.id.startsWith('jh-'));
const art=j=>j.artwork?`<div class="art" style="background:url(${j.artwork}) center/cover"></div>`:`<div class="art">${esc(j.title.slice(0,40))}</div>`;
const card=(j,i,L)=>`<a class="card" href="#/j/${j.id}" data-l="${L?reg(L):''}" style="text-decoration:none;--g:${grad(j)}">${art(j)}<h3>${esc(j.title)}</h3><div class="meta">${fmt(j.durationSec)} · ${esc(j.genre||'')} · ${views(j)} views</div></a>`;
function statesGrid(){return `<div class="grid">${cat.themes.map(t=>`<a class="card state" style="--c:${TH[t][0]};text-decoration:none" href="#/state/${encodeURIComponent(t)}"><h3>${t}</h3><div class="meta">${TH[t][1]}</div><div class="meta">${tracks().filter(j=>j.theme===t).length} journeys</div></a>`).join('')}</div>`}
function state(t){const L=tracks().filter(j=>j.theme===t);V.innerHTML=`<div class="wrap"><h2 style="color:${TH[t]?.[0]}">${esc(t)}</h2><p class="sub">${TH[t]?.[1]||''}</p>
 <div class="row">${['all','<20','20-40','40+'].map(l=>`<button class="ghost" onclick="lenFilter('${l}')">${l==='all'?'Any length':l+' min'}</button>`).join('')}</div><div class="grid" id="g" style="margin-top:14px">${L.map(card).join('')}</div></div>`;
 window.lenFilter=l=>{$('#g').innerHTML=L.filter(j=>{const m=j.durationSec/60;return l==='all'||(l==='<20'&&m<20)||(l==='20-40'&&m>=20&&m<40)||(l==='40+'&&m>=40)}).map(card).join('')}}
function all(acc){const L=tracks().filter(j=>!acc||j.account===acc);V.innerHTML=`<div class="wrap"><h2>${acc?'@'+esc(acc):'All journeys'}</h2><p class="sub">${L.length} journeys · ${(L.reduce((a,j)=>a+j.durationSec,0)/3600).toFixed(1)} hours of music</p><div class="grid">${L.map(card).join('')}</div></div>`}
function feed(){let f='';const L=()=>tracks().filter(j=>!f||j.genre===f).sort((a,b)=>(b.tiktok?.view_count??b.views)-(a.tiktok?.view_count??a.views));
 const draw=()=>{const LL=L();setCtx(LL);$('#feed').innerHTML=LL.map(j=>`<section class="slide paused" data-id="${j.id}" style="--g:${grad(j)};${j.artwork?`background:url(${j.artwork}) center/cover`:''}"><div class="bars">${'<i></i>'.repeat(24)}</div>
 <div class="kicker">${esc(j.genre||j.theme)} · ${fmt(j.durationSec)}</div><h3>${esc(j.title)}</h3><div class="meta">Full length · free · ${views(j)} views</div>
 <div class="row"><button onclick="play('${j.id}')">▶ Play from the start</button><button class="ghost" onclick="dl('${j.id}')">⬇ MP3 · ${size(j)}</button><a href="#/j/${j.id}"><button class="ghost">Details</button></a>${j.previewUrl?`<a href="${j.previewUrl}" target="_blank" rel="noopener"><button class="ghost">TikTok</button></a>`:''}</div></section>`).join('');obs()};
 V.innerHTML=`<div id="feedTop"><button class="ghost" data-f="">All signals</button>${cat.genres.map(t=>`<button class="ghost" data-f="${t}">${t}</button>`).join('')}</div><div id="feed"></div>`;
 $('#feedTop').onclick=e=>{if(e.target.dataset.f!==undefined){f=e.target.dataset.f;draw()}};draw()}
function obs(){const io=new IntersectionObserver(es=>es.forEach(e=>{const s=e.target,j=cat.journeys.find(x=>x.id===s.dataset.id);if(e.isIntersecting&&e.intersectionRatio>.6){s.classList.remove('paused');if(j.hasAudio&&A.paused)playSample(j.id,true)}else s.classList.add('paused')}),{threshold:[.6]});document.querySelectorAll('.slide').forEach(s=>io.observe(s))}
const testerQ=()=>'';

const views=j=>{const v=j.tiktok?.view_count??j.views??0;return v>=1000?(v/1000).toFixed(1)+'K':v};
const shelf=(title,sub,L)=>`<h2>${title}</h2><p class="sub">${sub}</p><div class="shelf">${L.map(card).join('')}</div>`;
const GC=g=>`hsl(${hue(g)},70%,60%)`;
function landing(){const T=tracks(),p=cat.profiles||[],hrs=(T.reduce((a,j)=>a+j.durationSec,0)/3600).toFixed(0);
 const newest=[...T].sort((a,b)=>(b.releaseDate||'').localeCompare(a.releaseDate||'')).slice(0,10),top=[...T].sort((a,b)=>(b.tiktok?.view_count??b.views)-(a.tiktok?.view_count??a.views)).slice(0,10),epic=T.filter(j=>j.durationSec>=2700).slice(0,10);
 V.innerHTML=`<div class="wrap"><section class="hero"><div class="kicker">JonHarmonic · Resonix Records · Heusden NL</div>
 <h1>Music that <em>takes its time.</em></h1>
 <p>${T.length} long-form instrumental journeys — ${hrs} hours of unbroken sound, ${spanText(T)} each. Everything JonHarmonic ever posted on TikTok, complete and in one place. Free to stream and download in full. Not for short attention spans. Made for the moment you stop scrolling and start listening.</p>
 <div class="row"><a href="#/feed"><button>▶ Start the feed</button></a><a href="#/all"><button class="ghost">Browse all ${T.length}</button></a><a href="#/support"><button class="ghost">♥ Support Jon</button></a></div>
 <div class="stats"><div><b>${T.length}</b><span>journeys</span></div><div><b>${hrs} h</b><span>of music</span></div><div><b>${(p.reduce((a,x)=>a+(x.likes||0),0)).toLocaleString('en')}</b><span>TikTok likes</span></div></div>
 <svg class="waves" viewBox="0 0 1200 200" preserveAspectRatio="none"><path d="M0 100 Q75 20 150 100 T300 100 T450 100 T600 100 T750 100 T900 100 T1050 100 T1200 100" stroke="#a98bff" stroke-width="3" fill="none"/><path d="M0 120 Q100 60 200 120 T400 120 T600 120 T800 120 T1000 120 T1200 120" stroke="#3fd0ff" stroke-width="2" fill="none"/></svg></section>
 <h2>Why long?</h2><p class="manifesto">Most music is cut to fit a 15-second scroll. This isn't. Every piece is a long, unbroken story of frequencies, textures and rhythm that unfolds slowly, the way real feeling does. Headphones on, give it the full length, and notice what shifts. The power isn't in the music. It's in you. The music just gives you room to hear it.</p>
 <p class="note">An invitation, not a treatment: no medical or health claims are made. Tuning tags (e.g. 432 Hz) appear only where Jon has confirmed them.</p>
 <h2>Who is JonHarmonic?</h2><p class="sub">One artist, two channels. Resonix Records is Jon's own label.</p>
 <div class="profiles">${p.map(x=>`<div class="card"><div class="kicker">@${x.handle}</div><h3>${esc(x.name)}</h3><p class="meta">“${esc(x.bio)}”</p><div class="meta">${x.followers?x.followers.toLocaleString('en')+' followers · ':''}${x.likes.toLocaleString('en')} likes · ${T.filter(j=>j.account===x.handle).length} journeys here</div><div class="row"><a href="${x.url}" target="_blank" rel="noopener"><button class="ghost">TikTok ↗</button></a><a href="#/all/${x.handle}"><button class="ghost">Listen here</button></a></div></div>`).join('')}</div>
 ${shelf('New','Latest posts, newest first.',newest)}${shelf('Most played','The journeys that travelled furthest on TikTok.',top)}
 <h2>Genres</h2><p class="sub">From psytrance rituals to cinematic calm.</p><div class="grid">${cat.genres.map(g=>`<a class="card state" style="--c:${GC(g)};text-decoration:none" href="#/genre/${encodeURIComponent(g)}"><h3>${g}</h3><div class="meta">${T.filter(j=>j.genre===g).length} journeys</div></a>`).join('')}</div>
 <h2>Choose your state</h2><p class="sub">Or browse by what you want to feel.</p>${statesGrid()}
 ${shelf('45 minutes and up','For the deep end.',epic)}
 <h2>How it works</h2><div class="grid">
  <div class="card"><h3>1 · Listen free</h3><p class="meta">Every journey streams in full length. No account, no paywall, no ads.</p></div>
  <div class="card"><h3>2 · Download free</h3><p class="meta">Every track is a free MP3 download — the original file, not re-encoded.</p></div>
  <div class="card"><h3>3 · Support if you like</h3><p class="meta">Pay what you want, by card or crypto. Every donation goes to JonHarmonic.</p></div>
  <div class="card"><h3>Straight to the artist</h3><p class="meta">No streaming service in between. Resonix Records is Jon's own label.</p></div></div>
 <a class="cta-banner" href="#/support"><span>No paywall. Just you and the music.</span><b>Support Jon ♥</b></a><div class="row" style="margin-top:14px"><a href="#/feed"><button class="ghost">Start listening</button></a></div>
 ${footer()}</div>`}
function genres(){const T=tracks();V.innerHTML=`<div class="wrap"><h2>Genres</h2><div class="grid">${cat.genres.map(g=>`<a class="card state" style="--c:${GC(g)};text-decoration:none" href="#/genre/${encodeURIComponent(g)}"><h3>${g}</h3><div class="meta">${T.filter(j=>j.genre===g).length} journeys</div></a>`).join('')}</div></div>`}
function genre(g){const L=tracks().filter(j=>j.genre===g);V.innerHTML=`<div class="wrap"><section class="hero" style="min-height:34vh"><div class="kicker">Genre</div><h1 style="color:${GC(g)}">${esc(g)}</h1><p>${L.length} journeys · ${(L.reduce((a,j)=>a+j.durationSec,0)/3600).toFixed(1)} hours</p><div class="row"><a href="#/feed"><button>Open the feed</button></a><button class="ghost" onclick="dlAll('${esc(g).replace(/'/g,"\\'")}')">⬇ Download all · ${L.length} MP3 · ${mb(L.reduce((a,j)=>a+(j.file?.bytes||0),0))}</button></div></section>
 <div class="grid">${L.sort((a,b)=>(b.tiktok?.view_count??b.views)-(a.tiktok?.view_count??a.views)).map(card).join('')}</div><p class="note">Genres are derived from Jon's own hashtags; some are uncertain.</p></div>`}
function track(id){const j=cat.journeys.find(x=>x.id===id);if(!j||j.free)return landing();if(!ctx.includes(j.id))setCtx(tracks().filter(x=>x.genre===j.genre));const tk=j.tiktok||{},ch=j.chapters||[];
 const next=upNext(j.id,8);
 V.innerHTML=`<div class="wrap"><div class="yt"><div><div class="player-art" style="--g:${grad(j)};${j.artwork?`background:url(${j.artwork}) center/cover`:''}">${j.hasAudio?`<button onclick="play('${j.id}')">▶ Play · ${fmt(j.durationSec)}</button>`:''}</div>
 <h1 style="font-size:1.6rem;margin:14px 0 6px">${esc(j.title)}</h1>
 <div class="meta">${esc(j.account==='resonixrecords'?'Resonix Records':'JonHarmonic')} · ${j.releaseDate||''} · ${fmt(j.durationSec)} · ${esc(j.genre||'')} · ${esc(j.theme||'')}</div>
 <div class="stats small"><div><b>${views(j)}</b><span>views</span></div><div><b>${tk.like_count??'–'}</b><span>likes</span></div><div><b>${tk.comment_count??'–'}</b><span>comments</span></div><div><b>${tk.repost_count??'–'}</b><span>shares</span></div></div>
 ${dlPanel(j)}<div class="row">${window.JH_APK?'':`<button class="ghost" id="offBtn" onclick="toggleOffline('${j.id}')">⤓ Save offline</button>`}<a href="#/support"><button class="ghost">♥ Support Jon</button></a>${j.previewUrl?`<a href="${j.previewUrl}" target="_blank" rel="noopener"><button class="ghost">TikTok ↗</button></a>`:''}</div>
 <div class="card" style="margin-top:14px"><b>Description</b><p class="meta" style="white-space:pre-wrap">${esc(tk.description||j.story||'')}</p>${(tk.hashtags||[]).map(h=>`<span class="tag">${esc(h)}</span>`).join('')}
 </div></div>
 <aside><b>Up next</b> <span class="meta">${next.length?'· plays automatically':''}</span>${next.map(x=>`<a class="upnext" href="#/j/${x.id}"><div class="thumb" style="--g:${grad(x)};${x.artwork?`background:url(${x.artwork}) center/cover`:''}"></div><div><div>${esc(x.title)}</div><div class="meta">${fmt(x.durationSec)} · ${views(x)} views</div></div></a>`).join('')}</aside></div></div>`;scrollTo(0,0);offlineState(j.id)}
// ---- Duration span for hero copy (computed from catalog) ----
function spanText(T){if(!T.length)return '';const d=T.map(j=>j.durationSec),mn=Math.floor(Math.min(...d)/60),mx=Math.max(...d);
 const top=mx>=55*60&&mx<3600?'nearly an hour':mx>=3600?'over an hour':Math.floor(mx/60)+' minutes';return `from ${mn} minutes to ${top}`}

// ---- Play queue (context = list the user came from: feed, genre, state, home row, all) ----
let ctx=[];const LISTS={};let lid=0;
const reg=L=>{const k='l'+(++lid);LISTS[k]=L.map(j=>j.id);return k};
const setCtx=L=>{ctx=L.map(j=>j.id||j)};
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a.card[data-l]');if(a&&LISTS[a.dataset.l])ctx=LISTS[a.dataset.l]});
window.queue=[];window.qi=-1;
const J=id=>cat.journeys.find(x=>x.id===id);
const playable=id=>{const j=J(id);return j&&j.hasAudio};
function upNext(id,n){const base=queue.includes(id)?queue:ctx.includes(id)?ctx:ctx;const i=base.indexOf(id);return (i<0?base:base.slice(i+1).concat(base.slice(0,i))).filter(x=>x!==id).slice(0,n).map(J).filter(Boolean)}

// ---- Main player ----
const A=$('#a0'),S=$('#sampler'),PP=$('#pp');
function setPP(){PP.textContent=A.paused?'\u25b6':'\u23f8'}
function play(id,fromQueue){const j=J(id);if(!j)return;
 if(!fromQueue||!queue.includes(id))queue=ctx.includes(id)?ctx.slice():[id];qi=queue.indexOf(id);
 $('#player').hidden=false;document.body.classList.add('has-player');sizePlayer();
 retries=0;A.src=sURL(id);A.dataset.id=id;
 A.volume=Math.pow(10,Math.min(0,j.gainDb||0)/20);A.play().catch(()=>{});
 $('#now').textContent=j.title;$('#now').onclick=()=>location.hash='#/j/'+id;
 $('#seek').value=0;$('#time').textContent='0:00 / '+fmt(j.durationSec);updNav()}
function step(dir){for(let i=qi+dir;i>=0&&i<queue.length;i+=dir)if(playable(queue[i])){play(queue[i],true);if(location.hash.startsWith('#/j/'))location.hash='#/j/'+queue[i];return true}return false}
function updNav(){$('#prev').disabled=!queue.slice(0,qi).some(playable);$('#next').disabled=!queue.slice(qi+1).some(playable)}
$('#prev').onclick=()=>{if(A.currentTime>5){A.currentTime=0;return}step(-1)};
$('#next').onclick=()=>step(1);
A.onended=()=>{setPP();if(!step(1)){$('#seek').value=1000}};
A.onplay=()=>{S.pause();setPP()};A.onpause=setPP;
A.ontimeupdate=()=>{if(A.currentTime>0)lastPos=A.currentTime;if(!A.duration||!isFinite(A.duration))return;$('#seek').value=A.currentTime/A.duration*1000;$('#time').textContent=fmt(A.currentTime)+' / '+fmt(A.duration)};
PP.onclick=()=>{A.paused?A.play().catch(()=>{}):A.pause()};
$('#seek').oninput=e=>{if(A.duration&&isFinite(A.duration))A.currentTime=e.target.value/1000*A.duration};
// sample player: mutually exclusive with main player
function playSample(id,auto){const j=J(id);S.src=sURL(id)+'#t='+Math.round((j?.durationSec||0)*.25);S.play().catch(()=>{})}
S.onplay=()=>{if(!A.paused)A.pause()};
// sleep timer with fade
let sleepEnd=0;$('#sleep').onchange=e=>{sleepEnd=+e.target.value?Date.now()+e.target.value*60000:0};
setInterval(()=>{if(!sleepEnd)return $('#sleepLeft').textContent='';const l=sleepEnd-Date.now();$('#sleepLeft').textContent=fmt(Math.max(0,l/1000));if(l<30000)A.volume=Math.max(0,l/30000);if(l<=0){A.pause();A.volume=1;sleepEnd=0;$('#sleep').value=0}},1000);
// keep page content clear of the fixed player (feed buttons etc.)
function sizePlayer(){const p=$('#player');document.documentElement.style.setProperty('--ph',(p.hidden?0:p.offsetHeight+20)+'px')}
new ResizeObserver(sizePlayer).observe($('#player'));addEventListener('resize',sizePlayer);

// ---- In-app modal (replaces prompt()/alert()) ----
function modal(html){closeModal();const m=document.createElement('div');m.id='modal';m.innerHTML=`<div class="mbox" role="dialog" aria-modal="true"><button class="x ghost" aria-label="Close" onclick="closeModal()">\u2715</button>${html}</div>`;
 m.onclick=e=>{if(e.target===m)closeModal()};document.body.appendChild(m);document.addEventListener('keydown',escClose);setTimeout(()=>{const f=m.querySelector('input');f&&f.focus()},30);return m}
function escClose(e){if(e.key==='Escape')closeModal()}
function closeModal(){$('#modal')?.remove();document.removeEventListener('keydown',escClose)}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),3500)}
const okEmail=e=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
function payModal(type,id){const j=id&&J(id);
 const cfg={journey:{t:'Own \u201c'+(j?.title||'')+'\u201d',d:'Stream it in full and download it, forever. Pay what you want.',min:j?.priceCents||200,presets:[j?.priceCents||200,500,1000],pwyw:true},
  tip:{t:'Leave a tip for JonHarmonic',d:'Goes straight to the artist.',min:200,presets:[300,500,1000],pwyw:true},
  membership:{t:'Join the '+cat.membership.title,d:'All journeys, streaming and downloads. Cancel anytime.',min:cat.membership.priceCents,presets:[],pwyw:false}}[type];
 const m=modal(`<div class="kicker">${cat.demo?'Demo \u00b7 test mode \u2014 no real payment':'Stripe test mode'}</div><h3>${esc(cfg.t)}</h3><p class="meta">${cfg.d}</p>
 <form novalidate><label>Email <span class="meta">(your library is linked to it)</span><input name="email" type="email" autocomplete="email" value="${esc(email)}" required></label>
 ${cfg.pwyw?`<div class="presets">${cfg.presets.map(c=>`<button type="button" class="ghost" data-c="${c}">${eur(c)}</button>`).join('')}</div>
 <label>Amount (minimum ${eur(cfg.min)})<input name="amount" inputmode="decimal" value="${(cfg.min/100).toFixed(2).replace('.',',')}"></label>`:`<p><b>${eur(cfg.min)}</b> / month</p>`}
 <p class="err" role="alert"></p><button type="submit" class="pay">${type==='membership'?'Join':'Pay'} ${cfg.pwyw?eur(cfg.min):eur(cfg.min)}</button></form>`);
 const f=m.querySelector('form'),err=m.querySelector('.err'),btn=m.querySelector('.pay');
 const amt=()=>cfg.pwyw?Math.round(parseFloat(String(f.amount.value).replace(/[\u20ac\s]/g,'').replace(',','.'))*100):cfg.min;
 const sync=()=>{const a=amt();btn.textContent=(type==='membership'?'Join ':'Pay ')+(a>0?eur(a):'');m.querySelectorAll('.presets button').forEach(b=>b.classList.toggle('on',+b.dataset.c===a))};
 m.querySelectorAll('.presets button').forEach(b=>b.onclick=()=>{f.amount.value=(b.dataset.c/100).toFixed(2).replace('.',',');sync()});
 if(cfg.pwyw)f.amount.oninput=sync;sync();
 f.onsubmit=async e=>{e.preventDefault();err.textContent='';const em=f.email.value.trim().toLowerCase(),a=amt();
  if(!okEmail(em))return err.textContent='Please enter a valid email address.';
  if(!(a>=cfg.min))return err.textContent='Minimum is '+eur(cfg.min)+'.';
  if(a>100000)return err.textContent='Maximum is \u20ac1.000,00.';
  btn.disabled=true;btn.textContent='Processing\u2026';
  try{const r=await(await fetch('/api/checkout',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type,id,email:em,amountCents:a})})).json();
   email=em;localStorage.email=em;
   if(!r.url)throw new Error(r.error||'Checkout failed');
   if(r.url.startsWith('/')){closeModal();await load();toast(type==='tip'||type==='donation'?'Thank you! (demo \u2014 no money moved)':'Unlocked \u2014 demo payment, no money moved.')}else location.href=r.url}
  catch(x){err.textContent=x.message;btn.disabled=false;sync()}}}

// ---- Save offline (Cache API; served by service worker incl. Range) ----
const OFF='jh-audio',offKey=id=>new URL(sURL(id),location.href).pathname;
async function isSaved(id){if(!('caches'in self))return false;const c=await caches.open(OFF);return !!(await c.match(offKey(id)))}
async function offlineState(id){const b=$('#offBtn');if(!b)return;if(!('caches'in self)){b.disabled=true;b.textContent='Offline not supported';return}
 b.textContent=(await isSaved(id))?'\u2713 Saved offline \u00b7 remove':'\u2913 Save offline';b.classList.toggle('saved',await isSaved(id))}
async function toggleOffline(id){const b=$('#offBtn'),c=await caches.open(OFF);
 if(await c.match(offKey(id))){await c.delete(offKey(id));toast('Removed from offline');return offlineState(id)}
 b.disabled=true;b.textContent='Saving\u2026';
 if(JHNET.mobile()&&!(await confirmMobile('Save offline',J(id)?.file?.bytes||0)))return offlineState(id);
 try{const r=await fetch(sURL(id),{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);
  const blob=await r.blob();await c.put(offKey(id),new Response(blob,{headers:{'content-type':r.headers.get('content-type')||'audio/mpeg','content-length':blob.size}}));toast('Saved for offline listening')}
 catch(x){toast('Could not save: '+x.message);JHERR.log('download','Offline opslaan mislukt ('+id+'): '+x.message,'',{silent:true})}b.disabled=false;offlineState(id)}



// ===================== v1.0: free downloads, donations, crypto, Foutenrapport, robust streaming =====================
const sURL=id=>window.JH_STREAM_URL?window.JH_STREAM_URL(id):'/api/stream/'+id;
const dURL=id=>window.JH_DOWNLOAD_URL?window.JH_DOWNLOAD_URL(id):'/api/download/'+id;
const mb=b=>b>=1e9?(b/1e9).toFixed(2).replace('.',',')+' GB':(b/1e6).toFixed(1).replace('.',',')+' MB';
const size=j=>j.file?mb(j.file.bytes):'';
const fname=j=>('JonHarmonic - '+j.title).replace(/[\\/:*?"<>|]/g,'')+'.mp3';
function footer(){return `<footer class="foot"><div><img src="/jonharmonic/icons/icon-round.png" alt="" width="28" height="28"> <b>JonHarmonic</b> · Resonix Records</div><div class="row" style="margin:0"><a href="#/support">Support Jon</a><a href="#/crypto">Crypto</a><a href="#/all">All journeys</a><a href="#/errors">Foutenrapport</a></div><a class="foot-cta" href="#/support">No paywall. Just you and the music. <b>Support Jon</b></a><p class="note">All music is free to stream and download. Donations are voluntary. No medical or health claims are made.</p></footer>`}
function dlPanel(j){const f=j.file;if(!f)return '';
 return `<div class="dl card"><div class="dl-l"><div class="dl-ico">MP3</div><div><b>${esc(j.title)}</b><div class="meta">MP3 · ${f.bitrate} kbps · ${(f.sampleRate/1000).toFixed(1).replace('.',',')} kHz · ${f.channels===2?'stereo':'mono'} · ${mb(f.bytes)}</div><div class="note">Original file — no re-encoding. Free download.</div></div></div>
 <button class="dl-btn" onclick="dl('${j.id}')">⬇ Download MP3</button></div>`}
function confirmMobile(what,bytes){return new Promise(res=>{const m=modal(`<div class="kicker">${esc(JHNET.label()||'mobile data')}</div><h3>${esc(what)}: ${mb(bytes)}</h3><p class="meta">You seem to be on ${esc(JHNET.label()||'mobile data')}. This uses about <b>${mb(bytes)}</b> of data. Continue now, or wait for Wi-Fi.</p><div class="row"><button id="mOk">Continue · ${mb(bytes)}</button><button class="ghost" id="mNo">Wait for Wi-Fi</button></div>`);
 m.querySelector('#mOk').onclick=()=>{closeModal();res(true)};m.querySelector('#mNo').onclick=()=>{closeModal();res(false)};m.querySelector('.x').onclick=()=>{closeModal();res(false)}})}
async function dl(id,quiet){const j=J(id);if(!j||!j.file)return false;
 if(!quiet&&JHNET.mobile()&&!window.JH_APK&&!(await confirmMobile('Download',j.file.bytes)))return false;
 if(window.JHNative&&JHNative.saveTrack){try{JHNative.saveTrack(id,fname(j));if(!quiet)toast('Saving “'+j.title+'” to Downloads…');return true}catch(x){JHERR.log('download','Download mislukt ('+id+'): '+x.message);return false}}
 if(!navigator.onLine){JHERR.log('download','Download niet mogelijk: offline ('+id+')','',{notice:'Je bent offline — download later opnieuw'});return false}
 if(!/^https?:/.test(dURL(id)))try{const r=await fetch(dURL(id),{method:'HEAD',cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status)}catch(x){JHERR.log('download','Download mislukt ('+id+'): '+x.message,'',{notice:'Download mislukt — probeer opnieuw'});return false}
 const a=document.createElement('a');a.href=dURL(id);a.download=fname(j);a.rel='noopener';document.body.appendChild(a);a.click();a.remove();if(!quiet)toast('Download started · '+mb(j.file.bytes));return true}
async function dlAll(g){const L=tracks().filter(j=>j.genre===g&&j.file),tot=L.reduce((a,j)=>a+j.file.bytes,0);
 const m=modal(`<div class="kicker">Download all</div><h3>${esc(g)}</h3><p class="meta">${L.length} MP3 files · ${mb(tot)} in total${JHNET.mobile()?` · <b>you seem to be on ${esc(JHNET.label())}</b>`:''}. Files download one after another; your browser may ask once to allow multiple downloads.</p><div class="row"><button id="mOk">Download ${L.length} files · ${mb(tot)}</button><button class="ghost" id="mNo">Cancel</button></div>`);
 m.querySelector('#mNo').onclick=closeModal;
 m.querySelector('#mOk').onclick=async()=>{closeModal();let ok=0;for(const j of L){if(await dl(j.id,true))ok++;await new Promise(r=>setTimeout(r,1200))}toast(ok+' of '+L.length+' downloads started')}}
// ---- Support Jon (card: TEST mode; crypto: live addresses from crypto-config.json) ----
let CRYPTO=null;
async function support(_,k){const q=new URLSearchParams(location.hash.split('?')[1]||''),thanks=+q.get('thanks');
 V.innerHTML=`<div class="wrap"><section class="hero sup"><div class="kicker">Support Jon</div><h1>Free music. Real support. <em>Keep the sound alive.</em></h1><p>All ${tracks().length} journeys are free to stream and download in full. If the music means something to you, pay what you want — once, any amount. It goes straight to JonHarmonic.</p>
 <div class="row"><a href="#/support"><button>♥ Donate by card</button></a><a href="#/crypto" id="sDonCrypto"><button class="ghost">Donate with crypto</button></a></div></section>
 ${thanks?`<div class="card thanks"><h3>Thank you! ♥</h3><p class="meta">Your test donation of ${eur(thanks)} was recorded. <b>Test mode:</b> no real money was moved.</p></div>`:''}${q.get('cancel')?`<div class="card"><p class="meta">Donation cancelled — nothing was charged.</p></div>`:''}
 <div class="sup-grid"><div class="card" id="fiat"><div class="testbadge">TEST MODE — no real payment</div><h2 style="margin-top:8px">Pay what you want</h2><p class="sub">Choose an amount or enter your own.</p>
 <div class="presets big">${[300,500,1000,2500].map(c=>`<button type="button" class="ghost" data-c="${c}">${eur(c)}</button>`).join('')}</div>
 <form novalidate><label>Custom amount (€1 – €1.000)<input name="amount" inputmode="decimal" value="5,00" aria-label="Custom amount in euro"></label>
 <label>Email <span class="meta">(optional, for a receipt)</span><input name="email" type="email" autocomplete="email" value="${esc(email)}"></label>
 <p class="err" role="alert"></p><button type="submit" class="pay">Donate €5,00</button><p class="note">Card payments run in ${cat.demo?'demo/test mode (simulated)':'Stripe test mode'} until Jon switches on live payments.</p></form></div>
 <div class="card"><h3>Where your support goes</h3><ul class="meta ticks"><li>New long-form journeys</li><li>Better masters as Jon supplies them</li><li>Keeping everything free and ad-free</li></ul></div></div>
 <section id="cryptoS"><h2 id="cryptoH">Donate with crypto</h2><p class="crypto-line">Every coin keeps the music free.</p><div id="cwarn"></div><div class="grid crypto" id="cg"><div class="meta">Loading…</div></div></section>${footer()}</div>`;
 const f=$('#fiat form'),err=$('#fiat .err'),btn=$('#fiat .pay');
 const amt=()=>Math.round(parseFloat(String(f.amount.value).replace(/[€\s]/g,'').replace(/\.(?=\d{3})/g,'').replace(',','.'))*100);
 const sync=()=>{const a=amt();btn.textContent='Donate '+(a>0?eur(a):'');document.querySelectorAll('#fiat .presets button').forEach(b=>b.classList.toggle('on',+b.dataset.c===a))};
 document.querySelectorAll('#fiat .presets button').forEach(b=>b.onclick=()=>{f.amount.value=(b.dataset.c/100).toFixed(2).replace('.',',');sync()});f.amount.oninput=sync;sync();
 f.onsubmit=async e=>{e.preventDefault();err.textContent='';const a=amt(),em=f.email.value.trim().toLowerCase();
  if(!(a>=100))return err.textContent='Minimum is €1,00.';if(a>100000)return err.textContent='Maximum is €1.000,00.';if(em&&!okEmail(em))return err.textContent='Please enter a valid email address (or leave it empty).';
  btn.disabled=true;btn.textContent='Processing…';
  try{const r=await(await fetch('/api/checkout',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type:'donation',email:em,amountCents:a})})).json();
   if(em){email=em;localStorage.email=em}if(!r.url)throw new Error(r.error||'Checkout failed');if(r.url.startsWith('/')){location.hash=r.url.slice(1);if(location.hash===r.url.slice(1))support()}else location.href=r.url}
  catch(x){err.textContent=x.message;btn.disabled=false;sync();JHERR.log('payment','Donatie mislukt: '+x.message,'',{silent:true})}};
 try{CRYPTO=CRYPTO||await(await fetch('/jonharmonic/crypto-config.json',{cache:'no-store'})).json()}catch(x){$('#cg').innerHTML='<p class="err">Crypto details could not be loaded.</p>';return}
 const W=(CRYPTO.wallets||[]).map((w,i)=>({...w,i,address:String(w.address||'').trim()})).filter(w=>w.address);
 if(!W.length){$('#cryptoS').remove();$('#sDonCrypto')?.remove()}else{
 const nets=[...new Set(W.map(w=>w.network))];
 $('#cwarn').innerHTML=`<div class="netwarn" role="note"><b>⚠ Send only via ${nets.map(esc).join(' / ')}.</b> ${nets.length===1&&/ERC-20/.test(nets[0])?'ETH and USDT go to the same address. Tokens sent on any other network (e.g. Tron, BNB Chain, Solana) will be lost.':'Each address below shows its network. Funds sent on the wrong network will be lost.'}</div>`;
 $('#cg').innerHTML=W.map(w=>`<div class="card wallet"><div class="w-h"><span class="coin">${esc(w.symbol)}</span><div><b>${esc(w.name)}</b><div class="meta">Network: <b>${esc(w.network)}</b></div></div></div>
  <div class="qr" id="qr${w.i}"></div><label class="meta">Address</label><div class="addr">${esc(w.address)}</div>
  <button class="ghost" onclick="copyAddr(${w.i})">Copy address</button></div>`).join('')+`<p class="note" style="grid-column:1/-1">Crypto donations go directly to Jon's wallet and cannot be refunded — double-check the address and network before sending.</p>`;
 W.forEach(w=>{if(window.qrcode){const q=qrcode(0,'M');q.addData(w.address);q.make();$('#qr'+w.i).innerHTML=q.createSvgTag({cellSize:4,margin:2,scalable:true})}})}
 if(k==='crypto'&&$('#cryptoH'))setTimeout(()=>$('#cryptoH').scrollIntoView({behavior:'smooth'}),60);else scrollTo(0,0)}
window.copyAddr=i=>{navigator.clipboard?.writeText(String(CRYPTO.wallets[i].address).trim()).then(()=>toast('Address copied')).catch(()=>toast('Copy failed'))};
// ---- Foutenrapport ----
async function errorsPage(){const L=JHERR.read();let srv=null;if(!window.JH_APK&&!window.JH_STATIC){try{const r=await fetch('/api/errors');if(r.ok)srv=await r.json()}catch(x){}}
 const row=e=>`<tr><td>${new Date(e.at).toLocaleString('nl-NL')}</td><td><span class="tag">${esc(e.type)}</span></td><td>${esc(e.msg)}</td><td class="meta">${esc(e.where)}</td></tr>`;
 const n=JHNET.info();
 V.innerHTML=`<div class="wrap"><h2>Foutenrapport</h2><p class="sub">Errors on this device are kept here locally${srv?' and in the server log (data/error-log.jsonl)':''}. Nothing is sent to an outside service.</p>
 <div class="row"><span class="tag">${navigator.onLine?'Online':'Offline'}</span><span class="tag">Connection: ${esc(n.type||'unknown')} ${esc(n.eff||'')}</span><span class="tag">${L.length} local entries</span><button class="ghost" onclick="copyReport()">Copy report</button><button class="ghost" onclick="JHERR.clear();errorsPage()">Clear local log</button></div>
 <div class="card" style="margin-top:14px;overflow-x:auto"><table class="errt"><thead><tr><th>Time</th><th>Type</th><th>Message</th><th>Where</th></tr></thead><tbody>${L.length?L.map(row).join(''):'<tr><td colspan="4" class="meta">No errors recorded. 👍</td></tr>'}</tbody></table></div>
 ${srv?`<h3 style="margin-top:28px">Server log (last ${srv.length})</h3><div class="card" style="overflow-x:auto"><table class="errt"><tbody>${srv.length?srv.slice(0,100).map(row).join(''):'<tr><td class="meta">Empty.</td></tr>'}</tbody></table></div>`:''}${footer()}</div>`;scrollTo(0,0)}
window.copyReport=()=>{const t=JHERR.read().map(e=>new Date(e.at).toISOString()+' ['+e.type+'] '+e.msg+' @'+e.where).join('\n')||'No errors';navigator.clipboard?.writeText(t).then(()=>toast('Report copied')).catch(()=>toast('Copy failed'))};
// ---- Robust streaming: buffering indicator, retry/resume on network drops ----
let retries=0,lastPos=0,stallT=0;
const buf=on=>{$('#player').classList.toggle('buffering',on);$('#bufmsg').textContent=on?(navigator.onLine?'Buffering…':'Offline — waiting for connection…'):''};
function resume(){const id=A.dataset.id;if(!id)return;const at=lastPos;A.src=sURL(id);A.currentTime=at;A.play().catch(()=>{})}
A.addEventListener('waiting',()=>{buf(true);clearTimeout(stallT);stallT=setTimeout(()=>{if(!A.paused&&A.readyState<3&&navigator.onLine){JHERR.log('network','Stream hapert >12s, opnieuw verbinden ('+A.dataset.id+' @'+fmt(lastPos)+')','',{silent:true});resume()}},12000)});
A.addEventListener('playing',()=>{buf(false);clearTimeout(stallT);retries=0});
A.addEventListener('canplay',()=>buf(false));
A.addEventListener('error',()=>{if(!A.dataset.id||!A.getAttribute('src'))return;const c=A.error?A.error.code:0;
 if(!navigator.onLine){buf(true);JHERR.log('network','Afspelen onderbroken: offline ('+A.dataset.id+' @'+fmt(lastPos)+')','',{notice:'Offline — playback resumes when you reconnect'});return}
 if(retries<5){retries++;buf(true);JHERR.log('audio','Afspeelfout (code '+c+'), poging '+retries+'/5 ('+A.dataset.id+')','',{silent:true});setTimeout(resume,Math.min(8000,1000*2**(retries-1)))}
 else JHERR.log('audio','Afspelen mislukt na 5 pogingen ('+A.dataset.id+')','',{notice:'This track could not be played. Check your connection.'})});
S.addEventListener('error',()=>{if(S.getAttribute('src'))JHERR.log('audio','Feed-voorbeeld kon niet laden','',{silent:true})});
addEventListener('online',()=>{if(A.dataset.id&&(A.error||$('#player').classList.contains('buffering'))){retries=0;resume()}});
addEventListener('offline',()=>{if(A.dataset.id&&!A.paused)buf(true)});

load();
