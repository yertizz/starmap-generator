/* Combined View Options - Minimal JavaScript for slider value only */
/* CSS handles all styling - this just sets the slider to 5% */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Combined View Options script loaded');
    
    // Wait for elements to be available
    setTimeout(function() {
        const slider = document.getElementById('circle-overlap-percent');
        const display = document.getElementById('overlap-value');
        
        if (slider && display) {
            // Set slider to 5% and update display
            slider.value = '5';
            display.textContent = '5%';
            
            console.log('Circle overlap slider set to 5%');
        } else {
            console.log('Circle overlap elements not found');
        }
    }, 100);
});
