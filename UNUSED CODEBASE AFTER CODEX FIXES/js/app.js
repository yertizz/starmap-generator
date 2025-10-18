// Consolidated Star Map Generator JavaScript - app.js

// --- Global Variables ---
let starFieldColor = "#000000"; // Black for star field
let outsideColor = "#0a0e1a"; // Dark blue for outside area
let aspectRatio = 1.25; // Default aspect ratio (height/width)
let currentStarMapStyle = "standard"; // Default star map style

const advancedStyleOptions = {
    milkyWay: false,
    constellationBounds: false,
    starsGlow: false,
    starSize: 1.0,
    starNumber: 2000,
    constellationLineWidth: 1.0,
    moon: false,
    sun: false,
    planets: false,
    eclipticPath: false,
    celestialBodySize: 1.0,
    sunShape: 'circle',
    planetShape: 'circle',
    planetLabels: false,
    constellationLabels: false,
    starLabels: false,
    labelFont: 'Arial',
    labelFontSize: 12,
    labelStrokeWidth: 0.5
};
window.advancedStyleOptions = advancedStyleOptions; // Make accessible globally if needed

// --- Initialization ---
document.addEventListener('DOMContentLoaded', function() {
    console.log("Star Map Generator App Initializing...");

    // --- Get Core Elements ---
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const canvas = document.getElementById('star-map-canvas');
    const backgroundColorInput = document.getElementById('star-field-color');
    const outsideColorInput = document.getElementById('outside-color');
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomValue = document.getElementById('zoom-value');
    const loadingIndicator = document.getElementById('loading-indicator');
    const starMapStyleSelect = document.getElementById('star-map-style');
    const occasionSelect = document.getElementById('occasion');
    const dateInput = document.getElementById('date');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const zipCodeInput = document.getElementById('zip-code');
    const maintainAspectRatioCheckbox = document.getElementById('maintain-aspect-ratio');
    const outputWidthInput = document.getElementById('output-width');
    const outputHeightInput = document.getElementById('output-height');

    // --- Event Listeners Setup ---

    // Generate Button
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            console.log("Generate button clicked");
            if (!generateBtn.hasAttribute('disabled')) {
                saveCurrentSettings(); // Save settings before generating
                generateStarMap();
            } else {
                 console.log("Generate button is disabled.");
            }
        });
    } else {
        console.error("Generate button not found!");
    }

    // Download Button
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            console.log("Download button clicked");
             if (!downloadBtn.hasAttribute('disabled')) {
                downloadStarMap();
             } else {
                 console.log("Download button is disabled.");
             }
        });
    } else {
         console.error("Download button not found!");
    }

    // Input Validation Listener (for enabling/disabling buttons)
    const inputsToValidate = [occasionSelect, dateInput, latitudeInput, longitudeInput, zipCodeInput];
    inputsToValidate.forEach(input => {
        if (input) {
            input.addEventListener('change', validateInputs);
            input.addEventListener('input', validateInputs); // Also validate on input for text fields
        }
    });
     // Special handling for custom occasion
    if (occasionSelect) {
        occasionSelect.addEventListener('change', handleOccasionChange);
    }


    // Text Entry Character Count & History
    setupTextInputHistory(); // Includes char count listeners

    // ZIP Code History
    setupZipCodeHistory(); // Includes event listeners for zip input

    // Image Format (Transparency Checkbox)
    document.querySelectorAll('input[name="imageType"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            const transparencyCheckbox = document.getElementById('export-transparency');
            if (transparencyCheckbox) {
                transparencyCheckbox.disabled = this.value !== 'png';
                if (this.value !== 'png') {
                    transparencyCheckbox.checked = false;
                }
                 // Add/remove disabled class for styling
                const labelContainer = transparencyCheckbox.closest('td') || transparencyCheckbox.parentElement;
                 if (labelContainer) {
                    if (transparencyCheckbox.disabled) {
                        labelContainer.classList.add('disabled');
                    } else {
                        labelContainer.classList.remove('disabled');
                    }
                 }
            }
        });
    });
     // Initial check for transparency disable state
     const initialImageType = document.querySelector('input[name="imageType"]:checked');
     if (initialImageType && initialImageType.value !== 'png') {
         const transparencyCheckbox = document.getElementById('export-transparency');
         if (transparencyCheckbox) {
             transparencyCheckbox.disabled = true;
             const labelContainer = transparencyCheckbox.closest('td') || transparencyCheckbox.parentElement;
             if (labelContainer) labelContainer.classList.add('disabled');
         }
     }


    // Star Map Style Select
    if (starMapStyleSelect) {
        starMapStyleSelect.addEventListener('change', function() {
            currentStarMapStyle = this.value;
            console.log(`Star map style changed to: ${currentStarMapStyle}`);
            // Regenerate only if map exists (canvas has data)
             const canvasCheck = document.getElementById('star-map-canvas');
             if (canvasCheck && canvasCheck.width > 0 && canvasCheck.height > 0 && canvasCheck.getAttribute('data-generated') === 'true') {
                 generateStarMap();
             }
        });
    }

    // Aspect Ratio
    if (maintainAspectRatioCheckbox && outputWidthInput && outputHeightInput) {
        let currentAspectRatio = parseFloat(outputWidthInput.value) / parseFloat(outputHeightInput.value);

        maintainAspectRatioCheckbox.addEventListener('change', function() {
            if (this.checked) {
                currentAspectRatio = parseFloat(outputWidthInput.value) / parseFloat(outputHeightInput.value);
                console.log(`Aspect ratio locked: ${currentAspectRatio}`);
            } else {
                 console.log("Aspect ratio unlocked");
            }
            handleAspectRatio(); // Apply initial state
        });

        outputWidthInput.addEventListener('input', function() { // Use input for responsiveness
            if (maintainAspectRatioCheckbox.checked && currentAspectRatio) {
                const newHeight = Math.round(parseFloat(this.value) / currentAspectRatio);
                 if (!isNaN(newHeight) && newHeight > 0) {
                    outputHeightInput.value = newHeight;
                 }
            }
        });

        outputHeightInput.addEventListener('input', function() { // Use input for responsiveness
            if (maintainAspectRatioCheckbox.checked && currentAspectRatio) {
                 const newWidth = Math.round(parseFloat(this.value) * currentAspectRatio);
                 if (!isNaN(newWidth) && newWidth > 0) {
                    outputWidthInput.value = newWidth;
                 }
            }
        });
    }

    // Zoom Slider
    if (zoomSlider && zoomValue && canvas) {
        zoomSlider.addEventListener('input', function() {
            const zoom = parseInt(this.value);
            zoomValue.textContent = zoom;
            canvas.style.transform = `scale(${zoom / 100})`;
            canvas.style.transformOrigin = "center top";
        });
         // Apply initial zoom
         const initialZoom = parseInt(zoomSlider.value);
         zoomValue.textContent = initialZoom;
         canvas.style.transform = `scale(${initialZoom / 100})`;
         canvas.style.transformOrigin = "center top";
    }

    // Icon Buttons (Map Marker Style) - Basic active state handling
    document.querySelectorAll('.icon-button').forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.icon-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // Note: Actual marker change logic is likely within map.js (initMap)
        });
    });

    // --- Advanced Options UI & Logic ---
    createAdvancedOptionsUI(); // Create the panel
    setupAdvancedOptionsEventListeners(); // Setup its listeners
    loadAdvancedOptions(); // Load saved advanced options

    // --- Settings Management ---
    addLoadSettingsButton();
    addSaveSettingsButton(); // Add the save button

    // --- Initial Load ---
    loadCustomOccasions(); // Load custom occasions first
    loadSavedSettings(); // Load general settings
    validateInputs(); // Initial validation check for button states

    // --- Color Picker Fix ---
    initializeHexColorPickers();

    // --- Auto-Generate Initial Map ---
    // Removed auto-generation on load to prevent errors before user interaction
    // setTimeout(function() {
    //     console.log("Auto-generating initial star map");
    //     if (!generateBtn.hasAttribute('disabled')) { // Only generate if valid
    //         generateStarMap();
    //     }
    // }, 1500);

    console.log("Star Map Generator App Initialized Successfully.");
});

// --- Input Validation ---
function validateInputs() {
    const occasionSelect = document.getElementById("occasion");
    const dateInput = document.getElementById("date");
    const latitudeInput = document.getElementById("latitude");
    const longitudeInput = document.getElementById("longitude");
    const generateBtn = document.getElementById("generateBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    let occasionValue = occasionSelect ? occasionSelect.value : null;
    // Handle custom occasion selection
    if (occasionValue === 'custom') {
        occasionValue = occasionSelect.getAttribute('data-custom-value') || '';
    }

    const dateValue = dateInput ? dateInput.value : null;
    const latitudeValue = latitudeInput ? latitudeInput.value.trim() : null;
    const longitudeValue = longitudeInput ? longitudeInput.value.trim() : null;

    const isMapDataValid = latitudeValue && longitudeValue && !isNaN(parseFloat(latitudeValue)) && !isNaN(parseFloat(longitudeValue));
    const isInputValid = occasionValue && dateValue && isMapDataValid;

    // console.log("Validation Check:", { occasionValue, dateValue, latitudeValue, longitudeValue, isInputValid });

    if (generateBtn) {
        if (isInputValid) {
            generateBtn.removeAttribute("disabled");
            generateBtn.classList.add("enabled");
            // console.log("Generate button enabled.");
        } else {
            generateBtn.setAttribute("disabled", "true");
            generateBtn.classList.remove("enabled");
            // console.log("Generate button disabled.");
        }
    }

    // Download button is enabled only after a map has been successfully generated
    const canvas = document.getElementById("star-map-canvas");
    let mapGenerated = false;
    try {
        // Check if canvas has been drawn on (simple check)
        if (canvas && canvas.width > 0 && canvas.height > 0) {
             // A more robust check might involve checking a flag set after successful generation
             mapGenerated = canvas.getAttribute('data-generated') === 'true';
        }
    } catch (e) {
        console.error("Error checking canvas state:", e);
    }

    if (downloadBtn) {
        if (mapGenerated) {
            downloadBtn.removeAttribute("disabled");
            downloadBtn.classList.add("enabled");
        } else {
            downloadBtn.setAttribute("disabled", "true");
            downloadBtn.classList.remove("enabled");
        }
    }
}

// --- History Management (Text & ZIP) ---

// Text Input History
function saveTextInput(inputId, value) {
    if (!value || !value.trim()) return;
    let history = JSON.parse(localStorage.getItem(`${inputId}_history`) || '[]');
    history = history.filter(item => item !== value);
    history.unshift(value);
    if (history.length > 20) history = history.slice(0, 20);
    localStorage.setItem(`${inputId}_history`, JSON.stringify(history));
    updateDatalist(inputId); // Update datalist after saving
}

function loadSavedTextInputs() {
    const textInputIds = ['text-entry-1', 'text-entry-2', 'text-entry-3'];
    textInputIds.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (!input) return;
        const history = JSON.parse(localStorage.getItem(`${inputId}_history`) || '[]');
        if (history.length > 0) {
            input.value = history[0]; // Load most recent
            const countId = `char-count-${inputId.split('-')[2]}`;
            const charCount = document.getElementById(countId);
            if (charCount) charCount.textContent = 50 - history[0].length;
        }
        updateDatalist(inputId); // Populate datalist on load
    });
}

function setupTextInputHistory() {
    const textInputIds = ['text-entry-1', 'text-entry-2', 'text-entry-3'];
    textInputIds.forEach(inputId => {
        const input = document.getElementById(inputId);
        const charCount = document.getElementById(`char-count-${inputId.split('-')[2]}`);
        if (!input) return;

        // Ensure datalist exists
        const datalistId = `${inputId}-history`;
        let datalist = document.getElementById(datalistId);
        if (!datalist) {
            datalist = document.createElement('datalist');
            datalist.id = datalistId;
            // Append inside the form or body, ensure it's accessible
            const form = document.getElementById('customizationForm') || document.body;
            form.appendChild(datalist);
            input.setAttribute('list', datalistId);
        }

        // Event listeners
        input.addEventListener('change', function() {
            saveTextInput(inputId, this.value);
        });
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveTextInput(inputId, this.value);
            }
        });
        if (charCount) {
            input.addEventListener('input', function() {
                const maxLength = input.maxLength || 50;
                charCount.textContent = maxLength - this.value.length;
            });
             // Initial count update
             const maxLength = input.maxLength || 50;
             charCount.textContent = maxLength - input.value.length;
        }
    });
    loadSavedTextInputs(); // Load history on setup
}

function updateDatalist(inputId) {
    const datalist = document.getElementById(`${inputId}-history`);
    if (!datalist) return;
    const history = JSON.parse(localStorage.getItem(`${inputId}_history`) || '[]');
    datalist.innerHTML = ''; // Clear existing options
    history.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        datalist.appendChild(option);
    });
}

// ZIP Code History
function saveZipCodeToHistory(zipCode) {
    if (!zipCode || !zipCode.trim()) return;
    let history = JSON.parse(localStorage.getItem('zipCodeHistory') || '[]');
    history = history.filter(item => item !== zipCode);
    history.unshift(zipCode);
    if (history.length > 20) history = history.slice(0, 20);
    localStorage.setItem('zipCodeHistory', JSON.stringify(history));
    updateZipCodeDropdown();
    console.log(`Saved ZIP code: ${zipCode}`);
}

function updateZipCodeDropdown() {
    const history = JSON.parse(localStorage.getItem('zipCodeHistory') || '[]');
    let datalist = document.getElementById('zip-code-history');
    const zipCodeInput = document.getElementById('zip-code');

    if (!datalist && zipCodeInput) {
        datalist = document.createElement('datalist');
        datalist.id = 'zip-code-history';
        // Append inside the form or body
        const form = document.getElementById('customizationForm') || document.body;
        form.appendChild(datalist);
        zipCodeInput.setAttribute('list', 'zip-code-history');
    }

    if (datalist) {
        datalist.innerHTML = '';
        history.forEach(zipCode => {
            const option = document.createElement('option');
            option.value = zipCode;
            datalist.appendChild(option);
        });
    }
    // Note: Removed custom visible dropdown/context menu logic for simplicity and stability
    // console.log(`Updated ZIP code datalist with ${history.length} items`);
}

function loadZipCodeHistory() {
    const history = JSON.parse(localStorage.getItem('zipCodeHistory') || '[]');
    updateZipCodeDropdown();
    const zipCodeInput = document.getElementById('zip-code');
    // Don't auto-fill zip code on load to avoid triggering unwanted map updates
    // if (zipCodeInput && history.length > 0 && !zipCodeInput.value.trim()) {
    //     zipCodeInput.value = history[0];
    // }
    console.log(`Loaded ZIP code history: ${history.length} items`);
}

function setupZipCodeHistory() {
    const zipCodeInput = document.getElementById('zip-code');
    if (!zipCodeInput) {
        console.error('ZIP code input not found');
        return;
    }
    console.log('Setting up ZIP code history');
    loadZipCodeHistory(); // Load and populate datalist

    // The actual saving should happen *after* successful geocoding in map.js/initMap
    // zipCodeInput.addEventListener('change', function() { ... });

    zipCodeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const zipValue = this.value.trim();
            if (zipValue) {
                // Trigger geocoding (assuming geocodeZip exists globally or via map.js)
                if (typeof geocodeZip === 'function') {
                    geocodeZip(zipValue); // geocodeZip should call saveZipCodeToHistory on success
                } else {
                     console.warn("geocodeZip function not found. Cannot geocode on Enter.");
                     // Maybe save directly? Or do nothing? Let's do nothing for now.
                     // saveZipCodeToHistory(zipValue);
                }
            }
        }
    });
     // Add focus listener to ensure datalist is populated
     zipCodeInput.addEventListener('focus', updateZipCodeDropdown);
}


// --- Settings Management ---
function saveCurrentSettings() {
    try {
        const occasionSelect = document.getElementById("occasion");
        const settings = {
            occasion: occasionSelect?.value || '',
            occasionText: occasionSelect?.options[occasionSelect.selectedIndex]?.text || "",
            customOccasion: occasionSelect?.getAttribute('data-custom-value') || '',
            date: document.getElementById("date")?.value || '',
            latitude: document.getElementById("latitude")?.value || '',
            longitude: document.getElementById("longitude")?.value || '',
            zipCode: document.getElementById("zip-code")?.value || '', // Save zip code too

            textLayers: [], // Populated below

            fixedDateFont: document.getElementById("fixed-date-font")?.value || 'Arial',
            fixedDateSize: document.getElementById("fixed-date-size")?.value || '14',
            fixedDateBold: document.getElementById("fixed-date-bold")?.checked || false,
            fixedDateItalic: document.getElementById("fixed-date-italic")?.checked || false,
            fixedDateColor: document.getElementById("fixed-date-color")?.value || '#FFFFFF',

            fixedCoordsFont: document.getElementById("fixed-coords-font")?.value || 'Arial',
            fixedCoordsSize: document.getElementById("fixed-coords-size")?.value || '14',
            fixedCoordsBold: document.getElementById("fixed-coords-bold")?.checked || false,
            fixedCoordsItalic: document.getElementById("fixed-coords-italic")?.checked || false,
            fixedCoordsColor: document.getElementById("fixed-coords-color")?.value || '#FFFFFF',

            dpi: document.querySelector('input[name="dpi"]:checked')?.value || "150",
            outputWidth: document.getElementById("output-width")?.value || '800',
            outputHeight: document.getElementById("output-height")?.value || '1000',
            maintainAspectRatio: document.getElementById("maintain-aspect-ratio")?.checked || false,

            starFieldColor: document.getElementById("star-field-color")?.value || '#000000',
            outsideColor: document.getElementById("outside-color")?.value || '#0a0e1a',

            imageType: document.querySelector('input[name="imageType"]:checked')?.value || "png",
            exportTransparency: document.getElementById("export-transparency")?.checked || false,

            starMapStyle: document.getElementById("star-map-style")?.value || 'standard',

            zoomLevel: document.getElementById("zoom-slider")?.value || '100',

            // Save advanced options as well
            advancedOptions: { ...advancedStyleOptions }, // Copy current advanced options

            timestamp: new Date().getTime()
        };

        // Save text layers
        for (let i = 1; i <= 3; i++) {
            const textInput = document.getElementById(`text-entry-${i}`);
            if (textInput && textInput.value) {
                settings.textLayers.push({
                    text: textInput.value,
                    fontFamily: document.getElementById(`font-family-${i}`)?.value || 'Arial',
                    fontSize: document.getElementById(`font-size-${i}`)?.value || '16',
                    fontColor: document.getElementById(`font-color-${i}`)?.value || '#FFFFFF',
                    isBold: document.getElementById(`text-bold-${i}`)?.checked || false,
                    isItalic: document.getElementById(`text-italic-${i}`)?.checked || false
                });
            }
        }

        localStorage.setItem('lastMapSettings', JSON.stringify(settings));
        console.log("Settings saved:", settings);
        // Optionally provide user feedback
        // showTemporaryMessage("Settings Saved!");
    } catch (error) {
        console.error("Error saving settings:", error);
    }
}

function loadSavedSettings() {
    const savedSettings = localStorage.getItem('lastMapSettings');
    if (!savedSettings) {
        console.log("No saved settings found.");
        // Apply default dimensions if needed
        const outputWidthInput = document.getElementById("output-width");
        const outputHeightInput = document.getElementById("output-height");
        if (outputWidthInput && (!outputWidthInput.value || outputWidthInput.value === "800")) {
             outputWidthInput.value = "3540"; // Default large size
        }
        if (outputHeightInput && (!outputHeightInput.value || outputHeightInput.value === "1000")) {
             outputHeightInput.value = "3186"; // Default large size
        }
        return false;
    }

    try {
        const settings = JSON.parse(savedSettings);
        console.log("Loading saved settings:", settings);

        // --- Apply Form Values ---
        const occasionSelect = document.getElementById("occasion");
        if (occasionSelect && settings.occasion) {
             // Handle custom occasions (assuming addCustomOccasionOption exists)
             if (settings.customOccasion && settings.occasion.startsWith('custom_')) {
                 if (typeof addCustomOccasionOption === 'function') {
                    addCustomOccasionOption(settings.customOccasion, settings.occasion, false); // Add without saving again
                 }
                 occasionSelect.value = settings.occasion;
                 occasionSelect.setAttribute('data-custom-value', settings.customOccasion);
             } else {
                 occasionSelect.value = settings.occasion;
             }
             // Store previous value for change detection
             occasionSelect.setAttribute('data-previous-value', occasionSelect.value);
        }

        if (settings.date && document.getElementById("date")) document.getElementById("date").value = settings.date;
        if (settings.latitude && document.getElementById("latitude")) document.getElementById("latitude").value = settings.latitude;
        if (settings.longitude && document.getElementById("longitude")) document.getElementById("longitude").value = settings.longitude;
        if (settings.zipCode && document.getElementById("zip-code")) document.getElementById("zip-code").value = settings.zipCode;

        // --- Apply Text Layers ---
        if (settings.textLayers) {
            for (let i = 1; i <= 3; i++) {
                const layer = settings.textLayers[i - 1];
                const textInput = document.getElementById(`text-entry-${i}`);
                if (textInput) {
                    textInput.value = layer ? layer.text : '';
                    if(document.getElementById(`font-family-${i}`)) document.getElementById(`font-family-${i}`).value = layer?.fontFamily || 'Arial';
                    if(document.getElementById(`font-size-${i}`)) document.getElementById(`font-size-${i}`).value = layer?.fontSize || (i === 1 ? '48' : (i === 2 ? '16' : '14'));
                    if(document.getElementById(`font-color-${i}`)) document.getElementById(`font-color-${i}`).value = layer?.fontColor || '#FFFFFF';
                    if(document.getElementById(`text-bold-${i}`)) document.getElementById(`text-bold-${i}`).checked = layer?.isBold || false;
                    if(document.getElementById(`text-italic-${i}`)) document.getElementById(`text-italic-${i}`).checked = layer?.isItalic || false;

                    // Update char count
                    const countId = `char-count-${i}`;
                    const charCount = document.getElementById(countId);
                    if (charCount) {
                         const maxLength = textInput.maxLength || 50;
                         charCount.textContent = maxLength - textInput.value.length;
                    }
                }
            }
        }

        // --- Apply Fixed Text Styling ---
        // Ensure elements exist before setting values
        const fixedDateFont = document.getElementById("fixed-date-font");
        const fixedDateSize = document.getElementById("fixed-date-size");
        const fixedDateBold = document.getElementById("fixed-date-bold");
        const fixedDateItalic = document.getElementById("fixed-date-italic");
        const fixedDateColor = document.getElementById("fixed-date-color");
        const fixedCoordsFont = document.getElementById("fixed-coords-font");
        const fixedCoordsSize = document.getElementById("fixed-coords-size");
        const fixedCoordsBold = document.getElementById("fixed-coords-bold");
        const fixedCoordsItalic = document.getElementById("fixed-coords-italic");
        const fixedCoordsColor = document.getElementById("fixed-coords-color");

        if (fixedDateFont && settings.fixedDateFont) fixedDateFont.value = settings.fixedDateFont;
        if (fixedDateSize && settings.fixedDateSize) fixedDateSize.value = settings.fixedDateSize;
        if (fixedDateBold && settings.fixedDateBold !== undefined) fixedDateBold.checked = settings.fixedDateBold;
        if (fixedDateItalic && settings.fixedDateItalic !== undefined) fixedDateItalic.checked = settings.fixedDateItalic;
        if (fixedDateColor && settings.fixedDateColor) fixedDateColor.value = settings.fixedDateColor;

        if (fixedCoordsFont && settings.fixedCoordsFont) fixedCoordsFont.value = settings.fixedCoordsFont;
        if (fixedCoordsSize && settings.fixedCoordsSize) fixedCoordsSize.value = settings.fixedCoordsSize;
        if (fixedCoordsBold && settings.fixedCoordsBold !== undefined) fixedCoordsBold.checked = settings.fixedCoordsBold;
        if (fixedCoordsItalic && settings.fixedCoordsItalic !== undefined) fixedCoordsItalic.checked = settings.fixedCoordsItalic;
        if (fixedCoordsColor && settings.fixedCoordsColor) fixedCoordsColor.value = settings.fixedCoordsColor;


        // --- Apply Output Settings ---
        if (settings.dpi) {
            const dpiRadio = document.querySelector(`input[name="dpi"][value="${settings.dpi}"]`);
            if (dpiRadio) dpiRadio.checked = true;
        }
        const outputWidthInput = document.getElementById("output-width");
        const outputHeightInput = document.getElementById("output-height");
        const maintainAspectRatioCheckbox = document.getElementById("maintain-aspect-ratio");

        if (outputWidthInput && settings.outputWidth) outputWidthInput.value = settings.outputWidth;
        if (outputHeightInput && settings.outputHeight) outputHeightInput.value = settings.outputHeight;
        if (maintainAspectRatioCheckbox && settings.maintainAspectRatio !== undefined) {
            maintainAspectRatioCheckbox.checked = settings.maintainAspectRatio;
            handleAspectRatio(); // Update aspect ratio handling if needed
        }

        // --- Apply Background Colors ---
        const starFieldColorInput = document.getElementById("star-field-color");
        const outsideColorInput = document.getElementById("outside-color");
        if (starFieldColorInput && settings.starFieldColor) {
            starFieldColorInput.value = settings.starFieldColor;
            starFieldColor = settings.starFieldColor; // Update global variable
            // Update picker visual if using vanilla-picker
             if (starFieldColorInput._picker) starFieldColorInput._picker.setColor(settings.starFieldColor, true);
             else starFieldColorInput.style.backgroundColor = settings.starFieldColor; // Fallback
        }
        if (outsideColorInput && settings.outsideColor) {
            outsideColorInput.value = settings.outsideColor;
            outsideColor = settings.outsideColor; // Update global variable
             if (outsideColorInput._picker) outsideColorInput._picker.setColor(settings.outsideColor, true);
             else outsideColorInput.style.backgroundColor = settings.outsideColor; // Fallback
        }

        // --- Apply Image Format ---
        if (settings.imageType) {
            const imageTypeRadio = document.querySelector(`input[name="imageType"][value="${settings.imageType}"]`);
            if (imageTypeRadio) imageTypeRadio.checked = true;
        }
        const exportTransparencyCheckbox = document.getElementById("export-transparency");
        if (exportTransparencyCheckbox && settings.exportTransparency !== undefined) {
            exportTransparencyCheckbox.checked = settings.exportTransparency;
            // Update disabled state based on loaded image type
            const currentImageType = document.querySelector('input[name="imageType"]:checked')?.value;
            exportTransparencyCheckbox.disabled = currentImageType !== 'png';
             const labelContainer = exportTransparencyCheckbox.closest('td') || exportTransparencyCheckbox.parentElement;
             if (labelContainer) {
                if (exportTransparencyCheckbox.disabled) labelContainer.classList.add('disabled');
                else labelContainer.classList.remove('disabled');
             }
        }

         // --- Apply Star Map Style ---
         const starMapStyleSelect = document.getElementById("star-map-style");
         if (starMapStyleSelect && settings.starMapStyle) {
             starMapStyleSelect.value = settings.starMapStyle;
             currentStarMapStyle = settings.starMapStyle; // Update global variable
         }


        // --- Apply Zoom Level ---
        const zoomSlider = document.getElementById("zoom-slider");
        const zoomValue = document.getElementById("zoom-value");
        const canvas = document.getElementById("star-map-canvas");
        if (zoomSlider && zoomValue && canvas && settings.zoomLevel) {
            zoomSlider.value = settings.zoomLevel;
            zoomValue.textContent = settings.zoomLevel;
            const scale = settings.zoomLevel / 100;
            canvas.style.transform = `scale(${scale})`;
            canvas.style.transformOrigin = "center top";
        }

        // --- Apply Advanced Options ---
        if (settings.advancedOptions) {
            Object.assign(advancedStyleOptions, settings.advancedOptions); // Update global object
            // Update the UI elements in the advanced panel
            loadAdvancedOptionsUI(settings.advancedOptions); // Separate function to update UI
        }


        console.log("Settings applied successfully.");
        validateInputs(); // Re-validate inputs after loading
        return true;

    } catch (error) {
        console.error("Error loading saved settings:", error);
        localStorage.removeItem('lastMapSettings'); // Clear corrupted settings
        return false;
    }
}

function addLoadSettingsButton() {
    const buttonContainer = document.querySelector('.button-container'); // Target the PREVIEW button container
    if (!buttonContainer || document.getElementById('loadSettingsBtn')) return;

    const loadBtn = document.createElement('button');
    loadBtn.id = 'loadSettingsBtn';
    loadBtn.type = 'button';
    loadBtn.textContent = 'LOAD SETTINGS';
    loadBtn.className = 'settings-button load-button'; // Add classes for styling

    loadBtn.addEventListener('click', function(event) {
        event.preventDefault();
        if (confirm("Load previously saved settings? This will overwrite current selections.")) {
            if(loadSavedSettings()) {
                 // Optionally regenerate map after loading
                 // generateStarMap();
                 showTemporaryMessage("Settings Loaded!");
            } else {
                 alert("Could not load settings.");
            }
        }
    });

    // Insert before the PREVIEW button
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        buttonContainer.insertBefore(loadBtn, generateBtn);
        // Adjust container style if needed (already done in DOMContentLoaded)
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '10px';
    }
}

function addSaveSettingsButton() {
    const buttonContainer = document.querySelector('.button-container'); // Target the PREVIEW button container
     if (!buttonContainer || document.getElementById('saveSettingsBtn')) return;

    const saveBtn = document.createElement('button');
    saveBtn.id = 'saveSettingsBtn';
    saveBtn.type = 'button';
    saveBtn.textContent = 'SAVE SETTINGS';
    saveBtn.className = 'settings-button save-button'; // Add classes for styling

    saveBtn.addEventListener('click', function(event) {
        event.preventDefault();
        saveCurrentSettings();
        showTemporaryMessage("Settings Saved!");
    });

    // Insert before the PREVIEW button (or after LOAD button if it exists)
    const loadBtn = document.getElementById('loadSettingsBtn');
    const generateBtn = document.getElementById('generateBtn');
    if (loadBtn) {
        loadBtn.insertAdjacentElement('afterend', saveBtn);
    } else if (generateBtn) {
         buttonContainer.insertBefore(saveBtn, generateBtn);
    }
     // Adjust container style if needed
     buttonContainer.style.display = 'flex';
     buttonContainer.style.justifyContent = 'center';
     buttonContainer.style.gap = '10px';
}

// Helper to show temporary messages
function showTemporaryMessage(message, duration = 2000) {
    let messageDiv = document.getElementById('temp-message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'temp-message';
        messageDiv.style.position = 'fixed';
        messageDiv.style.bottom = '20px';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translateX(-50%)';
        messageDiv.style.padding = '10px 20px';
        messageDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        messageDiv.style.color = 'white';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.zIndex = '1001';
        messageDiv.style.opacity = '0';
        messageDiv.style.transition = 'opacity 0.5s ease-in-out';
        document.body.appendChild(messageDiv);
    }
    messageDiv.textContent = message;
    messageDiv.style.opacity = '1';
    setTimeout(() => {
        if (messageDiv) { // Check if element still exists
            messageDiv.style.opacity = '0';
            // Optional: remove element after fade out
            setTimeout(() => { if (messageDiv) messageDiv.remove(); }, 500);
        }
    }, duration);
}

// --- Aspect Ratio Handling ---
function handleAspectRatio() {
    const maintainAspectRatioCheckbox = document.getElementById("maintain-aspect-ratio");
    const outputWidthInput = document.getElementById("output-width");
    const outputHeightInput = document.getElementById("output-height");

    if (maintainAspectRatioCheckbox && outputWidthInput && outputHeightInput) {
        if (maintainAspectRatioCheckbox.checked) {
            // Lock aspect ratio based on current values when checked
            const widthVal = parseFloat(outputWidthInput.value);
            const heightVal = parseFloat(outputHeightInput.value);
            if (!isNaN(widthVal) && !isNaN(heightVal) && heightVal !== 0) {
                aspectRatio = widthVal / heightVal;
                console.log(`Aspect ratio locked: ${aspectRatio}`);
            } else {
                console.warn("Cannot lock aspect ratio with invalid dimensions.");
                maintainAspectRatioCheckbox.checked = false; // Uncheck if invalid
            }
        } else {
             console.log("Aspect ratio unlocked");
        }
    }
}

// --- Custom Occasion Handling ---
function handleOccasionChange() {
    const occasionSelect = document.getElementById('occasion');
    if (!occasionSelect) return;
    if (occasionSelect.value === 'custom') {
        const customOccasion = prompt("Enter your custom occasion:", occasionSelect.getAttribute('data-custom-value') || '');
        if (customOccasion && customOccasion.trim()) {
            const trimmedOccasion = customOccasion.trim();
            addCustomOccasionOption(trimmedOccasion);
        } else {
            // Revert to previous selection if prompt is cancelled or empty
            occasionSelect.value = occasionSelect.getAttribute('data-previous-value') || '';
        }
    }
    // Store the current value as the previous one for potential revert
    occasionSelect.setAttribute('data-previous-value', occasionSelect.value);
    validateInputs(); // Re-validate after change
}

function addCustomOccasionOption(occasionText, optionValue = null, save = true) {
    const occasionSelect = document.getElementById('occasion');
    if (!occasionSelect) return;
    const customOptionValue = optionValue || 'custom_' + occasionText.replace(/\s+/g, '_').toLowerCase();

    // Check if this custom option already exists
    let existingOption = Array.from(occasionSelect.options).find(opt => opt.value === customOptionValue);

    if (!existingOption) {
        const newOption = document.createElement('option');
        newOption.value = customOptionValue;
        newOption.text = occasionText;
        newOption.className = 'custom-occasion'; // Mark as custom

        // Insert before the "Add Your Own..." option
        const customAddOption = occasionSelect.querySelector('option[value="custom"]');
        if (customAddOption) {
            occasionSelect.insertBefore(newOption, customAddOption);
        } else {
            occasionSelect.appendChild(newOption); // Fallback
        }
        existingOption = newOption;

        // Save custom occasions if the save flag is true
        if (save) {
            saveCustomOccasions();
        }
    }

    // Select the new/existing custom option
    occasionSelect.value = customOptionValue;
    // Store the text as a data attribute for saving settings
    occasionSelect.setAttribute('data-custom-value', occasionText);
}

function loadCustomOccasions() {
    const occasionSelect = document.getElementById('occasion');
    if (!occasionSelect) return;
    const savedOccasions = JSON.parse(localStorage.getItem('customOccasions') || '[]');
    const customAddOption = occasionSelect.querySelector('option[value="custom"]');

    savedOccasions.forEach(occasion => {
        // Check if option already exists (by text or value)
        const value = 'custom_' + occasion.replace(/\s+/g, '_').toLowerCase();
        if (!Array.from(occasionSelect.options).some(opt => opt.value === value || opt.text === occasion)) {
            const newOption = document.createElement('option');
            newOption.value = value;
            newOption.text = occasion;
            newOption.className = 'custom-occasion';
            if (customAddOption) {
                occasionSelect.insertBefore(newOption, customAddOption);
            } else {
                occasionSelect.appendChild(newOption);
            }
        }
    });
}

function saveCustomOccasions() {
    const occasionSelect = document.getElementById('occasion');
    if (!occasionSelect) return;
    const customOccasions = Array.from(occasionSelect.options)
                                .filter(opt => opt.className === 'custom-occasion')
                                .map(opt => opt.text);
    localStorage.setItem('customOccasions', JSON.stringify([...new Set(customOccasions)])); // Store unique
}

// Initialize custom occasions on load
// Moved inside the main DOMContentLoaded listener


// --- Star Map Generation Core ---
function generateStarMap() {
    console.log("generateStarMap called");
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) loadingIndicator.style.display = 'flex';

    // Use setTimeout to allow UI to update before potentially blocking operation
    setTimeout(() => {
        try {
            const canvas = document.getElementById("star-map-canvas");
            if (!canvas) throw new Error("Canvas element not found");
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Could not get canvas context");

            // Get dimensions and colors (ensure elements exist)
            const outputWidthInput = document.getElementById("output-width");
            const outputHeightInput = document.getElementById("output-height");
            const starFieldColorInput = document.getElementById("star-field-color");
            const outsideColorInput = document.getElementById("outside-color");

            if (!outputWidthInput || !outputHeightInput || !starFieldColorInput || !outsideColorInput) {
                throw new Error("Required dimension or color input elements are missing.");
            }

            const outputWidth = parseInt(outputWidthInput.value) || 800;
            const outputHeight = parseInt(outputHeightInput.value) || 1000;
            const starFieldColorValue = starFieldColorInput.value || "#000000";
            const outsideColorValue = outsideColorInput.value || "#0a0e1a";

            canvas.width = outputWidth;
            canvas.height = outputHeight;

            // Draw background
            ctx.fillStyle = outsideColorValue;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw star field area (adjust as needed, e.g., full canvas or portion)
            // Let's make it cover the whole canvas for now, styles can override
            ctx.fillStyle = starFieldColorValue;
            ctx.fillRect(0, 0, canvas.width, canvas.height); // Cover whole canvas initially

            // Draw stars using the selected style
            drawStars(ctx, canvas.width, canvas.height); // Pass canvas dimensions

            // --- Draw Text Layers ---
            const textLayersData = [];
             for (let i = 1; i <= 3; i++) {
                 const textInput = document.getElementById(`text-entry-${i}`);
                 if (textInput && textInput.value) {
                     textLayersData.push({
                         text: textInput.value,
                         fontFamily: document.getElementById(`font-family-${i}`)?.value || 'Arial',
                         fontSize: document.getElementById(`font-size-${i}`)?.value || '16',
                         fontColor: document.getElementById(`font-color-${i}`)?.value || '#FFFFFF',
                         isBold: document.getElementById(`text-bold-${i}`)?.checked || false,
                         isItalic: document.getElementById(`text-italic-${i}`)?.checked || false
                     });
                 } else {
                     textLayersData.push(null); // Placeholder if text is empty
                 }
             }

             // Define Y positions (adjust as needed)
             const yPos1 = canvas.height * 0.65;
             const yPos2 = canvas.height * 0.75;
             const yPos3 = canvas.height * 0.90; // Position for 3rd text
             const yPosDate = canvas.height * 0.82;
             const yPosCoords = canvas.height * 0.86;


             // Draw Text Layer 1 (Main Title)
             if (textLayersData[0]) {
                 drawText(ctx, textLayersData[0].text, textLayersData[0].fontFamily, textLayersData[0].fontSize, textLayersData[0].isBold, textLayersData[0].isItalic, textLayersData[0].fontColor, canvas.width / 2, yPos1);
             }
             // Draw Text Layer 2 (Subtitle)
             if (textLayersData[1]) {
                 drawText(ctx, textLayersData[1].text, textLayersData[1].fontFamily, textLayersData[1].fontSize, textLayersData[1].isBold, textLayersData[1].isItalic, textLayersData[1].fontColor, canvas.width / 2, yPos2);
             }

            // --- Draw Fixed Date and Coordinates ---
            const dateInput = document.getElementById("date");
            const latitudeInput = document.getElementById("latitude");
            const longitudeInput = document.getElementById("longitude");

            if (dateInput && dateInput.value) {
                const formattedDate = formatDate(dateInput.value); // Use corrected formatDate
                const dateFont = document.getElementById("fixed-date-font")?.value || "Arial";
                const dateFontSize = document.getElementById("fixed-date-size")?.value || "14";
                const dateBold = document.getElementById("fixed-date-bold")?.checked || false;
                const dateItalic = document.getElementById("fixed-date-italic")?.checked || false;
                const dateColor = document.getElementById("fixed-date-color")?.value || "#FFFFFF";
                drawText(ctx, formattedDate, dateFont, dateFontSize, dateBold, dateItalic, dateColor, canvas.width / 2, yPosDate);
            }

            if (latitudeInput && longitudeInput && latitudeInput.value && longitudeInput.value) {
                const formattedCoords = formatCoordinates(latitudeInput.value, longitudeInput.value); // Use corrected formatCoordinates
                const coordsFont = document.getElementById("fixed-coords-font")?.value || "Arial";
                const coordsFontSize = document.getElementById("fixed-coords-size")?.value || "14";
                const coordsBold = document.getElementById("fixed-coords-bold")?.checked || false;
                const coordsItalic = document.getElementById("fixed-coords-italic")?.checked || false;
                const coordsColor = document.getElementById("fixed-coords-color")?.value || "#FFFFFF";
                drawText(ctx, formattedCoords, coordsFont, coordsFontSize, coordsBold, coordsItalic, coordsColor, canvas.width / 2, yPosCoords);
            }

             // Draw Text Layer 3 (Additional Text) - Positioned last
             if (textLayersData[2]) {
                 drawText(ctx, textLayersData[2].text, textLayersData[2].fontFamily, textLayersData[2].fontSize, textLayersData[2].isBold, textLayersData[2].isItalic, textLayersData[2].fontColor, canvas.width / 2, yPos3);
             }


            // Mark canvas as generated and enable download button
            canvas.setAttribute('data-generated', 'true');
            validateInputs(); // Re-validate to enable download button

            console.log("Star map generated successfully.");

        } catch (error) {
            console.error("Error generating star map:", error);
            alert("Error generating star map: " + error.message + (error.lineNumber ? ` at line ${error.lineNumber}` : ''));
             // Ensure canvas state is reset if generation fails
             const canvas = document.getElementById("star-map-canvas");
             if(canvas) canvas.setAttribute('data-generated', 'false');
             validateInputs(); // Disable download button on error
        } finally {
            if (loadingIndicator) loadingIndicator.style.display = 'none'; // Hide loading indicator
        }
    }, 50); // Short delay for UI update
}

// --- Helper Functions (Text Drawing, Formatting) ---
function drawText(ctx, text, fontFamily, fontSize, isBold, isItalic, color, x, y) {
    if (!text) return;
    ctx.save();
    let fontStyle = "";
    if (isBold) fontStyle += "bold ";
    if (isItalic) fontStyle += "italic ";
    // Ensure font size includes 'px'
    const sizeWithUnit = String(fontSize).endsWith('px') ? fontSize : `${fontSize}px`;
    ctx.font = `${fontStyle}${sizeWithUnit} "${fontFamily}"`; // Use quotes for font family
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
    ctx.restore();
}

function formatDate(dateString) { // Renamed from formatDateForStarMap for clarity
    if (!dateString) return "";
    try {
        const date = new Date(dateString + 'T00:00:00'); // Ensure correct date parsing
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = weekdays[date.getUTCDate()]; // Use UTC day
        const dayOfMonth = date.getUTCDate(); // Use UTC date
        let daySuffix = 'th';
        if (dayOfMonth % 10 === 1 && dayOfMonth !== 11) daySuffix = 'st';
        else if (dayOfMonth % 10 === 2 && dayOfMonth !== 12) daySuffix = 'nd';
        else if (dayOfMonth % 10 === 3 && dayOfMonth !== 13) daySuffix = 'rd';
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const month = months[date.getUTCMonth()]; // Use UTC month
        const year = date.getUTCFullYear(); // Use UTC year
        return `${dayOfWeek}, ${dayOfMonth}${daySuffix} ${month}, ${year}`;
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString; // Fallback
    }
}

function formatCoordinates(latValue, lngValue) { // Renamed from formatCoordinatesForStarMap
     if (latValue === null || lngValue === null || latValue === undefined || lngValue === undefined) return "";
    try {
        let lat = parseFloat(latValue);
        let lng = parseFloat(lngValue);
        if (isNaN(lat) || isNaN(lng)) return "";

        const latDeg = Math.floor(Math.abs(lat));
        const latMin = (Math.abs(lat) - latDeg) * 60;
        const latDir = lat >= 0 ? 'N' : 'S';

        const lngDeg = Math.floor(Math.abs(lng));
        const lngMin = (Math.abs(lng) - lngDeg) * 60;
        const lngDir = lng >= 0 ? 'E' : 'W';

        // Format with 5 decimal places for minutes
        const latMinFormatted = latMin.toFixed(5);
        const lngMinFormatted = lngMin.toFixed(5);

        // Separate whole and decimal parts of minutes
        const [latWholeMin, latDecMin] = latMinFormatted.split('.');
        const [lngWholeMin, lngDecMin] = lngMinFormatted.split('.');

        return `${latDir}${latDeg}° ${latWholeMin}′.${latDecMin}    ${lngDir}${lngDeg}° ${lngWholeMin}′.${lngDecMin}`;
    } catch (e) {
        console.error("Error formatting coordinates:", e);
        return `${latValue}, ${lngValue}`; // Fallback
    }
}

// --- Star Drawing Styles (Copied from star-map-styles.js) ---
function drawStars(ctx, width, height) { // Removed density param for now, use advancedStyleOptions.starNumber
    const densityFactor = 2000 / (advancedStyleOptions.starNumber || 2000); // Adjust density based on number
    const density = 100 * densityFactor; // Base density adjusted

    console.log(`Drawing stars with style: ${currentStarMapStyle}, Number: ${advancedStyleOptions.starNumber}`);

    // Apply glow effect globally if enabled
    if (advancedStyleOptions.starsGlow) {
        ctx.shadowBlur = 5; // Adjust blur radius as needed
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)"; // White glow
    } else {
        ctx.shadowBlur = 0;
    }

    // Adjust star size globally
    const baseRadiusMultiplier = advancedStyleOptions.starSize || 1.0;

    // Clear background specific to star field area if needed (or draw over)
    // Assuming generateStarMap already drew the base background color
    // ctx.fillStyle = document.getElementById("star-field-color").value || "#000000";
    // ctx.fillRect(0, 0, width, height); // Draw starfield background color

    switch (currentStarMapStyle) {
        case "realistic":
            drawRealisticStars(ctx, width, height, density, baseRadiusMultiplier);
            break;
        case "constellation":
            drawConstellationStars(ctx, width, height, density, baseRadiusMultiplier);
            break;
        case "nebula":
            drawNebulaStars(ctx, width, height, density, baseRadiusMultiplier);
            break;
        case "galaxy":
            drawGalaxyStars(ctx, width, height, density, baseRadiusMultiplier);
            break;
        case "milky-way":
            drawMilkyWayStars(ctx, width, height, density, baseRadiusMultiplier);
            break;
        case "northern-lights":
            drawNorthernLightsStars(ctx, width, height, density, baseRadiusMultiplier);
            break;
        case "deep-space":
            drawDeepSpaceStars(ctx, width, height, density, baseRadiusMultiplier);
            break;
        case "vintage":
            drawVintageStars(ctx, width, height, density, baseRadiusMultiplier);
            break;
        case "minimalist":
            drawMinimalistStars(ctx, width, height, density, baseRadiusMultiplier);
            break;
        case "standard":
        default:
            drawStandardStars(ctx, width, height, density, baseRadiusMultiplier);
            break;
    }

     // Draw celestial bodies if enabled
     if (advancedStyleOptions.moon) drawMoon(ctx, width, height);
     if (advancedStyleOptions.sun) drawSun(ctx, width, height);
     if (advancedStyleOptions.planets) drawPlanets(ctx, width, height);
     if (advancedStyleOptions.eclipticPath) drawEclipticPath(ctx, width, height);


    // Reset shadow after drawing stars
    ctx.shadowBlur = 0;
}

function drawStandardStars(ctx, width, height, density, radiusMultiplier) {
    const numStars = advancedStyleOptions.starNumber || 2000; // Use number from options

    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height; // Draw across full canvas height
        const radius = (Math.random() * 1.5) * radiusMultiplier;
        const opacity = Math.random();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
    }
    const numBrightStars = Math.floor(numStars / 20);
    for (let i = 0; i < numBrightStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (1 + Math.random() * 2) * radiusMultiplier;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
    }
    drawConstellations(ctx, width, height); // Draw constellations on top
}

function drawRealisticStars(ctx, width, height, density, radiusMultiplier) {
    const starColors = ['#A9C1FF', '#CAD7FF', '#FFFFFF', '#FFF4EA', '#FFD2A1', '#FFCC6F', '#FFA07A']; // HEX for easier use
    const numStars = advancedStyleOptions.starNumber || 2000;

    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (Math.random() * 1.5) * radiusMultiplier;
        const colorIndex = Math.floor(Math.random() * starColors.length);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = starColors[colorIndex] + 'CC'; // Add alpha (e.g., CC for 80%)
        ctx.fill();
    }
    const numBrightStars = Math.floor(numStars / 20);
    for (let i = 0; i < numBrightStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (1 + Math.random() * 2) * radiusMultiplier;
        const colorIndex = Math.floor(Math.random() * starColors.length);
        // Optional: Add glow for bright stars if not globally enabled
        // ... (glow logic) ...
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = starColors[colorIndex]; // Brighter alpha
        ctx.fill();
    }
    drawConstellations(ctx, width, height);
}

function drawConstellationStars(ctx, width, height, density, radiusMultiplier) {
    // Draw fewer background stars
    const numStars = Math.floor((advancedStyleOptions.starNumber || 2000) / 1.5);
     for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (Math.random() * 1.2) * radiusMultiplier; // Slightly smaller background stars
        const opacity = Math.random() * 0.6; // Dimmer
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
    }
    // Draw constellations more prominently
    drawConstellations(ctx, width, height, true); // Pass flag for prominent drawing
}

function drawNebulaStars(ctx, width, height, density, radiusMultiplier) {
    // Draw Nebula Background (Simplified Perlin-like noise)
    const colors = ['#000000', '#4B0082', '#8A2BE2', '#0000FF', '#00BFFF', '#FF00FF', '#FF0000'];
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const noise = (Math.sin(x * 0.005 + y * 0.002) + Math.cos(x * 0.002 - y * 0.005) + 2) / 4; // Simple noise
            const colorIndex = Math.floor(noise * (colors.length - 1));
            const nextColorIndex = (colorIndex + 1) % colors.length;
            const mix = noise * (colors.length - 1) % 1;
            const r1 = parseInt(colors[colorIndex].slice(1, 3), 16);
            const g1 = parseInt(colors[colorIndex].slice(3, 5), 16);
            const b1 = parseInt(colors[colorIndex].slice(5, 7), 16);
            const r2 = parseInt(colors[nextColorIndex].slice(1, 3), 16);
            const g2 = parseInt(colors[nextColorIndex].slice(3, 5), 16);
            const b2 = parseInt(colors[nextColorIndex].slice(5, 7), 16);
            data[i] = r1 * (1 - mix) + r2 * mix;
            data[i + 1] = g1 * (1 - mix) + g2 * mix;
            data[i + 2] = b1 * (1 - mix) + b2 * mix;
            data[i + 3] = 150 + noise * 50; // Alpha
        }
    }
    ctx.putImageData(imageData, 0, 0);
    // Draw stars on top
    drawStandardStars(ctx, width, height, density / 1.5, radiusMultiplier); // More stars for nebula
}

function drawGalaxyStars(ctx, width, height, density, radiusMultiplier) {
    // Draw dark background
    ctx.fillStyle = '#000005';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
    const numArms = 4;
    const numStarsPerArm = Math.floor((advancedStyleOptions.starNumber || 2000) * 0.8 / numArms); // Most stars in arms

    // Draw galaxy arms
    for (let arm = 0; arm < numArms; arm++) {
        const armAngle = (arm * Math.PI * 2) / numArms;
        for (let i = 0; i < numStarsPerArm; i++) {
            const distance = Math.pow(Math.random(), 1.5) * maxRadius; // Concentrate stars towards center
            const angleSpread = (1 - distance / maxRadius) * 1.5; // More spread further out
            const angle = armAngle + (distance / maxRadius) * 2.5 + (Math.random() - 0.5) * angleSpread; // Spiral + randomness
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            if (x < 0 || x >= width || y < 0 || y >= height) continue;
            const brightness = 0.5 + Math.random() * 0.5;
            const size = (0.5 + Math.random() * 1.0) * radiusMultiplier;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 220, ${brightness})`; // Yellowish white
            ctx.fill();
        }
    }
    // Draw galaxy core
    const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 0.15);
    coreGradient.addColorStop(0, 'rgba(255, 255, 230, 0.9)');
    coreGradient.addColorStop(0.5, 'rgba(255, 255, 200, 0.5)');
    coreGradient.addColorStop(1, 'rgba(255, 220, 180, 0)');
    ctx.fillStyle = coreGradient;
    ctx.fillRect(centerX - maxRadius * 0.15, centerY - maxRadius * 0.15, maxRadius * 0.3, maxRadius * 0.3);

    // Background stars
    const numBgStars = Math.floor((advancedStyleOptions.starNumber || 2000) * 0.2);
     for (let i = 0; i < numBgStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (Math.random() * 0.8) * radiusMultiplier;
        const opacity = Math.random() * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${opacity})`; // Faint blueish
        ctx.fill();
    }
     drawConstellations(ctx, width, height); // Draw faint constellations
}

function drawMilkyWayStars(ctx, width, height, density, radiusMultiplier) {
    // Draw very dark background
    ctx.fillStyle = '#020208';
    ctx.fillRect(0, 0, width, height);

    // Draw dust lanes (simplified noise band)
    const bandHeight = height * 0.3;
    const bandY = height / 2 - bandHeight / 2;
    const dustImageData = ctx.createImageData(width, bandHeight);
    const dustData = dustImageData.data;
    for (let y = 0; y < bandHeight; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const noise = (Math.sin(x * 0.008 + y * 0.02) + Math.cos(x * 0.01 - y * 0.03) + 2) / 4;
            const intensity = Math.pow(noise, 2) * 0.3; // Darker noise
            dustData[i] = 10 + noise * 10; // R (dark brown/purple)
            dustData[i + 1] = 5 + noise * 5;  // G
            dustData[i + 2] = 15 + noise * 15; // B
            dustData[i + 3] = intensity * 200; // Alpha
        }
    }
    ctx.putImageData(dustImageData, 0, bandY);

    // Draw dense star field, concentrated near the band
    const numStars = (advancedStyleOptions.starNumber || 2000) * 2; // More stars for Milky Way
    const starColors = ['#FFFFFF', '#FFFFFF', '#FFF8DC', '#FFFACD', '#FFFFF0', '#F0FFFF']; // Mostly white/pale yellow

    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        // Concentrate stars near the center band
        const yNoise = (Math.random() - 0.5) * height * 0.6; // Gaussian-like distribution
        const y = height / 2 + yNoise;
        if (y < 0 || y >= height) continue;

        const radius = (Math.random() * 1.0) * radiusMultiplier;
        const opacity = 0.4 + Math.random() * 0.6; // Generally brighter
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.round(opacity * 255).toString(16).padStart(2, '0'); // Add alpha hex
        ctx.fill();
    }
     drawConstellations(ctx, width, height); // Faint constellations
}

function drawNorthernLightsStars(ctx, width, height, density, radiusMultiplier) {
    // Dark blue/purple background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#050A1A');
    bgGradient.addColorStop(1, '#100520');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw Aurora (wavy bands)
    const auroraColors = ['rgba(0, 255, 100, 0.1)', 'rgba(0, 200, 255, 0.1)', 'rgba(100, 0, 255, 0.1)', 'rgba(0, 255, 200, 0.1)'];
    const waveCount = 15;
    for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        const startY = height * 0.1 + Math.random() * height * 0.4;
        const waveAmp = 20 + Math.random() * 30;
        const waveFreq = 0.005 + Math.random() * 0.005;
        const phase = Math.random() * Math.PI * 2;
        ctx.moveTo(0, startY);
        for (let x = 0; x < width; x++) {
            ctx.lineTo(x, startY + Math.sin(x * waveFreq + phase) * waveAmp);
        }
        ctx.lineTo(width, height); // Fill down to bottom
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = auroraColors[i % auroraColors.length];
        ctx.fill();
    }

    // Draw stars (fewer, sharper)
    const numStars = Math.floor((advancedStyleOptions.starNumber || 2000) * 0.7);
     for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (0.5 + Math.random() * 0.8) * radiusMultiplier;
        const opacity = 0.7 + Math.random() * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
    }
     drawConstellations(ctx, width, height); // Faint constellations
}

function drawDeepSpaceStars(ctx, width, height, density, radiusMultiplier) {
    // Very dark background
    ctx.fillStyle = '#010103';
    ctx.fillRect(0, 0, width, height);

    // Draw distant galaxies (faint smudges)
    const numGalaxies = 25;
    for (let i = 0; i < numGalaxies; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 10 + Math.random() * 40;
        const angle = Math.random() * Math.PI;
        const galaxyGradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
        galaxyGradient.addColorStop(0, `rgba(${100 + Math.random()*50}, ${100 + Math.random()*50}, ${150 + Math.random()*50}, 0.05)`); // Faint blue/white core
        galaxyGradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.scale(1, 0.3); // Make them elliptical
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = galaxyGradient;
        ctx.fill();
        ctx.restore();
    }

    // Draw stars (mostly small and faint)
    const numStars = advancedStyleOptions.starNumber || 2000;
     for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (Math.random() * 0.8) * radiusMultiplier; // Mostly tiny
        const opacity = 0.2 + Math.random() * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${opacity})`; // Faint blueish
        ctx.fill();
    }
     // Few brighter stars
     const numBright = Math.floor(numStars / 100);
     for (let i = 0; i < numBright; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (1.0 + Math.random() * 1.0) * radiusMultiplier;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
    }
     // No constellations in deep space view
}

function drawVintageStars(ctx, width, height, density, radiusMultiplier) {
    // Sepia background
    ctx.fillStyle = '#3f3220'; // Dark sepia
    ctx.fillRect(0, 0, width, height);

    // Add texture (simple noise)
    const textureData = ctx.createImageData(width, height);
    const data = textureData.data;
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 30;
        data[i] = 63 + noise;     // R
        data[i + 1] = 50 + noise; // G
        data[i + 2] = 32 + noise; // B
        data[i + 3] = 40;         // Alpha (low opacity overlay)
    }
    ctx.putImageData(textureData, 0, 0);

    // Draw stars (yellowish/cream)
    const numStars = advancedStyleOptions.starNumber || 2000;
    const starColor = '#FFF8DC'; // Cornsilk

    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (Math.random() * 1.2) * radiusMultiplier;
        const opacity = 0.3 + Math.random() * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = starColor + Math.round(opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
    }
    const numBrightStars = Math.floor(numStars / 20);
    for (let i = 0; i < numBrightStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (1 + Math.random() * 1.5) * radiusMultiplier;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = starColor + 'CC'; // Brighter alpha
        ctx.fill();
    }

    // Draw constellations (thicker, darker lines)
    drawConstellations(ctx, width, height, false, '#D2B48C', 1.5); // Tan color, thicker line

     // Add vignette effect
     const vignetteGradient = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.3, width / 2, height / 2, Math.max(width, height) * 0.7);
     vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
     vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
     ctx.fillStyle = vignetteGradient;
     ctx.fillRect(0, 0, width, height);
}

function drawMinimalistStars(ctx, width, height, density, radiusMultiplier) {
    // Dark grey background
    ctx.fillStyle = '#18181B'; // Zinc 900
    ctx.fillRect(0, 0, width, height);

    // Draw stars (uniform small size, white)
    const numStars = advancedStyleOptions.starNumber || 2000;
    const starRadius = 0.8 * radiusMultiplier;
    const starColor = 'rgba(245, 245, 245, 0.8)'; // Zinc 100 with alpha

    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.beginPath();
        ctx.arc(x, y, starRadius, 0, Math.PI * 2);
        ctx.fillStyle = starColor;
        ctx.fill();
    }

    // Draw minimal constellation lines (very faint)
    drawConstellations(ctx, width, height, false, 'rgba(113, 113, 122, 0.3)', 0.5); // Zinc 500 with alpha
}


function drawConstellations(ctx, width, height, prominent = false, color = 'rgba(255, 255, 255, 0.3)', lineWidth = 0.5) {
    if (!advancedStyleOptions.constellationBounds && !prominent) return; // Skip if bounds not enabled (unless prominent style)

    const constellationsData = [ /* ... constellation data ... */
         // Big Dipper
        { name: "Big Dipper", points: [[0.2, 0.3], [0.25, 0.32], [0.3, 0.35], [0.35, 0.38], [0.4, 0.35], [0.45, 0.3], [0.5, 0.25]] },
        // Orion
        { name: "Orion", points: [[0.6, 0.2], [0.65, 0.25], [0.63, 0.3], [0.67, 0.35], [0.7, 0.4], [0.6, 0.35], [0.55, 0.4], [0.58, 0.3], [0.62, 0.25]] },
        // Cassiopeia
        { name: "Cassiopeia", points: [[0.75, 0.6], [0.8, 0.55], [0.85, 0.6], [0.9, 0.55], [0.95, 0.6]] },
        // Southern Cross
        { name: "Southern Cross", points: [[0.3, 0.7], [0.35, 0.75], [0.3, 0.8], [0.25, 0.75]] }
    ];

    const effectiveLineWidth = prominent ? (advancedStyleOptions.constellationLineWidth || 1.0) * 1.5 : (advancedStyleOptions.constellationLineWidth || 0.5);
    const effectiveColor = prominent ? 'rgba(255, 255, 255, 0.7)' : color;
    const starRadius = prominent ? 3 * (advancedStyleOptions.starSize || 1.0) : 2;
    const starColor = prominent ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)';

    ctx.strokeStyle = effectiveColor;
    ctx.lineWidth = effectiveLineWidth;
    ctx.fillStyle = starColor;

    constellationLoop: for (const constData of constellationsData) {
        ctx.beginPath();
        let firstPoint = true;
        for (const point of constData.points) {
            const x = point[0] * width;
            const y = point[1] * height;

            // Draw star for constellation
            ctx.moveTo(x + starRadius, y); // Move to edge for arc
            ctx.arc(x, y, starRadius, 0, Math.PI * 2);

            // Connect lines
            if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.fill(); // Fill all stars first
        ctx.stroke(); // Then stroke lines

        // Add labels if enabled
        if (advancedStyleOptions.constellationLabels || (prominent && advancedStyleOptions.constellationLabels !== false)) { // Default to true if prominent
             const centerX = constData.points.reduce((sum, p) => sum + p[0], 0) / constData.points.length * width;
             const centerY = constData.points.reduce((sum, p) => sum + p[1], 0) / constData.points.length * height;
             drawText(ctx, constData.name, advancedStyleOptions.labelFont || 'Arial', advancedStyleOptions.labelFontSize || 10, false, false, effectiveColor, centerX, centerY - starRadius * 3);
        }
    }
}

// --- Celestial Body Drawing Functions (Placeholders) ---
function drawMoon(ctx, width, height) {
    console.log("Drawing Moon (placeholder)");
    const x = width * 0.8;
    const y = height * 0.15;
    const radius = 15 * (advancedStyleOptions.celestialBodySize || 1.0);
    ctx.fillStyle = '#E0E0E0';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    // Add craters or texture if desired
}

function drawSun(ctx, width, height) {
     console.log("Drawing Sun (placeholder)");
     const x = width * 0.2;
     const y = height * 0.1;
     const radius = 20 * (advancedStyleOptions.celestialBodySize || 1.0);
     ctx.fillStyle = '#FFD700'; // Gold
     ctx.beginPath();
     ctx.arc(x, y, radius, 0, Math.PI * 2);
     ctx.fill();
     // Add glow/rays if desired
}

function drawPlanets(ctx, width, height) {
     console.log("Drawing Planets (placeholder)");
     const planetsData = [
         { name: "Mars", x: 0.3, y: 0.2, radius: 5, color: '#A0522D' },
         { name: "Jupiter", x: 0.5, y: 0.4, radius: 8, color: '#B8860B' },
         { name: "Saturn", x: 0.7, y: 0.1, radius: 6, color: '#DAA520' },
     ];
     planetsData.forEach(p => {
         const radius = p.radius * (advancedStyleOptions.celestialBodySize || 1.0);
         ctx.fillStyle = p.color;
         ctx.beginPath();
         ctx.arc(width * p.x, height * p.y, radius, 0, Math.PI * 2);
         ctx.fill();
         // Add rings for Saturn, etc.
         if (advancedStyleOptions.planetLabels) {
             // Draw label (simplified)
             drawText(ctx, p.name, advancedStyleOptions.labelFont || 'Arial', advancedStyleOptions.labelFontSize || 10, false, false, '#FFFFFF', width * p.x, height * p.y - radius - 5);
         }
     });
}

function drawEclipticPath(ctx, width, height) {
     console.log("Drawing Ecliptic Path (placeholder)");
     ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)'; // Faint yellow
     ctx.lineWidth = 1;
     ctx.beginPath();
     // Approximate path (e.g., a slight curve)
     ctx.moveTo(0, height * 0.4);
     ctx.quadraticCurveTo(width / 2, height * 0.45, width, height * 0.4);
     ctx.stroke();
}


// --- Advanced Options UI ---
function createAdvancedOptionsUI() {
    const starMapStyleSelect = document.getElementById('star-map-style');
    // Find the container holding the star map style select
    const styleContainer = starMapStyleSelect ? starMapStyleSelect.closest('.input-section') : null;
    if (!styleContainer || document.getElementById('advanced-options-panel')) {
         console.log("Advanced options UI anchor not found or UI already exists.");
        return; // Don't create if anchor is missing or UI exists
    }

    const panel = document.createElement('div');
    panel.id = 'advanced-options-panel';
    panel.className = 'grouped-sections-container advanced-options'; // Use existing class + new one
    panel.style.display = 'none'; // Initially hidden

    panel.innerHTML = `
        <h3 style="text-align: center; margin-top: 0; color: #333;">Advanced Star Map Options</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">

            <!-- Features -->
            <div class="options-quadrant">
                <h4 class="quadrant-title">Features</h4>
                <label><input type="checkbox" id="adv-milkyWay"> Milky Way</label><br>
                <label><input type="checkbox" id="adv-constellationBounds"> Constellation Lines</label><br>
                <label><input type="checkbox" id="adv-starsGlow"> Stars Glow</label><br>
            </div>

            <!-- Celestial Bodies -->
            <div class="options-quadrant">
                <h4 class="quadrant-title">Celestial Bodies</h4>
                <label><input type="checkbox" id="adv-moon"> Moon</label><br>
                <label><input type="checkbox" id="adv-sun"> Sun</label><br>
                <label><input type="checkbox" id="adv-planets"> Planets</label><br>
                <label><input type="checkbox" id="adv-eclipticPath"> Ecliptic Path</label><br>
                 <!-- <label>Body Size: <input type="range" id="adv-celestialBodySize" min="0.5" max="2" step="0.1" value="1.0"> <span id="adv-celestialBodySize-value">1.0</span></label><br> -->
            </div>

            <!-- Star Settings -->
            <div class="options-quadrant">
                <h4 class="quadrant-title">Star Settings</h4>
                <label>Star Size: <input type="range" id="adv-starSize" min="0.5" max="3" step="0.1" value="1.0"> <span id="adv-starSize-value">1.0</span></label><br>
                <label>Star Number: <input type="range" id="adv-starNumber" min="500" max="5000" step="100" value="2000"> <span id="adv-starNumber-value">2000</span></label><br>
                <label>Const. Line Width: <input type="range" id="adv-constellationLineWidth" min="0.1" max="3" step="0.1" value="1.0"> <span id="adv-constellationLineWidth-value">1.0</span></label><br>
            </div>

            <!-- Labels -->
            <div class="options-quadrant">
                <h4 class="quadrant-title">Labels</h4>
                <label><input type="checkbox" id="adv-planetLabels"> Planet Labels</label><br>
                <label><input type="checkbox" id="adv-constellationLabels"> Constellation Labels</label><br>
                <!-- <label><input type="checkbox" id="adv-starLabels"> Star Labels (Caution: Slow)</label><br> -->
                 <!-- Add Font/Size controls for labels later if needed -->
            </div>
        </div>
        <div style="text-align: center; margin-top: 15px;">
            <button type="button" id="apply-advanced-btn" class="settings-button apply-button">Apply & Close</button>
             <button type="button" id="close-advanced-btn" class="settings-button close-button">Cancel</button>
        </div>
    `;

    // Insert the panel after the container holding the star map style select
    styleContainer.parentNode.insertBefore(panel, styleContainer.nextSibling);

    // Add button to toggle the panel
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.id = 'toggle-advanced-options-btn';
    toggleBtn.textContent = 'Advanced Options ▼';
    toggleBtn.className = 'settings-button toggle-advanced-button'; // Style like other buttons
    toggleBtn.style.marginLeft = '10px'; // Space it from the dropdown

     // Insert button next to the style select dropdown
     starMapStyleSelect.insertAdjacentElement('afterend', toggleBtn);


    console.log("Advanced Options UI created.");

     // Add CSS for quadrants
     const styleSheet = document.createElement("style");
     styleSheet.type = "text/css";
     styleSheet.innerText = `
         .options-quadrant { padding: 10px; border: 1px solid #e0e0e0; border-radius: 4px; background-color: #fff; }
         .quadrant-title { color: #0056b3; margin-top: 0; margin-bottom: 10px; font-size: 0.9em; border-bottom: 1px solid #eee; padding-bottom: 5px; }
         .options-quadrant label { display: block; margin-bottom: 5px; font-size: 0.85em; }
         .options-quadrant input[type=range] { width: 60%; vertical-align: middle; }
         .toggle-advanced-button { background-color: #6c757d; }
         .apply-button { background-color: #28a745; }
         .close-button { background-color: #dc3545; margin-left: 10px;}
     `;
     document.head.appendChild(styleSheet);
}

function setupAdvancedOptionsEventListeners() {
    const toggleBtn = document.getElementById('toggle-advanced-options-btn');
    const panel = document.getElementById('advanced-options-panel');
    const applyBtn = document.getElementById('apply-advanced-btn');
    const closeBtn = document.getElementById('close-advanced-btn');

    if (toggleBtn && panel) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = panel.style.display === 'none';
            panel.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? 'Advanced Options ▲' : 'Advanced Options ▼';
             if (isHidden) loadAdvancedOptionsUI(advancedStyleOptions); // Refresh UI with current state when opening
        });
    }

    if (applyBtn && panel) {
        applyBtn.addEventListener('click', () => {
            updateAdvancedOptionsFromUI(); // Read values from UI
            saveCurrentSettings(); // Save all settings including advanced
            panel.style.display = 'none'; // Close panel
            if (toggleBtn) toggleBtn.textContent = 'Advanced Options ▼';
            generateStarMap(); // Regenerate map with new options
        });
    }

     if (closeBtn && panel) {
        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none'; // Close panel without applying changes
            if (toggleBtn) toggleBtn.textContent = 'Advanced Options ▼';
             // Optional: Revert UI to match saved state if changes were made but not applied
             // loadAdvancedOptionsUI(advancedStyleOptions);
        });
    }

    // Slider value displays
    const sliders = [
        { id: 'adv-starSize', valueId: 'adv-starSize-value' },
        { id: 'adv-starNumber', valueId: 'adv-starNumber-value' },
        { id: 'adv-constellationLineWidth', valueId: 'adv-constellationLineWidth-value' },
        // { id: 'adv-celestialBodySize', valueId: 'adv-celestialBodySize-value' }
    ];
    sliders.forEach(s => {
        const slider = document.getElementById(s.id);
        const valueDisplay = document.getElementById(s.valueId);
        if (slider && valueDisplay) {
            slider.addEventListener('input', () => valueDisplay.textContent = slider.value);
        }
    });
}

function updateAdvancedOptionsFromUI() {
    advancedStyleOptions.milkyWay = document.getElementById('adv-milkyWay')?.checked ?? false;
    advancedStyleOptions.constellationBounds = document.getElementById('adv-constellationBounds')?.checked ?? false;
    advancedStyleOptions.starsGlow = document.getElementById('adv-starsGlow')?.checked ?? false;
    advancedStyleOptions.moon = document.getElementById('adv-moon')?.checked ?? false;
    advancedStyleOptions.sun = document.getElementById('adv-sun')?.checked ?? false;
    advancedStyleOptions.planets = document.getElementById('adv-planets')?.checked ?? false;
    advancedStyleOptions.eclipticPath = document.getElementById('adv-eclipticPath')?.checked ?? false;
    advancedStyleOptions.planetLabels = document.getElementById('adv-planetLabels')?.checked ?? false;
    advancedStyleOptions.constellationLabels = document.getElementById('adv-constellationLabels')?.checked ?? false;
    // advancedStyleOptions.starLabels = document.getElementById('adv-starLabels')?.checked ?? false;

    advancedStyleOptions.starSize = parseFloat(document.getElementById('adv-starSize')?.value ?? 1.0);
    advancedStyleOptions.starNumber = parseInt(document.getElementById('adv-starNumber')?.value ?? 2000);
    advancedStyleOptions.constellationLineWidth = parseFloat(document.getElementById('adv-constellationLineWidth')?.value ?? 1.0);
    // advancedStyleOptions.celestialBodySize = parseFloat(document.getElementById('adv-celestialBodySize')?.value ?? 1.0);

    console.log("Advanced options updated from UI:", advancedStyleOptions);
}

function loadAdvancedOptionsUI(options) {
    if (!options || !document.getElementById('advanced-options-panel')) return; // Ensure panel exists
    // Update checkboxes
    if(document.getElementById('adv-milkyWay')) document.getElementById('adv-milkyWay').checked = options.milkyWay ?? false;
    if(document.getElementById('adv-constellationBounds')) document.getElementById('adv-constellationBounds').checked = options.constellationBounds ?? false;
    if(document.getElementById('adv-starsGlow')) document.getElementById('adv-starsGlow').checked = options.starsGlow ?? false;
    if(document.getElementById('adv-moon')) document.getElementById('adv-moon').checked = options.moon ?? false;
    if(document.getElementById('adv-sun')) document.getElementById('adv-sun').checked = options.sun ?? false;
    if(document.getElementById('adv-planets')) document.getElementById('adv-planets').checked = options.planets ?? false;
    if(document.getElementById('adv-eclipticPath')) document.getElementById('adv-eclipticPath').checked = options.eclipticPath ?? false;
    if(document.getElementById('adv-planetLabels')) document.getElementById('adv-planetLabels').checked = options.planetLabels ?? false;
    if(document.getElementById('adv-constellationLabels')) document.getElementById('adv-constellationLabels').checked = options.constellationLabels ?? false;
    // if(document.getElementById('adv-starLabels')) document.getElementById('adv-starLabels').checked = options.starLabels ?? false;

    // Update sliders and their value displays
    const sliders = [
        { id: 'adv-starSize', valueId: 'adv-starSize-value', value: options.starSize ?? 1.0 },
        { id: 'adv-starNumber', valueId: 'adv-starNumber-value', value: options.starNumber ?? 2000 },
        { id: 'adv-constellationLineWidth', valueId: 'adv-constellationLineWidth-value', value: options.constellationLineWidth ?? 1.0 },
        // { id: 'adv-celestialBodySize', valueId: 'adv-celestialBodySize-value', value: options.celestialBodySize ?? 1.0 }
    ];
    sliders.forEach(s => {
        const slider = document.getElementById(s.id);
        const valueDisplay = document.getElementById(s.valueId);
        if (slider) slider.value = s.value;
        if (valueDisplay) valueDisplay.textContent = s.value;
    });
     console.log("Advanced Options UI updated from loaded settings.");
}

// --- HEX Color Picker Fix ---
function initializeHexColorPickers() {
    // Ensure vanilla-picker library is loaded
    if (typeof Picker === 'undefined') {
        // Attempt to load it if not found? Or just warn.
        console.warn("Vanilla Picker library not found. HEX fix cannot be applied. Make sure it's included in the HTML.");
        // Optionally, try to load it dynamically (more complex)
        // const script = document.createElement('script');
        // script.src = 'https://cdn.jsdelivr.net/npm/vanilla-picker@2.12.2/dist/vanilla-picker.min.js';
        // script.onload = () => initializeHexColorPickers(); // Retry after loading
        // document.head.appendChild(script);
        return;
    }

    console.log("Initializing HEX Color Pickers...");

    // Check if prototype is already patched
    if (Picker.prototype.show._isPatched) {
        console.log("Picker prototype already patched.");
    } else {
        const originalShow = Picker.prototype.show;
        Picker.prototype.show = function() {
            originalShow.apply(this, arguments); // Call original
            try {
                // Find the mode select within this specific picker instance
                // Accessing internal DOM structure might be fragile
                const modeSelect = this.dom?.edit?.querySelector('.picker_editor select');
                if (modeSelect && modeSelect.value !== 'hex') {
                    let hexIndex = -1;
                    for (let i = 0; i < modeSelect.options.length; i++) {
                        if (modeSelect.options[i].value === 'hex') {
                            hexIndex = i;
                            break;
                        }
                    }
                    if (hexIndex !== -1) {
                        modeSelect.selectedIndex = hexIndex;
                        const event = new Event('change', { bubbles: true });
                        modeSelect.dispatchEvent(event);
                    }
                }
            } catch (e) {
                console.error("Error setting default HEX mode in picker:", e);
            }
        };
        Picker.prototype.show._isPatched = true; // Mark as patched
        console.log("Patched Picker prototype for default HEX mode.");
    }


    // Attach picker to all color inputs
    document.querySelectorAll('input[type="color"]').forEach(input => {
        if (input._picker) return; // Already initialized

        try {
            const picker = new Picker({
                parent: input,
                popup: 'right', // Or 'left', 'top', 'bottom'
                color: input.value || '#000000', // Start with input's value or black
                alpha: false, // No alpha channel needed for these inputs
                editor: true,
                editorFormat: 'hex', // Preferred format
                layout: 'default', // Standard layout
                onChange: function(color) {
                    // Update the input visually while picking
                    input.style.backgroundColor = color.hex;
                },
                onDone: function(color) {
                    // Final color selection
                    input.value = color.hex; // Set input value to HEX
                    input.style.backgroundColor = color.hex;
                    // Trigger change event for other listeners (like settings save)
                    const event = new Event('change', { bubbles: true });
                    input.dispatchEvent(event);
                },
                 onOpen: function() {
                     // This ensures HEX is selected when opening, even if prototype override fails
                     try {
                         const modeSelect = this.dom?.edit?.querySelector('.picker_editor select');
                         if (modeSelect && modeSelect.value !== 'hex') {
                             let hexIndex = -1;
                             for (let i = 0; i < modeSelect.options.length; i++) { if (modeSelect.options[i].value === 'hex') { hexIndex = i; break; } }
                             if (hexIndex !== -1) { modeSelect.selectedIndex = hexIndex; const event = new Event('change', { bubbles: true }); modeSelect.dispatchEvent(event); }
                         }
                     } catch(e) { console.error("Error setting HEX mode onOpen:", e); }
                 }
            });
            input._picker = picker; // Store picker instance

            // Prevent default color picker, show custom one
            input.addEventListener('click', (e) => {
                e.preventDefault();
                // Check if picker is already open
                 if (!picker.settings.visible) {
                    picker.show();
                 }
            });
             // Set initial background color
             input.style.backgroundColor = input.value || '#000000';
        } catch (e) {
            console.error(`Error initializing picker for input ${input.id}:`, e);
        }
    });
     console.log("HEX Color Pickers Initialized.");
}

// --- SVG Generation ---
function escapeXml(unsafe) {
    // Ensure input is a string
    const str = String(unsafe);
    return str.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '<';
            case '>': return '>';
            case '&': return '&';
            case '\'': return '''; // Correct XML entity for apostrophe
            case '"': return '"';
            default: return c;
        }
    });
}


function generateSVG(canvas) {
    if (!canvas) return "";
    // const ctx = canvas.getContext('2d'); // Not needed for SVG generation from form values
    const width = canvas.width; // Use canvas dimensions for SVG size
    const height = canvas.height;

    // Get relevant settings
    const outsideColorValue = document.getElementById("outside-color")?.value || "#0a0e1a";
    const starFieldColorValue = document.getElementById("star-field-color")?.value || "#000000";

    // Start SVG
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background-color: ${outsideColorValue};">`;

    // Add Definitions for any filters or patterns if needed (e.g., glow)
    svg += `<defs>`;
    if (advancedStyleOptions.starsGlow) {
        svg += `<filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>`;
    }
    svg += `</defs>`;

    // Draw Starfield Background (using rect for consistency with canvas)
    svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="${starFieldColorValue}" />`;

    // --- Draw Stars (Simplified SVG version) ---
    const numStars = advancedStyleOptions.starNumber || 2000;
    const radiusMultiplier = advancedStyleOptions.starSize || 1.0;
    const glowFilter = advancedStyleOptions.starsGlow ? 'url(#starGlow)' : '';

    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height; // Full height
        const radius = (Math.random() * 1.2 + 0.3) * radiusMultiplier; // Slightly vary size
        const opacity = 0.5 + Math.random() * 0.5;
        svg += `<circle cx="${x}" cy="${y}" r="${radius}" fill="rgba(255, 255, 255, ${opacity})" filter="${glowFilter}" />`;
    }
     // Add constellations if enabled
     if (advancedStyleOptions.constellationBounds) {
         // Simplified constellation drawing for SVG
         const constellationsData = [ /* ... constellation data ... */
             { name: "Big Dipper", points: [[0.2, 0.3], [0.25, 0.32], [0.3, 0.35], [0.35, 0.38], [0.4, 0.35], [0.45, 0.3], [0.5, 0.25]] },
             { name: "Orion", points: [[0.6, 0.2], [0.65, 0.25], [0.63, 0.3], [0.67, 0.35], [0.7, 0.4], [0.6, 0.35], [0.55, 0.4], [0.58, 0.3], [0.62, 0.25]] },
             { name: "Cassiopeia", points: [[0.75, 0.6], [0.8, 0.55], [0.85, 0.6], [0.9, 0.55], [0.95, 0.6]] },
             { name: "Southern Cross", points: [[0.3, 0.7], [0.35, 0.75], [0.3, 0.8], [0.25, 0.75]] }
         ];
         const lineWidth = advancedStyleOptions.constellationLineWidth || 1.0;
         const lineColor = 'rgba(255, 255, 255, 0.4)';
         const labelColor = 'rgba(255, 255, 255, 0.6)';
         const labelSize = advancedStyleOptions.labelFontSize || 10;

         constellationLoopSVG: for (const constData of constellationsData) {
             let pathData = "";
             let first = true;
             for (const point of constData.points) {
                 const px = point[0] * width;
                 const py = point[1] * height;
                 pathData += (first ? "M" : "L") + `${px},${py} `;
                 first = false;
                 // Draw star point
                 svg += `<circle cx="${px}" cy="${py}" r="${1.5 * radiusMultiplier}" fill="white" />`;
             }
             svg += `<path d="${pathData}" stroke="${lineColor}" stroke-width="${lineWidth}" fill="none" />`;

             // Add labels if enabled
             if (advancedStyleOptions.constellationLabels) {
                 const centerX = constData.points.reduce((sum, p) => sum + p[0], 0) / constData.points.length * width;
                 const centerY = constData.points.reduce((sum, p) => sum + p[1], 0) / constData.points.length * height;
                 svg += `<text x="${centerX}" y="${centerY - 10}" font-family="${escapeXml(advancedStyleOptions.labelFont || 'Arial')}" font-size="${labelSize}" fill="${labelColor}" text-anchor="middle">${escapeXml(constData.name)}</text>`;
             }
         }
     }


    // --- Draw Text Layers ---
     const textLayersDataSVG = [];
     for (let i = 1; i <= 3; i++) {
         const textInput = document.getElementById(`text-entry-${i}`);
         if (textInput && textInput.value) {
             textLayersDataSVG.push({
                 text: textInput.value,
                 fontFamily: document.getElementById(`font-family-${i}`)?.value || 'Arial',
                 fontSize: document.getElementById(`font-size-${i}`)?.value || '16',
                 fontColor: document.getElementById(`font-color-${i}`)?.value || '#FFFFFF',
                 isBold: document.getElementById(`text-bold-${i}`)?.checked || false,
                 isItalic: document.getElementById(`text-italic-${i}`)?.checked || false
             });
         } else {
             textLayersDataSVG.push(null);
         }
     }
     // Y positions (match canvas if possible)
     const yPos1SVG = height * 0.65;
     const yPos2SVG = height * 0.75;
     const yPos3SVG = height * 0.90;
     const yPosDateSVG = height * 0.82;
     const yPosCoordsSVG = height * 0.86;

     const addTextStyle = (layer) => {
         let style = "";
         if (layer.isBold) style += "font-weight: bold; ";
         if (layer.isItalic) style += "font-style: italic; ";
         return style ? `style="${style.trim()}"` : "";
     };

     if (textLayersDataSVG[0]) {
         const size = textLayersDataSVG[0].fontSize.endsWith('px') ? textLayersDataSVG[0].fontSize : `${textLayersDataSVG[0].fontSize}px`;
         svg += `<text x="${width / 2}" y="${yPos1SVG}" font-family="${escapeXml(textLayersDataSVG[0].fontFamily)}" font-size="${size}" fill="${textLayersDataSVG[0].fontColor}" text-anchor="middle" ${addTextStyle(textLayersDataSVG[0])}>${escapeXml(textLayersDataSVG[0].text)}</text>`;
     }
     if (textLayersDataSVG[1]) {
          const size = textLayersDataSVG[1].fontSize.endsWith('px') ? textLayersDataSVG[1].fontSize : `${textLayersDataSVG[1].fontSize}px`;
         svg += `<text x="${width / 2}" y="${yPos2SVG}" font-family="${escapeXml(textLayersDataSVG[1].fontFamily)}" font-size="${size}" fill="${textLayersDataSVG[1].fontColor}" text-anchor="middle" ${addTextStyle(textLayersDataSVG[1])}>${escapeXml(textLayersDataSVG[1].text)}</text>`;
     }

    // --- Draw Fixed Date and Coordinates ---
    const dateInputSVG = document.getElementById("date");
    const latitudeInputSVG = document.getElementById("latitude");
    const longitudeInputSVG = document.getElementById("longitude");

    if (dateInputSVG && dateInputSVG.value) {
        const formattedDate = formatDate(dateInputSVG.value);
        const dateFont = document.getElementById("fixed-date-font")?.value || "Arial";
        const dateFontSize = document.getElementById("fixed-date-size")?.value || "14";
        const dateBold = document.getElementById("fixed-date-bold")?.checked || false;
        const dateItalic = document.getElementById("fixed-date-italic")?.checked || false;
        const dateColor = document.getElementById("fixed-date-color")?.value || "#FFFFFF";
        const size = dateFontSize.endsWith('px') ? dateFontSize : `${dateFontSize}px`;
        const style = `${dateBold ? 'font-weight: bold; ' : ''}${dateItalic ? 'font-style: italic; ' : ''}`;
        svg += `<text x="${width / 2}" y="${yPosDateSVG}" font-family="${escapeXml(dateFont)}" font-size="${size}" fill="${dateColor}" text-anchor="middle" ${style ? `style="${style.trim()}"` : ''}>${escapeXml(formattedDate)}</text>`;
    }

    if (latitudeInputSVG && longitudeInputSVG && latitudeInputSVG.value && longitudeInputSVG.value) {
        const formattedCoords = formatCoordinates(latitudeInputSVG.value, longitudeInputSVG.value);
        const coordsFont = document.getElementById("fixed-coords-font")?.value || "Arial";
        const coordsFontSize = document.getElementById("fixed-coords-size")?.value || "14";
        const coordsBold = document.getElementById("fixed-coords-bold")?.checked || false;
        const coordsItalic = document.getElementById("fixed-coords-italic")?.checked || false;
        const coordsColor = document.getElementById("fixed-coords-color")?.value || "#FFFFFF";
         const size = coordsFontSize.endsWith('px') ? coordsFontSize : `${coordsFontSize}px`;
         const style = `${coordsBold ? 'font-weight: bold; ' : ''}${coordsItalic ? 'font-style: italic; ' : ''}`;
        svg += `<text x="${width / 2}" y="${yPosCoordsSVG}" font-family="${escapeXml(coordsFont)}" font-size="${size}" fill="${coordsColor}" text-anchor="middle" ${style ? `style="${style.trim()}"` : ''}>${escapeXml(formattedCoords)}</text>`;
    }

     if (textLayersDataSVG[2]) {
          const size = textLayersDataSVG[2].fontSize.endsWith('px') ? textLayersDataSVG[2].fontSize : `${textLayersDataSVG[2].fontSize}px`;
         svg += `<text x="${width / 2}" y="${yPos3SVG}" font-family="${escapeXml(textLayersDataSVG[2].fontFamily)}" font-size="${size}" fill="${textLayersDataSVG[2].fontColor}" text-anchor="middle" ${addTextStyle(textLayersDataSVG[2])}>${escapeXml(textLayersDataSVG[2].text)}</text>`;
     }


    svg += `</svg>`;
    return svg;
}


// --- Download Function ---
function downloadStarMap() {
    try {
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas || canvas.getAttribute('data-generated') !== 'true') {
            alert("Please generate the star map preview first.");
            return;
        }

        const imageTypePng = document.getElementById("image-type-png");
        const imageTypeJpg = document.getElementById("image-type-jpg");
        const imageTypeSvg = document.getElementById("image-type-svg"); // Get SVG radio button

        let imageType = "png"; // Default
        if (imageTypeJpg?.checked) imageType = "jpg";
        if (imageTypeSvg?.checked) imageType = "svg"; // Check if SVG is selected

        const exportTransparency = document.getElementById("export-transparency")?.checked || false;

        const dateInput = document.getElementById("date");
        const dateObj = dateInput?.value ? new Date(dateInput.value + 'T00:00:00') : new Date();
        const formattedDate = dateObj.toISOString().split('T')[0];

        const titleInput = document.getElementById("text-entry-1");
        const title = titleInput?.value || "star_map";
        const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        const link = document.createElement("a");
        let dataURL;
        let fileName = `${safeTitle}_${formattedDate}`;

        // Get DPI setting
        const dpi = parseInt(document.querySelector('input[name="dpi"]:checked')?.value || "150");
        const scaleFactor = dpi / 96; // Assuming standard screen DPI is 96

        // Create a temporary canvas for scaling if needed (for PNG/JPG)
        let tempCanvas, tempCtx;
        if (imageType === 'png' || imageType === 'jpg') {
            tempCanvas = document.createElement('canvas');
            tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = canvas.width * scaleFactor;
            tempCanvas.height = canvas.height * scaleFactor;

            // Draw the original canvas onto the temporary one, scaled up
            tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
        }


        if (imageType === "png") {
            fileName += ".png";
            // Handle transparency
            if (!exportTransparency) {
                // Draw background color onto temp canvas before exporting
                const outsideColorValue = document.getElementById("outside-color")?.value || "#0a0e1a";
                tempCtx.globalCompositeOperation = 'destination-over';
                tempCtx.fillStyle = outsideColorValue;
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                tempCtx.globalCompositeOperation = 'source-over'; // Reset composite operation
            }
            dataURL = tempCanvas.toDataURL("image/png");
        } else if (imageType === "jpg") {
            fileName += ".jpg";
            // Draw background color onto temp canvas (JPG doesn't support transparency)
            const outsideColorValue = document.getElementById("outside-color")?.value || "#0a0e1a";
            tempCtx.globalCompositeOperation = 'destination-over';
            tempCtx.fillStyle = outsideColorValue;
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.globalCompositeOperation = 'source-over'; // Reset composite operation
            dataURL = tempCanvas.toDataURL("image/jpeg", 0.9); // Quality 0.9
        } else if (imageType === "svg") {
            fileName += ".svg";
            const svgContent = generateSVG(canvas); // Use the dedicated SVG generator
            const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
            dataURL = URL.createObjectURL(blob);
        } else {
            alert("Invalid image type selected.");
            return;
        }

        link.href = dataURL;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (imageType === "svg") {
            URL.revokeObjectURL(dataURL); // Clean up blob URL
        }

        console.log(`Star map downloaded as ${fileName}`);
        showTemporaryMessage("Download Started!");

    } catch (error) {
        console.error("Error downloading star map:", error);
        alert("Error downloading star map: " + error.message);
    }
}

// Make sure all functions are properly closed
