/* START OF CODE - AI Fix - 2025-09-08 - Coordinate & Date/Time Display Fix */
/**
 * This script fixes the coordinate and date/time display issues in the Star Map Generator
 * It ensures all UI elements are updated when data changes
 */

(function() {
    'use strict';
    
    console.log('[Display Fix] Initializing coordinate and date/time display fix...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDisplayFix);
    } else {
        initializeDisplayFix();
    }
    
    function initializeDisplayFix() {
        console.log('[Display Fix] DOM ready, setting up display updates...');
        
        // Get references to all display elements
        const elements = {
            latLongDisplay: document.getElementById('latLongDisplay'),
            latitudeInput: document.getElementById('latitude'),
            longitudeInput: document.getElementById('longitude'),
            dateInput: document.getElementById('date'),
            timeInput: document.getElementById('time'),
            fixedDateValue: document.getElementById('fixed-date-value'),
            fixedCoordsValue: document.getElementById('fixed-coords-value'),
            textPlacementDate: document.getElementById('text-placement-content-date'),
            textPlacementCoords: document.getElementById('text-placement-content-coords'),
            zipCodeInput: document.getElementById('zip-code'),
            addressInput: document.getElementById('address')
        };
        
        // Verify elements exist
        console.log('[Display Fix] Found elements:', {
            latLongDisplay: !!elements.latLongDisplay,
            latitudeInput: !!elements.latitudeInput,
            longitudeInput: !!elements.longitudeInput,
            dateInput: !!elements.dateInput,
            timeInput: !!elements.timeInput,
            fixedDateValue: !!elements.fixedDateValue,
            fixedCoordsValue: !!elements.fixedCoordsValue
        });
        
        /**
         * Convert decimal degrees to DMM format (Degrees Minutes.Minutes)
         */
        function decimalToDMM(decimal, isLatitude) {
            const absolute = Math.abs(decimal);
            const degrees = Math.floor(absolute);
            const minutes = (absolute - degrees) * 60;
            
            let direction;
            if (isLatitude) {
                direction = decimal >= 0 ? 'N' : 'S';
            } else {
                direction = decimal >= 0 ? 'E' : 'W';
            }
            
            return `${direction}${degrees}° ${minutes.toFixed(5)}`;
        }
        
        /**
         * Update all coordinate displays
         */
        function updateCoordinateDisplays(lat, lng) {
            console.log('[Display Fix] Updating coordinate displays:', { lat, lng });
            
            if (lat === null || lng === null || lat === undefined || lng === undefined) {
                console.warn('[Display Fix] Invalid coordinates provided');
                return;
            }
            
            // Format coordinates in DMM
            const latDMM = decimalToDMM(lat, true);
            const lngDMM = decimalToDMM(lng, false);
            
            // Update red display under map
            if (elements.latLongDisplay) {
                elements.latLongDisplay.textContent = `Lat: ${latDMM} | Long: ${lngDMM}`;
                elements.latLongDisplay.style.color = '#ff0000';
                console.log('[Display Fix] Updated latLongDisplay');
            }
            
            // Update latitude input field
            if (elements.latitudeInput) {
                elements.latitudeInput.value = latDMM;
                console.log('[Display Fix] Updated latitude input:', latDMM);
            }
            
            // Update longitude input field
            if (elements.longitudeInput) {
                elements.longitudeInput.value = lngDMM;
                console.log('[Display Fix] Updated longitude input:', lngDMM);
            }
            
            // Update fixed coords value (grey box in Fixed Layers section)
            if (elements.fixedCoordsValue) {
                elements.fixedCoordsValue.textContent = `${latDMM} | ${lngDMM}`;
                console.log('[Display Fix] Updated fixed coords value');
            }
            
            // Update text placement coords display
            if (elements.textPlacementCoords) {
                elements.textPlacementCoords.textContent = `${latDMM} | ${lngDMM}`;
                console.log('[Display Fix] Updated text placement coords');
            }
        }
        
        /**
         * Update all date/time displays
         */
        function updateDateTimeDisplays() {
            console.log('[Display Fix] Updating date/time displays...');
            
            const dateValue = elements.dateInput ? elements.dateInput.value : '';
            const timeValue = elements.timeInput ? elements.timeInput.value : '';
            const showTimeToggle = document.getElementById('show-time-toggle');
            const showTime = showTimeToggle ? showTimeToggle.checked : true;
            
            if (!dateValue) {
                console.log('[Display Fix] No date value to display');
                return;
            }
            
            // Format date
            const dateObj = new Date(dateValue + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            let displayText = formattedDate;
            
            // Add time if toggle is on and time is provided
            if (showTime && timeValue) {
                const timeParts = timeValue.split(':');
                let hours = parseInt(timeParts[0]);
                const minutes = timeParts[1];
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                const formattedTime = `${hours}:${minutes} ${ampm}`;
                displayText = `${formattedDate}, ${formattedTime}`;
            }
            
            console.log('[Display Fix] Formatted date/time:', displayText);
            
            // Update fixed date value (grey box in Fixed Layers section)
            if (elements.fixedDateValue) {
                elements.fixedDateValue.textContent = displayText;
                console.log('[Display Fix] Updated fixed date value');
            }
            
            // Update text placement date display
            if (elements.textPlacementDate) {
                elements.textPlacementDate.textContent = displayText;
                console.log('[Display Fix] Updated text placement date');
            }
        }
        
        /**
         * Extract coordinates from Google Map
         */
        function getMapCoordinates() {
            // Try to get coordinates from the map object
            if (typeof window.map !== 'undefined' && window.map) {
                const center = window.map.getCenter();
                if (center) {
                    return {
                        lat: center.lat(),
                        lng: center.lng()
                    };
                }
            }
            return null;
        }
        
        /**
         * Set up listeners for map changes
         */
        function setupMapListeners() {
            // Check if map exists AND google maps API is loaded
            const checkMapInterval = setInterval(function() {
                if (typeof google !== 'undefined' && 
                    typeof google.maps !== 'undefined' && 
                    typeof google.maps.event !== 'undefined' &&
                    typeof window.map !== 'undefined' && 
                    window.map) {
                    console.log('[Display Fix] Google Map found, adding listeners...');
                    clearInterval(checkMapInterval);
                    
                    // Listen for map center changes
                    google.maps.event.addListener(window.map, 'center_changed', function() {
                        const coords = getMapCoordinates();
                        if (coords) {
                            updateCoordinateDisplays(coords.lat, coords.lng);
                        }
                    });
                    
                    // Listen for map clicks
                    google.maps.event.addListener(window.map, 'click', function(event) {
                        if (event.latLng) {
                            updateCoordinateDisplays(event.latLng.lat(), event.latLng.lng());
                        }
                    });
                    
                    // Initial update with current map position
                    const coords = getMapCoordinates();
                    if (coords) {
                        updateCoordinateDisplays(coords.lat, coords.lng);
                    }
                }
            }, 100);
            
            // Stop checking after 30 seconds (increased timeout)
            setTimeout(function() {
                clearInterval(checkMapInterval);
                console.warn('[Display Fix] Timeout: Google Maps not loaded after 30 seconds');
            }, 30000);
        }
        
        /**
         * Set up listeners for ZIP code and address searches
         */
        function setupSearchListeners() {
            // ZIP code search
            if (elements.zipCodeInput) {
                elements.zipCodeInput.addEventListener('change', function() {
                    console.log('[Display Fix] ZIP code changed, will update displays after search');
                    // Wait a bit for the map to update
                    setTimeout(function() {
                        const coords = getMapCoordinates();
                        if (coords) {
                            updateCoordinateDisplays(coords.lat, coords.lng);
                        }
                    }, 500);
                });
            }
            
            // Address search
            if (elements.addressInput) {
                elements.addressInput.addEventListener('change', function() {
                    console.log('[Display Fix] Address changed, will update displays after search');
                    setTimeout(function() {
                        const coords = getMapCoordinates();
                        if (coords) {
                            updateCoordinateDisplays(coords.lat, coords.lng);
                        }
                    }, 500);
                });
            }
        }
        
        /**
         * Set up listeners for date/time changes
         */
        function setupDateTimeListeners() {
            if (elements.dateInput) {
                elements.dateInput.addEventListener('change', updateDateTimeDisplays);
            }
            
            if (elements.timeInput) {
                elements.timeInput.addEventListener('change', updateDateTimeDisplays);
            }
            
            const showTimeToggle = document.getElementById('show-time-toggle');
            if (showTimeToggle) {
                showTimeToggle.addEventListener('change', updateDateTimeDisplays);
            }
            
            // Initial update
            updateDateTimeDisplays();
        }
        
        /**
         * Set up manual coordinate input listeners
         */
        function setupManualCoordinateListeners() {
            if (elements.latitudeInput && elements.longitudeInput) {
                const updateFromManualInput = function() {
                    const latValue = elements.latitudeInput.value;
                    const lngValue = elements.longitudeInput.value;
                    
                    if (latValue && lngValue) {
                        // Parse DMM format to decimal
                        // This is a simplified parser - the actual parsing logic from coords-parse.js should be used
                        console.log('[Display Fix] Manual coordinates entered:', { latValue, lngValue });
                        // Update other displays
                        if (elements.fixedCoordsValue) {
                            elements.fixedCoordsValue.textContent = `${latValue} | ${lngValue}`;
                        }
                        if (elements.textPlacementCoords) {
                            elements.textPlacementCoords.textContent = `${latValue} | ${lngValue}`;
                        }
                    }
                };
                
                elements.latitudeInput.addEventListener('change', updateFromManualInput);
                elements.longitudeInput.addEventListener('change', updateFromManualInput);
            }
            
            // Add listeners to text entry fields to sync with text placements
            for (let i = 1; i <= 4; i++) {
                const textInput = document.getElementById(`text-entry-${i}`);
                const textDisplay = document.getElementById(`text-placement-content-${i}`);
                
                if (textInput && textDisplay) {
                    textInput.addEventListener('input', function() {
                        textDisplay.textContent = textInput.value;
                        console.log(`[Display Fix] Updated text placement ${i}:`, textInput.value);
                    });
                    
                    textInput.addEventListener('change', function() {
                        textDisplay.textContent = textInput.value;
                    });
                }
            }
        }
        
        // Initialize all listeners
        setupMapListeners();
        setupSearchListeners();
        setupDateTimeListeners();
        setupManualCoordinateListeners();
        
        // Add delayed initialization to ensure all data is loaded
        setTimeout(function() {
            console.log('[Display Fix] Running delayed initialization...');
            
            // Update date/time displays if values exist
            if (elements.dateInput && elements.dateInput.value) {
                updateDateTimeDisplays();
            }
            
            // Update coordinate displays if values exist
            if (elements.latitudeInput && elements.latitudeInput.value && 
                elements.longitudeInput && elements.longitudeInput.value) {
                const latValue = elements.latitudeInput.value;
                const lngValue = elements.longitudeInput.value;
                
                // Update displays
                if (elements.fixedCoordsValue) {
                    elements.fixedCoordsValue.textContent = `${latValue} | ${lngValue}`;
                }
                if (elements.textPlacementCoords) {
                    elements.textPlacementCoords.textContent = `${latValue} | ${lngValue}`;
                }
            }
            
            // Sync text placements
            syncTextPlacements();
            
            console.log('[Display Fix] Delayed initialization complete');
        }, 500); // Wait 500ms for page to load
        
        // Add ADDITIONAL initialization at 1 second and 2 seconds
        setTimeout(function() {
            console.log('[Display Fix] Running 1-second re-check...');
            if (elements.dateInput && elements.dateInput.value) {
                updateDateTimeDisplays();
            }
            syncTextPlacements();
        }, 1000);
        
        setTimeout(function() {
            console.log('[Display Fix] Running 2-second re-check...');
            if (elements.dateInput && elements.dateInput.value) {
                updateDateTimeDisplays();
            }
            syncTextPlacements();
        }, 2000);
        
        console.log('[Display Fix] All listeners set up successfully');
        
        // Expose update functions globally so other scripts can call them
        window.updateCoordinateDisplays = updateCoordinateDisplays;
        window.updateDateTimeDisplays = updateDateTimeDisplays;
    }
    
    /**
     * Sync text placements - copy text from input fields to text placement displays
     */
    function syncTextPlacements() {
        console.log('[Display Fix] Syncing text placements...');
        
        // Sync text entries 1-4
        for (let i = 1; i <= 4; i++) {
            const textInput = document.getElementById(`text-entry-${i}`);
            const textDisplay = document.getElementById(`text-placement-content-${i}`);
            
            if (textInput && textDisplay && textInput.value) {
                textDisplay.textContent = textInput.value;
                console.log(`[Display Fix] Synced text entry ${i}:`, textInput.value);
            }
        }
    }
})();
/* END OF CODE - AI Fix - 2025-09-08 - Coordinate & Date/Time Display Fix */
