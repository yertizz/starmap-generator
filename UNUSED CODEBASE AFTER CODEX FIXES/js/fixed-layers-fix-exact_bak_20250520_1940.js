/* START OF CODE - Cline - 2025-05-20 19:31:40 File: js/fixed-layers-fix-exact.js */

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
        
        // Create the title element
        const title = document.createElement('h3');
        title.textContent = 'Fixed Layers';
        title.style.textAlign = 'center';
        title.style.color = '#0275d8'; // Blue color
        title.style.margin = '0 0 15px 0';
        title.style.padding = '0';
        title.style.fontSize = '18px';
        title.style.fontWeight = 'bold';
        
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
            if (fontFamily) {
                fontFamily.style.width = '120px';
                fontFamily.style.marginRight = '10px';
            }
            
            // Style the font size select
            const fontSize = group.querySelector('.font-size-select');
            if (fontSize) {
                fontSize.style.width = '70px';
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
            starMapStyle.style.width = '120px';
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
        
        // Find all Paper Auto-Size labels
        const paperAutoSizeLabels = document.querySelectorAll('label[for="paper-auto-size"]');
        
        // If there's more than one, remove the second one and its row
        if (paperAutoSizeLabels.length > 1) {
            // Get the second label's parent (the row)
            const secondRow = paperAutoSizeLabels[1].closest('.settings-row');
            if (secondRow) {
                secondRow.remove();
                console.log("Successfully removed duplicate Paper Auto-Size row");
            }
        } else {
            // Try another approach - find all rows with "Paper Auto-Size:" text
            const settingsRows = document.querySelectorAll('.settings-row');
            let found = false;
            
            settingsRows.forEach((row, index) => {
                if (index > 0 && row.textContent.includes('Paper Auto-Size:') && found) {
                    row.remove();
                    console.log("Successfully removed duplicate Paper Auto-Size row (alternative method)");
                }
                
                if (row.textContent.includes('Paper Auto-Size:')) {
                    found = true;
                }
            });
        }
    } catch (error) {
        console.error("Error removing duplicate Paper Auto-Size row:", error);
    }
}

// Set up event listeners to sync data from master sources
function setupDataSyncListeners() {
    try {
        console.log("Setting up data sync listeners");
        
        // Function to format date from the date input
        function formatDate(dateString) {
            if (!dateString) return '';
            
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return dateString;
                
                // Get time from time input
                const timeInput = document.getElementById('time');
                let timeString = '';
                if (timeInput && timeInput.value) {
                    const [hours, minutes] = timeInput.value.split(':');
                    const isPM = parseInt(hours) >= 12;
                    const hour12 = parseInt(hours) % 12 || 12;
                    timeString = `, ${hour12}:${minutes} ${isPM ? 'PM' : 'AM'}`;
                }
                
                // Format date as "Month Day, Year, HH:MM AM/PM"
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) + timeString;
            } catch (error) {
                console.error("Error formatting date:", error);
                return dateString;
            }
        }
        
        // Function to update the Fixed Layers date display
        function updateFixedLayersDate() {
            const dateInput = document.getElementById('date');
            const timeInput = document.getElementById('time');
            const fixedDateDisplay = document.createElement('div');
            fixedDateDisplay.id = 'fixed-date-display';
            
            if (dateInput) {
                const formattedDate = formatDate(dateInput.value);
                
                // Find the date input group in the Fixed Layers section
                const dateInputGroup = document.querySelector('.fixed-text-content .input-group:first-child');
                if (dateInputGroup) {
                    // Find or create the date display element
                    let dateDisplay = dateInputGroup.querySelector('#fixed-date-display');
                    if (!dateDisplay) {
                        dateDisplay = document.createElement('div');
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
                    
                    // Update the date display
                    dateDisplay.textContent = formattedDate;
                }
            }
        }
        
        // Function to update the Fixed Layers coordinates display
        function updateFixedLayersCoordinates() {
            const latInput = document.getElementById('latitude');
            const lonInput = document.getElementById('longitude');
            
            if (latInput && lonInput) {
                const coordsText = `${latInput.value || ''} | ${lonInput.value || ''}`;
                
                // Find the coordinates input group in the Fixed Layers section
                const coordsInputGroup = document.querySelector('.fixed-text-content .input-group:nth-child(2)');
                if (coordsInputGroup) {
                    // Find or create the coordinates display element
                    let coordsDisplay = coordsInputGroup.querySelector('#fixed-coords-display');
                    if (!coordsDisplay) {
                        coordsDisplay = document.createElement('div');
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
                    
                    // Update the coordinates display
                    coordsDisplay.textContent = coordsText;
                }
            }
        }
        
        // Add event listeners to the date and time inputs
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        
        if (dateInput) {
            dateInput.addEventListener('change', function() {
                updateFixedLayersDate();
                
                // Also update the Text Placements date
                const textPlacementsDate = document.getElementById('text-placement-content-date');
                if (textPlacementsDate) {
                    textPlacementsDate.textContent = formatDate(dateInput.value);
                }
            });
            
            // Initial update
            updateFixedLayersDate();
        }
        
        if (timeInput) {
            timeInput.addEventListener('change', function() {
                updateFixedLayersDate();
                
                // Also update the Text Placements date
                const textPlacementsDate = document.getElementById('text-placement-content-date');
                if (textPlacementsDate) {
                    textPlacementsDate.textContent = formatDate(dateInput.value);
                }
            });
        }
        
        // Add event listeners to the latitude and longitude inputs
        const latInput = document.getElementById('latitude');
        const lonInput = document.getElementById('longitude');
        
        if (latInput) {
            latInput.addEventListener('input', function() {
                updateFixedLayersCoordinates();
                
                // Also update the Text Placements coordinates
                const textPlacementsCoords = document.getElementById('text-placement-content-coords');
                if (textPlacementsCoords) {
                    textPlacementsCoords.textContent = `${latInput.value || ''} | ${lonInput.value || ''}`;
                }
            });
            
            // Initial update
            updateFixedLayersCoordinates();
        }
        
        if (lonInput) {
            lonInput.addEventListener('input', function() {
                updateFixedLayersCoordinates();
                
                // Also update the Text Placements coordinates
                const textPlacementsCoords = document.getElementById('text-placement-content-coords');
                if (textPlacementsCoords) {
                    textPlacementsCoords.textContent = `${latInput.value || ''} | ${lonInput.value || ''}`;
                }
            });
        }
        
        // Trigger initial updates
        if (dateInput) {
            const event = new Event('change');
            dateInput.dispatchEvent(event);
        }
        
        if (latInput) {
            const event = new Event('input');
            latInput.dispatchEvent(event);
        }
        
        console.log("Successfully set up data sync listeners");
    } catch (error) {
        console.error("Error setting up data sync listeners:", error);
    }
}

/* END OF CODE - Cline - 2025-05-20 19:31:40 File: js/fixed-layers-fix-exact.js */
