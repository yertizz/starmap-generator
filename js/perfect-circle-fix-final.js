/* START OF CODE - Emergent - 2025-10-15 [9:34-PM-EST] File: js/perfect-circle-fix-final.js */
/**
 * PERFECT CIRCLE FIX - FINAL VERSION
 * This script fixes oval issues by replacing ellipse drawing with perfect circles
 * 
 * ROOT CAUSE: The original code uses ctx.ellipse() with different radiusX and radiusY
 * SOLUTION: Use ctx.arc() with a single radius for perfect circles
 * 
 * NOTE: Text rendering is now handled by view button functions, NOT by this script
 */

(function() {
    'use strict';
    
    console.log('🔵 PERFECT CIRCLE FIX: Loading...');
    
    // Wait for the page to be fully loaded
    function initialize() {
        console.log('🔵 PERFECT CIRCLE FIX: Initializing...');
        
        // Override the redrawPreviewCanvas function
        if (typeof window.redrawPreviewCanvas === 'function') {
            console.log('🔵 PERFECT CIRCLE FIX: Overriding redrawPreviewCanvas...');
            
            const originalRedraw = window.redrawPreviewCanvas;
            
            window.redrawPreviewCanvas = async function() {
                console.log('🔵 PERFECT CIRCLE FIX: Using fixed redrawPreviewCanvas');
                
                const canvas = document.getElementById("star-map-canvas");
                if (!canvas || !window.lastGeneratedMapBlob) {
                    console.warn("Cannot redraw preview: Canvas or stored blob not available.");
                    return;
                }

                let ctx = canvas.getContext("2d");
                if (!ctx) {
                    console.error("Canvas context not available for redraw.");
                    return;
                }

                try {
                    const getEl = id => document.getElementById(id);
                    const getVal = (id, def) => getEl(id)?.value || def;
                    const getInt = (id, def) => parseInt(getVal(id, String(def))) || def;
                    const getChecked = id => getEl(id)?.checked || false;
                    const getRadioVal = (name, def) => {
                        const checkedRadio = document.querySelector(`input[name="${name}"]:checked`);
                        return checkedRadio ? checkedRadio.value : def;
                    };

                    const circleRadiusPercent = getInt("circle-radius-percent", 90);
                    const borderWidth = getInt("border-width", 1);
                    const borderColor = getVal("border-color", "#FFFFFF");
                    const dateValue = getVal("date", "");
                    const latFullFormatted = getVal("latitude", "");
                    const lonFullFormatted = getVal("longitude", "");

                    // Clear canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    console.log("🔵 Cleared canvas for redraw.");

                    // Create bitmap from stored blob
                    const imageBitmap = await createImageBitmap(window.lastGeneratedMapBlob);
                    console.log("🔵 Created ImageBitmap from stored blob.");

                    // *** FIX: Use SINGLE radius for perfect circle ***
                    const minCanvasDim = Math.min(canvas.width, canvas.height);
                    const radius = (minCanvasDim * (circleRadiusPercent / 100)) / 2;
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height * 0.50;

                    console.log(`🔵 PERFECT CIRCLE: radius=${radius}, centerX=${centerX}, centerY=${centerY}`);

                    // Apply Clip Path using ARC (perfect circle)
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);  // *** FIXED: Using arc() ***
                    ctx.closePath();
                    ctx.clip();

                    // Calculate scaling for the image
                    const diameter = radius * 2;
                    const imgScaleFactor = Math.max(diameter / imageBitmap.width, diameter / imageBitmap.height);
                    const drawWidth = imageBitmap.width * imgScaleFactor;
                    const drawHeight = imageBitmap.height * imgScaleFactor;
                    const drawX = centerX - drawWidth / 2;
                    const drawY = centerY - drawHeight / 2;

                    // Apply zoom factor
                    const currentZoomLevel = parseInt(getEl('zoom-slider')?.value) || 100;
                    const zoomFactor = currentZoomLevel / 100;
                    let sx = 0, sy = 0, sWidth = imageBitmap.width, sHeight = imageBitmap.height;
                    
                    if (zoomFactor > 1) {
                        sWidth = imageBitmap.width / zoomFactor;
                        sHeight = imageBitmap.height / zoomFactor;
                        sx = (imageBitmap.width - sWidth) / 2;
                        sy = (imageBitmap.height - sHeight) / 2;
                    }

                    // Draw the image (zoomed)
                    ctx.drawImage(imageBitmap, sx, sy, sWidth, sHeight, drawX, drawY, drawWidth, drawHeight);
                    imageBitmap.close();

                    // Restore context (remove clip)
                    ctx.restore();
                    console.log("🔵 Redrew star map image with PERFECT CIRCLE");

                    // Draw Border using ARC (perfect circle)
                    if (borderWidth > 0) {
                        ctx.strokeStyle = borderColor;
                        ctx.lineWidth = borderWidth;
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);  // *** FIXED: Using arc() ***
                        ctx.stroke();
                        console.log("🔵 Drew border with PERFECT CIRCLE");
                    }

                    // TEXT RENDERING IS NOW HANDLED BY VIEW BUTTON FUNCTIONS
                    // This prevents double-rendering of text layers
                    
                    console.log("🔵 PERFECT CIRCLE FIX: Redraw complete!");

                } catch (error) {
                    console.error("🔴 Error during preview redraw:", error);
                }
            };
            
            console.log('✅ PERFECT CIRCLE FIX: redrawPreviewCanvas overridden successfully!');
        } else {
            console.warn('⚠️ PERFECT CIRCLE FIX: redrawPreviewCanvas function not found yet, will retry...');
            setTimeout(initialize, 500);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
})();
