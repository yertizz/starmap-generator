// Settings Manager - Handles saving and loading all map settings

// Function to save all current settings to localStorage
function saveCurrentSettings() {
    const settings = {
        // Form values
        occasion: document.getElementById("occasion").value,
        occasionText: document.getElementById("occasion").options[document.getElementById("occasion").selectedIndex]?.text || "",
        customOccasion: document.getElementById("occasion").getAttribute('data-custom-value') || '',
        date: document.getElementById("date").value,
        latitude: document.getElementById("latitude").value,
        longitude: document.getElementById("longitude").value,
        
        // Text layers
        textLayers: [],
        
        // Fixed text styling
        fixedDateFont: document.getElementById("fixed-date-font").value,
        fixedDateSize: document.getElementById("fixed-date-size").value,
        fixedDateBold: document.getElementById("fixed-date-bold").checked,
        fixedDateItalic: document.getElementById("fixed-date-italic").checked,
        fixedDateColor: document.getElementById("fixed-date-color").value,
        
        fixedCoordsFont: document.getElementById("fixed-coords-font").value,
        fixedCoordsSize: document.getElementById("fixed-coords-size").value,
        fixedCoordsBold: document.getElementById("fixed-coords-bold").checked,
        fixedCoordsItalic: document.getElementById("fixed-coords-italic").checked,
        fixedCoordsColor: document.getElementById("fixed-coords-color").value,
        
        // Output settings
        dpi: document.querySelector('input[name="dpi"]:checked')?.value || "150",
        outputWidth: document.getElementById("output-width").value,
        outputHeight: document.getElementById("output-height").value,
        maintainAspectRatio: document.getElementById("maintain-aspect-ratio").checked,
        
        // Background colors
        starFieldColor: document.getElementById("star-field-color").value,
        outsideColor: document.getElementById("outside-color").value,
        
        // Image format
        imageType: document.querySelector('input[name="imageType"]:checked')?.value || "png",
        exportTransparency: document.getElementById("export-transparency").checked,
        
        // Zoom level
        zoomLevel: document.getElementById("zoom-slider").value,
        
        // Save timestamp
        timestamp: new Date().getTime()
    };
    
    // Save text layers
    for (let i = 1; i <= 3; i++) {
        const text = document.getElementById(`text-entry-${i}`).value;
        if (text) {
            settings.textLayers.push({
                text: text,
                fontFamily: document.getElementById(`font-family-${i}`).value,
                fontSize: document.getElementById(`font-size-${i}`).value,
                fontColor: document.getElementById(`font-color-${i}`).value,
                isBold: document.getElementById(`text-bold-${i}`).checked,
                isItalic: document.getElementById(`text-italic-${i}`).checked
            });
        }
    }
    
    // Save to localStorage
    localStorage.setItem('lastMapSettings', JSON.stringify(settings));
    console.log("Settings saved:", settings);
}

// Function to load saved settings
function loadSavedSettings() {
    const savedSettings = localStorage.getItem('lastMapSettings');
    if (!savedSettings) return false;
    
    try {
        const settings = JSON.parse(savedSettings);
        console.log("Loading saved settings:", settings);
        
        // Set default dimensions if not already set
        if (!document.getElementById("output-width").value || 
            document.getElementById("output-width").value === "800") {
            document.getElementById("output-width").value = "3540";
        }
        
        if (!document.getElementById("output-height").value || 
            document.getElementById("output-height").value === "1000") {
            document.getElementById("output-height").value = "3186";
        }
        
        // Apply form values
        if (settings.occasion) {
            // First check if the occasion exists in the dropdown
            const occasionSelect = document.getElementById("occasion");
            let found = false;
            
            // Try to find the option by value
            for (let i = 0; i < occasionSelect.options.length; i++) {
                if (occasionSelect.options[i].value === settings.occasion) {
                    occasionSelect.selectedIndex = i;
                    found = true;
                    break;
                }
            }
            
            // If not found by value, try to find by text
            if (!found && settings.occasionText) {
                for (let i = 0; i < occasionSelect.options.length; i++) {
                    if (occasionSelect.options[i].text === settings.occasionText) {
                        occasionSelect.selectedIndex = i;
                        found = true;
                        break;
                    }
                }
            }
            
            // If still not found and it's a custom occasion, try to add it
            if (!found && settings.customOccasion) {
                // Find the "Add Your Own..." option
                const customOptionIndex = Array.from(occasionSelect.options).findIndex(option => option.value === 'custom');
                
                if (customOptionIndex !== -1) {
                    // Create a new option for the custom occasion
                    const newOption = document.createElement('option');
                    newOption.value = 'custom_' + settings.customOccasion.replace(/\s+/g, '_').toLowerCase();
                    newOption.text = settings.customOccasion;
                    newOption.className = 'custom-occasion';
                    
                    // Insert before the "Add Your Own..." option
                    occasionSelect.insertBefore(newOption, occasionSelect.options[customOptionIndex]);
                    
                    // Select the new option
                    occasionSelect.value = newOption.value;
                    
                    // Store the custom value as a data attribute
                    occasionSelect.setAttribute('data-custom-value', settings.customOccasion);
                    
                    // Save custom occasions to localStorage
                    if (typeof saveCustomOccasions === 'function') {
                        saveCustomOccasions();
                    }
                }
            }
            
            // If we couldn't find or add the occasion, just set the value directly
            if (!found) {
                occasionSelect.value = settings.occasion;
            }
            
            // Store as previous value
            occasionSelect.setAttribute('data-previous-value', occasionSelect.value);
        }
        
        if (settings.date) document.getElementById("date").value = settings.date;
        if (settings.latitude) document.getElementById("latitude").value = settings.latitude;
        if (settings.longitude) document.getElementById("longitude").value = settings.longitude;
        
        // Apply text layers
        if (settings.textLayers && settings.textLayers.length > 0) {
            settings.textLayers.forEach((layer, index) => {
                const i = index + 1;
                if (i <= 3) {
                    document.getElementById(`text-entry-${i}`).value = layer.text;
                    document.getElementById(`font-family-${i}`).value = layer.fontFamily;
                    document.getElementById(`font-size-${i}`).value = layer.fontSize;
                    document.getElementById(`font-color-${i}`).value = layer.fontColor;
                    document.getElementById(`text-bold-${i}`).checked = layer.isBold;
                    document.getElementById(`text-italic-${i}`).checked = layer.isItalic;
                    
                    // Update character count
                    updateCharCount(document.getElementById(`text-entry-${i}`), `char-count-${i}`);
                }
            });
        }
        
        // Apply fixed text styling
        if (settings.fixedDateFont) document.getElementById("fixed-date-font").value = settings.fixedDateFont;
        if (settings.fixedDateSize) document.getElementById("fixed-date-size").value = settings.fixedDateSize;
        if (settings.fixedDateBold !== undefined) document.getElementById("fixed-date-bold").checked = settings.fixedDateBold;
        if (settings.fixedDateItalic !== undefined) document.getElementById("fixed-date-italic").checked = settings.fixedDateItalic;
        if (settings.fixedDateColor) document.getElementById("fixed-date-color").value = settings.fixedDateColor;
        
        if (settings.fixedCoordsFont) document.getElementById("fixed-coords-font").value = settings.fixedCoordsFont;
        if (settings.fixedCoordsSize) document.getElementById("fixed-coords-size").value = settings.fixedCoordsSize;
        if (settings.fixedCoordsBold !== undefined) document.getElementById("fixed-coords-bold").checked = settings.fixedCoordsBold;
        if (settings.fixedCoordsItalic !== undefined) document.getElementById("fixed-coords-italic").checked = settings.fixedCoordsItalic;
        if (settings.fixedCoordsColor) document.getElementById("fixed-coords-color").value = settings.fixedCoordsColor;
        
        // Apply output settings
        if (settings.dpi) {
            const dpiRadio = document.querySelector(`input[name="dpi"][value="${settings.dpi}"]`);
            if (dpiRadio) dpiRadio.checked = true;
        }
        
        if (settings.outputWidth) document.getElementById("output-width").value = settings.outputWidth;
        if (settings.outputHeight) document.getElementById("output-height").value = settings.outputHeight;
        if (settings.maintainAspectRatio !== undefined) {
            document.getElementById("maintain-aspect-ratio").checked = settings.maintainAspectRatio;
            handleAspectRatio(); // Update aspect ratio handling
        }
        
        // Apply background colors
        if (settings.starFieldColor) {
            document.getElementById("star-field-color").value = settings.starFieldColor;
            starFieldColor = settings.starFieldColor;
            document.getElementById("star-field-color").style.backgroundColor = settings.starFieldColor;
        }
        
        if (settings.outsideColor) {
            document.getElementById("outside-color").value = settings.outsideColor;
            outsideColor = settings.outsideColor;
            document.getElementById("outside-color").style.backgroundColor = settings.outsideColor;
        }
        
        // Apply image format
        if (settings.imageType) {
            const imageTypeRadio = document.querySelector(`input[name="imageType"][value="${settings.imageType}"]`);
            if (imageTypeRadio) imageTypeRadio.checked = true;
        }
        
        if (settings.exportTransparency !== undefined) {
            document.getElementById("export-transparency").checked = settings.exportTransparency;
            
            // Update disabled state based on image type
            if (document.getElementById("image-type-jpg").checked) {
                document.getElementById("export-transparency").disabled = true;
                document.getElementById("export-transparency").parentElement.classList.add("disabled");
            } else {
                document.getElementById("export-transparency").disabled = false;
                document.getElementById("export-transparency").parentElement.classList.remove("disabled");
            }
        }
        
        // Apply zoom level
        if (settings.zoomLevel) {
            document.getElementById("zoom-slider").value = settings.zoomLevel;
            document.getElementById("zoom-value").textContent = settings.zoomLevel;
            
            const canvas = document.getElementById("star-map-canvas");
            if (canvas) {
                const scale = settings.zoomLevel / 100;
                canvas.style.transform = `scale(${scale})`;
                canvas.style.transformOrigin = "center top";
            }
        }
        
        // Enable the generate button if all required fields are filled
        validateInputs();
        
        return true;
    } catch (error) {
        console.error("Error loading saved settings:", error);
        return false;
    }
}

// Add a button to load the last saved settings
function addLoadSettingsButton() {
    // Check if the button already exists
    if (document.getElementById('loadSettingsBtn')) return;
    
    // Create the button
    const loadBtn = document.createElement('button');
    loadBtn.id = 'loadSettingsBtn';
    loadBtn.type = 'button';
    loadBtn.textContent = 'LOAD PREVIOUS SETTINGS';
    loadBtn.className = 'load-settings-button';
    
    // Add event listener
    loadBtn.addEventListener('click', function(event) {
        event.preventDefault();
        loadSavedSettings();
    });
    
    // Get the button container
    const buttonContainer = document.querySelector('.button-container');
    if (buttonContainer) {
        // Add the button before the generate button
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            // Center both buttons in the container
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'center';
            buttonContainer.style.alignItems = 'center';
            buttonContainer.style.gap = '20px';
            buttonContainer.style.flexWrap = 'wrap';
            
            // Insert the load button before the generate button
            buttonContainer.insertBefore(loadBtn, generateBtn);
            
            // Ensure both buttons have the same height
            loadBtn.style.height = getComputedStyle(generateBtn).height;
        }
    } else {
        // Fallback if button container not found
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn && generateBtn.parentNode) {
            // Create a new container for both buttons
            const newContainer = document.createElement('div');
            newContainer.className = 'button-container';
            newContainer.style.display = 'flex';
            newContainer.style.justifyContent = 'center';
            newContainer.style.alignItems = 'center';
            newContainer.style.gap = '20px';
            newContainer.style.flexWrap = 'wrap';
            newContainer.style.margin = '20px 0';
            
            // Replace the generate button with the container
            const parent = generateBtn.parentNode;
            parent.replaceChild(newContainer, generateBtn);
            
            // Add both buttons to the container
            newContainer.appendChild(loadBtn);
            newContainer.appendChild(generateBtn);
        }
    }
}

// Initialize settings manager
document.addEventListener('DOMContentLoaded', function() {
    // Set default dimensions to 3540 x 3186
    document.getElementById("output-width").value = "3540";
    document.getElementById("output-height").value = "3186";
    
    // Add the load settings button
    addLoadSettingsButton();
    
    // Try to load saved settings automatically
    const loadSettingsAutomatically = true; // Set to false to disable automatic loading
    if (loadSettingsAutomatically) {
        // Wait a short time to ensure all other initialization is complete
        setTimeout(function() {
            loadSavedSettings();
        }, 500);
    }
    
    // Hook into the generate button to save settings
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        // Store the original click handler
        const originalClickHandler = generateBtn.onclick;
        
        // Set a new click handler that saves settings first
        generateBtn.onclick = function(event) {
            // Save current settings
            saveCurrentSettings();
            
            // Call the original handler if it exists
            if (typeof originalClickHandler === 'function') {
                originalClickHandler.call(this, event);
            }
        };
    }
    
    // CSS for the settings button is now in settings-button.css
});
