/* START OF CODE - Cline - 2025-06-03 19:34 File: js/combined-view-exact-match.js */

/**
 * This script styles the Combined View Options section to exactly match the mockup.
 * It uses a simple CSS-only approach to minimize page flickering and ensure consistent styling.
 */

(function() {
    // Only run once when the page loads
    window.addEventListener('load', function() {
        console.log('Combined View Exact Match - Applying styles');
        
        // Check if we've already run this fix
        if (document.getElementById('combined-view-exact-match-style')) {
            console.log('Combined View Exact Match styles already applied');
            return;
        }
        
        // Create a style element for our CSS
        const styleElement = document.createElement('style');
        styleElement.id = 'combined-view-exact-match-style';
        
        // Add CSS to style the Combined View Options section exactly like the mockup
        styleElement.textContent = `
            /* Combined View Options title styling */
            .settings-row:has(*:contains("Combined View Options")) > div:first-child {
                text-align: center !important;
                font-weight: bold !important;
                color: #0056b3 !important;
                margin-bottom: 15px !important;
                font-size: 1.15em !important;
                width: 100% !important;
            }
            
            /* Add horizontal lines */
            .settings-row:has(*:contains("Combined View Options")) {
                border-top: 1px solid #ddd !important;
                border-bottom: 1px solid #ddd !important;
                padding-top: 15px !important;
                padding-bottom: 15px !important;
                margin-top: 15px !important;
                margin-bottom: 15px !important;
            }
            
            /* Container styling */
            .settings-row:has(*:contains("Combined View Options")) > div[style*="background-color"] {
                background-color: transparent !important;
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
            }
            
            /* Circle Overlap row styling - CENTER ALIGNED */
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
                width: auto !important;
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
            
            /* Map Order row styling - CENTER ALIGNED */
            div:has(input[name="map-order"]) {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                width: 100% !important;
                margin-top: 20px !important;
                margin-bottom: 20px !important;
            }
            
            div:has(input[name="map-order"]) > * {
                display: flex !important;
                align-items: center !important;
                width: auto !important;
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
        
        // Set the Circle Overlap slider to 5% by default (as requested by the user)
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
        
        console.log('Combined View Exact Match styles applied successfully');
    });
})();

/* END OF CODE - Cline - 2025-06-03 19:34 File: js/combined-view-exact-match.js */
