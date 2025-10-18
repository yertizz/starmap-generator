// Fix Preview Button V2 - Ensures the PREVIEW button works correctly

document.addEventListener('DOMContentLoaded', function() {
    console.log("Fix Preview Button V2 script loaded");
    
    // Get the generate button
    const generateBtn = document.getElementById('generateBtn');
    if (!generateBtn) {
        console.error("Generate button not found");
        return;
    }
    
    // Remove any existing event listeners and onclick attribute
    const newGenerateBtn = generateBtn.cloneNode(true);
    generateBtn.parentNode.replaceChild(newGenerateBtn, generateBtn);
    newGenerateBtn.removeAttribute('onclick');
    
    // Add a new event listener
    newGenerateBtn.addEventListener('click', function() {
        console.log("Generate button clicked");
        
        try {
            // Show loading indicator if it exists
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'flex';
            } else {
                // Create loading indicator if it doesn't exist
                createLoadingIndicator();
            }
            
            // Call the appropriate generate function
            if (typeof generateStarMap === 'function') {
                console.log("Calling generateStarMap function");
                generateStarMap();
            } else if (typeof directGenerateStarMap === 'function') {
                console.log("Calling directGenerateStarMap function");
                directGenerateStarMap();
            } else {
                // Fallback to direct canvas drawing
                console.log("No generate function found, using fallback");
                generateStarMapFallback();
            }
            
            // Enable the download button
            const downloadBtn = document.getElementById('downloadBtn');
            if (downloadBtn) {
                downloadBtn.disabled = false;
            }
            
            console.log("Star map generated successfully");
        } catch (error) {
            console.error("Error generating star map:", error);
            alert("Error generating star map: " + error.message);
        } finally {
            // Hide loading indicator
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }
    });
    
    // Function to create loading indicator
    function createLoadingIndicator() {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'loading-indicator';
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
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.style.width = '50px';
        spinner.style.height = '50px';
        spinner.style.border = '5px solid #f3f3f3';
        spinner.style.borderTop = '5px solid #3498db';
        spinner.style.borderRadius = '50%';
        spinner.style.animation = 'spin 2s linear infinite';
        
        const text = document.createElement('div');
        text.textContent = 'Generating Star Map...';
        text.style.color = 'white';
        text.style.marginTop = '20px';
        text.style.fontWeight = 'bold';
        
        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        loadingIndicator.appendChild(spinner);
        loadingIndicator.appendChild(text);
        document.body.appendChild(loadingIndicator);
    }
    
    // Fallback function to generate a star map directly
    function generateStarMapFallback() {
        console.log("Using fallback star map generation");
        
        // Get canvas and context
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) {
            console.error("Canvas not found");
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        canvas.width = 800;
        canvas.height = 800;
        
        // Get colors
        const starFieldColor = document.getElementById('star-field-color')?.value || '#000000';
        const outsideColor = document.getElementById('outside-color')?.value || '#0a0e1a';
        
        // Draw background
        ctx.fillStyle = outsideColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw star field area (circular)
        ctx.fillStyle = starFieldColor;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw stars
        drawStars(ctx, canvas.width, canvas.height);
        
        // Draw text
        drawText(ctx, canvas.width, canvas.height);
        
        console.log("Fallback star map generated");
    }
    
    // Function to draw stars
    function drawStars(ctx, width, height) {
        // Calculate center and radius
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = width / 2 - 20;
        
        // Get advanced options if available
        const advancedOptions = window.advancedStyleOptions || {
            starNumber: 2000,
            starSize: 1.0,
            starsGlow: false
        };
        
        // Draw random stars
        const numStars = advancedOptions.starNumber || 2000;
        const starSizeMultiplier = advancedOptions.starSize || 1.0;
        const starsGlow = advancedOptions.starsGlow || false;
        
        for (let i = 0; i < numStars; i++) {
            // Generate random angle and distance from center
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;
            
            // Calculate x and y coordinates
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            const starRadius = Math.random() * 1.5 * starSizeMultiplier;
            const opacity = Math.random();
            
            ctx.beginPath();
            ctx.arc(x, y, starRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
            
            // Add glow effect if enabled
            if (starsGlow && Math.random() > 0.8) {
                ctx.beginPath();
                ctx.arc(x, y, starRadius * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
                ctx.fill();
            }
        }
        
        // Draw some brighter stars
        const numBrightStars = Math.floor(numStars / 20);
        
        for (let i = 0; i < numBrightStars; i++) {
            // Generate random angle and distance from center
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;
            
            // Calculate x and y coordinates
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            const starRadius = (1 + Math.random() * 2) * starSizeMultiplier;
            
            ctx.beginPath();
            ctx.arc(x, y, starRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
            
            // Add glow effect if enabled
            if (starsGlow) {
                ctx.beginPath();
                ctx.arc(x, y, starRadius * 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fill();
            }
        }
        
        // Draw some colored stars
        const numColoredStars = Math.floor(numStars / 50);
        const starColors = [
            'rgba(255, 200, 200, 0.8)', // Red
            'rgba(200, 200, 255, 0.8)', // Blue
            'rgba(255, 255, 200, 0.8)', // Yellow
            'rgba(200, 255, 200, 0.8)'  // Green
        ];
        
        for (let i = 0; i < numColoredStars; i++) {
            // Generate random angle and distance from center
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;
            
            // Calculate x and y coordinates
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            const starRadius = (1 + Math.random() * 2) * starSizeMultiplier;
            const colorIndex = Math.floor(Math.random() * starColors.length);
            
            ctx.beginPath();
            ctx.arc(x, y, starRadius, 0, Math.PI * 2);
            ctx.fillStyle = starColors[colorIndex];
            ctx.fill();
            
            // Add glow effect if enabled
            if (starsGlow) {
                ctx.beginPath();
                ctx.arc(x, y, starRadius * 3, 0, Math.PI * 2);
                const glowColor = starColors[colorIndex].replace('0.8', '0.2');
                ctx.fillStyle = glowColor;
                ctx.fill();
            }
        }
        
        // Draw constellation bounds if enabled
        const advancedOptions2 = window.advancedStyleOptions || {};
        if (advancedOptions2.constellationBounds) {
            drawConstellationBounds(ctx, centerX, centerY, radius, advancedOptions2.constellationLineWidth || 1.0);
        }
        
        // Draw constellation labels if enabled
        if (advancedOptions2.constellationLabels) {
            drawConstellationLabels(ctx, centerX, centerY, radius);
        }
        
        // Draw star labels if enabled
        if (advancedOptions2.starLabels) {
            drawStarLabels(ctx, centerX, centerY, radius);
        }
    }
    
    // Function to draw constellation bounds
    function drawConstellationBounds(ctx, centerX, centerY, radius, lineWidth) {
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
        ctx.lineWidth = lineWidth;
        
        // Draw some random constellation bounds
        const numConstellations = 5;
        
        for (let i = 0; i < numConstellations; i++) {
            const numPoints = 4 + Math.floor(Math.random() * 4);
            const points = [];
            
            // Generate random points for the constellation
            for (let j = 0; j < numPoints; j++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = (0.3 + Math.random() * 0.6) * radius;
                
                points.push({
                    x: centerX + Math.cos(angle) * distance,
                    y: centerY + Math.sin(angle) * distance
                });
            }
            
            // Draw the constellation
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            
            for (let j = 1; j < points.length; j++) {
                ctx.lineTo(points[j].x, points[j].y);
            }
            
            ctx.closePath();
            ctx.stroke();
        }
    }
    
    // Function to draw constellation labels
    function drawConstellationLabels(ctx, centerX, centerY, radius) {
        ctx.fillStyle = 'rgba(200, 200, 255, 0.8)';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        
        const constellations = [
            { name: 'Orion', angle: Math.PI * 0.2, distance: 0.6 },
            { name: 'Ursa Major', angle: Math.PI * 0.7, distance: 0.7 },
            { name: 'Cassiopeia', angle: Math.PI * 1.2, distance: 0.5 },
            { name: 'Cygnus', angle: Math.PI * 1.7, distance: 0.6 }
        ];
        
        constellations.forEach(constellation => {
            const x = centerX + Math.cos(constellation.angle) * constellation.distance * radius;
            const y = centerY + Math.sin(constellation.angle) * constellation.distance * radius;
            
            ctx.fillText(constellation.name, x, y);
        });
    }
    
    // Function to draw star labels
    function drawStarLabels(ctx, centerX, centerY, radius) {
        ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        const stars = [
            { name: 'Polaris', angle: Math.PI * 0.1, distance: 0.3 },
            { name: 'Vega', angle: Math.PI * 0.5, distance: 0.4 },
            { name: 'Sirius', angle: Math.PI * 0.9, distance: 0.7 },
            { name: 'Betelgeuse', angle: Math.PI * 1.3, distance: 0.5 },
            { name: 'Antares', angle: Math.PI * 1.7, distance: 0.6 }
        ];
        
        stars.forEach(star => {
            const x = centerX + Math.cos(star.angle) * star.distance * radius;
            const y = centerY + Math.sin(star.angle) * star.distance * radius;
            
            // Draw a small circle for the star
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
            ctx.fill();
            
            // Draw the star name
            ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
            ctx.fillText(star.name, x, y + 15);
        });
    }
    
    // Function to draw text
    function drawText(ctx, width, height) {
        // Get text inputs
        const text1 = document.getElementById('text-entry-1')?.value || "";
        const text2 = document.getElementById('text-entry-2')?.value || "";
        const text3 = document.getElementById('text-entry-3')?.value || "";
        
        // Draw text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        if (text1) {
            // Get font settings
            const fontFamily = document.getElementById('font-family-1')?.value || "Arial";
            const fontSize = document.getElementById('font-size-1')?.value || "48";
            const isBold = document.getElementById('text-bold-1')?.checked || false;
            const isItalic = document.getElementById('text-italic-1')?.checked || false;
            const fontColor = document.getElementById('font-color-1')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            ctx.fillText(text1, width / 2, height * 0.7);
        }
        
        if (text2) {
            // Get font settings
            const fontFamily = document.getElementById('font-family-2')?.value || "Arial";
            const fontSize = document.getElementById('font-size-2')?.value || "24";
            const isBold = document.getElementById('text-bold-2')?.checked || false;
            const isItalic = document.getElementById('text-italic-2')?.checked || false;
            const fontColor = document.getElementById('font-color-2')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            ctx.fillText(text2, width / 2, height * 0.8);
        }
        
        if (text3) {
            // Get font settings
            const fontFamily = document.getElementById('font-family-3')?.value || "Arial";
            const fontSize = document.getElementById('font-size-3')?.value || "16";
            const isBold = document.getElementById('text-bold-3')?.checked || false;
            const isItalic = document.getElementById('text-italic-3')?.checked || false;
            const fontColor = document.getElementById('font-color-3')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            ctx.fillText(text3, width / 2, height * 0.85);
        }
        
        // Draw date
        const date = document.getElementById('date')?.value;
        if (date) {
            // Get font settings
            const fontFamily = document.getElementById('fixed-date-font')?.value || "Arial";
            const fontSize = document.getElementById('fixed-date-size')?.value || "14";
            const isBold = document.getElementById('fixed-date-bold')?.checked || false;
            const isItalic = document.getElementById('fixed-date-italic')?.checked || false;
            const fontColor = document.getElementById('fixed-date-color')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            ctx.fillText(formattedDate, width / 2, height * 0.9);
        }
        
        // Draw coordinates
        const latitude = document.getElementById('latitude')?.value;
        const longitude = document.getElementById('longitude')?.value;
        if (latitude && longitude) {
            // Get font settings
            const fontFamily = document.getElementById('fixed-coords-font')?.value || "Arial";
            const fontSize = document.getElementById('fixed-coords-size')?.value || "14";
            const isBold = document.getElementById('fixed-coords-bold')?.checked || false;
            const isItalic = document.getElementById('fixed-coords-italic')?.checked || false;
            const fontColor = document.getElementById('fixed-coords-color')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            ctx.fillText(`${latitude}° N, ${longitude}° W`, width / 2, height * 0.95);
        }
    }
    
    // Trigger the generate function on page load
    setTimeout(function() {
        if (newGenerateBtn) {
            console.log("Auto-triggering generate button click");
            newGenerateBtn.click();
        }
    }, 1000);
    
    console.log("Preview button fix V2 applied");
});
