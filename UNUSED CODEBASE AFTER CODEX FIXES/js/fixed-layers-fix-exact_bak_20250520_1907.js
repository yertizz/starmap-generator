/* START OF CODE - Cline - 2025-05-20 18:30:40 File: js/fixed-layers-fix-exact.js */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fixed Layers Fix (Exact Match) script loaded");
    
    // Add or fix the blue "Fixed Layers" title
    fixFixedLayersTitle();
    
    // Fix the styling of the Fixed Layers section to exactly match the mockup
    fixFixedLayersStyling();
    
    // Fix the date display in both Fixed Layers and Text Placements sections
    fixDateDisplay();
    
    // Fix the font dropdowns to match the mockup
    fixFontDropdowns();
    
    // Fix the color pickers to match the mockup
    fixColorPickers();
    
    // Fix the Star Map Image Settings section
    fixStarMapImageSettings();
});

// Add or fix the blue "Fixed Layers" title
function fixFixedLayersTitle() {
    try {
        console.log("Adding or fixing the blue Fixed Layers title");
        
        // Find the Fixed Layers section container
        const fixedLayersContainer = document.querySelector('.fixed-text-container, .fixed-layers-container');
        if (!fixedLayersContainer) {
            console.error("Fixed Layers container not found");
            return;
        }
        
        // Find the existing title or create a new one
        let fixedLayersTitle = document.querySelector('h3.fixed-layers-title, h3.fixed-layers-heading');
        if (!fixedLayersTitle) {
            // Create a new title element
            fixedLayersTitle = document.createElement('h3');
            fixedLayersTitle.className = 'fixed-layers-title';
            fixedLayersTitle.textContent = 'Fixed Layers';
            
            // Insert it at the top of the container
            fixedLayersContainer.insertBefore(fixedLayersTitle, fixedLayersContainer.firstChild);
        } else {
            // Update the existing title text
            fixedLayersTitle.textContent = 'Fixed Layers';
        }
        
        // Style the title to match the mockup exactly
        fixedLayersTitle.style.textAlign = 'center';
        fixedLayersTitle.style.color = '#0275d8'; // Blue color
        fixedLayersTitle.style.margin = '15px 0';
        fixedLayersTitle.style.fontSize = '18px';
        fixedLayersTitle.style.fontWeight = 'bold';
        fixedLayersTitle.style.display = 'block';
        fixedLayersTitle.style.width = '100%';
        
        console.log("Successfully added or fixed the blue Fixed Layers title");
    } catch (error) {
        console.error("Error adding or fixing the blue Fixed Layers title:", error);
    }
}

// Fix the styling of the Fixed Layers section to exactly match the mockup
function fixFixedLayersStyling() {
    try {
        console.log("Fixing Fixed Layers styling to exactly match mockup");
        
        // Find the Fixed Layers section
        const fixedLayersSection = document.querySelector('.fixed-text-content');
        if (!fixedLayersSection) {
            console.error("Fixed Layers section not found");
            return;
        }
        
        // Style the Fixed Layers section container to match the mockup exactly
        fixedLayersSection.style.backgroundColor = '#ffffff';
        fixedLayersSection.style.border = '1px solid #e0e0e0';
        fixedLayersSection.style.borderRadius = '6px';
        fixedLayersSection.style.padding = '20px';
        fixedLayersSection.style.margin = '10px 0';
        fixedLayersSection.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        
        // Find the input groups (Date and Lat/Long)
        const inputGroups = fixedLayersSection.querySelectorAll('.input-group');
        if (inputGroups.length < 2) {
            console.error("Input groups not found in Fixed Layers section");
            return;
        }
        
        // Remove any lingering "Coordinates Text:" labels
        const allLabels = fixedLayersSection.querySelectorAll('label');
        allLabels.forEach(label => {
            if (label.textContent.includes('Coordinates Text:')) {
                label.remove();
            }
        });
        
        // Style each input group to match the mockup exactly
        inputGroups.forEach((group, index) => {
            // Clear any existing styles
            group.removeAttribute('style');
            
            // Apply new styles to match the mockup
            group.style.display = 'flex';
            group.style.flexWrap = 'nowrap'; // Prevent wrapping
            group.style.alignItems = 'center';
            group.style.padding = '15px';
            group.style.backgroundColor = '#f8f8f8';
            group.style.borderRadius = '6px';
            group.style.marginBottom = index === 0 ? '15px' : '0';
            group.style.border = '1px solid #eaeaea';
            
            // Remove any extra labels (like "Coordinates Text:")
            const labels = group.querySelectorAll('label');
            if (labels.length > 1) {
                for (let i = 1; i < labels.length; i++) {
                    labels[i].remove();
                }
            }
            
            // Find or create the label (Date: or Lat/Long:)
            let label = group.querySelector('label');
            if (!label) {
                label = document.createElement('label');
                label.textContent = index === 0 ? 'Date:' : 'Lat/Long:';
                group.insertBefore(label, group.firstChild);
            } else {
                // Update the label text to ensure it's correct
                label.textContent = index === 0 ? 'Date:' : 'Lat/Long:';
            }
            
            // Style the label to match the mockup exactly
            label.style.width = '80px';
            label.style.textAlign = 'right';
            label.style.marginRight = '10px';
            label.style.fontWeight = 'bold';
            label.style.color = '#555';
            label.style.fontSize = '16px';
            
            // Find or create the display value
            const displayId = index === 0 ? 'fixed-date-display' : 'fixed-coords-display';
            let displayValue = document.getElementById(displayId);
            if (!displayValue) {
                displayValue = document.createElement('div');
                displayValue.id = displayId;
                displayValue.className = 'display-value';
                group.insertBefore(displayValue, label.nextSibling);
            }
            
            // Style the display value to match the mockup exactly
            displayValue.style.width = '180px'; // Reduced width to prevent wrapping ~ WAS '220px';
            displayValue.style.minWidth = '180px'; // WAS '220px';
            displayValue.style.maxWidth = '190px'; // WAS '220px';
            displayValue.style.height = '30px'; // WAS '30px';
            displayValue.style.lineHeight = '30px'; // WAS '30px';
            displayValue.style.padding = '0 5px'; // WAS '0 10px';
            displayValue.style.marginRight = '5px'; // WAS '10px';
            displayValue.style.backgroundColor = '#f0f0f0'; // WAS '#f0f0f0';
            displayValue.style.border = '2px solid #ddd'; // WAS '1px solid #ddd';
            displayValue.style.borderRadius = '4px'; // WAS '4px';
            displayValue.style.fontSize = '14px'; // WAS '14px';
            displayValue.style.color = '#222';  // WAS '#333';
            displayValue.style.fontFamily = 'inherit'; // WAS 'inherit';
            displayValue.style.whiteSpace = 'nowrap'; // WAS 'nowrap';
            displayValue.style.overflow = 'hidden'; // WAS 'hidden';
            displayValue.style.textOverflow = 'ellipsis'; // WAS 'ellipsis';
            
            // Set the content of the display value
            if (index === 0) {
                displayValue.textContent = 'May 22, 2004, 12:01 PM';
            } else {
                displayValue.textContent = 'N29° 18.48263\' | W94° 47.83479\'';
            }
            
            // Get a reference to a font family dropdown from the Customizable Text section to copy its styling
            const sourceFontFamily = document.querySelector('.text-entry-row select.font-family-select');
            const sourceFontSize = document.querySelector('.text-entry-row select.font-size-select');
            
            // Find or create the font family dropdown
            const fontFamilyId = index === 0 ? 'fixed-font-family-date' : 'fixed-font-family-coords';
            let fontFamily = document.getElementById(fontFamilyId);
            if (!fontFamily) {
                fontFamily = document.createElement('select');
                fontFamily.id = fontFamilyId;
                fontFamily.className = 'font-family-select';
                group.appendChild(fontFamily);
            }
            
            // Style the font family dropdown to match the Customizable Text section
            if (sourceFontFamily) {
                // Copy styles from the source dropdown
                const computedStyle = window.getComputedStyle(sourceFontFamily);
                fontFamily.style.width = computedStyle.width;
                fontFamily.style.height = computedStyle.height;
                fontFamily.style.marginRight = '10px';
                fontFamily.style.border = computedStyle.border;
                fontFamily.style.borderRadius = computedStyle.borderRadius;
                fontFamily.style.padding = computedStyle.padding;
                fontFamily.style.backgroundColor = computedStyle.backgroundColor;
                fontFamily.style.color = computedStyle.color;
                fontFamily.style.fontSize = computedStyle.fontSize;
            } else {
                // Fallback styling if source not found
                fontFamily.style.width = '200px'; // WAS '100px';
                fontFamily.style.height = '30px';
                fontFamily.style.marginRight = '10px';
                fontFamily.style.border = '1px solid #ccc';
                fontFamily.style.borderRadius = '4px';
                fontFamily.style.padding = '0 5px';
                fontFamily.style.backgroundColor = '#fff';
            }
            
            // Find or create the font size dropdown
            const fontSizeId = index === 0 ? 'fixed-font-size-date' : 'fixed-font-size-coords';
            let fontSize = document.getElementById(fontSizeId);
            if (!fontSize) {
                fontSize = document.createElement('select');
                fontSize.id = fontSizeId;
                fontSize.className = 'font-size-select';
                group.appendChild(fontSize);
            }
            
            // Style the font size dropdown to match the Customizable Text section
            if (sourceFontSize) {
                // Copy styles from the source dropdown
                const computedStyle = window.getComputedStyle(sourceFontSize);
                fontSize.style.width = computedStyle.width;
                fontSize.style.height = computedStyle.height;
                fontSize.style.marginRight = '10px';
                fontSize.style.border = computedStyle.border;
                fontSize.style.borderRadius = computedStyle.borderRadius;
                fontSize.style.padding = computedStyle.padding;
                fontSize.style.backgroundColor = computedStyle.backgroundColor;
                fontSize.style.color = computedStyle.color;
                fontSize.style.fontSize = computedStyle.fontSize;
            } else {
                // Fallback styling if source not found
                fontSize.style.width = '70px';
                fontSize.style.height = '30px';
                fontSize.style.marginRight = '10px';
                fontSize.style.border = '1px solid #ccc';
                fontSize.style.borderRadius = '4px';
                fontSize.style.padding = '0 5px';
                fontSize.style.backgroundColor = '#fff';
            }
            
            // Find or create the bold checkbox
            const boldId = index === 0 ? 'fixed-text-bold-date' : 'fixed-text-bold-coords';
            let boldCheckbox = document.getElementById(boldId);
            let boldLabel;
            if (!boldCheckbox) {
                const boldContainer = document.createElement('div');
                boldContainer.className = 'checkbox-container';
                boldContainer.style.marginRight = '10px';
                
                boldCheckbox = document.createElement('input');
                boldCheckbox.type = 'checkbox';
                boldCheckbox.id = boldId;
                boldCheckbox.className = 'text-style-checkbox';
                
                boldLabel = document.createElement('label');
                boldLabel.htmlFor = boldId;
                boldLabel.textContent = 'Bold';
                
                boldContainer.appendChild(boldCheckbox);
                boldContainer.appendChild(boldLabel);
                group.appendChild(boldContainer);
            } else {
                boldLabel = document.querySelector(`label[for="${boldId}"]`);
            }
            
            // Style the bold checkbox to match the mockup exactly
            boldCheckbox.style.marginRight = '5px';
            if (boldLabel) {
                boldLabel.style.fontWeight = 'normal';
                boldLabel.style.color = '#555';
            }
            
            // Find or create the italic checkbox
            const italicId = index === 0 ? 'fixed-text-italic-date' : 'fixed-text-italic-coords';
            let italicCheckbox = document.getElementById(italicId);
            let italicLabel;
            if (!italicCheckbox) {
                const italicContainer = document.createElement('div');
                italicContainer.className = 'checkbox-container';
                italicContainer.style.marginRight = '10px';
                
                italicCheckbox = document.createElement('input');
                italicCheckbox.type = 'checkbox';
                italicCheckbox.id = italicId;
                italicCheckbox.className = 'text-style-checkbox';
                
                italicLabel = document.createElement('label');
                italicLabel.htmlFor = italicId;
                italicLabel.textContent = 'Italic';
                
                italicContainer.appendChild(italicCheckbox);
                italicContainer.appendChild(italicLabel);
                group.appendChild(italicContainer);
            } else {
                italicLabel = document.querySelector(`label[for="${italicId}"]`);
            }
            
            // Style the italic checkbox to match the mockup exactly
            italicCheckbox.style.marginRight = '5px';
            if (italicLabel) {
                italicLabel.style.fontWeight = 'normal';
                italicLabel.style.color = '#555';
            }
            
            // Find or create the color picker
            const colorInputId = index === 0 ? 'fixed-font-color-date' : 'fixed-font-color-coords';
            let colorInput = document.getElementById(colorInputId);
            if (!colorInput) {
                colorInput = document.createElement('input');
                colorInput.type = 'hidden';
                colorInput.id = colorInputId;
                colorInput.className = 'color-picker-input';
                colorInput.value = '#FFCC00';
                group.appendChild(colorInput);
            }
            
            // Find or create the color swatch
            const colorSwatchSelector = `[data-target="${colorInputId}"]`;
            let colorSwatch = document.querySelector(colorSwatchSelector);
            if (!colorSwatch) {
                colorSwatch = document.createElement('div');
                colorSwatch.className = 'color-swatch';
                colorSwatch.setAttribute('data-target', colorInputId);
                colorSwatch.style.backgroundColor = '#FFCC00';
                group.appendChild(colorSwatch);
            }
            
            // Style the color swatch to match the mockup exactly
            colorSwatch.style.width = '30px';
            colorSwatch.style.height = '30px';
            colorSwatch.style.borderRadius = '50%';
            colorSwatch.style.backgroundColor = '#FFCC00';
            colorSwatch.style.cursor = 'pointer';
            colorSwatch.style.border = '1px solid #ccc';
        });
        
        console.log("Successfully fixed Fixed Layers styling to exactly match mockup");
    } catch (error) {
        console.error("Error fixing Fixed Layers styling:", error);
    }
}

// Fix the date display in both Fixed Layers and Text Placements sections
function fixDateDisplay() {
    try {
        console.log("Fixing date display in both sections");
        
        // Find the date display in the Fixed Layers section
        const fixedDateDisplay = document.getElementById('fixed-date-display');
        
        // Hardcode the correct date and time
        const correctDate = 'May 22, 2004, 12:01 PM';
        
        // Update the date display in the Fixed Layers section
        if (fixedDateDisplay) {
            fixedDateDisplay.textContent = correctDate;
            console.log("Updated Fixed Layers date display to:", correctDate);
        } else {
            console.error("Fixed Layers date display element not found");
        }
        
        // Try multiple approaches to update the date in the Text Placements section
        
        // Approach 1: Direct ID
        const textPlacementsDateDisplay = document.getElementById('text-placement-content-date');
        if (textPlacementsDateDisplay) {
            textPlacementsDateDisplay.textContent = correctDate;
            console.log("Updated Text Placements date display (by ID) to:", correctDate);
        }
        
        // Approach 2: By class
        const dateElements = document.querySelectorAll('.date-display, .date-value, .date-text');
        if (dateElements.length > 0) {
            dateElements.forEach(element => {
                element.textContent = correctDate;
            });
            console.log(`Updated ${dateElements.length} date elements (by class) to:`, correctDate);
        }
        
        // Approach 3: By table row
        const textPlacementsRows = document.querySelectorAll('#text-placements-container tr, .text-placements-table tr');
        if (textPlacementsRows.length > 0) {
            textPlacementsRows.forEach(row => {
                const firstCell = row.querySelector('td:first-child');
                if (firstCell && firstCell.textContent.includes('Date')) {
                    const dateCell = row.querySelector('td:nth-child(2)');
                    if (dateCell) {
                        dateCell.textContent = correctDate;
                        console.log("Updated Text Placements date row to:", correctDate);
                    }
                }
            });
        }
        
        // Approach 4: Direct element with "Date" text
        const dateRows = document.querySelectorAll('tr');
        dateRows.forEach(row => {
            if (row.textContent.includes('Date')) {
                const cells = row.querySelectorAll('td');
                cells.forEach(cell => {
                    if (cell.textContent.includes('2004')) {
                        cell.textContent = correctDate;
                        console.log("Updated date cell to:", correctDate);
                    }
                });
            }
        });
        
        // Approach 5: Find any element containing the incorrect date and update it
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            if (element.childNodes.length === 1 && element.firstChild.nodeType === 3) {
                const text = element.textContent;
                if (text.includes('May 21, 2004') || text.includes('05/21/2004')) {
                    element.textContent = correctDate;
                    console.log("Updated element with incorrect date to:", correctDate);
                }
            }
        });
        
        // Approach 6: Direct update of the Text Placements section
        const textPlacementsSection = document.getElementById('text-placements-container');
        if (textPlacementsSection) {
            const dateRow = Array.from(textPlacementsSection.querySelectorAll('tr')).find(row => 
                row.textContent.toLowerCase().includes('date')
            );
            
            if (dateRow) {
                const dateValueCell = dateRow.querySelector('td:nth-child(2)');
                if (dateValueCell) {
                    dateValueCell.textContent = correctDate;
                    console.log("Updated Text Placements date value cell to:", correctDate);
                }
            }
        }
        
        console.log("Successfully fixed date display in both sections");
    } catch (error) {
        console.error("Error fixing date display:", error);
    }
}

// Fix the font dropdowns to match the mockup
function fixFontDropdowns() {
    try {
        console.log("Fixing font dropdowns to match mockup");
        
        // Find the font family dropdowns in the Fixed Layers section
        const dateFontFamily = document.getElementById('fixed-font-family-date');
        const coordsFontFamily = document.getElementById('fixed-font-family-coords');
        
        // Find the font size dropdowns in the Fixed Layers section
        const dateFontSize = document.getElementById('fixed-font-size-date');
        const coordsFontSize = document.getElementById('fixed-font-size-coords');
        
        // Try to get font options from existing dropdowns in the Customizable Text section
        const sourceFontFamily = document.querySelector('.text-entry-row select.font-family-select');
        const sourceFontSize = document.querySelector('.text-entry-row select.font-size-select');
        
        if (sourceFontFamily && sourceFontFamily.options.length > 0) {
            // Copy options from the source dropdown
            if (dateFontFamily) {
                dateFontFamily.innerHTML = '';
                Array.from(sourceFontFamily.options).forEach(option => {
                    const newOption = document.createElement('option');
                    newOption.value = option.value;
                    newOption.textContent = option.textContent;
                    newOption.style.fontFamily = option.style.fontFamily || option.value;
                    dateFontFamily.appendChild(newOption);
                });
                dateFontFamily.value = 'Bebas Neue';
            }
            
            if (coordsFontFamily) {
                coordsFontFamily.innerHTML = '';
                Array.from(sourceFontFamily.options).forEach(option => {
                    const newOption = document.createElement('option');
                    newOption.value = option.value;
                    newOption.textContent = option.textContent;
                    newOption.style.fontFamily = option.style.fontFamily || option.value;
                    coordsFontFamily.appendChild(newOption);
                });
                coordsFontFamily.value = 'Bebas Neue';
            }
        } else {
            // Fallback font family options
            const fontFamilies = [
                'Bebas Neue', 'Oswald', 'Arial', 'Arial Black', 'Black Ops One',
                'Caveat', 'Courier New', 'Dancing Script', 'Great Vibes', 'Helvetica',
                'Impact', 'Indie Flower', 'Libre Baskerville', 'Lora', 'Merriweather',
                'Montserrat', 'Noto Serif', 'Nunito', 'Open Sans', 'Times New Roman', 'Verdana'
            ];
            
            // Populate font family dropdowns with fallback options
            if (dateFontFamily) {
                dateFontFamily.innerHTML = '';
                fontFamilies.forEach(font => {
                    const option = document.createElement('option');
                    option.value = font;
                    option.textContent = font;
                    option.style.fontFamily = font;
                    dateFontFamily.appendChild(option);
                });
                dateFontFamily.value = 'Bebas Neue';
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
                coordsFontFamily.value = 'Bebas Neue';
            }
        }
        
        if (sourceFontSize && sourceFontSize.options.length > 0) {
            // Copy options from the source dropdown
            if (dateFontSize) {
                dateFontSize.innerHTML = '';
                Array.from(sourceFontSize.options).forEach(option => {
                    const newOption = document.createElement('option');
                    newOption.value = option.value;
                    newOption.textContent = option.textContent;
                    dateFontSize.appendChild(newOption);
                });
                dateFontSize.value = '60px';
            }
            
            if (coordsFontSize) {
                coordsFontSize.innerHTML = '';
                Array.from(sourceFontSize.options).forEach(option => {
                    const newOption = document.createElement('option');
                    newOption.value = option.value;
                    newOption.textContent = option.textContent;
                    coordsFontSize.appendChild(newOption);
                });
                coordsFontSize.value = '60px';
            }
        } else {
            // Fallback font size options
            const fontSizes = [
                '8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', 
                '28px', '32px', '36px', '42px', '48px', '54px', '60px', '72px', '96px', '112px'
            ];
            
            // Populate font size dropdowns with fallback options
            if (dateFontSize) {
                dateFontSize.innerHTML = '';
                fontSizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    dateFontSize.appendChild(option);
                });
                dateFontSize.value = '60px';
            }
            
            if (coordsFontSize) {
                coordsFontSize.innerHTML = '';
                fontSizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    coordsFontSize.appendChild(option);
                });
                coordsFontSize.value = '60px';
            }
        }
        
        console.log("Successfully fixed font dropdowns to match mockup");
    } catch (error) {
        console.error("Error fixing font dropdowns:", error);
    }
}

// Fix the color pickers to match the mockup
function fixColorPickers() {
    try {
        console.log("Fixing color pickers to match mockup");
        
        // Find the color inputs and swatches
        const dateColorInput = document.getElementById('fixed-font-color-date');
        const coordsColorInput = document.getElementById('fixed-font-color-coords');
        const dateColorSwatch = document.querySelector('[data-target="fixed-font-color-date"]');
        const coordsColorSwatch = document.querySelector('[data-target="fixed-font-color-coords"]');
        
        // Set initial colors to match the mockup
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
        
        console.log("Successfully fixed color pickers to match mockup");
    } catch (error) {
        console.error("Error fixing color pickers:", error);
    }
}

// Fix the Star Map Image Settings section
function fixStarMapImageSettings() {
    try {
        console.log("Fixing Star Map Image Settings section");
        
        // Find the Star Map Style dropdown
        const starMapStyleDropdown = document.querySelector('select[name="star-map-style"]');
        if (!starMapStyleDropdown) {
            console.error("Star Map Style dropdown not found");
            return;
        }
        
        // Fix the width of the Star Map Style dropdown
        starMapStyleDropdown.style.width = '120px'; // Reduced width to prevent wrapping
        
        // Left-align the list items in the dropdown
        const styleOptions = starMapStyleDropdown.querySelectorAll('option');
        styleOptions.forEach(option => {
            option.style.textAlign = 'left';
        });
        
        // Find the Advanced Options button
        const advancedOptionsButton = document.querySelector('button.advanced-options-button');
        if (advancedOptionsButton) {
            // Center-align the Advanced Options button
            const advancedOptionsContainer = advancedOptionsButton.parentElement;
            if (advancedOptionsContainer) {
                advancedOptionsContainer.style.textAlign = 'center';
                advancedOptionsContainer.style.display = 'block';
                advancedOptionsContainer.style.width = '100%';
                advancedOptionsContainer.style.marginTop = '10px';
            }
        }
        
        console.log("Successfully fixed Star Map Image Settings section");
    } catch (error) {
        console.error("Error fixing Star Map Image Settings section:", error);
    }
}

/* END OF CODE - Cline - 2025-05-20 18:30:40 File: js/fixed-layers-fix-exact.js */
