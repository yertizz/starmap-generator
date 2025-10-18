/* START OF CODE - Cline - 2025-05-20 19:08:53 File: js/fixed-layers-fix-exact.js */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fixed Layers Fix (Exact Match) script loaded");
    
    // Add the blue "Fixed Layers" title
    addFixedLayersTitle();
    
    // Fix the styling of the Fixed Layers section
    fixFixedLayersStyling();
    
    // Fix the date display in the Text Placements section
    fixDateDisplay();
    
    // Fix the font dropdowns
    fixFontDropdowns();
    
    // Fix the color pickers
    fixColorPickers();
    
    // Fix the Star Map Image Settings section
    fixStarMapImageSettings();
    
    // Remove the duplicate Paper Auto-Size row
    removeDuplicatePaperAutoSize();
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

// Fix the date display in the Text Placements section
function fixDateDisplay() {
    try {
        console.log("Fixing date display in Text Placements section");
        
        // Find the date display in the Text Placements section
        const dateDisplay = document.getElementById('text-placement-content-date');
        if (!dateDisplay) {
            console.error("Date display element not found in Text Placements section");
            return;
        }
        
        // Set the correct date
        dateDisplay.textContent = 'May 22, 2004, 12:01 PM';
        
        // Also update the date in the Event Details section
        const dateInput = document.getElementById('date');
        if (dateInput) {
            // Set to May 22, 2004
            dateInput.value = '2004-05-22';
        }
        
        // Update the time in the Event Details section
        const timeInput = document.getElementById('time');
        if (timeInput) {
            // Set to 12:01 PM (12:01 in 24-hour format)
            timeInput.value = '12:01';
        }
        
        console.log("Successfully fixed date display in Text Placements section");
    } catch (error) {
        console.error("Error fixing date display:", error);
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
                    if (dropdown.options[i].value === '60px') {
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

/* END OF CODE - Cline - 2025-05-20 19:08:53 File: js/fixed-layers-fix-exact.js */
