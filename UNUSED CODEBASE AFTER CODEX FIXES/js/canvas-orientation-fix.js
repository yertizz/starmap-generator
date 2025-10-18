/* Canvas Orientation Fix - Ensures proper landscape/portrait canvas */

(function() {
    console.log('Canvas Orientation Fix loading...');
    
    // Override Combined Landscape button to ensure landscape canvas
    function fixCombinedLandscapeButton() {
        const landscapeBtn = document.getElementById('view-star-street-landscape-btn');
        if (!landscapeBtn) return;
        
        // Store original click handler
        const originalHandler = landscapeBtn.onclick;
        
        // Create new handler that ensures landscape orientation
        landscapeBtn.onclick = function(e) {
            console.log('Combined Landscape clicked - ensuring landscape canvas');
            
            // Get canvas and current dimensions
            const canvas = document.getElementById('star-map-canvas');
            const widthInput = document.getElementById('output-width');
            const heightInput = document.getElementById('output-height');
            
            if (canvas && widthInput && heightInput) {
                let width = parseInt(widthInput.value) || 2550;
                let height = parseInt(heightInput.value) || 3300;
                
                // Ensure landscape orientation (width > height)
                if (height > width) {
                    // Swap dimensions
                    [width, height] = [height, width];
                    
                    // Update the canvas
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Update display size
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
                }
            }
            
            // Call original handler if exists
            if (originalHandler) {
                originalHandler.call(this, e);
            } else if (window.viewStarStreetLandscape) {
                window.viewStarStreetLandscape();
            }
        };
    }
    
    // Override Combined Portrait button to ensure portrait canvas
    function fixCombinedPortraitButton() {
        const portraitBtn = document.getElementById('view-star-street-portrait-btn');
        if (!portraitBtn) return;
        
        // Store original click handler
        const originalHandler = portraitBtn.onclick;
        
        // Create new handler that ensures portrait orientation
        portraitBtn.onclick = function(e) {
            console.log('Combined Portrait clicked - ensuring portrait canvas');
            
            // Get canvas and current dimensions
            const canvas = document.getElementById('star-map-canvas');
            const widthInput = document.getElementById('output-width');
            const heightInput = document.getElementById('output-height');
            
            if (canvas && widthInput && heightInput) {
                let width = parseInt(widthInput.value) || 2550;
                let height = parseInt(heightInput.value) || 3300;
                
                // Ensure portrait orientation (height > width)
                if (width > height) {
                    // Swap dimensions
                    [width, height] = [height, width];
                    
                    // Update the canvas
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Update display size
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
                }
            }
            
            // Call original handler if exists
            if (originalHandler) {
                originalHandler.call(this, e);
            } else if (window.viewStarStreetPortrait) {
                window.viewStarStreetPortrait();
            }
        };
    }
    
    // Fix zoom obfuscation by ensuring images stay within circle bounds
    function fixZoomObfuscation() {
        // Override the canvas clip function to ensure proper clipping at all zoom levels
        const originalSave = CanvasRenderingContext2D.prototype.save;
        const originalRestore = CanvasRenderingContext2D.prototype.restore;
        const originalClip = CanvasRenderingContext2D.prototype.clip;
        
        let clipStack = [];
        
        CanvasRenderingContext2D.prototype.save = function() {
            clipStack.push(this._currentClipPath);
            return originalSave.call(this);
        };
        
        CanvasRenderingContext2D.prototype.restore = function() {
            this._currentClipPath = clipStack.pop();
            return originalRestore.call(this);
        };
        
        CanvasRenderingContext2D.prototype.clip = function(...args) {
            this._currentClipPath = true;
            return originalClip.apply(this, args);
        };
        
        // Ensure clipping is maintained during zoom
        const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
        CanvasRenderingContext2D.prototype.drawImage = function(...args) {
            if (this._currentClipPath && window.imageZoomScale && window.imageZoomScale !== 1) {
                // Apply zoom while maintaining clip
                this.save();
                originalDrawImage.apply(this, args);
                this.restore();
            } else {
                originalDrawImage.apply(this, args);
            }
        };
    }
    
    // Initialize
    function initialize() {
        console.log('Canvas Orientation Fix initializing...');
        
        // Fix button handlers
        fixCombinedLandscapeButton();
        fixCombinedPortraitButton();
        
        // Fix zoom obfuscation
        fixZoomObfuscation();
        
        // Re-apply fixes if DOM changes
        const observer = new MutationObserver(() => {
            fixCombinedLandscapeButton();
            fixCombinedPortraitButton();
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        console.log('Canvas Orientation Fix complete');
    }
    
    // Start when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }
})();
