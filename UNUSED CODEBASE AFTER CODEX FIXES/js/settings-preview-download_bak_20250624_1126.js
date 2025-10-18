/* START OF CODE - Cline - 2025-06-24 10:27 File: js/settings-preview-download.js */

/**
 * Settings + Preview + Download Section - MAIN INITIALIZATION
 * 
 * This script handles initialization and the remaining view functions.
 * Core functions are split into separate files to prevent truncation.
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
    document.getElementById('loadSettingsBtn').addEventListener('click', function() {
        console.log("Load Settings button clicked");
        if (typeof loadSavedSettings === 'function') {
            loadSavedSettings();
        } else {
            console.error("loadSavedSettings function not found");
        }
    });
    
    document.getElementById('saveSettingsBtn').addEventListener('click', function() {
        console.log("Save Settings button clicked");
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
    
    if (!validateCoordinates()) {
        alert("Please enter valid coordinates or a location first.");
        return;
    }
    
    // CRITICAL: Reset canvas to prevent Canvas Layout domination
    const dimensions = resetCanvasToUserDimensions();
    
    alert("Computing star map. This may take a while depending on your internet connection.");
    
    window.currentViewType = 'star-map';
    
    const canvas = document.getElementById('star-map-canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
    const radius = Math.min(canvas.width, canvas.height) * (radiusPercent / 100) / 2;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
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
    
    // Create a circular clipping path and fetch star map
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    // Get coordinates and fetch star map (simplified version)
    const latString = document.getElementById('latitude').value;
    const lngString = document.getElementById('longitude').value;
    
    let lat, lng;
    if (typeof parseFormattedCoordinate === 'function') {
        lat = parseFormattedCoordinate(latString, 'latitude');
        lng = parseFormattedCoordinate(lngString, 'longitude');
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
        console.error("Failed to parse coordinates:", latString, lngString);
        alert("Invalid coordinates format. Please check your input.");
        ctx.restore();
        return;
    }
    
    // Fetch and render star map (simplified)
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
    const starMapStyle = document.getElementById('star-map-style').value || 'default';
    
    let lstHours = 0;
    if (typeof calculateLST === 'function') {
        lstHours = calculateLST(date, lng);
        if (isNaN(lstHours)) lstHours = 0;
    }
    
    const requestBody = {
        style: starMapStyle,
        output: { width: 1000, height: 1000, format: "png" },
        observer: { latitude: lat, longitude: lng, date: date },
        view: {
            type: "area",
            parameters: {
                position: { equatorial: { rightAscension: lstHours, declination: lat } },
                backgroundColor: "#000033"
            }
        }
    };
    
    fetch('proxy/star_map_proxy.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'image/png' },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) throw new Error(`Proxy error: ${response.status}`);
        return response.blob();
    })
    .then(blob => {
        const starMapUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.crossOrigin = "Anonymous";
        
        img.onload = function() {
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
            
            document.getElementById('download-star-map-btn').disabled = false;
            console.log("Star map image loaded and drawn successfully");
            URL.revokeObjectURL(starMapUrl);
        };
        
        img.onerror = function() {
            console.error("Failed to load star map image");
            ctx.restore();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
            ctx.fillStyle = "#000033";
            ctx.fill();
            document.getElementById('download-star-map-btn').disabled = false;
            alert("Failed to load star map image. Check your internet connection.");
        };
        
        img.src = starMapUrl;
    })
    .catch(error => {
        console.error("Error fetching star map:", error);
        ctx.restore();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.fillStyle = "#000033";
        ctx.fill();
        document.getElementById('download-star-map-btn').disabled = false;
        alert("Error fetching star map: " + error.message);
    });
}

/**
 * View the street map (Google Map) in a circle
 */
function viewStreetMap() {
    console.log("View Street Map button clicked");
    
    if (!validateCoordinates()) {
        alert("Please enter valid coordinates or a location first.");
        return;
    }
    
    // CRITICAL: Reset canvas to prevent Canvas Layout domination
    const dimensions = resetCanvasToUserDimensions();
    
    window.currentViewType = 'street-map';
    
    const canvas = document.getElementById('star-map-canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
    const radius = Math.min(canvas.width, canvas.height) * (radiusPercent / 100) / 2;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const borderWidth = parseInt(document.getElementById('border-width').value) || 1;
    const borderColor = document.getElementById('border-color').value || '#FDCA0D';
    
    if (borderWidth > 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        ctx.stroke();
    }
    
    // Create circular clipping and render street map (simplified)
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    // Get coordinates and create Google Maps URL
    const latString = document.getElementById('latitude').value;
    const lngString = document.getElementById('longitude').value;
    
    let lat, lng;
    if (typeof parseFormattedCoordinate === 'function') {
        lat = parseFormattedCoordinate(latString, 'latitude');
        lng = parseFormattedCoordinate(lngString, 'longitude');
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
        console.error("Failed to parse coordinates:", latString, lngString);
        alert("Invalid coordinates format. Please check your input.");
        ctx.restore();
        return;
    }
    
    const mapSize = Math.min(radius * 2, 640);
    const apiKey = "AIzaSyCpvv1IJYxwGVMh24MLFDH6LmupseApSZU";
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=${mapSize}x${mapSize}&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
    
    const img = new Image();
    img.onload = function() {
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
        ctx.arc(centerX, centerY, 5, 0, Math.PI * 2, true);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        
        document.getElementById('download-street-map-btn').disabled = false;
        console.log("Street map image loaded and drawn successfully");
    };
    
    img.onerror = function() {
        console.error("Failed to load street map");
        ctx.restore();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        document.getElementById('download-street-map-btn').disabled = false;
        alert("Failed to load Google Maps image. Check your internet connection or API key.");
    };
    
    img.src = mapUrl;
}

/**
 * Download functions (simplified)
 */
function downloadStarMap() {
    console.log("Download Star Map button clicked");
    downloadCanvasImage('star-map');
}

function downloadStreetMap() {
    console.log("Download Street Map button clicked");
    downloadCanvasImage('street-map');
}

function downloadStarMapWithCanvas() {
    console.log("Download Star Map with Canvas Layout button clicked");
    downloadCanvasImage('star-map-canvas');
}

function downloadStarStreetLandscape() {
    console.log("Download Star Map + Street Map Landscape button clicked");
    downloadCanvasImage('star-street-landscape');
}

function downloadStarStreetPortrait() {
    console.log("Download Star Map + Street Map Portrait button clicked");
    downloadCanvasImage('star-street-portrait');
}

/**
 * Generic function to download the canvas as an image
 */
function downloadCanvasImage(prefix) {
    const canvas = document.getElementById('star-map-canvas');
    
    const formatRadios = document.getElementsByName('image-format');
    let format = 'png';
    for (const radio of formatRadios) {
        if (radio.checked) {
            format = radio.value;
            break;
        }
    }
    
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
    const filename = `${prefix}-${date}.${format}`;
    
    const link = document.createElement('a');
    
    if (format === 'jpg') {
        link.href = canvas.toDataURL('image/jpeg', 0.9);
    } else {
        const transparency = document.getElementById('png-transparency').checked;
        if (transparency) {
            link.href = canvas.toDataURL('image/png');
        } else {
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

/* END OF CODE - Cline - 2025-06-24 10:27 File: js/settings-preview-download.js */
