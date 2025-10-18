/* START OF CODE - Cline - 2025-07-02 17:09 File: js/main_app.js */
// Main Application Logic for Star Map Generator - main_app.js
// MODIFIED: Implemented Google Maps JS API Loader using importLibrary

// --- Global Variables ---
let aspectRatio = 1; // Default aspect ratio (Square)
let currentStarMapStyle = "default";
let colorPickersInitialized = false;
// let domReady = false; // REMOVED - Not needed with Loader
// window.googleMapsApiLoaded = false; // REMOVED - Not needed with Loader
const API_IMAGE_SIZE = 5000; // Fixed size for API request - CHANGED FROM 3000
let currentZoomLevel = 100; // Store current zoom level
window.lastGeneratedMapBlob = null; // ADDED: Store the last fetched high-res blob for download

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
async function handleOccasionChange() {
    console.log("DEBUG: handleOccasionChange function called!");
    const occasionSelect = document.getElementById('occasion');
    const customInput = document.getElementById('custom-occasion'); // Assuming this input exists for custom entry
    if (!occasionSelect) {
        console.error("DEBUG: Occasion select element not found!");
        return;
    }

    console.log(`DEBUG: Current dropdown value: "${occasionSelect.value}"`);
    const previousValue = occasionSelect.getAttribute('data-previous-value') || '';
    console.log(`DEBUG: Previous value: "${previousValue}"`);

    if (occasionSelect.value === 'custom') {
        console.log("DEBUG: User selected 'custom' - showing prompt");
        let customOccasion = prompt("Enter your custom occasion text:", "");
        
        // Handle Promise from custom modal
        if (customOccasion && typeof customOccasion === 'object' && customOccasion.then) {
            console.log("DEBUG: Detected Promise, awaiting result...");
            customOccasion = await customOccasion;
        }
        
        console.log(`DEBUG: User entered: "${customOccasion}"`);
        console.log(`DEBUG: Type of customOccasion: ${typeof customOccasion}`);

        if (customOccasion && customOccasion !== null && customOccasion !== 'null' && customOccasion.trim()) {
            const trimmedOccasion = customOccasion.trim();
            console.log(`DEBUG: User entered custom occasion: "${trimmedOccasion}"`);
            
            // Simple direct approach - manually add the option
            const customOptionValue = 'custom_' + trimmedOccasion.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            
            // Check if option already exists
            let existingOption = occasionSelect.querySelector(`option[value="${customOptionValue}"]`);
            
            if (!existingOption) {
                const newOption = document.createElement('option');
                newOption.value = customOptionValue;
                newOption.text = trimmedOccasion + ' ✕';
                newOption.dataset.custom = "true";
                newOption.style.color = '#ff0000';
                
                // Insert before "Add Your Own..."
                const addYourOwnOption = occasionSelect.querySelector('option[value="custom"]');
                if (addYourOwnOption) {
                    occasionSelect.insertBefore(newOption, addYourOwnOption);
                } else {
                    occasionSelect.appendChild(newOption);
                }
                console.log(`DEBUG: Added custom occasion: "${trimmedOccasion}"`);
            }
            
            // Select the new option
            occasionSelect.value = customOptionValue;
            console.log(`DEBUG: Selected custom occasion: "${customOptionValue}"`);
                
                // ADDED: Save to history system
            if (typeof saveCustomOccasionToHistory === 'function') {
                console.log(`DEBUG HISTORY: Saving custom occasion "${trimmedOccasion}" to history from modal`);
                saveCustomOccasionToHistory(trimmedOccasion);
            } else {
                console.warn("saveCustomOccasionToHistory function not found in history.js");
            }
        } else {
            // User cancelled or entered empty string, revert selection
            console.log("DEBUG: User cancelled or entered empty string");
            occasionSelect.value = previousValue || 'mothers_day'; // Revert to previous or default
            if(customInput) customInput.style.display = 'none'; // Hide input
        }
    } else {
        console.log(`DEBUG: User selected standard option: "${occasionSelect.value}"`);
        // Hide custom input if a standard option is selected
        if(customInput) customInput.style.display = 'none';
    }
    // Update previous value tracking
    occasionSelect.setAttribute('data-previous-value', occasionSelect.value);
    console.log(`DEBUG: Updated previous value to: "${occasionSelect.value}"`);
    if (typeof validateInputs === 'function') validateInputs(); // Validate after change
}

// --- Function to Attempt Map Initialization --- REMOVED
// function tryInitializeMap() { ... }

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
        // Defaults for fixed rows will be set in loadSavedSettings or here if needed
        if (select.id === 'fixed-font-family-date' || select.id === 'fixed-font-family-coords' || select.id === 'fixed-font-family-place') {
             select.value = 'Arial';
        } else if (select.id === 'font-family-1' || select.id === 'font-family-2' || select.id === 'font-family-3' || select.id === 'font-family-4') {
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
         if (select.id === 'font-size-1') select.value = '28';
         else if (select.id === 'font-size-2') select.value = '16';
         else if (select.id === 'font-size-3') select.value = '14';
         else if (select.id === 'font-size-4') select.value = '14'; // Default for new entry 4
         else if (select.id === 'fixed-font-size-date' || select.id === 'fixed-font-size-coords' || select.id === 'fixed-font-size-place') select.value = '14';
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
    const text4 = getVal('text-entry-4', ''); // Read Entry 4
    const dateVal = getVal('date', '');
    const latVal = getVal('latitude', '');
    const lonVal = getVal('longitude', '');

    const span1 = getEl('text-placement-content-1');
    const span2 = getEl('text-placement-content-2');
    const span3 = getEl('text-placement-content-3');
    const span4 = getEl('text-placement-content-4'); // Get Span 4
    const spanDate = getEl('text-placement-content-date');
    const spanCoords = getEl('text-placement-content-coords');

    if (span1) span1.textContent = text1 || '-'; // Use dash if empty
    if (span2) span2.textContent = text2 || '-';
    if (span3) span3.textContent = text3 || '-';
    if (span4) span4.textContent = text4 || '-'; // Update Span 4

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

// --- NEW: Separate Map Initialization Function ---
async function initMap() {
    console.log("Attempting to load Google Maps API via importLibrary...");
    try {
        // Check if google.maps is available (basic check)
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            throw new Error("Google Maps base object not found. Script tag might be missing or blocked.");
        }

        // Asynchronously import required libraries using google.maps.importLibrary
        // No need to destructure here, just ensure they are loaded
        await google.maps.importLibrary("maps");
        await google.maps.importLibrary("geocoding");
        await google.maps.importLibrary("places");
        await google.maps.importLibrary("core");

        console.log("Google Maps libraries loaded successfully via importLibrary.");

        // Now it's safe to initialize the map
        if (typeof initializeGoogleMap === 'function') {
            initializeGoogleMap(); // Call the function defined in map.js
        } else {
            console.error("CRITICAL: initializeGoogleMap function (from map.js) not found when expected!");
        }

    } catch (error) {
        console.error("Error loading Google Maps libraries via importLibrary:", error);
        alert("Error loading Google Maps components. Please check your internet connection or API key configuration.");
    }
}
// --- END NEW Map Initialization Function ---


// --- Initialization ---
document.addEventListener('DOMContentLoaded', async function() { // Made async
    console.log("Star Map Generator App Initializing (main_app.js)...");

    // Populate dropdowns first as other functions might rely on them
    populateFontDropdowns();
    populateFontSizeDropdowns();

    if (typeof loadCustomOccasions === 'function') loadCustomOccasions();
    // Load settings *before* initializing map, as map might use saved coords
    if (typeof loadSavedSettings === 'function') {
        await loadSavedSettings(); // Wait for settings to load if async
    }
    if (typeof setupAllHistories === 'function') {
        await setupAllHistories(); // Wait for histories if async
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
        
        // DEBUG: Log current dropdown state
        console.log(`DEBUG: Initial occasion dropdown value: "${occasionSelect.value}"`);
        console.log(`DEBUG: Occasion dropdown options count: ${occasionSelect.options.length}`);
        for (let i = 0; i < occasionSelect.options.length; i++) {
            console.log(`DEBUG: Option ${i}: value="${occasionSelect.options[i].value}", text="${occasionSelect.options[i].text}"`);
        }
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

        // MODIFIED: Call redrawPreviewCanvas instead of generateStarMap
        zoomSlider.addEventListener('input', function() {
            currentZoomLevel = parseInt(this.value); // Update global zoom level
            zoomValueDisplay.textContent = currentZoomLevel;
            // Check if a map has already been generated before triggering redraw
            const currentCanvas = document.getElementById('star-map-canvas');
            if (currentCanvas && currentCanvas.getAttribute('data-generated') === 'true') {
                 console.log(`Zoom changed to ${currentZoomLevel}%, redrawing preview...`);
                 redrawPreviewCanvas(); // Call the new redraw function
            } else {
                 console.log("Zoom changed, but no map generated yet to redraw.");
            }
        });
        console.log("Internal Zoom feature event listener enabled (using redrawPreviewCanvas).");
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

    // --- Call the new map initialization function ---
    await initMap();
    // --- End Map Initialization Call ---


    // --- Setup Text Placement Update Listeners --- MODIFIED
    const placementSourceInputs = [
        'text-entry-1', 'text-entry-2', 'text-entry-3', 'text-entry-4', // Added entry 4
        'date', 'latitude', 'longitude'
    ];
    placementSourceInputs.forEach(id => {
        const inputEl = document.getElementById(id);
        if (inputEl) {
            inputEl.addEventListener('input', updateTextPlacementContent);
            inputEl.addEventListener('change', updateTextPlacementContent); // Also update on change (e.g., date picker)
        } else {
            // Only warn if standard inputs are missing
            if (id !== 'text-entry-4') {
                 console.warn(`Text placement source input #${id} not found.`);
            }
        }
    });
    // Initial population
    updateTextPlacementContent();
    console.log("Text placement listeners added and initial content populated.");
    // --- End Text Placement Update Listeners ---

    // Add Character Counter Listeners (including new Entry 4) - MODIFIED
    for (let i = 1; i <= 4; i++) { // Loop up to 4
        const textInput = document.getElementById(`text-entry-${i}`);
        const charCount = document.getElementById(`char-count-${i}`);
        if (textInput && charCount) {
            const maxLength = textInput.maxLength || 50;
            // Initial count update
            charCount.textContent = maxLength - textInput.value.length;
            // Listener for input changes
            textInput.addEventListener('input', () => {
                charCount.textContent = maxLength - textInput.value.length;
            });
        } else {
             // Only warn if standard inputs/counters are missing
             if (i <= 3) console.warn(`Char counter elements for entry ${i} not found.`);
        }
    }
    console.log("Character counter listeners added.");

});

// --- MODIFIED Google Maps API Callback --- REMOVED
// window.setGoogleMapsReady = function() { ... }

// --- NEW: Function to redraw preview canvas without fetching ---
async function redrawPreviewCanvas() {
    console.log("redrawPreviewCanvas called.");
    const canvas = document.getElementById("star-map-canvas");
    if (!canvas || !window.lastGeneratedMapBlob) {
        console.warn("Cannot redraw preview: Canvas or stored blob not available.");
        return;
    }

    let ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("Canvas context not available for redraw.");
        return;
    }

    // Use a try/catch block for safety during redraw
    try {
        // --- Get necessary settings for drawing ---
        const getEl = id => document.getElementById(id);
        const getVal = (id, def) => getEl(id)?.value || def;
        const getInt = (id, def) => parseInt(getVal(id, String(def))) || def;
        const getChecked = id => getEl(id)?.checked || false;
        const getRadioVal = (name, def) => {
            const checkedRadio = document.querySelector(`input[name="${name}"]:checked`);
            return checkedRadio ? checkedRadio.value : def;
        };

        const circleRadiusPercent = getInt("circle-radius-percent", 90);
        const borderWidth = getInt("border-width", 1);
        const borderColor = getVal("border-color", "#FFFFFF");
        const dateValue = getVal("date", ""); // Needed for text layer
        const latFullFormatted = getVal("latitude", ""); // Needed for text layer
        const lonFullFormatted = getVal("longitude", ""); // Needed for text layer

        // --- Start Drawing ---
        // Clear canvas (background is handled by CSS)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log("Cleared main preview canvas for redraw.");

        // Create bitmap from stored blob
        const imageBitmap = await createImageBitmap(window.lastGeneratedMapBlob);
        console.log("Created ImageBitmap from stored blob for redraw.");

        // Calculate geometry based on CURRENT canvas size
        const minCanvasDim = Math.min(canvas.width, canvas.height);
        const visualRadius = (minCanvasDim * (circleRadiusPercent / 100)) / 2;
        const centerX = canvas.width / 2;
        const centerY = canvas.height * 0.50;
        const aspect = canvas.width / canvas.height;
        let radiusX = visualRadius;
        let radiusY = visualRadius;
        if (aspect > 1) { radiusX = visualRadius * aspect; }
        else if (aspect < 1) { radiusY = visualRadius / aspect; }

        // Apply Clip Path
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Calculate scaling and position for the image
        const imgScaleFactor = Math.max((radiusX * 2) / imageBitmap.width, (radiusY * 2) / imageBitmap.height);
        const drawWidth = imageBitmap.width * imgScaleFactor;
        const drawHeight = imageBitmap.height * imgScaleFactor;
        const drawX = centerX - drawWidth / 2;
        const drawY = centerY - drawHeight / 2;

        // Apply zoom factor from the global variable
        const zoomFactor = currentZoomLevel / 100;
        let sx = 0, sy = 0, sWidth = imageBitmap.width, sHeight = imageBitmap.height;
        if (zoomFactor > 1) {
             sWidth = imageBitmap.width / zoomFactor;
             sHeight = imageBitmap.height / zoomFactor;
             sx = (imageBitmap.width - sWidth) / 2;
             sy = (imageBitmap.height - sHeight) / 2;
        }

        // Draw the image (zoomed)
        ctx.drawImage(imageBitmap, sx, sy, sWidth, sHeight, drawX, drawY, drawWidth, drawHeight);
        imageBitmap.close(); // Close bitmap

        // Restore context (remove clip)
        ctx.restore();
        console.log("Redrew star map image with zoom level:", currentZoomLevel);

        // Draw Border
        if (borderWidth > 0) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = borderWidth;
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        // --- Draw Text Layers ---
        // Get text data
         const allTextData = [
            { id: 'entry1', text: getVal('text-entry-1', ''), fontFamily: getVal('font-family-1', 'Montserrat'), fontSize: parseInt(getVal('font-size-1', '28')), fontColor: getVal('font-color-1', '#FFFFFF'), isBold: getChecked('text-bold-1'), isItalic: getChecked('text-italic-1'), order: parseInt(getVal('text-placement-order-1', '1')), position: getRadioVal('text-placement-pos-1', 'below') },
            { id: 'entry2', text: getVal('text-entry-2', ''), fontFamily: getVal('font-family-2', 'Montserrat'), fontSize: parseInt(getVal('font-size-2', '16')), fontColor: getVal('font-color-2', '#FFFFFF'), isBold: getChecked('text-bold-2'), isItalic: getChecked('text-italic-2'), order: parseInt(getVal('text-placement-order-2', '2')), position: getRadioVal('text-placement-pos-2', 'below') },
            { id: 'entry3', text: getVal('text-entry-3', ''), fontFamily: getVal('font-family-3', 'Montserrat'), fontSize: parseInt(getVal('font-size-3', '14')), fontColor: getVal('font-color-3', '#FFFFFF'), isBold: getChecked('text-bold-3'), isItalic: getChecked('text-italic-3'), order: parseInt(getVal('text-placement-order-3', '3')), position: getRadioVal('text-placement-pos-3', 'below') },
            { id: 'entry4', text: getVal('text-entry-4', ''), fontFamily: getVal('font-family-4', 'Montserrat'), fontSize: parseInt(getVal('font-size-4', '14')), fontColor: getVal('font-color-4', '#FFFFFF'), isBold: getChecked('text-bold-4'), isItalic: getChecked('text-italic-4'), order: parseInt(getVal('text-placement-order-4', '4')), position: getRadioVal('text-placement-pos-4', 'below') },
            { id: 'date', text: (typeof formatDate === 'function') ? formatDate(dateValue) : dateValue, fontFamily: getVal('fixed-font-family-date', 'Arial'), fontSize: parseInt(getVal('fixed-font-size-date', '14')), fontColor: getVal('fixed-font-color-date', '#FFFFFF'), isBold: getChecked('fixed-text-bold-date'), isItalic: getChecked('fixed-text-italic-date'), order: parseInt(getVal('text-placement-order-date', '5')), position: getRadioVal('text-placement-pos-date', 'below') },
            { id: 'coords', text: `${latFullFormatted || '?'} | ${lonFullFormatted || '?'}`, fontFamily: getVal('fixed-font-family-coords', 'Arial'), fontSize: parseInt(getVal('fixed-font-size-coords', '14')), fontColor: getVal('fixed-font-color-coords', '#FFFFFF'), isBold: getChecked('fixed-text-bold-coords'), isItalic: getChecked('fixed-text-italic-coords'), order: parseInt(getVal('text-placement-order-coords', '6')), position: getRadioVal('text-placement-pos-coords', 'below') }
        ];

        // Use current canvas dimensions for text placement
        const currentCanvasWidth = canvas.width;
        const currentCanvasHeight = canvas.height;
        const currentDynamicTextMargin = visualRadius * 0.10; // Use visualRadius calculated earlier

        ctx.textAlign = 'center';
        const itemsToDraw = allTextData.filter(item => item.text && item.text.trim() !== '').sort((a, b) => a.order - b.order);
        const aboveItems = itemsToDraw.filter(item => item.position === 'above');
        const belowItems = itemsToDraw.filter(item => item.position === 'below');

        const applyFontStyle = (style) => {
            const fontWeight = style.isBold ? 'bold' : 'normal';
            const fontStyle = style.isItalic ? 'italic' : 'normal';
            const sizeNum = parseInt(style.fontSize) || 14;
            const sizeWithUnit = `${sizeNum}px`;
            const safeFontFamily = style.fontFamily.includes(' ') ? `"${style.fontFamily}"` : style.fontFamily;
            ctx.font = `${fontStyle} ${fontWeight} ${sizeWithUnit} ${safeFontFamily}`;
            ctx.fillStyle = style.fontColor;
            return sizeNum; // Return original font size for layout
        };

        const textSpacing = 1.2;

        // Draw items BELOW
        let currentYBelow = centerY + visualRadius + (borderWidth / 2) + currentDynamicTextMargin;
        ctx.textBaseline = 'top';
        belowItems.forEach((item) => {
            const fontSize = applyFontStyle(item);
            if (currentYBelow + fontSize <= currentCanvasHeight - currentDynamicTextMargin) {
                ctx.fillText(item.text, centerX, currentYBelow);
                currentYBelow += fontSize * textSpacing;
            } else { console.warn(`REDRAW: Text item '${item.id}' might be clipped below map.`); }
        });

        // Draw items ABOVE
        let currentYAbove = centerY - visualRadius - (borderWidth / 2) - currentDynamicTextMargin;
        ctx.textBaseline = 'bottom';
        [...aboveItems].reverse().forEach((item) => {
             const fontSize = applyFontStyle(item);
             if (currentYAbove - fontSize >= currentDynamicTextMargin) {
                 ctx.fillText(item.text, centerX, currentYAbove);
                 currentYAbove -= fontSize * textSpacing;
             } else { console.warn(`REDRAW: Text item '${item.id}' might be clipped above map.`); }
        });
        console.log("Redrew text layers.");

    } catch (error) {
        console.error("Error during preview redraw:", error);
        // Optionally show a less intrusive error message for redraw failures
    }
}
// --- END NEW redrawPreviewCanvas function ---


// --- Core Star Map Generation (Using createImageBitmap & ctx.ellipse & Internal Zoom) ---
async function generateStarMap() {
    console.log("generateStarMap called - using LST, createImageBitmap, ctx.ellipse, and internal zoom");

    const loadingIndicator = document.getElementById('loading-indicator');
    const loadingMessageElement = loadingIndicator ? loadingIndicator.querySelector('div:last-child') : null; // Get the message element

    // Show spinner and set detailed message
    if (loadingIndicator) {
        if (loadingMessageElement) {
            loadingMessageElement.textContent = "Calculating & Generating Star Map! Depending on canvas dimensions, radius, & DPI, this may take a while...";
            console.log("Set detailed loading message.");
        } else {
            console.warn("Could not find loading message element to update.");
        }
        loadingIndicator.style.display = 'flex';
        console.log("Loading indicator displayed.");
    } else {
         console.warn("Loading indicator element not found.");
    }


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
    window.lastGeneratedMapBlob = null; // Reset stored blob on new generation attempt

    try {
        const getEl = id => document.getElementById(id);
        const getVal = (id, def) => getEl(id)?.value || def;
        const getInt = (id, def) => parseInt(getVal(id, String(def))) || def;
        const getChecked = id => getEl(id)?.checked || false;
        const getRadioVal = (name, def) => { // Helper for radio buttons
            const checkedRadio = document.querySelector(`input[name="${name}"]:checked`);
            return checkedRadio ? checkedRadio.value : def;
        };

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
        const imageFormat = getRadioVal("image-format", "png"); // Use helper
        const pngTransparency = getChecked("png-transparency");
        const imageBackgroundColor = '#000000'; // Background for the generated image if not transparent


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
                format: imageFormat, // Use selected format for preview fetch too
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
                    // Include advanced params in preview request too
                    ...advancedParams,
                    ...(!(imageFormat === 'png' && pngTransparency) && { backgroundColor: imageBackgroundColor })
                }
            }
        };

        console.log(`DEBUG: Sending request to PHP proxy (Fixed API Size ${API_IMAGE_SIZE}x${API_IMAGE_SIZE}):`, JSON.stringify(requestBody, null, 2));

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
        window.lastGeneratedMapBlob = blob; // Store the original blob for download
        console.log("DEBUG: Stored original blob in window.lastGeneratedMapBlob");

        // --- Call redraw function ---
        await redrawPreviewCanvas(); // Use the new function to draw

        canvas.setAttribute('data-generated', 'true');
        if (typeof validateInputs === 'function') validateInputs();
        console.log("Star map generation complete using ImageBitmap.");

    } catch (error) {
        console.error("Error during star map generation:", error);
        alert("Error generating star map: " + error.message);
        canvas.setAttribute('data-generated', 'false');
        window.lastGeneratedMapBlob = null; // Clear blob on error
        if (typeof validateInputs === 'function') validateInputs();
    } finally {
        // Hide spinner and reset message
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
            if (loadingMessageElement) {
                // Reset message for next time
                loadingMessageElement.textContent = "Generating Star Map...";
            }
            console.log("Loading indicator hidden.");
        }
        // No objectUrl to revoke when using createImageBitmap
        const generateBtn = document.getElementById('generateBtn');
        if(generateBtn) generateBtn.disabled = false;
    }
} // End generateStarMap function


// Note: Implementations for validateInputs and downloadStarMap are expected
// to be defined in their respective dedicated files (e.g., utils.js, download.js)
// and loaded via <script> tags in the HTML.

/* END OF CODE - Cline - 2025-07-02 17:09 File: js/main_app.js */
