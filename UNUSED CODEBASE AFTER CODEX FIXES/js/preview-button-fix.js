// Fix for the PREVIEW button not working

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Preview button fix loaded");
    
    // Get the generate button
    const generateBtn = document.getElementById('generateBtn');
    if (!generateBtn) {
        console.error("Generate button not found");
        return;
    }
    
    // Add click event listener
    generateBtn.addEventListener('click', function() {
        console.log("Generate button clicked");
        
        // Check if the button is disabled
        if (generateBtn.hasAttribute('disabled')) {
            console.log("Button is disabled, not generating");
            return;
        }
        
        // Call the generateStarMap function
        if (typeof window.generateStarMap === 'function') {
            console.log("Calling generateStarMap function");
            window.generateStarMap();
        } else {
            console.error("generateStarMap function not found");
            alert("Error: Star map generation function not found. Please refresh the page and try again.");
        }
    });
    
    console.log("Preview button fix applied");
});
