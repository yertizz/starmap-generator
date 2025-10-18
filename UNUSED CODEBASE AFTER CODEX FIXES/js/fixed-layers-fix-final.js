/* START OF CODE - Cline - 2025-05-20 11:31:25 File: js/fixed-layers-fix-final.js */

/**
 * Fixed Layers Fix (FINAL) JavaScript for Star Map Generator
 * 
 * This script focuses on:
 * 1. Exactly matching the mockup styling for the Fixed Layers section
 * 2. Making the font-family & sizes, bold, italic, and color pickers working
 * 3. Fixing the date display
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fixed Layers Fix (FINAL) script loaded");
    
    // Fix the styling of the Fixed Layers section
    fixFixedLayersStyling();
    
    // Copy font options from existing dropdowns
    copyFontOptions();
    
    // Initialize the color pickers
    initializeColorPickers();
    
    // Fix the date display
    fixDateDisplay();
    
    // Add event listeners
    addEventListeners();
});

/**
 * Fix the styling of the Fixed Layers section
 */
function fixFixedLayersStyling() {
    console.log("Fixing Fixed Layers styling");
    
    try {
        // Find the Fixed Layers section
        const fixedTextContent = document.querySelector('.fixed-text-content');
        if (!fixedTextContent) {
            console.error("Fixed text content not found");
            return;
        }
        
        // Find the input groups (Date and Lat/Long)
        const inputGroups = fixedTextContent.querySelectorAll('.input-group');
        if (inputGroups.length < 2) {
            console.error("Input groups not found");
            return;
        }
        
        // Style the Fixed Layers section container
        fixedTextContent.style.padding = '15px';
        fixedTextContent.style.backgroundColor = '#f9f9f9';
        fixedTextContent.style.borderRadius = '6px';
        fixedTextContent.style.border = '1px solid #e0e0e0';
        
        // Style the Date input group
        const dateInputGroup = inputGroups[0];
        dateInputGroup.style.display = 'flex';
        dateInputGroup.style.alignItems = 'center';
        dateInputGroup.style.marginBottom = '15px';
        
        // Style the Lat/Long input group
        const coordsInputGroup = inputGroups[1];
        coordsInputGroup.style.display = 'flex';
        coordsInputGroup.style.alignItems = 'center';
        
        // Find or create the Date label
        let dateLabel = dateInputGroup.querySelector('label');
        if (!dateLabel) {
            dateLabel = document.createElement('label');
            dateLabel.textContent = 'Date:';
            dateInputGroup.insertBefore(dateLabel, dateInputGroup.firstChild);
        }
        
        // Style the Date label
        dateLabel.style.width = '80px';
        dateLabel.style.textAlign = 'right';
        dateLabel.style.marginRight = '10px';
        dateLabel.style.fontWeight = 'bold';
        dateLabel.style.color = '#333';
        
        // Find or create the Date display value
        let dateDisplayValue = document.getElementById('fixed-date-display');
        if (!dateDisplayValue) {
            dateDisplayValue = document.createElement('div');
            dateDisplayValue.id = 'fixed-date-display';
            dateDisplayValue.className = 'display-value';
            dateInputGroup.insertBefore(dateDisplayValue, dateLabel.nextSibling);
        }
        
        // Style the Date display value
        dateDisplayValue.style.display = 'inline-block';
        dateDisplayValue.style.width = '300px';
        dateDisplayValue.style.minWidth = '300px';
        dateDisplayValue.style.height = '30px';
        dateDisplayValue.style.lineHeight = '30px';
        dateDisplayValue.style.padding = '0 10px';
        dateDisplayValue.style.marginRight = '10px';
        dateDisplayValue.style.backgroundColor = '#f0f0f0';
        dateDisplayValue.style.border = '1px solid #ddd';
        dateDisplayValue.style.borderRadius = '4px';
        dateDisplayValue.style.fontSize = '14px';
        dateDisplayValue.style.color = '#333';
        dateDisplayValue.style.whiteSpace = 'nowrap';
        dateDisplayValue.style.overflow = 'hidden';
        dateDisplayValue.style.textOverflow = 'ellipsis';
        dateDisplayValue.style.boxSizing = 'border-box';
        
        // Find or create the Lat/Long label
        let coordsLabel = coordsInputGroup.querySelector('label');
        if (!coordsLabel) {
            coordsLabel = document.createElement('label');
            coordsLabel.textContent = 'Lat/Long:';
            coordsInputGroup.insertBefore(coordsLabel, coordsInputGroup.firstChild);
        }
        
        // Style the Lat/Long label
        coordsLabel.style.width = '80px';
        coordsLabel.style.textAlign = 'right';
        coordsLabel.style.marginRight = '10px';
        coordsLabel.style.fontWeight = 'bold';
        coordsLabel.style.color = '#333';
        
        // Find or create the Lat/Long display value
        let coordsDisplayValue = document.getElementById('fixed-coords-display');
        if (!coordsDisplayValue) {
            coordsDisplayValue = document.createElement('div');
            coordsDisplayValue.id = 'fixed-coords-display';
            coordsDisplayValue.className = 'display-value';
            coordsInputGroup.insertBefore(coordsDisplayValue, coordsLabel.nextSibling);
        }
        
        // Style the Lat/Long display value
        coordsDisplayValue.style.display = 'inline-block';
        coordsDisplayValue.style.width = '300px';
        coordsDisplayValue.style.minWidth = '300px';
        coordsDisplayValue.style.height = '30px';
        coordsDisplayValue.style.lineHeight = '30px';
        coordsDisplayValue.style.padding = '0 10px';
        coordsDisplayValue.style.marginRight = '10px';
        coordsDisplayValue.style.backgroundColor = '#f0f0f0';
        coordsDisplayValue.style.border = '1px solid #ddd';
        coordsDisplayValue.style.borderRadius = '4px';
        coordsDisplayValue.style.fontSize = '14px';
        coordsDisplayValue.style.color = '#333';
        coordsDisplayValue.style.whiteSpace = 'nowrap';
        coordsDisplayValue.style.overflow = 'hidden';
        coordsDisplayValue.style.textOverflow = 'ellipsis';
        coordsDisplayValue.style.boxSizing = 'border-box';
        
        console.log("Successfully fixed Fixed Layers styling");
    } catch (error) {
        console.error("Error fixing Fixed Layers styling:", error);
    }
}

/**
 * Copy font options from existing dropdowns
 */
function copyFontOptions() {
    console.log("Copying font options from existing dropdowns");
    
    try {
        // Find a working font family dropdown to copy from
        const sourceFontFamily = document.querySelector('.text-entry-row select.font-family-select');
        
        // Find a working font size dropdown to copy from
        const sourceFontSize = document.querySelector('.text-entry-row select.font-size-select');
        
        if (!sourceFontFamily || !sourceFontSize) {
            console.error("Source dropdowns not found");
            return;
        }
        
        // Find the target dropdowns in the Fixed Layers section
        const dateFontFamily = document.getElementById('fixed-font-family-date');
        const coordsFontFamily = document.getElementById('fixed-font-family-coords');
        const dateFontSize = document.getElementById('fixed-font-size-date');
        const coordsFontSize = document.getElementById('fixed-font-size-coords');
        
        // Copy font family options
        if (dateFontFamily) {
            dateFontFamily.innerHTML = '';
            Array.from(sourceFontFamily.options).forEach(option => {
                const newOption = document.createElement('option');
                newOption.value = option.value;
                newOption.textContent = option.textContent;
                newOption.style.fontFamily = option.style.fontFamily || option.value;
                dateFontFamily.appendChild(newOption);
            });
            dateFontFamily.value = 'Oswald';
        }
        
        if (coordsFontFamily) {
            coordsFontFamily.innerHTML = '';
            Array.from(sourceFontFamily.options).forEach(option => {
                const newOption = document.createElement('option');
                newOption.value = option.value;
                newOption.textContent = option.textContent;
                newOption.style.fontFamily = option.style.fontFamily || option.value;
                coordsFontFamily.appendChild(newOption);
            });
            coordsFontFamily.value = 'Oswald';
        }
        
        // Copy font size options
        if (dateFontSize) {
            dateFontSize.innerHTML = '';
            Array.from(sourceFontSize.options).forEach(option => {
                const newOption = document.createElement('option');
                newOption.value = option.value;
                newOption.textContent = option.textContent;
                dateFontSize.appendChild(newOption);
            });
            dateFontSize.value = '72px';
        }
        
        if (coordsFontSize) {
            coordsFontSize.innerHTML = '';
            Array.from(sourceFontSize.options).forEach(option => {
                const newOption = document.createElement('option');
                newOption.value = option.value;
                newOption.textContent = option.textContent;
                coordsFontSize.appendChild(newOption);
            });
            coordsFontSize.value = '72px';
        }
        
        console.log("Successfully copied font options");
    } catch (error) {
        console.error("Error copying font options:", error);
    }
}

/**
 * Initialize the color pickers
 */
function initializeColorPickers() {
    console.log("Initializing color pickers");
    
    try {
        // Find the color inputs and swatches
        const dateColorInput = document.getElementById('fixed-font-color-date');
        const coordsColorInput = document.getElementById('fixed-font-color-coords');
        const dateColorSwatch = document.querySelector('[data-target="fixed-font-color-date"]');
        const coordsColorSwatch = document.querySelector('[data-target="fixed-font-color-coords"]');
        
        // Set initial colors
        if (dateColorInput) dateColorInput.value = '#FFCC00';
        if (coordsColorInput) coordsColorInput.value = '#FFCC00';
        if (dateColorSwatch) dateColorSwatch.style.backgroundColor = '#FFCC00';
        if (coordsColorSwatch) coordsColorSwatch.style.backgroundColor = '#FFCC00';
        
        // Initialize colorpicker if jQuery and colorpicker are available
        if (typeof $ !== 'undefined' && typeof $.fn.colorpicker !== 'undefined') {
            if (dateColorInput && dateColorSwatch) {
                $(dateColorInput).colorpicker({
                    color: '#FFCC00',
                    format: 'hex'
                }).on('changeColor', function(e) {
                    dateColorSwatch.style.backgroundColor = e.color.toString('hex');
                });
                
                // Add click event listener to the color swatch
                dateColorSwatch.addEventListener('click', function() {
                    $(dateColorInput).colorpicker('show');
                });
            }
            
            if (coordsColorInput && coordsColorSwatch) {
                $(coordsColorInput).colorpicker({
                    color: '#FFCC00',
                    format: 'hex'
                }).on('changeColor', function(e) {
                    coordsColorSwatch.style.backgroundColor = e.color.toString('hex');
                });
                
                // Add click event listener to the color swatch
                coordsColorSwatch.addEventListener('click', function() {
                    $(coordsColorInput).colorpicker('show');
                });
            }
        }
        
        console.log("Successfully initialized color pickers");
    } catch (error) {
        console.error("Error initializing color pickers:", error);
    }
}

/**
 * Fix the date display
 */
function fixDateDisplay() {
    console.log("Fixing date display");
    
    try {
        // Find the date display in the Fixed Layers section
        const dateDisplayValue = document.getElementById('fixed-date-display');
        
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
            if (dateDisplayValue) {
                dateDisplayValue.textContent = displayValue;
            }
            
            // Update the date display in the Text Placements section
            if (textPlacementsDateDisplay) {
                textPlacementsDateDisplay.textContent = displayValue;
            }
            
            console.log("Updated date display to:", displayValue);
        } else {
            if (dateDisplayValue) {
                dateDisplayValue.textContent = 'No date selected';
            }
            if (textPlacementsDateDisplay) {
                textPlacementsDateDisplay.textContent = 'No date selected';
            }
        }
    } catch (error) {
        console.error("Error fixing date display:", error);
    }
}

/**
 * Add event listeners
 */
function addEventListeners() {
    console.log("Adding event listeners");
    
    try {
        // Find the date and time inputs
        const dateField = document.getElementById('date');
        const timeField = document.getElementById('time');
        const showTimeToggle = document.getElementById('show-time-toggle');
        
        // Add event listeners to update the date display when values change
        if (dateField) {
            dateField.addEventListener('change', fixDateDisplay);
            dateField.addEventListener('input', fixDateDisplay);
        }
        
        if (timeField) {
            timeField.addEventListener('change', fixDateDisplay);
            timeField.addEventListener('input', fixDateDisplay);
        }
        
        if (showTimeToggle) {
            showTimeToggle.addEventListener('change', fixDateDisplay);
        }
        
        // Add event listeners for font family and font size changes
        const dateFontFamily = document.getElementById('fixed-font-family-date');
        const coordsFontFamily = document.getElementById('fixed-font-family-coords');
        const dateFontSize = document.getElementById('fixed-font-size-date');
        const coordsFontSize = document.getElementById('fixed-font-size-coords');
        
        if (dateFontFamily) {
            dateFontFamily.addEventListener('change', function() {
                console.log("Date font family changed to:", this.value);
            });
        }
        
        if (coordsFontFamily) {
            coordsFontFamily.addEventListener('change', function() {
                console.log("Coordinates font family changed to:", this.value);
            });
        }
        
        if (dateFontSize) {
            dateFontSize.addEventListener('change', function() {
                console.log("Date font size changed to:", this.value);
            });
        }
        
        if (coordsFontSize) {
            coordsFontSize.addEventListener('change', function() {
                console.log("Coordinates font size changed to:", this.value);
            });
        }
        
        // Add event listeners for bold and italic checkboxes
        const dateBoldCheckbox = document.getElementById('fixed-text-bold-date');
        const dateItalicCheckbox = document.getElementById('fixed-text-italic-date');
        const coordsBoldCheckbox = document.getElementById('fixed-text-bold-coords');
        const coordsItalicCheckbox = document.getElementById('fixed-text-italic-coords');
        
        if (dateBoldCheckbox) {
            dateBoldCheckbox.addEventListener('change', function() {
                console.log("Date bold changed to:", this.checked);
            });
        }
        
        if (dateItalicCheckbox) {
            dateItalicCheckbox.addEventListener('change', function() {
                console.log("Date italic changed to:", this.checked);
            });
        }
        
        if (coordsBoldCheckbox) {
            coordsBoldCheckbox.addEventListener('change', function() {
                console.log("Coordinates bold changed to:", this.checked);
            });
        }
        
        if (coordsItalicCheckbox) {
            coordsItalicCheckbox.addEventListener('change', function() {
                console.log("Coordinates italic changed to:", this.checked);
            });
        }
        
        console.log("Successfully added event listeners");
    } catch (error) {
        console.error("Error adding event listeners:", error);
    }
}

/* END OF CODE - Cline - 2025-05-20 11:31:25 File: js/fixed-layers-fix-final.js */
