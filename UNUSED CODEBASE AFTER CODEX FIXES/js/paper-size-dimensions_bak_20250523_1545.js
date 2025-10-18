/* START OF CODE - Cline - 2025-05-15 18:27:00 File: js/paper-size-dimensions.js */

/**
 * Paper Size and Dimensions JavaScript for Star Map Generator
 * 
 * This script implements the functionality for:
 * 1. Paper Auto-Size dropdown with Imperial and European options
 * 2. DPI selector with options for 100, 150, 200, and 300
 * 3. Auto-calculation of width and height based on paper size and DPI
 * 4. Ensures star map is always displayed as a perfect circle
 * 5. Properly handles manually entered dimensions
 * 6. Sets default dimensions to 2550 x 3300 with DPI of 300
 * 7. Ensures aspect ratio checkbox is unchecked by default
 * 8. FIXED: Prevents other scripts from setting dimensions to 3000 x 3000
 * 9. FIXED: Allows user to use aspect ratio functionality when desired
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Paper Size and Dimensions JS");
    
    // FIXED: Delay execution to ensure this runs after any other scripts
    setTimeout(function() {
        // Set default dimensions to 2550 x 3300 with DPI of 300
        setDefaultDimensions();
        
        // Initialize the Paper Auto-Size and DPI functionality
        initPaperSizeAndDPI();
        
        // Add event listeners for width, height, and aspect ratio changes
        addDimensionChangeListeners();
        
        // Add event listener for circle radius changes
        addCircleRadiusListener();
        
        // FIXED: Add one-time check to prevent 3000 x 3000 defaults
        preventDefaultSquare();
        
        // Ensure the star map is displayed as a perfect circle
        if (typeof window.calculateCircleDimensions === 'function') {
            window.calculateCircleDimensions();
        }
        
        if (typeof window.applyCircleCSS === 'function') {
            window.applyCircleCSS();
        }
    }, 500); // Delay by 500ms to ensure this runs after other scripts
});

/**
 * FIXED: Prevent default square dimensions of 3000 x 3000
 * This will only run once at page load to prevent the default square dimensions
 * but will allow the user to manually change the dimensions and use aspect ratio
 */
function preventDefaultSquare() {
    console.log("Preventing default square dimensions of 3000 x 3000");
    
    // Get references to the width and height inputs and aspect ratio checkbox
    const widthInput = document.getElementById('output-width');
    const heightInput = document.getElementById('output-height');
    const aspectRatioCheckbox = document.getElementById('maintain-aspect-ratio');
    
    if (!widthInput || !heightInput || !aspectRatioCheckbox) {
        console.error("Width, height, or aspect ratio inputs not found");
        return;
    }
    
    // Check if the current dimensions are 3000 x 3000
    if (parseInt(widthInput.value) === 3000 && parseInt(heightInput.value) === 3000) {
        console.log("Detected default square dimensions of 3000 x 3000, setting to 2550 x 3300");
        
        // Set dimensions to 2550 x 3300
        widthInput.value = 2550;
        heightInput.value = 3300;
        
        // Ensure aspect ratio checkbox is unchecked
        aspectRatioCheckbox.checked = false;
        
        // Trigger change events
        widthInput.dispatchEvent(new Event('change', { bubbles: true }));
        heightInput.dispatchEvent(new Event('change', { bubbles: true }));
        aspectRatioCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Add a one-time event listener to check for 3000 x 3000 after a short delay
    setTimeout(function() {
        if (parseInt(widthInput.value) === 3000 && parseInt(heightInput.value) === 3000) {
            console.log("Detected default square dimensions of 3000 x 3000 after delay, setting to 2550 x 3300");
            
            // Set dimensions to 2550 x 3300
            widthInput.value = 2550;
            heightInput.value = 3300;
            
            // Ensure aspect ratio checkbox is unchecked
            aspectRatioCheckbox.checked = false;
            
            // Trigger change events
            widthInput.dispatchEvent(new Event('change', { bubbles: true }));
            heightInput.dispatchEvent(new Event('change', { bubbles: true }));
            aspectRatioCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }, 1000); // Check again after 1 second
}

/**
 * Set default dimensions to 2550 x 3300 with DPI of 300
 * FIXED: Ensure aspect ratio checkbox is unchecked by default
 */
function setDefaultDimensions() {
    console.log("Setting default dimensions to 2550 x 3300 with DPI of 300");
    
    // Get references to the width and height inputs and aspect ratio checkbox
    const widthInput = document.getElementById('output-width');
    const heightInput = document.getElementById('output-height');
    const aspectRatioCheckbox = document.getElementById('maintain-aspect-ratio');
    
    if (!widthInput || !heightInput || !aspectRatioCheckbox) {
        console.error("Width, height, or aspect ratio inputs not found");
        return;
    }
    
    // FIXED: Set default dimensions to 2550 x 3300
    // Use both value property and setAttribute to ensure it's set
    widthInput.value = 2550;
    widthInput.setAttribute('value', '2550');
    
    heightInput.value = 3300;
    heightInput.setAttribute('value', '3300');
    
    // FIXED: Ensure aspect ratio checkbox is unchecked by default
    // Use both checked property and removeAttribute to ensure it's unchecked
    aspectRatioCheckbox.checked = false;
    aspectRatioCheckbox.removeAttribute('checked');
    
    // FIXED: Explicitly trigger a change event to ensure any listeners are notified
    const changeEvent = new Event('change', { bubbles: true });
    aspectRatioCheckbox.dispatchEvent(changeEvent);
    
    // Store the current dimensions for reference
    window.currentDimensions = {
        width: 2550,
        height: 3300
    };
    
    console.log("Default dimensions set to 2550 x 3300 with aspect ratio unchecked");
    
    // FIXED: Directly modify any inline styles that might be affecting the aspect ratio
    const starMapCanvas = document.getElementById('star-map-canvas');
    if (starMapCanvas) {
        // Ensure the star map is displayed as a rectangle, not a square
        const smallerDimension = Math.min(2550, 3300);
        const circleDiameter = Math.round(smallerDimension * 0.6); // 60% of smaller dimension
        
        starMapCanvas.style.width = circleDiameter + 'px';
        starMapCanvas.style.height = circleDiameter + 'px';
        starMapCanvas.style.borderRadius = '50%';
    }
}

/**
 * Initialize Paper Auto-Size and DPI functionality
 */
function initPaperSizeAndDPI() {
    console.log("Initializing Paper Auto-Size and DPI functionality");
    
    // Define paper sizes in inches
    const paperSizes = {
        // Imperial (USA) sizes
        "8x10_in": { width: 8, height: 10, name: "8 x 10 (in) / 20.32 x 25.40 (cm)" },
        "8.5x11_in": { width: 8.5, height: 11, name: "8.5 x 11 (in) / 21.60 x 27.94 (cm)" },
        "11x14_in": { width: 11, height: 14, name: "11 x 14 (in) / 27.94 x 35.56 (cm)" },
        "11x17_in": { width: 11, height: 17, name: "11 x 17 (in) / 27.94 x 43.18 (cm)" },
        "16x20_in": { width: 16, height: 20, name: "16 x 20 (in) / 40.64 x 50.80 (cm)" },
        "18x24_in": { width: 18, height: 24, name: "18 x 24 (in) / 45.70 x 60.96 (cm)" },
        "20x24_in": { width: 20, height: 24, name: "20 x 24 (in) / 50.80 x 60.96 (cm)" },
        "20x30_in": { width: 20, height: 30, name: "20 x 30 (in) / 50.80 x 76.20 (cm)" },
        "24x36_in": { width: 24, height: 36, name: "24 x 36 (in) / 60.96 x 91.44 (cm)" },
        "27x40_in": { width: 27, height: 40, name: "27 x 40 (in) / 60.58 x 101.60 (cm)" },
        
        // European (UK) sizes
        "A5": { width: 5.8, height: 8.3, name: "A5 14.80 x 21.00 (cm) / 5.80 x 8.30 (in)" },
        "A4": { width: 8.3, height: 11.7, name: "A4 21.00 x 29.70 (cm) / 8.30 x 11.70 (in)" },
        "A3": { width: 11.7, height: 16.5, name: "A3 29.70 x 42.00 (cm) / 11.70 x 16.50 (in)" },
        "A2": { width: 16.5, height: 23.4, name: "A2 42.00 x 59.40 (cm) / 16.50 x 23.40 (in)" },
        "A1": { width: 23.4, height: 33.1, name: "A1 59.40 x 84.10 (cm) / 23.40 x 33.10 (in)" },
        "A0": { width: 33.1, height: 46.8, name: "A0 84.10 x 118.90 (cm) / 33.10 x 46.80 (in)" }
    };
    
    // Get references to the canvas settings container
    const canvasSettings = document.getElementById('canvas-settings');
    if (!canvasSettings) {
        console.error("Canvas settings container not found");
        return;
    }
    
    // Get references to the width and height inputs
    const widthInput = document.getElementById('output-width');
    const heightInput = document.getElementById('output-height');
    const aspectRatioCheckbox = document.getElementById('maintain-aspect-ratio');
    
    if (!widthInput || !heightInput || !aspectRatioCheckbox) {
        console.error("Width, height, or aspect ratio inputs not found");
        return;
    }
    
    // Create the Paper Auto-Size and DPI row
    const paperSizeRow = document.createElement('div');
    paperSizeRow.className = 'paper-size-row';
    paperSizeRow.innerHTML = `
        <label for="paper-auto-size">Paper Auto-Size:</label>
        <select id="paper-auto-size">
            <option value="default">Select A Paper Size...</option>
            <optgroup label="Imperial (USA)">
                <option value="8x10_in">8 x 10 (in) / 20.32 x 25.40 (cm)</option>
                <option value="8.5x11_in">8.5 x 11 (in) / 21.60 x 27.94 (cm)</option>
                <option value="11x14_in">11 x 14 (in) / 27.94 x 35.56 (cm)</option>
                <option value="11x17_in">11 x 17 (in) / 27.94 x 43.18 (cm)</option>
                <option value="16x20_in">16 x 20 (in) / 40.64 x 50.80 (cm)</option>
                <option value="18x24_in">18 x 24 (in) / 45.70 x 60.96 (cm)</option>
                <option value="20x24_in">20 x 24 (in) / 50.80 x 60.96 (cm)</option>
                <option value="20x30_in">20 x 30 (in) / 50.80 x 76.20 (cm)</option>
                <option value="24x36_in">24 x 36 (in) / 60.96 x 91.44 (cm)</option>
                <option value="27x40_in">27 x 40 (in) / 60.58 x 101.60 (cm)</option>
            </optgroup>
            <optgroup label="European (UK)">
                <option value="A5">A5 14.80 x 21.00 (cm) / 5.80 x 8.30 (in)</option>
                <option value="A4">A4 21.00 x 29.70 (cm) / 8.30 x 11.70 (in)</option>
                <option value="A3">A3 29.70 x 42.00 (cm) / 11.70 x 16.50 (in)</option>
                <option value="A2">A2 42.00 x 59.40 (cm) / 16.50 x 23.40 (in)</option>
                <option value="A1">A1 59.40 x 84.10 (cm) / 23.40 x 33.10 (in)</option>
                <option value="A0">A0 84.10 x 118.90 (cm) / 33.10 x 46.80 (in)</option>
            </optgroup>
        </select>
        
        <label for="dpi-selector">DPI:</label>
        <select id="dpi-selector">
            <option value="100">100</option>
            <option value="150">150</option>
            <option value="200">200</option>
            <option value="300" selected>300</option>
        </select>
    `;
    
    // Insert the Paper Auto-Size and DPI row at the beginning of the canvas settings container
    const firstRow = canvasSettings.querySelector('.settings-row');
    if (firstRow) {
        canvasSettings.insertBefore(paperSizeRow, firstRow);
    } else {
        canvasSettings.appendChild(paperSizeRow);
    }
    
    // Get references to the new elements
    const paperAutoSizeSelect = document.getElementById('paper-auto-size');
    const dpiSelector = document.getElementById('dpi-selector');
    
    if (!paperAutoSizeSelect || !dpiSelector) {
        console.error("Paper Auto-Size or DPI selector not found");
        return;
    }
    
    // Function to calculate width and height based on paper size and DPI
    function calculateDimensions() {
        const paperSizeValue = paperAutoSizeSelect.value;
        const dpi = parseInt(dpiSelector.value);
        
        if (paperSizeValue === 'default') {
            return; // Don't change dimensions for default
        }
        
        const paperSize = paperSizes[paperSizeValue];
        if (!paperSize) {
            console.error("Paper size not found:", paperSizeValue);
            return;
        }
        
        // Calculate dimensions in pixels based on paper size and DPI
        const widthInPixels = Math.round(paperSize.width * dpi);
        const heightInPixels = Math.round(paperSize.height * dpi);
        
        // Update the width and height inputs
        widthInput.value = widthInPixels;
        heightInput.value = heightInPixels;
        
        // Do NOT force the aspect ratio checkbox to be checked
        // Let the user decide whether to maintain aspect ratio
        
        // Store the current dimensions for reference
        window.currentDimensions = {
            width: widthInPixels,
            height: heightInPixels
        };
        
        console.log(`Calculated dimensions: ${widthInPixels}x${heightInPixels} pixels (${paperSize.width}x${paperSize.height} inches at ${dpi} DPI)`);
        
        // Calculate the circle dimensions based on the current settings
        calculateCircleDimensions();
    }
    
    // Function to calculate circle dimensions based on current width, height, and circle radius
    function calculateCircleDimensions() {
        // Get the current dimensions
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);
        
        // Get the circle radius percentage
        const circleRadiusInput = document.getElementById('circle-radius-percent');
        if (!circleRadiusInput) {
            console.error("Circle radius input not found");
            return;
        }
        
        const circleRadiusPercent = parseInt(circleRadiusInput.value || 60);
        
        // Always use the smaller dimension to ensure a perfect circle
        const smallerDimension = Math.min(width, height);
        
        // Calculate the circle diameter based on the radius percentage
        const circleDiameter = Math.round(smallerDimension * (circleRadiusPercent / 100));
        
        // Calculate the padding needed to center the circle
        const widthPadding = Math.round((width - circleDiameter) / 2);
        const heightPadding = Math.round((height - circleDiameter) / 2);
        
        console.log(`Circle dimensions calculated:`);
        console.log(`- Width: ${width}px, Height: ${height}px`);
        console.log(`- Circle radius: ${circleRadiusPercent}%`);
        console.log(`- Smaller dimension: ${smallerDimension}px`);
        console.log(`- Circle diameter: ${circleDiameter}px`);
        console.log(`- Padding: ${widthPadding}px horizontal, ${heightPadding}px vertical`);
        
        // Store the circle dimensions for use by other scripts
        window.circleDimensions = {
            width: width,
            height: height,
            smallerDimension: smallerDimension,
            circleDiameter: circleDiameter,
            widthPadding: widthPadding,
            heightPadding: heightPadding,
            circleRadiusPercent: circleRadiusPercent
        };
        
        // Apply CSS to ensure the star map is displayed as a perfect circle
        applyCircleCSS();
        
        // Trigger a custom event to notify other scripts that dimensions have changed
        const event = new CustomEvent('dimensionsChanged', {
            detail: window.circleDimensions
        });
        document.dispatchEvent(event);
    }
    
    // Function to apply CSS to ensure the star map is displayed as a perfect circle
    function applyCircleCSS() {
        if (!window.circleDimensions) {
            console.error("Circle dimensions not calculated");
            return;
        }
        
        // Get the star map canvas and its container
        const starMapCanvas = document.getElementById('star-map-canvas');
        const canvasContainer = document.querySelector('.canvas-container');
        
        if (!starMapCanvas) {
            console.error("Star map canvas not found");
            return;
        }
        
        // Apply CSS to ensure the star map is displayed as a perfect circle
        // Set both width and height to the circle diameter
        starMapCanvas.style.width = window.circleDimensions.circleDiameter + 'px';
        starMapCanvas.style.height = window.circleDimensions.circleDiameter + 'px';
        
        // Force a circular shape with border-radius
        starMapCanvas.style.borderRadius = '50%';
        
        // Center the star map within its container
        starMapCanvas.style.marginLeft = 'auto';
        starMapCanvas.style.marginRight = 'auto';
        starMapCanvas.style.display = 'block';
        
        // Ensure the canvas container has enough space for the circle
        if (canvasContainer) {
            canvasContainer.style.minHeight = (window.circleDimensions.circleDiameter + 40) + 'px';
            canvasContainer.style.position = 'relative';
        }
        
        console.log(`Applied CSS to ensure star map is displayed as a perfect circle with diameter ${window.circleDimensions.circleDiameter}px`);
    }
    
    // Add event listeners to the Paper Auto-Size and DPI selectors
    paperAutoSizeSelect.addEventListener('change', calculateDimensions);
    dpiSelector.addEventListener('change', calculateDimensions);
    
    // Store the functions on the window object for access from other scripts
    window.calculateStarMapDimensions = calculateDimensions;
    window.calculateCircleDimensions = calculateCircleDimensions;
    window.applyCircleCSS = applyCircleCSS;
}

/**
 * Add event listeners for width, height, and aspect ratio changes
 */
function addDimensionChangeListeners() {
    console.log("Adding dimension change listeners");
    
    // Get references to the width and height inputs and aspect ratio checkbox
    const widthInput = document.getElementById('output-width');
    const heightInput = document.getElementById('output-height');
    const aspectRatioCheckbox = document.getElementById('maintain-aspect-ratio');
    
    if (!widthInput || !heightInput || !aspectRatioCheckbox) {
        console.error("Width, height, or aspect ratio inputs not found");
        return;
    }
    
    // Function to update dimensions based on aspect ratio
    function updateDimensions(changedInput) {
        // Get the current values
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);
        
        // Store the current dimensions for reference
        window.currentDimensions = {
            width: width,
            height: height
        };
        
        // If aspect ratio is checked, maintain the ratio
        if (aspectRatioCheckbox.checked) {
            // Calculate the current aspect ratio if not already set
            if (!window.currentAspectRatio) {
                window.currentAspectRatio = width / height;
            }
            
            if (changedInput === 'width') {
                // Width changed, update height
                const newHeight = Math.round(width / window.currentAspectRatio);
                heightInput.value = newHeight;
                
                // Update the current dimensions
                window.currentDimensions.height = newHeight;
            } else {
                // Height changed, update width
                const newWidth = Math.round(height * window.currentAspectRatio);
                widthInput.value = newWidth;
                
                // Update the current dimensions
                window.currentDimensions.width = newWidth;
            }
        }
        
        // Calculate the circle dimensions based on the new width and height
        if (typeof window.calculateCircleDimensions === 'function') {
            window.calculateCircleDimensions();
        }
    }
    
    // Add event listeners to the width and height inputs
    widthInput.addEventListener('change', function() {
        updateDimensions('width');
    });
    
    heightInput.addEventListener('change', function() {
        updateDimensions('height');
    });
    
    // Add event listener to the aspect ratio checkbox
    aspectRatioCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // Update the aspect ratio based on current dimensions
            window.currentAspectRatio = parseInt(widthInput.value) / parseInt(heightInput.value);
            console.log(`Aspect ratio locked: ${window.currentAspectRatio}`);
            
            // FIXED: If the dimensions are 2550 x 3300, update the height to match the width
            // This ensures the aspect ratio is applied immediately
            if (parseInt(widthInput.value) === 2550 && parseInt(heightInput.value) === 3300) {
                const newHeight = Math.round(2550 / window.currentAspectRatio);
                heightInput.value = newHeight;
                
                // Update the current dimensions
                window.currentDimensions.height = newHeight;
                
                // Recalculate the circle dimensions
                if (typeof window.calculateCircleDimensions === 'function') {
                    window.calculateCircleDimensions();
                }
            }
        } else {
            console.log("Aspect ratio unlocked");
        }
        
        // Recalculate the circle dimensions
        if (typeof window.calculateCircleDimensions === 'function') {
            window.calculateCircleDimensions();
        }
    });
}

/**
 * Add event listener for circle radius changes
 */
function addCircleRadiusListener() {
    console.log("Adding circle radius listener");
    
    // Get reference to the circle radius input
    const circleRadiusInput = document.getElementById('circle-radius-percent');
    
    if (!circleRadiusInput) {
        console.error("Circle radius input not found");
        return;
    }
    
    // Add event listener to the circle radius input
    circleRadiusInput.addEventListener('change', function() {
        // Calculate the circle dimensions based on the new radius
        if (typeof window.calculateCircleDimensions === 'function') {
            window.calculateCircleDimensions();
        }
    });
}

/* END OF CODE - Cline - 2025-05-15 18:27:00 File: js/paper-size-dimensions.js */
