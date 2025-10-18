/* START OF CODE - Cline - 2025-06-16 16:28 File: js/combined-view-final-solution.js */

/**
 * WORKING SOLUTION: Combined View Options Styling
 * Since CSS injection works (red borders visible), using broader selectors to fix spacing
 */

(function() {
    'use strict';
    
    console.log('Combined View Final Solution - Loading (WORKING Version)');
    
    // Create and inject CSS styles
    function injectCSS() {
        // Remove any existing style element from this script
        const existingStyle = document.getElementById('combined-view-css-fix');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Create new style element with working CSS
        const style = document.createElement('style');
        style.id = 'combined-view-css-fix';
        style.textContent = `
            /* MAIN CONTAINER - Reduce padding and remove yellow background */
            div[style*="background-color: rgb(248, 249, 250)"] {
                padding: 5px 15px !important;
                background-color: rgb(248, 249, 250) !important;
            }
            
            /* ALL DIVS IN CONTAINER - Reduce margins and padding */
            div[style*="background-color: rgb(248, 249, 250)"] div {
                margin: 2px !important;
                padding: 2px !important;
            }
            
            /* TITLE - Specific targeting */
            div[style*="background-color: rgb(248, 249, 250)"] div[style*="font-weight: bold"][style*="color: rgb(0, 86, 179)"] {
                margin-bottom: 5px !important;
                padding-bottom: 5px !important;
            }
            
            /* CIRCLE OVERLAP ROW - Target flex container */
            div[style*="background-color: rgb(248, 249, 250)"] div[style*="display: flex"][style*="justify-content: center"] {
                margin-bottom: 0px !important;
                margin-top: 0px !important;
            }
            
            /* MAP ORDER SECTION - Target block container */
            div[style*="background-color: rgb(248, 249, 250)"] div[style*="display: block"][style*="border-top: 1px solid"] {
                margin-top: 5px !important;
                padding-top: 0px !important;
            }
            
            /* NOTE TEXT - Target italic text */
            div[style*="background-color: rgb(248, 249, 250)"] div[style*="font-style: italic"] {
                margin-top: 5px !important;
            }
            
            /* FORCED LINE BREAK - Hide completely */
            div[style*="background-color: rgb(248, 249, 250)"] div[style*="height: 20px"] {
                display: none !important;
            }
        `;
        
        // Inject into head
        document.head.appendChild(style);
        console.log('WORKING CSS styles injected for Combined View Options');
        
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
    
    console.log('Combined View WORKING solution loaded');
    
})();

/* END OF CODE - Cline - 2025-06-16 16:28 File: js/combined-view-final-solution.js */
