/* START OF CODE - Cline - 2025-05-20 10:42:55 File: js/fixed-layers-fix.js */

/**
 * Fixed Layers Fix JavaScript for Star Map Generator
 * 
 * This script focuses on:
 * 1. Fixing the date and coordinates display in the Fixed Layers section
 * 2. Adding display blocks for the date and coordinates
 * 3. Fixing the date being off by one day
 * 4. Populating the font family and font size dropdowns
 * 5. Making the color pickers work
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fixed Layers Fix script loaded");
    
    // Update fixed layers display boxes
    updateFixedLayersDisplayBoxes();
    
    // Setup MutationObserver to watch for changes to the date and coordinates
    setupMutationObservers();
    
    // Add direct event listener for map clicks
    addMapClickListener();
    
    // Initial update of date and coordinates
    updateDateDisplay();
    updateCoordsDisplay();
});

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
        
        // First, find the Text Placements container to copy styles from
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
        
        // Update the date input group
        const dateInputGroup = inputGroups[0];
        
        // Clear any existing content in the date input group
        dateInputGroup.innerHTML = '';
        
        // Create the date label
        const dateLabel = document.createElement('label');
        dateLabel.textContent = 'Date:';
        dateLabel.htmlFor = 'fixed-date-display';
        dateLabel.style.width = '80px';
        dateLabel.style.textAlign = 'right';
        dateLabel.style.marginRight = '10px';
        dateLabel.style.fontWeight = 'bold';
        dateLabel.style.color = '#333';
        
        // Create the date display value
        const dateDisplayValue = document.createElement('div');
        dateDisplayValue.id = 'fixed-date-display';
        dateDisplayValue.className = 'display-value';
        dateDisplayValue.textContent = 'No date selected';
        
        // Copy styles from the Text Placements container if available
        if (textPlacementsDateDisplay) {
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
        } else {
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
        
        // Create the font controls for the date
        const dateFontControls = document.createElement('div');
        dateFontControls.className = 'font-controls';
        dateFontControls.style.display = 'flex';
        dateFontControls.style.flexWrap = 'wrap';
        dateFontControls.style.alignItems = 'center';
        dateFontControls.style.marginLeft = '0';
        
        // Font family select
        const dateFontFamily = document.createElement('select');
        dateFontFamily.id = 'fixed-font-family-date';
        dateFontFamily.className = 'font-family-select';
        dateFontFamily.style.marginRight = '10px';
        dateFontFamily.style.padding = '4px 8px';
        dateFontFamily.style.border = '1px solid #ccc';
        dateFontFamily.style.borderRadius = '4px';
        dateFontFamily.style.backgroundColor = 'white';
        dateFontFamily.style.width = 'auto';
        dateFontFamily.style.minWidth = '100px';
        
        // Add font options with native styling
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
        
        fontOptions.forEach(font => {
            const option = document.createElement('option');
            option.value = font.value;
            option.textContent = font.label;
            option.setAttribute('style', font.style);
            dateFontFamily.appendChild(option);
        });
        
        // Font size select
        const dateFontSize = document.createElement('select');
        dateFontSize.id = 'fixed-font-size-date';
        dateFontSize.className = 'font-size-select';
        dateFontSize.style.marginRight = '10px';
        dateFontSize.style.padding = '4px 8px';
        dateFontSize.style.border = '1px solid #ccc';
        dateFontSize.style.borderRadius = '4px';
        dateFontSize.style.backgroundColor = 'white';
        dateFontSize.style.width = 'auto';
        dateFontSize.style.minWidth = '100px';
        
        // Add font size options
        const fontSizes = ['72px', '60px', '48px', '36px', '24px', '18px', '16px', '14px', '12px', '10px'];
        fontSizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            option.style.fontSize = size;
            dateFontSize.appendChild(option);
        });
        
        // Style options (bold, italic)
        const dateStyleOptions = document.createElement('div');
        dateStyleOptions.className = 'style-options';
        dateStyleOptions.style.display = 'flex';
        dateStyleOptions.style.alignItems = 'center';
        dateStyleOptions.style.marginRight = '10px';
        
        // Bold checkbox
        const dateBoldLabel = document.createElement('label');
        dateBoldLabel.style.width = 'auto';
        dateBoldLabel.style.marginRight = '10px';
        dateBoldLabel.style.textAlign = 'left';
        dateBoldLabel.style.fontWeight = 'normal';
        
        const dateBoldCheckbox = document.createElement('input');
        dateBoldCheckbox.type = 'checkbox';
        dateBoldCheckbox.id = 'fixed-text-bold-date';
        dateBoldLabel.appendChild(dateBoldCheckbox);
        dateBoldLabel.appendChild(document.createTextNode(' Bold'));
        
        // Italic checkbox
        const dateItalicLabel = document.createElement('label');
        dateItalicLabel.style.width = 'auto';
        dateItalicLabel.style.marginRight = '10px';
        dateItalicLabel.style.textAlign = 'left';
        dateItalicLabel.style.fontWeight = 'normal';
        
        const dateItalicCheckbox = document.createElement('input');
        dateItalicCheckbox.type = 'checkbox';
        dateItalicCheckbox.id = 'fixed-text-italic-date';
        dateItalicLabel.appendChild(dateItalicCheckbox);
        dateItalicLabel.appendChild(document.createTextNode(' Italic'));
        
        // Add bold and italic checkboxes to style options
        dateStyleOptions.appendChild(dateBoldLabel);
        dateStyleOptions.appendChild(dateItalicLabel);
        
        // Color picker
        const dateColorInput = document.createElement('input');
        dateColorInput.type = 'text';
        dateColorInput.id = 'fixed-font-color-date';
        dateColorInput.value = '#FFCC00';
        dateColorInput.style.display = 'none';
        
        const dateColorSwatch = document.createElement('button');
        dateColorSwatch.type = 'button';
        dateColorSwatch.className = 'color-swatch';
        dateColorSwatch.style.width = '24px';
        dateColorSwatch.style.height = '24px';
        dateColorSwatch.style.borderRadius = '50%';
        dateColorSwatch.style.border = '1px solid #ccc';
        dateColorSwatch.style.cursor = 'pointer';
        dateColorSwatch.style.backgroundColor = '#FFCC00';
        dateColorSwatch.setAttribute('data-target', 'fixed-font-color-date');
        dateColorSwatch.setAttribute('aria-label', 'Fixed Date Font Color');
        
        // Add event listener to the color swatch
        dateColorSwatch.addEventListener('click', function() {
            // Check if the color picker is already initialized
            if (typeof $.fn.colorpicker !== 'undefined') {
                $(dateColorInput).colorpicker('show');
            } else {
                console.error("Color picker not initialized");
            }
        });
        
        // Add all elements to font controls
        dateFontControls.appendChild(dateFontFamily);
        dateFontControls.appendChild(dateFontSize);
        dateFontControls.appendChild(dateStyleOptions);
        dateFontControls.appendChild(dateColorInput);
        dateFontControls.appendChild(dateColorSwatch);
        
        // Add all elements to date input group
        dateInputGroup.appendChild(dateLabel);
        dateInputGroup.appendChild(dateDisplayValue);
        dateInputGroup.appendChild(dateFontControls);
        
        // Update the coordinates input group
        const coordsInputGroup = inputGroups[1];
        
        // Clear any existing content in the coordinates input group
        coordsInputGroup.innerHTML = '';
        
        // Create the coordinates label
        const coordsLabel = document.createElement('label');
        coordsLabel.textContent = 'Lat/Long:';
        coordsLabel.htmlFor = 'fixed-coords-display';
        coordsLabel.style.width = '80px';
        coordsLabel.style.textAlign = 'right';
        coordsLabel.style.marginRight = '10px';
        coordsLabel.style.fontWeight = 'bold';
        coordsLabel.style.color = '#333';
        
        // Create the coordinates display value
        const coordsDisplayValue = document.createElement('div');
        coordsDisplayValue.id = 'fixed-coords-display';
        coordsDisplayValue.className = 'display-value';
        coordsDisplayValue.textContent = 'No coordinates selected';
        
        // Copy styles from the Text Placements container if available
        if (textPlacementsCoordsDisplay) {
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
        } else {
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
        
        // Create the font controls for the coordinates
        const coordsFontControls = document.createElement('div');
        coordsFontControls.className = 'font-controls';
        coordsFontControls.style.display = 'flex';
        coordsFontControls.style.flexWrap = 'wrap';
        coordsFontControls.style.alignItems = 'center';
        coordsFontControls.style.marginLeft = '0';
        
        // Font family select
        const coordsFontFamily = document.createElement('select');
        coordsFontFamily.id = 'fixed-font-family-coords';
        coordsFontFamily.className = 'font-family-select';
        coordsFontFamily.style.marginRight = '10px';
        coordsFontFamily.style.padding = '4px 8px';
        coordsFontFamily.style.border = '1px solid #ccc';
        coordsFontFamily.style.borderRadius = '4px';
        coordsFontFamily.style.backgroundColor = 'white';
        coordsFontFamily.style.width = 'auto';
        coordsFontFamily.style.minWidth = '100px';
        
        // Add font options with native styling
        fontOptions.forEach(font => {
            const option = document.createElement('option');
            option.value = font.value;
            option.textContent = font.label;
            option.setAttribute('style', font.style);
            coordsFontFamily.appendChild(option);
        });
        
        // Font size select
        const coordsFontSize = document.createElement('select');
        coordsFontSize.id = 'fixed-font-size-coords';
        coordsFontSize.className = 'font-size-select';
        coordsFontSize.style.marginRight = '10px';
        coordsFontSize.style.padding = '4px 8px';
        coordsFontSize.style.border = '1px solid #ccc';
        coordsFontSize.style.borderRadius = '4px';
        coordsFontSize.style.backgroundColor = 'white';
        coordsFontSize.style.width = 'auto';
        coordsFontSize.style.minWidth = '100px';
        
        // Add font size options
        fontSizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            option.style.fontSize = size;
            coordsFontSize.appendChild(option);
        });
        
        // Style options (bold, italic)
        const coordsStyleOptions = document.createElement('div');
        coordsStyleOptions.className = 'style-options';
        coordsStyleOptions.style.display = 'flex';
        coordsStyleOptions.style.alignItems = 'center';
        coordsStyleOptions.style.marginRight = '10px';
        
        // Bold checkbox
        const coordsBoldLabel = document.createElement('label');
        coordsBoldLabel.style.width = 'auto';
        coordsBoldLabel.style.marginRight = '10px';
        coordsBoldLabel.style.textAlign = 'left';
        coordsBoldLabel.style.fontWeight = 'normal';
        
        const coordsBoldCheckbox = document.createElement('input');
        coordsBoldCheckbox.type = 'checkbox';
        coordsBoldCheckbox.id = 'fixed-text-bold-coords';
        coordsBoldLabel.appendChild(coordsBoldCheckbox);
        coordsBoldLabel.appendChild(document.createTextNode(' Bold'));
        
        // Italic checkbox
        const coordsItalicLabel = document.createElement('label');
        coordsItalicLabel.style.width = 'auto';
        coordsItalicLabel.style.marginRight = '10px';
        coordsItalicLabel.style.textAlign = 'left';
        coordsItalicLabel.style.fontWeight = 'normal';
        
        const coordsItalicCheckbox = document.createElement('input');
        coordsItalicCheckbox.type = 'checkbox';
        coordsItalicCheckbox.id = 'fixed-text-italic-coords';
        coordsItalicLabel.appendChild(coordsItalicCheckbox);
        coordsItalicLabel.appendChild(document.createTextNode(' Italic'));
        
        // Add bold and italic checkboxes to style options
        coordsStyleOptions.appendChild(coordsBoldLabel);
        coordsStyleOptions.appendChild(coordsItalicLabel);
        
        // Color picker
        const coordsColorInput = document.createElement('input');
        coordsColorInput.type = 'text';
        coordsColorInput.id = 'fixed-font-color-coords';
        coordsColorInput.value = '#FFCC00';
        coordsColorInput.style.display = 'none';
        
        const coordsColorSwatch = document.createElement('button');
        coordsColorSwatch.type = 'button';
        coordsColorSwatch.className = 'color-swatch';
        coordsColorSwatch.style.width = '24px';
        coordsColorSwatch.style.height = '24px';
        coordsColorSwatch.style.borderRadius = '50%';
        coordsColorSwatch.style.border = '1px solid #ccc';
        coordsColorSwatch.style.cursor = 'pointer';
        coordsColorSwatch.style.backgroundColor = '#FFCC00';
        coordsColorSwatch.setAttribute('data-target', 'fixed-font-color-coords');
        coordsColorSwatch.setAttribute('aria-label', 'Fixed Coordinates Font Color');
        
        // Add event listener to the color swatch
        coordsColorSwatch.addEventListener('click', function() {
            // Check if the color picker is already initialized
            if (typeof $.fn.colorpicker !== 'undefined') {
                $(coordsColorInput).colorpicker('show');
            } else {
                console.error("Color picker not initialized");
            }
        });
        
        // Add all elements to font controls
        coordsFontControls.appendChild(coordsFontFamily);
        coordsFontControls.appendChild(coordsFontSize);
        coordsFontControls.appendChild(coordsStyleOptions);
        coordsFontControls.appendChild(coordsColorInput);
        coordsFontControls.appendChild(coordsColorSwatch);
        
        // Add all elements to coordinates input group
        coordsInputGroup.appendChild(coordsLabel);
        coordsInputGroup.appendChild(coordsDisplayValue);
        coordsInputGroup.appendChild(coordsFontControls);
        
        // Initialize color pickers if jQuery and colorpicker are available
        if (typeof $ !== 'undefined' && typeof $.fn.colorpicker !== 'undefined') {
            $(dateColorInput).colorpicker({
                color: '#FFCC00',
                format: 'hex'
            }).on('changeColor', function(e) {
                dateColorSwatch.style.backgroundColor = e.color.toString('hex');
            });
            
            $(coordsColorInput).colorpicker({
                color: '#FFCC00',
                format: 'hex'
            }).on('changeColor', function(e) {
                coordsColorSwatch.style.backgroundColor = e.color.toString('hex');
            });
        }
        
        // Set default values for font family and font size
        dateFontFamily.value = 'Oswald';
        dateFontSize.value = '72px';
        coordsFontFamily.value = 'Oswald';
        coordsFontSize.value = '72px';
        
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
        
        // Find the date display in the Fixed Layers section
        const dateDisplayValue = document.getElementById('fixed-date-display');
        
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
            if (dateDisplaySpan) {
                dateDisplaySpan.textContent = displayValue;
            }
            
            console.log("Updated date display to:", displayValue);
        } else {
            if (dateDisplayValue) {
                dateDisplayValue.textContent = 'No date selected';
            }
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
        
        // Find the coordinates display in the Fixed Layers section
        const coordsDisplayValue = document.getElementById('fixed-coords-display');
        
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
            
            // Update the coordinates display in the Fixed Layers section
            if (coordsDisplayValue) {
                coordsDisplayValue.textContent = coordsText;
            }
            
            // Update the coordinates display in the Text Placements section
            if (coordsDisplaySpan) {
                coordsDisplaySpan.textContent = coordsText;
            }
            
            console.log("Updated coordinates display to:", coordsText);
        } else {
            if (coordsDisplayValue) {
                coordsDisplayValue.textContent = 'No coordinates selected';
            }
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
        const dateField = document.getElementByI
