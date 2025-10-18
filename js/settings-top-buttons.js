// Wire top Save/Load buttons to existing async functions
(function(){
  function onReady(fn){ if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fn);} else { fn(); } }
  onReady(function(){
    var loadTop = document.getElementById('loadSettingsBtnTop');
    var saveTop = document.getElementById('saveSettingsBtnTop');
    if (loadTop && !loadTop.dataset.listenerAttached) {
      loadTop.addEventListener('click', async function(e){
        e.preventDefault();
        try {
          var ok = await (typeof loadSavedSettings==='function' ? loadSavedSettings() : Promise.resolve(false));
          // After load, attempt to recenter map from ZIP or Address
          try {
            var zipEl = document.getElementById('zip-code');
            var addrEl = document.getElementById('address');
            var zipVal = zipEl && zipEl.value ? zipEl.value.trim() : '';
            var addrVal = addrEl && addrEl.value ? addrEl.value.trim() : '';
            if (zipVal && typeof geocodeZip==='function') { geocodeZip(zipVal); }
            else if (addrVal && typeof geocodeAddress==='function') { geocodeAddress(addrVal); }
          } catch(err){ console.warn('post-load recenter failed:', err); }
          alert(ok ? 'Settings Loaded!' : 'No saved settings found.');
        } catch(err){ console.error('Top Load Settings failed:', err); alert('Load failed. See console.'); }
      });
      loadTop.dataset.listenerAttached = 'true';
    }
    if (saveTop && !saveTop.dataset.listenerAttached) {
      saveTop.addEventListener('click', async function(e){
        e.preventDefault();
        try {
          await (typeof saveCurrentSettings==='function' ? saveCurrentSettings() : Promise.resolve());
        } catch(err){ console.error('Top Save Settings failed:', err); alert('Save failed. See console.'); }
      });
      saveTop.dataset.listenerAttached = 'true';
    }
  });
})();
