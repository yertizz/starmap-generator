/**
 * Circle Fix Direct
 * This script directly fixes the circle rendering issue by ensuring the canvas dimensions
 * match the width and height input fields.
 */

(function() {
    'use strict';
    
    console.log('Circle Fix Direct: Initializing...');
    
    // Function to update canvas dimensions, apply CSS fixes, and add dimension label
    function updateCanvasDimensions() {
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
        
        // Only update if dimensions have changed
        if (canvas.width !== width || canvas.height !== height) {
            console.log(`Updating canvas dimensions: ${width}x${height}`);
            
            // Update the canvas attributes
            canvas.width = width;
            canvas.height = height;
            
            // Apply CSS fixes to ensure the canvas maintains its aspect ratio
            // and is displayed at a reasonable size
            canvas.style.objectFit = 'contain';
            canvas.style.display = 'block';
            canvas.style.marginLeft = 'auto';
            canvas.style.marginRight = 'auto';
            
            // Set a reasonable max-width and max-height to ensure the canvas fits in the viewport
            canvas.style.maxWidth = '100%';
            canvas.style.maxHeight = '80vh'; // 80% of viewport height
            
            // Allow the canvas to scale while maintaining aspect ratio
            canvas.style.width = 'auto';
            canvas.style.height = 'auto';
            canvas.style.transform = 'none';
            
            // Also fix the canvas container if it exists
            const canvasContainer = document.querySelector('.canvas-container');
            if (canvasContainer) {
                canvasContainer.style.width = '100%';
                canvasContainer.style.height = 'auto';
                canvasContainer.style.maxWidth = '100%';
                canvasContainer.style.maxHeight = '80vh';
                canvasContainer.style.marginLeft = 'auto';
                canvasContainer.style.marginRight = 'auto';
                canvasContainer.style.padding = '0';
                canvasContainer.style.position = 'relative'; // For absolute positioning of the label
            }
            
            // Create or update the dimension label
            updateDimensionLabel(width, height);
            
            // Log the updated canvas dimensions
            console.log(`Canvas dimensions updated: width=${canvas.width}, height=${canvas.height}`);
            console.log('CSS fixes applied to ensure canvas maintains aspect ratio');
        }
    }
    
    // Function to create or update the dimension label
    function updateDimensionLabel(width, height) {
        // Get the canvas container
        const canvasContainer = document.querySelector('.canvas-container');
        if (!canvasContainer) {
            console.error('Canvas container not found');
            return;
        }
        
        // Remove ALL existing labels and size info elements
        const existingLabels = document.querySelectorAll('#canvas-dimension-label-new, #canvas-dimension-label, #canvas-size-info');
        existingLabels.forEach(el => el.remove());
        
        // Create a new label element
        const dimensionLabel = document.createElement('h3');
        dimensionLabel.id = 'canvas-dimension-label-new';
        dimensionLabel.className = 'section-header';
        
        // Style the header to match other container headers (blue color)
        dimensionLabel.style.color = '#337ab7'; // Blue color to match other headers
        dimensionLabel.style.textAlign = 'center';
        dimensionLabel.style.fontWeight = 'bold';
        dimensionLabel.style.marginBottom = '5px';
        dimensionLabel.style.padding = '5px 0';
        dimensionLabel.style.borderBottom = '1px solid #ddd';
        
        // Get the DPI value
        const dpiSelector = document.getElementById('dpi-selector');
        let dpi = '300'; // Default DPI
        if (dpiSelector && dpiSelector.value) {
            dpi = dpiSelector.value;
        }
        
        // Get the paper size if it was selected
        const paperSizeSelect = document.getElementById('paper-auto-size');
        
        // Debug paper size selection
        console.log('Paper size select element:', paperSizeSelect);
        if (paperSizeSelect) {
            console.log('Paper size value:', paperSizeSelect.value);
            console.log('Paper size selected index:', paperSizeSelect.selectedIndex);
            if (paperSizeSelect.selectedIndex >= 0) {
                console.log('Selected option text:', paperSizeSelect.options[paperSizeSelect.selectedIndex].text);
            }
        }
        
        // Check if a paper size is selected (not default or empty)
        const isPaperSizeSelected = paperSizeSelect && 
                                   paperSizeSelect.selectedIndex > 0 && 
                                   paperSizeSelect.value && 
                                   paperSizeSelect.value !== 'default' && 
                                   paperSizeSelect.value !== '';
        
        console.log('Is paper size selected:', isPaperSizeSelected);
        
        // Set the label text
        dimensionLabel.innerHTML = 'Canvas Dimensions + Size Information';
        
        // Insert the label before the canvas
        canvasContainer.insertBefore(dimensionLabel, canvasContainer.firstChild);
        
        // Create a size info element to display below the header
        const sizeInfo = document.createElement('div');
        sizeInfo.id = 'canvas-size-info';
        sizeInfo.style.textAlign = 'center';
        sizeInfo.style.marginBottom = '10px';
        sizeInfo.style.fontSize = '12px';
        sizeInfo.style.color = '#666';
        
        // Check if aspect ratio is maintained
        const aspectRatioCheckbox = document.getElementById('maintain-aspect-ratio');
        const isAspectRatioMaintained = aspectRatioCheckbox && aspectRatioCheckbox.checked;
        
        // Set the size info text
        if (isPaperSizeSelected && !isAspectRatioMaintained) {
            // Only show paper size if aspect ratio is not maintained
            const selectedOption = paperSizeSelect.options[paperSizeSelect.selectedIndex];
            if (selectedOption) {
                sizeInfo.textContent = `Paper: ${selectedOption.text} | DPI: ${dpi} | Dimensions: ${width}w x ${height}h pixels`;
            }
        } else if (isPaperSizeSelected && isAspectRatioMaintained) {
            // If aspect ratio is maintained, show a note about it
            sizeInfo.textContent = `Dimensions: ${width}w x ${height}h pixels (Aspect ratio maintained)`;
        } else {
            // Default case for manual dimensions
            sizeInfo.textContent = `Dimensions: ${width}w x ${height}h pixels`;
        }
        
        // Insert the size info after the header
        canvasContainer.insertBefore(sizeInfo, dimensionLabel.nextSibling);
        
        console.log('New label created with text:', dimensionLabel.innerHTML);
        console.log('Size info created with text:', sizeInfo.textContent);
    }
    
    // Function to override the view functions
    function overrideViewFunctions() {
        // Store original functions
        const originalFunctions = {
            viewStarMap: window.viewStarMap,
            viewStreetMap: window.viewStreetMap,
            viewStarMapCanvas: window.viewStarMapCanvas,
            viewStarStreetLandscape: window.viewStarStreetLandscape,
            viewStarStreetPortrait: window.viewStarStreetPortrait
        };
        
        // Override viewStarMap
        if (typeof window.viewStarMap === 'function') {
            window.viewStarMap = function() {
                console.log('Circle Fix Direct: viewStarMap called');
                updateCanvasDimensions();
                if (originalFunctions.viewStarMap) {
                    return originalFunctions.viewStarMap.apply(this, arguments);
                }
            };
        }
        
        // Override viewStreetMap
        if (typeof window.viewStreetMap === 'function') {
            window.viewStreetMap = function() {
                console.log('Circle Fix Direct: viewStreetMap called');
                updateCanvasDimensions();
                if (originalFunctions.viewStreetMap) {
                    return originalFunctions.viewStreetMap.apply(this, arguments);
                }
            };
        }
        
        // Override viewStarMapCanvas
        if (typeof window.viewStarMapCanvas === 'function') {
            window.viewStarMapCanvas = function() {
                console.log('Circle Fix Direct: viewStarMapCanvas called');
                updateCanvasDimensions();
                if (originalFunctions.viewStarMapCanvas) {
                    return originalFunctions.viewStarMapCanvas.apply(this, arguments);
                }
            };
        }
        
        // Override viewStarStreetLandscape
        if (typeof window.viewStarStreetLandscape === 'function') {
            window.viewStarStreetLandscape = function() {
                console.log('Circle Fix Direct: viewStarStreetLandscape called');
                updateCanvasDimensions();
                if (originalFunctions.viewStarStreetLandscape) {
                    return originalFunctions.viewStarStreetLandscape.apply(this, arguments);
                }
            };
        }
        
        // Override viewStarStreetPortrait
        if (typeof window.viewStarStreetPortrait === 'function') {
            window.viewStarStreetPortrait = function() {
                console.log('Circle Fix Direct: viewStarStreetPortrait called');
                updateCanvasDimensions();
                if (originalFunctions.viewStarStreetPortrait) {
                    return originalFunctions.viewStarStreetPortrait.apply(this, arguments);
                }
            };
        }
        
        console.log('Circle Fix Direct: View functions overridden');
    }
    
    // Function to override the redrawPreviewCanvas function
    function overrideRedrawFunction() {
        // Store original function
        const originalRedraw = window.redrawPreviewCanvas;
        
        if (typeof window.redrawPreviewCanvas === 'function') {
            window.redrawPreviewCanvas = function() {
                console.log('Circle Fix Direct: redrawPreviewCanvas called');
                updateCanvasDimensions();
                if (originalRedraw) {
                    return originalRedraw.apply(this, arguments);
                }
            };
            
            console.log('Circle Fix Direct: redrawPreviewCanvas function overridden');
        }
    }
    
    // Function to add event listeners to the width, height, and paper size inputs
    function addDimensionChangeListeners() {
        const widthInput = document.getElementById('output-width');
        const heightInput = document.getElementById('output-height');
        const paperSizeSelect = document.getElementById('paper-auto-size');
        const dpiSelector = document.getElementById('dpi-selector');
        
        if (!widthInput || !heightInput) {
            console.error('Width or height inputs not found');
            return;
        }
        
        // Add event listeners to update canvas dimensions when dimensions change
        widthInput.addEventListener('change', function() {
            console.log('Circle Fix Direct: Width input changed');
            updateCanvasDimensions();
        });
        
        heightInput.addEventListener('change', function() {
            console.log('Circle Fix Direct: Height input changed');
            updateCanvasDimensions();
        });
        
        // Add event listener for paper size selection
        if (paperSizeSelect) {
            paperSizeSelect.addEventListener('change', function() {
                console.log('Circle Fix Direct: Paper size changed to', paperSizeSelect.value);
                // Force update of the dimension label
                const width = parseInt(widthInput.value);
                const height = parseInt(heightInput.value);
                updateDimensionLabel(width, height);
            });
        }
        
        // Add event listener for DPI selection
        if (dpiSelector) {
            dpiSelector.addEventListener('change', function() {
                console.log('Circle Fix Direct: DPI changed to', dpiSelector.value);
                // Force update of the dimension label
                const width = parseInt(widthInput.value);
                const height = parseInt(heightInput.value);
                updateDimensionLabel(width, height);
            });
        }
        
        console.log('Circle Fix Direct: Dimension change listeners added');
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
                // Add event listener to update canvas dimensions before view is generated
                button.addEventListener('click', function() {
                    console.log(`Circle Fix Direct: View button clicked: ${buttonId}`);
                    updateCanvasDimensions();
                });
            }
        });
        
        console.log('Circle Fix Direct: View button listeners added');
    }
    
    // Function to hook into the paper-size-dimensions.js functionality
    function hookIntoPaperSizeFunctions() {
        console.log('Circle Fix Direct: Hooking into paper size functions');
        
        // Store the original calculateDimensions function
        if (typeof window.calculateStarMapDimensions === 'function') {
            const originalCalculateDimensions = window.calculateStarMapDimensions;
            
            // Override the calculateDimensions function
            window.calculateStarMapDimensions = function() {
                console.log('Circle Fix Direct: calculateStarMapDimensions called');
                
                // Call the original function
                if (originalCalculateDimensions) {
                    originalCalculateDimensions.apply(this, arguments);
                }
                
                // Update our dimension label
                const widthInput = document.getElementById('output-width');
                const heightInput = document.getElementById('output-height');
                
                if (widthInput && heightInput) {
                    const width = parseInt(widthInput.value);
                    const height = parseInt(heightInput.value);
                    updateDimensionLabel(width, height);
                }
            };
            
            console.log('Circle Fix Direct: Successfully hooked into calculateStarMapDimensions');
        } else {
            console.warn('Circle Fix Direct: calculateStarMapDimensions function not found');
        }
        
        // Also hook into the calculateCircleDimensions function
        if (typeof window.calculateCircleDimensions === 'function') {
            const originalCalculateCircleDimensions = window.calculateCircleDimensions;
            
            // Override the calculateCircleDimensions function
            window.calculateCircleDimensions = function() {
                console.log('Circle Fix Direct: calculateCircleDimensions called');
                
                // Call the original function
                if (originalCalculateCircleDimensions) {
                    originalCalculateCircleDimensions.apply(this, arguments);
                }
                
                // Update our dimension label
                const widthInput = document.getElementById('output-width');
                const heightInput = document.getElementById('output-height');
                
                if (widthInput && heightInput) {
                    const width = parseInt(widthInput.value);
                    const height = parseInt(heightInput.value);
                    updateDimensionLabel(width, height);
                }
            };
            
            console.log('Circle Fix Direct: Successfully hooked into calculateCircleDimensions');
        } else {
            console.warn('Circle Fix Direct: calculateCircleDimensions function not found');
        }
        
        // Add a listener for the dimensionsChanged custom event
        document.addEventListener('dimensionsChanged', function(event) {
            console.log('Circle Fix Direct: dimensionsChanged event received', event.detail);
            
            // Update our dimension label
            const widthInput = document.getElementById('output-width');
            const heightInput = document.getElementById('output-height');
            
            if (widthInput && heightInput) {
                const width = parseInt(widthInput.value);
                const height = parseInt(heightInput.value);
                updateDimensionLabel(width, height);
            }
        });
        
        console.log('Circle Fix Direct: Added listener for dimensionsChanged event');
    }
    
    // Function to initialize the fix
    function initialize() {
        console.log('Circle Fix Direct: Initializing...');
        
        // Override view functions
        overrideViewFunctions();
        
        // Override redraw function
        overrideRedrawFunction();
        
        // Add event listeners
        addDimensionChangeListeners();
        addViewButtonListeners();
        
        // Hook into paper size functions
        hookIntoPaperSizeFunctions();
        
        // Update canvas dimensions on initialization
        // Wait a short time for other scripts to initialize
        setTimeout(function() {
            updateCanvasDimensions();
            
            // Force update of the dimension label
            const widthInput = document.getElementById('output-width');
            const heightInput = document.getElementById('output-height');
            
            if (widthInput && heightInput) {
                const width = parseInt(widthInput.value);
                const height = parseInt(heightInput.value);
                updateDimensionLabel(width, height);
            }
        }, 1000);
        
        console.log('Circle Fix Direct: Initialized');
    }
    
    // Initialize when the DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded
        setTimeout(initialize, 100);
    }
})();
