/* START OF CODE - Cline - 2025-06-03 19:48 File: js/combined-view-exact-match.js */

/**
 * FINAL SOLUTION: Combined View Options Styling
 * This script applies exact styling to match the mockup without page flickering
 * Uses direct element targeting instead of problematic CSS selectors
 */

(function() {
    'use strict';
    
    // Prevent multiple executions
    if (window.combinedViewStylingApplied) {
        return;
    }
    window.combinedViewStylingApplied = true;
    
    console.log('Combined View Exact Match - Starting clean approach');
    
    function applyCombinedViewStyling() {
        // Find the Combined View Options container
        const combinedViewContainer = document.querySelector('.settings-row[style*="margin-top: 15px"] div[style*="background-color: #f8f9fa"]');
        
        if (!combinedViewContainer) {
            console.log('Combined View container not found, retrying...');
            setTimeout(applyCombinedViewStyling, 100);
            return;
        }
        
        console.log('Found Combined View container, applying styles...');
        
        // Style the main container
        combinedViewContainer.style.cssText = `
            width: 100% !important;
            padding: 20px !important;
            background-color: #f8f9fa !important;
            border-radius: 5px !important;
            border-top: 1px solid #ddd !important;
            border-bottom: 1px solid #ddd !important;
            margin: 15px 0 !important;
        `;
        
        // Style the title "Combined View Options:"
        const title = combinedViewContainer.querySelector('div[style*="text-align: center"]');
        if (title) {
            title.style.cssText = `
                text-align: center !important;
                font-weight: bold !important;
                color: #0056b3 !important;
                margin-bottom: 20px !important;
                font-size: 1.15em !important;
                width: 100% !important;
            `;
            console.log('Title styled');
        }
        
        // Style the Circle Overlap row
        const overlapRow = combinedViewContainer.querySelector('div[style*="display: flex"][style*="margin-bottom: 10px"]');
        if (overlapRow) {
            overlapRow.style.cssText = `
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 100% !important;
                margin-bottom: 20px !important;
                gap: 10px !important;
            `;
            
            // Style the label
            const overlapLabel = overlapRow.querySelector('label');
            if (overlapLabel) {
                overlapLabel.style.cssText = `
                    color: #666 !important;
                    text-align: right !important;
                    min-width: 120px !important;
                    font-weight: normal !important;
                `;
            }
            
            // Style the slider
            const overlapSlider = overlapRow.querySelector('#circle-overlap-percent');
            if (overlapSlider) {
                overlapSlider.style.cssText = `
                    width: 300px !important;
                    flex: none !important;
                `;
            }
            
            // Style the value display
            const overlapValue = overlapRow.querySelector('#overlap-value');
            if (overlapValue) {
                overlapValue.style.cssText = `
                    min-width: 40px !important;
                    text-align: right !important;
                    font-weight: bold !important;
                    color: #333 !important;
                `;
            }
            
            console.log('Circle Overlap row styled');
        }
        
        // Find and style the line break div
        const lineBreak = combinedViewContainer.querySelector('div[style*="border-top: 1px solid #eee"]');
        if (lineBreak) {
            lineBreak.style.cssText = `
                display: block !important;
                width: 100% !important;
                height: 20px !important;
                clear: both !important;
                margin: 15px 0 !important;
                border-top: 1px solid #ddd !important;
            `;
            console.log('Line break styled');
        }
        
        // Style the Map Order row
        const mapOrderRow = combinedViewContainer.querySelector('div[style*="display: flex"][style*="flex-wrap: wrap"]');
        if (mapOrderRow) {
            mapOrderRow.style.cssText = `
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 100% !important;
                margin: 20px 0 !important;
                gap: 10px !important;
                flex-wrap: nowrap !important;
            `;
            
            // Style the inner container
            const mapOrderInner = mapOrderRow.querySelector('div[style*="display: flex"]');
            if (mapOrderInner) {
                mapOrderInner.style.cssText = `
                    display: flex !important;
                    align-items: center !important;
                    gap: 10px !important;
                `;
                
                // Style the label
                const mapOrderLabel = mapOrderInner.querySelector('label');
                if (mapOrderLabel) {
                    mapOrderLabel.style.cssText = `
                        color: #666 !important;
                        text-align: right !important;
                        min-width: 120px !important;
                        font-weight: normal !important;
                    `;
                }
                
                // Style the radio buttons container
                const radioContainer = mapOrderInner.querySelector('div[style*="display: flex"][style*="gap: 20px"]');
                if (radioContainer) {
                    radioContainer.style.cssText = `
                        display: flex !important;
                        gap: 20px !important;
                        align-items: center !important;
                    `;
                    
                    // Style individual radio labels
                    const radioLabels = radioContainer.querySelectorAll('label');
                    radioLabels.forEach(label => {
                        label.style.cssText = `
                            display: flex !important;
                            align-items: center !important;
                            cursor: pointer !important;
                            font-weight: normal !important;
                            color: #333 !important;
                        `;
                        
                        const radio = label.querySelector('input[type="radio"]');
                        if (radio) {
                            radio.style.cssText = `
                                margin-right: 5px !important;
                            `;
                        }
                    });
                }
            }
            
            console.log('Map Order row styled');
        }
        
        // Style the note text
        const noteText = combinedViewContainer.querySelector('div[style*="margin-top: 15px"][style*="font-size: 11px"]');
        if (noteText) {
            noteText.style.cssText = `
                font-size: 11px !important;
                color: #666 !important;
                font-style: italic !important;
                text-align: center !important;
                width: 100% !important;
                margin-top: 15px !important;
            `;
            console.log('Note text styled');
        }
        
        // Set Circle Overlap slider to 5% (as requested)
        const circleOverlapSlider = document.getElementById('circle-overlap-percent');
        const overlapValue = document.getElementById('overlap-value');
        
        if (circleOverlapSlider && overlapValue) {
            circleOverlapSlider.value = '5';
            overlapValue.textContent = '5%';
            
            // Update combinedViewSettings if it exists
            if (window.combinedViewSettings) {
                window.combinedViewSettings.overlapPercent = 5;
            }
            
            console.log('Circle overlap slider set to 5%');
        }
        
        console.log('Combined View Options styling completed successfully');
    }
    
    // Apply styling when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyCombinedViewStyling);
    } else {
        applyCombinedViewStyling();
    }
    
})();

/* END OF CODE - Cline - 2025-06-03 19:48 File: js/combined-view-exact-match.js */
