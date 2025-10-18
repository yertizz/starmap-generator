/* START OF CODE - Cline - 2025-05-15 17:02:00 File: js/container-reorganization.js */

/**
 * Container Reorganization JavaScript for Star Map Generator
 * 
 * This script implements the functionality for:
 * 1. Paper Auto-Size dropdown with Imperial and European options
 * 2. DPI selector with options for 100, 150, 200, and 300
 * 3. Auto-calculation of width and height based on paper size and DPI
 * 4. FIXED: Ensures proper aspect ratio for circular star maps
 * 5. FIXED: Ensures star map is always displayed as a perfect circle
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Container Reorganization JS");
    
    // Initialize the Paper Auto-Size and DPI functionality
    initPaperSizeAndDPI();
    
    // Move the Text Placements section to its own container
    moveTextPlacementsToOwnContainer();
    
    // COMPLETELY REWRITTEN: Fix the Advanced Options panel behavior
    fixAdvancedOptionsPanel();
    
    // NEW: Fix the Image Format row layout
    fixImageFormatRow();
    
    // NEW: Add event listeners for width, height, and aspect ratio changes
    addDimensionChangeListeners();
    
    // NEW: Add event listener for circle radius changes
    addCircleRadiusListener();
});

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
            <option value="default">Default</option>
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
    
    // COMPLETELY REWRITTEN: Function to calculate width and height based on paper size and DPI
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
        
        // Force the aspect ratio checkbox to be checked
        aspectRatioCheckbox.checked = true;
        
        // Store the aspect ratio for future use
        window.currentAspectRatio = widthInPixels / heightInPixels;
        
        console.log(`Calculated dimensions: ${widthInPixels}x${heightInPixels} pixels (${paperSize.width}x${paperSize.height} inches at ${dpi} DPI)`);
        
        // Calculate the circle dimensions based on the current settings
        calculateCircleDimensions();
    }
    
    // NEW: Function to calculate circle dimensions based on current width, height, and circle radius
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
        
        // Calculate the maximum circle diameter that can fit within the dimensions
        const smallerDimension = Math.min(width, height);
        const circleDiameter = Math.round(smallerDimension * (circleRadiusPercent / 100));
        
        // Calculate the padding needed on each side to center the circle
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
            circleDiameter: circleDiameter,
            widthPadding: widthPadding,
            heightPadding: heightPadding,
            circleRadiusPercent: circleRadiusPercent
        };
        
        // Trigger a custom event to notify other scripts that dimensions have changed
        const event = new CustomEvent('dimensionsChanged', {
            detail: window.circleDimensions
        });
        document.dispatchEvent(event);
    }
    
    // Add event listeners to the Paper Auto-Size and DPI selectors
    paperAutoSizeSelect.addEventListener('change', calculateDimensions);
    dpiSelector.addEventListener('change', calculateDimensions);
    
    // Store the functions on the window object for access from other scripts
    window.calculateStarMapDimensions = calculateDimensions;
    window.calculateCircleDimensions = calculateCircleDimensions;
}

/**
 * NEW: Add event listeners for width, height, and aspect ratio changes
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
        
        // Calculate the current aspect ratio if not already set
        if (!window.currentAspectRatio) {
            window.currentAspectRatio = width / height;
        }
        
        // If aspect ratio is checked, maintain the ratio
        if (aspectRatioCheckbox.checked) {
            if (changedInput === 'width') {
                // Width changed, update height
                const newHeight = Math.round(width / window.currentAspectRatio);
                heightInput.value = newHeight;
            } else {
                // Height changed, update width
                const newWidth = Math.round(height * window.currentAspectRatio);
                widthInput.value = newWidth;
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
        } else {
            console.log("Aspect ratio unlocked");
        }
    });
}

/**
 * NEW: Add event listener for circle radius changes
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

/**
 * Move the Text Placements section to its own container
 */
function moveTextPlacementsToOwnContainer() {
    console.log("Moving Text Placements to its own container");
    
    // Get references to the canvas settings container and the text placement section
    const canvasSettings = document.getElementById('canvas-settings');
    const textPlacementSection = canvasSettings.querySelector('.text-placement-section');
    
    if (!canvasSettings || !textPlacementSection) {
        console.error("Canvas settings container or text placement section not found");
        return;
    }
    
    // Create a new container for the text placements
    const textPlacementContainer = document.createElement('fieldset');
    textPlacementContainer.className = 'form-section text-placement-container';
    textPlacementContainer.innerHTML = '<legend>Text Placements On Star Map Canvas</legend>';
    
    // Move the text placement section to the new container
    textPlacementContainer.appendChild(textPlacementSection);
    
    // Insert the new container after the canvas settings container
    canvasSettings.parentNode.insertBefore(textPlacementContainer, canvasSettings.nextSibling);
    
    // AGGRESSIVE FIX: Remove all horizontal lines in the text placement container
    const horizontalLines = textPlacementContainer.querySelectorAll('hr');
    horizontalLines.forEach(line => {
        line.style.display = 'none';
        line.style.visibility = 'hidden';
        line.style.height = '0';
        line.style.opacity = '0';
        line.style.border = 'none';
        line.style.margin = '0';
        line.style.padding = '0';
    });
    
    // AGGRESSIVE FIX: Hide the old title
    const oldTitle = textPlacementContainer.querySelector('.text-placement-title');
    if (oldTitle) {
        oldTitle.style.display = 'none';
    }
    
    // AGGRESSIVE FIX: Reduce space between legend and content
    const textPlacementSections = textPlacementContainer.querySelectorAll('.text-placement-section');
    textPlacementSections.forEach(section => {
        section.style.marginTop = '0';
        section.style.paddingTop = '0';
    });
}

/**
 * NEW: Fix the Image Format row layout
 */
function fixImageFormatRow() {
    console.log("DIRECT HTML MANIPULATION: Fixing Image Format row layout");
    
    // Find the Image Format row
    const settingsPreviewDownloadSection = document.querySelector('.settings-preview-download-section');
    if (!settingsPreviewDownloadSection) {
        console.error("Settings + Preview + Download section not found");
        return;
    }
    
    // Find all settings rows
    const settingsRows = settingsPreviewDownloadSection.querySelectorAll('.settings-row');
    if (!settingsRows || settingsRows.length === 0) {
        console.error("Settings rows not found");
        return;
    }
    
    // Find the Image Format row
    let imageFormatRow = null;
    for (const row of settingsRows) {
        if (row.querySelector('input[name="image-format"]')) {
            imageFormatRow = row;
            break;
        }
    }
    
    if (!imageFormatRow) {
        console.error("Image Format row not found");
        return;
    }
    
    console.log("Found Image Format row, rebuilding it");
    
    // Save the original elements
    const originalElements = {
        label: imageFormatRow.querySelector('label:first-of-type'),
        pngRadio: imageFormatRow.querySelector('input[value="png"]'),
        pngLabel: imageFormatRow.querySelector('input[value="png"] + label'),
        transparencyCheckbox: imageFormatRow.querySelector('#png-transparency'),
        transparencyLabel: imageFormatRow.querySelector('label[for="png-transparency"]'),
        jpgRadio: imageFormatRow.querySelector('input[value="jpg"]'),
        jpgLabel: imageFormatRow.querySelector('input[value="jpg"] + label'),
        svgRadio: imageFormatRow.querySelector('input[value="svg"]'),
        svgLabel: imageFormatRow.querySelector('input[value="svg"] + label'),
        pdfRadio: imageFormatRow.querySelector('input[value="pdf"]'),
        pdfLabel: imageFormatRow.querySelector('input[value="pdf"] + label')
    };
    
    // Check if we found all elements
    for (const [key, element] of Object.entries(originalElements)) {
        if (!element) {
            console.error(`Element not found: ${key}`);
        }
    }
    
    // Clear the row
    imageFormatRow.innerHTML = '';
    
    // Set the row style
    imageFormatRow.style.display = 'flex';
    imageFormatRow.style.flexDirection = 'row';
    imageFormatRow.style.flexWrap = 'wrap';
    imageFormatRow.style.alignItems = 'center';
    imageFormatRow.style.justifyContent = 'center';
    imageFormatRow.style.gap = '10px';
    
    // Add elements back in the correct order
    if (originalElements.label) {
        imageFormatRow.appendChild(originalElements.label);
    }
    
    if (originalElements.pngRadio && originalElements.pngLabel) {
        imageFormatRow.appendChild(originalElements.pngRadio);
        imageFormatRow.appendChild(originalElements.pngLabel);
    }
    
    if (originalElements.transparencyCheckbox && originalElements.transparencyLabel) {
        imageFormatRow.appendChild(originalElements.transparencyCheckbox);
        imageFormatRow.appendChild(originalElements.transparencyLabel);
    }
    
    if (originalElements.jpgRadio && originalElements.jpgLabel) {
        imageFormatRow.appendChild(originalElements.jpgRadio);
        imageFormatRow.appendChild(originalElements.jpgLabel);
    }
    
    if (originalElements.svgRadio && originalElements.svgLabel) {
        imageFormatRow.appendChild(originalElements.svgRadio);
        imageFormatRow.appendChild(originalElements.svgLabel);
    }
    
    if (originalElements.pdfRadio && originalElements.pdfLabel) {
        imageFormatRow.appendChild(originalElements.pdfRadio);
        imageFormatRow.appendChild(originalElements.pdfLabel);
    }
    
    console.log("Image Format row rebuilt successfully");
}

/**
 * COMPLETELY REWRITTEN: Fix the Advanced Options panel behavior
 */
function fixAdvancedOptionsPanel() {
    console.log("COMPLETELY REWRITTEN: Fixing Advanced Options panel behavior");
    
    // Get references to the Advanced Options toggle button and panel
    const advancedOptionsToggle = document.getElementById('advanced-options-toggle');
    const advancedOptionsPanel = document.getElementById('advanced-options-panel');
    
    if (!advancedOptionsToggle || !advancedOptionsPanel) {
        console.error("Advanced Options toggle or panel not found");
        return;
    }
    
    // AGGRESSIVE FIX: Remove the existing button and create a new one
    const newToggleButton = document.createElement('button');
    newToggleButton.id = 'advanced-options-toggle';
    newToggleButton.innerHTML = 'Advanced Options <i class="fas fa-chevron-down"></i>';
    newToggleButton.style.margin = '0 auto';
    newToggleButton.style.display = 'block';
    newToggleButton.style.cursor = 'pointer';
    newToggleButton.style.backgroundColor = '#f0f0f0';
    newToggleButton.style.border = '1px solid #ccc';
    newToggleButton.style.borderRadius = '4px';
    newToggleButton.style.padding = '5px 10px';
    newToggleButton.style.fontWeight = 'bold';
    newToggleButton.style.color = '#333';
    
    // Replace the existing button with the new one
    advancedOptionsToggle.parentNode.replaceChild(newToggleButton, advancedOptionsToggle);
    
    // AGGRESSIVE FIX: Ensure the panel is initially hidden
    advancedOptionsPanel.style.display = 'none';
    
    // AGGRESSIVE FIX: Add a direct click event listener to the new button
    newToggleButton.onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        console.log("Advanced Options button clicked");
        
        // Toggle the panel visibility
        if (advancedOptionsPanel.style.display === 'block') {
            // Hide the panel
            advancedOptionsPanel.style.display = 'none';
            newToggleButton.innerHTML = 'Advanced Options <i class="fas fa-chevron-down"></i>';
        } else {
            // Show the panel
            advancedOptionsPanel.style.display = 'block';
            newToggleButton.innerHTML = 'Advanced Options <i class="fas fa-chevron-up"></i>';
            
            // Scroll to the panel
            advancedOptionsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        return false;
    };
    
    // AGGRESSIVE FIX: Get references to the Apply and Cancel buttons
    const applyButton = document.getElementById('apply-advanced-options');
    const cancelButton = document.getElementById('cancel-advanced-options');
    
    // AGGRESSIVE FIX: Add event listeners to the Apply button
    if (applyButton) {
        // Remove any existing event listeners by cloning and replacing
        const newApplyButton = applyButton.cloneNode(true);
        applyButton.parentNode.replaceChild(newApplyButton, applyButton);
        
        // Add a direct click event listener
        newApplyButton.onclick = function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            console.log("Apply button clicked");
            
            // Hide the panel
            advancedOptionsPanel.style.display = 'none';
            newToggleButton.innerHTML = 'Advanced Options <i class="fas fa-chevron-down"></i>';
            
            return false;
        };
    }
    
    // AGGRESSIVE FIX: Add event listeners to the Cancel button
    if (cancelButton) {
        // Remove any existing event listeners by cloning and replacing
        const newCancelButton = cancelButton.cloneNode(true);
        cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);
        
        // Add a direct click event listener
        newCancelButton.onclick = function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            console.log("Cancel button clicked");
            
            // Hide the panel
            advancedOptionsPanel.style.display = 'none';
            newToggleButton.innerHTML = 'Advanced Options <i class="fas fa-chevron-down"></i>';
            
            return false;
        };
    }
    
    console.log("Advanced Options panel setup complete");
}

// Initialize the circle dimensions when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a short time to ensure all elements are loaded
    setTimeout(function() {
        if (typeof window.calculateCircleDimensions === 'function') {
            window.calculateCircleDimensions();
        }
    }, 500);
});

/* END OF CODE - Cline - 2025-05-15 17:02:00 File: js/container-reorganization.js */
