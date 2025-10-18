/* START OF CODE - Cline - 2025-06-16 16:17 File: js/combined-view-final-solution.js */

/**
 * PRECISE CSS SOLUTION: Combined View Options Styling
 * Based on actual HTML structure provided by user
 * Targets exact elements with precise selectors
 */

(function() {
    'use strict';
    
    console.log('Combined View Final Solution - Loading (PRECISE HTML-BASED Version)');
    
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
            /* MAIN CONTAINER - Reduce padding from 10px to 5px */
            div[style*="background-color: rgb(248, 249, 250)"][style*="padding: 10px"] {
                padding: 5px 15px !important;
            }
            
            /* TITLE - Reduce margin-bottom from 15px to 5px */
            div[style*="background-color: rgb(248, 249, 250)"] div[style*="margin-bottom: 15px"][style*="font-weight: bold"] {
                margin-bottom: 5px !important;
                padding-bottom: 5px !important;
            }
            
            /* CIRCLE OVERLAP ROW - Reduce margin-bottom from 10px to 0px */
            div[style*="background-color: rgb(248, 249, 250)"] div[style*="margin-bottom: 10px"][style*="display: flex"] {
                margin-bottom: 0px !important;
            }
            
            /* FORCED LINE BREAK DIV - Remove height and margins */
            div[style*="background-color: rgb(248, 249, 250)"] div[style*="height: 20px"][style*="margin: 10px 0"] {
                height: 0px !important;
                margin: 0px !important;
                display: none !important;
            }
            
            /* MAP ORDER SECTION - Reduce margin-top from 20px to 5px and padding-top from 10px to 0px */
            div[style*="background-color: rgb(248, 249, 250)"] div[style*="margin-top: 20px"][style*="padding-top: 10px"] {
                margin-top: 5px !important;
                padding-top: 0px !important;
            }
            
            /* NOTE TEXT - Reduce margin-top from 15px to 5px */
            div[style*="background-color: rgb(248, 249, 250)"] div[style*="margin-top: 15px"][style*="font-size: 11px"] {
                margin-top: 5px !important;
            }
        `;
        
        // Inject into head
        document.head.appendChild(style);
        console.log('PRECISE CSS styles injected for Combined View Options');
        
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
    
    console.log('Combined View PRECISE HTML-based solution loaded');
    
})();

/* END OF CODE - Cline - 2025-06-16 16:17 File: js/combined-view-final-solution.js */
