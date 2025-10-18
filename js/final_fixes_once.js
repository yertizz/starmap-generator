(function(){
  if (window.__FINAL_FIXES_ONCE_INSTALLED__) return;
  window.__FINAL_FIXES_ONCE_INSTALLED__ = true;
  function install(){
    try {
      if (window.finalFixes && typeof window.finalFixes.applyAll === 'function'){
        var original = window.finalFixes.applyAll;
        var ran = false;
        window.finalFixes.applyAll = function(){ if (ran) return; ran = true; try { original(); } catch(e){ console.warn('finalFixes applyAll error:', e); } };
      }
    } catch(e){ console.warn('final_fixes_once install failed:', e); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install); else install();
})();

