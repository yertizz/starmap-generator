// START OF CODE - Cline - 2025-04-20 10:37 File: js/main_app.js
// Main Application Logic for Star Map Generator - main_app.js
// Calls your PHP proxy to fetch the star map image, bypassing CORS
// Calculates LST and uses it as rightAscension, declination = latitude
// Reads color picker values, fills canvas background BEFORE drawing image

// --- Global Variables ---
let aspectRatio = 1; // Default aspect ratio (Square)
let currentStarMapStyle = "default";
let colorPickersInitialized = false;
let domReady = false; // Flag to track DOM readiness
window.googleMapsApiLoaded = false; // Flag to track Google Maps API load
const API_IMAGE_SIZE = 2048; // Fixed size for API request
let currentZoomLevel = 100; // Store current zoom level

const advancedStyleOptions = {
    showConstellations: true,
    showConstellationNames: true,
    showMilkyWay: true,
    showGrid: true,
    showPlanets: true,
    showSunMoon: true,
    showLabels: true,
    showEcliptic: true
};
window.advancedStyleOptions = advancedStyleOptions;
window.currentStarMapStyle = currentStarMapStyle;

// --- Custom Occasion Handling (Moved from settings.js) ---
function handleOccasionChange() {
    const occasionSelect = document.getElementById('occasion');
    const customInput = document.getElementById('custom-occasion'); // Assuming this input exists for custom entry
    if (!occasionSelect) return;

    const previousValue = occasionSelect.getAttribute('data-previous-value') || '';

    if (occasionSelect.value === 'custom') {
        // Use prompt for simplicity, or reveal a hidden input field
        const customOccasion = prompt("Enter your custom occasion text:", "");

        if (customOccasion && customOccasion.trim()) {
            const trimmedOccasion = customOccasion.trim();
            // Ensure addCustomOccasionOption is globally accessible (defined in settings.js)
            if (typeof addCustomOccasionOption === 'function') {
                addCustomOccasionOption(trimmedOccasion, null, true); // true to save
            } else {
                 console.error("addCustomOccasionOption function not found! Cannot add custom occasion.");
                 // Revert selection if function is missing
                 occasionSelect.value = previousValue;
            }
            // Hide the text input field if it was shown
            if(customInput) customInput.style.display = 'none';
        } else {
            // User cancelled or entered empty string, revert selection
            // alert("Custom occasion cancelled or empty."); // Optional feedback
            occasionSelect.value = previousValue; // Revert to previous selection
            if(customInput) customInput.style.display = 'none'; // Hide input
        }
    } else {
        // Hide custom input if a standard option is selected
        if(customInput) customInput.style.display = 'none';
    }
    // Update previous value tracking
    occasionSelect.setAttribute('data-previous-value', occasionSelect.value);
    if (typeof validateInputs === 'function') validateInputs(); // Validate after change
}

// --- Function to Attempt Map Initialization ---
function tryInitializeMap() {
    console.log("Attempting to initialize map...");
    if (typeof initializeGoogleMap === 'function') {
        console.log("Both DOM ready and Google Maps API loaded. Calling initializeGoogleMap().");
        initializeGoogleMap();
    } else {
        console.error("CRITICAL: initializeGoogleMap function (from map.js) not found when expected!");
    }
}

// --- Helper Functions (from backup) ---
function calculateLST(dateString, longitude) {
     if (isNaN(longitude)) {
         console.error("Invalid longitude for LST calculation:", longitude);
         return NaN;
     }
    // Ensure dateString is treated as UTC by appending 'T00:00:00Z'
    const date = new Date(dateString + 'T00:00:00Z');
     if (isNaN(date.getTime())) {
         console.error("Invalid date for LST calculation:", dateString);
         return NaN;
     }
    // Calculate Julian Date from UTC date
    const JD = (date.getTime() / 86400000) + 2440587.5;
    // Calculate days since J2000.0
    const D = JD - 2451545.0;
    // Calculate Greenwich Mean Sidereal Time (GMST) in hours
    let GMST = 18.697374558 + 24.06570982441908 * D;
    // Normalize GMST to 0-24 hours
    GMST = GMST % 24;
    if (GMST < 0) GMST += 24;
    // Calculate Local Sidereal Time (LST) in hours
    const LST = (GMST + longitude / 15.0) % 24;
    // Normalize LST to 0-24 hours
    return (LST < 0) ? LST + 24 : LST;
}

function populateFontDropdowns() {
    const fontFamilies = [
        "Montserrat", "Open Sans", "Oswald", "Satisfy", "Lilita One", "Playfair Display",
        "Merriweather", "Dancing Script", "Roboto", "Roboto Slab", "Indie Flower", "Lora",
        "Bebas Neue", "Anton", "Libre Baskerville", "Pacifico", "Raleway", "Noto Serif",
        "Abril Fatface", "Caveat", "Black Ops One", "Quicksand", "Permanent Marker",
        "Shadows Into Light", "Nunito", "Arial Black", "Impact", "Verdana", "Helvetica",
        "Times New Roman", "Courier New", "Great Vibes", "Tangerine", "Pinyon Script", "Arial"
    ];
    const uniqueFonts = [...new Set(fontFamilies)].sort();

    const selects = document.querySelectorAll('.font-family-select');
    selects.forEach(select => {
        select.innerHTML = ''; // Clear existing options
        uniqueFonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            option.style.fontFamily = font; // Apply font for preview in dropdown
            select.appendChild(option);
        });
        // Set default values after populating
        if (select.id === 'fixed-font-family-date' || select.id === 'fixed-font-family-coords') {
             select.value = 'Arial';
        } else {
             select.value = 'Montserrat'; // Default for customizable layers
        }
    });
    console.log("Font family dropdowns populated.");
}

function populateFontSizeDropdowns() {
    const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 54, 60, 72, 96, 112];

    const selects = document.querySelectorAll('.font-size-select');
    selects.forEach(select => {
        select.innerHTML = ''; // Clear existing options
        fontSizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = `${size}px`;
            select.appendChild(option);
        });
         // Set default values after populating
         if (select.id === 'font-size-1') {
             select.value = '28';
         } else if (select.id === 'font-size-2') {
             select.value = '16';
         } else if (select.id === 'font-size-3') {
             select.value = '14';
         } else if (select.id === 'fixed-font-size-date' || select.id === 'fixed-font-size-coords') {
             select.value = '14';
         }
    });
    console.log("Font size dropdowns populated.");
}

function parseFormattedCoordinate(fullFormattedCoord, part = 'latitude') {
    if (!fullFormattedCoord || typeof fullFormattedCoord !== 'string') return NaN;

    // Try parsing DMM format (e.g., N32° 56.88113′)
    const dmmMatch = fullFormattedCoord.trim().match(/^([NSEW])\s*(\d+)\s*°\s*(\d+(?:\.\d+)?)\s*['′]?$/i);
    if (dmmMatch) {
        const direction = dmmMatch[1].toUpperCase();
        const degrees = parseInt(dmmMatch[2], 10);
        const minutes = parseFloat(dmmMatch[3]);

        if (isNaN(degrees) || isNaN(minutes)) return NaN;

        let decimalDegrees = degrees + (minutes / 60.0);
        if (direction === 'S' || direction === 'W') decimalDegrees = -decimalDegrees;

        // Basic validation
        if ((direction === 'N' || direction === 'S') && (decimalDegrees < -90 || decimalDegrees > 90)) return NaN;
        if ((direction === 'E' || direction === 'W') && (decimalDegrees < -180 || decimalDegrees > 180)) return NaN;

        return decimalDegrees;
    }

    // Fallback: Try parsing simple decimal degrees
    const decimalVal = parseFloat(fullFormattedCoord);
     if (!isNaN(decimalVal)) {
         // Basic validation for decimal
         if (part === 'latitude' && decimalVal >= -90 && decimalVal <= 90) return decimalVal;
         if (part === 'longitude' && decimalVal >= -180 && decimalVal <= 180) return decimalVal;
     }

    // If neither format matches or is valid
    return NaN;
}

// --- NEW: Update Text Placement Content ---
function updateTextPlacementContent() {
    // console.log("Updating text placement content..."); // Optional debug
    const getEl = id => document.getElementById(id);
    const getVal = (id, def) => getEl(id)?.value || def;

    const text1 = getVal('text-entry-1', '');
    const text2 = getVal('text-entry-2', '');
    const text3 = getVal('text-entry-3', '');
    const dateVal = getVal('date', '');
    const latVal = getVal('latitude', '');
    const lonVal = getVal('longitude', '');

    const span1 = getEl('text-placement-content-1');
    const span2 = getEl('text-placement-content-2');
    const span3 = getEl('text-placement-content-3');
    const spanDate = getEl('text-placement-content-date');
    const spanCoords = getEl('text-placement-content-coords');

    if (span1) span1.textContent = text1 || '-'; // Use dash if empty
    if (span2) span2.textContent = text2 || '-';
    if (span3) span3.textContent = text3 || '-';

    // Format date if possible (assuming formatDate exists in utils.js)
    if (spanDate) {
        // Check if formatDate function exists before calling it
        spanDate.textContent = (dateVal && typeof formatDate === 'function') ? formatDate(dateVal) : (dateVal || '-');
    }

    // Combine lat/lon for display
    if (spanCoords) {
        const coordsText = (latVal || lonVal) ? `${latVal || '?'} | ${lonVal || '?'}` : '-';
        spanCoords.textContent = coordsText;
    }
}
// --- END NEW: Update Text Placement Content ---


// --- Initialization ---
document.addEventListener('DOMContentLoaded', function() {
    console.log("Star Map Generator App Initializing (main_app.js)...");

    // Populate dropdowns first as other functions might rely on them
    populateFontDropdowns();
    populateFontSizeDropdowns();

    if (typeof loadCustomOccasions === 'function') loadCustomOccasions();
    if (typeof loadSavedSettings === 'function') loadSavedSettings();
    if (typeof setupAllHistories === 'function') {
        setupAllHistories();
    } else {
        console.error("setupAllHistories function not found in history.js");
    }
    if (typeof addLoadSettingsButton === 'function') addLoadSettingsButton();
    if (typeof addSaveSettingsButton === 'function') addSaveSettingsButton();
    if (typeof initializeHexColorPickers === 'function') initializeHexColorPickers();
    if (typeof setupAdvancedOptionsEventListeners === 'function') setupAdvancedOptionsEventListeners();

    // --- Add Event Listener for Occasion Dropdown --- ADDED
    const occasionSelect = document.getElementById('occasion');
    if (occasionSelect && typeof handleOccasionChange === 'function') {
        // Store initial value for potential revert on cancel
        occasionSelect.setAttribute('data-previous-value', occasionSelect.value);
        occasionSelect.addEventListener('change', handleOccasionChange); // Listener uses the function defined above
        console.log("Event listener added for occasion change.");
    } else if (!occasionSelect) {
         console.warn("Occasion select element not found.");
    } else {
         // This warning should not appear now as the function is defined in this file
         console.warn("handleOccasionChange function not found (needed for 'Add Your Own...').");
    }
    // --- End Occasion Listener ---

    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            console.log("Generate button clicked (main_app.js)");
            if (!generateBtn.hasAttribute('disabled')) {
                generateStarMap();
            } else { console.log("Generate button is disabled."); }
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            console.log("Download button clicked (main_app.js)");
            if (!downloadBtn.hasAttribute('disabled')) { // Check if NOT disabled
                if (typeof downloadStarMap === 'function') downloadStarMap();
            } else { console.log("Download button is disabled."); }
        });
    }

    const inputsToValidate = [
        document.getElementById('occasion'),
        document.getElementById('date'),
        document.getElementById('latitude'),
        document.getElementById('longitude'),
        document.getElementById('zip-code')
    ];
    inputsToValidate.forEach(input => {
        if (input) {
            // Use 'input' for immediate validation, 'change' for final validation
            input.addEventListener('input', validateInputs);
            input.addEventListener('change', validateInputs);
        }
    });

    // Add Zoom Slider Functionality (Re-enabled for Internal Zoom)
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomValueDisplay = document.getElementById('zoom-value');
    const starMapCanvas = document.getElementById('star-map-canvas'); // Needed for redraw trigger

    if (zoomSlider && zoomValueDisplay && starMapCanvas) {
        // Initialize global zoom variable
        currentZoomLevel = parseInt(zoomSlider.value) || 100;
        zoomValueDisplay.textContent = currentZoomLevel;

        zoomSlider.addEventListener('input', function() {
            currentZoomLevel = parseInt(this.value); // Update global zoom level
            zoomValueDisplay.textContent = currentZoomLevel;
            // Check if a map has already been generated before triggering redraw
            // Use 'star-map-canvas' directly instead of potentially stale 'canvas' variable
            const currentCanvas = document.getElementById('star-map-canvas');
            if (currentCanvas && currentCanvas.getAttribute('data-generated') === 'true') {
                 console.log(`Zoom changed to ${currentZoomLevel}%, regenerating preview...`);
                 // Regenerate the map preview to apply the new zoom level to the image drawing
                 // Ensure the generate button isn't disabled if we trigger manually
                 const genBtn = document.getElementById('generateBtn');
                 if (genBtn && !genBtn.disabled) {
                     generateStarMap();
                 } else if (genBtn && genBtn.disabled) {
                     console.log("Generate button is disabled, cannot redraw for zoom.");
                 }
            } else {
                 console.log("Zoom changed, but no map generated yet.");
            }
        });
        console.log("Internal Zoom feature event listener enabled.");
    } else {
        console.warn("Zoom slider elements not found.");
    }

    // --- Image Format / Transparency Logic ---
    const imageFormatRadios = document.querySelectorAll('input[name="image-format"]');
    const pngTransparencyCheckbox = document.getElementById('png-transparency');
    const pngTransparencyLabel = document.querySelector('label[for="png-transparency"]');

    function updateTransparencyOption() {
        const selectedFormat = document.querySelector('input[name="image-format"]:checked')?.value;
        if (pngTransparencyCheckbox && pngTransparencyLabel) {
            if (selectedFormat === 'png') {
                pngTransparencyCheckbox.disabled = false;
                pngTransparencyLabel.classList.remove('disabled-option');
            } else {
                pngTransparencyCheckbox.disabled = true;
                pngTransparencyCheckbox.checked = false; // Uncheck if disabled
                pngTransparencyLabel.classList.add('disabled-option');
            }
        } else {
            console.warn("Transparency checkbox or label not found.");
        }
    }

    if (imageFormatRadios.length > 0) {
        imageFormatRadios.forEach(radio => {
            radio.addEventListener('change', updateTransparencyOption);
        });
        updateTransparencyOption();
        console.log("Image format/transparency logic initialized.");
    } else {
        console.warn("Image format radio buttons not found.");
    }
    // --- End Image Format / Transparency Logic ---

    // --- Aspect Ratio Logic ---
    const aspectCheckbox = document.getElementById('maintain-aspect-ratio');
    const widthInput = document.getElementById('output-width');
    const heightInput = document.getElementById('output-height');

    function handleDimensionChange(event) {
        if (!aspectCheckbox || !aspectCheckbox.checked) return; // Exit if checkbox doesn't exist or isn't checked

        const changedInput = event.target;
        const newValue = parseInt(changedInput.value);
        if (isNaN(newValue) || newValue <= 0) return; // Ignore invalid input

        // Enforce 1:1 ratio (square)
        if (changedInput === widthInput) {
            heightInput.value = newValue; // Set height equal to width
        } else if (changedInput === heightInput) {
            widthInput.value = newValue; // Set width equal to height
        }
    }

    if (aspectCheckbox && widthInput && heightInput) {
        const setupAspectRatioListeners = () => {
            widthInput.addEventListener('input', handleDimensionChange);
            heightInput.addEventListener('input', handleDimensionChange);
            console.log("Aspect ratio event listeners added.");
        };
        const removeAspectRatioListeners = () => {
            widthInput.removeEventListener('input', handleDimensionChange);
            heightInput.removeEventListener('input', handleDimensionChange);
            console.log("Aspect ratio event listeners removed.");
        };

        aspectCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // When checked, enforce 1:1 ratio based on the width input
                const widthVal = parseInt(widthInput.value) || 800;
                heightInput.value = widthVal; // Set height equal to width
                console.log("Aspect ratio locked to 1:1 (Square)");
                setupAspectRatioListeners();
            } else {
                // When unchecked, remove listeners
                removeAspectRatioListeners();
                console.log("Aspect ratio unlocked.");
            }
        });
        // Initial setup on load
        if (aspectCheckbox.checked) {
             const widthVal = parseInt(widthInput.value) || 800;
             heightInput.value = widthVal; // Set height equal to width initially if checked
             setupAspectRatioListeners();
        }

    } else {
        console.warn("Aspect ratio elements (checkbox, width, height inputs) not found.");
    }
    // --- End Aspect Ratio Logic ---


    // Initial validation check after setup
    if (typeof validateInputs === 'function') validateInputs();
    console.log("Star Map Generator App Initialized Successfully (main_app.js).");

    // --- NEW Map Initialization Logic ---
    domReady = true; // Set DOM ready flag
    console.log("DOM is ready.");
    // Check if Google Maps API is already loaded
    if (window.googleMapsApiLoaded) {
        console.log("DOM ready, and Google Maps API was already loaded.");
        tryInitializeMap();
    } else {
        console.log("DOM ready, but waiting for Google Maps API to load...");
    }
    // --- End NEW Map Initialization Logic ---

    // --- Setup Text Placement Update Listeners --- ADDED
    const placementSourceInputs = [
        'text-entry-1', 'text-entry-2', 'text-entry-3',
        'date', 'latitude', 'longitude'
    ];
    placementSourceInputs.forEach(id => {
        const inputEl = document.getElementById(id);
        if (inputEl) {
            inputEl.addEventListener('input', updateTextPlacementContent);
            inputEl.addEventListener('change', updateTextPlacementContent); // Also update on change (e.g., date picker)
        } else {
            console.warn(`Text placement source input #${id} not found.`);
        }
    });
    // Initial population
    updateTextPlacementContent();
    console.log("Text placement listeners added and initial content populated.");
    // --- End Text Placement Update Listeners ---

});

// --- MODIFIED Google Maps API Callback ---
window.setGoogleMapsReady = function() {
    console.log("Google Maps API script loaded and setGoogleMapsReady callback executed.");
    window.googleMapsApiLoaded = true;
    // Check if DOM is already ready
    if (domReady) {
        console.log("Google Maps API loaded, and DOM was already ready.");
        tryInitializeMap();
    } else {
        console.log("Google Maps API loaded, but waiting for DOM to be ready...");
    }
}
// --- End MODIFIED Google Maps API Callback ---


// --- Core Star Map Generation (Using createImageBitmap & ctx.ellipse & Internal Zoom) ---
async function generateStarMap() {
    console.log("generateStarMap called - using LST, createImageBitmap, ctx.ellipse, and internal zoom");

    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) loadingIndicator.style.display = 'flex';

    const canvas = document.getElementById("star-map-canvas");

    // Force canvas reset before getting context
    canvas.width = canvas.width;
    console.log("Forcing canvas reset via width assignment.");

    let ctx = canvas.getContext("2d");

    if (!ctx) {
        console.error("Canvas context not available.");
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        return;
    }
    // Clear canvas and reset generated state *after* getting context
    // ctx.clearRect(0, 0, canvas.width, canvas.height); // ClearRect might be redundant after width trick
    canvas.setAttribute('data-generated', 'false');

    try {
        const getEl = id => document.getElementById(id);
        const getVal = (id, def) => getEl(id)?.value || def;
        const getInt = (id, def) => parseInt(getVal(id, String(def))) || def;
        const getChecked = id => getEl(id)?.checked || false;

        // Read dimensions FROM UI for the CANVAS size
        const canvasWidth = getInt("output-width", 800);
        const canvasHeight = getInt("output-height", 800);

        // Resize PREVIEW canvas ATTRIBUTES if necessary (Redundant if width trick works, but safe)
        if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            ctx = canvas.getContext("2d"); // Re-get context after resize
            console.log(`Preview canvas attributes resized to ${canvasWidth}x${canvasHeight}`);
        }

        // Get coordinates and date
        const latFullFormatted = getVal("latitude", "");
        const lonFullFormatted = getVal("longitude", "");
        const latDecimal = parseFormattedCoordinate(latFullFormatted, 'latitude');
        const lonDecimal = parseFormattedCoordinate(lonFullFormatted, 'longitude');

        if (isNaN(latDecimal) || isNaN(lonDecimal)) {
             alert("Invalid or missing coordinates.");
             throw new Error("Invalid coordinates.");
        }

        const dateValue = getVal("date", "");
        if (!dateValue) {
            alert("Date is required.");
            throw new Error("Date is required.");
        }

        // Get image settings
        const starMapStyleValue = getVal("star-map-style", "default");
        const canvasBackgroundColor = getVal('bg-color-canvas', '#F5F5DC');
        const imageBackgroundColor = '#000000'; // Background for the generated image if not transparent
        const imageFormat = document.querySelector('input[name="image-format"]:checked')?.value || 'png';
        const pngTransparency = getEl('png-transparency')?.checked || false;

        // Get NEW circle controls
        const circleRadiusPercent = getInt("circle-radius-percent", 90);
        const borderWidth = getInt("border-width", 1);
        const borderColor = getVal("border-color", "#FFFFFF");

        // Get text layer styles
        const fixedDateStyle = {
            fontFamily: getVal('fixed-font-family-date', 'Arial'),
            fontSize: parseInt(getVal('fixed-font-size-date', '14')),
            fontColor: getVal('fixed-font-color-date', '#FFFFFF'),
            isBold: getChecked('fixed-text-bold-date'),
            isItalic: getChecked('fixed-text-italic-date')
        };
         const fixedCoordsStyle = {
            fontFamily: getVal('fixed-font-family-coords', 'Arial'),
            fontSize: parseInt(getVal('fixed-font-size-coords', '14')),
            fontColor: getVal('fixed-font-color-coords', '#FFFFFF'),
            isBold: getChecked('fixed-text-bold-coords'),
            isItalic: getChecked('fixed-text-italic-coords')
        };
        const textLayers = [
            { text: getVal('text-entry-1', ''), fontFamily: getVal('font-family-1', 'Montserrat'), fontSize: parseInt(getVal('font-size-1', '28')), fontColor: getVal('font-color-1', '#FFFFFF'), isBold: getChecked('text-bold-1'), isItalic: getChecked('text-italic-1') },
            { text: getVal('text-entry-2', ''), fontFamily: getVal('font-family-2', 'Montserrat'), fontSize: parseInt(getVal('font-size-2', '16')), fontColor: getVal('font-color-2', '#FFFFFF'), isBold: getChecked('text-bold-2'), isItalic: getChecked('text-italic-2') },
            { text: getVal('text-entry-3', ''), fontFamily: getVal('font-family-3', 'Montserrat'), fontSize: parseInt(getVal('font-size-3', '14')), fontColor: getVal('font-color-3', '#FFFFFF'), isBold: getChecked('text-bold-3'), isItalic: getChecked('text-italic-3') }
        ];

        // Get advanced options (still collected but not sent)
        const advancedParams = {};
        const advancedOptionElements = document.querySelectorAll('#advanced-options-panel input[data-api-param]');
        advancedOptionElements.forEach(el => {
            const paramName = el.getAttribute('data-api-param');
            if (el.type === 'checkbox') advancedParams[paramName] = el.checked;
            else if (el.type === 'range' || el.type === 'number') advancedParams[paramName] = parseFloat(el.value);
            else advancedParams[paramName] = el.value;
        });

        // Calculate LST for Right Ascension
        const lstHours = calculateLST(dateValue, lonDecimal);
         if (isNaN(lstHours)) {
             alert("Could not calculate LST.");
             throw new Error("Could not calculate LST.");
         }
        console.log(`Calculated LST (Right Ascension): ${lstHours} hours`);

        // Prepare API Request Body (Using fixed square size for API image)
        const requestBody = {
            style: starMapStyleValue,
            output: {
                width: API_IMAGE_SIZE, // Use fixed size
                height: API_IMAGE_SIZE, // Use fixed size
                format: imageFormat,
                ...(imageFormat === 'png' && { transparent: pngTransparency })
            },
            observer: { latitude: latDecimal, longitude: lonDecimal, date: dateValue },
            view: {
                type: "area",
                parameters: {
                    position: {
                        equatorial: {
                            rightAscension: lstHours,
                            declination: latDecimal
                        }
                    },
                    // Temporarily commented out advanced params for testing timeout issue
                    // ...advancedParams,
                    ...(!(imageFormat === 'png' && pngTransparency) && { backgroundColor: imageBackgroundColor })
                }
            }
        };

        console.log(`DEBUG: Sending request to PHP proxy (Fixed API Size ${API_IMAGE_SIZE}x${API_IMAGE_SIZE}, Advanced Options Disabled):`, JSON.stringify(requestBody, null, 2));

        const response = await fetch('proxy/star_map_proxy.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': `image/${imageFormat}` },
            body: JSON.stringify(requestBody)
        });

        console.log("Proxy response status:", response.status);
        console.log("Proxy response headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Proxy Error Response Text:", errorText);
            let apiErrorMsg = errorText;
            try { const errorJson = JSON.parse(errorText); if (errorJson?.errors?.length > 0) apiErrorMsg = errorJson.errors.map(e => `${e.path?.join('.') || 'error'}: ${e.message}`).join('; '); else if (errorJson?.message) apiErrorMsg = errorJson.message; } catch (parseError) {}
            throw new Error(`Proxy error: ${response.status} ${response.statusText}. ${apiErrorMsg}`);
        }

        const contentType = response.headers.get('content-type');
        const expectedContentType = imageFormat === 'jpg' ? 'image/jpeg' : `image/${imageFormat}`;
        if (!contentType || !contentType.startsWith(expectedContentType.split('/')[0])) {
             const errorText = await response.text();
             console.error(`Proxy returned wrong content type. Expected ${expectedContentType}, got ${contentType}. Response:`, errorText);
             throw new Error(`Proxy returned wrong content type. Expected ${expectedContentType}, got ${contentType}.`);
        }

        const blob = await response.blob();
        console.log(`DEBUG: Received image blob from proxy. Type: ${blob.type}, Size: ${blob.size}`);
        if (blob.size === 0) throw new Error("Received empty image blob from proxy.");

        // --- Use createImageBitmap ---
        const imageBitmap = await createImageBitmap(blob);
        console.log("DEBUG: ImageBitmap created successfully, drawing...");

        // --- Drawing logic using imageBitmap ---
        // Fill canvas background first (clearRect happened before getContext)
        ctx.fillStyle = canvasBackgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate circle parameters based on new controls and potentially non-square canvas
        const minCanvasDim = Math.min(canvas.width, canvas.height);
        const visualRadius = (minCanvasDim * (circleRadiusPercent / 100)) / 2; // This is the desired visual radius
        const centerX = canvas.width / 2;
        const centerY = canvas.height * 0.45; // Keep vertical position for now

        // Calculate ellipse radii to appear circular on potentially distorted canvas
        const aspect = canvas.width / canvas.height;
        let radiusX = visualRadius;
        let radiusY = visualRadius;

        if (aspect > 1) { // Wider than tall, need larger X radius
            radiusX = visualRadius * aspect;
            console.log(`Calculated ellipse radii for wide canvas: rX=${radiusX}, rY=${radiusY}`);
        } else if (aspect < 1) { // Taller than wide, need larger Y radius
            radiusY = visualRadius / aspect;
            console.log(`Calculated ellipse radii for tall canvas: rX=${radiusX}, rY=${radiusY}`);
        }

        // --- Draw Border using ellipse ---
        if (borderWidth > 0) {
            console.log(`Drawing border using ellipse: Width=${borderWidth}, Color=${borderColor}`);
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = borderWidth; // Use original border width
            ctx.beginPath();
            // Use ellipse to draw what should appear as a circle
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        // --- Apply Clip Path using ellipse ---
        ctx.save(); // <<<< ADDED Save before clip
        ctx.beginPath();
        // Use ellipse for clipping path
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // --- Image Scaling Logic ("Cover" circle, maintain aspect ratio) ---
        const circleDiameterX = radiusX * 2; // Use ellipse radii for scaling basis
        const circleDiameterY = radiusY * 2;
        // Use the "cover" scaling logic
        const imgScaleFactor = Math.max(circleDiameterX / imageBitmap.width, circleDiameterY / imageBitmap.height); // Use max to cover ellipse bounds
        const drawWidth = imageBitmap.width * imgScaleFactor;
        const drawHeight = imageBitmap.height * imgScaleFactor;
        // Center the image within the original circle center
        const drawX = centerX - drawWidth / 2; // Use original center
        const drawY = centerY - drawHeight / 2; // Use original center

        // --- Apply Internal Zoom ---
        const zoomFactor = currentZoomLevel / 100; // Get zoom factor (e.g., 1.0, 1.5, 2.0)
        let sx = 0, sy = 0, sWidth = imageBitmap.width, sHeight = imageBitmap.height;

        if (zoomFactor > 1) { // Only zoom in
             sWidth = imageBitmap.width / zoomFactor;
             sHeight = imageBitmap.height / zoomFactor;
             sx = (imageBitmap.width - sWidth) / 2;
             sy = (imageBitmap.height - sHeight) / 2;
             console.log(`Applying internal zoom: ${zoomFactor}x. Source rect: ${sx.toFixed(0)},${sy.toFixed(0)} ${sWidth.toFixed(0)}x${sHeight.toFixed(0)}`);
        } else {
             console.log("Zoom <= 100%, drawing full image.");
        }

        // Draw the potentially zoomed image portion into the destination rectangle
        ctx.drawImage(imageBitmap, sx, sy, sWidth, sHeight, drawX, drawY, drawWidth, drawHeight);
        console.log(`DEBUG: Drawing imageBitmap (potentially zoomed) scaled to cover clip ellipse. Dest rect: ${drawX.toFixed(2)},${drawY.toFixed(2)} ${drawWidth.toFixed(2)}x${drawHeight.toFixed(2)}`);
        imageBitmap.close(); // Close bitmap to free memory

        // --- Restore state (removes clip) --- <<<< ADDED Restore after clip/draw
        ctx.restore();

        // --- Draw Text Layers (Below Circle, in original coordinate space) ---
        console.log("Drawing text layers below circle...");
        ctx.textAlign = 'center';
        const applyFontStyle = (style) => {
            const fontWeight = style.isBold ? 'bold' : 'normal';
            const fontStyle = style.isItalic ? 'italic' : 'normal';
            const sizeNum = parseInt(style.fontSize) || 14;
            const sizeWithUnit = `${sizeNum}px`;
            const safeFontFamily = style.fontFamily.includes(' ') ? `"${style.fontFamily}"` : style.fontFamily;
            ctx.font = `${fontStyle} ${fontWeight} ${sizeWithUnit} ${safeFontFamily}`;
            ctx.fillStyle = style.fontColor;
        };
        const textSpacing = 1.2;
        // Calculate text start position based on original centerY and VISUAL radius
        const circleBottomY = centerY + visualRadius + (borderWidth / 2); // Use visualRadius here
        const textTopMargin = 20;
        let currentY = circleBottomY + textTopMargin;
        ctx.textBaseline = 'top';

        textLayers.forEach((layer) => {
            if (layer.text.trim() !== '') {
                applyFontStyle(layer);
                const fontSize = parseInt(layer.fontSize) || 14;
                if (currentY + fontSize <= canvas.height) {
                    ctx.fillText(layer.text, centerX, currentY); // Use original centerX
                    currentY += fontSize * textSpacing;
                } else { console.warn("Custom text layer might be clipped:", layer.text); }
            }
        });
        currentY += 10;
        applyFontStyle(fixedDateStyle);
        const fixedDateFontSize = parseInt(fixedDateStyle.fontSize) || 14;
         if (currentY + fixedDateFontSize <= canvas.height) {
            const displayDate = (typeof formatDate === 'function') ? formatDate(dateValue) : dateValue;
            ctx.fillText(displayDate, centerX, currentY); // Use original centerX
            currentY += fixedDateFontSize * textSpacing;
        } else { console.warn("Fixed Date text might be clipped."); }
        applyFontStyle(fixedCoordsStyle);
        const fixedCoordsFontSize = parseInt(fixedCoordsStyle.fontSize) || 14;
         if (currentY + fixedCoordsFontSize <= canvas.height) {
            ctx.fillText(latFullFormatted, centerX, currentY); // Use original centerX
            currentY += fixedCoordsFontSize * textSpacing;
             if (currentY + fixedCoordsFontSize <= canvas.height) {
                ctx.fillText(lonFullFormatted, centerX, currentY); // Use original centerX
            } else { console.warn("Longitude text might be clipped."); }
        } else { console.warn("Latitude text might be clipped."); }
        console.log("Text layers drawn.");
        // --- End Text Drawing ---

        canvas.setAttribute('data-generated', 'true');
        if (typeof validateInputs === 'function') validateInputs();
        console.log("Star map generation complete using ImageBitmap.");

    } catch (error) {
        console.error("Error during star map generation:", error);
        alert("Error generating star map: " + error.message);
        canvas.setAttribute('data-generated', 'false');
        if (typeof validateInputs === 'function') validateInputs();
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        // No objectUrl to revoke when using createImageBitmap
        const generateBtn = document.getElementById('generateBtn');
        if(generateBtn) generateBtn.disabled = false;
    }
} // End generateStarMap function


// Note: Implementations for validateInputs and downloadStarMap are expected
// to be defined in their respective dedicated files (e.g., utils.js, download.js)
// and loaded via <script> tags in the HTML.

// --- END OF CODE - Cline - 2025-04-20 09:58 File: js/main_app.js