/* Website display ads. Paste the numeric "data-ad-slot" id of a Display ad unit
   (AdSense > Ads > By ad unit > Display ads > Create, copy the data-ad-slot number) below.
   Fixed units load right away and fill every time; while SLOT is '' the page relies on Auto ads only. */
var SITE_AD_SLOTS = {
  side:   '',   // sidebar square (desktop)
  wide:   '',   // banner under "Ready to Play"
  infeed: '',   // banner between the info sections
  page:   ''    // banner on the Game guide and Privacy pages
};
(function(){
  var CLIENT='ca-pub-5025566183652379';
  function fill(el,slot){
    if(!slot||el.getAttribute('data-ad-done'))return;el.setAttribute('data-ad-done','1');
    var ins=document.createElement('ins');ins.className='adsbygoogle';ins.style.display='block';
    ins.setAttribute('data-ad-client',CLIENT);ins.setAttribute('data-ad-slot',slot);
    ins.setAttribute('data-ad-format','auto');ins.setAttribute('data-full-width-responsive','true');
    el.innerHTML='';el.appendChild(ins);
    try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(e){}
  }
  function run(){
    document.querySelectorAll('[data-ad]').forEach(function(el){var k=el.getAttribute('data-ad');if(el.offsetParent!==null)fill(el,SITE_AD_SLOTS[k])});
    if(SITE_AD_SLOTS.page&&!document.querySelector('[data-ad]')){var m=document.querySelector('main');if(m){var d=document.createElement('div');d.setAttribute('data-ad','page');d.style.margin='20px 0';var s=m.querySelector('section');m.insertBefore(d,s&&s.nextSibling);fill(d,SITE_AD_SLOTS.page)}}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
