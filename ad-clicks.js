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
    gate.innerHTML='<div class="b"><i></i><b>Loading Minecraft Java…</b><span>A short ad keeps the game free</span></div>';
    return gate;
  }
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
    var a=e.target.closest&&e.target.closest('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
    var u;try{u=new URL(a.href,location.href)}catch(x){return}
    if(u.origin!==location.origin)return;
    if(u.pathname===location.pathname&&u.search===location.search&&u.hash)return; /* same-page anchor */
    if(!window.__h5Ready)return;                                               /* let the vignette handle it */
    e.preventDefault();
    var game=/^\/MinecraftWeb\//.test(u.pathname),done=false,showing=false;
    function go(){if(done)return;done=true;location.href=u.href}
    if(game)document.body.appendChild(overlay());
    try{adBreak({type:game?'start':'browse',name:game?'play_button':'site_link',beforeAd:function(){showing=true},adBreakDone:function(){setTimeout(go,120)}})}catch(x){go()}
    setTimeout(function(){if(!showing)go()},game?4000:1500);
  },false);
})();
