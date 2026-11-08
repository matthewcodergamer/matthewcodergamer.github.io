/* Website display ads.
   Paste the numeric "data-ad-slot" id of each Display ad unit below (AdSense >
   Ads > By ad unit > Display ads > Create, copy the data-ad-slot number).
   Units are only requested when they scroll near the viewport, so a long guide
   does not load every banner at once. While a slot is '' the page relies on
   Auto ads only and no broken unit is requested. */
window.SITE_AD_SLOTS = {
  top:    '',   // wide leaderboard above the launcher art (desktop)
  side:   '',   // sidebar square (desktop)
  wide:   '',   // banner under "Ready to Play"
  infeed: '',   // banner between the info sections
  page:   '',   // banner on the guide, privacy and article pages
  wait:   '',   // banner on the PLAY gate while the 15 s countdown runs
  hud:    ''    // small banner in the in-game HUD (passback when empty)
};
(function () {
  var CLIENT = 'ca-pub-5025566183652379';
  var FORMAT = { top: 'horizontal', side: 'rectangle', wide: 'horizontal', infeed: 'horizontal', page: 'auto', wait: 'rectangle', hud: 'horizontal' };

  function fill(el, slot) {
    if (!slot || el.getAttribute('data-ad-done')) return;
    el.setAttribute('data-ad-done', '1');
    var key = el.getAttribute('data-ad') || '';
    var ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', CLIENT);
    ins.setAttribute('data-ad-slot', slot);
    ins.setAttribute('data-ad-format', FORMAT[key] || 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');
    el.innerHTML = '';
    el.appendChild(ins);
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }

  function whenVisible(el, cb) {
    if (!('IntersectionObserver' in window)) { cb(); return; }
    if (el.getClientRects().length === 0) {
      /* Hidden until a dialog opens: fill it when it is shown. */
      var mo = new MutationObserver(function () {
        if (el.getClientRects().length) { mo.disconnect(); cb(); }
      });
      mo.observe(el, { attributes: true, attributeFilter: ['hidden', 'class', 'style'] });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { io.disconnect(); cb(); return; }
      }
    }, { rootMargin: '400px 0px' });
    io.observe(el);
  }

  function run() {
    document.querySelectorAll('[data-ad]').forEach(function (el) {
      var key = el.getAttribute('data-ad');
      var slot = window.SITE_AD_SLOTS[key];
      if (!slot) return;
      whenVisible(el, function () { fill(el, slot); });
    });
    if (window.SITE_AD_SLOTS.page && !document.querySelector('[data-ad]')) {
      var main = document.querySelector('main');
      if (main) {
        var d = document.createElement('div');
        d.setAttribute('data-ad', 'page');
        d.style.margin = '20px 0';
        var s = main.querySelector('section');
        main.insertBefore(d, s && s.nextSibling);
        whenVisible(d, function () { fill(d, window.SITE_AD_SLOTS.page); });
      }
    }
  }

  /* Used by the launcher gate, which is hidden when the page first loads. */
  window.mwFillAd = function (el, key) {
    if (!el) return;
    fill(el, window.SITE_AD_SLOTS[key]);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
