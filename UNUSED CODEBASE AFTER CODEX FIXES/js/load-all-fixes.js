/* START OF CODE - Cline - 2025-06-02 15:50 File: js/load-all-fixes.js */

/**
 * This script loads all the fix scripts in the correct order
 * and includes the circle overlap slider initialization code
 * to ensure that all fixes are applied properly.
 */

(function() {
    console.log('Load All Fixes - Initializing');
    
    // Initialize circle overlap slider
    function initializeCircleOverlapSlider() {
        console.log('Initializing circle overlap slider');
        
        const overlapSlider = document.getElementById('circle-overlap-percent');
        const overlapValue = document.getElementById('overlap-value');
        
        if (overlapSlider && overlapValue) {
            // Set initial value
            overlapSlider.value = '5';
            overlapValue.textContent = '5%';
            
            // Add event listener
            overlapSlider.addEventListener('input', function() {
                overlapValue.textContent = this.value + '%';
                
                // Update combinedViewSettings if it exists
                if (window.combinedViewSettings) {
                    window.combinedViewSettings.overlapPercent = parseInt(this.value);
                }
            });
            
            console.log('Circle overlap slider initialized');
        }
    }
    
    // List of scripts to load in order - REMOVED map-order-fix.js to prevent double loading
    const scripts = [
        'js/dimensions-fix-v2.js',
        'js/advanced-options-fix-v2.js'
        // 'js/map-order-fix.js' - REMOVED to prevent double loading
    ];
    
    // Function to load a script
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            console.log(`Loading script: ${src}`);
            
            // Check if the script is already loaded - IMPROVED CHECK
            const existingScript = document.querySelector(`script[src="${src}"]`);
            const existingScriptWithoutPath = document.querySelector(`script[src="${src.split('/').pop()}"]`);
            
            if (existingScript || existingScriptWithoutPath) {
                console.log(`Script already loaded: ${src}`);
                resolve();
                return;
            }
            
            // Create a new script element
            const script = document.createElement('script');
            script.src = src;
            script.async = false; // Load scripts in order
            script.setAttribute('data-loaded-by', 'load-all-fixes.js'); // Mark as loaded by this script
            
            // Set up event handlers
            script.onload = () => {
                console.log(`Script loaded successfully: ${src}`);
                resolve();
            };
            
            script.onerror = () => {
                console.error(`Error loading script: ${src}`);
                reject();
            };
            
            // Add the script to the document
            document.head.appendChild(script);
        });
    }
    
    // Load all scripts in sequence
    async function loadAllScripts() {
        for (const src of scripts) {
            try {
                await loadScript(src);
            } catch (error) {
                console.error(`Failed to load script: ${src}`);
            }
        }
        
        console.log('All scripts loaded');
    }
    
    // Initialize
    function initialize() {
        loadAllScripts().then(() => {
            // Initialize the circle overlap slider after all scripts are loaded
            initializeCircleOverlapSlider();
        });
    }
    
    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded, initialize immediately
        initialize();
    }
    
    console.log('Load All Fixes - Initialized');
})();

/* END OF CODE - Cline - 2025-06-02 15:50 File: js/load-all-fixes.js */
