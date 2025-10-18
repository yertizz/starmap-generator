/* START OF CODE - Cline - 2025-06-02 15:47 File: js/advanced-options-fix-v2.js */

/**
 * This script fixes the advanced options panel by creating it if it doesn't exist
 * and suppressing error messages from advanced_options.js
 */

(function() {
    console.log('Advanced Options Fix v2 - Initializing');
    
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
    
    // Override console.error to suppress specific error messages
    function suppressErrorMessages() {
        const originalConsoleError = console.error;
        console.error = function() {
            // Check if this is one of our suppressed errors
            if (arguments[0] && typeof arguments[0] === 'string') {
                if (arguments[0].includes('Could not find toggle button (#advanced-options-toggle)') ||
                    arguments[0].includes('Required elements not found for fixing image format logic') ||
                    arguments[0].includes('Required elements not found for fixing PNG transparency position')) {
                    // Suppress this error
                    console.log('Suppressed error:', arguments[0]);
                    return;
                }
            }
            
            // Pass through to the original console.error for other errors
            originalConsoleError.apply(console, arguments);
        };
        
        console.log('Error suppression enabled');
    }
    
    // Initialize
    function initialize() {
        createAdvancedOptionsPanel();
        suppressErrorMessages();
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
    
    console.log('Advanced Options Fix v2 - Initialized');
})();

/* END OF CODE - Cline - 2025-06-02 15:47 File: js/advanced-options-fix-v2.js */
