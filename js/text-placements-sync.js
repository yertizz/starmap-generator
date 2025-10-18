(function(){
  function setField(id, val){
    var el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = val || '';
    else el.textContent = val || '';
  }
  function syncOnce(){
    try {
      for (var i=1;i<=4;i++){
        var te = document.getElementById('text-entry-'+i);
        if (te) setField('text-placement-content-'+i, te.value || '');
      }
      var d = document.getElementById('fixed-date-value');
      if (d) setField('text-placement-content-date', d.textContent || d.value || '');
      var coords = document.getElementById('latLongDisplay');
      if (coords) setField('text-placement-content-coords', coords.textContent || '');
    } catch(e){ /* noop */ }
  }
  function bind(){
    for (var i=1;i<=4;i++){
      var te = document.getElementById('text-entry-'+i);
      if (te){ te.addEventListener('input', syncOnce); te.addEventListener('change', syncOnce); }
    }
    var coords = document.getElementById('latLongDisplay');
    if (coords){ new MutationObserver(syncOnce).observe(coords, {childList:true,subtree:true,characterData:true}); }
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ syncOnce(); bind(); });
  else { syncOnce(); bind(); }
})();
