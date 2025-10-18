/* Critical Fixes for Star Map Generator */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Critical fixes loading...');
    
    // 1. Fix Fixed Layers title styling
    function fixFixedLayersTitle() {
        const fixedLayersContent = document.querySelector('.fixed-text-content');
        if (fixedLayersContent) {
            // Check if h3 exists, if not create it
            let title = fixedLayersContent.querySelector('h3');
            if (!title) {
                title = document.createElement('h3');
                title.textContent = 'Fixed Layers';
                fixedLayersContent.insertBefore(title, fixedLayersContent.firstChild);
            }
            // Apply legend styling to match other sections
            title.style.cssText = `
                font-weight: bold !important;
                font-size: 1.15em !important;
                color: #0056b3 !important;
                border: none !important;
                border-bottom: 1px solid #eee !important;
                padding: 0 15px 10px 15px !important;
                margin-bottom: 15px !important;
                width: auto !important;
                max-width: calc(100% - 30px) !important;
                text-align: center !important;
                display: block !important;
                margin-left: auto !important;
                margin-right: auto !important;
                float: none !important;
            `;
        }
    }
    
    // 2. Fix dropdown heights in Fixed Layers
    function fixDropdownHeights() {
        // Get reference heights from customizable text layers
        const refFontFamily = document.querySelector('#font-family-1');
        const refFontSize = document.querySelector('#font-size-1');
        
        if (refFontFamily && refFontSize) {
            const familyHeight = window.getComputedStyle(refFontFamily).height;
            const sizeHeight = window.getComputedStyle(refFontSize).height;
            
            // Apply to fixed layers dropdowns
            const fixedFamilyDropdowns = document.querySelectorAll('#fixed-font-family-date, #fixed-font-family-coords');
            const fixedSizeDropdowns = document.querySelectorAll('#fixed-font-size-date, #fixed-font-size-coords');
            
            fixedFamilyDropdowns.forEach(dropdown => {
                dropdown.style.height = familyHeight;
            });
            
            fixedSizeDropdowns.forEach(dropdown => {
                dropdown.style.height = sizeHeight;
            });
        }
    }
    
    // 3. Style Combined View Options title
    function styleCombinedViewTitle() {
        const combinedViewDiv = document.querySelector('.settings-row > div[style*="Combined View Options"]');
        if (combinedViewDiv) {
            const titleDiv = combinedViewDiv.querySelector('div[style*="font-weight: bold"]');
            if (titleDiv) {
                titleDiv.style.cssText = `
                    font-weight: bold !important;
                    font-size: 1.15em !important;
                    color: #0056b3 !important;
                    border-bottom: 1px solid #eee !important;
                    padding: 0 15px 10px 15px !important;
                    margin-bottom: 15px !important;
                    text-align: center !important;
                `;
            }
        }
    }
    
    // 4. Center align Map Order row
    function centerMapOrderRow() {
        const mapOrderDiv = document.querySelector('div[style*="Map Order:"]');
        if (mapOrderDiv && mapOrderDiv.parentElement) {
            mapOrderDiv.parentElement.style.justifyContent = 'center';
            mapOrderDiv.style.justifyContent = 'center';
        }
    }
    
    // 6. CRITICAL: Fix date and coordinate syncing
    function syncDateAndCoordinates() {
        // Date syncing
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const showTimeToggle = document.getElementById('show-time-toggle');
        const fixedDateValue = document.getElementById('fixed-date-value');
        const textPlacementDate = document.getElementById('text-placement-content-date');
        
        function updateDateDisplays() {
            if (!dateInput || !dateInput.value) return;
            
            const date = new Date(dateInput.value);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            let formattedDate = date.toLocaleDateString('en-US', options);
            
            // Add time if toggle is checked and time exists
            if (showTimeToggle && showTimeToggle.checked && timeInput && timeInput.value) {
                const [hours, minutes] = timeInput.value.split(':');
                const hour = parseInt(hours);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const hour12 = hour % 12 || 12;
                formattedDate += `, ${hour12}:${minutes} ${ampm}`;
            }
            
            // Update both displays
            if (fixedDateValue) {
                fixedDateValue.textContent = formattedDate;
            }
            if (textPlacementDate) {
                textPlacementDate.textContent = formattedDate;
            }
        }
        
        // Coordinate syncing
        const latLongDisplay = document.getElementById('latLongDisplay');
        const fixedCoordsValue = document.getElementById('fixed-coords-value');
        const textPlacementCoords = document.getElementById('text-placement-content-coords');
        
        function updateCoordinateDisplays() {
            if (!latLongDisplay) return;
            
            const coordsText = latLongDisplay.textContent;
            if (coordsText && coordsText !== 'Lat: ... | Long: ...') {
                if (fixedCoordsValue) {
                    fixedCoordsValue.textContent = coordsText;
                }
                if (textPlacementCoords) {
                    textPlacementCoords.textContent = coordsText;
                }
            }
        }
        
        // Set up event listeners
        if (dateInput) {
            dateInput.addEventListener('change', updateDateDisplays);
        }
        if (timeInput) {
            timeInput.addEventListener('change', updateDateDisplays);
        }
        if (showTimeToggle) {
            showTimeToggle.addEventListener('change', updateDateDisplays);
        }
        
        // Watch for coordinate changes
        if (latLongDisplay) {
            const observer = new MutationObserver(updateCoordinateDisplays);
            observer.observe(latLongDisplay, { childList: true, characterData: true, subtree: true });
        }
        
        // Initial sync
        updateDateDisplays();
        updateCoordinateDisplays();
        
        // Also sync on any coordinate input changes
        const latInput = document.getElementById('latitude');
        const longInput = document.getElementById('longitude');
        if (latInput) latInput.addEventListener('input', updateCoordinateDisplays);
        if (longInput) longInput.addEventListener('input', updateCoordinateDisplays);
    }
    
    // 7. Fix zoom slider default
    function fixZoomSliderDefault() {
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        
        if (zoomSlider && zoomValue) {
            // Set default to 100%
            zoomSlider.value = '100';
            zoomValue.textContent = '100';
        }
    }
    
    // Apply all fixes
    setTimeout(() => {
        fixFixedLayersTitle();
        fixDropdownHeights();
        styleCombinedViewTitle();
        centerMapOrderRow();
        syncDateAndCoordinates();
        fixZoomSliderDefault();
        
        console.log('Critical fixes applied');
    }, 500);
    
    // Re-apply date/coordinate sync periodically to catch any changes
    setInterval(() => {
        const dateInput = document.getElementById('date');
        const latLongDisplay = document.getElementById('latLongDisplay');
        
        if (dateInput && dateInput.value) {
            const event = new Event('change');
            dateInput.dispatchEvent(event);
        }
        
        if (latLongDisplay) {
            const coordsText = latLongDisplay.textContent;
            if (coordsText && coordsText !== 'Lat: ... | Long: ...') {
                const fixedCoordsValue = document.getElementById('fixed-coords-value');
                const textPlacementCoords = document.getElementById('text-placement-content-coords');
                
                if (fixedCoordsValue) {
                    fixedCoordsValue.textContent = coordsText;
                }
                if (textPlacementCoords) {
                    textPlacementCoords.textContent = coordsText;
                }
            }
        }
    }, 2000); // Check every 2 seconds
});

// 8. Font sizes information
console.log(`
FONT SIZES LOCATION:
The font sizes are defined in multiple places:

1. In the HTML for Fixed Layers dropdowns (lines ~1000-1100)
2. In js/picker_init.js or js/utils.js for the customizable text entries
3. Current font sizes: 8px, 10px, 12px, 14px, 16px, 18px, 20px, 24px, 28px, 32px, 36px, 40px, 48px, 56px, 64px, 72px, 80px, 96px, 112px, 128px

To add more sizes, you need to update:
- The HTML <option> tags in the Fixed Layers section
- The JavaScript array that populates the customizable text dropdowns
`);
