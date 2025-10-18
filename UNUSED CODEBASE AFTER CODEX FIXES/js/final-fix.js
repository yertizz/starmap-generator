/* START OF CODE - Cline - 2025-05-13 23:32 File: js/final-fix.js */

/**
 * Final Fixes for Star Map Generator
 * 
 * This script fixes the remaining issues:
 * 1. Fixes the PNG transparency checkbox logic
 * 2. Ensures the time appears in the star map canvas
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Final Fixes");
    
    // Fix the image format selection logic
    fixImageFormatLogic();
    
    // Fix the time display in the star map canvas
    fixTimeDisplay();
});

/**
 * Fix the image format selection logic
 */
function fixImageFormatLogic() {
    console.log("Fixing image format logic");
    
    // Get all image format radio buttons
    const imageFormatRadios = document.querySelectorAll('input[name="image-format"]');
    const pngRadio = document.querySelector('input[name="image-format"][value="png"]');
    const pngTransparencyCheckbox = document.getElementById('png-transparency');
    const pngTransparencyLabel = document.querySelector('label[for="png-transparency"]');
    
    if (!imageFormatRadios.length || !pngTransparencyCheckbox || !pngTransparencyLabel) {
        console.error("Required elements not found for fixing image format logic");
        return;
    }
    
    // Add ID to the PNG transparency label for CSS targeting
    pngTransparencyLabel.id = 'png-transparency-label';
    
    // Function to update the PNG transparency checkbox state
    function updatePngTransparencyState() {
        const selectedFormat = document.querySelector('input[name="image-format"]:checked').value;
        console.log("Selected image format:", selectedFormat);
        
        if (selectedFormat === 'png') {
            // Enable PNG transparency checkbox
            pngTransparencyCheckbox.disabled = false;
            pngTransparencyLabel.classList.remove('disabled-option');
            console.log("PNG transparency enabled");
        } else {
            // Disable PNG transparency checkbox
            pngTransparencyCheckbox.disabled = true;
            pngTransparencyCheckbox.checked = false;
            pngTransparencyLabel.classList.add('disabled-option');
            console.log("PNG transparency disabled");
        }
    }
    
    // Add event listeners to all image format radio buttons
    imageFormatRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            console.log("Image format changed to:", this.value);
            updatePngTransparencyState();
        });
    });
    
    // Ensure PNG is selected by default if no format is selected
    if (!document.querySelector('input[name="image-format"]:checked')) {
        if (pngRadio) {
            pngRadio.checked = true;
            console.log("Set PNG as default format");
        }
    }
    
    // Initialize the PNG transparency checkbox state
    updatePngTransparencyState();
    
    // Move the PNG transparency checkbox right after the PNG radio button
    try {
        const radioGroup = document.querySelector('.radio-group');
        if (radioGroup && pngTransparencyLabel) {
            const pngLabel = pngRadio ? pngRadio.closest('label') : null;
            if (pngLabel) {
                // Remove the PNG transparency label from its current position
                if (pngTransparencyLabel.parentNode) {
                    pngTransparencyLabel.parentNode.removeChild(pngTransparencyLabel);
                }
                
                // Insert it right after the PNG radio label
                pngLabel.insertAdjacentElement('afterend', pngTransparencyLabel);
                console.log("PNG transparency label repositioned");
            }
        }
    } catch (error) {
        console.error("Error repositioning PNG transparency label:", error);
    }
}

/**
 * Fix the time display in the star map canvas
 */
function fixTimeDisplay() {
    console.log("Fixing time display in star map canvas");
    
    // Override the formatDate function if it exists
    if (typeof window.formatDate === 'function') {
        const originalFormatDate = window.formatDate;
        
        window.formatDate = function(dateString) {
            console.log("Formatting date:", dateString);
            
            // Call the original function to get its result
            const originalResult = originalFormatDate(dateString);
            
            // Check if time should be included
            const showTimeToggle = document.getElementById('show-time-toggle');
            const showTime = showTimeToggle ? showTimeToggle.checked : false;
            
            if (showTime) {
                const timeInput = document.getElementById('time');
                if (timeInput && timeInput.value) {
                    // Format time in 12-hour format
                    const timeParts = timeInput.value.split(':');
                    let hours = parseInt(timeParts[0]);
                    const minutes = timeParts[1];
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // Convert 0 to 12
                    const formattedTime = `${hours}:${minutes} ${ampm}`;
                    
                    // Add time to the formatted date
                    const result = `${originalResult}, ${formattedTime}`;
                    console.log("Formatted date with time:", result);
                    return result;
                }
            }
            
            console.log("Formatted date without time:", originalResult);
            return originalResult;
        };
        
        console.log("Date formatting function overridden");
    } else {
        console.warn("formatDate function not found, cannot override");
    }
    
    // Also override the updateDateTimeDisplay function
    if (typeof window.updateDateTimeDisplay === 'function') {
        const originalUpdateDateTimeDisplay = window.updateDateTimeDisplay;
        
        window.updateDateTimeDisplay = function() {
            console.log("Updating date/time display");
            
            // Call the original function
            originalUpdateDateTimeDisplay();
            
            // Additional fix to ensure time appears in the star map
            const dateInput = document.getElementById('date');
            const timeInput = document.getElementById('time');
            const showTimeToggle = document.getElementById('show-time-toggle');
            
            if (!dateInput || !timeInput || !showTimeToggle) {
                console.error("Required elements not found for updating date/time display");
                return;
            }
            
            const showTime = showTimeToggle.checked;
            
            // Update the date display in the text placement section
            const dateDisplaySpan = document.getElementById('text-placement-content-date');
            if (dateDisplaySpan) {
                const dateValue = dateInput.value;
                const timeValue = timeInput.value;
                
                if (dateValue) {
                    const formattedDate = new Date(dateValue).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    if (showTime && timeValue) {
                        // Format time in 12-hour format
                        const timeParts = timeValue.split(':');
                        let hours = parseInt(timeParts[0]);
                        const minutes = timeParts[1];
                        const ampm = hours >= 12 ? 'PM' : 'AM';
                        hours = hours % 12;
                        hours = hours ? hours : 12; // Convert 0 to 12
                        const formattedTime = `${hours}:${minutes} ${ampm}`;
                        
                        dateDisplaySpan.textContent = `${formattedDate}, ${formattedTime}`;
                        console.log("Updated date display with time:", dateDisplaySpan.textContent);
                    } else {
                        dateDisplaySpan.textContent = formattedDate;
                        console.log("Updated date display without time:", dateDisplaySpan.textContent);
                    }
                } else {
                    dateDisplaySpan.textContent = '';
                }
            }
        };
        
        console.log("Date/time display update function overridden");
    }
    
    // Add event listeners to update the display when relevant inputs change
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const showTimeToggle = document.getElementById('show-time-toggle');
    
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            console.log("Date changed:", this.value);
            if (typeof window.updateDateTimeDisplay === 'function') {
                window.updateDateTimeDisplay();
            }
        });
    }
    
    if (timeInput) {
        timeInput.addEventListener('change', function() {
            console.log("Time changed:", this.value);
            if (typeof window.updateDateTimeDisplay === 'function') {
                window.updateDateTimeDisplay();
            }
        });
    }
    
    if (showTimeToggle) {
        showTimeToggle.addEventListener('change', function() {
            console.log("Time toggle changed:", this.checked);
            if (typeof window.updateDateTimeDisplay === 'function') {
                window.updateDateTimeDisplay();
            }
        });
    }
    
    // Add event listeners to the view buttons to ensure the time is displayed
    const viewButtons = [
        'view-star-map-btn',
        'view-street-map-btn',
        'view-star-map-canvas-btn',
        'view-star-street-landscape-btn',
        'view-star-street-portrait-btn'
    ];
    
    viewButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function() {
                console.log("View button clicked:", buttonId);
                // Wait a bit for the map to render, then update the date display
                setTimeout(function() {
                    if (typeof window.updateDateTimeDisplay === 'function') {
                        window.updateDateTimeDisplay();
                    }
                }, 500);
            });
        }
    });
    
    // Initial update
    if (typeof window.updateDateTimeDisplay === 'function') {
        window.updateDateTimeDisplay();
    }
}

/* END OF CODE - Cline - 2025-05-13 23:32 File: js/final-fix.js */
