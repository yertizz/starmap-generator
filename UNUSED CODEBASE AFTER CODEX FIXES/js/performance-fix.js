// Performance Fix - Prevents the page from becoming unresponsive when generating complex star maps

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Performance Fix script loaded");
    
    // Apply performance fixes
    applyPerformanceFixes();
});

// Function to apply performance fixes
function applyPerformanceFixes() {
    console.log("Applying performance fixes");
    
    // Override the generateStarMap function to use Web Workers for heavy computations
    const originalGenerateStarMap = window.generateStarMap;
    
    // Create a new version of generateStarMap that uses setTimeout to prevent UI freezing
    window.generateStarMap = function() {
        console.log("Performance-optimized generateStarMap called");
        
        // Show loading indicator
        showLoadingIndicator();
        
        // Use setTimeout to prevent UI freezing
        setTimeout(function() {
            try {
                // Call the original function
                if (typeof originalGenerateStarMap === 'function') {
                    console.log("Calling original generateStarMap function");
                    originalGenerateStarMap();
                } else {
                    console.error("Original generateStarMap function not found, using fallback");
                    generateStarMapFallback();
                }
                
                // Hide loading indicator
                hideLoadingIndicator();
                
                console.log("Star map generated successfully with performance optimization");
            } catch (error) {
                console.error("Error generating star map:", error);
                alert("Error generating star map: " + error.message);
                
                // Hide loading indicator
                hideLoadingIndicator();
            }
        }, 100); // Small delay to allow UI to update
    };
    
    // Create loading indicator
    createLoadingIndicator();
    
    // Optimize star drawing functions if they exist
    optimizeStarDrawingFunctions();
    
    console.log("Performance fixes applied");
}

// Function to create loading indicator
function createLoadingIndicator() {
    console.log("Creating loading indicator");
    
    // Check if loading indicator already exists
    if (document.getElementById('loading-indicator')) {
        console.log("Loading indicator already exists");
        return;
    }
    
    // Create loading indicator element
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loading-indicator';
    loadingIndicator.style.display = 'none';
    loadingIndicator.style.position = 'fixed';
    loadingIndicator.style.top = '0';
    loadingIndicator.style.left = '0';
    loadingIndicator.style.width = '100%';
    loadingIndicator.style.height = '100%';
    loadingIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loadingIndicator.style.zIndex = '9999';
    loadingIndicator.style.display = 'flex';
    loadingIndicator.style.justifyContent = 'center';
    loadingIndicator.style.alignItems = 'center';
    loadingIndicator.style.flexDirection = 'column';
    
    // Create spinner
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.border = '5px solid #f3f3f3';
    spinner.style.borderTop = '5px solid #3498db';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 2s linear infinite';
    
    // Create text
    const text = document.createElement('div');
    text.textContent = 'Generating Star Map...';
    text.style.color = 'white';
    text.style.marginTop = '20px';
    text.style.fontWeight = 'bold';
    
    // Add spinner and text to loading indicator
    loadingIndicator.appendChild(spinner);
    loadingIndicator.appendChild(text);
    
    // Add loading indicator to body
    document.body.appendChild(loadingIndicator);
    
    // Add spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Hide loading indicator initially
    loadingIndicator.style.display = 'none';
    
    console.log("Loading indicator created");
}

// Function to show loading indicator
function showLoadingIndicator() {
    console.log("Showing loading indicator");
    
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
    }
}

// Function to hide loading indicator
function hideLoadingIndicator() {
    console.log("Hiding loading indicator");
    
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

// Function to optimize star drawing functions
function optimizeStarDrawingFunctions() {
    console.log("Optimizing star drawing functions");
    
    // Check if drawStars function exists
    if (typeof window.drawStars === 'function') {
        console.log("Optimizing drawStars function");
        
        // Store the original function
        const originalDrawStars = window.drawStars;
        
        // Create an optimized version
        window.drawStars = function(ctx, width, height, density) {
            console.log("Optimized drawStars function called");
            
            // Limit the number of stars based on screen size to prevent freezing
            const maxStars = 2000; // Maximum number of stars to draw
            const calculatedStars = Math.floor((width * height) / (density || 100));
            const numStars = Math.min(calculatedStars, maxStars);
            
            console.log(`Drawing ${numStars} stars (limited from ${calculatedStars})`);
            
            // Call the original function with the limited number of stars
            return originalDrawStars(ctx, width, height, Math.max(density || 100, (width * height) / maxStars));
        };
    }
    
    // Check if any star style functions exist and optimize them
    const starStyleFunctions = [
        'drawRealisticStars',
        'drawConstellationStars',
        'drawNebulaStars',
        'drawGalaxyStars',
        'drawMilkyWayStars',
        'drawNorthernLightsStars',
        'drawDeepSpaceStars',
        'drawVintageStars',
        'drawMinimalistStars'
    ];
    
    starStyleFunctions.forEach(functionName => {
        if (typeof window[functionName] === 'function') {
            console.log(`Optimizing ${functionName} function`);
            
            // Store the original function
            const originalFunction = window[functionName];
            
            // Create an optimized version
            window[functionName] = function(ctx, width, height, density) {
                console.log(`Optimized ${functionName} function called`);
                
                // Limit the number of stars based on screen size to prevent freezing
                const maxStars = 2000; // Maximum number of stars to draw
                const calculatedStars = Math.floor((width * height) / (density || 100));
                const numStars = Math.min(calculatedStars, maxStars);
                
                console.log(`Drawing ${numStars} stars (limited from ${calculatedStars})`);
                
                // Call the original function with the limited number of stars
                return originalFunction(ctx, width, height, Math.max(density || 100, (width * height) / maxStars));
            };
        }
    });
    
    console.log("Star drawing functions optimized");
}

// Fallback implementation of generateStarMap
function generateStarMapFallback() {
    console.log("Using fallback generateStarMap function");
    
    try {
        // Get the canvas
        const canvas = document.getElementById("star-map-canvas");
        if (!canvas) {
            console.error("Canvas element not found");
            alert("Error: Canvas element not found");
            return;
        }
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Could not get canvas context");
            alert("Error: Could not get canvas context");
            return;
        }
        
        // Get output dimensions from input fields
        const outputWidth = parseInt(document.getElementById("output-width").value) || 800;
        const outputHeight = parseInt(document.getElementById("output-height").value) || 1000;
        
        // Set canvas dimensions
        canvas.width = outputWidth;
        canvas.height = outputHeight;
        
        // Get colors
        const starFieldColor = document.getElementById("star-field-color").value || "#000000";
        const outsideColor = document.getElementById("outside-color").value || "#0a0e1a";
        
        // Store colors in global variables for other functions to use
        window.starFieldColor = starFieldColor;
        window.outsideColor = outsideColor;
        
        // Draw background
        ctx.fillStyle = outsideColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw star field area (upper third of the canvas)
        ctx.fillStyle = starFieldColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
        
        // Draw stars
        drawOptimizedStars(ctx, canvas.width, canvas.height);
        
        // Get text inputs
        const text1 = document.getElementById("text-entry-1").value || "";
        const text2 = document.getElementById("text-entry-2").value || "";
        const text3 = document.getElementById("text-entry-3").value || "";
        
        // Get font settings
        const font1 = document.getElementById("font-family-1").value || "Arial";
        const font2 = document.getElementById("font-family-2").value || "Arial";
        const font3 = document.getElementById("font-family-3").value || "Arial";
        
        const fontSize1 = document.getElementById("font-size-1").value || "48";
        const fontSize2 = document.getElementById("font-size-2").value || "16";
        const fontSize3 = document.getElementById("font-size-3").value || "14";
        
        const isBold1 = document.getElementById("text-bold-1").checked;
        const isBold2 = document.getElementById("text-bold-2").checked;
        const isBold3 = document.getElementById("text-bold-3").checked;
        
        const isItalic1 = document.getElementById("text-italic-1").checked;
        const isItalic2 = document.getElementById("text-italic-2").checked;
        const isItalic3 = document.getElementById("text-italic-3").checked;
        
        const color1 = document.getElementById("font-color-1").value || "#FFFFFF";
        const color2 = document.getElementById("font-color-2").value || "#FFFFFF";
        const color3 = document.getElementById("font-color-3").value || "#FFFFFF";
        
        // Draw text
        drawText(ctx, text1, font1, fontSize1, isBold1, isItalic1, color1, canvas.width / 2, canvas.height * 0.6);
        drawText(ctx, text2, font2, fontSize2, isBold2, isItalic2, color2, canvas.width / 2, canvas.height * 0.7);
        drawText(ctx, text3, font3, fontSize3, isBold3, isItalic3, color3, canvas.width / 2, canvas.height * 0.8);
        
        // Draw date and coordinates
        const date = document.getElementById("date").value;
        if (date) {
            const formattedDate = formatDate(date);
            const dateFont = document.getElementById("fixed-date-font").value || "Arial";
            const dateFontSize = document.getElementById("fixed-date-size").value || "14";
            const dateBold = document.getElementById("fixed-date-bold").checked;
            const dateItalic = document.getElementById("fixed-date-italic").checked;
            const dateColor = document.getElementById("fixed-date-color").value || "#FFFFFF";
            
            drawText(ctx, formattedDate, dateFont, dateFontSize, dateBold, dateItalic, dateColor, canvas.width / 2, canvas.height * 0.9);
        }
        
        const latitude = document.getElementById("latitude").value;
        const longitude = document.getElementById("longitude").value;
        if (latitude && longitude) {
            const formattedCoords = formatCoordinates(latitude, longitude);
            const coordsFont = document.getElementById("fixed-coords-font").value || "Arial";
            const coordsFontSize = document.getElementById("fixed-coords-size").value || "14";
            const coordsBold = document.getElementById("fixed-coords-bold").checked;
            const coordsItalic = document.getElementById("fixed-coords-italic").checked;
            const coordsColor = document.getElementById("fixed-coords-color").value || "#FFFFFF";
            
            drawText(ctx, formattedCoords, coordsFont, coordsFontSize, coordsBold, coordsItalic, coordsColor, canvas.width / 2, canvas.height * 0.95);
        }
        
        // Enable download button
        const downloadBtn = document.getElementById("downloadBtn");
        if (downloadBtn) {
            downloadBtn.removeAttribute("disabled");
            downloadBtn.classList.add("enabled");
        }
        
        console.log("Star map generated successfully");
        
        // Apply circular shape if needed
        if (typeof ensureCircularStarMap === 'function') {
            console.log("Applying circular shape");
            ensureCircularStarMap();
        }
    } catch (error) {
        console.error("Error generating star map:", error);
        alert("Error generating star map: " + error.message);
    }
}

// Optimized function to draw stars
function drawOptimizedStars(ctx, width, height) {
    console.log("Using optimized star drawing function");
    
    // Limit the number of stars to prevent freezing
    const maxStars = 2000;
    const calculatedStars = Math.floor((width * height) / 100);
    const numStars = Math.min(calculatedStars, maxStars);
    
    console.log(`Drawing ${numStars} stars (limited from ${calculatedStars})`);
    
    // Draw random stars
    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * (height / 2); // Only in the top half
        const radius = Math.random() * 1.5;
        const opacity = Math.random();
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
    }
    
    // Draw some brighter stars
    const numBrightStars = Math.floor(numStars / 20);
    
    for (let i = 0; i < numBrightStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * (height / 2); // Only in the top half
        const radius = 1 + Math.random() * 2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
    }
}

// Helper function to draw text
function drawText(ctx, text, fontFamily, fontSize, isBold, isItalic, color, x, y) {
    if (!text) return;
    
    ctx.save();
    
    // Set font style
    let fontStyle = "";
    if (isBold) fontStyle += "bold ";
    if (isItalic) fontStyle += "italic ";
    
    ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Draw text
    ctx.fillText(text, x, y);
    
    ctx.restore();
}

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    
    // Get day of week
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = weekdays[date.getDay()];
    
    // Get day of month with suffix
    const dayOfMonth = date.getDate();
    let daySuffix = 'th';
    if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
        daySuffix = 'st';
    } else if (dayOfMonth === 2 || dayOfMonth === 22) {
        daySuffix = 'nd';
    } else if (dayOfMonth === 3 || dayOfMonth === 23) {
        daySuffix = 'rd';
    }
    
    // Get month name
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()];
    
    // Get year
    const year = date.getFullYear();
    
    return `${dayOfWeek}, ${dayOfMonth}${daySuffix} ${month}, ${year}`;
}

// Function to format coordinates
function formatCoordinates(latValue, lngValue) {
    // Parse the latitude and longitude values
    let lat = parseFloat(latValue);
    let lng = parseFloat(lngValue);
    
    // Format the coordinates in DMM format
    const latDeg = Math.floor(Math.abs(lat));
    const latMin = (Math.abs(lat) - latDeg) * 60;
    const latDir = lat >= 0 ? 'N' : 'S';
    
    const lngDeg = Math.floor(Math.abs(lng));
    const lngMin = (Math.abs(lng) - lngDeg) * 60;
    const lngDir = lng >= 0 ? 'E' : 'W';
    
    // Format as N32° 56′.88113 W80° 7′.22460
    const latWholeMinutes = Math.floor(latMin);
    const latDecimalMinutes = (latMin - latWholeMinutes).toFixed(5).substring(2);
    
    const lngWholeMinutes = Math.floor(lngMin);
    const lngDecimalMinutes = (lngMin - lngWholeMinutes).toFixed(5).substring(2);
    
    return `${latDir}${latDeg}° ${latWholeMinutes}′.${latDecimalMinutes}    ${lngDir}${lngDeg}° ${lngWholeMinutes}′.${lngDecimalMinutes}`;
}
