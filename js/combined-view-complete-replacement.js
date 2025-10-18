/* START OF CODE - Cline - 2025-06-01 10:58 AM File: js/combined-view-complete-replacement.js */

/**
 * Combined View Complete Replacement - FINAL VERSION
 * 
 * This script completely replaces the combined view functionality with a new implementation.
 * It does NOT modify or call the original functions, but instead implements the combined views
 * from scratch using direct canvas manipulation.
 * 
 * FIXES:
 * - Properly respects user's input dimensions
 * - Ensures canvas dimensions annotation appears and shows correct dimensions
 * - Prevents random elements from appearing
 * - Improves modal dialog handling
 * - Fixes Canvas Layout view to maintain portrait shape
 * - Fixes paper size selection handling
 */

(function() {
    console.log('Combined View Complete Replacement - FINAL VERSION - Initializing');
    
    // Store captured images
    let starMapImage = null;
    let streetMapImage = null;
    
    // Store text overlay content
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
    
    // Configuration
    const config = {
        // Default circle settings
        defaultRadiusPercent: 60,
        defaultBorderWidth: 2,
        defaultBorderColor: '#FDCA0D',
        defaultBackgroundColor: '#1D1D4D',
        // Positioning
        landscapePositions: {
            left: { xFactor: 0.3, yFactor: 0.5 },
            right: { xFactor: 0.7, yFactor: 0.5 }
        },
        portraitPositions: {
            top: { xFactor: 0.5, yFactor: 0.3 },
            bottom: { xFactor: 0.5, yFactor: 0.7 }
        }
    };
    
    // -------------------------------------------------------------------------
    // Utility Functions
    // -------------------------------------------------------------------------
    
    // Logging utility
    function log(message, type = 'info') {
        const prefix = '🔄 COMBINED VIEW REPLACEMENT: ';
        
        switch (type) {
            case 'error':
                console.error(prefix + message);
                break;
            case 'warn':
                console.warn(prefix + message);
                break;
            case 'success':
                console.log('%c' + prefix + message, 'color: green; font-weight: bold;');
                break;
            default:
                console.log(prefix + message);
        }
    }
    
    // Remove any existing canvas dimensions display
    function removeExistingDimensionsDisplay() {
        // Find all elements that might be dimensions displays
        const existingDisplays = document.querySelectorAll('.canvas-dimensions-display, #canvas-dimensions-display, [id^="canvas-dimensions"]');
        existingDisplays.forEach(el => {
            if (el.parentNode) {
                log('Removing existing dimensions display: ' + (el.id || el.className));
                el.parentNode.removeChild(el);
            }
        });
        
        // Also remove any elements that contain "Canvas Dimensions" text
        document.querySelectorAll('div, p, span').forEach(el => {
            if (el.textContent && el.textContent.includes('Canvas Dimensions') && 
                !el.classList.contains('canvas-container')) {
                if (el.parentNode) {
                    log('Removing element with Canvas Dimensions text: ' + el.textContent);
                    el.parentNode.removeChild(el);
                }
            }
        });
        
        // Also remove any elements that contain "Dimensions:" text
        document.querySelectorAll('div, p, span').forEach(el => {
            if (el.textContent && el.textContent.includes('Dimensions:') && 
                !el.classList.contains('canvas-container')) {
                if (el.parentNode) {
                    log('Removing element with Dimensions: text: ' + el.textContent);
                    el.parentNode.removeChild(el);
                }
            }
        });
    }
    
    // Capture text overlays
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
        
        log('Text overlays captured');
    }
    
    // Clone an element with its styles
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
            style: element.getAttribute('style') || '',
            computedStyle: computedStyle
        };
    }
    
    // Restore text overlays
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
        
        log('Text overlays restored');
    }
    
    // Append an overlay to the container
    function appendOverlay(container, overlay) {
        const element = document.createElement('div');
        element.textContent = overlay.text;
        element.className = overlay.className;
        
        // Apply styles
        if (overlay.style) element.setAttribute('style', overlay.style);
        
        // Ensure visibility
        element.style.display = 'block';
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        element.style.position = 'absolute';
        
        // Apply position from computed style if available
        if (overlay.computedStyle) {
            element.style.top = overlay.computedStyle.top;
            element.style.left = overlay.computedStyle.left;
            element.style.transform = overlay.computedStyle.transform;
            element.style.textAlign = overlay.computedStyle.textAlign;
            element.style.width = overlay.computedStyle.width;
            element.style.color = overlay.computedStyle.color;
            element.style.fontFamily = overlay.computedStyle.fontFamily;
            element.style.fontSize = overlay.computedStyle.fontSize;
            element.style.fontWeight = overlay.computedStyle.fontWeight;
        }
        
        container.appendChild(element);
    }
    
    // Update canvas dimensions display
    function updateCanvasDimensionsDisplay(width, height, isLandscape) {
        // Remove any existing dimensions display first
        removeExistingDimensionsDisplay();
        
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
            max-width: 100%;
            box-sizing: border-box;
            z-index: 9999;
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
        log('Canvas dimensions display updated: ' + dimensionsText);
        
        // Force the display to be visible
        setTimeout(() => {
            dimensionsDisplay.style.display = 'block';
            dimensionsDisplay.style.visibility = 'visible';
            dimensionsDisplay.style.opacity = '1';
        }, 100);
    }
    
    // Handle modal dialogs
    function handleModal() {
        // Find any open modals
        const modals = document.querySelectorAll('.modal, .custom-alert, .custom-modal');
        modals.forEach(modal => {
            // Find the OK button
            const okButton = modal.querySelector('button, .ok-button, .btn-primary');
            if (okButton) {
                log('Automatically closing modal dialog');
                okButton.click();
            }
            
            // If we couldn't find an OK button, try to remove the modal directly
            if (modal.parentNode) {
                log('Removing modal dialog directly');
                modal.parentNode.removeChild(modal);
            }
        });
        
        // Also remove any elements with "Computing star map" text
        document.querySelectorAll('div, p, span').forEach(el => {
            if (el.textContent && el.textContent.includes('Computing star map')) {
                if (el.parentNode) {
                    log('Removing computing star map message: ' + el.textContent);
                    el.parentNode.removeChild(el);
                }
            }
        });
    }
    
    // Get user dimensions
    function getUserDimensions() {
        // Get dimensions from input fields
        const widthInput = document.getElementById('width');
        const heightInput = document.getElementById('height');
        
        let width, height;
        if (widthInput && heightInput && widthInput.value && heightInput.value) {
            width = parseInt(widthInput.value);
            height = parseInt(heightInput.value);
            log(`Got user dimensions: ${width}x${height}`);
        } else {
            // Default dimensions
            width = 2550;
            height = 3300;
            log(`Using default dimensions: ${width}x${height}`);
        }
        
        return { width, height };
    }
    
    // Listen for paper size changes
    function setupPaperSizeListener() {
        const paperSizeSelect = document.getElementById('paper-auto-size');
        if (paperSizeSelect) {
            paperSizeSelect.addEventListener('change', function() {
                log('Paper size changed to: ' + paperSizeSelect.value);
                
                // Get the current dimensions
                const dimensions = getUserDimensions();
                
                // Update the canvas dimensions display
                updateCanvasDimensionsDisplay(dimensions.width, dimensions.height);
            });
        }
        
        // Also listen for width and height input changes
        const widthInput = document.getElementById('width');
        const heightInput = document.getElementById('height');
        
        if (widthInput) {
            widthInput.addEventListener('change', function() {
                log('Width changed to: ' + widthInput.value);
                
                // Get the current dimensions
                const dimensions = getUserDimensions();
                
                // Update the canvas dimensions display
                updateCanvasDimensionsDisplay(dimensions.width, dimensions.height);
            });
        }
        
        if (heightInput) {
            heightInput.addEventListener('change', function() {
                log('Height changed to: ' + heightInput.value);
                
                // Get the current dimensions
                const dimensions = getUserDimensions();
                
                // Update the canvas dimensions display
                updateCanvasDimensionsDisplay(dimensions.width, dimensions.height);
            });
        }
    }
    
    // -------------------------------------------------------------------------
    // Image Capture Functions
    // -------------------------------------------------------------------------
    
    // Capture star map image
    function captureStarMapImage() {
        // Find the star map image
        const img = document.querySelector('.star-map-circle img');
        if (img) {
            // Create a new Image object to ensure it's fully loaded
            const newImg = new Image();
            newImg.crossOrigin = "Anonymous";
            newImg.onload = function() {
                starMapImage = newImg;
                log('Star map image captured', 'success');
                
                // Also capture text overlays
                captureTextOverlays();
            };
            newImg.src = img.src;
            
            return true;
        } else {
            log('Star map image not found', 'warn');
            return false;
        }
    }
    
    // Capture street map image
    function captureStreetMapImage() {
        // Find the street map image
        const img = document.querySelector('.street-map-circle img');
        if (img) {
            // Create a new Image object to ensure it's fully loaded
            const newImg = new Image();
            newImg.crossOrigin = "Anonymous";
            newImg.onload = function() {
                streetMapImage = newImg;
                log('Street map image captured', 'success');
            };
            newImg.src = img.src;
            
            return true;
        } else {
            log('Street map image not found', 'warn');
            return false;
        }
    }
    
    // -------------------------------------------------------------------------
    // Combined View Functions
    // -------------------------------------------------------------------------
    
    // Draw combined landscape view
    function drawCombinedLandscapeView() {
        if (isProcessing) {
            log('Already processing combined landscape view', 'warn');
            return;
        }
        
        isProcessing = true;
        log('Drawing combined landscape view');
        
        try {
            // Handle any modal dialogs first
            handleModal();
            
            // Check if we have both images
            if (!starMapImage || !streetMapImage) {
                log('Map images not available, generating them first', 'warn');
                
                // Generate star map if needed
                if (!starMapImage) {
                    const starMapBtn = document.getElementById('view-star-map-btn');
                    if (starMapBtn) {
                        starMapBtn.click();
                        log('Generated star map');
                    }
                }
                
                // Generate street map if needed
                if (!streetMapImage) {
                    const streetMapBtn = document.getElementById('view-street-map-btn');
                    if (streetMapBtn) {
                        streetMapBtn.click();
                        log('Generated street map');
                    }
                }
                
                // Try again after a delay
                setTimeout(() => {
                    isProcessing = false;
                    drawCombinedLandscapeView();
                }, 1500);
                return;
            }
            
            // Get canvas and context
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                log('Canvas not found', 'error');
                isProcessing = false;
                return;
            }
            
            const ctx = canvas.getContext('2d');
            
            // Get user dimensions
            const dimensions = getUserDimensions();
            let width = dimensions.width;
            let height = dimensions.height;
            
            // For landscape, ensure width > height
            if (width < height) {
                // Swap dimensions for landscape
                width = dimensions.height;
                height = dimensions.width;
                log(`Swapped dimensions for landscape: ${width}x${height}`);
            }
            
            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;
            log(`Set canvas dimensions to: ${width}x${height}`);
            
            // Get settings
            const radiusPercent = parseInt(document.getElementById('circle-radius-percent')?.value) || config.defaultRadiusPercent;
            const borderWidth = parseInt(document.getElementById('border-width')?.value) || config.defaultBorderWidth;
            const borderColor = document.getElementById('border-color')?.value || config.defaultBorderColor;
            const bgColor = document.getElementById('bg-color-canvas')?.value || config.defaultBackgroundColor;
            
            // Get map order
            const streetMapFirst = document.querySelector('input[name="map-order"][value="street-first"]')?.checked !== false;
            
            // Calculate positions
            const smallerDim = Math.min(width, height);
            const radius = (smallerDim * radiusPercent) / 200;
            
            const leftCenter = {
                x: width * config.landscapePositions.left.xFactor,
                y: height * config.landscapePositions.left.yFactor,
                radius: radius
            };
            
            const rightCenter = {
                x: width * config.landscapePositions.right.xFactor,
                y: height * config.landscapePositions.right.yFactor,
                radius: radius
            };
            
            // Clear canvas with background color
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);
            
            // Draw maps in circles
            function drawCircleImage(img, center) {
                if (!img) return;
                
                // Save context state
                ctx.save();
                
                // Create clipping path for the circle
                ctx.beginPath();
                ctx.arc(center.x, center.y, center.radius, 0, Math.PI * 2);
                ctx.clip();
                
                // Calculate dimensions to maintain aspect ratio
                const imgWidth = img.naturalWidth || img.width;
                const imgHeight = img.naturalHeight || img.height;
                const scale = Math.max(center.radius * 2 / imgWidth, center.radius * 2 / imgHeight);
                
                // Draw the image centered in the circle
                const scaledWidth = imgWidth * scale;
                const scaledHeight = imgHeight * scale;
                const x = center.x - (scaledWidth / 2);
                const y = center.y - (scaledHeight / 2);
                
                ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                
                // Restore context
                ctx.restore();
                
                // Draw border
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = borderWidth;
                ctx.beginPath();
                ctx.arc(center.x, center.y, center.radius, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Draw in correct order
            if (streetMapFirst) {
                drawCircleImage(streetMapImage, leftCenter);
                drawCircleImage(starMapImage, rightCenter);
            } else {
                drawCircleImage(starMapImage, leftCenter);
                drawCircleImage(streetMapImage, rightCenter);
            }
            
            // Fix canvas styling
            canvas.style.height = 'auto';
            canvas.style.maxHeight = '70vh';
            canvas.style.width = 'auto';
            canvas.style.maxWidth = '100%';
            canvas.style.objectFit = 'contain';
            canvas.style.display = 'block';
            canvas.style.margin = '0 auto';
            
            // Update canvas dimensions display
            updateCanvasDimensionsDisplay(width, height, true);
            
            // Restore text overlays
            restoreTextOverlays();
            
            log('Combined landscape view rendered successfully', 'success');
        } catch (error) {
            log(`Error in combined landscape view: ${error.message}`, 'error');
        } finally {
            // Handle any modal dialogs again
            handleModal();
            
            // Reset processing flag
            isProcessing = false;
        }
    }
    
    // Draw combined portrait view
    function drawCombinedPortraitView() {
        if (isProcessing) {
            log('Already processing combined portrait view', 'warn');
            return;
        }
        
        isProcessing = true;
        log('Drawing combined portrait view');
        
        try {
            // Handle any modal dialogs first
            handleModal();
            
            // Check if we have both images
            if (!starMapImage || !streetMapImage) {
                log('Map images not available, generating them first', 'warn');
                
                // Generate star map if needed
                if (!starMapImage) {
                    const starMapBtn = document.getElementById('view-star-map-btn');
                    if (starMapBtn) {
                        starMapBtn.click();
                        log('Generated star map');
                    }
                }
                
                // Generate street map if needed
                if (!streetMapImage) {
                    const streetMapBtn = document.getElementById('view-street-map-btn');
                    if (streetMapBtn) {
                        streetMapBtn.click();
                        log('Generated street map');
                    }
                }
                
                // Try again after a delay
                setTimeout(() => {
                    isProcessing = false;
                    drawCombinedPortraitView();
                }, 1500);
                return;
            }
            
            // Get canvas and context
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                log('Canvas not found', 'error');
                isProcessing = false;
                return;
            }
            
            const ctx = canvas.getContext('2d');
            
            // Get user dimensions
            const dimensions = getUserDimensions();
            let width = dimensions.width;
            let height = dimensions.height;
            
            // For portrait, ensure height > width
            if (height < width) {
                // Swap dimensions for portrait
                width = dimensions.height;
                height = dimensions.width;
                log(`Swapped dimensions for portrait: ${width}x${height}`);
            }
            
            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;
            log(`Set canvas dimensions to: ${width}x${height}`);
            
            // Get settings
            const radiusPercent = parseInt(document.getElementById('circle-radius-percent')?.value) || config.defaultRadiusPercent;
            const borderWidth = parseInt(document.getElementById('border-width')?.value) || config.defaultBorderWidth;
            const borderColor = document.getElementById('border-color')?.value || config.defaultBorderColor;
            const bgColor = document.getElementById('bg-color-canvas')?.value || config.defaultBackgroundColor;
            
            // Get map order
            const streetMapFirst = document.querySelector('input[name="map-order"][value="street-first"]')?.checked !== false;
            
            // Calculate positions
            const smallerDim = Math.min(width, height);
            const radius = (smallerDim * radiusPercent) / 200;
            
            const topCenter = {
                x: width * config.portraitPositions.top.xFactor,
                y: height * config.portraitPositions.top.yFactor,
                radius: radius
            };
            
            const bottomCenter = {
                x: width * config.portraitPositions.bottom.xFactor,
                y: height * config.portraitPositions.bottom.yFactor,
                radius: radius
            };
            
            // Clear canvas with background color
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);
            
            // Draw maps in circles
            function drawCircleImage(img, center) {
                if (!img) return;
                
                // Save context state
                ctx.save();
                
                // Create clipping path for the circle
                ctx.beginPath();
                ctx.arc(center.x, center.y, center.radius, 0, Math.PI * 2);
                ctx.clip();
                
                // Calculate dimensions to maintain aspect ratio
                const imgWidth = img.naturalWidth || img.width;
                const imgHeight = img.naturalHeight || img.height;
                const scale = Math.max(center.radius * 2 / imgWidth, center.radius * 2 / imgHeight);
                
                // Draw the image centered in the circle
                const scaledWidth = imgWidth * scale;
                const scaledHeight = imgHeight * scale;
                const x = center.x - (scaledWidth / 2);
                const y = center.y - (scaledHeight / 2);
                
                ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                
                // Restore context
                ctx.restore();
                
                // Draw border
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = borderWidth;
                ctx.beginPath();
                ctx.arc(center.x, center.y, center.radius, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Draw in correct order
            if (streetMapFirst) {
                drawCircleImage(streetMapImage, topCenter);
                drawCircleImage(starMapImage, bottomCenter);
            } else {
                drawCircleImage(starMapImage, topCenter);
                drawCircleImage(streetMapImage, bottomCenter);
            }
            
            // Fix canvas styling
            canvas.style.height = 'auto';
            canvas.style.maxHeight = '70vh';
            canvas.style.width = 'auto';
            canvas.style.maxWidth = '100%';
            canvas.style.objectFit = 'contain';
            canvas.style.display = 'block';
            canvas.style.margin = '0 auto';
            
            // Update canvas dimensions display
            updateCanvasDimensionsDisplay(width, height, false);
            
            // Restore text overlays
            restoreTextOverlays();
            
            log('Combined portrait view rendered successfully', 'success');
        } catch (error) {
            log(`Error in combined portrait view: ${error.message}`, 'error');
        } finally {
            // Handle any modal dialogs again
            handleModal();
            
            // Reset processing flag
            isProcessing = false;
        }
    }
    
    // Fix canvas layout view
    function fixCanvasLayoutView() {
        if (isProcessing) {
            log('Already processing canvas layout view', 'warn');
            return;
        }
        
        isProcessing = true;
        log('Fixing canvas layout view');
        
        try {
            // Handle any modal dialogs first
            handleModal();
            
            // Get canvas and context
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                log('Canvas not found', 'error');
                isProcessing = false;
                return;
            }
            
            // Get user dimensions - ALWAYS use portrait orientation for canvas layout
            const dimensions = getUserDimensions();
            let width = dimensions.width;
            let height = dimensions.height;
            
            // Ensure portrait orientation (height > width)
            if (height < width) {
                // Swap dimensions to ensure portrait
                [width, height] = [height, width];
                log(`Swapped dimensions to ensure portrait: ${width}x${height}`);
            }
            
            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;
            log(`Set canvas dimensions to: ${width}x${height}`);
            
            // Update canvas dimensions display
            updateCanvasDimensionsDisplay(width, height, false);
            
            log('Canvas layout view fixed', 'success');
        } catch (error) {
            log(`Error in canvas layout view: ${error.message}`, 'error');
        } finally {
            // Handle any modal dialogs again
            handleModal();
            
            // Reset processing flag
            isProcessing = false;
        }
    }
    
    // -------------------------------------------------------------------------
    // Hook into existing functionality
    // -------------------------------------------------------------------------
    
    // Capture star map image when it's generated
    const originalViewStarMap = window.viewStarMap;
    if (originalViewStarMap) {
        window.viewStarMap = function() {
            // Handle any modal dialogs first
            handleModal();
            
            // Call the original function
            originalViewStarMap.apply(this, arguments);
            
            // After a delay to ensure the image is loaded
            setTimeout(() => {
                // Handle any modal dialogs
                handleModal();
                
                // Capture the star map image
                captureStarMapImage();
                
                // Update dimensions display
                const dimensions = getUserDimensions();
                updateCanvasDimensionsDisplay(dimensions.width, dimensions.height
