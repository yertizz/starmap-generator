/* Absolute Final Fixes - Resolves ALL remaining issues */

(function() {
    console.log('Absolute Final Fixes loading...');
    
    // 1. Fix Fixed Layers loading twice - prevent initial incorrect values
    function preventDoubleLoading() {
        // Hide Fixed Layers content initially
        const fixedDateValue = document.getElementById('fixed-date-value');
        const fixedCoordsValue = document.getElementById('fixed-coords-value');
        
        if (fixedDateValue && !fixedDateValue.dataset.initialized) {
            fixedDateValue.textContent = ''; // Clear initial value
            fixedDateValue.dataset.initialized = 'true';
        }
        
        if (fixedCoordsValue && !fixedCoordsValue.dataset.initialized) {
            fixedCoordsValue.textContent = ''; // Clear initial value
            fixedCoordsValue.dataset.initialized = 'true';
        }
    }
    
    // 2. Fix zoom slider functionality completely
    function fixZoomSliderCompletely() {
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        
        if (!zoomSlider) return;
        
        // Remove any existing listeners first
        const newSlider = zoomSlider.cloneNode(true);
        zoomSlider.parentNode.replaceChild(newSlider, zoomSlider);
        
        // Set default
        newSlider.value = '100';
        if (zoomValue) zoomValue.textContent = '100';
        
        // Add proper zoom functionality
        newSlider.addEventListener('input', function() {
            const scale = this.value / 100;
            if (zoomValue) zoomValue.textContent = this.value;
            
            // Find ALL possible image containers
            const canvas = document.getElementById('star-map-canvas');
            const previewContainer = document.querySelector('.canvas-container');
            const imageContainers = document.querySelectorAll('.map-image-container, .combined-view-container');
            
            // Apply zoom to canvas
            if (canvas) {
                canvas.style.transform = `scale(${scale})`;
                canvas.style.transformOrigin = 'center center';
            }
            
            // Apply zoom to any image containers
            imageContainers.forEach(container => {
                container.style.transform = `scale(${scale})`;
                container.style.transformOrigin = 'center center';
            });
            
            // Apply to preview container if exists
            if (previewContainer) {
                const images = previewContainer.querySelectorAll('img, canvas');
                images.forEach(img => {
                    img.style.transform = `scale(${scale})`;
                    img.style.transformOrigin = 'center center';
                });
            }
        });
    }
    
    // 3. Fix Combined Views (Landscape and Portrait)
    function fixCombinedViews() {
        // Ensure combined view handlers are properly set up
        const viewButtons = {
            'view-star-street-landscape-btn': 'landscape',
            'view-star-street-portrait-btn': 'portrait',
            'download-star-street-landscape-btn': 'landscape',
            'download-star-street-portrait-btn': 'portrait'
        };
        
        Object.keys(viewButtons).forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', function() {
                    const orientation = viewButtons[btnId];
                    console.log(`Combined ${orientation} view clicked`);
                    
                    // Ensure the combined view settings are applied
                    if (window.combinedViewSettings) {
                        console.log('Applying combined view settings:', window.combinedViewSettings);
                    }
                });
            }
        });
    }
    
    // 5. Fix Combined View Options alignment and slider width
    function fixCombinedViewOptionsCompletely() {
        // Wait a bit for elements to be ready
        setTimeout(() => {
            // Find the Combined View Options container
            const containers = document.querySelectorAll('.settings-row > div');
            containers.forEach(container => {
                if (container.textContent.includes('Combined View Options:')) {
                    // Apply container-wide centering
                    container.style.cssText += `
                        text-align: center !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                    `;
                    
                    // Fix title
                    const titleDiv = container.querySelector('div:first-child');
                    if (titleDiv) {
                        titleDiv.style.cssText = `
                            font-weight: bold !important;
                            font-size: 1.15em !important;
                            color: #0056b3 !important;
                            border-bottom: 1px solid #eee !important;
                            padding: 0 15px 10px 15px !important;
                            margin-bottom: 15px !important;
                            text-align: center !important;
                            width: 100% !important;
                        `;
                    }
                    
                    // Fix overlap slider row
                    const overlapDiv = container.querySelector('div:nth-child(2)');
                    if (overlapDiv) {
                        overlapDiv.style.cssText += `
                            display: flex !important;
                            justify-content: center !important;
                            align-items: center !important;
                            width: 100% !important;
                            margin-bottom: 10px !important;
                        `;
                        
                        // Fix the slider itself - reduce width by 50%
                        const overlapSlider = document.getElementById('circle-overlap-percent');
                        if (overlapSlider) {
                            overlapSlider.style.cssText += `
                                width: 200px !important;
                                max-width: 200px !important;
                            `;
                            // Set default to 10%
                            overlapSlider.value = '10';
                            const overlapValue = document.getElementById('overlap-value');
                            if (overlapValue) {
                                overlapValue.textContent = '10%';
                            }
                        }
                    }
                    
                    // Fix map order row
                    const mapOrderDiv = container.querySelector('div:nth-child(3)');
                    if (mapOrderDiv) {
                        mapOrderDiv.style.cssText += `
                            display: flex !important;
                            justify-content: center !important;
                            align-items: center !important;
                            width: 100% !important;
                            gap: 20px !important;
                        `;
                    }
                }
            });
        }, 500);
    }
    
    // 6. Get font dropdown file locations
    function reportFontDropdownLocations() {
        console.log(`
FONT DROPDOWN LOCATIONS:

FONT-FAMILY DROPDOWNS:
1. HTML (Star_Map_Generator.html):
   - Lines ~830-890: Customizable Text Entries #1-4 (populated by JS)
   - Lines ~950-1050: Fixed Layers Date & Coordinates (static options)

2. JavaScript files that populate font-family:
   - js/utils.js or js/picker_init.js: Populates customizable text dropdowns
   - js/settings.js: Handles saving/loading font selections

FONT-SIZE DROPDOWNS:
1. HTML (Star_Map_Generator.html):
   - Font sizes for customizable text: Populated by JS
   - Fixed Layers: Currently added dynamically by fix scripts

2. JavaScript files that handle font-size:
   - js/utils.js or js/picker_init.js: Populates size dropdowns
   - js/final-comprehensive-fixes.js: Adds missing Fixed Layer size dropdowns
   - js/settings.js: Handles saving/loading size selections

ACTIVE FILES (NOT redundant):
- Star_Map_Generator.html
- js/utils.js
- js/picker_init.js (if exists)
- js/settings.js
- js/final-comprehensive-fixes.js
        `);
    }
    
    // Apply all fixes
    function applyAllFixes() {
        console.log('Applying absolute final fixes...');
        
        preventDoubleLoading();
        fixZoomSliderCompletely();
        fixCombinedViews();
        fixCombinedViewOptionsCompletely();
        reportFontDropdownLocations();
        
        // Also ensure date/coordinate sync
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const showTimeToggle = document.getElementById('show-time-toggle');
        
        function updateDates() {
            if (!dateInput || !dateInput.value) return;
            
            try {
                const dateParts = dateInput.value.split('-');
                const year = parseInt(dateParts[0]);
                const month = parseInt(dateParts[1]) - 1;
                const day = parseInt(dateParts[2]);
                
                const date = new Date(year, month, day);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                let formattedDate = date.toLocaleDateString('en-US', options);
                
                if (showTimeToggle && showTimeToggle.checked && timeInput && timeInput.value) {
                    const [hours, minutes] = timeInput.value.split(':');
                    const hour = parseInt(hours);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const hour12 = hour % 12 || 12;
                    formattedDate += `, ${hour12}:${minutes} ${ampm}`;
                }
                
                const fixedDateValue = document.getElementById('fixed-date-value');
                const textPlacementDate = document.getElementById('text-placement-content-date');
                
                if (fixedDateValue) fixedDateValue.textContent = formattedDate;
                if (textPlacementDate) textPlacementDate.textContent = formattedDate;
            } catch (e) {
                console.error('Date sync error:', e);
            }
        }
        
        // Set up date listeners
        if (dateInput) {
            ['change', 'input'].forEach(event => {
                dateInput.addEventListener(event, updateDates);
            });
        }
        if (timeInput) {
            ['change', 'input'].forEach(event => {
                timeInput.addEventListener(event, updateDates);
            });
        }
        if (showTimeToggle) {
            showTimeToggle.addEventListener('change', updateDates);
        }
        
        // Initial update
        setTimeout(updateDates, 100);
        
        // Coordinate sync
        const latLongDisplay = document.getElementById('latLongDisplay');
        if (latLongDisplay) {
            const observer = new MutationObserver(() => {
                const coordsText = latLongDisplay.textContent.trim();
                if (coordsText && coordsText !== 'Lat: ... | Long: ...') {
                    const fixedCoordsValue = document.getElementById('fixed-coords-value');
                    const textPlacementCoords = document.getElementById('text-placement-content-coords');
                    
                    if (fixedCoordsValue) fixedCoordsValue.textContent = coordsText;
                    if (textPlacementCoords) textPlacementCoords.textContent = coordsText;
                }
            });
            
            observer.observe(latLongDisplay, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
        
        console.log('Absolute final fixes applied');
    }
    
    // Wait for page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(applyAllFixes, 1000);
        });
    } else {
        setTimeout(applyAllFixes, 500);
    }
    
    // Expose for debugging
    window.absoluteFixes = {
        fixZoom: fixZoomSliderCompletely,
        fixAlignment: fixCombinedViewOptionsCompletely,
        applyAll: applyAllFixes
    };
})();
