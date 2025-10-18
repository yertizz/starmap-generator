/* START OF CODE - Cline - 2025-06-24 10:16 File: js/settings-preview-download.js */

/**
 * Settings + Preview + Download Section Functionality
 * 
 * This script handles the functionality for all buttons in the Settings + Preview + Download section.
 * It includes functions for:
 * - Loading and saving settings
 * - Viewing different map types (star map, street map, star map on canvas)
 * - Downloading different map types
 * - Viewing and downloading combined maps (star map + street map) in both landscape and portrait orientations
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the buttons once the DOM is loaded
    initializeButtons();
});

/**
 * Initialize all buttons in the Settings + Preview + Download section
 */
function initializeButtons() {
    console.log("Initializing Settings + Preview + Download buttons");
    
    // Settings buttons (already implemented in settings.js)
    // Connect to the original button IDs to maintain compatibility
    document.getElementById('loadSettingsBtn').addEventListener('click', function() {
        console.log("Load Settings button clicked");
        // Call the existing loadSavedSettings function from settings.js
        if (typeof loadSavedSettings === 'function') {
            loadSavedSettings();
        } else {
            console.error("loadSavedSettings function not found");
        }
    });
    
    document.getElementById('saveSettingsBtn').addEventListener('click', function() {
        console.log("Save Settings button clicked");
        // Call the existing saveCurrentSettings function from settings.js
        if (typeof saveCurrentSettings === 'function') {
            saveCurrentSettings();
        } else {
            console.error("saveCurrentSettings function not found");
        }
    });
    
    // View buttons
    document.getElementById('view-star-map-btn').addEventListener('click', viewStarMap);
    document.getElementById('view-street-map-btn').addEventListener('click', viewStreetMap);
    document.getElementById('view-star-map-canvas-btn').addEventListener('click', viewStarMapOnCanvas);
    document.getElementById('view-star-street-landscape-btn').addEventListener('click', viewStarStreetLandscape);
    document.getElementById('view-star-street-portrait-btn').addEventListener('click', viewStarStreetPortrait);
    
    // Download buttons
    document.getElementById('download-star-map-btn').addEventListener('click', downloadStarMap);
    document.getElementById('download-street-map-btn').addEventListener('click', downloadStreetMap);
    document.getElementById('download-star-map-canvas-btn').addEventListener('click', downloadStarMapWithCanvas);
    document.getElementById('download-star-street-landscape-btn').addEventListener('click', downloadStarStreetLandscape);
    document.getElementById('download-star-street-portrait-btn').addEventListener('click', downloadStarStreetPortrait);
}

/**
 * Get user dimensions from UI inputs
 */
function getUserDimensions() {
    const widthInput = document.getElementById('width') || document.getElementById('output-width');
    const heightInput = document.getElementById('height') || document.getElementById('output-height');
    
    let width = 2550, height = 3300; // Default dimensions
    if (widthInput && heightInput && widthInput.value && heightInput.value) {
        width = parseInt(widthInput.value);
        height = parseInt(heightInput.value);
    }
    
    // Also check if paper-size-dimensions.js has stored dimensions
    if (window.currentDimensions) {
        width = window.currentDimensions.width;
        height = window.currentDimensions.height;
    }
    
    console.log(`User dimensions: ${width}w x ${height}h`);
    return { width, height };
}

/**
 * Update dimensions display text above canvas
 */
function updateDimensionsDisplay(width, height, viewType = 'standard') {
    try {
        // Find or create dimensions display
        let dimensionsDisplay = document.getElementById('canvas-dimensions-display');
        if (!dimensionsDisplay) {
            // Create the display element if it doesn't exist
            dimensionsDisplay = document.createElement('div');
            dimensionsDisplay.id = 'canvas-dimensions-display';
            dimensionsDisplay.style.cssText = `
                text-align: center;
                font-weight: bold;
                color: #0056b3;
                margin: 10px 0;
                padding: 5px;
                background-color: #f8f9fa;
                border-radius: 5px;
                width: 100%;
                z-index: 9999;
                position: relative;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            `;
            
            // Try to insert it in the right place
            const zoomContainer = document.getElementById('zoom-container');
            if (zoomContainer && zoomContainer.parentNode) {
                zoomContainer.parentNode.insertBefore(dimensionsDisplay, zoomContainer.nextSibling);
            } else {
                // Fallback - append to body
                document.body.appendChild(dimensionsDisplay);
            }
        }
        
        // Determine display dimensions based on view type
        let displayWidth = width;
        let displayHeight = height;
        
        // For landscape views, flip the dimensions if canvas is portrait
        if (viewType === 'landscape' && height > width) {
            displayWidth = height;
            displayHeight = width;
            console.log(`🔄 Landscape view - flipping dimensions: ${displayWidth}w x ${displayHeight}h`);
        }
        
        // Format dimensions text
        let dimensionsText;
        const paperSizeSelect = document.getElementById('paper-auto-size');
        if (paperSizeSelect && paperSizeSelect.value && 
            paperSizeSelect.value !== 'default' && 
            paperSizeSelect.value !== 'Select A Paper Size...') {
            const paperSize = paperSizeSelect.value;
            const dpiSelector = document.getElementById('dpi-selector') || document.getElementById('dpi');
            const dpi = dpiSelector && dpiSelector.value ? dpiSelector.value : '300';
            dimensionsText = `Dimensions: ${displayWidth}w x ${displayHeight}h pixels | Paper: ${paperSize} | DPI: ${dpi}`;
        } else {
            dimensionsText = `Dimensions: ${displayWidth}w x ${displayHeight}h pixels`;
        }
        
        // Update the display
        dimensionsDisplay.textContent = dimensionsText;
        
        console.log(`✅ Updated dimensions display: ${dimensionsText}`);
        
    } catch (error) {
        console.error('Error updating dimensions display:', error);
    }
}

/**
 * Reset canvas to user dimensions (prevents Canvas Layout from dominating)
 */
function resetCanvasToUserDimensions() {
    const canvas = document.getElementById('star-map-canvas');
    if (!canvas) return;
    
    const dimensions = getUserDimensions();
    
    // Reset canvas to user dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Reset CSS dimensions
    canvas.style.width = dimensions.width + 'px';
    canvas.style.height = dimensions.height + 'px';
    
    console.log(`🔄 Reset canvas to user dimensions: ${dimensions.width}w x ${dimensions.height}h`);
    
    // Update dimensions display
    updateDimensionsDisplay(dimensions.width, dimensions.height, 'standard');
    
    return dimensions;
}

/**
 * View the star map (just the star map itself, not on canvas)
 */
function viewStarMap() {
    console.log("View Star Map button clicked");
    
    // First, check if we have valid coordinates
    if (!validateCoordinates()) {
        alert("Please enter valid coordinates or a location first.");
        return;
    }
    
    // CRITICAL: Reset canvas to prevent Canvas Layout domination
    const dimensions = resetCanvasToUserDimensions();
    
    // Show a warning message that this may take a while
    alert("Computing star map. This may take a while depending on your internet connection.");
    
    // Store the current view type to handle zoom correctly
    window.currentViewType = 'star-map';
    
    // Get the canvas and context
    const canvas = document.getElementById('star-map-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a background
    const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Get the circle radius
    const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
    const radius = Math.min(canvas.width, canvas.height) * (radiusPercent / 100) / 2;
    
    // Calculate center position
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw the circle border first (in case the image fails to load)
    const borderWidth = parseInt(document.getElementById('border-width').value) || 1;
    const borderColor = document.getElementById('border-color').value || '#FFFFFF';
    
    if (borderWidth > 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        ctx.stroke();
    }
    
    // Create a circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    // Get the latitude and longitude
    const latString = document.getElementById('latitude').value;
    const lngString = document.getElementById('longitude').value;
    
    // Parse the coordinates to decimal format
    let lat, lng;
    if (typeof parseFormattedCoordinate === 'function') {
        lat = parseFormattedCoordinate(latString, 'latitude');
        lng = parseFormattedCoordinate(lngString, 'longitude');
    } else if (typeof parseDMM === 'function') {
        lat = parseDMM(latString);
        lng = parseDMM(lngString);
    } else {
        // Simple fallback parsing if neither function is available
        const parseCoord = (str) => {
            if (!str) return null;
            // Try to extract decimal degrees from DMM format
            const match = str.match(/([NS])(\d+)°\s+(\d+\.\d+)′/i);
            if (match) {
                const direction = match[1].toUpperCase();
                const degrees = parseInt(match[2]);
                const minutes = parseFloat(match[3]);
                let decimal = degrees + (minutes / 60);
                if (direction === 'S') decimal = -decimal;
                return decimal;
            }
            // Try simple decimal parsing
            return parseFloat(str);
        };
        
        lat = parseCoord(latString);
        lng = parseCoord(lngString);
    }
    
    if (isNaN(lat) || isNaN(lng)) {
        console.error("Failed to parse coordinates:", latString, lngString);
        alert("Invalid coordinates format. Please check your input.");
        ctx.restore(); // Restore context before returning
        return;
    }
    
    // Get the date
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
    
    // Get the star map style
    const starMapStyle = document.getElementById('star-map-style').value || 'default';
    
    // Calculate LST for Right Ascension
    let lstHours;
    if (typeof calculateLST === 'function') {
        lstHours = calculateLST(date, lng);
        if (isNaN(lstHours)) {
            console.error("Could not calculate LST");
            lstHours = 0; // Default to 0 if calculation fails
        }
    } else {
        console.warn("calculateLST function not found, using default LST");
        lstHours = 0; // Default LST if function not available
    }
    
    // Prepare API Request Body for the star map
    const API_IMAGE_SIZE = 1000; // Higher resolution for better quality
    const requestBody = {
        style: starMapStyle,
        output: {
            width: API_IMAGE_SIZE,
            height: API_IMAGE_SIZE,
            format: "png"
        },
        observer: { latitude: lat, longitude: lng, date: date },
        view: {
            type: "area",
            parameters: {
                position: {
                    equatorial: {
                        rightAscension: lstHours,
                        declination: lat
                    }
                },
                backgroundColor: "#000033" // Navy blue background
            }
        }
    };
    
    console.log("Sending request to PHP proxy for star map:", JSON.stringify(requestBody, null, 2));
    
    // Fetch the star map image from the proxy
    fetch('proxy/star_map_proxy.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'image/png' },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Proxy error: ${response.status} ${response.statusText}`);
        }
        return response.blob();
    })
    .then(blob => {
        // Create an image from the blob
        const starMapUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.crossOrigin = "Anonymous";
        
        img.onload = function() {
            // Draw the star map image on our canvas, centered and scaled to fit the circle
            const aspectRatio = img.width / img.height;
            let drawWidth, drawHeight;
            
            if (aspectRatio > 1) {
                // Image is wider than tall
                drawHeight = radius * 2;
                drawWidth = drawHeight * aspectRatio;
            } else {
                // Image is taller than wide
                drawWidth = radius * 2;
                drawHeight = drawWidth / aspectRatio;
            }
            
            // Draw the image centered in the circle
            ctx.drawImage(
                img, 
                centerX - drawWidth / 2, 
                centerY - drawHeight / 2, 
                drawWidth, 
                drawHeight
            );
            
            // Restore the canvas context
            ctx.restore();
            
            // Enable the download button
            document.getElementById('download-star-map-btn').disabled = false;
            
            console.log("Star map image loaded and drawn successfully");
            
            // Revoke the object URL to free up memory
            URL.revokeObjectURL(starMapUrl);
        };
        
        img.onerror = function() {
            console.error("Failed to load star map image from blob");
            ctx.restore();
            
            // Draw a fallback star map (navy blue circle)
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
            ctx.fillStyle = "#000033"; // Navy blue
            ctx.fill();
            
            // Redraw the border
            if (borderWidth > 0) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.lineWidth = borderWidth;
                ctx.strokeStyle = borderColor;
                ctx.stroke();
            }
            
            // Enable the download button even if the image failed to load
            document.getElementById('download-star-map-btn').disabled = false;
            
            // Show an error message
            alert("Failed to load star map image. Check your internet connection.");
        };
        
        // Set the star map image source to the blob URL
        img.src = starMapUrl;
    })
    .catch(error => {
        console.error("Error fetching star map:", error);
        ctx.restore();
        
        // Draw a fallback star map (navy blue circle)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.fillStyle = "#000033"; // Navy blue
        ctx.fill();
        
        // Redraw the border
        if (borderWidth > 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.lineWidth = borderWidth;
            ctx.strokeStyle = borderColor;
            ctx.stroke();
        }
        
        // Enable the download button even if the image failed to load
        document.getElementById('download-star-map-btn').disabled = false;
        
        // Show an error message
        alert("Error fetching star map: " + error.message);
    });
}

/**
 * View the street map (Google Map) in a circle
 */
function viewStreetMap() {
    console.log("View Street Map button clicked");
    
    // First, check if we have valid coordinates
    if (!validateCoordinates()) {
        alert("Please enter valid coordinates or a location first.");
        return;
    }
    
    // CRITICAL: Reset canvas to prevent Canvas Layout domination
    const dimensions = resetCanvasToUserDimensions();
    
    // Store the current view type to handle zoom correctly
    window.currentViewType = 'street-map';
    
    // Get the canvas and context
    const canvas = document.getElementById('star-map-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a background
    const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Get the circle radius
    const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
    const radius = Math.min(canvas.width, canvas.height) * (radiusPercent / 100) / 2;
    
    // Calculate center position
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw the circle border first (in case the image fails to load)
    const borderWidth = parseInt(document.getElementById('border-width').value) || 1;
    const borderColor = document.getElementById('border-color').value || '#FDCA0D'; // Golden border for street map
    
    if (borderWidth > 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        ctx.stroke();
    }
    
    // Create a circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    // Get the latitude and longitude
    const latString = document.getElementById('latitude').value;
    const lngString = document.getElementById('longitude').value;
    
    // Parse the coordinates to decimal format
    let lat, lng;
    if (typeof parseFormattedCoordinate === 'function') {
        lat = parseFormattedCoordinate(latString, 'latitude');
        lng = parseFormattedCoordinate(lngString, 'longitude');
    } else if (typeof parseDMM === 'function') {
        lat = parseDMM(latString);
        lng = parseDMM(lngString);
    } else {
        // Simple fallback parsing if neither function is available
        const parseCoord = (str) => {
            if (!str) return null;
            // Try to extract decimal degrees from DMM format
            const match = str.match(/([NS])(\d+)°\s+(\d+\.\d+)′/i);
            if (match) {
                const direction = match[1].toUpperCase();
                const degrees = parseInt(match[2]);
                const minutes = parseFloat(match[3]);
                let decimal = degrees + (minutes / 60);
                if (direction === 'S') decimal = -decimal;
                return decimal;
            }
            // Try simple decimal parsing
            return parseFloat(str);
        };
        
        lat = parseCoord(latString);
        lng = parseCoord(lngString);
    }
    
    if (isNaN(lat) || isNaN(lng)) {
        console.error("Failed to parse coordinates:", latString, lngString);
        alert("Invalid coordinates format. Please check your input.");
        ctx.restore(); // Restore context before returning
        return;
    }
    
    console.log("Parsed coordinates:", lat, lng);
    
    // Create a Google Maps Static API URL
    // Note: This requires a valid API key to work
    // Google Maps Static API has a maximum size of 640x640 pixels
    const mapSize = Math.min(radius * 2, 640); // Limit to 640x640 max
    const zoom = 12; // Default zoom level
    const mapType = "roadmap"; // Options: roadmap, satellite, terrain, hybrid
    
    // Check if we have a Google Maps API key in the global scope
    const apiKey = "AIzaSyCpvv1IJYxwGVMh24MLFDH6LmupseApSZU"; // Use the API key from the HTML file
    
    if (!apiKey) {
        console.error("Google Maps API key not found");
        alert("Google Maps API key not found. Cannot load street map.");
        ctx.restore(); // Restore context before returning
        return;
    }
    
    // Create the Google Maps Static API URL
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${mapSize}x${mapSize}&maptype=${mapType}&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
    
    console.log("Loading Google Maps Static API image from:", mapUrl);
    
    // Create a temporary image to load the street map
    const img = new Image();
    // Remove crossOrigin to avoid CORS issues with Google Maps
    img.onload = function() {
        // Draw the street map image on our canvas, centered and scaled to fit the circle
        const aspectRatio = img.width / img.height;
        let drawWidth, drawHeight;
        
        if (aspectRatio > 1) {
            // Image is wider than tall
            drawHeight = radius * 2;
            drawWidth = drawHeight * aspectRatio;
        } else {
            // Image is taller than wide
            drawWidth = radius * 2;
            drawHeight = drawWidth / aspectRatio;
        }
        
        // Draw the image centered in the circle
        ctx.drawImage(
            img, 
            centerX - drawWidth / 2, 
            centerY - drawHeight / 2, 
            drawWidth, 
            drawHeight
        );
        
        // Restore the canvas context
        ctx.restore();
        
        // Add a marker in the center (optional, as the Google Maps image already has a marker)
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, Math.PI * 2, true);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        
        // Enable the download button
        document.getElementById('download-street-map-btn').disabled = false;
        
        console.log("Street map image loaded and drawn successfully");
    };
    
    // Set the image source to the Google Maps Static API URL
    img.src = mapUrl;
    
    // If the image fails to load, restore the context to avoid clipping issues
    img.onerror = function() {
        console.error("Failed to load street map image from Google Maps API");
        ctx.restore();
        
        // Draw a fallback street map (white circle with red marker)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.fillStyle = "#FFFFFF"; // White
        ctx.fill();
        
        // Add a marker in the center
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, Math.PI * 2, true);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        
        // Redraw the border
        if (borderWidth > 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.lineWidth = borderWidth;
            ctx.strokeStyle = borderColor;
            ctx.stroke();
        }
        
        // Enable the download button even if the image failed to load
        document.getElementById('download-street-map-btn').disabled = false;
        
        // Show an error message
        alert("Failed to load Google Maps image. Check your internet connection or API key.");
    };
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
