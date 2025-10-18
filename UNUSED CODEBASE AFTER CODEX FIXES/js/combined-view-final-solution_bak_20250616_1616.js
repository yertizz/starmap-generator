/* START OF CODE - Cline - 2025-06-16 16:09 File: js/combined-view-final-solution.js */

/**
 * CSS-BASED SOLUTION: Combined View Options Styling
 * This script injects CSS rules to fix the exact spacing and alignment issues
 * NO DOM manipulation - pure CSS targeting
 */

(function() {
    'use strict';
    
    console.log('Combined View Final Solution - Loading (CSS-BASED Version)');
    
    // Create and inject CSS styles
    function injectCSS() {
        // Remove any existing style element from this script
        const existingStyle = document.getElementById('combined-view-css-fix');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Create new style element
        const style = document.createElement('style');
        style.id = 'combined-view-css-fix';
        style.textContent = `
            /* Combined View Options Container - Minimal Padding */
            div[style*="background-color: #f8f9fa"] {
                padding: 5px 15px !important;
            }
            
            /* Combined View Options Title - Minimal Margin */
            div[style*="background-color: #f8f9fa"] div[style*="font-weight: bold"] {
                margin: 0 0 5px 0 !important;
                padding: 0 !important;
            }
            
            /* Circle Overlap Row - No Bottom Margin */
            div[style*="background-color: #f8f9fa"] div[style*="display: flex"][style*="margin-bottom"] {
                margin-bottom: 0 !important;
                padding: 0 !important;
            }
            
            /* Map Order Row - Minimal Top Margin */
            div[style*="background-color: #f8f9fa"] div[style*="flex-wrap: wrap"] {
                margin: 5px 0 0 0 !important;
                padding: 0 !important;
                flex-wrap: nowrap !important;
                gap: 10px !important;
            }
            
            /* Radio Button Labels - Tight Spacing */
            div[style*="background-color: #f8f9fa"] label:has(input[type="radio"]) {
                margin: 0 5px !important;
                padding: 0 !important;
                display: inline-flex !important;
                align-items: center !important;
            }
            
            /* Note Text - Minimal Margin */
            div[style*="background-color: #f8f9fa"] div[style*="font-size: 11px"] {
                margin: 5px 0 0 0 !important;
                padding: 0 !important;
            }
            
            /* Circle Overlap Slider Default Value */
            #circle-overlap-percent {
                /* Will be set via JavaScript */
            }
        `;
        
        // Inject into head
        document.head.appendChild(style);
        console.log('CSS styles injected for Combined View Options');
        
        // Set slider value
        const slider = document.getElementById('circle-overlap-percent');
        const valueDisplay = document.getElementById('overlap-value');
        
        if (slider && valueDisplay) {
            slider.value = '5';
            valueDisplay.textContent = '5%';
            console.log('Set Circle Overlap to 5%');
        }
        
        // Update combinedViewSettings if it exists
        if (window.combinedViewSettings) {
            window.combinedViewSettings.overlapPercent = 5;
        }
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectCSS);
    } else {
        injectCSS();
    }
    
    console.log('Combined View CSS-based solution loaded');
    
})();

/* END OF CODE - Cline - 2025-06-16 16:09 File: js/combined-view-final-solution.js */
