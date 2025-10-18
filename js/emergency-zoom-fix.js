/* Emergency Zoom Fix - Adds zoom slider in the correct location */

(function() {
    console.log('Emergency Zoom Fix starting...');
    
    function addZoomSlider() {
        // Check if zoom container already exists
        const existingZoom = document.getElementById('zoom-container');
        if (existingZoom && existingZoom.querySelector('#zoom-slider')) {
            console.log('Zoom slider already exists');
            return;
        }
        
        // Find the image format section
        const imageFormatSection = document.querySelector('.settings-row:has(input[name="image-format"])');
        if (!imageFormatSection) {
            console.log('Image format section not found, retrying...');
            setTimeout(addZoomSlider, 500);
            return;
        }
        
        // Create zoom slider section
        const zoomSection = document.createElement('div');
        zoomSection.className = 'settings-row';
        zoomSection.style.cssText = 'margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;';
        zoomSection.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; justify-content: center;">
                <label style="font-weight: bold; min-width: 60px;">Zoom:</label>
                <input type="range" id="zoom-slider" min="50" max="200" value="100" style="flex: 1; max-width: 400px;">
                <span id="zoom-value" style="min-width: 40px; text-align: right; font-weight: bold;">100</span>
                <span style="font-weight: bold;">%</span>
            </div>
        `;
        
        // Insert after image format section
        imageFormatSection.parentNode.insertBefore(zoomSection, imageFormatSection.nextSibling);
        
        // Add zoom functionality
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        
        if (zoomSlider) {
            zoomSlider.addEventListener('input', function() {
                const scale = this.value / 100;
                if (zoomValue) zoomValue.textContent = this.value;
                
                // Apply zoom to canvas
                const canvas = document.getElementById('star-map-canvas');
                if (canvas) {
                    canvas.style.transform = `scale(${scale})`;
                    canvas.style.transformOrigin = 'center center';
                }
                
                console.log('Zoom set to:', this.value + '%');
            });
            
            console.log('Zoom slider successfully added!');
        }
    }
    
    // Try to add zoom slider
    addZoomSlider();
    
    // Also try after DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addZoomSlider);
    }
    
    // And after window load
    window.addEventListener('load', function() {
        setTimeout(addZoomSlider, 1000);
    });
})();
