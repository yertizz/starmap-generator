/* Absolute Final Fix - Direct DOM manipulation to fix all issues */
/* START OF CODE - Cline - 2025-05-26 19:38 File: js/absolute-final-fix.js */

(function() {
    console.log('Absolute Final Fix starting...');
    
    // 1. SYNC DATE AND COORDINATES TO FIXED LAYERS
    function syncDateAndCoordinates() {
        console.log('Syncing date and coordinates to Fixed Layers...');
        
        // Sync Date
        function updateDateDisplay() {
            const dateInput = document.getElementById('date');
            const timeInput = document.getElementById('time');
            const showTimeToggle = document.getElementById('show-time-toggle');
            
            if (!dateInput || !timeInput) return;
            
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
            
            console.log('✓ Date display updated:', displayText);
        }
        
        // Sync Coordinates
        function updateCoordinates() {
            const latLongDisplay = document.getElementById('latLongDisplay');
            if (!latLongDisplay) return;
            
            const coordsText = latLongDisplay.textContent.trim();
            if (!coordsText || coordsText === 'Lat: ... | Long: ...') return;
            
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
            
            console.log('✓ Coordinates updated:', coordsText);
        }
        
        // Initial updates
        updateDateDisplay();
        updateCoordinates();
        
        // Set up event listeners for date/time changes
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const showTimeToggle = document.getElementById('show-time-toggle');
        
        if (dateInput) {
            dateInput.addEventListener('change', updateDateDisplay);
        }
        
        if (timeInput) {
            timeInput.addEventListener('change', updateDateDisplay);
        }
        
        if (showTimeToggle) {
            showTimeToggle.addEventListener('change', updateDateDisplay);
        }
        
        // Set up event listeners for coordinate changes
        const latInput = document.getElementById('latitude');
        const lngInput = document.getElementById('longitude');
        
        if (latInput) {
            latInput.addEventListener('change', updateCoordinates);
            latInput.addEventListener('input', updateCoordinates);
        }
        
        if (lngInput) {
            lngInput.addEventListener('change', updateCoordinates);
            lngInput.addEventListener('input', updateCoordinates);
        }
        
        // Also sync when map is clicked
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            mapContainer.addEventListener('click', () => setTimeout(updateCoordinates, 500));
        }
        
        // Watch for changes to latLongDisplay
        const observer = new MutationObserver(updateCoordinates);
        if (latLongDisplay) {
            observer.observe(latLongDisplay, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
        
        console.log('✓ Date and coordinates sync set up');
    }
    
    // 2. FIX FONT SIZE DROPDOWNS IN FIXED LAYERS - ULTRA SIMPLE APPROACH
    function fixFixedLayersFontSizes() {
        console.log('Fixing Fixed Layers font size dropdowns with ultra simple approach...');
        
        // Remove any existing font size dropdown for date
        const existingDateFontSize = document.getElementById('fixed-font-size-date');
        if (existingDateFontSize) {
            existingDateFontSize.remove();
        }
        
        // Create a completely new dropdown with only 72px selected
        const dateFontFamily = document.getElementById('fixed-font-family-date');
        if (dateFontFamily) {
            // Create the select element
            const select = document.createElement('select');
            select.id = 'fixed-font-size-date';
            select.className = 'font-size-select';
            select.style.cssText = 'width: 70px !important; min-width: 70px !important; margin-left: 5px !important;';
            
            // Add options with 72px first and selected
            const sizes = ['72px', '8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '48px', '56px', '64px', '80px', '96px', '112px', '128px'];
            
            sizes.forEach((size, index) => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                if (index === 0) { // First option (72px) is selected
                    option.selected = true;
                }
                select.appendChild(option);
            });
            
            // Insert the new dropdown
            dateFontFamily.parentNode.insertBefore(select, dateFontFamily.nextSibling);
            console.log('✓ Created new date font size dropdown with 72px selected');
        }
        
        // Fix Coordinates font size dropdown - same approach as date
        // Remove any existing font size dropdown for coordinates
        const existingCoordsFontSize = document.getElementById('fixed-font-size-coords');
        if (existingCoordsFontSize) {
            existingCoordsFontSize.remove();
        }
        
        // Create a completely new dropdown with 14px selected
        const coordsFontFamily = document.getElementById('fixed-font-family-coords');
        if (coordsFontFamily) {
            // Create the select element
            const select = document.createElement('select');
            select.id = 'fixed-font-size-coords';
            select.className = 'font-size-select';
            select.style.cssText = 'width: 70px !important; min-width: 70px !important; margin-left: 5px !important;';
            
            // Add options with 72px first and selected (same as date)
            const sizes = ['72px', '8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '48px', '56px', '64px', '80px', '96px', '112px', '128px'];
            
            sizes.forEach((size, index) => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                if (index === 0) { // First option (72px) is selected
                    option.selected = true;
                }
                select.appendChild(option);
            });
            
            // Insert the new dropdown
            coordsFontFamily.parentNode.insertBefore(select, coordsFontFamily.nextSibling);
            console.log('✓ Created new coordinates font size dropdown with 72px selected');
        }
    }
    
    // 3. ADD FIXED LAYERS TITLE
    function addFixedLayersTitle() {
        console.log('Adding Fixed Layers title...');
        
        const fixedContent = document.querySelector('.fixed-text-content');
        if (!fixedContent) return;
        
        // Remove existing title if present
        const existingTitle = fixedContent.querySelector('h3');
        if (existingTitle) {
            existingTitle.remove();
        }
        
        // Create new title
        const title = document.createElement('h3');
        title.textContent = 'Fixed Layers';
        title.style.cssText = `
            font-weight: bold !important;
            font-size: 1.15em !important;
            color: #0056b3 !important;
            padding: 0 !important;
            margin-bottom: 5px !important;
            text-align: center !important;
            display: block !important;
            border-bottom: none !important;
        `;
        
        // Insert at the beginning of the fixed content
        fixedContent.insertBefore(title, fixedContent.firstChild);
        console.log('✓ Fixed Layers title added');
    }
    
    // 4. FIX COMBINED VIEW OPTIONS STYLING AND REMOVE ADVANCED OPTIONS BUTTON
    function fixCombinedViewOptions() {
        console.log('Fixing Combined View Options styling and removing Advanced Options button...');
        
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
                
                // Fix slider width - make it narrower
                const slider = document.getElementById('circle-overlap-percent');
                if (slider) {
                    slider.style.cssText = `
                        width: 100px !important;
                        max-width: 100px !important;
                    `;
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
        
        // ULTRA AGGRESSIVE APPROACH TO REMOVE ADVANCED OPTIONS BUTTON
        function removeAdvancedOptionsButton() {
            console.log('ULTRA AGGRESSIVE: Removing Advanced Options button from Combined View section');
            
            // 1. Find all buttons in the document
            const allButtons = document.querySelectorAll('button');
            for (const btn of allButtons) {
                if (btn.textContent && btn.textContent.includes('Advanced Options')) {
                    // Check if this button is in the Combined View section
                    let parent = btn.parentElement;
                    let inCombinedSection = false;
                    
                    while (parent) {
                        if (parent.textContent && parent.textContent.includes('Combined View Options:')) {
                            inCombinedSection = true;
                            break;
                        }
                        parent = parent.parentElement;
                    }
                    
                    if (inCombinedSection) {
                        console.log('Found and removing Advanced Options button in Combined View section');
                        btn.remove();
                        return true;
                    }
                }
            }
            
            // 2. Try to find by direct selector - the button after the "These settings apply to..." text
            const infoText = document.querySelector('div:contains("These settings apply to Combined [Landscape] & Combined [Portrait] views ONLY!")');
            if (infoText) {
                const nextElement = infoText.nextElementSibling;
                if (nextElement && nextElement.textContent && nextElement.textContent.includes('Advanced Options')) {
                    console.log('Found and removing Advanced Options button after info text');
                    nextElement.remove();
                    return true;
                }
            }
            
            // 3. Try to find by direct DOM traversal
            const combinedViewHeader = document.querySelector('div:contains("Combined View Options:")');
            if (combinedViewHeader) {
                const combinedViewSection = combinedViewHeader.closest('.settings-row');
                if (combinedViewSection) {
                    // Find all elements in this section
                    const elements = combinedViewSection.querySelectorAll('*');
                    for (const el of elements) {
                        if (el.textContent && el.textContent.trim() === 'Advanced Options') {
                            console.log('Found and removing Advanced Options element by traversal');
                            el.remove();
                            return true;
                        }
                    }
                }
            }
            
            // 4. Try to find by direct DOM position - at the bottom of the Combined View section
            const combinedViewSections = document.querySelectorAll('.settings-row');
            for (const section of combinedViewSections) {
                if (section.textContent.includes('Combined View Options:')) {
                    // Get all direct children
                    const children = Array.from(section.querySelectorAll(':scope > div > *'));
                    // Check the last few elements
                    const lastElements = children.slice(-5);
                    for (const el of lastElements) {
                        if (el.textContent && el.textContent.includes('Advanced Options')) {
                            console.log('Found and removing Advanced Options at bottom of section');
                            el.remove();
                            return true;
                        }
                    }
                }
            }
            
            return false;
        }
        
        // Run the removal function immediately
        removeAdvancedOptionsButton();
        
        // Also run it after a delay to catch any dynamically added buttons
        setTimeout(removeAdvancedOptionsButton, 500);
        setTimeout(removeAdvancedOptionsButton, 1000);
        
        console.log('✓ Combined View Options styled and Advanced Options button removal attempted');
    }
    
    // 5. FORCE ADD ZOOM SLIDER (SINGLE INSTANCE)
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
        
        // Create zoom slider with the exact styling from the HTML
        const zoomDiv = document.createElement('div');
        zoomDiv.id = 'zoom-container';
        zoomDiv.className = 'zoom-section';
        zoomDiv.style.cssText = `
            background-color: #e8e8e8 !important;
            padding: 10px 20px !important;
            margin: 10px 0 !important;
            border-radius: 5px !important;
            border: 1px solid #ccc !important;
        `;
        
        zoomDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; justify-content: center;">
                <label style="font-weight: bold; font-size: 16px; color: #333;">Zoom:</label>
                <input type="range" id="zoom-slider" min="10" max="200" value="100" 
                       style="-webkit-appearance: none !important;
                              appearance: none !important;
                              width: 100% !important;
                              height: 6px !important;
                              background: #d3d3d3 !important;
                              outline: none !important;
                              opacity: 0.9 !important;
                              transition: opacity 0.2s !important;
                              cursor: pointer !important;
                              border-radius: 3px !important;
                              flex: 1; 
                              max-width: 400px;">
                <span id="zoom-value" style="font-weight: bold !important;
                                            color: #333 !important;
                                            min-width: 40px !important;
                                            text-align: right !important;">100</span>
                <span style="font-weight: bold; font-size: 16px;">%</span>
            </div>
        `;
        
        // Insert after image format
        imageFormatRow.parentNode.insertBefore(zoomDiv, imageFormatRow.nextSibling);
        
        // Add functionality - ONLY zoom the star map circles, not the canvas container
        const slider = document.getElementById('zoom-slider');
        const value = document.getElementById('zoom-value');
        
        if (slider && value) {
            slider.addEventListener('input', function() {
                value.textContent = this.value;
                const scale = this.value / 100;
                
                // Find the star map circle elements instead of the canvas
                const starMapCircles = document.querySelectorAll('.star-map-circle, .street-map-circle');
                starMapCircles.forEach(circle => {
                    if (circle) {
                        circle.style.transform = `scale(${scale})`;
                        circle.style.transformOrigin = 'center center';
                        circle.style.transition = 'transform 0.3s ease';
                    }
                });
            });
            
            // Add the webkit slider thumb styling
            const style = document.createElement('style');
            style.textContent = `
                #zoom-slider::-webkit-slider-thumb {
                    -webkit-appearance: none !important;
                    appearance: none !important;
                    width: 20px !important;
                    height: 20px !important;
                    background: #007bff !important;
                    cursor: pointer !important;
                    border-radius: 50% !important;
                    border: 2px solid #fff !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
                }
                
                #zoom-slider::-moz-range-thumb {
                    width: 20px !important;
                    height: 20px !important;
                    background: #007bff !important;
                    cursor: pointer !important;
                    border-radius: 50% !important;
                    border: 2px solid #fff !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
                }
                
                #zoom-slider:hover {
                    opacity: 1 !important;
                }
            `;
            document.head.appendChild(style);
            
            console.log('✓ Zoom slider added successfully!');
        }
    }
    
    // 6. FIX CANVAS ORIENTATIONS FOR COMBINED VIEWS
    function fixCanvasOrientations() {
        console.log('Fixing canvas orientations for combined views...');
        
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
                        // Get paper size dimensions
                        let width, height;
                        const paperSize = document.getElementById('paper-auto-size');
                        
                        if (paperSize && paperSize.value === 'tabloid') {
                            // 11x17" Tabloid
                            width = 3300;  // 11" at 300dpi
                            height = 5100; // 17" at 300dpi
                        } else {
                            // Default to Letter size if not specified
                            width = 2550;  // 8.5" at 300dpi
                            height = 3300; // 11" at 300dpi
                        }
                        
                        // For landscape, ensure width > height
                        if (width < height) {
                            [width, height] = [height, width];
                        }
                        
                        // Set canvas dimensions
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
                        // Get paper size dimensions
                        let width, height;
                        const paperSize = document.getElementById('paper-auto-size');
                        
                        if (paperSize && paperSize.value === 'tabloid') {
                            // 11x17" Tabloid
                            width = 3300;  // 11" at 300dpi
                            height = 5100; // 17" at 300dpi
                        } else {
                            // Default to Letter size if not specified
                            width = 2550;  // 8.5" at 300dpi
                            height = 3300; // 11" at 300dpi
                        }
                        
                        // For portrait, ensure height > width
                        if (height < width) {
                            [width, height] = [height, width];
                        }
                        
                        // Set canvas dimensions
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
    
    // 7. FIX CANVAS HEIGHT
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
        syncDateAndCoordinates(); // Added this first to restore date and coordinates
        fixFixedLayersFontSizes();
        addFixedLayersTitle();
        fixCombinedViewOptions();
        forceAddZoomSlider();
        fixCanvasOrientations();
        fixCanvasHeight();
        
        console.log('✓ All fixes applied');
        
        // Keep checking for issues
        const interval = setInterval(() => {
            // Check for date and coordinates
            const fixedDateValue = document.getElementById('fixed-date-value');
            const fixedCoordsValue = document.getElementById('fixed-coords-value');
            
            if (!fixedDateValue || !fixedDateValue.textContent.trim() || 
                !fixedCoordsValue || !fixedCoordsValue.textContent.trim()) {
                syncDateAndCoordinates();
            }
            
            // Check for font size dropdowns
            const dateFontSize = document.getElementById('fixed-font-size-date');
            const coordsFontSize = document.getElementById('fixed-font-size-coords');
            
            if (!dateFontSize || dateFontSize.value !== '72px' || 
                !coordsFontSize || coordsFontSize.value !== '72px') {
                // If either is missing or not set correctly, recreate both
                fixFixedLayersFontSizes();
            }
            
            // Check for Fixed Layers title
            const fixedContent = document.querySelector('.fixed-text-content');
            const fixedLayersTitle = fixedContent ? fixedContent.querySelector('h3') : null;
            if (!fixedLayersTitle || fixedLayersTitle.textContent !== 'Fixed Layers') {
                addFixedLayersTitle();
            }
            
            // Check for Combined View Options styling
            const combinedViewContainer = document.querySelector('div[style*="background-color"]:has(div:contains("Combined View Options:"))');
            if (combinedViewContainer && !combinedViewContainer.style.textAlign.includes('center')) {
                fixCombinedViewOptions();
            }
            
            // Check for zoom slider
            if (!document.getElementById('zoom-slider')) {
                forceAddZoomSlider();
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

/* END OF CODE - Cline - 2025-05-26 19:38 File: js/absolute-final-fix.js */
