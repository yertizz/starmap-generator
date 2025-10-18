// Main Application Logic for Star Map Generator - main_app.js
// Calls your PHP proxy to fetch the star map image, bypassing CORS

// --- Global Variables ---
let starFieldColor = "#000000";
let outsideColor = "#0a0e1a";
let aspectRatio = 1.25;
let currentStarMapStyle = "default";
let colorPickersInitialized = false;

const advancedStyleOptions = {
    milkyWay: false, constellationBounds: false, starsGlow: false,
    starSize: 1.0, starNumber: 2000, constellationLineWidth: 1.0,
    moon: false, sun: false, planets: false, eclipticPath: false,
    celestialBodySize: 1.0, planetLabels: false, constellationLabels: false,
    labelFont: 'Arial', labelFontSize: 10,
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

    validateInputs();
    console.log("Star Map Generator App Initialized Successfully (main_app.js).");
});

// --- Core Star Map Generation ---
async function generateStarMap() {
    console.log("generateStarMap called - using PHP proxy");

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
        const getChecked = (id, def) => getEl(id)?.checked ?? def;
        const getInt = (id, def) => parseInt(getVal(id, String(def))) || def;

        const outputWidth = getInt("output-width", 800);
        const outputHeight = getInt("output-height", 800);

        canvas.width = outputWidth;
        canvas.height = outputHeight;
        ctx = canvas.getContext("2d");

        const latFullFormatted = getVal("latitude", "");
        const lonFullFormatted = getVal("longitude", "");
        const latDecimal = parseFormattedCoordinate(latFullFormatted, 'latitude');
        const lonDecimal = parseFormattedCoordinate(lonFullFormatted, 'longitude');

        const dateValue = getVal("date", "");
        if (!dateValue) throw new Error("Date is required.");

        const starMapStyleValue = getVal("star-map-style", "default");

        const requestBody = {
            style: starMapStyleValue,
            output: { width: outputWidth, height: outputHeight },
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
                            rightAscension: 0,
                            declination: latDecimal
                        }
                    }
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
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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
    // Your existing validation logic
}

function parseFormattedCoordinate(fullFormattedCoord, part = 'latitude') {
    if (!fullFormattedCoord || typeof fullFormattedCoord !== 'string') return NaN;
    const coordRegex = /([NS]\d+°\s*\d+′\.\d+)\s*(?:\|?\s*)([WE]\d+°\s*\d+′\.\d+)/;
    const coordMatches = fullFormattedCoord.match(coordRegex);
    let targetCoordString = '';
    if (coordMatches && coordMatches.length >= 3) {
        targetCoordString = (part === 'latitude') ? coordMatches[1] : coordMatches[2];
    } else {
        targetCoordString = fullFormattedCoord;
    }
    const parts = targetCoordString.match(/([NSWE])(\d+)°\s*(\d+)′\.(\d+)/);
    if (!parts || parts.length < 5) {
        const decimalVal = parseFloat(targetCoordString);
        if (!isNaN(decimalVal)) return decimalVal;
        return NaN;
    }
    const direction = parts[1];
    const degrees = parseFloat(parts[2]);
    const minutesWhole = parseFloat(parts[3]);
    const minutesDecimal = parseFloat(`0.${parts[4]}`);
    const minutes = minutesWhole + minutesDecimal;
    let decimal = degrees + minutes / 60.0;
    if (direction === 'S' || direction === 'W') decimal *= -1;
    return decimal;
}

function populateFontDropdowns() {
    // Your existing font dropdown population logic
}

function populateFontSizeDropdowns() {
    // Your existing font size dropdown population logic
}