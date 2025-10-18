// Settings Management for Star Map Generator

// --- Global Variables (Reference only - defined in main_app.js) ---
// let aspectRatio = 1.25;
// const advancedStyleOptions = { ... }; // Assumed to be globally available

// --- Settings Load/Save ---
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
            zipCode: document.getElementById("zip-code")?.value || '',

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

            // Save advanced options as well (ensure advancedStyleOptions is accessible)
            advancedOptions: typeof advancedStyleOptions !== 'undefined' ? { ...advancedStyleOptions } : {},

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
             if (settings.customOccasion && settings.occasion.startsWith('custom_')) {
                 if (typeof addCustomOccasionOption === 'function') {
                    addCustomOccasionOption(settings.customOccasion, settings.occasion, false);
                 }
                 occasionSelect.value = settings.occasion;
                 occasionSelect.setAttribute('data-custom-value', settings.customOccasion);
             } else {
                 occasionSelect.value = settings.occasion;
             }
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
            // Update global variable if it exists
            if (typeof starFieldColor !== 'undefined') starFieldColor = settings.starFieldColor;
             if (starFieldColorInput._picker) starFieldColorInput._picker.setColor(settings.starFieldColor, true);
             else starFieldColorInput.style.backgroundColor = settings.starFieldColor;
        }
        if (outsideColorInput && settings.outsideColor) {
            outsideColorInput.value = settings.outsideColor;
             if (typeof outsideColor !== 'undefined') outsideColor = settings.outsideColor;
             if (outsideColorInput._picker) outsideColorInput._picker.setColor(settings.outsideColor, true);
             else outsideColorInput.style.backgroundColor = settings.outsideColor;
        }

        // --- Apply Image Format ---
        if (settings.imageType) {
            const imageTypeRadio = document.querySelector(`input[name="imageType"][value="${settings.imageType}"]`);
            if (imageTypeRadio) imageTypeRadio.checked = true;
        }
        const exportTransparencyCheckbox = document.getElementById("export-transparency");
        if (exportTransparencyCheckbox && settings.exportTransparency !== undefined) {
            exportTransparencyCheckbox.checked = settings.exportTransparency;
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
              if (typeof currentStarMapStyle !== 'undefined') currentStarMapStyle = settings.starMapStyle;
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
        if (settings.advancedOptions && typeof advancedStyleOptions !== 'undefined') {
            Object.assign(advancedStyleOptions, settings.advancedOptions);
            if (typeof loadAdvancedOptionsUI === 'function') {
                loadAdvancedOptionsUI(settings.advancedOptions);
            }
        }

        console.log("Settings applied successfully.");
        if (typeof validateInputs === 'function') validateInputs(); // Re-validate inputs after loading
        return true;

    } catch (error) {
        console.error("Error loading saved settings:", error);
        localStorage.removeItem('lastMapSettings'); // Clear corrupted settings
        return false;
    }
}

function addLoadSettingsButton() {
    const buttonContainer = document.querySelector('.button-container');
    if (!buttonContainer || document.getElementById('loadSettingsBtn')) return;

    const loadBtn = document.createElement('button');
    loadBtn.id = 'loadSettingsBtn';
    loadBtn.type = 'button';
    loadBtn.textContent = 'LOAD SETTINGS';
    loadBtn.className = 'settings-button load-button';

    loadBtn.addEventListener('click', function(event) {
        event.preventDefault();
        if (confirm("Load previously saved settings? This will overwrite current selections.")) {
            if(loadSavedSettings()) {
                 if (typeof showTemporaryMessage === 'function') showTemporaryMessage("Settings Loaded!");
            } else {
                 alert("Could not load settings.");
            }
        }
    });

    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        buttonContainer.insertBefore(loadBtn, generateBtn);
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '10px';
    }
}

function addSaveSettingsButton() {
    const buttonContainer = document.querySelector('.button-container');
     if (!buttonContainer || document.getElementById('saveSettingsBtn')) return;

    const saveBtn = document.createElement('button');
    saveBtn.id = 'saveSettingsBtn';
    saveBtn.type = 'button';
    saveBtn.textContent = 'SAVE SETTINGS';
    saveBtn.className = 'settings-button save-button';

    saveBtn.addEventListener('click', function(event) {
        event.preventDefault();
        saveCurrentSettings();
        if (typeof showTemporaryMessage === 'function') showTemporaryMessage("Settings Saved!");
    });

    const loadBtn = document.getElementById('loadSettingsBtn');
    const generateBtn = document.getElementById('generateBtn');
    if (loadBtn) {
        loadBtn.insertAdjacentElement('afterend', saveBtn);
    } else if (generateBtn) {
         buttonContainer.insertBefore(saveBtn, generateBtn);
    }
     buttonContainer.style.display = 'flex';
     buttonContainer.style.justifyContent = 'center';
     buttonContainer.style.gap = '10px';
}

// --- Aspect Ratio Handling ---
function handleAspectRatio() {
    const maintainAspectRatioCheckbox = document.getElementById("maintain-aspect-ratio");
    const outputWidthInput = document.getElementById("output-width");
    const outputHeightInput = document.getElementById("output-height");

    if (maintainAspectRatioCheckbox && outputWidthInput && outputHeightInput) {
        if (maintainAspectRatioCheckbox.checked) {
            const widthVal = parseFloat(outputWidthInput.value);
            const heightVal = parseFloat(outputHeightInput.value);
            if (!isNaN(widthVal) && !isNaN(heightVal) && heightVal !== 0) {
                // Use global aspectRatio variable if available, otherwise calculate
                if (typeof aspectRatio === 'undefined') window.aspectRatio = 1.25; // Define if not exists
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
            occasionSelect.value = occasionSelect.getAttribute('data-previous-value') || '';
        }
    }
    occasionSelect.setAttribute('data-previous-value', occasionSelect.value);
    if (typeof validateInputs === 'function') validateInputs();
}

function addCustomOccasionOption(occasionText, optionValue = null, save = true) {
    const occasionSelect = document.getElementById('occasion');
    if (!occasionSelect) return;
    const customOptionValue = optionValue || 'custom_' + occasionText.replace(/\s+/g, '_').toLowerCase();

    let existingOption = Array.from(occasionSelect.options).find(opt => opt.value === customOptionValue);

    if (!existingOption) {
        const newOption = document.createElement('option');
        newOption.value = customOptionValue;
        newOption.text = occasionText;
        newOption.className = 'custom-occasion';

        const customAddOption = occasionSelect.querySelector('option[value="custom"]');
        if (customAddOption) {
            occasionSelect.insertBefore(newOption, customAddOption);
        } else {
            occasionSelect.appendChild(newOption);
        }
        existingOption = newOption;

        if (save) {
            saveCustomOccasions();
        }
    }

    occasionSelect.value = customOptionValue;
    occasionSelect.setAttribute('data-custom-value', occasionText);
}

function loadCustomOccasions() {
    const occasionSelect = document.getElementById('occasion');
    if (!occasionSelect) return;
    const savedOccasions = JSON.parse(localStorage.getItem('customOccasions') || '[]');
    const customAddOption = occasionSelect.querySelector('option[value="custom"]');

    savedOccasions.forEach(occasion => {
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
    localStorage.setItem('customOccasions', JSON.stringify([...new Set(customOccasions)]));
}

console.log("settings.js loaded");
