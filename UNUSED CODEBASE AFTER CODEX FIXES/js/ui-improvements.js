/* START OF CODE - Cline - 2025-05-15 17:50:00 File: js/ui-improvements.js */

/**
 * UI Improvements JavaScript for Star Map Generator
 * 
 * This script implements UI improvements for the Star Map Generator:
 * 1. Moves the Text Placements section to its own container
 * 2. Fixes the Image Format row layout
 * 3. Fixes the Advanced Options panel behavior
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing UI Improvements JS");
    
    // Move the Text Placements section to its own container
    moveTextPlacementsToOwnContainer();
    
    // Fix the Image Format row layout
    fixImageFormatRow();
    
    // Fix the Advanced Options panel behavior
    fixAdvancedOptionsPanel();
});

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
    
    // Remove all horizontal lines in the text placement container
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
    
    // Hide the old title
    const oldTitle = textPlacementContainer.querySelector('.text-placement-title');
    if (oldTitle) {
        oldTitle.style.display = 'none';
    }
    
    // Reduce space between legend and content
    const textPlacementSections = textPlacementContainer.querySelectorAll('.text-placement-section');
    textPlacementSections.forEach(section => {
        section.style.marginTop = '0';
        section.style.paddingTop = '0';
    });
}

/**
 * Fix the Image Format row layout
 */
function fixImageFormatRow() {
    console.log("Fixing Image Format row layout");
    
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
 * Fix the Advanced Options panel behavior
 */
function fixAdvancedOptionsPanel() {
    console.log("Fixing Advanced Options panel behavior");
    
    // Get references to the Advanced Options toggle button and panel
    const advancedOptionsToggle = document.getElementById('advanced-options-toggle');
    const advancedOptionsPanel = document.getElementById('advanced-options-panel');
    
    if (!advancedOptionsToggle || !advancedOptionsPanel) {
        console.error("Advanced Options toggle or panel not found");
        return;
    }
    
    // Remove the existing button and create a new one
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
    
    // Ensure the panel is initially hidden
    advancedOptionsPanel.style.display = 'none';
    
    // Add a direct click event listener to the new button
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
    
    // Get references to the Apply and Cancel buttons
    const applyButton = document.getElementById('apply-advanced-options');
    const cancelButton = document.getElementById('cancel-advanced-options');
    
    // Add event listeners to the Apply button
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
    
    // Add event listeners to the Cancel button
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

/* END OF CODE - Cline - 2025-05-15 17:50:00 File: js/ui-improvements.js */
