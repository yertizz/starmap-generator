// Direct Zoom Slider Implementation - Works with existing HTML
(function() {
    'use strict';
    
    console.log('Direct Zoom Slider: Initializing...');
    
    // Function to initialize zoom slider functionality
    function initializeZoomSlider() {
        // Find existing zoom elements
        const zoomContainer = document.getElementById('zoom-container');
        const slider = document.getElementById('zoom-slider');
        const value = document.getElementById('zoom-value');
        const canvas = document.getElementById('star-map-canvas');
        
        if (!zoomContainer) {
            console.error('Zoom container not found in HTML');
            setTimeout(initializeZoomSlider, 500);
            return;
        }
        
        if (!slider || !value) {
            console.error('Zoom slider or value element not found');
            return;
        }
        
        console.log('Found zoom slider elements, initializing functionality...');
        
        // Ensure zoom container is visible
        zoomContainer.style.display = 'block !important';
        zoomContainer.style.visibility = 'visible !important';
        zoomContainer.style.opacity = '1 !important';
        
        // Add functionality
        slider.addEventListener('input', function() {
            value.textContent = this.value;
            if (canvas) {
                const scale = this.value / 100;
                canvas.style.transform = `scale(${scale})`;
                canvas.style.transformOrigin = 'center center';
                
                // Adjust container for overflow
                const container = canvas.parentElement;
                if (container) {
                    if (this.value > 100) {
                        container.style.overflow = 'auto';
                        container.style.maxHeight = '80vh';
                    } else {
                        container.style.overflow = 'visible';
                        container.style.maxHeight = 'none';
                    }
                }
            }
        });
        
        // Also update on change event for better compatibility
        slider.addEventListener('change', function() {
            value.textContent = this.value;
            if (canvas) {
                const scale = this.value / 100;
                canvas.style.transform = `scale(${scale})`;
                canvas.style.transformOrigin = 'center center';
            }
        });
        
        console.log('Direct Zoom Slider: Initialized successfully!');
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeZoomSlider);
    } else {
        setTimeout(initializeZoomSlider, 100);
    }
    
})();
