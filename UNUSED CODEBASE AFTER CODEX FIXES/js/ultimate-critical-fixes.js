/**
 * Ultimate Critical Fixes
 * Comprehensive fix for view buttons, canvas rendering, and zoom slider interaction
 * 
 * This script addresses the following issues:
 * 1. Canvas state not being properly reset between view button clicks
 * 2. Zoom slider interaction causing display issues
 * 3. Combined view settings (overlap percentage and map order) not being properly applied
 * 4. Canvas orientation issues for different view types
 */

(function() {
    'use strict';
    
    console.log('Ultimate Critical Fixes: Initializing...');
    
    // Wait for dependencies
    function waitForDependencies() {
        if (!window.PerfectCircleCalculator || !window.CanvasDrawingUtils) {
            console.log('Ultimate Critical Fixes: Waiting for dependencies...');
            setTimeout(waitForDependencies, 100);
            return;
        }
        initialize();
    }
    
    const calc = window.PerfectCircleCalculator;
    const draw = window.CanvasDrawingUtils;
    
    // Track current view state
    let currentViewState = {
        type: null,  // 'star-map', 'street-map', 'canvas-layout', 'combined-landscape', 'combined-portrait'
        circles: null, // Circle data for the current view
        zoomLevel: 100 // Current zoom level
    };
    
    /**
     * Reset canvas state completely
     * This ensures no leftover transformations or clipping paths
     */
    function resetCanvasState() {
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) return;
        
        // Store original dimensions
        const originalWidth = canvas.width;
        const originalHeight = canvas.height;
        
        // Get context and reset transformations
        const ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Clear canvas completely
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Reset canvas by recreating it
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'star-map-canvas';
        newCanvas.width = originalWidth;
        newCanvas.height = originalHeight;
        newCanvas.style.cssText = canvas.style.cssText;
        
        // Replace old canvas with new one
        canvas.parentNode.replaceChild(newCanvas, canvas);
        
        console.log('Ultimate Critical Fixes: Canvas state reset');
        return newCanvas.getContext('2d');
    }
    
    /**
     * Set canvas dimensions based on paper size and orientation
     */
    function setCanvasDimensions(orientation) {
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) return;
        
        // Get paper size dimensions
        let width, height;
        const paperSize = document.getElementById('paper-auto-size');
        const dpiSelector = document.getElementById('dpi-selector');
        const dpi = dpiSelector ? parseInt(dpiSelector.value) : 300;
        
        // Get dimensions from paper-size-dimensions.js if available
        if (window.PaperSizeDimensions && paperSize && paperSize.value) {
            const dimensions = window.PaperSizeDimensions.getDimensions(paperSize.value, dpi);
            if (dimensions) {
                width = dimensions.width;
                height = dimensions.height;
            }
        }
        
        // Fallback to manual dimensions
        if (!width || !height) {
            width = parseInt(document.getElementById('output-width').value) || 2550;
            height = parseInt(document.getElementById('output-height').value) || 3300;
        }
        
        // Adjust for orientation
        if (orientation === 'landscape' && width < height) {
            [width, height] = [height, width];
        } else if (orientation === 'portrait' && width > height) {
            [width, height] = [height, width];
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Fix display style
        canvas.style.height = 'auto';
        canvas.style.maxHeight = '600px';
        canvas.style.width = 'auto';
        canvas.style.maxWidth = '100%';
        
        console.log(`Ultimate Critical Fixes: Canvas dimensions set to ${width}x${height} for ${orientation} orientation`);
    }
    
    /**
     * Apply zoom to the current view
     * This is called when the zoom slider is changed
     */
    function applyZoom(zoomLevel) {
        // Store current zoom level
        currentViewState.zoomLevel = zoomLevel;
        
        // Redraw the current view with the new zoom level
        switch (currentViewState.type) {
            case 'star-map':
                viewStarMap();
                break;
            case 'street-map':
                viewStreetMap();
                break;
            case 'canvas-layout':
                viewStarMapCanvas();
                break;
            case 'combined-landscape':
                viewStarStreetLandscape();
                break;
            case 'combined-portrait':
                viewStarStreetPortrait();
                break;
        }
    }
    
    /**
     * Get text layer data
     */
    function getTextLayerData() {
        const getVal = (id, def) => document.getElementById(id)?.value || def;
        const getInt = (id, def) => parseInt(getVal(id, def)) || def;
        const getChecked = id => document.getElementById(id)?.checked || false;
        const getRadioVal = (name, def) => {
            const checked = document.querySelector(`input[name="${name}"]:checked`);
            return checked ? checked.value : def;
        };
        
        const textData = [];
        
        // Collect text entries
        for (let i = 1; i <= 4; i++) {
            const text = getVal(`text-entry-${i}`, '');
            if (text.trim()) {
                textData.push({
                    text: text,
                    fontFamily: getVal(`font-family-${i}`, 'Montserrat'),
                    fontSize: getInt(`font-size-${i}`, i === 1 ? 28 : 16),
                    fontColor: getVal(`font-color-${i}`, '#FFFFFF'),
                    isBold: getChecked(`text-bold-${i}`),
                    isItalic: getChecked(`text-italic-${i}`),
                    order: getInt(`text-placement-order-${i}`, i),
                    position: getRadioVal(`text-placement-pos-${i}`, 'below')
                });
            }
        }
        
        // Add fixed layers
        const dateValue = getVal('date', '');
        if (dateValue) {
            // Format date with time if available and enabled
            let dateText = dateValue;
            if (typeof formatDate === 'function') {
                dateText = formatDate(dateValue);
            } else {
                // Basic date formatting
                const date = new Date(dateValue);
                dateText = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
            
            // Add time if available and enabled
            const timeValue = getVal('time', '');
            const showTimeToggle = document.getElementById('show-time-toggle');
            const showTime = showTimeToggle ? showTimeToggle.checked : true;
            
            if (showTime && timeValue) {
                const [hours, minutes] = timeValue.split(':').map(Number);
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const displayHours = hours % 12 || 12;
                dateText += `, ${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
            }
            
            textData.push({
                text: dateText,
                fontFamily: getVal('fixed-font-family-date', 'Arial'),
                fontSize: getInt('fixed-font-size-date', 14),
                fontColor: getVal('fixed-font-color-date', '#FFFFFF'),
                isBold: getChecked('fixed-text-bold-date'),
                isItalic: getChecked('fixed-text-italic-date'),
                order: getInt('text-placement-order-date', 5),
                position: getRadioVal('text-placement-pos-date', 'below')
            });
        }
        
        const latVal = getVal('latitude', '');
        const lonVal = getVal('longitude', '');
        if (latVal && lonVal) {
            textData.push({
                text: `${latVal} | ${lonVal}`,
                fontFamily: getVal('fixed-font-family-coords', 'Arial'),
                fontSize: getInt('fixed-font-size-coords', 14),
                fontColor: getVal('fixed-font-color-coords', '#FFFFFF'),
                isBold: getChecked('fixed-text-bold-coords'),
                isItalic: getChecked('fixed-text-italic-coords'),
                order: getInt('text-placement-order-coords', 6),
                position: getRadioVal('text-placement-pos-coords', 'below')
            });
        }
        
        return textData.sort((a, b) => a.order - b.order);
    }
    
    /**
     * Draw text for single circle view
     */
    function drawSingleCircleText(ctx, circle, borderWidth) {
        const textData = getTextLayerData();
        if (textData.length === 0) return;
        
        const aboveItems = textData.filter(item => item.position === 'above');
        const belowItems = textData.filter(item => item.position === 'below');
        
        ctx.save();
        ctx.textAlign = 'center';
        
        const margin = circle.radius * 0.1;
        const textSpacing = 1.2;
        
        // Draw below items
        let currentY = circle.centerY + circle.radius + borderWidth + margin;
        ctx.textBaseline = 'top';
        
        belowItems.forEach(item => {
            const fontSize = draw.applyTextStyle(ctx, item);
            ctx.fillText(item.text, circle.centerX, currentY);
            currentY += fontSize * textSpacing;
        });
        
        // Draw above items
        currentY = circle.centerY - circle.radius - borderWidth - margin;
        ctx.textBaseline = 'bottom';
        
        aboveItems.reverse().forEach(item => {
            const fontSize = draw.applyTextStyle(ctx, item);
            ctx.fillText(item.text, circle.centerX, currentY);
            currentY -= fontSize * textSpacing;
        });
        
        ctx.restore();
    }
    
    /**
     * Draw text for landscape view
     */
    function drawLandscapeText(ctx, circles, borderWidth) {
        const textData = getTextLayerData();
        if (textData.length === 0) return;
        
        const aboveItems = textData.filter(item => item.position === 'above');
        const belowItems = textData.filter(item => item.position === 'below');
        
        ctx.save();
        ctx.textAlign = 'center';
        
        const textSpacing = 1.2;
        const margin = circles.left.radius * 0.1;
        
        // Calculate center point between circles
        const centerX = (circles.left.centerX + circles.right.centerX) / 2;
        
        // Draw below items
        const bottomY = Math.max(
            circles.left.centerY + circles.left.radius,
            circles.right.centerY + circles.right.radius
        );
        let currentY = bottomY + borderWidth + margin;
        ctx.textBaseline = 'top';
        
        belowItems.forEach(item => {
            const fontSize = draw.applyTextStyle(ctx, item);
            ctx.fillText(item.text, centerX, currentY);
            currentY += fontSize * textSpacing;
        });
        
        // Draw above items
        const topY = Math.min(
            circles.left.centerY - circles.left.radius,
            circles.right.centerY - circles.right.radius
        );
        currentY = topY - borderWidth - margin;
        ctx.textBaseline = 'bottom';
        
        aboveItems.reverse().forEach(item => {
            const fontSize = draw.applyTextStyle(ctx, item);
            ctx.fillText(item.text, centerX, currentY);
            currentY -= fontSize * textSpacing;
        });
        
        ctx.restore();
    }
    
    /**
     * Draw text for portrait view
     */
    function drawPortraitText(ctx, circles, borderWidth) {
        const textData = getTextLayerData();
        if (textData.length === 0) return;
        
        const aboveItems = textData.filter(item => item.position === 'above');
        const belowItems = textData.filter(item => item.position === 'below');
        
        ctx.save();
        ctx.textAlign = 'center';
        
        const textSpacing = 1.2;
        const margin = circles.top.radius * 0.1;
        
        // Draw below items
        const bottomCircle = circles.bottom;
        let currentY = bottomCircle.centerY + bottomCircle.radius + borderWidth + margin;
        ctx.textBaseline = 'top';
        
        belowItems.forEach(item => {
            const fontSize = draw.applyTextStyle(ctx, item);
            ctx.fillText(item.text, bottomCircle.centerX, currentY);
            currentY += fontSize * textSpacing;
        });
        
        // Draw above items
        const topCircle = circles.top;
        currentY = topCircle.centerY - topCircle.radius - borderWidth - margin;
        ctx.textBaseline = 'bottom';
        
        aboveItems.reverse().forEach(item => {
            const fontSize = draw.applyTextStyle(ctx, item);
            ctx.fillText(item.text, topCircle.centerX, currentY);
            currentY -= fontSize * textSpacing;
        });
        
        ctx.restore();
    }
    
    /**
     * Validate coordinates
     */
    function validateCoordinates() {
        const lat = document.getElementById('latitude').value;
        const lng = document.getElementById('longitude').value;
        return lat && lng;
    }
    
    /**
     * Override viewStarMap function
     */
    function overrideViewStarMap() {
        window.viewStarMap = function() {
            console.log('Ultimate Critical Fixes: Using fixed viewStarMap');
            
            if (!validateCoordinates()) {
                alert("Please enter valid coordinates or a location first.");
                return;
            }
            
            // Update current view state
            currentViewState.type = 'star-map';
            
            // Reset canvas state
            setCanvasDimensions('portrait'); // Default to portrait
            const ctx = resetCanvasState();
            
            // Background
            const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
            draw.clearCanvas(ctx, document.getElementById('star-map-canvas').width, 
                            document.getElementById('star-map-canvas').height, bgColor);
            
            // Calculate perfect circle
            const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
            const circle = calc.calculatePerfectCircle(
                document.getElementById('star-map-canvas').width,
                document.getElementById('star-map-canvas').height,
                radiusPercent
            );
            
            // Store circle data
            currentViewState.circles = { single: circle };
            
            // Border settings
            const borderWidth = parseInt(document.getElementById('border-width').value) || 1;
            const borderColor = document.getElementById('border-color').value || '#FFFFFF';
            
            // Get coordinates
            const latString = document.getElementById('latitude').value;
            const lngString = document.getElementById('longitude').value;
            let lat, lng;
            
            if (typeof parseFormattedCoordinate === 'function') {
                lat = parseFormattedCoordinate(latString, 'latitude');
                lng = parseFormattedCoordinate(lngString, 'longitude');
            } else {
                lat = parseFloat(latString);
                lng = parseFloat(lngString);
            }
            
            // Get other parameters
            const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
            const starMapStyle = document.getElementById('star-map-style').value || 'default';
            
            // Calculate LST if function available
            let lstHours = 0;
            if (typeof calculateLST === 'function') {
                lstHours = calculateLST(date, lng);
            }
            
            // Show loading indicator
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) loadingIndicator.style.display = 'flex';
            
            // API request
            const requestBody = {
                style: starMapStyle,
                output: { width: 1000, height: 1000, format: "png" },
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
                        backgroundColor: "#000033"
                    }
                }
            };
            
            fetch('proxy/star_map_proxy.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'image/png' },
                body: JSON.stringify(requestBody)
            })
            .then(response => response.blob())
            .then(blob => {
                // Hide loading indicator
                if (loadingIndicator) loadingIndicator.style.display = 'none';
                
                // Store blob for download
                window.lastGeneratedMapBlob = blob;
                
                // Create image from blob
                const starMapUrl = URL.createObjectURL(blob);
                const starMapImg = new Image();
                starMapImg.crossOrigin = "Anonymous";
                
                starMapImg.onload = function() {
                    // Only proceed if we're still in star map view
                    if (currentViewState.type !== 'star-map') {
                        URL.revokeObjectURL(starMapUrl);
                        return;
                    }
                    
                    // Clear canvas and draw background again
                    ctx.clearRect(0, 0, document.getElementById('star-map-canvas').width, 
                                document.getElementById('star-map-canvas').height);
                    draw.clearCanvas(ctx, document.getElementById('star-map-canvas').width, 
                                    document.getElementById('star-map-canvas').height, bgColor);
                    
                    // Create circular clip
                    draw.createCircularClip(ctx, circle);
                    
                    // Draw image with zoom
                    draw.drawImageInCircle(ctx, starMapImg, circle, currentViewState.zoomLevel);
                    
                    // Restore context to remove clip
                    ctx.restore();
                    
                    // Draw border
                    draw.drawCircleBorder(ctx, circle, borderWidth, borderColor);
                    
                    // Draw text layers
                    drawSingleCircleText(ctx, circle, borderWidth);
                    
                    // Clean up
                    URL.revokeObjectURL(starMapUrl);
                    
                    // Enable download button
                    document.getElementById('download-star-map-btn').disabled = false;
                };
                
                starMapImg.src = starMapUrl;
            })
            .catch(error => {
                console.error('Error fetching star map:', error);
                if (loadingIndicator) loadingIndicator.style.display = 'none';
                alert('Error generating star map. Please try again.');
            });
        };
    }
    
    /**
     * Override viewStreetMap function
     */
    function overrideViewStreetMap() {
        window.viewStreetMap = function() {
            console.log('Ultimate Critical Fixes: Using fixed viewStreetMap');
            
            if (!validateCoordinates()) {
                alert("Please enter valid coordinates or a location first.");
                return;
            }
            
            // Update current view state
            currentViewState.type = 'street-map';
            
            // Reset canvas state
            setCanvasDimensions('portrait'); // Default to portrait
            const ctx = resetCanvasState();
            
            // Background
            const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
            draw.clearCanvas(ctx, document.getElementById('star-map-canvas').width, 
                            document.getElementById('star-map-canvas').height, bgColor);
            
            // Calculate perfect circle
            const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
            const circle = calc.calculatePerfectCircle(
                document.getElementById('star-map-canvas').width,
                document.getElementById('star-map-canvas').height,
                radiusPercent
            );
            
            // Store circle data
            currentViewState.circles = { single: circle };
            
            // Border settings
            const borderWidth = parseInt(document.getElementById('border-width').value) || 1;
            const borderColor = document.getElementById('border-color').value || '#FFFFFF';
            
            // Get coordinates
            const latString = document.getElementById('latitude').value;
            const lngString = document.getElementById('longitude').value;
            let lat, lng;
            
            if (typeof parseFormattedCoordinate === 'function') {
                lat = parseFormattedCoordinate(latString, 'latitude');
                lng = parseFormattedCoordinate(lngString, 'longitude');
            } else {
                lat = parseFloat(latString);
                lng = parseFloat(lngString);
            }
            
            // Google Maps API
            const apiKey = "AIzaSyCpvv1IJYxwGVMh24MLFDH6LmupseApSZU";
            const mapSize = Math.min(circle.diameter, 640);
            const streetMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=${mapSize}x${mapSize}&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
            
            const streetMapImg = new Image();
            streetMapImg.crossOrigin = "Anonymous";
            
            streetMapImg.onload = function() {
                // Only proceed if we're still in street map view
                if (currentViewState.type !== 'street-map') return;
                
                // Clear canvas and draw background again
                ctx.clearRect(0, 0, document.getElementById('star-map-canvas').width, 
                            document.getElementById('star-map-canvas').height);
                draw.clearCanvas(ctx, document.getElementById('star-map-canvas').width, 
                                document.getElementById('star-map-canvas').height, bgColor);
                
                // Create circular clip
                draw.createCircularClip(ctx, circle);
                
                // Draw image with zoom
                draw.drawImageInCircle(ctx, streetMapImg, circle, currentViewState.zoomLevel);
                
                // Restore context to remove clip
                ctx.restore();
                
                // Draw border
                draw.drawCircleBorder(ctx, circle, borderWidth, borderColor);
                
                // Draw text layers
                drawSingleCircleText(ctx, circle, borderWidth);
                
                // Enable download button
                document.getElementById('download-street-map-btn').disabled = false;
            };
            
            streetMapImg.onerror = function() {
                console.error('Error loading street map image');
                alert('Error loading street map. Please check your internet connection and try again.');
            };
            
            streetMapImg.src = streetMapUrl;
        };
    }
    
    /**
     * Override viewStarMapCanvas function
     */
    function overrideViewStarMapCanvas() {
        window.viewStarMapCanvas = function() {
            console.log('Ultimate Critical Fixes: Using fixed viewStarMapCanvas');
            
            if (!validateCoordinates()) {
                alert("Please enter valid coordinates or a location first.");
                return;
            }
            
            // Update current view state
            currentViewState.type = 'canvas-layout';
            
            // Reset canvas state
            setCanvasDimensions('portrait'); // Default to portrait
            const ctx = resetCanvasState();
            
            // Background
            const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
            draw.clearCanvas(ctx, document.getElementById('star-map-canvas').width, 
                            document.getElementById('star-map-canvas').height, bgColor);
            
            // Calculate perfect circle
            const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
            const circle = calc.calculatePerfectCircle(
                document.getElementById('star-map-canvas').width,
                document.getElementById('star-map-canvas').height,
                radiusPercent
            );
            
            // Store circle data
            currentViewState.circles = { single: circle };
            
            // Border settings
            const borderWidth = parseInt(document.getElementById('border-width').value) || 1;
            const borderColor = document.getElementById('border-color').value || '#FFFFFF';
            
            // Draw border
            draw.drawCircleBorder(ctx, circle, borderWidth, borderColor);
            
            // Draw text layers
            drawSingleCircleText(ctx, circle, borderWidth);
            
            // Enable download button
            document.getElementById('download-star-map-canvas-btn').disabled = false;
        };
    }
    
    /**
     * Override viewStarStreetLandscape function
     */
    function overrideViewStarStreetLandscape() {
        window.viewStarStreetLandscape = function() {
            console.log('Ultimate Critical Fixes: Using fixed viewStarStreetLandscape');
            
            if (!validateCoordinates()) {
                alert("Please enter valid coordinates or a location first.");
                return;
            }
            
            // Update current view state
            currentViewState.type = 'combined-landscape';
            
            // Reset canvas state
            setCanvasDimensions('landscape');
            const ctx = resetCanvasState();
            const canvas = document.getElementById('star-map-canvas');
            
            // Background
            const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
            draw.clearCanvas(ctx, canvas.width, canvas.height, bgColor);
            
            // Get settings
            const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
            const borderWidth = parseInt(document.getElementById('border-width').value) || 2;
            const borderColor = document.getElementById('border-color').value || '#FDCA0D';
            
            // Get combined view settings
            const overlapPercent = window.combinedViewSettings?.overlapPercent || 30;
            const streetMapFirst = window.combinedViewSettings?.streetMapFirst !== false;
            
            // Calculate overlapping circles
            let circles = calc.calculateLandscapeCircles(canvas.width, canvas.height, radiusPercent, overlapPercent);
            
            // Store circle data
            currentViewState.circles = circles;
            
            // Get coordinates
            const latString = document.getElementById('latitude').value;
            const lngString = document.getElementById('longitude').value;
            let lat, lng;
            
            if (typeof parseFormattedCoordinate === 'function') {
                lat = parseFormattedCoordinate(latString, 'latitude');
                lng = parseFormattedCoordinate(lngString, 'longitude');
            } else {
                lat = parseFloat(latString);
                lng = parseFloat(lngString);
            }
            
            // Get other parameters
            const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
            const starMapStyle = document.getElementById('star-map-style').value || 'default';
            const apiKey = "AIzaSyCpvv1IJYxwGVMh24MLFDH6LmupseApSZU";
            
            // Determine which circle is for which map based on map order setting
            const streetMapCircle = streetMapFirst ? circles.left : circles.right;
            const starMapCircle = streetMapFirst ? circles.right : circles.left;
            
            // Draw Street Map
            const mapSize = Math.min(streetMapCircle.diameter, 640);
            const streetMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=${mapSize}x${mapSize}&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
            
            const streetMapImg = new Image();
            streetMapImg.crossOrigin = "Anonymous";
            streetMapImg.onload = function() {
                // Only proceed if we're still in landscape view
                if (currentViewState.type !== 'combined-landscape') return;
                
                // Draw street map circle
                ctx.save();
                draw.createCircularClip(ctx, streetMapCircle);
                draw.drawImageInCircle(ctx, streetMapImg, streetMapCircle, currentViewState.zoomLevel);
                ctx.restore();
                draw.drawCircleBorder(ctx, streetMapCircle, borderWidth, borderColor);
                
                // Add label
                ctx.save();
                ctx.font = '16px Arial';
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.fillText('Street Map', streetMapCircle.centerX, streetMapCircle.centerY + streetMapCircle.radius + 20);
                ctx.restore();
            };
            streetMapImg.src = streetMapUrl;
            
            // Draw Star Map
            let lstHours = 0;
            if (typeof calculateLST === 'function') {
                lstHours = calculateLST(date, lng);
            }
            
            const requestBody = {
                style: starMapStyle,
                output: { width: 1000, height: 1000, format: "png" },
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
                        backgroundColor: "#000033"
                    }
                }
            };
            
            // Show loading indicator
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) loadingIndicator.style.display = 'flex';
            
            fetch('proxy/star_map_proxy.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'image/png' },
                body: JSON.stringify(requestBody)
            })
            .then(response => response.blob())
            .then(blob => {
                // Hide loading indicator
                if (loadingIndicator) loadingIndicator.style.display = 'none';
                
                // Store blob for download
                window.lastGeneratedMapBlob = blob;
                
                const starMapUrl = URL.createObjectURL(blob);
                const starMapImg = new Image();
                starMapImg.crossOrigin = "Anonymous";
                
                starMapImg.onload = function() {
                    // Only
