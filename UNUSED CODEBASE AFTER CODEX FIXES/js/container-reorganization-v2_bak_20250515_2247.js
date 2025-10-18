/* START OF CODE - Cline - 2025-05-15 22:38:00 File: js/container-reorganization-v2.js */

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
        }, 500); // Reduced delay to 500ms
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
        
        // Combine the containers
        combineContainers();
        
        // Fix the text placements container
        fixTextPlacementsContainer();
    } catch (error) {
        console.error("Error in initContainerReorganization:", error);
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
 * This function moves the Fixed Text Styling container into the Customizable Text Layers container
 */
function combineTextLayers() {
    debug("Combining Customizable Text Layers with Fixed Text Styling");
    
    try {
        // Find the containers by their titles
        const customizableTextContainer = findContainerByTitleFlexible('Customizable Text Layers');
        const fixedTextContainer = findContainerByTitleFlexible('Fixed Text Styling');
        
        debug("Customizable Text Container:", customizableTextContainer);
        debug("Fixed Text Container:", fixedTextContainer);
        
        if (!customizableTextContainer || !fixedTextContainer) {
            console.error("Customizable Text or Fixed Text container not found");
            return;
        }
        
        // Create a horizontal rule to separate customizable and fixed layers
        const separator = document.createElement('hr');
        separator.style.margin = '20px 0';
        separator.style.borderTop = '1px solid #ccc';
        separator.style.width = '100%';
        
        // Add the separator to the customizable text container
        customizableTextContainer.appendChild(separator);
        
        // Move the fixed text container's content to the customizable text container
        const fixedTextContent = fixedTextContainer.innerHTML;
        
        // Remove the legend from the fixed text content
        const legendRegex = /<legend[^>]*>.*?<\/legend>/i;
        const fixedTextContentWithoutLegend = fixedTextContent.replace(legendRegex, '');
        
        // Create a div for the fixed text content
        const fixedTextDiv = document.createElement('div');
        fixedTextDiv.className = 'fixed-text-content';
        fixedTextDiv.innerHTML = fixedTextContentWithoutLegend;
        
        // Add the fixed text content to the customizable text container
        customizableTextContainer.appendChild(fixedTextDiv);
        
        // Update the container title to reflect the combined content
        const containerTitle = customizableTextContainer.querySelector('legend');
        if (containerTitle) {
            containerTitle.textContent = 'Customizable Text Layers + Fixed Layers';
            debug("Updated container title to:", containerTitle.textContent);
        }
        
        // Hide the original Fixed Text container
        fixedTextContainer.style.display = 'none';
        
        // Fix the styling of the fixed text fields
        fixFixedTextStyling(customizableTextContainer);
        
        debug("Successfully combined Customizable Text Layers with Fixed Text Styling");
    } catch (error) {
        console.error("Error in combineTextLayers:", error);
    }
}

/**
 * Fix the styling of the fixed text fields
 * @param {Element} container - The container element
 */
function fixFixedTextStyling(container) {
    debug("Fixing fixed text styling");
    
    try {
        // Get the font family and font size selects from the customizable text container
        const customizableSelects = container.querySelectorAll('.row select, div:not(.fixed-text-content) select');
        let fontFamilyWidth = "100px";
        let fontSizeWidth = "70px";
        
        // Find the first row with font selects
        for (let i = 0; i < customizableSelects.length; i += 2) {
            if (i + 1 < customizableSelects.length) {
                const fontFamilySelect = customizableSelects[i];
                const fontSizeSelect = customizableSelects[i + 1];
                
                // Get the computed style
                const fontFamilyStyle = window.getComputedStyle(fontFamilySelect);
                const fontSizeStyle = window.getComputedStyle(fontSizeSelect);
                
                fontFamilyWidth = fontFamilyStyle.width;
                fontSizeWidth = fontSizeStyle.width;
                
                debug("Found font selects in customizable row");
                debug("Font family width:", fontFamilyWidth);
                debug("Font size width:", fontSizeWidth);
                
                break;
            }
        }
        
        // Get the fixed text selects
        const fixedTextSelects = container.querySelectorAll('.fixed-text-content select');
        
        // Apply the widths to the fixed text selects
        for (let i = 0; i < fixedTextSelects.length; i++) {
            if (i % 2 === 0) {
                // Font family select
                fixedTextSelects[i].style.width = fontFamilyWidth;
                debug("Applied width to fixed text font family select:", fontFamilyWidth);
            } else {
                // Font size select
                fixedTextSelects[i].style.width = fontSizeWidth;
                debug("Applied width to fixed text font size select:", fontSizeWidth);
            }
        }
        
        debug("Successfully fixed fixed text styling");
    } catch (error) {
        console.error("Error in fixFixedTextStyling:", error);
    }
}

/**
 * Combine Star Map Canvas Settings with Star Map Image Settings
 * This function combines the Star Map Canvas Settings with Star Map Image Settings
 */
function combineCanvasAndImageSettings() {
    debug("Combining Star Map Canvas Settings with Star Map Image Settings");
    
    try {
        // Find the containers by their titles
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
        
        // Move the image settings container's content to the canvas settings container
        const imageSettingsContent = imageSettingsContainer.innerHTML;
        
        // Remove the legend from the image settings content
        const legendRegex = /<legend[^>]*>.*?<\/legend>/i;
        const imageSettingsContentWithoutLegend = imageSettingsContent.replace(legendRegex, '');
        
        // Create a div for the image settings content
        const imageSettingsDiv = document.createElement('div');
        imageSettingsDiv.className = 'image-settings-content';
        imageSettingsDiv.innerHTML = imageSettingsContentWithoutLegend;
        
        // Add the image settings content to the canvas settings container
        canvasSettingsContainer.appendChild(imageSettingsDiv);
        
        // Hide the original Image Settings container
        imageSettingsContainer.style.display = 'none';
        
        // Fix the styling of the image settings fields
        fixImageSettingsStyling(canvasSettingsContainer);
        
        debug("Successfully combined Star Map Canvas Settings with Star Map Image Settings");
    } catch (error) {
        console.error("Error in combineCanvasAndImageSettings:", error);
    }
}

/**
 * Fix the styling of the image settings fields
 * @param {Element} container - The container element
 */
function fixImageSettingsStyling(container) {
    debug("Fixing image settings styling");
    
    try {
        // Get the customizable text container to get the font family width
        const customizableTextContainer = findContainerByTitleFlexible('Customizable Text Layers');
        let fontFamilyWidth = "100px";
        
        if (customizableTextContainer) {
            // Get the font family selects from the customizable text container
            const customizableSelects = customizableTextContainer.querySelectorAll('select');
            
            // Find the first font family select
            for (const select of customizableSelects) {
                const fontFamilyStyle = window.getComputedStyle(select);
                fontFamilyWidth = fontFamilyStyle.width;
                debug("Font family width from customizable text:", fontFamilyWidth);
                break;
            }
        }
        
        // Get the star map style select
        const starMapStyleSelect = container.querySelector('.image-settings-content select');
        
        if (starMapStyleSelect) {
            // Apply the width to the star map style select
            starMapStyleSelect.style.width = fontFamilyWidth;
            debug("Applied width to star map style select:", fontFamilyWidth);
        }
        
        debug("Successfully fixed image settings styling");
    } catch (error) {
        console.error("Error in fixImageSettingsStyling:", error);
    }
}

/**
 * Fix the text placements container
 * This function fixes the styling of the text placements container
 */
function fixTextPlacementsContainer() {
    debug("Fixing text placements container");
    
    try {
        // Find the text placements container
        const textPlacementsContainer = findContainerByTitleFlexible('Text Placements On Star Map Canvas');
        
        if (!textPlacementsContainer) {
            console.error("Text placements container not found");
            return;
        }
        
        // Get all labels in the text placements container
        const labels = textPlacementsContainer.querySelectorAll('label');
        
        // Apply center alignment to all labels
        for (const label of labels) {
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            debug("Applied center alignment to label:", label);
        }
        
        debug("Successfully fixed text placements container");
    } catch (error) {
        console.error("Error in fixTextPlacementsContainer:", error);
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
        
        for (const fieldset of fieldsets) {
            const legend = fieldset.querySelector('legend');
            if (legend && legend.textContent.toLowerCase().includes(searchText)) {
                debug("Found container in fieldset:", fieldset);
                return fieldset;
            }
        }
        
        // If not found in fieldsets, look for divs with a heading containing the title text
        const divs = document.querySelectorAll('div.form-section, div.container, div.section');
        
        for (const div of divs) {
            const heading = div.querySelector('h1, h2, h3, h4, h5, h6');
            if (heading && heading.textContent.toLowerCase().includes(searchText)) {
                debug("Found container in div with heading:", div);
                return div;
            }
        }
        
        // If still not found, look for divs with a class or ID containing the title text
        const allDivs = document.querySelectorAll('div');
        
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
            'star map image settings': ['image settings', 'map image', 'star map style', 'image style'],
            'text placements on star map canvas': ['text placements', 'text positions', 'text locations']
        };
        
        const alternatives = alternativeTitles[searchText] || [];
        
        for (const alternative of alternatives) {
            const container = findContainerByTitleFlexible(alternative);
            if (container) {
                return container;
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

/* END OF CODE - Cline - 2025-05-15 22:38:00 File: js/container-reorganization-v2.js */
