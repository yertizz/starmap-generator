/* START OF CODE - Cline - 2025-05-15 08:33:00 File: js/container-reorganization.js */

/**
 * Container Reorganization JavaScript for Star Map Generator
 * 
 * This script implements the functionality for:
 * 1. Paper Auto-Size dropdown with Imperial and European options
 * 2. DPI selector with options for 100, 150, 200, and 300
 * 3. Auto-calculation of width and height based on paper size and DPI
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Container Reorganization JS");
    
    // Initialize the Paper Auto-Size and DPI functionality
    initPaperSizeAndDPI();
    
    // Move the Text Placements section to its own container
    moveTextPlacementsToOwnContainer();
    
    // Fix the Advanced Options panel behavior
    fixAdvancedOptionsPanel();
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
        
        // Calculate dimensions in pixels
        const widthInPixels = Math.round(paperSize.width * dpi);
        const heightInPixels = Math.round(paperSize.height * dpi);
        
        // Update the width and height inputs
        widthInput.value = widthInPixels;
        heightInput.value = heightInPixels;
        
        // Force the aspect ratio checkbox to be checked
        aspectRatioCheckbox.checked = true;
        
        console.log(`Calculated dimensions: ${widthInPixels}x${heightInPixels} pixels (${paperSize.width}x${paperSize.height} inches at ${dpi} DPI)`);
    }
    
    // Add event listeners to the Paper Auto-Size and DPI selectors
    paperAutoSizeSelect.addEventListener('change', calculateDimensions);
    dpiSelector.addEventListener('change', calculateDimensions);
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
}

/**
 * Fix the Advanced Options panel behavior
 */
function fixAdvancedOptionsPanel() {
    console.log("Fixing Advanced Options panel behavior");
    
    // Get references to the Advanced Options toggle button and panel
    const advancedOptionsToggle = document.getElementById('advanced-options-toggle');
    const advancedOptionsPanel = document.getElementById('advanced-options-panel');
    const applyButton = document.getElementById('apply-advanced-options');
    const cancelButton = document.getElementById('cancel-advanced-options');
    
    if (!advancedOptionsToggle || !advancedOptionsPanel) {
        console.error("Advanced Options toggle or panel not found");
        return;
    }
    
    // Remove any existing event listeners
    const newToggle = advancedOptionsToggle.cloneNode(true);
    advancedOptionsToggle.parentNode.replaceChild(newToggle, advancedOptionsToggle);
    
    // Add a new click event listener to the toggle button
    newToggle.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Toggle the panel visibility with a sliding animation
        if (advancedOptionsPanel.style.display === 'block') {
            // Hide the panel
            advancedOptionsPanel.style.display = 'none';
            newToggle.innerHTML = 'Advanced Options <i class="fas fa-chevron-down"></i>';
        } else {
            // Show the panel
            advancedOptionsPanel.style.display = 'block';
            newToggle.innerHTML = 'Advanced Options <i class="fas fa-chevron-up"></i>';
            
            // Scroll to the panel
            advancedOptionsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
    
    // Add event listeners to the Apply and Cancel buttons
    if (applyButton) {
        // Remove any existing event listeners
        const newApplyButton = applyButton.cloneNode(true);
        applyButton.parentNode.replaceChild(newApplyButton, applyButton);
        
        // Add a new click event listener
        newApplyButton.addEventListener('click', function() {
            // Hide the panel
            advancedOptionsPanel.style.display = 'none';
            newToggle.innerHTML = 'Advanced Options <i class="fas fa-chevron-down"></i>';
        });
    }
    
    if (cancelButton) {
        // Remove any existing event listeners
        const newCancelButton = cancelButton.cloneNode(true);
        cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);
        
        // Add a new click event listener
        newCancelButton.addEventListener('click', function() {
            // Hide the panel
            advancedOptionsPanel.style.display = 'none';
            newToggle.innerHTML = 'Advanced Options <i class="fas fa-chevron-down"></i>';
        });
    }
    
    // Ensure the panel is initially hidden
    advancedOptionsPanel.style.display = 'none';
}

/* END OF CODE - Cline - 2025-05-15 08:33:00 File: js/container-reorganization.js */
