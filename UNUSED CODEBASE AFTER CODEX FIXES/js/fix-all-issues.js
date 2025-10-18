// Fix All Issues - Comprehensive fixes for the Star Map Generator

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fix All Issues script loaded");
    
    // Fix 1: PREVIEW button functionality
    fixPreviewButton();
    
    // Fix 2: History functionality
    fixHistoryFunctionality();
    
    // Fix 3: ZIP code dropdown
    fixZipCodeDropdown();
    
    console.log("All fixes applied");
});

// Fix 1: PREVIEW button functionality
function fixPreviewButton() {
    console.log("Fixing PREVIEW button");
    
    // Get the generate button
    const generateBtn = document.getElementById('generateBtn');
    if (!generateBtn) {
        console.error("Generate button not found");
        return;
    }
    
    // Create a direct click handler that will bypass any other handlers
    generateBtn.addEventListener('click', function(event) {
        console.log("Generate button clicked via direct handler");
        
        // Check if the button is disabled
        if (generateBtn.hasAttribute('disabled')) {
            console.log("Button is disabled, not generating");
            return;
        }
        
        // Call the generateStarMap function directly
        if (typeof window.generateStarMap === 'function') {
            console.log("Calling generateStarMap function directly");
            window.generateStarMap();
        } else {
            console.error("generateStarMap function not found, using fallback");
            generateStarMapFallback();
        }
    }, true); // Use capturing to ensure this handler runs first
    
    // Remove the disabled attribute to make the button clickable
    const requiredFields = [
        document.getElementById("occasion"),
        document.getElementById("date"),
        document.getElementById("latitude"),
        document.getElementById("longitude")
    ];
    
    // Check if all required fields have values
    const allFieldsHaveValues = requiredFields.every(field => field && field.value);
    
    // If all fields have values, enable the button
    if (allFieldsHaveValues) {
        generateBtn.removeAttribute("disabled");
        generateBtn.classList.add("enabled");
        console.log("Generate button enabled");
    }
    
    console.log("PREVIEW button fix applied");
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
        drawFallbackStars(ctx, canvas.width, canvas.height);
        
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

// Fix 2: History functionality
function fixHistoryFunctionality() {
    console.log("Fixing history functionality");
    
    // Force load saved settings
    if (typeof loadSavedSettings === 'function') {
        console.log("Loading saved settings");
        setTimeout(function() {
            loadSavedSettings();
        }, 1000);
    } else {
        console.error("loadSavedSettings function not found");
    }
    
    // Fix text entry history
    if (typeof loadSavedTextInputs === 'function') {
        console.log("Loading saved text inputs");
        setTimeout(function() {
            loadSavedTextInputs();
        }, 1000);
    } else {
        console.error("loadSavedTextInputs function not found");
    }
    
    // Fix occasion dropdown
    const occasionSelect = document.getElementById('occasion');
    if (occasionSelect) {
        // Load saved occasion from localStorage
        const savedSettings = localStorage.getItem('lastMapSettings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                if (settings.occasion) {
                    occasionSelect.value = settings.occasion;
                    console.log(`Set occasion to: ${settings.occasion}`);
                }
            } catch (error) {
                console.error("Error loading saved occasion:", error);
            }
        }
    }
    
    // Fix date input
    const dateInput = document.getElementById('date');
    if (dateInput) {
        // Load saved date from localStorage
        const savedSettings = localStorage.getItem('lastMapSettings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                if (settings.date) {
                    dateInput.value = settings.date;
                    console.log(`Set date to: ${settings.date}`);
                }
            } catch (error) {
                console.error("Error loading saved date:", error);
            }
        }
    }
    
    console.log("History functionality fix applied");
}

// Fix 3: ZIP code dropdown
function fixZipCodeDropdown() {
    console.log("Fixing ZIP code dropdown");
    
    const zipCodeInput = document.getElementById('zip-code');
    if (!zipCodeInput) {
        console.error("ZIP code input not found");
        return;
    }
    
    // Improve the click handler to show all options
    zipCodeInput.addEventListener('click', function() {
        // Clear the input temporarily to show all options
        const currentValue = this.value;
        this.value = '';
        
        // Focus and show dropdown
        this.focus();
        
        // Restore the value after a short delay
        setTimeout(() => {
            this.value = currentValue;
            
            // Select the text to make it easy to replace
            this.select();
        }, 100);
    });
    
    // Create a custom dropdown button
    const dropdownButton = document.createElement('button');
    dropdownButton.type = 'button';
    dropdownButton.className = 'zip-dropdown-button';
    dropdownButton.innerHTML = '▼';
    dropdownButton.style.position = 'absolute';
    dropdownButton.style.right = '5px';
    dropdownButton.style.top = '50%';
    dropdownButton.style.transform = 'translateY(-50%)';
    dropdownButton.style.background = 'none';
    dropdownButton.style.border = 'none';
    dropdownButton.style.cursor = 'pointer';
    dropdownButton.style.zIndex = '5';
    
    // Add click handler to the button
    dropdownButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Clear the input to show all options
        const currentValue = zipCodeInput.value;
        zipCodeInput.value = '';
        
        // Focus and show dropdown
        zipCodeInput.focus();
        
        // Show the custom dropdown
        const dropdownList = document.getElementById('zip-dropdown-list');
        if (dropdownList) {
            dropdownList.style.display = 'block';
            
            // Position the dropdown below the input
            const rect = zipCodeInput.getBoundingClientRect();
            dropdownList.style.top = `${rect.bottom}px`;
            dropdownList.style.left = `${rect.left}px`;
            dropdownList.style.width = `${rect.width}px`;
        }
    });
    
    // Add the button to the container
    const zipContainer = document.querySelector('.zip-code-container');
    if (zipContainer) {
        zipContainer.style.position = 'relative';
        zipContainer.appendChild(dropdownButton);
    } else {
        // Create container if it doesn't exist
        const container = document.createElement('div');
        container.className = 'zip-code-container';
        container.style.position = 'relative';
        
        // Replace the input with the container
        const parent = zipCodeInput.parentNode;
        parent.insertBefore(container, zipCodeInput);
        container.appendChild(zipCodeInput);
        container.appendChild(dropdownButton);
    }
    
    console.log("ZIP code dropdown fix applied");
}
