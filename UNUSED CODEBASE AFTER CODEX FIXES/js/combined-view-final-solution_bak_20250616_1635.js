/* START OF CODE - Cline - 2025-06-16 16:31 File: js/combined-view-final-solution.js */

/**
 * DIRECT DOM MANIPULATION: Combined View Options Styling
 * CSS approach failed - using direct DOM manipulation to force changes
 */

(function() {
    'use strict';
    
    console.log('Combined View Final Solution - Loading (DOM MANIPULATION Version)');
    
    let attemptCount = 0;
    const maxAttempts = 50;
    
    function fixSpacing() {
        attemptCount++;
        console.log(`DOM Fix Attempt ${attemptCount}: Looking for elements...`);
        
        // Find the main container
        const container = document.querySelector('div[style*="background-color: rgb(248, 249, 250)"]');
        
        if (!container) {
            if (attemptCount < maxAttempts) {
                setTimeout(fixSpacing, 100);
                return;
            } else {
                console.log('Container not found after max attempts');
                return;
            }
        }
        
        console.log('Container found! Applying direct DOM changes...');
        
        // FORCE container padding change
        container.style.setProperty('padding', '5px 15px', 'important');
        console.log('Container padding set to 5px 15px');
        
        // Find and fix all child divs
        const allDivs = container.querySelectorAll('div');
        console.log(`Found ${allDivs.length} divs in container`);
        
        allDivs.forEach((div, index) => {
            const style = div.getAttribute('style') || '';
            console.log(`Div ${index}: ${style.substring(0, 100)}...`);
            
            // Fix title
            if (style.includes('font-weight: bold') && style.includes('margin-bottom: 15px')) {
                div.style.setProperty('margin-bottom', '5px', 'important');
                div.style.setProperty('padding-bottom', '5px', 'important');
                console.log(`Fixed title div ${index}`);
            }
            
            // Fix circle overlap row
            if (style.includes('display: flex') && style.includes('margin-bottom: 10px')) {
                div.style.setProperty('margin-bottom', '0px', 'important');
                console.log(`Fixed circle overlap row div ${index}`);
            }
            
            // Fix line break div
            if (style.includes('height: 20px') && style.includes('margin: 10px 0')) {
                div.style.setProperty('display', 'none', 'important');
                console.log(`Hidden line break div ${index}`);
            }
            
            // Fix map order section
            if (style.includes('margin-top: 20px') && style.includes('padding-top: 10px')) {
                div.style.setProperty('margin-top', '5px', 'important');
                div.style.setProperty('padding-top', '0px', 'important');
                console.log(`Fixed map order section div ${index}`);
            }
            
            // Fix note text
            if (style.includes('margin-top: 15px') && style.includes('font-size: 11px')) {
                div.style.setProperty('margin-top', '5px', 'important');
                console.log(`Fixed note text div ${index}`);
            }
        });
        
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
        
        console.log('DOM manipulation complete!');
    }
    
    // Start immediately and also on DOM ready
    fixSpacing();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixSpacing);
    }
    
    // Also try after a delay in case elements are created later
    setTimeout(fixSpacing, 500);
    setTimeout(fixSpacing, 1000);
    setTimeout(fixSpacing, 2000);
    
    console.log('Combined View DOM manipulation solution loaded');
    
})();

/* END OF CODE - Cline - 2025-06-16 16:31 File: js/combined-view-final-solution.js */
