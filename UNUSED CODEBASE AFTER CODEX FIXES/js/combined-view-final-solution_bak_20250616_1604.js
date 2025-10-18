/* START OF CODE - Cline - 2025-06-16 16:00 File: js/combined-view-final-solution.js */

/**
 * PRECISE SOLUTION: Combined View Options Styling
 * This script fixes the exact spacing and alignment issues identified in the mockup comparison
 * 
 * PRECISE FIXES:
 * A. MINIMAL padding above "Combined View Options:" title
 * B. NO excessive line spacing below Circle Overlap slider
 * C. Map Order label IMMEDIATELY LEFT of "Street Map First" radio button
 */

(function() {
    'use strict';
    
    console.log('Combined View Final Solution - Loading (PRECISE Version)');
    
    let attemptCount = 0;
    const maxAttempts = 50; // Try for 5 seconds
    
    // Wait for page to be fully loaded and elements to exist
    function waitForElements() {
        attemptCount++;
        console.log(`Attempt ${attemptCount}: Looking for Combined View elements...`);
        
        // Look for multiple possible selectors
        const combinedViewContainer = document.querySelector('div[style*="background-color: #f8f9fa"]') ||
                                    document.querySelector('.combined-view-container') ||
                                    document.querySelector('[id*="combined"]') ||
                                    document.querySelector('[class*="combined"]');
        
        const circleOverlapSlider = document.getElementById('circle-overlap-percent');
        const overlapValue = document.getElementById('overlap-value');
        
        // Also look for text content
        const combinedViewText = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent && el.textContent.includes('Combined View Options')
        );
        
        console.log('Found elements:', {
            container: !!combinedViewContainer,
            slider: !!circleOverlapSlider,
            value: !!overlapValue,
            textElement: !!combinedViewText
        });
        
        if ((combinedViewContainer || combinedViewText) && circleOverlapSlider && overlapValue) {
            console.log('All elements found! Applying styling...');
            applyStyling();
            return;
        }
        
        if (attemptCount < maxAttempts) {
            setTimeout(waitForElements, 100);
        } else {
            console.log('Max attempts reached. Elements not found:', {
                container: !!combinedViewContainer,
                slider: !!circleOverlapSlider,
                value: !!overlapValue,
                textElement: !!combinedViewText
            });
            
            // Try to apply styling anyway if we found some elements
            if (circleOverlapSlider || combinedViewText) {
                console.log('Attempting partial styling...');
                applyStyling();
            }
        }
    }
    
    function applyStyling() {
        console.log('Applying Combined View Options styling (PRECISE VERSION)...');
        
        // Find the main container using multiple methods
        let container = document.querySelector('div[style*="background-color: #f8f9fa"]');
        
        if (!container) {
            // Look for container by finding the "Combined View Options" text
            const textElement = Array.from(document.querySelectorAll('*')).find(el => 
                el.textContent && el.textContent.includes('Combined View Options')
            );
            if (textElement) {
                container = textElement.closest('div') || textElement.parentElement;
                console.log('Found container via text search');
            }
        }
        
        if (!container) {
            // Look for container by finding the slider and going up
            const slider = document.getElementById('circle-overlap-percent');
            if (slider) {
                container = slider.closest('div[style*="background"]') || 
                           slider.closest('.settings-row') ||
                           slider.parentElement.parentElement;
                console.log('Found container via slider search');
            }
        }
        
        if (container) {
            console.log('Styling container...');
            // Style the container - MINIMAL PADDING
            container.style.cssText = `
                width: 100% !important;
                padding: 5px 15px !important;
                background-color: #f8f9fa !important;
                border-radius: 5px !important;
                text-align: center !important;
            `;
            
            // Find and style the title - MINIMAL MARGIN
            const title = container.querySelector('div[style*="font-weight: bold"]') ||
                         container.querySelector('*[style*="font-weight: bold"]') ||
                         Array.from(container.querySelectorAll('*')).find(el => 
                             el.textContent && el.textContent.includes('Combined View Options')
                         );
            
            if (title) {
                console.log('Styling title...');
                title.style.cssText = `
                    font-weight: bold !important;
                    color: #007bff !important;
                    text-align: center !important;
                    margin: 0 0 5px 0 !important;
                    padding: 0 !important;
                    font-size: 16px !important;
                `;
            }
            
            // Find Circle Overlap row - NO MARGIN BOTTOM
            const circleRow = container.querySelector('div[style*="display: flex"][style*="margin-bottom: 10px"]') ||
                             container.querySelector('*').closest('div');
            
            if (circleRow) {
                console.log('Styling circle row...');
                circleRow.style.cssText = `
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    margin: 0 !important;
                    padding: 0 !important;
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
                        margin: 0 !important;
                        padding: 0 !important;
                    `;
                }
                
                // Style the slider
                const slider = circleRow.querySelector('#circle-overlap-percent') || 
                              document.getElementById('circle-overlap-percent');
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
                const valueDisplay = circleRow.querySelector('#overlap-value') ||
                                   document.getElementById('overlap-value');
                if (valueDisplay) {
                    valueDisplay.style.cssText = `
                        min-width: 40px !important;
                        font-weight: bold !important;
                        color: #333 !important;
                        text-align: center !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    `;
                    valueDisplay.textContent = '5%';
                }
            }
            
            // Find Map Order row - PRECISE ALIGNMENT
            const mapOrderRows = container.querySelectorAll('div, *');
            let mapOrderRow = null;
            
            // Find the row that contains "Map Order" text
            for (let row of mapOrderRows) {
                if (row.textContent && row.textContent.includes('Map Order:')) {
                    mapOrderRow = row;
                    break;
                }
            }
            
            if (mapOrderRow) {
                console.log('Styling map order row...');
                mapOrderRow.style.cssText = `
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    margin: 5px 0 0 0 !important;
                    padding: 0 !important;
                    gap: 10px !important;
                    flex-wrap: nowrap !important;
                `;
                
                // Style the Map Order label - IMMEDIATELY LEFT OF RADIO BUTTONS
                const mapLabel = mapOrderRow.querySelector('label');
                if (mapLabel && mapLabel.textContent.includes('Map Order')) {
                    mapLabel.style.cssText = `
                        min-width: 120px !important;
                        text-align: right !important;
                        color: #666 !important;
                        font-weight: normal !important;
                        flex-shrink: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    `;
                }
                
                // Find and style all radio button containers - TIGHT SPACING
                const radioInputs = mapOrderRow.querySelectorAll('input[type="radio"]');
                console.log(`Found ${radioInputs.length} radio buttons`);
                
                radioInputs.forEach((radio, index) => {
                    const radioLabel = radio.closest('label') || radio.nextElementSibling;
                    if (radioLabel && radioLabel.tagName === 'LABEL') {
                        console.log(`Styling radio label ${index + 1}`);
                        radioLabel.style.cssText = `
                            display: inline-flex !important;
                            align-items: center !important;
                            color: #333 !important;
                            font-weight: normal !important;
                            cursor: pointer !important;
                            margin: 0 5px !important;
                            padding: 0 !important;
                            white-space: nowrap !important;
                        `;
                    }
                });
                
                // Also handle labels that contain radio buttons - TIGHT SPACING
                const radioLabels = mapOrderRow.querySelectorAll('label');
                radioLabels.forEach((label, index) => {
                    if (label.querySelector('input[type="radio"]') && !label.textContent.includes('Map Order')) {
                        console.log(`Styling radio container label ${index + 1}`);
                        label.style.cssText = `
                            display: inline-flex !important;
                            align-items: center !important;
                            color: #333 !important;
                            font-weight: normal !important;
                            cursor: pointer !important;
                            margin: 0 5px !important;
                            padding: 0 !important;
                            white-space: nowrap !important;
                        `;
                    }
                });
            }
            
            // Find and style the note text - MINIMAL MARGIN
            const noteText = container.querySelector('div[style*="font-size: 11px"]') ||
                            Array.from(container.querySelectorAll('*')).find(el => 
                                el.textContent && el.textContent.includes('These settings apply')
                            );
            
            if (noteText) {
                console.log('Styling note text...');
                noteText.style.cssText = `
                    margin: 5px 0 0 0 !important;
                    padding: 0 !important;
                    font-size: 11px !important;
                    color: #666 !important;
                    font-style: italic !important;
                    text-align: center !important;
                `;
            }
        }
        
        // Update combinedViewSettings if it exists
        if (window.combinedViewSettings) {
            window.combinedViewSettings.overlapPercent = 5;
        }
        
        console.log('Combined View Options styling applied successfully (PRECISE VERSION)');
    }
    
    // Start the process when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForElements);
    } else {
        waitForElements();
    }
    
})();

/* END OF CODE - Cline - 2025-06-16 16:00 File: js/combined-view-final-solution.js */
