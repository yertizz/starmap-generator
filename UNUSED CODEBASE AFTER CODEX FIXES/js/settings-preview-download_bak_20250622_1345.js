/* START OF CODE - Cline - 2025-05-12 12:20 File: js/settings-preview-download.js */

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
 * View the star map (just the star map itself, not on canvas)
 */
function viewStarMap() {
    console.log("View Star Map button clicked");
    
    // First, check if we have valid coordinates
    if (!validateCoordinates()) {
        alert("Please enter valid coordinates or a location first.");
        return;
    }
    
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
    img.crossOrigin = "Anonymous";
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
 * INDEPENDENT VERSION WITH ACTUAL MAPS
 */
function viewStarStreetLandscape() {
    console.log("🌄 INDEPENDENT Combined Landscape view called");
    
    // First, check if we have valid coordinates
    if (!validateCoordinates()) {
        alert("Please enter valid coordinates or a location first.");
        return;
    }
    
    // Store the current view type
    window.currentViewType = 'star-street-landscape';
    
    // CRITICAL FIX: Call Canvas Layout first to initialize properly
    if (typeof viewStarMapOnCanvas === 'function') {
        viewStarMapOnCanvas();
    }
    
    // CRITICAL: Initialize canvas state independently (no Canvas Layout dependency)
    initializeCanvasForCombinedView();
    
    // Get the canvas
    const canvas = document.getElementById('star-map-canvas');
    if (!canvas) {
        console.error("Canvas not found");
        return;
    }
    
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
    
    // Draw title
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Star Map + Street Map Landscape View", canvas.width / 2, 50);
    
    // Get border settings
    const borderWidth = parseInt(document.getElementById('border-width').value) || 2;
    const borderColor = document.getElementById('border-color').value || "#FDCA0D";
    
    // Draw left circle (Street Map) border
    ctx.beginPath();
    ctx.arc(leftCenterX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    
    // Draw right circle (Star Map) border
    ctx.beginPath();
    ctx.arc(rightCenterX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    
    // Render street map in left circle
    renderStreetMapInCircle(ctx, leftCenterX, centerY, radius);
    
    // Render star map in right circle
    renderStarMapInCircle(ctx, rightCenterX, centerY, radius);
    
    // Enable the download button
    document.getElementById('download-star-street-landscape-btn').disabled = false;
    
    console.log("Independent landscape view with actual maps rendered");
}

/**
 * View star map and street map stacked in portrait orientation
 * INDEPENDENT VERSION WITH ACTUAL MAPS
 */
function viewStarStreetPortrait() {
    console.log("📱 INDEPENDENT Combined Portrait view called");
    
    // First, check if we have valid coordinates
    if (!validateCoordinates()) {
        alert("Please enter valid coordinates or a location first.");
        return;
    }
    
    // Store the current view type
    window.currentViewType = 'star-street-portrait';
    
    // CRITICAL FIX: Call Canvas Layout first to initialize properly
    if (typeof viewStarMapOnCanvas === 'function') {
        viewStarMapOnCanvas();
    }
    
    // CRITICAL: Initialize canvas state independently (no Canvas Layout dependency)
    initializeCanvasForCombinedView();
    
    // Get the canvas
    const canvas = document.getElementById('star-map-canvas');
    if (!canvas) {
        console.error("Canvas not found");
        return;
    }
    
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
    
    // Draw title
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Star Map + Street Map Portrait View", canvas.width / 2, 50);
    
    // Get border settings
    const borderWidth = parseInt(document.getElementById('border-width').value) || 2;
    const borderColor = document.getElementById('border-color').value || "#FDCA0D";
    
    // Draw top circle (Street Map) border
    ctx.beginPath();
    ctx.arc(centerX, topCenterY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    
    // Draw bottom circle (Star Map) border
    ctx.beginPath();
    ctx.arc(centerX, bottomCenterY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    
    // Render street map in top circle
    renderStreetMapInCircle(ctx, centerX, topCenterY, radius);
    
    // Render star map in bottom circle
    renderStarMapInCircle(ctx, centerX, bottomCenterY, radius);
    
    // Enable the download button
    document.getElementById('download-star-street-portrait-btn').disabled = false;
    
    console.log("Independent portrait view with actual maps rendered");
}

/**
 * Download the star map (equivalent to the existing DOWNLOAD MY STAR MAP button)
 */
function downloadStarMap() {
    console.log("Download Star Map button clicked");
    // Call the existing downloadStarMap function
    if (typeof downloadStarMapExisting === 'function') {
        downloadStarMapExisting();
    } else {
        // Fallback to a generic download function
        downloadCanvasImage('star-map');
    }
}

/**
 * Download the street map (Google Map) in a circle
 */
function downloadStreetMap() {
    console.log("Download Street Map button clicked");
    // First view the street map, then download it
    viewStreetMap();
    
    // Wait a bit for the map to render, then download
    setTimeout(function() {
        downloadCanvasImage('street-map');
    }, 1000);
}

/**
 * Download the star map with canvas layout (equivalent to the existing functionality)
 */
function downloadStarMapWithCanvas() {
    console.log("Download Star Map with Canvas Layout button clicked");
    
    // First make sure the canvas has the correct background color
    const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
    console.log("Using background color for download:", bgColor);
    
    // Set the background color on the canvas directly
    const canvas = document.getElementById('star-map-canvas');
    if (canvas) {
        // Store the background color in a data attribute for reference
        canvas.dataset.bgColor = bgColor;
        
        // Apply the background color directly to the canvas
        canvas.style.backgroundColor = bgColor;
    }
    
    // Call the existing function that handles this
    if (typeof downloadStarMapWithCanvasExisting === 'function') {
        downloadStarMapWithCanvasExisting();
    } else {
        // Fallback to a generic download function
        downloadCanvasImage('star-map-canvas');
    }
}

/**
 * Download star map and street map side by side in landscape orientation
 */
function downloadStarStreetLandscape() {
    console.log("Download Star Map + Street Map Landscape button clicked");
    // First view the landscape layout, then download it
    viewStarStreetLandscape();
    
    // Wait a bit for the maps to render, then download
    setTimeout(function() {
        downloadCanvasImage('star-street-landscape');
    }, 1000);
}

/**
 * Download star map and street map stacked in portrait orientation
 */
function downloadStarStreetPortrait() {
    console.log("Download Star Map + Street Map Portrait button clicked");
    // First view the portrait layout, then download it
    viewStarStreetPortrait();
    
    // Wait a bit for the maps to render, then download
    setTimeout(function() {
        downloadCanvasImage('star-street-portrait');
    }, 1000);
}

/**
 * Generic function to download the canvas as an image
 * @param {string} prefix - Prefix for the filename
 */
function downloadCanvasImage(prefix) {
    const canvas = document.getElementById('star-map-canvas');
    
    // Get the selected image format
    const formatRadios = document.getElementsByName('image-format');
    let format = 'png';
    for (const radio of formatRadios) {
        if (radio.checked) {
            format = radio.value;
            break;
        }
    }
    
    // Generate a filename
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
    const filename = `${prefix}-${date}.${format}`;
    
    // Create a download link
    const link = document.createElement('a');
    
    if (format === 'svg') {
        // Handle SVG download if implemented
        if (typeof canvasToSVG === 'function') {
            const svgData = canvasToSVG(canvas);
            const blob = new Blob([svgData], { type: 'image/svg+xml' });
            link.href = URL.createObjectURL(blob);
        } else {
            alert("SVG download not implemented yet. Defaulting to PNG.");
            link.href = canvas.toDataURL('image/png');
        }
    } else if (format === 'jpg') {
        // JPG download
        link.href = canvas.toDataURL('image/jpeg', 0.9);
    } else {
        // PNG download
        const transparency = document.getElementById('png-transparency').checked;
        if (transparency) {
            link.href = canvas.toDataURL('image/png');
        } else {
            // Create a new canvas with white background
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.fillStyle = '#FFFFFF';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(canvas, 0, 0);
            link.href = tempCanvas.toDataURL('image/png');
        }
    }
    
    link.download = filename;
    link.click();
}

/**
 * Initialize canvas state for combined views - REMOVES CANVAS LAYOUT DEPENDENCY
 * This function provides the essential initialization that Canvas Layout normally provides
 */
function initializeCanvasForCombinedView() {
    console.log("🔧 Initializing canvas state for combined view (independent)");
    
    try {
        // Get the canvas
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) {
            console.error("Canvas not found during initialization");
            return false;
        }
        
        // Initialize canvas dimensions if not already set
        if (!canvas.width || !canvas.height) {
            // Get user dimensions or use defaults
            const widthInput = document.getElementById('width') || document.getElementById('output-width');
            const heightInput = document.getElementById('height') || document.getElementById('output-height');
            
            let width = 2550, height = 3300; // Default dimensions
            if (widthInput && heightInput && widthInput.value && heightInput.value) {
                width = parseInt(widthInput.value);
                height = parseInt(heightInput.value);
            }
            
            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;
            
            console.log(`✅ Canvas initialized with dimensions: ${width}w x ${height}h`);
        }
        
        // Initialize essential canvas state that generateStarMap() normally provides
        const ctx = canvas.getContext('2d');
        
        // Set default canvas properties
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Initialize any global variables that might be needed
        if (typeof window.currentViewType === 'undefined') {
            window.currentViewType = 'combined';
        }
        
        // Initialize combinedViewSettings if it doesn't exist
        if (typeof window.combinedViewSettings === 'undefined') {
            window.combinedViewSettings = {
                overlapPercent: 5,
                streetMapFirst: true
            };
        }
        
        // Ensure circle overlap slider is set to 5% default
        const overlapSlider = document.getElementById('circle-overlap-percent');
        if (overlapSlider && overlapSlider.value === '30') {
            overlapSlider.value = '5';
            
            // Update the display value
            const overlapValue = document.getElementById('overlap-value');
            if (overlapValue) {
                overlapValue.textContent = '5%';
            }
            
            // Update the combinedViewSettings object
            window.combinedViewSettings.overlapPercent = 5;
        }
        
        console.log("✅ Canvas state initialized successfully for combined view");
        return true;
        
    } catch (error) {
        console.error("❌ Error initializing canvas state:", error);
        return false;
    }
}

/**
 * Render street map in a specific circle on the canvas
 */
function renderStreetMapInCircle(ctx, centerX, centerY, radius) {
    console.log(`🗺️ Rendering street map in circle at (${centerX}, ${centerY}) with radius ${radius}`);
    
    // Get coordinates
    const latString = document.getElementById('latitude').value;
    const lngString = document.getElementById('longitude').value;
    
    // Parse coordinates
    let lat, lng;
    if (typeof parseFormattedCoordinate === 'function') {
        lat = parseFormattedCoordinate(latString, 'latitude');
        lng = parseFormattedCoordinate(lngString, 'longitude');
    } else if (typeof parseDMM === 'function') {
        lat = parseDMM(latString);
        lng = parseDMM(lngString);
    } else {
        // Simple fallback parsing
        const parseCoord = (str) => {
            if (!str) return null;
            const match = str.match(/([NS])(\d+)°\s+(\d+\.\d+)′/i);
            if (match) {
                const direction = match[1].toUpperCase();
                const degrees = parseInt(match[2]);
                const minutes = parseFloat(match[3]);
                let decimal = degrees + (minutes / 60);
                if (direction === 'S') decimal = -decimal;
                return decimal;
            }
            return parseFloat(str);
        };
        lat = parseCoord(latString);
        lng = parseCoord(lngString);
    }
    
    if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinates for street map");
        // Draw fallback
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
        ctx.restore();
        return;
    }
    
    // Create Google Maps URL
    const mapSize = Math.min(radius * 2, 640);
    const zoom = 12;
    const mapType = "roadmap";
    const apiKey = "AIzaSyCpvv1IJYxwGVMh24MLFDH6LmupseApSZU";
    
    if (!apiKey) {
        console.error("Google Maps API key not found");
        return;
    }
    
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${mapSize}x${mapSize}&maptype=${mapType}&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
    
    // Load and draw the street map
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        
        const aspectRatio = img.width / img.height;
        let drawWidth, drawHeight;
        if (aspectRatio > 1) {
            drawHeight = radius * 2;
            drawWidth = drawHeight * aspectRatio;
        } else {
            drawWidth = radius * 2;
            drawHeight = drawWidth / aspectRatio;
        }
        
        ctx.drawImage(img, centerX - drawWidth / 2, centerY - drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();
        
        // Add center marker
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2, true);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        
        console.log("✅ Street map rendered successfully");
    };
    
    img.onerror = function() {
        console.error("Failed to load street map");
        // Draw fallback
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
        ctx.restore();
        
        // Add center marker
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2, true);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
    };
    
    img.src = mapUrl;
}

/**
 * Render star map in a specific circle on the canvas
 */
function renderStarMapInCircle(ctx, centerX, centerY, radius) {
    console.log(`⭐ Rendering star map in circle at (${centerX}, ${centerY}) with radius ${radius}`);
    
    // IMMEDIATE fallback to ensure something shows up
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = "#000033";
    ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    ctx.restore();
    
    // Add temporary text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Star Map", centerX, centerY);
    ctx.fillText("Loading...", centerX, centerY + 20);
    
    // Get coordinates
    const latString = document.getElementById('latitude').value;
    const lngString = document.getElementById('longitude').value;
    
    // Parse coordinates
    let lat, lng;
    if (typeof parseFormattedCoordinate === 'function') {
        lat = parseFormattedCoordinate(latString, 'latitude');
        lng = parseFormattedCoordinate(lngString, 'longitude');
    } else if (typeof parseDMM === 'function') {
        lat = parseDMM(latString);
        lng = parseDMM(lngString);
    } else {
        // Simple fallback parsing
        const parseCoord = (str) => {
            if (!str) return null;
            const match = str.match(/([NS])(\d+)°\s+(\d+\.\d+)′/i);
            if (match) {
                const direction = match[1].toUpperCase();
                const degrees = parseInt(match[2]);
                const minutes = parseFloat(match[3]);
                let decimal = degrees + (minutes / 60);
                if (direction === 'S') decimal = -decimal;
                return decimal;
            }
            return parseFloat(str);
        };
        lat = parseCoord(latString);
        lng = parseCoord(lngString);
    }
    
    if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinates for star map");
        return;
    }
    
    // Get date and style
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
    const starMapStyle = document.getElementById('star-map-style').value || 'default';
    
    // Calculate LST
    let lstHours = 0;
    if (typeof calculateLST === 'function') {
        lstHours = calculateLST(date, lng);
        if (isNaN(lstHours)) lstHours = 0;
    }
    
    // Prepare API request
    const API_IMAGE_SIZE = 800; // Smaller for combined view
    const requestBody = {
        style: starMapStyle,
        output: { width: API_IMAGE_SIZE, height: API_IMAGE_SIZE, format: "png" },
        observer: { latitude: lat, longitude: lng, date: date },
        view: {
            type: "area",
            parameters: {
                position: { equatorial: { rightAscension: lstHours, declination: lat } },
                backgroundColor: "#000033"
            }
        }
    };
    
    // Fetch star map with timeout
    const fetchTimeout = setTimeout(() => {
        console.warn("Star map fetch timeout - keeping fallback");
    }, 10000);
    
    fetch('proxy/star_map_proxy.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'image/png' },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        clearTimeout(fetchTimeout);
        if (!response.ok) throw new Error(`Proxy error: ${response.status}`);
        return response.blob();
    })
    .then(blob => {
        const starMapUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.crossOrigin = "Anonymous";
        
        img.onload = function() {
            // FORCE redraw the star map at the exact position
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            
            // Clear the area first
            ctx.fillStyle = "#000033";
            ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
            
            const aspectRatio = img.width / img.height;
            let drawWidth, drawHeight;
            if (aspectRatio > 1) {
                drawHeight = radius * 2;
                drawWidth = drawHeight * aspectRatio;
            } else {
                drawWidth = radius * 2;
                drawHeight = drawWidth / aspectRatio;
            }
            
            ctx.drawImage(img, centerX - drawWidth / 2, centerY - drawHeight / 2, drawWidth, drawHeight);
            ctx.restore();
            
            URL.revokeObjectURL(starMapUrl);
            console.log(`✅ Star map rendered successfully at (${centerX}, ${centerY})`);
        };
        
        img.onerror = function() {
            console.error("Failed to load star map image");
            URL.revokeObjectURL(starMapUrl);
        };
        
        img.src = starMapUrl;
    })
    .catch(error => {
        clearTimeout(fetchTimeout);
        console.error("Error fetching star map:", error);
    });
}

/**
 * Validate that we have coordinates to work with
 * @returns {boolean} True if coordinates are valid
 */
function validateCoordinates() {
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    
    return latitude && longitude;
}

// Check if html2canvas is available, if not, load it
if (typeof html2canvas === 'undefined') {
    console.log("Loading html2canvas library");
    const script = document.createElement('script');
    script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
    script.async = true;
    document.head.appendChild(script);
}

// Zoom functionality removed as requested

/* END OF CODE - Cline - 2025-06-20 12:39 File: js/settings-preview-download.js */
