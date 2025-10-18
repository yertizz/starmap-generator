// START OF CODE - Cline - 2025-04-13 13:41 File: js/main_app.js
// Main Application Logic for Star Map Generator - main_app.js
// Calls your PHP proxy to fetch the star map image, bypassing CORS
// Calculates LST and uses it as rightAscension, declination = latitude
// Reads color picker values, fills canvas background BEFORE drawing image

// --- Global Variables ---
let aspectRatio = 1.25;
let currentStarMapStyle = "default";
let colorPickersInitialized = false;

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

// --- Initialization ---
document.addEventListener('DOMContentLoaded', function() {
    console.log("Star Map Generator App Initializing (main_app.js)...");

    populateFontDropdowns();
    populateFontSizeDropdowns();

    if (typeof loadCustomOccasions === 'function') loadCustomOccasions();
    if (typeof loadSavedSettings === 'function') loadSavedSettings();
    if (typeof setupTextInputHistory === 'function') setupTextInputHistory();
    if (typeof setupZipCodeHistory === 'function') setupZipCodeHistory();
    if (typeof addLoadSettingsButton === 'function') addLoadSettingsButton();
    if (typeof addSaveSettingsButton === 'function') addSaveSettingsButton();
    if (typeof initializeHexColorPickers === 'function') initializeHexColorPickers();
    if (typeof setupAdvancedOptionsEventListeners === 'function') setupAdvancedOptionsEventListeners();

    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            console.log("Generate button clicked (main_app.js)");
            if (!generateBtn.hasAttribute('disabled')) {
                if (typeof saveCurrentSettings === 'function') saveCurrentSettings();
                generateStarMap();
            } else { console.log("Generate button is disabled."); }
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            console.log("Download button clicked (main_app.js)");
            if (!downloadBtn.hasAttribute('disabled')) {
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
            input.addEventListener('change', validateInputs);
            input.addEventListener('input', validateInputs);
        }
    });

    // Add Zoom Slider Functionality
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomValueDisplay = document.getElementById('zoom-value');
    const starMapCanvas = document.getElementById('star-map-canvas');

    if (zoomSlider && zoomValueDisplay && starMapCanvas) {
        zoomSlider.addEventListener('input', function() {
            const zoomLevel = this.value;
            zoomValueDisplay.textContent = zoomLevel;
            const scaleValue = zoomLevel / 100;
            starMapCanvas.style.transformOrigin = 'center center';
            starMapCanvas.style.transform = `scale(${scaleValue})`;
        });
        const initialZoomLevel = zoomSlider.value;
        zoomValueDisplay.textContent = initialZoomLevel;
        starMapCanvas.style.transformOrigin = 'center center';
        starMapCanvas.style.transform = `scale(${initialZoomLevel / 100})`;
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
        // Initial check on page load
        updateTransparencyOption();
        console.log("Image format/transparency logic initialized.");
    } else {
        console.warn("Image format radio buttons not found.");
    }
    // --- End Image Format / Transparency Logic ---


    validateInputs(); // Initial validation check
    console.log("Star Map Generator App Initialized Successfully (main_app.js).");

    // Attempt map initialization directly after DOM is ready
    let mapInitAttempts = 0;
    const maxMapInitAttempts = 50;
    const mapInitCheckInterval = setInterval(function() {
        mapInitAttempts++;
        if (typeof initializeGoogleMap === 'function') {
            clearInterval(mapInitCheckInterval);
            console.log("DOM ready and initializeGoogleMap found, calling initializeGoogleMap().");
            initializeGoogleMap();
        } else if (mapInitAttempts >= maxMapInitAttempts) {
             clearInterval(mapInitCheckInterval);
             console.error("initializeGoogleMap function (from map.js) not found after multiple attempts!");
        } else {
            // console.log(`Waiting for initializeGoogleMap function... Attempt ${mapInitAttempts}`); // Reduce console noise
        }
    }, 100);

}); // End of DOMContentLoaded listener


// --- Core Star Map Generation ---
async function generateStarMap() {
    console.log("generateStarMap called - using PHP proxy with LST calculation");

    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) loadingIndicator.style.display = 'flex';

    const canvas = document.getElementById("star-map-canvas");
    let ctx = canvas.getContext("2d");

    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        console.error("Canvas context not available.");
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        return;
    }
    canvas.setAttribute('data-generated', 'false');

    let objectUrl = null;

    try {
        const getEl = id => document.getElementById(id);
        const getVal = (id, def) => getEl(id)?.value || def;
        const getInt = (id, def) => parseInt(getVal(id, String(def))) || def;
        const getChecked = id => getEl(id)?.checked || false;

        // Read dimensions from input fields
        const outputWidth = getInt("output-width", 800);
        const outputHeight = getInt("output-height", 800);

        canvas.width = outputWidth;
        canvas.height = outputHeight;
        ctx = canvas.getContext("2d"); // Re-get context after resize

        const latFullFormatted = getVal("latitude", "");
        const lonFullFormatted = getVal("longitude", "");
        const latDecimal = parseFormattedCoordinate(latFullFormatted, 'latitude');
        const lonDecimal = parseFormattedCoordinate(lonFullFormatted, 'longitude');

        if (isNaN(latDecimal) || isNaN(lonDecimal)) {
             alert("Invalid or missing coordinates. Please select a location on the map or enter valid coordinates.");
             if (loadingIndicator) loadingIndicator.style.display = 'none';
             return;
        }

        const dateValue = getVal("date", "");
        if (!dateValue) {
            alert("Date is required.");
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            return;
        }

        const starMapStyleValue = getVal("star-map-style", "default");
        const canvasBackgroundColor = getVal('bg-color-canvas', '#F5F5DC');
        const imageBackgroundColor = getVal('bg-color-image', '#000000'); // Assuming this ID exists or is handled elsewhere

        const dpi = parseInt(document.querySelector('input[name="dpi"]:checked')?.value || '150');
        const imageFormat = document.querySelector('input[name="image-format"]:checked')?.value || 'png';
        const pngTransparency = getEl('png-transparency')?.checked || false;

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
            {
                text: getVal('text-entry-1', ''),
                fontFamily: getVal('font-family-1', 'Montserrat'),
                fontSize: parseInt(getVal('font-size-1', '28')),
                fontColor: getVal('font-color-1', '#FFFFFF'),
                isBold: getChecked('text-bold-1'),
                isItalic: getChecked('text-italic-1')
            },
            {
                text: getVal('text-entry-2', ''),
                fontFamily: getVal('font-family-2', 'Montserrat'),
                fontSize: parseInt(getVal('font-size-2', '16')),
                fontColor: getVal('font-color-2', '#FFFFFF'),
                isBold: getChecked('text-bold-2'),
                isItalic: getChecked('text-italic-2')
            },
            {
                text: getVal('text-entry-3', ''),
                fontFamily: getVal('font-family-3', 'Montserrat'),
                fontSize: parseInt(getVal('font-size-3', '14')),
                fontColor: getVal('font-color-3', '#FFFFFF'),
                isBold: getChecked('text-bold-3'),
                isItalic: getChecked('text-italic-3')
            }
        ];

        const advancedParams = {};
        const advancedOptionElements = document.querySelectorAll('#advanced-options-panel input[data-api-param]');
        advancedOptionElements.forEach(el => {
            const paramName = el.getAttribute('data-api-param');
            if (el.type === 'checkbox') {
                advancedParams[paramName] = el.checked;
            } else if (el.type === 'range' || el.type === 'number') {
                advancedParams[paramName] = parseFloat(el.value);
            } else {
                advancedParams[paramName] = el.value;
            }
        });
        // Fallbacks (kept for potential compatibility)
        advancedParams.showConstellations = advancedParams.showConstellationLines ?? true;
        advancedParams.showConstellationNames = advancedParams.showConstellationLabels ?? true;
        advancedParams.showMilkyWay = advancedParams.showMilkyWay ?? true;
        advancedParams.showGrid = advancedParams.showGrid ?? true;
        advancedParams.showPlanets = advancedParams.showPlanets ?? true;
        advancedParams.showSunMoon = advancedParams.showSun ?? advancedParams.showMoon ?? true;
        advancedParams.showLabels = advancedParams.showPlanetLabels ?? true;
        advancedParams.showEcliptic = advancedParams.showEclipticPath ?? true;

        const lstHours = calculateLST(dateValue, lonDecimal);
         if (isNaN(lstHours)) {
             alert("Could not calculate LST. Check date and longitude.");
             if (loadingIndicator) loadingIndicator.style.display = 'none';
             return;
         }
        console.log(`Calculated LST: ${lstHours} hours`);

        const requestBody = {
            style: starMapStyleValue,
            output: {
                width: outputWidth,
                height: outputHeight,
                format: imageFormat,
                ...(imageFormat === 'png' && { transparent: pngTransparency }),
            },
            observer: {
                latitude: latDecimal,
                longitude: lonDecimal,
                date: dateValue
            },
            view: {
                type: "area",
                parameters: {
                    position: {
                        equatorial: {
                            rightAscension: lstHours,
                            declination: latDecimal
                        }
                    },
                    ...(() => {
                        const { starSize, starNumber, constellationLineWidth, ...rest } = advancedParams;
                        return rest;
                    })(),
                    backgroundColor: imageBackgroundColor,
                }
            }
        };

        console.log("DEBUG: Sending request to PHP proxy:", JSON.stringify(requestBody, null, 2));

        const response = await fetch('proxy/star_map_proxy.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Proxy error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const blob = await response.blob();
        console.log("DEBUG: Received image blob from proxy.");

        objectUrl = URL.createObjectURL(blob);
        console.log("DEBUG: Created Object URL:", objectUrl);

        const img = new Image();
        img.onload = () => {
            console.log("DEBUG: Image loaded from proxy, drawing...");

            ctx.fillStyle = canvasBackgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.beginPath();
            const diameter = Math.min(canvas.width, canvas.height) * 0.70;
            const radius = diameter / 2;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
            ctx.clip();

            const imgRatio = img.naturalWidth / img.naturalHeight;
            const circleDiameter = radius * 2;
            let drawWidth, drawHeight, drawX, drawY;

            if (imgRatio >= 1) {
                drawWidth = circleDiameter;
                drawHeight = circleDiameter / imgRatio;
                drawX = centerX - radius;
                drawY = centerY - drawHeight / 2;
            } else {
                drawHeight = circleDiameter;
                drawWidth = circleDiameter * imgRatio;
                drawX = centerX - drawWidth / 2;
                drawY = centerY - radius;
            }
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
            console.log(`DEBUG: Drawing image scaled to clip diameter. Original: ${img.naturalWidth}x${img.naturalHeight}, Drawn: ${drawWidth.toFixed(2)}x${drawHeight.toFixed(2)} at ${drawX.toFixed(2)},${drawY.toFixed(2)}`);

            ctx.restore();

            console.log("Drawing text layers outside circle...");
            ctx.textAlign = 'center';
            const applyFontStyle = (style) => {
                const fontWeight = style.isBold ? 'bold' : 'normal';
                const fontStyle = style.isItalic ? 'italic' : 'normal';
                ctx.font = `${fontStyle} ${fontWeight} ${style.fontSize}px "${style.fontFamily}"`;
                ctx.fillStyle = style.fontColor;
            };
            const textSpacing = 1.2;
            const circleBottomY = centerY + radius;
            const textTopMargin = 20;
            let currentY = circleBottomY + textTopMargin; // Use let here as it's reassigned

            ctx.textBaseline = 'top';
            textLayers.forEach((layer, index) => {
                if (layer.text.trim() !== '') {
                    applyFontStyle(layer);
                    if (currentY + layer.fontSize > canvas.height) {
                        console.warn("Text layer might be clipped at the bottom of the canvas.");
                    }
                    ctx.fillText(layer.text, centerX, currentY);
                    currentY += layer.fontSize * textSpacing;
                }
            });

            currentY += 10;

            applyFontStyle(fixedDateStyle);
             if (currentY + fixedDateStyle.fontSize <= canvas.height) {
                ctx.fillText(dateValue, centerX, currentY);
                currentY += fixedDateStyle.fontSize * textSpacing;
            } else { console.warn("Fixed Date text might be clipped."); }

            applyFontStyle(fixedCoordsStyle);
             if (currentY + fixedCoordsStyle.fontSize <= canvas.height) {
                ctx.fillText(latFullFormatted, centerX, currentY);
                currentY += fixedCoordsStyle.fontSize * textSpacing;
                 if (currentY + fixedCoordsStyle.fontSize <= canvas.height) {
                    ctx.fillText(lonFullFormatted, centerX, currentY);
                } else { console.warn("Longitude text might be clipped."); }
            } else { console.warn("Latitude text might be clipped."); }

            console.log("Text layers drawn outside circle.");

            canvas.setAttribute('data-generated', 'true');
            validateInputs();
            console.log("Star map generated successfully.");
            URL.revokeObjectURL(objectUrl);
            if (loadingIndicator) loadingIndicator.style.display = 'none';
        };
        img.onerror = (e) => {
            console.error("Failed to load image from proxy blob URL:", e);
            alert("Error: Could not load the star map image.");
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            canvas.setAttribute('data-generated', 'false');
            validateInputs();
            URL.revokeObjectURL(objectUrl);
        };
        img.src = objectUrl;

    } catch (error) {
        console.error("Error during star map generation:", error);
        alert("Error generating star map: " + error.message);
        canvas.setAttribute('data-generated', 'false');
        validateInputs();
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
}

// --- Helper Functions ---
function validateInputs() {
    const occasion = document.getElementById("occasion")?.value.trim();
    const date = document.getElementById("date")?.value.trim();
    const latitude = document.getElementById("latitude")?.value.trim();
    const longitude = document.getElementById("longitude")?.value.trim();

    const generateBtn = document.getElementById("generateBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const canvas = document.getElementById("star-map-canvas");

    const latDecimal = parseFormattedCoordinate(latitude, 'latitude');
    const lonDecimal = parseFormattedCoordinate(longitude, 'longitude');
    const coordsValid = !isNaN(latDecimal) && !isNaN(lonDecimal);

    const inputsValid = occasion && date && latitude && longitude && coordsValid;

    if (generateBtn) {
        if (inputsValid) {
            generateBtn.removeAttribute("disabled");
            generateBtn.classList.add("enabled");
        } else {
            generateBtn.setAttribute("disabled", "true");
            generateBtn.classList.remove("enabled");
        }
    }

    const mapGenerated = canvas?.getAttribute('data-generated') === 'true';

    if (downloadBtn) {
        if (inputsValid && mapGenerated) {
            downloadBtn.removeAttribute("disabled");
            downloadBtn.classList.add("enabled");
        } else {
            downloadBtn.setAttribute("disabled", "true");
            downloadBtn.classList.remove("enabled");
        }
    }
}

function parseFormattedCoordinate(fullFormattedCoord, part = 'latitude') {
    if (!fullFormattedCoord || typeof fullFormattedCoord !== 'string') return NaN;

    const dmmMatch = fullFormattedCoord.trim().match(/^([NSEW])\s*(\d+)\s*°\s*(\d+(?:\.\d+)?)\s*['′]?$/i);
    if (dmmMatch) {
        const direction = dmmMatch[1].toUpperCase();
        const degrees = parseInt(dmmMatch[2], 10);
        const minutes = parseFloat(dmmMatch[3]);

        if (isNaN(degrees) || isNaN(minutes)) return NaN;

        let decimalDegrees = degrees + (minutes / 60.0);
        if (direction === 'S' || direction === 'W') decimalDegrees = -decimalDegrees;

        if ((direction === 'N' || direction === 'S') && (decimalDegrees < -90 || decimalDegrees > 90)) return NaN;
        if ((direction === 'E' || direction === 'W') && (decimalDegrees < -180 || decimalDegrees > 180)) return NaN;

        return decimalDegrees;
    }

    const decimalVal = parseFloat(fullFormattedCoord);
     if (!isNaN(decimalVal)) {
         if (part === 'latitude' && decimalVal >= -90 && decimalVal <= 90) return decimalVal;
         if (part === 'longitude' && decimalVal >= -180 && decimalVal <= 180) return decimalVal;
     }

    return NaN;
}


function calculateLST(dateString, longitude) {
     if (isNaN(longitude)) {
         console.error("Invalid longitude for LST calculation:", longitude);
         return NaN;
     }
    const date = new Date(dateString + 'T00:00:00Z');
     if (isNaN(date.getTime())) {
         console.error("Invalid date for LST calculation:", dateString);
         return NaN;
     }
    const JD = (date.getTime() / 86400000) + 2440587.5;
    const D = JD - 2451545.0;
    let GMST = 18.697374558 + 24.06570982441908 * D;
    GMST = GMST % 24;
    if (GMST < 0) GMST += 24;
    const LST = (GMST + longitude / 15.0) % 24;
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
        select.innerHTML = '';
        uniqueFonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            option.style.fontFamily = font;
            select.appendChild(option);
        });
        if (select.id === 'fixed-font-family-date' || select.id === 'fixed-font-family-coords') {
             select.value = 'Arial';
        } else {
             select.value = 'Montserrat';
        }
    });
    console.log("Font family dropdowns populated.");
}

function populateFontSizeDropdowns() {
    const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 54, 60, 72, 96, 112];

    const selects = document.querySelectorAll('.font-size-select');
    selects.forEach(select => {
        select.innerHTML = '';
        fontSizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = `${size}px`;
            select.appendChild(option);
        });
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
// END OF CODE - Cline - 2025-04-13 13:41 File: js/main_app.js
