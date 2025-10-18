(function(){
  /* START OF CODE - Codex - 2025-09-07 18:30 File: js/autofill-suppress.js */
  function randomizeName(el){ try { el.setAttribute('name', (el.id||'field')+'_'+Math.random().toString(36).slice(2)); } catch(_){} }
  function suppress(el){
    if(!el) return;
    el.setAttribute('autocomplete','off'); // primary
    el.setAttribute('autocorrect','off');
    el.setAttribute('autocapitalize','off');
    el.setAttribute('spellcheck','false');
    el.setAttribute('aria-autocomplete','list');
    // Chrome can ignore autocomplete=off for addresses; randomizing name reduces suggestions
    randomizeName(el);
  }
  function maybeSearch(el){ try { if (el && el.type!=='search') el.type='search'; } catch(_){} }
  function suppressAll(){
    try { document.querySelectorAll('form').forEach(f=>f.setAttribute('autocomplete','off')); } catch(_){}
    var addr=document.getElementById('address');
    var zip=document.getElementById('zip-code');
    suppress(addr); suppress(zip);
    maybeSearch(addr);
    // re-randomize name on each focus to keep browsers from learning it
    [addr,zip].forEach(function(el){
      if(!el) return;
      el.addEventListener('focus', function(){ randomizeName(el); });
      // readonly hack: keep readonly until user interacts to prevent Chrome suggestions UI
      try { el.setAttribute('readonly','readonly'); } catch(_){ }
      var enable = function(){ try { el.removeAttribute('readonly'); } catch(_){} };
      el.addEventListener('mousedown', enable, { once: true });
      el.addEventListener('keydown', enable, { once: true });
      el.addEventListener('touchstart', enable, { once: true });
      el.addEventListener('blur', function(){ try { el.setAttribute('readonly','readonly'); } catch(_){} });
    });
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', suppressAll); else suppressAll();
  /* END OF CODE - Codex - 2025-09-07 18:30 File: js/autofill-suppress.js */
})();
