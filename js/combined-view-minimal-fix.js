/* Combined View Minimal Fix - 2025-06-01 11:06 AM */

(function() {
    console.log('Combined View Minimal Fix - Initializing');
    
    // Store captured images
    let starMapImage = null;
    let streetMapImage = null;
    
    // Flag to prevent recursive calls
    let isProcessing = false;
    
    // -------------------------------------------------------------------------
    // Core Functions
    // -------------------------------------------------------------------------
    
    // Remove any existing dimensions display
    function removeExistingDimensionsDisplay() {
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
    }
    
    // Update canvas dimensions display
    function updateDimensionsDisplay(width, height) {
        removeExistingDimensionsDisplay();
        
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
        
        dimensionsDisplay.textContent = dimensionsText;
    }
    
    // Handle modal dialogs
    function handleModal() {
        document.querySelectorAll('.modal, .custom-alert, .custom-modal').forEach(modal => {
            const okButton = modal.querySelector('button, .ok-button, .btn-primary');
            if (okButton) okButton.click();
            if (modal.parentNode) modal.parentNode.removeChild(modal);
        });
        
        document.querySelectorAll('div, p, span').forEach(el => {
            if (el.textContent && el.textContent.includes('Computing star map')) {
                if (el.parentNode) el.parentNode.removeChild(el);
            }
        });
    }
    
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
    
    // Capture images
    function captureImages() {
        const starMapImg = document.querySelector('.star-map-circle img');
        if (starMapImg) {
            const newImg = new Image();
            newImg.crossOrigin = "Anonymous";
            newImg.onload = function() { starMapImage = newImg; };
            newImg.src = starMapImg.src;
        }
        
        const streetMapImg = document.querySelector('.street-map-circle img');
        if (streetMapImg) {
            const newImg = new Image();
            newImg.crossOrigin = "Anonymous";
            newImg.onload = function() { streetMapImage = newImg; };
            newImg.src = streetMapImg.src;
        }
    }
    
    // -------------------------------------------------------------------------
    // Combined View Functions
    // -------------------------------------------------------------------------
    
    // Draw combined landscape view
    function drawCombinedLandscapeView() {
        if (isProcessing) return;
        isProcessing = true;
        
        try {
            handleModal();
            
            // Check if we have both images
            if (!starMapImage || !streetMapImage) {
                if (!starMapImage) {
                    const starMapBtn = document.getElementById('view-star-map-btn');
                    if (starMapBtn) starMapBtn.click();
                }
                
                if (!streetMapImage) {
                    const streetMapBtn = document.getElementById('view-street-map-btn');
                    if (streetMapBtn) streetMapBtn.click();
                }
                
                setTimeout(() => {
                    isProcessing = false;
                    captureImages();
                    drawCombinedLandscapeView();
                }, 1500);
                return;
            }
            
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                isProcessing = false;
                return;
            }
            
            const ctx = canvas.getContext('2d');
            
            // Get dimensions - ensure landscape (width > height)
            const dimensions = getUserDimensions();
            let width = dimensions.width;
            let height = dimensions.height;
            
            if (width < height) {
                [width, height] = [height, width];
            }
            
            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;
            
            // Get settings
            const bgColor = document.getElementById('bg-color-canvas')?.value || '#1D1D4D';
            const borderColor = document.getElementById('border-color')?.value || '#FDCA0D';
            const borderWidth = parseInt(document.getElementById('border-width')?.value) || 2;
            const radiusPercent = parseInt(document.getElementById('circle-radius-percent')?.value) || 60;
            
            // Calculate positions
            const smallerDim = Math.min(width, height);
            const radius = (smallerDim * radiusPercent) / 200;
            
            const leftCenter = { x: width * 0.3, y: height * 0.5, radius: radius };
            const rightCenter = { x: width * 0.7, y: height * 0.5, radius: radius };
            
            // Clear canvas
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);
            
            // Draw maps in circles
            function drawCircleImage(img, center) {
                if (!img) return;
                
                ctx.save();
                ctx.beginPath();
                ctx.arc(center.x, center.y, center.radius, 0, Math.PI * 2);
                ctx.clip();
                
                const imgWidth = img.naturalWidth || img.width;
                const imgHeight = img.naturalHeight || img.height;
                const scale = Math.max(center.radius * 2 / imgWidth, center.radius * 2 / imgHeight);
                
                const scaledWidth = imgWidth * scale;
                const scaledHeight = imgHeight * scale;
                const x = center.x - (scaledWidth / 2);
                const y = center.y - (scaledHeight / 2);
                
                ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                ctx.restore();
                
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = borderWidth;
                ctx.beginPath();
                ctx.arc(center.x, center.y, center.radius, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Draw in correct order
            const streetMapFirst = document.querySelector('input[name="map-order"][value="street-first"]')?.checked !== false;
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
            canvas.style.display = 'block';
            canvas.style.margin = '0 auto';
            
            // Update dimensions display
            updateDimensionsDisplay(width, height);
            
        } catch (error) {
            console.error('Error in combined landscape view:', error);
        } finally {
            handleModal();
            isProcessing = false;
        }
    }
    
    // Draw combined portrait view
    function drawCombinedPortraitView() {
        if (isProcessing) return;
        isProcessing = true;
        
        try {
            handleModal();
            
            // Check if we have both images
            if (!starMapImage || !streetMapImage) {
                if (!starMapImage) {
                    const starMapBtn = document.getElementById('view-star-map-btn');
                    if (starMapBtn) starMapBtn.click();
                }
                
                if (!streetMapImage) {
                    const streetMapBtn = document.getElementById('view-street-map-btn');
                    if (streetMapBtn) streetMapBtn.click();
                }
                
                setTimeout(() => {
                    isProcessing = false;
                    captureImages();
                    drawCombinedPortraitView();
                }, 1500);
                return;
            }
            
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                isProcessing = false;
                return;
            }
            
            const ctx = canvas.getContext('2d');
            
            // Get dimensions - ensure portrait (height > width)
            const dimensions = getUserDimensions();
            let width = dimensions.width;
            let height = dimensions.height;
            
            if (height < width) {
                [width, height] = [height, width];
            }
            
            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;
            
            // Get settings
            const bgColor = document.getElementById('bg-color-canvas')?.value || '#1D1D4D';
            const borderColor = document.getElementById('border-color')?.value || '#FDCA0D';
            const borderWidth = parseInt(document.getElementById('border-width')?.value) || 2;
            const radiusPercent = parseInt(document.getElementById('circle-radius-percent')?.value) || 60;
            
            // Calculate positions
            const smallerDim = Math.min(width, height);
            const radius = (smallerDim * radiusPercent) / 200;
            
            const topCenter = { x: width * 0.5, y: height * 0.3, radius: radius };
            const bottomCenter = { x: width * 0.5, y: height * 0.7, radius: radius };
            
            // Clear canvas
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);
            
            // Draw maps in circles
            function drawCircleImage(img, center) {
                if (!img) return;
                
                ctx.save();
                ctx.beginPath();
                ctx.arc(center.x, center.y, center.radius, 0, Math.PI * 2);
                ctx.clip();
                
                const imgWidth = img.naturalWidth || img.width;
                const imgHeight = img.naturalHeight || img.height;
                const scale = Math.max(center.radius * 2 / imgWidth, center.radius * 2 / imgHeight);
                
                const scaledWidth = imgWidth * scale;
                const scaledHeight = imgHeight * scale;
                const x = center.x - (scaledWidth / 2);
                const y = center.y - (scaledHeight / 2);
                
                ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                ctx.restore();
                
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = borderWidth;
                ctx.beginPath();
                ctx.arc(center.x, center.y, center.radius, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Draw in correct order
            const streetMapFirst = document.querySelector('input[name="map-order"][value="street-first"]')?.checked !== false;
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
            canvas.style.display = 'block';
            canvas.style.margin = '0 auto';
            
            // Update dimensions display
            updateDimensionsDisplay(width, height);
            
        } catch (error) {
            console.error('Error in combined portrait view:', error);
        } finally {
            handleModal();
            isProcessing = false;
        }
    }
    
    // Fix canvas layout view
    function fixCanvasLayoutView() {
        if (isProcessing) return;
        isProcessing = true;
        
        try {
            handleModal();
            
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                isProcessing = false;
                return;
            }
            
            // Get dimensions - ALWAYS use portrait for canvas layout
            const dimensions = getUserDimensions();
            let width = dimensions.width;
            let height = dimensions.height;
            
            if (height < width) {
                [width, height] = [height, width];
            }
            
            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;
            
            // Update dimensions display
            updateDimensionsDisplay(width, height);
            
        } catch (error) {
            console.error('Error in canvas layout view:', error);
        } finally {
            handleModal();
            isProcessing = false;
        }
    }
    
    // -------------------------------------------------------------------------
    // Hook into existing functionality
    // -------------------------------------------------------------------------
    
    // Replace combined landscape view function
    window.viewStarStreetLandscape = drawCombinedLandscapeView;
    
    // Replace combined portrait view function
    window.viewStarStreetPortrait = drawCombinedPortraitView;
    
    // Fix canvas layout view
    const originalViewCanvasLayout = window.viewCanvasLayout;
    if (originalViewCanvasLayout) {
        window.viewCanvasLayout = function() {
            originalViewCanvasLayout.apply(this, arguments);
            setTimeout(fixCanvasLayoutView, 500);
        };
    }
    
    // Capture images when star map is generated
    const originalViewStarMap = window.viewStarMap;
    if (originalViewStarMap) {
        window.viewStarMap = function() {
            originalViewStarMap.apply(this, arguments);
            setTimeout(() => {
                handleModal();
                captureImages();
                const dimensions = getUserDimensions();
                updateDimensionsDisplay(dimensions.width, dimensions.height);
            }, 500);
        };
    }
    
    // Capture images when street map is generated
    const originalViewStreetMap = window.viewStreetMap;
    if (originalViewStreetMap) {
        window.viewStreetMap = function() {
            originalViewStreetMap.apply(this, arguments);
            setTimeout(() => {
                handleModal();
                captureImages();
                const dimensions = getUserDimensions();
                updateDimensionsDisplay(dimensions.width, dimensions.height);
            }, 500);
        };
    }
    
    // Listen for paper size changes
    const paperSizeSelect = document.getElementById('paper-auto-size');
    if (paperSizeSelect) {
        paperSizeSelect.addEventListener('change', function() {
            const dimensions = getUserDimensions();
            updateDimensionsDisplay(dimensions.width, dimensions.height);
        });
    }
    
    // Listen for width and height changes
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    
    if (widthInput) {
        widthInput.addEventListener('change', function() {
            const dimensions = getUserDimensions();
            updateDimensionsDisplay(dimensions.width, dimensions.height);
        });
    }
    
    if (heightInput) {
        heightInput.addEventListener('change', function() {
            const dimensions = getUserDimensions();
            updateDimensionsDisplay(dimensions.width, dimensions.height);
        });
    }
    
    // Initialize
    captureImages();
    const dimensions = getUserDimensions();
    updateDimensionsDisplay(dimensions.width, dimensions.height);
    
    // Set up a periodic check for modals
    setInterval(handleModal, 1000);
    
    console.log('Combined View Minimal Fix - Initialized');
})();
