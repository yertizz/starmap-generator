// SVG Export Logic for Star Map Generator

// Assumes utility function escapeXml is available
// Assumes global advancedStyleOptions object is available

function generateSVG(canvas) {
    if (!canvas) {
        console.error("Canvas element not provided for SVG generation.");
        return "";
    }
    const width = canvas.width;
    const height = canvas.height;

    // Get relevant settings from HTML elements
    const outsideColorValue = document.getElementById("outside-color")?.value || "#0a0e1a";
    const starFieldColorValue = document.getElementById("star-field-color")?.value || "#000000";

    // Start SVG structure
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background-color: ${escapeXml(outsideColorValue)};">`;

    // Add Definitions (e.g., for filters)
    svg += `<defs>`;
    if (advancedStyleOptions.starsGlow) {
        svg += `<filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>`;
    }
    svg += `</defs>`;

    // Draw Background Rect (covers entire SVG area)
    svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="${escapeXml(starFieldColorValue)}" />`;

    // --- Draw Stars ---
    const numStars = advancedStyleOptions.starNumber || 2000;
    const radiusMultiplier = advancedStyleOptions.starSize || 1.0;
    const glowFilter = advancedStyleOptions.starsGlow ? 'url(#starGlow)' : '';

    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height; // Draw stars across the full height
        const radius = (Math.random() * 1.2 + 0.3) * radiusMultiplier;
        const opacity = 0.5 + Math.random() * 0.5;
        svg += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${radius.toFixed(2)}" fill="rgba(255, 255, 255, ${opacity.toFixed(2)})" filter="${glowFilter}" />`;
    }

    // --- Draw Constellations ---
    if (advancedStyleOptions.constellationBounds) {
        const constellationsData = [
             { name: "Big Dipper", points: [[0.2, 0.3], [0.25, 0.32], [0.3, 0.35], [0.35, 0.38], [0.4, 0.35], [0.45, 0.3], [0.5, 0.25]] },
             { name: "Orion", points: [[0.6, 0.2], [0.65, 0.25], [0.63, 0.3], [0.67, 0.35], [0.7, 0.4], [0.6, 0.35], [0.55, 0.4], [0.58, 0.3], [0.62, 0.25]] },
             { name: "Cassiopeia", points: [[0.75, 0.6], [0.8, 0.55], [0.85, 0.6], [0.9, 0.55], [0.95, 0.6]] },
             { name: "Southern Cross", points: [[0.3, 0.7], [0.35, 0.75], [0.3, 0.8], [0.25, 0.75]] }
        ];
        const lineWidth = advancedStyleOptions.constellationLineWidth || 1.0;
        const lineColor = 'rgba(255, 255, 255, 0.4)';
        const labelColor = 'rgba(255, 255, 255, 0.6)';
        const labelSize = advancedStyleOptions.labelFontSize || 10;

        constellationLoopSVG: for (const constData of constellationsData) {
            let pathData = "";
            let first = true;
            for (const point of constData.points) {
                const px = point[0] * width;
                const py = point[1] * height;
                pathData += (first ? "M" : "L") + `${px.toFixed(2)},${py.toFixed(2)} `;
                first = false;
                // Draw star point for constellation
                svg += `<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="${(1.5 * radiusMultiplier).toFixed(2)}" fill="white" />`;
            }
            svg += `<path d="${pathData}" stroke="${lineColor}" stroke-width="${lineWidth}" fill="none" />`;

            // Add labels if enabled
            if (advancedStyleOptions.constellationLabels) {
                const centerX = constData.points.reduce((sum, p) => sum + p[0], 0) / constData.points.length * width;
                const centerY = constData.points.reduce((sum, p) => sum + p[1], 0) / constData.points.length * height;
                svg += `<text x="${centerX.toFixed(2)}" y="${(centerY - 10).toFixed(2)}" font-family="${escapeXml(advancedStyleOptions.labelFont || 'Arial')}" font-size="${labelSize}" fill="${labelColor}" text-anchor="middle">${escapeXml(constData.name)}</text>`;
            }
        }
    }

    // --- Draw Text Layers ---
    const textLayersDataSVG = [];
    for (let i = 1; i <= 3; i++) {
        const textInput = document.getElementById(`text-entry-${i}`);
        if (textInput && textInput.value) {
            textLayersDataSVG.push({
                text: textInput.value,
                fontFamily: document.getElementById(`font-family-${i}`)?.value || 'Arial',
                fontSize: document.getElementById(`font-size-${i}`)?.value || '16',
                fontColor: document.getElementById(`font-color-${i}`)?.value || '#FFFFFF',
                isBold: document.getElementById(`text-bold-${i}`)?.checked || false,
                isItalic: document.getElementById(`text-italic-${i}`)?.checked || false
            });
        } else {
            textLayersDataSVG.push(null);
        }
    }
    // Y positions (relative to SVG height)
    const yPos1SVG = height * 0.65;
    const yPos2SVG = height * 0.75;
    const yPos3SVG = height * 0.90;
    const yPosDateSVG = height * 0.82;
    const yPosCoordsSVG = height * 0.86;

    const addTextStyle = (layer) => {
        let style = "";
        if (layer.isBold) style += "font-weight: bold; ";
        if (layer.isItalic) style += "font-style: italic; ";
        return style ? `style="${style.trim()}"` : "";
    };

    if (textLayersDataSVG[0]) {
        const size = String(textLayersDataSVG[0].fontSize).endsWith('px') ? textLayersDataSVG[0].fontSize : `${textLayersDataSVG[0].fontSize}px`;
        svg += `<text x="${width / 2}" y="${yPos1SVG}" font-family="${escapeXml(textLayersDataSVG[0].fontFamily)}" font-size="${size}" fill="${textLayersDataSVG[0].fontColor}" text-anchor="middle" ${addTextStyle(textLayersDataSVG[0])}>${escapeXml(textLayersDataSVG[0].text)}</text>`;
    }
    if (textLayersDataSVG[1]) {
         const size = String(textLayersDataSVG[1].fontSize).endsWith('px') ? textLayersDataSVG[1].fontSize : `${textLayersDataSVG[1].fontSize}px`;
        svg += `<text x="${width / 2}" y="${yPos2SVG}" font-family="${escapeXml(textLayersDataSVG[1].fontFamily)}" font-size="${size}" fill="${textLayersDataSVG[1].fontColor}" text-anchor="middle" ${addTextStyle(textLayersDataSVG[1])}>${escapeXml(textLayersDataSVG[1].text)}</text>`;
    }

    // --- Draw Fixed Date and Coordinates ---
    const dateInputSVG = document.getElementById("date");
    const latitudeInputSVG = document.getElementById("latitude");
    const longitudeInputSVG = document.getElementById("longitude");

    if (dateInputSVG && dateInputSVG.value) {
        const formattedDate = formatDate(dateInputSVG.value); // Assumes formatDate is available
        const dateFont = document.getElementById("fixed-date-font")?.value || "Arial";
        const dateFontSize = document.getElementById("fixed-date-size")?.value || "14";
        const dateBold = document.getElementById("fixed-date-bold")?.checked || false;
        const dateItalic = document.getElementById("fixed-date-italic")?.checked || false;
        const dateColor = document.getElementById("fixed-date-color")?.value || "#FFFFFF";
        const size = String(dateFontSize).endsWith('px') ? dateFontSize : `${dateFontSize}px`;
        const style = `${dateBold ? 'font-weight: bold; ' : ''}${dateItalic ? 'font-style: italic; ' : ''}`;
        svg += `<text x="${width / 2}" y="${yPosDateSVG}" font-family="${escapeXml(dateFont)}" font-size="${size}" fill="${dateColor}" text-anchor="middle" ${style ? `style="${style.trim()}"` : ''}>${escapeXml(formattedDate)}</text>`;
    }

    if (latitudeInputSVG && longitudeInputSVG && latitudeInputSVG.value && longitudeInputSVG.value) {
        const formattedCoords = formatCoordinates(latitudeInputSVG.value, longitudeInputSVG.value); // Assumes formatCoordinates is available
        const coordsFont = document.getElementById("fixed-coords-font")?.value || "Arial";
        const coordsFontSize = document.getElementById("fixed-coords-size")?.value || "14";
        const coordsBold = document.getElementById("fixed-coords-bold")?.checked || false;
        const coordsItalic = document.getElementById("fixed-coords-italic")?.checked || false;
        const coordsColor = document.getElementById("fixed-coords-color")?.value || "#FFFFFF";
         const size = String(coordsFontSize).endsWith('px') ? coordsFontSize : `${coordsFontSize}px`;
         const style = `${coordsBold ? 'font-weight: bold; ' : ''}${coordsItalic ? 'font-style: italic; ' : ''}`;
        svg += `<text x="${width / 2}" y="${yPosCoordsSVG}" font-family="${escapeXml(coordsFont)}" font-size="${size}" fill="${coordsColor}" text-anchor="middle" ${style ? `style="${style.trim()}"` : ''}>${escapeXml(formattedCoords)}</text>`;
    }

     if (textLayersDataSVG[2]) {
          const size = String(textLayersDataSVG[2].fontSize).endsWith('px') ? textLayersDataSVG[2].fontSize : `${textLayersDataSVG[2].fontSize}px`;
         svg += `<text x="${width / 2}" y="${yPos3SVG}" font-family="${escapeXml(textLayersDataSVG[2].fontFamily)}" font-size="${size}" fill="${textLayersDataSVG[2].fontColor}" text-anchor="middle" ${addTextStyle(textLayersDataSVG[2])}>${escapeXml(textLayersDataSVG[2].text)}</text>`;
     }

    // --- Draw Celestial Bodies (Simplified for SVG) ---
    // Add SVG representations if needed, similar to canvas drawing but using SVG elements

    svg += `</svg>`;
    return svg;
}

console.log("svg_export.js loaded");
