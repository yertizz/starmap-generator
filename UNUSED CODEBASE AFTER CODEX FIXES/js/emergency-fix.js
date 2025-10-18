// Emergency Fix - Direct canvas manipulation to ensure stars are drawn

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Emergency Fix script loaded");
    
    // Get the canvas element
    const canvas = document.getElementById('star-map-canvas');
    if (!canvas) {
        console.error("Canvas element not found");
        return;
    }
    
    // Get the generate button
    const generateBtn = document.getElementById('generateBtn');
    if (!generateBtn) {
        console.error("Generate button not found");
        return;
    }
    
    // Remove the disabled attribute from the generate button
    generateBtn.removeAttribute('disabled');
    generateBtn.classList.add('enabled');
    
    // Add a direct click event listener to the generate button
    generateBtn.addEventListener('click', function() {
        console.log("Generate button clicked via emergency handler");
        emergencyGenerateStarMap();
    });
    
    // Also call the function directly to ensure it runs
    setTimeout(function() {
        console.log("Auto-generating star map");
        emergencyGenerateStarMap();
    }, 1000);
    
    // Function to generate a star map directly on the canvas
    function emergencyGenerateStarMap() {
        console.log("Emergency generate star map function called");
        
        try {
            // Get the canvas context
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error("Could not get canvas context");
                return;
            }
            
            // Set canvas dimensions
            canvas.width = 800;
            canvas.height = 800;
            
            // Get colors from inputs or use defaults
            const starFieldColor = document.getElementById('star-field-color')?.value || "#000000";
            const outsideColor = document.getElementById('outside-color')?.value || "#0a0e1a";
            
            // Draw background
            ctx.fillStyle = outsideColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw star field area
            ctx.fillStyle = starFieldColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
            
            // Draw stars
            drawEmergencyStars(ctx, canvas.width, canvas.height);
            
            // Get text inputs
            const text1 = document.getElementById("text-entry-1")?.value || "";
            const text2 = document.getElementById("text-entry-2")?.value || "";
            const text3 = document.getElementById("text-entry-3")?.value || "";
            
            // Draw text
            ctx.font = "48px Arial";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            if (text1) {
                ctx.fillText(text1, canvas.width / 2, canvas.height * 0.6);
            }
            
            if (text2) {
                ctx.font = "24px Arial";
                ctx.fillText(text2, canvas.width / 2, canvas.height * 0.7);
            }
            
            if (text3) {
                ctx.font = "16px Arial";
                ctx.fillText(text3, canvas.width / 2, canvas.height * 0.8);
            }
            
            // Draw date
            const date = document.getElementById("date")?.value;
            if (date) {
                const dateObj = new Date(date);
                const formattedDate = dateObj.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                
                ctx.font = "14px Arial";
                ctx.fillText(formattedDate, canvas.width / 2, canvas.height * 0.9);
            }
            
            // Draw coordinates
            const latitude = document.getElementById("latitude")?.value;
            const longitude = document.getElementById("longitude")?.value;
            if (latitude && longitude) {
                ctx.font = "14px Arial";
                ctx.fillText(`${latitude}° N, ${longitude}° W`, canvas.width / 2, canvas.height * 0.95);
            }
            
            // Enable download button
            const downloadBtn = document.getElementById("downloadBtn");
            if (downloadBtn) {
                downloadBtn.removeAttribute("disabled");
                downloadBtn.classList.add("enabled");
            }
            
            // Set up zoom functionality
            setupEmergencyZoom();
            
            console.log("Star map generated successfully via emergency function");
        } catch (error) {
            console.error("Error in emergency star map generation:", error);
        }
    }
    
    // Function to draw stars directly
    function drawEmergencyStars(ctx, width, height) {
        console.log("Drawing stars via emergency function");
        
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
        
        // Draw some colored stars
        const numColoredStars = Math.floor(numStars / 50);
        const starColors = [
            'rgba(255, 200, 200, 0.8)', // Red
            'rgba(200, 200, 255, 0.8)', // Blue
            'rgba(255, 255, 200, 0.8)', // Yellow
            'rgba(200, 255, 200, 0.8)'  // Green
        ];
        
        for (let i = 0; i < numColoredStars; i++) {
            const x = Math.random() * width;
            const y = Math.random() * (height / 2); // Only in the top half
            const radius = 1 + Math.random() * 2;
            const colorIndex = Math.floor(Math.random() * starColors.length);
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = starColors[colorIndex];
            ctx.fill();
        }
    }
    
    // Function to set up zoom functionality
    function setupEmergencyZoom() {
        console.log("Setting up emergency zoom functionality");
        
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        
        if (!zoomSlider || !zoomValue) {
            console.error("Zoom elements not found");
            return;
        }
        
        // Set initial zoom
        const initialZoom = parseInt(zoomSlider.value) || 100;
        zoomValue.textContent = initialZoom;
        canvas.style.transform = `scale(${initialZoom / 100})`;
        canvas.style.transformOrigin = "center top";
        
        // Add event listener to zoom slider
        zoomSlider.addEventListener('input', function() {
            const zoom = parseInt(this.value);
            zoomValue.textContent = zoom;
            canvas.style.transform = `scale(${zoom / 100})`;
            canvas.style.transformOrigin = "center top";
        });
        
        console.log("Emergency zoom functionality set up");
    }
    
    // Override the downloadStarMap function
    window.downloadStarMap = function() {
        console.log("Emergency download function called");
        
        try {
            // Get the canvas
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                console.error("Canvas not found");
                return;
            }
            
            // Get selected image type
            const isPng = document.getElementById("image-type-png")?.checked;
            const isJpg = document.getElementById("image-type-jpg")?.checked;
            const isSvg = document.getElementById("image-type-svg")?.checked;
            let imageType = isPng ? "png" : (isJpg ? "jpg" : (isSvg ? "svg" : "png")); // Default to PNG
            
            // Get the date for the filename
            const date = document.getElementById("date")?.value;
            const dateObj = new Date(date || new Date());
            const formattedDate = dateObj.toISOString().split('T')[0];
            
            // Get the first text entry for the filename
            const title = document.getElementById("text-entry-1")?.value || "star_map";
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
    
    console.log("Emergency Fix script initialized");
});
