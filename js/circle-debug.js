/**
 * Circle Debug Script
 * This script will log all variables involved in circle calculations
 */

(function() {
    'use strict';
    
    console.log('Circle Debug Script: Initializing...');
    
    // Function to log all circle-related variables
    function logCircleVariables() {
        console.log('=== CIRCLE DEBUG: LOGGING ALL VARIABLES ===');
        
        // 1. Canvas dimensions
        const canvas = document.getElementById('star-map-canvas');
        if (canvas) {
            console.log('Canvas dimensions:');
            console.log('- canvas.width:', canvas.width);
            console.log('- canvas.height:', canvas.height);
            console.log('- canvas.style.width:', canvas.style.width);
            console.log('- canvas.style.height:', canvas.style.height);
            console.log('- canvas.offsetWidth:', canvas.offsetWidth);
            console.log('- canvas.offsetHeight:', canvas.offsetHeight);
            console.log('- canvas.clientWidth:', canvas.clientWidth);
            console.log('- canvas.clientHeight:', canvas.clientHeight);
            console.log('- canvas.getBoundingClientRect():', JSON.stringify(canvas.getBoundingClientRect()));
        } else {
            console.log('Canvas element not found!');
        }
        
        // 2. User input dimensions
        const widthInput = document.getElementById('width');
        const heightInput = document.getElementById('height');
        console.log('User input dimensions:');
        console.log('- width input value:', widthInput ? widthInput.value : 'not found');
        console.log('- height input value:', heightInput ? heightInput.value : 'not found');
        
        // 3. Circle radius percentage
        const radiusPercentInput = document.getElementById('circle-radius-percent');
        console.log('Circle radius percentage:', radiusPercentInput ? radiusPercentInput.value : 'not found');
        
        // 4. Circle overlap percentage (for combined views)
        const overlapPercentInput = document.getElementById('circle-overlap-percent');
        console.log('Circle overlap percentage:', overlapPercentInput ? overlapPercentInput.value : 'not found');
        
        // 5. Map order (for combined views)
        const mapOrderInputs = document.querySelectorAll('input[name="map-order"]');
        let selectedMapOrder = '';
        mapOrderInputs.forEach(input => {
            if (input.checked) {
                selectedMapOrder = input.value;
            }
        });
        console.log('Map order:', selectedMapOrder || 'not found');
        
        // 6. Border width
        const borderWidthInput = document.getElementById('border-width');
        console.log('Border width:', borderWidthInput ? borderWidthInput.value : 'not found');
        
        // 7. Circle elements in the DOM
        const circles = document.querySelectorAll('.star-map-circle, .street-map-circle');
        console.log('Circle elements found:', circles.length);
        circles.forEach((circle, index) => {
            console.log(`Circle ${index + 1}:`);
            console.log('- className:', circle.className);
            console.log('- offsetWidth:', circle.offsetWidth);
            console.log('- offsetHeight:', circle.offsetHeight);
            console.log('- style.width:', circle.style.width);
            console.log('- style.height:', circle.style.height);
            console.log('- style.borderRadius:', circle.style.borderRadius);
            console.log('- getBoundingClientRect():', JSON.stringify(circle.getBoundingClientRect()));
        });
        
        // 8. Check if PerfectCircleCalculator is available
        if (window.PerfectCircleCalculator) {
            console.log('PerfectCircleCalculator is available');
            
            // Test the calculator with current canvas dimensions
            if (canvas) {
                const radiusPercent = radiusPercentInput ? parseInt(radiusPercentInput.value) : 60;
                const circle = window.PerfectCircleCalculator.calculatePerfectCircle(
                    canvas.width, 
                    canvas.height, 
                    radiusPercent
                );
                console.log('PerfectCircleCalculator result:', circle);
                
                // Calculate aspect ratio
                const aspectRatio = canvas.width / canvas.height;
                console.log('Canvas aspect ratio:', aspectRatio);
                
                // Calculate what a perfect circle should look like
                const perfectDiameter = Math.min(canvas.width, canvas.height);
                console.log('Perfect circle diameter should be:', perfectDiameter);
                console.log('Perfect circle radius should be:', perfectDiameter / 2);
            }
        } else {
            console.log('PerfectCircleCalculator is NOT available!');
        }
        
        // 9. Check if CanvasDrawingUtils is available
        if (window.CanvasDrawingUtils) {
            console.log('CanvasDrawingUtils is available');
        } else {
            console.log('CanvasDrawingUtils is NOT available!');
        }
        
        // 10. Check for any SVG circles
        const svgCircles = document.querySelectorAll('svg circle');
        console.log('SVG circles found:', svgCircles.length);
        svgCircles.forEach((circle, index) => {
            console.log(`SVG Circle ${index + 1}:`);
            console.log('- r:', circle.getAttribute('r'));
            console.log('- cx:', circle.getAttribute('cx'));
            console.log('- cy:', circle.getAttribute('cy'));
        });
        
        console.log('=== END OF CIRCLE DEBUG ===');
    }
    
    // Function to add debug buttons to the page
    function addDebugButtons() {
        const debugContainer = document.createElement('div');
        debugContainer.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 10px;
            border-radius: 5px;
            color: white;
            font-family: monospace;
        `;
        
        const debugTitle = document.createElement('div');
        debugTitle.textContent = 'Circle Debug';
        debugTitle.style.cssText = `
            font-weight: bold;
            margin-bottom: 5px;
            text-align: center;
        `;
        debugContainer.appendChild(debugTitle);
        
        const logButton = document.createElement('button');
        logButton.textContent = 'Log Circle Variables';
        logButton.style.cssText = `
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            margin: 2px;
            cursor: pointer;
            border-radius: 3px;
        `;
        logButton.onclick = logCircleVariables;
        debugContainer.appendChild(logButton);
        
        const forceCircleButton = document.createElement('button');
        forceCircleButton.textContent = 'Force Perfect Circles';
        forceCircleButton.style.cssText = `
            background-color: #2196F3;
            color: white;
            border: none;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            margin: 2px;
            cursor: pointer;
            border-radius: 3px;
        `;
        forceCircleButton.onclick = function() {
            const circles = document.querySelectorAll('.star-map-circle, .street-map-circle');
            circles.forEach(circle => {
                // Get the smaller dimension to ensure a perfect circle
                const size = Math.min(circle.offsetWidth, circle.offsetHeight);
                
                // Force the circle to be perfectly round
                circle.style.width = size + 'px';
                circle.style.height = size + 'px';
                circle.style.borderRadius = '50%';
                
                // Add a border to make the circle more visible
                circle.style.border = '2px solid gold';
                
                console.log('Forced circle to be round:', circle.className || circle.id, 'size:', size);
            });
        };
        debugContainer.appendChild(forceCircleButton);
        
        document.body.appendChild(debugContainer);
        console.log('Debug buttons added to the page');
    }
    
    // Add the debug buttons when the page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addDebugButtons);
    } else {
        addDebugButtons();
    }
    
    // Also log variables when the script loads
    setTimeout(logCircleVariables, 1000);
    
    console.log('Circle Debug Script: Initialized');
})();
