/* Google H5 Games Ads diagnostics.
 *
 * The actual queue stubs and the adConfig() preload call live in the inline
 * script immediately after the AdSense tag in index.html, so they are queued
 * before the async AdSense script loads (the order Google's H5 snippet uses).
 *
 * The Ad Placement API is not a normal global that AdSense defines for you:
 * adBreak()/adConfig() are queue stubs that push onto window.adsbygoogle.
 * Waiting for "real" functions was why the Play gate never requested a video.
 * The launcher calls adBreak() itself inside the PLAY click.
 */
(function () {
  window.adsbygoogle = window.adsbygoogle || [];

  function queue(placement) {
    window.adsbygoogle.push(placement);
  }
  if (typeof window.adConfig !== 'function') window.adConfig = queue;
  if (typeof window.adBreak !== 'function') window.adBreak = queue;

  window.__adDiag = window.__adDiag || {
    config: window.__h5Ready ? 'ready' : (window.__h5Configured ? 'queued' : 'missing'),
    ready: !!window.__h5Ready,
    lastBreak: null,
    updated: Date.now()
  };

  if (!window.__h5Configured) {
    try {
      window.adConfig({
        preloadAdBreaks: 'on',
        sound: 'on',
        onReady: function () {
          window.__h5Ready = true;
          window.__adDiag.config = 'ready';
          window.__adDiag.ready = true;
          window.__adDiag.updated = Date.now();
          console.info('[H5_ADS] Ad Placement API ready');
        }
      });
      window.__h5Configured = true;
    } catch (e) {
      window.__adDiag.config = 'error: ' + (e && e.message || e);
      window.__adDiag.updated = Date.now();
      console.warn('[H5_ADS] adConfig failed', e);
    }
  }

  /* onReady is not guaranteed on accounts where H5 Games Ads is not enabled.
     Do not block anything on it; adBreak() will return noAdPreloaded/notReady
     and the launcher falls back to its five-second sponsor gate. */
  setTimeout(function () {
    if (!window.__h5Ready) {
      window.__adDiag.config = 'no-onReady';
      window.__adDiag.updated = Date.now();
      console.info('[H5_ADS] API did not report ready; Play will still request a rewarded break');
    }
  }, 6000);
})();
