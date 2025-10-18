/* START OF CODE - Cline - 2025-06-03 18:41 File: js/combined-view-exact-match.js */

/**
 * This script completely replaces the layout of the Combined View Options section
 * to EXACTLY match the mockup. It creates a clean layout with:
 * 1. "Combined View Options:" as a title in blue
 * 2. Circle Overlap on its own line
 * 3. Map Order on its own line below Circle Overlap
 * 4. The note at the bottom
 * 
 * EXACT MATCH - This is a fresh approach that doesn't rely on previous fixes.
 */

(function() {
    console.log('Combined View Exact Match - Initializing');
    
    // Function to fix the Combined View Options layout
    function fixCombinedViewLayout() {
        console.log('EXACT MATCH: Fixing Combined View Options layout');
        
        // Check if we've already run this fix
        if (document.getElementById('combined-view-exact-match-style')) {
            console.log('Combined View Exact Match fix already applied');
            return;
        }
        
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
        
        // Create a style element to add our CSS
        const styleElement = document.createElement('style');
        styleElement.id = 'combined-view-exact-match-style';
        
        // Add CSS to style the Combined View Options section
        styleElement.textContent = `
            /* Combined View Options section styling */
            .settings-row:has(*:contains("Combined View Options")) {
                margin-top: 15px !important;
                margin-bottom: 15px !important;
                padding: 0 !important;
                border: none !important;
                background: transparent !important;
            }
            
            /* Title styling */
            .settings-row:has(*:contains("Combined View Options")) > div:first-child {
                text-align: center !important;
                font-weight: bold !important;
                color: #0056b3 !important;
                margin-bottom: 15px !important;
                font-size: 1.15em !important;
                border-bottom: none !important;
                width: 100% !important;
            }
            
            /* Container styling */
            .settings-row:has(*:contains("Combined View Options")) > div[style*="background-color"] {
                background-color: transparent !important;
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: flex-start !important;
                width: 100% !important;
            }
            
            /* Circle Overlap styling */
            div:has(#circle-overlap-percent) {
                display: flex !important;
                align-items: center !important;
                width: 100% !important;
                margin-bottom: 20px !important;
            }
            
            div:has(#circle-overlap-percent) label {
                min-width: 120px !important;
                text-align: right !important;
                margin-right: 10px !important;
                color: #666 !important;
            }
            
            #circle-overlap-percent {
                width: 300px !important;
                margin: 0 10px !important;
            }
            
            #overlap-value {
                min-width: 40px !important;
                text-align: right !important;
                font-weight: bold !important;
                color: #333 !important;
            }
            
            /* Map Order styling */
            div:has(input[name="map-order"]) {
                display: flex !important;
                align-items: center !important;
                width: 100% !important;
                margin-top: 10px !important;
                margin-bottom: 10px !important;
            }
            
            div:has(input[name="map-order"]) label:first-child {
                min-width: 120px !important;
                text-align: right !important;
                margin-right: 10px !important;
                color: #666 !important;
            }
            
            /* Radio buttons container */
            div:has(input[name="map-order"]) > div {
                display: flex !important;
                gap: 20px !important;
            }
            
            /* Note styling */
            .settings-row:has(*:contains("Combined View Options")) > div:last-child {
                font-size: 11px !important;
                color: #666 !important;
                font-style: italic !important;
                text-align: center !important;
                width: 100% !important;
                margin-top: 10px !important;
            }
        `;
        
        // Add the style element to the head
        document.head.appendChild(styleElement);
        
        // EXACT MATCH: Completely rebuild the Combined View Options section
        function rebuildCombinedViewOptions() {
            console.log('EXACT MATCH: Rebuilding Combined View Options section');
            
            // Find the container with the background color
            const container = combinedViewSection.querySelector('div[style*="background-color"]');
            if (!container) {
                console.log('Container not found');
                return;
            }
            
            // Get the title element
            const titleElement = combinedViewSection.querySelector('div:first-child');
            if (titleElement) {
                titleElement.textContent = 'Combined View Options:';
                titleElement.style.color = '#0056b3';
                titleElement.style.fontWeight = 'bold';
                titleElement.style.fontSize = '1.15em';
                titleElement.style.textAlign = 'center';
                titleElement.style.marginBottom = '15px';
                titleElement.style.width = '100%';
            }
            
            // Clear the container
            container.innerHTML = '';
            container.style.backgroundColor = 'transparent';
            container.style.padding = '0';
            container.style.margin = '0';
            container.style.border = 'none';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.alignItems = 'flex-start';
            container.style.width = '100%';
            
            // Create Circle Overlap row
            const circleOverlapRow = document.createElement('div');
            circleOverlapRow.style.display = 'flex';
            circleOverlapRow.style.alignItems = 'center';
            circleOverlapRow.style.width = '100%';
            circleOverlapRow.style.marginBottom = '20px';
            
            const circleOverlapLabel = document.createElement('label');
            circleOverlapLabel.textContent = 'Circle Overlap:';
            circleOverlapLabel.style.minWidth = '120px';
            circleOverlapLabel.style.textAlign = 'right';
            circleOverlapLabel.style.marginRight = '10px';
            circleOverlapLabel.style.color = '#666';
            
            const circleOverlapSlider = document.createElement('input');
            circleOverlapSlider.type = 'range';
            circleOverlapSlider.id = 'circle-overlap-percent';
            circleOverlapSlider.min = '0';
            circleOverlapSlider.max = '50';
            circleOverlapSlider.value = '5';
            circleOverlapSlider.style.width = '300px';
            circleOverlapSlider.style.margin = '0 10px';
            
            const circleOverlapValue = document.createElement('span');
            circleOverlapValue.id = 'overlap-value';
            circleOverlapValue.textContent = '5%';
            circleOverlapValue.style.minWidth = '40px';
            circleOverlapValue.style.textAlign = 'right';
            circleOverlapValue.style.fontWeight = 'bold';
            circleOverlapValue.style.color = '#333';
            
            circleOverlapRow.appendChild(circleOverlapLabel);
            circleOverlapRow.appendChild(circleOverlapSlider);
            circleOverlapRow.appendChild(circleOverlapValue);
            
            // Create Map Order row
            const mapOrderRow = document.createElement('div');
            mapOrderRow.style.display = 'flex';
            mapOrderRow.style.alignItems = 'center';
            mapOrderRow.style.width = '100%';
            mapOrderRow.style.marginTop = '10px';
            mapOrderRow.style.marginBottom = '10px';
            
            const mapOrderLabel = document.createElement('label');
            mapOrderLabel.textContent = 'Map Order:';
            mapOrderLabel.style.minWidth = '120px';
            mapOrderLabel.style.textAlign = 'right';
            mapOrderLabel.style.marginRight = '10px';
            mapOrderLabel.style.color = '#666';
            
            const mapOrderOptions = document.createElement('div');
            mapOrderOptions.style.display = 'flex';
            mapOrderOptions.style.gap = '20px';
            
            // Street Map First option
            const streetMapFirstLabel = document.createElement('label');
            streetMapFirstLabel.style.display = 'flex';
            streetMapFirstLabel.style.alignItems = 'center';
            streetMapFirstLabel.style.cursor = 'pointer';
            
            const streetMapFirstRadio = document.createElement('input');
            streetMapFirstRadio.type = 'radio';
            streetMapFirstRadio.name = 'map-order';
            streetMapFirstRadio.value = 'street-first';
            streetMapFirstRadio.checked = true;
            streetMapFirstRadio.style.marginRight = '5px';
            
            streetMapFirstLabel.appendChild(streetMapFirstRadio);
            streetMapFirstLabel.appendChild(document.createTextNode('Street Map First'));
            
            // Star Map First option
            const starMapFirstLabel = document.createElement('label');
            starMapFirstLabel.style.display = 'flex';
            starMapFirstLabel.style.alignItems = 'center';
            starMapFirstLabel.style.cursor = 'pointer';
            
            const starMapFirstRadio = document.createElement('input');
            starMapFirstRadio.type = 'radio';
            starMapFirstRadio.name = 'map-order';
            starMapFirstRadio.value = 'star-first';
            starMapFirstRadio.style.marginRight = '5px';
            
            starMapFirstLabel.appendChild(starMapFirstRadio);
            starMapFirstLabel.appendChild(document.createTextNode('Star Map First'));
            
            mapOrderOptions.appendChild(streetMapFirstLabel);
            mapOrderOptions.appendChild(starMapFirstLabel);
            
            mapOrderRow.appendChild(mapOrderLabel);
            mapOrderRow.appendChild(mapOrderOptions);
            
            // Create note
            const noteText = document.createElement('div');
            noteText.textContent = 'These settings apply to Combined [Landscape] & Combined [Portrait] views ONLY!';
            noteText.style.fontSize = '11px';
            noteText.style.color = '#666';
            noteText.style.fontStyle = 'italic';
            noteText.style.textAlign = 'center';
            noteText.style.width = '100%';
            noteText.style.marginTop = '10px';
            
            // Add all elements to the container
            container.appendChild(circleOverlapRow);
            container.appendChild(mapOrderRow);
            container.appendChild(noteText);
            
            // Add event listener to the slider
            circleOverlapSlider.addEventListener('input', function() {
                circleOverlapValue.textContent = this.value + '%';
                
                // Update combinedViewSettings if it exists
                if (window.combinedViewSettings) {
                    window.combinedViewSettings.overlapPercent = parseInt(this.value);
                }
            });
            
            // Add event listeners to the radio buttons
            streetMapFirstRadio.addEventListener('change', function() {
                if (window.combinedViewSettings) {
                    window.combinedViewSettings.streetMapFirst = true;
                }
            });
            
            starMapFirstRadio.addEventListener('change', function() {
                if (window.combinedViewSettings) {
                    window.combinedViewSettings.streetMapFirst = false;
                }
            });
            
            console.log('EXACT MATCH: Combined View Options section rebuilt');
        }
        
        // Run the rebuild function
        rebuildCombinedViewOptions();
        
        // Set up a MutationObserver to ensure the layout stays fixed
        function setupMutationObserver() {
            console.log('Setting up MutationObserver to maintain Combined View Options layout');
            
            // Create a MutationObserver to watch for changes
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' || mutation.type === 'attributes') {
                        // Check if our style element is still there
                        const styleElement = document.getElementById('combined-view-exact-match-style');
                        if (!styleElement) {
                            console.log('MutationObserver: Style element removed, reinserting');
                            document.head.appendChild(styleElement);
                        }
                        
                        // Check if the Combined View Options section has been modified
                        const container = combinedViewSection.querySelector('div[style*="background-color"]');
                        if (container && !container.querySelector('#circle-overlap-percent')) {
                            console.log('MutationObserver: Combined View Options section modified, rebuilding');
                            rebuildCombinedViewOptions();
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
        fixCombinedViewLayout();
        
        // Also run after delays to ensure it takes effect
        setTimeout(fixCombinedViewLayout, 500);
        setTimeout(fixCombinedViewLayout, 1000);
        setTimeout(fixCombinedViewLayout, 2000);
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
    
    console.log('Combined View Exact Match - Initialized');
})();

/* END OF CODE - Cline - 2025-06-03 18:41 File: js/combined-view-exact-match.js */
