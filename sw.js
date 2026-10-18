/* Minecraft Web site shell cache. Only the website pages and their images; the game (/MinecraftWeb/),
   ads and every other origin always go to the network untouched. */
const CACHE='mw-site-v13';
const SHELL=['/','/index.html','/guide.html','/privacy.html','/install.js','/ad-clicks.js','/site-ads.js','/manifest.webmanifest','/icons/icon-192.png','/icons/icon-512.png','/icons/apple-touch-icon.png','/img/hero.jpg','/img/village.jpg','/img/sunset.jpg','/img/title.jpg','/img/debug.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/MinecraftWeb'))return;
  if(e.request.mode==='navigate'){
    /* pages: network first so updates show at once, cache when offline */
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(k=>k.put(e.request,c));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('/'))));
    return;
  }
  if(!SHELL.includes(u.pathname))return;
  /* shell files: cached copy at once, refreshed in the background */
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{const net=fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(k=>k.put(e.request,c))}return r}).catch(()=>hit);return hit||net}));
});
