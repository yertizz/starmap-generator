// Star Map Generator - Complete JavaScript

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Star Map Generator loaded");
    
    // Get elements
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const canvas = document.getElementById('star-map-canvas');
    const backgroundColorInput = document.getElementById('star-field-color');
    const outsideColorInput = document.getElementById('outside-color');
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomValue = document.getElementById('zoom-value');
    const loadingIndicator = document.getElementById('loading-indicator');
    const starMapStyleSelect = document.getElementById('star-map-style');
    
    // Initialize variables
    let currentStarMapStyle = "standard";
    
    // Add event listener to generate button
    generateBtn.addEventListener('click', function() {
        console.log("Generate button clicked");
        generateStarMap();
    });
    
    // Add event listener to download button
    downloadBtn.addEventListener('click', function() {
        console.log("Download button clicked");
        downloadStarMap();
    });
    
    // Add event listeners to text entries for character count
    for (let i = 1; i <= 3; i++) {
        const textEntry = document.getElementById(`text-entry-${i}`);
        const charCount = document.getElementById(`char-count-${i}`);
        
        if (textEntry && charCount) {
            textEntry.addEventListener('input', function() {
                const remainingChars = 50 - textEntry.value.length;
                charCount.textContent = remainingChars;
            });
        }
    }
    
    // Add event listener to image type radio buttons
    document.querySelectorAll('input[name="imageType"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            // Enable/disable transparency checkbox based on selected image type
            const transparencyCheckbox = document.getElementById('export-transparency');
            if (transparencyCheckbox) {
                transparencyCheckbox.disabled = this.value !== 'png';
                if (this.value !== 'png') {
                    transparencyCheckbox.checked = false;
                }
            }
        });
    });
    
    // Add event listener to star map style select
    if (starMapStyleSelect) {
        starMapStyleSelect.addEventListener('change', function() {
            currentStarMapStyle = this.value;
            console.log(`Star map style changed to: ${currentStarMapStyle}`);
            generateStarMap();
        });
    }
    
    // Add event listener to maintain aspect ratio checkbox
    const maintainAspectRatioCheckbox = document.getElementById('maintain-aspect-ratio');
    const outputWidthInput = document.getElementById('output-width');
    const outputHeightInput = document.getElementById('output-height');
    
    if (maintainAspectRatioCheckbox && outputWidthInput && outputHeightInput) {
        let aspectRatio = outputWidthInput.value / outputHeightInput.value;
        
        maintainAspectRatioCheckbox.addEventListener('change', function() {
            if (this.checked) {
                aspectRatio = outputWidthInput.value / outputHeightInput.value;
            }
        });
        
        outputWidthInput.addEventListener('change', function() {
            if (maintainAspectRatioCheckbox.checked) {
                outputHeightInput.value = Math.round(this.value / aspectRatio);
            }
        });
        
        outputHeightInput.addEventListener('change', function() {
            if (maintainAspectRatioCheckbox.checked) {
                outputWidthInput.value = Math.round(this.value * aspectRatio);
            }
        });
    }
    
    // Add event listener to zoom slider
    if (zoomSlider && zoomValue) {
        zoomSlider.addEventListener('input', function() {
            const zoom = parseInt(this.value);
            zoomValue.textContent = zoom;
            canvas.style.transform = `scale(${zoom / 100})`;
            canvas.style.transformOrigin = "center top";
        });
    }
    
    // Add event listeners to icon buttons
    document.querySelectorAll('.icon-button').forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all buttons
            document.querySelectorAll('.icon-button').forEach(function(btn) {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
    
    // Load saved settings from local storage
    loadSavedSettings();
    
    // Setup text input history
    setupTextInputHistory();
    
    // Setup ZIP code history
    setupZipCodeHistory();
    
    // Generate star map on page load
    setTimeout(function() {
        console.log("Auto-generating star map");
        generateStarMap();
    }, 1000);
    
    // Function to generate star map
    function generateStarMap() {
        console.log("Generating star map");
        
        // Show loading indicator
        loadingIndicator.style.display = 'flex';
        
        // Use setTimeout to prevent UI freezing
        setTimeout(function() {
            try {
                // Get canvas context
                const ctx = canvas.getContext('2d');
                
                // Get output dimensions
                const outputWidth = parseInt(document.getElementById('output-width').value) || 800;
                const outputHeight = parseInt(document.getElementById('output-height').value) || 1000;
                
                // Set canvas dimensions
                canvas.width = outputWidth;
                canvas.height = outputHeight;
                
                // Get colors
                const backgroundColor = backgroundColorInput.value;
                const outsideColor = outsideColorInput.value;
                
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw background
                ctx.fillStyle = outsideColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw star field area
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
                
                // Draw stars
                drawStars(ctx, canvas.width, canvas.height);
                
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
                
                // Draw date
                const date = document.getElementById("date")?.value;
                if (date) {
                    const dateObj = new Date(date);
                    const formattedDate = formatDate(dateObj);
                    
                    const dateFont = document.getElementById("fixed-date-font")?.value || "Arial";
                    const dateFontSize = document.getElementById("fixed-date-size")?.value || "14";
                    const dateBold = document.getElementById("fixed-date-bold")?.checked;
                    const dateItalic = document.getElementById("fixed-date-italic")?.checked;
                    const dateColor = document.getElementById("fixed-date-color")?.value || "#FFFFFF";
                    
                    drawText(ctx, formattedDate, dateFont, dateFontSize, dateBold, dateItalic, dateColor, canvas.width / 2, canvas.height * 0.9);
                }
                
                // Draw coordinates
                const latitude = document.getElementById("latitude")?.value;
                const longitude = document.getElementById("longitude")?.value;
                if (latitude && longitude) {
                    const formattedCoords = formatCoordinates(latitude, longitude);
                    
                    const coordsFont = document.getElementById("fixed-coords-font")?.value || "Arial";
                    const coordsFontSize = document.getElementById("fixed-coords-size")?.value || "14";
                    const coordsBold = document.getElementById("fixed-coords-bold")?.checked;
                    const coordsItalic = document.getElementById("fixed-coords-italic")?.checked;
                    const coordsColor = document.getElementById("fixed-coords-color")?.value || "#FFFFFF";
                    
                    drawText(ctx, formattedCoords, coordsFont, coordsFontSize, coordsBold, coordsItalic, coordsColor, canvas.width / 2, canvas.height * 0.95);
                }
                
                // Enable download button
                downloadBtn.removeAttribute("disabled");
                
                // Set up zoom functionality
                setupZoom();
                
                console.log("Star map generated successfully");
                
                // Hide loading indicator
                loadingIndicator.style.display = 'none';
            } catch (error) {
                console.error("Error generating star map:", error);
                alert("Error generating star map: " + error.message);
                
                // Hide loading indicator
                loadingIndicator.style.display = 'none';
            }
        }, 100);
    }
    
    // Function to draw stars
    function drawStars(ctx, width, height) {
        switch (currentStarMapStyle) {
            case "realistic":
                drawRealisticStars(ctx, width, height);
                break;
            case "constellation":
                drawConstellationStars(ctx, width, height);
                break;
            case "nebula":
                drawNebulaStars(ctx, width, height);
                break;
            case "galaxy":
                drawGalaxyStars(ctx, width, height);
                break;
            case "milky-way":
                drawMilkyWayStars(ctx, width, height);
                break;
            case "northern-lights":
                drawNorthernLightsStars(ctx, width, height);
                break;
            case "deep-space":
                drawDeepSpaceStars(ctx, width, height);
                break;
            case "vintage":
                drawVintageStars(ctx, width, height);
                break;
            case "minimalist":
                drawMinimalistStars(ctx, width, height);
                break;
            case "standard":
            default:
                drawStandardStars(ctx, width, height);
                break;
        }
    }
    
    // Standard star style - simple white dots
    function drawStandardStars(ctx, width, height) {
        // Draw random stars
        const numStars = 2000;
        
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
    
    // Realistic star style - stars with different colors and sizes
    function drawRealisticStars(ctx, width, height) {
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
        const numStars = 2000;
        
        for (let i = 0; i < numStars; i++) {
            const x = Math.random() * width;
            const y = Math.random() * (height / 2); // Only in the top half
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
            const y = Math.random() * (height / 2); // Only in the top half
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
    }
    
    // Constellation style - emphasize constellations
    function drawConstellationStars(ctx, width, height) {
        // Draw basic stars
        drawStandardStars(ctx, width, height);
        
        // Define major constellations
        const constellations = [
            // Big Dipper
            {
                name: "Big Dipper",
                stars: [
                    { x: 0.2, y: 0.15 },
                    { x: 0.25, y: 0.16 },
                    { x: 0.3, y: 0.17 },
                    { x: 0.35, y: 0.19 },
                    { x: 0.4, y: 0.17 },
                    { x: 0.45, y: 0.15 },
                    { x: 0.5, y: 0.12 }
                ]
            },
            // Orion
            {
                name: "Orion",
                stars: [
                    { x: 0.6, y: 0.1 },
                    { x: 0.65, y: 0.12 },
                    { x: 0.63, y: 0.15 },
                    { x: 0.67, y: 0.17 },
                    { x: 0.7, y: 0.2 },
                    { x: 0.6, y: 0.17 },
                    { x: 0.55, y: 0.2 },
                    { x: 0.58, y: 0.15 },
                    { x: 0.62, y: 0.12 }
                ]
            },
            // Cassiopeia
            {
                name: "Cassiopeia",
                stars: [
                    { x: 0.75, y: 0.3 },
                    { x: 0.8, y: 0.27 },
                    { x: 0.85, y: 0.3 },
                    { x: 0.9, y: 0.27 },
                    { x: 0.95, y: 0.3 }
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
    function drawNebulaStars(ctx, width, height) {
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
        const imageData = ctx.createImageData(width, height / 2);
        const data = imageData.data;
        
        for (let y = 0; y < height / 2; y++) {
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
        drawStandardStars(ctx, width, height);
    }
    
    // Galaxy style - spiral galaxy with stars
    function drawGalaxyStars(ctx, width, height) {
        // Draw dark background
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(0, 0, width, height / 2);
        
        const centerX = width / 2;
        const centerY = height / 4;
        const maxRadius = Math.min(width, height / 2) * 0.8;
        
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
                
                // Skip if outside the canvas or star field area
                if (x < 0 || x >= width || y < 0 || y >= height / 2) continue;
                
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
            const y = Math.random() * (height / 2);
            const size = Math.random() * 1 + 0.5;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
        }
    }
    
    // Milky Way style - dense star field with dust lanes
    function drawMilkyWayStars(ctx, width, height) {
        // Draw dark background
        ctx.fillStyle = 'rgba(5, 5, 15, 1)';
        ctx.fillRect(0, 0, width, height / 2);
        
        // Draw dust lanes
        const centerX = width / 2;
        const centerY = height / 4;
        const maxRadius = Math.min(width, height / 2) * 0.9;
        
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
        const numStars = 4000;
        
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
            const y = Math.random() * (height / 2);
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
            const y = Math.random() * (height / 2);
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
    function drawNorthernLightsStars(ctx, width, height) {
        // Draw dark night sky background
        ctx.fillStyle = 'rgba(5, 10, 20, 1)';
        ctx.fillRect(0, 0, width, height / 2);
        
        // Draw aurora waves
        const waveCount = 5;
        const waveHeight = height / 2;
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
