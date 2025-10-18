/**
 * Canvas Attribute Fix
 * This script ensures the canvas width and height attributes match the dimensions set in JavaScript
 */

(function() {
    'use strict';
    
    console.log('Canvas Attribute Fix: Initializing...');
    
    // Function to update canvas attributes
    function updateCanvasAttributes() {
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        // Get the width and height inputs
        const widthInput = document.getElementById('output-width');
        const heightInput = document.getElementById('output-height');
        
        if (!widthInput || !heightInput) {
            console.error('Width or height inputs not found');
            return;
        }
        
        // Get the current width and height values
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);
        
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            console.error('Invalid width or height values');
            return;
        }
        
        console.log(`Updating canvas attributes to match dimensions: ${width}x${height}`);
        
        // Update the canvas attributes
        canvas.width = width;
        canvas.height = height;
        
        // Log the updated canvas dimensions
        console.log(`Canvas attributes updated: width=${canvas.width}, height=${canvas.height}`);
        console.log(`Canvas style dimensions: width=${canvas.style.width}, height=${canvas.style.height}`);
        console.log(`Canvas client dimensions: width=${canvas.clientWidth}, height=${canvas.clientHeight}`);
        console.log(`Canvas offset dimensions: width=${canvas.offsetWidth}, height=${canvas.offsetHeight}`);
        
        // Trigger a redraw if the redrawPreviewCanvas function exists
        if (typeof window.redrawPreviewCanvas === 'function') {
            console.log('Triggering redraw after canvas attribute update');
            window.redrawPreviewCanvas();
        }
    }
    
    // Function to add event listeners to the width and height inputs
    function addDimensionChangeListeners() {
        const widthInput = document.getElementById('output-width');
        const heightInput = document.getElementById('output-height');
        
        if (!widthInput || !heightInput) {
            console.error('Width or height inputs not found');
            return;
        }
        
        // Add event listeners to update canvas attributes when dimensions change
        widthInput.addEventListener('change', updateCanvasAttributes);
        heightInput.addEventListener('change', updateCanvasAttributes);
        
        console.log('Added dimension change listeners');
    }
    
    // Function to add event listeners to the view buttons
    function addViewButtonListeners() {
        const viewButtons = [
            'view-star-map-btn',
            'view-street-map-btn',
            'view-star-map-canvas-btn',
            'view-star-street-landscape-btn',
            'view-star-street-portrait-btn'
        ];
        
        viewButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                // Add event listener to update canvas attributes before view is generated
                button.addEventListener('click', function() {
                    console.log(`View button clicked: ${buttonId}`);
                    updateCanvasAttributes();
                });
            }
        });
        
        console.log('Added view button listeners');
    }
    
    // Function to add event listener to the paper auto-size selector
    function addPaperSizeListener() {
        const paperSizeSelect = document.getElementById('paper-auto-size');
        const dpiSelector = document.getElementById('dpi-selector');
        
        if (paperSizeSelect) {
            paperSizeSelect.addEventListener('change', function() {
                // Wait a short time for the dimensions to be updated by other scripts
                setTimeout(updateCanvasAttributes, 100);
            });
            
            console.log('Added paper size listener');
        }
        
        if (dpiSelector) {
            dpiSelector.addEventListener('change', function() {
                // Wait a short time for the dimensions to be updated by other scripts
                setTimeout(updateCanvasAttributes, 100);
            });
            
            console.log('Added DPI selector listener');
        }
    }
    
    // Function to initialize the fix
    function initialize() {
        console.log('Canvas Attribute Fix: Initializing...');
        
        // Add event listeners
        addDimensionChangeListeners();
        addViewButtonListeners();
        addPaperSizeListener();
        
        // Update canvas attributes on initialization
        // Wait a short time for other scripts to initialize
        setTimeout(updateCanvasAttributes, 500);
        
        console.log('Canvas Attribute Fix: Initialized');
    }
    
    // Initialize when the DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded
        setTimeout(initialize, 100);
    }
})();
