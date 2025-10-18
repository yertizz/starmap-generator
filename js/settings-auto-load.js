// TIMESTAMP CONFIRMATION: 2025-09-08 19:55 UTC
// One-time, silent auto-load of settings on startup (no auto-save)
(function(){
  // Minimal toast utility (bottom-right)
  function ensureToastHost(){
    var topBar = document.getElementById('top-settings-buttons');
    if (topBar) {
      var inline = document.getElementById('toast-host-inline');
      if (!inline) {
        inline = document.createElement('div');
        inline.id = 'toast-host-inline';
        inline.style.cssText = 'display:flex;align-items:center;gap:8px;margin-left:12px;';
        // insert after Save button if present
        var saveTop = document.getElementById('saveSettingsBtnTop');
        if (saveTop && saveTop.parentNode === topBar) {
          topBar.insertBefore(inline, saveTop.nextSibling);
        } else {
          topBar.appendChild(inline);
        }
      }
      return inline;
    }
    // fallback: fixed bottom-right
    var host = document.getElementById('toast-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'toast-host';
      host.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:4000;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
      document.body.appendChild(host);
    }
    return host;
  }
  function showToast(msg, type){
    try {
      var host = ensureToastHost();
      var el = document.createElement('div');
      var bg = type==='error' ? '#c0392b' : (type==='success' ? '#2ecc71' : '#333');
      // button-like style
      el.style.cssText = 'color:#fff;background:'+bg+';padding:8px 12px;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.18);font:14px/1.2 system-ui,Segoe UI,Arial;pointer-events:auto;opacity:0;transition:opacity .25s;';
      // Capitalize "Loaded" if present
      try { el.textContent = String(msg).replace('loaded','Loaded'); } catch(_){ el.textContent = msg; }
      host.appendChild(el);
      requestAnimationFrame(function(){ el.style.opacity = '1'; });
      setTimeout(function(){ el.style.opacity='0'; setTimeout(function(){ el.remove(); }, 250); }, 2500);
    } catch(_){}
  }

  function autoLoadSilently(){
    try {
      if (typeof loadSavedSettings !== 'function') return;
      var oldAlert = window.alert;
      window.alert = function(){}; // suppress modal alerts during auto-load
      Promise.resolve(loadSavedSettings())
        .then(function(ok){
          window.alert = oldAlert;
          if (ok) {
            // Recenter map from loaded values
            try {
              var zipEl = document.getElementById('zip-code');
              var addrEl = document.getElementById('address');
              var zipVal = zipEl && zipEl.value ? zipEl.value.trim() : '';
              var addrVal = addrEl && addrEl.value ? addrEl.value.trim() : '';
              // Guard: only geocode after Maps is fully ready; otherwise queue it
              var mapsReady = false; try { mapsReady = (window.__MAPS_READY === true) && !!(window.google && google.maps); } catch(_){}
              if (zipVal && typeof geocodeZip === 'function') {
                if (mapsReady) { geocodeZip(zipVal); }
                else { try { window.__PENDING_GEO = window.__PENDING_GEO||[]; window.__PENDING_GEO.push({ type:'zip', value: zipVal }); } catch(_){} }
              } else if (addrVal && typeof geocodeAddress === 'function') {
                if (mapsReady) { geocodeAddress(addrVal); }
                else { try { window.__PENDING_GEO = window.__PENDING_GEO||[]; window.__PENDING_GEO.push({ type:'addr', value: addrVal }); } catch(_){} }
              }
            } catch(e){ console.warn('Auto-load recenter skipped:', e); }
            // Apply paper size and DPI from stored settings as a fallback
            try {
              var uid = (typeof getCurrentUserId==='function') ? getCurrentUserId() : 'default_user';
              var raw = localStorage.getItem(uid + '_app_settings');
              if (raw) {
                var s = JSON.parse(raw);
                if (s && typeof s==='object') {
                  if (s.paperAutoSize && document.getElementById('paper-auto-size')) {
                    document.getElementById('paper-auto-size').value = s.paperAutoSize;
                  }
                  var dpiSel = document.getElementById('dpi-selector') || document.getElementById('dpi');
                  if (dpiSel && s.dpi) dpiSel.value = s.dpi;
                }
              }
            } catch(e){ console.warn('Paper/DPI apply failed:', e); }
            showToast('Settings Loaded', 'success');
          } else {
            showToast('No saved settings found', 'info');
          }
        })
        .catch(function(err){ window.alert = oldAlert; console.warn('Auto-load failed:', err); showToast('Failed to load settings', 'error'); });
    } catch(e) { console.warn('Auto-load init error:', e); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoLoadSilently);
  else autoLoadSilently();
})();
