// DIRECT CONSOLE FIX - Copy and paste this into your browser console

// 1. Remove any existing zoom container
const existingZoom = document.getElementById('zoom-container');
if (existingZoom) {
    existingZoom.remove();
    console.log('Removed existing zoom container');
}

// 2. Create new zoom slider
const zoomHTML = `
<div class="form-section zoom-section" id="zoom-container" style="display: block !important; visibility: visible !important; background-color: #e8e8e8 !important; padding: 10px 20px !important; margin: 10px 0 !important; border-radius: 5px !important; border: 1px solid #ccc !important; width: auto !important; max-width: 900px !important; box-sizing: border-box !important;">
    <div style="display: flex !important; align-items: center !important; gap: 15px !important; width: 100% !important; max-width: 600px !important; margin: 0 auto !important;">
        <label style="font-weight: bold !important; min-width: 60px !important;">Zoom:</label>
        <input type="range" id="zoom-slider" min="50" max="200" value="100" style="flex: 1 !important;">
        <span id="zoom-value" style="min-width: 40px !important; text-align: right !important;">100</span>
        <span style="font-weight: bold !important;">%</span>
    </div>
</div>`;

// 3. Find where to insert it
const settingsFieldset = document.querySelector('.settings-preview-download-section');
const imageFormatRow = Array.from(document.querySelectorAll('.settings-row')).find(row => 
    row.textContent.includes('Image Format:')
);

if (imageFormatRow) {
    imageFormatRow.insertAdjacentHTML('afterend', zoomHTML);
    
    // 4. Add functionality
    const slider = document.getElementById('zoom-slider');
    const value = document.getElementById('zoom-value');
    const canvas = document.getElementById('star-map-canvas');
    
    slider.addEventListener('input', function() {
        value.textContent = this.value;
        if (canvas) {
            const scale = this.value / 100;
            canvas.style.transform = `scale(${scale})`;
            canvas.style.transformOrigin = 'center center';
        }
    });
    
    console.log('✓ Zoom slider created successfully!');
} else {
    console.error('Could not find Image Format row');
}

// 5. Fix Fixed Layers duplication
const fixedLayersTitle = document.querySelector('.fixed-text-content h3');
if (fixedLayersTitle && fixedLayersTitle.textContent === 'Fixed Layers') {
    console.log('✓ Fixed Layers title already exists');
} else {
    console.log('Fixed Layers needs fixing - run this after page reload');
}
