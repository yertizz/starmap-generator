/* START OF CODE - Cline - 2025-05-23 14:58:46 File: js/data-sync.js */

// Wait for the page to be fully loaded
window.addEventListener('load', function() {
    console.log("DATA SYNC: Page fully loaded");
    
    // Run the fixes immediately and then periodically
    applyFixes();
    setInterval(applyFixes, 1000);
});

// Apply all fixes
function applyFixes() {
    console.log("DATA SYNC: Applying fixes");
    
    // 1. Fix the Star Map Style dropdown width
    fixStarMapStyleWidth();
    
    // 2. Remove duplicate Paper Auto-Size row
    removeDuplicatePaperAutoSize();
    
    // 3. Sync the date from Events Details to Fixed Layers and Text Placements
    syncDateValues();
    
    // 4. Sync the coordinates from Map Location to Fixed Layers and Text Placements
    syncCoordinateValues();
}

// Fix the Star Map Style dropdown width
function fixStarMapStyleWidth() {
    try {
        // Find the Star Map Style dropdown by ID
        const starMapStyle = document.getElementById('star-map-style');
        if (!starMapStyle) {
            // Try finding it by selector
            const starMapStyles = document.querySelectorAll('select');
            for (let i = 0; i < starMapStyles.length; i++) {
                if (starMapStyles[i].parentElement && 
                    starMapStyles[i].parentElement.textContent && 
                    starMapStyles[i].parentElement.textContent.includes('Star Map Style')) {
                    console.log("DATA SYNC: Found Star Map Style dropdown by text content");
                    starMapStyles[i].style.width = '120px';
                    starMapStyles[i].style.maxWidth = '120px';
                }
            }
            return;
        }
        
        console.log("DATA SYNC: Found Star Map Style dropdown by ID");
        starMapStyle.style.width = '120px';
        starMapStyle.style.maxWidth = '120px';
    } catch (error) {
        console.error("DATA SYNC: Error fixing Star Map Style width:", error);
    }
}

// Remove duplicate Paper Auto-Size row
function removeDuplicatePaperAutoSize() {
    try {
        // Find all elements containing "Paper Auto-Size"
        const allElements = document.querySelectorAll('*');
        let paperAutoSizeElements = [];
        
        for (let i = 0; i < allElements.length; i++) {
            if (allElements[i].textContent && 
                allElements[i].textContent.includes('Paper Auto-Size') && 
                allElements[i].tagName !== 'LABEL') {
                paperAutoSizeElements.push(allElements[i]);
            }
        }
        
        console.log("DATA SYNC: Found", paperAutoSizeElements.length, "Paper Auto-Size elements");
        
        // If there's more than one, remove all but the first one
        if (paperAutoSizeElements.length > 1) {
            for (let i = 1; i < paperAutoSizeElements.length; i++) {
                if (paperAutoSizeElements[i].parentNode) {
                    paperAutoSizeElements[i].parentNode.removeChild(paperAutoSizeElements[i]);
                    console.log("DATA SYNC: Removed duplicate Paper Auto-Size element");
                }
            }
        }
    } catch (error) {
        console.error("DATA SYNC: Error removing duplicate Paper Auto-Size row:", error);
    }
}

// Sync the date from Events Details to Fixed Layers and Text Placements
function syncDateValues() {
    try {
        // Get the date from the Events Details container
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        
        if (!dateInput) {
            console.error("DATA SYNC: Date input not found");
            return;
        }
        
        // Format the date
        let formattedDate = formatDate(dateInput.value, timeInput ? timeInput.value : null);
        console.log("DATA SYNC: Formatted date:", formattedDate);
        
        // Update the Fixed Layers date value
        const fixedDateValue = document.getElementById('fixed-date-value');
        if (fixedDateValue) {
            fixedDateValue.textContent = formattedDate;
            console.log("DATA SYNC: Updated Fixed Layers date");
        }
        
        // Update the Text Placements date
        const textPlacementsDate = document.getElementById('text-placement-content-date');
        if (textPlacementsDate) {
            textPlacementsDate.textContent = formattedDate;
            console.log("DATA SYNC: Updated Text Placements date");
        }
    } catch (error) {
        console.error("DATA SYNC: Error syncing date values:", error);
    }
}

// Format the date
function formatDate(dateStr, timeStr) {
    try {
        if (!dateStr) return "";
        
        // Parse the date (format: MM/DD/YYYY)
        const dateParts = dateStr.split('/');
        if (dateParts.length !== 3) return dateStr;
        
        const month = parseInt(dateParts[0]) - 1;
        const day = parseInt(dateParts[1]);
        const year = parseInt(dateParts[2]);
        
        // Format the date
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let formattedDate = `${months[month]} ${day}, ${year}`;
        
        // Add time if available
        if (timeStr) {
            const timeParts = timeStr.split(':');
            if (timeParts.length === 2) {
                const hour = parseInt(timeParts[0]);
                const minute = timeParts[1];
                const isPM = hour >= 12;
                const hour12 = hour % 12 || 12;
                formattedDate += `, ${hour12}:${minute} ${isPM ? 'PM' : 'AM'}`;
            }
        }
        
        return formattedDate;
    } catch (error) {
        console.error("DATA SYNC: Error formatting date:", error);
        return dateStr;
    }
}

// Sync the coordinates from Map Location to Fixed Layers and Text Placements
function syncCoordinateValues() {
    try {
        // Get the coordinates from the latLongDisplay element
        const latLongDisplay = document.getElementById('latLongDisplay');
        
        if (!latLongDisplay) {
            console.error("DATA SYNC: latLongDisplay not found");
            return;
        }
        
        const coordsText = latLongDisplay.textContent.trim();
        console.log("DATA SYNC: Coordinates from latLongDisplay:", coordsText);
        
        // Update the Fixed Layers coordinates value
        const fixedCoordsValue = document.getElementById('fixed-coords-value');
        if (fixedCoordsValue) {
            fixedCoordsValue.textContent = coordsText;
            console.log("DATA SYNC: Updated Fixed Layers coordinates");
        }
        
        // Update the Text Placements coordinates
        const textPlacementsCoords = document.getElementById('text-placement-content-coords');
        if (textPlacementsCoords) {
            textPlacementsCoords.textContent = coordsText;
            console.log("DATA SYNC: Updated Text Placements coordinates");
        }
    } catch (error) {
        console.error("DATA SYNC: Error syncing coordinate values:", error);
    }
}

console.log("DATA SYNC: Script loaded");

/* END OF CODE - Cline - 2025-05-23 14:58:46 File: js/data-sync.js */
