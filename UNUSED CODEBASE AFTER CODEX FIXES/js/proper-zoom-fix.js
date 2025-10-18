/* Proper Zoom Fix - Replaces broken zoom implementations */

(function() {
    console.log('Proper Zoom Fix loading...');
    
    // Remove all broken zoom implementations
    function removeAllBrokenZoomHandlers() {
        const zoomSlider = document.getElementById('zoom-slider');
        if (zoomSlider) {
            // Clone to remove all event listeners
            const newSlider = zoomSlider.cloneNode(true);
            zoomSlider.parentNode.replaceChild(newSlider, zoomSlider);
            
            // Remove any duplicate zoom sliders
            const allZoomSliders = document.querySelectorAll('#zoom-slider');
            for (let i = 1; i < allZoomSliders.length; i++) {
                const row = allZoomSliders[i].closest('.settings-row');
                if (row) row.remove();
            }
        }
    }
    
    // Implement proper zoom that scales images within circles
    function implementProperZoom() {
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        
        if (!zoomSlider) return;
        
        // Set default
        zoomSlider.value = '100';
        if (zoomValue) zoomValue.textContent = '100';
        
        // Store zoom scale globally for drawing functions
        window.imageZoomScale = 1.0;
        
        // Proper zoom handler
        zoomSlider.addEventListener('input', function() {
            const scale = this.value / 100;
            window.imageZoomScale = scale;
            
            if (zoomValue) {
                zoomValue.textContent = this.value;
            }
            
            // For existing rendered images, we need to modify the drawing functions
            // to use window.imageZoomScale when drawing images
            console.log('Zoom scale set to:', scale);
            
            // Dispatch custom event for any drawing functions to listen to
            window.dispatchEvent(new CustomEvent('zoomChanged', { detail: { scale: scale } }));
        });
    }
    
    // Override image drawing to apply zoom
    function overrideImageDrawing() {
        // Override drawImage to apply zoom scale
        const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
        
        CanvasRenderingContext2D.prototype.drawImage = function(...args) {
            // Check if we should apply zoom
            if (window.imageZoomScale && window.imageZoomScale !== 1 && args.length >= 5) {
                // This is a drawImage call with destination dimensions
                const [img, dx, dy, dw, dh] = args;
                
                // Calculate zoomed dimensions
                const scale = window.imageZoomScale;
                const centerX = dx + dw / 2;
                const centerY = dy + dh / 2;
                const newWidth = dw * scale;
                const newHeight = dh * scale;
                const newX = centerX - newWidth / 2;
                const newY = centerY - newHeight / 2;
                
                // Call original with zoomed dimensions
                originalDrawImage.call(this, img, newX, newY, newWidth, newHeight);
            } else {
                // Call original as-is
                originalDrawImage.apply(this, args);
            }
        };
    }
    
    // Initialize
    function initialize() {
        console.log('Initializing Proper Zoom Fix...');
        
        // Remove all broken handlers
        removeAllBrokenZoomHandlers();
        
        // Implement proper zoom
        implementProperZoom();
        
        // Override image drawing
        overrideImageDrawing();
        
        console.log('Proper Zoom Fix initialized');
    }
    
    // Run when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }
})();
