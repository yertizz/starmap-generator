/* START OF CODE - Emergent - 2025-10-24 [11:28:21-EST] File: js/master-override.js */

/**
 * Master Override JavaScript for Star Map Generator
 * 
 * This script fixes critical issues:
 * 1. Ensures time is recovered on page reload and saved with settings
 * 2. Fixes PNG transparency checkbox logic
 * 3. Prevents duplicate times in the star map canvas
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Master Override JS");
    
    // DISABLED - Conflicts with new JPG quality selector implementation
    // fixPNGTransparencyLogic();
    
    // Fix the time display in the star map canvas
    fixTimeDisplay();
    
    // Fix the settings save/load to include time toggle state
    fixSettingsSaveLoad();
    
    // Set default time and handle time toggle
    setDefaultTimeAndHandleToggle();
    
    // Rename Event/Occasion label to save space
    renameEventOccasionLabel();
});

/**
 * Rename Event/Occasion label to save space
 */
function renameEventOccasionLabel() {
    const occasionLabel = document.querySelector('label[for="occasion"]');
    if (occasionLabel && occasionLabel.textContent === "Event/Occasion:") {
        occasionLabel.textContent = "Event:";
        console.log("Renamed Event/Occasion label to Event");
    }
}

/**
 * Set default time and handle time toggle
 */
function setDefaultTimeAndHandleToggle() {
    console.log("Setting default time and handling time toggle");
    
    const timeInput = document.getElementById('time');
    const showTimeToggle = document.getElementById('show-time-toggle');
    
    if (!timeInput || !showTimeToggle) {
        console.error("Required elements not found for setting default time");
        return;
    }
    
    // Set default time to 12:01 PM if not set
    if (!timeInput.value) {
        timeInput.value = "12:01";
        console.log("Set default time to 12:01 PM");
    }
    
    // Function to update time input required attribute based on toggle state
    function updateTimeRequired() {
        if (showTimeToggle.checked) {
            timeInput.setAttribute('required', 'required');
            console.log("Time input set to required");
        } else {
            timeInput.removeAttribute('required');
            console.log("Time input set to not required");
        }
    }
    
    // Add event listener to toggle
    showTimeToggle.addEventListener('change', function() {
        updateTimeRequired();
        
        // Update the date/time display
        if (typeof window.updateDateTimeDisplay === 'function') {
            window.updateDateTimeDisplay();
        }
    });
    
    // Initialize time input required attribute
    updateTimeRequired();
}

/**
 * Fix the PNG transparency checkbox logic - ULTRA AGGRESSIVE FIX
 */
function fixPNGTransparencyLogic() {
    console.log("ULTRA AGGRESSIVE FIX for PNG transparency logic");
    
    // Get all image format radio buttons and the transparency checkbox
    const pngRadio = document.querySelector('input[name="image-format"][value="png"]');
    const jpgRadio = document.querySelector('input[name="image-format"][value="jpg"]');
    const svgRadio = document.querySelector('input[name="image-format"][value="svg"]');
    const pngTransparencyCheckbox = document.getElementById('png-transparency');
    const pngTransparencyLabel = document.querySelector('label[for="png-transparency"]');
    
    if (!pngTransparencyCheckbox) {
        console.error("PNG transparency checkbox not found");
        return;
    }
    
    // APPROACH 1: Create a completely new checkbox element
    const newCheckbox = document.createElement('input');
    newCheckbox.type = 'checkbox';
    newCheckbox.id = 'png-transparency-fixed';
    newCheckbox.className = pngTransparencyCheckbox.className || '';
    
    // Set initial state
    const selectedFormat = document.querySelector('input[name="image-format"]:checked')?.value;
    newCheckbox.disabled = selectedFormat !== 'png';
    newCheckbox.checked = selectedFormat === 'png' && pngTransparencyCheckbox.checked;
    
    // Add event listeners to the new checkbox
    newCheckbox.addEventListener('click', function(event) {
        const currentFormat = document.querySelector('input[name="image-format"]:checked')?.value;
        if (currentFormat !== 'png') {
            event.preventDefault();
            event.stopPropagation();
            this.checked = false;
            return false;
        }
    });
    
    // Replace the old checkbox with the new one
    if (pngTransparencyCheckbox.parentNode) {
        try {
            pngTransparencyCheckbox.parentNode.replaceChild(newCheckbox, pngTransparencyCheckbox);
            console.log("Successfully replaced PNG transparency checkbox");
        } catch (e) {
            console.error("Failed to replace checkbox:", e);
        }
    }
    
    // APPROACH 2: Hide the original checkbox and create a completely new one next to it
    try {
        if (pngTransparencyCheckbox && pngTransparencyCheckbox.parentNode) {
            // Hide the original checkbox
            pngTransparencyCheckbox.style.display = 'none';
            pngTransparencyCheckbox.style.visibility = 'hidden';
            pngTransparencyCheckbox.style.position = 'absolute';
            pngTransparencyCheckbox.style.pointerEvents = 'none';
            
            // Create a new checkbox
            const shadowCheckbox = document.createElement('input');
            shadowCheckbox.type = 'checkbox';
            shadowCheckbox.id = 'png-transparency-shadow';
            shadowCheckbox.className = pngTransparencyCheckbox.className || '';
            shadowCheckbox.style.marginRight = '5px';
            
            // Set initial state
            shadowCheckbox.disabled = selectedFormat !== 'png';
            shadowCheckbox.checked = selectedFormat === 'png' && pngTransparencyCheckbox.checked;
            
            // Add event listeners
            shadowCheckbox.addEventListener('change', function() {
                const currentFormat = document.querySelector('input[name="image-format"]:checked')?.value;
                if (currentFormat === 'png') {
                    pngTransparencyCheckbox.checked = this.checked;
                } else {
                    this.checked = false;
                    pngTransparencyCheckbox.checked = false;
                }
            });
            
            // Insert the new checkbox before the label
            if (pngTransparencyLabel) {
                pngTransparencyLabel.parentNode.insertBefore(shadowCheckbox, pngTransparencyLabel);
                console.log("Successfully added shadow checkbox");
            }
        }
    } catch (e) {
        console.error("Failed to create shadow checkbox:", e);
    }
    
    // APPROACH 3: ULTRA AGGRESSIVE - Completely replace the entire radio group
    try {
        const radioGroup = document.querySelector('.radio-group');
        if (radioGroup) {
            // Save the current state
            const currentFormat = document.querySelector('input[name="image-format"]:checked')?.value || 'png';
            const isTransparent = pngTransparencyCheckbox.checked;
            
            // Create a new radio group
            const newRadioGroup = document.createElement('div');
            newRadioGroup.className = 'radio-group';
            newRadioGroup.innerHTML = `
                <label>
                    <input type="radio" name="image-format-new" value="png" ${currentFormat === 'png' ? 'checked' : ''}>
                    PNG
                </label>
                <label>
                    <input type="radio" name="image-format-new" value="jpg" ${currentFormat === 'jpg' ? 'checked' : ''}>
                    JPG
                </label>
                <label>
                    <input type="radio" name="image-format-new" value="svg" ${currentFormat === 'svg' ? 'checked' : ''}>
                    SVG
                </label>
                <label class="${currentFormat !== 'png' ? 'disabled-option' : ''}">
                    <input type="checkbox" id="png-transparency-new" ${isTransparent && currentFormat === 'png' ? 'checked' : ''} ${currentFormat !== 'png' ? 'disabled' : ''}>
                    Transparent Background (PNG only)
                </label>
            `;
            
            // Add event listeners to the new radio buttons
            const newRadios = newRadioGroup.querySelectorAll('input[name="image-format-new"]');
            const newTransparencyCheckbox = newRadioGroup.querySelector('#png-transparency-new');
            
            newRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    // Update the original radio buttons
                    const originalRadio = document.querySelector(`input[name="image-format"][value="${this.value}"]`);
                    if (originalRadio) {
                        originalRadio.checked = true;
                        
                        // Trigger a change event on the original radio
                        const event = new Event('change', { bubbles: true });
                        originalRadio.dispatchEvent(event);
                    }
                    
                    // Update the transparency checkbox
                    if (this.value !== 'png') {
                        newTransparencyCheckbox.disabled = true;
                        newTransparencyCheckbox.checked = false;
                        newTransparencyCheckbox.parentNode.classList.add('disabled-option');
                    } else {
                        newTransparencyCheckbox.disabled = false;
                        newTransparencyCheckbox.parentNode.classList.remove('disabled-option');
                    }
                });
            });
            
            // Add event listener to the new transparency checkbox
            if (newTransparencyCheckbox) {
                newTransparencyCheckbox.addEventListener('change', function() {
                    // Update the original transparency checkbox
                    pngTransparencyCheckbox.checked = this.checked;
                    
                    // Trigger a change event on the original checkbox
                    const event = new Event('change', { bubbles: true });
                    pngTransparencyCheckbox.dispatchEvent(event);
                });
            }
            
            // Try to replace the original radio group
            const imageFormatRow = radioGroup.closest('.settings-row');
            if (imageFormatRow) {
                // Hide the original radio group
                radioGroup.style.display = 'none';
                
                // Insert the new radio group after the "Image Format:" label
                const formatLabel = imageFormatRow.querySelector('label');
                if (formatLabel) {
                    formatLabel.insertAdjacentElement('afterend', newRadioGroup);
                    console.log("Successfully added new radio group");
                }
            }
        }
    } catch (e) {
        console.error("Failed to replace radio group:", e);
    }
    
    // APPROACH 4: BRUTE FORCE - Check every 50ms and force the correct state
    function enforceCorrectState() {
        const selectedFormat = document.querySelector('input[name="image-format"]:checked')?.value;
        const allTransparencyCheckboxes = document.querySelectorAll('[id^="png-transparency"]');
        
        allTransparencyCheckboxes.forEach(checkbox => {
            if (selectedFormat !== 'png') {
                checkbox.disabled = true;
                checkbox.checked = false;
                if (checkbox.parentNode && checkbox.parentNode.tagName === 'LABEL') {
                    checkbox.parentNode.classList.add('disabled-option');
                }
            } else {
                checkbox.disabled = false;
                if (checkbox.parentNode && checkbox.parentNode.tagName === 'LABEL') {
                    checkbox.parentNode.classList.remove('disabled-option');
                }
            }
        });
    }
    
    // Run the enforce function immediately and set up an interval
    enforceCorrectState();
    const intervalId = setInterval(enforceCorrectState, 50);
    
    // APPROACH 5: Add event listeners to all radio buttons and the document
    [pngRadio, jpgRadio, svgRadio].forEach(radio => {
        if (!radio) return;
        
        radio.addEventListener('change', enforceCorrectState);
        radio.addEventListener('click', function() {
            setTimeout(enforceCorrectState, 10);
        });
    });
    
    document.addEventListener('click', function() {
        setTimeout(enforceCorrectState, 10);
    });
    
    // APPROACH 6: Add CSS to reinforce the disabled state
    const style = document.createElement('style');
    style.textContent = `
        input[name="image-format"]:not([value="png"]):checked ~ #png-transparency,
        input[name="image-format"]:not([value="png"]):checked ~ label[for="png-transparency"],
        input[name="image-format"]:not([value="png"]):checked ~ label[for="png-transparency"] input,
        input[name="image-format-new"]:not([value="png"]):checked ~ #png-transparency-new,
        input[name="image-format-new"]:not([value="png"]):checked ~ label[for="png-transparency-new"],
        input[name="image-format-new"]:not([value="png"]):checked ~ label[for="png-transparency-new"] input {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
            pointer-events: none !important;
        }
        
        /* Force disable all PNG transparency checkboxes when JPG or SVG is selected */
        body:has(input[name="image-format"][value="jpg"]:checked) #png-transparency,
        body:has(input[name="image-format"][value="svg"]:checked) #png-transparency,
        body:has(input[name="image-format-new"][value="jpg"]:checked) #png-transparency-new,
        body:has(input[name="image-format-new"][value="svg"]:checked) #png-transparency-new {
            pointer-events: none !important;
            opacity: 0.5 !important;
            cursor: not-allowed !important;
        }
    `;
    document.head.appendChild(style);
    
    // Return a cleanup function to stop the interval if needed
    return function cleanup() {
        clearInterval(intervalId);
    };
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
            
            // Get the original date without time
            const formattedDate = new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
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
                    
                    // Return date with time
                    return `${formattedDate}, ${formattedTime}`;
                }
            }
            
            // Return date without time
            return formattedDate;
        };
        
        console.log("Date formatting function overridden");
    }
    
    // Fix the updateDateTimeDisplay function to prevent duplicate times
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
                        
                        // Check if the date already contains the time to prevent duplication
                        if (!dateDisplaySpan.textContent.includes(formattedTime)) {
                            dateDisplaySpan.textContent = `${formattedDate}, ${formattedTime}`;
                        }
                    } else {
                        dateDisplaySpan.textContent = formattedDate;
                    }
                } else {
                    dateDisplaySpan.textContent = '';
                }
            }
        };
    }
}

/**
 * Fix the settings save/load to include time toggle state
 */
function fixSettingsSaveLoad() {
    console.log("Fixing settings save/load for time toggle");
    
    // Override the saveSettings function if it exists
    if (typeof window.saveSettings === 'function') {
        const originalSaveSettings = window.saveSettings;
        
        window.saveSettings = function() {
            console.log("Saving settings with time toggle state");
            
            // Get the current settings object
            const settings = {};
            
            // Add all form fields to the settings object
            const formElements = document.getElementById('customizationForm').elements;
            for (let i = 0; i < formElements.length; i++) {
                const element = formElements[i];
                if (element.id) {
                    if (element.type === 'checkbox') {
                        settings[element.id] = element.checked;
                    } else if (element.type === 'radio') {
                        if (element.checked) {
                            settings[element.name] = element.value;
                        }
                    } else if (element.tagName === 'SELECT') {
                        settings[element.id] = element.value;
                    } else if (element.type !== 'button') {
                        settings[element.id] = element.value;
                    }
                }
            }
            
            // Add the time toggle state to the settings
            const showTimeToggle = document.getElementById('show-time-toggle');
            if (showTimeToggle) {
                settings['show-time-toggle'] = showTimeToggle.checked;
            }
            
            // Save the settings to localStorage
            localStorage.setItem('starMapSettings', JSON.stringify(settings));
            
            // Call the original function
            originalSaveSettings();
        };
        
        console.log("Save settings function overridden");
    }
    
    // Override the loadSettings function if it exists
    if (typeof window.loadSettings === 'function') {
        const originalLoadSettings = window.loadSettings;
        
        window.loadSettings = function() {
            console.log("Loading settings with time toggle state");
            
            // Call the original function
            originalLoadSettings();
            
            // Load the time toggle state from localStorage
            const settingsString = localStorage.getItem('starMapSettings');
            if (settingsString) {
                const settings = JSON.parse(settingsString);
                const showTimeToggle = document.getElementById('show-time-toggle');
                
                if (showTimeToggle && settings['show-time-toggle'] !== undefined) {
                    showTimeToggle.checked = settings['show-time-toggle'];
                    
                    // Update the localStorage value for the time toggle
                    localStorage.setItem('showTimeInStarMap', settings['show-time-toggle']);
                    
                    // Update the date/time display
                    if (typeof window.updateDateTimeDisplay === 'function') {
                        window.updateDateTimeDisplay();
                    }
                }
            }
        };
        
        console.log("Load settings function overridden");
    }
    
    // Initialize the time toggle state from localStorage on page load
    const showTimeToggle = document.getElementById('show-time-toggle');
    if (showTimeToggle) {
        const showTimeInStarMap = localStorage.getItem('showTimeInStarMap') !== 'false';
        showTimeToggle.checked = showTimeInStarMap;
        
        // Update the time input required attribute
        const timeInput = document.getElementById('time');
        if (timeInput) {
            if (showTimeToggle.checked) {
                timeInput.setAttribute('required', 'required');
            } else {
                timeInput.removeAttribute('required');
            }
        }
        
        // Update the date/time display
        if (typeof window.updateDateTimeDisplay === 'function') {
            window.updateDateTimeDisplay();
        }
    }
}

/* UPDATED: Disabled fixPNGTransparencyLogic() - conflicts with JPG quality selector - Emergent - 2025-10-24 [11:28:21-EST] */
/* END OF CODE - Emergent - 2025-10-24 [11:28:21-EST] File: js/master-override.js */
