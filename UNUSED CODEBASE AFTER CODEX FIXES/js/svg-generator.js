// SVG Generator - Handles SVG generation for star maps

// Function to escape XML special characters for SVG
function escapeXml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

// Function to generate SVG content from canvas
function generateSVG(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Start SVG content
    let svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
`;
    
    // Add background rectangle
    const outsideColor = document.getElementById("outside-color").value;
    svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="${outsideColor}" />`;
    
    // Add star field circle
    const centerX = width / 2;
    const centerY = height / 3;
    
    // For large dimensions, use a smaller percentage
    const smallerDimension = Math.min(width, height);
    let radius;
    if (smallerDimension > 2000) {
        radius = smallerDimension * 0.25; // Smaller percentage for large dimensions
    } else {
        radius = smallerDimension * 0.3; // Standard percentage for normal dimensions
    }
    const starFieldColor = document.getElementById("star-field-color").value;
    
    svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="${starFieldColor}" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2" />`;
    
    // Add stars inside the circle
    const numStars = 500; // Increased number of stars
    for (let i = 0; i < numStars; i++) {
        // Generate random position within the circle
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius * 0.9; // Stay within 90% of radius to avoid edge
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        // Random star size and opacity
        const starRadius = Math.random() * 1.5 + 0.5;
        const opacity = Math.random() * 0.8 + 0.2;
        
        svg += `<circle cx="${x}" cy="${y}" r="${starRadius}" fill="rgba(255, 255, 255, ${opacity})" class="star-field-svg" />`;
    }
    
    // Add some brighter stars
    const numBrightStars = Math.floor(numStars / 20);
    for (let i = 0; i < numBrightStars; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius * 0.9;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        const starRadius = Math.random() * 2 + 1;
        
        svg += `<circle cx="${x}" cy="${y}" r="${starRadius}" fill="rgba(255, 255, 255, 0.9)" class="star-field-svg" />`;
    }
    
    // Get text layers
    const textLayers = [];
    for (let i = 1; i <= 3; i++) {
        const text = document.getElementById(`text-entry-${i}`).value;
        if (text) {
            const fontFamily = document.getElementById(`font-family-${i}`).value;
            const fontSize = document.getElementById(`font-size-${i}`).value;
            const fontColor = document.getElementById(`font-color-${i}`).value;
            const isBold = document.getElementById(`text-bold-${i}`).checked;
            const isItalic = document.getElementById(`text-italic-${i}`).checked;
            
            textLayers.push({ text, fontFamily, fontSize, fontColor, isBold, isItalic });
        }
    }
    
    // Get date and coordinates
    const date = document.getElementById("date").value;
    const formattedDate = formatDateForStarMap(date);
    
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;
    const formattedCoordinates = formatCoordinatesForStarMap(latitude, longitude);
    
    // Get fixed text styling
    const dateFont = document.getElementById("fixed-date-font").value;
    const dateSize = document.getElementById("fixed-date-size").value;
    const dateBold = document.getElementById("fixed-date-bold").checked;
    const dateItalic = document.getElementById("fixed-date-italic").checked;
    const dateColor = document.getElementById("fixed-date-color").value;
    
    const coordsFont = document.getElementById("fixed-coords-font").value;
    const coordsSize = document.getElementById("fixed-coords-size").value;
    const coordsBold = document.getElementById("fixed-coords-bold").checked;
    const coordsItalic = document.getElementById("fixed-coords-italic").checked;
    const coordsColor = document.getElementById("fixed-coords-color").value;
    
    // Add text elements
    let yOffset = centerY * 2 + 50; // Start below the star field
    
    // Add main title (first text layer)
    if (textLayers.length > 0) {
        const fontStyle = [];
        if (textLayers[0].isBold) fontStyle.push('font-weight: bold');
        if (textLayers[0].isItalic) fontStyle.push('font-style: italic');
        
        svg += `<text x="${centerX}" y="${yOffset}" font-family="${textLayers[0].fontFamily}" font-size="${textLayers[0].fontSize}px" fill="${textLayers[0].fontColor}" text-anchor="middle" ${fontStyle.length ? `style="${fontStyle.join(';')}"` : ''}>${escapeXml(textLayers[0].text)}</text>`;
        
        // No decorative line anymore
        yOffset += 40;
    }
    
    // Add subtitle (second text layer)
    if (textLayers.length > 1) {
        const fontStyle = [];
        if (textLayers[1].isBold) fontStyle.push('font-weight: bold');
        if (textLayers[1].isItalic) fontStyle.push('font-style: italic');
        
        svg += `<text x="${centerX}" y="${yOffset}" font-family="${textLayers[1].fontFamily}" font-size="${textLayers[1].fontSize}px" fill="${textLayers[1].fontColor}" text-anchor="middle" ${fontStyle.length ? `style="${fontStyle.join(';')}"` : ''}>${escapeXml(textLayers[1].text)}</text>`;
        
        yOffset += 30;
    }
    
    // Add date
    yOffset += 15; // Extra padding
    const dateFontStyle = [];
    if (dateBold) dateFontStyle.push('font-weight: bold');
    if (dateItalic) dateFontStyle.push('font-style: italic');
    
    svg += `<text x="${centerX}" y="${yOffset}" font-family="${dateFont}" font-size="${dateSize}px" fill="${dateColor}" text-anchor="middle" ${dateFontStyle.length ? `style="${dateFontStyle.join(';')}"` : ''}>${escapeXml(formattedDate)}</text>`;
    
    yOffset += 30;
    
    // Add coordinates
    const coordsFontStyle = [];
    if (coordsBold) coordsFontStyle.push('font-weight: bold');
    if (coordsItalic) coordsFontStyle.push('font-style: italic');
    
    svg += `<text x="${centerX}" y="${yOffset}" font-family="${coordsFont}" font-size="${coordsSize}px" fill="${coordsColor}" text-anchor="middle" ${coordsFontStyle.length ? `style="${coordsFontStyle.join(';')}"` : ''}>${escapeXml(formattedCoordinates)}</text>`;
    
    yOffset += 40;
    
    // Add additional text (third text layer)
    if (textLayers.length > 2) {
        const fontStyle = [];
        if (textLayers[2].isBold) fontStyle.push('font-weight: bold');
        if (textLayers[2].isItalic) fontStyle.push('font-style: italic');
        
        svg += `<text x="${centerX}" y="${yOffset}" font-family="${textLayers[2].fontFamily}" font-size="${textLayers[2].fontSize}px" fill="${textLayers[2].fontColor}" text-anchor="middle" ${fontStyle.length ? `style="${fontStyle.join(';')}"` : ''}>${escapeXml(textLayers[2].text)}</text>`;
    }
    
    // Close the SVG
    svg += `</svg>`;
    
    return svg;
}
