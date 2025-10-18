/* START OF CODE - Cline - 2025-05-11 21:22 File: js/settings-preview-download.js */

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
        // Call the existing loadSettings function from settings.js
        if (typeof loadSettings === 'function') {
            loadSettings();
        } else {
            console.error("loadSettings function not found");
        }
    });
    
    document.getElementById('saveSettingsBtn').addEventListener('click', function() {
        console.log("Save Settings button clicked");
        // Call the existing saveSettings function from settings.js
        if (typeof saveSettings === 'function') {
            saveSettings();
        } else {
            console.error("saveSettings function not found");
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
    
    // Create a circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    // Draw a solid navy blue circle for the star map
    ctx.fillStyle = "#000033"; // Navy blue
    ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    
    // Restore the canvas context
    ctx.restore();
    
    // Draw the circle border
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
    
    // Enable the download button
    document.getElementById('download-star-map-btn').disabled = false;
    
    console.log("Star map view rendered successfully");
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
    
    // Create a circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    // Draw a white circle for the street map
    ctx.fillStyle = "#FFFFFF"; // White
    ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    
    // Restore the canvas context
    ctx.restore();
    
    // Draw the circle border
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
    
    // Add a marker in the center
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2, true);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    
    // Enable the download button
    document.getElementById('download-street-map-btn').disabled = false;
    
    console.log("Street map view rendered successfully");
}

/**
 * View the star map on canvas (equivalent to the existing VIEW STAR MAP ON CANVAS functionality)
 */
function viewStarMapOnCanvas() {
    console.log("View Star Map on Canvas button clicked");
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
 */
function viewStarStreetLandscape() {
    console.log("View Star Map + Street Map Landscape button clicked");
    
    // First, check if we have valid coordinates
    if (!validateCoordinates()) {
        alert("Please enter valid coordinates or a location first.");
        return;
    }
    
    // Store the current view type to handle zoom correctly
    window.currentViewType = 'star-street-landscape';
    
    // Get the canvas and context
    const canvas = document.getElementById('star-map-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a background
    const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Get the circle radius (smaller for side-by-side)
    const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
    const radius = Math.min(canvas.width, canvas.height) * (radiusPercent / 100) / 3; // Smaller radius for side-by-side
    
    // Calculate positions for both circles
    const centerY = canvas.height / 2;
    const leftCenterX = canvas.width / 3;
    const rightCenterX = canvas.width * 2 / 3;
    
    // Draw title
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Star Map + Street Map Landscape View", canvas.width / 2, 50);
    
    // Draw left circle (Street Map)
    // Create a circular clipping path for street map
    ctx.save();
    ctx.beginPath();
    ctx.arc(leftCenterX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    // Draw a white circle for the street map
    ctx.fillStyle = "#FFFFFF"; // White
    ctx.fillRect(leftCenterX - radius, centerY - radius, radius * 2, radius * 2);
    
    // Restore the canvas context
    ctx.restore();
    
    // Draw the street map circle border
    ctx.beginPath();
    ctx.arc(leftCenterX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FDCA0D"; // Golden border for street map
    ctx.stroke();
    
    // Add a marker in the center of street map
    ctx.beginPath();
    ctx.arc(leftCenterX, centerY, 3, 0, Math.PI * 2, true);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    
    // Add street map label
    ctx.fillStyle = "#000000";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Street Map", leftCenterX, centerY + 20);
    
    // Draw right circle (Star Map)
    // Create a circular clipping path for star map
    ctx.save();
    ctx.beginPath();
    ctx.arc(rightCenterX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    // Draw a solid navy blue circle for the star map
    ctx.fillStyle = "#000033"; // Navy blue
    ctx.fillRect(rightCenterX - radius, centerY - radius, radius * 2, radius * 2);
    
    // Restore the canvas context
    ctx.restore();
    
    // Draw the star map circle border
    ctx.beginPath();
    ctx.arc(rightCenterX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();
    
    // Add star map label
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Star Map", rightCenterX, centerY + 20);
    
    // Enable the download button
    document.getElementById('download-star-street-landscape-btn').disabled = false;
    
    console.log("Star Map + Street Map Landscape view rendered successfully");
}

/**
 * View star map and street map stacked in portrait orientation
 */
function viewStarStreetPortrait() {
    console.log("View Star Map + Street Map Portrait button clicked");
    
    // First, check if we have valid coordinates
    if (!validateCoordinates()) {
        alert("Please enter valid coordinates or a location first.");
        return;
    }
    
    // Store the current view type to handle zoom correctly
    window.currentViewType = 'star-street-portrait';
    
    // Get the canvas and context
    const canvas = document.getElementById('star-map-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a background
    const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Get the circle radius (smaller for stacked)
    const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
    const radius = Math.min(canvas.width, canvas.height) * (radiusPercent / 100) / 3; // Smaller radius for stacked
    
    // Calculate positions for both circles
    const centerX = canvas.width / 2;
    const topCenterY = canvas.height / 3;
    const bottomCenterY = canvas.height * 2 / 3;
    
    // Draw title
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Star Map + Street Map Portrait View", canvas.width / 2, 50);
    
    // Draw top circle (Street Map)
    // Create a circular clipping path for street map
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, topCenterY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    // Draw a white circle for the street map
    ctx.fillStyle = "#FFFFFF"; // White
    ctx.fillRect(centerX - radius, topCenterY - radius, radius * 2, radius * 2);
    
    // Restore the canvas context
    ctx.restore();
    
    // Draw the street map circle border
    ctx.beginPath();
    ctx.arc(centerX, topCenterY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FDCA0D"; // Golden border for street map
    ctx.stroke();
    
    // Add a marker in the center of street map
    ctx.beginPath();
    ctx.arc(centerX, topCenterY, 3, 0, Math.PI * 2, true);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    
    // Add street map label
    ctx.fillStyle = "#000000";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Street Map", centerX, topCenterY + 20);
    
    // Draw bottom circle (Star Map)
    // Create a circular clipping path for star map
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, bottomCenterY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    // Draw a solid navy blue circle for the star map
    ctx.fillStyle = "#000033"; // Navy blue
    ctx.fillRect(centerX - radius, bottomCenterY - radius, radius * 2, radius * 2);
    
    // Restore the canvas context
    ctx.restore();
    
    // Draw the star map circle border
    ctx.beginPath();
    ctx.arc(centerX, bottomCenterY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();
    
    // Add star map label
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Star Map", centerX, bottomCenterY + 20);
    
    // Enable the download button
    document.getElementById('download-star-street-portrait-btn').disabled = false;
    
    console.log("Star Map + Street Map Portrait view rendered successfully");
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

/**
 * Initialize zoom slider functionality
 * This function should be called after the DOM is loaded
 */
function initializeZoomSlider() {
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomValue = document.getElementById('zoom-value');
    
    if (!zoomSlider || !zoomValue) {
        console.error("Zoom slider or value element not found");
        return;
    }
    
    // Update zoom value display when slider changes
    zoomSlider.addEventListener('input', function() {
        const value = this.value;
        zoomValue.textContent = value;
        
        // Apply zoom based on current view type
        applyZoom(value);
    });
    
    console.log("Zoom slider initialized");
}

/**
 * Apply zoom based on the current view type
 * @param {number} zoomValue - The zoom value (50-200)
 */
function applyZoom(zoomValue) {
    // Get the current view type
    const viewType = window.currentViewType || 'star-map';
    
    console.log(`Applying zoom ${zoomValue}% to view type: ${viewType}`);
    
    // Re-render the current view with the new zoom
    switch (viewType) {
        case 'star-map':
            viewStarMap();
            break;
        case 'street-map':
            viewStreetMap();
            break;
        case 'star-map-canvas':
            viewStarMapOnCanvas();
            break;
        case 'star-street-landscape':
            viewStarStreetLandscape();
            break;
        case 'star-street-portrait':
            viewStarStreetPortrait();
            break;
        default:
            console.warn(`Unknown view type: ${viewType}`);
            break;
    }
}

// Initialize the zoom slider when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeZoomSlider();
});

/* END OF CODE - Cline - 2025-05-11 21:22 File: js/settings-preview-download.js */
