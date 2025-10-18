// Enable "Generate My Star Map" button only when all required fields are filled
function validateInputs() {
    // Get the occasion value, handling custom occasions
    let occasion = document.getElementById("occasion").value;
    if (occasion === 'custom') {
        // If "Add Your Own..." is selected, check for a custom value
        const customValue = document.getElementById("occasion").getAttribute('data-custom-value') || '';
        if (customValue.trim()) {
            occasion = customValue; // Use the custom value if it exists
        }
    }
    
    const date = document.getElementById("date").value;
    const latitude = document.getElementById("latitude").value.trim();
    const longitude = document.getElementById("longitude").value.trim();

    const generateBtn = document.getElementById("generateBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    console.log("Validating inputs:", { occasion, date, latitude, longitude });

    if (occasion && date && latitude && longitude) {
        generateBtn.removeAttribute("disabled");
        generateBtn.classList.add("enabled");
        console.log("Generate button enabled");
    } else {
        generateBtn.setAttribute("disabled", "true");
        generateBtn.classList.remove("enabled");
        console.log("Generate button disabled, missing:", 
            !occasion ? "occasion" : "", 
            !date ? "date" : "", 
            !latitude ? "latitude" : "", 
            !longitude ? "longitude" : "");
    }
    
    // Download button is enabled only after preview is generated
    try {
        if (document.getElementById("star-map-canvas").getContext('2d').getImageData(0, 0, 1, 1).data[3] !== 0) {
            downloadBtn.removeAttribute("disabled");
            downloadBtn.classList.add("enabled");
        } else {
            downloadBtn.setAttribute("disabled", "true");
            downloadBtn.classList.remove("enabled");
        }
    } catch (e) {
        console.error("Error checking canvas data:", e);
        // If there's an error, keep the download button disabled
        downloadBtn.setAttribute("disabled", "true");
        downloadBtn.classList.remove("enabled");
    }
    
    // Make sure the generate button has the correct click handler
    if (!generateBtn.onclick) {
        generateBtn.onclick = generateStarMap;
        console.log("Added click handler to generate button");
    }
}

// Track character countdown for customizable text fields
function updateCharCount(input, counterId) {
    const maxLength = input.maxLength;
    const currentLength = input.value.length;
    document.getElementById(counterId).innerText = maxLength - currentLength;
}

// Attach character countdown to each customizable text entry
document.querySelectorAll(".text-entry").forEach((input, index) => {
    input.addEventListener("input", () => {
        updateCharCount(input, `char-count-${index + 1}`);
    });
});

// Global variables
let starFieldColorPicker;
let outsideColorPicker;
let starFieldColor = "#000000"; // Black for star field
let outsideColor = "#0a0e1a"; // Dark blue for outside area
let aspectRatio = 1.25; // Default aspect ratio (height/width)
let currentStarMapStyle = "standard"; // Default star map style

// Function to save text input to local storage
function saveTextInput(inputId, value) {
    if (!value.trim()) return; // Don't save empty values
    
    // Get existing history or create new array
    let history = JSON.parse(localStorage.getItem(`${inputId}_history`) || '[]');
    
    // Remove duplicate if exists
    history = history.filter(item => item !== value);
    
    // Add new value to the beginning
    history.unshift(value);
    
    // Keep only the last 20 entries (increased from 10)
    if (history.length > 20) {
        history = history.slice(0, 20);
    }
    
    // Save back to local storage
    localStorage.setItem(`${inputId}_history`, JSON.stringify(history));
}

// Function to load saved text inputs from local storage
function loadSavedTextInputs() {
    const textInputIds = ['text-entry-1', 'text-entry-2', 'text-entry-3'];
    
    textInputIds.forEach(inputId => {
        const history = JSON.parse(localStorage.getItem(`${inputId}_history`) || '[]');
        if (history.length > 0) {
            // Set the most recent value as the current value
            document.getElementById(inputId).value = history[0];
            
            // Update character count
            const countId = `char-count-${inputId.split('-')[2]}`;
            const charCount = document.getElementById(countId);
            if (charCount) {
                charCount.textContent = 50 - history[0].length;
            }
        }
    });
}

// Function to setup text input history
function setupTextInputHistory() {
    const textInputIds = ['text-entry-1', 'text-entry-2', 'text-entry-3'];
    
    textInputIds.forEach(inputId => {
        const input = document.getElementById(inputId);
        
        // Create datalist for suggestions
        const datalistId = `${inputId}-history`;
        let datalist = document.getElementById(datalistId);
        
        if (!datalist) {
            datalist = document.createElement('datalist');
            datalist.id = datalistId;
            document.body.appendChild(datalist);
            input.setAttribute('list', datalistId);
        }
        
        // Load history into datalist
        const history = JSON.parse(localStorage.getItem(`${inputId}_history`) || '[]');
        datalist.innerHTML = '';
        history.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            datalist.appendChild(option);
        });
        
        // Save input when it changes or when Enter is pressed
        input.addEventListener('change', function() {
            saveTextInput(inputId, this.value);
            updateDatalist(inputId, datalist);
        });
        
        // Also save when Enter is pressed
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                saveTextInput(inputId, this.value);
                updateDatalist(inputId, datalist);
            }
        });
        
        // Function to update datalist with history items
        function updateDatalist(inputId, datalist) {
            const history = JSON.parse(localStorage.getItem(`${inputId}_history`) || '[]');
            datalist.innerHTML = '';
            history.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                datalist.appendChild(option);
            });
        }
        
        // Update character count when input changes
        input.addEventListener('input', function() {
            const countId = `char-count-${inputId.split('-')[2]}`;
            const charCount = document.getElementById(countId);
            if (charCount) {
                charCount.textContent = 50 - this.value.length;
            }
        });
    });
}

// Function to format the date in the required format: "Monday, 18th November, 1946"
function formatDateForStarMap(dateString) {
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

// Function to format coordinates in the required format: "N32° 55′.93211′ W80° 7′.22460′"
function formatCoordinatesForStarMap(latValue, lngValue) {
    // Parse the latitude and longitude values
    let lat, lng;
    
    // Check if the values are already in DMM format
    if (typeof latValue === 'string' && latValue.includes('°')) {
        // Extract the numeric part and direction
        const latMatch = latValue.match(/([NS])(\d+)°\s+(\d+)′\.(\d+)/);
        const lngMatch = lngValue.match(/([EW])(\d+)°\s+(\d+)′\.(\d+)/);
        
        if (latMatch && lngMatch) {
            // If already in the correct format, just return as is
            return `${latValue} ${lngValue}`;
        } else {
            // Fallback to default values if parsing fails
            lat = 32.94801881089943;
            lng = -80.12040996224559;
        }
    } else {
        // Assume the values are already decimal
        lat = parseFloat(latValue);
        lng = parseFloat(lngValue);
    }
    
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

// Function to generate the star map
function generateStarMap() {
    try {
        console.log("Generating star map...");
        
        // Save current settings before generating the map
        if (typeof saveCurrentSettings === 'function') {
            saveCurrentSettings();
        }
        
        const canvas = document.getElementById("star-map-canvas");
        const ctx = canvas.getContext("2d");
        
        // Get output dimensions from input fields
        const outputWidth = parseInt(document.getElementById("output-width").value) || 800;
        const outputHeight = parseInt(document.getElementById("output-height").value) || 1000;
