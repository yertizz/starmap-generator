// Save Settings - Handles saving settings to localStorage

document.addEventListener('DOMContentLoaded', function() {
    console.log("Save Settings script loaded");
    
    // Get the save settings button
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (!saveSettingsBtn) {
        console.error("Save settings button not found");
        return;
    }
    
    // Add event listener to the save settings button
    saveSettingsBtn.addEventListener('click', function() {
        console.log("Save settings button clicked");
        saveAllSettings();
        alert("Settings saved successfully!");
    });
    
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
            saveTextEntryToHistory(settings.text1, 1);
            saveTextEntryToHistory(settings.text2, 2);
            saveTextEntryToHistory(settings.text3, 3);
            
            // Save ZIP code history
            saveZipCodeToHistory(settings.zipCode);
            
            console.log("Settings saved successfully");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Error saving settings: " + error.message);
        }
    }
    
    // Function to save text entry to history
    function saveTextEntryToHistory(text, entryNumber) {
        if (!text) return;
        
        try {
            // Get existing text entry history
            let textEntryHistory = localStorage.getItem(`textEntry${entryNumber}History`);
            let entries = textEntryHistory ? JSON.parse(textEntryHistory) : [];
            
            // Add new entry if it doesn't exist
            if (!entries.includes(text)) {
                entries.push(text);
                
                // Limit to 10 entries
                if (entries.length > 10) {
                    entries = entries.slice(-10);
                }
                
                // Save to localStorage
                localStorage.setItem(`textEntry${entryNumber}History`, JSON.stringify(entries));
                
                // Update datalist
                const datalist = document.getElementById(`text-entry-${entryNumber}-history`);
                if (datalist) {
                    datalist.innerHTML = '';
                    entries.forEach(entry => {
                        const option = document.createElement('option');
                        option.value = entry;
                        datalist.appendChild(option);
                    });
                }
                
                console.log(`Text entry ${entryNumber} added to history:`, text);
            }
        } catch (error) {
            console.error(`Error saving text entry ${entryNumber} to history:`, error);
        }
    }
    
    // Function to save ZIP code to history
    function saveZipCodeToHistory(zipCode) {
        if (!zipCode) return;
        
        try {
            // Get existing ZIP code history
            let zipCodeHistory = localStorage.getItem('zipCodeHistory');
            let zipCodes = zipCodeHistory ? JSON.parse(zipCodeHistory) : [];
            
            // Add new ZIP code if it doesn't exist
            if (!zipCodes.includes(zipCode)) {
                zipCodes.push(zipCode);
                
                // Limit to 10 ZIP codes
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
                
                console.log("ZIP code added to history:", zipCode);
            }
        } catch (error) {
            console.error("Error saving ZIP code to history:", error);
        }
    }
});
