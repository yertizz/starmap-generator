/* START OF CODE - Cline - 2025-06-03 18:58 File: js/combined-view-exact-match.js */

/**
 * This script completely replaces the layout of the Combined View Options section
 * to EXACTLY match the mockup. It creates a clean layout with:
 * 1. "Combined View Options:" as a title in blue
 * 2. Circle Overlap on its own line
 * 3. Map Order on its own line below Circle Overlap
 * 4. The note at the bottom
 * 
 * DIRECT HTML INJECTION - This approach directly injects the HTML structure shown in the mockup.
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
        
        // Find the Combined View Options section
        const settingsRows = document.querySelectorAll('.settings-row');
        let targetRow = null;
        
        // Look for the row that contains the Advanced Options button
        for (const row of settingsRows) {
            if (row.querySelector('#advanced-options-toggle')) {
                targetRow = row;
                break;
            }
        }
        
        if (!targetRow) {
            console.error('Could not find the Advanced Options button row');
            return;
        }
        
        console.log('Found Advanced Options button row, inserting Combined View Options before it');
        
        // Create a marker element to prevent multiple applications
        const marker = document.createElement('div');
        marker.id = 'combined-view-exact-match-marker';
        marker.style.display = 'none';
        document.body.appendChild(marker);
        
        // Create the Combined View Options section
        const combinedViewSection = document.createElement('div');
        combinedViewSection.className = 'settings-row';
        combinedViewSection.style.marginTop = '15px';
        
        // Set the HTML content directly to match the mockup exactly
        combinedViewSection.innerHTML = `
            <div style="width: 100%; text-align: center; font-weight: bold; margin-bottom: 15px; color: #0056b3; font-size: 1.15em;">
                Combined View Options:
            </div>
            
            <div style="display: flex; align-items: center; width: 100%; margin-bottom: 20px;">
                <label style="min-width: 120px; text-align: right; margin-right: 10px; color: #666;">Circle Overlap:</label>
                <input type="range" id="circle-overlap-percent" min="0" max="50" value="5" 
                       style="width: 300px; margin: 0 10px;">
                <span id="overlap-value" style="min-width: 40px; text-align: right; font-weight: bold; color: #333;">5%</span>
            </div>
            
            <div style="display: block; width: 100%; height: 20px; clear: both; float: none; position: relative; margin: 10px 0;"></div>
            
            <div style="display: flex; align-items: center; width: 100%; margin-top: 10px; margin-bottom: 10px;">
                <label style="min-width: 120px; text-align: right; margin-right: 10px; color: #666;">Map Order:</label>
                <div style="display: flex; gap: 20px;"> 
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="radio" name="map-order" value="street-first" checked 
                               style="margin-right: 5px;">
                        Street Map First
                    </label>
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="radio" name="map-order" value="star-first" 
                               style="margin-right: 5px;">
                        Star Map First
                    </label>
                </div>
            </div>
            
            <div style="margin-top: 15px; font-size: 11px; color: #666; font-style: italic; text-align: center; width: 100%;">
                These settings apply to Combined [Landscape] & Combined [Portrait] views ONLY!
            </div>
        `;
        
        // Insert the Combined View Options section before the Advanced Options button row
        targetRow.parentNode.insertBefore(combinedViewSection, targetRow);
        
        console.log('Combined View Options section inserted successfully');
        
        // Add event listener to the slider
        const overlapSlider = document.getElementById('circle-overlap-percent');
        const overlapValue = document.getElementById('overlap-value');
        
        if (overlapSlider && overlapValue) {
            overlapSlider.addEventListener('input', function() {
                overlapValue.textContent = this.value + '%';
                
                // Update combinedViewSettings if it exists
                if (window.combinedViewSettings) {
                    window.combinedViewSettings.overlapPercent = parseInt(this.value);
                }
            });
            
            console.log('Circle overlap slider event listener added');
        }
        
        // Add event listeners to the radio buttons
        const mapOrderRadios = document.querySelectorAll('input[name="map-order"]');
        
        mapOrderRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (window.combinedViewSettings) {
                    window.combinedViewSettings.streetMapFirst = (this.value === 'street-first');
                }
            });
        });
        
        console.log('Map order radio buttons event listeners added');
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

/* END OF CODE - Cline - 2025-06-03 18:58 File: js/combined-view-exact-match.js */
