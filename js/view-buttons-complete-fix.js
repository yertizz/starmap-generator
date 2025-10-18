/* START OF CODE - AI Fix - 2025-10-15 - Complete View Button Fix */
/**
 * This script provides comprehensive fixes for all 5 view buttons:
 * 1. Star Map - Ensures perfect circle
 * 2. Street Map - Ensures perfect circle
 * 3. Canvas Layout - Perfect circle + text overlays
 * 4. Combined (Landscape) - Perfect circles + borders + text overlays
 * 5. Combined (Portrait) - Perfect circles + borders + text overlays + STATE RESET
 */

(function() {
    'use strict';
    
    console.log('[View Fix] Initializing comprehensive view button fix...');
    
    // Global state management
    let currentView = null;
    let canvasState = {
        width: 800,
        height: 800,
        aspectRatio: 1
    };
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    function initialize() {
        console.log('[View Fix] DOM ready, setting up view button handlers...');
        
        // Get canvas and context
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) {
            console.error('[View Fix] Canvas not found!');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        // Get all view buttons
        const buttons = {
            starMap: document.getElementById('view-star-map-btn'),
            streetMap: document.getElementById('view-street-map-btn'),
            canvasLayout: document.getElementById('view-star-map-canvas-btn'),
            landscape: document.getElementById('view-star-street-landscape-btn'),
            portrait: document.getElementById('view-star-street-portrait-btn')
        };
        
        // Verify all buttons exist
        for (let [name, button] of Object.entries(buttons)) {
            if (!button) {
                console.warn(`[View Fix] Button not found: ${name}`);
            } else {
                console.log(`[View Fix] Found button: ${name}`);
            }
        }
        
        // Add event listeners with proper state reset
        if (buttons.starMap) {
            buttons.starMap.addEventListener('click', function() {
                resetCanvasState(canvas);
                currentView = 'starMap';
                console.log('[View Fix] Star Map view requested');
                // Let existing code handle it, just ensure state is clean
            });
        }
        
        if (buttons.streetMap) {
            buttons.streetMap.addEventListener('click', function() {
                resetCanvasState(canvas);
                currentView = 'streetMap';
                console.log('[View Fix] Street Map view requested');
                // Let existing code handle it, just ensure state is clean
            });
        }
        
        if (buttons.canvasLayout) {
            buttons.canvasLayout.addEventListener('click', function() {
                resetCanvasState(canvas);
                currentView = 'canvasLayout';
                console.log('[View Fix] Canvas Layout view requested');
                // Wait a bit for existing code to render, then add text overlays
                setTimeout(function() {
                    addTextOverlays(canvas, ctx);
                }, 500);
            });
        }
        
        if (buttons.landscape) {
            buttons.landscape.addEventListener('click', function() {
                resetCanvasState(canvas);
                currentView = 'landscape';
                console.log('[View Fix] Combined Landscape view requested');
                // Wait for existing code to render, then add borders and text
                setTimeout(function() {
                    addCircleBorders(canvas, ctx, 'landscape');
                    addTextOverlays(canvas, ctx);
                }, 500);
            });
        }
        
        if (buttons.portrait) {
            buttons.portrait.addEventListener('click', function() {
                resetCanvasState(canvas);
                currentView = 'portrait';
                console.log('[View Fix] Combined Portrait view requested');
                // Wait for existing code to render, then add borders and text
                setTimeout(function() {
                    addCircleBorders(canvas, ctx, 'portrait');
                    addTextOverlays(canvas, ctx);
                }, 500);
            });
        }
        
        console.log('[View Fix] All view button handlers installed');
    }
    
    /**
     * Reset canvas state to prevent corruption
     */
    function resetCanvasState(canvas) {
        console.log('[View Fix] Resetting canvas state...');
        
        // Force canvas to maintain square aspect ratio
        const rect = canvas.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height);
        
        // Reset canvas transform
        const ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Ensure aspect ratio style is maintained
        canvas.style.aspectRatio = '1/1';
        
        console.log('[View Fix] Canvas state reset complete');
    }
    
    /**
     * Add circle borders for combined views
     */
    function addCircleBorders(canvas, ctx, viewType) {
        console.log(`[View Fix] Adding circle borders for ${viewType} view...`);
        
        // Get border settings
        const borderWidth = parseInt(document.getElementById('border-width')?.value) || 1;
        const borderColor = document.getElementById('border-color')?.value || '#FFFFFF';
        const circleRadiusPercent = parseInt(document.getElementById('circle-radius-percent')?.value) || 60;
        
        // Calculate circle positions and sizes
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const maxSize = Math.min(canvasWidth, canvasHeight);
        const radius = (maxSize * circleRadiusPercent / 100) / 2;
        
        // Get overlap percentage
        const overlapPercent = parseInt(document.getElementById('circle-overlap-percent')?.value) || 30;
        const overlapDistance = (radius * 2 * overlapPercent) / 100;
        
        if (viewType === 'landscape') {
            // Side by side
            const centerY = canvasHeight / 2;
            const spacing = (radius * 2) - overlapDistance;
            const leftCircleX = (canvasWidth / 2) - (spacing / 2);
            const rightCircleX = (canvasWidth / 2) + (spacing / 2);
            
            // Draw borders
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = borderWidth;
            
            ctx.beginPath();
            ctx.arc(leftCircleX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(rightCircleX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
            
            console.log('[View Fix] Drew landscape circle borders');
        } else if (viewType === 'portrait') {
            // One above the other
            const centerX = canvasWidth / 2;
            const spacing = (radius * 2) - overlapDistance;
            const topCircleY = (canvasHeight / 2) - (spacing / 2);
            const bottomCircleY = (canvasHeight / 2) + (spacing / 2);
            
            // Draw borders
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = borderWidth;
            
            ctx.beginPath();
            ctx.arc(centerX, topCircleY, radius, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(centerX, bottomCircleY, radius, 0, Math.PI * 2);
            ctx.stroke();
            
            console.log('[View Fix] Drew portrait circle borders');
        }
    }
    
    /**
     * Add text overlays to canvas
     */
    function addTextOverlays(canvas, ctx) {
        console.log('[View Fix] Adding text overlays...');
        
        // Get all text entries and their settings
        const textEntries = [];
        
        // Text entries 1-4
        for (let i = 1; i <= 4; i++) {
            const textInput = document.getElementById(`text-entry-${i}`);
            const orderSelect = document.getElementById(`text-placement-order-${i}`);
            const posAbove = document.getElementById(`text-placement-pos-${i}-above`);
            const posBelow = document.getElementById(`text-placement-pos-${i}-below`);
            const fontFamily = document.getElementById(`font-family-${i}`)?.value || 'Open Sans';
            const fontSize = document.getElementById(`font-size-${i}`)?.value || '24';
            const fontColor = document.getElementById(`font-color-${i}`)?.value || '#FFFFFF';
            const isBold = document.getElementById(`text-bold-${i}`)?.checked || false;
            const isItalic = document.getElementById(`text-italic-${i}`)?.checked || false;
            
            if (textInput && textInput.value) {
                textEntries.push({
                    content: textInput.value,
                    order: parseInt(orderSelect?.value) || i,
                    position: posAbove?.checked ? 'above' : 'below',
                    fontFamily: fontFamily,
                    fontSize: parseInt(fontSize),
                    fontColor: fontColor,
                    bold: isBold,
                    italic: isItalic,
                    type: 'entry'
                });
            }
        }
        
        // Date
        const dateDisplay = document.getElementById('fixed-date-value');
        const dateOrder = document.getElementById('text-placement-order-date');
        const datePosAbove = document.getElementById('text-placement-pos-date-above');
        const dateFontFamily = document.getElementById('fixed-font-family-date')?.value || 'Bebas Neue';
        const dateFontColor = document.getElementById('fixed-font-color-date')?.value || '#FFFFFF';
        const dateBold = document.getElementById('fixed-text-bold-date')?.checked || false;
        const dateItalic = document.getElementById('fixed-text-italic-date')?.checked || false;
        
        if (dateDisplay && dateDisplay.textContent) {
            textEntries.push({
                content: dateDisplay.textContent,
                order: parseInt(dateOrder?.value) || 5,
                position: datePosAbove?.checked ? 'above' : 'below',
                fontFamily: dateFontFamily,
                fontSize: 24,
                fontColor: dateFontColor,
                bold: dateBold,
                italic: dateItalic,
                type: 'date'
            });
        }
        
        // Coordinates
        const coordsDisplay = document.getElementById('fixed-coords-value');
        const coordsOrder = document.getElementById('text-placement-order-coords');
        const coordsPosAbove = document.getElementById('text-placement-pos-coords-above');
        const coordsFontFamily = document.getElementById('fixed-font-family-coords')?.value || 'Bebas Neue';
        const coordsFontColor = document.getElementById('fixed-font-color-coords')?.value || '#FFFFFF';
        const coordsBold = document.getElementById('fixed-text-bold-coords')?.checked || false;
        const coordsItalic = document.getElementById('fixed-text-italic-coords')?.checked || false;
        
        if (coordsDisplay && coordsDisplay.textContent) {
            textEntries.push({
                content: coordsDisplay.textContent,
                order: parseInt(coordsOrder?.value) || 6,
                position: coordsPosAbove?.checked ? 'above' : 'below',
                fontFamily: coordsFontFamily,
                fontSize: 24,
                fontColor: coordsFontColor,
                bold: coordsBold,
                italic: coordsItalic,
                type: 'coords'
            });
        }
        
        console.log('[View Fix] Found', textEntries.length, 'text entries to render');
        
        if (textEntries.length === 0) {
            console.warn('[View Fix] No text entries found to render');
            return;
        }
        
        // Sort by order
        textEntries.sort((a, b) => a.order - b.order);
        
        // Separate above and below
        const textsAbove = textEntries.filter(t => t.position === 'above');
        const textsBelow = textEntries.filter(t => t.position === 'below');
        
        console.log('[View Fix] Texts above:', textsAbove.length, 'Texts below:', textsBelow.length);
        
        // Calculate circle position and size
        const circleRadiusPercent = parseInt(document.getElementById('circle-radius-percent')?.value) || 60;
        const maxSize = Math.min(canvas.width, canvas.height);
        const radius = (maxSize * circleRadiusPercent / 100) / 2;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Starting positions for text
        const topOfCircle = centerY - radius;
        const bottomOfCircle = centerY + radius;
        const lineHeight = 40;
        const margin = 20;
        
        // Draw texts above circle
        let yAbove = topOfCircle - margin;
        textsAbove.reverse().forEach(function(text) {
            const fontStyle = `${text.italic ? 'italic' : ''} ${text.bold ? 'bold' : ''} ${text.fontSize}px ${text.fontFamily}`;
            ctx.font = fontStyle.trim();
            ctx.fillStyle = text.fontColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            
            ctx.fillText(text.content, centerX, yAbove);
            yAbove -= lineHeight;
            
            console.log('[View Fix] Drew text above:', text.content);
        });
        
        // Draw texts below circle
        let yBelow = bottomOfCircle + margin + lineHeight;
        textsBelow.forEach(function(text) {
            const fontStyle = `${text.italic ? 'italic' : ''} ${text.bold ? 'bold' : ''} ${text.fontSize}px ${text.fontFamily}`;
            ctx.font = fontStyle.trim();
            ctx.fillStyle = text.fontColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            
            ctx.fillText(text.content, centerX, yBelow);
            yBelow += lineHeight;
            
            console.log('[View Fix] Drew text below:', text.content);
        });
        
        console.log('[View Fix] Text overlays complete');
    }
    
    // Expose functions globally for manual testing
    window.viewFix = {
        resetCanvasState: resetCanvasState,
        addTextOverlays: function() {
            const canvas = document.getElementById('star-map-canvas');
            const ctx = canvas.getContext('2d');
            addTextOverlays(canvas, ctx);
        },
        addCircleBorders: function(viewType) {
            const canvas = document.getElementById('star-map-canvas');
            const ctx = canvas.getContext('2d');
            addCircleBorders(canvas, ctx, viewType);
        }
    };
    
})();
/* END OF CODE - AI Fix - 2025-10-15 - Complete View Button Fix */
