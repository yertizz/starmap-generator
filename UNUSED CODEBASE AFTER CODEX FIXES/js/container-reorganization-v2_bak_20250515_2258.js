/* START OF CODE - Cline - 2025-05-15 22:52:00 File: js/container-reorganization-v2.js */

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
        const customizableTextContainer = document.querySelector('fieldset:has(legend:contains("Customizable Text Layers"))') || 
                                         document.querySelector('fieldset:has(legend:contains("Text Layers"))');
        
        const fixedTextContainer = document.querySelector('fieldset:has(legend:contains("Fixed Text Styling"))') || 
                                  document.querySelector('fieldset:has(legend:contains("Fixed Text"))');
        
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
        
        // Remove the original fixed text container from the DOM
        fixedTextContainer.remove();
        
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
        const canvasSettingsContainer = document.querySelector('fieldset:has(legend:contains("Star Map Canvas Settings"))') || 
                                       document.querySelector('fieldset:has(legend:contains("Canvas Settings"))');
        
        const imageSettingsContainer = document.querySelector('fieldset:has(legend:contains("Star Map Image Settings"))') || 
                                      document.querySelector('fieldset:has(legend:contains("Image Settings"))');
        
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
        
        // Remove the original image settings container from the DOM
        imageSettingsContainer.remove();
        
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
        const textPlacementsContainer = document.querySelector('fieldset:has(legend:contains("Text Placements"))') || 
                                       document.querySelector('fieldset:has(legend:contains("Text Positions"))');
        
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

// Add a polyfill for the :contains selector
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Add a :contains selector to querySelector
document.querySelector = (function(_querySelector) {
    return function(selector) {
        try {
            // Check if the selector contains :contains
            if (selector.indexOf(':contains') > -1) {
                // Extract the text to search for
                const match = selector.match(/:contains\(["'](.*?)["']\)/);
                if (match && match[1]) {
                    const text = match[1];
                    // Replace the :contains part with a universal selector
                    const newSelector = selector.replace(/:contains\(["'].*?["']\)/, '');
                    // Get all elements matching the new selector
                    const elements = document.querySelectorAll(newSelector);
                    // Filter the elements to find the one containing the text
                    for (let i = 0; i < elements.length; i++) {
                        if (elements[i].textContent.indexOf(text) > -1) {
                            return elements[i];
                        }
                    }
                    return null;
                }
            }
            // If the selector doesn't contain :contains, use the original querySelector
            return _querySelector.call(this, selector);
        } catch (error) {
            console.error("Error in querySelector polyfill:", error);
            // If there's an error, fall back to the original querySelector
            return _querySelector.call(this, selector);
        }
    };
})(document.querySelector);

/* END OF CODE - Cline - 2025-05-15 22:52:00 File: js/container-reorganization-v2.js */
