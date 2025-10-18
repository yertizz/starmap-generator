/* START OF CODE - Cline - 2025-05-20 11:21:56 File: js/fixed-layers-fix_4.js */

/**
 * Fixed Layers Fix (Part 4) JavaScript for Star Map Generator
 * 
 * This script focuses on:
 * 1. Exactly matching the mockup styling for the Fixed Layers section
 * 2. Making the color pickers work
 * 3. Fixing the font family and font size dropdowns
 * 4. Fixing the date display
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fixed Layers Fix (Part 4) script loaded");
    
    // First, fix the Fixed Layers section styling to match the mockup
    fixFixedLayersStyling();
    
    // Initialize the color pickers
    initializeColorPickers();
    
    // Fix the date display
    fixDateDisplay();
    
    // Add event listeners for date and coordinates changes
    addEventListeners();
});

/**
 * Fix the Fixed Layers section styling to match the mockup
 */
function fixFixedLayersStyling() {
    console.log("Fixing Fixed Layers styling to match mockup");
    
    try {
        // Find the Fixed Layers section
        const fixedTextContent = document.querySelector('.fixed-text-content');
        if (!fixedTextContent) {
            console.error("Fixed text content not found");
            return;
        }
        
        // Find the input groups (Date and Lat/Long)
        const inputGroups = fixedTextContent.querySelectorAll('.input-group');
        if (inputGroups.length < 2) {
            console.error("Input groups not found");
            return;
        }
        
        // Style the Fixed Layers section container
        fixedTextContent.style.padding = '10px';
        fixedTextContent.style.backgroundColor = '#f9f9f9';
        fixedTextContent.style.borderRadius = '6px';
        fixedTextContent.style.border = '1px solid #e0e0e0';
        
        // Style the Date input group
        const dateInputGroup = inputGroups[0];
        dateInputGroup.style.display = 'flex';
        dateInputGroup.style.alignItems = 'center';
        dateInputGroup.style.marginBottom = '15px';
        dateInputGroup.style.padding = '8px';
        dateInputGroup.style.backgroundColor = '#f5f5f5';
        dateInputGroup.style.borderRadius = '4px';
        dateInputGroup.style.border = '1px solid #e0e0e0';
        
        // Style the Lat/Long input group
        const coordsInputGroup = inputGroups[1];
        coordsInputGroup.style.display = 'flex';
        coordsInputGroup.style.alignItems = 'center';
        coordsInputGroup.style.marginBottom = '15px';
        coordsInputGroup.style.padding = '8px';
        coordsInputGroup.style.backgroundColor = '#f5f5f5';
        coordsInputGroup.style.borderRadius = '4px';
        coordsInputGroup.style.border = '1px solid #e0e0e0';
        
        // Find or create the Date label
        let dateLabel = dateInputGroup.querySelector('label');
        if (!dateLabel) {
            dateLabel = document.createElement('label');
            dateLabel.textContent = 'Date:';
            dateInputGroup.appendChild(dateLabel);
        }
        
        // Style the Date label
        dateLabel.style.width = '80px';
        dateLabel.style.textAlign = 'right';
        dateLabel.style.marginRight = '10px';
        dateLabel.style.fontWeight = 'bold';
        dateLabel.style.color = '#333';
        
        // Find or create the Date display value
        let dateDisplayValue = document.getElementById('fixed-date-display');
        if (!dateDisplayValue) {
            dateDisplayValue = document.createElement('div');
            dateDisplayValue.id = 'fixed-date-display';
            dateDisplayValue.className = 'display-value';
            dateInputGroup.appendChild(dateDisplayValue);
        }
        
        // Style the Date display value
        dateDisplayValue.style.display = 'inline-block';
        dateDisplayValue.style.width = '300px';
        dateDisplayValue.style.minWidth = '300px';
        dateDisplayValue.style.height = '30px';
        dateDisplayValue.style.lineHeight = '30px';
        dateDisplayValue.style.padding = '0 10px';
        dateDisplayValue.style.marginRight = '10px';
        dateDisplayValue.style.backgroundColor = '#f0f0f0';
        dateDisplayValue.style.border = '1px solid #ddd';
        dateDisplayValue.style.borderRadius = '4px';
        dateDisplayValue.style.fontSize = '14px';
        dateDisplayValue.style.color = '#333';
        dateDisplayValue.style.whiteSpace = 'nowrap';
        dateDisplayValue.style.overflow = 'hidden';
        dateDisplayValue.style.textOverflow = 'ellipsis';
        dateDisplayValue.style.boxSizing = 'border-box';
        
        // Find or create the Date font controls
        let dateFontControls = dateInputGroup.querySelector('.font-controls');
        if (!dateFontControls) {
            dateFontControls = document.createElement('div');
            dateFontControls.className = 'font-controls';
            dateInputGroup.appendChild(dateFontControls);
        }
        
        // Style the Date font controls
        dateFontControls.style.display = 'flex';
        dateFontControls.style.flexWrap = 'wrap';
        dateFontControls.style.alignItems = 'center';
        
        // Find or create the Date font family select
        let dateFontFamily = document.getElementById('fixed-font-family-date');
        if (!dateFontFamily) {
            dateFontFamily = document.createElement('select');
            dateFontFamily.id = 'fixed-font-family-date';
            dateFontFamily.className = 'font-family-select';
            dateFontControls.appendChild(dateFontFamily);
        }
        
        // Style the Date font family select
        dateFontFamily.style.marginRight = '10px';
        dateFontFamily.style.padding = '4px 8px';
        dateFontFamily.style.border = '1px solid #ccc';
        dateFontFamily.style.borderRadius = '4px';
        dateFontFamily.style.backgroundColor = 'white';
        dateFontFamily.style.width = 'auto';
        dateFontFamily.style.minWidth = '100px';
        
        // Find or create the Date font size select
        let dateFontSize = document.getElementById('fixed-font-size-date');
        if (!dateFontSize) {
            dateFontSize = document.createElement('select');
            dateFontSize.id = 'fixed-font-size-date';
            dateFontSize.className = 'font-size-select';
            dateFontControls.appendChild(dateFontSize);
        }
        
        // Style the Date font size select
        dateFontSize.style.marginRight = '10px';
        dateFontSize.style.padding = '4px 8px';
        dateFontSize.style.border = '1px solid #ccc';
        dateFontSize.style.borderRadius = '4px';
        dateFontSize.style.backgroundColor = 'white';
        dateFontSize.style.width = 'auto';
        dateFontSize.style.minWidth = '100px';
        
        // Find or create the Date style options
        let dateStyleOptions = dateFontControls.querySelector('.style-options');
        if (!dateStyleOptions) {
            dateStyleOptions = document.createElement('div');
            dateStyleOptions.className = 'style-options';
            dateFontControls.appendChild(dateStyleOptions);
        }
        
        // Style the Date style options
        dateStyleOptions.style.display = 'flex';
        dateStyleOptions.style.alignItems = 'center';
        dateStyleOptions.style.marginRight = '10px';
        
        // Find or create the Date bold checkbox
        let dateBoldLabel = dateStyleOptions.querySelector('label:nth-child(1)');
        let dateBoldCheckbox = document.getElementById('fixed-text-bold-date');
        if (!dateBoldLabel || !dateBoldCheckbox) {
            dateBoldLabel = document.createElement('label');
            dateBoldCheckbox = document.createElement('input');
            dateBoldCheckbox.type = 'checkbox';
            dateBoldCheckbox.id = 'fixed-text-bold-date';
            dateBoldLabel.appendChild(dateBoldCheckbox);
            dateBoldLabel.appendChild(document.createTextNode(' Bold'));
            dateStyleOptions.appendChild(dateBoldLabel);
        }
        
        // Style the Date bold checkbox
        dateBoldLabel.style.width = 'auto';
        dateBoldLabel.style.marginRight = '10px';
        dateBoldLabel.style.textAlign = 'left';
        dateBoldLabel.style.fontWeight = 'normal';
        
        // Find or create the Date italic checkbox
        let dateItalicLabel = dateStyleOptions.querySelector('label:nth-child(2)');
        let dateItalicCheckbox = document.getElementById('fixed-text-italic-date');
        if (!dateItalicLabel || !dateItalicCheckbox) {
            dateItalicLabel = document.createElement('label');
            dateItalicCheckbox = document.createElement('input');
            dateItalicCheckbox.type = 'checkbox';
            dateItalicCheckbox.id = 'fixed-text-italic-date';
            dateItalicLabel.appendChild(dateItalicCheckbox);
            dateItalicLabel.appendChild(document.createTextNode(' Italic'));
            dateStyleOptions.appendChild(dateItalicLabel);
        }
        
        // Style the Date italic checkbox
        dateItalicLabel.style.width = 'auto';
        dateItalicLabel.style.marginRight = '10px';
        dateItalicLabel.style.textAlign = 'left';
        dateItalicLabel.style.fontWeight = 'normal';
        
        // Find or create the Date color input
        let dateColorInput = document.getElementById('fixed-font-color-date');
        if (!dateColorInput) {
            dateColorInput = document.createElement('input');
            dateColorInput.type = 'text';
            dateColorInput.id = 'fixed-font-color-date';
            dateColorInput.value = '#FFCC00';
            dateColorInput.style.display = 'none';
            dateFontControls.appendChild(dateColorInput);
        }
        
        // Find or create the Date color swatch
        let dateColorSwatch = dateFontControls.querySelector('.color-swatch');
        if (!dateColorSwatch) {
            dateColorSwatch = document.createElement('button');
            dateColorSwatch.type = 'button';
            dateColorSwatch.className = 'color-swatch';
            dateColorSwatch.setAttribute('data-target', 'fixed-font-color-date');
            dateColorSwatch.setAttribute('aria-label', 'Fixed Date Font Color');
            dateFontControls.appendChild(dateColorSwatch);
        }
        
        // Style the Date color swatch
        dateColorSwatch.style.width = '24px';
        dateColorSwatch.style.height = '24px';
        dateColorSwatch.style.borderRadius = '50%';
        dateColorSwatch.style.border = '1px solid #ccc';
        dateColorSwatch.style.cursor = 'pointer';
        dateColorSwatch.style.backgroundColor = '#FFCC00';
        
        // Find or create the Lat/Long label
        let coordsLabel = coordsInputGroup.querySelector('label');
        if (!coordsLabel) {
            coordsLabel = document.createElement('label');
            coordsLabel.textContent = 'Lat/Long:';
            coordsInputGroup.appendChild(coordsLabel);
        }
        
        // Style the Lat/Long label
        coordsLabel.style.width = '80px';
        coordsLabel.style.textAlign = 'right';
        coordsLabel.style.marginRight = '10px';
        coordsLabel.style.fontWeight = 'bold';
        coordsLabel.style.color = '#333';
        
        // Find or create the Lat/Long display value
        let coordsDisplayValue = document.getElementById('fixed-coords-display');
        if (!coordsDisplayValue) {
            coordsDisplayValue = document.createElement('div');
            coordsDisplayValue.id = 'fixed-coords-display';
            coordsDisplayValue.className = 'display-value';
            coordsInputGroup.appendChild(coordsDisplayValue);
        }
        
        // Style the Lat/Long display value
        coordsDisplayValue.style.display = 'inline-block';
        coordsDisplayValue.style.width = '300px';
        coordsDisplayValue.style.minWidth = '300px';
        coordsDisplayValue.style.height = '30px';
        coordsDisplayValue.style.lineHeight = '30px';
        coordsDisplayValue.style.padding = '0 10px';
        coordsDisplayValue.style.marginRight = '10px';
        coordsDisplayValue.style.backgroundColor = '#f0f0f0';
        coordsDisplayValue.style.border = '1px solid #ddd';
        coordsDisplayValue.style.borderRadius = '4px';
        coordsDisplayValue.style.fontSize = '14px';
        coordsDisplayValue.style.color = '#333';
        coordsDisplayValue.style.whiteSpace = 'nowrap';
        coordsDisplayValue.style.overflow = 'hidden';
        coordsDisplayValue.style.textOverflow = 'ellipsis';
        coordsDisplayValue.style.boxSizing = 'border-box';
        
        // Find or create the Lat/Long font controls
        let coordsFontControls = coordsInputGroup.querySelector('.font-controls');
        if (!coordsFontControls) {
            coordsFontControls = document.createElement('div');
            coordsFontControls.className = 'font-controls';
            coordsInputGroup.appendChild(coordsFontControls);
        }
        
        // Style the Lat/Long font controls
        coordsFontControls.style.display = 'flex';
        coordsFontControls.style.flexWrap = 'wrap';
        coordsFontControls.style.alignItems = 'center';
        
        // Find or create the Lat/Long font family select
        let coordsFontFamily = document.getElementById('fixed-font-family-coords');
        if (!coordsFontFamily) {
            coordsFontFamily = document.createElement('select');
            coordsFontFamily.id = 'fixed-font-family-coords';
            coordsFontFamily.className = 'font-family-select';
            coordsFontControls.appendChild(coordsFontFamily);
        }
        
        // Style the Lat/Long font family select
        coordsFontFamily.style.marginRight = '10px';
        coordsFontFamily.style.padding = '4px 8px';
        coordsFontFamily.style.border = '1px solid #ccc';
        coordsFontFamily.style.borderRadius = '4px';
        coordsFontFamily.style.backgroundColor = 'white';
        coordsFontFamily.style.width = 'auto';
        coordsFontFamily.style.minWidth = '100px';
        
        // Find or create the Lat/Long font size select
        let coordsFontSize = document.getElementById('fixed-font-size-coords');
        if (!coordsFontSize) {
            coordsFontSize = document.createElement('select');
            coordsFontSize.id = 'fixed-font-size-coords';
            coordsFontSize.className = 'font-size-select';
            coordsFontControls.appendChild(coordsFontSize);
        }
        
        // Style the Lat/Long font size select
        coordsFontSize.style.marginRight = '10px';
        coordsFontSize.style.padding = '4px 8px';
        coordsFontSize.style.border = '1px solid #ccc';
        coordsFontSize.style.borderRadius = '4px';
        coordsFontSize.style.backgroundColor = 'white';
        coordsFontSize.style.width = 'auto';
        coordsFontSize.style.minWidth = '100px';
        
        // Find or create the Lat/Long style options
        let coordsStyleOptions = coordsFontControls.querySelector('.style-options');
        if (!coordsStyleOptions) {
            coordsStyleOptions = document.createElement('div');
            coordsStyleOptions.className = 'style-options';
            coordsFontControls.appendChild(coordsStyleOptions);
        }
        
        // Style the Lat/Long style options
        coordsStyleOptions.style.display = 'flex';
        coordsStyleOptions.style.alignItems = 'center';
        coordsStyleOptions.style.marginRight = '10px';
        
        // Find or create the Lat/Long bold checkbox
        let coordsBoldLabel = coordsStyleOptions.querySelector('label:nth-child(1)');
        let coordsBoldCheckbox = document.getElementById('fixed-text-bold-coords');
        if (!coordsBoldLabel || !coordsBoldCheckbox) {
            coordsBoldLabel = document.createElement('label');
            coordsBoldCheckbox = document.createElement('input');
            coordsBoldCheckbox.type = 'checkbox';
            coordsBoldCheckbox.id = 'fixed-text-bold-coords';
            coordsBoldLabel.appendChild(coordsBoldCheckbox);
            coordsBoldLabel.appendChild(document.createTextNode(' Bold'));
            coordsStyleOptions.appendChild(coordsBoldLabel);
        }
        
        // Style the Lat/Long bold checkbox
        coordsBoldLabel.style.width = 'auto';
        coordsBoldLabel.style.marginRight = '10px';
        coordsBoldLabel.style.textAlign = 'left';
        coordsBoldLabel.style.fontWeight = 'normal';
        
        // Find or create the Lat/Long italic checkbox
        let coordsItalicLabel = coordsStyleOptions.querySelector('label:nth-child(2)');
        let coordsItalicCheckbox = document.getElementById('fixed-text-italic-coords');
        if (!coordsItalicLabel || !coordsItalicCheckbox) {
            coordsItalicLabel = document.createElement('label');
            coordsItalicCheckbox = document.createElement('input');
            coordsItalicCheckbox.type = 'checkbox';
            coordsItalicCheckbox.id = 'fixed-text-italic-coords';
            coordsItalicLabel.appendChild(coordsItalicCheckbox);
            coordsItalicLabel.appendChild(document.createTextNode(' Italic'));
            coordsStyleOptions.appendChild(coordsItalicLabel);
        }
        
        // Style the Lat/Long italic checkbox
        coordsItalicLabel.style.width = 'auto';
        coordsItalicLabel.style.marginRight = '10px';
        coordsItalicLabel.style.textAlign = 'left';
        coordsItalicLabel.style.fontWeight = 'normal';
        
        // Find or create the Lat/Long color input
        let coordsColorInput = document.getElementById('fixed-font-color-coords');
        if (!coordsColorInput) {
            coordsColorInput = document.createElement('input');
            coordsColorInput.type = 'text';
            coordsColorInput.id = 'fixed-font-color-coords';
            coordsColorInput.value = '#FFCC00';
            coordsColorInput.style.display = 'none';
            coordsFontControls.appendChild(coordsColorInput);
        }
        
        // Find or create the Lat/Long color swatch
        let coordsColorSwatch = coordsFontControls.querySelector('.color-swatch');
        if (!coordsColorSwatch) {
            coordsColorSwatch = document.createElement('button');
            coordsColorSwatch.type = 'button';
            coordsColorSwatch.className = 'color-swatch';
            coordsColorSwatch.setAttribute('data-target', 'fixed-font-color-coords');
            coordsColorSwatch.setAttribute('aria-label', 'Fixed Coordinates Font Color');
            coordsFontControls.appendChild(coordsColorSwatch);
        }
        
        // Style the Lat/Long color swatch
        coordsColorSwatch.style.width = '24px';
        coordsColorSwatch.style.height = '24px';
        coordsColorSwatch.style.borderRadius = '50%';
        coordsColorSwatch.style.border = '1px solid #ccc';
        coordsColorSwatch.style.cursor = 'pointer';
        coordsColorSwatch.style.backgroundColor = '#FFCC00';
        
        // Copy font options from existing dropdowns
        copyFontOptions();
        
        console.log("Successfully fixed Fixed Layers styling");
    } catch (error) {
        console.error("Error fixing Fixed Layers styling:", error);
    }
}

/**
 * Copy font options from existing dropdowns
 */
function copyFontOptions() {
    console.log("Copying font options from existing dropdowns");
    
    try {
        // Find the source font family and font size dropdowns
        const sourceFontFamily = document.querySelector('.text-entry-row select.font-family-select');
        const sourceFontSize = document.querySelector('.text-entry-row select.font-size-select');
        
        // Find the target font family and font size dropdowns
        const dateFontFamily = document.getElementById('fixed-font-family-date');
        const coordsFontFamily = document.getElementById('fixed-font-family-coords');
        const dateFontSize = document.getElementById('fixed-font-size-date');
        const coordsFontSize = document.getElementById('fixed-font-size-coords');
        
        // Copy font family options
        if (sourceFontFamily && dateFontFamily && coordsFontFamily) {
            // Clear existing options
            dateFontFamily.innerHTML = '';
            coordsFontFamily.innerHTML = '';
            
            // Copy options from source
            Array.from(sourceFontFamily.options).forEach(option => {
                // Date font family
                const dateOption = document.createElement('option');
                dateOption.value = option.value;
                dateOption.textContent = option.textContent;
                dateOption.style.fontFamily = option.style.fontFamily || option.value;
                dateFontFamily.appendChild(dateOption);
                
                // Coords font family
                const coordsOption = document.createElement('option');
                coordsOption.value = option.value;
                coordsOption.textContent = option.textContent;
                coordsOption.style.fontFamily = option.style.fontFamily || option.value;
                coordsFontFamily.appendChild(coordsOption);
            });
            
            // Set default value to Oswald
            dateFontFamily.value = 'Oswald';
            coordsFontFamily.value = 'Oswald';
        } else {
            // If source not found, add default options
            const defaultFonts = ['Oswald', 'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia'];
            
            if (dateFontFamily) {
                dateFontFamily.innerHTML = '';
                defaultFonts.forEach(font => {
                    const option = document.createElement('option');
                    option.value = font;
                    option.textContent = font;
                    option.style.fontFamily = font;
                    dateFontFamily.appendChild(option);
                });
                dateFontFamily.value = 'Oswald';
            }
            
            if (coordsFontFamily) {
                coordsFontFamily.innerHTML = '';
                defaultFonts.forEach(font => {
                    const option = document.createElement('option');
                    option.value = font;
                    option.textContent = font;
                    option.style.fontFamily = font;
                    coordsFontFamily.appendChild(option);
                });
                coordsFontFamily.value = 'Oswald';
            }
        }
        
        // Copy font size options
        if (sourceFontSize && dateFontSize && coordsFontSize) {
            // Clear existing options
            dateFontSize.innerHTML = '';
            coordsFontSize.innerHTML = '';
            
            // Copy options from source
            Array.from(sourceFontSize.options).forEach(option => {
                // Date font size
                const dateOption = document.createElement('option');
                dateOption.value = option.value;
                dateOption.textContent = option.textContent;
                dateFontSize.appendChild(dateOption);
                
                // Coords font size
                const coordsOption = document.createElement('option');
                coordsOption.value = option.value;
                coordsOption.textContent = option.textContent;
                coordsFontSize.appendChild(coordsOption);
            });
            
            // Set default value to 72px
            dateFontSize.value = '72px';
            coordsFontSize.value = '72px';
        } else {
            // If source not found, add default options
            const defaultSizes = ['72px', '60px', '48px', '36px', '24px', '18px', '16px', '14px', '12px'];
            
            if (dateFontSize) {
                dateFontSize.innerHTML = '';
                defaultSizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    dateFontSize.appendChild(option);
                });
                dateFontSize.value = '72px';
            }
            
            if (coordsFontSize) {
                coordsFontSize.innerHTML = '';
                defaultSizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    coordsFontSize.appendChild(option);
                });
                coordsFontSize.value = '72px';
            }
        }
        
        console.log("Successfully copied font options");
    } catch (error) {
        console.error("Error copying font options:", error);
    }
}

/**
 * Initialize the color pickers
 */
function initializeColorPickers() {
    console.log("Initializing color pickers");
    
    try {
        // Find the color inputs and swatches
        const dateColorInput = document.getElementById('fixed-font-color-date');
        const coordsColorInput = document.getElementById('fixed-font-color-coords');
        const dateColorSwatch = document.querySelector('[data-target="fixed-font-color-date"]');
        const coordsColorSwatch = document.querySelector('[data-target="fixed-font-color-coords"]');
        
        // Set initial colors
        if (dateColorInput) dateColorInput.value = '#FFCC00';
        if (coordsColorInput) coordsColorInput.value = '#FFCC00';
        if (dateColorSwatch) dateColorSwatch.style.backgroundColor = '#FFCC00';
        if (coordsColorSwatch) coordsColorSwatch.style.backgroundColor = '#FFCC00';
        
        // Add click event listeners to the color swatches
        if (dateColorSwatch) {
            dateColorSwatch.addEventListener('click', function() {
                if (typeof $ !== 'undefined' && typeof $.fn.colorpicker !== 'undefined') {
                    $(dateColorInput).colorpicker('show');
                } else {
                    console.error("jQuery or colorpicker not available");
                    
                    // Fallback: Create a simple color picker
                    createSimpleColorPicker(dateColorInput, dateColorSwatch);
                }
            });
        }
        
        if (coordsColorSwatch) {
            coordsColorSwatch.addEventListener('click', function() {
                if (typeof $ !== 'undefined' && typeof $.fn.colorpicker !== 'undefined') {
                    $(coordsColorInput).colorpicker('show');
                } else {
                    console.error("jQuery or colorpicker not available");
                    
                    // Fallback: Create a simple color picker
                    createSimpleColorPicker(coordsColorInput, coordsColorSwatch);
                }
            });
        }
        
        // Initialize colorpicker if jQuery and colorpicker are available
        if (typeof $ !== 'undefined' && typeof $.fn.colorpicker !== 'undefined') {
            if (dateColorInput) {
                $(dateColorInput).colorpicker({
                    color: '#FFCC00',
                    format: 'hex'
                }).on('changeColor', function(e) {
                    if (dateColorSwatch) {
                        dateColorSwatch.style.backgroundColor = e.color.toString('hex');
                    }
                });
            }
            
            if (coordsColorInput) {
                $(coordsColorInput).colorpicker({
                    color: '#FFCC00',
                    format: 'hex'
                }).on('changeColor', function(e) {
                    if (coordsColorSwatch) {
                        coordsColorSwatch.style.backgroundColor = e.color.toString('hex');
                    }
                });
            }
        }
        
        console.log("Successfully initialized color pickers");
    } catch (error) {
        console.error("Error initializing color pickers:", error);
    }
}

/**
 * Create a simple color picker as a fallback
 */
function createSimpleColorPicker(colorInput, colorSwatch) {
    // Common colors
    const colors = [
        '#FFCC00', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
        '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF'
    ];
    
    // Create a color picker container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.zIndex = '1000';
    container.style.backgroundColor = '#fff';
    container.style.border = '1px solid #ccc';
    container.style.padding = '5px';
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.width = '150px';
    
    // Position the container near the color swatch
    const rect = colorSwatch.getBoundingClientRect();
    container.style.top = (rect.bottom + window.scrollY) + 'px';
    container.style.left = (rect.left + window.scrollX) + 'px';
    
    // Add color swatches
    colors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.style.width = '20px';
        swatch.style.height = '20px';
        swatch.style.backgroundColor = color;
        swatch.style.margin = '2px';
        swatch.style.cursor = 'pointer';
        swatch.style.border = '1px solid #ccc';
        
        swatch.addEventListener('click', function() {
            colorInput.value = color;
            colorSwatch.style.backgroundColor = color;
            document.body.removeChild(container);
        });
        
        container.appendChild(swatch);
    });
    
    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '
