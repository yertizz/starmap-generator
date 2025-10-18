/* START OF CODE - Cline - 2025-06-24 10:25 File: js/settings-preview-download-core.js */

/**
 * Settings + Preview + Download Section - CORE VIEW FUNCTIONS
 * 
 * This script handles the core view functionality for the 5 View Options buttons.
 * FIXED VERSION - Properly handles canvas dimensions and prevents Canvas Layout domination.
 */

/**
 * View star map and street map side by side in landscape orientation
 * FIXED VERSION - PROPERLY FLIPS CANVAS TO LANDSCAPE
 */
function viewStarStreetLandscape() {
    console.log("🌄 Combined Landscape view called - FIXED VERSION");
    
    // First, check if we have valid coordinates
    if (!validateCoordinates()) {
        alert("Please enter valid coordinates or a location first.");
        return;
    }
    
    // Store the current view type
    window.currentViewType = 'star-street-landscape';
    
    // Get user dimensions
    const userDimensions = getUserDimensions();
    
    // CRITICAL FIX: For landscape view, FLIP the dimensions if canvas is portrait
    let canvasWidth = userDimensions.width;
    let canvasHeight = userDimensions.height;
    
    if (userDimensions.height > userDimensions.width) {
        // Canvas is portrait, flip to landscape for this view
        canvasWidth = userDimensions.height;  // Use height as width
        canvasHeight = userDimensions.width;  // Use width as height
        console.log(`🔄 FLIPPING to landscape: ${canvasWidth}w x ${canvasHeight}h`);
    }
    
    // Get the canvas
    const canvas = document.getElementById('star-map-canvas');
    if (!canvas) {
        console.error("Canvas not found");
        return;
    }
    
    // Set canvas to landscape dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    
    console.log(`✅ Canvas set to landscape: ${canvasWidth}w x ${canvasHeight}h`);
    
    // Update dimensions display to show landscape dimensions
    updateDimensionsDisplay(canvasWidth, canvasHeight, 'landscape');
    
    // Clear the canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Get the circle radius (smaller for side-by-side)
    const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
    const radius = Math.min(canvas.width, canvas.height) * (radiusPercent / 100) / 3;
    
    // Calculate positions for both circles
    const centerY = canvas.height / 2;
    const leftCenterX = canvas.width / 3;
    const rightCenterX = canvas.width * 2 / 3;
    
    // Get border settings
    const borderWidth = parseInt(document.getElementById('border-width').value) || 2;
    const borderColor = document.getElementById('border-color').value || "#FDCA0D";
    
    // Check Map Order setting
    const mapOrderRadios = document.getElementsByName('map-order');
    let starMapFirst = false;
    for (const radio of mapOrderRadios) {
        if (radio.checked && radio.value === 'star-first') {
            starMapFirst = true;
            break;
        }
    }
    
    // Draw borders for both circles
    ctx.beginPath();
    ctx.arc(leftCenterX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(rightCenterX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    
    // Render maps based on Map Order setting
    if (starMapFirst) {
        // Star map first (left), street map second (right)
        renderStarMapInCircle(ctx, leftCenterX, centerY, radius);
        renderStreetMapInCircle(ctx, rightCenterX, centerY, radius);
    } else {
        // Street map first (left), star map second (right) - DEFAULT
        renderStreetMapInCircle(ctx, leftCenterX, centerY, radius);
        renderStarMapInCircle(ctx, rightCenterX, centerY, radius);
    }
    
    // Enable the download button
    document.getElementById('download-star-street-landscape-btn').disabled = false;
    
    console.log("✅ Fixed landscape view with actual maps rendered");
}

/**
 * View star map and street map stacked in portrait orientation
 * FIXED VERSION - PROPERLY HANDLES PORTRAIT
 */
function viewStarStreetPortrait() {
    console.log("📱 Combined Portrait view called - FIXED VERSION");
    
    // First, check if we have valid coordinates
    if (!validateCoordinates()) {
        alert("Please enter valid coordinates or a location first.");
        return;
    }
    
    // Store the current view type
    window.currentViewType = 'star-street-portrait';
    
    // Get user dimensions
    const userDimensions = getUserDimensions();
    
    // CRITICAL FIX: For portrait view, FLIP the dimensions if canvas is landscape
    let canvasWidth = userDimensions.width;
    let canvasHeight = userDimensions.height;
    
    if (userDimensions.width > userDimensions.height) {
        // Canvas is landscape, flip to portrait for this view
        canvasWidth = userDimensions.height;  // Use height as width
        canvasHeight = userDimensions.width;  // Use width as height
        console.log(`🔄 FLIPPING to portrait: ${canvasWidth}w x ${canvasHeight}h`);
    }
    
    // Get the canvas
    const canvas = document.getElementById('star-map-canvas');
    if (!canvas) {
        console.error("Canvas not found");
        return;
    }
    
    // Set canvas to portrait dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    
    console.log(`✅ Canvas set to portrait: ${canvasWidth}w x ${canvasHeight}h`);
    
    // Update dimensions display to show portrait dimensions
    updateDimensionsDisplay(canvasWidth, canvasHeight, 'portrait');
    
    // Clear the canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Get the circle radius (smaller for stacked)
    const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
    const radius = Math.min(canvas.width, canvas.height) * (radiusPercent / 100) / 3;
    
    // Calculate positions for both circles
    const centerX = canvas.width / 2;
    const topCenterY = canvas.height / 3;
    const bottomCenterY = canvas.height * 2 / 3;
    
    // Get border settings
    const borderWidth = parseInt(document.getElementById('border-width').value) || 2;
    const borderColor = document.getElementById('border-color').value || "#FDCA0D";
    
    // Check Map Order setting
    const mapOrderRadios = document.getElementsByName('map-order');
    let starMapFirst = false;
    for (const radio of mapOrderRadios) {
        if (radio.checked && radio.value === 'star-first') {
            starMapFirst = true;
            break;
        }
    }
    
    // Draw borders for both circles
    ctx.beginPath();
    ctx.arc(centerX, topCenterY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, bottomCenterY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    
    // Render maps based on Map Order setting
    if (starMapFirst) {
        // Star map first (top), street map second (bottom)
        renderStarMapInCircle(ctx, centerX, topCenterY, radius);
        renderStreetMapInCircle(ctx, centerX, bottomCenterY, radius);
    } else {
        // Street map first (top), star map second (bottom) - DEFAULT
        renderStreetMapInCircle(ctx, centerX, topCenterY, radius);
        renderStarMapInCircle(ctx, centerX, bottomCenterY, radius);
    }
    
    // Enable the download button
    document.getElementById('download-star-street-portrait-btn').disabled = false;
    
    console.log("✅ Fixed portrait view with actual maps rendered");
}

/**
 * View the star map on canvas (equivalent to the existing VIEW STAR MAP ON CANVAS functionality)
 */
function viewStarMapOnCanvas() {
    console.log("View Star Map on Canvas button clicked");
    
    // CRITICAL: DO NOT reset canvas dimensions here - this is the Canvas Layout function
    // This function should use the existing generateStarMap() which handles its own canvas sizing
    
    // Get the background color from the input
    const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
    console.log("Using background color:", bgColor);
    
    // Set the background color on the canvas directly
    const canvas = document.getElementById('star-map-canvas');
    if (canvas) {
        // Store the background color in a data attribute for reference
        canvas.dataset.bgColor = bgColor;
        
        // Apply the background color directly to the canvas
        canvas.style.backgroundColor = bgColor;
    }
    
    // Store the current view type
    window.currentViewType = 'star-map-canvas';
    
    // Call the existing generateStarMap function which is the original functionality
    if (typeof generateStarMap === 'function') {
        generateStarMap();
    } else {
        console.error("generateStarMap function not found");
        // Fallback implementation if the function doesn't exist
        viewStarMap();
    }
}

/* END OF CODE - Cline - 2025-06-24 10:25 File: js/settings-preview-download-core.js */
