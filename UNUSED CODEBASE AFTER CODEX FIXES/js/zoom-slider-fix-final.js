// FINAL ZOOM SLIDER FIX - Works regardless of how Image Format is styled
(function() {
    console.log('Starting zoom slider injection...');
    
    // Try multiple ways to find where to insert
    let insertPoint = null;
    
    // Method 1: Find by text content "Image Format:"
    const allDivs = document.querySelectorAll('div');
    for (let div of allDivs) {
        if (div.textContent.includes('Image Format:') && div.querySelector('input[name="image-format"]')) {
            insertPoint = div;
            console.log('Found Image Format section by text content');
            break;
        }
    }
    
    // Method 2: Find the canvas container as fallback
    if (!insertPoint) {
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            insertPoint = canvasContainer.previousElementSibling;
            console.log('Using canvas container as reference');
        }
    }
    
    // Method 3: Find the fieldset containing preview/download
    if (!insertPoint) {
        const fieldset = document.querySelector('.settings-preview-download-section');
        if (fieldset) {
            const imageFormatInputs = fieldset.querySelector('input[name="image-format"]');
            if (imageFormatInputs) {
                insertPoint = imageFormatInputs.closest('.settings-row') || imageFormatInputs.parentElement;
                console.log('Found in settings-preview-download-section');
            }
        }
    }
    
    if (!insertPoint) {
        console.error('Could not find insertion point! Trying absolute last resort...');
        // Last resort: insert before canvas
        const canvas = document.getElementById('star-map-canvas');
        if (canvas && canvas.parentElement) {
            insertPoint = canvas.parentElement;
            console.log('Using canvas parent as last resort');
        } else {
            console.error('Cannot find any suitable insertion point!');
            return;
        }
    }
    
    // Check if zoom already exists
    let zoomContainer = document.getElementById('zoom-container');
    
    if (zoomContainer) {
        console.log('Zoom container exists, forcing display...');
        // Force display with inline styles
        zoomContainer.setAttribute('style', `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            background-color: #e8e8e8 !important;
            padding: 10px 20px !important;
            margin: 10px auto !important;
            border-radius: 5px !important;
            border: 3px solid red !important;
            width: auto !important;
            max-width: 900px !important;
            box-sizing: border-box !important;
            position: relative !important;
            z-index: 9999 !important;
            min-height: 60px !important;
            height: auto !important;
        `);
        
        console.log('✓ Forced zoom display with RED border');
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
            border: 3px solid green !important;
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
        
        // Insert after the found element
        insertPoint.insertAdjacentHTML('afterend', newZoomHTML);
        
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
        
        console.log('✓ Created new zoom slider with GREEN border');
    }
    
    // Scroll to zoom slider
    setTimeout(() => {
        const zoom = document.getElementById('zoom-container');
        if (zoom) {
            zoom.scrollIntoView({ behavior: 'smooth', block: 'center' });
            console.log('✓ Scrolled to zoom slider');
        }
    }, 500);
})();
