/* START OF CODE - Cline - 2025-05-15 11:32 File: js/image-format-fix.js */

/**
 * Image Format Fix for Star Map Generator
 *
 * This script fixes the image format selection logic:
 * 1. Disables the PNG transparency checkbox when JPG or SVG is selected
 * 2. Ensures the PNG transparency checkbox is positioned correctly
 * 3. Updates the transparency label text to "(Transparency PNG Only)"
 * 4. Adjusts spacing between elements to match the mockup
 * 5. Prepares for future PDF format implementation
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Image Format Fix");

    // Run the fixes with a delay to ensure all elements are loaded
    setTimeout(runFixes, 500);
    setTimeout(runFixes, 1000);
    setTimeout(runFixes, 2000);
});

// Run all fixes
function runFixes() {
    console.log("Running Image Format Fix");
    
    // Fix the image format selection logic
    fixImageFormatLogic();

    // Fix the PNG transparency checkbox position
    fixPngTransparencyPosition();
    
    // Update the transparency label text
    updateTransparencyLabelText();
    
    // Adjust spacing between elements
    adjustElementSpacing();
}

// Also run when the window is fully loaded
window.addEventListener('load', function() {
    console.log("Window loaded - Running Image Format Fix");
    setTimeout(runFixes, 500);
});

/**
 * Fix the image format selection logic
 */
function fixImageFormatLogic() {
    // Get all image format radio buttons
    const imageFormatRadios = document.querySelectorAll('input[name="image-format"]');
    const pngTransparencyCheckbox = document.getElementById('png-transparency');
    const pngTransparencyLabel = document.querySelector('label[for="png-transparency"]');

    if (!imageFormatRadios.length || !pngTransparencyCheckbox || !pngTransparencyLabel) {
        console.error("Required elements not found for fixing image format logic");
        return;
    }

    // Add ID to the PNG transparency label for CSS targeting
    pngTransparencyLabel.id = 'png-transparency-label';

    // Function to update the PNG transparency checkbox state
    function updatePngTransparencyState() {
        const selectedFormat = document.querySelector('input[name="image-format"]:checked').value;

        if (selectedFormat === 'png') {
            // Enable PNG transparency checkbox
            pngTransparencyCheckbox.disabled = false;
            pngTransparencyLabel.classList.remove('disabled-option');
        } else {
            // Disable PNG transparency checkbox
            pngTransparencyCheckbox.disabled = true;
            pngTransparencyCheckbox.checked = false;
            pngTransparencyLabel.classList.add('disabled-option');
        }

        console.log(`Image format changed to ${selectedFormat}, PNG transparency ${pngTransparencyCheckbox.disabled ? 'disabled' : 'enabled'}`);
    }

    // Add event listeners to all image format radio buttons
    imageFormatRadios.forEach(radio => {
        radio.addEventListener('change', updatePngTransparencyState);
    });

    // Initialize the PNG transparency checkbox state
    updatePngTransparencyState();
}

/**
 * Fix the PNG transparency checkbox position
 */
function fixPngTransparencyPosition() {
    // Get the radio group and PNG transparency label
    const radioGroup = document.querySelector('.radio-group');
    const pngRadio = document.querySelector('input[name="image-format"][value="png"]');
    const pngLabel = pngRadio ? pngRadio.closest('label') : null;
    const pngTransparencyLabel = document.getElementById('png-transparency-label');

    if (!radioGroup || !pngLabel || !pngTransparencyLabel) {
        console.error("Required elements not found for fixing PNG transparency position");
        return;
    }

    // Move the PNG transparency label right after the PNG radio label
    try {
        // First, try using insertAdjacentElement
        pngLabel.insertAdjacentElement('afterend', pngTransparencyLabel);
        console.log("PNG transparency label repositioned successfully");
    } catch (error) {
        console.error("Error repositioning PNG transparency label:", error);

        // Fallback: try using parentNode.insertBefore
        try {
            radioGroup.insertBefore(pngTransparencyLabel, pngLabel.nextSibling);
            console.log("PNG transparency label repositioned using fallback method");
        } catch (fallbackError) {
            console.error("Fallback method also failed:", fallbackError);
        }
    }
}

/**
 * Update the transparency label text
 */
function updateTransparencyLabelText() {
    const pngTransparencyLabel = document.querySelector('label[for="png-transparency"]');
    
    if (!pngTransparencyLabel) {
        console.error("PNG transparency label not found for text update");
        return;
    }
    
    // Update the label text
    pngTransparencyLabel.textContent = "(Transparency PNG Only)";
    console.log("PNG transparency label text updated");
}

/**
 * Adjust spacing between elements
 */
function adjustElementSpacing() {
    // Get all the elements
    const pngLabel = document.querySelector('label[for="png-format"]');
    const pngTransparencyLabel = document.querySelector('label[for="png-transparency"]');
    const jpgLabel = document.querySelector('label[for="jpg-format"]');
    const svgLabel = document.querySelector('label[for="svg-format"]');
    
    if (!pngLabel || !pngTransparencyLabel || !jpgLabel || !svgLabel) {
        console.error("Required elements not found for spacing adjustment");
        return;
    }
    
    // Adjust spacing
    pngLabel.style.marginRight = "10px";
    pngTransparencyLabel.style.marginRight = "40px";
    jpgLabel.style.marginRight = "40px";
    svgLabel.style.marginRight = "40px";
    
    console.log("Element spacing adjusted");
}

/* END OF CODE - Cline - 2025-05-15 11:32 File: js/image-format-fix.js */
