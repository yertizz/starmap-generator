// Color Picker Fix - Makes HEX the default color type for color pickers

document.addEventListener('DOMContentLoaded', function() {
    console.log("Color Picker Fix script loaded");
    
    // Find all color input elements
    const colorInputs = document.querySelectorAll('input[type="color"]');
    
    // For each color input, add an event listener to show the color picker with HEX format
    colorInputs.forEach(input => {
        // When the color input is clicked, prevent the default browser color picker
        input.addEventListener('click', function(e) {
            // If we're using the vanilla-picker library
            if (typeof Picker === 'function') {
                e.preventDefault();
                
                // Create a new color picker
                const picker = new Picker({
                    parent: input,
                    color: input.value,
                    alpha: false,
                    editor: true,
                    editorFormat: 'hex', // Set the default format to HEX
                    popup: 'right',
                    onDone: function(color) {
                        input.value = color.hex;
                        // Trigger a change event
                        const event = new Event('change', { bubbles: true });
                        input.dispatchEvent(event);
                    }
                });
                
                // Open the picker
                picker.openHandler();
            }
        });
    });
    
    console.log("Color Picker Fix applied");
});
