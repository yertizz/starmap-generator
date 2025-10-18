(function(){
  if (window.__FONTS_INIT_ONCE__) return; window.__FONTS_INIT_ONCE__ = true;
  function fallbackPopulate(){
    var defaultFamilies = [
      'Montserrat','Open Sans','Oswald','Lilita One','Playfair Display','Merriweather','Dancing Script','Roboto','Roboto Slab','Lora','Bebas Neue','Anton','Libre Baskerville','Raleway','Noto Serif','Abril Fatface','Caveat','Permanent Marker','Nunito','Arial','Georgia','Times New Roman','Verdana','Helvetica'];
    var famSel = document.querySelectorAll('.font-family-select');
    famSel.forEach(function(sel){
      if (!sel.options || sel.options.length === 0){
        defaultFamilies.forEach(function(f){ var o=document.createElement('option'); o.value=f; o.textContent=f; o.style.fontFamily=f; sel.appendChild(o); });
      }
    });
    var sizes = [8,10,12,14,16,18,20,24,28,32,36,42,48,54,60,72,96,112];
    var sizeSel = document.querySelectorAll('.font-size-select');
    sizeSel.forEach(function(sel){
      if (!sel.options || sel.options.length === 0){
        sizes.forEach(function(s){ var o=document.createElement('option'); o.value=String(s); o.textContent = s+'px'; sel.appendChild(o); });
      }
    });
  }
  function run(){
    try {
      if (typeof populateFontDropdowns === 'function') populateFontDropdowns();
      if (typeof populateFontSizeDropdowns === 'function') populateFontSizeDropdowns();
      fallbackPopulate();
    } catch(e){ try { fallbackPopulate(); } catch(_){} }
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', run); else run();
})();

