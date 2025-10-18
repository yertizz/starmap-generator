/* START OF CODE - Cline - 2025-06-02 14:20 File: js/advanced-options-fix.js */

/**
 * This script fixes the advanced options panel by creating it if it doesn't exist
 */

(function() {
    console.log('Advanced Options Fix - Initializing');
    
    // Create the advanced options panel if it doesn't exist
    function createAdvancedOptionsPanel() {
        // Check if the panel already exists
        if (document.getElementById('advanced-options-panel')) {
            console.log('Advanced options panel already exists');
            return;
        }
        
        console.log('Creating advanced options panel');
        
        // Create the panel
        const panel = document.createElement('div');
        panel.id = 'advanced-options-panel';
        panel.style.display = 'none';
        
        // Find where to insert it
        const advancedOptionsButton = document.getElementById('advanced-options-toggle');
        if (advancedOptionsButton && advancedOptionsButton.parentNode) {
            advancedOptionsButton.parentNode.insertBefore(panel, advancedOptionsButton.nextSibling);
        } else {
            // Try to find a suitable container
            const settingsRow = document.querySelector('.settings-row');
            if (settingsRow && settingsRow.parentNode) {
                settingsRow.parentNode.appendChild(panel);
            } else {
                // Last resort, append to body
                document.body.appendChild(panel);
            }
        }
        
        console.log('Advanced options panel created');
    }
    
    // Initialize
    function initialize() {
        createAdvancedOptionsPanel();
    }
    
    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded, initialize immediately
        initialize();
    }
    
    // Also run after a delay to ensure everything is loaded
    setTimeout(initialize, 500);
    
    console.log('Advanced Options Fix - Initialized');
})();

/* END OF CODE - Cline - 2025-06-02 14:20 File: js/advanced-options-fix.js */
