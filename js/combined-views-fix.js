/**
 * Combined Views Fix
 * Fixes text placement and overlapping circles for landscape/portrait combined views
 */

(function() {
    'use strict';
    
    console.log('Combined Views Fix: Initializing...');
    
    // Wait for dependencies
    function waitForDependencies() {
        if (!window.PerfectCircleCalculator || !window.CanvasDrawingUtils) {
            setTimeout(waitForDependencies, 100);
            return;
        }
        initialize();
    }
    
    const calc = window.PerfectCircleCalculator;
    const draw = window.CanvasDrawingUtils;
    
    /**
     * Get text layer data (same as in star-map-circle-fix.js)
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
            textData.push({
                text: (typeof formatDate === 'function') ? formatDate(dateValue) : dateValue,
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
     * Draw text for combined landscape view
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
     * Draw text for combined portrait view
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
     * Override landscape view with proper implementation
     */
    function overrideViewLandscape() {
        const original = window.viewStarStreetLandscape;
        
        window.viewStarStreetLandscape = function() {
            console.log('Combined Views Fix: Landscape view');
            
            if (!validateCoordinates()) {
                alert("Please enter valid coordinates or a location first.");
                return;
            }
            
            window.currentViewType = 'star-street-landscape';
            
            const canvas = document.getElementById('star-map-canvas');
            const ctx = canvas.getContext('2d');
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Background
            const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Get settings
            const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
            const borderWidth = parseInt(document.getElementById('border-width').value) || 2;
            const borderColor = document.getElementById('border-color').value || '#FDCA0D';
            
            // Calculate overlapping circles using user setting
            const overlapPercent = window.combinedViewSettings?.overlapPercent || 30;
            const circles = calc.calculateLandscapeCircles(canvas.width, canvas.height, radiusPercent, overlapPercent);
            
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
            
            // Draw Street Map (left circle)
            const mapSize = Math.min(circles.left.diameter, 640);
            const streetMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=${mapSize}x${mapSize}&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
            
            const streetMapImg = new Image();
            streetMapImg.crossOrigin = "Anonymous";
            streetMapImg.onload = function() {
                // Draw left circle with street map
                ctx.save();
                draw.createCircularClip(ctx, circles.left);
                draw.drawImageInCircle(ctx, streetMapImg, circles.left);
                ctx.restore();
                draw.drawCircleBorder(ctx, circles.left, borderWidth, borderColor);
                
                // Add label
                ctx.save();
                ctx.font = '16px Arial';
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.fillText('Street Map', circles.left.centerX, circles.left.centerY + circles.left.radius + 20);
                ctx.restore();
            };
            streetMapImg.src = streetMapUrl;
            
            // Draw Star Map (right circle)
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
            
            fetch('proxy/star_map_proxy.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'image/png' },
                body: JSON.stringify(requestBody)
            })
            .then(response => response.blob())
            .then(blob => {
                const starMapUrl = URL.createObjectURL(blob);
                const starMapImg = new Image();
                starMapImg.crossOrigin = "Anonymous";
                
                starMapImg.onload = function() {
                    // Draw right circle with star map
                    ctx.save();
                    draw.createCircularClip(ctx, circles.right);
                    draw.drawImageInCircle(ctx, starMapImg, circles.right);
                    ctx.restore();
                    draw.drawCircleBorder(ctx, circles.right, borderWidth, borderColor);
                    
                    // Add label
                    ctx.save();
                    ctx.font = '16px Arial';
                    ctx.fillStyle = '#FFFFFF';
                    ctx.textAlign = 'center';
                    ctx.fillText('Star Map', circles.right.centerX, circles.right.centerY + circles.right.radius + 20);
                    ctx.restore();
                    
                    // Draw text layers
                    drawLandscapeText(ctx, circles, borderWidth);
                    
                    URL.revokeObjectURL(starMapUrl);
                };
                
                starMapImg.src = starMapUrl;
            });
            
            // Enable download button
            document.getElementById('download-star-street-landscape-btn').disabled = false;
        };
    }
    
    /**
     * Override portrait view with proper implementation
     */
    function overrideViewPortrait() {
        const original = window.viewStarStreetPortrait;
        
        window.viewStarStreetPortrait = function() {
            console.log('Combined Views Fix: Portrait view');
            
            if (!validateCoordinates()) {
                alert("Please enter valid coordinates or a location first.");
                return;
            }
            
            window.currentViewType = 'star-street-portrait';
            
            const canvas = document.getElementById('star-map-canvas');
            const ctx = canvas.getContext('2d');
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Background
            const bgColor = document.getElementById('bg-color-canvas').value || '#F5F5DC';
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Get settings
            const radiusPercent = parseInt(document.getElementById('circle-radius-percent').value) || 60;
            const borderWidth = parseInt(document.getElementById('border-width').value) || 2;
            const borderColor = document.getElementById('border-color').value || '#FDCA0D';
            
            // Calculate overlapping circles using user setting
            const overlapPercent = window.combinedViewSettings?.overlapPercent || 30;
            const circles = calc.calculatePortraitCircles(canvas.width, canvas.height, radiusPercent, overlapPercent);
            
            // Get coordinates (same as landscape)
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
            
            const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
            const starMapStyle = document.getElementById('star-map-style').value || 'default';
            const apiKey = "AIzaSyCpvv1IJYxwGVMh24MLFDH6LmupseApSZU";
            
            // Draw Street Map (top circle)
            const mapSize = Math.min(circles.top.diameter, 640);
            const streetMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=${mapSize}x${mapSize}&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
            
            const streetMapImg = new Image();
            streetMapImg.crossOrigin = "Anonymous";
            streetMapImg.onload = function() {
                // Draw top circle with street map
                ctx.save();
                draw.createCircularClip(ctx, circles.top);
                draw.drawImageInCircle(ctx, streetMapImg, circles.top);
                ctx.restore();
                draw.drawCircleBorder(ctx, circles.top, borderWidth, borderColor);
                
                // Add label
                ctx.save();
                ctx.font = '16px Arial';
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.fillText('Street Map', circles.top.centerX, circles.top.centerY + 20);
                ctx.restore();
            };
            streetMapImg.src = streetMapUrl;
            
            // Draw Star Map (bottom circle)
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
            
            fetch('proxy/star_map_proxy.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'image/png' },
                body: JSON.stringify(requestBody)
            })
            .then(response => response.blob())
            .then(blob => {
                const starMapUrl = URL.createObjectURL(blob);
                const starMapImg = new Image();
                starMapImg.crossOrigin = "Anonymous";
                
                starMapImg.onload = function() {
                    // Draw bottom circle with star map
                    ctx.save();
                    draw.createCircularClip(ctx, circles.bottom);
                    draw.drawImageInCircle(ctx, starMapImg, circles.bottom);
                    ctx.restore();
                    draw.drawCircleBorder(ctx, circles.bottom, borderWidth, borderColor);
                    
                    // Add label
                    ctx.save();
                    ctx.font = '16px Arial';
                    ctx.fillStyle = '#FFFFFF';
                    ctx.textAlign = 'center';
                    ctx.fillText('Star Map', circles.bottom.centerX, circles.bottom.centerY + 20);
                    ctx.restore();
                    
                    // Draw text layers
                    drawPortraitText(ctx, circles, borderWidth);
                    
                    URL.revokeObjectURL(starMapUrl);
                };
                
                starMapImg.src = starMapUrl;
            });
            
            // Enable download button
            document.getElementById('download-star-street-portrait-btn').disabled = false;
        };
    }
    
    /**
     * Initialize overrides
     */
    function initialize() {
        overrideViewLandscape();
        overrideViewPortrait();
        console.log('Combined Views Fix: All overrides applied');
    }
    
    // Start waiting for dependencies
    waitForDependencies();
    
})();
