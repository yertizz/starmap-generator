/* START OF CODE - Cline - 2025-06-24 10:26 File: js/settings-preview-download-helpers.js */

/**
 * Settings + Preview + Download Section - HELPER FUNCTIONS
 * 
 * This script contains helper functions for canvas management, dimensions, and rendering.
 */

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
        
        // For landscape/portrait views, show the actual canvas dimensions (already flipped)
        if (viewType === 'landscape' || viewType === 'portrait') {
            displayWidth = width;  // Canvas width (already flipped)
            displayHeight = height; // Canvas height (already flipped)
            console.log(`🔄 ${viewType} view - showing canvas dimensions: ${displayWidth}w x ${displayHeight}h`);
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

/* END OF CODE - Cline - 2025-06-24 10:26 File: js/settings-preview-download-helpers.js */
