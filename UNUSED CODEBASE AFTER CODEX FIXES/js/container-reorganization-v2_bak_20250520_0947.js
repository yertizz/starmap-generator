/* START OF CODE - Cline - 2025-05-20 09:20:35 File: js/container-reorganization-v2.js */

/**
 * Container Reorganization V2 JavaScript for Star Map Generator
 * 
 * This script focuses on:
 * 1. Fixing text entry field widths
 * 2. Ensuring row labels show "#1", "#2", "#3", and "#4"
 * 3. Standardizing field sizes across the application
 * 4. Fixing the text placements container
 * 5. Updating fixed layers display boxes for date and coordinates
 * 
 * Note: The HTML changes to combine containers are done directly in the HTML file.
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Container Reorganization V2 script loaded");
    
    // Fix text entry field widths
    fixTextEntryFields();
    
    // Standardize field sizes
    standardizeFieldSizes();
    
    // Fix the text placements container
    fixTextPlacementsContainer();
    
    // Add a heading to the image settings content if needed
    addImageSettingsHeading();
    
    // Add Fixed Layers heading
    addFixedLayersHeading();
    
    // Update fixed layers display boxes
    updateFixedLayersDisplayBoxes();
    
    // Restore Event dropdown width
    restoreEventDropdownWidth();
    
    // Setup MutationObserver to watch for changes to the date and coordinates
    setupMutationObservers();
    
    // Add direct event listener for map clicks
    addMapClickListener();
    
    // Initial update of date and coordinates
    updateDateDisplay();
    updateCoordsDisplay();
});

/**
 * Fix text entry field widths
 */
function fixTextEntryFields() {
    console.log("Fixing text entry field widths");
    
    try {
        // Find all text entry fields
        const textEntryFields = document.querySelectorAll('input[type="text"].text-entry, input.text-entry');
        
        // Increase the width of text entry fields to prevent truncation
        textEntryFields.forEach(field => {
            field.style.width = 'calc(100% - 2px)'; // Increased from calc(100% - 5px)
            field.style.minWidth = '410px'; // Increased from 320px
            field.style.paddingRight = '2px';
            field.style.boxSizing = 'border-box';
            field.style.fontSize = '14px';
        });
        
        // Reduce the space between the character count and the font family dropdown
        const characterCounts = document.querySelectorAll('.character-count');
        characterCounts.forEach(count => {
            count.style.marginRight = '2px';
            count.style.width = '25px';
            count.style.textAlign = 'center';
        });
        
        // Fix the row labels to ensure they show "#1", "#2", "#3", and "#4"
        const rowLabels = document.querySelectorAll('.row-label, .entry-label');
        rowLabels.forEach((label, index) => {
            if (label.textContent === (index + 1).toString()) {
                label.textContent = '#' + (index + 1);
            }
        });
        
        console.log("Successfully fixed text entry field widths");
    } catch (error) {
        console.error("Error in fixTextEntryFields:", error);
    }
}

/**
 * Standardize field sizes across the application
 */
function standardizeFieldSizes() {
    console.log("Standardizing field sizes");
    
    try {
        // Standardize numeric input fields
        const numericInputs = document.querySelectorAll('input[type="number"], input[type="text"][size="4"], input[type="text"][size="5"], input[type="text"][size="6"]');
        numericInputs.forEach(input => {
            input.style.width = '80px';
            input.style.minWidth = '80px';
            input.style.maxWidth = '80px';
            input.style.boxSizing = 'border-box';
        });
        
        // Standardize dropdown selects (except occasion)
        const dropdowns = document.querySelectorAll('select:not(#paper-auto-size):not([name="paper-auto-size"]):not(#occasion):not([name="occasion"])');
        dropdowns.forEach(dropdown => {
            dropdown.style.width = '100px';
            dropdown.style.minWidth = '100px';
            dropdown.style.maxWidth = '100px';
            dropdown.style.boxSizing = 'border-box';
        });
        
        // Specific styling for the Star Map Style dropdown
        const starMapStyleDropdown = document.querySelector('#star-map-style, select[name="star-map-style"]');
        if (starMapStyleDropdown) {
            starMapStyleDropdown.style.width = '100px';
            starMapStyleDropdown.style.minWidth = '100px';
            starMapStyleDropdown.style.maxWidth = '100px';
            starMapStyleDropdown.style.boxSizing = 'border-box';
        }
        
        // Specific styling for all dropdowns in the image settings content
        const imageSettingsDropdowns = document.querySelectorAll('.image-settings-content select');
        imageSettingsDropdowns.forEach(dropdown => {
            dropdown.style.width = '100px';
            dropdown.style.minWidth = '100px';
            dropdown.style.maxWidth = '100px';
            dropdown.style.boxSizing = 'border-box';
        });
        
        console.log("Successfully standardized field sizes");
    } catch (error) {
        console.error("Error in standardizeFieldSizes:", error);
    }
}

/**
 * Fix the text placements container
 */
function fixTextPlacementsContainer() {
    console.log("Fixing text placements container");
    
    try {
        // Find the text placements container
        const textPlacementsContainers = document.querySelectorAll('fieldset');
        let textPlacementsContainer = null;
        
        for (const container of textPlacementsContainers) {
            const legend = container.querySelector('legend');
            if (legend && legend.textContent.includes('Text Placements')) {
                textPlacementsContainer = container;
                break;
            }
        }
        
        if (!textPlacementsContainer) {
            console.error("Text placements container not found");
            return;
        }
        
        console.log("Found text placements container:", textPlacementsContainer);
        
        // Add the text-placement-container class to the container
        textPlacementsContainer.classList.add('text-placement-container');
        
        // Find all labels in the container
        const labels = textPlacementsContainer.querySelectorAll('label');
        
        // Center-align the labels with their corresponding field contents
        labels.forEach(label => {
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.height = '100%';
            label.style.margin = '0';
            label.style.padding = '0';
        });
        
        // Fix the coordinates label to be "Lat/Long:" instead of "Coordinates"
        const coordsLabels = textPlacementsContainer.querySelectorAll('label');
        coordsLabels.forEach(label => {
            if (label.textContent.includes('Coordinates')) {
                label.textContent = 'Lat/Long:';
            }
        });
        
        console.log("Successfully fixed text placements container");
    } catch (error) {
        console.error("Error in fixTextPlacementsContainer:", error);
    }
}

/**
 * Add a heading to the image settings content if needed
 */
function addImageSettingsHeading() {
    console.log("Adding heading to image settings content");
    
    try {
        // Find the image settings content
        const imageSettingsContent = document.querySelector('.image-settings-content');
        
        if (!imageSettingsContent) {
            console.error("Image settings content not found");
            return;
        }
        
        // Check if a heading already exists
        const existingHeading = imageSettingsContent.querySelector('h3');
        
        if (!existingHeading) {
            // Create a heading for the image settings section
            const imageSettingsHeading = document.createElement('h3');
            imageSettingsHeading.textContent = 'Star Map Image Settings';
            imageSettingsHeading.style.fontWeight = 'bold';
            imageSettingsHeading.style.fontSize = '1.15em';
            imageSettingsHeading.style.color = '#0056b3'; // Same blue as container legends
            imageSettingsHeading.style.textAlign = 'center';
            imageSettingsHeading.style.marginTop = '10px';
            imageSettingsHeading.style.marginBottom = '15px';
            imageSettingsHeading.style.width = '100%';
            imageSettingsHeading.style.display = 'block';
            
            // Add the heading to the beginning of the image settings content
            if (imageSettingsContent.firstChild) {
                imageSettingsContent.insertBefore(imageSettingsHeading, imageSettingsContent.firstChild);
            } else {
                imageSettingsContent.appendChild(imageSettingsHeading);
            }
            
            console.log("Added heading to image settings content");
        } else {
            console.log("Heading already exists in image settings content");
        }
    } catch (error) {
        console.error("Error in addImageSettingsHeading:", error);
    }
}

/**
 * Add a Fixed Layers heading to the customizable text layers container
 */
function addFixedLayersHeading() {
    console.log("Adding Fixed Layers heading");
    
    try {
        // Find the fixed text content container
        const fixedTextContent = document.querySelector('.fixed-text-content');
        
        if (!fixedTextContent) {
            console.error("Fixed text content container not found");
            return;
        }
        
        // Check if a heading already exists
        const existingHeading = fixedTextContent.querySelector('.fixed-layers-heading');
        
        if (!existingHeading) {
            // Create a heading for the fixed layers section
            const fixedLayersHeading = document.createElement('h4');
            fixedLayersHeading.textContent = 'Fixed Layers';
            fixedLayersHeading.classList.add('fixed-layers-heading');
            
            // Add the heading to the beginning of the fixed text content
            if (fixedTextContent.firstChild) {
                fixedTextContent.insertBefore(fixedLayersHeading, fixedTextContent.firstChild);
            } else {
                fixedTextContent.appendChild(fixedLayersHeading);
            }
            
            console.log("Added Fixed Layers heading");
        } else {
            console.log("Fixed Layers heading already exists");
        }
    } catch (error) {
        console.error("Error in addFixedLayersHeading:", error);
    }
}

/**
 * Update fixed layers display boxes for date and coordinates
 */
function updateFixedLayersDisplayBoxes() {
    console.log("Updating fixed layers display boxes");
    
    try {
        // Find the fixed text content container
        const fixedTextContent = document.querySelector('.fixed-text-content');
        
        if (!fixedTextContent) {
            console.error("Fixed text content container not found");
            return;
        }
        
        // Find the date and coordinates input groups
        const inputGroups = fixedTextContent.querySelectorAll('.input-group');
        
        if (inputGroups.length < 2) {
            console.error("Date or coordinates input group not found");
            return;
        }
        
        // Update the labels to be exactly "Date:" and "Lat/Long:"
        inputGroups.forEach((group, index) => {
            const label = group.querySelector('label');
            if (label) {
                if (index === 0) {
                    label.textContent = 'Date:';
                } else if (index === 1) {
                    label.textContent = 'Lat/Long:';
                }
            }
        });
        
        // Make sure the font controls are visible and properly styled
        inputGroups.forEach(group => {
            const fontControls = group.querySelectorAll('select, .style-options, .color-swatch');
            fontControls.forEach(control => {
                control.style.display = '';
            });
        });
        
        // Update the date and coordinates values
        updateDateDisplay();
        updateCoordsDisplay();
        
        console.log("Successfully updated fixed layers display boxes");
    } catch (error) {
        console.error("Error in updateFixedLayersDisplayBoxes:", error);
    }
}

/**
 * Update the date display in the fixed layers section
 */
function updateDateDisplay() {
    try {
        console.log("Updating date display");
        
        // Find the date display in the Text Placements section
        const dateDisplaySpan = document.getElementById('text-placement-content-date');
        
        // Find the date and time inputs
        const dateField = document.getElementById('date');
        const timeField = document.getElementById('time');
        const showTimeToggle = document.getElementById('show-time-toggle');
        
        if (!dateField) {
            console.error("Date field not found");
            return;
        }
        
        // Get the date value
        const dateValue = dateField.value;
        
        if (dateValue) {
            // Parse the date value
            const dateParts = dateValue.split('-');
            const year = parseInt(dateParts[0]);
            const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed in JavaScript
            const day = parseInt(dateParts[2]);
            
            // Create a date object with the correct date (no timezone adjustment)
            // IMPORTANT: Use the date directly without UTC to prevent the one-day offset
            const date = new Date(year, month, day);
            
            // Format the date in a user-friendly way
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            let displayValue = formattedDate;
            
            // Add the time if available
            if (timeField && timeField.value) {
                const timeValue = timeField.value;
                const showTime = showTimeToggle ? showTimeToggle.checked : true;
                
                if (showTime) {
                    // Format time in 12-hour format
                    const timeParts = timeValue.split(':');
                    let hours = parseInt(timeParts[0]);
                    const minutes = timeParts[1];
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // Convert 0 to 12
                    const formattedTime = `${hours}:${minutes} ${ampm}`;
                    
                    displayValue = `${formattedDate}, ${formattedTime}`;
                }
            }
            
            // Update the date display in the Text Placements section
            if (dateDisplaySpan) {
                dateDisplaySpan.textContent = displayValue;
            }
            
            console.log("Updated date display to:", displayValue);
        } else {
            if (dateDisplaySpan) {
                dateDisplaySpan.textContent = 'No date selected';
            }
        }
    } catch (error) {
        console.error("Error updating date display:", error);
    }
}

/**
 * Update the coordinates display in the fixed layers section
 */
function updateCoordsDisplay() {
    try {
        console.log("Updating coordinates display");
        
        // Find the coordinates display in the Text Placements section
        const coordsDisplaySpan = document.getElementById('text-placement-content-coords');
        
        // Find the latitude and longitude inputs
        const latitudeField = document.getElementById('latitude');
        const longitudeField = document.getElementById('longitude');
        
        if (!latitudeField || !longitudeField) {
            console.error("Latitude or longitude field not found");
            return;
        }
        
        // Get the latitude and longitude values
        const latValue = latitudeField.value;
        const longValue = longitudeField.value;
        
        if (latValue && longValue) {
            // Format the coordinates display
            const coordsText = `${latValue} | ${longValue}`;
            
            // Update the coordinates display in the Text Placements section
            if (coordsDisplaySpan) {
                coordsDisplaySpan.textContent = coordsText;
            }
            
            console.log("Updated coordinates display to:", coordsText);
        } else {
            if (coordsDisplaySpan) {
                coordsDisplaySpan.textContent = 'No coordinates selected';
            }
        }
    } catch (error) {
        console.error("Error updating coordinates display:", error);
    }
}

/**
 * Add a direct event listener for map clicks
 */
function addMapClickListener() {
    console.log("Adding map click listener");
    
    try {
        // Find the map container
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) {
            console.error("Map container not found");
            return;
        }
        
        // Add a click event listener to the map container
        mapContainer.addEventListener('click', function(event) {
            console.log("Map clicked");
            
            // Wait a short time for the map to update
            setTimeout(function() {
                updateCoordsDisplay();
            }, 100);
        });
        
        // Also add a listener to the map itself
        const map = document.getElementById('map');
        if (map) {
            map.addEventListener('click', function(event) {
                console.log("Map element clicked");
                
                // Wait a short time for the map to update
                setTimeout(function() {
                    updateCoordsDisplay();
                }, 100);
            });
        }
        
        console.log("Successfully added map click listener");
    } catch (error) {
        console.error("Error adding map click listener:", error);
    }
}

/**
 * Setup MutationObservers to watch for changes to the date and coordinates
 */
function setupMutationObservers() {
    console.log("Setting up MutationObservers");
    
    try {
        // Find the date and time inputs
        const dateField = document.getElementById('date');
        const timeField = document.getElementById('time');
        const latitudeField = document.getElementById('latitude');
        const longitudeField = document.getElementById('longitude');
        const showTimeToggle = document.getElementById('show-time-toggle');
        
        // Add event listeners to update the display when values change
        if (dateField) {
            dateField.addEventListener('change', updateDateDisplay);
            dateField.addEventListener('input', updateDateDisplay);
        }
        
        if (timeField) {
            timeField.addEventListener('change', updateDateDisplay);
            timeField.addEventListener('input', updateDateDisplay);
        }
        
        if (showTimeToggle) {
            showTimeToggle.addEventListener('change', updateDateDisplay);
        }
        
        if (latitudeField) {
            latitudeField.addEventListener('change', updateCoordsDisplay);
            latitudeField.addEventListener('input', updateCoordsDisplay);
        }
        
        if (longitudeField) {
            longitudeField.addEventListener('change', updateCoordsDisplay);
            longitudeField.addEventListener('input', updateCoordsDisplay);
        }
        
        // Find the latLongDisplay element
        const latLongDisplay = document.getElementById('latLongDisplay');
        if (latLongDisplay) {
            // Create a MutationObserver to watch for changes to the latLongDisplay element
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'characterData' || mutation.type === 'childList') {
                        // Get the text content of the latLongDisplay element
                        const displayText = latLongDisplay.textContent;
                        
                        // Update the coordinates display in the Text Placements section
                        const coordsDisplaySpan = document.getElementById('text-placement-content-coords');
                        if (coordsDisplaySpan && displayText && displayText.trim() !== '') {
                            coordsDisplaySpan.textContent = displayText;
                        }
                    }
                });
            });
            
            // Start observing the latLongDisplay element
            observer.observe(latLongDisplay, {
                characterData: true,
                childList: true,
                subtree: true
            });
            
            console.log("Added MutationObserver for latLongDisplay");
        }
        
        // Find the dateDisplay element
        const dateDisplay = document.getElementById('dateDisplay');
        if (dateDisplay) {
            // Create a MutationObserver to watch for changes to the dateDisplay element
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'characterData' || mutation.type === 'childList') {
                        // Get the text content of the dateDisplay element
                        const displayText = dateDisplay.textContent;
                        
                        // Update the date display in the Text Placements section
                        const dateDisplaySpan = document.getElementById('text-placement-content-date');
                        if (dateDisplaySpan && displayText && displayText.trim() !== '') {
                            dateDisplaySpan.textContent = displayText;
                        }
                    }
                });
            });
            
            // Start observing the dateDisplay element
            observer.observe(dateDisplay, {
                characterData: true,
                childList: true,
                subtree: true
            });
            
            console.log("Added MutationObserver for dateDisplay");
        }
        
        // Add a global event listener for map changes
        document.addEventListener('mapUpdated', function(event) {
            console.log("Map updated event detected");
            updateCoordsDisplay();
        });
        
        // Add a global event listener for date changes
        document.addEventListener('dateUpdated', function(event) {
            console.log("Date updated event detected");
            updateDateDisplay();
        });
        
        console.log("Successfully set up MutationObservers");
    } catch (error) {
        console.error("Error setting up MutationObservers:", error);
    }
}

/**
 * Restore Event dropdown width
 */
function restoreEventDropdownWidth() {
    console.log("Restoring Event dropdown width");
    
    try {
        // Find the occasion dropdown
        const occasionDropdown = document.getElementById('occasion');
        
        if (occasionDropdown) {
            occasionDropdown.style.width = '400px';
            occasionDropdown.style.minWidth = '350px';
            console.log("Successfully restored Event dropdown width");
        } else {
            console.error("Occasion dropdown not found");
        }
    } catch (error) {
        console.error("Error in restoreEventDropdownWidth:", error);
    }
}

/* END OF CODE - Cline - 2025-05-20 09:20:35 File: js/container-reorganization-v2.js */
