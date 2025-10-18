/* START OF CODE - Cline - 2025-06-03 19:28 File: js/combined-view-exact-match.js */

/**
 * This script completely replaces the layout of the Combined View Options section
 * to EXACTLY match the mockup. It creates a clean layout with:
 * 1. "Combined View Options:" as a title in blue and centered
 * 2. Circle Overlap slider set to 5% by default (max 50%)
 * 3. Circle Overlap label and slider centered
 * 4. Map Order on a separate row and centered
 * 5. Note text centered at the bottom
 * 6. Horizontal lines separating the sections
 * 
 * DIRECT MODIFICATION - This approach directly modifies the existing Combined View Options section.
 */

(function() {
    console.log('Combined View Exact Match - Initializing');
    
    // Function to fix the Combined View Options layout
    function fixCombinedViewLayout() {
        console.log('EXACT MATCH: Fixing Combined View Options layout');
        
        // Check if we've already run this fix
        if (document.getElementById('combined-view-exact-match-marker')) {
            console.log('Combined View Exact Match fix already applied');
            return;
        }
        
        // Create a marker element to prevent multiple applications
        const marker = document.createElement('div');
        marker.id = 'combined-view-exact-match-marker';
        marker.style.display = 'none';
        document.body.appendChild(marker);
        
        // Find the Combined View Options section by looking for its title
        const allDivs = document.querySelectorAll('div');
        let combinedViewSection = null;
        
        for (const div of allDivs) {
            if (div.textContent && div.textContent.includes('Combined View Options:')) {
                // Found the title, now get the parent section
                combinedViewSection = div.closest('.settings-row');
                break;
            }
        }
        
        if (!combinedViewSection) {
            console.error('Could not find the Combined View Options section');
            return;
        }
        
        console.log('Found Combined View Options section, modifying it directly');
        
        // Get the existing elements
        const circleOverlapSlider = document.getElementById('circle-overlap-percent');
        const overlapValue = document.getElementById('overlap-value');
        const mapOrderRadios = document.querySelectorAll('input[name="map-order"]');
        
        if (!circleOverlapSlider || !overlapValue || mapOrderRadios.length === 0) {
            console.error('Could not find all required elements in the Combined View Options section');
            return;
        }
        
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
                align-items: center !important;
                width: 100% !important;
            }
            
            /* Add horizontal lines */
            .settings-row:has(*:contains("Combined View Options")) > div[style*="background-color"]::before,
            .settings-row:has(*:contains("Combined View Options")) > div[style*="background-color"]::after {
                content: "" !important;
                display: block !important;
                width: 100% !important;
                height: 1px !important;
                background-color: #ddd !important;
                margin: 15px 0 !important;
            }
            
            /* Add middle horizontal line */
            .settings-row:has(*:contains("Combined View Options")) > div[style*="background-color"] > div:has(#circle-overlap-percent)::after {
                content: "" !important;
                display: block !important;
                width: 100% !important;
                height: 1px !important;
                background-color: #ddd !important;
                margin: 15px 0 !important;
            }
            
            /* Circle Overlap styling - CENTER ALIGNED */
            div:has(#circle-overlap-percent) {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                width: 100% !important;
                margin-bottom: 20px !important;
            }
            
            div:has(#circle-overlap-percent) > * {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 80% !important;
            }
            
            div:has(#circle-overlap-percent) label {
                min-width: 120px !important;
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
            
            /* Map Order styling - CENTER ALIGNED */
            div:has(input[name="map-order"]) {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                width: 100% !important;
                margin: 20px 0 !important;
            }
            
            div:has(input[name="map-order"]) > * {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 80% !important;
            }
            
            div:has(input[name="map-order"]) label:first-child {
                min-width: 120px !important;
                color: #666 !important;
            }
            
            /* Radio buttons container */
            div:has(input[name="map-order"]) > div > div {
                display: flex !important;
                gap: 20px !important;
            }
            
            /* Note styling - CENTER ALIGNED */
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
        
        // Set the Circle Overlap slider to 5% by default
        circleOverlapSlider.value = '5';
        overlapValue.textContent = '5%';
        
        // Update combinedViewSettings if it exists
        if (window.combinedViewSettings) {
            window.combinedViewSettings.overlapPercent = 5;
        }
        
        // Add event listener to the slider
        circleOverlapSlider.addEventListener('input', function() {
            overlapValue.textContent = this.value + '%';
            
            // Update combinedViewSettings if it exists
            if (window.combinedViewSettings) {
                window.combinedViewSettings.overlapPercent = parseInt(this.value);
            }
        });
        
        console.log('Circle overlap slider set to 5% and event listener added');
        
        // Add event listeners to the radio buttons
        mapOrderRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (window.combinedViewSettings) {
                    window.combinedViewSettings.streetMapFirst = (this.value === 'street-first');
                }
            });
        });
        
        console.log('Map order radio buttons event listeners added');
        console.log('Combined View Options section modified successfully');
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

/* END OF CODE - Cline - 2025-06-03 19:28 File: js/combined-view-exact-match.js */
