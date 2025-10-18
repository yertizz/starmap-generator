/* Absolute Final Fix - Direct DOM manipulation to fix all issues */
/* START OF CODE - Cline - 2025-05-29 10:18 PM PH File: js/absolute-final-fix.js */

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
            // Find the slider row by looking for the circle-overlap-percent element
            let sliderRow = null;
            const allDivs = container.querySelectorAll('div');
            for (const div of allDivs) {
                if (div.querySelector('#circle-overlap-percent')) {
                    sliderRow = div;
                    break;
                }
            }
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
            
            // Center align the map order row AND FORCE IT TO A NEW LINE
            // Find the map order row by looking for input with name="map-order"
            let mapOrderRow = null;
            const allDivs2 = container.querySelectorAll('div');
            for (const div of allDivs2) {
                if (div.querySelector('input[name="map-order"]')) {
                    mapOrderRow = div;
                    break;
                }
            }
            if (mapOrderRow) {
                // CRITICAL FIX: Force Map Order to its own line with display: block
                mapOrderRow.style.cssText = `
                    display: block !important;
                    width: 100% !important;
                    margin-top: 20px !important;
                    padding-top: 10px !important;
                    border-top: 1px solid #eee !important;
                    clear: both !important;
                    float: none !important;
                `;
                
                // Style the inner content for center alignment
                const innerContent = mapOrderRow.querySelector('div');
                if (innerContent) {
                    innerContent.style.cssText = `
                        display: flex !important;
                        justify-content: center !important;
                        align-items: center !important;
                        width: 100% !important;
                        gap: 20px !important;
                    `;
                }
                
                console.log('CRITICAL FIX: Forced Map Order to its own line');
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
            
            // 2. Try to find by text content - the button after the "These settings apply to..." text
            const allDivs = document.querySelectorAll('div');
            let infoText = null;
            for (const div of allDivs) {
                if (div.textContent && div.textContent.includes("These settings apply to Combined [Landscape] & Combined [Portrait] views ONLY!")) {
                    infoText = div;
                    break;
                }
            }
            if (infoText) {
                const nextElement = infoText.nextElementSibling;
                if (nextElement && nextElement.textContent && nextElement.textContent.includes('Advanced Options')) {
                    console.log('Found and removing Advanced Options button after info text');
                    nextElement.remove();
                    return true;
                }
            }
            
            // 3. Try to find by direct DOM traversal
            let combinedViewHeader = null;
            for (const div of allDivs) {
                if (div.textContent && div.textContent.includes("Combined View Options:")) {
                    combinedViewHeader = div;
                    break;
                }
            }
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
    
    // ENSURE CIRCLE FIX DEPENDENCIES
    function ensureCircleFixDependencies() {
        console.log('Ensuring circle fix dependencies are available...');
        
        // Check if PerfectCircleCalculator is available
        if (!window.PerfectCircleCalculator) {
            console.log('Creating PerfectCircleCalculator...');
            
            // Define PerfectCircleCalculator if it doesn't exist
            window.PerfectCircleCalculator = {
                calculatePerfectCircle: function(canvasWidth, canvasHeight, radiusPercent) {
                    console.log('Using enhanced calculatePerfectCircle function');
                    
                    // Calculate the maximum possible diameter based on the smaller dimension
                    // This ensures the circle is perfectly round, not an ellipse
                    const maxDiameter = Math.min(canvasWidth, canvasHeight);
                    
                    // Apply the radius percentage
                    const diameter = maxDiameter * (radiusPercent / 100);
                    const radius = diameter / 2;
                    
                    // Center position
                    const centerX = canvasWidth / 2;
                    const centerY = canvasHeight / 2;
                    
                    // Force the circle to be perfectly round by setting equal width and height
                    const circle = {
                        centerX: centerX,
                        centerY: centerY,
                        radius: radius,
                        diameter: diameter,
                        // Add additional properties to ensure perfect circles
                        width: diameter,
                        height: diameter,
                        aspectRatio: 1,
                        isCircle: true
                    };
                    
                    console.log('Created perfect circle with radius:', radius);
                    
                    return circle;
                },
                
                calculateLandscapeCircles: function(canvasWidth, canvasHeight, radiusPercent, overlap = 20) {
                    // Available space (with margins)
                    const margin = 0.1; // 10% margin
                    const availableWidth = canvasWidth * (1 - margin);
                    const availableHeight = canvasHeight * (1 - margin);
                    
                    // Calculate maximum diameter for each circle
                    const overlapFactor = 1 - (overlap / 100);
                    const maxDiameter = Math.min(
                        availableWidth / (1 + overlapFactor),
                        availableHeight
                    );
                    
                    const diameter = maxDiameter * (radiusPercent / 100);
                    const radius = diameter / 2;
                    
                    // Calculate positions
                    const spacing = diameter * overlapFactor;
                    const totalWidth = diameter + spacing;
                    const startX = (canvasWidth - totalWidth) / 2;
                    const centerY = canvasHeight / 2;
                    
                    return {
                        left: {
                            centerX: startX + radius,
                            centerY: centerY,
                            radius: radius,
                            diameter: diameter
                        },
                        right: {
                            centerX: startX + radius + spacing,
                            centerY: centerY,
                            radius: radius,
                            diameter: diameter
                        }
                    };
                },
                
                calculatePortraitCircles: function(canvasWidth, canvasHeight, radiusPercent, overlap = 20) {
                    // Available space (with margins)
                    const margin = 0.1; // 10% margin
                    const availableWidth = canvasWidth * (1 - margin);
                    const availableHeight = canvasHeight * (1 - margin);
                    
                    // Calculate maximum diameter for each circle
                    const overlapFactor = 1 - (overlap / 100);
                    const maxDiameter = Math.min(
                        availableWidth,
                        availableHeight / (1 + overlapFactor)
                    );
                    
                    const diameter = maxDiameter * (radiusPercent / 100);
                    const radius = diameter / 2;
                    
                    // Calculate positions
                    const spacing = diameter * overlapFactor;
                    const totalHeight = diameter + spacing;
                    const startY = (canvasHeight - totalHeight) / 2;
                    const centerX = canvasWidth / 2;
                    
                    return {
                        top: {
                            centerX: centerX,
                            centerY: startY + radius,
                            radius: radius,
                            diameter: diameter
                        },
                        bottom: {
                            centerX: centerX,
                            centerY: startY + radius + spacing,
                            radius: radius,
                            diameter: diameter
                        }
                    };
                }
            };
            
            console.log('✓ PerfectCircleCalculator created');
        }
        
        // Check if CanvasDrawingUtils is available
        if (!window.CanvasDrawingUtils) {
            console.log('Creating CanvasDrawingUtils...');
            
            // Define CanvasDrawingUtils if it doesn't exist
            window.CanvasDrawingUtils = {
                drawCircleBorder: function(ctx, circle, borderWidth, borderColor) {
                    if (borderWidth > 0) {
                        ctx.save();
                        ctx.strokeStyle = borderColor;
                        ctx.lineWidth = borderWidth;
                        ctx.beginPath();
                        ctx.arc(circle.centerX, circle.centerY, circle.radius, 0, Math.PI * 2);
                        ctx.stroke();
                        ctx.restore();
                    }
                },
                
                createCircularClip: function(ctx, circle) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(circle.centerX, circle.centerY, circle.radius, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();
                },
                
                clearCanvas: function(ctx, width, height, bgColor) {
                    ctx.save();
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, width, height);
                    ctx.restore();
                }
            };
            
            console.log('✓ CanvasDrawingUtils created');
        }
        
        console.log('✓ Circle fix dependencies ensured');
    }
    
    // 6. FIX CANVAS ORIENTATIONS FOR COMBINED VIEWS AND ENSURE PERFECT CIRCLES
    function fixCanvasOrientations() {
        console.log('Fixing canvas orientations for combined views and ensuring perfect circles...');
        
        // Ensure PerfectCircleCalculator and CanvasDrawingUtils are available
        ensureCircleFixDependencies();
        
        // Add CSS to ensure perfect circles
        const style = document.createElement('style');
        style.textContent = `
            /* Force circles to be perfectly round */
            .star-map-circle, .street-map-circle {
                border-radius: 50% !important;
                aspect-ratio: 1 / 1 !important;
                overflow: hidden !important;
            }
            
            /* Ensure canvas maintains aspect ratio */
            #star-map-canvas {
                display: block !important;
                margin: 0 auto !important;
            }
        `;
        document.head.appendChild(style);
        console.log('✓ Added CSS to ensure perfect circles');
        
        // Fix LANDSCAPE button - DISABLED TO PREVENT FUNCTION HOOKING
        const landscapeBtn = document.getElementById('view-star-street-landscape-btn');
        if (false && landscapeBtn) {
            const originalHandler = landscapeBtn.onclick;
            landscapeBtn.onclick = function(e) {
                console.log('Combined (Landscape) button clicked');
                
                // Call original handler first
                if (originalHandler) {
                    originalHandler.call(this, e);
                } else if (window.viewStarStreetLandscape) {
                    window.viewStarStreetLandscape();
                }
                
                // Fix combined view after a delay
                setTimeout(() => {
                    const canvas = document.getElementById('star-map-canvas');
                    if (!canvas) return;
                    
                    // Get user-specified dimensions
                    let width, height;
                    const widthInput = document.getElementById('width');
                    const heightInput = document.getElementById('height');
                    
                    if (widthInput && heightInput && widthInput.value && heightInput.value) {
                        // Use user-specified dimensions
                        width = parseInt(widthInput.value);
                        height = parseInt(heightInput.value);
                        console.log('Using user-specified dimensions:', width, 'x', height);
                    } else {
                        // Fallback to paper size dimensions if user dimensions not available
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
                    canvas.style.maxHeight = '70vh';
                    canvas.style.width = 'auto';
                    canvas.style.maxWidth = '100%';
                    canvas.style.objectFit = 'contain';
                    canvas.style.display = 'block';
                    canvas.style.margin = '0 auto';
                    
                    // Fix the canvas container
                    const canvasContainer = document.querySelector('.canvas-container');
                    if (canvasContainer) {
                        canvasContainer.style.height = 'auto';
                        canvasContainer.style.minHeight = 'auto';
                        canvasContainer.style.maxHeight = '80vh';
                        canvasContainer.style.overflow = 'hidden';
                        canvasContainer.style.paddingBottom = '20px';
                        canvasContainer.style.display = 'flex';
                        canvasContainer.style.flexDirection = 'column';
                        canvasContainer.style.alignItems = 'center';
                        canvasContainer.style.justifyContent = 'center';
                    }
                    
                    // Force circles to be perfectly round
                    const circles = document.querySelectorAll('.star-map-circle, .street-map-circle');
                    circles.forEach(circle => {
                        circle.style.width = circle.offsetHeight + 'px';
                        circle.style.height = circle.offsetHeight + 'px';
                        circle.style.borderRadius = '50%';
                        circle.style.overflow = 'hidden';
                        circle.style.display = 'flex';
                        circle.style.alignItems = 'center';
                        circle.style.justifyContent = 'center';
                    });
                    
                    console.log('Canvas set to landscape:', width + 'x' + height);
                    
                    // Fix Google Maps in combined view
                    fixGoogleMapsInCombinedView('landscape');
                }, 200);
            };
        }
        
        // Fix PORTRAIT button - DISABLED TO PREVENT FUNCTION HOOKING
        const portraitBtn = document.getElementById('view-star-street-portrait-btn');
        if (false && portraitBtn) {
            const originalHandler = portraitBtn.onclick;
            portraitBtn.onclick = function(e) {
                console.log('Combined (Portrait) button clicked');
                
                // Call original handler first
                if (originalHandler) {
                    originalHandler.call(this, e);
                } else if (window.viewStarStreetPortrait) {
                    window.viewStarStreetPortrait();
                }
                
                // Fix combined view after a delay
                setTimeout(() => {
                    const canvas = document.getElementById('star-map-canvas');
                    if (!canvas) return;
                    
                    // Get user-specified dimensions
                    let width, height;
                    const widthInput = document.getElementById('width');
                    const heightInput = document.getElementById('height');
                    
                    if (widthInput && heightInput && widthInput.value && heightInput.value) {
                        // Use user-specified dimensions
                        width = parseInt(widthInput.value);
                        height = parseInt(heightInput.value);
                        console.log('Using user-specified dimensions:', width, 'x', height);
                    } else {
                        // Fallback to paper size dimensions if user dimensions not available
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
                    canvas.style.maxHeight = '70vh';
                    canvas.style.width = 'auto';
                    canvas.style.maxWidth = '100%';
                    canvas.style.objectFit = 'contain';
                    canvas.style.display = 'block';
                    canvas.style.margin = '0 auto';
                    
                    // Fix the canvas container
                    const canvasContainer = document.querySelector('.canvas-container');
                    if (canvasContainer) {
                        canvasContainer.style.height = 'auto';
                        canvasContainer.style.minHeight = 'auto';
                        canvasContainer.style.maxHeight = '80vh';
                        canvasContainer.style.overflow = 'hidden';
                        canvasContainer.style.paddingBottom = '20px';
                        canvasContainer.style.display = 'flex';
                        canvasContainer.style.flexDirection = 'column';
                        canvasContainer.style.alignItems = 'center';
                        canvasContainer.style.justifyContent = 'center';
                    }
                    
                    // Force circles to be perfectly round
                    const circles = document.querySelectorAll('.star-map-circle, .street-map-circle');
                    circles.forEach(circle => {
                        circle.style.width = circle.offsetHeight + 'px';
                        circle.style.height = circle.offsetHeight + 'px';
                        circle.style.borderRadius = '50%';
                        circle.style.overflow = 'hidden';
                        circle.style.display = 'flex';
                        circle.style.alignItems = 'center';
                        circle.style.justifyContent = 'center';
                    });
                    
                    console.log('Canvas set to portrait:', width + 'x' + height);
                    
                    // Fix Google Maps in combined view
                    fixGoogleMapsInCombinedView('portrait');
                }, 200);
            };
        }
        
        // Function to fix Google Maps in combined views
        function fixGoogleMapsInCombinedView(viewType) {
            console.log(`Fixing Google Maps in combined ${viewType} view`);
            
            // First, ensure the canvas has the correct background color
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            // Get the background color from the settings
            const bgColor = document.getElementById('bg-color-canvas')?.value || '#1D1D4D';
            
            // Clear the canvas with the background color
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Get coordinates
            const latString = document.getElementById('latitude').value;
            const lngString = document.getElementById('longitude').value;
            let lat, lng;
            
            if (typeof parseFormattedCoordinate === 'function') {
                lat = parseFormattedCoordinate(latString, 'latitude');
                lng = parseFormattedCoordinate(lngString, 'longitude');
            } else {
                lat = parseFloat(latString);
                lng = parseFloat(lngString);
            }
            
            if (isNaN(lat) || isNaN(lng)) {
                console.log('Invalid coordinates, using defaults');
                lat = 39.8333;
                lng = -98.5855;
            }
            
            // Get settings
            const radiusPercent = parseInt(document.getElementById('circle-radius-percent')?.value) || 60;
            const borderWidth = parseInt(document.getElementById('border-width')?.value) || 2;
            const borderColor = document.getElementById('border-color')?.value || '#FDCA0D';
            const overlapPercent = window.combinedViewSettings?.overlapPercent || 30;
            const streetMapFirst = window.combinedViewSettings?.streetMapFirst !== false;
            
            // Calculate circle positions with proper spacing
            let circles;
            if (viewType === 'landscape') {
                // For landscape, ensure width > height
                if (canvas.width < canvas.height) {
                    const temp = canvas.width;
                    canvas.width = canvas.height;
                    canvas.height = temp;
                    console.log('Swapped canvas dimensions for landscape view:', canvas.width, 'x', canvas.height);
                }
                
                // Calculate positions with less overlap
                const adjustedOverlap = Math.min(overlapPercent, 20); // Limit overlap to 20% max
                circles = {
                    left: {
                        centerX: canvas.width * 0.3,
                        centerY: canvas.height * 0.5,
                        radius: Math.min(canvas.width, canvas.height) * 0.3,
                        diameter: Math.min(canvas.width, canvas.height) * 0.6
                    },
                    right: {
                        centerX: canvas.width * 0.7,
                        centerY: canvas.height * 0.5,
                        radius: Math.min(canvas.width, canvas.height) * 0.3,
                        diameter: Math.min(canvas.width, canvas.height) * 0.6
                    }
                };
            } else {
                // For portrait, ensure height > width
                if (canvas.height < canvas.width) {
                    const temp = canvas.width;
                    canvas.width = canvas.height;
                    canvas.height = temp;
                    console.log('Swapped canvas dimensions for portrait view:', canvas.width, 'x', canvas.height);
                }
                
                // Calculate positions with less overlap
                const adjustedOverlap = Math.min(overlapPercent, 20); // Limit overlap to 20% max
                circles = {
                    top: {
                        centerX: canvas.width * 0.5,
                        centerY: canvas.height * 0.3,
                        radius: Math.min(canvas.width, canvas.height) * 0.3,
                        diameter: Math.min(canvas.width, canvas.height) * 0.6
                    },
                    bottom: {
                        centerX: canvas.width * 0.5,
                        centerY: canvas.height * 0.7,
                        radius: Math.min(canvas.width, canvas.height) * 0.3,
                        diameter: Math.min(canvas.width, canvas.height) * 0.6
                    }
                };
            }
            
            // Determine which circle is for the street map and which is for the star map
            let streetMapCircle, starMapCircle;
            if (viewType === 'landscape') {
                streetMapCircle = streetMapFirst ? circles.left : circles.right;
                starMapCircle = streetMapFirst ? circles.right : circles.left;
            } else {
                streetMapCircle = streetMapFirst ? circles.top : circles.bottom;
                starMapCircle = streetMapFirst ? circles.bottom : circles.top;
            }
            
            // Create street map image
            const apiKey = "AIzaSyCpvv1IJYxwGVMh24MLFDH6LmupseApSZU";
            const mapSize = Math.round(streetMapCircle.diameter * 2); // Double size for better quality
            const streetMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=${mapSize}x${mapSize}&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
            
            // Load street map image
            const streetMapImg = new Image();
            streetMapImg.crossOrigin = "Anonymous";
            
            // Get the star map image from the last generated map
            const starMapImg = window.lastGeneratedMapBlob ? 
                URL.createObjectURL(window.lastGeneratedMapBlob) : 
                null;
            
            // Function to draw both maps
            function drawBothMaps() {
                // Clear the canvas with the background color
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw street map
                if (streetMapImg.complete && streetMapImg.naturalWidth > 0) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(streetMapCircle.centerX, streetMapCircle.centerY, streetMapCircle.radius, 0, Math.PI * 2);
                    ctx.clip();
                    ctx.drawImage(streetMapImg, 
                        streetMapCircle.centerX - streetMapCircle.radius, 
                        streetMapCircle.centerY - streetMapCircle.radius, 
                        streetMapCircle.diameter, 
                        streetMapCircle.diameter);
                    ctx.restore();
                    
                    // Draw border
                    ctx.save();
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = borderWidth;
                    ctx.beginPath();
                    ctx.arc(streetMapCircle.centerX, streetMapCircle.centerY, streetMapCircle.radius, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                    
                    console.log('Street map drawn successfully');
                }
                
                // Draw star map if available
                if (window.starMapImage && window.starMapImage.complete && window.starMapImage.naturalWidth > 0) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(starMapCircle.centerX, starMapCircle.centerY, starMapCircle.radius, 0, Math.PI * 2);
                    ctx.clip();
                    ctx.drawImage(window.starMapImage, 
                        starMapCircle.centerX - starMapCircle.radius, 
                        starMapCircle.centerY - starMapCircle.radius, 
                        starMapCircle.diameter, 
                        starMapCircle.diameter);
                    ctx.restore();
                    
                    // Draw border
                    ctx.save();
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = borderWidth;
                    ctx.beginPath();
                    ctx.arc(starMapCircle.centerX, starMapCircle.centerY, starMapCircle.radius, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                    
                    console.log('Star map drawn successfully');
                }
            }
            
            // Load the star map image if not already loaded
            if (!window.starMapImage && window.lastGeneratedMapBlob) {
                window.starMapImage = new Image();
                window.starMapImage.crossOrigin = "Anonymous";
                window.starMapImage.onload = function() {
                    console.log('Star map image loaded');
                    drawBothMaps();
                };
                window.starMapImage.src = URL.createObjectURL(window.lastGeneratedMapBlob);
            }
            
            // When street map loads, draw both maps
            streetMapImg.onload = function() {
                console.log('Street map image loaded');
                drawBothMaps();
            };
            
            // Set the source to load the image
            streetMapImg.src = streetMapUrl;
            
            // Also try again after a delay to ensure it sticks
            setTimeout(drawBothMaps, 500);
            setTimeout(drawBothMaps, 1000);
            setTimeout(drawBothMaps, 2000);
            
            // Fix the canvas container height
            const canvasContainer = document.querySelector('.canvas-container');
            if (canvasContainer) {
                canvasContainer.style.height = 'auto';
                canvasContainer.style.minHeight = 'auto';
                canvasContainer.style.maxHeight = '80vh';
                canvasContainer.style.overflow = 'hidden';
                canvasContainer.style.backgroundColor = '#FFFCE8'; // Keep the pale yellow background
            }
        }
        
        // Fix all view buttons to ensure perfect circles without changing canvas dimensions
        const viewButtons = [
            document.getElementById('view-star-map-btn'),
            document.getElementById('view-street-map-btn'),
            document.getElementById('view-canvas-layout-btn')
        ];
        
        viewButtons.forEach(btn => {
            if (!btn) return;
            
            const originalHandler = btn.onclick;
            btn.onclick = function(e) {
                console.log(btn.id + ' clicked');
                
                // Call original handler first
                if (originalHandler) {
                    originalHandler.call(this, e);
                } else if (window[btn.id.replace('-btn', '').replace(/-/g, '')]) {
                    window[btn.id.replace('-btn', '').replace(/-/g, '')]();
                }
                
                // Ensure circles are perfectly round after a delay
                setTimeout(() => {
                    const canvas = document.getElementById('star-map-canvas');
                    if (!canvas) return;
                    
                    // Respect the canvas dimensions set by the user
                    // but ensure the circles themselves are perfectly round
                    
                    // Fix display style
                    canvas.style.height = 'auto';
                    canvas.style.maxHeight = '600px';
                    canvas.style.width = 'auto';
                    canvas.style.maxWidth = '100%';
                    
                    // Force circles to be perfectly round
                    const circles = document.querySelectorAll('.star-map-circle, .street-map-circle');
                    circles.forEach(circle => {
                        // Make the circle perfectly round while maintaining its size
                        circle.style.borderRadius = '50%';
                        
                        // Ensure the circle container has equal width and height
                        // but don't change the canvas dimensions
                        const parent = circle.parentElement;
                        if (parent) {
                            parent.style.display = 'flex';
                            parent.style.justifyContent = 'center';
                            parent.style.alignItems = 'center';
                        }
                    });
                    
                    console.log('Ensured perfect circles while respecting canvas dimensions:', canvas.width + 'x' + canvas.height);
                }, 200);
            };
        });
        
        console.log('✓ Canvas orientations fixed');
    }
    
    // 7. FIX CANVAS HEIGHT AND CONTAINER
    function fixCanvasHeight() {
        console.log('Fixing canvas height and container...');
        
        // Fix the canvas element
        const canvas = document.getElementById('star-map-canvas');
        if (canvas) {
            // Set reasonable display dimensions
            canvas.style.height = 'auto';
            canvas.style.maxHeight = '70vh'; // Increased from 600px to 70% of viewport height
            canvas.style.width = 'auto';
            canvas.style.maxWidth = '100%';
            canvas.style.objectFit = 'contain';
            canvas.style.display = 'block';
            canvas.style.margin = '0 auto';
            
            // Force the canvas to maintain its aspect ratio
            const aspectRatio = canvas.width / canvas.height;
            if (aspectRatio) {
                canvas.style.aspectRatio = `${aspectRatio}`;
            }
        }
        
        // Fix the canvas container
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            // Set reasonable container dimensions
            canvasContainer.style.height = 'auto';
            canvasContainer.style.minHeight = 'auto';
            canvasContainer.style.maxHeight = '80vh';
            canvasContainer.style.overflow = 'hidden';
            canvasContainer.style.paddingBottom = '20px';
            canvasContainer.style.display = 'flex';
            canvasContainer.style.flexDirection = 'column';
            canvasContainer.style.alignItems = 'center';
            canvasContainer.style.justifyContent = 'center';
            
            // Add a style element with more specific CSS to ensure it overrides other styles
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                .canvas-container {
                    height: auto !important;
                    min-height: auto !important;
                    max-height: 80vh !important;
                    overflow: hidden !important;
                    padding-bottom: 20px !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                
                #star-map-canvas {
                    height: auto !important;
                    max-height: 70vh !important;
                    width: auto !important;
                    max-width: 100% !important;
                    object-fit: contain !important;
                    display: block !important;
                    margin: 0 auto !important;
                }
                
                /* Fix for star map circles */
                .star-map-circle, .street-map-circle {
                    border-radius: 50% !important;
                    overflow: hidden !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
            `;
            document.head.appendChild(styleElement);
            
            console.log('✓ Canvas container fixed');
        }
        
        // Also fix any star map circles
        const starMapCircles = document.querySelectorAll('.star-map-circle, .street-map-circle');
        starMapCircles.forEach(circle => {
            if (circle) {
                circle.style.borderRadius = '50%';
                circle.style.overflow = 'hidden';
                circle.style.display = 'flex';
                circle.style.alignItems = 'center';
                circle.style.justifyContent = 'center';
            }
        });
        
        console.log('✓ Canvas height fixed');
        
        // Set up a periodic check to ensure the canvas stays fixed
        setTimeout(() => {
            if (canvas) {
                // Reapply styles to ensure they stick
                canvas.style.maxHeight = '70vh';
                canvas.style.maxWidth = '100%';
                canvas.style.objectFit = 'contain';
            }
            
            if (canvasContainer) {
                canvasContainer.style.maxHeight = '80vh';
                canvasContainer.style.overflow = 'hidden';
            }
            
            starMapCircles.forEach(circle => {
                if (circle) {
                    circle.style.borderRadius = '50%';
                    circle.style.overflow = 'hidden';
                }
            });
        }, 1000);
    }
    
    // CRITICAL TOOLTIP FIX - Add canvas dimensions tooltip
    function addCanvasTooltip() {
        const canvas = document.getElementById('star-map-canvas');
        if (canvas) {
            const widthInput = document.getElementById('width');
            const heightInput = document.getElementById('height');
            
            if (widthInput && heightInput && widthInput.value && heightInput.value) {
                const width = widthInput.value;
                const height = heightInput.value;
                canvas.title = `Canvas Dimensions: ${width}w x ${height}h`;
                console.log('✓ Canvas tooltip updated:', canvas.title);
            }
        }
    }
    
    // Update tooltip when dimensions change
    function setupTooltipUpdates() {
        const widthInput = document.getElementById('width');
        const heightInput = document.getElementById('height');
        
        if (widthInput) {
            widthInput.addEventListener('change', addCanvasTooltip);
            widthInput.addEventListener('input', addCanvasTooltip);
        }
        
        if (heightInput) {
            heightInput.addEventListener('change', addCanvasTooltip);
            heightInput.addEventListener('input', addCanvasTooltip);
        }
        
        // Initial tooltip
        addCanvasTooltip();
        console.log('✓ Canvas tooltip system initialized');
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
        setupTooltipUpdates(); // Add tooltip functionality
        
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
            // Find the container by iterating through all divs with background-color style
            let combinedViewContainer = null;
            const allDivs = document.querySelectorAll('div[style*="background-color"]');
            for (const div of allDivs) {
                if (div.textContent && div.textContent.includes("Combined View Options:")) {
                    combinedViewContainer = div;
                    break;
                }
            }
            
            if (combinedViewContainer && (!combinedViewContainer.style.textAlign || !combinedViewContainer.style.textAlign.includes('center'))) {
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

/* END OF CODE - Cline - 2025-06-22 16:51 PM PH File: js/absolute-final-fix.js */
