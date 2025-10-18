/* START OF CODE - Cline - 2025-05-15 23:28:00 File: js/container-reorganization-v2.js */

/**
 * Container Reorganization V2 JavaScript for Star Map Generator
 * 
 * This script implements the container reorganization plan:
 * 1. Combine Customizable Text Layers with Fixed Text Styling (Date and Lat/Long rows)
 * 2. Combine Star Map Canvas Settings with Star Map Image Settings
 * 3. Fix styling issues in Text Placements On Star Map Canvas
 * 4. Standardize field sizes across the application
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
    
    // Standardize field sizes
    standardizeFieldSizes();
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
        
        // Process and clean up the fixed text container content
        const dateTextRow = fixedTextContainer.querySelector('div:has(label:contains("Date Text"))');
        const coordinatesTextRow = fixedTextContainer.querySelector('div:has(label:contains("Coordinates Text"))');
        
        if (dateTextRow) {
            // Clone the row to avoid modifying the original
            const cleanDateTextRow = dateTextRow.cloneNode(true);
            
            // Remove duplicate Bold and Italic checkboxes
            const checkboxes = cleanDateTextRow.querySelectorAll('input[type="checkbox"]');
            if (checkboxes.length > 2) {
                // Keep only the first Bold and Italic checkboxes
                for (let i = 2; i < checkboxes.length; i++) {
                    const checkbox = checkboxes[i];
                    const label = checkbox.nextElementSibling;
                    if (checkbox && checkbox.parentNode) {
                        checkbox.parentNode.removeChild(checkbox);
                    }
                    if (label && label.tagName === 'LABEL' && label.parentNode) {
                        label.parentNode.removeChild(label);
                    }
                }
            }
            
            // Add the cleaned row to the fixed text content
            fixedTextContent.appendChild(cleanDateTextRow);
        }
        
        if (coordinatesTextRow) {
            // Clone the row to avoid modifying the original
            const cleanCoordinatesTextRow = coordinatesTextRow.cloneNode(true);
            
            // Remove duplicate Bold and Italic checkboxes
            const checkboxes = cleanCoordinatesTextRow.querySelectorAll('input[type="checkbox"]');
            if (checkboxes.length > 2) {
                // Keep only the first Bold and Italic checkboxes
                for (let i = 2; i < checkboxes.length; i++) {
                    const checkbox = checkboxes[i];
                    const label = checkbox.nextElementSibling;
                    if (checkbox && checkbox.parentNode) {
                        checkbox.parentNode.removeChild(checkbox);
                    }
                    if (label && label.tagName === 'LABEL' && label.parentNode) {
                        label.parentNode.removeChild(label);
                    }
                }
            }
            
            // Add the cleaned row to the fixed text content
            fixedTextContent.appendChild(cleanCoordinatesTextRow);
        }
        
        // Add the separator and fixed text content to the customizable text container
        customizableTextContainer.appendChild(separator);
        customizableTextContainer.appendChild(fixedTextContent);
        
        // IMPORTANT: Instead of hiding the original container, we'll remove it from the DOM
        // This is a clean approach that doesn't hide anything
        if (fixedTextContainer.parentNode) {
            fixedTextContainer.parentNode.removeChild(fixedTextContainer);
        }
        
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
        imageSettingsHeading.style.fontWeight = 'bold';
        imageSettingsHeading.style.fontSize = '1.15em';
        imageSettingsHeading.style.color = '#0056b3'; // Same blue as container legends
        imageSettingsHeading.style.textAlign = 'center';
        imageSettingsHeading.style.marginTop = '10px';
        imageSettingsHeading.style.marginBottom = '15px';
        imageSettingsHeading.style.width = '100%';
        imageSettingsHeading.style.display = 'block';
        
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
        
        // IMPORTANT: Instead of hiding the original container, we'll remove it from the DOM
        // This is a clean approach that doesn't hide anything
        if (imageSettingsContainer.parentNode) {
            imageSettingsContainer.parentNode.removeChild(imageSettingsContainer);
        }
        
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
            label.style.height = '100%';
            label.style.margin = '0';
            label.style.padding = '0';
        });
        
        console.log("Successfully fixed text placements container");
    } catch (error) {
        console.error("Error in fixTextPlacementsContainer:", error);
    }
}

/**
 * Standardize field sizes across the application
 */
function standardizeFieldSizes() {
    console.log("Standardizing field sizes");
    
    try {
        // Standardize numeric input fields
        const numericInputs = document.querySelectorAll('input[type="number"], input[type="text"][size="4"], input[type="text"][size="5"], input[type="text"][size="6"]');
        numericInputs.forEach(input => {
            input.style.width = '80px';
            input.style.minWidth = '80px';
            input.style.maxWidth = '80px';
            input.style.boxSizing = 'border-box';
        });
        
        // Standardize dropdown selects
        const dropdowns = document.querySelectorAll('select:not(#paper-auto-size):not([name="paper-auto-size"])');
        dropdowns.forEach(dropdown => {
            dropdown.style.width = '100px';
            dropdown.style.minWidth = '100px';
            dropdown.style.maxWidth = '100px';
            dropdown.style.boxSizing = 'border-box';
        });
        
        // Specific styling for the Star Map Style dropdown
        const starMapStyleDropdown = document.querySelector('#star-map-style, select[name="star-map-style"]');
        if (starMapStyleDropdown) {
            starMapStyleDropdown.style.width = '100px';
            starMapStyleDropdown.style.minWidth = '100px';
            starMapStyleDropdown.style.maxWidth = '100px';
            starMapStyleDropdown.style.boxSizing = 'border-box';
        }
        
        // Specific styling for all dropdowns in the image settings content
        const imageSettingsDropdowns = document.querySelectorAll('.image-settings-content select');
        imageSettingsDropdowns.forEach(dropdown => {
            dropdown.style.width = '100px';
            dropdown.style.minWidth = '100px';
            dropdown.style.maxWidth = '100px';
            dropdown.style.boxSizing = 'border-box';
        });
        
        // Increase the width of text entry fields to prevent truncation
        const textEntryFields = document.querySelectorAll('input[type="text"].text-entry, input.text-entry');
        textEntryFields.forEach(field => {
            field.style.width = 'calc(100% - 5px)';
            field.style.minWidth = '320px';
            field.style.paddingRight = '2px';
            field.style.boxSizing = 'border-box';
            field.style.fontSize = '14px';
        });
        
        // Reduce the space between the character count and the font family dropdown
        const characterCounts = document.querySelectorAll('.character-count');
        characterCounts.forEach(count => {
            count.style.marginRight = '2px';
            count.style.width = '25px';
            count.style.textAlign = 'center';
        });
        
        console.log("Successfully standardized field sizes");
    } catch (error) {
        console.error("Error in standardizeFieldSizes:", error);
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

/**
 * Polyfill for Element.prototype.matches
 */
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

/**
 * Polyfill for Element.prototype.closest
 */
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

/**
 * Polyfill for :has selector
 */
if (!document.querySelector(':has')) {
    // Add a custom implementation for :has
    Element.prototype.querySelectorAll = (function(_querySelectorAll) {
        return function(selector) {
            if (selector.includes(':has(')) {
                // Extract the base selector and the :has condition
                const parts = selector.split(':has(');
                const baseSelector = parts[0];
                const hasCondition = parts[1].slice(0, -1); // Remove the closing parenthesis
                
                // Get all elements matching the base selector
                const elements = _querySelectorAll.call(this, baseSelector);
                
                // Filter elements that have a child matching the condition
                const result = [];
                for (const element of elements) {
                    if (element.querySelector(hasCondition)) {
                        result.push(element);
                    }
                }
                
                return result;
            }
            
            return _querySelectorAll.call(this, selector);
        };
    })(Element.prototype.querySelectorAll);
}

/* END OF CODE - Cline - 2025-05-15 23:28:00 File: js/container-reorganization-v2.js */
