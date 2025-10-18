/**
 * Perfect Circle Fix
 * This script directly modifies the canvas drawing functions to ensure perfect circles
 */

(function() {
    'use strict';
    
    console.log('Perfect Circle Fix: Initializing...');
    
    // Function to override the arc method of the CanvasRenderingContext2D prototype
    function overrideArcMethod() {
        // Store the original arc method
        const originalArc = CanvasRenderingContext2D.prototype.arc;
        
        // Override the arc method to ensure perfect circles
        CanvasRenderingContext2D.prototype.arc = function(x, y, radius, startAngle, endAngle, counterclockwise) {
            console.log('Drawing arc with radius:', radius);
            
            // Get the canvas dimensions
            const canvas = this.canvas;
            if (!canvas) {
                console.warn('Canvas not available for arc method');
                return originalArc.call(this, x, y, radius, startAngle, endAngle, counterclockwise);
            }
            
            console.log('Canvas dimensions for arc:', canvas.width, 'x', canvas.height);
            
            // Calculate the aspect ratio
            const aspectRatio = canvas.width / canvas.height;
            console.log('Canvas aspect ratio:', aspectRatio);
            
            // If the canvas is not a perfect square, adjust the radius
            if (Math.abs(aspectRatio - 1) > 0.01) {
                console.log('Canvas is not a perfect square, adjusting radius');
                
                // Calculate the adjusted radius based on the aspect ratio
                let adjustedRadius = radius;
                if (aspectRatio > 1) {
                    // Width > Height, adjust x-radius
                    adjustedRadius = radius / aspectRatio;
                    console.log('Width > Height, adjusted radius:', adjustedRadius);
                } else {
                    // Height > Width, adjust y-radius
                    adjustedRadius = radius * aspectRatio;
                    console.log('Height > Width, adjusted radius:', adjustedRadius);
                }
                
                // Call the original arc method with the adjusted radius
                return originalArc.call(this, x, y, adjustedRadius, startAngle, endAngle, counterclockwise);
            }
            
            // If the canvas is a perfect square, use the original arc method
            return originalArc.call(this, x, y, radius, startAngle, endAngle, counterclockwise);
        };
        
        console.log('Arc method overridden');
    }
    
    // Function to override the ellipse method of the CanvasRenderingContext2D prototype
    function overrideEllipseMethod() {
        // Store the original ellipse method
        const originalEllipse = CanvasRenderingContext2D.prototype.ellipse;
        
        // Override the ellipse method to ensure perfect circles
        CanvasRenderingContext2D.prototype.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise) {
            console.log('Drawing ellipse with radiusX:', radiusX, 'radiusY:', radiusY);
            
            // If radiusX and radiusY are different, make them the same (use the smaller one)
            if (Math.abs(radiusX - radiusY) > 0.01) {
                console.log('Ellipse is not a perfect circle, adjusting radii');
                const radius = Math.min(radiusX, radiusY);
                console.log('Using radius:', radius);
                return originalEllipse.call(this, x, y, radius, radius, rotation, startAngle, endAngle, counterclockwise);
            }
            
            // If radiusX and radiusY are the same, use the original ellipse method
            return originalEllipse.call(this, x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise);
        };
        
        console.log('Ellipse method overridden');
    }
    
    // Function to add a CSS fix for circle elements
    function addCSSFix() {
        const style = document.createElement('style');
        style.textContent = `
            /* Force circles to be perfectly round */
            .star-map-circle, 
            .street-map-circle, 
            [class*="circle"], 
            [class*="Circle"], 
            [id*="circle"], 
            [id*="Circle"],
            .circle,
            .Circle {
                border-radius: 50% !important;
                aspect-ratio: 1 / 1 !important;
                overflow: hidden !important;
                transform: none !important;
            }
            
            /* Ensure canvas maintains aspect ratio */
            #star-map-canvas {
                display: block !important;
                margin: 0 auto !important;
            }
        `;
        document.head.appendChild(style);
        console.log('CSS fix added');
    }
    
    // Function to add a button to force perfect circles
    function addPerfectCircleButton() {
        const button = document.createElement('button');
        button.textContent = 'Force Perfect Circles';
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 5px;
        `;
        
        button.onclick = function() {
            console.log('Force Perfect Circles button clicked');
            
            // Force perfect circles for all circle elements
            const circles = document.querySelectorAll('.star-map-circle, .street-map-circle, [class*="circle"], [class*="Circle"], [id*="circle"], [id*="Circle"], .circle, .Circle');
            circles.forEach(circle => {
                // Get the smaller dimension to ensure a perfect circle
                const size = Math.min(circle.offsetWidth, circle.offsetHeight);
                
                // Force the circle to be perfectly round
                circle.style.width = size + 'px';
                circle.style.height = size + 'px';
                circle.style.borderRadius = '50%';
                
                // Remove any transforms that might distort the circle
                circle.style.transform = 'none';
                
                // Add a border to make the circle more visible
                circle.style.border = '2px solid gold';
                
                console.log('Forced circle to be round:', circle.className || circle.id, 'size:', size);
            });
            
            // Also try to fix SVG circles if present
            const svgCircles = document.querySelectorAll('svg circle');
            svgCircles.forEach(circle => {
                const r = circle.getAttribute('r');
                if (r) {
                    circle.setAttribute('rx', r);
                    circle.setAttribute('ry', r);
                    console.log('Fixed SVG circle with radius:', r);
                }
            });
            
            // Force redraw of the canvas
            const canvas = document.getElementById('star-map-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    // Clear the canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    // Do NOT force the canvas to be a perfect square
                    // Instead, just log the current dimensions
                    console.log('Current canvas dimensions:', canvas.width, 'x', canvas.height);
                    
                    // Trigger a redraw
                    if (typeof window.redrawPreviewCanvas === 'function') {
                        window.redrawPreviewCanvas();
                        console.log('Triggered redraw of preview canvas');
                    }
                }
            }
        };
        
        document.body.appendChild(button);
        console.log('Perfect Circle button added');
    }
    
    // Initialize the fix
    function initialize() {
        // Override the arc and ellipse methods
        overrideArcMethod();
        overrideEllipseMethod();
        
        // Add CSS fix
        addCSSFix();
        
        // Add button to force perfect circles
        addPerfectCircleButton();
        
        console.log('Perfect Circle Fix: Initialized');
    }
    
    // Initialize when the page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded
        initialize();
    }
})();
