/* Combined View Classes - 2025-06-01 9:15 PM */

/**
 * This script adds the necessary classes to the body element
 * when combined views are activated. It works with combined-view-positioning.css
 * to fix the positioning issues in combined views.
 */

(function() {
    console.log('Combined View Classes - Initializing');
    
    // Hook into combined view functions
    function hookIntoCombinedViewFunctions() {
        // Star Map view
        const originalViewStarMap = window.viewStarMap;
        if (originalViewStarMap) {
            window.viewStarMap = function() {
                console.log('Star Map view called - removing view classes');
                
                // Remove view-specific classes
                document.body.classList.remove('landscape-view', 'portrait-view');
                
                // Call original function
                originalViewStarMap.apply(this, arguments);
            };
        }
        
        // Street Map view
        const originalViewStreetMap = window.viewStreetMap;
        if (originalViewStreetMap) {
            window.viewStreetMap = function() {
                console.log('Street Map view called - removing view classes');
                
                // Remove view-specific classes
                document.body.classList.remove('landscape-view', 'portrait-view');
                
                // Call original function
                originalViewStreetMap.apply(this, arguments);
            };
        }
        
        // Canvas Layout view
        const originalViewCanvasLayout = window.viewCanvasLayout;
        if (originalViewCanvasLayout) {
            window.viewCanvasLayout = function() {
                console.log('Canvas Layout view called - removing view classes');
                
                // Remove view-specific classes
                document.body.classList.remove('landscape-view', 'portrait-view');
                
                // Call original function
                originalViewCanvasLayout.apply(this, arguments);
            };
        }
        
        // Combined Landscape view
        const originalViewStarStreetLandscape = window.viewStarStreetLandscape;
        if (originalViewStarStreetLandscape) {
            window.viewStarStreetLandscape = function() {
                console.log('Combined Landscape view called - adding landscape class');
                
                // Add landscape class to body
                document.body.classList.remove('portrait-view');
                document.body.classList.add('landscape-view');
                
                // Call original function
                originalViewStarStreetLandscape.apply(this, arguments);
            };
        }
        
        // Combined Portrait view
        const originalViewStarStreetPortrait = window.viewStarStreetPortrait;
        if (originalViewStarStreetPortrait) {
            window.viewStarStreetPortrait = function() {
                console.log('Combined Portrait view called - adding portrait class');
                
                // Add portrait class to body
                document.body.classList.remove('landscape-view');
                document.body.classList.add('portrait-view');
                
                // Call original function
                originalViewStarStreetPortrait.apply(this, arguments);
            };
        }
    }
    
    // Initialize
    function initialize() {
        console.log('Initializing Combined View Classes');
        
        // Hook into combined view functions
        hookIntoCombinedViewFunctions();
        
        console.log('Combined View Classes - Initialized');
    }
    
    // Initialize when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
