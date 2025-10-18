// Standalone generateStarMap function

// Define the generateStarMap function globally
window.generateStarMap = function() {
    console.log("Standalone generateStarMap function called");
    
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
        if (typeof drawStars === 'function') {
            console.log("Drawing stars with function from star-map-styles.js");
            drawStars(ctx, canvas.width, canvas.height, 80);
        } else {
            console.log("Using fallback star drawing");
            drawFallbackStars(ctx, canvas.width, canvas.height);
        }
        
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
};

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

// Fallback function to format date
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

// Fallback function to format coordinates
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

// Fallback function to draw stars
function drawFallbackStars(ctx, width, height) {
    console.log("Using fallback star drawing function");
    
    // Draw random stars
    const numStars = Math.floor((width * height) / 100);
    
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

// Fallback function to download star map
window.downloadStarMap = function() {
    try {
        // Get the canvas
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) {
            console.error("Canvas not found");
            return;
        }
        
        // Get selected image type
        const isPng = document.getElementById("image-type-png").checked;
        const isJpg = document.getElementById("image-type-jpg").checked;
        const isSvg = document.getElementById("image-type-svg").checked;
        let imageType = isPng ? "png" : (isJpg ? "jpg" : (isSvg ? "svg" : "png")); // Default to PNG
        
        // Get the date for the filename
        const date = document.getElementById("date").value;
        const dateObj = new Date(date);
        const formattedDate = dateObj.toISOString().split('T')[0];
        
        // Get the first text entry for the filename
        const title = document.getElementById("text-entry-1").value || "star_map";
        const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        const link = document.createElement("a");
        
        if (imageType === "png") {
            // For PNG
            const dataURL = canvas.toDataURL("image/png");
            link.href = dataURL;
            link.download = `${safeTitle}_${formattedDate}.png`;
        } else if (imageType === "jpg") {
            // JPG doesn't support transparency
            const dataURL = canvas.toDataURL("image/jpeg", 0.9); // Quality 0.9 for JPG
            link.href = dataURL;
            link.download = `${safeTitle}_${formattedDate}.jpg`;
        } else if (imageType === "svg") {
            // Create simple SVG content
            const width = canvas.width;
            const height = canvas.height;
            
            // Start SVG content
            let svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
`;
            
            // Add background rectangle
            const outsideColor = document.getElementById("outside-color")?.value || "#0a0e1a";
            svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="${outsideColor}" />`;
            
            // Add star field rectangle
            const starFieldColor = document.getElementById("star-field-color")?.value || "#000000";
            svg += `<rect x="0" y="0" width="${width}" height="${height/2}" fill="${starFieldColor}" />`;
            
            // Close the SVG
            svg += `</svg>`;
            
            const blob = new Blob([svg], {type: 'image/svg+xml'});
            const dataURL = URL.createObjectURL(blob);
            link.href = dataURL;
            link.download = `${safeTitle}_${formattedDate}.svg`;
        } else {
            alert("Please select an image type (PNG, JPG, or SVG).");
            return;
        }
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up object URL if SVG
        if (imageType === "svg") {
            URL.revokeObjectURL(link.href);
        }
        
        console.log("Star map downloaded successfully");
    } catch (error) {
        console.error("Error downloading star map:", error);
        alert("There was an error downloading the star map. Please try again.");
    }
};

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Standalone generateStarMap.js loaded");
    
    // Get the generate button
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        // Add click event listener
        generateBtn.addEventListener('click', function() {
            console.log("Generate button clicked");
            
            // Check if the button is disabled
            if (generateBtn.hasAttribute('disabled')) {
                console.log("Button is disabled, not generating");
                return;
            }
            
            // Call the generateStarMap function
            window.generateStarMap();
        });
    }
});
