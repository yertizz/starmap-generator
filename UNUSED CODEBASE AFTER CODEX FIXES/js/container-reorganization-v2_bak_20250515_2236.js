/* START OF CODE - Cline - 2025-05-15 20:35:00 File: js/container-reorganization-v2.js */

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

// Add a global debug flag
const DEBUG = true;

// Debug function to log messages
function debug(message, obj) {
    if (DEBUG) {
        if (obj) {
            console.log(`[DEBUG] ${message}`, obj);
        } else {
            console.log(`[DEBUG] ${message}`);
        }
    }
}

// Log that the script has loaded
debug("Container Reorganization V2 script loaded at: " + new Date().toISOString());
debug("Document ready state: " + document.readyState);

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    debug("DOM Content Loaded event fired");
    
    // Wait for all images and resources to be loaded
    window.addEventListener('load', function() {
        debug("Window Load event fired");
        
        // Wait a bit longer to ensure all scripts have run
        setTimeout(function() {
            debug("Starting container reorganization");
            initContainerReorganization();
        }, 2000); // Wait 2 seconds
    });
});

/**
 * Initialize the container reorganization
 */
function initContainerReorganization() {
    debug("Initializing Container Reorganization V2");
    
    try {
        // List all container titles for debugging
        const legends = document.querySelectorAll('fieldset legend');
        debug("Container titles found:", legends.length);
        legends.forEach(legend => {
            debug("- " + legend.textContent);
        });
        
        // Hide the containers that will be combined
        hideContainers();
        
        // Combine the containers
        combineContainers();
    } catch (error) {
        console.error("Error in initContainerReorganization:", error);
    }
}

/**
 * Hide the containers that will be combined
 */
function hideContainers() {
    debug("Hiding containers that will be combined");
    
    try {
        // Find and hide the Fixed Text Styling container
        const fixedTextContainer = findContainerByTitleFlexible('Fixed Text Styling');
        if (fixedTextContainer) {
            fixedTextContainer.style.display = 'none';
            debug("Fixed Text Styling container hidden");
        } else {
            debug("Fixed Text Styling container not found");
        }
        
        // Find and hide the Star Map Image Settings container
        const imageSettingsContainer = findContainerByTitleFlexible('Star Map Image Settings');
        if (imageSettingsContainer) {
            imageSettingsContainer.style.display = 'none';
            debug("Star Map Image Settings container hidden");
        } else {
            debug("Star Map Image Settings container not found");
        }
    } catch (error) {
        console.error("Error in hideContainers:", error);
    }
}

/**
 * Combine the containers
 */
function combineContainers() {
    debug("Combining containers");
    
    try {
        // Combine Customizable Text Layers with Fixed Text Styling
        combineTextLayers();
        
        // Combine Star Map Canvas Settings with Star Map Image Settings
        combineCanvasAndImageSettings();
    } catch (error) {
        console.error("Error in combineContainers:", error);
    }
}

/**
 * Combine Customizable Text Layers with Fixed Text Styling
 * This function moves the Date and Lat/Long rows from Fixed Text Styling
 * into the Customizable Text Layers container
 */
function combineTextLayers() {
    debug("Combining Customizable Text Layers with Fixed Text Styling");
    
    try {
        // Find the containers by their titles - using more flexible matching
        const customizableTextContainer = findContainerByTitleFlexible('Customizable Text Layers');
        const fixedTextContainer = findContainerByTitleFlexible('Fixed Text Styling');
        
        debug("Customizable Text Container:", customizableTextContainer);
        debug("Fixed Text Container:", fixedTextContainer);
        
        if (!customizableTextContainer || !fixedTextContainer) {
            console.error("Customizable Text or Fixed Text container not found");
            debug("Available fieldsets:", document.querySelectorAll('fieldset'));
            return;
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
        
        // Get the exact widths from the customizable text fields
        let fontFamilyWidth = "100px";
        let fontSizeWidth = "70px";
        
        // Try to get the actual widths from the customizable text container
        const customizableRows = customizableTextContainer.querySelectorAll('.row, div');
        debug("Customizable rows found:", customizableRows.length);
        
        for (const row of customizableRows) {
            const selects = row.querySelectorAll('select');
            if (selects.length >= 2) {
                const fontFamilySelect = selects[0];
                const fontSizeSelect = selects[1];
                
                // Get the computed style
                const fontFamilyStyle = window.getComputedStyle(fontFamilySelect);
                const fontSizeStyle = window.getComputedStyle(fontSizeSelect);
                
                fontFamilyWidth = fontFamilyStyle.width;
                fontSizeWidth = fontSizeStyle.width;
                
                debug("Found font selects in customizable row:", selects);
                debug("Font family width:", fontFamilyWidth);
                debug("Font size width:", fontSizeWidth);
                
                break;
            }
        }
        
        // Create the HTML for the fixed layers section
        fixedLayersSection.innerHTML = `
            <div class="row" style="display: flex; align-items: center; margin-bottom: 10px;">
                <label style="width: 80px; margin-right: 10px;">Date:</label>
                <select style="width: ${fontFamilyWidth}; margin-right: 10px;">
                    <option selected>Abril Fatface</option>
                    <option>Lora</option>
                    <option>Arial</option>
                    <option>Verdana</option>
                </select>
                <select style="width: ${fontSizeWidth}; margin-right: 10px;">
                    <option selected>8</option>
                    <option>12</option>
                    <option>16</option>
                    <option>24</option>
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
                    <option selected>Abril Fatface</option>
                    <option>Lora</option>
                    <option>Arial</option>
                    <option>Verdana</option>
                </select>
                <select style="width: ${fontSizeWidth}; margin-right: 10px;">
                    <option selected>8</option>
                    <option>12</option>
                    <option>16</option>
                    <option>24</option>
                </select>
                <input type="checkbox" id="latlong-bold" style="margin-right: 5px;">
                <label for="latlong-bold" style="margin-right: 10px;">Bold</label>
                <input type="checkbox" id="latlong-italic" style="margin-right: 5px;">
                <label for="latlong-italic" style="margin-right: 10px;">Italic</label>
                <div class="color-picker" style="width: 30px; height: 30px; background-color: #ffcc00; border-radius: 50%;"></div>
            </div>
        `;
        
        // Add the separator and fixed layers section to the customizable text container
        customizableTextContainer.appendChild(separator);
        customizableTextContainer.appendChild(fixedLayersSection);
        
        // Update the container title to reflect the combined content
        const containerTitle = customizableTextContainer.querySelector('legend');
        if (containerTitle) {
            containerTitle.textContent = 'Customizable Text Layers + Fixed Layers';
            debug("Updated container title to:", containerTitle.textContent);
        }
        
        // Hide the original Fixed Text container
        fixedTextContainer.style.display = 'none';
        
        // After adding the fixed layers section, find all selects and apply the correct widths
        setTimeout(function() {
            const fixedLayerSelects = fixedLayersSection.querySelectorAll('select');
            debug("Fixed layer selects found:", fixedLayerSelects.length);
            
            for (let i = 0; i < fixedLayerSelects.length; i++) {
                if (i % 2 === 0) {
                    // Font family select
                    fixedLayerSelects[i].style.width = fontFamilyWidth;
                    debug("Applied width to font family select:", fontFamilyWidth);
                } else {
                    // Font size select
                    fixedLayerSelects[i].style.width = fontSizeWidth;
                    debug("Applied width to font size select:", fontSizeWidth);
                }
            }
        }, 100);
        
        debug("Successfully combined Customizable Text Layers with Fixed Text Styling");
    } catch (error) {
        console.error("Error in combineTextLayers:", error);
    }
}

/**
 * Combine Star Map Canvas Settings with Star Map Image Settings
 * This function combines the Star Map Canvas Settings with Star Map Image Settings
 */
function combineCanvasAndImageSettings() {
    debug("Combining Star Map Canvas Settings with Star Map Image Settings");
    
    try {
        // Find the containers by their titles - using more flexible matching
        const canvasSettingsContainer = findContainerByTitleFlexible('Star Map Canvas Settings');
        const imageSettingsContainer = findContainerByTitleFlexible('Star Map Image Settings');
        
        debug("Canvas Settings Container:", canvasSettingsContainer);
        debug("Image Settings Container:", imageSettingsContainer);
        
        if (!canvasSettingsContainer || !imageSettingsContainer) {
            console.error("Canvas Settings or Image Settings container not found");
            return;
        }
        
        // Update the container title to reflect the combined content
        const containerTitle = canvasSettingsContainer.querySelector('legend');
        if (containerTitle) {
            containerTitle.textContent = 'Star Map Canvas + Image Settings';
            debug("Updated container title to:", containerTitle.textContent);
        }
        
        // Create a separator
        const separator = document.createElement('hr');
        separator.style.margin = '20px 0';
        separator.style.borderTop = '1px solid #ccc';
        separator.style.width = '100%';
        
        // Add the separator to the canvas settings container
        canvasSettingsContainer.appendChild(separator);
        
        // Create a new div for the image settings content
        const imageSettingsContent = document.createElement('div');
        imageSettingsContent.className = 'image-settings-content';
        
        // Add a heading for the image settings section
        const imageSettingsHeading = document.createElement('h3');
        imageSettingsHeading.textContent = 'Star Map Image Settings';
        imageSettingsHeading.style.marginTop = '10px';
        imageSettingsHeading.style.marginBottom = '15px';
        
        // Add the heading to the image settings content
        imageSettingsContent.appendChild(imageSettingsHeading);
        
        // Get the content from the image settings container
        const imageSettingsHTML = imageSettingsContainer.innerHTML;
        
        // Remove the legend from the HTML
        const legendRegex = /<legend[^>]*>.*?<\/legend>/i;
        const imageSettingsHTMLWithoutLegend = imageSettingsHTML.replace(legendRegex, '');
        
        // Add the content to the image settings content
        imageSettingsContent.innerHTML += imageSettingsHTMLWithoutLegend;
        
        // Add the image settings content to the canvas settings container
        canvasSettingsContainer.appendChild(imageSettingsContent);
        
        // Hide the original Image Settings container
        imageSettingsContainer.style.display = 'none';
        
        debug("Successfully combined Star Map Canvas Settings with Star Map Image Settings");
    } catch (error) {
        console.error("Error in combineCanvasAndImageSettings:", error);
    }
}

/**
 * Helper function to find a container by its title text with flexible matching
 * @param {string} titleText - The text to search for in the container title
 * @returns {Element|null} - The container element or null if not found
 */
function findContainerByTitleFlexible(titleText) {
    debug("Looking for container with title similar to:", titleText);
    
    try {
        // Convert title text to lowercase for case-insensitive matching
        const searchText = titleText.toLowerCase();
        
        // Look for fieldset elements with a legend containing the title text
        const fieldsets = document.querySelectorAll('fieldset');
        debug("Fieldsets found:", fieldsets.length);
        
        for (const fieldset of fieldsets) {
            const legend = fieldset.querySelector('legend');
            if (legend && legend.textContent.toLowerCase().includes(searchText)) {
                debug("Found container in fieldset:", fieldset);
                return fieldset;
            }
        }
        
        // If not found in fieldsets, look for divs with a heading containing the title text
        const divs = document.querySelectorAll('div.form-section, div.container, div.section');
        debug("Potential container divs found:", divs.length);
        
        for (const div of divs) {
            const heading = div.querySelector('h1, h2, h3, h4, h5, h6');
            if (heading && heading.textContent.toLowerCase().includes(searchText)) {
                debug("Found container in div with heading:", div);
                return div;
            }
        }
        
        // If still not found, look for divs with a class or ID containing the title text
        const allDivs = document.querySelectorAll('div');
        debug("All divs found:", allDivs.length);
        
        for (const div of allDivs) {
            const className = div.className.toLowerCase();
            const id = div.id ? div.id.toLowerCase() : '';
            const searchTextNoDashes = searchText.replace(/\s+/g, '');
            const searchTextWithDashes = searchText.replace(/\s+/g, '-');
            
            if (className.includes(searchTextNoDashes) || 
                className.includes(searchTextWithDashes) || 
                id.includes(searchTextNoDashes) || 
                id.includes(searchTextWithDashes)) {
                debug("Found container in div with class/id:", div);
                return div;
            }
        }
        
        // If still not found, try alternative titles
        const alternativeTitles = {
            'customizable text layers': ['text layers', 'custom text', 'text entries', 'customizable text'],
            'fixed text styling': ['fixed text', 'date and coordinates', 'static text', 'fixed styling'],
            'star map canvas settings': ['canvas settings', 'map canvas', 'canvas size', 'canvas dimensions'],
            'star map image settings': ['image settings', 'map image', 'star map style', 'image style']
        };
        
        const alternatives = alternativeTitles[searchText] || [];
        debug("Trying alternative titles:", alternatives);
        
        for (const alternative of alternatives) {
            const container = findContainerByTitleFlexible(alternative);
            if (container) {
                return container;
            }
        }
        
        // Last resort: look for any element containing the title text
        debug("Last resort: looking for any element containing the title text");
        const elements = document.querySelectorAll('*');
        
        for (const element of elements) {
            if (element.textContent && element.textContent.toLowerCase().includes(searchText) && 
                (element.children.length > 0 || element.tagName.toLowerCase() === 'fieldset')) {
                debug("Found container by text content:", element);
                return element;
            }
        }
        
        debug("Container not found for title:", titleText);
        return null;
    } catch (error) {
        console.error("Error in findContainerByTitleFlexible:", error);
        return null;
    }
}

// Add a global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error("Error in container-reorganization-v2.js:", message, "at", source, "line", lineno, "column", colno, error);
    return false;
};

/* END OF CODE - Cline - 2025-05-15 20:35:00 File: js/container-reorganization-v2.js */
