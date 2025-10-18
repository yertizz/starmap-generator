/* START OF CODE - Cline - 2025-06-02 12:30 File: js/dimensions-fix-v2.js */

/**
 * This script provides a comprehensive fix for canvas dimensions, annotations,
 * and combined view positioning.
 * 
 * FIXES:
 * - Ensures canvas dimensions match user input
 * - Properly handles landscape vs portrait orientation
 * - Displays correct dimensions annotation
 * - Prevents canvas shape from being "cemented" by combo views
 * - Updates dimensions when paper size changes
 * - Centers circles in combined views
 * - Fixes portrait/landscape orientation issues
 * 
 * CRITICAL COMBINED VIEW ORIENTATION FIXES:
 * - LANDSCAPE: 3300w x 5100h → 5100w x 3300h (wider than tall)
 * - PORTRAIT: 5100w x 3300h → 3300w x 5100h (taller than wide)
 * - Eliminates flickering/double loading issues
 */

(function() {
    console.log('Dimensions Fix v2 - FINAL VERSION - Initializing');
    
    // Flag to track initialization status
    let initialized = false;
    
    // Store original dimensions to protect views
    let originalDimensions = { width: 2550, height: 3300 };
    let currentView = 'standard';
    let lastKnownGoodDimensions = { width: 2550, height: 3300 };
    
    // Processing flags to prevent flickering/recursive calls
    let isProcessingLandscape = false;
    let isProcessingPortrait = false;
    
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
        
        // Store original dimensions when first called
        if (!originalDimensions.width || !originalDimensions.height) {
            originalDimensions.width = width;
            originalDimensions.height = height;
        }
        
        // Store last known good dimensions
        lastKnownGoodDimensions.width = width;
        lastKnownGoodDimensions.height = height;
        
        console.log(`User dimensions: ${width}w x ${height}h`);
        return { width, height };
    }
    
    // Create dimensions display
    function createDimensionsDisplay() {
        try {
            // Remove any existing dimensions display
            document.querySelectorAll('[id^="canvas-dimensions"], .canvas-dimensions-display').forEach(el => {
                if (el && el.parentNode) el.parentNode.removeChild(el);
            });
            
            document.querySelectorAll('div, p, span').forEach(el => {
                if (el && el.textContent && (el.textContent.includes('Canvas Dimensions') || 
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
        } catch (error) {
            console.error('Error creating dimensions display:', error);
            return null;
        }
    }
    
    // Update dimensions display
    function updateDimensionsDisplay(width, height) {
        try {
            // Create or get the dimensions display
            let dimensionsDisplay = document.getElementById('canvas-dimensions-display');
            if (!dimensionsDisplay) {
                dimensionsDisplay = createDimensionsDisplay();
            }
            
            if (!dimensionsDisplay) {
                console.warn('Could not create or find dimensions display');
                return;
            }
            
            // Format dimensions text
            let dimensionsText;
            const paperSizeSelect = document.getElementById('paper-auto-size');
            if (paperSizeSelect && paperSizeSelect.value && 
                paperSizeSelect.value !== 'default' && 
                paperSizeSelect.value !== 'Select A Paper Size...') {
                const paperSize = paperSizeSelect.value;
                const dpiSelector = document.getElementById('dpi-selector');
                const dpi = dpiSelector && dpiSelector.value ? dpiSelector.value : '300';
                dimensionsText = `Dimensions: ${width}w x ${height}h pixels | Paper: ${paperSize} | DPI: ${dpi}`;
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
        } catch (error) {
            console.error('Error updating dimensions display:', error);
        }
    }
    
    // -------------------------------------------------------------------------
    // Fix Functions
    // -------------------------------------------------------------------------
    
    // Fix canvas dimensions for standard views
    function fixStandardViewDimensions() {
        try {
            // Get canvas
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                console.log('Canvas not found, will retry later');
                return false;
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
            
            // Remove combined view classes
            document.body.classList.remove('landscape-view', 'portrait-view');
            
            return true;
        } catch (error) {
            console.error('Error fixing standard view dimensions:', error);
            return false;
        }
    }
    
    // Fix canvas dimensions for landscape view
    function fixLandscapeViewDimensions() {
        try {
            // Prevent recursive calls and flickering
            if (isProcessingLandscape) {
                console.log('⚠️ Already processing landscape view - preventing recursive call');
                return false;
            }
            
            isProcessingLandscape = true;
            
            // Get canvas
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                console.log('Canvas not found, will retry later');
                isProcessingLandscape = false;
                return false;
            }
            
            // Get user dimensions
            const dimensions = getUserDimensions();
            let width = dimensions.width;
            let height = dimensions.height;
            
            // CORRECT LANDSCAPE LOGIC: 3300w x 5100h → 5100w x 3300h (wider than tall)
            // If current dimensions are 3300w x 5100h, swap to 5100w x 3300h
            if (width === 3300 && height === 5100) {
                width = 5100;
                height = 3300;
                console.log(`✅ LANDSCAPE: Swapped 3300w x 5100h → 5100w x 3300h`);
            } else if (width < height) {
                // For any other case where width < height, swap for landscape
                const temp = width;
                width = height;
                height = temp;
                console.log(`✅ LANDSCAPE: Swapped dimensions: ${width}w x ${height}h`);
            }
            
            console.log(`Setting landscape view dimensions: ${width}w x ${height}h`);
            
            // Force canvas dimensions
            canvas.width = width;
            canvas.height = height;
            
            // Update dimensions display with the new dimensions
            updateDimensionsDisplay(width, height);
            
            // Fix canvas style to maintain aspect ratio and ensure landscape appearance
            // Use flex instead of block to allow proper positioning of circles
            canvas.style.width = 'auto';
            canvas.style.height = 'auto';
            canvas.style.maxWidth = '100%';
            canvas.style.maxHeight = '70vh';
            canvas.style.display = 'flex';
            canvas.style.flexDirection = 'row';
            canvas.style.justifyContent = 'center';
            canvas.style.alignItems = 'center';
            canvas.style.margin = '0 auto';
            
            // Force aspect ratio through CSS
            const aspectRatio = width / height;
            canvas.style.aspectRatio = aspectRatio;
            
            // Add landscape class to body
            document.body.classList.remove('portrait-view');
            document.body.classList.add('landscape-view');
            
            // Fix positioning of circles
            fixCombinedViewCirclePositioning('row');
            
            // Reset processing flag after a delay
            setTimeout(() => {
                isProcessingLandscape = false;
            }, 1000);
            
            return true;
        } catch (error) {
            console.error('Error fixing landscape view dimensions:', error);
            isProcessingLandscape = false;
            return false;
        }
    }
    
    // Fix canvas dimensions for portrait view
    function fixPortraitViewDimensions() {
        try {
            // Prevent recursive calls and flickering
            if (isProcessingPortrait) {
                console.log('⚠️ Already processing portrait view - preventing recursive call');
                return false;
            }
            
            isProcessingPortrait = true;
            
            // Get canvas
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                console.log('Canvas not found, will retry later');
                isProcessingPortrait = false;
                return false;
            }
            
            // Get user dimensions
            const dimensions = getUserDimensions();
            let width = dimensions.width;
            let height = dimensions.height;
            
            // CORRECT PORTRAIT LOGIC: 5100w x 3300h → 3300w x 5100h (taller than wide)
            // If current dimensions are 5100w x 3300h, swap to 3300w x 5100h
            if (width === 5100 && height === 3300) {
                width = 3300;
                height = 5100;
                console.log(`✅ PORTRAIT: Swapped 5100w x 3300h → 3300w x 5100h`);
            } else if (height < width) {
                // For any other case where height < width, swap for portrait
                const temp = width;
                width = height;
                height = temp;
                console.log(`✅ PORTRAIT: Swapped dimensions: ${width}w x ${height}h`);
            }
            
            console.log(`Setting portrait view dimensions: ${width}w x ${height}h`);
            
            // Force canvas dimensions
            canvas.width = width;
            canvas.height = height;
            
            // Update dimensions display with the new dimensions
            updateDimensionsDisplay(width, height);
            
            // Fix canvas style to maintain aspect ratio and ensure portrait appearance
            // Use flex instead of block to allow proper positioning of circles
            canvas.style.width = 'auto';
            canvas.style.height = 'auto';
            canvas.style.maxWidth = '100%';
            canvas.style.maxHeight = '70vh';
            canvas.style.display = 'flex';
            canvas.style.flexDirection = 'column';
            canvas.style.justifyContent = 'center';
            canvas.style.alignItems = 'center';
            canvas.style.margin = '0 auto';
            
            // Force aspect ratio through CSS
            const aspectRatio = width / height;
            canvas.style.aspectRatio = aspectRatio;
            
            // Add portrait class to body
            document.body.classList.remove('landscape-view');
            document.body.classList.add('portrait-view');
            
            // Fix positioning of circles
            fixCombinedViewCirclePositioning('column');
            
            // Reset processing flag after a delay
            setTimeout(() => {
                isProcessingPortrait = false;
            }, 1000);
            
            return true;
        } catch (error) {
            console.error('Error fixing portrait view dimensions:', error);
            isProcessingPortrait = false;
            return false;
        }
    }
/* ========================================================================== */
/* ===== END OF PART 1 - CONTINUE TO PART 2 FOR REMAINING CODE ===== */
/* ========================================================================== */

/* ========================================================================== */
/* ===== PART 2 OF 2 - CONTINUATION FROM PART 1 ===== */
/* ========================================================================== */

    // Fix positioning of circles in combined views
    function fixCombinedViewCirclePositioning(direction) {
        try {
            console.log(`Fixing combined view circle positioning (${direction})`);
            
            // Get the canvas
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                console.log('Canvas not found, will retry later');
                return false;
            }
            
            // Set flex direction
            canvas.style.flexDirection = direction;
            
            // Get all direct children of the canvas
            const children = canvas.children;
            if (!children || children.length === 0) {
                console.log('No children found in canvas, will retry later');
                return false;
            }
            
            // Apply centering styles to each child
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (child) {
                    child.style.margin = 'auto';
                    
                    // If this is a circle or has a circle shape
                    if (child.tagName === 'CIRCLE' || 
                        child.classList.contains('circle') || 
                        window.getComputedStyle(child).borderRadius === '50%') {
                        
                        child.style.display = 'block';
                        child.style.margin = 'auto';
                    }
                }
            }
            
            // Apply CSS to center the circles
            applyCombinedViewCSS(direction);
            
            // Update circle overlap based on slider value
            updateCircleOverlap();
            
            return true;
        } catch (error) {
            console.error('Error fixing combined view circle positioning:', error);
            return false;
        }
    }
    
    // Apply CSS for combined views
    function applyCombinedViewCSS(direction) {
        try {
            // Create a style element if it doesn't exist
            let styleElement = document.getElementById('combined-view-positioning-style');
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'combined-view-positioning-style';
                document.head.appendChild(styleElement);
            }
            
            // Add CSS to center the circles
            styleElement.textContent = `
                /* Center circles in combined views */
                #star-map-canvas {
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    position: relative !important;
                    flex-direction: ${direction} !important;
                }
                
                /* Circle elements */
                #star-map-canvas > * {
                    margin: auto !important;
                    position: relative !important;
                }
                
                /* Force circles to be centered */
                #star-map-canvas > div {
                    margin: auto !important;
                }
            `;
        } catch (error) {
            console.error('Error applying combined view CSS:', error);
        }
    }
    
    // Update circle overlap based on slider value
    function updateCircleOverlap() {
        try {
            // Get the overlap slider
            const overlapSlider = document.getElementById('circle-overlap-percent');
            if (!overlapSlider) {
                console.log('Circle overlap slider not found');
                return;
            }
            
            // Set default to 5%
            if (overlapSlider.value === '30') {
                overlapSlider.value = '5';
                
                // Update the display value
                const overlapValue = document.getElementById('overlap-value');
                if (overlapValue) {
                    overlapValue.textContent = '5%';
                }
                
                // Update the combinedViewSettings object
                if (window.combinedViewSettings) {
                    window.combinedViewSettings.overlapPercent = 5;
                }
            }
            
            // Make the slider longer
            overlapSlider.style.width = '100%';
            
            // Apply the overlap value to the circles
            const overlapPercent = parseInt(overlapSlider.value) || 5;
            
            // Get the canvas
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                return;
            }
            
            // Get all direct children of the canvas
            const children = canvas.children;
            if (!children || children.length < 2) {
                return;
            }
            
            // Apply overlap to the circles
            // This is a simplified approach - the actual implementation would depend on how the circles are positioned
            const direction = canvas.style.flexDirection;
            if (direction === 'row') {
                // Landscape mode - circles side by side
                // Apply overlap horizontally
                for (let i = 1; i < children.length; i++) {
                    const child = children[i];
                    if (child) {
                        child.style.marginLeft = `-${overlapPercent}%`;
                    }
                }
            } else {
                // Portrait mode - circles stacked
                // Apply overlap vertically
                for (let i = 1; i < children.length; i++) {
                    const child = children[i];
                    if (child) {
                        child.style.marginTop = `-${overlapPercent}%`;
                    }
                }
            }
        } catch (error) {
            console.error('Error updating circle overlap:', error);
        }
    }
    
    // -------------------------------------------------------------------------
    // Hook into existing functionality
    // -------------------------------------------------------------------------
    
    // Hook into view functions
    function hookIntoViewFunctions() {
        try {
            // Star Map view
            const originalViewStarMap = window.viewStarMap;
            if (originalViewStarMap) {
                window.viewStarMap = function() {
                    console.log('Star Map view called');
                    
                    // Reset any previous view state
                    currentView = 'star-map';
                    
                    // Remove view-specific classes
                    document.body.classList.remove('landscape-view', 'portrait-view');
                    
                    // Call original function
                    originalViewStarMap.apply(this, arguments);
                    
                    // Fix dimensions immediately and after a delay
                    fixStandardViewDimensions();
                    setTimeout(fixStandardViewDimensions, 300);
                    setTimeout(fixStandardViewDimensions, 600);
                    
                    // Protect this view from being affected by other views
                    protectView('star-map');
                };
            }
            
            // Street Map view
            const originalViewStreetMap = window.viewStreetMap;
            if (originalViewStreetMap) {
                window.viewStreetMap = function() {
                    console.log('Street Map view called');
                    
                    // Reset any previous view state
                    currentView = 'street-map';
                    
                    // Remove view-specific classes
                    document.body.classList.remove('landscape-view', 'portrait-view');
                    
                    // Call original function
                    originalViewStreetMap.apply(this, arguments);
                    
                    // Fix dimensions immediately and after a delay
                    fixStandardViewDimensions();
                    setTimeout(fixStandardViewDimensions, 300);
                    setTimeout(fixStandardViewDimensions, 600);
                    
                    // Protect this view from being affected by other views
                    protectView('street-map');
                };
            }
            
            // Canvas Layout view
            const originalViewCanvasLayout = window.viewCanvasLayout;
            if (originalViewCanvasLayout) {
                window.viewCanvasLayout = function() {
                    console.log('Canvas Layout view called');
                    
                    // Reset any previous view state
                    currentView = 'canvas-layout';
                    
                    // Remove view-specific classes
                    document.body.classList.remove('landscape-view', 'portrait-view');
                    
                    // Call original function
                    originalViewCanvasLayout.apply(this, arguments);
                    
                    // Fix dimensions immediately and after a delay
                    // Use original dimensions to ensure correct canvas shape
                    fixCanvasLayoutDimensions();
                    setTimeout(fixCanvasLayoutDimensions, 300);
                    setTimeout(fixCanvasLayoutDimensions, 600);
                };
            }
            
            // Combined Landscape view
            const originalViewStarStreetLandscape = window.viewStarStreetLandscape;
            if (originalViewStarStreetLandscape) {
                window.viewStarStreetLandscape = function() {
                    console.log('🌄 Combined Landscape view called');
                    
                    // Set current view
                    currentView = 'landscape';
                    
                    // Add landscape class to body
                    document.body.classList.remove('portrait-view');
                    document.body.classList.add('landscape-view');
                    
                    // DON'T call original function - it causes flickering
                    // originalViewStarStreetLandscape.apply(this, arguments);
                    
                    // Fix dimensions and positioning ONCE only - no multiple setTimeout calls
                    fixLandscapeViewDimensions();
                    
                    // Apply combined view CSS
                    applyCombinedViewCSS('row');
                    
                    // Update circle overlap once
                    updateCircleOverlap();
                };
            }
            
            // Combined Portrait view
            const originalViewStarStreetPortrait = window.viewStarStreetPortrait;
            if (originalViewStarStreetPortrait) {
                window.viewStarStreetPortrait = function() {
                    console.log('📱 Combined Portrait view called');
                    
                    // Set current view
                    currentView = 'portrait';
                    
                    // Add portrait class to body
                    document.body.classList.remove('landscape-view');
                    document.body.classList.add('portrait-view');
                    
                    // DON'T call original function - it causes flickering
                    // originalViewStarStreetPortrait.apply(this, arguments);
                    
                    // Fix dimensions and positioning ONCE only - no multiple setTimeout calls
                    fixPortraitViewDimensions();
                    
                    // Apply combined view CSS
                    applyCombinedViewCSS('column');
                    
                    // Update circle overlap once
                    updateCircleOverlap();
                };
            }
            
            return true;
        } catch (error) {
            console.error('Error hooking into view functions:', error);
            return false;
        }
    }
    
    // Fix Canvas Layout dimensions
    function fixCanvasLayoutDimensions() {
        try {
            // Get canvas
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                console.log('Canvas not found, will retry later');
                return false;
            }
            
            // Get user dimensions - use original dimensions to ensure correct canvas shape
            const dimensions = getUserDimensions();
            const width = dimensions.width;
            const height = dimensions.height;
            
            console.log(`Setting canvas layout dimensions: ${width}w x ${height}h`);
            
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
            
            // Force aspect ratio through CSS for portrait (taller than wide)
            const aspectRatio = width / height;
            canvas.style.aspectRatio = `${width} / ${height}`;
            
            // Force portrait canvas shape with CSS
            canvas.style.width = `${Math.min(400, width * 0.3)}px`;
            canvas.style.height = 'auto';
            
            return true;
        } catch (error) {
            console.error('Error fixing canvas layout dimensions:', error);
            return false;
        }
    }
    
    // Protect view from being affected by other views
    function protectView(viewName) {
        try {
            // Get canvas
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                return;
            }
            
            // Store the current dimensions for this view
            const viewDimensions = {
                width: canvas.width,
                height: canvas.height,
                aspectRatio: canvas.width / canvas.height
            };
            
            // Store the view dimensions
            window[`${viewName}Dimensions`] = viewDimensions;
            
            console.log(`Protected ${viewName} view with dimensions: ${viewDimensions.width}w x ${viewDimensions.height}h`);
        } catch (error) {
            console.error(`Error protecting ${viewName} view:`, error);
        }
    }
    
    // Listen for dimension changes
    function listenForDimensionChanges() {
        try {
            const widthInput = document.getElementById('width') || document.getElementById('output-width');
            const heightInput = document.getElementById('height') || document.getElementById('output-height');
            
            if (widthInput) {
                widthInput.addEventListener('change', function() {
                    console.log('Width changed to:', widthInput.value);
                    
                    // Update original dimensions
                    originalDimensions.width = parseInt(widthInput.value);
                    
                    // Determine which fix to apply based on the current view
                    determineAndApplyFix();
                });
            }
            
            if (heightInput) {
                heightInput.addEventListener('change', function() {
                    console.log('Height changed to:', heightInput.value);
                    
                    // Update original dimensions
                    originalDimensions.height = parseInt(heightInput.value);
                    
                    // Determine which fix to apply based on the current view
                    determineAndApplyFix();
                });
            }
            
            return true;
        } catch (error) {
            console.error('Error listening for dimension changes:', error);
            return false;
        }
    }
    
    // Determine which fix to apply based on the current view
    function determineAndApplyFix() {
        try {
            console.log('Determining which fix to apply for current view:', currentView);
            
            switch (currentView) {
                case 'landscape':
                    fixLandscapeViewDimensions();
                    break;
                case 'portrait':
                    fixPortraitViewDimensions();
                    break;
                case 'star-map':
                case 'street-map':
                case 'canvas-layout':
                case 'standard':
                default:
                    fixStandardViewDimensions();
                    break;
            }
            
            return true;
        } catch (error) {
            console.error('Error determining which fix to apply:', error);
            return false;
        }
    }
    
    // DPI change handler
    function dpiChangeHandler() {
        try {
            console.log('DPI changed to:', this.value);
            
            // Update dimensions display
            const dimensions = getUserDimensions();
            updateDimensionsDisplay(dimensions.width, dimensions.height);
            
            return true;
        } catch (error) {
            console.error('Error handling DPI change:', error);
            return false;
        }
    }
    
    // Listen for paper size changes
    function listenForPaperSizeChanges() {
        try {
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
                
                // Update original dimensions
                if (event.detail && event.detail.width && event.detail.height) {
                    originalDimensions.width = event.detail.width;
                    originalDimensions.height = event.detail.height;
                }
                
                // Force update based on current view
                determineAndApplyFix();
            });
            
            // Also listen for direct changes to the width and height inputs
            const widthInput = document.getElementById('width') || document.getElementById('output-width');
            const heightInput = document.getElementById('height') || document.getElementById('output-height');
            
            if (widthInput) {
                widthInput.addEventListener('input', function() {
                    console.log('Width input changed to:', this.value);
                    
                    // Update original dimensions
                    originalDimensions.width = parseInt(this.value);
                    
                    // Force update based on current view after a short delay
                    setTimeout(function() {
                        determineAndApplyFix();
                    }, 100);
                });
            }
            
            if (heightInput) {
                heightInput.addEventListener('input', function() {
                    console.log('Height input changed to:', this.value);
                    
                    // Update original dimensions
                    originalDimensions.height = parseInt(this.value);
                    
                    // Force update based on current view after a short delay
                    setTimeout(function() {
                        determineAndApplyFix();
                    }, 100);
                });
            }
            
            // Listen for circle overlap slider changes
            const overlapSlider = document.getElementById('circle-overlap-percent');
            if (overlapSlider) {
                // Set default to 5%
                overlapSlider.value = '5';
                
                // Update the display value
                const overlapValue = document.getElementById('overlap-value');
                if (overlapValue) {
                    overlapValue.textContent = '5%';
                }
                
                // Update the combinedViewSettings object
                if (window.combinedViewSettings) {
                    window.combinedViewSettings.overlapPercent = 5;
                }
                
                // Make the slider longer
                overlapSlider.style.width = '100%';
                
                // Add change listener
                overlapSlider.addEventListener('input', function() {
                    const value = parseInt(this.value);
                    
                    // Update the display value
                    const overlapValue = document.getElementById('overlap-value');
                    if (overlapValue) {
                        overlapValue.textContent = value + '%';
                    }
                    
                    // Update the combinedViewSettings object
                    if (window.combinedViewSettings) {
                        window.combinedViewSettings.overlapPercent = value;
                    }
                    
                    // Apply the overlap value to the circles
                    updateCircleOverlap();
                });
            }
            
            // Add change listener for map order radios
            const mapOrderRadios = document.querySelectorAll('input[name="map-order"]');
            mapOrderRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    // Update the combinedViewSettings object
                    if (window.combinedViewSettings) {
                        window.combinedViewSettings.streetMapFirst = (this.value === 'street-first');
                    }
                    
                    // Reapply the current view fix
                    if (currentView === 'landscape') {
                        fixLandscapeViewDimensions();
                    } else if (currentView === 'portrait') {
                        fixPortraitViewDimensions();
                    }
                });
            });
            
            return true;
        } catch (error) {
            console.error('Error listening for paper size changes:', error);
            return false;
        }
    }
    
    // Paper size change handler
    function paperSizeChangeHandler() {
        try {
            console.log('Paper size changed to:', this.value);
            
            // Wait for the width and height to be updated by paper-size-dimensions.js
            setTimeout(function() {
                console.log('Applying fix after paper size change');
                
                // Force update based on current view
                determineAndApplyFix();
                
                // Apply again after longer delays to ensure it takes effect
                setTimeout(determineAndApplyFix, 500);
                setTimeout(determineAndApplyFix, 1000);
            }, 100);
            
            return true;
        } catch (error) {
            console.error('Error handling paper size change:', error);
            return false;
        }
    }
    
    // Define the initialize function
    function initialize() {
        console.log('Initializing dimensions-fix-v2.js');
        
        // Hook into view functions first
        hookIntoViewFunctions();
        
        // Set up event listeners
        listenForDimensionChanges();
        listenForPaperSizeChanges();
        
        // Apply initial fixes
        determineAndApplyFix();
        
        // Apply initial fix once
        // setTimeout calls removed to prevent flickering
        
        // Mark as initialized
        initialized = true;
        
        console.log('dimensions-fix-v2.js initialized successfully');
    }
    
    // Initialize when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded, initialize immediately
        initialize();
    }
    
})();

/* END OF CODE - Cline - 2025-06-20 11:33 File: js/dimensions-fix-v2.js */
