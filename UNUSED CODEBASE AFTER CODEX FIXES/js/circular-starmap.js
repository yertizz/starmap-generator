// Circular Star Map Functionality

// Function to ensure the star map is circular
function ensureCircularStarMap() {
    // First, remove any existing circular containers to prevent nesting
    const existingContainers = document.querySelectorAll('.circular-starfield-container');
    if (existingContainers.length > 0) {
        console.log("Found existing circular containers, removing them first");
        existingContainers.forEach(container => {
            const canvas = container.querySelector('#star-map-canvas');
            if (canvas) {
                // Move the canvas out of the container
                container.parentNode.insertBefore(canvas, container);
                // Remove the empty container
                container.parentNode.removeChild(container);
            } else {
                // If no canvas, just remove the container
                container.parentNode.removeChild(container);
            }
        });
    }
    
    const canvas = document.getElementById('star-map-canvas');
    if (!canvas) return;
    
    // Force the canvas to have a 1:1 aspect ratio
    canvas.style.aspectRatio = '1 / 1';
    
    // Make sure the canvas has a 1:1 aspect ratio for the star field
    const starFieldContainer = document.createElement('div');
    starFieldContainer.className = 'circular-starfield-container';
    starFieldContainer.style.position = 'relative';
    starFieldContainer.style.width = '100%';
    starFieldContainer.style.height = '0';
    starFieldContainer.style.paddingBottom = '100%'; // Create a perfect square
    starFieldContainer.style.aspectRatio = '1 / 1';
    starFieldContainer.style.display = 'block'; // Use block instead of flex
    starFieldContainer.style.overflow = 'hidden'; // Hide overflow
    starFieldContainer.style.borderRadius = '50%'; // Make it circular
    
    // Replace the canvas with the container
    const parent = canvas.parentNode;
    parent.insertBefore(starFieldContainer, canvas);
    starFieldContainer.appendChild(canvas);
    
    // Set canvas styles to ensure it fills the container properly
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.borderRadius = '50%';
    
    // Override the generateStarMap function to ensure circular star field
    const originalGenerateStarMap = window.generateStarMap;
    if (originalGenerateStarMap) {
        window.generateStarMap = function() {
            // Call the original function
            originalGenerateStarMap.apply(this, arguments);
            
            // After generating, ensure the star field is circular
            const canvas = document.getElementById('star-map-canvas');
            if (canvas) {
                // Get the current dimensions
                const width = canvas.width;
                const height = canvas.height;
                
                // Calculate the radius for the circular star field
                // Always use a fixed percentage of the smaller dimension to ensure it's circular
                // For very large dimensions, use a more appropriate scaling factor
                const smallerDimension = Math.min(width, height);
                let radius;
                
                // For large dimensions (like 3540 x 3186), use a smaller percentage
                if (smallerDimension > 2000) {
                    radius = smallerDimension * 0.25;
                } else {
                    radius = smallerDimension * 0.3;
                }
                
                // Get the context
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    // Redraw the star field as a perfect circle
                    const centerX = width / 2;
                    const centerY = height / 3; // Position in the upper portion
                    
                    // Clear the existing star field area
                    ctx.clearRect(0, 0, width, height / 2); // Clear the top half where the star field is
                    
                    // Redraw the background in the cleared area
                    const outsideColor = window.outsideColor || "#0a0e1a";
                    ctx.fillStyle = outsideColor;
                    ctx.fillRect(0, 0, width, height / 2);
                    
                    // Create a circular clipping path
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                    ctx.clip();
                    
                    // Fill with star field color
                    ctx.fillStyle = window.starFieldColor || "#000000";
                    ctx.fillRect(0, 0, width, height / 2);
                    
                    // Draw stars within the clipping path
                    if (typeof drawStars === 'function') {
                        console.log("Drawing stars in circular container");
                        drawStars(ctx, width, height, 80);
                    } else {
                        console.error("drawStars function not found!");
                        // Fallback to basic star drawing if the function is not available
                        drawBasicStars(ctx, width, height, 80);
                    }
                    
                    // Restore the context
                    ctx.restore();
                    
                    // Draw the border
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    console.log("Ensured star field is circular with radius:", radius);
                }
            }
        };
    }
    
    // Override the downloadStarMap function to ensure it works
    const originalDownloadStarMap = window.downloadStarMap;
    if (originalDownloadStarMap) {
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
                
                let exportTransparency = document.getElementById("export-transparency")?.checked || false;
                
                // Get the date for the filename
                const date = document.getElementById("date").value;
                const dateObj = new Date(date);
                const formattedDate = dateObj.toISOString().split('T')[0];
                
                // Get the first text entry for the filename
                const title = document.getElementById("text-entry-1").value || "star_map";
                const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                
                const link = document.createElement("a");
                
                if (imageType === "png") {
                    // For PNG, we can support transparency
                    const dataURL = canvas.toDataURL("image/png");
                    link.href = dataURL;
                    link.download = `${safeTitle}_${formattedDate}.png`;
                } else if (imageType === "jpg") {
                    // JPG doesn't support transparency
                    const dataURL = canvas.toDataURL("image/jpeg", 0.9); // Quality 0.9 for JPG
                    link.href = dataURL;
                    link.download = `${safeTitle}_${formattedDate}.jpg`;
                } else if (imageType === "svg") {
                    // Create SVG content
                    const svgContent = typeof generateSVG === 'function' ? 
                        generateSVG(canvas) : 
                        createSimpleSVG(canvas);
                    
                    const blob = new Blob([svgContent], {type: 'image/svg+xml'});
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
    }
}

// Fallback function for drawing basic stars
function drawBasicStars(ctx, width, height, density = 100) {
    console.log("Using fallback star drawing function");
    
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
}

// Simple SVG generation fallback
function createSimpleSVG(canvas) {
    const width = canvas.width;
    const height = canvas.height;
    
    // Start SVG content
    let svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
`;
    
    // Add background rectangle
    const outsideColor = document.getElementById("outside-color")?.value || "#0a0e1a";
    svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="${outsideColor}" />`;
    
    // Add star field circle
    const centerX = width / 2;
    const centerY = height / 3;
    
    // For large dimensions, use a smaller percentage
    const smallerDimension = Math.min(width, height);
    let radius;
    if (smallerDimension > 2000) {
        radius = smallerDimension * 0.25;
    } else {
        radius = smallerDimension * 0.3;
    }
    const starFieldColor = document.getElementById("star-field-color")?.value || "#000000";
    
    svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="${starFieldColor}" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2" />`;
    
    // Close the SVG
    svg += `</svg>`;
    
    return svg;
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Ensure the star map is circular
    ensureCircularStarMap();
    
    // Set up image type radio buttons to handle transparency checkbox
    const imageTypeRadios = document.querySelectorAll('input[name="imageType"]');
    imageTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const transparencyCheckbox = document.getElementById('export-transparency');
            if (transparencyCheckbox) {
                if (this.value === 'jpg') {
                    transparencyCheckbox.disabled = true;
                    transparencyCheckbox.checked = false;
                    transparencyCheckbox.parentElement.classList.add('disabled');
                } else {
                    transparencyCheckbox.disabled = false;
                    transparencyCheckbox.parentElement.classList.remove('disabled');
                }
            }
        });
    });
    
    // Add a mutation observer to detect when the canvas is regenerated
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Check if a new canvas was added
                const canvas = document.getElementById('star-map-canvas');
                if (canvas && !canvas.parentNode.classList.contains('circular-starfield-container')) {
                    console.log("Canvas regenerated, ensuring circular shape");
                    ensureCircularStarMap();
                }
            }
        });
    });
    
    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
});
