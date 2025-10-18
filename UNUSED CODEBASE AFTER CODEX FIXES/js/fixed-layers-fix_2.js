/* START OF CODE - Cline - 2025-05-20 10:51:52 File: js/fixed-layers-fix_2.js */

/**
 * Fixed Layers Fix (Part 2) JavaScript for Star Map Generator
 * 
 * This script focuses on:
 * 1. Fixing the date being off by one day
 * 2. Updating the date display in both Fixed Layers and Text Placements sections
 * 3. Populating font family and font size dropdowns
 * 4. Matching the styling from Text Placements container
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fixed Layers Fix (Part 2) script loaded");
    
    // Fix the font dropdowns
    fixFontDropdowns();
    
    // Add event listeners to the date field
    setupDateListeners();
    
    // Initial update of date
    updateDateDisplay();
    
    // Fix the styling of the display blocks
    fixDisplayBlockStyling();
});

/**
 * Fix the font family and font size dropdowns
 */
function fixFontDropdowns() {
    console.log("Fixing font dropdowns");
    
    try {
        // Font options with native styling
        const fontOptions = [
            { value: 'Oswald', label: 'Oswald', style: 'font-family: "Oswald", sans-serif;' },
            { value: 'Arial', label: 'Arial', style: 'font-family: Arial, sans-serif;' },
            { value: 'Helvetica', label: 'Helvetica', style: 'font-family: Helvetica, sans-serif;' },
            { value: 'Times New Roman', label: 'Times New Roman', style: 'font-family: "Times New Roman", serif;' },
            { value: 'Courier New', label: 'Courier New', style: 'font-family: "Courier New", monospace;' },
            { value: 'Verdana', label: 'Verdana', style: 'font-family: Verdana, sans-serif;' },
            { value: 'Georgia', label: 'Georgia', style: 'font-family: Georgia, serif;' },
            { value: 'Tahoma', label: 'Tahoma', style: 'font-family: Tahoma, sans-serif;' },
            { value: 'Trebuchet MS', label: 'Trebuchet MS', style: 'font-family: "Trebuchet MS", sans-serif;' },
            { value: 'Impact', label: 'Impact', style: 'font-family: Impact, sans-serif;' }
        ];
        
        // Font size options
        const fontSizes = ['72px', '60px', '48px', '36px', '24px', '18px', '16px', '14px', '12px', '10px'];
        
        // Find the font family dropdowns
        const dateFontFamily = document.getElementById('fixed-font-family-date');
        const coordsFontFamily = document.getElementById('fixed-font-family-coords');
        
        // Find the font size dropdowns
        const dateFontSize = document.getElementById('fixed-font-size-date');
        const coordsFontSize = document.getElementById('fixed-font-size-coords');
        
        // Clear and populate the font family dropdowns
        if (dateFontFamily) {
            dateFontFamily.innerHTML = '';
            fontOptions.forEach(font => {
                const option = document.createElement('option');
                option.value = font.value;
                option.textContent = font.label;
                option.setAttribute('style', font.style);
                dateFontFamily.appendChild(option);
            });
            dateFontFamily.value = 'Oswald';
        }
        
        if (coordsFontFamily) {
            coordsFontFamily.innerHTML = '';
            fontOptions.forEach(font => {
                const option = document.createElement('option');
                option.value = font.value;
                option.textContent = font.label;
                option.setAttribute('style', font.style);
                coordsFontFamily.appendChild(option);
            });
            coordsFontFamily.value = 'Oswald';
        }
        
        // Clear and populate the font size dropdowns
        if (dateFontSize) {
            dateFontSize.innerHTML = '';
            fontSizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                option.style.fontSize = size;
                dateFontSize.appendChild(option);
            });
            dateFontSize.value = '72px';
        }
        
        if (coordsFontSize) {
            coordsFontSize.innerHTML = '';
            fontSizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                option.style.fontSize = size;
                coordsFontSize.appendChild(option);
            });
            coordsFontSize.value = '72px';
        }
        
        console.log("Successfully fixed font dropdowns");
    } catch (error) {
        console.error("Error fixing font dropdowns:", error);
    }
}

/**
 * Setup event listeners for the date field
 */
function setupDateListeners() {
    console.log("Setting up date listeners");
    
    try {
        // Find the date and time inputs
        const dateField = document.getElementById('date');
        const timeField = document.getElementById('time');
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
        
        console.log("Successfully set up date listeners");
    } catch (error) {
        console.error("Error setting up date listeners:", error);
    }
}

/**
 * Update the date display in both Fixed Layers and Text Placements sections
 */
function updateDateDisplay() {
    try {
        console.log("Updating date display");
        
        // Find the date display in the Fixed Layers section
        const fixedDateDisplay = document.getElementById('fixed-date-display');
        
        // Find the date display in the Text Placements section
        const textPlacementsDateDisplay = document.getElementById('text-placement-content-date');
        
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
            const date = new Date(year, month, day);
            
            // Add one day to fix the off-by-one issue
            date.setDate(date.getDate() + 1);
            
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
            
            // Update the date display in the Fixed Layers section
            if (fixedDateDisplay) {
                fixedDateDisplay.textContent = displayValue;
            }
            
            // Update the date display in the Text Placements section
            if (textPlacementsDateDisplay) {
                textPlacementsDateDisplay.textContent = displayValue;
            }
            
            console.log("Updated date display to:", displayValue);
        } else {
            if (fixedDateDisplay) {
                fixedDateDisplay.textContent = 'No date selected';
            }
            if (textPlacementsDateDisplay) {
                textPlacementsDateDisplay.textContent = 'No date selected';
            }
        }
    } catch (error) {
        console.error("Error updating date display:", error);
    }
}

/**
 * Fix the styling of the display blocks to match the Text Placements container
 */
function fixDisplayBlockStyling() {
    console.log("Fixing display block styling");
    
    try {
        // Find the display blocks in the Fixed Layers section
        const dateDisplayValue = document.getElementById('fixed-date-display');
        const coordsDisplayValue = document.getElementById('fixed-coords-display');
        
        // Find the Text Placements container to copy styles from
        const textPlacementsContainer = document.querySelector('.text-placement-container');
        let textPlacementsDateDisplay = null;
        let textPlacementsCoordsDisplay = null;
        
        if (textPlacementsContainer) {
            // Find the date and coordinates display elements in the Text Placements container
            const dateRow = textPlacementsContainer.querySelector('.text-placement-row[data-field="date"]');
            const coordsRow = textPlacementsContainer.querySelector('.text-placement-row[data-field="coordinates"]');
            
            if (dateRow) {
                textPlacementsDateDisplay = dateRow.querySelector('.text-placement-content');
            }
            
            if (coordsRow) {
                textPlacementsCoordsDisplay = coordsRow.querySelector('.text-placement-content');
            }
        }
        
        // Apply styles to the date display value
        if (dateDisplayValue && textPlacementsDateDisplay) {
            // Get computed styles
            const computedStyles = window.getComputedStyle(textPlacementsDateDisplay);
            
            // Apply the same styles to the date display value
            dateDisplayValue.style.backgroundColor = computedStyles.backgroundColor;
            dateDisplayValue.style.border = computedStyles.border;
            dateDisplayValue.style.borderRadius = computedStyles.borderRadius;
            dateDisplayValue.style.padding = computedStyles.padding;
            dateDisplayValue.style.width = '300px';
            dateDisplayValue.style.minWidth = '300px';
            dateDisplayValue.style.height = '30px';
            dateDisplayValue.style.lineHeight = '30px';
            dateDisplayValue.style.fontSize = computedStyles.fontSize;
            dateDisplayValue.style.color = computedStyles.color;
            dateDisplayValue.style.marginRight = '10px';
            dateDisplayValue.style.whiteSpace = 'nowrap';
            dateDisplayValue.style.overflow = 'hidden';
            dateDisplayValue.style.textOverflow = 'ellipsis';
            dateDisplayValue.style.boxSizing = 'border-box';
            dateDisplayValue.style.display = 'inline-block';
        } else if (dateDisplayValue) {
            // Default styles if Text Placements container is not available
            dateDisplayValue.style.backgroundColor = '#f0f0f0';
            dateDisplayValue.style.border = '1px solid #ddd';
            dateDisplayValue.style.borderRadius = '4px';
            dateDisplayValue.style.padding = '0 10px';
            dateDisplayValue.style.width = '300px';
            dateDisplayValue.style.minWidth = '300px';
            dateDisplayValue.style.height = '30px';
            dateDisplayValue.style.lineHeight = '30px';
            dateDisplayValue.style.fontSize = '14px';
            dateDisplayValue.style.color = '#333';
            dateDisplayValue.style.marginRight = '10px';
            dateDisplayValue.style.whiteSpace = 'nowrap';
            dateDisplayValue.style.overflow = 'hidden';
            dateDisplayValue.style.textOverflow = 'ellipsis';
            dateDisplayValue.style.boxSizing = 'border-box';
            dateDisplayValue.style.display = 'inline-block';
        }
        
        // Apply styles to the coordinates display value
        if (coordsDisplayValue && textPlacementsCoordsDisplay) {
            // Get computed styles
            const computedStyles = window.getComputedStyle(textPlacementsCoordsDisplay);
            
            // Apply the same styles to the coordinates display value
            coordsDisplayValue.style.backgroundColor = computedStyles.backgroundColor;
            coordsDisplayValue.style.border = computedStyles.border;
            coordsDisplayValue.style.borderRadius = computedStyles.borderRadius;
            coordsDisplayValue.style.padding = computedStyles.padding;
            coordsDisplayValue.style.width = '300px';
            coordsDisplayValue.style.minWidth = '300px';
            coordsDisplayValue.style.height = '30px';
            coordsDisplayValue.style.lineHeight = '30px';
            coordsDisplayValue.style.fontSize = computedStyles.fontSize;
            coordsDisplayValue.style.color = computedStyles.color;
            coordsDisplayValue.style.marginRight = '10px';
            coordsDisplayValue.style.whiteSpace = 'nowrap';
            coordsDisplayValue.style.overflow = 'hidden';
            coordsDisplayValue.style.textOverflow = 'ellipsis';
            coordsDisplayValue.style.boxSizing = 'border-box';
            coordsDisplayValue.style.display = 'inline-block';
        } else if (coordsDisplayValue) {
            // Default styles if Text Placements container is not available
            coordsDisplayValue.style.backgroundColor = '#f0f0f0';
            coordsDisplayValue.style.border = '1px solid #ddd';
            coordsDisplayValue.style.borderRadius = '4px';
            coordsDisplayValue.style.padding = '0 10px';
            coordsDisplayValue.style.width = '300px';
            coordsDisplayValue.style.minWidth = '300px';
            coordsDisplayValue.style.height = '30px';
            coordsDisplayValue.style.lineHeight = '30px';
            coordsDisplayValue.style.fontSize = '14px';
            coordsDisplayValue.style.color = '#333';
            coordsDisplayValue.style.marginRight = '10px';
            coordsDisplayValue.style.whiteSpace = 'nowrap';
            coordsDisplayValue.style.overflow = 'hidden';
            coordsDisplayValue.style.textOverflow = 'ellipsis';
            coordsDisplayValue.style.boxSizing = 'border-box';
            coordsDisplayValue.style.display = 'inline-block';
        }
        
        // Fix the label styling
        const dateLabel = document.querySelector('.fixed-text-content .input-group:nth-child(1) label');
        const coordsLabel = document.querySelector('.fixed-text-content .input-group:nth-child(2) label');
        
        if (dateLabel) {
            dateLabel.style.width = '80px';
            dateLabel.style.textAlign = 'right';
            dateLabel.style.marginRight = '10px';
            dateLabel.style.fontWeight = 'bold';
            dateLabel.style.color = '#333';
        }
        
        if (coordsLabel) {
            coordsLabel.style.width = '80px';
            coordsLabel.style.textAlign = 'right';
            coordsLabel.style.marginRight = '10px';
            coordsLabel.style.fontWeight = 'bold';
            coordsLabel.style.color = '#333';
        }
        
        console.log("Successfully fixed display block styling");
    } catch (error) {
        console.error("Error fixing display block styling:", error);
    }
}

/* END OF CODE - Cline - 2025-05-20 10:51:52 File: js/fixed-layers-fix_2.js */
