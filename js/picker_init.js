// START OF CODE - Cline - 2025-04-13 14:40 File: js/picker_init.js
// Initialization logic for the CSSScript Custom HEX Color Picker

document.addEventListener('DOMContentLoaded', () => {
    if (typeof ColorPicker === 'undefined') {
        console.warn("Custom HEX ColorPicker library (color-picker.js) not found.");
        return;
    }

    console.log("Initializing Custom HEX Color Pickers...");

    document.querySelectorAll('button.color-swatch').forEach(swatchBtn => {
        const targetId = swatchBtn.dataset.target;
        const inputEl = document.getElementById(targetId);

        if (!inputEl) {
            console.warn(`Picker Init: No input element found for target ID "${targetId}"`);
            return;
        }

        // REMOVED: Initial background color setting - rely on loadSavedSettings
        // swatchBtn.style.backgroundColor = inputEl.value || '#FFFFFF';
        // console.log(`DEBUG: Initial swatch bg for #${targetId} set based on input value: ${inputEl.value || '#FFFFFF'}`);

        swatchBtn.addEventListener('click', () => {
            console.log(`DEBUG: Swatch button clicked for input #${targetId}`);
            // Ensure the picker opens with the *current* value from the input
            const currentColor = inputEl.value || '#FFFFFF';
            ColorPicker.SetOptions({
                 color: currentColor, // Use current input value
                 onSelect: (hexColor) => {
                     console.log(`DEBUG: Color selected for #${targetId}: ${hexColor}`);
                     inputEl.value = hexColor;

                     // Update swatch background when selected
                     swatchBtn.style.setProperty('background-color', hexColor, 'important');
                     console.log(`DEBUG: Set swatch background for #${targetId} to ${hexColor}`);

                     // Trigger change event on the hidden input if needed by other scripts
                     const changeEvent = new Event('change', { bubbles: true });
                     inputEl.dispatchEvent(changeEvent);
                 }
            });
            ColorPicker.Show(inputEl, swatchBtn); // Pass input and button to Show
        });
         console.log(`DEBUG: Picker attached to button for input #${targetId}`);
    });

    console.log("Custom HEX Color Pickers initialization complete.");
});
// END OF CODE - Cline - 2025-04-13 14:40 File: js/picker_init.js
