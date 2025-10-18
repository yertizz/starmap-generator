/* Combined View Options - Complete Fix for all issues */
/* Fixes spacing, border cutoff, and dynamic slider background */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Combined View Options: Applying comprehensive fixes');
    
    function updateSliderBackground(slider) {
        if (!slider) return;
        
        const value = parseInt(slider.value);
        const max = parseInt(slider.max);
        const percentage = (value / max) * 100;
        
        // Create dynamic background that follows the thumb
        slider.style.background = `linear-gradient(to right, #007bff 0%, #007bff ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;
        
        // Update display value
        const display = document.getElementById('overlap-value');
        if (display) {
            display.textContent = value + '%';
        }
    }
    
    function setupSlider() {
        const slider = document.getElementById('circle-overlap-percent');
        if (slider) {
            // Set initial value
            slider.value = 5;
            updateSliderBackground(slider);
            
            // Add event listeners for dynamic updates
            slider.addEventListener('input', function() {
                updateSliderBackground(this);
            });
            
            slider.addEventListener('change', function() {
                updateSliderBackground(this);
            });
            
            console.log('Slider setup complete with dynamic background');
        }
    }
    
    function fixSpacing() {
        // Find Combined View container
        const containers = document.querySelectorAll('div[style*="background-color: #f8f9fa"]');
        
        containers.forEach(container => {
            if (container.textContent.includes('Combined View Options')) {
                console.log('Applying aggressive spacing fixes');
                
                // Fix container - reduce padding and ensure no overflow
                container.style.setProperty('padding', '3px 10px', 'important');
                container.style.setProperty('margin', '0px', 'important');
                container.style.setProperty('width', '100%', 'important');
                container.style.setProperty('box-sizing', 'border-box', 'important');
                container.style.setProperty('overflow', 'visible', 'important');
                
                // Fix title
                const title = container.querySelector('div[style*="font-weight: bold"]');
                if (title) {
                    title.style.setProperty('margin', '0px', 'important');
                    title.style.setProperty('padding', '0px', 'important');
                }
                
                // Fix all flex rows
                const flexRows = container.querySelectorAll('div[style*="display: flex"]');
                flexRows.forEach(row => {
                    row.style.setProperty('margin', '0px', 'important');
                    row.style.setProperty('padding', '0px', 'important');
                });
                
                // Fix note text
                const noteText = container.querySelector('div[style*="font-size: 11px"]');
                if (noteText) {
                    noteText.style.setProperty('margin-top', '3px', 'important');
                    noteText.style.setProperty('margin-bottom', '0px', 'important');
                }
            }
        });
        
        // Fix parent containers to prevent border cutoff
        const settingsRows = document.querySelectorAll('.settings-row');
        settingsRows.forEach(row => {
            if (row.textContent.includes('Combined View Options')) {
                row.style.setProperty('margin', '0px', 'important');
                row.style.setProperty('padding', '0px', 'important');
                row.style.setProperty('width', '100%', 'important');
                row.style.setProperty('box-sizing', 'border-box', 'important');
                row.style.setProperty('overflow', 'visible', 'important');
            }
        });
        
        // Fix any parent containers that might be cutting off borders
        const allContainers = document.querySelectorAll('div');
        allContainers.forEach(container => {
            if (container.querySelector('div[style*="Combined View Options"]')) {
                container.style.setProperty('overflow', 'visible', 'important');
                container.style.setProperty('width', '100%', 'important');
                container.style.setProperty('box-sizing', 'border-box', 'important');
            }
        });
    }
    
    // Apply fixes immediately
    setupSlider();
    fixSpacing();
    
    // Apply again after delays to catch dynamic content
    setTimeout(() => {
        setupSlider();
        fixSpacing();
    }, 100);
    
    setTimeout(() => {
        setupSlider();
        fixSpacing();
    }, 500);
    
    setTimeout(() => {
        setupSlider();
        fixSpacing();
    }, 1000);
});
