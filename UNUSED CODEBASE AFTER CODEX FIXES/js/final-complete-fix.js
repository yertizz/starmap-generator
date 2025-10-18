// Final Complete Fix - Addresses all remaining issues

document.addEventListener('DOMContentLoaded', function() {
    console.log("Final Complete Fix loaded");
    
    // Fix 1: Fix the styling issues
    fixStylingIssues();
    
    // Fix 2: Fix the text-entry-history.js error
    fixTextEntryHistoryError();
    
    // Fix 3: Fix the color picker to use the advanced panel with HEX first
    fixColorPicker();
    
    // Fix 4: Ensure text is rendered correctly on the star map
    fixTextRendering();
    
    // Function to fix styling issues
    function fixStylingIssues() {
        console.log("Fixing styling issues");
        
        // Fix 1: Adjust text entry fields
        const textEntryWrappers = document.querySelectorAll('.text-entry-wrapper');
        textEntryWrappers.forEach(wrapper => {
            wrapper.style.display = "flex";
            wrapper.style.flexWrap = "wrap";
            wrapper.style.alignItems = "center";
            wrapper.style.gap = "5px";
            wrapper.style.marginBottom = "10px";
            wrapper.style.padding = "5px";
            
            // Fix the text entry input width
            const textEntry = wrapper.querySelector('.text-entry');
            if (textEntry) {
                textEntry.style.width = "100%";
                textEntry.style.boxSizing = "border-box";
                textEntry.style.marginBottom = "5px";
            }
            
            // Fix the font controls layout
            const fontControls = wrapper.querySelector('.font-controls');
            if (fontControls) {
                fontControls.style.display = "flex";
                fontControls.style.flexWrap = "wrap";
                fontControls.style.alignItems = "center";
                fontControls.style.gap = "5px";
                fontControls.style.width = "100%";
            }
            
            // Fix the font family and size selects
            const selects = wrapper.querySelectorAll('select');
            selects.forEach(select => {
                select.style.marginRight = "5px";
            });
            
            // Fix the style options
            const styleOptions = wrapper.querySelector('.style-options');
            if (styleOptions) {
                styleOptions.style.display = "flex";
                styleOptions.style.alignItems = "center";
                styleOptions.style.marginLeft = "10px";
                styleOptions.style.marginRight = "10px";
            }
        });
        
        // Fix 2: Fix styling in Fixed Text Styling container
        const fixedTextStylingWrappers = document.querySelectorAll('.fixed-text-styling .text-entry-wrapper');
        fixedTextStylingWrappers.forEach(wrapper => {
            wrapper.style.display = "flex";
            wrapper.style.flexWrap = "wrap";
            wrapper.style.alignItems = "center";
            wrapper.style.gap = "5px";
            wrapper.style.marginBottom = "10px";
            wrapper.style.padding = "5px";
            
            // Fix the font family and size selects
            const selects = wrapper.querySelectorAll('select');
            selects.forEach(select => {
                select.style.marginRight = "5px";
            });
            
            // Fix the style options
            const styleOptions = wrapper.querySelector('.style-options');
            if (styleOptions) {
                styleOptions.style.display = "flex";
                styleOptions.style.alignItems = "center";
                styleOptions.style.marginLeft = "10px";
                styleOptions.style.marginRight = "10px";
            }
        });
        
        // Fix 3: Fix the button styling
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.id === 'generateBtn') {
                button.style.backgroundColor = "#4CAF50";
                button.style.color = "white";
                button.style.border = "none";
                button.style.padding = "10px 20px";
                button.style.borderRadius = "4px";
                button.style.cursor = "pointer";
                button.style.fontSize = "16px";
                button.style.fontWeight = "bold";
            } else if (button.id === 'downloadBtn') {
                button.style.backgroundColor = "#2196F3";
                button.style.color = "white";
                button.style.border = "none";
                button.style.padding = "10px 20px";
                button.style.borderRadius = "4px";
                button.style.cursor = "pointer";
                button.style.fontSize = "16px";
                button.style.fontWeight = "bold";
            } else if (button.classList.contains('settings-button')) {
                button.style.backgroundColor = "#607D8B";
                button.style.color = "white";
                button.style.border = "none";
                button.style.padding = "8px 15px";
                button.style.borderRadius = "4px";
                button.style.cursor = "pointer";
            }
        });
        
        // Fix 4: Center align the button container
        const buttonContainer = document.querySelector('.button-container');
        if (buttonContainer) {
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "center";
            buttonContainer.style.alignItems = "center";
            buttonContainer.style.gap = "10px";
            buttonContainer.style.margin = "20px auto";
        }
        
        // Fix 5: Fix the color pickers
        const colorPickers = document.querySelectorAll('input[type="color"]');
        colorPickers.forEach(picker => {
            picker.style.width = "30px";
            picker.style.height = "30px";
            picker.style.padding = "0";
            picker.style.border = "none";
            picker.style.cursor = "pointer";
        });
        
        // Fix 6: Fix the Advanced Options panel
        const advancedOptionsContainer = document.getElementById('advanced-options-container');
        if (advancedOptionsContainer) {
            advancedOptionsContainer.style.width = "60%";
            advancedOptionsContainer.style.marginLeft = "auto";
            advancedOptionsContainer.style.marginRight = "auto";
            advancedOptionsContainer.style.marginTop = "10px";
            advancedOptionsContainer.style.padding = "15px";
            advancedOptionsContainer.style.border = "1px solid #ddd";
            advancedOptionsContainer.style.borderRadius = "4px";
            advancedOptionsContainer.style.backgroundColor = "#f9f9f9";
            advancedOptionsContainer.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
        }
        
        // Fix 7: Fix the Star Map Style dropdown
        const starMapStyleSelect = document.getElementById('star-map-style');
        if (starMapStyleSelect) {
            starMapStyleSelect.style.width = "150px";
            starMapStyleSelect.style.maxWidth = "150px";
            starMapStyleSelect.style.marginRight = "10px";
        }
        
        // Fix 8: Fix the Advanced Options button
        const advancedOptionsBtn = document.getElementById('advanced-options-btn');
        if (advancedOptionsBtn) {
            advancedOptionsBtn.style.marginTop = "10px";
            advancedOptionsBtn.style.backgroundColor = "#2196F3";
            advancedOptionsBtn.style.color = "white";
            advancedOptionsBtn.style.border = "none";
            advancedOptionsBtn.style.padding = "8px 15px";
            advancedOptionsBtn.style.borderRadius = "4px";
            advancedOptionsBtn.style.cursor = "pointer";
        }
    }
    
    // Function to fix the text-entry-history.js error
    function fixTextEntryHistoryError() {
        console.log("Fixing text-entry-history.js error");
        
        // Define the updateCharCount function if it doesn't exist
        if (typeof window.updateCharCount !== 'function') {
            window.updateCharCount = function(inputId, countId, maxLength) {
                const input = document.getElementById(inputId);
                const countElement = document.getElementById(countId);
                
                if (input && countElement) {
                    const remainingChars = maxLength - input.value.length;
                    countElement.textContent = remainingChars;
                }
            };
            
            // Add event listeners to text entries
            for (let i = 1; i <= 3; i++) {
                const textEntry = document.getElementById(`text-entry-${i}`);
                if (textEntry) {
                    textEntry.addEventListener('input', function() {
                        updateCharCount(`text-entry-${i}`, `char-count-${i}`, 50);
                    });
                    
                    // Initialize the character count
                    updateCharCount(`text-entry-${i}`, `char-count-${i}`, 50);
                }
            }
        }
    }
    
    // Function to fix the color picker
    function fixColorPicker() {
        console.log("Fixing color picker");
        
        // Check if vanilla-picker is loaded
        if (typeof Picker !== 'undefined') {
            console.log("Vanilla Picker found, applying advanced panel fix");
            
            // Override the Picker prototype to use the advanced panel with HEX first
            const originalShow = Picker.prototype.show;
            
            Picker.prototype.show = function() {
                // Call the original show method
                const result = originalShow.apply(this, arguments);
                
                // Find the color mode select element
                const modeSelect = this._domEdit.querySelector('.picker_editor select');
                if (modeSelect) {
                    // Find the HEX option
                    for (let i = 0; i < modeSelect.options.length; i++) {
                        if (modeSelect.options[i].value === 'hex') {
                            // Select the HEX option
                            modeSelect.selectedIndex = i;
                            
                            // Trigger the change event
                            const event = new Event('change');
                            modeSelect.dispatchEvent(event);
                            
                            console.log("HEX mode selected as default");
                            break;
                        }
                    }
                }
                
                return result;
            };
            
            // Initialize color pickers for all color inputs
            const colorInputs = document.querySelectorAll('input[type="color"]');
            colorInputs.forEach(input => {
                // Remove any existing picker
                if (input._picker) {
                    input._picker.destroy();
                    input._picker = null;
                }
                
                // Create a new picker with advanced options
                const picker = new Picker({
                    parent: input,
                    popup: 'right',
                    color: input.value,
                    alpha: false,
                    editor: true,
                    editorFormat: 'hex',
                    onDone: function(color) {
                        input.value = color.hex;
                        
                        // Trigger change event
                        const event = new Event('change', { bubbles: true });
                        input.dispatchEvent(event);
                    }
                });
                
                // Store the picker on the input
                input._picker = picker;
                
                // Override the click event
                input.addEventListener('click', function(e) {
                    e.preventDefault();
                    picker.show();
                });
            });
            
            console.log("Color pickers initialized with advanced panel and HEX as default");
        } else {
            console.error("Vanilla Picker not found");
        }
    }
    
    // Function to fix text rendering on the star map
    function fixTextRendering() {
        console.log("Fixing text rendering");
        
        // Override the generateStarMap function to ensure text is rendered correctly
        const originalGenerateStarMap = window.generateStarMap;
        window.generateStarMap = function() {
            console.log("Overridden generateStarMap called");
            
            // Call the original function if it exists
            if (typeof originalGenerateStarMap === 'function') {
                originalGenerateStarMap();
            }
            
            // Force redraw the text
            setTimeout(function() {
                drawTextFix();
            }, 100);
        };
        
        // Force generate the star map immediately
        setTimeout(function() {
            console.log("Forcing star map generation");
            if (typeof window.generateStarMap === 'function') {
                window.generateStarMap();
            }
        }, 1000);
    }
    
    // Function to draw text on the star map
    function drawTextFix() {
        console.log("Drawing text with fix");
        
        // Get canvas and context
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) {
            console.error("Canvas not found");
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        // Get text inputs
        const text1 = document.getElementById('text-entry-1')?.value || "";
        const text2 = document.getElementById('text-entry-2')?.value || "";
        const text3 = document.getElementById('text-entry-3')?.value || "";
        
        // Draw text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        if (text1) {
            // Get font settings
            const fontFamily = document.getElementById('font-family-1')?.value || "Arial";
            const fontSize = document.getElementById('font-size-1')?.value || "48";
            const isBold = document.getElementById('text-bold-1')?.checked || false;
            const isItalic = document.getElementById('text-italic-1')?.checked || false;
            const fontColor = document.getElementById('font-color-1')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            ctx.fillText(text1, canvas.width / 2, canvas.height * 0.7);
        }
        
        if (text2) {
            // Get font settings
            const fontFamily = document.getElementById('font-family-2')?.value || "Arial";
            const fontSize = document.getElementById('font-size-2')?.value || "24";
            const isBold = document.getElementById('text-bold-2')?.checked || false;
            const isItalic = document.getElementById('text-italic-2')?.checked || false;
            const fontColor = document.getElementById('font-color-2')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            ctx.fillText(text2, canvas.width / 2, canvas.height * 0.8);
        }
        
        if (text3) {
            // Get font settings
            const fontFamily = document.getElementById('font-family-3')?.value || "Arial";
            const fontSize = document.getElementById('font-size-3')?.value || "16";
            const isBold = document.getElementById('text-bold-3')?.checked || false;
            const isItalic = document.getElementById('text-italic-3')?.checked || false;
            const fontColor = document.getElementById('font-color-3')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            ctx.fillText(text3, canvas.width / 2, canvas.height * 0.85);
        }
        
        // Draw date
        const date = document.getElementById('date')?.value;
        if (date) {
            // Get font settings
            const fontFamily = document.getElementById('fixed-date-font')?.value || "Arial";
            const fontSize = document.getElementById('fixed-date-size')?.value || "14";
            const isBold = document.getElementById('fixed-date-bold')?.checked || false;
            const isItalic = document.getElementById('fixed-date-italic')?.checked || false;
            const fontColor = document.getElementById('fixed-date-color')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            ctx.fillText(formattedDate, canvas.width / 2, canvas.height * 0.9);
        }
        
        // Draw coordinates
        const latitude = document.getElementById('latitude')?.value;
        const longitude = document.getElementById('longitude')?.value;
        if (latitude && longitude) {
            // Get font settings
            const fontFamily = document.getElementById('fixed-coords-font')?.value || "Arial";
            const fontSize = document.getElementById('fixed-coords-size')?.value || "14";
            const isBold = document.getElementById('fixed-coords-bold')?.checked || false;
            const isItalic = document.getElementById('fixed-coords-italic')?.checked || false;
            const fontColor = document.getElementById('fixed-coords-color')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            ctx.fillText(`${latitude}° N, ${longitude}° W`, canvas.width / 2, canvas.height * 0.95);
        }
    }
    
    console.log("Final Complete Fix applied");
});
