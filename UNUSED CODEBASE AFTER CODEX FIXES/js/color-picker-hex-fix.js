// Color Picker HEX Fix - Makes HEX the default color type for color pickers

document.addEventListener('DOMContentLoaded', function() {
    console.log("Color Picker HEX Fix loaded");
    
    // Wait for vanilla-picker to be loaded
    setTimeout(function() {
        // Check if vanilla-picker is loaded
        if (typeof Picker !== 'undefined') {
            console.log("Vanilla Picker found, applying HEX fix");
            
            // Override the Picker prototype to make HEX the default
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
                // Check if a picker is already attached
                if (!input._picker) {
                    // Create a new picker
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
                }
            });
            
            console.log("Color pickers initialized with HEX as default");
        } else {
            console.error("Vanilla Picker not found");
        }
    }, 1000);
});
