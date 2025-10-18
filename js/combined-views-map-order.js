/**
 * Combined Views Map Order Enhancement
 * Adds functionality to swap map positions based on user preference
 */

(function() {
    'use strict';
    
    console.log('Combined Views Map Order: Initializing...');
    
    // Wait for combined-views-fix.js to be loaded
    function waitForCombinedViewsFix() {
        if (!window.viewStarStreetLandscape || !window.viewStarStreetPortrait) {
            setTimeout(waitForCombinedViewsFix, 100);
            return;
        }
        enhanceWithMapOrder();
    }
    
    /**
     * Enhance the combined views with map order functionality
     */
    function enhanceWithMapOrder() {
        // Store the current implementations
        const currentLandscape = window.viewStarStreetLandscape;
        const currentPortrait = window.viewStarStreetPortrait;
        
        // Override landscape view to respect map order
        window.viewStarStreetLandscape = function() {
            // Check if we need to swap the order
            const streetMapFirst = window.combinedViewSettings?.streetMapFirst !== false;
            
            if (!streetMapFirst) {
                // Temporarily swap the circle positions in the calculator
                const calc = window.PerfectCircleCalculator;
                const originalCalc = calc.calculateLandscapeCircles;
                
                calc.calculateLandscapeCircles = function(...args) {
                    const result = originalCalc.apply(this, args);
                    // Swap left and right
                    return {
                        left: result.right,
                        right: result.left
                    };
                };
                
                // Call the function
                currentLandscape.call(this);
                
                // Restore original calculator
                calc.calculateLandscapeCircles = originalCalc;
            } else {
                // Normal order
                currentLandscape.call(this);
            }
        };
        
        // Override portrait view to respect map order
        window.viewStarStreetPortrait = function() {
            // Check if we need to swap the order
            const streetMapFirst = window.combinedViewSettings?.streetMapFirst !== false;
            
            if (!streetMapFirst) {
                // Temporarily swap the circle positions in the calculator
                const calc = window.PerfectCircleCalculator;
                const originalCalc = calc.calculatePortraitCircles;
                
                calc.calculatePortraitCircles = function(...args) {
                    const result = originalCalc.apply(this, args);
                    // Swap top and bottom
                    return {
                        top: result.bottom,
                        bottom: result.top
                    };
                };
                
                // Call the function
                currentPortrait.call(this);
                
                // Restore original calculator
                calc.calculatePortraitCircles = originalCalc;
            } else {
                // Normal order
                currentPortrait.call(this);
            }
        };
        
        console.log('Combined Views Map Order: Enhancement applied');
    }
    
    // Start waiting
    waitForCombinedViewsFix();
    
})();
