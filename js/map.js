/* START OF CODE - Codex - 2025-09-07 17:12 File: js/map.js | TIMESTAMP CONFIRMATION: 2025-09-08 19:55 UTC */
// START OF CODE - Cline - 2025-05-10 18:45 File: js/map.js
// Initialize Map and Set Default Position
console.log("Map.js loaded successfully");

let map;
let marker;
// Overlays: polygon outline and rectangle helper (and legacy alias)
window.zipOverlay = window.zipOverlay || null; // Polygon
window.zipRect = window.zipRect || null;      // Rectangle
try { if (typeof window.zipPolygon === 'undefined') window.zipPolygon = null; } catch(_){}
// Feature flag: keep map usable while DDS (Data‑Driven Styling) is being wired
// Set to true only after Map ID is confirmed to have POSTAL_CODE feature layer attached
const USE_DDS = false;
try { if (typeof window.__CURRENT_ZIP === 'undefined') window.__CURRENT_ZIP = ''; } catch(_){}
try { if (typeof window.__CURRENT_CITY === 'undefined') window.__CURRENT_CITY = ''; } catch(_){}
try { if (typeof window.__CURRENT_STATE === 'undefined') window.__CURRENT_STATE = ''; } catch(_){}
try { if (typeof window.__CURRENT_COUNTRY === 'undefined') window.__CURRENT_COUNTRY = ''; } catch(_){}
try { if (!Array.isArray(window.__LAST_CORNERS)) window.__LAST_CORNERS = []; } catch(_){}
let mapInitialized = false;
let ignoreNextCenterChange = false;
let geocoderInstance;
let showZipBoundary = true; // legacy local alias (kept); actual flag on window
try { if (typeof window.showZipBoundary === 'undefined') window.showZipBoundary = true; } catch(_){}
// In-flight guards for ZIP lookups
try { window.__ZIP_INFLIGHT = null; window.__LAST_ZIP = ''; if (!window.__LAST_ACTION) window.__LAST_ACTION = { type:'', ts:0 }; } catch(_){}

// Lightweight status helper (no console needed)
function ensurePolygonStatusEl(){
    try {
        if (document.getElementById('polygon-status')) return;
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) return;
        const status = document.createElement('div');
        status.id = 'polygon-status';
        status.style.cssText = 'margin:8px 0;padding:6px 10px;border:2px solid #1D99EF;background:#eef7ff;color:#222;font-weight:700;text-align:center;border-radius:4px;';
        status.textContent = 'Notice:';
        mapContainer.parentNode.insertBefore(status, mapContainer.nextSibling);
    } catch(_){}
}

// Temporary debug markers to prove boundary corners (auto-remove after 5s)
function addTempCornerMarkers(corners, durationMs){
    try {
        if (!window.map || !corners || !corners.length) return;
        const ms = [];
        const sym = { path: google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: '#1D99EF', fillOpacity: 0.95, strokeColor: '#fff', strokeWeight: 2 };
        corners.forEach(pt=>{ const m = new google.maps.Marker({ position: pt, map: map, zIndex: 2000, icon: sym }); ms.push(m); });
        const hold = typeof durationMs==='number' ? durationMs : 5000;
        setTimeout(()=>{ ms.forEach(m=>{ try{ m.setMap(null);}catch(_){}}); }, hold);
    } catch(_){ }
}
function setPolygonStatus(msg){ try { ensurePolygonStatusEl(); const el=document.getElementById('polygon-status'); if(el) el.textContent = msg||''; } catch(_){} }
// Diagnostic helper: show overlay visibility + point count (temporary until confirmed)
function setPolygonStatusDiag(base){
    try {
        const rectOn = (window.zipRect && window.zipRect.getMap && window.zipRect.getMap());
        const polyOn = (window.zipOverlay && window.zipOverlay.getMap && window.zipOverlay.getMap());
        let mapEq = true; try { if (window.zipRect && window.zipRect.getMap) mapEq = mapEq && (window.zipRect.getMap() === map); if (window.zipOverlay && window.zipOverlay.getMap) mapEq = mapEq && (window.zipOverlay.getMap() === map); } catch(_){}
        let points = 0;
        try {
            if (window.zipOverlay && window.zipOverlay.getPath) { points = window.zipOverlay.getPath().getLength(); }
            else if (window.zipOverlay && window.zipOverlay.getPaths) { points = window.zipOverlay.getPaths().getAt(0).getLength(); }
        } catch(_){}
        const z = (window.__CURRENT_ZIP || '').toString().trim();
        const city = (window.__CURRENT_CITY||'').toString().trim();
        const st = (window.__CURRENT_STATE||'').toString().trim();
        const ctry = (window.__CURRENT_COUNTRY||'').toString().trim();
        const place = [city, st].filter(Boolean).join(' ');
        const locStr = (place || ctry) ? `; ${place}${ctry?'. '+ctry:''}` : '';
        let cornersTxt = '';
        try {
            if (Array.isArray(window.__LAST_CORNERS) && window.__LAST_CORNERS.length) {
                const fmt = (pt)=>{ try { return pt.lat().toFixed(5)+","+pt.lng().toFixed(5);} catch(_){ return ''; } };
                cornersTxt = ' ; corners=['+ window.__LAST_CORNERS.map(fmt).filter(Boolean).join(' | ') + ']';
            }
        } catch(_){}
        const zipNote = z ? ` For ${z}${locStr}` : '';
        const msg = `${base}${zipNote}; Overlays: rect=${rectOn? 'on':'off'}, poly=${polyOn? 'on':'off'}, points=${points}; mapEq=${mapEq}` + cornersTxt;
        setPolygonStatus(msg);
    } catch(_){ setPolygonStatus(base); }
}

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

    const mapEl = document.getElementById("map");
    const baseOptions = {
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
    };
    // Prefer vector map with Map ID; fall back to base map if tiles don't appear quickly
    if (USE_DDS) {
        const vectorOptions = Object.assign({}, baseOptions, { mapId: 'edaa122bc4dc88ecf4e9fefd' });
        map = new google.maps.Map(mapEl, vectorOptions);
        let tilesSeen = false;
        try { map.addListener('tilesloaded', function(){ tilesSeen = true; }); } catch(_){}
        setTimeout(function(){
            try {
                if (!tilesSeen) {
                    // Recreate without Map ID to avoid grey pane if DDS style isn't attached yet
                    map = new google.maps.Map(mapEl, baseOptions);
                    setPolygonStatus('Ready (base map)');
                }
            } catch(_){}
        }, 2500);
    } else {
        // Force base map to guarantee tiles in all browsers while DDS is being wired
        map = new google.maps.Map(mapEl, baseOptions);
    }

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
                    geocodeAddress(this.value.trim());
                }
            }
        };
        addressInput.addEventListener('keydown', handleAddressKeydown);
    }

    // Handle ZIP code input
    const zipInput = document.getElementById("zip-code");
    if (zipInput) {
        const handleZipKeydown = function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.value.trim() !== '') {
                    geocodeZip(this.value.trim());
                }
            }
        };
        zipInput.addEventListener('keydown', handleZipKeydown);
    }

    mapInitialized = true;
    setPolygonStatus('Ready');
    console.log("Map initialization complete.");
}

// Crosshairs overlay function
function addCrosshairs() {
    if (!map) return;
    
    const crosshairLayer = document.createElement('div');
    crosshairLayer.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:1000;width:20px;height:20px;';
    crosshairLayer.innerHTML = '<div style="position:absolute;top:50%;left:0;width:100%;height:1px;background:#1D99EF;opacity:0.7;"></div><div style="position:absolute;left:50%;top:0;width:1px;height:100%;background:#1D99EF;opacity:0.7;"></div>';
    
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.style.position = 'relative';
        mapContainer.appendChild(crosshairLayer);
    }
}

// Coordinate formatting functions
function formatDMM(coord, type) {
    const absolute = Math.abs(coord);
    const degrees = Math.floor(absolute);
    const minutes = (absolute - degrees) * 60;
    const direction = coord >= 0 ? (type === 'lat' ? 'N' : 'E') : (type === 'lat' ? 'S' : 'W');
    return `${degrees}°${minutes.toFixed(3)}'${direction}`;
}

function formatDMS(coord, type) {
    const absolute = Math.abs(coord);
    const degrees = Math.floor(absolute);
    const minutes = Math.floor((absolute - degrees) * 60);
    const seconds = ((absolute - degrees) * 60 - minutes) * 60;
    const direction = coord >= 0 ? (type === 'lat' ? 'N' : 'E') : (type === 'lat' ? 'S' : 'W');
    return `${degrees}°${minutes}'${seconds.toFixed(2)}"${direction}`;
}

// Update coordinates display
function updateCoordinates(lat, lng) {
    try {
        const latDMM = formatDMM(lat, 'lat');
        const lngDMM = formatDMM(lng, 'lng');
        const latDMS = formatDMS(lat, 'lat');
        const lngDMS = formatDMS(lng, 'lng');
        
        const latElement = document.getElementById('lat-dmm');
        const lngElement = document.getElementById('lng-dmm');
        const latDMSElement = document.getElementById('lat-dms');
        const lngDMSElement = document.getElementById('lng-dms');
        
        if (latElement) latElement.textContent = latDMM;
        if (lngElement) lngElement.textContent = lngDMM;
        if (latDMSElement) latDMSElement.textContent = latDMS;
        if (lngDMSElement) lngDMSElement.textContent = lngDMS;
        
        // Update decimal format as well
        const latDecElement = document.getElementById('lat-decimal');
        const lngDecElement = document.getElementById('lng-decimal');
        if (latDecElement) latDecElement.textContent = lat.toFixed(6);
        if (lngDecElement) lngDecElement.textContent = lng.toFixed(6);
        
    } catch (error) {
        console.warn('Error updating coordinates:', error);
    }
}

// Address geocoding function
function geocodeAddress(address) {
    if (!address || address.trim() === '') return;
    console.log("Geocoding address:", address);
    
    // Clear the ZIP code field when a new address is entered
    const zipInput = document.getElementById("zip-code");
    if (zipInput) {
        zipInput.value = '';
        console.log("ZIP code field cleared due to address entry");
    }
    
    if (!geocoderInstance) {
        console.error('Geocoder not initialized');
        return;
    }
    
    geocoderInstance.geocode({ address: address }, function(results, status) {
        if (status === "OK" && results && results.length > 0) {
            const location = results[0].geometry.location;
            const viewport = results[0].geometry.viewport;
            console.log(`DEBUG: Geocode result for ${address}:`, results[0]);
            console.log(`DEBUG: Viewport for ${address}:`, viewport ? JSON.stringify(viewport.toJSON()) : 'N/A');

            ignoreNextCenterChange = true;

            try { if (window.zipOverlay) window.zipOverlay.setMap(null); } catch(_){}
            try { if (window.zipRect) window.zipRect.setMap(null); } catch(_){}

            if (viewport) {
                map.fitBounds(viewport);
                console.log(`DEBUG: Fitting map to viewport for address`);
            } else {
                map.setCenter(location);
                map.setZoom(15);
                console.log(`DEBUG: Centering map (no viewport) for address`);
            }
            
            // Use addListenerOnce for 'idle' to ensure it runs after map settles
            google.maps.event.addListenerOnce(map, 'idle', function() {
                const mapCenter = map.getCenter();
                if (marker) marker.setPosition(mapCenter);
                updateCoordinates(mapCenter.lat(), mapCenter.lng());

                // Extract location information
                let city = '';
                let state = '';
                let country = '';
                let postalCode = '';
                
                if (results[0].address_components) {
                    for (const component of results[0].address_components) {
                        if (component.types.includes('locality') || component.types.includes('postal_town')) {
                            city = component.long_name;
                        } else if (component.types.includes('administrative_area_level_1')) {
                            state = component.short_name;
                        } else if (component.types.includes('country')) {
                            country = component.long_name;
                        } else if (component.types.includes('postal_code')) {
                            postalCode = component.long_name;
                        }
                    }
                }
                
                // Update ZIP code field if postal code was found
                if (postalCode) {
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
                // Update notice to reflect address context, not the last ZIP
                try { 
                    window.__CURRENT_ZIP = ''; 
                    window.__CURRENT_CITY = city; 
                    window.__CURRENT_STATE = state; 
                    window.__CURRENT_COUNTRY = country; 
                } catch(_){}
                try { 
                    setPolygonStatus(`Ready — Address centered: ${[city,state].filter(Boolean).join(' ')}${country?'. '+country:''}`); 
                } catch(_){}
            });
        } else {
            console.error(`Address not found or geocoding failed: ${status}`);
            alert(`Address "${address}" not found or geocoding failed.`);
        }
    });
}

// ZIP code geocoding function
function geocodeZip(zip) {
    if (!zip || zip.trim() === '') return;
    console.log("Geocoding ZIP:", zip);
    
    // Clear the address field when a new ZIP code is entered
    const addressInput = document.getElementById("address");
    if (addressInput) {
        addressInput.value = '';
        console.log("Address field cleared due to ZIP code entry");
    }
    
    if (!geocoderInstance) {
        console.error('Geocoder not initialized');
        return;
    }
    
    const geocodeRequest = { address: zip };
    if (/^\d{5}(-\d{4})?$/.test(zip)) {
        geocodeRequest.componentRestrictions = { country: 'US' };
    }

    geocoderInstance.geocode(geocodeRequest, function(results, status) {
        if (status === "OK" && results && results.length > 0) {
            const location = results[0].geometry.location;
            const viewport = results[0].geometry.viewport;
            console.log(`DEBUG: Geocode result for ${zip}:`, results[0]);
            console.log(`DEBUG: Viewport for ${zip}:`, viewport ? JSON.stringify(viewport.toJSON()) : 'N/A');

            ignoreNextCenterChange = true;

            try { if (window.zipOverlay) window.zipOverlay.setMap(null); } catch(_){}
            try { if (window.zipRect) window.zipRect.setMap(null); } catch(_){}

            if (viewport) {
                const paths = getPolygonPathsFromViewport(viewport);
                const rb = new google.maps.LatLngBounds(viewport.getSouthWest(), viewport.getNorthEast());
                window.zipRect = new google.maps.Rectangle({ 
                    bounds: rb, 
                    strokeColor: '#FF0000', 
                    strokeOpacity: 0.6, 
                    strokeWeight: 2, 
                    fillColor: '#FF0000', 
                    fillOpacity: 0.15, 
                    zIndex: 900, 
                    map: map 
                });
                window.zipOverlay = new google.maps.Polygon({
                    paths: paths, 
                    strokeColor: "#FF0000", 
                    strokeOpacity: 1.0, 
                    strokeWeight: 3,
                    fillColor: "#FF0000", 
                    fillOpacity: 0.30,
                    map: map, 
                    zIndex: 1000
                });
                try { window.zipPolygon = window.zipOverlay; } catch(_){ }
                map.fitBounds(viewport);
                console.log(`DEBUG: Fitting map to viewport for ${zip}`);
            } else {
                map.setCenter(location);
                map.setZoom(12);
                console.log(`DEBUG: Centering map (no viewport) for ${zip}`);
            }

            // Use addListenerOnce for 'idle' to ensure it runs after map settles
            google.maps.event.addListenerOnce(map, 'idle', function() {
                const mapCenter = map.getCenter();
                if (marker) marker.setPosition(mapCenter);
                updateCoordinates(mapCenter.lat(), mapCenter.lng());

                // Extract location information
                let city = '';
                let state = '';
                if (results[0].address_components) {
                    for (const component of results[0].address_components) {
                        if (component.types.includes('locality') || component.types.includes('postal_town')) {
                            city = component.long_name;
                        } else if (component.types.includes('administrative_area_level_1')) {
                            state = component.short_name;
                        }
                    }
                }
                
                // Construct display text, handle cases where city/state might be missing
                const displayText = (city && state) ? `${zip} (${city}, ${state})` : (city ? `${zip} (${city})` : zip);

                // Only save if city and state were found
                if (city && state) {
                    console.log('DEBUG MAP: Calling saveZipCodeToHistory with:', displayText);
                    if (typeof saveZipCodeToHistory === 'function') {
                        saveZipCodeToHistory(displayText);
                    } else {
                        console.error("saveZipCodeToHistory function not found. Cannot save ZIP history.");
                    }
                } else {
                    console.log(`DEBUG MAP: Skipping history save for ZIP ${zip} because city/state was not found.`);
                }
                
                // Update current location context
                try { 
                    window.__CURRENT_ZIP = zip; 
                    window.__CURRENT_CITY = city; 
                    window.__CURRENT_STATE = state; 
                    window.__CURRENT_COUNTRY = ''; 
                } catch(_){}
            });

            console.log(`ZIP code ${zip} geocoded successfully.`);
        } else {
            console.error(`ZIP Code ${zip} not found or geocoding failed: ${status}`);
            alert(`ZIP Code "${zip}" not found or geocoding failed.`);
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
    const iconButtons = document.querySelectorAll(".icon-button");
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
    event.stopPropagation();
    const selectedIcon = this.getAttribute("data-icon");
    console.log("Selected marker icon:", selectedIcon);
    if (marker && map && selectedIcon) {
        marker.setIcon({
            url: selectedIcon,
            scaledSize: new google.maps.Size(35, 35),
            anchor: new google.maps.Point(17.5, 17.5)
        });
    }
    // Update visual selection state
    document.querySelectorAll(".icon-button").forEach(btn => btn.classList.remove("selected"));
    this.classList.add("selected");
}

// Input validation function
function validateInputs() {
    const addressInput = document.getElementById("address");
    const zipInput = document.getElementById("zip-code");
    const latInput = document.getElementById("latitude");
    const lngInput = document.getElementById("longitude");
    
    let isValid = true;
    
    if (addressInput && addressInput.value.trim() === '' && 
        zipInput && zipInput.value.trim() === '' && 
        latInput && lngInput && (latInput.value.trim() === '' || lngInput.value.trim() === '')) {
        isValid = false;
    }
    
    return isValid;
}

// Initialize marker icons
function initializeMarkerIcons() {
    const iconContainer = document.getElementById('marker-icons');
    if (!iconContainer) return;
    
    const icons = [
        { name: 'Default', url: 'assets/images/locationtag.png' },
        { name: 'Red Pin', url: 'assets/images/red-pin.png' },
        { name: 'Blue Pin', url: 'assets/images/blue-pin.png' },
        { name: 'Green Pin', url: 'assets/images/green-pin.png' }
    ];
    
    icons.forEach((icon, index) => {
        const button = document.createElement('button');
        button.className = 'icon-button';
        button.setAttribute('data-icon', icon.url);
        button.innerHTML = `<img src="${icon.url}" alt="${icon.name}" style="width:30px;height:30px;">`;
        button.title = icon.name;
        if (index === 0) button.classList.add('selected');
        iconContainer.appendChild(button);
    });
    
    setUpMarkerSelection();
}

// Map utility functions
function clearOverlays() {
    try {
        if (window.zipOverlay) {
            window.zipOverlay.setMap(null);
            window.zipOverlay = null;
        }
        if (window.zipRect) {
            window.zipRect.setMap(null);
            window.zipRect = null;
        }
        if (window.zipPolygon) {
            window.zipPolygon.setMap(null);
            window.zipPolygon = null;
        }
    } catch (error) {
        console.warn('Error clearing overlays:', error);
    }
}

function resetMap() {
    try {
        clearOverlays();
        const defaultPosition = { lat: 39.8333, lng: -98.5855 };
        map.setCenter(defaultPosition);
        map.setZoom(4);
        if (marker) {
            marker.setPosition(defaultPosition);
        }
        updateCoordinates(defaultPosition.lat, defaultPosition.lng);
        
        // Clear input fields
        const addressInput = document.getElementById("address");
        const zipInput = document.getElementById("zip-code");
        if (addressInput) addressInput.value = '';
        if (zipInput) zipInput.value = '';
        
        setPolygonStatus('Map reset to default view');
    } catch (error) {
        console.error('Error resetting map:', error);
    }
}

// Explicitly attach the initialization function to the window object
window.initializeGoogleMap = initializeGoogleMapInternal;
console.log("initializeGoogleMap function attached to window object.");

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeMarkerIcons();
    console.log("Marker icons initialized");
});

// Register implementation for the Maps async callback stub in HTML
try {
  window.__initMapImpl = initializeGoogleMapInternal;
  if (window.__initMapRequested) {
    // If the Google callback already fired, initialize now
    initializeGoogleMapInternal();
  }
} catch(e) { /* no-op */ }

/* END OF CODE - Codex - 2025-09-07 17:12 File: js/map.js */
