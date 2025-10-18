/* START OF CODE - Cline - 2025-05-22 10:07:57 File: js/fixed-layers-fix-exact.js */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fixed Layers Fix (Exact Match) script loaded");
    
    // Add the blue "Fixed Layers" title
    addFixedLayersTitle();
    
    // Fix the styling of the Fixed Layers section
    fixFixedLayersStyling();
    
    // Fix the font dropdowns
    fixFontDropdowns();
    
    // Fix the color pickers
    fixColorPickers();
    
    // Fix the Star Map Image Settings section
    fixStarMapImageSettings();
    
    // Remove the duplicate Paper Auto-Size row
    removeDuplicatePaperAutoSize();
    
    // Set up event listeners to sync data from master sources
    setupDataSyncListeners();
});

// Add the blue "Fixed Layers" title
function addFixedLayersTitle() {
    try {
        console.log("Adding blue Fixed Layers title");
        
        // Find the fixed-text-content section
        const fixedTextContent = document.querySelector('.fixed-text-content');
        if (!fixedTextContent) {
            console.error("Fixed text content section not found");
            return;
        }
        
        // Find a legend element to copy styling from
        const legendElement = document.querySelector('.form-section legend');
        if (!legendElement) {
            console.error("No legend element found to copy styling from");
            return;
        }
        
        // Create the title element
        const title = document.createElement('h3');
        title.textContent = 'Fixed Layers';
        
        // Copy styling from the legend element
        const legendStyle = window.getComputedStyle(legendElement);
        title.style.textAlign = 'center';
        title.style.color = '#0275d8'; // Blue color
        title.style.margin = '0 0 15px 0';
        title.style.padding = legendStyle.padding;
        title.style.fontSize = legendStyle.fontSize;
        title.style.fontWeight = legendStyle.fontWeight;
        title.style.fontFamily = legendStyle.fontFamily;
        title.style.display = 'block';
        title.style.width = '100%';
        
        // Insert the title at the beginning of the fixed-text-content section
        fixedTextContent.insertBefore(title, fixedTextContent.firstChild);
        
        console.log("Successfully added blue Fixed Layers title");
    } catch (error) {
        console.error("Error adding blue Fixed Layers title:", error);
    }
}

// Fix the styling of the Fixed Layers section
function fixFixedLayersStyling() {
    try {
        console.log("Fixing Fixed Layers styling");
        
        // Find the fixed-text-content section
        const fixedTextContent = document.querySelector('.fixed-text-content');
        if (!fixedTextContent) {
            console.error("Fixed text content section not found");
            return;
        }
        
        // Find all input groups in the fixed-text-content section
        const inputGroups = fixedTextContent.querySelectorAll('.input-group');
        if (inputGroups.length === 0) {
            console.error("No input groups found in fixed-text-content section");
            return;
        }
        
        // Fix the "Lat/long:Coordinates Text:" label
        inputGroups.forEach(group => {
            const label = group.querySelector('label');
            if (label && label.textContent.includes('Coordinates Text')) {
                label.textContent = 'Lat/Long:';
                console.log("Fixed Lat/Long label");
            }
        });
        
        // Style the fixed-text-content section
        fixedTextContent.style.backgroundColor = '#f8f8f8';
        fixedTextContent.style.border = '1px solid #ddd';
        fixedTextContent.style.borderRadius = '5px';
        fixedTextContent.style.padding = '15px';
        fixedTextContent.style.marginTop = '15px';
        
        // Get reference to font dropdowns in the Customizable Text section
        const sourceFontFamily = document.querySelector('.text-entry-row .font-family-select') || 
                                document.querySelector('.text-entry-wrapper .font-family-select');
        const sourceFontSize = document.querySelector('.text-entry-row .font-size-select') || 
                              document.querySelector('.text-entry-wrapper .font-size-select');
        
        // Style each input group
        inputGroups.forEach((group, index) => {
            group.style.display = 'flex';
            group.style.flexWrap = 'nowrap';
            group.style.alignItems = 'center';
            group.style.marginBottom = index === inputGroups.length - 1 ? '0' : '10px';
            group.style.padding = '10px';
            group.style.backgroundColor = '#fff';
            group.style.borderRadius = '4px';
            group.style.border = '1px solid #eee';
            
            // Style the label
            const label = group.querySelector('label');
            if (label) {
                label.style.width = '80px';
                label.style.minWidth = '80px';
                label.style.textAlign = 'right';
                label.style.marginRight = '10px';
                label.style.fontWeight = 'bold';
                label.style.color = '#555';
            }
            
            // Style the font family select
            const fontFamily = group.querySelector('.font-family-select');
            if (fontFamily && sourceFontFamily) {
                // Copy styles from the source dropdown
                const computedStyle = window.getComputedStyle(sourceFontFamily);
                fontFamily.style.width = computedStyle.width;
                fontFamily.style.minWidth = computedStyle.minWidth;
                fontFamily.style.height = computedStyle.height;
                fontFamily.style.marginRight = '10px';
                fontFamily.style.border = computedStyle.border;
                fontFamily.style.borderRadius = computedStyle.borderRadius;
                fontFamily.style.padding = computedStyle.padding;
                fontFamily.style.backgroundColor = computedStyle.backgroundColor;
                fontFamily.style.color = computedStyle.color;
                fontFamily.style.fontSize = computedStyle.fontSize;
            } else if (fontFamily) {
                // Fallback styling if source not found
                fontFamily.style.width = '150px';
                fontFamily.style.minWidth = '120px';
                fontFamily.style.marginRight = '10px';
            }
            
            // Style the font size select
            const fontSize = group.querySelector('.font-size-select');
            if (fontSize && sourceFontSize) {
                // Copy styles from the source dropdown
                const computedStyle = window.getComputedStyle(sourceFontSize);
                fontSize.style.width = computedStyle.width;
                fontSize.style.minWidth = computedStyle.minWidth;
                fontSize.style.height = computedStyle.height;
                fontSize.style.marginRight = '10px';
                fontSize.style.border = computedStyle.border;
                fontSize.style.borderRadius = computedStyle.borderRadius;
                fontSize.style.padding = computedStyle.padding;
                fontSize.style.backgroundColor = computedStyle.backgroundColor;
                fontSize.style.color = computedStyle.color;
                fontSize.style.fontSize = computedStyle.fontSize;
            } else if (fontSize) {
                // Fallback styling if source not found
                fontSize.style.width = '70px';
                fontSize.style.minWidth = '60px';
                fontSize.style.marginRight = '10px';
            }
            
            // Style the style options
            const styleOptions = group.querySelector('.style-options');
            if (styleOptions) {
                styleOptions.style.display = 'flex';
                styleOptions.style.alignItems = 'center';
                styleOptions.style.marginRight = '10px';
                
                // Style the labels inside style options
                const styleLabels = styleOptions.querySelectorAll('label');
                styleLabels.forEach(label => {
                    label.style.marginRight = '10px';
                    label.style.fontWeight = 'normal';
                });
            }
            
            // Style the color swatch
            const colorSwatch = group.querySelector('.color-swatch');
            if (colorSwatch) {
                colorSwatch.style.width = '25px';
                colorSwatch.style.height = '25px';
                colorSwatch.style.borderRadius = '50%';
                colorSwatch.style.cursor = 'pointer';
                colorSwatch.style.border = '1px solid #ccc';
            }
        });
        
        console.log("Successfully fixed Fixed Layers styling");
    } catch (error) {
        console.error("Error fixing Fixed Layers styling:", error);
    }
}

// Fix the font dropdowns
function fixFontDropdowns() {
    try {
        console.log("Fixing font dropdowns");
        
        // Find the font family dropdowns in the Fixed Layers section
        const fontFamilyDropdowns = document.querySelectorAll('.fixed-text-content .font-family-select');
        
        // Find the font size dropdowns in the Fixed Layers section
        const fontSizeDropdowns = document.querySelectorAll('.fixed-text-content .font-size-select');
        
        // Set the font family to Bebas Neue
        fontFamilyDropdowns.forEach(dropdown => {
            if (dropdown.options.length > 0) {
                // Find the Bebas Neue option
                for (let i = 0; i < dropdown.options.length; i++) {
                    if (dropdown.options[i].value === 'Bebas Neue') {
                        dropdown.selectedIndex = i;
                        break;
                    }
                }
            }
        });
        
        // Set the font size to 60px
        fontSizeDropdowns.forEach(dropdown => {
            if (dropdown.options.length > 0) {
                // Find the 60px option
                for (let i = 0; i < dropdown.options.length; i++) {
                    if (dropdown.options[i].value === '60px' || dropdown.options[i].value === '60') {
                        dropdown.selectedIndex = i;
                        break;
                    }
                }
            }
        });
        
        console.log("Successfully fixed font dropdowns");
    } catch (error) {
        console.error("Error fixing font dropdowns:", error);
    }
}

// Fix the color pickers
function fixColorPickers() {
    try {
        console.log("Fixing color pickers");
        
        // Find the color swatches in the Fixed Layers section
        const colorSwatches = document.querySelectorAll('.fixed-text-content .color-swatch');
        
        // Set the color to yellow (#FFCC00)
        colorSwatches.forEach(swatch => {
            swatch.style.backgroundColor = '#FFCC00';
            
            // Also update the hidden input
            const targetId = swatch.getAttribute('data-target');
            if (targetId) {
                const input = document.getElementById(targetId);
                if (input) {
                    input.value = '#FFCC00';
                }
            }
        });
        
        console.log("Successfully fixed color pickers");
    } catch (error) {
        console.error("Error fixing color pickers:", error);
    }
}

// Fix the Star Map Image Settings section
function fixStarMapImageSettings() {
    try {
        console.log("Fixing Star Map Image Settings section");
        
        // Find the Star Map Style dropdown
        const starMapStyle = document.getElementById('star-map-style');
        if (starMapStyle) {
            // Set the width to match the mockup
            starMapStyle.style.width = '120px';
            starMapStyle.style.maxWidth = '120px';
            
            // Left-align the list items
            const options = starMapStyle.querySelectorAll('option');
            options.forEach(option => {
                option.style.textAlign = 'left';
                option.style.paddingLeft = '5px';
            });
        }
        
        console.log("Successfully fixed Star Map Image Settings section");
    } catch (error) {
        console.error("Error fixing Star Map Image Settings section:", error);
    }
}

// Remove the duplicate Paper Auto-Size row
function removeDuplicatePaperAutoSize() {
    try {
        console.log("Removing duplicate Paper Auto-Size row");
        
        // Find all settings rows
        const settingsRows = document.querySelectorAll('.settings-row');
        let paperAutoSizeRows = [];
        
        // Find all rows containing "Paper Auto-Size:"
        settingsRows.forEach(row => {
            if (row.textContent.includes('Paper Auto-Size:')) {
                paperAutoSizeRows.push(row);
            }
        });
        
        // If there's more than one, remove the second one
        if (paperAutoSizeRows.length > 1) {
            paperAutoSizeRows[1].remove();
            console.log("Successfully removed duplicate Paper Auto-Size row");
        } else {
            console.warn("Could not find duplicate Paper Auto-Size row");
        }
    } catch (error) {
        console.error("Error removing duplicate Paper Auto-Size row:", error);
    }
}

// Set up event listeners to sync data from master sources
function setupDataSyncListeners() {
    try {
        console.log("Setting up data sync listeners");
        
        // Create display elements for date and coordinates in the Fixed Layers section
        createFixedLayersDisplayElements();
        
        // Add event listeners to the date and time inputs
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const showTimeToggle = document.getElementById('show-time-toggle');
        
        if (dateInput) {
            dateInput.addEventListener('change', updateFixedLayersDate);
            console.log("Added event listener to date input");
        }
        
        if (timeInput) {
            timeInput.addEventListener('change', updateFixedLayersDate);
            console.log("Added event listener to time input");
        }
        
        if (showTimeToggle) {
            showTimeToggle.addEventListener('change', updateFixedLayersDate);
            console.log("Added event listener to show time toggle");
        }
        
        // Add event listeners to the latitude and longitude inputs
        const latInput = document.getElementById('latitude');
        const lonInput = document.getElementById('longitude');
        
        if (latInput) {
            latInput.addEventListener('input', updateFixedLayersCoordinates);
            console.log("Added event listener to latitude input");
        }
        
        if (lonInput) {
            lonInput.addEventListener('input', updateFixedLayersCoordinates);
            console.log("Added event listener to longitude input");
        }
        
        // Initial updates
        updateFixedLayersDate();
        updateFixedLayersCoordinates();
        
        console.log("Successfully set up data sync listeners");
    } catch (error) {
        console.error("Error setting up data sync listeners:", error);
    }
}

// Create display elements for date and coordinates in the Fixed Layers section
function createFixedLayersDisplayElements() {
    try {
        console.log("Creating display elements for Fixed Layers section");
        
        // Find the date input group in the Fixed Layers section
        const dateInputGroup = document.querySelector('.fixed-text-content .input-group:first-child');
        if (dateInputGroup) {
            // Create the date display element
            const dateDisplay = document.createElement('div');
            dateDisplay.id = 'fixed-date-display';
            dateDisplay.style.width = '220px';
            dateDisplay.style.minWidth = '220px';
            dateDisplay.style.maxWidth = '220px';
            dateDisplay.style.height = '30px';
            dateDisplay.style.lineHeight = '30px';
            dateDisplay.style.padding = '0 10px';
            dateDisplay.style.marginRight = '10px';
            dateDisplay.style.backgroundColor = '#f0f0f0';
            dateDisplay.style.border = '1px solid #ddd';
            dateDisplay.style.borderRadius = '4px';
            dateDisplay.style.fontSize = '14px';
            dateDisplay.style.color = '#333';
            dateDisplay.style.fontFamily = 'inherit';
            dateDisplay.style.whiteSpace = 'nowrap';
            dateDisplay.style.overflow = 'hidden';
            dateDisplay.style.textOverflow = 'ellipsis';
            
            // Insert after the label
            const label = dateInputGroup.querySelector('label');
            if (label) {
                dateInputGroup.insertBefore(dateDisplay, label.nextSibling);
            } else {
                dateInputGroup.insertBefore(dateDisplay, dateInputGroup.firstChild);
            }
        }
        
        // Find the coordinates input group in the Fixed Layers section
        const coordsInputGroup = document.querySelector('.fixed-text-content .input-group:nth-child(2)');
        if (coordsInputGroup) {
            // Create the coordinates display element
            const coordsDisplay = document.createElement('div');
            coordsDisplay.id = 'fixed-coords-display';
            coordsDisplay.style.width = '220px';
            coordsDisplay.style.minWidth = '220px';
            coordsDisplay.style.maxWidth = '220px';
            coordsDisplay.style.height = '30px';
            coordsDisplay.style.lineHeight = '30px';
            coordsDisplay.style.padding = '0 10px';
            coordsDisplay.style.marginRight = '10px';
            coordsDisplay.style.backgroundColor = '#f0f0f0';
            coordsDisplay.style.border = '1px solid #ddd';
            coordsDisplay.style.borderRadius = '4px';
            coordsDisplay.style.fontSize = '14px';
            coordsDisplay.style.color = '#333';
            coordsDisplay.style.fontFamily = 'inherit';
            coordsDisplay.style.whiteSpace = 'nowrap';
            coordsDisplay.style.overflow = 'hidden';
            coordsDisplay.style.textOverflow = 'ellipsis';
            
            // Insert after the label
            const label = coordsInputGroup.querySelector('label');
            if (label) {
                coordsInputGroup.insertBefore(coordsDisplay, label.nextSibling);
            } else {
                coordsInputGroup.insertBefore(coordsDisplay, coordsInputGroup.firstChild);
            }
        }
        
        console.log("Successfully created display elements for Fixed Layers section");
    } catch (error) {
        console.error("Error creating display elements:", error);
    }
}

// Update the Fixed Layers date display
function updateFixedLayersDate() {
    try {
        console.log("Updating Fixed Layers date display");
        
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const showTimeToggle = document.getElementById('show-time-toggle');
        const dateDisplay = document.getElementById('fixed-date-display');
        
        if (dateInput && dateDisplay) {
            const dateValue = dateInput.value;
            
            if (dateValue) {
                // Format the date
                const date = new Date(dateValue);
                let formattedDate = '';
                
                if (!isNaN(date.getTime())) {
                    formattedDate = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    // Add time if available and toggle is checked
                    if (timeInput && timeInput.value && showTimeToggle && showTimeToggle.checked) {
                        const [hours, minutes] = timeInput.value.split(':');
                        const isPM = parseInt(hours) >= 12;
                        const hour12 = parseInt(hours) % 12 || 12;
                        formattedDate += `, ${hour12}:${minutes} ${isPM ? 'PM' : 'AM'}`;
                    }
                }
                
                // Update the date display
                dateDisplay.textContent = formattedDate;
                console.log("Updated Fixed Layers date display to:", formattedDate);
                
                // Also update the Text Placements date
                const textPlacementsDate = document.getElementById('text-placement-content-date');
                if (textPlacementsDate) {
                    textPlacementsDate.textContent = formattedDate;
                    console.log("Updated Text Placements date to:", formattedDate);
                }
            }
        }
    } catch (error) {
        console.error("Error updating Fixed Layers date display:", error);
    }
}

// Update the Fixed Layers coordinates display
function updateFixedLayersCoordinates() {
    try {
        console.log("Updating Fixed Layers coordinates display");
        
        const latInput = document.getElementById('latitude');
        const lonInput = document.getElementById('longitude');
        const coordsDisplay = document.getElementById('fixed-coords-display');
        
        if (latInput && lonInput && coordsDisplay) {
            const latValue = latInput.value;
            const lonValue = lonInput.value;
            
            if (latValue && lonValue) {
                const coordsText = `${latValue} | ${lonValue}`;
                
                // Update the coordinates display
                coordsDisplay.textContent = coordsText;
                console.log("Updated Fixed Layers coordinates display to:", coordsText);
                
                // Also update the Text Placements coordinates
                const textPlacementsCoords = document.getElementById('text-placement-content-coords');
                if (textPlacementsCoords) {
                    textPlacementsCoords.textContent = coordsText;
                    console.log("Updated Text Placements coordinates to:", coordsText);
                }
            }
        }
    } catch (error) {
        console.error("Error updating Fixed Layers coordinates display:", error);
    }
}

/* END OF CODE - Cline - 2025-05-22 10:07:57 File: js/fixed-layers-fix-exact.js */
