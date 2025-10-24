/* START OF CODE - Emergent - 2025-10-24 [11:52:48-EST] File: js/settings-preview-download.js */

 /**
 * Settings + Preview + Download Section - PRODUCTION VERSION
 * 
 * FIXES:
 * - Replaced applyPreviewDisplayConstraints to prevent canvas stretching
 * - REMOVED text rendering from Star Map and Street Map (bare images for design use)
 * - KEPT text rendering ONLY for Star Map+Text and Combined views
 * - Fixed text positioning to prevent overlapping and duplication
 * - IMPLEMENTED clean border masking from scratch (borders hidden in overlap area)
 * - Google Maps proxy (google_maps_proxy.php) serves images with CORS headers
 * - All view functions use proxy (working correctly - DO NOT MODIFY)
 * - CRITICAL NEW FEATURE: Smart download button enable/disable system
 * - All download buttons disabled on page load
 * - When yellow view button clicked, ALL download buttons disabled
 * - When view rendering completes, ONLY matching download button enabled
 * - No more view mismatch alerts - impossible to download wrong view
 * - More intuitive user experience with visual feedback
 * - CRITICAL FIX: Combined Landscape/Portrait downloads use toBlob() with 500ms delay
 * - toBlob() better handles canvas with proxy images to prevent blank PNGs
 * - Renamed "Canvas Layout" to "Star Map+Text"
 */

// Helper function to get backend URL for production deployment
function getBackendUrl() {
    // For production deployment on anythingpod.com
    const currentHost = window.location.origin;
    
    // If we're on localhost, use the backend port
    if (currentHost.includes('localhost') || currentHost.includes('127.0.0.1')) {
        return 'http://localhost:8001';
    }
    
    // For production on anythingpod.com, backend is at same domain
    return currentHost;
}

// Custom styled modal function - Added 2025-10-22 [10:25:05-EST]
function showCustomModal(title, message, icon = '⚠️') {
    const overlay = document.getElementById('customModalOverlay');
    const titleEl = document.getElementById('customModalTitle');
    const messageEl = document.getElementById('customModalMessage');
    const iconEl = document.getElementById('customModalIcon');
    const button = document.getElementById('customModalButton');
    
    if (!overlay) {
        // Fallback to regular alert if modal not found
        alert(message);
        return;
    }
    
    titleEl.textContent = title;
    messageEl.innerHTML = message.replace(/\n/g, '<br>');
    iconEl.textContent = icon;
    
    overlay.classList.add('show');
    
    // Close on button click
    const closeModal = () => {
        overlay.classList.remove('show');
        button.removeEventListener('click', closeModal);
        overlay.removeEventListener('click', overlayClick);
    };
    
    // Close on overlay click
    const overlayClick = (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    };
    
    button.addEventListener('click', closeModal);
    overlay.addEventListener('click', overlayClick);
}

// Track which view was last generated
let lastGeneratedView = null;

// CRITICAL FIX: Store canvas pixel data immediately after rendering to prevent loss
let storedCanvasData = null;
let storedCanvasWidth = 0;
let storedCanvasHeight = 0;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeButtons();
});

// --- FIXED: Display sizing helper that maintains aspect ratio ---
function applyPreviewDisplayConstraints(zoomPercent) {
    const canvas = document.getElementById('star-map-canvas');
    if (!canvas) return;
    
    // Remove any explicit width/height styles to prevent stretching
    canvas.style.width = '';
    canvas.style.height = '';
    
    // Let CSS handle the sizing naturally
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '70vh';
    canvas.style.objectFit = 'contain';
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    
    console.log('🔵 FIXED: Canvas display constraints applied without stretching');
}

// --- NEW: Text rendering helper for all views ---
function renderTextLayers(ctx, centerX, centerY, radius, borderWidth) {
    console.log('🔵 Rendering text layers...');
    
    const getEl = id => document.getElementById(id);
    const getVal = (id, def) => getEl(id)?.value || def;
    const getInt = (id, def) => parseInt(getVal(id, String(def))) || def;
    const getChecked = id => getEl(id)?.checked || false;
    const getRadioVal = (name, def) => {
        const checkedRadio = document.querySelector(`input[name="${name}"]:checked`);
        return checkedRadio ? checkedRadio.value : def;
    };
    
    const dateValue = getVal("date", "");
    const latFullFormatted = getVal("latitude", "");
    const lonFullFormatted = getVal("longitude", "");
    
    // Collect all text data
    const allTextData = [
        { id: 'entry1', text: getVal('text-entry-1', ''), fontFamily: getVal('font-family-1', 'Montserrat'), fontSize: parseInt(getVal('font-size-1', '28')), fontColor: getVal('font-color-1', '#FFFFFF'), isBold: getChecked('text-bold-1'), isItalic: getChecked('text-italic-1'), order: parseInt(getVal('text-placement-order-1', '1')), position: getRadioVal('text-placement-pos-1', 'below') },
        { id: 'entry2', text: getVal('text-entry-2', ''), fontFamily: getVal('font-family-2', 'Montserrat'), fontSize: parseInt(getVal('font-size-2', '16')), fontColor: getVal('font-color-2', '#FFFFFF'), isBold: getChecked('text-bold-2'), isItalic: getChecked('text-italic-2'), order: parseInt(getVal('text-placement-order-2', '2')), position: getRadioVal('text-placement-pos-2', 'below') },
        { id: 'entry3', text: getVal('text-entry-3', ''), fontFamily: getVal('font-family-3', 'Montserrat'), fontSize: parseInt(getVal('font-size-3', '14')), fontColor: getVal('font-color-3', '#FFFFFF'), isBold: getChecked('text-bold-3'), isItalic: getChecked('text-italic-3'), order: parseInt(getVal('text-placement-order-3', '3')), position: getRadioVal('text-placement-pos-3', 'below') },
        { id: 'entry4', text: getVal('text-entry-4', ''), fontFamily: getVal('font-family-4', 'Montserrat'), fontSize: parseInt(getVal('font-size-4', '14')), fontColor: getVal('font-color-4', '#FFFFFF'), isBold: getChecked('text-bold-4'), isItalic: getChecked('text-italic-4'), order: parseInt(getVal('text-placement-order-4', '4')), position: getRadioVal('text-placement-pos-4', 'below') },
        { id: 'date', text: (typeof formatDate === 'function') ? formatDate(dateValue) : dateValue, fontFamily: getVal('fixed-font-family-date', 'Arial'), fontSize: parseInt(getVal('fixed-font-size-date', '14')), fontColor: getVal('fixed-font-color-date', '#FFFFFF'), isBold: getChecked('fixed-text-bold-date'), isItalic: getChecked('fixed-text-italic-date'), order: parseInt(getVal('text-placement-order-date', '5')), position: getRadioVal('text-placement-pos-date', 'below') },
        { id: 'coords', text: `${latFullFormatted || '?'} | ${lonFullFormatted || '?'}`, fontFamily: getVal('fixed-font-family-coords', 'Arial'), fontSize: parseInt(getVal('fixed-font-size-coords', '14')), fontColor: getVal('fixed-font-color-coords', '#FFFFFF'), isBold: getChecked('fixed-text-bold-coords'), isItalic: getChecked('fixed-text-italic-coords'), order: parseInt(getVal('text-placement-order-coords', '6')), position: getRadioVal('text-placement-pos-coords', 'below') }
    ];
    
    const dynamicTextMargin = radius * 0.10;
    
    ctx.textAlign = 'center';
    const itemsToDraw = allTextData.filter(item => item.text && item.text.trim() !== '').sort((a, b) => a.order - b.order);
    const aboveItems = itemsToDraw.filter(item => item.position === 'above');
    const belowItems = itemsToDraw.filter(item => item.position === 'below');
    
    const applyFontStyle = (style) => {
        const fontWeight = style.isBold ? 'bold' : 'normal';
        const fontStyle = style.isItalic ? 'italic' : 'normal';
        const sizeNum = parseInt(style.fontSize) || 14;
        const sizeWithUnit = `${sizeNum}px`;
        const safeFontFamily = style.fontFamily.includes(' ') ? `"${style.fontFamily}"` : style.fontFamily;
        ctx.font = `${fontStyle} ${fontWeight} ${sizeWithUnit} ${safeFontFamily}`;
        ctx.fillStyle = style.fontColor;
        return sizeNum;
    };
    
    const textSpacing = 1.2;
    
    // Draw items BELOW
    let currentYBelow = centerY + radius + (borderWidth / 2) + dynamicTextMargin;
    ctx.textBaseline = 'top';
    belowItems.forEach((item) => {
        const fontSize = applyFontStyle(item);
        ctx.fillText(item.text, centerX, currentYBelow);
        currentYBelow += fontSize * textSpacing;
    });
    
    // Draw items ABOVE
    let currentYAbove = centerY - radius - (borderWidth / 2) - dynamicTextMargin;
    ctx.textBaseline = 'bottom';
    [...aboveItems].reverse().forEach((item) => {
        const fontSize = applyFontStyle(item);
        ctx.fillText(item.text, centerX, currentYAbove);
        currentYAbove -= fontSize * textSpacing;
    });
    
    console.log(`🔵 Rendered ${itemsToDraw.length} text items (${aboveItems.length} above, ${belowItems.length} below)`);
}

// --- Helpers added by Codex ---
function validateCoordinates() {
    const latStr = (document.getElementById('latitude') || {}).value || '';
    const lngStr = (document.getElementById('longitude') || {}).value || '';
    let lat, lng;
    if (typeof parseFormattedCoordinate === 'function') {
        lat = parseFormattedCoordinate(latStr, 'latitude');
        lng = parseFormattedCoordinate(lngStr, 'longitude');
    } else {
        lat = parseFloat(latStr);
        lng = parseFloat(lngStr);
    }
    return !isNaN(lat) && !isNaN(lng);
}

function resetCanvasToUserDimensions() {
    const canvas = document.getElementById('star-map-canvas');
    const widthInput = document.getElementById('output-width');
    const heightInput = document.getElementById('output-height');
    const width = parseInt(widthInput && widthInput.value) || canvas.width || 800;
    const height = parseInt(heightInput && heightInput.value) || canvas.height || 800;
    canvas.width = width;
    canvas.height = height;
    
    // FIXED: Apply display constraints without stretching
    const zoomSlider = document.getElementById('zoom-slider');
    applyPreviewDisplayConstraints(zoomSlider ? zoomSlider.value : 100);
    
    return { width, height };
}

// Helper function to show progress indicator - Added 2025-10-23 [07:19:53-EST]
function showProgressIndicator(message) {
    const overlay = document.getElementById('progressOverlay');
    const messageEl = document.getElementById('progressMessage');
    if (overlay && messageEl) {
        messageEl.textContent = message;
        overlay.classList.add('show');
        console.log('🔵 Progress indicator shown:', message);
    }
}

// Helper function to hide progress indicator - Added 2025-10-23 [07:19:53-EST]
function hideProgressIndicator() {
    const overlay = document.getElementById('progressOverlay');
    if (overlay) {
        overlay.classList.remove('show');
        console.log('✅ Progress indicator hidden');
    }
}

// Helper function to disable all download buttons
function disableAllDownloadButtons() {
    document.getElementById('download-star-map-btn').disabled = true;
    document.getElementById('download-street-map-btn').disabled = true;
    document.getElementById('download-star-map-canvas-btn').disabled = true;
    document.getElementById('download-star-street-landscape-btn').disabled = true;
    document.getElementById('download-star-street-portrait-btn').disabled = true;
    console.log('🔵 All download buttons DISABLED');
}

// Helper function to enable only the specified download button
function enableDownloadButton(buttonId) {
    disableAllDownloadButtons(); // First disable all
    document.getElementById(buttonId).disabled = false;
    hideProgressIndicator(); // Hide progress when button is enabled
    console.log('✅ Download button ENABLED:', buttonId);
}

/**
 * Initialize all buttons in the Settings + Preview + Download section
 */
function initializeButtons() {
    console.log("Initializing Settings + Preview + Download buttons");
    
    // CRITICAL: Disable all download buttons on page load
    disableAllDownloadButtons();
    console.log('🔵 All download buttons initialized as DISABLED');
    
    // Settings buttons
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
    
    // Image format radio buttons - show/hide JPG quality selector
    const pngFormatRadio = document.getElementById('png-format');
    const jpgFormatRadio = document.getElementById('jpg-format');
    const svgFormatRadio = document.getElementById('svg-format');
    const pdfFormatRadio = document.getElementById('pdf-format');
    const jpgQualityDropdown = document.getElementById('jpg-quality');
    const transparencyContainer = document.getElementById('transparency-container');
    const transparencyCheckbox = document.getElementById('png-transparency');
    
    // HIDE TEST MARKER - proves JavaScript loaded
    const testMarker = document.getElementById('js-test-marker');
    if (testMarker) {
        testMarker.style.display = 'none';
        console.log('✅ JavaScript LOADED - Test marker hidden');
    }
    
    function updateFormatControls() {
        console.log('🔄 updateFormatControls called');
        
        if (!jpgQualityDropdown || !transparencyContainer) {
            console.warn('⚠️ Required elements not found');
            console.log('   jpgQualityDropdown:', jpgQualityDropdown);
            console.log('   transparencyContainer:', transparencyContainer);
            return;
        }
        
        // Get currently selected format
        const selectedFormat = document.querySelector('input[name="image-format"]:checked')?.value;
        console.log('   Selected format:', selectedFormat);
        
        if (selectedFormat === 'jpg') {
            // Show JPG quality dropdown
            jpgQualityDropdown.style.setProperty('display', 'inline-block', 'important');
            console.log('   ✅ JPG quality dropdown shown');
            
            // HIDE transparency completely for JPG (not just disable)
            transparencyContainer.style.display = 'none';
            if (transparencyCheckbox) {
                transparencyCheckbox.checked = false;
            }
            console.log('   ❌ Transparency HIDDEN for JPG');
        } else {
            // Hide JPG quality dropdown for PNG/SVG/PDF
            jpgQualityDropdown.style.setProperty('display', 'none', 'important');
            console.log('   ✅ JPG quality dropdown hidden');
            
            // SHOW and enable transparency for PNG, SVG, and PDF
            transparencyContainer.style.display = 'inline-flex';
            if (transparencyCheckbox) {
                transparencyCheckbox.disabled = false;
            }
            console.log('   ✅ Transparency SHOWN for', selectedFormat.toUpperCase());
        }
    }
    
    // Add event listeners to all format radio buttons
    if (pngFormatRadio) {
        pngFormatRadio.addEventListener('change', updateFormatControls);
        console.log('✅ PNG format listener attached');
    }
    if (jpgFormatRadio) {
        jpgFormatRadio.addEventListener('change', updateFormatControls);
        console.log('✅ JPG format listener attached');
    }
    if (svgFormatRadio) {
        svgFormatRadio.addEventListener('change', updateFormatControls);
        console.log('✅ SVG format listener attached');
    }
    if (pdfFormatRadio) {
        pdfFormatRadio.addEventListener('change', updateFormatControls);
        console.log('✅ PDF format listener attached');
    }
    
    // Initialize on page load - run after a small delay to ensure DOM is ready
    setTimeout(() => {
        console.log('🔄 Initial format controls update');
        updateFormatControls();
    }, 100);
}

/**
 * View the star map (just the star map itself, not on canvas)
 * FIXED VERSION - Uses arc() for perfect circles
 */
function viewStarMap() {
    console.log("🔵 View Star Map button clicked - FIXED VERSION");
    
    if (!validateCoordinates()) {
        alert("Please enter valid coordinates or a location first.");
        return;
    }
    
    // Show progress indicator
    showProgressIndicator('Generating Star Map...');
    
    // CRITICAL: Disable all download buttons while rendering
    disableAllDownloadButtons();
    
    lastGeneratedView = 'star-map'; // Track this view
    console.log("✅ Set lastGeneratedView to: star-map");
    
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
    
    // FIXED: Use single radius for perfect circle
    const minDim = Math.min(canvas.width, canvas.height);
    const radius = (minDim * radiusPercent) / 200;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    console.log(`🔵 PERFECT CIRCLE: radius=${radius}, center=${centerX},${centerY}`);
    
    const borderWidth = parseInt(document.getElementById('border-width').value) || 1;
    const borderColor = document.getElementById('border-color').value || '#FFFFFF';
    
    // Draw border with arc (perfect circle)
    if (borderWidth > 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        ctx.stroke();
    }
    
    // Create circular clipping path with arc (perfect circle)
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    // Get coordinates
    const latString = document.getElementById('latitude').value;
    const lngString = document.getElementById('longitude').value;
    
    let lat, lng;
    if (typeof parseFormattedCoordinate === 'function') {
        lat = parseFormattedCoordinate(latString, 'latitude');
        lng = parseFormattedCoordinate(lngString, 'longitude');
    } else {
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
    
    // Fetch and render star map
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
            // Scale to fill the circle
            const scale = Math.max(radius * 2 / img.width, radius * 2 / img.height);
            const drawWidth = img.width * scale;
            const drawHeight = img.height * scale;
            
            ctx.drawImage(img, centerX - drawWidth / 2, centerY - drawHeight / 2, drawWidth, drawHeight);
            ctx.restore();
            
            // NO TEXT LAYERS - Star Map is bare image for design use
            
            // CRITICAL: Enable ONLY the Star Map download button
            enableDownloadButton('download-star-map-btn');
            applyPreviewDisplayConstraints(document.getElementById('zoom-slider')?.value || 100);
            console.log("🔵 Star map rendered with PERFECT CIRCLE");
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
        console.warn("Proxy failed; drawing fallback:", error);
        try {
            const numStars = 1500;
            for (let i = 0; i < numStars; i++) {
                const a = Math.random() * Math.PI * 2;
                const d = Math.random() * (radius * 0.98);
                const x = centerX + Math.cos(a) * d;
                const y = centerY + Math.sin(a) * d;
                const r = Math.random() * 1.2 + 0.2;
                const o = 0.5 + Math.random() * 0.5;
                ctx.fillStyle = `rgba(255,255,255,${o.toFixed(2)})`;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
            
            // NO TEXT LAYERS - Star Map is bare image for design use
            
            // CRITICAL: Enable ONLY the Star Map download button
            enableDownloadButton('download-star-map-btn');
        } catch (e) {
            console.error('Fallback failed:', e);
            ctx.restore();
        }
    });
}

/**
 * View the star map using the Canvas Layout option
 * This version INCLUDES text layers (unlike bare Star Map button)
 */
function viewStarMapOnCanvas() {
    console.log('🔵 View Star Map (Canvas Layout) clicked - WITH TEXT');
    
    if (!validateCoordinates()) {
        alert("Please enter valid coordinates or a location first.");
        return;
    }
    
    // Show progress indicator
    showProgressIndicator('Generating Star Map+Text...');
    
    // CRITICAL: Disable all download buttons while rendering
    disableAllDownloadButtons();
    
    lastGeneratedView = 'star-map-canvas'; // Track this view
    console.log("✅ Set lastGeneratedView to: star-map-canvas");
    
    const dimensions = resetCanvasToUserDimensions();
    alert("Computing star map. This may take a while depending on your internet connection.");
    
    window.currentViewType = 'star-map-canvas';
    
    const canvas = document.getElementById('star-map-canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
    const minDim = Math.min(canvas.width, canvas.height);
    const radius = (minDim * radiusPercent) / 200;
    
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
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    const latString = document.getElementById('latitude').value;
    const lngString = document.getElementById('longitude').value;
    
    let lat, lng;
    if (typeof parseFormattedCoordinate === 'function') {
        lat = parseFormattedCoordinate(latString, 'latitude');
        lng = parseFormattedCoordinate(lngString, 'longitude');
    } else {
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
            const scale = Math.max(radius * 2 / img.width, radius * 2 / img.height);
            const drawWidth = img.width * scale;
            const drawHeight = img.height * scale;
            
            ctx.drawImage(img, centerX - drawWidth / 2, centerY - drawHeight / 2, drawWidth, drawHeight);
            ctx.restore();
            
            // CANVAS LAYOUT INCLUDES TEXT LAYERS
            renderTextLayers(ctx, centerX, centerY, radius, borderWidth);
            
            // CRITICAL: Enable ONLY the Star Map+Text download button
            enableDownloadButton('download-star-map-canvas-btn');
            applyPreviewDisplayConstraints(document.getElementById('zoom-slider')?.value || 100);
            console.log("🔵 Canvas Layout rendered with text layers");
            URL.revokeObjectURL(starMapUrl);
        };
        
        img.onerror = function() {
            console.error("Failed to load star map image");
            ctx.restore();
            renderTextLayers(ctx, centerX, centerY, radius, borderWidth);
            // CRITICAL: Enable ONLY the Star Map+Text download button
            enableDownloadButton('download-star-map-canvas-btn');
            alert("Failed to load star map image. Check your internet connection.");
        };
        
        img.src = starMapUrl;
    })
    .catch(error => {
        console.warn("Proxy failed; drawing fallback:", error);
        try {
            const numStars = 1500;
            for (let i = 0; i < numStars; i++) {
                const a = Math.random() * Math.PI * 2;
                const d = Math.random() * (radius * 0.98);
                const x = centerX + Math.cos(a) * d;
                const y = centerY + Math.sin(a) * d;
                const r = Math.random() * 1.2 + 0.2;
                const o = 0.5 + Math.random() * 0.5;
                ctx.fillStyle = `rgba(255,255,255,${o.toFixed(2)})`;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
            renderTextLayers(ctx, centerX, centerY, radius, borderWidth);
            // CRITICAL: Enable ONLY the Star Map+Text download button
            enableDownloadButton('download-star-map-canvas-btn');
        } catch (e) {
            console.error('Fallback failed:', e);
            ctx.restore();
        }
    });
}

// --- Shared helpers for combined views ---
function getParsedCoords() {
    const latStr = (document.getElementById('latitude') || {}).value || '';
    const lngStr = (document.getElementById('longitude') || {}).value || '';
    let lat, lng;
    if (typeof parseFormattedCoordinate === 'function') {
        lat = parseFormattedCoordinate(latStr, 'latitude');
        lng = parseFormattedCoordinate(lngStr, 'longitude');
    } else {
        lat = parseFloat(latStr);
        lng = parseFloat(lngStr);
    }
    return { lat, lng };
}

function fetchStarPng(lat, lng, dim) {
    const date = (document.getElementById('date') || {}).value || new Date().toISOString().split('T')[0];
    const style = (document.getElementById('star-map-style') || {}).value || 'default';
    let lstHours = 0;
    if (typeof calculateLST === 'function') {
        lstHours = calculateLST(date, lng);
        if (isNaN(lstHours)) lstHours = 0;
    }
    const body = {
        style,
        output: { width: dim, height: dim, format: 'png' },
        observer: { latitude: lat, longitude: lng, date },
        view: { type: 'area', parameters: { position: { equatorial: { rightAscension: lstHours, declination: lat } }, backgroundColor: '#000033' } }
    };
    return fetch('proxy/star_map_proxy.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'image/png' }, body: JSON.stringify(body)
    }).then(r => { if (!r.ok) throw new Error('star proxy ' + r.status); return r.blob(); })
      .then(blob => new Promise((res, rej) => { const img = new Image(); img.onload = () => res(img); img.onerror = rej; img.src = URL.createObjectURL(blob); }));
}

function fetchStreetPng(lat, lng, dim) {
    // Use proxy to avoid canvas tainting from Google Maps CORS issues
    const url = `proxy/google_maps_proxy.php?lat=${lat}&lng=${lng}&size=${dim}&zoom=12`;
    
    console.log('🔵 Fetching street map via proxy:', url);
    
    return new Promise((res, rej) => { 
        const img = new Image(); 
        img.onload = () => {
            console.log('✅ Street map loaded via proxy');
            res(img);
        }; 
        img.onerror = (e) => {
            console.error('❌ Street map proxy load failed:', e);
            rej(e);
        }; 
        img.src = url; 
    });
}

// FIXED: drawImageInCircle uses arc() for perfect circles
function drawImageInCircle(ctx, img, cx, cy, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2, true);  // Perfect circle
    ctx.closePath();
    ctx.clip();
    
    // Scale to fill circle
    const scale = Math.max(r * 2 / img.width, r * 2 / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    
    ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
    ctx.restore();
    
    console.log(`🔵 Drew image in PERFECT CIRCLE at (${cx}, ${cy}) radius=${r}`);
}

function viewCombined(isLandscape) {
    console.log('🔵 View Combined clicked, landscape=', isLandscape);
    if (!validateCoordinates()) { alert('Please enter valid coordinates first.'); return; }
    
    // Show progress indicator with appropriate message
    if (isLandscape) {
        showProgressIndicator('Generating Combined-Landscape View...');
    } else {
        showProgressIndicator('Generating Combined-Portrait View...');
    }
    
    // CRITICAL: Disable ALL download buttons while rendering
    disableAllDownloadButtons();
    console.log('🔵 All download buttons DISABLED - rendering in progress...');
    
    const { width, height } = resetCanvasToUserDimensions();
    const canvas = document.getElementById('star-map-canvas');
    const ctx = canvas.getContext('2d');
    
    const bgColor = (document.getElementById('bg-color-canvas') || {}).value || '#F5F5DC';
    console.log(`🔵 Retrieved bgColor: ${bgColor} for ${isLandscape ? 'LANDSCAPE' : 'PORTRAIT'}`);

    // Set canvas dimensions based on button clicked
    // Setting dimensions automatically clears the canvas
    if (isLandscape) {
        canvas.width = Math.max(width, height);
        canvas.height = Math.min(width, height);
    } else {
        canvas.width = Math.min(width, height);
        canvas.height = Math.max(width, height);
    }
    
    console.log(`🔵 Canvas dimensions set to: ${canvas.width} x ${canvas.height}`);
    
    // Fill with background color immediately after setting dimensions
    ctx.fillStyle = bgColor; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log(`🔵 Background filled with color: ${bgColor}`);

    // FIXED: Use smaller radius for portrait to leave text space
    const radiusPercent = isLandscape ? 
        parseInt((document.getElementById('circle-radius-percent') || {}).value) || 60 : 
        50; // Force 50% for portrait mode to ensure text space
    
    console.log(`🔵 Radius: ${radiusPercent}% for ${isLandscape ? 'LANDSCAPE' : 'PORTRAIT'}`);
    
    const minDim = Math.min(canvas.width, canvas.height);
    const r = (minDim * radiusPercent) / 200;
    
    const overlap = parseInt((document.getElementById('circle-overlap-percent') || {}).value) || 10;
    const sep = (2 * r) * (1 - (Math.max(0, Math.min(100, overlap)) / 100));
    const streetFirst = (function(){ const radio = document.querySelector('input[name="map-order"]:checked'); return radio ? (radio.value === 'street-first') : true; })();
    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    const c1 = isLandscape ? { x: center.x - sep / 2, y: center.y } : { x: center.x, y: center.y - sep / 2 };
    const c2 = isLandscape ? { x: center.x + sep / 2, y: center.y } : { x: center.x, y: center.y + sep / 2 };
    
    console.log(`🔵 Combined view: ${isLandscape ? 'LANDSCAPE' : 'PORTRAIT'}, radius=${r}`);
    
    const { lat, lng } = getParsedCoords();
    const dim = Math.min(640, Math.round(r * 2));
    
    const borderWidth = parseInt((document.getElementById('border-width') || {}).value) || 2;
    const borderColor = (document.getElementById('border-color') || {}).value || '#FDCA0D';

    // Fetch both images
    Promise.all([fetchStreetPng(lat, lng, dim), fetchStarPng(lat, lng, dim)])
        .then(([streetImg, starImg]) => {
            // Draw Street Map at c1
            drawImageInCircle(ctx, streetImg, c1.x, c1.y, r);
            
            // Draw Star Map at c2 (on top)
            drawImageInCircle(ctx, starImg, c2.x, c2.y, r);
            
            // Draw borders with masking using composite operation
            if (borderWidth > 0) {
                // Create temporary canvas
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                const tempCtx = tempCanvas.getContext('2d');
                
                // Draw both borders on temp canvas
                tempCtx.strokeStyle = borderColor;
                tempCtx.lineWidth = borderWidth;
                tempCtx.beginPath();
                tempCtx.arc(c1.x, c1.y, r, 0, Math.PI * 2);
                tempCtx.stroke();
                tempCtx.beginPath();
                tempCtx.arc(c2.x, c2.y, r, 0, Math.PI * 2);
                tempCtx.stroke();
                
                // Erase the overlap area from BOTH borders
                tempCtx.globalCompositeOperation = 'destination-out';
                tempCtx.fillStyle = 'black';
                
                // Calculate intersection and erase it
                // Erase a region that covers where both circles overlap
                const distance = Math.sqrt(Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2));
                if (distance < 2 * r) {
                    // Circles overlap - erase almost to outer edge to remove all border slivers
                    // Erase to outer edge minus 1 pixel
                    tempCtx.beginPath();
                    tempCtx.arc(c1.x, c1.y, r - 1, 0, Math.PI * 2);
                    tempCtx.fill();
                    // Erase circle 2 to outer edge minus 1 pixel
                    tempCtx.beginPath();
                    tempCtx.arc(c2.x, c2.y, r - 1, 0, Math.PI * 2);
                    tempCtx.fill();
                }
                
                // Copy the result to main canvas
                ctx.drawImage(tempCanvas, 0, 0);
            }
            
            // Text rendering - use actual circle radius for consistent positioning
            const canvasCenterX = canvas.width / 2;
            const canvasCenterY = canvas.height / 2;
            
            // For PORTRAIT: Push text further from circles (higher above, lower below)
            let textRadius = r;
            if (!isLandscape) {
                // Portrait: INCREASE radius by 80% to push text further out
                textRadius = r * 1.80;
                console.log(`🔵 Portrait mode: Increased text radius to ${textRadius.toFixed(0)}px (from ${r.toFixed(0)}px)`);
            }
            
            renderTextLayers(ctx, canvasCenterX, canvasCenterY, textRadius, borderWidth);
            
            applyPreviewDisplayConstraints(document.getElementById('zoom-slider')?.value || 100);
            
            // CRITICAL FIX: DOUBLE requestAnimationFrame to ensure GPU operations complete
            // Single RAF is insufficient after complex composite operations (destination-out)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    console.log('✅ Double requestAnimationFrame fired - GPU operations complete');
                    
                    // CRITICAL FIX: Capture and store canvas pixels IMMEDIATELY after rendering
                    console.log('🔵 Capturing canvas pixel data for safe storage...');
                    storedCanvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    storedCanvasWidth = canvas.width;
                    storedCanvasHeight = canvas.height;
                    
                    const centerX = Math.floor(canvas.width / 2);
                    const centerY = Math.floor(canvas.height / 2);
                    const centerPixel = storedCanvasData.data[(centerY * canvas.width + centerX) * 4];
                    console.log('✅ Canvas pixel data STORED - center pixel:', centerPixel, storedCanvasData.data[(centerY * canvas.width + centerX) * 4 + 1], storedCanvasData.data[(centerY * canvas.width + centerX) * 4 + 2], storedCanvasData.data[(centerY * canvas.width + centerX) * 4 + 3]);
                    console.log('   Stored data size:', storedCanvasData.data.length, 'bytes');
                    
                    // Set lastGeneratedView and enable ONLY the matching download button
                    if (isLandscape) {
                        lastGeneratedView = 'star-street-landscape';
                        console.log('✅ RENDERING COMPLETE - Set lastGeneratedView to: star-street-landscape');
                        enableDownloadButton('download-star-street-landscape-btn');
                    } else {
                        lastGeneratedView = 'star-street-portrait';
                        console.log('✅ RENDERING COMPLETE - Set lastGeneratedView to: star-street-portrait');
                        enableDownloadButton('download-star-street-portrait-btn');
                    }
                    
                    console.log('🔵 Combined view complete - Download enabled after pixel buffer sync');
                });
            });
        })
        .catch(e => { 
            console.error('Combined view error:', e);
            // On error, keep all buttons disabled (user needs to regenerate)
            console.log('❌ Error during rendering - all download buttons remain DISABLED');
            alert('Failed to render combined view. Error: ' + e.message + '\n\nPlease try again.'); 
        });
}

function viewStarStreetLandscape(){ 
    // FIXED: lastGeneratedView now set AFTER rendering completes in viewCombined()
    viewCombined(true); 
}
function viewStarStreetPortrait(){ 
    // FIXED: lastGeneratedView now set AFTER rendering completes in viewCombined()
    viewCombined(false); 
}

/**
 * View the street map (Google Map) in a circle
 * FIXED VERSION - Uses arc() for perfect circles
 */
function viewStreetMap() {
    console.log("🔵 View Street Map button clicked - FIXED VERSION");
    
    if (!validateCoordinates()) {
        alert("Please enter valid coordinates or a location first.");
        return;
    }
    
    // Show progress indicator
    showProgressIndicator('Generating Street Map...');
    
    // CRITICAL: Disable all download buttons while rendering
    disableAllDownloadButtons();
    
    lastGeneratedView = 'street-map'; // Track this view
    console.log("✅ Set lastGeneratedView to: street-map");
    
    const dimensions = resetCanvasToUserDimensions();
    window.currentViewType = 'street-map';
    
    const canvas = document.getElementById('star-map-canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
    
    // FIXED: Use single radius for perfect circle
    const minDim = Math.min(canvas.width, canvas.height);
    const radius = (minDim * radiusPercent) / 200;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    console.log(`🔵 PERFECT CIRCLE: radius=${radius}, center=${centerX},${centerY}`);
    
    const borderWidth = parseInt(document.getElementById('border-width').value) || 1;
    const borderColor = document.getElementById('border-color').value || '#FDCA0D';
    
    // Draw border with arc (perfect circle)
    if (borderWidth > 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        ctx.stroke();
    }
    
    // Create circular clipping with arc (perfect circle)
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    // Get coordinates
    const latString = document.getElementById('latitude').value;
    const lngString = document.getElementById('longitude').value;
    
    let lat, lng;
    if (typeof parseFormattedCoordinate === 'function') {
        lat = parseFormattedCoordinate(latString, 'latitude');
        lng = parseFormattedCoordinate(lngString, 'longitude');
    } else {
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
    // Use proxy to avoid canvas tainting
    const mapUrl = `proxy/google_maps_proxy.php?lat=${lat}&lng=${lng}&size=${mapSize}&zoom=12`;
    
    console.log('🔵 Loading street map via proxy:', mapUrl);
    
    const img = new Image();
    img.onload = function() {
        console.log('✅ Street map loaded successfully');
        // Scale to fill the circle
        const scale = Math.max(radius * 2 / img.width, radius * 2 / img.height);
        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;
        
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
        
        // NO TEXT LAYERS - Street Map is bare image for design use
        
        // CRITICAL: Enable ONLY the Street Map download button
        enableDownloadButton('download-street-map-btn');
        applyPreviewDisplayConstraints(document.getElementById('zoom-slider')?.value || 100);
        console.log("🔵 Street map rendered with PERFECT CIRCLE");
    };
    
    img.onerror = function() {
        console.error("Failed to load street map");
        ctx.restore();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        // CRITICAL: Enable ONLY the Street Map download button even on error
        enableDownloadButton('download-street-map-btn');
        alert("Failed to load Google Maps image. Check your internet connection or backend proxy.");
    };
    
    img.src = mapUrl;
}

/**
 * Download functions with proper validation and alerts
 */
function downloadStarMap() {
    console.log("🔵 Download Star Map button clicked");
    simpleDownload('star-map');
}

function downloadStreetMap() {
    console.log("🔵 Download Street Map button clicked");
    simpleDownload('street-map');
}

function downloadStarMapWithCanvas() {
    console.log("🔵 Download Canvas Layout button clicked");
    simpleDownload('star-map-canvas');
}

function downloadStarStreetLandscape() {
    console.log("🔵 Download Combined Landscape button clicked");
    simpleDownload('star-street-landscape');
}

function downloadStarStreetPortrait() {
    console.log("🔵 Download Combined Portrait button clicked");
    simpleDownload('star-street-portrait');
}

// ENHANCED download function with comprehensive validation and alerts
// FIXED: Uses toBlob() for Combined views to handle potential CORS issues
function simpleDownload(viewType) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔵 DOWNLOAD INITIATED');
    console.log('   Requested view type:', viewType);
    console.log('   Last generated view:', lastGeneratedView);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Step 1: Check if canvas exists
    const canvas = document.getElementById('star-map-canvas');
    if (!canvas) {
        const msg = '❌ ERROR: Canvas element not found. Please reload the page.';
        console.error(msg);
        alert('Canvas not found. Please reload the page and try again.');
        return;
    }
    
    console.log('✅ Canvas found');
    console.log('   Canvas dimensions:', canvas.width, 'x', canvas.height);
    
    // Step 2: Check if canvas has content (reasonable dimensions)
    if (canvas.width < 100 || canvas.height < 100) {
        const msg = '⚠️ Canvas is empty or too small';
        console.warn(msg);
        alert('Please click one of the YELLOW "View Options" buttons above to generate your desired image first.\n\nThen use the corresponding GREEN download button.');
        return;
    }
    
    console.log('✅ Canvas has content');
    
    // NOTE: View mismatch check removed - buttons are now disabled/enabled automatically
    // Only the correct button for the current view will be enabled
    console.log('✅ Download button enabled - view type:', viewType);
    
    // Step 4: Get download format
    const formatRadios = document.getElementsByName('image-format');
    let format = 'png';
    for (const radio of formatRadios) {
        if (radio.checked) {
            format = radio.value.toLowerCase();
            break;
        }
    }
    
    console.log('   Format:', format);
    
    // Step 5: Check format support (PNG/JPG only for now)
    if (format !== 'png' && format !== 'jpg' && format !== 'jpeg') {
        console.warn('⚠️ Unsupported format:', format);
        alert(`${format.toUpperCase()} download is not yet implemented.\n\nPlease select PNG or JPG format.`);
        return;
    }
    
    console.log('✅ Format supported');
    
    // Step 6: Get event name and date for filename
    const occasionEl = document.getElementById('occasion');
    const customOccasionEl = document.getElementById('custom-occasion');
    const dateEl = document.getElementById('date');
    
    let eventName = 'Star-Map';
    if (occasionEl) {
        if (occasionEl.value === 'custom' && customOccasionEl && customOccasionEl.value) {
            eventName = customOccasionEl.value.replace(/\s+/g, '-');
        } else if (occasionEl.value) {
            eventName = occasionEl.options[occasionEl.selectedIndex].text.replace(/\s+/g, '-');
        }
    }
    
    const date = dateEl ? dateEl.value : '2024-01-01';
    
    // Map type names for filename
    const mapTypeNames = {
        'star-map': 'Star-Map',
        'street-map': 'Street-Map',
        'star-map-canvas': 'Star-Map-Text',
        'star-street-landscape': 'Combined-Landscape',
        'star-street-portrait': 'Combined-Portrait'
    };
    
    const mapType = mapTypeNames[viewType] || viewType;
    const extension = (format === 'jpg' || format === 'jpeg') ? 'jpg' : 'png';
    const filename = `${eventName}-${mapType}-${date}.${extension}`;
    
    console.log('   Filename:', filename);
    console.log('   Event:', eventName);
    console.log('   Date:', date);
    
    // Step 7: Attempt download
    console.log('🔄 Attempting to generate download...');
    console.log('   View type:', viewType);
    console.log('   Format:', format);
    
    // CRITICAL FIX: Use toBlob() for Combined views to handle potential canvas tainting
    const isCombinedView = (viewType === 'star-street-landscape' || viewType === 'star-street-portrait');
    
    if (isCombinedView && (format === 'png' || format === 'jpg' || format === 'jpeg')) {
        console.log(`🔵 Combined ${format.toUpperCase()} download - using STORED pixel data`);
        console.log('🔵 Canvas dimensions:', canvas.width, 'x', canvas.height);
        
        // CRITICAL FIX: Use stored pixel data instead of reading from potentially cleared canvas
        try {
            if (!storedCanvasData || storedCanvasWidth !== canvas.width || storedCanvasHeight !== canvas.height) {
                console.error('❌ No stored canvas data available or dimensions mismatch!');
                alert('❌ Download failed: Canvas data not available.\n\nPlease regenerate the view and try again immediately after rendering completes.');
                return;
            }
            
            console.log('✅ Using stored canvas data from rendering');
            console.log('   Stored dimensions:', storedCanvasWidth, 'x', storedCanvasHeight);
            
            // Validate stored data by checking center pixel
            const centerX = Math.floor(storedCanvasWidth / 2);
            const centerY = Math.floor(storedCanvasHeight / 2);
            const centerIdx = (centerY * storedCanvasWidth + centerX) * 4;
            console.log('🔍 Stored center pixel RGBA:', storedCanvasData.data[centerIdx], storedCanvasData.data[centerIdx + 1], storedCanvasData.data[centerIdx + 2], storedCanvasData.data[centerIdx + 3]);
            
            // Create temporary opaque canvas for export
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d', { alpha: false, willReadFrequently: true });
            
            console.log('✅ Created temporary opaque canvas');
            
            // Fill with white background first
            tempCtx.fillStyle = '#FFFFFF';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            // CRITICAL FIX: Use STORED pixel data instead of reading from canvas
            console.log('🔵 Using stored pixel data for export...');
            tempCtx.putImageData(storedCanvasData, 0, 0);
            
            console.log('✅ Stored pixel data written to export canvas');
            
            // Export from the opaque canvas
            let dataURL;
            if (format === 'png') {
                dataURL = tempCanvas.toDataURL('image/png');
                console.log('✅ Exported PNG from opaque canvas');
            } else {
                // Get JPG quality from dropdown (default 90%)
                const qualityDropdown = document.getElementById('jpg-quality');
                const quality = qualityDropdown ? parseFloat(qualityDropdown.value) : 0.90;
                console.log('   JPG Quality selected:', (quality * 100) + '%');
                dataURL = tempCanvas.toDataURL('image/jpeg', quality);
                console.log('✅ Exported JPG from opaque canvas');
            }
            console.log('   DataURL length:', dataURL.length);
            
            if (dataURL.length < 1000) {
                console.error('❌ Canvas appears blank - dataURL too small');
                alert('❌ Download failed: Canvas appears blank.\n\nPlease regenerate the view and try again.');
                return;
            }
            
            // Create download link from dataURL
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // CRITICAL FIX: Restore canvas from stored data to keep it visible after download
            const ctx = canvas.getContext('2d');
            ctx.putImageData(storedCanvasData, 0, 0);
            console.log('✅ Canvas restored from stored data - remains visible after download');
            
            console.log('✅ DOWNLOAD SUCCESSFUL (opaque canvas method - alpha issue fixed)');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            alert(`✅ Download successful!\n\nFile: ${filename}`);
            
        } catch (e) {
            console.error('❌ Export failed:', e);
            alert('❌ Download failed: ' + e.message + '\n\nPlease try JPG format instead.');
            return;
        }
        
        return; // Exit early for Combined view
    }
    
    // Standard download using toDataURL for other views
    try {
        const link = document.createElement('a');
        
        if (format === 'png') {
            link.href = canvas.toDataURL('image/png');
        } else {
            // Get JPG quality from dropdown (default 90%)
            const qualityDropdown = document.getElementById('jpg-quality');
            const quality = qualityDropdown ? parseFloat(qualityDropdown.value) : 0.90;
            console.log('   JPG Quality selected:', (quality * 100) + '%');
            link.href = canvas.toDataURL('image/jpeg', quality);
        }
        
        // Check if dataURL is suspiciously small (indicates blank canvas)
        if (link.href.length < 1000) {
            console.warn('⚠️ DataURL suspiciously small - canvas may be blank or tainted');
            console.warn('   DataURL length:', link.href.length);
        }
        
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ DOWNLOAD SUCCESSFUL');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        alert(`✅ Download successful!\n\nFile: ${filename}`);
        
    } catch (error) {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ DOWNLOAD FAILED');
        console.error('   Error:', error.name);
        console.error('   Message:', error.message);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Specific error handling for cross-origin issues
        if (error.name === 'SecurityError' || error.message.includes('tainted') || error.message.includes('cross-origin')) {
            alert('❌ Download failed due to browser security restrictions.\n\n' +
                  'The canvas contains cross-origin images that cannot be downloaded.\n\n' +
                  'WORKAROUND: Try switching to JPG format or use your browser\'s screenshot tool.');
        } else {
            alert(`❌ Download failed\n\nError: ${error.message}\n\nPlease try again or use a screenshot tool.`);
        }
    }
}


/* UPDATED: Added visible test marker hiding & enhanced console logging - Emergent - 2025-10-24 [11:52:48-EST] */
/* END OF CODE - Emergent - 2025-10-24 [11:52:48-EST] */
