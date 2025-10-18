/* START OF CODE - Cline - 2025-06-03 21:04 File: js/combined-view-final-solution.js */

/**
 * FINAL SOLUTION: Combined View Options Styling
 * This script directly targets and styles the Combined View Options section
 * to match the exact mockup provided by the user.
 * 
 * CRITICAL: This runs ONCE after page load to avoid conflicts and flickering
 */

(function() {
    'use strict';
    
    console.log('Combined View Final Solution - DISABLED TO PREVENT INTERFERENCE');
    return; // EXIT IMMEDIATELY - DO NOT RUN ANY CODE
    
    console.log('Combined View Final Solution - Loading');
    
    // Wait for page to be fully loaded
    function waitForElements() {
        // Look for the Combined View Options container
        const combinedViewContainer = document.querySelector('div[style*="background-color: #f8f9fa"]');
        const circleOverlapSlider = document.getElementById('circle-overlap-percent');
        const overlapValue = document.getElementById('overlap-value');
        
        if (combinedViewContainer && circleOverlapSlider && overlapValue) {
            applyStyling();
        } else {
            // Try again in 100ms if elements not found
            setTimeout(waitForElements, 100);
        }
    }
    
    function applyStyling() {
        console.log('Applying Combined View Options styling...');
        
        // Find the main container
        const container = document.querySelector('div[style*="background-color: #f8f9fa"]');
        if (!container) return;
        
        // Style the container
        container.style.cssText = `
            width: 100% !important;
            padding: 15px !important;
            background-color: #f8f9fa !important;
            border-radius: 5px !important;
            text-align: center !important;
        `;
        
        // Find and style the title
        const title = container.querySelector('div[style*="font-weight: bold"]');
        if (title) {
            title.style.cssText = `
                font-weight: bold !important;
                color: #007bff !important;
                text-align: center !important;
                margin-bottom: 15px !important;
                font-size: 16px !important;
            `;
        }
        
        // Find Circle Overlap row
        const circleRow = container.querySelector('div[style*="display: flex"][style*="margin-bottom: 10px"]');
        if (circleRow) {
            circleRow.style.cssText = `
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                margin-bottom: 15px !important;
                gap: 10px !important;
            `;
            
            // Style the Circle Overlap label
            const circleLabel = circleRow.querySelector('label');
            if (circleLabel) {
                circleLabel.style.cssText = `
                    min-width: 120px !important;
                    text-align: right !important;
                    color: #666 !important;
                    font-weight: normal !important;
                `;
            }
            
            // Style the slider
            const slider = circleRow.querySelector('#circle-overlap-percent');
            if (slider) {
                slider.style.cssText = `
                    flex: 1 !important;
                    max-width: 300px !important;
                    margin: 0 10px !important;
                `;
                // Set default value to 5%
                slider.value = '5';
            }
            
            // Style the value display
            const valueDisplay = circleRow.querySelector('#overlap-value');
            if (valueDisplay) {
                valueDisplay.style.cssText = `
                    min-width: 40px !important;
                    font-weight: bold !important;
                    color: #333 !important;
                    text-align: center !important;
                `;
                valueDisplay.textContent = '5%';
            }
        }
        
        // Find Map Order row
        const mapOrderRow = container.querySelector('div[style*="flex-wrap: wrap"]');
        if (mapOrderRow) {
            mapOrderRow.style.cssText = `
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                margin: 15px 0 !important;
                gap: 10px !important;
            `;
            
            // Style the Map Order label
            const mapLabel = mapOrderRow.querySelector('label');
            if (mapLabel && mapLabel.textContent.includes('Map Order')) {
                mapLabel.style.cssText = `
                    min-width: 120px !important;
                    text-align: right !important;
                    color: #666 !important;
                    font-weight: normal !important;
                `;
            }
            
            // Style radio button container
            const radioContainer = mapOrderRow.querySelector('div[style*="gap: 20px"]');
            if (radioContainer) {
                radioContainer.style.cssText = `
                    display: flex !important;
                    gap: 20px !important;
                    justify-content: center !important;
                `;
                
                // Style radio button labels
                const radioLabels = radioContainer.querySelectorAll('label');
                radioLabels.forEach(label => {
                    label.style.cssText = `
                        display: flex !important;
                        align-items: center !important;
                        color: #333 !important;
                        font-weight: normal !important;
                        cursor: pointer !important;
                    `;
                });
            }
        }
        
        // Find and style the note text
        const noteText = container.querySelector('div[style*="font-size: 11px"]');
        if (noteText) {
            noteText.style.cssText = `
                margin-top: 15px !important;
                font-size: 11px !important;
                color: #666 !important;
                font-style: italic !important;
                text-align: center !important;
            `;
        }
        
        // Update combinedViewSettings if it exists
        if (window.combinedViewSettings) {
            window.combinedViewSettings.overlapPercent = 5;
        }
        
        console.log('Combined View Options styling applied successfully');
    }
    
    // Start the process when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForElements);
    } else {
        waitForElements();
    }
    
})();

/* END OF CODE - Cline - 2025-06-03 21:04 File: js/combined-view-final-solution.js */
