/* Dimensions Fix - 2025-06-01 12:03 PM */

/**
 * This script provides a minimal fix for canvas dimensions.
 * It ensures the canvas dimensions match the user's input dimensions.
 * It does NOT force any specific orientation.
 */

(function() {
    console.log('Dimensions Fix - Initializing');
    
    // -------------------------------------------------------------------------
    // Core Functions
    // -------------------------------------------------------------------------
    
    // Get user dimensions
    function getUserDimensions() {
        const widthInput = document.getElementById('width');
        const heightInput = document.getElementById('height');
        
        let width = 2550, height = 3300;
        if (widthInput && heightInput && widthInput.value && heightInput.value) {
            width = parseInt(widthInput.value);
            height = parseInt(heightInput.value);
        }
        
        return { width, height };
    }
    
    // Update canvas dimensions display
    function updateDimensionsDisplay() {
        // Get canvas
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) return;
        
        // Get current dimensions from the canvas
        const width = canvas.width;
        const height = canvas.height;
        
        // Remove any existing dimensions display
        document.querySelectorAll('[id^="canvas-dimensions"], .canvas-dimensions-display').forEach(el => {
            if (el.parentNode) el.parentNode.removeChild(el);
        });
        
        document.querySelectorAll('div, p, span').forEach(el => {
            if (el.textContent && (el.textContent.includes('Canvas Dimensions') || 
                                  el.textContent.includes('Dimensions:')) && 
                !el.classList.contains('canvas-container')) {
                if (el.parentNode) el.parentNode.removeChild(el);
            }
        });
        
        // Create the display element
        const dimensionsDisplay = document.createElement('div');
        dimensionsDisplay.id = 'canvas-dimensions-display';
        dimensionsDisplay.style.cssText = `
            text-align: center;
            font-weight: bold;
            color: #0056b3;
            margin: 10px 0;
            padding: 5px;
            background-color: #f8f9fa;
            border-radius: 5px;
            width: 100%;
            z-index: 9999;
        `;
        
        // Find where to insert it
        const zoomContainer = document.getElementById('zoom-container');
        if (zoomContainer && zoomContainer.parentNode) {
            zoomContainer.parentNode.insertBefore(dimensionsDisplay, zoomContainer.nextSibling);
        } else {
            document.body.appendChild(dimensionsDisplay);
        }
        
        // Format dimensions text
        let dimensionsText;
        const paperSizeSelect = document.getElementById('paper-auto-size');
        if (paperSizeSelect && paperSizeSelect.value && 
            paperSizeSelect.value !== 'default' && 
            paperSizeSelect.value !== 'Select A Paper Size...') {
            const paperSize = paperSizeSelect.value;
            const dpi = document.getElementById('dpi')?.value || '300';
            dimensionsText = `Paper: ${paperSize} | DPI: ${dpi} | Dimensions: ${width}w x ${height}h pixels`;
        } else {
            dimensionsText = `Dimensions: ${width}w x ${height}h pixels`;
        }
        
        // Update the display
        dimensionsDisplay.textContent = dimensionsText;
    }
    
    // -------------------------------------------------------------------------
    // Fix Functions
    // -------------------------------------------------------------------------
    
    // Fix canvas dimensions for all views
    function fixCanvasDimensions() {
        // Get canvas
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) return;
        
        // Get user dimensions
        const dimensions = getUserDimensions();
        
        // Set canvas dimensions to match user input
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        
        // Update dimensions display
        updateDimensionsDisplay();
    }
    
    // -------------------------------------------------------------------------
    // Hook into existing functionality
    // -------------------------------------------------------------------------
    
    // Listen for width and height changes
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    
    if (widthInput) {
        widthInput.addEventListener('change', fixCanvasDimensions);
    }
    
    if (heightInput) {
        heightInput.addEventListener('change', fixCanvasDimensions);
    }
    
    // Listen for paper size changes
    const paperSizeSelect = document.getElementById('paper-auto-size');
    if (paperSizeSelect) {
        paperSizeSelect.addEventListener('change', updateDimensionsDisplay);
    }
    
    // Listen for DPI changes
    const dpiSelect = document.getElementById('dpi');
    if (dpiSelect) {
        dpiSelect.addEventListener('change', updateDimensionsDisplay);
    }
    
    // Initialize
    fixCanvasDimensions();
    
    console.log('Dimensions Fix - Initialized');
})();
