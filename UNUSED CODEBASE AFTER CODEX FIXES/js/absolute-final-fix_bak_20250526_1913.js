/* Absolute Final Fix - Direct DOM manipulation to fix all issues */
/* START OF CODE - Cline - 2025-05-26 09:29 File: js/absolute-final-fix.js */

(function() {
    console.log('Absolute Final Fix starting...');
    
    // 1. FIX FONT SIZE DROPDOWNS IN FIXED LAYERS
    function fixFixedLayersFontSizes() {
        console.log('Fixing Fixed Layers font size dropdowns...');
        
        const fontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '48px', '56px', '64px', '72px', '80px', '96px', '112px', '128px'];
        
        // Fix Date font size dropdown
        if (!document.getElementById('fixed-font-size-date')) {
            const dateFontFamily = document.getElementById('fixed-font-family-date');
            if (dateFontFamily) {
                const select = document.createElement('select');
                select.id = 'fixed-font-size-date';
                select.className = 'font-size-select';
                select.style.cssText = 'width: 70px !important; min-width: 70px !important; margin-left: 5px !important;';
                
                fontSizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    if (size === '24px') option.selected = true;
                    select.appendChild(option);
                });
                
                dateFontFamily.parentNode.insertBefore(select, dateFontFamily.nextSibling);
                console.log('✓ Added date font size dropdown');
            }
        }
        
        // Fix Coordinates font size dropdown
        if (!document.getElementById('fixed-font-size-coords')) {
            const coordsFontFamily = document.getElementById('fixed-font-family-coords');
            if (coordsFontFamily) {
                const select = document.createElement('select');
                select.id = 'fixed-font-size-coords';
                select.className = 'font-size-select';
                select.style.cssText = 'width: 70px !important; min-width: 70px !important; margin-left: 5px !important;';
                
                fontSizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    if (size === '14px') option.selected = true;
                    select.appendChild(option);
                });
                
                coordsFontFamily.parentNode.insertBefore(select, coordsFontFamily.nextSibling);
                console.log('✓ Added coordinates font size dropdown');
            }
        }
    }
    
    // 2. FORCE ADD ZOOM SLIDER (SINGLE INSTANCE)
    function forceAddZoomSlider() {
        console.log('Forcing single zoom slider...');
        
        // Remove ALL existing zoom sections first to prevent duplicates
        const existingZooms = document.querySelectorAll('#zoom-container, .zoom-section, [id^="zoom-"]');
        existingZooms.forEach(el => {
            console.log('Removing existing zoom element:', el.id || el.className);
            el.remove();
        });
        
        // Find where to insert - after image format
        const downloadSection = document.querySelector('.settings-preview-download-section');
        if (!downloadSection) {
            setTimeout(forceAddZoomSlider, 500);
            return;
        }
        
        // Find the image format row
        const imageFormatRow = Array.from(downloadSection.querySelectorAll('.settings-row'))
            .find(row => row.textContent.includes('Image Format:'));
        
        if (!imageFormatRow) {
            setTimeout(forceAddZoomSlider, 500);
            return;
        }
        
        // Create zoom slider
        const zoomDiv = document.createElement('div');
        zoomDiv.id = 'zoom-slider-container'; // Add unique ID
        zoomDiv.className = 'settings-row';
        zoomDiv.style.cssText = 'margin-top: 20px; padding: 15px; background-color: #e8f4f8; border: 2px solid #007bff; border-radius: 8px; max-width: 600px; margin-left: auto; margin-right: auto;';
        zoomDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; justify-content: center;">
                <label style="font-weight: bold; font-size: 16px; color: #007bff;">Zoom:</label>
                <input type="range" id="zoom-slider" min="10" max="200" value="100" 
                       style="flex: 1; max-width: 400px; height: 8px; cursor: pointer;">
                <span id="zoom-value" style="min-width: 50px; text-align: right; font-weight: bold; font-size: 18px; color: #007bff;">100</span>
                <span style="font-weight: bold; font-size: 16px; color: #007bff;">%</span>
            </div>
        `;
        
        // Insert after image format
        imageFormatRow.parentNode.insertBefore(zoomDiv, imageFormatRow.nextSibling);
        
        // Add functionality
        const slider = document.getElementById('zoom-slider');
        const value = document.getElementById('zoom-value');
        
        if (slider && value) {
            slider.addEventListener('input', function() {
                value.textContent = this.value;
                const scale = this.value / 100;
                
                const canvas = document.getElementById('star-map-canvas');
                if (canvas) {
                    // Fix canvas height first to prevent tall canvas
                    canvas.style.height = 'auto';
                    canvas.style.maxHeight = '600px';
                    
                    // Apply zoom
                    canvas.style.transform = `scale(${scale})`;
                    canvas.style.transformOrigin = 'center center';
                    canvas.style.transition = 'transform 0.3s ease';
                }
            });
            
            console.log('✓ Zoom slider added successfully!');
        }
    }
    
    // 3. FIX TIME DISPLAY
    function fixTimeDisplay() {
        console.log('Fixing time display...');
        
        const showTimeToggle = document.getElementById('show-time-toggle');
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        
        if (!dateInput || !timeInput) return;
        
        function updateTimeDisplay() {
            const dateValue = dateInput.value;
            const timeValue = timeInput.value;
            const showTime = showTimeToggle ? showTimeToggle.checked : true;
            
            if (!dateValue) return;
            
            // Parse date
            const [year, month, day] = dateValue.split('-').map(Number);
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
            let displayText = `${months[month - 1]} ${day}, ${year}`;
            
            // Add time if enabled
            if (showTime && timeValue) {
                const [hours, minutes] = timeValue.split(':').map(Number);
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const displayHours = hours % 12 || 12;
                displayText += `, ${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
            }
            
            // Update Fixed Layers date
            const fixedDate = document.getElementById('fixed-date-value');
            if (fixedDate) {
                fixedDate.textContent = displayText;
                fixedDate.innerHTML = displayText;
            }
            
            // Update Text Placements date
            const textDate = document.getElementById('text-placement-content-date');
            if (textDate) {
                textDate.textContent = displayText;
                textDate.innerHTML = displayText;
            }
            
            console.log('✓ Time display updated:', displayText);
        }
        
        // Update on changes
        dateInput.addEventListener('change', updateTimeDisplay);
        timeInput.addEventListener('change', updateTimeDisplay);
        if (showTimeToggle) {
            showTimeToggle.addEventListener('change', updateTimeDisplay);
        }
        
        // Initial update
        updateTimeDisplay();
    }
    
    // 4. SYNC COORDINATES DISPLAY
    function syncCoordinatesDisplay() {
        console.log('Syncing coordinates display...');
        
        // Get the latLongDisplay element
        const latLongDisplay = document.getElementById('latLongDisplay');
        if (!latLongDisplay) return;
        
        // Function to update coordinates in Fixed Layers and Text Placements
        function updateCoordinates() {
            const coordsText = latLongDisplay.textContent.trim();
            if (!coordsText || coordsText === 'Lat: ... | Long: ...') return;
            
            console.log('Updating coordinates to:', coordsText);
            
            // Update Fixed Layers coordinates
            const fixedCoordsValue = document.getElementById('fixed-coords-value');
            if (fixedCoordsValue) {
                fixedCoordsValue.textContent = coordsText;
                fixedCoordsValue.innerHTML = coordsText;
            }
            
            // Update Text Placements coordinates
            const textPlacementCoords = document.getElementById('text-placement-content-coords');
            if (textPlacementCoords) {
                textPlacementCoords.textContent = coordsText;
                textPlacementCoords.innerHTML = coordsText;
            }
        }
        
        // Update immediately
        updateCoordinates();
        
        // Watch for changes to latLongDisplay
        const observer = new MutationObserver(updateCoordinates);
        observer.observe(latLongDisplay, {
            childList: true,
            characterData: true,
            subtree: true
        });
        
        // Also watch coordinate inputs
        const latInput = document.getElementById('latitude');
        const lngInput = document.getElementById('longitude');
        
        if (latInput) {
            latInput.addEventListener('change', () => setTimeout(updateCoordinates, 100));
            latInput.addEventListener('input', () => setTimeout(updateCoordinates, 100));
        }
        
        if (lngInput) {
            lngInput.addEventListener('change', () => setTimeout(updateCoordinates, 100));
            lngInput.addEventListener('input', () => setTimeout(updateCoordinates, 100));
        }
        
        // Also sync when map is clicked
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            mapContainer.addEventListener('click', () => setTimeout(updateCoordinates, 500));
        }
        
        console.log('✓ Coordinates sync set up');
    }
    
    // 5. ADD FIXED LAYERS TITLE
    function addFixedLayersTitle() {
        console.log('Adding Fixed Layers title...');
        
        const fixedContent = document.querySelector('.fixed-text-content');
        if (!fixedContent || fixedContent.querySelector('h3')) return;
        
        const title = document.createElement('h3');
        title.textContent = 'Fixed Layers';
        title.style.cssText = `
            font-weight: bold !important;
            font-size: 1.15em !important;
            color: #0056b3 !important;
            border-bottom: 1px solid #eee !important;
            padding: 0 15px 10px 15px !important;
            margin-bottom: 15px !important;
            text-align: center !important;
            display: block !important;
        `;
        fixedContent.insertBefore(title, fixedContent.firstChild);
        console.log('✓ Fixed Layers title added');
    }
    
    // 6. FIX COMBINED VIEW OPTIONS STYLING
    function fixCombinedViewOptions() {
        console.log('Fixing Combined View Options styling...');
        
        // Find the Combined View Options section
        const rows = document.querySelectorAll('.settings-row');
        let combinedRow = null;
        
        rows.forEach(row => {
            if (row.textContent.includes('Combined View Options:')) {
                combinedRow = row;
            }
        });
        
        if (!combinedRow) return;
        
        // Apply styling
        const container = combinedRow.querySelector('div[style*="background-color"]');
        if (container) {
            // Center align the entire container
            container.style.cssText = `
                width: 100% !important;
                padding: 10px !important;
                background-color: #f8f9fa !important;
                border-radius: 5px !important;
                text-align: center !important;
            `;
            
            // Fix title
            const title = container.querySelector('div:first-child');
            if (title) {
                title.style.cssText = `
                    font-weight: bold !important;
                    font-size: 1.15em !important;
                    color: #0056b3 !important;
                    border-bottom: 1px solid #eee !important;
                    padding-bottom: 10px !important;
                    margin-bottom: 15px !important;
                    text-align: center !important;
                    width: 100% !important;
                `;
            }
            
            // Center align the slider row
            const sliderRow = container.querySelector('div:has(#circle-overlap-percent)');
            if (sliderRow) {
                sliderRow.style.cssText = `
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    width: 100% !important;
                    margin-bottom: 10px !important;
                `;
            }
            
            // Fix slider width
            const slider = document.getElementById('circle-overlap-percent');
            if (slider) {
                slider.style.cssText = `
                    width: 200px !important;
                    max-width: 200px !important;
                `;
                slider.value = '10';
                
                const value = document.getElementById('overlap-value');
                if (value) value.textContent = '10%';
                
                // Update the global setting
                if (window.combinedViewSettings) {
                    window.combinedViewSettings.overlapPercent = 10;
                }
            }
            
            // Center align the map order row
            const mapOrderRow = container.querySelector('div:has(input[name="map-order"])');
            if (mapOrderRow) {
                mapOrderRow.style.cssText = `
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    width: 100% !important;
                    gap: 20px !important;
                `;
            }
        }
        
        console.log('✓ Combined View Options styled');
    }
    
    // 7. FIX CANVAS ORIENTATIONS FOR COMBINED VIEWS
    function fixCanvasOrientations() {
        console.log('Fixing canvas orientations for combined views...');
        
        // Fix canvas height first to prevent tall canvas
        const canvas = document.getElementById('star-map-canvas');
        if (canvas) {
            canvas.style.height = 'auto';
            canvas.style.maxHeight = '600px';
        }
        
        // Fix LANDSCAPE button
        const landscapeBtn = document.getElementById('view-star-street-landscape-btn');
        if (landscapeBtn) {
            const originalHandler = landscapeBtn.onclick;
            landscapeBtn.onclick = function(e) {
                console.log('Combined (Landscape) button clicked');
                
                // Call original handler first
                if (originalHandler) {
                    originalHandler.call(this, e);
                } else if (window.viewStarStreetLandscape) {
                    window.viewStarStreetLandscape();
                }
                
                // Ensure landscape orientation after a delay
                setTimeout(() => {
                    const canvas = document.getElementById('star-map-canvas');
                    if (canvas) {
                        // For landscape, width should be greater than height
                        let width = 3300;
                        let height = 2550;
                        
                        canvas.width = width;
                        canvas.height = height;
                        
                        // Fix display style
                        canvas.style.height = 'auto';
                        canvas.style.maxHeight = '600px';
                        canvas.style.width = 'auto';
                        canvas.style.maxWidth = '100%';
                        
                        console.log('Canvas set to landscape:', width + 'x' + height);
                    }
                }, 200);
            };
        }
        
        // Fix PORTRAIT button
        const portraitBtn = document.getElementById('view-star-street-portrait-btn');
        if (portraitBtn) {
            const originalHandler = portraitBtn.onclick;
            portraitBtn.onclick = function(e) {
                console.log('Combined (Portrait) button clicked');
                
                // Call original handler first
                if (originalHandler) {
                    originalHandler.call(this, e);
                } else if (window.viewStarStreetPortrait) {
                    window.viewStarStreetPortrait();
                }
                
                // Ensure portrait orientation after a delay
                setTimeout(() => {
                    const canvas = document.getElementById('star-map-canvas');
                    if (canvas) {
                        // For portrait, height should be greater than width
                        let width = 2550;
                        let height = 3300;
                        
                        canvas.width = width;
                        canvas.height = height;
                        
                        // Fix display style
                        canvas.style.height = 'auto';
                        canvas.style.maxHeight = '600px';
                        canvas.style.width = 'auto';
                        canvas.style.maxWidth = '100%';
                        
                        console.log('Canvas set to portrait:', width + 'x' + height);
                    }
                }, 200);
            };
        }
        
        console.log('✓ Canvas orientations fixed');
    }
    
    // 8. FIX CANVAS HEIGHT
    function fixCanvasHeight() {
        console.log('Fixing canvas height...');
        
        const canvas = document.getElementById('star-map-canvas');
        if (canvas) {
            // Set reasonable display dimensions
            canvas.style.height = 'auto';
            canvas.style.maxHeight = '600px';
            canvas.style.width = 'auto';
            canvas.style.maxWidth = '100%';
            
            console.log('✓ Canvas height fixed');
        }
    }
    
    // Initialize everything
    function initialize() {
        console.log('Initializing Absolute Final Fix...');
        
        // Run all fixes
        fixFixedLayersFontSizes(); // Added this first
        forceAddZoomSlider();
        fixTimeDisplay();
        syncCoordinatesDisplay();
        addFixedLayersTitle();
        fixCombinedViewOptions();
        fixCanvasOrientations();
        fixCanvasHeight();
        
        console.log('✓ All fixes applied');
        
        // Keep checking for issues
        const interval = setInterval(() => {
            // Check for font size dropdowns
            if (!document.getElementById('fixed-font-size-date') || !document.getElementById('fixed-font-size-coords')) {
                fixFixedLayersFontSizes();
            }
            
            // Check for zoom slider
            if (!document.getElementById('zoom-slider')) {
                forceAddZoomSlider();
            }
            
            // Check for coordinates
            const fixedCoordsValue = document.getElementById('fixed-coords-value');
            const latLongDisplay = document.getElementById('latLongDisplay');
            
            if (fixedCoordsValue && latLongDisplay && 
                fixedCoordsValue.textContent !== latLongDisplay.textContent &&
                latLongDisplay.textContent !== 'Lat: ... | Long: ...') {
                syncCoordinatesDisplay();
            }
            
            // Check canvas height
            const canvas = document.getElementById('star-map-canvas');
            if (canvas && (!canvas.style.maxHeight || canvas.style.maxHeight === '')) {
                fixCanvasHeight();
            }
        }, 2000);
    }
    
    // Start immediately
    initialize();
    
    // Also run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    }
    
    // And on window load
    window.addEventListener('load', () => {
        setTimeout(initialize, 500);
    });
})();

/* END OF CODE - Cline - 2025-05-26 09:29 File: js/absolute-final-fix.js */
