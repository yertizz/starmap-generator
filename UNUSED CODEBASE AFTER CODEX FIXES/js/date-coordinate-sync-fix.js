/* START OF CODE - Cline - 2025-06-25 14:34 File: js/date-coordinate-sync-fix.js */

/* Date and Coordinate Sync Fix - Enhanced with Critical Fixes */
/* CRITICAL FIX A: Date showing 1 day less than user-set date */
/* CRITICAL FIX B: Missing font-size dropdowns for Date and Lat/Long Fixed Layers */

(function() {
    console.log('Date/Coordinate Sync Fix initializing (ENHANCED VERSION)...');
    
    // CRITICAL FIX A: Correct date formatting to prevent "1 day less" issue
    function formatDateWithTime(dateValue, timeValue, showTime) {
        if (!dateValue) return '';
        
        try {
            // CRITICAL: Use the date string directly to avoid timezone conversion issues
            // The original code was creating new Date(dateValue) which causes timezone shifts
            const dateParts = dateValue.split('-'); // dateValue is in YYYY-MM-DD format
            if (dateParts.length === 3) {
                const year = parseInt(dateParts[0]);
                const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
                const day = parseInt(dateParts[2]);
                
                // Create date in local timezone to prevent day shift
                const date = new Date(year, month, day);
                
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                let formattedDate = date.toLocaleDateString('en-US', options);
                
                if (showTime && timeValue) {
                    const [hours, minutes] = timeValue.split(':');
                    const hour = parseInt(hours);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const hour12 = hour % 12 || 12;
                    formattedDate += `, ${hour12}:${minutes} ${ampm}`;
                }
                
                console.log('✓ Date formatted correctly (no timezone shift):', formattedDate);
                return formattedDate;
            } else {
                console.warn('Invalid date format:', dateValue);
                return dateValue;
            }
        } catch (e) {
            console.error('Error formatting date:', e);
            return dateValue;
        }
    }
    
    // CRITICAL FIX B: Add missing font-size dropdowns AND ensure Fixed Layers section exists
    function addMissingFontSizeDropdowns() {
        console.log('Adding missing font-size dropdowns to Fixed Layers...');
        
        // Function to create font-size dropdown
        function createFontSizeDropdown(id) {
            const select = document.createElement('select');
            select.id = id;
            select.style.cssText = `
                padding: 2px 5px !important;
                border: 1px solid #ccc !important;
                border-radius: 3px !important;
                font-size: 12px !important;
                background-color: white !important;
                margin: 0 3px !important;
            `;
            
            // Add font size options (correct range from SST 1)
            const fontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '42px', '48px', '54px', '64px', '72px', '96px', '112px'];
            
            fontSizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                if (size === '72px') option.selected = true; // Default to 72px like other layers
                select.appendChild(option);
            });
            
            return select;
        }
        
        // Enhanced search for Fixed Layers section
        console.log('Searching for Fixed Layers section...');
        const allElements = document.querySelectorAll('*');
        let fixedLayersContainer = null;
        let dateRow = null;
        let coordsRow = null;
        
        // Look for Fixed Layers container first
        for (const element of allElements) {
            const text = element.textContent || '';
            if (text.includes('Fixed Layers') || text.includes('Date:') || text.includes('Lat/Long:')) {
                const container = element.closest('div[style*="background"], fieldset, .container');
                if (container && !fixedLayersContainer) {
                    fixedLayersContainer = container;
                    console.log('Found Fixed Layers container:', container);
                    break;
                }
            }
        }
        
        // Search more specifically for Date and Lat/Long rows
        for (const element of allElements) {
            const text = element.textContent || '';
            if (text.trim().startsWith('Date:') || text.includes('fixed-date-value')) {
                dateRow = element.closest('div');
                console.log('Found Date row:', dateRow);
            }
            if (text.trim().startsWith('Lat/Long:') || text.includes('fixed-coords-value')) {
                coordsRow = element.closest('div');
                console.log('Found Coords row:', coordsRow);
            }
        }
        
        // If we can't find the rows, look for the value elements directly
        if (!dateRow) {
            const dateValueElement = document.getElementById('fixed-date-value');
            if (dateValueElement) {
                dateRow = dateValueElement.closest('div');
                console.log('Found Date row via value element:', dateRow);
            }
        }
        
        if (!coordsRow) {
            const coordsValueElement = document.getElementById('fixed-coords-value');
            if (coordsValueElement) {
                coordsRow = coordsValueElement.closest('div');
                console.log('Found Coords row via value element:', coordsRow);
            }
        }
        
        // Add font-size dropdown to Date row
        if (dateRow) {
            console.log('Processing Date row for font-size dropdown...');
            
            // Look for existing font family dropdown to insert after
            const fontFamilySelect = dateRow.querySelector('select');
            if (fontFamilySelect && !dateRow.querySelector('#fixed-date-font-size')) {
                const fontSizeDropdown = createFontSizeDropdown('fixed-date-font-size');
                fontFamilySelect.parentNode.insertBefore(fontSizeDropdown, fontFamilySelect.nextSibling);
                console.log('✓ Font-size dropdown added to Date row');
            } else if (!fontFamilySelect) {
                console.warn('No font family dropdown found in Date row');
            } else {
                console.log('Font-size dropdown already exists in Date row');
            }
        } else {
            console.warn('Date row not found in Fixed Layers');
        }
        
        // Add font-size dropdown to Lat/Long row
        if (coordsRow) {
            console.log('Processing Coords row for font-size dropdown...');
            
            // Look for existing font family dropdown to insert after
            const fontFamilySelect = coordsRow.querySelector('select');
            if (fontFamilySelect && !coordsRow.querySelector('#fixed-coords-font-size')) {
                const fontSizeDropdown = createFontSizeDropdown('fixed-coords-font-size');
                fontFamilySelect.parentNode.insertBefore(fontSizeDropdown, fontFamilySelect.nextSibling);
                console.log('✓ Font-size dropdown added to Coords row');
            } else if (!fontFamilySelect) {
                console.warn('No font family dropdown found in Coords row');
            } else {
                console.log('Font-size dropdown already exists in Coords row');
            }
        } else {
            console.warn('Coords row not found in Fixed Layers');
        }
        
        // Debug: List all elements that might be related
        console.log('=== DEBUGGING FIXED LAYERS ===');
        const dateElements = document.querySelectorAll('[id*="date"], [class*="date"]');
        const coordElements = document.querySelectorAll('[id*="coord"], [class*="coord"], [id*="lat"], [class*="lat"]');
        console.log('Date-related elements:', dateElements);
        console.log('Coord-related elements:', coordElements);
        console.log('Fixed date value element:', document.getElementById('fixed-date-value'));
        console.log('Fixed coords value element:', document.getElementById('fixed-coords-value'));
    }
    
    // Main sync function
    function setupDateCoordinateSync() {
        console.log('Setting up date/coordinate sync...');
        
        // Date sync function with corrected formatting
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
            
            // Use corrected date formatting
            const formattedDate = formatDateWithTime(dateValue, timeValue, showTime);
            
            // Update Fixed Layers date
            const fixedDateValue = document.getElementById('fixed-date-value');
            if (fixedDateValue) {
                fixedDateValue.textContent = formattedDate;
                console.log('✓ Updated Fixed Layers date (corrected):', formattedDate);
            }
            
            // Update Text Placements date
            const textPlacementDate = document.getElementById('text-placement-content-date');
            if (textPlacementDate) {
                textPlacementDate.textContent = formattedDate;
                console.log('✓ Updated Text Placements date (corrected):', formattedDate);
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
                    console.log('✓ Updated Fixed Layers coords:', coordsText);
                }
                
                // Update Text Placements coordinates
                const textPlacementCoords = document.getElementById('text-placement-content-coords');
                if (textPlacementCoords) {
                    textPlacementCoords.textContent = coordsText;
                    console.log('✓ Updated Text Placements coords:', coordsText);
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
        
        console.log('✓ Date/coordinate sync setup complete');
    }
    
    // Main initialization
    function initialize() {
        console.log('Initializing enhanced date/coordinate sync with critical fixes...');
        
        // Add missing font-size dropdowns first
        setTimeout(addMissingFontSizeDropdowns, 500);
        
        // Set up sync functionality
        setupDateCoordinateSync();
        
        console.log('✓ Enhanced date/coordinate sync initialized');
    }
    
    // Wait for DOM and other scripts to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initialize, 1000);
        });
    } else {
        setTimeout(initialize, 1000);
    }
    
    // Also set up on window load as backup
    window.addEventListener('load', function() {
        setTimeout(initialize, 1500);
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
                const fixedCoordsValue = document.getElementById('fixed-coords-value');
                const textPlacementCoords = document.getElementById('text-placement-content-coords');
                if (fixedCoordsValue) fixedCoordsValue.textContent = coordsText;
                if (textPlacementCoords) textPlacementCoords.textContent = coordsText;
            }
        },
        addFontSizeDropdowns: function() {
            addMissingFontSizeDropdowns();
        },
        testDateFormatting: function(dateValue) {
            return formatDateWithTime(dateValue, '12:00', true);
        }
    };
})();

/* END OF CODE - Cline - 2025-06-25 14:34 File: js/date-coordinate-sync-fix.js */
