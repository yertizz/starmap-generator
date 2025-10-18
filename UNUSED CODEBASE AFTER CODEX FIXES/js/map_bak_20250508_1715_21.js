// START OF CODE - Cline - 2025-04-14 17:55 File: js/map.js
// Initialize Map and Set Default Position
console.log("Map.js loaded successfully");

let map;
let marker;
let zipPolygon;
let mapInitialized = false;
let ignoreNextCenterChange = false;

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

    // Add crosshairs overlay (just two lines)
    addCrosshairs();

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

// Handle ZIP code geolocation
function geocodeZip(zip) {
    if (!zip || zip.trim() === '') return;
    console.log("Geocoding ZIP:", zip);
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

            if (zipPolygon) zipPolygon.setMap(null); // Clear previous polygon

            if (viewport) {
                 const paths = getPolygonPathsFromViewport(viewport);
                 zipPolygon = new google.maps.Polygon({
                     paths: paths, strokeColor: "#FF0000", strokeOpacity: 0.8, strokeWeight: 2,
                     fillColor: "#FF0000", fillOpacity: 0.15, // Slightly less opaque fill
                     map: map
                 });
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
            alert(`ZIP Code "${zip}" not found or geocoding failed.`);
        }
    });
}

// Convert viewport to polygon paths
function getPolygonPathsFromViewport(viewport) {
    const ne = viewport.getNorthEast();
    const sw = viewport.getSouthWest();
    return [
        { lat: ne.lat(), lng: ne.lng() }, { lat: ne.lat(), lng: sw.lng() },
        { lat: sw.lat(), lng: sw.lng() }, { lat: sw.lat(), lng: ne.lng() },
        { lat: ne.lat(), lng: ne.lng() } // Close the loop
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
// END OF CODE - Cline - 2025-04-14 17:55 File: js/map.js
