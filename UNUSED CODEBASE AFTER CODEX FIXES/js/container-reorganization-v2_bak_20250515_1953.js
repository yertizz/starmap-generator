/* START OF CODE - Cline - 2025-05-15 19:48:00 File: js/container-reorganization-v2.js */

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
    }, 1000); // Increased delay to 1000ms
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
    
    // Get references to the Date and Lat/Long rows in the Fixed Text container
    // Try different selectors to find the rows
    let dateRow = null;
    let latLongRow = null;
    
    // Look for rows with specific labels or text content
    const allRows = fixedTextContainer.querySelectorAll('div');
    console.log("All rows in Fixed Text container:", allRows);
    
    for (const row of allRows) {
        const rowText = row.textContent.toLowerCase();
        if (rowText.includes('date text') || rowText.includes('date:')) {
            dateRow = row;
            console.log("Found date row:", dateRow);
        } else if (rowText.includes('coordinates text') || rowText.includes('lat') && rowText.includes('long')) {
            latLongRow = row;
            console.log("Found lat/long row:", latLongRow);
        }
    }
    
    // If not found by text content, try looking for specific elements
    if (!dateRow) {
        const dateElements = fixedTextContainer.querySelectorAll('input, select, label');
        for (const element of dateElements) {
            if (element.id && element.id.toLowerCase().includes('date') || 
                element.name && element.name.toLowerCase().includes('date') ||
                element.className && element.className.toLowerCase().includes('date')) {
                dateRow = element.closest('div');
                console.log("Found date row by element:", dateRow);
                break;
            }
        }
    }
    
    if (!latLongRow) {
        const latLongElements = fixedTextContainer.querySelectorAll('input, select, label');
        for (const element of latLongElements) {
            if ((element.id && (element.id.toLowerCase().includes('lat') || element.id.toLowerCase().includes('coord'))) || 
                (element.name && (element.name.toLowerCase().includes('lat') || element.name.toLowerCase().includes('coord'))) ||
                (element.className && (element.className.toLowerCase().includes('lat') || element.className.toLowerCase().includes('coord')))) {
                latLongRow = element.closest('div');
                console.log("Found lat/long row by element:", latLongRow);
                break;
            }
        }
    }
    
    // If still not found, use the first two rows as a fallback
    if (!dateRow || !latLongRow) {
        const rows = fixedTextContainer.querySelectorAll('div');
        if (rows.length >= 2) {
            dateRow = rows[0];
            latLongRow = rows[1];
            console.log("Using fallback rows:", dateRow, latLongRow);
        }
    }
    
    if (!dateRow || !latLongRow) {
        console.error("Date or Lat/Long row not found");
        return;
    }
    
    // Create a new section for the fixed layers
    const fixedLayersSection = document.createElement('div');
    fixedLayersSection.className = 'fixed-layers-section';
    fixedLayersSection.style.marginTop = '20px';
    
    // Create a horizontal rule to separate customizable and fixed layers
    const separator = document.createElement('hr');
    separator.style.margin = '20px 0';
    separator.style.borderTop = '1px solid #ccc';
    
    // Clone the Date and Lat/Long rows to avoid removing them from their original container
    const dateRowClone = dateRow.cloneNode(true);
    const latLongRowClone = latLongRow.cloneNode(true);
    
    // Update the labels to be more concise
    const dateLabel = dateRowClone.querySelector('label');
    const latLongLabel = latLongRowClone.querySelector('label');
    
    if (dateLabel) {
        dateLabel.textContent = 'Date:';
    }
    
    if (latLongLabel) {
        latLongLabel.textContent = 'Lat/Long:';
    }
    
    // Add the cloned rows to the fixed layers section
    fixedLayersSection.appendChild(dateRowClone);
    fixedLayersSection.appendChild(latLongRowClone);
    
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
    
    // Create a new heading for the Image Settings section
    const imageSettingsHeading = document.createElement('h3');
    imageSettingsHeading.textContent = 'Star Map Image Settings';
    imageSettingsHeading.style.marginTop = '20px';
    imageSettingsHeading.style.marginBottom = '10px';
    imageSettingsHeading.style.borderBottom = '1px solid #ccc';
    imageSettingsHeading.style.paddingBottom = '5px';
    imageSettingsHeading.style.clear = 'both';
    imageSettingsHeading.style.width = '100%';
    
    // Create a container for the image settings
    const imageSettingsSection = document.createElement('div');
    imageSettingsSection.className = 'image-settings-section';
    imageSettingsSection.style.display = 'flex';
    imageSettingsSection.style.flexWrap = 'wrap';
    imageSettingsSection.style.alignItems = 'center';
    imageSettingsSection.style.justifyContent = 'space-between';
    imageSettingsSection.style.width = '100%';
    
    // Add the heading to the image settings section
    imageSettingsSection.appendChild(imageSettingsHeading);
    
    // Clone the entire content of the image settings container
    const imageSettingsContent = imageSettingsContainer.innerHTML;
    
    // Create a wrapper div for the content
    const contentWrapper = document.createElement('div');
    contentWrapper.style.width = '100%';
    contentWrapper.style.display = 'flex';
    contentWrapper.style.flexWrap = 'wrap';
    contentWrapper.style.alignItems = 'center';
    contentWrapper.style.justifyContent = 'space-between';
    
    // Set the HTML content
    contentWrapper.innerHTML = imageSettingsContent;
    
    // Remove any legend elements that might have been cloned
    const legends = contentWrapper.querySelectorAll('legend');
    legends.forEach(legend => legend.remove());
    
    // Add the content wrapper to the image settings section
    imageSettingsSection.appendChild(contentWrapper);
    
    // Add the image settings section to the canvas settings container
    canvasSettingsContainer.appendChild(imageSettingsSection);
    
    // Update the container title to reflect the combined content
    const containerTitle = canvasSettingsContainer.querySelector('legend');
    if (containerTitle) {
        containerTitle.textContent = 'Star Map Canvas + Image Settings';
    }
    
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

/* END OF CODE - Cline - 2025-05-15 19:48:00 File: js/container-reorganization-v2.js */
