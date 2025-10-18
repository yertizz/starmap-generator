/* START OF CODE - Cline - 2025-05-15 23:00:00 File: js/container-reorganization-v2.js */

/**
 * Container Reorganization V2 JavaScript for Star Map Generator
 * 
 * This script implements the container reorganization plan:
 * 1. Combine Customizable Text Layers with Fixed Text Styling (Date and Lat/Long rows)
 * 2. Combine Star Map Canvas Settings with Star Map Image Settings
 * 3. Fix styling issues in Text Placements On Star Map Canvas
 * 
 * The reorganization reduces the number of containers from 8 to 6:
 * - 4 containers remain unchanged
 * - 2 containers are combined
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Container Reorganization V2 script loaded");
    
    // Run the container reorganization
    reorganizeContainers();
    
    // Fix the text placements container
    fixTextPlacementsContainer();
});

/**
 * Main function to reorganize containers
 */
function reorganizeContainers() {
    console.log("Reorganizing containers");
    
    try {
        // Combine Customizable Text Layers with Fixed Text Styling
        combineTextLayers();
        
        // Combine Star Map Canvas Settings with Star Map Image Settings
        combineCanvasAndImageSettings();
    } catch (error) {
        console.error("Error in reorganizeContainers:", error);
    }
}

/**
 * Combine Customizable Text Layers with Fixed Text Styling
 */
function combineTextLayers() {
    console.log("Combining Customizable Text Layers with Fixed Text Styling");
    
    try {
        // Find the containers
        const customizableTextContainer = findContainer('Customizable Text Layers');
        const fixedTextContainer = findContainer('Fixed Text Styling');
        
        if (!customizableTextContainer) {
            console.error("Customizable Text container not found");
            return;
        }
        
        if (!fixedTextContainer) {
            console.error("Fixed Text container not found");
            return;
        }
        
        // Update the container title
        const containerTitle = customizableTextContainer.querySelector('legend');
        if (containerTitle) {
            containerTitle.textContent = 'Customizable Text Layers + Fixed Layers';
        }
        
        // Create a separator
        const separator = document.createElement('hr');
        
        // Create a div for the fixed text content
        const fixedTextContent = document.createElement('div');
        fixedTextContent.className = 'fixed-text-content';
        
        // Move the content from the fixed text container to the fixed text content div
        const fixedTextRows = fixedTextContainer.querySelectorAll('div');
        fixedTextRows.forEach(row => {
            // Skip the legend
            if (!row.querySelector('legend')) {
                fixedTextContent.appendChild(row.cloneNode(true));
            }
        });
        
        // Add the separator and fixed text content to the customizable text container
        customizableTextContainer.appendChild(separator);
        customizableTextContainer.appendChild(fixedTextContent);
        
        // Hide the original fixed text container
        fixedTextContainer.style.display = 'none';
        
        console.log("Successfully combined Customizable Text Layers with Fixed Text Styling");
    } catch (error) {
        console.error("Error in combineTextLayers:", error);
    }
}

/**
 * Combine Star Map Canvas Settings with Star Map Image Settings
 */
function combineCanvasAndImageSettings() {
    console.log("Combining Star Map Canvas Settings with Star Map Image Settings");
    
    try {
        // Find the containers
        const canvasSettingsContainer = findContainer('Star Map Canvas Settings');
        const imageSettingsContainer = findContainer('Star Map Image Settings');
        
        if (!canvasSettingsContainer) {
            console.error("Canvas Settings container not found");
            return;
        }
        
        if (!imageSettingsContainer) {
            console.error("Image Settings container not found");
            return;
        }
        
        // Update the container title
        const containerTitle = canvasSettingsContainer.querySelector('legend');
        if (containerTitle) {
            containerTitle.textContent = 'Star Map Canvas + Image Settings';
        }
        
        // Create a separator
        const separator = document.createElement('hr');
        
        // Create a div for the image settings content
        const imageSettingsContent = document.createElement('div');
        imageSettingsContent.className = 'image-settings-content';
        
        // Add a heading for the image settings section
        const imageSettingsHeading = document.createElement('h3');
        imageSettingsHeading.textContent = 'Star Map Image Settings';
        imageSettingsHeading.style.marginTop = '10px';
        imageSettingsHeading.style.marginBottom = '15px';
        imageSettingsContent.appendChild(imageSettingsHeading);
        
        // Move the content from the image settings container to the image settings content div
        const imageSettingsRows = imageSettingsContainer.querySelectorAll('div');
        imageSettingsRows.forEach(row => {
            // Skip the legend
            if (!row.querySelector('legend')) {
                imageSettingsContent.appendChild(row.cloneNode(true));
            }
        });
        
        // Add the separator and image settings content to the canvas settings container
        canvasSettingsContainer.appendChild(separator);
        canvasSettingsContainer.appendChild(imageSettingsContent);
        
        // Hide the original image settings container
        imageSettingsContainer.style.display = 'none';
        
        console.log("Successfully combined Star Map Canvas Settings with Star Map Image Settings");
    } catch (error) {
        console.error("Error in combineCanvasAndImageSettings:", error);
    }
}

/**
 * Fix the text placements container
 */
function fixTextPlacementsContainer() {
    console.log("Fixing text placements container");
    
    try {
        // Find the text placements container
        const textPlacementsContainer = findContainer('Text Placements On Star Map Canvas');
        
        if (!textPlacementsContainer) {
            console.error("Text placements container not found");
            return;
        }
        
        // Add the text-placement-container class to the container
        textPlacementsContainer.classList.add('text-placement-container');
        
        // Find all labels in the container
        const labels = textPlacementsContainer.querySelectorAll('label');
        
        // Center-align the labels with their corresponding field contents
        labels.forEach(label => {
            label.style.display = 'flex';
            label.style.alignItems = 'center';
        });
        
        console.log("Successfully fixed text placements container");
    } catch (error) {
        console.error("Error in fixTextPlacementsContainer:", error);
    }
}

/**
 * Helper function to find a container by its title text
 * @param {string} titleText - The text to search for in the container title
 * @returns {Element|null} - The container element or null if not found
 */
function findContainer(titleText) {
    console.log("Looking for container with title:", titleText);
    
    try {
        // Look for fieldset elements with a legend containing the title text
        const fieldsets = document.querySelectorAll('fieldset');
        
        for (const fieldset of fieldsets) {
            const legend = fieldset.querySelector('legend');
            if (legend && legend.textContent.includes(titleText)) {
                console.log("Found container in fieldset:", fieldset);
                return fieldset;
            }
        }
        
        // If not found, try alternative titles
        const alternativeTitles = {
            'Customizable Text Layers': ['Text Layers', 'Custom Text', 'Text Entries'],
            'Fixed Text Styling': ['Fixed Text', 'Date and Coordinates', 'Static Text'],
            'Star Map Canvas Settings': ['Canvas Settings', 'Map Canvas', 'Canvas Size'],
            'Star Map Image Settings': ['Image Settings', 'Map Image', 'Star Map Style'],
            'Text Placements On Star Map Canvas': ['Text Placements', 'Text Positions', 'Text Locations']
        };
        
        const alternatives = alternativeTitles[titleText] || [];
        
        for (const alternative of alternatives) {
            for (const fieldset of fieldsets) {
                const legend = fieldset.querySelector('legend');
                if (legend && legend.textContent.includes(alternative)) {
                    console.log("Found container in fieldset with alternative title:", fieldset);
                    return fieldset;
                }
            }
        }
        
        console.log("Container not found for title:", titleText);
        return null;
    } catch (error) {
        console.error("Error in findContainer:", error);
        return null;
    }
}

/* END OF CODE - Cline - 2025-05-15 23:00:00 File: js/container-reorganization-v2.js */
