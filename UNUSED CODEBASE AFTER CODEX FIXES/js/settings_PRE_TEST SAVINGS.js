// START OF CODE - Cline - 2025-04-20 15:26 File: js/settings.js
// Settings Management & Font/Size Population for Star Map Generator

// --- Global Variables (Reference only - defined in main_app.js) ---
// let aspectRatio = 1.25;
// const advancedStyleOptions = { ... }; // Assumed to be globally available

// --- Font & Size Definitions ---
const fontFamilies = [
    "Montserrat", "Open Sans", "Oswald", "Satisfy", "Lilita One", "Playfair Display",
    "Merriweather", "Dancing Script", "Roboto", "Roboto Slab", "Indie Flower", "Lora",
    "Bebas Neue", "Anton", "Libre Baskerville", "Pacifico", "Raleway", "Noto Serif",
    "Abril Fatface", "Caveat", "Black Ops One", "Quicksand", "Permanent Marker",
    "Shadows Into Light", "Nunito", "Arial Black", "Impact", "Verdana", "Helvetica",
    "Times New Roman", "Courier New", "Great Vibes", "Tangerine", "Pinyon Script", "Arial"
].sort();

const fontSizes = [
'8', '10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '42', '48', '54',
'60', '66', '72', '84', '96', '112'
];

// --- NEW: Font & Size Dropdown Population Functions ---
function populateFontDropdowns() {
console.log("Populating font dropdowns...");
const selects = document.querySelectorAll('.font-family-select');
if (selects.length === 0) {
    console.warn("No elements with class 'font-family-select' found.");
    return;
}
selects.forEach(select => {
    // Clear existing options except maybe a placeholder if needed
    // select.innerHTML = '<option value="">Select Font...</option>'; // Optional placeholder
    select.innerHTML = ''; // Clear all
    fontFamilies.forEach(font => {
        const option = document.createElement('option');
        option.value = font;
        option.text = font;
        option.style.fontFamily = font; // Apply font to the option itself for preview
        select.appendChild(option);
    });
});
console.log(`Populated ${selects.length} font dropdowns.`);
}

function populateFontSizeDropdowns() {
console.log("Populating font size dropdowns...");
const selects = document.querySelectorAll('.font-size-select');
 if (selects.length === 0) {
    console.warn("No elements with class 'font-size-select' found.");
    return;
}
selects.forEach(select => {
    // select.innerHTML = '<option value="">Size...</option>'; // Optional placeholder
    select.innerHTML = ''; // Clear all
    fontSizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size; // Store size in points
        option.text = `${size}px`; // Display with "px"
        select.appendChild(option);
    });
});
 console.log(`Populated ${selects.length} font size dropdowns.`);
}
// --- END NEW Population Functions ---


// --- Settings Load/Save ---
function saveCurrentSettings() {
console.log("Attempting to save settings..."); // DEBUG
try {
    const getEl = id => document.getElementById(id);
    const getVal = (id, def) => {
        const el = getEl(id);
        if (!el) {
            console.warn(`Element with ID '${id}' not found in saveCurrentSettings.`);
            return def;
        }
        const val = el.value || def;
        return val;
    };
    const getChecked = id => {
         const el = getEl(id);
         if (!el) {
             console.warn(`Element with ID '${id}' not found in saveCurrentSettings.`);
             return false;
         }
         const val = el.checked || false;
         return val;
    };
    // Helper to get value of checked radio button in a group
    const getRadioVal = (name, def) => {
        const checkedRadio = document.querySelector(`input[name="${name}"]:checked`);
        return checkedRadio ? checkedRadio.value : def;
    };


    const occasionSelect = getEl("occasion");
    // console.log("DEBUG: Got occasionSelect"); // Reduce noise
    const settings = {
        // Section 1: Event Details
        occasion: occasionSelect?.value || '',
        // Store the actual text if it's a custom one for potential display later
        customOccasionText: (occasionSelect?.value.startsWith('custom_') || occasionSelect?.value === 'custom') ? occasionSelect.options[occasionSelect.selectedIndex]?.text : '',
        date: getVal("date", ""),

        // Section 2: Map Location
        latitude: getVal("latitude", ""),
        longitude: getVal("longitude", ""),
        zipCode: getVal("zip-code", ""),

        // Section 3: Customizable Text Layers
        textLayers: [], // Populated below

        // Section 4: Fixed Text Styling
        fixedDateFont: getVal("fixed-font-family-date", 'Arial'),
        fixedDateSize: getVal("fixed-font-size-date", '14'),
        fixedDateBold: getChecked("fixed-text-bold-date"),
        fixedDateItalic: getChecked("fixed-text-italic-date"),
        fixedDateColor: getVal("fixed-font-color-date", '#FFFFFF'),

        fixedCoordsFont: getVal("fixed-font-family-coords", 'Arial'),
        fixedCoordsSize: getVal("fixed-font-size-coords", '14'),
        fixedCoordsBold: getChecked("fixed-text-bold-coords"),
        fixedCoordsItalic: getChecked("fixed-text-italic-coords"),
        fixedCoordsColor: getVal("fixed-font-color-coords", '#FFFFFF'),

        // Section 5: Canvas Settings
        outputWidth: getVal("output-width", '1000'),
        outputHeight: getVal("output-height", '1000'),
        maintainAspectRatio: getChecked("maintain-aspect-ratio"),
        canvasBgColor: getVal("bg-color-canvas", '#F5F5DC'),
        dpi: getRadioVal("dpi", "150"), // Use helper
        imageFormat: getRadioVal("image-format", "png"), // Use helper
        pngTransparency: getChecked("png-transparency"),

        // Section 6: Star Map Image Settings
        starMapStyle: getVal("star-map-style", 'default'),
        circleRadiusPercent: getVal("circle-radius-percent", '90'),
        borderWidth: getVal("border-width", '1'),
        borderColor: getVal("border-color", '#FFFFFF'),

        // Section 8: Zoom
        zoomLevel: getVal("zoom-slider", '100'),

        // Advanced Options
        advancedOptions: typeof window.advancedStyleOptions !== 'undefined' ? { ...window.advancedStyleOptions } : {},

        // Text Placements (Task C)
        textPlacements: {
            entry1: {
                order: getVal('text-placement-order-1', '1'),
                position: getRadioVal('text-placement-pos-1', 'below')
            },
            entry2: {
                order: getVal('text-placement-order-2', '2'),
                position: getRadioVal('text-placement-pos-2', 'below')
            },
            entry3: {
                order: getVal('text-placement-order-3', '3'),
                position: getRadioVal('text-placement-pos-3', 'below')
            },
            date: {
                order: getVal('text-placement-order-date', '4'),
                position: getRadioVal('text-placement-pos-date', 'below')
            },
            coords: {
                order: getVal('text-placement-order-coords', '5'),
                position: getRadioVal('text-placement-pos-coords', 'below')
            }
        },

        timestamp: new Date().getTime()
    };

    // Save text layers
    for (let i = 1; i <= 3; i++) {
        const textInput = getEl(`text-entry-${i}`);
        if (textInput) {
            settings.textLayers.push({
                text: getVal(`text-entry-${i}`, ''),
                fontFamily: getVal(`font-family-${i}`, 'Montserrat'),
                fontSize: getVal(`font-size-${i}`, (i === 1 ? '28' : (i === 2 ? '16' : '14'))),
                fontColor: getVal(`font-color-${i}`, '#FFFFFF'), // Get value from hidden input
                isBold: getChecked(`text-bold-${i}`),
                isItalic: getChecked(`text-italic-${i}`)
            });
        } else {
             console.warn(`DEBUG: Text input text-entry-${i} not found.`);
        }
    }

    console.log("Settings object prepared:", settings);

    let settingsJSON;
    try {
        settingsJSON = JSON.stringify(settings);
    } catch (stringifyError) {
        console.error("Error stringifying settings:", stringifyError);
        alert("Error preparing settings for saving. See console.");
        return;
    }

    try {
        localStorage.setItem('starMapGeneratorSettings', settingsJSON);
        console.log("Settings successfully saved to localStorage.");
        alert("Settings Saved!");
    } catch (storageError) {
        console.error("Error saving settings to localStorage:", storageError);
        alert("Error saving settings to browser storage. Storage might be full or disabled. See console.");
    }

} catch (error) {
    console.error("General error in saveCurrentSettings:", error);
    alert("An unexpected error occurred while saving settings. See console.");
}
}

function loadSavedSettings() {
console.log("Attempting to load settings...");
let savedSettingsJSON = null;
try {
    savedSettingsJSON = localStorage.getItem('starMapGeneratorSettings');
} catch (storageError) {
    console.error("Error retrieving settings from localStorage:", storageError);
    return false;
}

if (!savedSettingsJSON) {
    console.log("No saved settings found in localStorage.");
    return false;
}

let settings;
try {
    settings = JSON.parse(savedSettingsJSON);
} catch (parseError) {
    console.error("Error parsing saved settings JSON:", parseError);
    localStorage.removeItem('starMapGeneratorSettings');
    alert("Error reading saved settings (corrupted data?). Settings have been cleared.");
    return false;
}

try {
    console.log("Applying settings to form...");
    // --- Apply Form Values ---
    const getEl = id => document.getElementById(id);
    const setVal = (id, value) => { if(getEl(id) && value !== undefined && value !== null) getEl(id).value = value; };
    const setChecked = (id, value) => { if(getEl(id) && value !== undefined && value !== null) getEl(id).checked = value; };
    const setRadio = (name, value) => {
        if (value !== undefined && value !== null) {
            const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
            if (radio) radio.checked = true;
        }
    };
    const setColor = (inputId, colorValue) => {
        const input = getEl(inputId);
        const swatch = document.querySelector(`button.color-swatch[data-target="${inputId}"]`);
        const finalColor = colorValue || '#FFFFFF';
        if (input) input.value = finalColor;
        if (swatch) swatch.style.setProperty('background-color', finalColor, 'important');
         else { console.warn(`Color swatch for ${inputId} not found`); }
    };

    const occasionSelect = getEl("occasion");
    if (occasionSelect && settings.occasion) {
         if (settings.occasion.startsWith('custom_') && settings.customOccasionText) {
             let existingOption = occasionSelect.querySelector(`option[value="${settings.occasion}"]`);
             if (!existingOption) {
                 addCustomOccasionOption(settings.customOccasionText, settings.occasion, false);
             }
             occasionSelect.value = settings.occasion;
         } else if (settings.occasion !== 'custom') {
             occasionSelect.value = settings.occasion;
         }
         const customInput = getEl('custom-occasion');
         if(customInput) customInput.style.display = 'none';
    }
    setVal("date", settings.date);
    setVal("latitude", settings.latitude);
    setVal("longitude", settings.longitude);
    setVal("zip-code", settings.zipCode);

    if (settings.textLayers) {
        for (let i = 1; i <= 3; i++) {
            const layer = settings.textLayers[i - 1];
            if (layer) {
                setVal(`text-entry-${i}`, layer.text);
                setVal(`font-family-${i}`, layer.fontFamily);
                setVal(`font-size-${i}`, layer.fontSize);
                setColor(`font-color-${i}`, layer.fontColor);
                setChecked(`text-bold-${i}`, layer.isBold);
                setChecked(`text-italic-${i}`, layer.isItalic);
                const textInput = getEl(`text-entry-${i}`);
                const charCount = getEl(`char-count-${i}`);
                if (textInput && charCount) {
                    const maxLength = textInput.maxLength || 50;
                    charCount.textContent = maxLength - (textInput.value?.length || 0);
                }
            } else {
                 setVal(`text-entry-${i}`, '');
            }
        }
    }

    setVal("fixed-font-family-date", settings.fixedDateFont);
    setVal("fixed-font-size-date", settings.fixedDateSize);
    setChecked("fixed-text-bold-date", settings.fixedDateBold);
    setChecked("fixed-text-italic-date", settings.fixedDateItalic);
    setColor("fixed-font-color-date", settings.fixedDateColor);

    setVal("fixed-font-family-coords", settings.fixedCoordsFont);
    setVal("fixed-font-size-coords", settings.fixedCoordsSize);
    setChecked("fixed-text-bold-coords", settings.fixedCoordsBold);
    setChecked("fixed-text-italic-coords", settings.fixedCoordsItalic);
    setColor("fixed-font-color-coords", settings.fixedCoordsColor);

    setVal("output-width", settings.outputWidth);
    setVal("output-height", settings.outputHeight);
    setChecked("maintain-aspect-ratio", settings.maintainAspectRatio);
    setColor("bg-color-canvas", settings.canvasBgColor);
    setRadio("dpi", settings.dpi);
    setRadio("image-format", settings.imageFormat);
    setChecked("png-transparency", settings.pngTransparency);

    // Apply Star Map Image Settings
    setVal("star-map-style", settings.starMapStyle);
    setVal("circle-radius-percent", settings.circleRadiusPercent);
    setVal("border-width", settings.borderWidth);
    setColor("border-color", settings.borderColor);

    // Apply Text Placement Settings (Task C)
    if (settings.textPlacements) {
        const placementKeys = ['entry1', 'entry2', 'entry3', 'date', 'coords'];
        placementKeys.forEach(key => {
            const placement = settings.textPlacements[key];
            if (placement) {
                // Map 'entry1' -> '1', 'entry2' -> '2', etc. for element IDs
                const keySuffix = key.startsWith('entry') ? key.substring(5) : key;
                setVal(`text-placement-order-${keySuffix}`, placement.order);
                setRadio(`text-placement-pos-${keySuffix}`, placement.position);
            }
        });
        console.log("Text placement settings applied.");
    } else {
        console.log("No text placement settings found in saved data.");
    }


    const imageFormatChangeEvent = new Event('change', { bubbles: true });
    const checkedImageFormatRadio = document.querySelector('input[name="image-format"]:checked');
    if (checkedImageFormatRadio) {
        checkedImageFormatRadio.dispatchEvent(imageFormatChangeEvent);
    } else {
         console.warn("Could not find checked image format radio to dispatch event.");
    }

    const zoomSlider = getEl("zoom-slider");
    const zoomValue = getEl("zoom-value");
    const canvas = getEl("star-map-canvas");
    if (zoomSlider && zoomValue && canvas && settings.zoomLevel) {
        zoomSlider.value = settings.zoomLevel;
        zoomValue.textContent = settings.zoomLevel;
        // Apply zoom transform only if the feature wasn't disabled
        // Check if the transform style was commented out in main_app.js
        // For now, assume it might be active if loaded from settings
        // const scale = settings.zoomLevel / 100;
        // canvas.style.transform = `scale(${scale})`;
        // canvas.style.transformOrigin = "center center";
         console.log("Zoom level loaded, but CSS transform application is disabled in main_app.js");
    }

    if (settings.advancedOptions && typeof window.advancedStyleOptions !== 'undefined') {
        Object.assign(window.advancedStyleOptions, settings.advancedOptions);
        const advancedOptionElements = document.querySelectorAll('#advanced-options-panel input[data-api-param]');
        advancedOptionElements.forEach(el => {
            const paramName = el.getAttribute('data-api-param');
            if (settings.advancedOptions.hasOwnProperty(paramName)) {
                const value = settings.advancedOptions[paramName];
                if (el.type === 'checkbox') {
                    el.checked = value;
                } else {
                    el.value = value;
                    const displaySpan = document.getElementById(`${el.id}-value`);
                    if (displaySpan) displaySpan.textContent = value;
                }
            }
        });
         console.log("Advanced options loaded and UI updated.");
    }

    console.log("Settings applied successfully.");
    // Keep validateInputs commented out
    // if (typeof validateInputs === 'function') { validateInputs(); }
    return true; // Indicate success

} catch (applyError) {
    console.error("Error applying loaded settings:", applyError);
    alert("An error occurred while applying the loaded settings. See console.");
    return false;
}
}

// --- Button Setup (Called from main_app.js) ---
function addLoadSettingsButton() {
const loadBtn = document.getElementById('loadSettingsBtn');
if (loadBtn) {
    if (!loadBtn.dataset.listenerAttached) {
        loadBtn.addEventListener('click', function(event) {
            console.log("Load Settings button clicked.");
            event.preventDefault();
            if (confirm("Load previously saved settings? This will overwrite current selections.")) {
                let loadedSuccessfully;
                try {
                    loadedSuccessfully = loadSavedSettings();
                } catch (loadError) {
                     console.error("Error directly calling loadSavedSettings:", loadError);
                     alert("A critical error occurred trying to load settings.");
                     loadedSuccessfully = false;
                }

                if (!loadedSuccessfully) {
                     alert("No saved settings found or settings were corrupted.");
                } else {
                     alert("Settings Loaded!");
                }
            }
        });
        loadBtn.dataset.listenerAttached = 'true';
        console.log("Load Settings button event listener added.");
    }
} else {
    console.warn("Load Settings button not found in HTML.");
}
}

function addSaveSettingsButton() {
 const saveBtn = document.getElementById('saveSettingsBtn');
 if (saveBtn) {
     if (!saveBtn.dataset.listenerAttached) {
         saveBtn.addEventListener('click', function(event) {
             console.log("Save Settings button clicked.");
             event.preventDefault();
             try {
                 saveCurrentSettings();
             } catch (saveError) {
                  console.error("Error directly calling saveCurrentSettings:", saveError);
                  alert("A critical error occurred trying to save settings.");
             }
         });
         saveBtn.dataset.listenerAttached = 'true';
         console.log("Save Settings button event listener added.");
     }
 } else {
      console.warn("Save Settings button not found in HTML.");
 }
}

// --- Custom Occasion Handling ---
// REMOVED handleOccasionChange function - moved to main_app.js

function addCustomOccasionOption(occasionText, optionValue = null, save = true) {
const occasionSelect = document.getElementById('occasion');
if (!occasionSelect) return;
// Generate a value if none provided (e.g., custom_happy_birthday)
const customOptionValue = optionValue || 'custom_' + occasionText.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

let existingOption = occasionSelect.querySelector(`option[value="${customOptionValue}"]`);

if (!existingOption) {
    const newOption = document.createElement('option');
    newOption.value = customOptionValue;
    newOption.text = occasionText; // Display text
    newOption.dataset.custom = "true"; // Mark as custom

    // Insert before the "Add Your Own..." option
    const addYourOwnOption = occasionSelect.querySelector('option[value="custom"]');
    if (addYourOwnOption) {
        occasionSelect.insertBefore(newOption, addYourOwnOption);
    } else {
        occasionSelect.appendChild(newOption); // Fallback if "Add..." is missing
    }
    existingOption = newOption;
    console.log(`Added custom occasion: "${occasionText}" with value "${customOptionValue}"`);

    if (save) {
        saveCustomOccasions(); // Save the updated list of custom occasions
    }
} else {
     console.log(`Custom occasion "${occasionText}" already exists.`);
}

// Select the newly added or existing custom option
occasionSelect.value = customOptionValue;
// Trigger change event manually if needed by other listeners
// occasionSelect.dispatchEvent(new Event('change'));
}

function loadCustomOccasions() {
const occasionSelect = document.getElementById('occasion');
if (!occasionSelect) return;
const savedOccasions = JSON.parse(localStorage.getItem('customOccasions') || '[]');
const addYourOwnOption = occasionSelect.querySelector('option[value="custom"]');

savedOccasions.forEach(occasion => {
    const value = 'custom_' + occasion.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    // Check if option with this value OR this text already exists
    if (!Array.from(occasionSelect.options).some(opt => opt.value === value || opt.text === occasion)) {
        const newOption = document.createElement('option');
        newOption.value = value;
        newOption.text = occasion;
        newOption.dataset.custom = "true"; // Mark as custom
        if (addYourOwnOption) {
            occasionSelect.insertBefore(newOption, addYourOwnOption);
        } else {
            occasionSelect.appendChild(newOption);
        }
    }
});
 console.log(`Loaded ${savedOccasions.length} custom occasions.`);
}

function saveCustomOccasions() {
const occasionSelect = document.getElementById('occasion');
if (!occasionSelect) return;
// Save only the text of options marked as custom
const customOccasions = Array.from(occasionSelect.options)
                            .filter(opt => opt.dataset.custom === "true") // Filter by data attribute
                            .map(opt => opt.text); // Save the display text
localStorage.setItem('customOccasions', JSON.stringify([...new Set(customOccasions)])); // Ensure uniqueness
console.log("Custom occasions saved:", customOccasions);
}


// --- Utility (Keep if needed, e.g., by load/save) ---
function handleAspectRatio() {
const maintainAspectRatioCheckbox = document.getElementById("maintain-aspect-ratio");
const outputWidthInput = document.getElementById("output-width");
const outputHeightInput = document.getElementById("output-height");

if (maintainAspectRatioCheckbox && outputWidthInput && outputHeightInput) {
    if (maintainAspectRatioCheckbox.checked) {
        const widthVal = parseFloat(outputWidthInput.value);
        const heightVal = parseFloat(outputHeightInput.value);
        if (!isNaN(widthVal) && !isNaN(heightVal) && heightVal !== 0) {
            if (typeof aspectRatio === 'undefined') window.aspectRatio = 1.25;
            aspectRatio = widthVal / heightVal;
            console.log(`Aspect ratio locked: ${aspectRatio}`);
        } else {
            console.warn("Cannot lock aspect ratio with invalid dimensions.");
            maintainAspectRatioCheckbox.checked = false;
        }
    } else {
         console.log("Aspect ratio unlocked");
    }
}
}

console.log("settings.js loaded");
// END OF CODE - Cline - 2025-04-20 15:04 File: js/settings.js