// Recovery Script - Phase 1: Text Rendering & History

// --- Global Variables ---
// Assume these might be needed by helper functions if not passed directly
let starFieldColor = "#000000";
let outsideColor = "#0a0e1a";

// --- Initialization ---
document.addEventListener('DOMContentLoaded', function() {
    console.log("Recovery App Initializing (Phase 1 - Text)...");

    const generateBtn = document.getElementById('generateBtn');
    const dateInput = document.getElementById('date');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');

    function checkInputsForButton() {
         if (generateBtn) {
            // Also check if text entry 1 has value for basic validation
            const text1 = document.getElementById('text-entry-1')?.value;
            generateBtn.disabled = !(dateInput?.value && latitudeInput?.value && longitudeInput?.value && text1);
         }
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', generateStarMap);
        console.log("Generate button listener added.");
    } else {
        console.error("Generate button (#generateBtn) not found!");
    }

    // Basic input validation to enable button
    const inputsToValidate = [dateInput, latitudeInput, longitudeInput, document.getElementById('text-entry-1')];
    inputsToValidate.forEach(input => {
        if (input) {
            input.addEventListener('input', checkInputsForButton);
        }
    });

    // Setup Text History
    setupTextInputHistory(); // Includes loading saved text

    checkInputsForButton(); // Initial check

    console.log("Recovery App Initialized (Phase 1 - Text).");
});


// --- Core Star Map Generation ---
function generateStarMap() {
    console.log("generateStarMap called (Recovery - Phase 1)");
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) loadingIndicator.style.display = 'flex';

    try {
        const canvas = document.getElementById("star-map-canvas");
        if (!canvas) throw new Error("Canvas element (#star-map-canvas) not found");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        // --- Get Values with Defaults and ROBUST Checks ---
        const getEl = (id) => document.getElementById(id);
        const getVal = (id, defaultVal) => {
            const el = getEl(id);
            if (!el) { console.warn(`Element #${id} not found, using default: ${defaultVal}`); return defaultVal; }
            return (typeof el.value !== 'undefined') ? el.value : defaultVal;
        };
        const getChecked = (id, defaultVal) => {
             const el = getEl(id);
             if (!el) { console.warn(`Element #${id} not found, using default: ${defaultVal}`); return defaultVal; }
             return (typeof el.checked !== 'undefined') ? el.checked : defaultVal;
        };
        const getInt = (id, defaultVal) => {
            const val = getVal(id, String(defaultVal));
            const num = parseInt(val);
            return isNaN(num) ? defaultVal : num;
        };

        // Essential values needed
        const outputWidth = getInt("output-width", 800); // Read from hidden or default
        const outputHeight = getInt("output-height", 1000); // Read from hidden or default
        const starFieldColorValue = getVal("star-field-color", "#000000"); // Read from hidden or default
        const outsideColorValue = getVal("outside-color", "#0a0e1a"); // Read from hidden or default

        canvas.width = outputWidth;
        canvas.height = outputHeight;

        // --- Basic Drawing ---
        ctx.fillStyle = outsideColorValue;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = starFieldColorValue;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Standard Stars
        drawStandardStars(ctx, canvas.width, canvas.height);

        // --- Draw Text Layers ---
        const textLayersData = [];
        for (let i = 1; i <= 3; i++) {
            const textVal = getVal(`text-entry-${i}`, '');
            // Only add if text exists, otherwise skip drawing for this layer
            if (textVal) {
                textLayersData.push({
                    text: textVal,
                    fontFamily: getVal(`font-family-${i}`, 'Arial'),
                    fontSize: getVal(`font-size-${i}`, '16'),
                    fontColor: getVal(`font-color-${i}`, '#FFFFFF'),
                    isBold: getChecked(`text-bold-${i}`, false),
                    isItalic: getChecked(`text-italic-${i}`, false)
                });
            } else {
                textLayersData.push(null); // Keep placeholder
            }
        }

        // Define Y positions
        const yPos1 = canvas.height * 0.65;
        const yPos2 = canvas.height * 0.75;
        const yPosDate = canvas.height * 0.82;
        const yPosCoords = canvas.height * 0.86;
        const yPos3 = canvas.height * 0.90;

        // Draw Text Layer 1
        if (textLayersData[0]) {
            drawText(ctx, textLayersData[0].text, textLayersData[0].fontFamily, textLayersData[0].fontSize, textLayersData[0].isBold, textLayersData[0].isItalic, textLayersData[0].fontColor, canvas.width / 2, yPos1);
        }
        // Draw Text Layer 2
        if (textLayersData[1]) {
            drawText(ctx, textLayersData[1].text, textLayersData[1].fontFamily, textLayersData[1].fontSize, textLayersData[1].isBold, textLayersData[1].isItalic, textLayersData[1].fontColor, canvas.width / 2, yPos2);
        }

        // Fixed Date and Coords
        const dateValue = getVal("date", "");
        const latValue = getVal("latitude", "");
        const lonValue = getVal("longitude", "");

        if (dateValue) {
            const formattedDate = formatDate(dateValue);
            drawText(ctx, formattedDate,
                getVal("fixed-date-font", "Arial"),
                getVal("fixed-date-size", "14"),
                getChecked("fixed-date-bold", false),
                getChecked("fixed-date-italic", false),
                getVal("fixed-date-color", "#FFFFFF"),
                canvas.width / 2, yPosDate);
        }
        if (latValue && lonValue) {
            const formattedCoords = formatCoordinates(latValue, lonValue);
            drawText(ctx, formattedCoords,
                getVal("fixed-coords-font", "Arial"),
                getVal("fixed-coords-size", "14"),
                getChecked("fixed-coords-bold", false),
                getChecked("fixed-coords-italic", false),
                getVal("fixed-coords-color", "#FFFFFF"),
                canvas.width / 2, yPosCoords);
        }

        // Text Layer 3
        if (textLayersData[2]) {
            drawText(ctx, textLayersData[2].text, textLayersData[2].fontFamily, textLayersData[2].fontSize, textLayersData[2].isBold, textLayersData[2].isItalic, textLayersData[2].fontColor, canvas.width / 2, yPos3);
        }

        canvas.setAttribute('data-generated', 'true');
        // Still keep download disabled for now
        // validateInputs();

        console.log("Star map with text generated successfully.");

    } catch (error) {
        console.error("Error during star map generation (Phase 1):", error);
        alert("Error generating star map: " + error.message + (error.stack ? `\n${error.stack}`: ''));
         const canvas = document.getElementById("star-map-canvas");
         if(canvas) canvas.setAttribute('data-generated', 'false');
         // validateInputs();
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
}

// --- Minimal Star Drawing (Standard) ---
function drawStandardStars(ctx, width, height) {
    const numStars = 2000;
    const radiusMultiplier = 1.0;
    try {
        for (let i = 0; i < numStars; i++) {
            const x = Math.random() * width; const y = Math.random() * height;
            const radius = (Math.random() * 1.5) * radiusMultiplier; const opacity = Math.random();
            ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`; ctx.fill();
        }
        const numBrightStars = Math.floor(numStars / 20);
        for (let i = 0; i < numBrightStars; i++) {
            const x = Math.random() * width; const y = Math.random() * height;
            const radius = (1 + Math.random() * 2) * radiusMultiplier;
            ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; ctx.fill();
        }
    } catch (drawError) { console.error("Error within drawStandardStars:", drawError); }
}

// --- Helper Functions (Copied from utils.js) ---
function drawText(ctx, text, fontFamily, fontSize, isBold, isItalic, color, x, y) {
    if (!text || !ctx) return;
    ctx.save();
    let fontStyle = "";
    if (isBold) fontStyle += "bold ";
    if (isItalic) fontStyle += "italic ";
    const sizeNum = parseInt(fontSize) || 14;
    const sizeWithUnit = `${sizeNum}px`;
    const safeFontFamily = fontFamily.includes(' ') ? `"${fontFamily}"` : fontFamily;
    ctx.font = `${fontStyle}${sizeWithUnit} ${safeFontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
    ctx.restore();
}

function formatDate(dateString) {
    if (!dateString) return "";
    try {
        const date = new Date(dateString + 'T00:00:00Z');
        if (isNaN(date.getTime())) return "Invalid Date";
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = weekdays[date.getUTCDate()];
        const dayOfMonth = date.getUTCDate();
        let daySuffix = 'th';
        if (dayOfMonth % 10 === 1 && dayOfMonth !== 11) daySuffix = 'st';
        else if (dayOfMonth % 10 === 2 && dayOfMonth !== 12) daySuffix = 'nd';
        else if (dayOfMonth % 10 === 3 && dayOfMonth !== 13) daySuffix = 'rd';
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const month = months[date.getUTCMonth()];
        const year = date.getUTCFullYear();
        return `${dayOfWeek}, ${dayOfMonth}${daySuffix} ${month}, ${year}`;
    } catch (e) { return dateString; }
}

function formatCoordinates(latValue, lngValue) {
     if (latValue === null || lngValue === null || latValue === undefined || lngValue === undefined) return "";
    try {
        let lat = parseFloat(latValue); let lng = parseFloat(lngValue);
        if (isNaN(lat) || isNaN(lng)) return "";
        const latDeg = Math.floor(Math.abs(lat)); const latMin = (Math.abs(lat) - latDeg) * 60; const latDir = lat >= 0 ? 'N' : 'S';
        const lngDeg = Math.floor(Math.abs(lng)); const lngMin = (Math.abs(lng) - lngDeg) * 60; const lngDir = lng >= 0 ? 'E' : 'W';
        const latMinFormatted = latMin.toFixed(5); const lngMinFormatted = lngMin.toFixed(5);
        const [latWholeMin, latDecMin] = latMinFormatted.split('.'); const [lngWholeMin, lngDecMin] = lngMinFormatted.split('.');
        const safeLatDecMin = latDecMin || '00000'; const safeLngDecMin = lngDecMin || '00000';
        return `${latDir}${latDeg}° ${latWholeMin || '0'}′.${safeLatDecMin}    ${lngDir}${lngDeg}° ${lngWholeMin || '0'}′.${safeLngDecMin}`;
    } catch (e) { return `${latValue}, ${lngValue}`; }
}

// --- Text Input History Functions (Copied from history.js) ---
function saveTextInput(inputId, value) {
    if (!value || !value.trim()) return;
    let history = JSON.parse(localStorage.getItem(`${inputId}_history`) || '[]');
    history = history.filter(item => item !== value);
    history.unshift(value);
    if (history.length > 20) history = history.slice(0, 20);
    localStorage.setItem(`${inputId}_history`, JSON.stringify(history));
    updateDatalist(inputId);
}

function loadSavedTextInputs() {
    const textInputIds = ['text-entry-1', 'text-entry-2', 'text-entry-3'];
    textInputIds.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (!input) return;
        const history = JSON.parse(localStorage.getItem(`${inputId}_history`) || '[]');
        if (history.length > 0) {
            input.value = history[0];
            const countId = `char-count-${inputId.split('-')[2]}`;
            const charCount = document.getElementById(countId);
             if (charCount) {
                 const maxLength = input.maxLength || 50;
                 charCount.textContent = maxLength - input.value.length;
             }
        }
        updateDatalist(inputId);
    });
}

function setupTextInputHistory() {
    const textInputIds = ['text-entry-1', 'text-entry-2', 'text-entry-3'];
    textInputIds.forEach(inputId => {
        const input = document.getElementById(inputId);
        const charCount = document.getElementById(`char-count-${inputId.split('-')[2]}`);
        if (!input) return;

        const datalistId = `${inputId}-history`;
        let datalist = document.getElementById(datalistId);
        if (!datalist) {
            datalist = document.createElement('datalist');
            datalist.id = datalistId;
            const form = document.getElementById('customizationForm') || document.body;
            form.appendChild(datalist);
            input.setAttribute('list', datalistId);
        }

        input.addEventListener('change', function() { saveTextInput(inputId, this.value); });
        input.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); saveTextInput(inputId, this.value); } });
        if (charCount) {
            input.addEventListener('input', function() {
                 const maxLength = input.maxLength || 50;
                charCount.textContent = maxLength - this.value.length;
            });
             const maxLength = input.maxLength || 50;
             charCount.textContent = maxLength - input.value.length;
        }
    });
    loadSavedTextInputs();
    console.log("Text input history setup complete.");
}

function updateDatalist(inputId) {
    const datalist = document.getElementById(`${inputId}-history`);
    if (!datalist) return;
    const history = JSON.parse(localStorage.getItem(`${inputId}_history`) || '[]');
    datalist.innerHTML = '';
    history.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        datalist.appendChild(option);
    });
}

console.log("app_v1.js loaded");
