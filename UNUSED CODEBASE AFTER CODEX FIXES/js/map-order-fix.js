/* START OF CODE - Cline - 2025-06-02 15:48 File: js/map-order-fix.js */

/**
 * This script directly targets the Map Order section in the Combined View Options
 * and forces it to appear on its own line below the Circle Overlap slider.
 * 
 * SIMPLIFIED VERSION - Focused on fixing the layout without causing conflicts.
 */

(function() {
    console.log('Map Order Fix - SIMPLIFIED VERSION - Initializing');
    
    // Function to fix the Map Order section
    function fixMapOrderSection() {
        console.log('SIMPLIFIED: Fixing Map Order section layout');
        
        // Check if we've already run this fix
        if (document.getElementById('map-order-fix-style')) {
            console.log('Map Order fix already applied');
            return;
        }
        
        // Create a style element to add our CSS
        const styleElement = document.createElement('style');
        styleElement.id = 'map-order-fix-style';
        
        // Add CSS to force Map Order to its own line - SIMPLIFIED
        styleElement.textContent = `
            /* Force Map Order to a new line - SIMPLIFIED APPROACH */
            div:has(input[name="map-order"]) {
                display: block !important;
                width: 100% !important;
                margin-top: 20px !important;
                padding-top: 10px !important;
                border-top: 1px solid #eee !important;
                clear: both !important;
                float: none !important;
                position: relative !important;
                overflow: visible !important;
            }
            
            /* Target by text content */
            div:has(*:contains("Map Order:")) {
                display: block !important;
                width: 100% !important;
                margin-top: 20px !important;
                padding-top: 10px !important;
                border-top: 1px solid #eee !important;
                clear: both !important;
                float: none !important;
                position: relative !important;
                overflow: visible !important;
            }
        `;
        
        // Add the style element to the head
        document.head.appendChild(styleElement);
        
        // NUCLEAR OPTION: Insert a forced line break element
        function insertForcedLineBreak() {
            console.log('NUCLEAR OPTION: Inserting forced line break element');
            
            // Find the Combined View Options section
            const combinedViewSections = document.querySelectorAll('.settings-row');
            let combinedViewSection = null;
            
            for (const section of combinedViewSections) {
                if (section.textContent.includes('Combined View Options:')) {
                    combinedViewSection = section;
                    break;
                }
            }
            
            if (!combinedViewSection) {
                console.log('Combined View Options section not found');
                return;
            }
            
            console.log('Found Combined View Options section');
            
            // Find the container with the background color
            const container = combinedViewSection.querySelector('div[style*="background-color"]');
            if (!container) {
                console.log('Container not found');
                return;
            }
            
            console.log('Found container');
            
            // Find the Circle Overlap slider
            const sliderDiv = Array.from(container.querySelectorAll('div')).find(div => 
                div.querySelector('#circle-overlap-percent')
            );
            
            // Find the Map Order section
            const mapOrderDiv = Array.from(container.querySelectorAll('div')).find(div => 
                div.querySelector('input[name="map-order"]') || 
                (div.textContent && div.textContent.includes('Map Order'))
            );
            
            if (!sliderDiv) {
                console.log('Slider div not found');
                return;
            }
            
            if (!mapOrderDiv) {
                console.log('Map Order div not found');
                return;
            }
            
            console.log('Found slider and Map Order divs');
            
            // Check if we already inserted a line break
            const existingLineBreak = document.getElementById('forced-line-break');
            if (existingLineBreak) {
                console.log('Line break already exists');
                return;
            }
            
            // Create a forced line break element
            const lineBreakDiv = document.createElement('div');
            lineBreakDiv.id = 'forced-line-break';
            lineBreakDiv.className = 'forced-line-break';
            lineBreakDiv.style.cssText = `
                display: block !important;
                width: 100% !important;
                height: 20px !important;
                margin: 20px 0 !important;
                padding: 0 !important;
                border-top: 2px solid #eee !important;
                clear: both !important;
                float: none !important;
                position: relative !important;
                overflow: visible !important;
            `;
            
            // Insert the line break before the Map Order div
            mapOrderDiv.parentNode.insertBefore(lineBreakDiv, mapOrderDiv);
            
            console.log('NUCLEAR OPTION: Inserted forced line break element');
            
            // Also apply styling to the Map Order div
            mapOrderDiv.id = 'map-order-section';
            mapOrderDiv.className = 'map-order-section';
            mapOrderDiv.style.cssText = `
                display: block !important;
                width: 100% !important;
                clear: both !important;
                float: none !important;
                margin-top: 20px !important;
                padding-top: 10px !important;
                border-top: 1px solid #eee !important;
                position: relative !important;
                overflow: visible !important;
            `;
            
            // Also style the inner content for center alignment
            const innerContent = mapOrderDiv.querySelector('div');
            if (innerContent) {
                innerContent.style.cssText = `
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    width: 100% !important;
                    gap: 20px !important;
                `;
            }
            
            console.log('NUCLEAR OPTION: Applied styling to Map Order div');
        }
        
        // Run the forced line break insertion
        setTimeout(insertForcedLineBreak, 100);
        
        // Direct DOM manipulation approach - find by text content
        setTimeout(function() {
            // Find the Map Order section by looking for text content
            const allDivs = document.querySelectorAll('div');
            let mapOrderDiv = null;
            
            for (let i = 0; i < allDivs.length; i++) {
                if (allDivs[i].textContent && allDivs[i].textContent.includes('Map Order')) {
                    mapOrderDiv = allDivs[i];
                    break;
                }
            }
            
            if (mapOrderDiv) {
                console.log('Found Map Order div, applying direct styling');
                
                // Add an ID to the div for easier targeting
                mapOrderDiv.id = 'map-order-section';
                mapOrderDiv.className = 'map-order-section';
                
                // Force to new line with aggressive styling
                mapOrderDiv.style.display = 'block';
                mapOrderDiv.style.width = '100%';
                mapOrderDiv.style.clear = 'both';
                mapOrderDiv.style.float = 'none';
                mapOrderDiv.style.marginTop = '20px';
                mapOrderDiv.style.paddingTop = '10px';
                mapOrderDiv.style.borderTop = '1px solid #eee';
                mapOrderDiv.style.overflow = 'visible';
                
                // Also style the parent to ensure it doesn't override
                if (mapOrderDiv.parentNode) {
                    mapOrderDiv.parentNode.style.display = 'block';
                    mapOrderDiv.parentNode.style.width = '100%';
                    mapOrderDiv.parentNode.style.overflow = 'visible';
                }
                
                console.log('Applied styling to force Map Order to new line');
            } else {
                console.log('Map Order div not found by text content');
            }
        }, 300);
        
        // Also try to find by looking for radio buttons
        setTimeout(function() {
            const mapOrderRadios = document.querySelectorAll('input[name="map-order"]');
            if (mapOrderRadios.length > 0) {
                console.log('Found Map Order radios, applying styling to parent');
                
                // Get the parent div
                let parent = mapOrderRadios[0].parentNode;
                while (parent && parent.tagName !== 'DIV') {
                    parent = parent.parentNode;
                }
                
                if (parent) {
                    // Add an ID to the div for easier targeting
                    parent.id = 'map-order-section';
                    parent.className = 'map-order-section';
                    
                    // Force to new line with aggressive styling
                    parent.style.display = 'block';
                    parent.style.width = '100%';
                    parent.style.clear = 'both';
                    parent.style.float = 'none';
                    parent.style.marginTop = '20px';
                    parent.style.paddingTop = '10px';
                    parent.style.borderTop = '1px solid #eee';
                    parent.style.overflow = 'visible';
                    
                    console.log('Applied styling to Map Order radio parent');
                }
            } else {
                console.log('Map Order radios not found');
            }
        }, 500);
        
        // Set up a MutationObserver to continuously monitor and fix the Map Order section
        function setupMutationObserver() {
            console.log('Setting up MutationObserver to continuously fix Map Order section');
            
            // Find the Combined View Options section
            const combinedViewSections = document.querySelectorAll('.settings-row');
            let combinedViewSection = null;
            
            for (const section of combinedViewSections) {
                if (section.textContent.includes('Combined View Options:')) {
                    combinedViewSection = section;
                    break;
                }
            }
            
            if (!combinedViewSection) {
                console.log('Combined View Options section not found for MutationObserver');
                return;
            }
            
            // Create a MutationObserver to watch for changes
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' || mutation.type === 'attributes') {
                        // Check if our forced line break div is still there
                        const lineBreak = document.getElementById('forced-line-break');
                        if (!lineBreak) {
                            console.log('MutationObserver: Line break div removed, reinserting');
                            insertForcedLineBreak();
                        }
                        
                        // Find the Map Order section
                        const mapOrderSection = document.getElementById('map-order-section');
                        if (mapOrderSection) {
                            // Ensure it has the correct styling
                            mapOrderSection.style.display = 'block';
                            mapOrderSection.style.width = '100%';
                            mapOrderSection.style.clear = 'both';
                            mapOrderSection.style.float = 'none';
                            mapOrderSection.style.marginTop = '20px';
                            mapOrderSection.style.paddingTop = '10px';
                            mapOrderSection.style.borderTop = '1px solid #eee';
                            mapOrderSection.style.overflow = 'visible';
                            
                            console.log('MutationObserver: Reapplied styling to Map Order section');
                        }
                    }
                });
            });
            
            // Start observing the Combined View Options section
            observer.observe(combinedViewSection, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style']
            });
            
            console.log('MutationObserver set up successfully');
        }
        
        // Set up the MutationObserver after a delay
        setTimeout(setupMutationObserver, 1000);
    }
    
    // Initialize
    function initialize() {
        fixMapOrderSection();
        
        // Also run after delays to ensure it takes effect
        setTimeout(fixMapOrderSection, 500);
        setTimeout(fixMapOrderSection, 1000);
        setTimeout(fixMapOrderSection, 2000);
    }
    
    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded, initialize immediately
        initialize();
    }
    
    // Also run when the window loads
    window.addEventListener('load', initialize);
    
    console.log('Map Order Fix - Initialized');
})();

/* END OF CODE - Cline - 2025-06-02 15:48 File: js/map-order-fix.js */
