/* Ads on every click: each link on the site is a page change, which is where Google may show a
   full-screen ad.
   - AdSense Auto ads "Vignette" (turn it on in AdSense): shown by Google between pages; links simply
     navigate normally while H5 Games Ads is not active.
   - H5 Games Ads (Ad Placement API, once approved): every click first asks for an ad break, "start"
     before the game and "browse" for the other pages, then continues when the break is done.
   Google decides whether an ad is ready and how often; a player is never stuck (4 s fallback). */
(function(){
  var CLIENT='ca-pub-5025566183652379';
  if(!document.querySelector('script[src*="adsbygoogle.js"]')){
    var s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';
    s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+CLIENT;
    s.setAttribute('data-ad-frequency-hint','30s');document.head.appendChild(s);
  }
  window.adsbygoogle=window.adsbygoogle||[];
  if(typeof window.adBreak!=='function'){window.adBreak=window.adConfig=function(o){window.adsbygoogle.push(o)}}
  try{adConfig({preloadAdBreaks:'on',sound:'on',onReady:function(){window.__h5Ready=true}})}catch(e){}
  /* Arriving on the site: a full-screen "preroll" ad first (H5 Games Ads), once per visit */
  try{if(!sessionStorage.getItem('mw_preroll')){sessionStorage.setItem('mw_preroll','1');adBreak({type:'preroll',adBreakDone:function(){}})}}catch(e){}
  var WAIT=5; /* seconds on the PLAY loading screen while the ad loads/plays */

  var gate=null;
  function overlay(){
    if(gate)return gate;
    var st=document.createElement('style');st.textContent=
      '#adGate{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgba(10,10,10,.92);color:#fff;font-family:system-ui,sans-serif}'+
      '#adGate .b{display:grid;gap:12px;justify-items:center;text-align:center;padding:28px;border:3px solid #000;background:#3c3c3c url(/MinecraftWeb/assets/java/26.1/blocks/dirt.png);background-size:64px;image-rendering:pixelated;box-shadow:inset 0 0 0 2px #6b6b6b;max-width:90vw}'+
      '#adGate b{font-size:22px;text-shadow:2px 2px #3f3f3f}#adGate span{color:#d0d0d0;font-size:14px}'+
      '#adGate i{width:42px;height:42px;border:6px solid #555;border-top-color:#7fcf3f;animation:agS 1s steps(8) infinite}@keyframes agS{to{transform:rotate(360deg)}}';
    document.head.appendChild(st);
    gate=document.createElement('div');gate.id='adGate';
    gate.innerHTML='<div class="b"><i></i><b>Loading Minecraft Java…</b><span>A short ad keeps the game free</span><span id="agT"></span></div>';
    return gate;
  }
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
    var a=e.target.closest&&e.target.closest('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
    if(a.hasAttribute('data-adpass'))return;
    var u;try{u=new URL(a.href,location.href)}catch(x){return}
    if(u.origin!==location.origin)return;
    if(u.pathname===location.pathname&&u.search===location.search&&u.hash)return; /* same-page anchor */
    var game=/^\/MinecraftWeb\//.test(u.pathname);
    if(!game&&!window.__h5Ready)return;                                        /* website pages: vignette handles it */
    e.preventDefault();
    var done=false,showing=false,waited=!game,adDone=false;
    function go(){if(done||!waited||!adDone)return;done=true;
      /* the game only opens with a fresh PLAY pass (checked by MinecraftWeb/index.html) */
      if(game){try{localStorage.setItem('mw_play_pass',String(Date.now()))}catch(x){}}
      /* leave through a real link so AdSense's vignette (full-screen ad between pages) can still show */
      if(!window.__h5Ready){var l=document.createElement('a');l.href=u.href;l.setAttribute('data-adpass','1');l.style.display='none';document.body.appendChild(l);l.click();setTimeout(function(){location.href=u.href},2500)}
      else location.href=u.href}
    if(game){
      document.body.appendChild(overlay());var t=WAIT,el=document.getElementById('agT');
      /* banner on the loading screen when a slot id is set in site-ads.js (SITE_AD_SLOTS.wait) */
      try{var slot=window.SITE_AD_SLOTS&&SITE_AD_SLOTS.wait;if(slot&&!document.getElementById('agAd')){var d=document.createElement('div');d.id='agAd';d.style.cssText='width:min(336px,80vw);min-height:250px;margin-top:6px';d.innerHTML='<ins class="adsbygoogle" style="display:block;width:100%;min-height:250px" data-ad-client="'+CLIENT+'" data-ad-slot="'+slot+'" data-ad-format="rectangle"></ins>';gate.querySelector('.b').appendChild(d);(window.adsbygoogle=window.adsbygoogle||[]).push({})}}catch(x){}
      (function tick(){if(el)el.textContent=t>0?'Starting in '+t+'…':'Starting…';if(t--<=0){waited=true;go();return}setTimeout(tick,1000)})();
    }
    if(window.__h5Ready){
      try{adBreak({type:game?'start':'browse',name:game?'play_button':'site_link',beforeAd:function(){showing=true},adBreakDone:function(){adDone=true;setTimeout(go,120)}})}catch(x){adDone=true;go()}
      setTimeout(function(){if(!showing){adDone=true;go()}},game?WAIT*1000+1500:1500);
    }else{adDone=true;go()}
  },false);
})();
