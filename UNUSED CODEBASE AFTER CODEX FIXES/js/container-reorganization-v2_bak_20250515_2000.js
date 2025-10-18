/* START OF CODE - Cline - 2025-05-15 19:54:00 File: js/container-reorganization-v2.js */

/**
 * Container Reorganization V2 JavaScript for Star Map Generator
 * 
 * This script implements the container reorganization plan:
 * 1. Combine Customizable Text Layers with Fixed Text Styling (Date and Lat/Long rows)
 * 2. Combine Star Map Canvas Settings with Star Map Image Settings
 * 
 * The reorganization reduces the number of containers from 8 to 6:
 * - 4 containers remain unchanged
 * - 2 containers are combined
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Container Reorganization V2");
    
    // Debug information
    console.log("Container Reorganization V2 script loaded at: " + new Date().toISOString());
    console.log("Document ready state: " + document.readyState);
    
    // Wait a short time to ensure all containers are fully loaded
    setTimeout(function() {
        console.log("DOM fully loaded and parsed");
        console.log("All fieldsets:", document.querySelectorAll('fieldset'));
        console.log("All legends:", document.querySelectorAll('legend'));
        
        // List all container titles for debugging
        const legends = document.querySelectorAll('legend');
        console.log("Container titles:");
        legends.forEach(legend => {
            console.log("- " + legend.textContent);
        });
        
        // Combine Customizable Text Layers with Fixed Text Styling
        combineTextLayers();
        
        // Combine Star Map Canvas Settings with Star Map Image Settings
        combineCanvasAndImageSettings();
    }, 1500); // Increased delay to 1500ms
});

/**
 * Combine Customizable Text Layers with Fixed Text Styling
 * This function moves the Date and Lat/Long rows from Fixed Text Styling
 * into the Customizable Text Layers container
 */
function combineTextLayers() {
    console.log("Combining Customizable Text Layers with Fixed Text Styling");
    
    // Find the containers by their titles - using more flexible matching
    const customizableTextContainer = findContainerByTitleFlexible('Customizable Text Layers');
    const fixedTextContainer = findContainerByTitleFlexible('Fixed Text Styling');
    
    console.log("Customizable Text Container:", customizableTextContainer);
    console.log("Fixed Text Container:", fixedTextContainer);
    
    if (!customizableTextContainer || !fixedTextContainer) {
        console.error("Customizable Text or Fixed Text container not found");
        console.log("Available fieldsets:", document.querySelectorAll('fieldset'));
        return;
    }
    
    // Create a new section for the fixed layers
    const fixedLayersSection = document.createElement('div');
    fixedLayersSection.className = 'fixed-layers-section';
    fixedLayersSection.style.marginTop = '20px';
    fixedLayersSection.style.width = '100%';
    
    // Create a horizontal rule to separate customizable and fixed layers
    const separator = document.createElement('hr');
    separator.style.margin = '20px 0';
    separator.style.borderTop = '1px solid #ccc';
    separator.style.width = '100%';
    
    // Instead of trying to find and clone individual rows, clone the entire fixed text container
    // and extract just the content we need
    const fixedTextClone = fixedTextContainer.cloneNode(true);
    
    // Remove the legend from the clone
    const legendToRemove = fixedTextClone.querySelector('legend');
    if (legendToRemove) {
        legendToRemove.remove();
    }
    
    // Get all the content from the fixed text container
    const fixedTextContent = fixedTextClone.innerHTML;
    
    // Set the content of the fixed layers section
    fixedLayersSection.innerHTML = fixedTextContent;
    
    // Update the labels to be more concise
    const labels = fixedLayersSection.querySelectorAll('label');
    labels.forEach(label => {
        const text = label.textContent.toLowerCase();
        if (text.includes('date')) {
            label.textContent = 'Date:';
        } else if (text.includes('coordinates') || (text.includes('lat') && text.includes('long'))) {
            label.textContent = 'Lat/Long:';
        }
    });
    
    // Add the separator and fixed layers section to the customizable text container
    customizableTextContainer.appendChild(separator);
    customizableTextContainer.appendChild(fixedLayersSection);
    
    // Update the container title to reflect the combined content
    const containerTitle = customizableTextContainer.querySelector('legend');
    if (containerTitle) {
        containerTitle.textContent = 'Customizable Text Layers + Fixed Layers';
    }
    
    // Hide the original Fixed Text container
    fixedTextContainer.style.display = 'none';
    
    console.log("Successfully combined Customizable Text Layers with Fixed Text Styling");
}

/**
 * Combine Star Map Canvas Settings with Star Map Image Settings
 * This function combines the Star Map Canvas Settings with Star Map Image Settings
 */
function combineCanvasAndImageSettings() {
    console.log("Combining Star Map Canvas Settings with Star Map Image Settings");
    
    // Find the containers by their titles - using more flexible matching
    const canvasSettingsContainer = findContainerByTitleFlexible('Star Map Canvas Settings');
    const imageSettingsContainer = findContainerByTitleFlexible('Star Map Image Settings');
    
    console.log("Canvas Settings Container:", canvasSettingsContainer);
    console.log("Image Settings Container:", imageSettingsContainer);
    
    if (!canvasSettingsContainer || !imageSettingsContainer) {
        console.error("Canvas Settings or Image Settings container not found");
        return;
    }
    
    // Update the container title to reflect the combined content
    const containerTitle = canvasSettingsContainer.querySelector('legend');
    if (containerTitle) {
        containerTitle.textContent = 'Star Map Canvas + Image Settings';
    }
    
    // Create a separator
    const separator = document.createElement('hr');
    separator.style.margin = '20px 0';
    separator.style.borderTop = '1px solid #ccc';
    separator.style.width = '100%';
    
    // Add the separator to the canvas settings container
    canvasSettingsContainer.appendChild(separator);
    
    // Instead of trying to recreate the image settings section, move the entire container
    // First, remove the legend from the image settings container
    const imageSettingsLegend = imageSettingsContainer.querySelector('legend');
    if (imageSettingsLegend) {
        imageSettingsLegend.remove();
    }
    
    // Clone the image settings container
    const imageSettingsClone = imageSettingsContainer.cloneNode(true);
    
    // Move the image settings container into the canvas settings container
    canvasSettingsContainer.appendChild(imageSettingsClone);
    
    // Hide the original Image Settings container
    imageSettingsContainer.style.display = 'none';
    
    console.log("Successfully combined Star Map Canvas Settings with Star Map Image Settings");
}

/**
 * Helper function to find a container by its title text with flexible matching
 * @param {string} titleText - The text to search for in the container title
 * @returns {Element|null} - The container element or null if not found
 */
function findContainerByTitleFlexible(titleText) {
    console.log("Looking for container with title similar to:", titleText);
    
    // Convert title text to lowercase for case-insensitive matching
    const searchText = titleText.toLowerCase();
    
    // Look for fieldset elements with a legend containing the title text
    const fieldsets = document.querySelectorAll('fieldset');
    
    for (const fieldset of fieldsets) {
        const legend = fieldset.querySelector('legend');
        if (legend && legend.textContent.toLowerCase().includes(searchText)) {
            console.log("Found container in fieldset:", fieldset);
            return fieldset;
        }
    }
    
    // If not found in fieldsets, look for divs with a heading containing the title text
    const divs = document.querySelectorAll('div');
    
    for (const div of divs) {
        const heading = div.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading && heading.textContent.toLowerCase().includes(searchText)) {
            console.log("Found container in div with heading:", div);
            return div;
        }
    }
    
    // If still not found, look for divs with a class or ID containing the title text
    for (const div of divs) {
        const className = div.className.toLowerCase();
        const id = div.id ? div.id.toLowerCase() : '';
        const searchTextNoDashes = searchText.replace(/\s+/g, '');
        const searchTextWithDashes = searchText.replace(/\s+/g, '-');
        
        if (className.includes(searchTextNoDashes) || 
            className.includes(searchTextWithDashes) || 
            id.includes(searchTextNoDashes) || 
            id.includes(searchTextWithDashes)) {
            console.log("Found container in div with class/id:", div);
            return div;
        }
    }
    
    // If still not found, look for any element containing the title text
    const elements = document.querySelectorAll('*');
    
    for (const element of elements) {
        if (element.textContent.toLowerCase().includes(searchText) && 
            (element.children.length > 0 || element.tagName.toLowerCase() === 'fieldset')) {
            console.log("Found container by text content:", element);
            return element;
        }
    }
    
    // Try alternative titles
    const alternativeTitles = {
        'customizable text layers': ['text layers', 'custom text', 'text entries'],
        'fixed text styling': ['fixed text', 'date and coordinates', 'static text'],
        'star map canvas settings': ['canvas settings', 'map canvas', 'canvas size'],
        'star map image settings': ['image settings', 'map image', 'star map style']
    };
    
    const alternatives = alternativeTitles[searchText] || [];
    
    for (const alternative of alternatives) {
        const container = findContainerByTitleFlexible(alternative);
        if (container) {
            return container;
        }
    }
    
    console.log("Container not found for title:", titleText);
    return null;
}

/* END OF CODE - Cline - 2025-05-15 19:54:00 File: js/container-reorganization-v2.js */
