// Star Map Style Fix - Ensures the Star Map Style dropdown works correctly

document.addEventListener('DOMContentLoaded', function() {
    console.log("Applying Star Map Style fixes");
    
    // Fix the width of the Star Map Style dropdown
    const starMapStyle = document.getElementById('star-map-style');
    if (starMapStyle) {
        starMapStyle.style.width = '150px';
        starMapStyle.style.maxWidth = '150px';
        
        // Make sure the parent container is also properly sized
        const styleContainer = starMapStyle.closest('.style-selector-container');
        if (styleContainer) {
            styleContainer.style.width = 'auto';
            styleContainer.style.maxWidth = '150px';
            styleContainer.style.margin = '0 auto';
        }
    }
    
    // Fix the issue with the Star Map Image color picker interfering with the generated star map
    const starFieldColor = document.getElementById('star-field-color');
    if (starFieldColor) {
        // Store the original value
        const originalValue = starFieldColor.value;
        
        // Add event listener to ensure the color picker doesn't interfere with the star map generation
        starFieldColor.addEventListener('change', function() {
            // Update the global variable if it exists
            if (typeof currentStarMapStyle !== 'undefined') {
                // Force regenerate the star map
                if (typeof directGenerateStarMap === 'function') {
                    directGenerateStarMap();
                } else if (typeof generateStarMap === 'function') {
                    generateStarMap();
                }
            }
        });
    }
    
    // Make sure the Star Map Style selector doesn't override the user's color choices
    const starMapStyleSelector = document.getElementById('star-map-style');
    if (starMapStyleSelector) {
        // Store the original event listener
        const originalEventListener = starMapStyleSelector.onchange;
        
        // Remove the original event listener
        starMapStyleSelector.onchange = null;
        
        // Add a new event listener that preserves the user's color choices
        starMapStyleSelector.addEventListener('change', function() {
            // Update the global variable
            if (typeof currentStarMapStyle !== 'undefined') {
                currentStarMapStyle = this.value;
                console.log(`Star map style changed to: ${currentStarMapStyle}`);
                
                // Preserve the user's color choices
                const starFieldColor = document.getElementById('star-field-color');
                const outsideColor = document.getElementById('outside-color');
                const userStarFieldColor = starFieldColor ? starFieldColor.value : '#000000';
                const userOutsideColor = outsideColor ? outsideColor.value : '#0a0e1a';
                
                // Force regenerate the star map
                if (typeof directGenerateStarMap === 'function') {
                    directGenerateStarMap();
                } else if (typeof generateStarMap === 'function') {
                    generateStarMap();
                }
                
                // Restore the user's color choices
                if (starFieldColor) starFieldColor.value = userStarFieldColor;
                if (outsideColor) outsideColor.value = userOutsideColor;
            }
        });
    }
    
    console.log("Star Map Style fixes applied");
});
