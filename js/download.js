/* START OF CODE - Cline - 2025-04-22 10:27 File: js/download.js */ // Updated timestamp
// Download Functionality for Star Map Generator
// MODIFIED: Fetches exact target dimensions for PNG/JPG download.
// MODIFIED: Fetches SVG directly from API via proxy for SVG download.
// FIXED: ReferenceError for targetVisualRadius
// FIXED: Added missing clipping path for PNG/JPG download.

// Assumes showTemporaryMessage function is available (from utils.js)
// Assumes formatDate function is available (from utils.js)
// Assumes parseFormattedCoordinate function is available (from main_app.js)
// Assumes calculateLST function is available (from main_app.js)

async function downloadStarMap() { // Made async to handle fetch/createImageBitmap
    console.log("Download function started.");
    const mainCanvas = document.getElementById('star-map-canvas'); // The preview canvas

    // Check if a preview has been generated (needed for settings)
    if (!mainCanvas || mainCanvas.getAttribute('data-generated') !== 'true') {
        alert("Please generate the star map preview first (this gathers necessary settings).");
        console.warn("Download attempt failed: Preview not generated.");
        return;
    }

    const loadingIndicator = document.getElementById('loading-indicator');
    const loadingMessageElement = loadingIndicator ? loadingIndicator.querySelector('div:last-child') : null;

    try {
        // --- Get Settings (needed for all formats) ---
        const getEl = id => document.getElementById(id);
        const getVal = (id, def) => getEl(id)?.value || def;
        const getInt = (id, def) => parseInt(getVal(id, String(def))) || def;
        const getChecked = id => getEl(id)?.checked || false;
        const getRadioVal = (name, def) => {
            const checkedRadio = document.querySelector(`input[name="${name}"]:checked`);
            return checkedRadio ? checkedRadio.value : def;
        };

        const imageFormat = getRadioVal("image-format", "png");

        // Show loading indicator for download process
        if (loadingIndicator) {
            if (loadingMessageElement) {
                loadingMessageElement.textContent = `Preparing ${imageFormat.toUpperCase()} download...`;
            }
            loadingIndicator.style.display = 'flex';
            console.log("Showing loading indicator for download preparation.");
        }

        const exportTransparency = getChecked("png-transparency"); // Used for PNG raster only
        const canvasBgColor = getVal('bg-color-canvas', '#000000'); // Used for JPG/non-transparent PNG raster
        const dateValue = getVal("date", "");

        // --- Get Target Dimensions (FROM UI - used for PNG/JPG/SVG request) ---
        const targetWidth = getInt("output-width", 3540);
        const targetHeight = getInt("output-height", 3186);
        console.log(`Target download dimensions: ${targetWidth}x${targetHeight}`);

        // --- Get Filename Details ---
        const dateInput = getEl("date"); // Re-get element if needed
        const dateObj = dateValue ? new Date(dateValue + 'T00:00:00Z') : new Date(); // Use dateValue obtained earlier
        const formattedDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
        const titleInput = getEl("text-entry-1");
        const title = titleInput?.value || "star_map";
        const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        let fileExtension = imageFormat === 'jpg' ? 'jpg' : imageFormat;
        let fileName = `${safeTitle}_${formattedDate}.${fileExtension}`;

        const link = document.createElement("a");
        let dataURL; // For PNG/JPG data URLs
        let blobToDownload; // For SVG blob

        // --- Common API Request Parameters ---
        const latFullFormatted = getVal("latitude", "");
        const lonFullFormatted = getVal("longitude", "");
        const latDecimal = parseFormattedCoordinate(latFullFormatted, 'latitude');
        const lonDecimal = parseFormattedCoordinate(lonFullFormatted, 'longitude');

        if (isNaN(latDecimal) || isNaN(lonDecimal)) {
             throw new Error("Invalid or missing coordinates for download request.");
        }
        if (!dateValue) {
             throw new Error("Date is required for download request.");
        }

        const starMapStyleValue = getVal("star-map-style", "default");
        const advancedParams = (typeof window.advancedStyleOptions === 'object' && window.advancedStyleOptions !== null)
                                ? { ...window.advancedStyleOptions }
                                : {};

        const lstHours = calculateLST(dateValue, lonDecimal);
         if (isNaN(lstHours)) {
             throw new Error("Could not calculate LST for download request.");
         }

        // --- Generate Image Data ---
        if (imageFormat === "png" || imageFormat === "jpg") {

            // --- Construct Request Body for PNG/JPG at Target Size ---
            const rasterRequestBody = {
                style: starMapStyleValue,
                output: {
                    width: targetWidth,  // Request EXACT target dimensions
                    height: targetHeight, // Request EXACT target dimensions
                    format: imageFormat
                },
                observer: { latitude: latDecimal, longitude: lonDecimal, date: dateValue },
                view: {
                    type: "area",
                    parameters: {
                        position: {
                            equatorial: {
                                rightAscension: lstHours,
                                declination: latDecimal
                            }
                        },
                         ...advancedParams,
                         // Background color for API generation (only matters if not transparent PNG)
                        ...(!(imageFormat === 'png' && exportTransparency) && { backgroundColor: '#000000' }) // API uses black bg if not transparent
                    }
                }
            };
             // Add transparency flag specifically for PNG
             if (imageFormat === 'png') {
                 rasterRequestBody.output.transparent = exportTransparency;
             }

            console.log(`DEBUG: Sending ${imageFormat.toUpperCase()} request to PHP proxy (Target Size ${targetWidth}x${targetHeight}):`, JSON.stringify(rasterRequestBody, null, 2));

            // --- Fetch EXACTLY SIZED PNG/JPG via Proxy, with client-side fallback ---
            let imageBlob = null;
            let imageBitmap = null;
            const USE_SERVER = (function(){ try { return /^https?:/.test(window.location && window.location.protocol); } catch(e) { return false; }})();
            if (USE_SERVER) {
                try {
                    const response = await fetch('proxy/star_map_proxy.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': `image/${fileExtension}` }, // Accept correct raster type
                        body: JSON.stringify(rasterRequestBody)
                    });

                    console.log(`Proxy response status for ${imageFormat.toUpperCase()}:`, response.status);

                    if (response.ok) {
                        const fetchedContentType = (response.headers.get('content-type') || '').toLowerCase();
                        const expectedContentType = imageFormat === 'jpg' ? 'image/jpeg' : `image/${imageFormat}`;
                        if (fetchedContentType.startsWith(expectedContentType)) {
                            imageBlob = await response.blob(); // Get the blob directly
                            console.log(`Received ${imageFormat.toUpperCase()} blob (${imageBlob.size} bytes) from proxy.`);
                        } else {
                            console.warn(`Proxy returned wrong content type for ${imageFormat.toUpperCase()}. Expected ${expectedContentType}, got ${fetchedContentType}`);
                        }
                    } else {
                        const errorText = await response.text();
                        console.warn(`Proxy error fetching ${imageFormat.toUpperCase()}: ${response.status} ${response.statusText}. ${errorText}`);
                    }
                } catch (proxyErr) {
                    console.warn('Proxy fetch failed, using client-side fallback:', proxyErr);
                }
            }

            if (!imageBlob || imageBlob.size === 0) {
                // Fallback: use on-page canvas as source
                const srcCanvas = document.getElementById('star-map-canvas');
                if (!srcCanvas) { throw new Error('Source canvas not found for client-side export fallback.'); }
                imageBitmap = await createImageBitmap(srcCanvas);
                console.log('Using client-side canvas as image source (fallback).');
            }

            // --- Create temporary canvas and draw elements ---
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = targetWidth;
            tempCanvas.height = targetHeight;
            console.log(`Created temporary canvas for download: ${tempCanvas.width}x${tempCanvas.height}`);

            // --- 1. Handle Background (if needed) ---
            if (imageFormat === "jpg" || (imageFormat === "png" && !exportTransparency)) {
                tempCtx.fillStyle = canvasBgColor;
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                console.log(`Filled temporary canvas background with ${canvasBgColor}`);
            } else {
                 tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
                 console.log("Cleared temporary canvas for transparent PNG.");
            }

            // --- Calculate Geometry for Clipping/Border/Text ---
            const circleRadiusPercent = getInt("circle-radius-percent", 60);
            const borderWidth = getInt("border-width", 1);
            const borderColor = getVal("border-color", "#FFFFFF");
            const targetMinCanvasDim = Math.min(tempCanvas.width, tempCanvas.height);
            const targetVisualRadius = (targetMinCanvasDim * (circleRadiusPercent / 100)) / 2; // Calculate here
            const targetCenterX = tempCanvas.width / 2;
            const targetCenterY = tempCanvas.height * 0.50;
            const targetAspect = tempCanvas.width / tempCanvas.height;
            let targetRadiusX = targetVisualRadius;
            let targetRadiusY = targetVisualRadius;
            if (targetAspect > 1) { targetRadiusX = targetVisualRadius * targetAspect; }
            else if (targetAspect < 1) { targetRadiusY = targetVisualRadius / targetAspect; }
            const targetDynamicTextMargin = targetVisualRadius * 0.10;

            // --- 2. Apply Clipping Path --- ADDED
            tempCtx.save();
            tempCtx.beginPath();
            tempCtx.ellipse(targetCenterX, targetCenterY, targetRadiusX, targetRadiusY, 0, 0, Math.PI * 2);
            tempCtx.closePath();
            tempCtx.clip();
            console.log("Applied clipping path to temporary canvas.");

            // --- 3. Draw Star Map Image (Now Clipped) ---
            if (!imageBitmap) {
                imageBitmap = await createImageBitmap(imageBlob);
            }
            // Draw 1:1 as the fetched image should match target dimensions
            tempCtx.drawImage(imageBitmap, 0, 0, tempCanvas.width, tempCanvas.height);
            imageBitmap.close();
            console.log("Drew received image onto temporary canvas (inside clip).");

            // --- 4. Restore Context (Remove Clip) --- ADDED
            tempCtx.restore();
            console.log("Removed clipping path.");

            // --- 5. Draw Border ---
             if (borderWidth > 0) {
                 console.log(`Drawing border onto temp canvas: Width=${borderWidth}, Color=${borderColor}`);
                 tempCtx.strokeStyle = borderColor;
                 const previewCanvasWidthForScale = mainCanvas.width || 800;
                 const borderScaleFactor = tempCanvas.width / previewCanvasWidthForScale;
                 tempCtx.lineWidth = Math.max(1, Math.round(borderWidth * borderScaleFactor));
                 console.log(`Scaled border width: ${tempCtx.lineWidth}`);
                 tempCtx.beginPath();
                 tempCtx.ellipse(targetCenterX, targetCenterY, targetRadiusX, targetRadiusY, 0, 0, Math.PI * 2);
                 tempCtx.stroke();
             }

            // --- 6. Draw Text Layers (Scaled) ---
            console.log("Preparing to draw text layers onto temporary canvas...");
            const allTextData = [ /* Duplicating this structure for clarity */
                { id: 'entry1', text: getVal('text-entry-1', ''), fontFamily: getVal('font-family-1', 'Montserrat'), fontSize: parseInt(getVal('font-size-1', '28')), fontColor: getVal('font-color-1', '#FFFFFF'), isBold: getChecked('text-bold-1'), isItalic: getChecked('text-italic-1'), order: parseInt(getVal('text-placement-order-1', '1')), position: getRadioVal('text-placement-pos-1', 'below') },
                { id: 'entry2', text: getVal('text-entry-2', ''), fontFamily: getVal('font-family-2', 'Montserrat'), fontSize: parseInt(getVal('font-size-2', '16')), fontColor: getVal('font-color-2', '#FFFFFF'), isBold: getChecked('text-bold-2'), isItalic: getChecked('text-italic-2'), order: parseInt(getVal('text-placement-order-2', '2')), position: getRadioVal('text-placement-pos-2', 'below') },
                { id: 'entry3', text: getVal('text-entry-3', ''), fontFamily: getVal('font-family-3', 'Montserrat'), fontSize: parseInt(getVal('font-size-3', '14')), fontColor: getVal('font-color-3', '#FFFFFF'), isBold: getChecked('text-bold-3'), isItalic: getChecked('text-italic-3'), order: parseInt(getVal('text-placement-order-3', '3')), position: getRadioVal('text-placement-pos-3', 'below') },
                { id: 'entry4', text: getVal('text-entry-4', ''), fontFamily: getVal('font-family-4', 'Montserrat'), fontSize: parseInt(getVal('font-size-4', '14')), fontColor: getVal('font-color-4', '#FFFFFF'), isBold: getChecked('text-bold-4'), isItalic: getChecked('text-italic-4'), order: parseInt(getVal('text-placement-order-4', '4')), position: getRadioVal('text-placement-pos-4', 'below') },
                { id: 'date', text: (typeof formatDate === 'function') ? formatDate(dateValue) : dateValue, fontFamily: getVal('fixed-font-family-date', 'Arial'), fontSize: parseInt(getVal('fixed-font-size-date', '14')), fontColor: getVal('fixed-font-color-date', '#FFFFFF'), isBold: getChecked('fixed-text-bold-date'), isItalic: getChecked('fixed-text-italic-date'), order: parseInt(getVal('text-placement-order-date', '5')), position: getRadioVal('text-placement-pos-date', 'below') },
                { id: 'coords', text: `${getVal("latitude", "") || '?'} | ${getVal("longitude", "") || '?'}`, fontFamily: getVal('fixed-font-family-coords', 'Arial'), fontSize: parseInt(getVal('fixed-font-size-coords', '14')), fontColor: getVal('fixed-font-color-coords', '#FFFFFF'), isBold: getChecked('fixed-text-bold-coords'), isItalic: getChecked('fixed-text-italic-coords'), order: parseInt(getVal('text-placement-order-coords', '6')), position: getRadioVal('text-placement-pos-coords', 'below') }
            ];

            const previewCanvasWidth = mainCanvas.width || 800;
            const fontSizeScale = tempCanvas.width / previewCanvasWidth;
            console.log(`Text font size scale factor for download: ${fontSizeScale.toFixed(2)} (Target: ${tempCanvas.width} / Preview: ${previewCanvasWidth})`);

            tempCtx.textAlign = 'center';
            const itemsToDraw = allTextData.filter(item => item.text && item.text.trim() !== '').sort((a, b) => a.order - b.order);
            const aboveItems = itemsToDraw.filter(item => item.position === 'above');
            const belowItems = itemsToDraw.filter(item => item.position === 'below');

            const applyScaledFontStyle = (style) => {
                const fontWeight = style.isBold ? 'bold' : 'normal';
                const fontStyle = style.isItalic ? 'italic' : 'normal';
                const baseSizeNum = parseInt(style.fontSize) || 14;
                const scaledSize = Math.max(1, Math.round(baseSizeNum * fontSizeScale));
                const sizeWithUnit = `${scaledSize}px`;
                const safeFontFamily = style.fontFamily.includes(' ') ? `"${style.fontFamily}"` : style.fontFamily;
                tempCtx.font = `${fontStyle} ${fontWeight} ${sizeWithUnit} ${safeFontFamily}`;
                tempCtx.fillStyle = style.fontColor;
                return scaledSize;
            };

            const textSpacing = 1.2;

            let currentYBelow = targetCenterY + targetVisualRadius + (tempCtx.lineWidth / 2) + targetDynamicTextMargin; // Use calculated targetVisualRadius
            tempCtx.textBaseline = 'top';
            belowItems.forEach((item) => {
                const scaledFontSize = applyScaledFontStyle(item);
                if (currentYBelow + scaledFontSize <= tempCanvas.height - targetDynamicTextMargin) {
                    tempCtx.fillText(item.text, targetCenterX, currentYBelow);
                    currentYBelow += scaledFontSize * textSpacing;
                } else { console.warn(`DOWNLOAD: Text item '${item.id}' might be clipped below map.`); }
            });

            let currentYAbove = targetCenterY - targetVisualRadius - (tempCtx.lineWidth / 2) - targetDynamicTextMargin; // Use calculated targetVisualRadius
            tempCtx.textBaseline = 'bottom';
            [...aboveItems].reverse().forEach((item) => {
                 const scaledFontSize = applyScaledFontStyle(item);
                 if (currentYAbove - scaledFontSize >= targetDynamicTextMargin) {
                     tempCtx.fillText(item.text, targetCenterX, currentYAbove);
                     currentYAbove -= scaledFontSize * textSpacing;
                 } else { console.warn(`DOWNLOAD: Text item '${item.id}' might be clipped above map.`); }
            });
            console.log("Drew scaled text layers onto temporary canvas.");

            // --- 7. Generate Data URL from Temporary Canvas ---
            if (imageFormat === "png") {
                dataURL = tempCanvas.toDataURL("image/png");
            } else { // JPG
                dataURL = tempCanvas.toDataURL("image/jpeg", 0.95);
            }
            console.log("Generated data URL from temporary canvas.");

        } else if (imageFormat === "svg") {
            // SVG Logic remains the same - fetch directly
            console.log("SVG format selected. Requesting SVG data from API via proxy...");
            const svgRequestBody = {
                style: starMapStyleValue,
                output: { width: targetWidth, height: targetHeight, format: "svg" },
                observer: { latitude: latDecimal, longitude: lonDecimal, date: dateValue },
                view: { type: "area", parameters: { position: { equatorial: { rightAscension: lstHours, declination: latDecimal } }, ...advancedParams } }
            };
            console.log(`DEBUG: Sending SVG request to PHP proxy:`, JSON.stringify(svgRequestBody, null, 2));
            const response = await fetch('proxy/star_map_proxy.php', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'image/svg+xml' }, body: JSON.stringify(svgRequestBody) });
            console.log("Proxy response status for SVG:", response.status);
            if (!response.ok) { const errorText = await response.text(); console.error("Proxy Error Response Text (SVG):", errorText); throw new Error(`Proxy error fetching SVG: ${response.status} ${response.statusText}. ${errorText}`); }
            const svgContentType = response.headers.get('content-type');
            if (!svgContentType || !svgContentType.toLowerCase().startsWith('image/svg+xml')) { const responseText = await response.text(); console.error(`Proxy returned wrong content type for SVG. Expected image/svg+xml, got ${svgContentType}. Response:`, responseText); throw new Error(`Proxy returned wrong content type for SVG. Expected image/svg+xml, got ${svgContentType}.`); }
            const svgText = await response.text();
            if (!svgText || svgText.trim() === '') { throw new Error("Received empty SVG response from proxy."); }
            console.log(`Received SVG data (${svgText.length} bytes) from proxy.`);
            blobToDownload = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
            dataURL = URL.createObjectURL(blobToDownload);
        } else {
            alert("Invalid image type selected.");
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            return;
        }

        // --- Trigger Download ---
        link.href = dataURL;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up object URL (important for blobs)
        if (dataURL.startsWith('blob:')) {
            URL.revokeObjectURL(dataURL);
            console.log("Revoked blob object URL.");
        }

        console.log(`Star map download initiated as ${fileName}`);
        if (typeof showTemporaryMessage === 'function') {
            showTemporaryMessage("Download Started!");
        }

    } catch (error) {
        console.error("Error downloading star map:", error);
        alert("Error downloading star map: " + error.message);
    } finally {
        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
             if (loadingMessageElement) {
                 loadingMessageElement.textContent = "Generating Star Map..."; // Reset message
             }
            console.log("Hid loading indicator after download attempt.");
        }
    }
}

console.log("download.js loaded (with high-res download logic)");
/* --- END OF CODE - Cline - 2025-04-22 10:12 File: js/download.js */
