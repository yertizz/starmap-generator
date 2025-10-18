/* START OF CODE - Cline - 2025-05-13 22:36 File: js/time-display-toggle.js */

/**
 * Time Display Toggle Functionality
 * 
 * This script handles the functionality for the time display toggle feature.
 * It allows users to show or hide the time on the star map.
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the time toggle functionality
    initializeTimeToggle();
});

/**
 * Initialize the time toggle functionality
 */
function initializeTimeToggle() {
    console.log("Initializing Time Display Toggle");
    
    const showTimeToggle = document.getElementById('show-time-toggle');
    if (!showTimeToggle) {
        console.error("Time toggle element not found");
        return;
    }
    
    // Initialize the toggle state from localStorage or default to true
    const showTimeInStarMap = localStorage.getItem('showTimeInStarMap') !== 'false';
    showTimeToggle.checked = showTimeInStarMap;
    
    // Update the toggle state when changed
    showTimeToggle.addEventListener('change', function() {
        localStorage.setItem('showTimeInStarMap', this.checked);
        updateDateTimeDisplay();
    });
    
    // Add event listeners to update the display when date or time changes
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    
    if (dateInput) {
        dateInput.addEventListener('change', updateDateTimeDisplay);
    }
    
    if (timeInput) {
        timeInput.addEventListener('change', updateDateTimeDisplay);
    }
    
    // Initial update
    updateDateTimeDisplay();
}

/**
 * Update the date/time display in the preview
 */
function updateDateTimeDisplay() {
    // This will be called when generating the star map
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
            } else {
                dateDisplaySpan.textContent = formattedDate;
            }
        } else {
            dateDisplaySpan.textContent = '';
        }
    }
}

/**
 * Get the formatted date/time string based on the toggle state
 * This function can be called from other scripts
 * 
 * @param {string} dateValue - The date value in YYYY-MM-DD format
 * @param {string} timeValue - The time value in HH:MM format
 * @returns {string} The formatted date/time string
 */
function getFormattedDateTime(dateValue, timeValue) {
    const showTimeToggle = document.getElementById('show-time-toggle');
    const showTime = showTimeToggle ? showTimeToggle.checked : false;
    
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
            
            return `${formattedDate}, ${formattedTime}`;
        } else {
            return formattedDate;
        }
    }
    
    return '';
}

/* END OF CODE - Cline - 2025-05-13 22:36 File: js/time-display-toggle.js */
