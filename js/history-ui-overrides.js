// Improves history suggestion behavior during testing (focus/input shows suggestions)
(function(){
  function onReady(fn){ if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fn);} else { fn(); } }
  function ensureVisible(el){ if(!el) return; el.style.display='block'; el.style.position='absolute'; el.style.zIndex='4000'; }
  function stripTitles(container){
    try {
      if (!container) return;
      container.querySelectorAll('[title]').forEach(function(n){ n.removeAttribute('title'); });
    } catch(_){ }
  }
  onReady(function(){
    try {
      var zip = document.getElementById('zip-code');
      var addr = document.getElementById('address');
      var zipSuggest = document.getElementById('zip-suggestions');
      var addrSuggest = document.getElementById('address-suggestions');
      // Reduce native browser autofill/tooltip overlays
      function disableBrowserAutocomplete(el){
        if (!el) return;
        el.setAttribute('autocomplete','off');
        el.setAttribute('autocorrect','off');
        el.setAttribute('autocapitalize','off');
        el.setAttribute('spellcheck','false');
        // Randomize name to further discourage persistent browser suggestions
        try { el.setAttribute('name', (el.id||'field') + '_' + Date.now()); } catch(_){ }
      }
      disableBrowserAutocomplete(zip);
      disableBrowserAutocomplete(addr);

      function showZip(){ if (typeof displayHistorySuggestions==='function') { displayHistorySuggestions('zip-code','zipCodeHistory','zip-suggestions'); } ensureVisible(zipSuggest); stripTitles(zipSuggest); }
      function showAddr(){ if (typeof displayHistorySuggestions==='function') { displayHistorySuggestions('address','addressHistory','address-suggestions'); } ensureVisible(addrSuggest); stripTitles(addrSuggest); }

      if (zip) {
        zip.addEventListener('focus', showZip);
        zip.addEventListener('input', showZip);
      }
      if (addr) {
        addr.addEventListener('focus', showAddr);
        addr.addEventListener('input', showAddr);
      }
      // Also strip titles periodically as a safety net
      setInterval(function(){ stripTitles(addrSuggest); }, 1000);
    } catch(e){ console.warn('history-ui-overrides failed:', e); }
  });
})();
