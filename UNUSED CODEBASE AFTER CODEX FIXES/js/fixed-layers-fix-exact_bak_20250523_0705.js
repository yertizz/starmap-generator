/* START OF CODE - Cline - 2025-05-23 06:52:19 File: js/fixed-layers-fix-exact.js */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fixed Layers Fix (Exact Match) script loaded");
    
    // Fix all issues in one go
    fixAllIssues();
});

// Fix all issues in one go
function fixAllIssues() {
    try {
        console.log("Fixing all issues");
        
        // 1. Fix the "Fixed Layers" title styling
        fixFixedLayersTitle();
        
        // 2. Fix the "Lat/long:Coordinates Text:" label
        fixLatLongLabel();
        
        // 3. Add date and coordinates value blocks
        addValueBlocks();
        
        // 4. Fix the font dropdowns
        fixFontDropdowns();
        
        // 5. Fix the color pickers
        fixColorPickers();
        
        // 6. Fix the Star Map Image Settings section
        fixStarMapImageSettings();
        
        // 7. Remove the duplicate Paper Auto-Size row
        removeDuplicatePaperAutoSize();
        
        // 8. Set up event listeners for date and coordinates
        setupEventListeners();
        
        console.log("Successfully fixed all issues");
    } catch (error) {
        console.error("Error fixing issues:", error);
    }
}

// Fix the "Fixed Layers" title styling
function fixFixedLayersTitle() {
    try {
        console.log("Fixing Fixed Layers title styling");
        
        // Find the fixed-text-content section
        const fixedTextContent = document.querySelector('.fixed-text-content');
        if (!fixedTextContent) {
            console.error("Fixed text content section not found");
            return;
        }
        
        // Remove existing title if it exists
        const existingTitle = fixedTextContent.querySelector('h3');
        if (existingTitle) {
            existingTitle.remove();
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
        
        // Copy exact styling from the legend element
        const legendStyle = window.getComputedStyle(legendElement);
        
        // Apply all the legend styles
        title.style.fontFamily = legendStyle.fontFamily;
        title.style.fontSize = legendStyle.fontSize;
        title.style.fontWeight = legendStyle.fontWeight;
        title.style.color = '#0275d8'; // Blue color
        title.style.textAlign = 'center';
        title.style.margin = '0 0 15px 0';
        title.style.padding = legendStyle.padding;
        title.style.borderBottom = legendStyle.borderBottom;
        title.style.display = 'block';
        title.style.width = '100%';
        
        // Insert the title at the beginning of the fixed-text-content section
        fixedTextContent.insertBefore(title, fixedTextContent.firstChild);
        
        console.log("Successfully fixed Fixed Layers title styling");
    } catch (error) {
        console.error("Error fixing Fixed Layers title styling:", error);
    }
}

// Fix the "Lat/long:Coordinates Text:" label
function fixLatLongLabel() {
    try {
        console.log("Fixing Lat/Long label");
        
        // Find all labels in the fixed-text-content section
        const labels = document.querySelectorAll('.fixed-text-content label');
        
        // Find the label with "Coordinates Text" and change it to "Lat/Long:"
        labels.forEach(label => {
            if (label.textContent.includes('Coordinates Text')) {
                label.textContent = 'Lat/Long:';
                console.log("Fixed Lat/Long label");
            }
        });
    } catch (error) {
        console.error("Error fixing Lat/Long label:", error);
    }
}

// Add date and coordinates value blocks
function addValueBlocks() {
    try {
        console.log("Adding date and coordinates value blocks");
        
        // Find the date input group in the Fixed Layers section
        const dateInputGroup = document.querySelector('.fixed-text-content .input-group:first-child');
        if (!dateInputGroup) {
            console.error("Date input group not found");
            return;
        }
        
        // Find the coordinates input group in the Fixed Layers section
        const coordsInputGroup = document.querySelector('.fixed-text-content .input-group:nth-child(2)');
        if (!coordsInputGroup) {
            console.error("Coordinates input group not found");
            return;
        }
        
        // Create date value block
        const dateValueBlock = document.createElement('div');
        dateValueBlock.id = 'fixed-date-value';
        dateValueBlock.style.width = '220px';
        dateValueBlock.style.minWidth = '220px';
        dateValueBlock.style.maxWidth = '220px';
        dateValueBlock.style.height = '30px';
        dateValueBlock.style.lineHeight = '30px';
        dateValueBlock.style.padding = '0 10px';
        dateValueBlock.style.marginRight = '10px';
        dateValueBlock.style.backgroundColor = '#f0f0f0';
        dateValueBlock.style.border = '1px solid #ddd';
        dateValueBlock.style.borderRadius = '4px';
        dateValueBlock.style.fontSize = '14px';
        dateValueBlock.style.color = '#333';
        dateValueBlock.style.fontFamily = 'inherit';
        dateValueBlock.style.whiteSpace = 'nowrap';
        dateValueBlock.style.overflow = 'hidden';
        dateValueBlock.style.textOverflow = 'ellipsis';
        
        // Create coordinates value block
        const coordsValueBlock = document.createElement('div');
        coordsValueBlock.id = 'fixed-coords-value';
        coordsValueBlock.style.width = '220px';
        coordsValueBlock.style.minWidth = '220px';
        coordsValueBlock.style.maxWidth = '220px';
        coordsValueBlock.style.height = '30px';
        coordsValueBlock.style.lineHeight = '30px';
        coordsValueBlock.style.padding = '0 10px';
        coordsValueBlock.style.marginRight = '10px';
        coordsValueBlock.style.backgroundColor = '#f0f0f0';
        coordsValueBlock.style.border = '1px solid #ddd';
        coordsValueBlock.style.borderRadius = '4px';
        coordsValueBlock.style.fontSize = '14px';
        coordsValueBlock.style.color = '#333';
        coordsValueBlock.style.fontFamily = 'inherit';
        coordsValueBlock.style.whiteSpace = 'nowrap';
        coordsValueBlock.style.overflow = 'hidden';
        coordsValueBlock.style.textOverflow = 'ellipsis';
        
        // Insert date value block after the label
        const dateLabel = dateInputGroup.querySelector('label');
        if (dateLabel) {
            // Check if there's already a value block
            const existingDateValueBlock = dateInputGroup.querySelector('#fixed-date-value');
            if (existingDateValueBlock) {
                existingDateValueBlock.remove();
            }
            
            // Insert after the label
            dateInputGroup.insertBefore(dateValueBlock, dateLabel.nextSibling);
        }
        
        // Insert coordinates value block after the label
        const coordsLabel = coordsInputGroup.querySelector('label');
        if (coordsLabel) {
            // Check if there's already a value block
            const existingCoordsValueBlock = coordsInputGroup.querySelector('#fixed-coords-value');
            if (existingCoordsValueBlock) {
                existingCoordsValueBlock.remove();
            }
            
            // Insert after the label
            coordsInputGroup.insertBefore(coordsValueBlock, coordsLabel.nextSibling);
        }
        
        console.log("Successfully added date and coordinates value blocks");
    } catch (error) {
        console.error("Error adding date and coordinates value blocks:", error);
    }
}

// Fix the font dropdowns
function fixFontDropdowns() {
    try {
        console.log("Fixing font dropdowns");
        
        // Find all font family dropdowns in the Fixed Layers section
        const fontFamilyDropdowns = document.querySelectorAll('.fixed-text-content .font-family-select');
        
        // Find all font size dropdowns in the Fixed Layers section
        const fontSizeDropdowns = document.querySelectorAll('.fixed-text-content .font-size-select');
        
        // Get reference to font dropdowns in the Customizable Text section
        const sourceFontFamily = document.querySelector('.text-entry-wrapper .font-family-select');
        const sourceFontSize = document.querySelector('.text-entry-wrapper .font-size-select');
        
        // Fix font family dropdowns
        fontFamilyDropdowns.forEach(dropdown => {
            // Set width to match the Customizable Text section
            if (sourceFontFamily) {
                dropdown.style.width = sourceFontFamily.offsetWidth + 'px';
                dropdown.style.minWidth = sourceFontFamily.offsetWidth + 'px';
            } else {
                dropdown.style.width = '150px';
                dropdown.style.minWidth = '120px';
            }
            
            // Set font family to Bebas Neue
            if (dropdown.options.length > 0) {
                for (let i = 0; i < dropdown.options.length; i++) {
                    if (dropdown.options[i].value === 'Bebas Neue') {
                        dropdown.selectedIndex = i;
                        break;
                    }
                }
            }
        });
        
        // Fix font size dropdowns
        fontSizeDropdowns.forEach(dropdown => {
            // Set width to match the Customizable Text section
            if (sourceFontSize) {
                dropdown.style.width = sourceFontSize.offsetWidth + 'px';
                dropdown.style.minWidth = sourceFontSize.offsetWidth + 'px';
            } else {
                dropdown.style.width = '70px';
                dropdown.style.minWidth = '60px';
            }
            
            // Set font size to 60px
            if (dropdown.options.length > 0) {
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
        
        // Find all color swatches in the Fixed Layers section
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
        
        // Double-check if there are still duplicate rows
        const remainingRows = document.querySelectorAll('.settings-row');
        let remainingPaperAutoSizeRows = [];
        
        remainingRows.forEach(row => {
            if (row.textContent.includes('Paper Auto-Size:')) {
                remainingPaperAutoSizeRows.push(row);
            }
        });
        
        if (remainingPaperAutoSizeRows.length > 1) {
            console.warn("Still found duplicate Paper Auto-Size rows after removal attempt");
            
            // Try a different approach
            const canvasSettings = document.getElementById('canvas-settings');
            if (canvasSettings) {
                const allRows = canvasSettings.querySelectorAll('.settings-row');
                let found = false;
                
                allRows.forEach(row => {
                    if (row.textContent.includes('Paper Auto-Size:')) {
                        if (found) {
                            row.remove();
                            console.log("Removed duplicate Paper Auto-Size row (second attempt)");
                        } else {
                            found = true;
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error("Error removing duplicate Paper Auto-Size row:", error);
    }
}

// Set up event listeners for date and coordinates
function setupEventListeners() {
    try {
        console.log("Setting up event listeners");
        
        // Function to update the date in the Fixed Layers section
        function updateFixedLayersDate() {
            try {
                // Get the date and time inputs
                const dateInput = document.getElementById('date');
                const timeInput = document.getElementById('time');
                const showTimeToggle = document.getElementById('show-time-toggle');
                const dateValueBlock = document.getElementById('fixed-date-value');
                
                if (!dateInput || !dateValueBlock) {
                    console.error("Date input or value block not found");
                    return;
                }
                
                // Format the date
                const date = new Date(dateInput.value);
                if (isNaN(date.getTime())) {
                    console.error("Invalid date");
                    return;
                }
                
                let formattedDate = date.toLocaleDateString('en-US', {
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
                
                // Update the Fixed Layers date value block
                dateValueBlock.textContent = formattedDate;
                
                // Update the Text Placements date
                const textPlacementsDate = document.getElementById('text-placement-content-date');
                if (textPlacementsDate) {
                    textPlacementsDate.textContent = formattedDate;
                }
                
                console.log("Updated date displays to:", formattedDate);
            } catch (error) {
                console.error("Error updating date displays:", error);
            }
        }
        
        // Function to update the coordinates in the Fixed Layers section
        function updateFixedLayersCoordinates() {
            try {
                // Get the latitude and longitude inputs
                const latInput = document.getElementById('latitude');
                const lonInput = document.getElementById('longitude');
                const coordsValueBlock = document.getElementById('fixed-coords-value');
                
                if (!latInput || !lonInput || !coordsValueBlock) {
                    console.error("Latitude, longitude inputs or value block not found");
                    return;
                }
                
                // Format the coordinates
                const coordsText = `${latInput.value} | ${lonInput.value}`;
                
                // Update the Fixed Layers coordinates value block
                coordsValueBlock.textContent = coordsText;
                
                // Update the Text Placements coordinates
                const textPlacementsCoords = document.getElementById('text-placement-content-coords');
                if (textPlacementsCoords) {
                    textPlacementsCoords.textContent = coordsText;
                }
                
                console.log("Updated coordinates displays to:", coordsText);
            } catch (error) {
                console.error("Error updating coordinates displays:", error);
            }
        }
        
        // Add event listeners to the date and time inputs
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const showTimeToggle = document.getElementById('show-time-toggle');
        
        if (dateInput) {
            dateInput.addEventListener('change', updateFixedLayersDate);
        }
        
        if (timeInput) {
            timeInput.addEventListener('change', updateFixedLayersDate);
        }
        
        if (showTimeToggle) {
            showTimeToggle.addEventListener('change', updateFixedLayersDate);
        }
        
        // Add event listeners to the latitude and longitude inputs
        const latInput = document.getElementById('latitude');
        const lonInput = document.getElementById('longitude');
        
        if (latInput) {
            latInput.addEventListener('input', updateFixedLayersCoordinates);
        }
        
        if (lonInput) {
            lonInput.addEventListener('input', updateFixedLayersCoordinates);
        }
        
        // Trigger initial updates
        updateFixedLayersDate();
        updateFixedLayersCoordinates();
        
        console.log("Successfully set up event listeners");
    } catch (error) {
        console.error("Error setting up event listeners:", error);
    }
}

/* END OF CODE - Cline - 2025-05-23 06:52:19 File: js/fixed-layers-fix-exact.js */
