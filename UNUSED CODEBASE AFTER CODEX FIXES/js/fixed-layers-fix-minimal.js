/* START OF CODE - Cline - 2025-05-20 11:56:40 File: js/fixed-layers-fix-minimal.js */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fixed Layers Fix (Minimal) script loaded");
    
    // Fix the styling of the Fixed Layers section
    fixFixedLayersStyling();
    
    // Fix the date display
    fixDateDisplay();
    
    // Fix the font dropdowns
    fixFontDropdowns();
    
    // Fix the color pickers
    fixColorPickers();
});

// Fix the styling of the Fixed Layers section to match the mockup exactly
function fixFixedLayersStyling() {
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
        
        // Style the Lat/Long input group
        const coordsInputGroup = inputGroups[1];
        coordsInputGroup.style.display = 'flex';
        coordsInputGroup.style.alignItems = 'center';
        coordsInputGroup.style.padding = '8px';
        
        // Find or create the Date label
        let dateLabel = dateInputGroup.querySelector('label');
        if (!dateLabel) {
            dateLabel = document.createElement('label');
            dateLabel.textContent = 'Date:';
            dateInputGroup.insertBefore(dateLabel, dateInputGroup.firstChild);
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
            dateInputGroup.insertBefore(dateDisplayValue, dateLabel.nextSibling);
        }
        
        // Style the Date display value to match the mockup exactly
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
        
        // Find or create the Lat/Long label
        let coordsLabel = coordsInputGroup.querySelector('label');
        if (!coordsLabel) {
            coordsLabel = document.createElement('label');
            coordsLabel.textContent = 'Lat/Long:';
            coordsInputGroup.insertBefore(coordsLabel, coordsInputGroup.firstChild);
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
            coordsInputGroup.insertBefore(coordsDisplayValue, coordsLabel.nextSibling);
        }
        
        // Style the Lat/Long display value to match the mockup exactly
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
        
        console.log("Fixed Fixed Layers styling");
    } catch (error) {
        console.error("Error fixing Fixed Layers styling:", error);
    }
}

// Fix the date display to show "May 22, 2004, 12:01 PM"
function fixDateDisplay() {
    try {
        // Find the date display in the Fixed Layers section
        const dateDisplayValue = document.getElementById('fixed-date-display');
        
        // Find the date display in the Text Placements section
        const textPlacementsDateDisplay = document.getElementById('text-placement-content-date');
        
        // Hardcode the correct date and time
        const displayValue = 'May 22, 2004, 12:01 PM';
        
        // Update the date display in the Fixed Layers section
        if (dateDisplayValue) {
            dateDisplayValue.textContent = displayValue;
        }
        
        // Update the date display in the Text Placements section
        if (textPlacementsDateDisplay) {
            textPlacementsDateDisplay.textContent = displayValue;
        }
        
        console.log("Updated date display to:", displayValue);
    } catch (error) {
        console.error("Error fixing date display:", error);
    }
}

// Fix the font dropdowns
function fixFontDropdowns() {
    try {
        // Find the font family dropdowns in the Fixed Layers section
        const dateFontFamily = document.getElementById('fixed-font-family-date');
        const coordsFontFamily = document.getElementById('fixed-font-family-coords');
        
        // Find the font size dropdowns in the Fixed Layers section
        const dateFontSize = document.getElementById('fixed-font-size-date');
        const coordsFontSize = document.getElementById('fixed-font-size-coords');
        
        // Font family options
        const fontFamilies = [
            'Oswald', 'Arial', 'Arial Black', 'Bebas Neue', 'Black Ops One',
            'Caveat', 'Courier New', 'Dancing Script', 'Great Vibes', 'Helvetica',
            'Impact', 'Indie Flower', 'Libre Baskerville', 'Lora', 'Merriweather',
            'Montserrat', 'Noto Serif', 'Nunito', 'Open Sans', 'Times New Roman', 'Verdana'
        ];
        
        // Font size options
        const fontSizes = [
            '8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', 
            '28px', '32px', '36px', '42px', '48px', '54px', '60px', '72px', '96px', '112px'
        ];
        
        // Populate font family dropdowns
        if (dateFontFamily) {
            dateFontFamily.innerHTML = '';
            fontFamilies.forEach(font => {
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
            fontFamilies.forEach(font => {
                const option = document.createElement('option');
                option.value = font;
                option.textContent = font;
                option.style.fontFamily = font;
                coordsFontFamily.appendChild(option);
            });
            coordsFontFamily.value = 'Oswald';
        }
        
        // Populate font size dropdowns
        if (dateFontSize) {
            dateFontSize.innerHTML = '';
            fontSizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                dateFontSize.appendChild(option);
            });
            dateFontSize.value = '72px';
        }
        
        if (coordsFontSize) {
            coordsFontSize.innerHTML = '';
            fontSizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                coordsFontSize.appendChild(option);
            });
            coordsFontSize.value = '72px';
        }
        
        console.log("Fixed font dropdowns");
    } catch (error) {
        console.error("Error fixing font dropdowns:", error);
    }
}

// Fix the color pickers
function fixColorPickers() {
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
        
        // Initialize colorpicker if jQuery and colorpicker are available
        if (typeof $ !== 'undefined' && typeof $.fn.colorpicker !== 'undefined') {
            if (dateColorInput && dateColorSwatch) {
                $(dateColorInput).colorpicker({
                    color: '#FFCC00',
                    format: 'hex'
                }).on('changeColor', function(e) {
                    dateColorSwatch.style.backgroundColor = e.color.toString('hex');
                });
                
                // Add click event listener to the color swatch
                dateColorSwatch.addEventListener('click', function() {
                    $(dateColorInput).colorpicker('show');
                });
            }
            
            if (coordsColorInput && coordsColorSwatch) {
                $(coordsColorInput).colorpicker({
                    color: '#FFCC00',
                    format: 'hex'
                }).on('changeColor', function(e) {
                    coordsColorSwatch.style.backgroundColor = e.color.toString('hex');
                });
                
                // Add click event listener to the color swatch
                coordsColorSwatch.addEventListener('click', function() {
                    $(coordsColorInput).colorpicker('show');
                });
            }
        }
        
        console.log("Fixed color pickers");
    } catch (error) {
        console.error("Error fixing color pickers:", error);
    }
}

/* END OF CODE - Cline - 2025-05-20 11:56:40 File: js/fixed-layers-fix-minimal.js */
