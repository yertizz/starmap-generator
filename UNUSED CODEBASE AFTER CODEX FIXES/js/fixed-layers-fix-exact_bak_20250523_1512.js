/* START OF CODE - Cline - 2025-05-23 07:29:35 File: js/fixed-layers-fix-exact.js */

// Simple script to fix the Fixed Layers section
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fixed Layers Fix script loaded");
    
    // Wait a moment for everything to be ready
    setTimeout(function() {
        try {
            // 1. Fix the "Fixed Layers" title styling
            const fixedTextContent = document.querySelector('.fixed-text-content');
            if (fixedTextContent) {
                // Create the title element
                const title = document.createElement('h3');
                title.textContent = 'Fixed Layers';
                title.style.fontFamily = 'inherit';
                title.style.fontSize = '18px';
                title.style.fontWeight = 'bold';
                title.style.color = '#0275d8'; // Blue color
                title.style.textAlign = 'center';
                title.style.margin = '0 0 15px 0';
                title.style.padding = '0';
                title.style.borderBottom = '1px solid #eee';
                title.style.display = 'block';
                title.style.width = '100%';
                
                // Insert the title at the beginning of the fixed-text-content section
                fixedTextContent.insertBefore(title, fixedTextContent.firstChild);
                console.log("Added Fixed Layers title");
            }
            
            // 2. Fix the "Lat/long:Coordinates Text:" label
            const labels = document.querySelectorAll('.fixed-text-content label');
            labels.forEach(label => {
                if (label.textContent.includes('Coordinates Text')) {
                    label.textContent = 'Lat/Long:';
                    console.log("Fixed Lat/Long label");
                }
            });
            
            // 3. Add date and coordinates value blocks
            const dateInputGroup = document.querySelector('.fixed-text-content .input-group:first-child');
            const coordsInputGroup = document.querySelector('.fixed-text-content .input-group:nth-child(2)');
            
            if (dateInputGroup && coordsInputGroup) {
                const dateFontFamily = dateInputGroup.querySelector('.font-family-select');
                const coordsFontFamily = coordsInputGroup.querySelector('.font-family-select');
                
                if (dateFontFamily && coordsFontFamily) {
                    // Create date value block
                    const dateValueBlock = document.createElement('div');
                    dateValueBlock.textContent = 'May 22, 2004, 12:01 PM';
                    dateValueBlock.style.width = '320px';
                    dateValueBlock.style.height = '30px';
                    dateValueBlock.style.lineHeight = '30px';
                    dateValueBlock.style.padding = '0 10px';
                    dateValueBlock.style.marginRight = '10px';
                    dateValueBlock.style.backgroundColor = '#f0f0f0';
                    dateValueBlock.style.border = '1px solid #ddd';
                    dateValueBlock.style.borderRadius = '4px';
                    
                    // Create coordinates value block
                    const coordsValueBlock = document.createElement('div');
                    coordsValueBlock.textContent = "N39° 49.99800' | W98° 35.13000'";
                    coordsValueBlock.style.width = '320px';
                    coordsValueBlock.style.height = '30px';
                    coordsValueBlock.style.lineHeight = '30px';
                    coordsValueBlock.style.padding = '0 10px';
                    coordsValueBlock.style.marginRight = '10px';
                    coordsValueBlock.style.backgroundColor = '#f0f0f0';
                    coordsValueBlock.style.border = '1px solid #ddd';
                    coordsValueBlock.style.borderRadius = '4px';
                    
                    // Insert value blocks
                    dateInputGroup.insertBefore(dateValueBlock, dateFontFamily);
                    coordsInputGroup.insertBefore(coordsValueBlock, coordsFontFamily);
                    console.log("Added date and coordinates value blocks");
                }
            }
            
            // 4. Fix the font dropdowns
            const fontFamilyDropdowns = document.querySelectorAll('.fixed-text-content .font-family-select');
            const fontSizeDropdowns = document.querySelectorAll('.fixed-text-content .font-size-select');
            const boldCheckboxes = document.querySelectorAll('.fixed-text-content input[id^="fixed-text-bold"]');
            
            // Set font family to Bebas Neue
            fontFamilyDropdowns.forEach(dropdown => {
                dropdown.style.width = '150px';
                for (let i = 0; i < dropdown.options.length; i++) {
                    if (dropdown.options[i].value === 'Bebas Neue') {
                        dropdown.selectedIndex = i;
                        break;
                    }
                }
            });
            
            // Set font size to 72px
            fontSizeDropdowns.forEach(dropdown => {
                dropdown.style.width = '70px';
                for (let i = 0; i < dropdown.options.length; i++) {
                    if (dropdown.options[i].value === '72px' || dropdown.options[i].value === '72') {
                        dropdown.selectedIndex = i;
                        break;
                    }
                }
            });
            
            // Check the bold checkboxes
            boldCheckboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
            
            console.log("Fixed font dropdowns");
            
            // 5. Fix the color pickers
            const colorSwatches = document.querySelectorAll('.fixed-text-content .color-swatch');
            colorSwatches.forEach(swatch => {
                swatch.style.backgroundColor = '#FFCC00';
                const targetId = swatch.getAttribute('data-target');
                if (targetId) {
                    const input = document.getElementById(targetId);
                    if (input) {
                        input.value = '#FFCC00';
                    }
                }
            });
            
            console.log("Fixed color pickers");
            
            // 6. Remove the duplicate Paper Auto-Size row
            const settingsRows = document.querySelectorAll('.settings-row');
            let paperAutoSizeRows = [];
            
            settingsRows.forEach(row => {
                if (row.textContent.includes('Paper Auto-Size:')) {
                    paperAutoSizeRows.push(row);
                }
            });
            
            if (paperAutoSizeRows.length > 1) {
                paperAutoSizeRows[1].remove();
                console.log("Removed duplicate Paper Auto-Size row");
            }
            
            console.log("Fixed Layers Fix script completed successfully");
        } catch (error) {
            console.error("Error in Fixed Layers Fix script:", error);
        }
    }, 1000);
});

/* END OF CODE - Cline - 2025-05-23 07:29:35 File: js/fixed-layers-fix-exact.js */
