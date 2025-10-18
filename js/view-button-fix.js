/* START OF CODE - Cline - 2025-05-28 17:04 File: js/view-button-fix.js */
/**
 * View Button Fix
 * Fixes issues with view buttons, canvas rendering, and zoom slider interaction
 * Ensures perfect circles are drawn regardless of canvas dimensions
 */

(function() {
    'use strict';
    
    console.log('View Button Fix: Initializing...');
    
    // Wait for dependencies
    function waitForDependencies() {
        if (!window.PerfectCircleCalculator || !window.CanvasDrawingUtils) {
            console.log('View Button Fix: Waiting for dependencies...');
            setTimeout(waitForDependencies, 100);
            return;
        }
        initialize();
    }
    
    // Track current view state
    let currentViewState = {
        type: null,  // 'star-map', 'street-map', 'canvas-layout', 'combined-landscape', 'combined-portrait'
        zoomLevel: 100 // Current zoom level
    };
    
    /**
     * Reset canvas state completely
     * This ensures no leftover transformations or clipping paths
     */
    function resetCanvasState() {
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) return null;
        
        // Store original dimensions
        const originalWidth = canvas.width;
        const originalHeight = canvas.height;
        
        // Get context and reset transformations
        const ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Clear canvas completely
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Reset canvas by recreating it
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'star-map-canvas';
        newCanvas.width = originalWidth;
        newCanvas.height = originalHeight;
        newCanvas.style.cssText = canvas.style.cssText;
        
        // Replace old canvas with new one
        canvas.parentNode.replaceChild(newCanvas, canvas);
        
        console.log('View Button Fix: Canvas state reset');
        return newCanvas.getContext('2d');
    }
    
    /**
     * Set canvas dimensions based on orientation
     * Ensures the canvas has the correct aspect ratio
     */
    function setCanvasDimensions(orientation) {
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) return;
        
        // Get dimensions from inputs
        let width = parseInt(document.getElementById('output-width').value) || 2550;
        let height = parseInt(document.getElementById('output-height').value) || 3300;
        
        // Adjust for orientation
        if (orientation === 'landscape' && width < height) {
            [width, height] = [height, width];
        } else if (orientation === 'portrait' && width > height) {
            [width, height] = [height, width];
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Fix display style
        canvas.style.height = 'auto';
        canvas.style.maxHeight = '600px';
        canvas.style.width = 'auto';
        canvas.style.maxWidth = '100%';
        
        console.log(`View Button Fix: Canvas dimensions set to ${width}x${height} for ${orientation} orientation`);
    }
    
    /**
     * Ensure perfect circles are drawn
     * This function overrides the PerfectCircleCalculator to force perfect circles
     */
    function ensurePerfectCircles() {
        console.log('View Button Fix: Ensuring perfect circles');
        
        // Save original functions
        const originalCalculatePerfectCircle = window.PerfectCircleCalculator.calculatePerfectCircle;
        const originalCalculateLandscapeCircles = window.PerfectCircleCalculator.calculateLandscapeCircles;
        const originalCalculatePortraitCircles = window.PerfectCircleCalculator.calculatePortraitCircles;
        
        // Override calculatePerfectCircle to ensure perfect circles
        window.PerfectCircleCalculator.calculatePerfectCircle = function(canvasWidth, canvasHeight, radiusPercent) {
            // Use the smaller dimension to ensure a perfect circle
            const maxDiameter = Math.min(canvasWidth, canvasHeight);
            const diameter = maxDiameter * (radiusPercent / 100);
            const radius = diameter / 2;
            
            // Center position
            const centerX = canvasWidth / 2;
            const centerY = canvasHeight / 2;
            
            return {
                centerX: centerX,
                centerY: centerY,
                radius: radius,
                diameter: diameter
            };
        };
        
        // Override calculateLandscapeCircles to ensure perfect circles
        window.PerfectCircleCalculator.calculateLandscapeCircles = function(canvasWidth, canvasHeight, radiusPercent, overlap = 20) {
            // Available space (with margins)
            const margin = 0.1; // 10% margin
            const availableHeight = canvasHeight * (1 - margin);
            
            // Calculate maximum diameter for each circle based on height
            const maxDiameter = availableHeight;
            const diameter = maxDiameter * (radiusPercent / 100);
            const radius = diameter / 2;
            
            // Calculate overlap
            const overlapFactor = 1 - (overlap / 100);
            const spacing = diameter * overlapFactor;
            
            // Calculate horizontal positions
            const totalWidth = diameter + spacing;
            const leftCenterX = (canvasWidth / 2) - (spacing / 2);
            const rightCenterX = (canvasWidth / 2) + (spacing / 2);
            const centerY = canvasHeight / 2;
            
            return {
                left: {
                    centerX: leftCenterX,
                    centerY: centerY,
                    radius: radius,
                    diameter: diameter
                },
                right: {
                    centerX: rightCenterX,
                    centerY: centerY,
                    radius: radius,
                    diameter: diameter
                }
            };
        };
        
        // Override calculatePortraitCircles to ensure perfect circles
        window.PerfectCircleCalculator.calculatePortraitCircles = function(canvasWidth, canvasHeight, radiusPercent, overlap = 20) {
            // Available space (with margins)
            const margin = 0.1; // 10% margin
            const availableWidth = canvasWidth * (1 - margin);
            
            // Calculate maximum diameter for each circle based on width
            const maxDiameter = availableWidth;
            const diameter = maxDiameter * (radiusPercent / 100);
            const radius = diameter / 2;
            
            // Calculate overlap
            const overlapFactor = 1 - (overlap / 100);
            const spacing = diameter * overlapFactor;
            
            // Calculate vertical positions
            const totalHeight = diameter + spacing;
            const topCenterY = (canvasHeight / 2) - (spacing / 2);
            const bottomCenterY = (canvasHeight / 2) + (spacing / 2);
            const centerX = canvasWidth / 2;
            
            return {
                top: {
                    centerX: centerX,
                    centerY: topCenterY,
                    radius: radius,
                    diameter: diameter
                },
                bottom: {
                    centerX: centerX,
                    centerY: bottomCenterY,
                    radius: radius,
                    diameter: diameter
                }
            };
        };
    }
    
    /**
     * Fix zoom slider interaction
     */
    function fixZoomSlider() {
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        
        if (zoomSlider && zoomValue) {
            // Remove any existing event listeners
            const newZoomSlider = zoomSlider.cloneNode(true);
            zoomSlider.parentNode.replaceChild(newZoomSlider, zoomSlider);
            
            // Add new event listener
            newZoomSlider.addEventListener('input', function() {
                zoomValue.textContent = this.value;
                currentViewState.zoomLevel = parseInt(this.value);
                
                // Redraw the current view with the new zoom level
                switch (currentViewState.type) {
                    case 'star-map':
                        viewStarMap();
                        break;
                    case 'street-map':
                        viewStreetMap();
                        break;
                    case 'canvas-layout':
                        viewStarMapCanvas();
                        break;
                    case 'combined-landscape':
                        viewStarStreetLandscape();
                        break;
                    case 'combined-portrait':
                        viewStarStreetPortrait();
                        break;
                }
            });
            
            console.log('View Button Fix: Zoom slider fixed');
        }
    }
    
    /**
     * Override viewStarMap function
     */
    function overrideViewStarMap() {
        const originalViewStarMap = window.viewStarMap;
        
        window.viewStarMap = function() {
            console.log('View Button Fix: Using fixed viewStarMap');
            
            // Update current view state
            currentViewState.type = 'star-map';
            
            // Reset canvas state
            setCanvasDimensions('portrait');
            resetCanvasState();
            
            // Ensure perfect circles
            ensurePerfectCircles();
            
            // Call original function
            if (typeof originalViewStarMap === 'function') {
                originalViewStarMap.call(this);
            }
        };
    }
    
    /**
     * Override viewStreetMap function
     */
    function overrideViewStreetMap() {
        const originalViewStreetMap = window.viewStreetMap;
        
        window.viewStreetMap = function() {
            console.log('View Button Fix: Using fixed viewStreetMap');
            
            // Update current view state
            currentViewState.type = 'street-map';
            
            // Reset canvas state
            setCanvasDimensions('portrait');
            resetCanvasState();
            
            // Ensure perfect circles
            ensurePerfectCircles();
            
            // Call original function
            if (typeof originalViewStreetMap === 'function') {
                originalViewStreetMap.call(this);
            }
        };
    }
    
    /**
     * Override viewStarMapCanvas function
     */
    function overrideViewStarMapCanvas() {
        const originalViewStarMapCanvas = window.viewStarMapCanvas;
        
        window.viewStarMapCanvas = function() {
            console.log('View Button Fix: Using fixed viewStarMapCanvas');
            
            // Update current view state
            currentViewState.type = 'canvas-layout';
            
            // Reset canvas state
            setCanvasDimensions('portrait');
            resetCanvasState();
            
            // Ensure perfect circles
            ensurePerfectCircles();
            
            // Call original function
            if (typeof originalViewStarMapCanvas === 'function') {
                originalViewStarMapCanvas.call(this);
            }
        };
    }
    
    /**
     * Override viewStarStreetLandscape function
     */
    function overrideViewStarStreetLandscape() {
        const originalViewStarStreetLandscape = window.viewStarStreetLandscape;
        
        window.viewStarStreetLandscape = function() {
            console.log('View Button Fix: Using fixed viewStarStreetLandscape');
            
            // Update current view state
            currentViewState.type = 'combined-landscape';
            
            // Reset canvas state
            setCanvasDimensions('landscape');
            resetCanvasState();
            
            // Ensure perfect circles
            ensurePerfectCircles();
            
            // Get combined view settings
            const overlapPercent = window.combinedViewSettings?.overlapPercent || 30;
            const streetMapFirst = window.combinedViewSettings?.streetMapFirst !== false;
            
            // Store settings in global variables for other scripts to use
            window._combinedViewOverlapPercent = overlapPercent;
            window._combinedViewStreetMapFirst = streetMapFirst;
            
            // Call original function
            if (typeof originalViewStarStreetLandscape === 'function') {
                originalViewStarStreetLandscape.call(this);
            }
        };
    }
    
    /**
     * Override viewStarStreetPortrait function
     */
    function overrideViewStarStreetPortrait() {
        const originalViewStarStreetPortrait = window.viewStarStreetPortrait;
        
        window.viewStarStreetPortrait = function() {
            console.log('View Button Fix: Using fixed viewStarStreetPortrait');
            
            // Update current view state
            currentViewState.type = 'combined-portrait';
            
            // Reset canvas state
            setCanvasDimensions('portrait');
            resetCanvasState();
            
            // Ensure perfect circles
            ensurePerfectCircles();
            
            // Get combined view settings
            const overlapPercent = window.combinedViewSettings?.overlapPercent || 30;
            const streetMapFirst = window.combinedViewSettings?.streetMapFirst !== false;
            
            // Store settings in global variables for other scripts to use
            window._combinedViewOverlapPercent = overlapPercent;
            window._combinedViewStreetMapFirst = streetMapFirst;
            
            // Call original function
            if (typeof originalViewStarStreetPortrait === 'function') {
                originalViewStarStreetPortrait.call(this);
            }
        };
    }
    
    /**
     * Initialize all fixes
     */
    function initialize() {
        // Override view functions
        overrideViewStarMap();
        overrideViewStreetMap();
        overrideViewStarMapCanvas();
        overrideViewStarStreetLandscape();
        overrideViewStarStreetPortrait();
        
        // Fix zoom slider
        fixZoomSlider();
        
        // Apply perfect circle fix immediately
        ensurePerfectCircles();
        
        console.log('View Button Fix: All fixes applied');
    }
    
    // Start waiting for dependencies
    waitForDependencies();
    
})();
/* END OF CODE - Cline - 2025-05-28 17:04 File: js/view-button-fix.js */
