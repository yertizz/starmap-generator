/* Direct Zoom Slider Injection - Forces zoom slider to appear */

(function() {
    console.log('Zoom Slider Injection starting...');
    
    function injectZoomSlider() {
        // Check if zoom slider already exists
        if (document.getElementById('zoom-slider')) {
            console.log('Zoom slider already exists');
            return;
        }
        
        // Find the download options container
        const downloadOptions = document.querySelector('.download-options-container');
        if (!downloadOptions) {
            console.log('Download options container not found, retrying...');
            setTimeout(injectZoomSlider, 500);
            return;
        }
        
        // Create the zoom slider HTML
        const zoomHTML = `
            <div class="settings-row" style="margin-top: 20px;">
                <div>
                    <label for="zoom-slider">Zoom:</label>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="range" id="zoom-slider" min="10" max="200" value="100" style="flex: 1;">
                    <span id="zoom-value" style="min-width: 40px; text-align: right;">100</span>
                    <span>%</span>
                </div>
            </div>
        `;
        
        // Insert the zoom slider
        downloadOptions.insertAdjacentHTML('afterend', zoomHTML);
        
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
            
            console.log('Zoom slider successfully injected!');
        }
    }
    
    // Try multiple times to ensure it gets added
    injectZoomSlider();
    
    // Also try after DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectZoomSlider);
    }
    
    // And after window load
    window.addEventListener('load', function() {
        setTimeout(injectZoomSlider, 1000);
    });
    
    // Keep checking every 2 seconds
    setInterval(function() {
        if (!document.getElementById('zoom-slider')) {
            injectZoomSlider();
        }
    }, 2000);
})();
