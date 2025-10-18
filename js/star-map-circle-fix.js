/**
 * Star Map Circle Fix
 * Overrides existing functions to ensure perfect circles
 * Depends on: perfect-circle-calculator.js and canvas-drawing-utils.js
 */

(function() {
    'use strict';
    
    console.log('Star Map Circle Fix: Initializing...');
    
    // Wait for dependencies
    if (!window.PerfectCircleCalculator || !window.CanvasDrawingUtils) {
        console.error('Star Map Circle Fix: Missing dependencies!');
        return;
    }
    
    const calc = window.PerfectCircleCalculator;
    const draw = window.CanvasDrawingUtils;
    
    /**
     * Override the main generateStarMap function
     */
    function overrideGenerateStarMap() {
        // Don't override the main generateStarMap, let it work normally
        // We'll fix the rendering in redrawPreviewCanvas instead
        const originalRedraw = window.redrawPreviewCanvas;
        
        window.redrawPreviewCanvas = async function() {
            console.log('Star Map Circle Fix: Using fixed redrawPreviewCanvas');
            
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas || !window.lastGeneratedMapBlob) {
                console.warn('Cannot redraw: Canvas or blob not available');
                return;
            }
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Canvas context not available');
                return;
            }
            
            try {
                // Get settings
                const getVal = (id, def) => document.getElementById(id)?.value || def;
                const getInt = (id, def) => parseInt(getVal(id, def)) || def;
                const getChecked = id => document.getElementById(id)?.checked || false;
                const getRadioVal = (name, def) => {
                    const checked = document.querySelector(`input[name="${name}"]:checked`);
                    return checked ? checked.value : def;
                };
                
                // Background
                const bgColor = getVal('bg-color-canvas', '#F5F5DC');
                draw.clearCanvas(ctx, canvas.width, canvas.height, bgColor);
                
                // Calculate perfect circle
                const radiusPercent = getInt('circle-radius-percent', 90);
                const circle = calc.calculatePerfectCircle(canvas.width, canvas.height, radiusPercent);
                
                // Border settings
                const borderWidth = getInt('border-width', 1);
                const borderColor = getVal('border-color', '#FFFFFF');
                
                // Create bitmap from blob
                const imageBitmap = await createImageBitmap(window.lastGeneratedMapBlob);
                
                // Apply circular clip
                draw.createCircularClip(ctx, circle);
                
                // Draw image with zoom
                const zoomLevel = getInt('zoom-slider', 100);
                draw.drawImageInCircle(ctx, imageBitmap, circle, zoomLevel);
                
                imageBitmap.close();
                ctx.restore();
                
                // Draw border
                draw.drawCircleBorder(ctx, circle, borderWidth, borderColor);
                
                // Draw text layers
                drawTextLayers(ctx, circle, borderWidth);
                
            } catch (error) {
                console.error('Error in fixed redrawPreviewCanvas:', error);
            }
        };
    }
    
    /**
     * Draw text layers
     */
    function drawTextLayers(ctx, circle, borderWidth) {
        const getVal = (id, def) => document.getElementById(id)?.value || def;
        const getInt = (id, def) => parseInt(getVal(id, def)) || def;
        const getChecked = id => document.getElementById(id)?.checked || false;
        const getRadioVal = (name, def) => {
            const checked = document.querySelector(`input[name="${name}"]:checked`);
            return checked ? checked.value : def;
        };
        
        const textData = [];
        
        // Collect text entries
        for (let i = 1; i <= 4; i++) {
            const text = getVal(`text-entry-${i}`, '');
            if (text.trim()) {
                textData.push({
                    text: text,
                    fontFamily: getVal(`font-family-${i}`, 'Montserrat'),
                    fontSize: getInt(`font-size-${i}`, i === 1 ? 28 : 16),
                    fontColor: getVal(`font-color-${i}`, '#FFFFFF'),
                    isBold: getChecked(`text-bold-${i}`),
                    isItalic: getChecked(`text-italic-${i}`),
                    order: getInt(`text-placement-order-${i}`, i),
                    position: getRadioVal(`text-placement-pos-${i}`, 'below')
                });
            }
        }
        
        // Add fixed layers
        const dateValue = getVal('date', '');
        if (dateValue) {
            textData.push({
                text: (typeof formatDate === 'function') ? formatDate(dateValue) : dateValue,
                fontFamily: getVal('fixed-font-family-date', 'Arial'),
                fontSize: getInt('fixed-font-size-date', 14),
                fontColor: getVal('fixed-font-color-date', '#FFFFFF'),
                isBold: getChecked('fixed-text-bold-date'),
                isItalic: getChecked('fixed-text-italic-date'),
                order: getInt('text-placement-order-date', 5),
                position: getRadioVal('text-placement-pos-date', 'below')
            });
        }
        
        const latVal = getVal('latitude', '');
        const lonVal = getVal('longitude', '');
        if (latVal && lonVal) {
            textData.push({
                text: `${latVal} | ${lonVal}`,
                fontFamily: getVal('fixed-font-family-coords', 'Arial'),
                fontSize: getInt('fixed-font-size-coords', 14),
                fontColor: getVal('fixed-font-color-coords', '#FFFFFF'),
                isBold: getChecked('fixed-text-bold-coords'),
                isItalic: getChecked('fixed-text-italic-coords'),
                order: getInt('text-placement-order-coords', 6),
                position: getRadioVal('text-placement-pos-coords', 'below')
            });
        }
        
        // Sort and render
        textData.sort((a, b) => a.order - b.order);
        
        const aboveItems = textData.filter(item => item.position === 'above');
        const belowItems = textData.filter(item => item.position === 'below');
        
        ctx.save();
        ctx.textAlign = 'center';
        
        const margin = circle.radius * 0.1;
        const textSpacing = 1.2;
        
        // Draw below items
        let currentY = circle.centerY + circle.radius + borderWidth + margin;
        ctx.textBaseline = 'top';
        
        belowItems.forEach(item => {
            const fontSize = draw.applyTextStyle(ctx, item);
            ctx.fillText(item.text, circle.centerX, currentY);
            currentY += fontSize * textSpacing;
        });
        
        // Draw above items
        currentY = circle.centerY - circle.radius - borderWidth - margin;
        ctx.textBaseline = 'bottom';
        
        aboveItems.reverse().forEach(item => {
            const fontSize = draw.applyTextStyle(ctx, item);
            ctx.fillText(item.text, circle.centerX, currentY);
            currentY -= fontSize * textSpacing;
        });
        
        ctx.restore();
    }
    
    /**
     * Override viewStarMap for Star Map button
     */
    function overrideViewStarMap() {
        const original = window.viewStarMap;
        
        window.viewStarMap = function() {
            console.log('Star Map Circle Fix: Using fixed viewStarMap');
            
            if (!validateCoordinates()) {
                alert("Please enter valid coordinates or a location first.");
                return;
            }
            
            const canvas = document.getElementById('star-map-canvas');
            const ctx = canvas.getContext('2d');
            
            // Background
            const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
            draw.clearCanvas(ctx, canvas.width, canvas.height, bgColor);
            
            // Calculate perfect circle
            const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
            const circle = calc.calculatePerfectCircle(canvas.width, canvas.height, radiusPercent);
            
            // Border settings
            const borderWidth = parseInt(document.getElementById('border-width').value) || 1;
            const borderColor = document.getElementById('border-color').value || '#FFFFFF';
            
            // Draw border first
            draw.drawCircleBorder(ctx, circle, borderWidth, borderColor);
            
            // Create clipping path
            draw.createCircularClip(ctx, circle);
            
            // Continue with original logic for API call
            if (original) {
                // Let original handle the API call but we've set up the circle
                original.call(this);
            }
        };
    }
    
    /**
     * Override landscape view
     */
    function overrideViewLandscape() {
        const original = window.viewStarStreetLandscape;
        
        window.viewStarStreetLandscape = function() {
            console.log('Star Map Circle Fix: Using fixed landscape view');
            
            if (!validateCoordinates()) {
                alert("Please enter valid coordinates or a location first.");
                return;
            }
            
            const canvas = document.getElementById('star-map-canvas');
            const ctx = canvas.getContext('2d');
            
            // Background
            const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
            draw.clearCanvas(ctx, canvas.width, canvas.height, bgColor);
            
            // Calculate overlapping circles
            const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
            const circles = calc.calculateLandscapeCircles(canvas.width, canvas.height, radiusPercent, 20);
            
            // Border settings
            const borderWidth = parseInt(document.getElementById('border-width').value) || 2;
            const borderColor = document.getElementById('border-color').value || '#FDCA0D';
            
            // Draw both borders
            draw.drawCircleBorder(ctx, circles.left, borderWidth, borderColor);
            draw.drawCircleBorder(ctx, circles.right, borderWidth, borderColor);
            
            // Store circle data for the original function to use
            window._landscapeCircles = circles;
            
            // Call original
            if (original) {
                original.call(this);
            }
        };
    }
    
    /**
     * Override portrait view
     */
    function overrideViewPortrait() {
        const original = window.viewStarStreetPortrait;
        
        window.viewStarStreetPortrait = function() {
            console.log('Star Map Circle Fix: Using fixed portrait view');
            
            if (!validateCoordinates()) {
                alert("Please enter valid coordinates or a location first.");
                return;
            }
            
            const canvas = document.getElementById('star-map-canvas');
            const ctx = canvas.getContext('2d');
            
            // Background
            const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
            draw.clearCanvas(ctx, canvas.width, canvas.height, bgColor);
            
            // Calculate overlapping circles
            const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
            const circles = calc.calculatePortraitCircles(canvas.width, canvas.height, radiusPercent, 20);
            
            // Border settings
            const borderWidth = parseInt(document.getElementById('border-width').value) || 2;
            const borderColor = document.getElementById('border-color').value || '#FDCA0D';
            
            // Draw both borders
            draw.drawCircleBorder(ctx, circles.top, borderWidth, borderColor);
            draw.drawCircleBorder(ctx, circles.bottom, borderWidth, borderColor);
            
            // Store circle data for the original function to use
            window._portraitCircles = circles;
            
            // Call original
            if (original) {
                original.call(this);
            }
        };
    }
    
    /**
     * Initialize all overrides
     */
    function initialize() {
        // Override functions
        overrideGenerateStarMap();
        overrideViewStarMap();
        overrideViewLandscape();
        overrideViewPortrait();
        
        console.log('Star Map Circle Fix: All overrides applied');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded
        setTimeout(initialize, 100); // Small delay to ensure other scripts loaded
    }
    
})();
