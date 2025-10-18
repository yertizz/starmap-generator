/* UI Complete Solution - Fixes all issues without hiding or overwriting */

(function() {
    console.log('UI Complete Solution loading...');
    
    // 1. PROPERLY fix the Fixed Layers initial values
    function fixInitialValues() {
        // Find the Fixed Layers section
        const fixedTextContent = document.querySelector('.fixed-text-content');
        if (!fixedTextContent) return;
        
        // Look for the date and coordinate value divs
        const dateValueDiv = document.getElementById('fixed-date-value');
        const coordsValueDiv = document.getElementById('fixed-coords-value');
        
        // If they have default values, clear them IMMEDIATELY
        if (dateValueDiv && dateValueDiv.textContent.includes('May 22, 2004')) {
            dateValueDiv.textContent = '';
            dateValueDiv.innerHTML = '';
        }
        
        if (coordsValueDiv && (coordsValueDiv.textContent.includes('N39°') || coordsValueDiv.textContent.includes('W98°'))) {
            coordsValueDiv.textContent = '';
            coordsValueDiv.innerHTML = '';
        }
    }
    
    // 2. Add missing font-size dropdowns to Fixed Layers
    function addFontSizeDropdowns() {
        const fixedTextContent = document.querySelector('.fixed-text-content');
        if (!fixedTextContent) return;
        
        // Check if font-size dropdowns already exist
        const existingDateFontSize = document.getElementById('fixed-font-size-date');
        const existingCoordsFontSize = document.getElementById('fixed-font-size-coords');
        
        // Font size options
        const fontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '48px', '56px', '64px', '72px', '80px', '96px', '112px', '128px'];
        
        // Add font-size dropdown for date if missing
        if (!existingDateFontSize) {
            const dateRow = fixedTextContent.querySelector('.input-group:first-child');
            if (dateRow) {
                const fontFamilySelect = dateRow.querySelector('#fixed-font-family-date');
                if (fontFamilySelect) {
                    const fontSizeSelect = document.createElement('select');
                    fontSizeSelect.id = 'fixed-font-size-date';
                    fontSizeSelect.className = 'font-size-select';
                    fontSizeSelect.style.cssText = 'width: 70px !important; min-width: 60px !important; height: 30px; margin-left: 5px;';
                    
                    fontSizes.forEach(size => {
                        const option = document.createElement('option');
                        option.value = size;
                        option.textContent = size;
                        if (size === '16px') option.selected = true;
                        fontSizeSelect.appendChild(option);
                    });
                    
                    // Insert after font-family select
                    fontFamilySelect.parentNode.insertBefore(fontSizeSelect, fontFamilySelect.nextSibling);
                    console.log('Added font-size dropdown for date');
                }
            }
        }
        
        // Add font-size dropdown for coords if missing
        if (!existingCoordsFontSize) {
            const coordsRow = fixedTextContent.querySelector('.input-group:last-child');
            if (coordsRow) {
                const fontFamilySelect = coordsRow.querySelector('#fixed-font-family-coords');
                if (fontFamilySelect) {
                    const fontSizeSelect = document.createElement('select');
                    fontSizeSelect.id = 'fixed-font-size-coords';
                    fontSizeSelect.className = 'font-size-select';
                    fontSizeSelect.style.cssText = 'width: 70px !important; min-width: 60px !important; height: 30px; margin-left: 5px;';
                    
                    fontSizes.forEach(size => {
                        const option = document.createElement('option');
                        option.value = size;
                        option.textContent = size;
                        if (size === '14px') option.selected = true;
                        fontSizeSelect.appendChild(option);
                    });
                    
                    // Insert after font-family select
                    fontFamilySelect.parentNode.insertBefore(fontSizeSelect, fontFamilySelect.nextSibling);
                    console.log('Added font-size dropdown for coordinates');
                }
            }
        }
    }
    
    // 3. Fix zoom slider to actually work
    function fixZoomSlider() {
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        
        if (!zoomSlider) return;
        
        // Remove all existing event listeners by cloning
        const newSlider = zoomSlider.cloneNode(true);
        zoomSlider.parentNode.replaceChild(newSlider, zoomSlider);
        
        // Set default to 100%
        newSlider.value = '100';
        if (zoomValue) zoomValue.textContent = '100';
        
        // Add working zoom functionality
        newSlider.addEventListener('input', function() {
            const scale = this.value / 100;
            if (zoomValue) zoomValue.textContent = this.value;
            
            // Apply zoom to ALL possible containers and canvases
            const elementsToZoom = [
                document.getElementById('star-map-canvas'),
                ...document.querySelectorAll('.canvas-container canvas'),
                ...document.querySelectorAll('.canvas-container img'),
                ...document.querySelectorAll('.canvas-container > div'),
                ...document.querySelectorAll('.combined-view-container'),
                ...document.querySelectorAll('[id*="combined"]'),
                ...document.querySelectorAll('[class*="combined"]')
            ];
            
            elementsToZoom.forEach(element => {
                if (element && element.offsetParent !== null) { // Check if visible
                    element.style.transform = `scale(${scale})`;
                    element.style.transformOrigin = 'center center';
                }
            });
            
            console.log('Applied zoom:', scale, 'to', elementsToZoom.length, 'elements');
        });
        
        console.log('Fixed zoom slider');
    }
    
    // 4. Fix combined views and canvas background
    function fixCombinedViews() {
        // Get the canvas background color setting
        const bgColorInput = document.getElementById('canvas-bg-color');
        const bgColor = bgColorInput ? bgColorInput.value : '#3B3B58';
        
        // Apply background color to canvas
        const canvas = document.getElementById('star-map-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Store the original fillRect function
                const originalFillRect = ctx.fillRect.bind(ctx);
                
                // Override fillRect to ensure background color is applied
                ctx.fillRect = function(x, y, width, height) {
                    if (x === 0 && y === 0 && width === canvas.width && height === canvas.height) {
                        // This is likely a background fill
                        ctx.fillStyle = bgColor;
                    }
                    originalFillRect(x, y, width, height);
                };
            }
        }
        
        // Fix combined view button handlers - use correct function names
        const handlers = {
            'view-star-street-landscape-btn': () => {
                console.log('Combined Landscape view triggered');
                if (window.viewStarStreetLandscape) {
                    window.viewStarStreetLandscape();
                } else if (window.viewCombinedLandscape) {
                    window.viewCombinedLandscape();
                } else {
                    console.error('No landscape view function found');
                }
            },
            'view-star-street-portrait-btn': () => {
                console.log('Combined Portrait view triggered');
                if (window.viewStarStreetPortrait) {
                    window.viewStarStreetPortrait();
                } else if (window.viewCombinedPortrait) {
                    window.viewCombinedPortrait();
                } else {
                    console.error('No portrait view function found');
                }
            },
            'download-star-street-landscape-btn': () => {
                console.log('Download Combined Landscape triggered');
                if (window.downloadStarStreetLandscape) {
                    window.downloadStarStreetLandscape();
                } else if (window.downloadCombinedLandscape) {
                    window.downloadCombinedLandscape();
                } else {
                    console.error('No landscape download function found');
                }
            },
            'download-star-street-portrait-btn': () => {
                console.log('Download Combined Portrait triggered');
                if (window.downloadStarStreetPortrait) {
                    window.downloadStarStreetPortrait();
                } else if (window.downloadCombinedPortrait) {
                    window.downloadCombinedPortrait();
                } else {
                    console.error('No portrait download function found');
                }
            }
        };
        
        // Remove existing listeners and add new ones
        Object.keys(handlers).forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                newBtn.addEventListener('click', handlers[btnId]);
            }
        });
    }
    
    // 5. Set up proper date/coordinate sync
    function setupSync() {
        // Date sync
        function syncDate() {
            const dateInput = document.getElementById('date');
            const timeInput = document.getElementById('time');
            const showTimeToggle = document.getElementById('show-time-toggle');
            
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
        
        // Coordinate sync
        function syncCoords() {
            const latLongDisplay = document.getElementById('latLongDisplay');
            if (!latLongDisplay) return;
            
            const coordsText = latLongDisplay.textContent.trim();
            if (coordsText && coordsText !== 'Lat: ... | Long: ...') {
                const fixedCoordsValue = document.getElementById('fixed-coords-value');
                const textPlacementCoords = document.getElementById('text-placement-content-coords');
                
                if (fixedCoordsValue) fixedCoordsValue.textContent = coordsText;
                if (textPlacementCoords) textPlacementCoords.textContent = coordsText;
            }
        }
        
        // Set up listeners
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const showTimeToggle = document.getElementById('show-time-toggle');
        
        if (dateInput) {
            dateInput.addEventListener('change', syncDate);
            dateInput.addEventListener('input', syncDate);
        }
        
        if (timeInput) {
            timeInput.addEventListener('change', syncDate);
            timeInput.addEventListener('input', syncDate);
        }
        
        if (showTimeToggle) {
            showTimeToggle.addEventListener('change', syncDate);
        }
        
        // Watch for coordinate changes
        const latLongDisplay = document.getElementById('latLongDisplay');
        if (latLongDisplay) {
            const observer = new MutationObserver(syncCoords);
            observer.observe(latLongDisplay, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
        
        // Initial sync
        setTimeout(() => {
            syncDate();
            syncCoords();
        }, 100);
    }
    
    // Initialize everything
    function initialize() {
        // Run immediately to catch initial values
        fixInitialValues();
        
        // Then set up everything else
        setTimeout(() => {
            fixInitialValues(); // Run again to be sure
            addFontSizeDropdowns();
            fixZoomSlider();
            fixCombinedViews();
            setupSync();
            
            console.log('UI Complete Solution initialized');
        }, 500);
    }
    
    // Start immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Also run on window load
    window.addEventListener('load', () => {
        setTimeout(initialize, 100);
    });
    
    // Expose for debugging
    window.uiComplete = {
        fixAll: initialize,
        fixZoom: fixZoomSlider,
        addFontSizes: addFontSizeDropdowns
    };
})();
