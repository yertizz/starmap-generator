// Zoom Slider Solution - Professional Implementation
(function() {
    'use strict';
    
    console.log('Zoom Slider Solution: Starting...');
    
    // Function to create and insert zoom slider
    function createZoomSlider() {
        // Check if zoom already exists
        if (document.getElementById('zoom-container')) {
            console.log('Zoom slider already exists');
            return;
        }
        
        // Find the canvas container
        const canvasContainer = document.querySelector('.canvas-container');
        if (!canvasContainer) {
            console.error('Canvas container not found');
            return;
        }
        
        // Create zoom slider HTML
        const zoomHTML = document.createElement('div');
        zoomHTML.className = 'form-section zoom-section';
        zoomHTML.id = 'zoom-container';
        zoomHTML.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; width: 100%; max-width: 600px; margin: 0 auto;">
                <label style="font-weight: bold; min-width: 60px;">Zoom:</label>
                <input type="range" id="zoom-slider" min="50" max="200" value="100" style="flex: 1;">
                <span id="zoom-value" style="min-width: 40px; text-align: right;">100</span>
                <span style="font-weight: bold;">%</span>
            </div>
        `;
        
        // Apply styling
        zoomHTML.style.cssText = `
            display: block !important;
            visibility: visible !important;
            background-color: #e8e8e8 !important;
            padding: 10px 20px !important;
            margin: 10px 0 !important;
            border-radius: 5px !important;
            border: 1px solid #ccc !important;
            width: auto !important;
            max-width: 900px !important;
            box-sizing: border-box !important;
        `;
        
        // Insert before canvas container
        canvasContainer.parentNode.insertBefore(zoomHTML, canvasContainer);
        
        // Add functionality
        const slider = document.getElementById('zoom-slider');
        const value = document.getElementById('zoom-value');
        const canvas = document.getElementById('star-map-canvas');
        
        if (slider && value) {
            slider.addEventListener('input', function() {
                value.textContent = this.value;
                if (canvas) {
                    const scale = this.value / 100;
                    canvas.style.transform = `scale(${scale})`;
                    canvas.style.transformOrigin = 'center center';
                }
            });
            
            console.log('Zoom slider created and functional!');
        }
    }
    
    // Try multiple times to ensure DOM is ready
    function tryCreateZoom() {
        createZoomSlider();
        
        // If not created, try again
        if (!document.getElementById('zoom-container')) {
            setTimeout(tryCreateZoom, 500);
        }
    }
    
    // Start trying when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryCreateZoom);
    } else {
        tryCreateZoom();
    }
    
})();
