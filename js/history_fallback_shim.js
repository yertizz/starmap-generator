/* History fallback shim: adds non-blocking localStorage fallbacks and avoids alert() on failures. */
(function(){
  if (window.__HISTORY_FALLBACK_APPLIED__) return; // idempotent
  window.__HISTORY_FALLBACK_APPLIED__ = true;

  var USE_SERVER = false;
  try {
    // Allow global override to force local history during testing
    if (window.FORCE_LOCAL_HISTORY === true) {
      USE_SERVER = false;
    } else {
      USE_SERVER = /^https?:/.test(window.location && window.location.protocol);
    }
  } catch(e) { USE_SERVER = false; }

  function getUserKey(baseKey){
    try { return (typeof getUserStorageKey === 'function') ? getUserStorageKey(baseKey) : baseKey; } catch(e) { return baseKey; }
  }
  function localGetArr(storageKey){
    try {
      var k = getUserKey(storageKey);
      var raw = localStorage.getItem(k);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch(e) {
      console.warn('DEBUG HISTORY: Local fallback read failed:', e);
      return [];
    }
  }
  function localSaveArr(storageKey, arr){
    try {
      var k = getUserKey(storageKey);
      localStorage.setItem(k, JSON.stringify(Array.isArray(arr) ? arr : []));
      return true;
    } catch(e) {
      console.warn('DEBUG HISTORY: Local fallback save failed:', e);
      return false;
    }
  }

  async function getHistoryArrayPatched(storageKey){
    async function seedFromDefaults(userKey){
      try {
        var localUrl = 'history/data/' + encodeURIComponent(userKey) + '.json';
        var r = await fetch(localUrl, { headers: { 'Accept': 'application/json' }, cache: 'no-store' });
        if (r && r.ok) {
          var arr = await r.json();
          if (Array.isArray(arr) && arr.length) { localSaveArr(storageKey, arr); return arr; }
        }
      } catch(_) {}
      return [];
    }

    var userStorageKey = getUserKey(storageKey);

    if (!USE_SERVER) {
      if (window.DEBUG_HISTORY) console.log('DEBUG HISTORY: Using localStorage (not http/https) for', storageKey);
      var localArr = localGetArr(storageKey);
      if (!localArr.length) {
        var seeded = await seedFromDefaults(userStorageKey);
        if (seeded.length) return seeded;
      }
      return localArr;
    }
    try {
      var url = (typeof HISTORY_ENDPOINT !== 'undefined' ? HISTORY_ENDPOINT : 'history/history_manager.php') + '?key=' + encodeURIComponent(userStorageKey);
      var resp = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' } });
      if (!resp.ok) {
        var arr404 = localGetArr(storageKey);
        if (!arr404.length) {
          var seeded404 = await seedFromDefaults(userStorageKey);
          if (seeded404.length) return seeded404;
        }
        return arr404;
      }
      var ct = (resp.headers.get('content-type') || '').toLowerCase();
      if (ct.indexOf('application/json') === -1) return localGetArr(storageKey);
      var data = await resp.json();
      return Array.isArray(data) ? data : localGetArr(storageKey);
    } catch(e) {
      console.warn('DEBUG HISTORY: Server fetch failed, using local fallback:', e);
      var arr = localGetArr(storageKey);
      if (!arr.length) {
        var seeded = await seedFromDefaults(userStorageKey);
        if (seeded.length) return seeded;
      }
      return arr;
    }
  }

  async function saveHistoryArrayPatched(storageKey, arr){
    if (!USE_SERVER) {
      if (window.DEBUG_HISTORY) console.log('DEBUG HISTORY: Using localStorage (not http/https) to save', storageKey);
      return localSaveArr(storageKey, arr);
    }
    try {
      var userStorageKey = getUserKey(storageKey);
      var body = JSON.stringify({ key: userStorageKey, data: Array.isArray(arr) ? arr : [] });
      var resp = await fetch((typeof HISTORY_ENDPOINT !== 'undefined' ? HISTORY_ENDPOINT : 'history/history_manager.php'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body });
      if (!resp.ok) return localSaveArr(storageKey, arr);
      var ct = (resp.headers.get('content-type') || '').toLowerCase();
      if (ct.indexOf('application/json') === -1) return localSaveArr(storageKey, arr);
      var result = await resp.json();
      return (result && result.success) ? true : localSaveArr(storageKey, arr);
    } catch(e) {
      console.warn('DEBUG HISTORY: Server save failed, using local fallback:', e);
      return localSaveArr(storageKey, arr);
    }
  }

  // Override global functions
  window.getHistoryArray = getHistoryArrayPatched;
  window.saveHistoryArray = saveHistoryArrayPatched;
})();
