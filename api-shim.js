// Website data layer: replaces the Express API with static files. Fiat donations are TEST mode (simulated, no money moves).
(function(){window.JH_STATIC=true;const rf=window.fetch.bind(window);let FILES={};
const J=o=>new Response(JSON.stringify(o),{headers:{'content-type':'application/json'}});
window.JH_STREAM_URL=id=>FILES[id]?FILES[id]:'/missing/'+id;
window.JH_DOWNLOAD_URL=id=>FILES[id]?FILES[id]:'/missing/'+id;
window.fetch=async function(i,n){const u=new URL(typeof i==='string'?i:i.url,location.href),p=u.pathname;
 if(p==='/api/catalog'){const r=await rf('/jonharmonic/catalog.json');const c=await r.clone().json();c.journeys.forEach(j=>{if(j.file)FILES[j.id]=j.file.asset});return J(c)}
 if(p==='/api/checkout'){const b=JSON.parse((n&&n.body)||'{}');if(b.type!=='donation')return J({error:'Not available'});const a=Math.round(+b.amountCents||0);
  if(!(a>=100&&a<=100000))return J({error:'Bedrag moet tussen €1 en €1.000 liggen'});return J({url:'/jonharmonic/#/support?thanks='+a,demo:true})}
 if(p==='/api/stamps')return J([]);if(p==='/api/room')return J(null);
 if(p==='/api/errors'&&(!n||!n.method||n.method==='GET'))return J([]);
 return rf(i,n)}})();
