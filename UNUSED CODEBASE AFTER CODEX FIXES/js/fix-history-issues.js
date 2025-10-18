// Fix History Issues - Ensures history functionality works correctly

document.addEventListener('DOMContentLoaded', function() {
    console.log("Applying history fixes");
    
    // Fix for the LOAD SETTINGS button
    const loadSettingsBtn = document.getElementById('loadSettingsBtn');
    if (loadSettingsBtn) {
        // Remove any existing event listeners
        const newLoadSettingsBtn = loadSettingsBtn.cloneNode(true);
        loadSettingsBtn.parentNode.replaceChild(newLoadSettingsBtn, loadSettingsBtn);
        
        // Add a new event listener
        newLoadSettingsBtn.addEventListener('click', function() {
            console.log("Loading all settings from localStorage");
            
            // Load all settings from localStorage
            loadAllSettings();
            
            // Show confirmation
            alert("Settings loaded successfully!");
        });
    }
    
    // Set up event listeners to save settings when inputs change
    setupSaveEventListeners();
    
    console.log("History fixes applied");
});

// Function to load all settings from localStorage
function loadAllSettings() {
    try {
        // Load text entry history
        loadTextEntryHistory();
        
        // Load ZIP code history
        loadZipCodeHistory();
        
        // Load saved settings
        const savedSettings = localStorage.getItem('starMapSettings');
        if (!savedSettings) {
            console.log("No saved settings found");
            return;
        }
        
        const settings = JSON.parse(savedSettings);
        
        // Apply settings to form fields
        if (settings.occasion) document.getElementById('occasion').value = settings.occasion;
        if (settings.date) document.getElementById('date').value = settings.date;
        
        // Text entries
        if (settings.text1) document.getElementById('text-entry-1').value = settings.text1;
        if (settings.text2) document.getElementById('text-entry-2').value = settings.text2;
        if (settings.text3) document.getElementById('text-entry-3').value = settings.text3;
        
        // Font families
        if (settings.fontFamily1) document.getElementById('font-family-1').value = settings.fontFamily1;
        if (settings.fontFamily2) document.getElementById('font-family-2').value = settings.fontFamily2;
        if (settings.fontFamily3) document.getElementById('font-family-3').value = settings.fontFamily3;
        
        // Font sizes
        if (settings.fontSize1) document.getElementById('font-size-1').value = settings.fontSize1;
        if (settings.fontSize2) document.getElementById('font-size-2').value = settings.fontSize2;
        if (settings.fontSize3) document.getElementById('font-size-3').value = settings.fontSize3;
        
        // Bold/italic
        if (settings.textBold1 !== undefined) document.getElementById('text-bold-1').checked = settings.textBold1;
        if (settings.textBold2 !== undefined) document.getElementById('text-bold-2').checked = settings.textBold2;
        if (settings.textBold3 !== undefined) document.getElementById('text-bold-3').checked = settings.textBold3;
        if (settings.textItalic1 !== undefined) document.getElementById('text-italic-1').checked = settings.textItalic1;
        if (settings.textItalic2 !== undefined) document.getElementById('text-italic-2').checked = settings.textItalic2;
        if (settings.textItalic3 !== undefined) document.getElementById('text-italic-3').checked = settings.textItalic3;
        
        // Font colors
        if (settings.fontColor1) document.getElementById('font-color-1').value = settings.fontColor1;
        if (settings.fontColor2) document.getElementById('font-color-2').value = settings.fontColor2;
        if (settings.fontColor3) document.getElementById('font-color-3').value = settings.fontColor3;
        
        // Fixed text styling
        if (settings.fixedDateFont) document.getElementById('fixed-date-font').value = settings.fixedDateFont;
        if (settings.fixedDateSize) document.getElementById('fixed-date-size').value = settings.fixedDateSize;
        if (settings.fixedDateBold !== undefined) document.getElementById('fixed-date-bold').checked = settings.fixedDateBold;
        if (settings.fixedDateItalic !== undefined) document.getElementById('fixed-date-italic').checked = settings.fixedDateItalic;
        if (settings.fixedDateColor) document.getElementById('fixed-date-color').value = settings.fixedDateColor;
        
        if (settings.fixedCoordsFont) document.getElementById('fixed-coords-font').value = settings.fixedCoordsFont;
        if (settings.fixedCoordsSize) document.getElementById('fixed-coords-size').value = settings.fixedCoordsSize;
        if (settings.fixedCoordsBold !== undefined) document.getElementById('fixed-coords-bold').checked = settings.fixedCoordsBold;
        if (settings.fixedCoordsItalic !== undefined) document.getElementById('fixed-coords-italic').checked = settings.fixedCoordsItalic;
        if (settings.fixedCoordsColor) document.getElementById('fixed-coords-color').value = settings.fixedCoordsColor;
        
        // Coordinates
        if (settings.latitude) document.getElementById('latitude').value = settings.latitude;
        if (settings.longitude) document.getElementById('longitude').value = settings.longitude;
        if (settings.zipCode) document.getElementById('zip-code').value = settings.zipCode;
        
        // Colors
        if (settings.starFieldColor) document.getElementById('star-field-color').value = settings.starFieldColor;
        if (settings.outsideColor) document.getElementById('outside-color').value = settings.outsideColor;
        
        // Image type
        if (settings.imageType) {
            const imageTypeRadio = document.querySelector(`input[name="imageType"][value="${settings.imageType}"]`);
            if (imageTypeRadio) imageTypeRadio.checked = true;
        }
        
        // Transparency
        if (settings.transparency !== undefined) document.getElementById('export-transparency').checked = settings.transparency;
        
        // DPI
        if (settings.dpi) {
            const dpiRadio = document.querySelector(`input[name="dpi"][value="${settings.dpi}"]`);
            if (dpiRadio) dpiRadio.checked = true;
        }
        
        // Output dimensions
        if (settings.outputWidth) document.getElementById('output-width').value = settings.outputWidth;
        if (settings.outputHeight) document.getElementById('output-height').value = settings.outputHeight;
        if (settings.maintainAspectRatio !== undefined) document.getElementById('maintain-aspect-ratio').checked = settings.maintainAspectRatio;
        
        // Zoom level
        if (settings.zoomLevel) {
            const zoomSlider = document.getElementById('zoom-slider');
            const zoomValue = document.getElementById('zoom-value');
            if (zoomSlider && zoomValue) {
                zoomSlider.value = settings.zoomLevel;
                zoomValue.textContent = settings.zoomLevel;
            }
        }
        
        // Star map style
        if (settings.starMapStyle) {
            const starMapStyle = document.getElementById('star-map-style');
            if (starMapStyle) starMapStyle.value = settings.starMapStyle;
        }
        
        console.log("Settings loaded successfully");
    } catch (error) {
        console.error("Error loading settings:", error);
    }
}

// Function to load text entry history
function loadTextEntryHistory() {
    try {
        // Load history for text entry #1
        const history1 = localStorage.getItem('textEntry1History');
        if (history1) {
            const entries1 = JSON.parse(history1);
            const datalist1 = document.getElementById('text-entry-1-history');
            if (datalist1) {
                datalist1.innerHTML = '';
                entries1.forEach(entry => {
                    const option = document.createElement('option');
                    option.value = entry;
                    datalist1.appendChild(option);
                });
                console.log(`Loaded history for text entry #1: ${entries1.length} items`);
            }
        }
        
        // Load history for text entry #2
        const history2 = localStorage.getItem('textEntry2History');
        if (history2) {
            const entries2 = JSON.parse(history2);
            const datalist2 = document.getElementById('text-entry-2-history');
            if (datalist2) {
                datalist2.innerHTML = '';
                entries2.forEach(entry => {
                    const option = document.createElement('option');
                    option.value = entry;
                    datalist2.appendChild(option);
                });
                console.log(`Loaded history for text entry #2: ${entries2.length} items`);
            }
        }
        
        // Load history for text entry #3
        const history3 = localStorage.getItem('textEntry3History');
        if (history3) {
            const entries3 = JSON.parse(history3);
            const datalist3 = document.getElementById('text-entry-3-history');
            if (datalist3) {
                datalist3.innerHTML = '';
                entries3.forEach(entry => {
                    const option = document.createElement('option');
                    option.value = entry;
                    datalist3.appendChild(option);
                });
                console.log(`Loaded history for text entry #3: ${entries3.length} items`);
            }
        }
    } catch (error) {
        console.error("Error loading text entry history:", error);
    }
}

// Function to load ZIP code history
function loadZipCodeHistory() {
    try {
        const zipCodeHistory = localStorage.getItem('zipCodeHistory');
        if (zipCodeHistory) {
            const zipCodes = JSON.parse(zipCodeHistory);
            const datalist = document.getElementById('zip-code-history');
            if (datalist) {
                datalist.innerHTML = '';
                zipCodes.forEach(zipCode => {
                    const option = document.createElement('option');
                    option.value = zipCode;
                    datalist.appendChild(option);
                });
                console.log(`Loaded ZIP code history: ${zipCodes.length} items`);
            }
        }
    } catch (error) {
        console.error("Error loading ZIP code history:", error);
    }
}

// Function to set up event listeners to save settings when inputs change
function setupSaveEventListeners() {
    console.log("Setting up save event listeners");
    
    // Get all form inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    
    // Add event listeners to each input
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            saveAllSettings();
        });
    });
    
    console.log("Save event listeners set up");
}

// Function to save all settings to localStorage
function saveAllSettings() {
    try {
        console.log("Saving all settings to localStorage");
        
        const settings = {
            // Basic info
            occasion: document.getElementById('occasion')?.value,
            date: document.getElementById('date')?.value,
            
            // Text entries
            text1: document.getElementById('text-entry-1')?.value,
            text2: document.getElementById('text-entry-2')?.value,
            text3: document.getElementById('text-entry-3')?.value,
            
            // Font families
            fontFamily1: document.getElementById('font-family-1')?.value,
            fontFamily2: document.getElementById('font-family-2')?.value,
            fontFamily3: document.getElementById('font-family-3')?.value,
            
            // Font sizes
            fontSize1: document.getElementById('font-size-1')?.value,
            fontSize2: document.getElementById('font-size-2')?.value,
            fontSize3: document.getElementById('font-size-3')?.value,
            
            // Bold/italic
            textBold1: document.getElementById('text-bold-1')?.checked,
            textBold2: document.getElementById('text-bold-2')?.checked,
            textBold3: document.getElementById('text-bold-3')?.checked,
            textItalic1: document.getElementById('text-italic-1')?.checked,
            textItalic2: document.getElementById('text-italic-2')?.checked,
            textItalic3: document.getElementById('text-italic-3')?.checked,
            
            // Font colors
            fontColor1: document.getElementById('font-color-1')?.value,
            fontColor2: document.getElementById('font-color-2')?.value,
            fontColor3: document.getElementById('font-color-3')?.value,
            
            // Fixed text styling
            fixedDateFont: document.getElementById('fixed-date-font')?.value,
            fixedDateSize: document.getElementById('fixed-date-size')?.value,
            fixedDateBold: document.getElementById('fixed-date-bold')?.checked,
            fixedDateItalic: document.getElementById('fixed-date-italic')?.checked,
            fixedDateColor: document.getElementById('fixed-date-color')?.value,
            
            fixedCoordsFont: document.getElementById('fixed-coords-font')?.value,
            fixedCoordsSize: document.getElementById('fixed-coords-size')?.value,
            fixedCoordsBold: document.getElementById('fixed-coords-bold')?.checked,
            fixedCoordsItalic: document.getElementById('fixed-coords-italic')?.checked,
            fixedCoordsColor: document.getElementById('fixed-coords-color')?.value,
            
            // Coordinates
            latitude: document.getElementById('latitude')?.value,
            longitude: document.getElementById('longitude')?.value,
            zipCode: document.getElementById('zip-code')?.value,
            
            // Colors
            starFieldColor: document.getElementById('star-field-color')?.value,
            outsideColor: document.getElementById('outside-color')?.value,
            
            // Image type
            imageType: document.querySelector('input[name="imageType"]:checked')?.value,
            
            // Transparency
            transparency: document.getElementById('export-transparency')?.checked,
            
            // DPI
            dpi: document.querySelector('input[name="dpi"]:checked')?.value,
            
            // Output dimensions
            outputWidth: document.getElementById('output-width')?.value,
            outputHeight: document.getElementById('output-height')?.value,
            maintainAspectRatio: document.getElementById('maintain-aspect-ratio')?.checked,
            
            // Zoom level
            zoomLevel: document.getElementById('zoom-slider')?.value,
            
            // Star map style
            starMapStyle: document.getElementById('star-map-style')?.value,
            
            // Timestamp
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('starMapSettings', JSON.stringify(settings));
        
        // Save text entry history
        saveTextEntryHistory();
        
        // Save ZIP code history
        saveZipCodeHistory();
        
        console.log("Settings saved:", settings);
    } catch (error) {
        console.error("Error saving settings:", error);
    }
}

// Function to save text entry history
function saveTextEntryHistory() {
    try {
        // Save history for text entry #1
        const text1 = document.getElementById('text-entry-1')?.value;
        if (text1) {
            let history1 = localStorage.getItem('textEntry1History');
            let entries1 = history1 ? JSON.parse(history1) : [];
            
            // Add new entry if it doesn't exist
            if (!entries1.includes(text1)) {
                entries1.push(text1);
                
                // Limit to 10 entries
                if (entries1.length > 10) {
                    entries1 = entries1.slice(-10);
                }
                
                // Save to localStorage
                localStorage.setItem('textEntry1History', JSON.stringify(entries1));
                
                // Update datalist
                const datalist1 = document.getElementById('text-entry-1-history');
                if (datalist1) {
                    datalist1.innerHTML = '';
                    entries1.forEach(entry => {
                        const option = document.createElement('option');
                        option.value = entry;
                        datalist1.appendChild(option);
                    });
                }
            }
        }
        
        // Save history for text entry #2
        const text2 = document.getElementById('text-entry-2')?.value;
        if (text2) {
            let history2 = localStorage.getItem('textEntry2History');
            let entries2 = history2 ? JSON.parse(history2) : [];
            
            // Add new entry if it doesn't exist
            if (!entries2.includes(text2)) {
                entries2.push(text2);
                
                // Limit to 10 entries
                if (entries2.length > 10) {
                    entries2 = entries2.slice(-10);
                }
                
                // Save to localStorage
                localStorage.setItem('textEntry2History', JSON.stringify(entries2));
                
                // Update datalist
                const datalist2 = document.getElementById('text-entry-2-history');
                if (datalist2) {
                    datalist2.innerHTML = '';
                    entries2.forEach(entry => {
                        const option = document.createElement('option');
                        option.value = entry;
                        datalist2.appendChild(option);
                    });
                }
            }
        }
        
        // Save history for text entry #3
        const text3 = document.getElementById('text-entry-3')?.value;
        if (text3) {
            let history3 = localStorage.getItem('textEntry3History');
            let entries3 = history3 ? JSON.parse(history3) : [];
            
            // Add new entry if it doesn't exist
            if (!entries3.includes(text3)) {
                entries3.push(text3);
                
                // Limit to 10 entries
                if (entries3.length > 10) {
                    entries3 = entries3.slice(-10);
                }
                
                // Save to localStorage
                localStorage.setItem('textEntry3History', JSON.stringify(entries3));
                
                // Update datalist
                const datalist3 = document.getElementById('text-entry-3-history');
                if (datalist3) {
                    datalist3.innerHTML = '';
                    entries3.forEach(entry => {
                        const option = document.createElement('option');
                        option.value = entry;
                        datalist3.appendChild(option);
                    });
                }
            }
        }
    } catch (error) {
        console.error("Error saving text entry history:", error);
    }
}

// Function to save ZIP code history
function saveZipCodeHistory() {
    try {
        const zipCode = document.getElementById('zip-code')?.value;
        if (zipCode) {
            let zipCodeHistory = localStorage.getItem('zipCodeHistory');
            let zipCodes = zipCodeHistory ? JSON.parse(zipCodeHistory) : [];
            
            // Add new zip code if it doesn't exist
            if (!zipCodes.includes(zipCode)) {
                zipCodes.push(zipCode);
                
                // Limit to 10 zip codes
                if (zipCodes.length > 10) {
                    zipCodes = zipCodes.slice(-10);
                }
                
                // Save to localStorage
                localStorage.setItem('zipCodeHistory', JSON.stringify(zipCodes));
                
                // Update datalist
                const datalist = document.getElementById('zip-code-history');
                if (datalist) {
                    datalist.innerHTML = '';
                    zipCodes.forEach(code => {
                        const option = document.createElement('option');
                        option.value = code;
                        datalist.appendChild(option);
                    });
                }
            }
        }
    } catch (error) {
        console.error("Error saving ZIP code history:", error);
    }
}

// Auto-load settings when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("Auto-loading settings");
    loadAllSettings();
});
