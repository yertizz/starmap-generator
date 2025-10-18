/* START OF CODE - Cline - 2025-06-16 16:22 File: js/combined-view-final-solution.js */

/**
 * DIAGNOSTIC CSS SOLUTION: Combined View Options Styling
 * This version will test CSS selectors and provide detailed feedback
 */

(function() {
    'use strict';
    
    console.log('Combined View Final Solution - Loading (DIAGNOSTIC Version)');
    
    // Create and inject CSS styles
    function injectCSS() {
        // Remove any existing style element from this script
        const existingStyle = document.getElementById('combined-view-css-fix');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Test if elements exist with our selectors
        console.log('=== DIAGNOSTIC: Testing CSS Selectors ===');
        
        const container = document.querySelector('div[style*="background-color: rgb(248, 249, 250)"][style*="padding: 10px"]');
        console.log('Container found:', !!container, container);
        
        const title = document.querySelector('div[style*="background-color: rgb(248, 249, 250)"] div[style*="margin-bottom: 15px"][style*="font-weight: bold"]');
        console.log('Title found:', !!title, title);
        
        const circleRow = document.querySelector('div[style*="background-color: rgb(248, 249, 250)"] div[style*="margin-bottom: 10px"][style*="display: flex"]');
        console.log('Circle row found:', !!circleRow, circleRow);
        
        const lineBreak = document.querySelector('div[style*="background-color: rgb(248, 249, 250)"] div[style*="height: 20px"][style*="margin: 10px 0"]');
        console.log('Line break found:', !!lineBreak, lineBreak);
        
        const mapOrder = document.querySelector('div[style*="background-color: rgb(248, 249, 250)"] div[style*="margin-top: 20px"][style*="padding-top: 10px"]');
        console.log('Map order found:', !!mapOrder, mapOrder);
        
        // Try broader selectors
        console.log('=== DIAGNOSTIC: Testing Broader Selectors ===');
        
        const allDivs = document.querySelectorAll('div[style*="background-color: rgb(248, 249, 250)"] div');
        console.log('All divs in container:', allDivs.length);
        allDivs.forEach((div, index) => {
            console.log(`Div ${index}:`, div.getAttribute('style'), div.textContent?.substring(0, 50));
        });
        
        // Create new style element with more aggressive selectors
        const style = document.createElement('style');
        style.id = 'combined-view-css-fix';
        style.textContent = `
            /* TEST: Make everything red to see if CSS is working */
            div[style*="background-color: rgb(248, 249, 250)"] {
                border: 3px solid red !important;
                background-color: yellow !important;
            }
            
            /* AGGRESSIVE: Target all divs in the container */
            div[style*="background-color: rgb(248, 249, 250)"] div {
                margin: 2px !important;
                padding: 2px !important;
                border: 1px solid blue !important;
            }
            
            /* SPECIFIC: Target by ID */
            #circle-overlap-percent {
                border: 3px solid green !important;
            }
        `;
        
        // Inject into head
        document.head.appendChild(style);
        console.log('DIAGNOSTIC CSS styles injected - should see red/yellow/blue borders');
        
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
    
    console.log('Combined View DIAGNOSTIC solution loaded');
    
})();

/* END OF CODE - Cline - 2025-06-16 16:22 File: js/combined-view-final-solution.js */
