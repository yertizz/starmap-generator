/* UI Final Resolution - Fixes all remaining issues */

(function() {
    console.log('UI Final Resolution loading...');
    
    // 1. Fix Combined Landscape canvas orientation
    function fixLandscapeCanvasOrientation() {
        // Override the landscape button click to ensure landscape canvas
        const landscapeBtn = document.getElementById('view-star-street-landscape-btn');
        if (landscapeBtn) {
            const originalOnclick = landscapeBtn.onclick;
            landscapeBtn.onclick = function() {
                console.log('Fixing landscape canvas orientation...');
                
                // Get canvas and dimensions
                const canvas = document.getElementById('star-map-canvas');
                const widthInput = document.getElementById('output-width');
                const heightInput = document.getElementById('output-height');
                
                if (canvas && widthInput && heightInput) {
                    const width = parseInt(widthInput.value);
                    const height = parseInt(heightInput.value);
                    
                    // Force landscape orientation
                    if (height > width) {
                        // Swap dimensions for landscape
                        canvas.width = height;
                        canvas.height = width;
                        canvas.style.width = height + 'px';
                        canvas.style.height = width + 'px';
                    }
                }
                
                // Call original function
                if (originalOnclick) originalOnclick.call(this);
                else if (window.viewStarStreetLandscape) window.viewStarStreetLandscape();
            };
        }
    }
    
    // 2. Fix Combined View Options styling and alignment
    function fixCombinedViewOptions() {
        console.log('Fixing Combined View Options...');
        
        // Wait for elements to be ready
        setTimeout(() => {
            // Find the Combined View Options container
            const containers = document.querySelectorAll('.settings-row > div');
            containers.forEach(container => {
                if (container.textContent.includes('Combined View Options:')) {
                    // Fix the title styling to match other container titles
                    const titleDiv = container.querySelector('div:first-child');
                    if (titleDiv && titleDiv.textContent.includes('Combined View Options:')) {
                        titleDiv.style.cssText = `
                            font-weight: bold !important;
                            font-size: 1.15em !important;
                            color: #0056b3 !important;
                            border-bottom: 1px solid #eee !important;
                            padding: 0 15px 10px 15px !important;
                            margin-bottom: 15px !important;
                            text-align: center !important;
                            display: block !important;
                            width: 100% !important;
                        `;
                    }
                    
                    // Center align the entire container
                    container.style.cssText += `
                        text-align: center !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                    `;
                    
                    // Fix overlap slider row - CENTER IT
                    const overlapRow = Array.from(container.querySelectorAll('div')).find(div => 
                        div.textContent.includes('Circle Overlap:') && !div.textContent.includes('Combined View Options:')
                    );
                    
                    if (overlapRow) {
                        overlapRow.style.cssText = `
                            display: flex !important;
                            justify-content: center !important;
                            align-items: center !important;
                            width: 100% !important;
                            margin-bottom: 10px !important;
                            text-align: center !important;
                        `;
                        
                        // Fix the slider width - reduce by 50%
                        const overlapSlider = document.getElementById('circle-overlap-percent');
                        if (overlapSlider) {
                            const currentWidth = overlapSlider.offsetWidth;
                            overlapSlider.style.cssText = `
                                width: ${currentWidth / 2}px !important;
                                max-width: 200px !important;
                                min-width: 100px !important;
                            `;
                            
                            // Set default to 10%
                            overlapSlider.value = '10';
                            const overlapValue = document.getElementById('overlap-value');
                            if (overlapValue) {
                                overlapValue.textContent = '10%';
                            }
                            
                            // Update the global setting
                            if (window.combinedViewSettings) {
                                window.combinedViewSettings.overlapPercent = 10;
                            }
                        }
                    }
                    
                    // Fix map order row - CENTER IT
                    const mapOrderRow = Array.from(container.querySelectorAll('div')).find(div => 
                        div.textContent.includes('Map Order:') && !div.textContent.includes('Circle Overlap:')
                    );
                    
                    if (mapOrderRow) {
                        mapOrderRow.style.cssText = `
                            display: flex !important;
                            justify-content: center !important;
                            align-items: center !important;
                            width: 100% !important;
                            gap: 20px !important;
                            text-align: center !important;
                        `;
                    }
                }
            });
        }, 1000);
    }
    
    // 3. Fix zoom slider to work on ALL views
    function fixZoomSliderCompletely() {
        console.log('Fixing zoom slider completely...');
        
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        
        if (!zoomSlider) return;
        
        // Remove ALL existing listeners
        const newSlider = zoomSlider.cloneNode(true);
        zoomSlider.parentNode.replaceChild(newSlider, zoomSlider);
        
        // Set default to 100%
        newSlider.value = '100';
        if (zoomValue) zoomValue.textContent = '100';
        
        // Create a more aggressive zoom function
        function applyZoomToEverything(scale) {
            console.log('Applying zoom scale:', scale);
            
            // Get the canvas container
            const canvasContainer = document.querySelector('.canvas-container');
            if (canvasContainer) {
                // Apply zoom to the container itself
                canvasContainer.style.zoom = scale;
                
                // Also apply transform as backup
                canvasContainer.style.transform = `scale(${scale})`;
                canvasContainer.style.transformOrigin = 'center top';
            }
            
            // Apply to star-map-canvas specifically
            const starMapCanvas = document.getElementById('star-map-canvas');
            if (starMapCanvas) {
                starMapCanvas.style.transform = `scale(${scale})`;
                starMapCanvas.style.transformOrigin = 'center center';
            }
            
            // Apply to any images in the container
            const images = document.querySelectorAll('.canvas-container img');
            images.forEach(img => {
                img.style.transform = `scale(${scale})`;
                img.style.transformOrigin = 'center center';
            });
            
            // Apply to any divs that might contain the combined views
            const combinedContainers = document.querySelectorAll('.combined-view-container, [class*="combined"]');
            combinedContainers.forEach(container => {
                container.style.transform = `scale(${scale})`;
                container.style.transformOrigin = 'center center';
            });
        }
        
        // Add the zoom event listener
        newSlider.addEventListener('input', function() {
            const scale = this.value / 100;
            if (zoomValue) zoomValue.textContent = this.value;
            applyZoomToEverything(scale);
        });
        
        // Also add change event for good measure
        newSlider.addEventListener('change', function() {
            const scale = this.value / 100;
            applyZoomToEverything(scale);
        });
        
        // Apply initial zoom
        applyZoomToEverything(1);
    }
    
    // Initialize all fixes
    function initialize() {
        console.log('UI Final Resolution initializing...');
        
        // Apply fixes with delays to ensure DOM is ready
        setTimeout(() => {
            fixLandscapeCanvasOrientation();
            fixCombinedViewOptions();
            fixZoomSliderCompletely();
            
            // Re-apply Combined View Options fix after a longer delay
            setTimeout(fixCombinedViewOptions, 2000);
            
            console.log('UI Final Resolution complete');
        }, 500);
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Also run on window load
    window.addEventListener('load', () => {
        setTimeout(initialize, 500);
    });
    
    // Expose for debugging
    window.uiFinalResolution = {
        fixOrientation: fixLandscapeCanvasOrientation,
        fixOptions: fixCombinedViewOptions,
        fixZoom: fixZoomSliderCompletely,
        applyAll: initialize
    };
})();
