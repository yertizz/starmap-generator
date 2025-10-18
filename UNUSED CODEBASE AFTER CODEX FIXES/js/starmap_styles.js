// Star Map Drawing Styles

// Assumes global variables 'currentStarMapStyle' and 'advancedStyleOptions' are defined elsewhere (e.g., main_app.js)

// --- Main Star Drawing Dispatcher ---
function drawStars(ctx, width, height) {
    // Use global options or defaults
    const style = typeof currentStarMapStyle !== 'undefined' ? currentStarMapStyle : 'standard';
    const options = typeof advancedStyleOptions !== 'undefined' ? advancedStyleOptions : {};
    const numStarsOption = options.starNumber || 2000;
    const densityFactor = 2000 / numStarsOption;
    const density = 100 * densityFactor; // Base density adjusted by number
    const radiusMultiplier = options.starSize || 1.0;
    const glow = options.starsGlow || false;

    console.log(`Drawing stars with style: ${style}, Number: ${numStarsOption}, Size Multiplier: ${radiusMultiplier}, Glow: ${glow}`);

    // Apply glow effect globally if enabled
    if (glow) {
        ctx.shadowBlur = 5; // Adjust blur radius as needed
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)"; // White glow
    } else {
        ctx.shadowBlur = 0;
    }

    // Call the appropriate style function
    switch (style) {
        case "realistic":
            drawRealisticStars(ctx, width, height, density, radiusMultiplier);
            break;
        case "constellation":
            drawConstellationStars(ctx, width, height, density, radiusMultiplier);
            break;
        case "nebula":
            drawNebulaStars(ctx, width, height, density, radiusMultiplier);
            break;
        case "galaxy":
            drawGalaxyStars(ctx, width, height, density, radiusMultiplier);
            break;
        case "milky-way":
            drawMilkyWayStars(ctx, width, height, density, radiusMultiplier);
            break;
        case "northern-lights":
            drawNorthernLightsStars(ctx, width, height, density, radiusMultiplier);
            break;
        case "deep-space":
            drawDeepSpaceStars(ctx, width, height, density, radiusMultiplier);
            break;
        case "vintage":
            drawVintageStars(ctx, width, height, density, radiusMultiplier);
            break;
        case "minimalist":
            drawMinimalistStars(ctx, width, height, density, radiusMultiplier);
            break;
        case "standard":
        default:
            drawStandardStars(ctx, width, height, density, radiusMultiplier);
            break;
    }

     // Draw celestial bodies if enabled (using global options)
     if (options.moon) drawMoon(ctx, width, height);
     if (options.sun) drawSun(ctx, width, height);
     if (options.planets) drawPlanets(ctx, width, height);
     if (options.eclipticPath) drawEclipticPath(ctx, width, height);

    // Reset shadow after drawing everything
    ctx.shadowBlur = 0;
}

// --- Individual Style Functions ---

function drawStandardStars(ctx, width, height, density, radiusMultiplier) {
    const numStars = advancedStyleOptions.starNumber || 2000;
    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (Math.random() * 1.5) * radiusMultiplier;
        const opacity = Math.random();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
    }
    const numBrightStars = Math.floor(numStars / 20);
    for (let i = 0; i < numBrightStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (1 + Math.random() * 2) * radiusMultiplier;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
    }
    drawConstellations(ctx, width, height);
}

function drawRealisticStars(ctx, width, height, density, radiusMultiplier) {
    const starColors = ['#A9C1FF', '#CAD7FF', '#FFFFFF', '#FFF4EA', '#FFD2A1', '#FFCC6F', '#FFA07A'];
    const numStars = advancedStyleOptions.starNumber || 2000;
    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (Math.random() * 1.5) * radiusMultiplier;
        const colorIndex = Math.floor(Math.random() * starColors.length);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = starColors[colorIndex] + 'CC'; // Add alpha
        ctx.fill();
    }
    const numBrightStars = Math.floor(numStars / 20);
    for (let i = 0; i < numBrightStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (1 + Math.random() * 2) * radiusMultiplier;
        const colorIndex = Math.floor(Math.random() * starColors.length);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = starColors[colorIndex];
        ctx.fill();
    }
    drawConstellations(ctx, width, height);
}

function drawConstellationStars(ctx, width, height, density, radiusMultiplier) {
    const numStars = Math.floor((advancedStyleOptions.starNumber || 2000) / 1.5);
     for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (Math.random() * 1.2) * radiusMultiplier;
        const opacity = Math.random() * 0.6;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
    }
    drawConstellations(ctx, width, height, true); // Prominent constellations
}

function drawNebulaStars(ctx, width, height, density, radiusMultiplier) {
    const colors = ['#000000', '#4B0082', '#8A2BE2', '#0000FF', '#00BFFF', '#FF00FF', '#FF0000'];
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const noise = (Math.sin(x * 0.005 + y * 0.002) + Math.cos(x * 0.002 - y * 0.005) + 2) / 4;
            const colorIndex = Math.floor(noise * (colors.length - 1));
            const nextColorIndex = (colorIndex + 1) % colors.length;
            const mix = noise * (colors.length - 1) % 1;
            const r1 = parseInt(colors[colorIndex].slice(1, 3), 16);
            const g1 = parseInt(colors[colorIndex].slice(3, 5), 16);
            const b1 = parseInt(colors[colorIndex].slice(5, 7), 16);
            const r2 = parseInt(colors[nextColorIndex].slice(1, 3), 16);
            const g2 = parseInt(colors[nextColorIndex].slice(3, 5), 16);
            const b2 = parseInt(colors[nextColorIndex].slice(5, 7), 16);
            data[i] = r1 * (1 - mix) + r2 * mix;
            data[i + 1] = g1 * (1 - mix) + g2 * mix;
            data[i + 2] = b1 * (1 - mix) + b2 * mix;
            data[i + 3] = 150 + noise * 50; // Alpha
        }
    }
    ctx.putImageData(imageData, 0, 0);
    drawStandardStars(ctx, width, height, density / 1.5, radiusMultiplier);
}

function drawGalaxyStars(ctx, width, height, density, radiusMultiplier) {
    ctx.fillStyle = '#000005';
    ctx.fillRect(0, 0, width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
    const numArms = 4;
    const numStarsPerArm = Math.floor((advancedStyleOptions.starNumber || 2000) * 0.8 / numArms);
    for (let arm = 0; arm < numArms; arm++) {
        const armAngle = (arm * Math.PI * 2) / numArms;
        for (let i = 0; i < numStarsPerArm; i++) {
            const distance = Math.pow(Math.random(), 1.5) * maxRadius;
            const angleSpread = (1 - distance / maxRadius) * 1.5;
            const angle = armAngle + (distance / maxRadius) * 2.5 + (Math.random() - 0.5) * angleSpread;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            if (x < 0 || x >= width || y < 0 || y >= height) continue;
            const brightness = 0.5 + Math.random() * 0.5;
            const size = (0.5 + Math.random() * 1.0) * radiusMultiplier;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 220, ${brightness})`;
            ctx.fill();
        }
    }
    const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 0.15);
    coreGradient.addColorStop(0, 'rgba(255, 255, 230, 0.9)');
    coreGradient.addColorStop(0.5, 'rgba(255, 255, 200, 0.5)');
    coreGradient.addColorStop(1, 'rgba(255, 220, 180, 0)');
    ctx.fillStyle = coreGradient;
    ctx.fillRect(centerX - maxRadius * 0.15, centerY - maxRadius * 0.15, maxRadius * 0.3, maxRadius * 0.3);
    const numBgStars = Math.floor((advancedStyleOptions.starNumber || 2000) * 0.2);
     for (let i = 0; i < numBgStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (Math.random() * 0.8) * radiusMultiplier;
        const opacity = Math.random() * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${opacity})`;
        ctx.fill();
    }
     drawConstellations(ctx, width, height);
}

function drawMilkyWayStars(ctx, width, height, density, radiusMultiplier) {
    ctx.fillStyle = '#020208';
    ctx.fillRect(0, 0, width, height);
    const bandHeight = height * 0.3;
    const bandY = height / 2 - bandHeight / 2;
    const dustImageData = ctx.createImageData(width, bandHeight);
    const dustData = dustImageData.data;
    for (let y = 0; y < bandHeight; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const noise = (Math.sin(x * 0.008 + y * 0.02) + Math.cos(x * 0.01 - y * 0.03) + 2) / 4;
            const intensity = Math.pow(noise, 2) * 0.3;
            dustData[i] = 10 + noise * 10; dustData[i + 1] = 5 + noise * 5; dustData[i + 2] = 15 + noise * 15; dustData[i + 3] = intensity * 200;
        }
    }
    ctx.putImageData(dustImageData, 0, bandY);
    const numStars = (advancedStyleOptions.starNumber || 2000) * 2;
    const starColors = ['#FFFFFF', '#FFFFFF', '#FFF8DC', '#FFFACD', '#FFFFF0', '#F0FFFF'];
    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const yNoise = (Math.random() - 0.5) * height * 0.6;
        const y = height / 2 + yNoise;
        if (y < 0 || y >= height) continue;
        const radius = (Math.random() * 1.0) * radiusMultiplier;
        const opacity = 0.4 + Math.random() * 0.6;
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.round(opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
    }
     drawConstellations(ctx, width, height);
}

function drawNorthernLightsStars(ctx, width, height, density, radiusMultiplier) {
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#050A1A');
    bgGradient.addColorStop(1, '#100520');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    const auroraColors = ['rgba(0, 255, 100, 0.1)', 'rgba(0, 200, 255, 0.1)', 'rgba(100, 0, 255, 0.1)', 'rgba(0, 255, 200, 0.1)'];
    const waveCount = 15;
    for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        const startY = height * 0.1 + Math.random() * height * 0.4;
        const waveAmp = 20 + Math.random() * 30;
        const waveFreq = 0.005 + Math.random() * 0.005;
        const phase = Math.random() * Math.PI * 2;
        ctx.moveTo(0, startY);
        for (let x = 0; x < width; x++) { ctx.lineTo(x, startY + Math.sin(x * waveFreq + phase) * waveAmp); }
        ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.closePath();
        ctx.fillStyle = auroraColors[i % auroraColors.length];
        ctx.fill();
    }
    const numStars = Math.floor((advancedStyleOptions.starNumber || 2000) * 0.7);
     for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = (0.5 + Math.random() * 0.8) * radiusMultiplier;
        const opacity = 0.7 + Math.random() * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
    }
     drawConstellations(ctx, width, height);
}

function drawDeepSpaceStars(ctx, width, height, density, radiusMultiplier) {
    ctx.fillStyle = '#010103';
    ctx.fillRect(0, 0, width, height);
    const numGalaxies = 25;
    for (let i = 0; i < numGalaxies; i++) {
        const x = Math.random() * width; const y = Math.random() * height;
        const size = 10 + Math.random() * 40; const angle = Math.random() * Math.PI;
        const galaxyGradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
        galaxyGradient.addColorStop(0, `rgba(${100 + Math.random()*50}, ${100 + Math.random()*50}, ${150 + Math.random()*50}, 0.05)`);
        galaxyGradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(1, 0.3);
        ctx.beginPath(); ctx.arc(0, 0, size / 2, 0, Math.PI * 2); ctx.fillStyle = galaxyGradient; ctx.fill();
        ctx.restore();
    }
    const numStars = advancedStyleOptions.starNumber || 2000;
     for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width; const y = Math.random() * height;
        const radius = (Math.random() * 0.8) * radiusMultiplier;
        const opacity = 0.2 + Math.random() * 0.5;
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(200, 220, 255, ${opacity})`; ctx.fill();
    }
     const numBright = Math.floor(numStars / 100);
     for (let i = 0; i < numBright; i++) {
        const x = Math.random() * width; const y = Math.random() * height;
        const radius = (1.0 + Math.random() * 1.0) * radiusMultiplier;
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; ctx.fill();
    }
}

function drawVintageStars(ctx, width, height, density, radiusMultiplier) {
    ctx.fillStyle = '#3f3220';
    ctx.fillRect(0, 0, width, height);
    const textureData = ctx.createImageData(width, height); const data = textureData.data;
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 30;
        data[i] = 63 + noise; data[i + 1] = 50 + noise; data[i + 2] = 32 + noise; data[i + 3] = 40;
    }
    ctx.putImageData(textureData, 0, 0);
    const numStars = advancedStyleOptions.starNumber || 2000; const starColor = '#FFF8DC';
    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width; const y = Math.random() * height;
        const radius = (Math.random() * 1.2) * radiusMultiplier; const opacity = 0.3 + Math.random() * 0.5;
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = starColor + Math.round(opacity * 255).toString(16).padStart(2, '0'); ctx.fill();
    }
    const numBrightStars = Math.floor(numStars / 20);
    for (let i = 0; i < numBrightStars; i++) {
        const x = Math.random() * width; const y = Math.random() * height;
        const radius = (1 + Math.random() * 1.5) * radiusMultiplier;
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = starColor + 'CC'; ctx.fill();
    }
    drawConstellations(ctx, width, height, false, '#D2B48C', 1.5);
     const vignetteGradient = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.3, width / 2, height / 2, Math.max(width, height) * 0.7);
     vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)'); vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
     ctx.fillStyle = vignetteGradient; ctx.fillRect(0, 0, width, height);
}

function drawMinimalistStars(ctx, width, height, density, radiusMultiplier) {
    ctx.fillStyle = '#18181B';
    ctx.fillRect(0, 0, width, height);
    const numStars = advancedStyleOptions.starNumber || 2000;
    const starRadius = 0.8 * radiusMultiplier; const starColor = 'rgba(245, 245, 245, 0.8)';
    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width; const y = Math.random() * height;
        ctx.beginPath(); ctx.arc(x, y, starRadius, 0, Math.PI * 2); ctx.fillStyle = starColor; ctx.fill();
    }
    drawConstellations(ctx, width, height, false, 'rgba(113, 113, 122, 0.3)', 0.5);
}


function drawConstellations(ctx, width, height, prominent = false, color = 'rgba(255, 255, 255, 0.3)', lineWidth = 0.5) {
    // Use global advancedStyleOptions directly
    if (!advancedStyleOptions.constellationBounds && !prominent) return;

    const constellationsData = [
        { name: "Big Dipper", points: [[0.2, 0.3], [0.25, 0.32], [0.3, 0.35], [0.35, 0.38], [0.4, 0.35], [0.45, 0.3], [0.5, 0.25]] },
        { name: "Orion", points: [[0.6, 0.2], [0.65, 0.25], [0.63, 0.3], [0.67, 0.35], [0.7, 0.4], [0.6, 0.35], [0.55, 0.4], [0.58, 0.3], [0.62, 0.25]] },
        { name: "Cassiopeia", points: [[0.75, 0.6], [0.8, 0.55], [0.85, 0.6], [0.9, 0.55], [0.95, 0.6]] },
        { name: "Southern Cross", points: [[0.3, 0.7], [0.35, 0.75], [0.3, 0.8], [0.25, 0.75]] }
    ];

    const effectiveLineWidth = prominent ? (advancedStyleOptions.constellationLineWidth || 1.0) * 1.5 : (advancedStyleOptions.constellationLineWidth || 0.5);
    const effectiveColor = prominent ? 'rgba(255, 255, 255, 0.7)' : color;
    const starRadius = prominent ? 3 * (advancedStyleOptions.starSize || 1.0) : 2;
    const starColor = prominent ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)';

    ctx.strokeStyle = effectiveColor;
    ctx.lineWidth = effectiveLineWidth;
    ctx.fillStyle = starColor;

    constellationLoop: for (const constData of constellationsData) {
        ctx.beginPath();
        let firstPoint = true;
        for (const point of constData.points) {
            const x = point[0] * width;
            const y = point[1] * height;
            ctx.moveTo(x + starRadius, y);
            ctx.arc(x, y, starRadius, 0, Math.PI * 2);
            if (firstPoint) { ctx.moveTo(x, y); firstPoint = false; }
            else { ctx.lineTo(x, y); }
        }
        ctx.fill(); // Fill stars
        ctx.stroke(); // Stroke lines

        if (advancedStyleOptions.constellationLabels || (prominent && advancedStyleOptions.constellationLabels !== false)) {
             const centerX = constData.points.reduce((sum, p) => sum + p[0], 0) / constData.points.length * width;
             const centerY = constData.points.reduce((sum, p) => sum + p[1], 0) / constData.points.length * height;
             // Use the drawText utility function
             drawText(ctx, constData.name, advancedStyleOptions.labelFont || 'Arial', advancedStyleOptions.labelFontSize || 10, false, false, effectiveColor, centerX, centerY - starRadius * 3);
        }
    }
}

// --- Celestial Body Drawing Functions (Placeholders) ---
function drawMoon(ctx, width, height) {
    console.log("Drawing Moon (placeholder)");
    const x = width * 0.8; const y = height * 0.15;
    const radius = 15 * (advancedStyleOptions.celestialBodySize || 1.0);
    ctx.fillStyle = '#E0E0E0'; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
}

function drawSun(ctx, width, height) {
     console.log("Drawing Sun (placeholder)");
     const x = width * 0.2; const y = height * 0.1;
     const radius = 20 * (advancedStyleOptions.celestialBodySize || 1.0);
     ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
}

function drawPlanets(ctx, width, height) {
     console.log("Drawing Planets (placeholder)");
     const planetsData = [
         { name: "Mars", x: 0.3, y: 0.2, radius: 5, color: '#A0522D' },
         { name: "Jupiter", x: 0.5, y: 0.4, radius: 8, color: '#B8860B' },
         { name: "Saturn", x: 0.7, y: 0.1, radius: 6, color: '#DAA520' },
     ];
     planetsData.forEach(p => {
         const radius = p.radius * (advancedStyleOptions.celestialBodySize || 1.0);
         ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(width * p.x, height * p.y, radius, 0, Math.PI * 2); ctx.fill();
         if (advancedStyleOptions.planetLabels) {
             drawText(ctx, p.name, advancedStyleOptions.labelFont || 'Arial', advancedStyleOptions.labelFontSize || 10, false, false, '#FFFFFF', width * p.x, height * p.y - radius - 5);
         }
     });
}

function drawEclipticPath(ctx, width, height) {
     console.log("Drawing Ecliptic Path (placeholder)");
     ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)'; ctx.lineWidth = 1; ctx.beginPath();
     ctx.moveTo(0, height * 0.4); ctx.quadraticCurveTo(width / 2, height * 0.45, width, height * 0.4); ctx.stroke();
}

console.log("starmap_styles.js loaded");
