// Main Application Logic for Star Map Generator - main_app.js
// Combined: Correct updateCoordinateUI from backup + generateStarMap reads from display

// --- Global Variables ---
let starFieldColor = "#000000";
let outsideColor = "#0a0e1a";
let aspectRatio = 1.25; // Default aspect ratio (width/height)
let currentStarMapStyle = "standard";
let colorPickersInitialized = false; // Flag to run init only once

// Global object to hold advanced style options
const advancedStyleOptions = {
    milkyWay: false, constellationBounds: false, starsGlow: false,
    starSize: 1.0, starNumber: 2000, constellationLineWidth: 1.0,
    moon: false, sun: false, planets: false, eclipticPath: false,
    celestialBodySize: 1.0, planetLabels: false, constellationLabels: false,
    labelFont: 'Arial', labelFontSize: 10,
};
window.advancedStyleOptions = advancedStyleOptions; // Make accessible globally if needed by other scripts
window.currentStarMapStyle = currentStarMapStyle; // Make accessible globally

// --- Constants for Dropdowns ---
const FONT_FAMILIES = [
    "Arial", "Verdana", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Palatino", "Garamond", "Bookman", "Comic Sans MS", "Trebuchet MS", "Arial Black", "Impact",
    "Roboto", "Open Sans", "Montserrat", "Playfair Display", "Dancing Script", "Pacifico", "Great Vibes", "Satisfy", "Tangerine", "Pinyon Script",
    "Abril Fatface", "Anton", "Bebas Neue", "Black Ops One", "Caveat", "Indie Flower", "Libre Baskerville", "Lilita One", "Lora", "Merriweather",
    "Noto Serif", "Nunito", "Oswald", "Permanent Marker", "Quicksand", "Raleway", "Roboto Slab", "Shadows Into Light"
];

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 60, 72, 96];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', function() {
    console.log("Star Map Generator App Initializing (main_app.js)...");

    // --- Populate Dropdowns ---
    populateFontDropdowns();
    populateFontSizeDropdowns();

    // --- Initialize Modules & Event Listeners ---
    // Call functions from other modules if they exist
    if (typeof loadCustomOccasions === 'function') loadCustomOccasions();
    if (typeof createAdvancedOptionsUI === 'function') createAdvancedOptionsUI();
    if (typeof loadSavedSettings === 'function') loadSavedSettings(); // Load settings early
    if (typeof setupTextInputHistory === 'function') setupTextInputHistory();
    if (typeof setupZipCodeHistory === 'function') setupZipCodeHistory();
    if (typeof setupAdvancedOptionsEventListeners === 'function') setupAdvancedOptionsEventListeners();
    if (typeof loadAdvancedOptions === 'function') loadAdvancedOptions(); // Load advanced options after UI potentially created
    if (typeof addLoadSettingsButton === 'function') addLoadSettingsButton();
    if (typeof addSaveSettingsButton === 'function') addSaveSettingsButton();
    if (typeof initializeHexColorPickers === 'function') initializeHexColorPickers(); // Initialize color pickers early

    // --- Get Core Elements ---
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const canvas = document.getElementById('star-map-canvas');
    const occasionSelect = document.getElementById('occasion');
    const dateInput = document.getElementById('date');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const zipCodeInput = document.getElementById('zip-code');
    const maintainAspectRatioCheckbox = document.getElementById('maintain-aspect-ratio');
    const outputWidthInput = document.getElementById('output-width');
    const outputHeightInput = document.getElementById('output-height');
    const starMapStyleSelect = document.getElementById('star-map-style');
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomValue = document.getElementById('zoom-value');

    // --- Event Listeners Setup ---
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            console.log("Generate button clicked (main_app.js)");
            if (!generateBtn.hasAttribute('disabled')) {
                if (typeof saveCurrentSettings === 'function') saveCurrentSettings(); // Save before generating
                generateStarMap();
            } else { console.log("Generate button is disabled."); }
        });
    } else { console.error("Generate button not found!"); }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            console.log("Download button clicked (main_app.js)");
             if (!downloadBtn.hasAttribute('disabled')) {
                 if (typeof downloadStarMap === 'function') downloadStarMap();
                 else console.error("downloadStarMap function not found!");
             } else { console.log("Download button is disabled."); }
        });
    } else { console.error("Download button not found!"); }

    // Validate inputs on change or input
    const inputsToValidate = [occasionSelect, dateInput, latitudeInput, longitudeInput, zipCodeInput];
    inputsToValidate.forEach(input => {
        if (input) {
            input.addEventListener('change', validateInputs);
            input.addEventListener('input', validateInputs); // Use input for immediate feedback
        }
    });

    // Handle custom occasion input
    if (occasionSelect) {
        occasionSelect.addEventListener('change', handleOccasionChange);
    }

    // Handle image format radio buttons and transparency checkbox
    document.querySelectorAll('input[name="imageType"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            const transparencyCheckbox = document.getElementById('export-transparency');
            if (transparencyCheckbox) {
                const isDisabled = this.value !== 'png';
                transparencyCheckbox.disabled = isDisabled;
                if (isDisabled) transparencyCheckbox.checked = false;
                // Find the parent label or container to apply disabled style
                const labelContainer = transparencyCheckbox.closest('label') || transparencyCheckbox.parentElement;
                if (labelContainer) labelContainer.classList.toggle('disabled', isDisabled);
            }
        });
    });
    // Trigger change on initial load for image format
    const initialImageType = document.querySelector('input[name="imageType"]:checked');
    if (initialImageType) { initialImageType.dispatchEvent(new Event('change')); }

    // Handle star map style changes
    if (starMapStyleSelect) {
        starMapStyleSelect.addEventListener('change', function() {
            if (typeof currentStarMapStyle !== 'undefined') {
                currentStarMapStyle = this.value;
                window.currentStarMapStyle = this.value; // Update global
            } else { console.error("Global 'currentStarMapStyle' not defined!"); }
            console.log(`Star map style changed to: ${this.value}`);
             // Optionally regenerate preview if one exists
             const canvasCheck = document.getElementById('star-map-canvas');
             if (canvasCheck && canvasCheck.getAttribute('data-generated') === 'true') {
                 generateStarMap();
             }
        });
         // Set initial value from potentially loaded settings
         if (typeof currentStarMapStyle !== 'undefined') { starMapStyleSelect.value = currentStarMapStyle; }
    }

    // Handle aspect ratio locking
    if (maintainAspectRatioCheckbox && outputWidthInput && outputHeightInput) {
        // Calculate initial aspect ratio if dimensions are set
        const initialWidth = parseFloat(outputWidthInput.value);
        const initialHeight = parseFloat(outputHeightInput.value);
        if (initialWidth > 0 && initialHeight > 0) {
            aspectRatio = initialWidth / initialHeight;
        }

        maintainAspectRatioCheckbox.addEventListener('change', () => {
            if (maintainAspectRatioCheckbox.checked) {
                // Recalculate aspect ratio when checkbox is checked
                const currentWidth = parseFloat(outputWidthInput.value);
                const currentHeight = parseFloat(outputHeightInput.value);
                if (currentWidth > 0 && currentHeight > 0) {
                    aspectRatio = currentWidth / currentHeight;
                    console.log(`Aspect ratio locked: ${aspectRatio}`);
                }
            } else {
                console.log("Aspect ratio unlocked");
            }
        });
        outputWidthInput.addEventListener('input', handleAspectRatioChange);
        outputHeightInput.addEventListener('input', handleAspectRatioChange);
    }

    // Handle zoom slider
    if (zoomSlider && zoomValue && canvas) {
        zoomSlider.addEventListener('input', function() {
            const zoom = parseInt(this.value);
            zoomValue.textContent = zoom; // Update percentage display
            canvas.style.transform = `scale(${zoom / 100})`;
            canvas.style.transformOrigin = "center top"; // Zoom from top-center
        });
        // Set initial zoom display
        zoomValue.textContent = zoomSlider.value;
    }

    // *** Add event listener for ZIP code input to trigger geocoding automatically ***
    if (zipCodeInput) {
        const triggerGeocode = () => {
            const zipValue = zipCodeInput.value.trim();
            // Basic validation (e.g., 5 digits for US) - adjust as needed
            if (zipValue.match(/^\d{5}$/) && typeof window.geocodeZip === 'function') {
                console.log(`Triggering geocode for ZIP: ${zipValue}`);
                window.geocodeZip(zipValue);
            } else if (zipValue) {
                 console.log(`Invalid or empty ZIP format: ${zipValue}`);
                 // Optionally provide user feedback here if format is wrong
            }
        };
        zipCodeInput.addEventListener('change', triggerGeocode); // Fires on blur after change
        zipCodeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                triggerGeocode();
            }
        });
    }

    // Final validation check on load
    validateInputs();

    console.log("Star Map Generator App Initialized Successfully (main_app.js).");
});

// --- Dropdown Population ---
function populateFontDropdowns() {
    const selects = document.querySelectorAll('.font-family-select');
    selects.forEach(select => {
        // Clear existing options except potentially a placeholder
        while (select.options.length > 0) {
            select.remove(0);
        }
        // Add new options
        FONT_FAMILIES.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            option.style.fontFamily = font; // Apply style to option
            select.appendChild(option);
        });
        // Set default selection if needed (e.g., based on loaded settings or hardcoded)
        if (select.id === 'font-family-1') select.value = 'Arial Black'; // Example default
        else if (select.id === 'font-family-2') select.value = 'Arial'; // Example default
        else if (select.id === 'font-family-3') select.value = 'Arial'; // Example default
        else if (select.id === 'fixed-date-font') select.value = 'Arial'; // Example default
        else if (select.id === 'fixed-coords-font') select.value = 'Arial'; // Example default

    });
    console.log("Font dropdowns populated.");
}

function populateFontSizeDropdowns() {
    const selects = document.querySelectorAll('.font-size-select');
    selects.forEach(select => {
         // Clear existing options except potentially a placeholder
         while (select.options.length > 0) {
            select.remove(0);
        }
        // Add new options
        FONT_SIZES.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = `${size}px`;
            select.appendChild(option);
            // Set default selection
            if (select.id === 'font-size-1' && size === 48) option.selected = true;
            else if (select.id === 'font-size-2' && size === 16) option.selected = true;
            else if ((select.id === 'font-size-3' || select.id === 'fixed-date-size' || select.id === 'fixed-coords-size') && size === 14) option.selected = true;
        });
    });
    console.log("Font size dropdowns populated.");
}


// --- Input Validation ---
// *** Corrected to check Occasion, Date, and Coordinates ***
function validateInputs() {
    const occasionSelect = document.getElementById("occasion");
    const dateInput = document.getElementById("date");
    const latitudeInput = document.getElementById("latitude");
    const longitudeInput = document.getElementById("longitude");
    const generateBtn = document.getElementById("generateBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    let occasionValue = occasionSelect ? occasionSelect.value : null;
    if (occasionValue === 'custom') {
        occasionValue = occasionSelect.getAttribute('data-custom-value') || ''; // Get custom value if set
    }
    const dateValue = dateInput ? dateInput.value : null;
    const latitudeValue = latitudeInput ? latitudeInput.value.trim() : null; // Use value from input
    const longitudeValue = longitudeInput ? longitudeInput.value.trim() : null; // Use value from input

    // Basic validation: ensure Occasion, Date, and Coordinates are present
    const isMapDataValid = latitudeValue && longitudeValue;
    const isInputValid = occasionValue && dateValue && isMapDataValid; // Check all three mandatory fields

    if (generateBtn) {
        if (isInputValid) {
            generateBtn.removeAttribute("disabled");
            generateBtn.classList.add("enabled");
        } else {
            generateBtn.setAttribute("disabled", "true");
            generateBtn.classList.remove("enabled");
        }
    }

    // Enable download only if map has been generated AND inputs are still valid
    const canvas = document.getElementById("star-map-canvas");
    let mapGenerated = false;
    try { mapGenerated = canvas && canvas.getAttribute('data-generated') === 'true'; } catch (e) { /* ignore */ }

    if (downloadBtn) {
        if (mapGenerated && isInputValid) { // Also ensure inputs are valid for download
            downloadBtn.removeAttribute("disabled");
            downloadBtn.classList.add("enabled");
        } else {
            downloadBtn.setAttribute("disabled", "true");
            downloadBtn.classList.remove("enabled");
        }
    }
}

// --- Helper to parse DDM format back to decimal ---
function parseFormattedCoordinate(formattedCoord) {
    if (!formattedCoord || typeof formattedCoord !== 'string') return NaN;
    const parts = formattedCoord.match(/([NSWE])(\d+)°\s*(\d+)′\.(\d+)/);
    if (!parts || parts.length < 5) {
        const decimalVal = parseFloat(formattedCoord);
        if (!isNaN(decimalVal)) return decimalVal;
        console.warn(`Could not parse coordinate: ${formattedCoord}`);
        return NaN;
    }
    const direction = parts[1];
    const degrees = parseFloat(parts[2]);
    const minutesWhole = parseFloat(parts[3]);
    const minutesDecimal = parseFloat(`0.${parts[4]}`);
    const minutes = minutesWhole + minutesDecimal;
    let decimal = degrees + minutes / 60.0;
    if (direction === 'S' || direction === 'W') { decimal *= -1; }
    return decimal;
}


// --- Core Star Map Generation ---
// *** MODIFIED to read from display paragraph using REGEX ***
function generateStarMap() {
    // XXX START [2025-04-04_14:23] Coordinate Read Fix
    console.log("generateStarMap called from main_app.js");
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) loadingIndicator.style.display = 'flex';

    setTimeout(() => {
        try {
            const canvas = document.getElementById("star-map-canvas");
            if (!canvas) throw new Error("Canvas element (#star-map-canvas) not found");
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Could not get canvas context");

            const getEl = (id) => document.getElementById(id);
            const getVal = (id, defaultVal) => getEl(id)?.value || defaultVal;
            const getChecked = (id, defaultVal) => getEl(id)?.checked ?? defaultVal;
            const getInt = (id, defaultVal) => parseInt(getVal(id, String(defaultVal))) || defaultVal;

            // *** Read coordinates from display paragraph using REGEX ***
            const displayCoordsText = getEl('latLongDisplay')?.textContent || '';
            // Regex to capture both coordinate parts robustly, allowing for optional pipe separator
            const coordRegex = /([NS]\d+°\s*\d+′\.\d+)\s*(?:\|?\s*)([WE]\d+°\s*\d+′\.\d+)/;
            const coordMatches = displayCoordsText.match(coordRegex);

            let latFormatted = '';
            let lonFormatted = '';

            if (coordMatches && coordMatches.length >= 3) {
                latFormatted = coordMatches[1]; // First captured group (Latitude)
                lonFormatted = coordMatches[2]; // Second captured group (Longitude)
                console.log(`Extracted from display: Lat='${latFormatted}', Lon='${lonFormatted}'`);
            } else {
                 // Fallback or error if display text doesn't match expected format
                 console.error("Could not extract coordinates from display paragraph using regex:", displayCoordsText);
                 // **CRITICAL FALLBACK**: Read directly from input fields if display parsing fails
                 latFormatted = getVal("latitude", "");
                 lonFormatted = getVal("longitude", "");
                 console.warn(`Falling back to input fields: Lat='${latFormatted}', Lon='${lonFormatted}'`);
            }
            // console.log(`Coordinates read for parsing: Lat='${latFormatted}', Lon='${lonFormatted}'`); // Redundant log

            const latDecimal = parseFormattedCoordinate(latFormatted);
            const lonDecimal = parseFormattedCoordinate(lonFormatted);

            if (isNaN(latDecimal) || isNaN(lonDecimal)) {
                 alert(`Invalid coordinate format.\nPlease ensure Latitude and Longitude use the format like NDD° MM′.MMMMM or WDDD° MM′.MMMMM\nCould not parse: Lat='${latFormatted}', Lon='${lonFormatted}'`);
                 throw new Error(`Invalid coordinate format could not be parsed: Lat='${latFormatted}', Lon='${lonFormatted}'`);
            }
            console.log(`Parsed Coordinates for Generation: Lat=${latDecimal}, Lon=${lonDecimal}`);

            const dateValue = getVal("date", "");
            if (!dateValue) throw new Error("Date is required.");

            const outputWidth = getInt("output-width", 800);
            const outputHeight = getInt("output-height", 1000);
            const starFieldColorValue = getVal("star-field-color", "#000000");
            const outsideColorValue = getVal("outside-color", "#0a0e1a");

            canvas.width = outputWidth;
            canvas.height = outputHeight;

            ctx.fillStyle = outsideColorValue;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = starFieldColorValue;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (typeof drawStars === 'function') {
                 console.warn("drawStars function needs implementation using decimal coordinates and date!");
                 ctx.fillStyle = 'grey';
                 ctx.beginPath();
                 ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.4, 0, Math.PI * 2);
                 ctx.fill();
                 ctx.fillStyle = 'white';
                 ctx.font = '20px Arial';
                 ctx.textAlign = 'center';
                 ctx.fillText("Star Drawing Not Implemented", canvas.width / 2, canvas.height / 2);
            } else { console.error("drawStars function is not defined!"); }

            const textLayersData = [];
            for (let i = 1; i <= 3; i++) {
                const textVal = getVal(`text-entry-${i}`, '');
                if (textVal) {
                    textLayersData.push({
                        text: textVal,
                        fontFamily: getVal(`font-family-${i}`, 'Arial'),
                        fontSize: getVal(`font-size-${i}`, '16'),
                        fontColor: getVal(`font-color-${i}`, '#FFFFFF'),
                        isBold: getChecked(`text-bold-${i}`, false),
                        isItalic: getChecked(`text-italic-${i}`, false)
                    });
                } else { textLayersData.push(null); }
            }

            const yPos1 = canvas.height * 0.65;
            const yPos2 = canvas.height * 0.75;
            const yPosDate = canvas.height * 0.82;
            const yPosCoords = canvas.height * 0.86;
            const yPos3 = canvas.height * 0.90;

            if (textLayersData[0] && typeof drawText === 'function') {
                drawText(ctx, textLayersData[0].text, textLayersData[0].fontFamily, textLayersData[0].fontSize, textLayersData[0].isBold, textLayersData[0].isItalic, textLayersData[0].fontColor, canvas.width / 2, yPos1);
            }
            if (textLayersData[1] && typeof drawText === 'function') {
                drawText(ctx, textLayersData[1].text, textLayersData[1].fontFamily, textLayersData[1].fontSize, textLayersData[1].isBold, textLayersData[1].isItalic, textLayersData[1].fontColor, canvas.width / 2, yPos2);
            }

            // Draw Fixed Date and Coordinates
            if (dateValue && typeof formatDate === 'function' && typeof drawText === 'function') {
                const formattedDate = formatDate(dateValue);
                drawText(ctx, formattedDate,
                    getVal("fixed-date-font", "Arial"),
                    getVal("fixed-date-size", "14"),
                    getChecked("fixed-date-bold", false),
                    getChecked("fixed-date-italic", false),
                    getVal("fixed-date-color", "#FFFFFF"),
                    canvas.width / 2, yPosDate);
            }
            // Use the formatted strings read from the display paragraph
            if (latFormatted && lonFormatted && typeof drawText === 'function') {
                 const formattedCoords = `${latFormatted} ${lonFormatted}`; // Combine parts
                 drawText(ctx, formattedCoords,
                    getVal("fixed-coords-font", "Arial"),
                    getVal("fixed-coords-size", "14"),
                    getChecked("fixed-coords-bold", false),
                    getChecked("fixed-coords-italic", false),
                    getVal("fixed-coords-color", "#FFFFFF"),
                    canvas.width / 2, yPosCoords);
            }

            if (textLayersData[2] && typeof drawText === 'function') {
                drawText(ctx, textLayersData[2].text, textLayersData[2].fontFamily, textLayersData[2].fontSize, textLayersData[2].isBold, textLayersData[2].isItalic, textLayersData[2].fontColor, canvas.width / 2, yPos3);
            }

            canvas.setAttribute('data-generated', 'true');
            validateInputs();

            console.log("Star map generated successfully (main_app.js).");

        } catch (error) {
            console.error("Error during star map generation:", error);
            alert("Error generating star map: " + error.message);
             const canvas = document.getElementById("star-map-canvas");
             if(canvas) canvas.setAttribute('data-generated', 'false');
             validateInputs();
        } finally {
            if (loadingIndicator) loadingIndicator.style.display = 'none';
        }
    }, 50);
    // XXX END [2025-04-04_14:23] Coordinate Read Fix
}


// --- Aspect Ratio Change Handler ---
function handleAspectRatioChange() {
    const maintainAspectRatioCheckbox = document.getElementById("maintain-aspect-ratio");
    const outputWidthInput = document.getElementById("output-width");
    const outputHeightInput = document.getElementById("output-height");

    if (maintainAspectRatioCheckbox?.checked && aspectRatio && (document.activeElement === outputWidthInput || document.activeElement === outputHeightInput)) {
        if (document.activeElement === outputWidthInput) {
            const newHeight = Math.round(parseFloat(outputWidthInput.value) / aspectRatio);
            if (!isNaN(newHeight) && newHeight > 0) {
                outputHeightInput.value = newHeight;
            }
        } else if (document.activeElement === outputHeightInput) {
            const newWidth = Math.round(parseFloat(outputHeightInput.value) * aspectRatio);
            if (!isNaN(newWidth) && newWidth > 0) {
                outputWidthInput.value = newWidth;
            }
        }
    }
}

// --- Google Maps Initialization Callback ---
function initMap() {
    console.log("Google Maps API loaded, initializing map...");
    try {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.error("Map container element (#map) not found.");
            return;
        }

        // *** Force initial view to US Center/Zoom 4 ***
        const defaultLat = 37.30000; // Using your manually tested value
        const defaultLng = -95.3000; // Using your manually tested value
        const defaultZoom = 4;

        const map = new google.maps.Map(mapContainer, {
            center: { lat: defaultLat, lng: defaultLng }, // Use defaults directly
            zoom: defaultZoom, // Use default zoom level
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false,
            mapTypeControl: true,
             mapTypeControlOptions: {
                 style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                 position: google.maps.ControlPosition.TOP_RIGHT,
             },
            zoomControl: true,
            fullscreenControl: false,
        });

        const crosshairs = document.getElementById('crosshairs');
        if (!crosshairs) console.warn("Crosshairs element not found.");

        // XXX START [2025-04-06_19:03] Coordinate Input Mirroring Fix
        // Function to update UI elements with coordinates
        const updateCoordinateUI = (lat, lng) => {
            const latInput = document.getElementById('latitude');
            const lngInput = document.getElementById('longitude');
            const display = document.getElementById('latLongDisplay');

            let formattedCoords = `Lat: ${lat.toFixed(6)} | Long: ${lng.toFixed(6)}`; // Fallback

            if (typeof formatCoordinates === 'function') {
                 formattedCoords = formatCoordinates(lat, lng); // Get the full formatted string (e.g., "N38° 6′.09015 W94° 41′.60395")
            } else {
                 console.warn("formatCoordinates function not found in utils.js when updating UI.");
            }

            // Update display paragraph AND MIRROR to input fields
            if (display) display.textContent = formattedCoords;
            if (latInput) latInput.value = formattedCoords; // Mirror full string
            if (lngInput) lngInput.value = formattedCoords; // Mirror full string

            validateInputs(); // Re-validate inputs after update
        };
        // XXX END [2025-04-06_19:03] Coordinate Input Mirroring Fix

        // Listener for map center changes
        map.addListener('center_changed', () => {
            const center = map.getCenter();
            if (center) {
                updateCoordinateUI(center.lat(), center.lng());
            }
        });

        // Initial update on map load using the default center
        updateCoordinateUI(defaultLat, defaultLng);

        // Geocoding function
        window.geocodeZip = function(zipCode) {
            console.log(`Geocoding ZIP: ${zipCode}`);
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: zipCode }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK && results[0]) {
                    const location = results[0].geometry.location;
                    const lat = location.lat();
                    const lng = location.lng();

                    updateCoordinateUI(lat, lng);
                    map.setCenter(location);
                    map.setZoom(12);

                    if (typeof saveZipCodeToHistory === 'function') {
                        saveZipCodeToHistory(zipCode);
                    }

                } else {
                    alert(`Geocode was not successful for the following reason: ${status}. Please enter coordinates manually or try a different ZIP code.`);
                    console.error(`Geocode failed for ZIP ${zipCode}: ${status}`);
                }
            });
        };

        console.log("Map initialized successfully.");

    } catch (error) {
        console.error("Error initializing Google Map:", error);
        alert("Could not initialize Google Map. Please check your API key and internet connection.");
    }
}

// Expose initMap globally for the Google Maps API callback
window.initMap = initMap;

console.log("main_app.js loaded");