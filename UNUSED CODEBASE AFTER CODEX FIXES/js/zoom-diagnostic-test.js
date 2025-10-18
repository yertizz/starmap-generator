// Zoom Diagnostic Test
console.log('=== ZOOM DIAGNOSTIC START ===');

// Check if zoom container exists in HTML
const zoomInHTML = document.getElementById('zoom-container');
console.log('Zoom container in HTML:', zoomInHTML);

// Check if canvas-zoom-slider.js loaded
console.log('window.canvasZoom exists:', typeof window.canvasZoom !== 'undefined');

// Try to find Image Format row
const imageFormatRow = Array.from(document.querySelectorAll('.settings-row')).find(row => 
    row.textContent.includes('Image Format:')
);
console.log('Image Format row found:', !!imageFormatRow);

// Force create zoom if missing
if (!zoomInHTML && imageFormatRow) {
    console.log('Creating zoom slider NOW...');
    const zoomHTML = `
    <div class="form-section zoom-section" id="zoom-container" style="display: block !important; visibility: visible !important; background-color: #e8e8e8 !important; padding: 10px 20px !important; margin: 10px 0 !important; border-radius: 5px !important; border: 1px solid #ccc !important;">
        <div style="display: flex !important; align-items: center !important; gap: 15px !important; width: 100% !important; max-width: 600px !important; margin: 0 auto !important;">
            <label style="font-weight: bold !important; min-width: 60px !important;">Zoom:</label>
            <input type="range" id="zoom-slider" min="50" max="200" value="100" style="flex: 1 !important;">
            <span id="zoom-value" style="min-width: 40px !important; text-align: right !important;">100</span>
            <span style="font-weight: bold !important;">%</span>
        </div>
    </div>`;
    
    imageFormatRow.insertAdjacentHTML('afterend', zoomHTML);
    console.log('Zoom slider created!');
    
    // Add functionality
    const slider = document.getElementById('zoom-slider');
    const value = document.getElementById('zoom-value');
    if (slider && value) {
        slider.addEventListener('input', function() {
            value.textContent = this.value;
        });
    }
}

console.log('=== ZOOM DIAGNOSTIC END ===');
