// Coordinate parsing helpers (standalone, no dependency on main_app.js)
(function(){
  // Parse Degrees and Decimal Minutes: e.g., N27° 44.48828′ or W122° 19.11377′
  function parseDMMString(str){
    if (!str || typeof str !== 'string') return NaN;
    var s = str.trim().replace(/[\s]+/g,' ');
    // Normalize symbols: different prime characters to '
    s = s.replace(/[′’']/g, "'");
    s = s.replace(/º/g, '°');
    var m = s.match(/^([NSEW])\s*(\d{1,3})\s*°\s*(\d+(?:\.\d+)?)\s*'?$/i);
    if (!m) return NaN;
    var dir = m[1].toUpperCase();
    var deg = parseFloat(m[2]);
    var min = parseFloat(m[3]);
    if (!isFinite(deg) || !isFinite(min)) return NaN;
    var dec = deg + (min / 60.0);
    if (dir === 'S' || dir === 'W') dec = -dec;
    return dec;
  }

  function parseDecimal(str){
    var v = parseFloat(str);
    return isFinite(v) ? v : NaN;
  }

  // Public: parseFormattedCoordinate(fullFormattedCoord, part)
  // part: 'latitude' or 'longitude'
  window.parseFormattedCoordinate = function(fullFormattedCoord, part){
    var v = parseDMMString(fullFormattedCoord);
    if (!isFinite(v)) v = parseDecimal(fullFormattedCoord);
    if (!isFinite(v)) return NaN;
    // Basic range clamp
    if (part === 'latitude' && (v < -90 || v > 90)) return NaN;
    if (part === 'longitude' && (v < -180 || v > 180)) return NaN;
    return v;
  };
})();

