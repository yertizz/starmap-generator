/* START OF CODE - Cline - 2025-05-31 9:50 PM File: js/combined-view-text-fix.js */

/**
 * Combined View Text Fix
 * 
 * This script fixes specific issues with combined views:
 * 1. Missing text overlays in combined views
 * 2. Flickering/overwriting issues in combined views
 * 3. Canvas dimensions annotation not updating correctly
 */

(function() {
    console.log('Combined View Text Fix - Initializing');
    
    // Store text overlay elements
    let textOverlays = {
        title: null,
        date: null,
        quote: null,
        location: null,
        coordinates: null,
        footer: null
    };
    
    // Flag to prevent recursive calls
    let isProcessing = false;
    
    // Remove any existing canvas dimensions display
    function removeExistingDimensionsDisplay() {
        // Find all elements that might be dimensions displays
        const existingDisplays = document.querySelectorAll('.canvas-dimensions-display, #canvas-dimensions-display, [id^="canvas-dimensions"]');
        existingDisplays.forEach(el => {
            if (el.parentNode) {
                console.log('Removing existing dimensions display:', el.id || el.className);
                el.parentNode.removeChild(el);
            }
        });
        
        // Also remove any elements that contain "Canvas Dimensions" text
        document.querySelectorAll('div, p, span').forEach(el => {
            if (el.textContent && el.textContent.includes('Canvas Dimensions') && 
                !el.classList.contains('canvas-container')) {
                if (el.parentNode) {
                    console.log('Removing element with Canvas Dimensions text:', el.textContent);
                    el.parentNode.removeChild(el);
                }
            }
        });
    }
    
    // Capture text overlays when star map is generated
    const originalViewStarMap = window.viewStarMap;
    if (originalViewStarMap) {
        window.viewStarMap = function() {
            // Prevent recursive calls
            if (isProcessing) {
                console.log('Preventing recursive star map generation');
                return;
            }
            
            isProcessing = true;
            
            try {
                // Remove existing dimensions display
                removeExistingDimensionsDisplay();
                
                // Call original function
                originalViewStarMap.apply(this, arguments);
                
                // After a delay to ensure everything is loaded
                setTimeout(() => {
                    // Capture text overlays
                    captureTextOverlays();
                    
                    // Update canvas dimensions display
                    updateCanvasDimensionsDisplay();
                    
                    isProcessing = false;
                }, 1000);
            } catch (error) {
                console.error('Error in star map view:', error);
                isProcessing = false;
            }
        };
    }
    
    // Capture text overlays when street map is generated
    const originalViewStreetMap = window.viewStreetMap;
    if (originalViewStreetMap) {
        window.viewStreetMap = function() {
            // Prevent recursive calls
            if (isProcessing) {
                console.log('Preventing recursive street map generation');
                return;
            }
            
            isProcessing = true;
            
            try {
                // Remove existing dimensions display
                removeExistingDimensionsDisplay();
                
                // Call original function
                originalViewStreetMap.apply(this, arguments);
                
                // After a delay to ensure everything is loaded
                setTimeout(() => {
                    // Update canvas dimensions display
                    updateCanvasDimensionsDisplay();
                    
                    isProcessing = false;
                }, 1000);
            } catch (error) {
                console.error('Error in street map view:', error);
                isProcessing = false;
            }
        };
    }
    
    // Function to capture text overlays
    function captureTextOverlays() {
        const titleElement = document.querySelector('.title-text');
        const dateElement = document.querySelector('.date-text');
        const quoteElement = document.querySelector('.quote-text');
        const locationElement = document.querySelector('.location-text');
        const coordinatesElement = document.querySelector('.coordinates-text');
        const footerElement = document.querySelector('.footer-text');
        
        if (titleElement) textOverlays.title = cloneElement(titleElement);
        if (dateElement) textOverlays.date = cloneElement(dateElement);
        if (quoteElement) textOverlays.quote = cloneElement(quoteElement);
        if (locationElement) textOverlays.location = cloneElement(locationElement);
        if (coordinatesElement) textOverlays.coordinates = cloneElement(coordinatesElement);
        if (footerElement) textOverlays.footer = cloneElement(footerElement);
        
        console.log('Text overlays captured');
    }
    
    // Helper function to clone an element with its styles
    function cloneElement(element) {
        const clone = element.cloneNode(true);
        const computedStyle = window.getComputedStyle(element);
        
        // Copy computed styles
        for (let i = 0; i < computedStyle.length; i++) {
            const prop = computedStyle[i];
            clone.style[prop] = computedStyle.getPropertyValue(prop);
        }
        
        return {
            element: clone,
            text: element.textContent,
            className: element.className,
            style: element.getAttribute('style') || ''
        };
    }
    
    // Fix combined landscape view
    const originalViewStarStreetLandscape = window.viewStarStreetLandscape;
    if (originalViewStarStreetLandscape) {
        window.viewStarStreetLandscape = function() {
            // Prevent recursive calls
            if (isProcessing) {
                console.log('Preventing recursive combined landscape view');
                return;
            }
            
            isProcessing = true;
            
            try {
                // Remove existing dimensions display
                removeExistingDimensionsDisplay();
                
                // Get canvas dimensions before calling original function
                const canvas = document.getElementById('star-map-canvas');
                let width, height;
                
                // Get dimensions from input fields
                const widthInput = document.getElementById('width');
                const heightInput = document.getElementById('height');
                
                if (widthInput && heightInput && widthInput.value && heightInput.value) {
                    width = parseInt(widthInput.value);
                    height = parseInt(heightInput.value);
                } else {
                    // Default dimensions
                    width = 2550;
                    height = 3300;
                }
                
                // For landscape, ensure width > height
                if (width < height) {
                    [width, height] = [height, width];
                }
                
                // Force landscape orientation
                if (canvas) {
                    canvas.width = width;
                    canvas.height = height;
                }
                
                // Call original function
                originalViewStarStreetLandscape.apply(this, arguments);
                
                // After a delay to ensure everything is loaded
                setTimeout(() => {
                    // Force landscape dimensions again to ensure they're set correctly
                    if (canvas) {
                        canvas.width = width;
                        canvas.height = height;
                    }
                    
                    // Update canvas dimensions display for landscape
                    updateCanvasDimensionsDisplay(true);
                    
                    // Restore text overlays
                    restoreTextOverlays();
                    
                    isProcessing = false;
                }, 1000);
            } catch (error) {
                console.error('Error in combined landscape view:', error);
                isProcessing = false;
            }
        };
    }
    
    // Fix combined portrait view
    const originalViewStarStreetPortrait = window.viewStarStreetPortrait;
    if (originalViewStarStreetPortrait) {
        window.viewStarStreetPortrait = function() {
            // Prevent recursive calls
            if (isProcessing) {
                console.log('Preventing recursive combined portrait view');
                return;
            }
            
            isProcessing = true;
            
            try {
                // Remove existing dimensions display
                removeExistingDimensionsDisplay();
                
                // Get canvas dimensions before calling original function
                const canvas = document.getElementById('star-map-canvas');
                let width, height;
                
                // Get dimensions from input fields
                const widthInput = document.getElementById('width');
                const heightInput = document.getElementById('height');
                
                if (widthInput && heightInput && widthInput.value && heightInput.value) {
                    width = parseInt(widthInput.value);
                    height = parseInt(heightInput.value);
                } else {
                    // Default dimensions
                    width = 2550;
                    height = 3300;
                }
                
                // For portrait, ensure height > width
                if (height < width) {
                    [width, height] = [height, width];
                }
                
                // Force portrait orientation
                if (canvas) {
                    canvas.width = width;
                    canvas.height = height;
                }
                
                // Call original function
                originalViewStarStreetPortrait.apply(this, arguments);
                
                // After a delay to ensure everything is loaded
                setTimeout(() => {
                    // Force portrait dimensions again to ensure they're set correctly
                    if (canvas) {
                        canvas.width = width;
                        canvas.height = height;
                    }
                    
                    // Update canvas dimensions display for portrait
                    updateCanvasDimensionsDisplay(false);
                    
                    // Restore text overlays
                    restoreTextOverlays();
                    
                    isProcessing = false;
                }, 1000);
            } catch (error) {
                console.error('Error in combined portrait view:', error);
                isProcessing = false;
            }
        };
    }
    
    // Fix canvas layout view
    const originalViewCanvasLayout = window.viewCanvasLayout;
    if (originalViewCanvasLayout) {
        window.viewCanvasLayout = function() {
            // Prevent recursive calls
            if (isProcessing) {
                console.log('Preventing recursive canvas layout view');
                return;
            }
            
            isProcessing = true;
            
            try {
                // Remove existing dimensions display
                removeExistingDimensionsDisplay();
                
                // Call original function
                originalViewCanvasLayout.apply(this, arguments);
                
                // After a delay to ensure everything is loaded
                setTimeout(() => {
                    // Update canvas dimensions display
                    updateCanvasDimensionsDisplay();
                    
                    isProcessing = false;
                }, 1000);
            } catch (error) {
                console.error('Error in canvas layout view:', error);
                isProcessing = false;
            }
        };
    }
    
    // Function to restore text overlays
    function restoreTextOverlays() {
        // Remove any existing text overlays
        document.querySelectorAll('.title-text, .date-text, .quote-text, .location-text, .coordinates-text, .footer-text').forEach(el => {
            if (el.parentNode) el.parentNode.removeChild(el);
        });
        
        // Find the canvas container
        const canvasContainer = document.querySelector('.canvas-container');
        if (!canvasContainer) return;
        
        // Restore each text overlay
        if (textOverlays.title) appendOverlay(canvasContainer, textOverlays.title);
        if (textOverlays.date) appendOverlay(canvasContainer, textOverlays.date);
        if (textOverlays.quote) appendOverlay(canvasContainer, textOverlays.quote);
        if (textOverlays.location) appendOverlay(canvasContainer, textOverlays.location);
        if (textOverlays.coordinates) appendOverlay(canvasContainer, textOverlays.coordinates);
        if (textOverlays.footer) appendOverlay(canvasContainer, textOverlays.footer);
        
        console.log('Text overlays restored');
        
        // Make sure they stay visible
        setTimeout(() => {
            document.querySelectorAll('.title-text, .date-text, .quote-text, .location-text, .coordinates-text, .footer-text').forEach(el => {
                el.style.display = 'block';
                el.style.visibility = 'visible';
                el.style.opacity = '1';
            });
        }, 500);
    }
    
    // Helper function to append an overlay to the container
    function appendOverlay(container, overlay) {
        const element = overlay.element.cloneNode(true);
        element.textContent = overlay.text;
        element.className = overlay.className;
        if (overlay.style) element.setAttribute('style', overlay.style);
        
        // Ensure visibility
        element.style.display = 'block';
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        
        container.appendChild(element);
    }
    
    // Function to update canvas dimensions display
    function updateCanvasDimensionsDisplay(isLandscape) {
        // Remove any existing dimensions display first
        removeExistingDimensionsDisplay();
        
        // Get canvas dimensions
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) return;
        
        // Get dimensions from input fields
        const widthInput = document.getElementById('width');
        const heightInput = document.getElementById('height');
        
        let width, height;
        if (widthInput && heightInput && widthInput.value && heightInput.value) {
            width = parseInt(widthInput.value);
            height = parseInt(heightInput.value);
        } else {
            // Use canvas dimensions
            width = canvas.width;
            height = canvas.height;
        }
        
        // Adjust dimensions based on orientation if specified
        if (isLandscape === true) {
            // Force landscape orientation (width > height)
            if (width < height) {
                [width, height] = [height, width];
            }
        } else if (isLandscape === false) {
            // Force portrait orientation (height > width)
            if (height < width) {
                [width, height] = [height, width];
            }
        }
        
        // Create the display element
        const dimensionsDisplay = document.createElement('div');
        dimensionsDisplay.className = 'canvas-dimensions-display';
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
        `;
        
        // Find where to insert it
        const zoomContainer = document.getElementById('zoom-container');
        const canvasContainer = document.querySelector('.canvas-container');
        
        if (zoomContainer && zoomContainer.parentNode) {
            zoomContainer.parentNode.insertBefore(dimensionsDisplay, zoomContainer.nextSibling);
        } else if (canvasContainer && canvasContainer.parentNode) {
            canvasContainer.parentNode.insertBefore(dimensionsDisplay, canvasContainer);
        } else {
            // If we can't find a good place, just append to body
            document.body.appendChild(dimensionsDisplay);
        }
        
        // Format dimensions text
        let dimensionsText;
        
        // Check if paper size is selected
        const paperSizeSelect = document.getElementById('paper-auto-size');
        if (paperSizeSelect && paperSizeSelect.value && paperSizeSelect.value !== 'default' && paperSizeSelect.value !== 'Select A Paper Size...') {
            const paperSize = paperSizeSelect.value;
            const dpiSelect = document.getElementById('dpi');
            const dpi = dpiSelect ? dpiSelect.value : '300';
            
            dimensionsText = `Paper: ${paperSize} | DPI: ${dpi} | Dimensions: ${width}w x ${height}h pixels`;
        } else {
            dimensionsText = `Dimensions: ${width}w x ${height}h pixels`;
        }
        
        // Update the display
        dimensionsDisplay.textContent = dimensionsText;
        console.log('Canvas dimensions display updated:', dimensionsText);
    }
    
    // Listen for paper size changes
    const paperSizeSelect = document.getElementById('paper-auto-size');
    if (paperSizeSelect) {
        paperSizeSelect.addEventListener('change', function() {
            // Remove existing dimensions display
            removeExistingDimensionsDisplay();
            
            // Update canvas dimensions display
            updateCanvasDimensionsDisplay();
        });
    }
    
    // Listen for DPI changes
    const dpiSelect = document.getElementById('dpi');
    if (dpiSelect) {
        dpiSelect.addEventListener('change', function() {
            // Remove existing dimensions display
            removeExistingDimensionsDisplay();
            
            // Update canvas dimensions display
            updateCanvasDimensionsDisplay();
        });
    }
    
    // Listen for manual dimension changes
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    
    if (widthInput) {
        widthInput.addEventListener('change', function() {
            // Remove existing dimensions display
            removeExistingDimensionsDisplay();
            
            // Update canvas dimensions display
            updateCanvasDimensionsDisplay();
        });
    }
    
    if (heightInput) {
        heightInput.addEventListener('change', function() {
            // Remove existing dimensions display
            removeExistingDimensionsDisplay();
            
            // Update canvas dimensions display
            updateCanvasDimensionsDisplay();
        });
    }
    
    // Initialize
    setTimeout(function() {
        // Remove existing dimensions display
        removeExistingDimensionsDisplay();
        
        // Update canvas dimensions display
        updateCanvasDimensionsDisplay();
        
        // Handle any open modals
        const modals = document.querySelectorAll('.modal, .custom-alert, .custom-modal');
        modals.forEach(modal => {
            const okButton = modal.querySelector('button, .ok-button, .btn-primary');
            if (okButton) {
                console.log('Automatically closing modal dialog');
                okButton.click();
            }
        });
    }, 1000);
    
    console.log('Combined View Text Fix - Initialized');
})();

/* END OF CODE - Cline - 2025-05-31 9:50 PM File: js/combined-view-text-fix.js */
