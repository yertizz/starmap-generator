/**
 * Canvas Drawing Utilities
 * Helper functions for drawing circles, borders, and clipping paths
 */

window.CanvasDrawingUtils = (function() {
    'use strict';
    
    /**
     * Draw a perfect circle with border
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} circle - Circle dimensions from calculatePerfectCircle
     * @param {number} borderWidth - Border width in pixels
     * @param {string} borderColor - Border color
     */
    function drawCircleBorder(ctx, circle, borderWidth, borderColor) {
        if (borderWidth > 0) {
            ctx.save();
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = borderWidth;
            ctx.beginPath();
            ctx.arc(circle.centerX, circle.centerY, circle.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }
    
    /**
     * Create circular clipping path
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} circle - Circle dimensions
     */
    function createCircularClip(ctx, circle) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(circle.centerX, circle.centerY, circle.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
    }
    
    /**
     * Draw an image scaled to fill a circle
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Image|ImageBitmap} image - Image to draw
     * @param {object} circle - Circle dimensions
     * @param {number} zoomLevel - Zoom level (100 = normal)
     */
    function drawImageInCircle(ctx, image, circle, zoomLevel = 100) {
        const zoomFactor = zoomLevel / 100;
        
        // Calculate scale to fill the circle
        const scale = Math.max(
            circle.diameter / image.width,
            circle.diameter / image.height
        );
        
        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;
        
        if (zoomFactor > 1) {
            // Zoomed in - crop the source
            const sWidth = image.width / zoomFactor;
            const sHeight = image.height / zoomFactor;
            const sx = (image.width - sWidth) / 2;
            const sy = (image.height - sHeight) / 2;
            
            ctx.drawImage(
                image,
                sx, sy, sWidth, sHeight,
                circle.centerX - drawWidth / 2,
                circle.centerY - drawHeight / 2,
                drawWidth,
                drawHeight
            );
        } else {
            // Normal or zoomed out
            ctx.drawImage(
                image,
                circle.centerX - drawWidth / 2,
                circle.centerY - drawHeight / 2,
                drawWidth,
                drawHeight
            );
        }
    }
    
    /**
     * Clear canvas and fill with background color
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {string} bgColor - Background color
     */
    function clearCanvas(ctx, width, height, bgColor) {
        ctx.save();
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }
    
    /**
     * Draw a fallback circle when image fails to load
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} circle - Circle dimensions
     * @param {string} fillColor - Fill color
     * @param {number} borderWidth - Border width
     * @param {string} borderColor - Border color
     */
    function drawFallbackCircle(ctx, circle, fillColor, borderWidth, borderColor) {
        ctx.save();
        
        // Fill circle
        ctx.beginPath();
        ctx.arc(circle.centerX, circle.centerY, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
        
        // Draw border
        if (borderWidth > 0) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = borderWidth;
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    /**
     * Apply text style to canvas context
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} style - Text style object
     * @returns {number} Font size for layout calculations
     */
    function applyTextStyle(ctx, style) {
        const fontWeight = style.isBold ? 'bold' : 'normal';
        const fontStyle = style.isItalic ? 'italic' : 'normal';
        const safeFontFamily = style.fontFamily.includes(' ') 
            ? `"${style.fontFamily}"` 
            : style.fontFamily;
        
        ctx.font = `${fontStyle} ${fontWeight} ${style.fontSize}px ${safeFontFamily}`;
        ctx.fillStyle = style.fontColor;
        ctx.textAlign = 'center';
        
        return style.fontSize;
    }
    
    // Public API
    return {
        drawCircleBorder: drawCircleBorder,
        createCircularClip: createCircularClip,
        drawImageInCircle: drawImageInCircle,
        clearCanvas: clearCanvas,
        drawFallbackCircle: drawFallbackCircle,
        applyTextStyle: applyTextStyle
    };
})();
