/* START OF CODE - Cline - 2025-05-23 15:19:35 File: js/fixed-layers-fix-exact.js */

// Script to fix the Fixed Layers section
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fixed Layers Fix script loaded");
    
    // Wait a moment for everything to be ready
    setTimeout(function() {
        try {
            // 1. Fix the "Fixed Layers" title styling
            const fixedTextContent = document.querySelector('.fixed-text-content');
            if (fixedTextContent) {
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
            
            // 3. Add date and coordinates value blocks
            const dateInputGroup = document.querySelector('.fixed-text-content .input-group:first-child');
            const coordsInputGroup = document.querySelector('.fixed-text-content .input-group:nth-child(2)');
            
            if (dateInputGroup && coordsInputGroup) {
                const dateFontFamily = dateInputGroup.querySelector('.font-family-select');
                const coordsFontFamily = coordsInputGroup.querySelector('.font-family-select');
                
                if (dateFontFamily && coordsFontFamily) {
                    // Create date value block with ID for easy updating
                    const dateValueBlock = document.createElement('div');
                    dateValueBlock.id = 'fixed-date-value';
                    dateValueBlock.style.width = '320px';
                    dateValueBlock.style.height = '30px';
                    dateValueBlock.style.lineHeight = '30px';
                    dateValueBlock.style.padding = '0 10px';
                    dateValueBlock.style.marginRight = '10px';
                    dateValueBlock.style.backgroundColor = '#f0f0f0';
                    dateValueBlock.style.border = '1px solid #ddd';
                    dateValueBlock.style.borderRadius = '4px';
                    
                    // Create coordinates value block with ID for easy updating
                    const coordsValueBlock = document.createElement('div');
                    coordsValueBlock.id = 'fixed-coords-value';
                    coordsValueBlock.style.width = '320px';
                    coordsValueBlock.style.height = '30px';
                    coordsValueBlock.style.lineHeight = '30px';
                    coordsValueBlock.style.padding = '0 10px';
                    coordsValueBlock.style.marginRight = '10px';
                    coordsValueBlock.style.backgroundColor = '#f0f0f0';
                    coordsValueBlock.style.border = '1px solid #ddd';
                    coordsValueBlock.style.borderRadius = '4px';
                    
                    // Insert value blocks
                    dateInputGroup.insertBefore(dateValueBlock, dateFontFamily);
                    coordsInputGroup.insertBefore(coordsValueBlock, coordsFontFamily);
                    console.log("Added date and coordinates value blocks");
                    
                    // Update the date and coordinates values
                    updateDateValue();
                    updateCoordinatesValue();
                }
            }
            
            // 4. Fix the font dropdowns
            const fontFamilyDropdowns = document.querySelectorAll('.fixed-text-content .font-family-select');
            const fontSizeDropdowns = document.querySelectorAll('.fixed-text-content .font-size-select');
            const boldCheckboxes = document.querySelectorAll('.fixed-text-content input[id^="fixed-text-bold"]');
            
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
            
            // Set font size to 72px
            fontSizeDropdowns.forEach(dropdown => {
                dropdown.style.width = '70px';
                for (let i = 0; i < dropdown.options.length; i++) {
                    if (dropdown.options[i].value === '72px' || dropdown.options[i].value === '72') {
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
            
            // 6. Remove the duplicate Paper Auto-Size row - More aggressive approach
            removeDuplicatePaperAutoSizeRows();
            
            // 7. Set up event listeners for date and coordinates updates
            setupEventListeners();
            
            // 8. Fix Star Map Style dropdown width
            fixStarMapStyleWidth();
            
            console.log("Fixed Layers Fix script completed successfully");
        } catch (error) {
            console.error("Error in Fixed Layers Fix script:", error);
        }
    }, 1000);
});

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
        
        // Also add a style tag to ensure the width is applied
        const styleTag = document.createElement('style');
        styleTag.textContent = `
            #star-map-style, 
            select[id*="star-map-style"],
            .settings-row select[id*="star-map-style"],
            label[for*="star-map-style"] + select,
            label:contains("Star Map Style") + select {
                width: 120px !important;
                max-width: 120px !important;
            }
        `;
        document.head.appendChild(styleTag);
        console.log("Added style tag for Star Map Style dropdown");
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
    } catch (error) {
        console.error("Error removing duplicate Paper Auto-Size rows:", error);
    }
}

/**
 * Update the date value in the Fixed Layers section and Text Placements
 */
function updateDateValue() {
    try {
        console.log("Updating date value");
        
        // Get the date from the Events Details container
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const showTimeToggle = document.getElementById('show-time-toggle');
        
        if (!dateInput) {
            console.error("Date input not found");
            return;
        }
        
        // Format the date
        let formattedDate = formatDate(dateInput.value, timeInput ? timeInput.value : null, showTimeToggle ? showTimeToggle.checked : false);
        
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
        
        // Parse the date (format: MM/DD/YYYY)
        const dateParts = dateStr.split('/');
        if (dateParts.length !== 3) return dateStr;
        
        // Get the month, day, and year as integers
        const month = parseInt(dateParts[0], 10) - 1; // 0-based month
        const day = parseInt(dateParts[1], 10);
        const year = parseInt(dateParts[2], 10);
        
        // Validate the date parts
        if (isNaN(month) || isNaN(day) || isNaN(year)) {
            console.error("Invalid date parts:", month + 1, day, year);
            return dateStr;
        }
        
        // Format the date manually without using Date object to avoid timezone issues
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let formattedDate = `${months[month]} ${day}, ${year}`;
        
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

/* END OF CODE - Cline - 2025-05-23 15:19:35 File: js/fixed-layers-fix-exact.js */
