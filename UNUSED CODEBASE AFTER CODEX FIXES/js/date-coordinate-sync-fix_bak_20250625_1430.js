/* Date and Coordinate Sync Fix - Robust Solution */

(function() {
    console.log('Date/Coordinate Sync Fix initializing...');
    
    // Function to format date with optional time
    function formatDateWithTime(dateValue, timeValue, showTime) {
        if (!dateValue) return '';
        
        try {
            const date = new Date(dateValue);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            let formattedDate = date.toLocaleDateString('en-US', options);
            
            if (showTime && timeValue) {
                const [hours, minutes] = timeValue.split(':');
                const hour = parseInt(hours);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const hour12 = hour % 12 || 12;
                formattedDate += `, ${hour12}:${minutes} ${ampm}`;
            }
            
            return formattedDate;
        } catch (e) {
            console.error('Error formatting date:', e);
            return dateValue;
        }
    }
    
    // Main sync function
    function setupDateCoordinateSync() {
        console.log('Setting up date/coordinate sync...');
        
        // Date sync function
        function syncDates() {
            const dateInput = document.getElementById('date');
            const timeInput = document.getElementById('time');
            const showTimeToggle = document.getElementById('show-time-toggle');
            
            if (!dateInput) {
                console.warn('Date input not found');
                return;
            }
            
            const dateValue = dateInput.value;
            const timeValue = timeInput ? timeInput.value : '';
            const showTime = showTimeToggle ? showTimeToggle.checked : true;
            
            const formattedDate = formatDateWithTime(dateValue, timeValue, showTime);
            
            // Update Fixed Layers date
            const fixedDateValue = document.getElementById('fixed-date-value');
            if (fixedDateValue) {
                fixedDateValue.textContent = formattedDate;
                console.log('Updated Fixed Layers date:', formattedDate);
            }
            
            // Update Text Placements date
            const textPlacementDate = document.getElementById('text-placement-content-date');
            if (textPlacementDate) {
                textPlacementDate.textContent = formattedDate;
                console.log('Updated Text Placements date:', formattedDate);
            }
        }
        
        // Coordinate sync function
        function syncCoordinates() {
            const latLongDisplay = document.getElementById('latLongDisplay');
            
            if (!latLongDisplay) {
                console.warn('LatLong display not found');
                return;
            }
            
            const coordsText = latLongDisplay.textContent.trim();
            
            // Only update if we have actual coordinates
            if (coordsText && coordsText !== 'Lat: ... | Long: ...') {
                // Update Fixed Layers coordinates
                const fixedCoordsValue = document.getElementById('fixed-coords-value');
                if (fixedCoordsValue) {
                    fixedCoordsValue.textContent = coordsText;
                    console.log('Updated Fixed Layers coords:', coordsText);
                }
                
                // Update Text Placements coordinates
                const textPlacementCoords = document.getElementById('text-placement-content-coords');
                if (textPlacementCoords) {
                    textPlacementCoords.textContent = coordsText;
                    console.log('Updated Text Placements coords:', coordsText);
                }
            }
        }
        
        // Set up event listeners for date/time changes
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const showTimeToggle = document.getElementById('show-time-toggle');
        
        if (dateInput) {
            dateInput.addEventListener('change', syncDates);
            dateInput.addEventListener('input', syncDates);
        }
        
        if (timeInput) {
            timeInput.addEventListener('change', syncDates);
            timeInput.addEventListener('input', syncDates);
        }
        
        if (showTimeToggle) {
            showTimeToggle.addEventListener('change', syncDates);
        }
        
        // Set up observer for coordinate changes
        const latLongDisplay = document.getElementById('latLongDisplay');
        if (latLongDisplay) {
            const observer = new MutationObserver(function(mutations) {
                syncCoordinates();
            });
            
            observer.observe(latLongDisplay, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
        
        // Also listen to manual coordinate inputs
        const latInput = document.getElementById('latitude');
        const longInput = document.getElementById('longitude');
        
        if (latInput) {
            latInput.addEventListener('input', function() {
                setTimeout(syncCoordinates, 100);
            });
        }
        
        if (longInput) {
            longInput.addEventListener('input', function() {
                setTimeout(syncCoordinates, 100);
            });
        }
        
        // Initial sync
        syncDates();
        syncCoordinates();
        
        // Periodic sync as backup
        setInterval(function() {
            syncDates();
            syncCoordinates();
        }, 3000);
        
        console.log('Date/coordinate sync setup complete');
    }
    
    // Wait for DOM and other scripts to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(setupDateCoordinateSync, 1000);
        });
    } else {
        setTimeout(setupDateCoordinateSync, 1000);
    }
    
    // Also set up on window load as backup
    window.addEventListener('load', function() {
        setTimeout(setupDateCoordinateSync, 1500);
    });
    
    // Expose sync functions globally for debugging
    window.syncDateCoordinate = {
        syncDates: function() {
            const dateInput = document.getElementById('date');
            if (dateInput) {
                const event = new Event('change');
                dateInput.dispatchEvent(event);
            }
        },
        syncCoords: function() {
            const latLongDisplay = document.getElementById('latLongDisplay');
            if (latLongDisplay) {
                const coordsText = latLongDisplay.textContent;
                document.getElementById('fixed-coords-value').textContent = coordsText;
                document.getElementById('text-placement-content-coords').textContent = coordsText;
            }
        }
    };
})();
