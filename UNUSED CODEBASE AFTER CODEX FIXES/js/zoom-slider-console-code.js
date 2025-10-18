// Force inject zoom slider after Image Format section
(function() {
    // Find the Image Format row
    const imageFormatRow = document.querySelector('.settings-row[style*="Image Format"]');
    
    if (!imageFormatRow) {
        console.error('Image Format row not found!');
        return;
    }
    
    // Check if zoom already exists
    let zoomContainer = document.getElementById('zoom-container');
    
    if (zoomContainer) {
        console.log('Zoom container exists, forcing display...');
        // Force display existing zoom
        zoomContainer.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            background-color: #e8e8e8 !important;
            padding: 10px 20px !important;
            margin: 10px auto !important;
            border-radius: 5px !important;
            border: 2px solid red !important;
            width: auto !important;
            max-width: 900px !important;
            box-sizing: border-box !important;
            position: relative !important;
            z-index: 9999 !important;
            min-height: 60px !important;
        `;
        
        // Also force inner elements
        const innerDiv = zoomContainer.querySelector('div');
        if (innerDiv) {
            innerDiv.style.cssText = `
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                align-items: center !important;
                gap: 15px !important;
                width: 100% !important;
                max-width: 600px !important;
                margin: 0 auto !important;
            `;
        }
        
        const slider = document.getElementById('zoom-slider');
        if (slider) {
            slider.style.cssText = `
                display: inline-block !important;
                visibility: visible !important;
                opacity: 1 !important;
                -webkit-appearance: none !important;
                width: 300px !important;
                height: 6px !important;
                background: #d3d3d3 !important;
                cursor: pointer !important;
                border-radius: 3px !important;
            `;
        }
        
        console.log('Forced zoom display with RED border');
    } else {
        console.log('Zoom container not found, creating new one...');
        
        // Create new zoom slider
        const newZoomHTML = `
        <div class="form-section zoom-section" id="zoom-container" style="
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            background-color: #e8e8e8 !important;
            padding: 10px 20px !important;
            margin: 10px auto !important;
            border-radius: 5px !important;
            border: 2px solid green !important;
            width: auto !important;
            max-width: 900px !important;
            box-sizing: border-box !important;
            position: relative !important;
            z-index: 9999 !important;
            min-height: 60px !important;
        ">
            <div style="display: flex; align-items: center; gap: 15px; width: 100%; max-width: 600px; margin: 0 auto;">
                <label style="font-weight: bold; min-width: 60px;">Zoom:</label>
                <input type="range" id="zoom-slider" min="50" max="200" value="100" style="flex: 1; -webkit-appearance: none; height: 6px; background: #d3d3d3; border-radius: 3px;">
                <span id="zoom-value" style="min-width: 40px; text-align: right; font-weight: bold;">100</span>
                <span style="font-weight: bold;">%</span>
            </div>
        </div>`;
        
        imageFormatRow.insertAdjacentHTML('afterend', newZoomHTML);
        
        // Initialize functionality
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
        }
        
        console.log('Created new zoom slider with GREEN border');
    }
    
    // Scroll to zoom slider
    const zoom = document.getElementById('zoom-container');
    if (zoom) {
        zoom.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
})();
