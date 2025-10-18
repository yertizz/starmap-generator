/* Final Working Solution - Fixes ALL issues properly */

(function() {
    console.log('Final Working Solution loading...');
    
    // 1. ADD ZOOM SLIDER if missing
    function ensureZoomSlider() {
        console.log('Ensuring zoom slider exists...');
        
        // Check if zoom slider exists
        if (!document.getElementById('zoom-slider')) {
            // Find where to insert - after the image format radio buttons
            const imageFormatRow = document.querySelector('.image-format-section')?.closest('.settings-row');
            if (imageFormatRow) {
                // Create zoom slider row
                const zoomRow = document.createElement('div');
                zoomRow.className = 'settings-row';
                zoomRow.innerHTML = `
                    <div>
                        <label for="zoom-slider">Zoom:</label>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="range" id="zoom-slider" min="10" max="200" value="100" style="flex: 1;">
                        <span id="zoom-value" style="min-width: 40px; text-align: right;">100</span>
                        <span>%</span>
                    </div>
                `;
                
                // Insert after image format row
                imageFormatRow.parentNode.insertBefore(zoomRow, imageFormatRow.nextSibling);
            }
        }
        
        // Remove duplicates
        const allSliders = document.querySelectorAll('#zoom-slider');
        for (let i = 1; i < allSliders.length; i++) {
            allSliders[i].closest('.settings-row')?.remove();
        }
    }
    
    // 2. FIX ZOOM - Make it actually zoom the star/street map images
    function fixZoomCompletely() {
        console.log('Fixing zoom functionality...');
        
        const zoomSlider = document.getElementById('zoom-slider');
        if (!zoomSlider) return;
        
        // Clone to remove all listeners
        const newSlider = zoomSlider.cloneNode(true);
        zoomSlider.parentNode.replaceChild(newSlider, zoomSlider);
        
        // Add WORKING zoom handler
        newSlider.addEventListener('input', function() {
            const scale = this.value / 100;
            const zoomValue = document.getElementById('zoom-value');
            if (zoomValue) zoomValue.textContent = this.value;
            
            // Apply zoom to the canvas container's transform
            const canvasContainer = document.querySelector('.canvas-container');
            if (canvasContainer) {
                // Find the canvas or image inside
                const canvas = canvasContainer.querySelector('#star-map-canvas');
                if (canvas) {
                    canvas.style.transform = `scale(${scale})`;
                    canvas.style.transformOrigin = 'center center';
                }
                
                // Also apply to any images
                const images = canvasContainer.querySelectorAll('img');
                images.forEach(img => {
                    img.style.transform = `scale(${scale})`;
                    img.style.transformOrigin = 'center center';
                });
            }
            
            console.log('Zoom applied:', this.value + '%');
        });
    }
    
    // 2. FIX DATE DISPLAY - Properly sync dates everywhere
    function fixDateDisplay() {
        console.log('Fixing date display...');
        
        const dateInput = document.getElementById('date');
        if (!dateInput) return;
        
        function updateAllDates() {
            const dateValue = dateInput.value;
            if (!dateValue) return;
            
            // Parse the date correctly (YYYY-MM-DD format)
            const [year, month, day] = dateValue.split('-').map(Number);
            
            // Create proper date string
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
            const formattedDate = `${months[month - 1]} ${day}, ${year}`;
            
            console.log('Updating date to:', formattedDate);
            
            // Update Fixed Layers date
            const fixedDateValue = document.getElementById('fixed-date-value');
            if (fixedDateValue) {
                fixedDateValue.textContent = formattedDate;
                fixedDateValue.innerHTML = formattedDate; // Force update
            }
            
            // Update Text Placements date
            const textPlacementDate = document.getElementById('text-placement-content-date');
            if (textPlacementDate) {
                textPlacementDate.textContent = formattedDate;
                textPlacementDate.innerHTML = formattedDate; // Force update
            }
        }
        
        // Update immediately
        updateAllDates();
        
        // Update on change
        dateInput.addEventListener('change', updateAllDates);
        dateInput.addEventListener('input', updateAllDates);
        
        // Also watch for time changes
        const timeInput = document.getElementById('time');
        if (timeInput) {
            timeInput.addEventListener('change', updateAllDates);
        }
    }
    
    // 3. FIX COORDINATES - Sync coordinates everywhere
    function fixCoordinatesDisplay() {
        console.log('Fixing coordinates display...');
        
        function updateAllCoordinates() {
            const latLongDisplay = document.getElementById('latLongDisplay');
            if (!latLongDisplay) return;
            
            const coordsText = latLongDisplay.textContent.trim();
            if (!coordsText || coordsText === 'Lat: ... | Long: ...') return;
            
            console.log('Updating coordinates to:', coordsText);
            
            // Update Fixed Layers coordinates
            const fixedCoordsValue = document.getElementById('fixed-coords-value');
            if (fixedCoordsValue) {
                fixedCoordsValue.textContent = coordsText;
                fixedCoordsValue.innerHTML = coordsText; // Force update
            }
            
            // Update Text Placements coordinates
            const textPlacementCoords = document.getElementById('text-placement-content-coords');
            if (textPlacementCoords) {
                textPlacementCoords.textContent = coordsText;
                textPlacementCoords.innerHTML = coordsText; // Force update
            }
        }
        
        // Update immediately
        updateAllCoordinates();
        
        // Watch for changes
        const latLongDisplay = document.getElementById('latLongDisplay');
        if (latLongDisplay) {
            const observer = new MutationObserver(updateAllCoordinates);
            observer.observe(latLongDisplay, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
        
        // Also watch coordinate inputs
        ['latitude', 'longitude'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('change', () => setTimeout(updateAllCoordinates, 100));
                input.addEventListener('input', () => setTimeout(updateAllCoordinates, 100));
            }
        });
    }
    
    // 4. FIX FONT SIZE DROPDOWNS
    function fixFontSizeDropdowns() {
        console.log('Fixing font-size dropdowns...');
        
        // Ensure Fixed Layers has font-size dropdowns
        const fixedTextContent = document.querySelector('.fixed-text-content');
        if (!fixedTextContent) return;
        
        const fontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '48px', '56px', '64px', '72px', '80px', '96px', '112px', '128px'];
        
        // Add for date if missing
        if (!document.getElementById('fixed-font-size-date')) {
            const dateFontFamily = document.getElementById('fixed-font-family-date');
            if (dateFontFamily) {
                const select = document.createElement('select');
                select.id = 'fixed-font-size-date';
                select.className = 'font-size-select';
                select.style.width = '70px';
                select.style.marginLeft = '5px';
                
                fontSizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    if (size === '72px') option.selected = true;
                    select.appendChild(option);
                });
                
                dateFontFamily.parentNode.insertBefore(select, dateFontFamily.nextSibling);
            }
        } else {
            // Set to 72px if exists
            const select = document.getElementById('fixed-font-size-date');
            if (select) select.value = '72px';
        }
        
        // Add for coords if missing
        if (!document.getElementById('fixed-font-size-coords')) {
            const coordsFontFamily = document.getElementById('fixed-font-family-coords');
            if (coordsFontFamily) {
                const select = document.createElement('select');
                select.id = 'fixed-font-size-coords';
                select.className = 'font-size-select';
                select.style.width = '70px';
                select.style.marginLeft = '5px';
                
                fontSizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    if (size === '14px') option.selected = true;
                    select.appendChild(option);
                });
                
                coordsFontFamily.parentNode.insertBefore(select, coordsFontFamily.nextSibling);
            }
        }
    }
    
    // 5. ADD FIXED LAYERS TITLE
    function addFixedLayersTitle() {
        console.log('Adding Fixed Layers title...');
        
        const fixedTextContent = document.querySelector('.fixed-text-content');
        if (!fixedTextContent) return;
        
        // Check if title already exists
        if (!fixedTextContent.querySelector('h3')) {
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
            fixedTextContent.insertBefore(title, fixedTextContent.firstChild);
        }
    }
    
    // 6. FIX COMBINED VIEW OPTIONS STYLING
    function fixCombinedViewOptions() {
        console.log('Fixing Combined View Options...');
        
        // Add CSS for proper styling
        if (!document.getElementById('combined-view-fix-styles')) {
            const style = document.createElement('style');
            style.id = 'combined-view-fix-styles';
            style.textContent = `
                /* Combined View Options title styling */
                .settings-row > div:has(div:contains("Combined View Options:")) {
                    text-align: center !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                }
                
                /* Title styling to match other sections */
                .settings-row > div > div:first-child:contains("Combined View Options:") {
                    font-weight: bold !important;
                    font-size: 1.15em !important;
                    color: #0056b3 !important;
                    border-bottom: 1px solid #eee !important;
                    padding: 0 15px 10px 15px !important;
                    margin-bottom: 15px !important;
                    text-align: center !important;
                    width: 100% !important;
                }
                
                /* Center align slider row */
                .settings-row > div > div:has(#circle-overlap-percent) {
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    width: 100% !important;
                    margin-bottom: 10px !important;
                }
                
                /* Slider width - 200px (50% of current) */
                #circle-overlap-percent {
                    width: 200px !important;
                    max-width: 200px !important;
                }
                
                /* Center align map order row */
                .settings-row > div > div:has(input[name="map-order"]) {
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    width: 100% !important;
                    gap: 20px !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Set overlap to 10%
        const overlapSlider = document.getElementById('circle-overlap-percent');
        const overlapValue = document.getElementById('overlap-value');
        if (overlapSlider && overlapValue) {
            overlapSlider.value = '10';
            overlapValue.textContent = '10%';
            if (window.combinedViewSettings) {
                window.combinedViewSettings.overlapPercent = 10;
            }
        }
    }
    
    // 7. FIX CANVAS ORIENTATIONS FOR COMBINED VIEWS
    function fixCanvasOrientations() {
        console.log('Fixing canvas orientations...');
        
        // Fix LANDSCAPE button
        const landscapeBtn = document.getElementById('view-star-street-landscape-btn');
        if (landscapeBtn) {
            const originalLandscapeHandler = landscapeBtn.onclick;
            landscapeBtn.onclick = function(e) {
                console.log('Landscape button clicked');
                
                // Call original handler first
                if (originalLandscapeHandler) {
                    originalLandscapeHandler.call(this, e);
                } else if (window.viewStarStreetLandscape) {
                    window.viewStarStreetLandscape();
                }
                
                // Ensure landscape orientation after a delay
                setTimeout(() => {
                    const canvas = document.getElementById('star-map-canvas');
                    if (canvas) {
                        let width = parseInt(canvas.width) || 3300;
                        let height = parseInt(canvas.height) || 2550;
                        
                        // Ensure landscape (width > height)
                        if (height > width) {
                            [width, height] = [height, width];
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        
                        // Update display style
                        const maxHeight = window.innerHeight * 0.6;
                        const aspectRatio = width / height;
                        
                        if (height > maxHeight) {
                            canvas.style.height = maxHeight + 'px';
                            canvas.style.width = (maxHeight * aspectRatio) + 'px';
                        } else {
                            canvas.style.width = '100%';
                            canvas.style.maxWidth = '100%';
                            canvas.style.height = 'auto';
                        }
                        
                        console.log('Canvas set to landscape:', width + 'x' + height);
                    }
                }, 200);
            };
        }
        
        // Fix PORTRAIT button
        const portraitBtn = document.getElementById('view-star-street-portrait-btn');
        if (portraitBtn) {
            const originalPortraitHandler = portraitBtn.onclick;
            portraitBtn.onclick = function(e) {
                console.log('Portrait button clicked');
                
                // Call original handler first
                if (originalPortraitHandler) {
                    originalPortraitHandler.call(this, e);
                } else if (window.viewStarStreetPortrait) {
                    window.viewStarStreetPortrait();
                }
                
                // Ensure portrait orientation after a delay
                setTimeout(() => {
                    const canvas = document.getElementById('star-map-canvas');
                    if (canvas) {
                        let width = parseInt(canvas.width) || 2550;
                        let height = parseInt(canvas.height) || 3300;
                        
                        // Ensure portrait (height > width)
                        if (width > height) {
                            [width, height] = [height, width];
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        
                        // Update display style
                        const maxHeight = window.innerHeight * 0.6;
                        const aspectRatio = width / height;
                        
                        if (height > maxHeight) {
                            canvas.style.height = maxHeight + 'px';
                            canvas.style.width = (maxHeight * aspectRatio) + 'px';
                        } else {
                            canvas.style.width = '100%';
                            canvas.style.maxWidth = '100%';
                            canvas.style.height = 'auto';
                        }
                        
                        console.log('Canvas set to portrait:', width + 'x' + height);
                    }
                }, 200);
            };
        }
    }
    
    // Initialize everything
    function initialize() {
        console.log('Initializing Final Working Solution...');
        
        // Apply all fixes
        setTimeout(() => {
            ensureZoomSlider();
            fixZoomCompletely();
            fixDateDisplay();
            fixCoordinatesDisplay();
            fixFontSizeDropdowns();
            addFixedLayersTitle();
            fixCombinedViewOptions();
            fixCanvasOrientations();
            
            console.log('All fixes applied');
        }, 1000);
        
        // Re-apply periodically to catch any dynamic changes
        setInterval(() => {
            fixDateDisplay();
            fixCoordinatesDisplay();
            addFixedLayersTitle();
        }, 2000);
    }
    
    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Also run on window load
    window.addEventListener('load', () => {
        setTimeout(initialize, 500);
    });
})();
