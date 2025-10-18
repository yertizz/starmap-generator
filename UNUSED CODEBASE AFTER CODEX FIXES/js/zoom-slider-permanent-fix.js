/* Permanent fix for zoom slider visibility */

document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to load
    setTimeout(function() {
        // Check if zoom container exists in the DOM
        let zoomContainer = document.getElementById('zoom-container');
        
        // If it doesn't exist, create it
        if (!zoomContainer) {
            const formatRow = document.querySelector('.settings-row[style*="border-top"]');
            if (formatRow) {
                // Create zoom slider HTML
                const zoomHTML = `
                    <div class="form-section zoom-section" id="zoom-container">
                        <div style="display: flex; align-items: center; gap: 15px; width: 100%; max-width: 600px; margin: 0 auto;">
                            <label style="font-weight: bold; min-width: 60px;">Zoom:</label>
                            <input type="range" id="zoom-slider" min="50" max="200" value="100" style="flex: 1;">
                            <span id="zoom-value">100</span>
                            <span style="font-weight: bold;">%</span>
                        </div>
                    </div>
                `;
                
                // Insert after format row
                formatRow.insertAdjacentHTML('afterend', zoomHTML);
                
                // Get the newly created container
                zoomContainer = document.getElementById('zoom-container');
            }
        }
        
        // Force the zoom container to be visible with inline styles
        if (zoomContainer) {
            zoomContainer.setAttribute('style', 
                'display: block !important; ' +
                'visibility: visible !important; ' +
                'opacity: 1 !important; ' +
                'height: auto !important; ' +
                'min-height: 60px !important; ' +
                'background: #e8e8e8 !important; ' +
                'padding: 10px !important; ' +
                'margin: 10px 0 !important; ' +
                'border: 1px solid #ccc !important; ' +
                'position: static !important; ' +
                'transform: none !important; ' +
                'top: auto !important; ' +
                'border-radius: 5px !important;'
            );
            
            // Add zoom slider functionality
            const zoomSlider = document.getElementById('zoom-slider');
            const zoomValue = document.getElementById('zoom-value');
            
            if (zoomSlider && zoomValue) {
                zoomSlider.addEventListener('input', function() {
                    zoomValue.textContent = this.value;
                });
            }
        }
    }, 500); // Wait 500ms for page to load
});
