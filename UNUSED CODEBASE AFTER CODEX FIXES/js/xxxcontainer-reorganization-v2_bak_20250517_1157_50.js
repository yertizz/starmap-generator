/* START OF CODE - Cline - 2025-05-16 00:57:00 File: js/container-reorganization-v2.js */

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
    
    // Update fixed layers display boxes
    updateFixedLayersDisplayBoxes();
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
            field.style.width = 'calc(100% - 5px)';
            field.style.minWidth = '320px';
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
        
        // Standardize dropdown selects
        const dropdowns = document.querySelectorAll('select:not(#paper-auto-size):not([name="paper-auto-size"])');
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
        const dateInputGroup = fixedTextContent.querySelector('.input-group:first-child');
        const coordsInputGroup = fixedTextContent.querySelector('.input-group:nth-child(2)');
        
        if (!dateInputGroup || !coordsInputGroup) {
            console.error("Date or coordinates input group not found");
            return;
        }
        
        // Find the date, time, latitude, and longitude inputs
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const latitudeInput = document.getElementById('latitude');
        const longitudeInput = document.getElementById('longitude');
        const showTimeToggle = document.getElementById('show-time-toggle');
        
        if (!dateInput || !timeInput || !latitudeInput || !longitudeInput) {
            console.error("Date, time, latitude, or longitude input not found");
            return;
        }
        
        // Function to update the date display box
        function updateDateDisplay() {
            try {
                const dateValue = dateInput.value;
                const timeValue = timeInput.value;
                const showTime = showTimeToggle ? showTimeToggle.checked : true;
                
                if (dateValue) {
                    const formattedDate = new Date(dateValue).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    let displayValue = formattedDate;
                    
                    if (showTime && timeValue) {
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
                    
                    // Set the data-date-value attribute
                    dateInputGroup.setAttribute('data-date-value', displayValue);
                } else {
                    dateInputGroup.setAttribute('data-date-value', 'No date selected');
                }
            } catch (error) {
                console.error("Error updating date display:", error);
            }
        }
        
        // Function to update the coordinates display box
        function updateCoordsDisplay() {
            try {
                const latValue = latitudeInput.value;
                const longValue = longitudeInput.value;
                
                if (latValue && longValue) {
                    const displayValue = `${latValue} | ${longValue}`;
                    coordsInputGroup.setAttribute('data-coords-value', displayValue);
                } else {
                    coordsInputGroup.setAttribute('data-coords-value', 'No coordinates selected');
                }
            } catch (error) {
                console.error("Error updating coordinates display:", error);
            }
        }
        
        // Add event listeners to update the display boxes when values change
        dateInput.addEventListener('change', updateDateDisplay);
        timeInput.addEventListener('change', updateDateDisplay);
        if (showTimeToggle) {
            showTimeToggle.addEventListener('change', updateDateDisplay);
        }
        
        latitudeInput.addEventListener('change', updateCoordsDisplay);
        longitudeInput.addEventListener('change', updateCoordsDisplay);
        
        // Initial update
        updateDateDisplay();
        updateCoordsDisplay();
        
        console.log("Successfully updated fixed layers display boxes");
    } catch (error) {
        console.error("Error in updateFixedLayersDisplayBoxes:", error);
    }
}

/* END OF CODE - Cline - 2025-05-16 00:57:00 File: js/container-reorganization-v2.js */
