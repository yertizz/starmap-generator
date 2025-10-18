N/**
 * Canvas Display Fix
 * Fixes issues with canvas display, including:
 * 1. Excessive canvas container height
 * 2. Google Maps disappearing in combined views
 */

(function() {
    'use strict';
    
    console.log('Canvas Display Fix: Initializing...');
    
    // Wait for dependencies
    function waitForDependencies() {
        // Check if the canvas and view functions exist
        if (!document.getElementById('star-map-canvas') || 
            typeof window.viewStarMap !== 'function' ||
            typeof window.viewStreetMap !== 'function' ||
            typeof window.viewStarMapCanvas !== 'function' ||
            typeof window.viewStarStreetLandscape !== 'function' ||
            typeof window.viewStarStreetPortrait !== 'function') {
            console.log('Canvas Display Fix: Waiting for dependencies...');
            setTimeout(waitForDependencies, 100);
            return;
        }
        
        initialize();
    }
    
    /**
     * Fix canvas container height
     * This function fixes the excessive height of the canvas container
     */
    function fixCanvasContainerHeight() {
        console.log('Canvas Display Fix: Fixing canvas container height');
        
        // Add CSS to fix the canvas container height
        const style = document.createElement('style');
        style.textContent = `
            .canvas-container {
                height: auto !important;
                min-height: auto !important;
                max-height: 80vh !important;
                overflow: hidden !important;
                background-color: transparent !important;
                padding-bottom: 20px !important;
            }
            
            #star-map-canvas {
                display: block !important;
                margin: 0 auto !important;
                max-height: 70vh !important;
                height: auto !important;
                width: auto !important;
                max-width: 100% !important;
                object-fit: contain !important;
            }
        `;
        document.head.appendChild(style);
        
        // Apply the fix to the existing canvas container
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            canvasContainer.style.height = 'auto';
            canvasContainer.style.minHeight = 'auto';
            canvasContainer.style.maxHeight = '80vh';
            canvasContainer.style.overflow = 'hidden';
            canvasContainer.style.backgroundColor = 'transparent';
            canvasContainer.style.paddingBottom = '20px';
        }
        
        // Apply the fix to the canvas
        const canvas = document.getElementById('star-map-canvas');
        if (canvas) {
            canvas.style.display = 'block';
            canvas.style.margin = '0 auto';
            canvas.style.maxHeight = '70vh';
            canvas.style.height = 'auto';
            canvas.style.width = 'auto';
            canvas.style.maxWidth = '100%';
            canvas.style.objectFit = 'contain';
        }
        
        console.log('Canvas Display Fix: Canvas container height fixed');
    }
    
    /**
     * Fix Google Maps in combined views
     * This function ensures that Google Maps display correctly in combined views
     */
    function fixGoogleMapsInCombinedViews() {
        console.log('Canvas Display Fix: Fixing Google Maps in combined views');
        
        // Override the combined view functions
        const originalLandscape = window.viewStarStreetLandscape;
        const originalPortrait = window.viewStarStreetPortrait;
        
        // Override landscape view
        window.viewStarStreetLandscape = function() {
            console.log('Canvas Display Fix: Using fixed landscape view');
            
            // Call the original function
            if (typeof originalLandscape === 'function') {
                originalLandscape.call(this);
            }
            
            // Fix the canvas container height
            fixCanvasContainerHeight();
            
            // Get coordinates
            const latString = document.getElementById('latitude').value;
            const lngString = document.getElementById('longitude').value;
            let lat, lng;
            
            if (typeof parseFormattedCoordinate === 'function') {
                lat = parseFormattedCoordinate(latString, 'latitude');
                lng = parseFormattedCoordinate(lngString, 'longitude');
            } else {
                lat = parseFloat(latString);
                lng = parseFloat(lngString);
            }
            
            // Get canvas and context
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            // Get settings
            const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
            const borderWidth = parseInt(document.getElementById('border-width').value) || 2;
            const borderColor = document.getElementById('border-color').value || '#FDCA0D';
            const overlapPercent = window.combinedViewSettings?.overlapPercent || 30;
            const streetMapFirst = window.combinedViewSettings?.streetMapFirst !== false;
            
            // Calculate circle positions
            const calc = window.PerfectCircleCalculator || {
                calculateLandscapeCircles: function(canvasWidth, canvasHeight, radiusPercent, overlap) {
                    // Default implementation if PerfectCircleCalculator is not available
                    const margin = 0.1; // 10% margin
                    const availableHeight = canvasHeight * (1 - margin);
                    const maxDiameter = availableHeight;
                    const diameter = maxDiameter * (radiusPercent / 100);
                    const radius = diameter / 2;
                    const overlapFactor = 1 - (overlap / 100);
                    const spacing = diameter * overlapFactor;
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
                }
            };
            
            const circles = calc.calculateLandscapeCircles(canvas.width, canvas.height, radiusPercent, overlapPercent);
            
            // Swap circles if star map first
            const leftCircle = streetMapFirst ? circles.left : circles.right;
            const rightCircle = streetMapFirst ? circles.right : circles.left;
            
            // Create street map image
            const apiKey = "AIzaSyCpvv1IJYxwGVMh24MLFDH6LmupseApSZU";
            const mapSize = Math.round(leftCircle.diameter);
            const streetMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=${mapSize}x${mapSize}&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
            
            // Load street map image
            const streetMapImg = new Image();
            streetMapImg.crossOrigin = "Anonymous";
            
            streetMapImg.onload = function() {
                // Draw street map in left circle
                ctx.save();
                ctx.beginPath();
                ctx.arc(leftCircle.centerX, leftCircle.centerY, leftCircle.radius, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(streetMapImg, leftCircle.centerX - leftCircle.radius, leftCircle.centerY - leftCircle.radius, leftCircle.diameter, leftCircle.diameter);
                ctx.restore();
                
                // Draw border
                ctx.save();
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = borderWidth;
                ctx.beginPath();
                ctx.arc(leftCircle.centerX, leftCircle.centerY, leftCircle.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
                
                // Add label
                ctx.save();
                ctx.font = 'bold 16px Arial';
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.fillText('Street Map', leftCircle.centerX, leftCircle.centerY + leftCircle.radius + 20);
                ctx.restore();
            };
            
            // Set the source to load the image
            streetMapImg.src = streetMapUrl;
        };
        
        // Override portrait view
        window.viewStarStreetPortrait = function() {
            console.log('Canvas Display Fix: Using fixed portrait view');
            
            // Call the original function
            if (typeof originalPortrait === 'function') {
                originalPortrait.call(this);
            }
            
            // Fix the canvas container height
            fixCanvasContainerHeight();
            
            // Get coordinates
            const latString = document.getElementById('latitude').value;
            const lngString = document.getElementById('longitude').value;
            let lat, lng;
            
            if (typeof parseFormattedCoordinate === 'function') {
                lat = parseFormattedCoordinate(latString, 'latitude');
                lng = parseFormattedCoordinate(lngString, 'longitude');
            } else {
                lat = parseFloat(latString);
                lng = parseFloat(lngString);
            }
            
            // Get canvas and context
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            // Get settings
            const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
            const borderWidth = parseInt(document.getElementById('border-width').value) || 2;
            const borderColor = document.getElementById('border-color').value || '#FDCA0D';
            const overlapPercent = window.combinedViewSettings?.overlapPercent || 30;
            const streetMapFirst = window.combinedViewSettings?.streetMapFirst !== false;
            
            // Calculate circle positions
            const calc = window.PerfectCircleCalculator || {
                calculatePortraitCircles: function(canvasWidth, canvasHeight, radiusPercent, overlap) {
                    // Default implementation if PerfectCircleCalculator is not available
                    const margin = 0.1; // 10% margin
                    const availableWidth = canvasWidth * (1 - margin);
                    const maxDiameter = availableWidth;
                    const diameter = maxDiameter * (radiusPercent / 100);
                    const radius = diameter / 2;
                    const overlapFactor = 1 - (overlap / 100);
                    const spacing = diameter * overlapFactor;
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
                }
            };
            
            const circles = calc.calculatePortraitCircles(canvas.width, canvas.height, radiusPercent, overlapPercent);
            
            // Swap circles if star map first
            const topCircle = streetMapFirst ? circles.top : circles.bottom;
            const bottomCircle = streetMapFirst ? circles.bottom : circles.top;
            
            // Create street map image
            const apiKey = "AIzaSyCpvv1IJYxwGVMh24MLFDH6LmupseApSZU";
            const mapSize = Math.round(topCircle.diameter);
            const streetMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=${mapSize}x${mapSize}&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
            
            // Load street map image
            const streetMapImg = new Image();
            streetMapImg.crossOrigin = "Anonymous";
            
            streetMapImg.onload = function() {
                // Draw street map in top circle
                ctx.save();
                ctx.beginPath();
                ctx.arc(topCircle.centerX, topCircle.centerY, topCircle.radius, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(streetMapImg, topCircle.centerX - topCircle.radius, topCircle.centerY - topCircle.radius, topCircle.diameter, topCircle.diameter);
                ctx.restore();
                
                // Draw border
                ctx.save();
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = borderWidth;
                ctx.beginPath();
                ctx.arc(topCircle.centerX, topCircle.centerY, topCircle.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
                
                // Add label
                ctx.save();
                ctx.font = 'bold 16px Arial';
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.fillText('Street Map', topCircle.centerX, topCircle.centerY + 20);
                ctx.restore();
            };
            
            // Set the source to load the image
            streetMapImg.src = streetMapUrl;
        };
        
        console.log('Canvas Display Fix: Google Maps in combined views fixed');
    }
    
    /**
     * Fix all view functions to ensure proper canvas display
     */
    function fixAllViewFunctions() {
        console.log('Canvas Display Fix: Fixing all view functions');
        
        // Store original functions
        const originalFunctions = {
            viewStarMap: window.viewStarMap,
            viewStreetMap: window.viewStreetMap,
            viewStarMapCanvas: window.viewStarMapCanvas
        };
        
        // Override viewStarMap
        window.viewStarMap = function() {
            console.log('Canvas Display Fix: Using fixed viewStarMap');
            
            // Call original function
            if (typeof originalFunctions.viewStarMap === 'function') {
                originalFunctions.viewStarMap.call(this);
            }
            
            // Fix the canvas container height
            fixCanvasContainerHeight();
        };
        
        // Override viewStreetMap
        window.viewStreetMap = function() {
            console.log('Canvas Display Fix: Using fixed viewStreetMap');
            
            // Call original function
            if (typeof originalFunctions.viewStreetMap === 'function') {
                originalFunctions.viewStreetMap.call(this);
            }
            
            // Fix the canvas container height
            fixCanvasContainerHeight();
        };
        
        // Override viewStarMapCanvas
        window.viewStarMapCanvas = function() {
            console.log('Canvas Display Fix: Using fixed viewStarMapCanvas');
            
            // Call original function
            if (typeof originalFunctions.viewStarMapCanvas === 'function') {
                originalFunctions.viewStarMapCanvas.call(this);
            }
            
            // Fix the canvas container height
            fixCanvasContainerHeight();
        };
        
        console.log('Canvas Display Fix: All view functions fixed');
    }
    
    /**
     * Add event listeners to view buttons
     */
    function addViewButtonListeners() {
        console.log('Canvas Display Fix: Adding view button listeners');
        
        // Get all view buttons
        const viewButtons = [
            document.getElementById('view-star-map-btn'),
            document.getElementById('view-street-map-btn'),
            document.getElementById('view-star-map-canvas-btn'),
            document.getElementById('view-star-street-landscape-btn'),
            document.getElementById('view-star-street-portrait-btn')
        ];
        
        // Add click event listeners
        viewButtons.forEach(button => {
            if (button) {
                // Store the original onclick handler
                const originalOnClick = button.onclick;
                
                // Override the onclick handler
                button.onclick = function(event) {
                    console.log(`Canvas Display Fix: ${button.id} clicked`);
                    
                    // Call the original onclick handler
                    if (typeof originalOnClick === 'function') {
                        originalOnClick.call(this, event);
                    }
                    
                    // Fix the canvas container height after a short delay
                    setTimeout(fixCanvasContainerHeight, 100);
                };
            }
        });
        
        console.log('Canvas Display Fix: View button listeners added');
    }
    
    /**
     * Initialize all fixes
     */
    function initialize() {
        console.log('Canvas Display Fix: Initializing all fixes');
        
        // Fix the canvas container height
        fixCanvasContainerHeight();
        
        // Fix Google Maps in combined views
        fixGoogleMapsInCombinedViews();
        
        // Fix all view functions
        fixAllViewFunctions();
        
        // Add event listeners to view buttons
        addViewButtonListeners();
        
        console.log('Canvas Display Fix: All fixes initialized');
    }
    
    // Start immediately and also try multiple times
    initialize();

    // Also run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded, run now
        setTimeout(initialize, 100);
    }

    // And on window load
    window.addEventListener('load', () => {
        setTimeout(initialize, 500);
        // Try again after a longer delay
        setTimeout(initialize, 2000);
    });

    // Also set up a periodic check
    setInterval(() => {
        // Check if canvas container still has excessive height
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer && canvasContainer.offsetHeight > window.innerHeight * 0.8) {
            console.log('Canvas Display Fix: Detected excessive height, reapplying fixes');
            fixCanvasContainerHeight();
        }
    }, 3000);
    
})();
