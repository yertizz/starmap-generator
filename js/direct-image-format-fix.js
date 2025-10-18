/* START OF CODE - Cline - 2025-05-15 11:43:00 File: js/direct-image-format-fix.js */

/**
 * Direct Image Format Fix for Star Map Generator
 *
 * This script completely replaces the Image Format row with a new structure
 * that exactly matches the mockup.
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Direct Image Format Fix");
    
    // Find the Image Format row
    const settingsRow = document.querySelector('.settings-row:has(input[name="image-format"])');
    
    if (!settingsRow) {
        console.error("Image Format row not found");
        return;
    }
    
    // Create the new HTML structure
    const newHTML = `
        <span style="font-weight: 600; margin-right: 20px;">Image Format:</span>
        <input type="radio" name="image-format" value="png" id="png-format" checked> 
        <label for="png-format" style="margin-right: 10px;">PNG</label>
        <input type="checkbox" id="png-transparency"> 
        <label for="png-transparency" style="margin-right: 40px;">(Transparency PNG Only)</label>
        <input type="radio" name="image-format" value="jpg" id="jpg-format"> 
        <label for="jpg-format" style="margin-right: 40px;">JPG</label>
        <input type="radio" name="image-format" value="svg" id="svg-format"> 
        <label for="svg-format" style="margin-right: 40px;">SVG</label>
        <input type="radio" name="image-format" value="pdf" id="pdf-format"> 
        <label for="pdf-format">PDF</label>
    `;
    
    // Replace the content of the settings row
    settingsRow.innerHTML = newHTML;
    
    // Add event listeners to handle the PNG transparency checkbox
    const imageFormatRadios = document.querySelectorAll('input[name="image-format"]');
    const pngTransparencyCheckbox = document.getElementById('png-transparency');
    const pngTransparencyLabel = document.querySelector('label[for="png-transparency"]');
    
    // Function to update the PNG transparency checkbox state
    function updatePngTransparencyState() {
        const selectedFormat = document.querySelector('input[name="image-format"]:checked').value;
        
        if (selectedFormat === 'png') {
            // Enable PNG transparency checkbox
            pngTransparencyCheckbox.disabled = false;
            pngTransparencyLabel.style.opacity = '1';
            pngTransparencyLabel.style.cursor = 'pointer';
        } else {
            // Disable PNG transparency checkbox
            pngTransparencyCheckbox.disabled = true;
            pngTransparencyCheckbox.checked = false;
            pngTransparencyLabel.style.opacity = '0.5';
            pngTransparencyLabel.style.cursor = 'not-allowed';
        }
    }
    
    // Add event listeners to all image format radio buttons
    imageFormatRadios.forEach(radio => {
        radio.addEventListener('change', updatePngTransparencyState);
    });
    
    // Initialize the PNG transparency checkbox state
    updatePngTransparencyState();
    
    console.log("Direct Image Format Fix applied successfully");
});

/* END OF CODE - Cline - 2025-05-15 11:43:00 File: js/direct-image-format-fix.js */
