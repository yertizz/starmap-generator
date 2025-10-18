/* START OF CODE - Cline - 2025-05-15 20:06:00 File: js/container-reorganization-v2.js */

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

// Immediately hide the containers that will be combined to prevent flashing
(function() {
    // Find and hide the Fixed Text Styling container
    const fixedTextContainers = document.querySelectorAll('fieldset');
    for (const container of fixedTextContainers) {
        const legend = container.querySelector('legend');
        if (legend && legend.textContent.includes('Fixed Text Styling')) {
            container.style.display = 'none';
            console.log("Immediately hiding Fixed Text Styling container");
            break;
        }
    }
    
    // Find and hide the Star Map Image Settings container
    const imageSettingsContainers = document.querySelectorAll('fieldset');
    for (const container of imageSettingsContainers) {
        const legend = container.querySelector('legend');
        if (legend && legend.textContent.includes('Star Map Image Settings')) {
            container.style.display = 'none';
            console.log("Immediately hiding Star Map Image Settings container");
            break;
        }
    }
})();

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Container Reorganization V2");
    
    // Debug information
    console.log("Container Reorganization V2 script loaded at: " + new Date().toISOString());
    console.log("Document ready state: " + document.readyState);
    
    // Run immediately to prevent flashing of original containers
    combineContainers();
});

/**
 * Main function to combine containers
 */
function combineContainers() {
    console.log("Combining containers");
    
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
}

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
    
    // Get the dropdown widths from the customizable text container
    let fontFamilyWidth = "100px";
    let fontSizeWidth = "70px";
    
    // Try to get the actual widths from the customizable text container
    const customizableFontFamily = customizableTextContainer.querySelector('select[class*="font"], select:first-of-type');
    const customizableFontSize = customizableTextContainer.querySelector('select[class*="size"], select:nth-of-type(2)');
    
    if (customizableFontFamily) {
        const computedStyle = window.getComputedStyle(customizableFontFamily);
        fontFamilyWidth = computedStyle.width;
        console.log("Font family width from customizable text:", fontFamilyWidth);
    }
    
    if (customizableFontSize) {
        const computedStyle = window.getComputedStyle(customizableFontSize);
        fontSizeWidth = computedStyle.width;
        console.log("Font size width from customizable text:", fontSizeWidth);
    }
    
    // Create a new section for the fixed layers
    const fixedLayersSection = document.createElement('div');
    fixedLayersSection.className = 'fixed-layers-section';
    fixedLayersSection.style.marginTop = '20px';
    fixedLayersSection.style.width = '100%';
    fixedLayersSection.style.display = 'block';
    
    // Create a horizontal rule to separate customizable and fixed layers
    const separator = document.createElement('hr');
    separator.style.margin = '20px 0';
    separator.style.borderTop = '1px solid #ccc';
    separator.style.width = '100%';
    
    // Get the rows from the fixed text container
    const dateRow = fixedTextContainer.querySelector('.date-row, [class*="date"], div:nth-child(1)');
    const latLongRow = fixedTextContainer.querySelector('.lat-long-row, [class*="coordinates"], div:nth-child(2)');
    
    // Get the font options from the customizable text container
    const fontOptions = [];
    const fontSizeOptions = [];
    
    if (customizableFontFamily) {
        const options = customizableFontFamily.querySelectorAll('option');
        options.forEach(option => {
            fontOptions.push(option.textContent);
        });
    }
    
    if (customizableFontSize) {
        const options = customizableFontSize.querySelectorAll('option');
        options.forEach(option => {
            fontSizeOptions.push(option.textContent);
        });
    }
    
    // If no font options found, use defaults
    if (fontOptions.length === 0) {
        fontOptions.push("Lora", "Abril Fatface", "Arial", "Verdana");
    }
    
    if (fontSizeOptions.length === 0) {
        fontSizeOptions.push("72px", "112px", "48px", "24px");
    }
    
    // Create the HTML for the font options
    const fontOptionsHTML = fontOptions.map(option => {
        if (option === "Abril Fatface") {
            return `<option selected>${option}</option>`;
        }
        return `<option>${option}</option>`;
    }).join('');
    
    // Create the HTML for the font size options
    const fontSizeOptionsHTML = fontSizeOptions.map(option => {
        if (option === "8" || option === "8px") {
            return `<option selected>${option}</option>`;
        }
        return `<option>${option}</option>`;
    }).join('');
    
    if (!dateRow || !latLongRow) {
        console.error("Date or Lat/Long row not found, using direct HTML");
        
        // If we can't find the rows, use direct HTML based on the screenshot
        fixedLayersSection.innerHTML = `
            <div class="row" style="display: flex; align-items: center; margin-bottom: 10px;">
                <label style="width: 80px; margin-right: 10px;">Date:</label>
                <select style="width: ${fontFamilyWidth}; margin-right: 10px;">
                    ${fontOptionsHTML}
                </select>
                <select style="width: ${fontSizeWidth}; margin-right: 10px;">
                    ${fontSizeOptionsHTML}
                </select>
                <input type="checkbox" id="date-bold" style="margin-right: 5px;">
                <label for="date-bold" style="margin-right: 10px;">Bold</label>
                <input type="checkbox" id="date-italic" style="margin-right: 5px;">
                <label for="date-italic" style="margin-right: 10px;">Italic</label>
                <div class="color-picker" style="width: 30px; height: 30px; background-color: #ffcc00; border-radius: 50%;"></div>
            </div>
            <div class="row" style="display: flex; align-items: center; margin-bottom: 10px;">
                <label style="width: 80px; margin-right: 10px;">Lat/Long:</label>
                <select style="width: ${fontFamilyWidth}; margin-right: 10px;">
                    ${fontOptionsHTML}
                </select>
                <select style="width: ${fontSizeWidth}; margin-right: 10px;">
                    ${fontSizeOptionsHTML}
                </select>
                <input type="checkbox" id="latlong-bold" style="margin-right: 5px;">
                <label for="latlong-bold" style="margin-right: 10px;">Bold</label>
                <input type="checkbox" id="latlong-italic" style="margin-right: 5px;">
                <label for="latlong-italic" style="margin-right: 10px;">Italic</label>
                <div class="color-picker" style="width: 30px; height: 30px; background-color: #ffcc00; border-radius: 50%;"></div>
            </div>
        `;
    } else {
        console.log("Found date and lat/long rows:", dateRow, latLongRow);
        
        // Clone the rows to avoid removing them from their original container
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
        
        // Update the font family and font size dropdowns
        const dateFontFamily = dateRowClone.querySelector('select:first-of-type');
        const dateFontSize = dateRowClone.querySelector('select:nth-of-type(2)');
        const latLongFontFamily = latLongRowClone.querySelector('select:first-of-type');
        const latLongFontSize = latLongRowClone.querySelector('select:nth-of-type(2)');
        
        if (dateFontFamily) {
            dateFontFamily.style.width = fontFamilyWidth;
            dateFontFamily.innerHTML = fontOptionsHTML;
        }
        
        if (dateFontSize) {
            dateFontSize.style.width = fontSizeWidth;
            dateFontSize.innerHTML = fontSizeOptionsHTML;
        }
        
        if (latLongFontFamily) {
            latLongFontFamily.style.width = fontFamilyWidth;
            latLongFontFamily.innerHTML = fontOptionsHTML;
        }
        
        if (latLongFontSize) {
            latLongFontSize.style.width = fontSizeWidth;
            latLongFontSize.innerHTML = fontSizeOptionsHTML;
        }
        
        // Add the cloned rows to the fixed layers section
        fixedLayersSection.appendChild(dateRowClone);
        fixedLayersSection.appendChild(latLongRowClone);
    }
    
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

/* END OF CODE - Cline - 2025-05-15 20:06:00 File: js/container-reorganization-v2.js */
