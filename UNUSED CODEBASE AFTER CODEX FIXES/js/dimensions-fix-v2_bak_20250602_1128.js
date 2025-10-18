/* Dimensions Fix v2 - 2025-06-01 8:46 PM */

/**
 * This script provides a comprehensive fix for canvas dimensions and annotations.
 * It ensures the canvas dimensions match the user's input dimensions
 * and displays those dimensions clearly.
 * 
 * FIXES:
 * - Ensures canvas dimensions match user input
 * - Properly handles landscape vs portrait orientation
 * - Displays correct dimensions annotation
 * - Prevents canvas shape from being "cemented" by combo views
 * - Updates dimensions when paper size changes
 */

(function() {
    console.log('Dimensions Fix v2 - FINAL VERSION - Initializing');
    
    // -------------------------------------------------------------------------
    // Core Functions
    // -------------------------------------------------------------------------
    
    // Get user dimensions
    function getUserDimensions() {
        // Try different possible IDs for width and height inputs
        const widthInput = document.getElementById('width') || document.getElementById('output-width');
        const heightInput = document.getElementById('height') || document.getElementById('output-height');
        
        let width = 2550, height = 3300;
        if (widthInput && heightInput && widthInput.value && heightInput.value) {
            width = parseInt(widthInput.value);
            height = parseInt(heightInput.value);
        }
        
        // Also check if paper-size-dimensions.js has stored dimensions
        if (window.currentDimensions) {
            width = window.currentDimensions.width;
            height = window.currentDimensions.height;
        }
        
        console.log(`User dimensions: ${width}w x ${height}h`);
        return { width, height };
    }
    
    // Create dimensions display
    function createDimensionsDisplay() {
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
            position: relative;
        `;
        
        // Find where to insert it
        const zoomContainer = document.getElementById('zoom-container');
        if (zoomContainer && zoomContainer.parentNode) {
            zoomContainer.parentNode.insertBefore(dimensionsDisplay, zoomContainer.nextSibling);
        } else {
            // Try to find the canvas container
            const canvasContainer = document.querySelector('.canvas-container');
            if (canvasContainer && canvasContainer.parentNode) {
                canvasContainer.parentNode.insertBefore(dimensionsDisplay, canvasContainer);
            } else {
                // Last resort, append to body
                document.body.appendChild(dimensionsDisplay);
            }
        }
        
        return dimensionsDisplay;
    }
    
    // Update dimensions display
    function updateDimensionsDisplay(width, height) {
        // Create or get the dimensions display
        let dimensionsDisplay = document.getElementById('canvas-dimensions-display');
        if (!dimensionsDisplay) {
            dimensionsDisplay = createDimensionsDisplay();
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
        
        // Force visibility
        dimensionsDisplay.style.display = 'block';
        dimensionsDisplay.style.visibility = 'visible';
        dimensionsDisplay.style.opacity = '1';
        
        console.log('Updated dimensions display:', dimensionsText);
    }
    
    // -------------------------------------------------------------------------
    // Fix Functions
    // -------------------------------------------------------------------------
    
    // Fix canvas dimensions for standard views
    function fixStandardViewDimensions() {
        // Get canvas
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) {
            console.error('Canvas not found');
            return;
        }
        
        // Get user dimensions
        const dimensions = getUserDimensions();
        const width = dimensions.width;
        const height = dimensions.height;
        
        console.log(`Setting standard view dimensions: ${width}w x ${height}h`);
        
        // Set canvas dimensions to match user input
        canvas.width = width;
        canvas.height = height;
        
        // Update dimensions display
        updateDimensionsDisplay(width, height);
        
        // Fix canvas style to maintain aspect ratio
        canvas.style.width = 'auto';
        canvas.style.height = 'auto';
        canvas.style.maxWidth = '100%';
        canvas.style.maxHeight = '70vh';
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
    }
    
    // Fix canvas dimensions for landscape view
    function fixLandscapeViewDimensions() {
        // Get canvas
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) {
            console.error('Canvas not found');
            return;
        }
        
        // Get user dimensions
        const dimensions = getUserDimensions();
        let width = dimensions.width;
        let height = dimensions.height;
        
        // For landscape, ensure width > height
        if (width < height) {
            // Swap dimensions for landscape
            const temp = width;
            width = height;
            height = temp;
            console.log(`Swapped dimensions for landscape: ${width}w x ${height}h`);
        }
        
        console.log(`Setting landscape view dimensions: ${width}w x ${height}h`);
        
        // Force canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Update dimensions display with the new dimensions
        updateDimensionsDisplay(width, height);
        
        // Fix canvas style to maintain aspect ratio and ensure landscape appearance
        canvas.style.width = 'auto';
        canvas.style.height = 'auto';
        canvas.style.maxWidth = '100%';
        canvas.style.maxHeight = '70vh';
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
        
        // Force aspect ratio through CSS
        const aspectRatio = width / height;
        canvas.style.aspectRatio = aspectRatio;
    }
    
    // Fix canvas dimensions for portrait view
    function fixPortraitViewDimensions() {
        // Get canvas
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) {
            console.error('Canvas not found');
            return;
        }
        
        // Get user dimensions
        const dimensions = getUserDimensions();
        let width = dimensions.width;
        let height = dimensions.height;
        
        // For portrait, ensure height > width
        if (height < width) {
            // Swap dimensions for portrait
            const temp = width;
            width = height;
            height = temp;
            console.log(`Swapped dimensions for portrait: ${width}w x ${height}h`);
        }
        
        console.log(`Setting portrait view dimensions: ${width}w x ${height}h`);
        
        // Force canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Update dimensions display with the new dimensions
        updateDimensionsDisplay(width, height);
        
        // Fix canvas style to maintain aspect ratio and ensure portrait appearance
        canvas.style.width = 'auto';
        canvas.style.height = 'auto';
        canvas.style.maxWidth = '100%';
        canvas.style.maxHeight = '70vh';
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
        
        // Force aspect ratio through CSS
        const aspectRatio = width / height;
        canvas.style.aspectRatio = aspectRatio;
    }
    
    // -------------------------------------------------------------------------
    // Hook into existing functionality
    // -------------------------------------------------------------------------
    
    // Hook into view functions
    function hookIntoViewFunctions() {
        // Star Map view
        const originalViewStarMap = window.viewStarMap;
        if (originalViewStarMap) {
            window.viewStarMap = function() {
                console.log('Star Map view called');
                
                // Reset any previous view state
                window.currentView = 'star-map';
                
                // Call original function
                originalViewStarMap.apply(this, arguments);
                
                // Fix dimensions immediately and after a delay
                fixStandardViewDimensions();
                setTimeout(fixStandardViewDimensions, 300);
                setTimeout(fixStandardViewDimensions, 600);
            };
        }
        
        // Street Map view
        const originalViewStreetMap = window.viewStreetMap;
        if (originalViewStreetMap) {
            window.viewStreetMap = function() {
                console.log('Street Map view called');
                
                // Reset any previous view state
                window.currentView = 'street-map';
                
                // Call original function
                originalViewStreetMap.apply(this, arguments);
                
                // Fix dimensions immediately and after a delay
                fixStandardViewDimensions();
                setTimeout(fixStandardViewDimensions, 300);
                setTimeout(fixStandardViewDimensions, 600);
            };
        }
        
        // Canvas Layout view
        const originalViewCanvasLayout = window.viewCanvasLayout;
        if (originalViewCanvasLayout) {
            window.viewCanvasLayout = function() {
                console.log('Canvas Layout view called');
                
                // Reset any previous view state
                window.currentView = 'canvas-layout';
                
                // Call original function
                originalViewCanvasLayout.apply(this, arguments);
                
                // Fix dimensions immediately and after a delay
                fixStandardViewDimensions();
                setTimeout(fixStandardViewDimensions, 300);
                setTimeout(fixStandardViewDimensions, 600);
            };
        }
        
        // Combined Landscape view
        const originalViewStarStreetLandscape = window.viewStarStreetLandscape;
        if (originalViewStarStreetLandscape) {
            window.viewStarStreetLandscape = function() {
                console.log('Combined Landscape view called');
                
                // Set current view
                window.currentView = 'landscape';
                
                // Call original function
                originalViewStarStreetLandscape.apply(this, arguments);
                
                // Fix dimensions immediately and after delays
                fixLandscapeViewDimensions();
                setTimeout(fixLandscapeViewDimensions, 300);
                setTimeout(fixLandscapeViewDimensions, 600);
                setTimeout(fixLandscapeViewDimensions, 1000);
            };
        }
        
        // Combined Portrait view
        const originalViewStarStreetPortrait = window.viewStarStreetPortrait;
        if (originalViewStarStreetPortrait) {
            window.viewStarStreetPortrait = function() {
                console.log('Combined Portrait view called');
                
                // Set current view
                window.currentView = 'portrait';
                
                // Call original function
                originalViewStarStreetPortrait.apply(this, arguments);
                
                // Fix dimensions immediately and after delays
                fixPortraitViewDimensions();
                setTimeout(fixPortraitViewDimensions, 300);
                setTimeout(fixPortraitViewDimensions, 600);
                setTimeout(fixPortraitViewDimensions, 1000);
            };
        }
    }
    
    // Listen for dimension changes
    function listenForDimensionChanges() {
        const widthInput = document.getElementById('width');
        const heightInput = document.getElementById('height');
        
        if (widthInput) {
            widthInput.addEventListener('change', function() {
                console.log('Width changed to:', widthInput.value);
                
                // Determine which fix to apply based on the current view
                determineAndApplyFix();
            });
        }
        
        if (heightInput) {
            heightInput.addEventListener('change', function() {
                console.log('Height changed to:', heightInput.value);
                
                // Determine which fix to apply based on the current view
                determineAndApplyFix();
            });
        }
    }
    
    // Listen for paper size changes
    function listenForPaperSizeChanges() {
        // Listen for the paper-auto-size select element
        const paperSizeSelect = document.getElementById('paper-auto-size');
        if (paperSizeSelect) {
            console.log('Found paper-auto-size element, adding change listener');
            
            // Remove any existing event listeners
            paperSizeSelect.removeEventListener('change', paperSizeChangeHandler);
            
            // Add new event listener
            paperSizeSelect.addEventListener('change', paperSizeChangeHandler);
        } else {
            console.warn('paper-auto-size element not found');
        }
        
        // Listen for the dpi-selector element
        const dpiSelect = document.getElementById('dpi-selector') || document.getElementById('dpi');
        if (dpiSelect) {
            console.log('Found DPI selector element, adding change listener');
            
            // Remove any existing event listeners
            dpiSelect.removeEventListener('change', dpiChangeHandler);
            
            // Add new event listener
            dpiSelect.addEventListener('change', dpiChangeHandler);
        } else {
            console.warn('DPI selector element not found');
        }
        
        // Listen for dimensionsChanged custom event from paper-size-dimensions.js
        document.addEventListener('dimensionsChanged', function(event) {
            console.log('Dimensions changed event received:', event.detail);
            
            // Force update based on current view
            if (window.currentView === 'landscape') {
                fixLandscapeViewDimensions();
            } else if (window.currentView === 'portrait') {
                fixPortraitViewDimensions();
            } else {
                fixStandardViewDimensions();
            }
        });
        
        // Also listen for direct changes to the width and height inputs
        const widthInput = document.getElementById('width') || document.getElementById('output-width');
        const heightInput = document.getElementById('height') || document.getElementById('output-height');
        
        if (widthInput) {
            widthInput.addEventListener('input', function() {
                console.log('Width input changed to:', this.value);
                
                // Force update based on current view after a short delay
                setTimeout(function() {
                    determineAndApplyFix();
                }, 100);
            });
        }
        
        if (heightInput) {
            heightInput.addEventListener('input', function() {
                console.log('Height input changed to:', this.value);
                
                // Force update based on current view after a short delay
                setTimeout(function() {
                    determineAndApplyFix();
                }, 100);
            });
        }
    }
    
    // Paper size change handler
    function paperSizeChangeHandler() {
        console.log('Paper size changed to:', this.value);
        
        // Wait for the width and height to be updated by paper-size-dimensions.js
        setTimeout(function() {
            console.log('Applying fix after paper size change');
            
            // Force update based on current view
            if (window.currentView === 'landscape') {
                fixLandscapeViewDimensions();
            } else if (window.currentView === 'portrait') {
                fixPortraitViewDimensions();
            } else {
                fixStandardViewDimensions();
            }
            
            // Apply again after longer delays to ensure it takes effect
            setTimeout(function() {
                if (window.currentView === 'landscape') {
                    fixLandscapeViewDimensions();
                } else if (window.currentView === 'portrait') {
                    fixPortraitViewDimensions();
                } else {
                    fixStandardViewDimensions();
                }
            }, 500);
            
            setTimeout(function() {
                if (window.currentView === 'landscape') {
                    fixLandscapeViewDimensions();
                } else if (window.currentView === 'portrait') {
                    fixPortraitViewDimensions();
                } else {
                    fixStandardViewDimensions();
                }
            }, 1000);
        }, 300);
    }
    
    // DPI change handler
    function dpiChangeHandler() {
        console.log('DPI changed to:', this.value);
        
        // Wait for the width and height to be updated by paper-size-dimensions.js
        setTimeout(function() {
            console.log('Applying fix after DPI change');
            
            // Force update based on current view
            if (window.currentView === 'landscape') {
                fixLandscapeViewDimensions();
            } else if (window.currentView === 'portrait') {
                fixPortraitViewDimensions();
            } else {
                fixStandardViewDimensions();
            }
        }, 300);
    }
    
    // Determine which fix to apply based on the current view
    function determineAndApplyFix() {
        console.log('Determining current view:', window.currentView);
        
        // Use the stored current view if available
        if (window.currentView === 'landscape') {
            console.log('Applying landscape view fix (from stored state)');
            fixLandscapeViewDimensions();
            return;
        }
        
        if (window.currentView === 'portrait') {
            console.log('Applying portrait view fix (from stored state)');
            fixPortraitViewDimensions();
            return;
        }
        
        // Try to determine which view is currently active from the DOM
        const landscapeBtn = document.getElementById('view-star-street-landscape-btn');
        const portraitBtn = document.getElementById('view-star-street-portrait-btn');
        
        // Check if landscape view is active
        if (landscapeBtn && (
            landscapeBtn.classList.contains('active') || 
            landscapeBtn.classList.contains('selected') ||
            document.querySelector('.combined-landscape-active')
        )) {
            console.log('Applying landscape view fix (from DOM)');
            window.currentView = 'landscape';
            fixLandscapeViewDimensions();
            return;
        }
        
        // Check if portrait view is active
        if (portraitBtn && (
            portraitBtn.classList.contains('active') || 
            portraitBtn.classList.contains('selected') ||
            document.querySelector('.combined-portrait-active')
        )) {
            console.log('Applying portrait view fix (from DOM)');
            window.currentView = 'portrait';
            fixPortraitViewDimensions();
            return;
        }
        
        // Default to standard view fix
        console.log('Applying standard view fix (default)');
        window.currentView = 'standard';
        fixStandardViewDimensions();
    }
    
    // -------------------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------------------
    
    // Initialize
    function initialize() {
        console.log('Initializing Dimensions Fix v2 - FINAL VERSION');
        
        // Initialize current view tracking
        window.currentView = 'standard';
        
        // Hook into view functions
        hookIntoViewFunctions();
        
        // Listen for dimension changes
        listenForDimensionChanges();
        
        // Listen for paper size changes
        listenForPaperSizeChanges();
        
        // Apply initial fix
        setTimeout(function() {
            determineAndApplyFix();
        }, 500);
        
        // Set up a periodic check to ensure dimensions stay correct
        // This helps with paper size changes and other external modifications
        setInterval(function() {
            // Only update if we're not in the middle of a view change
            if (!document.querySelector('.modal, .custom-alert, .custom-modal')) {
                const canvas = document.getElementById('star-map-canvas');
                if (canvas) {
                    // Get the latest user dimensions
                    const dimensions = getUserDimensions();
                    
                    // Check if canvas dimensions match user dimensions
                    if (window.currentView === 'landscape') {
                        // For landscape, width should be greater than height
                        let width = dimensions.width;
                        let height = dimensions.height;
                        if (width < height) {
                            [width, height] = [height, width];
                        }
                        
                        if (canvas.width !== width || canvas.height !== height) {
                            console.log(`Canvas dimensions (${canvas.width}x${canvas.height}) don't match expected landscape dimensions (${width}x${height}), fixing...`);
                            fixLandscapeViewDimensions();
                        }
                    } else if (window.currentView === 'portrait') {
                        // For portrait, height should be greater than width
                        let width = dimensions.width;
                        let height = dimensions.height;
                        if (height < width) {
                            [width, height] = [height, width];
                        }
                        
                        if (canvas.width !== width || canvas.height !== height) {
                            console.log(`Canvas dimensions (${canvas.width}x${canvas.height}) don't match expected portrait dimensions (${width}x${height}), fixing...`);
                            fixPortraitViewDimensions();
                        }
                    } else {
                        // For standard views, dimensions should match user input
                        if (canvas.width !== dimensions.width || canvas.height !== dimensions.height) {
                            console.log(`Canvas dimensions (${canvas.width}x${canvas.height}) don't match user dimensions (${dimensions.width}x${dimensions.height}), fixing...`);
                            fixStandardViewDimensions();
                        }
                    }
                    
                    // Check if dimensions display needs updating
                    const dimensionsDisplay = document.getElementById('canvas-dimensions-display');
                    if (dimensionsDisplay) {
                        const displayText = dimensionsDisplay.textContent;
                        if (!displayText.includes(`${canvas.width}w x ${canvas.height}h`)) {
                            console.log('Dimensions display out of sync, updating...');
                            updateDimensionsDisplay(canvas.width, canvas.height);
                        }
                    } else {
                        // Create dimensions display if it doesn't exist
                        updateDimensionsDisplay(canvas.width, canvas.height);
                    }
                }
            }
        }, 1000);
        
        console.log('Dimensions Fix v2 - FINAL VERSION - Initialized');
    }
    
    // Initialize when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
