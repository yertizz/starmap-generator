// Star Map Styles

// Global variable to track the current style
let currentStarMapStyle = "standard"; // Default star map style

// Function to draw stars on the canvas based on the selected style
function drawStars(ctx, width, height, density = 100) {
    console.log(`Drawing stars with style: ${currentStarMapStyle}`);
    
    switch (currentStarMapStyle) {
        case "realistic":
            drawRealisticStars(ctx, width, height, density);
            break;
        case "constellation":
            drawConstellationStars(ctx, width, height, density);
            break;
        case "nebula":
            drawNebulaStars(ctx, width, height, density);
            break;
        case "galaxy":
            drawGalaxyStars(ctx, width, height, density);
            break;
        case "milky-way":
            drawMilkyWayStars(ctx, width, height, density);
            break;
        case "northern-lights":
            drawNorthernLightsStars(ctx, width, height, density);
            break;
        case "deep-space":
            drawDeepSpaceStars(ctx, width, height, density);
            break;
        case "vintage":
            drawVintageStars(ctx, width, height, density);
            break;
        case "minimalist":
            drawMinimalistStars(ctx, width, height, density);
            break;
        case "standard":
        default:
            drawStandardStars(ctx, width, height, density);
            break;
    }
}

// Standard star style - simple white dots
function drawStandardStars(ctx, width, height, density = 100) {
    // Draw random stars
    const numStars = Math.floor((width * height) / density);
    
    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
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
        const y = Math.random() * height;
        const radius = 1 + Math.random() * 2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
    }
    
    // Draw some constellations
    drawConstellations(ctx, width, height);
}

// Realistic star style - stars with different colors and sizes
function drawRealisticStars(ctx, width, height, density = 100) {
    // Star colors (from blue to red)
    const starColors = [
        'rgba(155, 176, 255, 0.8)', // Blue
        'rgba(170, 191, 255, 0.8)', // Blue-white
        'rgba(255, 255, 255, 0.8)', // White
        'rgba(255, 244, 234, 0.8)', // Yellow-white
        'rgba(255, 210, 161, 0.8)', // Yellow
        'rgba(255, 204, 111, 0.8)', // Orange
        'rgba(255, 160, 122, 0.8)'  // Red
    ];
    
    // Draw random stars
    const numStars = Math.floor((width * height) / density);
    
    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 1.5;
        const colorIndex = Math.floor(Math.random() * starColors.length);
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = starColors[colorIndex];
        ctx.fill();
    }
    
    // Draw some brighter stars with glow
    const numBrightStars = Math.floor(numStars / 20);
    
    for (let i = 0; i < numBrightStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = 1 + Math.random() * 2;
        const colorIndex = Math.floor(Math.random() * starColors.length);
        
        // Draw glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
        gradient.addColorStop(0, starColors[colorIndex]);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw star
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = starColors[colorIndex];
        ctx.fill();
    }
    
    // Draw some constellations
    drawConstellations(ctx, width, height);
}

// Constellation style - emphasize constellations
function drawConstellationStars(ctx, width, height, density = 100) {
    // Draw basic stars
    drawStandardStars(ctx, width, height, density * 1.5); // Fewer background stars
    
    // Define major constellations
    const constellations = [
        // Big Dipper
        {
            name: "Big Dipper",
            stars: [
                { x: 0.2, y: 0.3 },
                { x: 0.25, y: 0.32 },
                { x: 0.3, y: 0.35 },
                { x: 0.35, y: 0.38 },
                { x: 0.4, y: 0.35 },
                { x: 0.45, y: 0.3 },
                { x: 0.5, y: 0.25 }
            ]
        },
        // Orion
        {
            name: "Orion",
            stars: [
                { x: 0.6, y: 0.2 },
                { x: 0.65, y: 0.25 },
                { x: 0.63, y: 0.3 },
                { x: 0.67, y: 0.35 },
                { x: 0.7, y: 0.4 },
                { x: 0.6, y: 0.35 },
                { x: 0.55, y: 0.4 },
                { x: 0.58, y: 0.3 },
                { x: 0.62, y: 0.25 }
            ]
        },
        // Cassiopeia
        {
            name: "Cassiopeia",
            stars: [
                { x: 0.75, y: 0.6 },
                { x: 0.8, y: 0.55 },
                { x: 0.85, y: 0.6 },
                { x: 0.9, y: 0.55 },
                { x: 0.95, y: 0.6 }
            ]
        },
        // Southern Cross
        {
            name: "Southern Cross",
            stars: [
                { x: 0.3, y: 0.7 },
                { x: 0.35, y: 0.75 },
                { x: 0.3, y: 0.8 },
                { x: 0.25, y: 0.75 }
            ]
        }
    ];
    
    // Draw each constellation with enhanced visibility
    constellations.forEach(constellation => {
        // Draw stars
        constellation.stars.forEach(point => {
            const x = point.x * width;
            const y = point.y * height;
            
            // Draw glow
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw star
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fill();
        });
        
        // Draw lines connecting stars
        ctx.beginPath();
        ctx.moveTo(constellation.stars[0].x * width, constellation.stars[0].y * height);
        
        for (let i = 1; i < constellation.stars.length; i++) {
            ctx.lineTo(constellation.stars[i].x * width, constellation.stars[i].y * height);
        }
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Add constellation name
        const centerX = constellation.stars.reduce((sum, star) => sum + star.x, 0) / constellation.stars.length * width;
        const centerY = constellation.stars.reduce((sum, star) => sum + star.y, 0) / constellation.stars.length * height;
        
        ctx.font = '12px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText(constellation.name, centerX, centerY - 15);
    });
}

// Nebula style - colorful nebula background with stars
function drawNebulaStars(ctx, width, height, density = 100) {
    // Create nebula background
    const colors = [
        { r: 0, g: 0, b: 0 },      // Black
        { r: 75, g: 0, b: 130 },   // Indigo
        { r: 138, g: 43, b: 226 }, // Blue-violet
        { r: 0, g: 0, b: 255 },    // Blue
        { r: 0, g: 191, b: 255 },  // Deep sky blue
        { r: 255, g: 0, b: 255 },  // Magenta
        { r: 255, g: 0, b: 0 }     // Red
    ];
    
    // Create a noise pattern for the nebula
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            
            // Create perlin-like noise (simplified)
            const noise = Math.sin(x * 0.01) * Math.cos(y * 0.01) * 0.5 + 0.5;
            const noise2 = Math.sin(x * 0.02 + 1) * Math.cos(y * 0.02 + 2) * 0.5 + 0.5;
            
            // Mix colors based on noise
            const colorIndex1 = Math.floor(noise * (colors.length - 1));
            const colorIndex2 = Math.floor(noise2 * (colors.length - 1));
            
            const color1 = colors[colorIndex1];
            const color2 = colors[colorIndex2];
            
            const mixFactor = (noise + noise2) / 2;
            
            data[i] = color1.r * mixFactor + color2.r * (1 - mixFactor);     // R
            data[i + 1] = color1.g * mixFactor + color2.g * (1 - mixFactor); // G
            data[i + 2] = color1.b * mixFactor + color2.b * (1 - mixFactor); // B
            data[i + 3] = 50 + noise * 50; // Alpha (semi-transparent)
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Draw stars on top of the nebula
    drawStandardStars(ctx, width, height, density / 2); // More stars
}

// Galaxy style - spiral galaxy with stars
function drawGalaxyStars(ctx, width, height, density = 100) {
    // Draw dark background
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
    
    // Draw galaxy arms
    const numArms = 4;
    const numStarsPerArm = 1000;
    
    for (let arm = 0; arm < numArms; arm++) {
        const armAngle = (arm * Math.PI * 2) / numArms;
        
        for (let i = 0; i < numStarsPerArm; i++) {
            const distance = Math.random() * maxRadius;
            const angle = armAngle + distance * 0.01 * (Math.random() * 0.1 + 0.95);
            
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            // Skip if outside the canvas
            if (x < 0 || x >= width || y < 0 || y >= height) continue;
            
            const brightness = Math.random() * 0.5 + 0.5;
            const size = Math.random() * 1.5 + 0.5;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            ctx.fill();
        }
    }
    
    // Draw galaxy core
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 0.2);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add some random stars in the background
    const numBackgroundStars = 500;
    for (let i = 0; i < numBackgroundStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 1 + 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
    }
}

// Function to draw constellations
function drawConstellations(ctx, width, height) {
    // Define some simple constellations (x, y coordinates as percentages of width/height)
    const constellations = [
        // Big Dipper
        [
            [0.2, 0.3], [0.25, 0.32], [0.3, 0.35], [0.35, 0.38],
            [0.4, 0.35], [0.45, 0.3], [0.5, 0.25]
        ],
        // Orion
        [
            [0.6, 0.2], [0.65, 0.25], [0.63, 0.3], [0.67, 0.35],
            [0.7, 0.4], [0.6, 0.35], [0.55, 0.4], [0.58, 0.3],
            [0.62, 0.25]
        ],
        // Cassiopeia
        [
            [0.75, 0.6], [0.8, 0.55], [0.85, 0.6], [0.9, 0.55], [0.95, 0.6]
        ],
        // Southern Cross
        [
            [0.3, 0.7], [0.35, 0.75], [0.3, 0.8], [0.25, 0.75]
        ]
    ];
    
    // Draw each constellation
    constellations.forEach(constellation => {
        // Draw stars
        constellation.forEach(point => {
            const x = point[0] * width;
            const y = point[1] * height;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fill();
        });
        
        // Draw lines connecting stars
        ctx.beginPath();
        ctx.moveTo(constellation[0][0] * width, constellation[0][1] * height);
        
        for (let i = 1; i < constellation.length; i++) {
            ctx.lineTo(constellation[i][0] * width, constellation[i][1] * height);
        }
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    });
}

// Function to add star map style selector
function addStarMapStyleSelector() {
    // Check if the selector already exists
    if (document.getElementById('star-map-style')) {
        return;
    }
    
    // Create the style selector container
    const styleContainer = document.createElement('div');
    styleContainer.className = 'input-section';
    styleContainer.innerHTML = `
        <label class="center-align">Star Map Style:</label>
        <div class="style-selector-container" style="display: flex; justify-content: center; margin: 10px 0;">
        <select id="star-map-style" style="padding: 5px; width: 200px;">
            <option value="standard">Standard</option>
            <option value="realistic">Realistic</option>
            <option value="constellation">Constellation</option>
            <option value="nebula">Nebula</option>
            <option value="galaxy">Galaxy</option>
            <option value="milky-way">Milky Way</option>
            <option value="northern-lights">Northern Lights</option>
            <option value="deep-space">Deep Space</option>
            <option value="vintage">Vintage</option>
            <option value="minimalist">Minimalist</option>
            </select>
        </div>
    `;
    
    // Find the appropriate place to insert the selector
    const imageOptionsSection = document.querySelector('.image-options');
    if (imageOptionsSection && imageOptionsSection.parentNode) {
        imageOptionsSection.parentNode.insertBefore(styleContainer, imageOptionsSection.nextSibling);
        
        // Add event listener to the selector
        const styleSelector = document.getElementById('star-map-style');
        if (styleSelector) {
            styleSelector.addEventListener('change', function() {
                currentStarMapStyle = this.value;
                console.log(`Star map style changed to: ${currentStarMapStyle}`);
                
                // Regenerate the star map if it's already been generated
                const canvas = document.getElementById('star-map-canvas');
                if (canvas && canvas.getContext('2d').getImageData(0, 0, 1, 1).data[3] !== 0) {
                    generateStarMap();
                }
            });
        }
    }
}

// Milky Way style - dense star field with dust lanes
function drawMilkyWayStars(ctx, width, height, density = 100) {
    // Draw dark background
    ctx.fillStyle = 'rgba(5, 5, 15, 1)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw dust lanes
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.45;
    
    // Create a gradient for the dust lanes
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    gradient.addColorStop(0, 'rgba(50, 30, 80, 0.5)');
    gradient.addColorStop(0.4, 'rgba(30, 20, 60, 0.3)');
    gradient.addColorStop(0.7, 'rgba(20, 10, 40, 0.2)');
    gradient.addColorStop(1, 'rgba(5, 5, 15, 0)');
    
    // Draw the dust lanes
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw a dense star field
    const numStars = Math.floor((width * height) / (density / 2)); // More stars
    
    // Star colors for Milky Way
    const starColors = [
        'rgba(255, 255, 255, 0.9)', // White
        'rgba(255, 255, 255, 0.7)', // Dimmer white
        'rgba(255, 240, 220, 0.8)', // Warm white
        'rgba(220, 240, 255, 0.8)', // Cool white
        'rgba(255, 220, 180, 0.7)', // Yellowish
        'rgba(200, 220, 255, 0.7)'  // Bluish
    ];
    
    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 1.2;
        const colorIndex = Math.floor(Math.random() * starColors.length);
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = starColors[colorIndex];
        ctx.fill();
    }
    
    // Draw some brighter stars
    const numBrightStars = Math.floor(numStars / 30);
    
    for (let i = 0; i < numBrightStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = 1 + Math.random() * 1.5;
        
        // Draw glow
        const starGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
        starGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        starGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = starGradient;
        ctx.fill();
        
        // Draw star
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
    }
}

// Northern Lights style - aurora borealis with stars
function drawNorthernLightsStars(ctx, width, height, density = 100) {
    // Draw dark night sky background
    ctx.fillStyle = 'rgba(5, 10, 20, 1)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw aurora waves
    const waveCount = 5;
    const waveHeight = height * 0.6;
    const waveWidth = width;
    
    // Aurora colors
    const auroraColors = [
        { r: 0, g: 255, b: 100 },  // Green
        { r: 0, g: 200, b: 255 },  // Blue
        { r: 100, g: 0, b: 255 },  // Purple
        { r: 0, g: 255, b: 200 }   // Teal
    ];
    
    // Create aurora waves
    for (let wave = 0; wave < waveCount; wave++) {
        const colorIndex = wave % auroraColors.length;
        const color = auroraColors[colorIndex];
        
        const imageData = ctx.createImageData(waveWidth, waveHeight);
        const data = imageData.data;
        
        for (let y = 0; y < waveHeight; y++) {
            for (let x = 0; x < waveWidth; x++) {
                const i = (y * waveWidth + x) * 4;
                
                // Create wave pattern
                const wavePhase = wave * 0.5;
                const waveY = Math.sin((x * 0.01) + wavePhase) * 20 + (wave * 30);
                const distFromWave = Math.abs(y - waveY - (waveHeight * 0.7));
                
                // Only draw near the wave line
                if (distFromWave < 40) {
                    const opacity = Math.max(0, 0.5 - (distFromWave / 80));
                    
                    data[i] = color.r;     // R
                    data[i + 1] = color.g; // G
                    data[i + 2] = color.b; // B
                    data[i + 3] = opacity * 255; // Alpha
                }
            }
        }
        
        // Draw the aurora wave
        ctx.putImageData(imageData, 0, 0);
    }
    
    // Draw stars
    const numStars = Math.floor((width * height) / density);
    
    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 1.2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
        ctx.fill();
    }
    
    // Draw some brighter stars
    const numBrightStars = Math.floor(numStars / 20);
    
    for (let i = 0; i < numBrightStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = 1 + Math.random() * 1.5;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
    }
}

// Deep Space style - distant galaxies and nebulae
function drawDeepSpaceStars(ctx, width, height, density = 100) {
    // Draw deep space background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(5, 5, 20, 1)');
    gradient.addColorStop(0.5, 'rgba(10, 10, 30, 1)');
    gradient.addColorStop(1, 'rgba(5, 5, 20, 1)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw distant galaxies
    const numGalaxies = 15;
    
    for (let i = 0; i < numGalaxies; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 20 + Math.random() * 60;
        
        // Galaxy colors
        const galaxyColors = [
            'rgba(100, 100, 255, 0.2)',  // Blue
            'rgba(255, 100, 100, 0.2)',  // Red
            'rgba(255, 200, 100, 0.2)',  // Yellow
            'rgba(100, 255, 100, 0.2)'   // Green
        ];
        
        const colorIndex = Math.floor(Math.random() * galaxyColors.length);
        
        // Draw galaxy
        const galaxyGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        galaxyGradient.addColorStop(0, galaxyColors[colorIndex]);
        galaxyGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = galaxyGradient;
        ctx.fill();
    }
    
    // Draw stars
    const numStars = Math.floor((width * height) / density);
    
    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 1;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`;
        ctx.fill();
    }
    
    // Draw some brighter stars
    const numBrightStars = Math.floor(numStars / 30);
    
    for (let i = 0; i < numBrightStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = 0.8 + Math.random() * 1.2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
    }
}

// Vintage style - sepia-toned star map
function drawVintageStars(ctx, width, height, density = 100) {
    // Draw vintage background
    ctx.fillStyle = 'rgba(30, 20, 10, 1)';
    ctx.fillRect(0, 0, width, height);
    
    // Add vintage texture
    const textureData = ctx.createImageData(width, height);
    const data = textureData.data;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            
            // Create noise pattern
            const noise = Math.random() * 0.1;
            
            data[i] = 30 + noise * 20;     // R
            data[i + 1] = 20 + noise * 15; // G
            data[i + 2] = 10 + noise * 10; // B
            data[i + 3] = 50; // Alpha (semi-transparent)
        }
    }
    
    ctx.putImageData(textureData, 0, 0);
    
    // Draw stars with sepia tone
    const numStars = Math.floor((width * height) / density);
    
    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 1.2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 220, ${Math.random() * 0.5 + 0.3})`;
        ctx.fill();
    }
    
    // Draw some brighter stars
    const numBrightStars = Math.floor(numStars / 20);
    
    for (let i = 0; i < numBrightStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = 1 + Math.random() * 1.5;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 240, 220, 0.8)';
        ctx.fill();
    }
    
    // Draw constellation lines in vintage style
    const constellations = [
        // Big Dipper
        [
            [0.2, 0.3], [0.25, 0.32], [0.3, 0.35], [0.35, 0.38],
            [0.4, 0.35], [0.45, 0.3], [0.5, 0.25]
        ],
        // Orion
        [
            [0.6, 0.2], [0.65, 0.25], [0.63, 0.3], [0.67, 0.35],
            [0.7, 0.4], [0.6, 0.35], [0.55, 0.4], [0.58, 0.3],
            [0.62, 0.25]
        ],
        // Cassiopeia
        [
            [0.75, 0.6], [0.8, 0.55], [0.85, 0.6], [0.9, 0.55], [0.95, 0.6]
        ]
    ];
    
    // Draw each constellation
    constellations.forEach(constellation => {
        // Draw stars
        constellation.forEach(point => {
            const x = point[0] * width;
            const y = point[1] * height;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 240, 220, 0.9)';
            ctx.fill();
        });
        
        // Draw lines connecting stars
        ctx.beginPath();
        ctx.moveTo(constellation[0][0] * width, constellation[0][1] * height);
        
        for (let i = 1; i < constellation.length; i++) {
            ctx.lineTo(constellation[i][0] * width, constellation[i][1] * height);
        }
        
        ctx.strokeStyle = 'rgba(255, 240, 220, 0.4)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    });
    
    // Add vignette effect
    const vignetteGradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 1.5
    );
    vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    
    ctx.fillStyle = vignetteGradient;
    ctx.fillRect(0, 0, width, height);
}

// Minimalist style - simple dots on dark background
function drawMinimalistStars(ctx, width, height, density = 100) {
    // Draw minimalist background
    ctx.fillStyle = 'rgba(10, 10, 15, 1)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw stars as simple dots
    const numStars = Math.floor((width * height) / density);
    
    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = 0.8; // Fixed size for minimalist look
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
    }
    
    // Draw a few slightly larger stars
    const numLargeStars = Math.floor(numStars / 50);
    
    for (let i = 0; i < numLargeStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = 1.2; // Slightly larger
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
    }
    
    // Draw minimal constellation lines
    const constellations = [
        // Big Dipper
        [
            [0.2, 0.3], [0.25, 0.32], [0.3, 0.35], [0.35, 0.38],
            [0.4, 0.35], [0.45, 0.3], [0.5, 0.25]
        ],
        // Orion
        [
            [0.6, 0.2], [0.65, 0.25], [0.63, 0.3], [0.67, 0.35],
            [0.7, 0.4], [0.6, 0.35], [0.55, 0.4], [0.58, 0.3],
            [0.62, 0.25]
        ]
    ];
    
    // Draw each constellation with minimal lines
    constellations.forEach(constellation => {
        // Draw lines connecting stars
        ctx.beginPath();
        ctx.moveTo(constellation[0][0] * width, constellation[0][1] * height);
        
        for (let i = 1; i < constellation.length; i++) {
            ctx.lineTo(constellation[i][0] * width, constellation[i][1] * height);
        }
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add the star map style selector
    addStarMapStyleSelector();
    
    console.log("Star map styles initialized");
});
