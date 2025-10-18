/* Final Comprehensive Fixes - Addresses ALL remaining issues */

(function() {
    if (window.__FINAL_FIXES_APPLIED__) return; // guard against multiple loads
    console.log('Final Comprehensive Fixes loading...');
    
    // 1. CRITICAL: Fix date off-by-one issue
    let __LAST_FORMATTED_DATE = '';
    function fixDateSync() {
        function updateAllDates() {
            const dateInput = document.getElementById('date');
            const timeInput = document.getElementById('time');
            const showTimeToggle = document.getElementById('show-time-toggle');
            
            if (!dateInput || !dateInput.value) return;
            
            try {
                // Parse the date correctly to avoid timezone issues
                const dateParts = dateInput.value.split('-');
                const year = parseInt(dateParts[0]);
                const month = parseInt(dateParts[1]) - 1; // JavaScript months are 0-based
                const day = parseInt(dateParts[2]);
                
                const date = new Date(year, month, day);
                
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                let formattedDate = date.toLocaleDateString('en-US', options);
                
                // Add time if toggle is checked
                if (showTimeToggle && showTimeToggle.checked && timeInput && timeInput.value) {
                    const [hours, minutes] = timeInput.value.split(':');
                    const hour = parseInt(hours);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const hour12 = hour % 12 || 12;
                    formattedDate += `, ${hour12}:${minutes} ${ampm}`;
                }
                
                // Update all date displays
                const fixedDateValue = document.getElementById('fixed-date-value');
                const textPlacementDate = document.getElementById('text-placement-content-date');
                if (fixedDateValue) fixedDateValue.textContent = formattedDate;
                if (textPlacementDate) textPlacementDate.textContent = formattedDate;
                // Also update any generic date display elements if present
                try {
                    document.querySelectorAll('[data-role="date-display"], .date-display, .date-value').forEach(function(el){ el.textContent = formattedDate; });
                } catch(_){ }
                
                if (formattedDate !== __LAST_FORMATTED_DATE) {
                    __LAST_FORMATTED_DATE = formattedDate;
                    console.log('Updated dates to:', formattedDate);
                }
            } catch (e) {
                console.error('Date sync error:', e);
            }
        }
        
        // Set up listeners
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const showTimeToggle = document.getElementById('show-time-toggle');
        
        if (dateInput) {
            ['change', 'input', 'blur'].forEach(event => {
                dateInput.addEventListener(event, updateAllDates);
            });
        }
        
        if (timeInput) {
            ['change', 'input', 'blur'].forEach(event => {
                timeInput.addEventListener(event, updateAllDates);
            });
        }
        
        if (showTimeToggle) {
            showTimeToggle.addEventListener('change', updateAllDates);
        }
        
        // Initial update and ensure it runs shortly after load to populate UI containers
        updateAllDates();
        setTimeout(updateAllDates, 300);
    }
    
    // 1B. Fix missing font-size dropdowns in Fixed Layers
    function addMissingFontSizeDropdowns() {
        // Check if font-size dropdowns exist
        const dateRow = document.querySelector('.fixed-text-content .input-group:first-child');
        const coordsRow = document.querySelector('.fixed-text-content .input-group:last-child');
        
        // Font size options
        const fontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '48px', '56px', '64px', '72px', '80px', '96px', '112px', '128px'];
        
        // Add font-size dropdown for date if missing
        if (dateRow && !document.getElementById('fixed-font-size-date')) {
            const fontSizeSelect = document.createElement('select');
            fontSizeSelect.id = 'fixed-font-size-date';
            fontSizeSelect.className = 'font-size-select';
            fontSizeSelect.style.cssText = 'width: 70px !important; min-width: 60px !important; height: 30px;';
            
            fontSizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                if (size === '16px') option.selected = true;
                fontSizeSelect.appendChild(option);
            });
            
            // Insert after font-family select
            const fontFamilySelect = dateRow.querySelector('#fixed-font-family-date');
            if (fontFamilySelect) {
                fontFamilySelect.parentNode.insertBefore(fontSizeSelect, fontFamilySelect.nextSibling);
            }
        }
        
        // Add font-size dropdown for coords if missing
        if (coordsRow && !document.getElementById('fixed-font-size-coords')) {
            const fontSizeSelect = document.createElement('select');
            fontSizeSelect.id = 'fixed-font-size-coords';
            fontSizeSelect.className = 'font-size-select';
            fontSizeSelect.style.cssText = 'width: 70px !important; min-width: 60px !important; height: 30px;';
            
            fontSizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                if (size === '14px') option.selected = true;
                fontSizeSelect.appendChild(option);
            });
            
            // Insert after font-family select
            const fontFamilySelect = coordsRow.querySelector('#fixed-font-family-coords');
            if (fontFamilySelect) {
                fontFamilySelect.parentNode.insertBefore(fontSizeSelect, fontFamilySelect.nextSibling);
            }
        }
    }
    
    // 2. Fix Combined View Options alignment
    function fixCombinedViewAlignment() {
        const containers = document.querySelectorAll('.settings-row > div');
        containers.forEach(container => {
            if (container.textContent.includes('Combined View Options:')) {
                // Center the entire container
                container.style.textAlign = 'center';
                
                // Fix overlap slider row
                const overlapDiv = container.querySelector('div[style*="Circle Overlap"]');
                if (overlapDiv) {
                    overlapDiv.style.cssText += 'justify-content: center !important; text-align: center !important;';
                }
                
                // Fix map order row
                const mapOrderDiv = container.querySelector('div[style*="Map Order"]');
                if (mapOrderDiv) {
                    mapOrderDiv.style.cssText += 'justify-content: center !important; text-align: center !important;';
                }
                
                // Set overlap default to 10%
                const overlapSlider = document.getElementById('circle-overlap-percent');
                const overlapValue = document.getElementById('overlap-value');
                if (overlapSlider && overlapValue) {
                    overlapSlider.value = '10';
                    overlapValue.textContent = '10%';
                    window.combinedViewSettings.overlapPercent = 10;
                }
            }
        });
    }
    
    // 3. Fix canvas height to be dynamic
    function fixCanvasHeight() {
        const canvas = document.getElementById('star-map-canvas');
        const widthInput = document.getElementById('output-width');
        const heightInput = document.getElementById('output-height');
        
        if (canvas && widthInput && heightInput) {
            function updateCanvasSize() {
                const width = parseInt(widthInput.value) || 800;
                const height = parseInt(heightInput.value) || 800;
                
                // Set canvas actual size
                canvas.width = width;
                canvas.height = height;
                
                // Set display size with max constraints
                const maxDisplayHeight = window.innerHeight * 0.6; // 60% of viewport
                const aspectRatio = width / height;
                
                if (height > maxDisplayHeight) {
                    canvas.style.height = maxDisplayHeight + 'px';
                    canvas.style.width = (maxDisplayHeight * aspectRatio) + 'px';
                } else {
                    canvas.style.height = 'auto';
                    canvas.style.width = '100%';
                    canvas.style.maxWidth = '100%';
                }
            }
            
            // Update on dimension changes
            widthInput.addEventListener('change', updateCanvasSize);
            heightInput.addEventListener('change', updateCanvasSize);
            
            // Initial update
            updateCanvasSize();
        }
    }
    
    // 4. Fix zoom slider functionality for view buttons
    function fixZoomFunctionality() {
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        const canvas = document.getElementById('star-map-canvas');
        
        if (!zoomSlider || !canvas) return;
        
        // Set default to 100%
        zoomSlider.min = '50';
        zoomSlider.max = '200';
        zoomSlider.value = '100';
        if (zoomValue) zoomValue.textContent = '100';
        
        // Apply display scaling by adjusting style size based on base display dims
        const applyScale = (val) => {
            const baseH = parseInt(canvas?.dataset?.baseDisplayHeight || '0');
            const baseW = parseInt(canvas?.dataset?.baseDisplayWidth || '0');
            const scale = Math.max(0.1, (parseInt(val) || 100) / 100);
            if (baseH > 0 && baseW > 0) {
                canvas.style.height = Math.round(baseH * scale) + 'px';
                canvas.style.width = Math.round(baseW * scale) + 'px';
            }
        };
        applyScale(zoomSlider.value);
        
        let currentView = null;
        let currentImage = null;
        
        // Track view button clicks and store the image
        const viewButtons = {
            'view-star-map-btn': 'star-map',
            'view-street-map-btn': 'street-map',
            'view-star-map-canvas-btn': 'canvas',
            'view-star-street-landscape-btn': 'combined-landscape',
            'view-star-street-portrait-btn': 'combined-portrait'
        };
        
        Object.keys(viewButtons).forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', function() {
                    currentView = viewButtons[btnId];
                    // Reset zoom when changing views
                    zoomSlider.value = '100';
                    if (zoomValue) zoomValue.textContent = '100';
                    applyScale('100');
                    
                    // Store reference to current displayed image/canvas
                    setTimeout(() => {
                        const canvas = document.getElementById('star-map-canvas');
                        if (canvas && canvas.style.display !== 'none') {
                            currentImage = canvas;
                        }
                    }, 100);
                });
            }
        });
        
        // Apply zoom without changing view (resize display)
        zoomSlider.addEventListener('input', function(e) {
            if (zoomValue) zoomValue.textContent = this.value;
            applyScale(this.value);
        });
        
        // (kept) ensure scale updates if another script changes slider value
        zoomSlider.addEventListener('input', function(){
            if (zoomValue) zoomValue.textContent = String(this.value);
            applyScale(this.value);
        });
    }
    
    // 5. Fix Combined Landscape canvas dimensions
    function fixCombinedViewDimensions() {
        const landscapeBtn = document.getElementById('view-star-street-landscape-btn');
        const portraitBtn = document.getElementById('view-star-street-portrait-btn');
        const downloadLandscapeBtn = document.getElementById('download-star-street-landscape-btn');
        const downloadPortraitBtn = document.getElementById('download-star-street-portrait-btn');
        
        function adjustCanvasForCombined(isLandscape) {
            const canvas = document.getElementById('star-map-canvas');
            const widthInput = document.getElementById('output-width');
            const heightInput = document.getElementById('output-height');
            
            if (canvas && widthInput && heightInput) {
                const width = parseInt(widthInput.value);
                const height = parseInt(heightInput.value);
                
                // For combined views, adjust canvas orientation
                if (isLandscape && height > width) {
                    // Switch to landscape
                    canvas.width = height;
                    canvas.height = width;
                } else if (!isLandscape && width > height) {
                    // Switch to portrait
                    canvas.width = height;
                    canvas.height = width;
                } else {
                    // Keep current dimensions
                    canvas.width = width;
                    canvas.height = height;
                }
                
                // Update display
                const maxDisplayHeight = window.innerHeight * 0.6;
                const aspectRatio = canvas.width / canvas.height;
                
                if (canvas.height > maxDisplayHeight) {
                    canvas.style.height = maxDisplayHeight + 'px';
                    canvas.style.width = (maxDisplayHeight * aspectRatio) + 'px';
                } else {
                    canvas.style.height = 'auto';
                    canvas.style.width = '100%';
                    canvas.style.maxWidth = '100%';
                }
            }
        }
        
        // Add listeners
        if (landscapeBtn) {
            landscapeBtn.addEventListener('click', () => adjustCanvasForCombined(true));
        }
        if (portraitBtn) {
            portraitBtn.addEventListener('click', () => adjustCanvasForCombined(false));
        }
        if (downloadLandscapeBtn) {
            downloadLandscapeBtn.addEventListener('click', () => adjustCanvasForCombined(true));
        }
        if (downloadPortraitBtn) {
            downloadPortraitBtn.addEventListener('click', () => adjustCanvasForCombined(false));
        }
    }
    
    // Apply all fixes
    function applyAllFixes() {
        if (window.__FINAL_FIXES_APPLIED__) return; // idempotent
        console.log('Applying final comprehensive fixes...');
        
        fixDateSync();
        addMissingFontSizeDropdowns();
        fixCombinedViewAlignment();
        fixCanvasHeight();
        fixZoomFunctionality();
        fixCombinedViewDimensions();
        
        // Also ensure coordinate sync
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
        
        console.log('Final comprehensive fixes applied');
        window.__FINAL_FIXES_APPLIED__ = true;
    }
    
    // Wait for page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { applyAllFixes(); });
    } else { applyAllFixes(); }
    
    // Expose for debugging
    window.finalFixes = {
        fixDates: fixDateSync,
        fixAlignment: fixCombinedViewAlignment,
        fixCanvas: fixCanvasHeight,
        fixZoom: fixZoomFunctionality,
        applyAll: applyAllFixes
    };
})();
