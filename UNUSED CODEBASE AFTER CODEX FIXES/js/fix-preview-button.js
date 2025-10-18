// Fix Preview Button - Ensures the PREVIEW button works correctly

document.addEventListener('DOMContentLoaded', function() {
    console.log("Fix Preview Button script loaded");
    
    // Get the generate button
    const generateBtn = document.getElementById('generateBtn');
    if (!generateBtn) {
        console.error("Generate button not found");
        return;
    }
    
    // Remove the disabled attribute
    generateBtn.removeAttribute("disabled");
    
    // Add a direct event listener that will always work
    generateBtn.addEventListener('click', function(event) {
        console.log("Generate button clicked via fix-preview-button.js");
        
        // Prevent default behavior
        event.preventDefault();
        
        // Call the appropriate function to generate the star map
        if (typeof directGenerateStarMap === 'function') {
            directGenerateStarMap();
        } else if (typeof generateStarMap === 'function') {
            generateStarMap();
        } else {
            console.error("No star map generation function found");
            alert("Error: Star map generation function not found");
        }
    }, true); // Use capturing to ensure this handler runs first
    
    console.log("Generate button enabled unconditionally");
    console.log("Preview button fix applied");
});

// Function to ensure the star map is generated correctly
function ensureStarMapGeneration() {
    // Check if the canvas has content
    const canvas = document.getElementById('star-map-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Check if the canvas is empty
    const imageData = ctx.getImageData(0, 0, 1, 1);
    if (imageData.data[3] === 0) { // If transparent (alpha = 0)
        console.log("Canvas is empty, generating star map");
        
        // Call the appropriate function to generate the star map
        if (typeof directGenerateStarMap === 'function') {
            directGenerateStarMap();
        } else if (typeof generateStarMap === 'function') {
            generateStarMap();
        }
    } else {
        console.log("Canvas already has content, not drawing backup stars");
    }
}

// Call ensureStarMapGeneration after a short delay to make sure everything is loaded
setTimeout(ensureStarMapGeneration, 1000);
