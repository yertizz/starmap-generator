/* START OF CODE - Cline - 2025-06-03 20:48 File: js/circle-overlap-fix.js */

/**
 * SIMPLIFIED Circle Overlap Fix - Works with CSS styling
 * Only sets the default value to 5% without interfering with CSS layout
 */

(function() {
    console.log('Circle Overlap Fix - CSS Compatible Version');
    
    // Simple one-time fix on page load
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            // Find the Circle Overlap slider
            const overlapSlider = document.getElementById('circle-overlap-percent');
            const overlapValue = document.getElementById('overlap-value');
            
            if (overlapSlider && overlapValue) {
                // ONLY set the value - DO NOT modify styling
                overlapSlider.value = '5';
                overlapValue.textContent = '5%';
                
                // Update the combinedViewSettings object
                if (window.combinedViewSettings) {
                    window.combinedViewSettings.overlapPercent = 5;
                }
                
                console.log('Circle overlap value set to 5% (CSS handles styling)');
            }
        }, 100);
    });
    
})();

/* END OF CODE - Cline - 2025-06-03 20:48 File: js/circle-overlap-fix.js */
