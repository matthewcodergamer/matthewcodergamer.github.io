/* "Install as an app": full-screen play from the Home Screen.
   - iPhone/iPad Safari: bottom banner with an arrow toward Share + a 3-step picture guide.
   - iPhone in Chrome/Firefox/Edge/in-app browsers: open in Safari first (or that browser's Share > Add to Home Screen).
   - Android Chrome: real "Install app" button (beforeinstallprompt).
   - Desktop or already installed: nothing. ✕ hides the banner for 7 days.
   Any element with [data-install-steps] gets the same guide as a permanent section. */
(function(){
  var KEY='mw_install_dismissed',WEEK=7*864e5,ua=navigator.userAgent||'';
  var ios=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1);
  var iphone=/iPhone|iPod/.test(ua);
  var android=/Android/.test(ua);
  var otherIOS=ios&&/CriOS|FxiOS|EdgiOS|OPiOS|GSA\/|FBAN|FBAV|Instagram|Line\/|Snapchat|TikTok|musical_ly|Twitter/.test(ua);
  var iosMajor=Math.max(+((/Version\/(\d+)/.exec(ua)||[])[1]||0),+((/OS (\d+)_/.exec(ua)||[])[1]||0)); /* iOS 26 Safari reports "OS 18_6" but Version/26 */
  var installed=navigator.standalone===true||(window.matchMedia&&(matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches));
  var html=document.documentElement;
  if(installed)html.classList.add('mwInstalled');
  function dismissed(){try{return Date.now()-(+localStorage.getItem(KEY)||0)<WEEK}catch(e){return false}}
  function dismiss(){try{localStorage.setItem(KEY,String(Date.now()))}catch(e){}hideBanner()}

  var css=''+
  'body{padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)}'+
  'html.mwInstalled body{padding-top:env(safe-area-inset-top)}'+
  '#mwInstall{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(12px + env(safe-area-inset-bottom));z-index:9000;width:min(560px,calc(100% - 24px - env(safe-area-inset-left) - env(safe-area-inset-right)));display:flex;align-items:center;gap:12px;padding:12px 14px;background:#1f1f1f;border:2px solid #000;box-shadow:inset 0 0 0 2px #4a4a4a,0 10px 30px rgba(0,0,0,.55);border-radius:12px;color:#f2f2f2;font:14px/1.35 system-ui,-apple-system,sans-serif;animation:mwUp .35s ease-out}'+
  '#mwInstall img{width:44px;height:44px;border-radius:10px;flex:none;image-rendering:pixelated}'+
  '#mwInstall .t{flex:1;min-width:0}#mwInstall b{display:block;font-size:15px}'+
  '#mwInstall .how{color:#9bd67a;background:none;border:0;padding:0;font:inherit;text-decoration:underline;cursor:pointer}'+
  '#mwInstall .btn{flex:none;background:#3c8527;color:#fff;border:2px solid #000;box-shadow:inset 0 -3px #275a19,inset 0 2px #52a535;padding:9px 14px;border-radius:6px;font-weight:700;font-size:15px;cursor:pointer}'+
  '#mwInstall .x{flex:none;width:32px;height:32px;border-radius:50%;border:0;background:#333;color:#ddd;font-size:16px;cursor:pointer}'+
  '.mwArrow{position:fixed;z-index:9001;font-size:30px;line-height:1;pointer-events:none;filter:drop-shadow(0 2px 3px #000);animation:mwBob 1s ease-in-out infinite}'+
  '.mwArrow.down{bottom:calc(env(safe-area-inset-bottom) - 6px);left:50%;margin-left:-15px}'+
  '.mwArrow.downR{bottom:calc(env(safe-area-inset-bottom) - 6px);right:calc(18px + env(safe-area-inset-right))}'+
  '.mwArrow.up{top:calc(4px + env(safe-area-inset-top));right:calc(64px + env(safe-area-inset-right));animation-name:mwBobUp}'+
  'body.mwHasBanner{padding-bottom:calc(96px + env(safe-area-inset-bottom))}'+
  '@keyframes mwUp{from{transform:translate(-50%,30px);opacity:0}}'+
  '@keyframes mwBob{50%{transform:translateY(8px)}}@keyframes mwBobUp{50%{transform:translateY(-8px)}}'+
  '#mwGuide{position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;padding:calc(16px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) calc(16px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left))}'+
  '#mwGuide .box{background:#1f1f1f;border:2px solid #000;box-shadow:inset 0 0 0 2px #4a4a4a;border-radius:14px;max-width:760px;width:100%;max-height:100%;overflow:auto;padding:18px;color:#f2f2f2;font:15px/1.45 system-ui,-apple-system,sans-serif}'+
  '#mwGuide h3{margin:0 0 12px;font-family:"Minecraft Seven",system-ui,sans-serif;font-weight:normal;font-size:22px}'+
  '#mwGuide .close{float:right;border:0;background:#333;color:#ddd;width:34px;height:34px;border-radius:50%;font-size:16px;cursor:pointer}'+
  '.mwSteps{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin:6px 0 10px}'+
  '.mwStep{background:#2a2a2a;border-radius:12px;padding:12px;text-align:center}.mwStep p{margin:10px 0 0;font-size:14px}.mwStep b{color:#9bd67a}'+
  '.mwPic{height:120px;border-radius:10px;background:#0e0e0e;position:relative;overflow:hidden;display:flex;align-items:flex-end;justify-content:center}'+
  '.mwBar{display:flex;justify-content:space-around;align-items:center;width:100%;height:38px;background:#2b2b2e;color:#3d8bfd;font-size:20px}'+
  '.mwBar span{opacity:.45}.mwBar .hi,.mwRow.hi{opacity:1;outline:3px solid #9bd67a;outline-offset:2px;border-radius:6px}'+
  '.mwSheet{position:absolute;inset:10px 10px 0;background:#2b2b2e;border-radius:10px 10px 0 0;padding:8px;display:grid;gap:6px;align-content:start}'+
  '.mwRow{display:flex;justify-content:space-between;align-items:center;background:#3a3a3d;border-radius:6px;padding:6px 10px;font-size:13px;color:#eee;text-align:left}'+
  '.mwRow i{font-style:normal;color:#ccc}'+
  '.mwHome{position:absolute;inset:10px;display:grid;grid-template-columns:repeat(4,44px);justify-content:center;gap:8px;align-content:start}'+
  '.mwHome div{aspect-ratio:1;border-radius:9px;background:#333}.mwHome img{width:100%;border-radius:9px;outline:3px solid #9bd67a;outline-offset:2px}'+
  '.mwNote{color:#b9b9b9;font-size:13px;margin:6px 0 0}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  var shareGlyph='<svg width="18" height="20" viewBox="0 0 18 22" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-3px"><path d="M9 14V2M4.5 6.5 9 2l4.5 4.5M5 9H2v11h14V9h-3"/></svg>';
  var ios26=iosMajor>=26;
  function stepsHTML(){
    var share=ios26?'Tap <b>•••</b> (bottom-right), then <b>Share</b> '+shareGlyph:'Tap <b>Share</b> '+shareGlyph+' in Safari’s toolbar';
    return '<div class="mwSteps">'+
      '<div class="mwStep"><div class="mwPic"><div class="mwBar"><span>‹</span><span>›</span><span class="hi" style="color:#3d8bfd">'+shareGlyph+'</span><span>▢</span><span>⧉</span></div></div><p>1. '+share+'</p></div>'+
      '<div class="mwStep"><div class="mwPic"><div class="mwSheet"><div class="mwRow"><span>Copy</span><i>⧉</i></div><div class="mwRow"><span>Add to Favorites</span><i>☆</i></div><div class="mwRow hi"><span>Add to Home Screen</span><i>⊞</i></div></div></div><p>2. Scroll down and tap <b>Add to Home Screen</b>.'+(ios26?' Leave <b>Open as Web App</b> on.':'')+' Then tap <b>Add</b>.</p></div>'+
      '<div class="mwStep"><div class="mwPic"><div class="mwHome"><div></div><div></div><div></div><div></div><div></div><img src="/icons/icon-192.png" alt=""><div></div><div></div></div></div><p>3. Open <b>Minecraft Web</b> from your Home Screen — it plays full-screen, no browser bars.</p></div>'+
    '</div>'+
    '<p class="mwNote">Android (Chrome): tap <b>Install app</b> when asked, or the <b>⋮</b> menu → <b>Install app</b> / <b>Add to Home screen</b>. iPhone in Chrome or another app: open this page in <b>Safari</b> first (or use that browser’s Share → Add to Home Screen if it has one).</p>';
  }
  function openGuide(){
    if(document.getElementById('mwGuide'))return;
    var g=document.createElement('div');g.id='mwGuide';g.setAttribute('role','dialog');g.setAttribute('aria-label','How to install');
    g.innerHTML='<div class="box"><button class="close" aria-label="Close">✕</button><h3>Play full-screen</h3>'+stepsHTML()+'</div>';
    g.addEventListener('click',function(e){if(e.target===g||e.target.classList.contains('close'))g.remove()});
    document.body.appendChild(g);
  }
  window.mwInstallGuide=openGuide;

  var banner=null,arrow=null;
  function hideBanner(){if(banner)banner.remove();if(arrow)arrow.remove();banner=arrow=null;document.body.classList.remove('mwHasBanner')}
  function showBanner(inner,arrowClass){
    if(banner||installed||dismissed())return;
    banner=document.createElement('div');banner.id='mwInstall';banner.setAttribute('role','region');banner.setAttribute('aria-label','Install Minecraft Web');
    banner.innerHTML='<img src="/icons/icon-192.png" alt="">'+inner+'<button class="x" aria-label="Dismiss">✕</button>';
    banner.querySelector('.x').onclick=dismiss;
    var how=banner.querySelector('.how');if(how)how.onclick=openGuide;
    document.body.appendChild(banner);document.body.classList.add('mwHasBanner');
    if(arrowClass){arrow=document.createElement('div');arrow.className='mwArrow '+arrowClass;arrow.textContent=arrowClass==='up'?'⬆️':'⬇️';document.body.appendChild(arrow)}
  }
  function arrowFor(){
    if(!iphone)return'up';                                   /* iPad: Share is top-right */
    if(innerWidth>innerHeight)return'up';                    /* iPhone landscape: compact top bar */
    return ios26?'downR':'down';
  }
  function boot(){
    document.querySelectorAll('[data-install-steps]').forEach(function(el){el.innerHTML=stepsHTML()});
    if(installed)return;
    if(ios&&!otherIOS){
      showBanner('<div class="t"><b>Play full-screen</b>'+(ios26?'Tap ••• → Share ⬆️, then ‘Add to Home Screen’.':'Tap Share ⬆️, then ‘Add to Home Screen’.')+' <button class="how">How?</button></div>',arrowFor());
      addEventListener('resize',function(){if(arrow)arrow.className='mwArrow '+arrowFor(),arrow.textContent=arrowFor()==='up'?'⬆️':'⬇️'});
    }else if(otherIOS){
      showBanner('<div class="t"><b>Play full-screen</b>Open this page in <b>Safari</b>, then Share → ‘Add to Home Screen’ (or use this browser’s Share → Add to Home Screen if it has one). <button class="how">How?</button></div>',null);
    }
  }
  /* Android Chrome (and desktop Chrome — ignored there: desktop shows nothing) */
  var deferred=null;
  addEventListener('beforeinstallprompt',function(e){
    e.preventDefault();deferred=e;
    if(!android)return;
    var go=function(){showBanner('<div class="t"><b>Install Minecraft Web</b>Play full-screen from your home screen.</div><button class="btn">Install app</button>',null);
      var b=banner&&banner.querySelector('.btn');if(b)b.onclick=function(){if(!deferred)return;deferred.prompt();deferred.userChoice.then(function(){deferred=null;hideBanner()})}};
    if(document.body)go();else addEventListener('DOMContentLoaded',go);
  });
  addEventListener('appinstalled',function(){installed=true;hideBanner()});
  if(document.readyState==='loading')addEventListener('DOMContentLoaded',boot);else boot();

  /* Installed app: landscape where the browser allows it */
  if(installed){try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(function(){})}catch(e){}}
  /* Site shell offline cache */
  if('serviceWorker' in navigator&&location.protocol==='https:')addEventListener('load',function(){navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(function(){})});
})();
