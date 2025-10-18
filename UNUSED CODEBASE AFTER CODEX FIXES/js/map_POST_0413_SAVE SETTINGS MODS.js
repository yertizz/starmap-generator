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
        console.log("Map center changed:", center.lat(), center.lng());
        updateCoordinates(center.lat(), center.lng());

        // Update marker position to follow the center
        if (marker) {
            marker.setPosition(center);
        }
    });

    // Update coordinates when map is idle (after drag, zoom, etc.)
    google.maps.event.addListener(map, "idle", function() {
        let center = map.getCenter();
        console.log("Map idle at:", center.lat(), center.lng());
        updateCoordinates(center.lat(), center.lng());
    });

    // Handle ZIP code input
    const zipInput = document.getElementById("zip-code");
    if (zipInput) {
        zipInput.addEventListener("change", function(e) {
            if (this.value.trim() !== '') {
                e.preventDefault(); // Prevent form submission
                saveZipCodeToHistory(this.value);
                geocodeZip(this.value);
            }
        });

        zipInput.addEventListener("keypress", function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                if (this.value.trim() !== '') {
                    saveZipCodeToHistory(this.value);
                    geocodeZip(this.value);
                }
            }
        });
    } else {
        console.error("ZIP Code input field not found.");
    }


    // Load zip code history
    loadZipCodeHistory();

    // Handle latitude input
    const latInput = document.getElementById("latitude");
     if(latInput) {
        latInput.addEventListener("change", function() {
            updateMapFromCoordinates();
        });
     } else {
         console.error("Latitude input field not found.");
     }


    // Handle longitude input
    const lonInput = document.getElementById("longitude");
    if(lonInput) {
        lonInput.addEventListener("change", function() {
            updateMapFromCoordinates();
        });
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

// Function to save zip code to history
function saveZipCodeToHistory(zipCode) {
    if (!zipCode || zipCode.trim() === '') return;

    // Get existing history or create new array
    let history = JSON.parse(localStorage.getItem('zip_code_history') || '[]');

    // Get location information if available
    let locationInfo = '';

    // Check if we have predefined location info for this zip
    const zipLocations = {
        '94133': 'San Francisco, CA',
        '10013': 'New York, NY',
        '33109': 'Miami Beach, FL',
        '98033': 'Kirkland, WA',
        '29485': 'Summerville, SC' // Added from user feedback
    };

    if (zipLocations[zipCode]) {
        locationInfo = zipLocations[zipCode];
    }

    // Create history entry with zip code and location info
    const entry = {
        zipCode: zipCode,
        locationInfo: locationInfo,
        displayText: locationInfo ? `${zipCode} (${locationInfo})` : zipCode,
        timestamp: new Date().getTime() // Add timestamp for sorting
    };

    // Remove duplicate if exists
    history = history.filter(item => item.zipCode !== zipCode);

    // Add new entry to the beginning
    history.unshift(entry);

    // Keep only the last 20 entries
    if (history.length > 20) {
        history = history.slice(0, 20);
    }

    // Save back to local storage
    localStorage.setItem('zip_code_history', JSON.stringify(history));

    // Update the datalist
    updateZipCodeDatalist(history);
}

// Function to load zip code history
function loadZipCodeHistory() {
    // Get existing history
    const history = JSON.parse(localStorage.getItem('zip_code_history') || '[]');

    // Update the datalist
    updateZipCodeDatalist(history);
}

// Function to update zip code datalist
function updateZipCodeDatalist(history) {
    // Create datalist for suggestions if it doesn't exist
    let datalistId = 'zip-code-history';
    let datalist = document.getElementById(datalistId);

    if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = datalistId;
        document.body.appendChild(datalist); // Append to body if not found in specific location
        const zipInput = document.getElementById('zip-code');
        if (zipInput) {
            zipInput.setAttribute('list', datalistId);
        }
    }

    // Clear existing options
    datalist.innerHTML = '';

    // Add history items to datalist
    history.forEach(entry => {
        const option = document.createElement('option');
        option.value = entry.zipCode;
        // Display text in the dropdown suggestion
        option.label = entry.displayText; // Use label for display text
        datalist.appendChild(option);
    });
}

// Add crosshairs to the map (just two lines)
function addCrosshairs() {
    // Remove existing crosshairs if any
    const existingCrosshairs = document.getElementById('crosshairs');
    if (existingCrosshairs) {
        existingCrosshairs.remove();
    }

    // Create new crosshairs container
    const crosshairs = document.createElement('div');
    crosshairs.id = 'crosshairs';
    // Styles moved to CSS for better separation

    // Add crosshairs to map container
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        mapContainer.appendChild(crosshairs);
    } else {
        console.error("Map container not found for adding crosshairs.");
    }
}

// Helper function to create marker content (Not currently used, but kept for potential future use)
function createMarkerContent(iconPath) {
    const img = document.createElement('img');
    img.src = iconPath;
    img.style.width = '35px';
    img.style.height = '35px';
    return img;
}

// Update coordinate fields dynamically
function updateCoordinates(lat, lng) {
    console.log("Updating coordinates to:", lat, lng);

    try {
        // Format coordinates
        const formattedLat = formatDMM(lat, "lat");
        const formattedLng = formatDMM(lng, "lng");
        console.log("Formatted coordinates:", formattedLat, formattedLng);

        // Update the display paragraph
        const latLongDisplay = document.getElementById("latLongDisplay");
        if (latLongDisplay) {
            latLongDisplay.textContent = `${formattedLat} | ${formattedLng}`;
            console.log("Updated latLongDisplay:", latLongDisplay.textContent);
        } else {
            console.error("CRITICAL ERROR: latLongDisplay element not found");
        }

        // Update the input fields (without triggering change events)
        const latField = document.getElementById("latitude");
        const lngField = document.getElementById("longitude");

        if (latField && lngField) {
            // Store current onchange handlers
            const latOnChange = latField.onchange;
            const lngOnChange = lngField.onchange;

            // Temporarily remove onchange handlers
            latField.onchange = null;
            lngField.onchange = null;

            // Update values
            latField.value = formattedLat;
            lngField.value = formattedLng;

            // Restore onchange handlers
            latField.onchange = latOnChange;
            lngField.onchange = lngOnChange;

            // Trigger validation check in main_app.js
             if (typeof validateInputs === 'function') {
                 validateInputs();
             }

        } else {
            console.error("Latitude or longitude input field not found");
        }
    } catch (error) {
        console.error("Error updating coordinates:", error);
    }
}

// Format coordinates in Degrees and Decimal Minutes (DMM)
function formatDMM(decimalDegrees, type) {
    if (isNaN(decimalDegrees)) return "Invalid"; // Handle NaN input
    const degrees = Math.floor(Math.abs(decimalDegrees));
    const minutes = (Math.abs(decimalDegrees) - degrees) * 60;
    let direction = "";

    if (type === "lat") {
        direction = decimalDegrees >= 0 ? "N" : "S";
    } else if (type === "lng") {
        direction = decimalDegrees >= 0 ? "E" : "W";
    }

    // Format as N32° 56.88113' W80° 7.22460' (Using ' instead of ′ for simplicity)
    const wholeMinutes = Math.floor(minutes);
    const decimalMinutesPart = (minutes - wholeMinutes).toFixed(5); // Keep leading zero
    // Extract the part after the decimal point
    const decimalPart = decimalMinutesPart.substring(decimalMinutesPart.indexOf('.') + 1);

    return `${direction}${degrees}° ${wholeMinutes}.${decimalPart}'`; // Simplified format
}

// Parse DMM format to decimal degrees
function parseDMM(dmmString) {
    if (!dmmString || typeof dmmString !== 'string') return null;

    // Match N/S/E/W prefix, degrees, minutes (potentially with decimal)
    const match = dmmString.trim().match(/^([NSEW])\s*(\d+)\s*°\s*(\d+(?:\.\d+)?)\s*['′]?$/i);

    if (match) {
        const direction = match[1].toUpperCase();
        const degrees = parseInt(match[2], 10);
        const minutes = parseFloat(match[3]);

        if (isNaN(degrees) || isNaN(minutes)) return null;

        // Calculate decimal degrees
        let decimalDegrees = degrees + (minutes / 60.0);

        // Apply direction
        if (direction === 'S' || direction === 'W') {
            decimalDegrees = -decimalDegrees;
        }

        // Basic validation
        if ((direction === 'N' || direction === 'S') && (decimalDegrees < -90 || decimalDegrees > 90)) return null;
        if ((direction === 'E' || direction === 'W') && (decimalDegrees < -180 || decimalDegrees > 180)) return null;


        return decimalDegrees;
    }

    // Fallback for simple decimal input
    const decimalVal = parseFloat(dmmString);
    if (!isNaN(decimalVal)) {
         // Basic validation for decimal
        // Assuming latitude if no direction, needs context for longitude validation
        if (decimalVal >= -90 && decimalVal <= 90) return decimalVal;
    }


    return null; // Return null if parsing fails
}


// Update map position from coordinate inputs
function updateMapFromCoordinates() {
    const latString = document.getElementById("latitude").value;
    const lngString = document.getElementById("longitude").value;

    console.log("Updating map from coordinates:", latString, lngString);

    const lat = parseDMM(latString);
    const lng = parseDMM(lngString);

    if (lat !== null && lng !== null && map) {
        // Prevent the center_changed event from updating coordinates again
        ignoreNextCenterChange = true;

        // Center map at the new coordinates
        map.setCenter({ lat, lng });

        // Update marker position
        if (marker) {
            marker.setPosition({ lat, lng });
        }

        console.log("Map centered at:", lat, lng);
    } else {
        console.error("Failed to parse coordinates or map not ready:", latString, lngString);
        // Optionally provide user feedback here
    }
}

// Handle ZIP code geolocation
function geocodeZip(zip) {
    if (!zip || zip.trim() === '') return;

    console.log("Geocoding ZIP:", zip);

    // Add support for common USA zip code formats
    const usaZipRegex = /^\d{5}(-\d{4})?$/;
    const isUSAZip = usaZipRegex.test(zip);

    // Try to get actual polygon data for the ZIP code
    // For demonstration, we'll create more complex polygons for specific ZIP codes
    const specialZips = {
        '94133': [ // San Francisco
            {lat: 37.8050, lng: -122.4194}, {lat: 37.8064, lng: -122.4074}, {lat: 37.8025, lng: -122.4033},
            {lat: 37.7991, lng: -122.4018}, {lat: 37.7970, lng: -122.4060}, {lat: 37.7952, lng: -122.4160},
            {lat: 37.8002, lng: -122.4208}
        ],
        '10013': [ // New York
            {lat: 40.7205, lng: -74.0048}, {lat: 40.7247, lng: -74.0037}, {lat: 40.7258, lng: -73.9972},
            {lat: 40.7234, lng: -73.9924}, {lat: 40.7197, lng: -73.9935}, {lat: 40.7183, lng: -73.9997}
        ],
        '33109': [ // Miami Beach
            {lat: 25.7645, lng: -80.1435}, {lat: 25.7690, lng: -80.1410}, {lat: 25.7715, lng: -80.1340},
            {lat: 25.7690, lng: -80.1310}, {lat: 25.7640, lng: -80.1325}, {lat: 25.7620, lng: -80.1390}
        ],
        '98033': [ // Kirkland, WA
            {lat: 47.6814, lng: -122.2087}, {lat: 47.6950, lng: -122.1950}, {lat: 47.6980, lng: -122.1850},
            {lat: 47.6900, lng: -122.1750}, {lat: 47.6750, lng: -122.1800}, {lat: 47.6700, lng: -122.1950}
        ],
        '29485': [ // Summerville, SC
            {lat: 32.9480, lng: -80.1204}, {lat: 32.9580, lng: -80.1104}, {lat: 32.9680, lng: -80.1004},
            {lat: 32.9480, lng: -80.0904}, {lat: 32.9380, lng: -80.1004}, {lat: 32.9380, lng: -80.1104}
        ],
        '90210': [ // Beverly Hills, CA
            {lat: 34.0901, lng: -118.4065}, {lat: 34.1001, lng: -118.3965}, {lat: 34.1101, lng: -118.4065},
            {lat: 34.1001, lng: -118.4165}, {lat: 34.0901, lng: -118.4065}
        ],
        '60601': [ // Chicago, IL
            {lat: 41.8855, lng: -87.6250}, {lat: 41.8955, lng: -87.6150}, {lat: 41.8855, lng: -87.6050},
            {lat: 41.8755, lng: -87.6150}, {lat: 41.8855, lng: -87.6250}
        ]
    };

    // Check if we have a predefined polygon for this ZIP
    if (specialZips[zip]) {
        // Remove existing ZIP polygon
        if (zipPolygon) {
            zipPolygon.setMap(null);
        }

        // Create a polygon with the predefined coordinates
        zipPolygon = new google.maps.Polygon({
            paths: specialZips[zip],
            strokeColor: "#FF0000", strokeOpacity: 0.8, strokeWeight: 2,
            fillColor: "#FF0000", fillOpacity: 0.3, map: map
        });

        // Calculate bounds for the polygon
        const bounds = new google.maps.LatLngBounds();
        specialZips[zip].forEach(coord => {
            bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
        });

        // Fit the map to the polygon bounds with padding
        map.fitBounds(bounds, { padding: 50 }); // Simplified padding

        // Get the center of the map view (where crosshairs are) after fitting
        google.maps.event.addListenerOnce(map, 'idle', function() {
            const mapCenter = map.getCenter();
            if (marker) marker.setPosition(mapCenter);
            updateCoordinates(mapCenter.lat(), mapCenter.lng());
            saveZipCodeToHistory(zip); // Save valid zip
        });

        console.log("ZIP code polygon created for:", zip);
        return;
    }

    // Fall back to geocoding for other ZIP/Postal codes
    const geocoder = new google.maps.Geocoder();
    const geocodeRequest = { address: zip };
    if (isUSAZip) { // Add country restriction for USA zip codes
        geocodeRequest.componentRestrictions = { country: 'US' };
    }

    geocoder.geocode(geocodeRequest, function(results, status) {
        if (status === "OK" && results && results.length > 0) {
            const location = results[0].geometry.location;
            ignoreNextCenterChange = true; // Prevent immediate coordinate update from center_changed

            // Remove existing ZIP polygon
            if (zipPolygon) zipPolygon.setMap(null);

            // Create polygon with the viewport boundaries if available
            if (results[0].geometry.viewport) {
                 const paths = getPolygonPathsFromViewport(results[0].geometry.viewport); // Use helper
                 zipPolygon = new google.maps.Polygon({
                     paths: paths,
                     strokeColor: "#FF0000", strokeOpacity: 0.8, strokeWeight: 2,
                     fillColor: "#FF0000", fillOpacity: 0.3, map: map
                 });
                 map.fitBounds(results[0].geometry.viewport, { padding: 50 }); // Fit map
            } else {
                map.setCenter(location); // Center map if no viewport
                map.setZoom(12);
            }

            // Wait for map to settle, then update marker/coords
            google.maps.event.addListenerOnce(map, 'idle', function() {
                const mapCenter = map.getCenter();
                if (marker) marker.setPosition(mapCenter);
                updateCoordinates(mapCenter.lat(), mapCenter.lng());

                // Update zip code history with location info
                if (results[0].formatted_address) {
                    updateZipCodeLocationInfo(zip, results[0].formatted_address); // Use formatted address
                    saveZipCodeToHistory(zip); // Save valid zip
                }
            });

            console.log("ZIP code geocoded to:", location.lat(), location.lng());
        } else {
            console.error("ZIP Code not found or geocoding failed:", status);
            alert("ZIP Code not found or geocoding failed.");
        }
    });
}

// Function to update zip code location info in history
function updateZipCodeLocationInfo(zipCode, locationInfo) {
    let history = JSON.parse(localStorage.getItem('zip_code_history') || '[]');
    const index = history.findIndex(item => item.zipCode === zipCode);
    if (index !== -1) {
        history[index].locationInfo = locationInfo; // Update location info
        history[index].displayText = `${zipCode} (${locationInfo})`; // Update display text
        localStorage.setItem('zip_code_history', JSON.stringify(history));
        updateZipCodeDatalist(history); // Refresh datalist
    }
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
    // This function seems incomplete or might be intended for future use
    // For now, ensure it doesn't cause errors if .icon-button elements don't exist
    const iconButtons = document.querySelectorAll(".icon-button");
    if (iconButtons.length > 0) {
        iconButtons.forEach(button => {
            button.removeEventListener("click", iconButtonClickHandler); // Prevent duplicates
            button.addEventListener("click", iconButtonClickHandler);
        });
    } else {
        // console.warn("No elements with class '.icon-button' found for marker selection setup.");
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
    document.querySelectorAll(".icon-button").forEach(btn => btn.classList.remove("selected"));
    this.classList.add("selected");
    return false;
}

// Helper function (assuming validateInputs exists in main_app.js)
function validateInputs() {
    if (typeof window.validateInputs === 'function') {
        window.validateInputs();
    } else {
        // console.warn("Global validateInputs function not found.");
    }
}

// Explicitly attach the initialization function to the window object
window.initializeGoogleMap = initializeGoogleMapInternal;
console.log("initializeGoogleMap function attached to window object.");
