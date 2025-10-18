(function(){
  function getUserId(){ try { return (typeof getCurrentUserId==='function') ? getCurrentUserId() : 'default_user'; } catch(_) { return 'default_user'; } }
  function readSaved(){ try { var raw=localStorage.getItem(getUserId()+'_app_settings'); return raw?JSON.parse(raw):null; } catch(_) { return null; } }
  function applyPaper(){
    try {
      var s = readSaved(); if (!s) return;
      if (s.paperAutoSize && document.getElementById('paper-auto-size')) document.getElementById('paper-auto-size').value = s.paperAutoSize;
      var dpiSel = document.getElementById('dpi-selector') || document.getElementById('dpi');
      if (dpiSel && s.dpi) dpiSel.value = s.dpi;
    } catch(_){}
  }
  function bind(btnId){ var b=document.getElementById(btnId); if (b && !b.__paperBind){ b.__paperBind=true; b.addEventListener('click', function(){ setTimeout(applyPaper, 400); }); } }
  function start(){ bind('loadSettingsBtn'); bind('loadSettingsBtnTop'); }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

