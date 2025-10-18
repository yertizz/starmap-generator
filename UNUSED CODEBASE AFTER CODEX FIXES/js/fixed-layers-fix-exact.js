/* START OF CODE - Cline - 2025-05-23 15:34:50 File: js/fixed-layers-fix-exact.js */

// Script to fix the Fixed Layers section
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fixed Layers Fix script loaded");
    
    // Wait a moment for everything to be ready
    setTimeout(function() {
        try {
            // 1. Fix the "Fixed Layers" title styling (only if it doesn't exist)
            const fixedTextContent = document.querySelector('.fixed-text-content');
            if (fixedTextContent && !fixedTextContent.querySelector('h3')) {
                // Create the title element
                const title = document.createElement('h3');
                title.textContent = 'Fixed Layers';
                title.style.fontFamily = 'inherit';
                title.style.fontSize = '18px';
                title.style.fontWeight = 'bold';
                title.style.color = '#0275d8'; // Blue color
                title.style.textAlign = 'center';
                title.style.margin = '0 0 15px 0';
                title.style.padding = '0';
                title.style.borderBottom = '1px solid #eee';
                title.style.display = 'block';
                title.style.width = '100%';
                
                // Insert the title at the beginning of the fixed-text-content section
                fixedTextContent.insertBefore(title, fixedTextContent.firstChild);
                console.log("Added Fixed Layers title");
            }
            
            // 2. Fix the "Lat/long:Coordinates Text:" label
            const labels = document.querySelectorAll('.fixed-text-content label');
            labels.forEach(label => {
                if (label.textContent.includes('Coordinates Text')) {
                    label.textContent = 'Lat/Long:';
                    console.log("Fixed Lat/Long label");
                }
            });
            
            // 3. Add date and coordinates value blocks (only if they don't exist)
            const dateInputGroup = document.querySelector('.fixed-text-content .input-group:first-child');
            const coordsInputGroup = document.querySelector('.fixed-text-content .input-group:nth-child(2)');
            
            if (dateInputGroup && coordsInputGroup) {
                // Check if value blocks already exist
                if (!document.getElementById('fixed-date-value')) {
                    const dateFontFamily = dateInputGroup.querySelector('.font-family-select');
                    
                    if (dateFontFamily) {
                        // Create date value block with ID for easy updating
                        const dateValueBlock = document.createElement('div');
                        dateValueBlock.id = 'fixed-date-value';
                        dateValueBlock.style.width = '220px';
                        dateValueBlock.style.height = '30px';
                        dateValueBlock.style.lineHeight = '30px';
                        dateValueBlock.style.padding = '0 10px';
                        dateValueBlock.style.marginRight = '10px';
                        dateValueBlock.style.backgroundColor = '#f0f0f0';
                        dateValueBlock.style.border = '1px solid #ddd';
                        dateValueBlock.style.borderRadius = '4px';
                        dateValueBlock.style.fontSize = '13px';
                        
                        // Insert value block
                        dateInputGroup.insertBefore(dateValueBlock, dateFontFamily);
                        console.log("Added date value block");
                    }
                }
                
                if (!document.getElementById('fixed-coords-value')) {
                    const coordsFontFamily = coordsInputGroup.querySelector('.font-family-select');
                    
                    if (coordsFontFamily) {
                        // Create coordinates value block with ID for easy updating
                        const coordsValueBlock = document.createElement('div');
                        coordsValueBlock.id = 'fixed-coords-value';
                        coordsValueBlock.style.width = '220px';
                        coordsValueBlock.style.height = '30px';
                        coordsValueBlock.style.lineHeight = '30px';
                        coordsValueBlock.style.padding = '0 10px';
                        coordsValueBlock.style.marginRight = '10px';
                        coordsValueBlock.style.backgroundColor = '#f0f0f0';
                        coordsValueBlock.style.border = '1px solid #ddd';
                        coordsValueBlock.style.borderRadius = '4px';
                        coordsValueBlock.style.fontSize = '13px';
                        
                        // Insert value block
                        coordsInputGroup.insertBefore(coordsValueBlock, coordsFontFamily);
                        console.log("Added coordinates value block");
                    }
                }
                
                // Update the date and coordinates values
                updateDateValue();
                updateCoordinatesValue();
            }
            
            // 4. Fix the font dropdowns and CREATE missing font-size dropdowns
            const fontFamilyDropdowns = document.querySelectorAll('.fixed-text-content .font-family-select');
            const boldCheckboxes = document.querySelectorAll('.fixed-text-content input[id^="fixed-text-bold"]');
            
            // Create font-size dropdowns since they're missing from the HTML
            fontFamilyDropdowns.forEach((fontFamilyDropdown, index) => {
                // Create font-size dropdown
                const fontSizeDropdown = document.createElement('select');
                fontSizeDropdown.className = 'font-size-select';
                fontSizeDropdown.id = index === 0 ? 'fixed-font-size-date' : 'fixed-font-size-coords';
                fontSizeDropdown.style.width = '70px';
                fontSizeDropdown.style.marginLeft = '10px';
                
                // Add font size options
                const fontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '48px', '56px', '64px', '72px', '80px', '96px', '112px', '128px'];
                fontSizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    fontSizeDropdown.appendChild(option);
                });
                
                // Set default to 72px
                fontSizeDropdown.value = '72px';
                
                // Insert after font-family dropdown
                fontFamilyDropdown.parentNode.insertBefore(fontSizeDropdown, fontFamilyDropdown.nextSibling);
            });
            
            // Set font family to Bebas Neue
            fontFamilyDropdowns.forEach(dropdown => {
                dropdown.style.width = '150px';
                for (let i = 0; i < dropdown.options.length; i++) {
                    if (dropdown.options[i].value === 'Bebas Neue') {
                        dropdown.selectedIndex = i;
                        break;
                    }
                }
            });
            
            // Check the bold checkboxes
            boldCheckboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
            
            console.log("Fixed font dropdowns");
            
            // 5. Fix the color pickers
            const colorSwatches = document.querySelectorAll('.fixed-text-content .color-swatch');
            colorSwatches.forEach(swatch => {
                swatch.style.backgroundColor = '#FFCC00';
                const targetId = swatch.getAttribute('data-target');
                if (targetId) {
                    const input = document.getElementById(targetId);
                    if (input) {
                        input.value = '#FFCC00';
                    }
                }
            });
            
            console.log("Fixed color pickers");
            
            // 6. DISABLED - Remove the duplicate Paper Auto-Size row - More aggressive approach
            // removeDuplicatePaperAutoSizeRows();
            
            // 7. Set up event listeners for date and coordinates updates
            setupEventListeners();
            
            // 8. Fix Star Map Style dropdown width
            fixStarMapStyleWidth();
            
            // 9. DISABLED - Set up MutationObserver for Paper Auto-Size rows
            // setupPaperAutoSizeMutationObserver();
            
            // 10. DISABLED - Run periodic checks for duplicate Paper Auto-Size rows
            // setInterval(removeDuplicatePaperAutoSizeRows, 500);
            
            // 11. Initial date update only
            updateDateValue();
            
            console.log("Fixed Layers Fix script completed successfully");
        } catch (error) {
            console.error("Error in Fixed Layers Fix script:", error);
        }
    }, 1000);
});

/**
 * Set up MutationObserver for Paper Auto-Size rows
 */
function setupPaperAutoSizeMutationObserver() {
    try {
        console.log("Setting up MutationObserver for Paper Auto-Size rows");
        
        // Find the canvas settings container
        const canvasSettings = document.getElementById('canvas-settings');
        if (!canvasSettings) {
            console.error("Canvas settings container not found");
            return;
        }
        
        // Set up a MutationObserver to watch for dynamically added duplicate rows
        const observer = new MutationObserver(function(mutations) {
            let needsCheck = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any of the added nodes contain "Paper Auto-Size:"
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        if (node.nodeType === 1 && node.textContent && node.textContent.includes('Paper Auto-Size:')) {
                            console.log("Detected dynamically added Paper Auto-Size row");
                            needsCheck = true;
                            break;
                        }
                    }
                }
            });
            
            if (needsCheck) {
                removeDuplicatePaperAutoSizeRows();
            }
        });
        
        // Start observing the canvas settings container
        observer.observe(canvasSettings, { childList: true, subtree: true });
        console.log("MutationObserver for Paper Auto-Size rows set up");
        
        // Also observe the entire document for changes
        const bodyObserver = new MutationObserver(function(mutations) {
            let needsCheck = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    needsCheck = true;
                }
            });
            
            if (needsCheck) {
                removeDuplicatePaperAutoSizeRows();
                fixStarMapStyleWidth();
            }
        });
        
        // Start observing the body
        bodyObserver.observe(document.body, { childList: true, subtree: true });
        console.log("MutationObserver for body set up");
    } catch (error) {
        console.error("Error setting up MutationObserver for Paper Auto-Size rows:", error);
    }
}

/**
 * Fix Star Map Style dropdown width
 */
function fixStarMapStyleWidth() {
    try {
        console.log("Fixing Star Map Style dropdown width");
        
        // Find the Star Map Style dropdown by ID
        const starMapStyle = document.getElementById('star-map-style');
        if (starMapStyle) {
            starMapStyle.style.width = '120px';
            starMapStyle.style.maxWidth = '120px';
            console.log("Fixed Star Map Style dropdown width by ID");
        }
        
        // Also try to find it by selector in case the ID is different
        const starMapStyleLabels = document.querySelectorAll('label');
        for (let i = 0; i < starMapStyleLabels.length; i++) {
            if (starMapStyleLabels[i].textContent.includes('Star Map Style')) {
                const nextElement = starMapStyleLabels[i].nextElementSibling;
                if (nextElement && nextElement.tagName === 'SELECT') {
                    nextElement.style.width = '120px';
                    nextElement.style.maxWidth = '120px';
                    console.log("Fixed Star Map Style dropdown width by label");
                }
            }
        }
        
        // Also try to find it by name attribute
        const starMapStyleByName = document.querySelector('select[name="star-map-style"]');
        if (starMapStyleByName) {
            starMapStyleByName.style.width = '120px';
            starMapStyleByName.style.maxWidth = '120px';
            console.log("Fixed Star Map Style dropdown width by name");
        }
        
        // Also add a style tag to ensure the width is applied
        if (!document.getElementById('star-map-style-fix-style')) {
            const styleTag = document.createElement('style');
            styleTag.id = 'star-map-style-fix-style';
            styleTag.textContent = `
                #star-map-style, 
                select[id*="star-map-style"],
                select[name*="star-map-style"],
                .settings-row select[id*="star-map-style"],
                .settings-row select[name*="star-map-style"],
                label[for*="star-map-style"] + select,
                label:contains("Star Map Style") + select {
                    width: 120px !important;
                    max-width: 120px !important;
                    min-width: 120px !important;
                }
            `;
            document.head.appendChild(styleTag);
            console.log("Added style tag for Star Map Style dropdown");
        }
        
        // Also try to find all selects and check their parent's text content
        const allSelects = document.querySelectorAll('select');
        allSelects.forEach(select => {
            const parent = select.parentElement;
            if (parent && parent.textContent && parent.textContent.includes('Star Map Style')) {
                select.style.width = '120px';
                select.style.maxWidth = '120px';
                select.style.minWidth = '120px';
                console.log("Fixed Star Map Style dropdown width by parent text content");
            }
        });
    } catch (error) {
        console.error("Error fixing Star Map Style dropdown width:", error);
    }
}

/**
 * Remove duplicate Paper Auto-Size rows
 */
function removeDuplicatePaperAutoSizeRows() {
    try {
        console.log("Removing duplicate Paper Auto-Size rows");
        
        // Find all settings rows
        const settingsRows = document.querySelectorAll('.settings-row');
        let paperAutoSizeRows = [];
        
        // Find all rows containing "Paper Auto-Size:"
        settingsRows.forEach(row => {
            if (row.textContent.includes('Paper Auto-Size:')) {
                paperAutoSizeRows.push(row);
            }
        });
        
        console.log("Found", paperAutoSizeRows.length, "Paper Auto-Size rows");
        
        // If there's more than one, remove all but the first one
        if (paperAutoSizeRows.length > 1) {
            for (let i = 1; i < paperAutoSizeRows.length; i++) {
                paperAutoSizeRows[i].remove();
                console.log("Removed duplicate Paper Auto-Size row", i);
            }
        }
        
        // Also check for any elements with id containing "paper-auto-size" that might be duplicates
        const allElements = document.querySelectorAll('*[id*="paper-auto-size"]');
        let paperAutoSizeElements = [];
        
        allElements.forEach(element => {
            paperAutoSizeElements.push(element);
        });
        
        console.log("Found", paperAutoSizeElements.length, "elements with ID containing 'paper-auto-size'");
        
        // If there's more than one with the same ID, keep only the first one
        const uniqueIds = {};
        paperAutoSizeElements.forEach(element => {
            if (uniqueIds[element.id]) {
                element.remove();
                console.log("Removed duplicate element with ID", element.id);
            } else {
                uniqueIds[element.id] = true;
            }
        });
        
        // Also check for any canvas settings containers that might have duplicate rows
        const canvasSettings = document.getElementById('canvas-settings');
        if (canvasSettings) {
            const rows = canvasSettings.querySelectorAll('.settings-row');
            let foundPaperAutoSize = false;
            
            rows.forEach(row => {
                if (row.textContent.includes('Paper Auto-Size:')) {
                    if (foundPaperAutoSize) {
                        row.remove();
                        console.log("Removed duplicate Paper Auto-Size row in canvas settings");
                    } else {
                        foundPaperAutoSize = true;
                    }
                }
            });
        }
        
        // Also check for any elements with name containing "paper-auto-size" that might be duplicates
        const paperAutoSizeByName = document.querySelectorAll('*[name*="paper-auto-size"]');
        let paperAutoSizeNameElements = [];
        
        paperAutoSizeByName.forEach(element => {
            paperAutoSizeNameElements.push(element);
        });
        
        console.log("Found", paperAutoSizeNameElements.length, "elements with name containing 'paper-auto-size'");
        
        // If there's more than one with the same name, keep only the first one
        const uniqueNames = {};
        paperAutoSizeNameElements.forEach(element => {
            if (uniqueNames[element.name]) {
                element.remove();
                console.log("Removed duplicate element with name", element.name);
            } else {
                uniqueNames[element.name] = true;
            }
        });
        
        // Also check for any labels with for attribute containing "paper-auto-size"
        const paperAutoSizeLabels = document.querySelectorAll('label[for*="paper-auto-size"]');
        let foundLabel = false;
        
        paperAutoSizeLabels.forEach(label => {
            if (foundLabel) {
                // Get the parent row
                const parentRow = label.closest('.settings-row');
                if (parentRow) {
                    parentRow.remove();
                    console.log("Removed duplicate Paper Auto-Size row by label");
                }
            } else {
                foundLabel = true;
            }
        });
    } catch (error) {
        console.error("Error removing duplicate Paper Auto-Size rows:", error);
    }
}

/**
 * Update the date value in the Fixed Layers section and Text Placements
 */
function updateDateValue() {
    try {
        console.log("=== UPDATING DATE VALUE ===");
        
        // Get the date from the Events Details container
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const showTimeToggle = document.getElementById('show-time-toggle');
        
        if (!dateInput) {
            console.error("Date input not found");
            return;
        }
        
        console.log("Raw date input value:", dateInput.value);
        console.log("Date input type:", dateInput.type);
        
        // IMPORTANT: Check if we need to handle the date differently based on input type
        let dateValue = dateInput.value;
        
        // If the input type is 'date', the value might be in YYYY-MM-DD format
        if (dateInput.type === 'date' && dateValue.includes('-')) {
            console.log("Date input is HTML5 date type with value:", dateValue);
            // Convert YYYY-MM-DD to MM/DD/YYYY
            const parts = dateValue.split('-');
            if (parts.length === 3) {
                dateValue = `${parts[1]}/${parts[2]}/${parts[0]}`;
                console.log("Converted date to MM/DD/YYYY format:", dateValue);
            }
        }
        
        // Format the date
        let formattedDate = formatDate(dateValue, timeInput ? timeInput.value : null, showTimeToggle ? showTimeToggle.checked : false);
        
        console.log("Final formatted date:", formattedDate);
        
        // Update the Fixed Layers date value
        const fixedDateValue = document.getElementById('fixed-date-value');
        if (fixedDateValue) {
            fixedDateValue.textContent = formattedDate;
            console.log("Updated Fixed Layers date value to:", formattedDate);
        }
        
        // Update the Text Placements date
        const textPlacementsDate = document.getElementById('text-placement-content-date');
        if (textPlacementsDate) {
            textPlacementsDate.textContent = formattedDate;
            console.log("Updated Text Placements date to:", formattedDate);
        }
        
        console.log("=== DATE UPDATE COMPLETE ===");
    } catch (error) {
        console.error("Error updating date value:", error);
    }
}

/**
 * Format a date string
 * Fixed to handle date correctly without timezone issues
 */
function formatDate(dateStr, timeStr, showTime) {
    try {
        if (!dateStr) return "";
        
        console.log("Input date string:", dateStr);
        
        // Parse the date (format: MM/DD/YYYY)
        const dateParts = dateStr.split('/');
        if (dateParts.length !== 3) return dateStr;
        
        // Get the month, day, and year as integers
        const monthNum = parseInt(dateParts[0], 10); // Keep as 1-based
        const day = parseInt(dateParts[1], 10);
        const year = parseInt(dateParts[2], 10);
        
        // Validate the date parts
        if (isNaN(monthNum) || isNaN(day) || isNaN(year)) {
            console.error("Invalid date parts:", monthNum, day, year);
            return dateStr;
        }
        
        // Format the date manually without using Date object to avoid timezone issues
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        // Use monthNum - 1 for array index (since monthNum is 1-based and array is 0-based)
        const monthIndex = monthNum - 1;
        
        // Ensure the month index is valid
        if (monthIndex < 0 || monthIndex >= months.length) {
            console.error("Invalid month index:", monthIndex);
            return dateStr;
        }
        
        // Format the date string - use the exact day from input
        let formattedDate = `${months[monthIndex]} ${day}, ${year}`;
        
        // Add time if available and toggle is checked
        if (timeStr && showTime) {
            const timeParts = timeStr.split(':');
            if (timeParts.length === 2) {
                const hour = parseInt(timeParts[0], 10);
                const minute = timeParts[1];
                const isPM = hour >= 12;
                const hour12 = hour % 12 || 12;
                formattedDate += `, ${hour12}:${minute} ${isPM ? 'PM' : 'AM'}`;
            }
        }
        
        console.log("Formatted date:", formattedDate);
        console.log("Month:", monthNum, "->", months[monthIndex], "Day:", day, "Year:", year);
        return formattedDate;
    } catch (error) {
        console.error("Error formatting date:", error);
        return dateStr;
    }
}

/**
 * Update the coordinates value in the Fixed Layers section and Text Placements
 */
function updateCoordinatesValue() {
    try {
        console.log("Updating coordinates value");
        
        // Get the coordinates from the latLongDisplay element
        const latLongDisplay = document.getElementById('latLongDisplay');
        
        if (!latLongDisplay) {
            console.error("latLongDisplay not found");
            return;
        }
        
        const coordsText = latLongDisplay.textContent.trim();
        
        // Update the Fixed Layers coordinates value
        const fixedCoordsValue = document.getElementById('fixed-coords-value');
        if (fixedCoordsValue) {
            fixedCoordsValue.textContent = coordsText;
            console.log("Updated Fixed Layers coordinates value to:", coordsText);
        }
        
        // Update the Text Placements coordinates
        const textPlacementsCoords = document.getElementById('text-placement-content-coords');
        if (textPlacementsCoords) {
            textPlacementsCoords.textContent = coordsText;
            console.log("Updated Text Placements coordinates to:", coordsText);
        }
    } catch (error) {
        console.error("Error updating coordinates value:", error);
    }
}

/**
 * Set up event listeners for date and coordinates updates
 */
function setupEventListeners() {
    try {
        console.log("Setting up event listeners");
        
        // Add event listeners to the date and time inputs
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const showTimeToggle = document.getElementById('show-time-toggle');
        
        if (dateInput) {
            dateInput.addEventListener('change', updateDateValue);
            console.log("Added event listener to date input");
        }
        
        if (timeInput) {
            timeInput.addEventListener('change', updateDateValue);
            console.log("Added event listener to time input");
        }
        
        if (showTimeToggle) {
            showTimeToggle.addEventListener('change', updateDateValue);
            console.log("Added event listener to show time toggle");
        }
        
        // Add event listener to the map for coordinates updates
        if (typeof google !== 'undefined' && google.maps) {
            // Wait for map to be initialized
            const checkMapInterval = setInterval(function() {
                if (window.map) {
                    console.log("Map object found, adding event listeners");
                    
                    google.maps.event.addListener(window.map, 'center_changed', function() {
                        setTimeout(updateCoordinatesValue, 500);
                    });
                    
                    google.maps.event.addListener(window.map, 'idle', function() {
                        setTimeout(updateCoordinatesValue, 500);
                    });
                    
                    clearInterval(checkMapInterval);
                }
            }, 500);
        }
        
        // Also set up a MutationObserver to watch for changes to the latLongDisplay element
        const latLongDisplay = document.getElementById('latLongDisplay');
        if (latLongDisplay) {
            const observer = new MutationObserver(function() {
                updateCoordinatesValue();
            });
            
            observer.observe(latLongDisplay, {
                characterData: true,
                childList: true,
                subtree: true
            });
            
            console.log("Added MutationObserver to latLongDisplay");
        }
    } catch (error) {
        console.error("Error setting up event listeners:", error);
    }
}

/* END OF CODE - Cline - 2025-05-23 15:34:50 File: js/fixed-layers-fix-exact.js */
