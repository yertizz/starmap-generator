/* START OF CODE - Cline - 2025-05-31 9:00 PM File: js/combined-view-fix-minimal.js */

/**
 * Combined View Fix - Minimal Version
 * 
 * This script fixes the combined view functionality by:
 * 1. Capturing both star map and street map images
 * 2. Properly displaying them in combined views
 * 3. Fixing canvas dimensions display
 * 4. Preserving text overlays
 */

(function() {
    console.log('Combined View Fix (Minimal) - Initializing');
    
    // Store map images and their text overlays
    let starMapData = null;
    let streetMapData = null;
    
    // Flag to prevent recursive calls
    let isProcessing = false;
    
    // Flag to track if we've already captured images
    let imagesReady = false;
    
    // Utility functions
    function log(message, type = 'info') {
        const prefix = '🔧 COMBINED VIEW FIX: ';
        
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
        });
    }
    
    function captureCanvasState(type) {
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) return null;
        
        try {
            // Create a new canvas to store the image
            const captureCanvas = document.createElement('canvas');
            captureCanvas.width = canvas.width;
            captureCanvas.height = canvas.height;
            const ctx = captureCanvas.getContext('2d');
            
            // Draw the current canvas content
            ctx.drawImage(canvas, 0, 0);
            
            // Capture text overlays
            const textOverlays = [];
            const titleElement = document.querySelector('.title-text');
            const dateElement = document.querySelector('.date-text');
            const quoteElement = document.querySelector('.quote-text');
            const locationElement = document.querySelector('.location-text');
            const coordinatesElement = document.querySelector('.coordinates-text');
            const footerElement = document.querySelector('.footer-text');
            
            if (titleElement) textOverlays.push({ element: titleElement, text: titleElement.textContent, className: 'title-text' });
            if (dateElement) textOverlays.push({ element: dateElement, text: dateElement.textContent, className: 'date-text' });
            if (quoteElement) textOverlays.push({ element: quoteElement, text: quoteElement.textContent, className: 'quote-text' });
            if (locationElement) textOverlays.push({ element: locationElement, text: locationElement.textContent, className: 'location-text' });
            if (coordinatesElement) textOverlays.push({ element: coordinatesElement, text: coordinatesElement.textContent, className: 'coordinates-text' });
            if (footerElement) textOverlays.push({ element: footerElement, text: footerElement.textContent, className: 'footer-text' });
            
            // Store the data
            const data = {
                canvas: captureCanvas,
                ctx: ctx,
                width: canvas.width,
                height: canvas.height,
                dataUrl: captureCanvas.toDataURL(),
                textOverlays: textOverlays
            };
            
            if (type === 'star') {
                starMapData = data;
                log('Captured star map data', 'success');
            } else if (type === 'street') {
                streetMapData = data;
                log('Captured street map data', 'success');
            }
            
            return data;
        } catch (error) {
            log(`Error capturing canvas state: ${error.message}`, 'error');
            return null;
        }
    }
    
    function updateDimensionsDisplay() {
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) return;
        
        // Get dimensions
        const width = canvas.width;
        const height = canvas.height;
        
        // Find or create dimensions display
        let display = document.getElementById('canvas-dimensions-display');
        if (!display) {
            display = document.createElement('div');
            display.id = 'canvas-dimensions-display';
            display.style.cssText = `
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
            `;
            
            // Insert after zoom container or before canvas
            const zoomContainer = document.getElementById('zoom-container');
            if (zoomContainer) {
                zoomContainer.parentNode.insertBefore(display, zoomContainer.nextSibling);
            } else {
                const canvasContainer = document.querySelector('.canvas-container');
                if (canvasContainer) {
                    canvasContainer.parentNode.insertBefore(display, canvasContainer);
                }
            }
        }
        
        // Format dimensions text
        const paperSize = document.getElementById('paper-auto-size')?.value;
        let text;
        if (paperSize && paperSize !== 'default' && paperSize !== 'Select A Paper Size...') {
            const dpi = document.getElementById('dpi')?.value || 300;
            text = `CANVAS DIMENSIONS: Paper ${paperSize} Size: (@${dpi} DPI): ${width}w x ${height}h pixels`;
        } else {
            text = `CANVAS DIMENSIONS: Size: ${width}w x ${height}h pixels`;
        }
        
        display.textContent = text;
        log('Updated dimensions display: ' + text);
    }
    
    function drawTextOverlays(textOverlays) {
        if (!textOverlays || textOverlays.length === 0) return;
        
        // Remove any existing text overlays
        document.querySelectorAll('.title-text, .date-text, .quote-text, .location-text, .coordinates-text, .footer-text').forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        
        // Add text overlays back
        const canvasContainer = document.querySelector('.canvas-container');
        if (!canvasContainer) return;
        
        textOverlays.forEach(overlay => {
            const div = document.createElement('div');
            div.className = overlay.className;
            div.textContent = overlay.text;
            
            // Copy styles from original if available
            if (overlay.element) {
                const computedStyle = window.getComputedStyle(overlay.element);
                div.style.color = computedStyle.color;
                div.style.fontFamily = computedStyle.fontFamily;
                div.style.fontSize = computedStyle.fontSize;
                div.style.fontWeight = computedStyle.fontWeight;
                div.style.position = computedStyle.position;
                div.style.top = computedStyle.top;
                div.style.left = computedStyle.left;
                div.style.transform = computedStyle.transform;
                div.style.textAlign = computedStyle.textAlign;
                div.style.width = computedStyle.width;
            }
            
            canvasContainer.appendChild(div);
        });
        
        log('Restored text overlays');
    }
    
    // Capture star map when generated
    const originalViewStarMap = window.viewStarMap;
    window.viewStarMap = function() {
        if (isProcessing) {
            log('Already processing star map view', 'warn');
            return;
        }
        
        isProcessing = true;
        log('Star map view requested');
        
        try {
            // Call the original function
            originalViewStarMap.apply(this, arguments);
            
            // After a delay to ensure the image is loaded
            setTimeout(() => {
                handleModal();
                
                // Capture star map data
                captureCanvasState('star');
                
                // Update dimensions display
                updateDimensionsDisplay();
                
                isProcessing = false;
                log('Star map view completed', 'success');
            }, 1000);
        } catch (error) {
            log(`Error in star map view: ${error.message}`, 'error');
            isProcessing = false;
        }
    };
    
    // Capture street map when generated
    const originalViewStreetMap = window.viewStreetMap;
    window.viewStreetMap = function() {
        if (isProcessing) {
            log('Already processing street map view', 'warn');
            return;
        }
        
        isProcessing = true;
        log('Street map view requested');
        
        try {
            // Call the original function
            originalViewStreetMap.apply(this, arguments);
            
            // After a delay to ensure the image is loaded
            setTimeout(() => {
                handleModal();
                
                // Capture street map data
                captureCanvasState('street');
                
                // Update dimensions display
                updateDimensionsDisplay();
                
                isProcessing = false;
                log('Street map view completed', 'success');
            }, 1000);
        } catch (error) {
            log(`Error in street map view: ${error.message}`, 'error');
            isProcessing = false;
        }
    };
    
    // Fix canvas layout view
    const originalViewCanvasLayout = window.viewCanvasLayout;
    if (originalViewCanvasLayout) {
        window.viewCanvasLayout = function() {
            if (isProcessing) {
                log('Already processing canvas layout view', 'warn');
                return;
            }
            
            isProcessing = true;
            log('Canvas layout view requested');
            
            try {
                // Call the original function
                originalViewCanvasLayout.apply(this, arguments);
                
                // After a delay to ensure the layout is applied
                setTimeout(() => {
                    handleModal();
                    
                    // Update dimensions display
                    updateDimensionsDisplay();
                    
                    isProcessing = false;
                    log('Canvas layout view completed', 'success');
                }, 500);
            } catch (error) {
                log(`Error in canvas layout view: ${error.message}`, 'error');
                isProcessing = false;
            }
        };
    }
    
    // Fix the canvas layout button
    const canvasLayoutBtn = document.getElementById('view-canvas-layout-btn');
    if (canvasLayoutBtn) {
        const originalOnClick = canvasLayoutBtn.onclick;
        canvasLayoutBtn.onclick = function(event) {
            if (isProcessing) {
                log('Already processing canvas layout view', 'warn');
                return;
            }
            
            isProcessing = true;
            log('Canvas layout view requested from button');
            
            try {
                if (originalOnClick) {
                    originalOnClick.call(this, event);
                } else if (window.viewCanvasLayout) {
                    window.viewCanvasLayout();
                }
                
                // After a delay to ensure the layout is applied
                setTimeout(() => {
                    handleModal();
                    
                    // Update dimensions display
                    updateDimensionsDisplay();
                    
                    isProcessing = false;
                    log('Canvas layout view completed', 'success');
                }, 500);
            } catch (error) {
                log(`Error in canvas layout view: ${error.message}`, 'error');
                isProcessing = false;
            }
        };
    }
    
    // Fix combined landscape view
    const landscapeBtn = document.getElementById('view-star-street-landscape-btn');
    if (landscapeBtn) {
        landscapeBtn.onclick = function(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            if (isProcessing) {
                log('Already processing combined landscape view', 'warn');
                return;
            }
            
            isProcessing = true;
            log('Combined landscape view requested');
            
            try {
                // Check if we have both images
                if (!starMapData || !streetMapData) {
                    log('Map data not available, generating them first', 'warn');
                    
                    if (!starMapData) {
                        const starMapBtn = document.getElementById('view-star-map-btn');
                        if (starMapBtn) {
                            starMapBtn.click();
                            log('Generated star map');
                        }
                    }
                    
                    if (!streetMapData) {
                        const streetMapBtn = document.getElementById('view-street-map-btn');
                        if (streetMapBtn) {
                            streetMapBtn.click();
                            log('Generated street map');
                        }
                    }
                    
                    // Try again after a delay
                    setTimeout(() => {
                        isProcessing = false;
                        this.onclick();
                    }, 2000);
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
                
                // Set dimensions for landscape
                let width, height;
                const widthInput = document.getElementById('width');
                const heightInput = document.getElementById('height');
                
                if (widthInput && heightInput && widthInput.value && heightInput.value) {
                    width = parseInt(widthInput.value);
                    height = parseInt(heightInput.value);
                } else {
                    width = 2550;
                    height = 3300;
                }
                
                // For landscape, ensure width > height
                if (width < height) {
                    [width, height] = [height, width];
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Get settings
                const radiusPercent = parseInt(document.getElementById('circle-radius-percent')?.value) || 60;
                const borderWidth = parseInt(document.getElementById('border-width')?.value) || 2;
                const borderColor = document.getElementById('border-color')?.value || '#FDCA0D';
                const bgColor = document.getElementById('bg-color-canvas')?.value || '#1D1D4D';
                
                // Get map order
                const streetMapFirst = document.querySelector('input[name="map-order"][value="street-first"]')?.checked !== false;
                
                // Calculate positions
                const smallerDim = Math.min(width, height);
                const radius = (smallerDim * radiusPercent) / 200;
                
                const leftCenter = {
                    x: width * 0.3,
                    y: height * 0.5,
                    radius: radius
                };
                
                const rightCenter = {
                    x: width * 0.7,
                    y: height * 0.5,
                    radius: radius
                };
                
                // Clear canvas
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, width, height);
                
                // Draw maps in circles
                const drawCircleImage = (data, center) => {
                    if (!data || !data.canvas) return;
                    
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(center.x, center.y, center.radius, 0, Math.PI * 2);
                    ctx.clip();
                    
                    // Calculate scaling to fit the image in the circle
                    const sourceWidth = data.width;
                    const sourceHeight = data.height;
                    const targetSize = center.radius * 2;
                    
                    // Calculate scaling factor to maintain aspect ratio
                    const scale = Math.max(targetSize / sourceWidth, targetSize / sourceHeight);
                    const scaledWidth = sourceWidth * scale;
                    const scaledHeight = sourceHeight * scale;
                    
                    // Center the image in the circle
                    const x = center.x - (scaledWidth / 2);
                    const y = center.y - (scaledHeight / 2);
                    
                    // Draw the image
                    ctx.drawImage(data.canvas, x, y, scaledWidth, scaledHeight);
                    
                    ctx.restore();
                    
                    // Draw border
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = borderWidth;
                    ctx.beginPath();
                    ctx.arc(center.x, center.y, center.radius, 0, Math.PI * 2);
                    ctx.stroke();
                };
                
                // Draw in correct order
                if (streetMapFirst) {
                    drawCircleImage(streetMapData, leftCenter);
                    drawCircleImage(starMapData, rightCenter);
                } else {
                    drawCircleImage(starMapData, leftCenter);
                    drawCircleImage(streetMapData, rightCenter);
                }
                
                // Fix canvas styling
                canvas.style.height = 'auto';
                canvas.style.maxHeight = '70vh';
                canvas.style.width = 'auto';
                canvas.style.maxWidth = '100%';
                canvas.style.objectFit = 'contain';
                canvas.style.display = 'block';
                canvas.style.margin = '0 auto';
                
                // Update dimensions display
                updateDimensionsDisplay();
                
                // Restore text overlays from star map
                if (starMapData && starMapData.textOverlays) {
                    drawTextOverlays(starMapData.textOverlays);
                }
                
                log('Combined landscape view rendered successfully', 'success');
            } catch (error) {
                log(`Error in combined landscape view: ${error.message}`, 'error');
            } finally {
                handleModal();
                isProcessing = false;
            }
        };
    }
    
    // Fix combined portrait view
    const portraitBtn = document.getElementById('view-star-street-portrait-btn');
    if (portraitBtn) {
        portraitBtn.onclick = function(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            if (isProcessing) {
                log('Already processing combined portrait view', 'warn');
                return;
            }
            
            isProcessing = true;
            log('Combined portrait view requested');
            
            try {
                // Check if we have both images
                if (!starMapData || !streetMapData) {
                    log('Map data not available, generating them first', 'warn');
                    
                    if (!starMapData) {
                        const starMapBtn = document.getElementById('view-star-map-btn');
                        if (starMapBtn) {
                            starMapBtn.click();
                            log('Generated star map');
                        }
                    }
                    
                    if (!streetMapData) {
                        const streetMapBtn = document.getElementById('view-street-map-btn');
                        if (streetMapBtn) {
                            streetMapBtn.click();
                            log('Generated street map');
                        }
                    }
                    
                    // Try again after a delay
                    setTimeout(() => {
                        isProcessing = false;
                        this.onclick();
                    }, 2000);
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
                
                // Set dimensions for portrait
                let width, height;
                const widthInput = document.getElementById('width');
                const heightInput = document.getElementById('height');
                
                if (widthInput && heightInput && widthInput.value && heightInput.value) {
                    width = parseInt(widthInput.value);
                    height = parseInt(heightInput.value);
                } else {
                    width = 2550;
                    height = 3300;
                }
                
                // For portrait, ensure height > width
                if (height < width) {
                    [width, height] = [height, width];
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Get settings
                const radiusPercent = parseInt(document.getElementById('circle-radius-percent')?.value) || 60;
                const borderWidth = parseInt(document.getElementById('border-width')?.value) || 2;
                const borderColor = document.getElementById('border-color')?.value || '#FDCA0D';
                const bgColor = document.getElementById('bg-color-canvas')?.value || '#1D1D4D';
                
                // Get map order
                const streetMapFirst = document.querySelector('input[name="map-order"][value="street-first"]')?.checked !== false;
                
                // Calculate positions
                const smallerDim = Math.min(width, height);
                const radius = (smallerDim * radiusPercent) / 200;
                
                const topCenter = {
                    x: width * 0.5,
                    y: height * 0.3,
                    radius: radius
                };
                
                const bottomCenter = {
                    x: width * 0.5,
                    y: height * 0.7,
                    radius: radius
                };
                
                // Clear canvas
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, width, height);
                
                // Draw maps in circles
                const drawCircleImage = (data, center) => {
                    if (!data || !data.canvas) return;
                    
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(center.x, center.y, center.radius, 0, Math.PI * 2);
                    ctx.clip();
                    
                    // Calculate scaling to fit the image in the circle
                    const sourceWidth = data.width;
                    const sourceHeight = data.height;
                    const targetSize = center.radius * 2;
                    
                    // Calculate scaling factor to maintain aspect ratio
                    const scale = Math.max(targetSize / sourceWidth, targetSize / sourceHeight);
                    const scaledWidth = sourceWidth * scale;
                    const scaledHeight = sourceHeight * scale;
                    
                    // Center the image in the circle
                    const x = center.x - (scaledWidth / 2);
                    const y = center.y - (scaledHeight / 2);
                    
                    // Draw the image
                    ctx.drawImage(data.canvas, x, y, scaledWidth, scaledHeight);
                    
                    ctx.restore();
                    
                    // Draw border
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = borderWidth;
                    ctx.beginPath();
                    ctx.arc(center.x, center.y, center.radius, 0, Math.PI * 2);
                    ctx.stroke();
                };
                
                // Draw in correct order
                if (streetMapFirst) {
                    drawCircleImage(streetMapData, topCenter);
                    drawCircleImage(starMapData, bottomCenter);
                } else {
                    drawCircleImage(starMapData, topCenter);
                    drawCircleImage(streetMapData, bottomCenter);
                }
                
                // Fix canvas styling
                canvas.style.height = 'auto';
                canvas.style.maxHeight = '70vh';
                canvas.style.width = 'auto';
                canvas.style.maxWidth = '100%';
                canvas.style.objectFit = 'contain';
                canvas.style.display = 'block';
                canvas.style.margin = '0 auto';
                
                // Update dimensions display
                updateDimensionsDisplay();
                
                // Restore text overlays from star map
                if (starMapData && starMapData.textOverlays) {
                    drawTextOverlays(starMapData.textOverlays);
                }
                
                log('Combined portrait view rendered successfully', 'success');
            } catch (error) {
                log(`Error in combined portrait view: ${error.message}`, 'error');
            } finally {
                handleModal();
                isProcessing = false;
            }
        };
    }
    
    // Prevent automatic loading on page load
    function clearCanvas() {
        const canvas = document.getElementById('star-map-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const bgColor = document.getElementById('bg-color-canvas')?.value || '#1D1D4D';
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                log('Canvas cleared to prevent automatic loading');
            }
        }
    }
    
    // Initialize
    function initialize() {
        // Clear canvas to prevent automatic loading
        clearCanvas();
        
        // Handle any modal dialogs that might be open
        handleModal();
        
        // Update dimensions display
        updateDimensionsDisplay();
        
        log('Combined View Fix initialized', 'success');
    }
    
    // Start when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Also initialize on window load to ensure all resources are available
    window.addEventListener('load', initialize);
})();

/* END OF CODE - Cline - 2025-05-31 9:00 PM File: js/combined-view-fix-minimal.js */
