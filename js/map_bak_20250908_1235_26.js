/* START OF CODE - Codex - 2025-09-07 17:12 File: js/map.js */
// START OF CODE - Cline - 2025-05-10 18:45 File: js/map.js
// Initialize Map and Set Default Position
console.log("Map.js loaded successfully");

let map;
let marker;
// Overlays: polygon outline and rectangle helper (and legacy alias)
window.zipOverlay = window.zipOverlay || null; // Polygon
window.zipRect = window.zipRect || null;      // Rectangle
try { if (typeof window.zipPolygon === 'undefined') window.zipPolygon = null; } catch(_){}
let mapInitialized = false;
let ignoreNextCenterChange = false;
let geocoderInstance;
let showZipBoundary = true; // legacy local alias (kept); actual flag on window
try { if (typeof window.showZipBoundary === 'undefined') window.showZipBoundary = true; } catch(_){}
// In-flight guards for ZIP lookups
try { window.__ZIP_INFLIGHT = null; window.__LAST_ZIP = ''; } catch(_){}

// Lightweight status helper (no console needed)
function ensurePolygonStatusEl(){
    try {
        if (document.getElementById('polygon-status')) return;
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) return;
        const status = document.createElement('div');
        status.id = 'polygon-status';
        status.style.cssText = 'margin:6px 0;color:#444;font-weight:600;text-align:center;';
        status.textContent = '';
        mapContainer.parentNode.insertBefore(status, mapContainer.nextSibling);
    } catch(_){}
}
function setPolygonStatus(msg){ try { ensurePolygonStatusEl(); const el=document.getElementById('polygon-status'); if(el) el.textContent = msg||''; } catch(_){} }

// Define the function
function initializeGoogleMapInternal() { // Renamed internally
    console.log("Initializing map...");
    // ADDED console log to check if the map element is found
    if (document.getElementById("map")) {
        console.log("Map element found!");
    } else {
        console.error("Map element not found!");
    }
    const defaultPosition = { lat: 39.8333, lng: -98.5855 }; // Centered US approx.

    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultPosition,
        zoom: 4, // Zoom out a bit more for default view
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
            {
                featureType: "all",
                elementType: "labels",
                stylers: [{ visibility: "on" }]
            }
        ]
    });

    // Expose map globally for helpers that rely on window.map
    try { window.map = map; } catch (e) { /* ignore */ }

    // Initialize Geocoder
    try { geocoderInstance = new google.maps.Geocoder(); } catch(e) { console.warn('Geocoder init failed:', e); }

    // Add crosshairs overlay (just two lines)
    addCrosshairs();

    // Inject Show/Hide ZIP Boundary toggle above the map
    try {
        const mapContainer = document.getElementById('map-container');
        if (mapContainer && !document.getElementById('zip-boundary-toggle')) {
            const ctrl = document.createElement('div');
            ctrl.id = 'zip-boundary-toggle';
            ctrl.style.cssText = 'display:flex;align-items:center;gap:8px;margin:6px 0;';
            ctrl.innerHTML = '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none;"><input type="checkbox" id="toggle-zip-boundary" checked> <span>Show ZIP/Postal Boundary</span></label>';
            if (mapContainer.parentNode) {
                mapContainer.parentNode.insertBefore(ctrl, mapContainer);
            } else {
                // Fallback: insert before #map
                const mapEl = document.getElementById('map');
                if (mapEl && mapEl.parentNode) mapEl.parentNode.insertBefore(ctrl, mapEl);
            }
            console.log('ZIP toggle injected');
            const cb = ctrl.querySelector('#toggle-zip-boundary');
            cb.addEventListener('change', function(){
                try { window.showZipBoundary = !!this.checked; } catch(_){}
                const vis = (window.showZipBoundary !== false);
                if (!vis) {
                    try { if (window.zipOverlay) window.zipOverlay.setMap(null); } catch(_){}
                    try { if (window.zipRect) window.zipRect.setMap(null); } catch(_){}
                } else {
                    try { if (window.zipOverlay) window.zipOverlay.setMap(map); } catch(_){}
                    try { if (window.zipRect) window.zipRect.setMap(map); } catch(_){}
                }
            });
        }
    } catch(e) { console.warn('ZIP toggle injection failed:', e); }

    // Create marker at the center
    marker = new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        title: "Current Location",
        icon: {
            url: 'assets/images/locationtag.png', // Ensure this path is correct
            scaledSize: new google.maps.Size(35, 35),
            anchor: new google.maps.Point(17.5, 17.5) // Center the icon at its middle point
        }
    });

    // Update coordinates when map center changes
    google.maps.event.addListener(map, "center_changed", function() {
        if (ignoreNextCenterChange) {
            ignoreNextCenterChange = false;
            return;
        }

        let center = map.getCenter();
        // console.log("Map center changed:", center.lat(), center.lng()); // Reduce noise
        updateCoordinates(center.lat(), center.lng());

        // Update marker position to follow the center
        if (marker) {
            marker.setPosition(center);
        }
    });

    // Update coordinates when map is idle (after drag, zoom, etc.)
    google.maps.event.addListener(map, "idle", function() {
        let center = map.getCenter();
        // console.log("Map idle at:", center.lat(), center.lng()); // Reduce noise
        updateCoordinates(center.lat(), center.lng());
    });

    // Handle address input
    const addressInput = document.getElementById("address");
    if (addressInput) {
        const handleAddressKeydown = function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.value.trim() !== '') {
                    geocodeAddress(this.value.trim()); // Call geocode on Enter
                }
            }
        };
        
        addressInput.removeEventListener("keydown", handleAddressKeydown); // Remove first to prevent duplicates
        addressInput.addEventListener("keydown", handleAddressKeydown); // Add keydown listener
        // Also geocode on blur so a click-out resolves position
        addressInput.addEventListener('blur', function(){
            const v = this.value && this.value.trim();
            if (v) { geocodeAddress(v); }
        });
    } else {
        console.error("Address input field not found.");
    }
    
    // Handle ZIP code input
    const zipInput = document.getElementById("zip-code");
    if (zipInput) {
        // Define handlers
        const handleZipChange = function(e) {
            // We don't want to geocode on 'change', only on Enter or maybe blur
        };
        const handleZipKeypress = function(e) {
            // Use keydown instead of keypress for Enter key detection consistency
        };
        const handleZipKeydown = function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.value.trim() !== '') {
                    geocodeZip(this.value.trim()); // Call geocode on Enter
                }
            }
        };

        // Add new listeners (ensure no duplicates if script re-runs)
        zipInput.removeEventListener("change", handleZipChange);
        zipInput.removeEventListener("keypress", handleZipKeypress); // Remove old listener
        zipInput.removeEventListener("keydown", handleZipKeydown); // Remove first
        zipInput.addEventListener("keydown", handleZipKeydown); // Add keydown listener
        // Also geocode on blur for convenience
        zipInput.addEventListener('blur', function(){
            const v = this.value && this.value.trim();
            if (v) { geocodeZip(v); }
        });
        // Auto-trigger after typing (debounced) so users don’t need to press Enter
        let zipDebounce;
        zipInput.addEventListener('input', function(e){
            const v = this.value && this.value.trim();
            clearTimeout(zipDebounce);
            if (!v) { return; }
            // Only react to genuine user input to avoid flicker from programmatic value sets
            if (!e.isTrusted) { return; }
            zipDebounce = setTimeout(function(){ geocodeZip(v); }, 700);
        });
        // If a ZIP is prefilled on reload, queue it until Maps is ready
        const pre = zipInput.value && zipInput.value.trim();
        if (pre) {
            try {
                if (!(window.google && google.maps) || !window.__MAPS_READY) {
                    setPolygonStatus('Initializing map…');
                    window.__PENDING_GEO.push({ type:'zip', value: pre });
                } else { geocodeZip(pre); }
            } catch(_){ }
        }

    } else {
        console.error("ZIP Code input field not found.");
    }

    // Handle latitude input
    const latInput = document.getElementById("latitude");
     if(latInput) {
        latInput.removeEventListener("change", updateMapFromCoordinates); // Prevent duplicates
        latInput.addEventListener("change", updateMapFromCoordinates);
     } else {
         console.error("Latitude input field not found.");
     }

    // Handle longitude input
    const lonInput = document.getElementById("longitude");
    if(lonInput) {
        lonInput.removeEventListener("change", updateMapFromCoordinates); // Prevent duplicates
        lonInput.addEventListener("change", updateMapFromCoordinates);
    } else {
        console.error("Longitude input field not found.");
    }

    // Set up marker selection (assuming .icon-button exists in HTML)
    setUpMarkerSelection();

    // Initial update of coordinates
    updateCoordinates(defaultPosition.lat, defaultPosition.lng);

    // Mark map as initialized
    mapInitialized = true;
    console.log("Map initialized");
}

// Geocode a freeform address and center the map
async function geocodeAddress(addressText) {
    try {
        if (!geocoderInstance) geocoderInstance = new google.maps.Geocoder();
        geocoderInstance.geocode({ address: addressText }, function(results, status) {
            if (status === 'OK' && results && results[0]) {
                const loc = results[0].geometry.location;
                const lat = loc.lat();
                const lng = loc.lng();
                if (map) {
                    ignoreNextCenterChange = true;
                    map.setCenter({ lat, lng });
                    if (marker) marker.setPosition({ lat, lng });
                }
                // Update coordinate fields
                updateCoordinates(lat, lng);
                // Save to history if available
                if (typeof saveAddressToHistory === 'function') {
                    saveAddressToHistory(addressText);
                }
            } else {
                console.warn('Geocode address failed:', status);
            }
        });
    } catch (e) {
        console.error('geocodeAddress error:', e);
    }
}

// Geocode a ZIP code and draw a polygon; try server polygon first, fallback to bounds rectangle
async function geocodeZip(zipText) {
    try {
        // Queue if maps not ready
        if (!(window.google && google.maps)) {
            try { setPolygonStatus('Initializing map…'); window.__PENDING_GEO.push({ type:'zip', value: zipText }); } catch(_){}
            return;
        }
        // Debounce/dedupe guard
        const reqId = Date.now() + ':' + String(zipText);
        try { window.__ZIP_INFLIGHT = reqId; window.__LAST_ZIP = String(zipText); } catch(_){}
        if (!geocoderInstance) geocoderInstance = new google.maps.Geocoder();
        setPolygonStatus('Fetching location and boundary…');
        // Restrict geocoder to selected country (defaults to US) to avoid wrong-country matches (e.g., 33079 in Italy)
        let country = 'US';
        try {
            const sel = document.getElementById('country') || document.getElementById('country-code');
            if (sel && sel.value) country = String(sel.value).trim();
        } catch(_){}
        const req = { address: zipText, componentRestrictions: { country: country } };
        geocoderInstance.geocode(req, function(results, status) {
            try { if (window.__ZIP_INFLIGHT !== reqId) return; } catch(_){ }
            if (status === 'OK' && results && results[0]) {
                // Prefer the result whose postal_code matches the input
                let res = results[0];
                try {
                    const match = (results||[]).find(r => (r.address_components||[]).some(c => (c.types||[]).includes('postal_code') && String(c.long_name).trim() === String(zipText).trim()));
                    if (match) res = match;
                } catch(_){}
                const loc = res.geometry.location;
                const lat = loc.lat();
                const lng = loc.lng();
                if (map) {
                    ignoreNextCenterChange = true;
                    map.setCenter({ lat, lng });
                    if (marker) marker.setPosition({ lat, lng });
                }
                updateCoordinates(lat, lng);
                // Update address field from this matched result
                try { const addrEl = document.getElementById('address'); if (addrEl && res.formatted_address) addrEl.value = res.formatted_address; } catch(_){ }
                // Preferred: draw a polygon from Google viewport (working pattern from June backup)
                try {
                    const viewport = res.geometry && (res.geometry.viewport || res.geometry.bounds);
                    if (viewport) {
                        // Build polygon path from viewport NE/SW
                        const paths = getPolygonPathsFromViewport(viewport);
                        // Clear previous
                        try { if (window.zipOverlay) window.zipOverlay.setMap(null); } catch(_){}
                        try { if (window.zipRect) window.zipRect.setMap(null); } catch(_){}
                        // Helper rectangle for guaranteed visibility
                        const ne = viewport.getNorthEast();
                        const sw = viewport.getSouthWest();
                        const rb = new google.maps.LatLngBounds(sw, ne);
                        window.zipRect = new google.maps.Rectangle({
                            bounds: rb,
                            strokeColor: '#FF0000', strokeOpacity: 0.6, strokeWeight: 2,
                            fillColor: '#FF0000', fillOpacity: 0.15,
                            zIndex: 900,
                            map: map
                        });
                        // Main polygon outline on top
                        window.zipOverlay = new google.maps.Polygon({
                            paths: paths,
                            strokeColor: '#FF0000', strokeOpacity: 1.0, strokeWeight: 3,
                            fillColor: '#FF0000', fillOpacity: 0.30,
                            zIndex: 1000,
                            map: map // always show immediately; toggle will hide/show via setMap
                        });
                        try { map.fitBounds(viewport); const rz = map.getZoom(); if (rz) map.setZoom(Math.min(15, Math.max(10, rz))); } catch(_){ }
                        setPolygonStatus('Polygon drawn');
                        // We have a visible polygon; no need to fetch server polygon now
                        return;
                    }
                } catch(e) {
                    console.warn('Viewport polygon draw failed:', e);
                }

                // If no viewport, fall back to a small rectangle around lat/lng (still visible)
                try {
                    const d = 0.02; // small box
                    const ne = new google.maps.LatLng(lat + d, lng + d);
                    const sw = new google.maps.LatLng(lat - d, lng - d);
                    const nw = new google.maps.LatLng(ne.lat(), sw.lng());
                    const se = new google.maps.LatLng(sw.lat(), ne.lng());
                    const path = [ne, se, sw, nw, ne];
                    try { if (window.zipOverlay) window.zipOverlay.setMap(null); } catch(_){}
                    const rbounds = new google.maps.LatLngBounds();
                    path.forEach(p=>rbounds.extend(p));
                    window.zipOverlay = new google.maps.Rectangle({
                        bounds: rbounds,
                        strokeColor: '#FF0000', strokeOpacity: 0.9, strokeWeight: 2,
                        fillColor: '#FF0000', fillOpacity: 0.20,
                        zIndex: 1000,
                        map: map
                    });
                    try { map.fitBounds(rbounds); const rz = map.getZoom(); if (rz) map.setZoom(Math.min(15, Math.max(10, rz))); } catch(_){ }
                    setPolygonStatus('Zip Code Polygon Boundary Unavailable For this Zip Code: Displaying Fallback Rectangle.');
                    return;
                } catch(_){ }

                // Try to fetch a detailed polygon from server (Overpass/OSM)
                (async function(){
                    try {
                        // Determine country: default to US unless an explicit country selector is set
                        let country = 'US';
                        const countryEl = document.getElementById('country') || document.getElementById('country-code');
                        if (countryEl && countryEl.value) { country = String(countryEl.value).trim(); }
                        // Build absolute path based on current page path to avoid base/href issues
                        const basePath = (function(){ try { const p = window.location.pathname; return p.slice(0, p.lastIndexOf('/')+1); } catch(_) { return '/star-map/'; } })();
                        const url = `${basePath}proxy/zip_polygon.php?postalcode=${encodeURIComponent(zipText)}&country=${encodeURIComponent(country)}&lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`;
                        setPolygonStatus('Fetching polygon…');
                        if (window.DEBUG_POLY) console.log('DEBUG_POLY: fetching polygon', url);
                        const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
                        if (resp.ok) {
                            const gj = await resp.json();
                            if (gj && gj.type === 'Feature' && gj.geometry && Array.isArray(gj.geometry.coordinates)) {
                                try { if (window.__ZIP_INFLIGHT !== reqId) return; } catch(_){ }
                                if (window.zipOverlay) { try { window.zipOverlay.setMap(null); } catch(_){} }
                                // Build Google Maps paths supporting Polygon with holes and first MultiPolygon
                                let pathsArr = [];
                                if (gj.geometry.type === 'Polygon') {
                                    pathsArr = gj.geometry.coordinates.map(function(ring){
                                        return ring.map(function(c){ return new google.maps.LatLng(c[1], c[0]); });
                                    });
                                } else if (gj.geometry.type === 'MultiPolygon') {
                                    if (gj.geometry.coordinates.length > 0) {
                                        pathsArr = gj.geometry.coordinates[0].map(function(ring){
                                            return ring.map(function(c){ return new google.maps.LatLng(c[1], c[0]); });
                                        });
                                    }
                                }
                                if (pathsArr.length) {
                        window.zipOverlay = new google.maps.Polygon({
                            paths: pathsArr,
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#FF0000',
                            fillOpacity: 0.25,
                            zIndex: 1000,
                            map: map
                        });
                                    // Fit map to polygon bounds and clamp zoom for sensible detail
                                    try {
                                        const bounds = new google.maps.LatLngBounds();
                                        pathsArr.forEach(function(ring){ ring.forEach(function(pt){ bounds.extend(pt); }); });
                                        map.fitBounds(bounds);
                                        const z = map.getZoom();
                                        if (z) map.setZoom(Math.min(15, Math.max(10, z)));
                                    } catch(_){}
                                    try {
                                        if (gj.properties && gj.properties.source === 'fallback-rectangle') setPolygonStatus('Zip Code Polygon Boundary Unavailable For this Zip Code: Displaying Fallback Rectangle.');
                                        else if (gj.properties && gj.properties.source) setPolygonStatus('Polygon source: ' + gj.properties.source);
                                        else setPolygonStatus('Polygon drawn');
                                    } catch(_){}
                                    return;
                                }
                            }
                        }
                    } catch(e) { console.warn('zip polygon fetch failed, using bounds rectangle:', e); }
                    // Fallback: bounds rectangle (or default around lat/lng)
                    try {
                        if (window.zipPolygon) { try { window.zipPolygon.setMap(null); } catch(_){} }
                        const b = (res.geometry && (res.geometry.bounds || res.geometry.viewport)) || null;
                        let ne, sw;
                        if (b) {
                            ne = b.getNorthEast();
                            sw = b.getSouthWest();
                        } else {
                            const d = 0.02;
                            ne = new google.maps.LatLng(lat + d, lng + d);
                            sw = new google.maps.LatLng(lat - d, lng - d);
                        }
                        const nw = new google.maps.LatLng(ne.lat(), sw.lng());
                        const se = new google.maps.LatLng(sw.lat(), ne.lng());
                        const path = [ne, se, sw, nw, ne];
                        try { if (window.zipOverlay) window.zipOverlay.setMap(null); } catch(_){}
                        const rb2 = new google.maps.LatLngBounds();
                        path.forEach(p=>rb2.extend(p));
                        window.zipOverlay = new google.maps.Rectangle({
                            bounds: rb2,
                            strokeColor: '#FF0000', strokeOpacity: 0.9, strokeWeight: 2,
                            fillColor: '#FF0000', fillOpacity: 0.20,
                            zIndex: 1000,
                            map: map
                        });
                        try {
                            map.fitBounds(rb2);
                            const rz2 = map.getZoom();
                            if (rz2) map.setZoom(Math.min(15, Math.max(10, rz2)));
                        } catch(_){ }
                        setPolygonStatus('Zip Code Polygon Boundary Unavailable For this Zip Code: Displaying Fallback Rectangle.');
                    } catch(_){ }
                })();
                // Save to history with city/state when available
                try {
                    if (typeof saveZipCodeToHistory === 'function') {
                        let city = '';
                        let state = '';
                        if (res.address_components) {
                            for (const c of res.address_components) {
                                if (c.types && (c.types.includes('locality') || c.types.includes('postal_town'))) city = c.long_name;
                                else if (c.types && c.types.includes('administrative_area_level_1')) state = c.short_name;
                            }
                        }
                        const displayText = (city && state) ? `${zipText} (${city}, ${state})` : zipText;
                        saveZipCodeToHistory(displayText);
                    }
                } catch(_){}
                // Sync address field from result
                try {
                    const addrEl = document.getElementById('address');
                    if (addrEl && res.formatted_address && addrEl.value !== res.formatted_address) {
                        addrEl.value = res.formatted_address;
                    }
                } catch(_){}
            } else {
                console.warn('Geocode zip failed:', status);
                setPolygonStatus('Failed to locate ZIP');
            }
        });
    } catch (e) {
        console.error('geocodeZip error:', e);
        setPolygonStatus('Error fetching ZIP');
    }
}

// Add crosshairs to the map (just two lines)
function addCrosshairs() {
    const existingCrosshairs = document.getElementById('crosshairs');
    if (existingCrosshairs) {
        existingCrosshairs.remove();
    }
    const crosshairs = document.createElement('div');
    crosshairs.id = 'crosshairs';
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        mapContainer.appendChild(crosshairs);
    } else {
        console.error("Map container not found for adding crosshairs.");
    }
}

// Update coordinate fields dynamically
function updateCoordinates(lat, lng) {
    try {
        const formattedLat = formatDMM(lat, "lat");
        const formattedLng = formatDMM(lng, "lng");

        const latLongDisplay = document.getElementById("latLongDisplay");
        if (latLongDisplay) {
            latLongDisplay.textContent = `${formattedLat} | ${formattedLng}`;
        } else { console.error("CRITICAL ERROR: latLongDisplay element not found"); }

        const latField = document.getElementById("latitude");
        const lngField = document.getElementById("longitude");

        if (latField && lngField) {
            // Temporarily remove listener to prevent feedback loop
            latField.removeEventListener("change", updateMapFromCoordinates);
            lngField.removeEventListener("change", updateMapFromCoordinates);

            latField.value = formattedLat;
            lngField.value = formattedLng;

            // Re-attach listener
            latField.addEventListener("change", updateMapFromCoordinates);
            lngField.addEventListener("change", updateMapFromCoordinates);

             if (typeof validateInputs === 'function') { validateInputs(); }

        } else { console.error("Latitude or longitude input field not found"); }
    if (typeof validateInputs === 'function') { validateInputs(); }
    } catch (error) { console.error("Error updating coordinates:", error); }
}

// Format coordinates in Degrees and Decimal Minutes (DMM)
function formatDMM(decimalDegrees, type) {
    if (isNaN(decimalDegrees)) return "Invalid";
    const degrees = Math.floor(Math.abs(decimalDegrees));
    const minutes = (Math.abs(decimalDegrees) - degrees) * 60;
    let direction = "";
    if (type === "lat") direction = decimalDegrees >= 0 ? "N" : "S";
    else if (type === "lng") direction = decimalDegrees >= 0 ? "E" : "W";
    // Format minutes with leading zero if needed, fixed decimal places
    const formattedMinutes = minutes.toFixed(5).padStart(8, '0'); // e.g., 07.12345 or 56.12345
    return `${direction}${degrees}° ${formattedMinutes}′`;
}

// Parse DMM format to decimal degrees
function parseDMM(dmmString) {
    if (!dmmString || typeof dmmString !== 'string') return null;
    const match = dmmString.trim().match(/^([NSEW])\s*(\d+)\s*°\s*(\d+(?:\.\d+)?)\s*[′]?$/i);
    if (match) {
        const direction = match[1].toUpperCase();
        const degrees = parseInt(match[2], 10);
        const minutes = parseFloat(match[3]);
        if (isNaN(degrees) || isNaN(minutes)) return null;
        let decimalDegrees = degrees + (minutes / 60.0);
        if (direction === 'S' || direction === 'W') decimalDegrees = -decimalDegrees;
        // Basic validation
        if ((direction === 'N' || direction === 'S') && (decimalDegrees < -90 || decimalDegrees > 90)) return null;
        if ((direction === 'E' || direction === 'W') && (decimalDegrees < -180 || decimalDegrees > 180)) return null;
        return decimalDegrees;
    }
    // Allow simple decimal input as fallback
    const decimalVal = parseFloat(dmmString);
    if (!isNaN(decimalVal)) {
         // Basic validation - check if it's within plausible lat/lng ranges
         if (decimalVal >= -180 && decimalVal <= 180) return decimalVal;
    }
    return null; // Return null if parsing fails completely
}


// Update map position from coordinate inputs
function updateMapFromCoordinates() {
    const latString = document.getElementById("latitude").value;
    const lngString = document.getElementById("longitude").value;
    console.log("Updating map from coordinates:", latString, lngString);
    const lat = parseDMM(latString);
    const lng = parseDMM(lngString);
    if (lat !== null && lng !== null && map) {
        const newCenter = { lat, lng };
        ignoreNextCenterChange = true; // Prevent center_changed listener from re-updating fields
        map.setCenter(newCenter);
        if (marker) marker.setPosition(newCenter);
        console.log("Map centered at:", lat, lng);
        // Manually update display as center_changed is ignored
        const formattedLat = formatDMM(lat, "lat");
        const formattedLng = formatDMM(lng, "lng");
        const latLongDisplay = document.getElementById("latLongDisplay");
        if (latLongDisplay) {
            latLongDisplay.textContent = `${formattedLat} | ${formattedLng}`;
        }
         if (typeof validateInputs === 'function') { validateInputs(); } // Validate after manual update
    } else {
        console.error("Failed to parse coordinates or map not ready:", latString, lngString);
        // alert("Invalid coordinate format entered. Please use N/S/E/W D° M.MMMMM' (e.g., N32° 56.88113') or simple decimal degrees."); // REMOVED
    }
}

// Handle address geolocation
function geocodeAddress(address) {
    if (!address || address.trim() === '') return;
    console.log("Geocoding address:", address);
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address: address }, function(results, status) {
        if (status === "OK" && results && results.length > 0) {
            const location = results[0].geometry.location;
            const viewport = results[0].geometry.viewport;
            console.log(`DEBUG: Geocode result for address:`, results[0]);
            
            ignoreNextCenterChange = true;
            
            // Do not clear ZIP boundary overlays here; address geocode must not erase ZIP shapes
            
            if (viewport) {
                 map.fitBounds(viewport); // Fit to viewport
                 console.log(`DEBUG: Fitting map to viewport for address`);
            } else {
                 map.setCenter(location);
                 map.setZoom(12); // Default zoom if no viewport
                 console.log(`DEBUG: Centering map (no viewport) for address`);
            }
            
            // Use addListenerOnce for 'idle' to ensure it runs after map settles
            google.maps.event.addListenerOnce(map, 'idle', function() {
                const mapCenter = map.getCenter(); // Get center *after* map settles
                if (marker) marker.setPosition(mapCenter);
                updateCoordinates(mapCenter.lat(), mapCenter.lng()); // Update fields to final center
                
                // Extract location information
                let city = '';
                let state = '';
                let country = '';
                let postalCode = ''; // Added to extract ZIP code
                
                if (results[0].address_components) {
                    for (const component of results[0].address_components) {
                        if (component.types.includes('locality') || component.types.includes('postal_town')) {
                            city = component.long_name;
                        } else if (component.types.includes('administrative_area_level_1')) {
                            state = component.short_name;
                        } else if (component.types.includes('country')) {
                            country = component.long_name;
                        } else if (component.types.includes('postal_code')) {
                            postalCode = component.long_name; // Extract ZIP/postal code
                        }
                    }
                }
                
                // Update ZIP code field if postal code was found
                if (postalCode) {
                    const zipInput = document.getElementById("zip-code");
            if (zipInput) {
                zipInput.value = postalCode;
                console.log(`Updated ZIP code field to: ${postalCode}`);
            }
                }
                
                // Save address to history
                if (typeof saveAddressToHistory === 'function') {
                    saveAddressToHistory(address);
                    console.log(`Saved address to history: ${address}`);
                } else {
                    console.error("saveAddressToHistory function not found. Cannot save address history.");
                }
                
                console.log(`Address geocoded successfully to: ${city}, ${state}, ${country}`);
            });
        } else {
            console.error(`Address not found or geocoding failed: ${status}`);
            alert(`Address "${address}" not found or geocoding failed.`);
        }
    });
}

// Register implementation for the Maps async callback stub in HTML
try {
  window.__initMapImpl = initializeGoogleMapInternal;
  if (window.__initMapRequested) {
    // If the Google callback already fired, initialize now
    initializeGoogleMapInternal();
  }
} catch(e) { /* no-op */ }

/* END OF CODE - Codex - 2025-09-07 17:12 File: js/map.js */

// Handle ZIP code geolocation (LEGACY VERSION RENAMED). Use earlier geocodeZip above.
function geocodeZip_LEGACY(zip) {
    if (!zip || zip.trim() === '') return;
    console.log("Geocoding ZIP:", zip);
    
    // Clear the address field when a new ZIP code is entered
    const addressInput = document.getElementById("address");
    if (addressInput) {
        addressInput.value = '';
        console.log("Address field cleared due to ZIP code entry");
    }
    
    const geocoder = new google.maps.Geocoder();
    const geocodeRequest = { address: zip };
    if (/^\d{5}(-\d{4})?$/.test(zip)) {
        geocodeRequest.componentRestrictions = { country: 'US' };
    }

    geocoder.geocode(geocodeRequest, function(results, status) {
        if (status === "OK" && results && results.length > 0) {
            const location = results[0].geometry.location;
            const viewport = results[0].geometry.viewport; // Get viewport
            console.log(`DEBUG: Geocode result for ${zip}:`, results[0]); // Log full result
            console.log(`DEBUG: Viewport for ${zip}:`, viewport ? JSON.stringify(viewport.toJSON()) : 'N/A'); // Log viewport

            ignoreNextCenterChange = true;

            try { if (window.zipOverlay) window.zipOverlay.setMap(null); } catch(_){}
            try { if (window.zipRect) window.zipRect.setMap(null); } catch(_){}

            if (viewport) {
                 const paths = getPolygonPathsFromViewport(viewport);
                 const rb = new google.maps.LatLngBounds(viewport.getSouthWest(), viewport.getNorthEast());
                 window.zipRect = new google.maps.Rectangle({ bounds: rb, strokeColor:'#FF0000', strokeOpacity:0.6, strokeWeight:2, fillColor:'#FF0000', fillOpacity:0.15, zIndex:900, map: map });
                 window.zipOverlay = new google.maps.Polygon({
                     paths: paths, strokeColor: "#FF0000", strokeOpacity: 1.0, strokeWeight: 3,
                     fillColor: "#FF0000", fillOpacity: 0.30,
                     map: map, zIndex: 1000
                 });
                 try { window.zipPolygon = window.zipOverlay; } catch(_){ }
                 map.fitBounds(viewport); // Fit to viewport
                 console.log(`DEBUG: Fitting map to viewport for ${zip}`);
            } else {
                map.setCenter(location);
                map.setZoom(12); // Default zoom if no viewport
                console.log(`DEBUG: Centering map (no viewport) for ${zip}`);
            }

            // Use addListenerOnce for 'idle' to ensure it runs after map settles
            google.maps.event.addListenerOnce(map, 'idle', function() {
                const mapCenter = map.getCenter(); // Get center *after* map settles
                if (marker) marker.setPosition(mapCenter);
                updateCoordinates(mapCenter.lat(), mapCenter.lng()); // Update fields to final center

                // --- CORRECTED History Saving ---
                let city = '';
                let state = '';
                if (results[0].address_components) {
                    for (const component of results[0].address_components) {
                        if (component.types.includes('locality') || component.types.includes('postal_town')) { // Include postal_town
                            city = component.long_name;
                        } else if (component.types.includes('administrative_area_level_1')) {
                            state = component.short_name;
                        }
                    }
                }
                // Construct display text, handle cases where city/state might be missing
                const displayText = (city && state) ? `${zip} (${city}, ${state})` : (city ? `${zip} (${city})` : zip);

                // *** ADDED CHECK: Only save if city and state were found ***
                if (city && state) {
                    console.log('DEBUG MAP: Calling saveZipCodeToHistory with:', displayText); // DEBUG Log before call
                    if (typeof saveZipCodeToHistory === 'function') {
                        // Call the function from history.js with the CORRECT formatted string
                        saveZipCodeToHistory(displayText);
                    } else {
                        console.error("saveZipCodeToHistory function not found. Cannot save ZIP history.");
                    }
                } else {
                    console.log(`DEBUG MAP: Skipping history save for ZIP ${zip} because city/state was not found.`);
                }
                // --- END CORRECTED History Saving ---
            });

            console.log(`ZIP code ${zip} geocoded successfully.`);
        } else {
            console.error(`ZIP Code ${zip} not found or geocoding failed: ${status}`);
            // Do not alert; the primary geocodeZip shows status inline.
        }
    });
}

// Convert viewport to polygon paths
function getPolygonPathsFromViewport(viewport) {
    const ne = viewport.getNorthEast();
    const sw = viewport.getSouthWest();
    return [
        new google.maps.LatLng(ne.lat(), ne.lng()),
        new google.maps.LatLng(ne.lat(), sw.lng()),
        new google.maps.LatLng(sw.lat(), sw.lng()),
        new google.maps.LatLng(sw.lat(), ne.lng()),
        new google.maps.LatLng(ne.lat(), ne.lng())
    ];
}

// Set up marker selection
function setUpMarkerSelection() {
    // Assuming icon buttons are static in HTML, find them once
    const iconButtons = document.querySelectorAll(".icon-button"); // Check if these exist in HTML
    if (iconButtons.length > 0) {
        iconButtons.forEach(button => {
            // Remove listener first to prevent duplicates if this runs multiple times
            button.removeEventListener("click", iconButtonClickHandler);
            button.addEventListener("click", iconButtonClickHandler);
        });
         console.log("Marker icon selection listeners added.");
    } else {
         console.warn("No elements with class '.icon-button' found for marker selection.");
    }
}

// Separate handler function for icon button clicks
function iconButtonClickHandler(event) {
    event.preventDefault();
    event.stopPropagation(); // Prevent potential event bubbling issues
    const selectedIcon = this.getAttribute("data-icon");
    console.log("Selected marker icon:", selectedIcon);
    if (marker && map && selectedIcon) {
        marker.setIcon({
            url: selectedIcon,
            scaledSize: new google.maps.Size(35, 35), // Keep size consistent
            anchor: new google.maps.Point(17.5, 17.5) // Keep anchor centered
        });
    }
    // Update visual selection state
    document.querySelectorAll(".icon-button").forEach(btn => btn.classList.remove("selected"));
    this.classList.add("selected");
}

// Explicitly attach the initialization function to the window object
window.initializeGoogleMap = initializeGoogleMapInternal;
console.log("initializeGoogleMap function attached to window object.");
// END OF CODE - Cline - 2025-05-10 18:45 File: js/map.js
