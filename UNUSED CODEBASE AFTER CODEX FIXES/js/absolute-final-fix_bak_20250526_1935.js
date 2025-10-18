/* Absolute Final Fix - Direct DOM manipulation to fix all issues */
/* START OF CODE - Cline - 2025-05-26 19:16 File: js/absolute-final-fix.js */

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
                    if (size === '72px') option.selected = true; // Changed to 72px as requested
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
    
    // 2. FIX FIXED LAYERS TITLE PADDING AND REMOVE HR LINE
    function fixFixedLayersTitle() {
        console.log('Fixing Fixed Layers title padding...');
        
        // Find the Fixed Layers title
        const fixedLayersTitle = document.querySelector('.fixed-text-content h3');
        if (fixedLayersTitle) {
            // Reduce padding and remove border-bottom (hr line)
            fixedLayersTitle.style.cssText = `
                font-weight: bold !important;
                font-size: 1.15em !important;
                color: #0056b3 !important;
                padding: 0 !important;
                margin-bottom: 5px !important;
                text-align: center !important;
                display: block !important;
                border-bottom: none !important;
            `;
            console.log('✓ Fixed Layers title padding reduced and hr line removed');
        }
    }
    
    // 3. FORCE ADD ZOOM SLIDER (SINGLE INSTANCE)
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
    
    // 4. FIX CANVAS ORIENTATIONS FOR COMBINED VIEWS
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
    
    // 5. FIX CANVAS HEIGHT
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
        fixFixedLayersFontSizes();
        fixFixedLayersTitle();
        forceAddZoomSlider();
        fixCanvasOrientations();
        fixCanvasHeight();
        
        console.log('✓ All fixes applied');
        
        // Keep checking for issues
        const interval = setInterval(() => {
            // Check for font size dropdowns
            if (!document.getElementById('fixed-font-size-date') || !document.getElementById('fixed-font-size-coords')) {
                fixFixedLayersFontSizes();
            }
            
            // Check for Fixed Layers title
            const fixedLayersTitle = document.querySelector('.fixed-text-content h3');
            if (fixedLayersTitle && fixedLayersTitle.style.borderBottom !== 'none') {
                fixFixedLayersTitle();
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

/* END OF CODE - Cline - 2025-05-26 19:16 File: js/absolute-final-fix.js */
