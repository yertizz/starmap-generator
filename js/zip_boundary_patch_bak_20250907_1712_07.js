// Minimal, syntax-safe patch (rectangle fallback + UI + selector)
(function () {
  function ensureGeocoder() {
    if (!window.geocoderInstance && window.google && google.maps) {
      window.geocoderInstance = new google.maps.Geocoder();
    }
    return window.geocoderInstance;
  }

  function injectUI() {
    var mapContainer = document.getElementById('map-container') || (document.getElementById('map') && document.getElementById('map').parentNode);
    if (!mapContainer) return;
    var row = document.getElementById('zip-boundary-toggle');
    if (!row) {
      row = document.createElement('div');
      row.id = 'zip-boundary-toggle';
      row.style.cssText = 'display:flex;align-items:center;gap:12px;margin:6px 0;';
      row.innerHTML = '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none;">\
        <input type="checkbox" id="toggle-zip-boundary" checked>\
        <span>Show ZIP/Postal Boundary</span></label>';
      if (mapContainer.parentNode) mapContainer.parentNode.insertBefore(row, mapContainer);
      else mapContainer.insertBefore(row, mapContainer.firstChild);
    }
    var countrySel = document.getElementById('country-code');
    if (!countrySel) {
      var sel = document.createElement('select');
      sel.id = 'country-code';
      sel.style.cssText = 'height:28px;padding:2px 6px;border:1px solid #ccc;border-radius:4px;';
      sel.innerHTML = '<option value="US" selected>United States</option>'+
                      '<option value="CA">Canada</option>'+
                      '<option value="GB">United Kingdom</option>'+
                      '<option value="AU">Australia</option>';
      row.appendChild(sel);
      sel.addEventListener('change', function () {
        var z = document.getElementById('zip-code');
        if (z && z.value.trim() && typeof window.geocodeZip === 'function') window.geocodeZip(z.value.trim());
      });
      countrySel = sel;
    }
    // Always enforce compact width on existing or new selector
    if (countrySel){
      try {
        countrySel.style.setProperty('width','90px','important');
        countrySel.style.setProperty('max-width','90px','important');
      } catch(_){ countrySel.style.width='90px'; countrySel.style.maxWidth='90px'; }
    }
    var cb = document.getElementById('toggle-zip-boundary');
    if (cb && !cb.__bound) {
      cb.__bound = true;
      cb.addEventListener('change', function () {
        window.showZipBoundary = !!this.checked;
        if (!window.showZipBoundary && window.zipPolygon) { try { window.zipPolygon.setMap(null); } catch (_) {} }
        if (window.showZipBoundary && window.zipPolygon && window.map) { try { window.zipPolygon.setMap(window.map); } catch (_) {} }
      });
    }
  }

  function getMap(){
    try {
      if (window.map && typeof window.map.setCenter === 'function') return window.map;
      if (typeof map !== 'undefined' && map && typeof map.setCenter === 'function') return map;
    } catch(_){}
    return null;
  }

  function drawRectangle(bounds, lat, lng) {
    var ne, sw;
    if (bounds) { ne = bounds.getNorthEast(); sw = bounds.getSouthWest(); }
    else { var d = 0.02; ne = new google.maps.LatLng(lat + d, lng + d); sw = new google.maps.LatLng(lat - d, lng - d); }
    var nw = new google.maps.LatLng(ne.lat(), sw.lng());
    var se = new google.maps.LatLng(sw.lat(), ne.lng());
    var path = [ne, se, sw, nw, ne];
    if (window.zipPolygon) { try { window.zipPolygon.setMap(null); } catch (_) {} }
    window.zipPolygon = new google.maps.Polygon({
      paths: path,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.25,
      map: (window.showZipBoundary !== false && window.map) ? window.map : null
    });
    // Fit map to rectangle and clamp zoom for sensible detail
    if (window.map) {
      try {
        var b = new google.maps.LatLngBounds();
        for (var i=0;i<path.length;i++){ b.extend(path[i]); }
        window.map.fitBounds(b);
        var z = window.map.getZoom();
        if (z) window.map.setZoom(Math.min(15, Math.max(10, z)));
      } catch(_){}
    }
  }

  function overrideGeocodeZip() {
    var original = window.geocodeZip;
    window.geocodeZip = function (zipText) {
      ensureGeocoder();
      if (!window.geocoderInstance) return; // maps not ready yet
      window.geocoderInstance.geocode({ address: zipText }, function (results, status) {
        if (status === 'OK' && results && results[0]) {
          var res = results[0];
          var loc = res.geometry.location; var lat = loc.lat(), lng = loc.lng();
          var m = getMap();
          if (m) {
            window.ignoreNextCenterChange = true;
            m.setCenter({ lat: lat, lng: lng });
            if (window.marker) window.marker.setPosition({ lat: lat, lng: lng });
            // Fit to geocoder bounds/viewport if present; clamp zoom
            try {
              var gb = res.geometry && (res.geometry.bounds || res.geometry.viewport);
              if (gb) { m.fitBounds(gb); var z2 = m.getZoom(); if (z2) m.setZoom(Math.min(15, Math.max(10, z2))); }
              else { m.setZoom(12); }
            } catch(_){}
          }
          var b = res.geometry && (res.geometry.bounds || res.geometry.viewport);
          drawRectangle(b, lat, lng);
          // sync fields
          var addrEl = document.getElementById('address');
          if (addrEl && res.formatted_address) addrEl.value = res.formatted_address;
          if (typeof updateCoordinates === 'function') updateCoordinates(lat, lng);
          // best-effort polygon fetch with 2s timeout
          (function(){
            try {
              var c = 'US'; var cc = document.getElementById('country-code'); if (cc && cc.value) c = String(cc.value).trim();
              var url = 'proxy/zip_polygon.php?postalcode='+encodeURIComponent(zipText)+'&country='+encodeURIComponent(c);
              var t = new Promise(function(_,rej){ setTimeout(function(){ rej(new Error('timeout')); }, 2000); });
              Promise.race([ fetch(url, { headers:{'Accept':'application/json'} }) , t ])
                .then(function(r){ if (!r || !r.ok) throw new Error('proxy'); return r.json(); })
                .then(function(gj){
                  if (gj && gj.type==='Feature' && gj.geometry && Array.isArray(gj.geometry.coordinates)){
                    if (window.zipPolygon) { try { window.zipPolygon.setMap(null); } catch(_){} }
                    var rings = gj.geometry.type==='Polygon' ? [gj.geometry.coordinates] : gj.geometry.coordinates;
                    var coords = rings[0][0].map(function(c){ return new google.maps.LatLng(c[1], c[0]); });
                    window.zipPolygon = new google.maps.Polygon({ paths: coords, strokeColor:'#FF0000', strokeOpacity:0.8, strokeWeight:2, fillColor:'#FF0000', fillOpacity:0.25, map: (window.showZipBoundary!==false && window.map) ? window.map : null });
                  }
                })
                .catch(function(){ /* keep rectangle */ });
            } catch(_){}
          })();
        } else {
          console.warn('geocodeZip failed:', status);
          if (typeof original === 'function' && original !== window.geocodeZip) { try { original(zipText); } catch (_) {} }
        }
      });
    };

    // Also bind directly to the ZIP input so our version always runs
    var zipEl = document.getElementById('zip-code');
    if (zipEl && !zipEl.__zipPatchBound) {
      zipEl.__zipPatchBound = true;
      zipEl.addEventListener('keydown', function(e){ if (e.key==='Enter'){ e.preventDefault(); var v=this.value && this.value.trim(); if(v) window.geocodeZip(v);} });
      zipEl.addEventListener('blur', function(){ var v=this.value && this.value.trim(); if(v) window.geocodeZip(v); });
      zipEl.addEventListener('change', function(){ var v=this.value && this.value.trim(); if(v) window.geocodeZip(v); });
    }
  }

  function start() { injectUI(); overrideGeocodeZip(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
