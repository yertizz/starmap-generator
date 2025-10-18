// Disable problematic scripts that are causing issues
(function() {
    'use strict';
    
    console.log('DISABLING PROBLEMATIC SCRIPTS');
    
    // 1. Prevent fixed-layers-fix-exact.js from running
    if (window.updateDateValue) {
        window.updateDateValue = function() {
            console.log('updateDateValue DISABLED to prevent Fixed Layers overwriting');
        };
    }
    
    // 2. Force zoom slider to be visible
    function forceZoomSliderVisible() {
        const zoomContainer = document.getElementById('zoom-container');
        if (zoomContainer) {
            // Remove any inline styles that might be hiding it
            zoomContainer.removeAttribute('style');
            zoomContainer.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; background-color: #e8e8e8 !important; padding: 10px 20px !important; margin: 10px 0 !important; border-radius: 5px !important; border: 2px solid red !important;';
            
            // Make sure all child elements are visible
            const allChildren = zoomContainer.querySelectorAll('*');
            allChildren.forEach(child => {
                child.style.display = '';
                child.style.visibility = 'visible';
                child.style.opacity = '1';
            });
            
            console.log('✓ Forced zoom slider visible');
            
            // Check if it's in the DOM
            if (!document.body.contains(zoomContainer)) {
                console.error('Zoom container is not in the DOM!');
            } else {
                console.log('Zoom container is in the DOM at:', zoomContainer.getBoundingClientRect());
            }
        } else {
            console.error('Zoom container not found!');
        }
    }
    
    // 3. Prevent any script from hiding the zoom slider
    const originalDisplay = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, 'display');
    Object.defineProperty(CSSStyleDeclaration.prototype, 'display', {
        get: function() {
            return originalDisplay.get.call(this);
        },
        set: function(value) {
            const element = this.parentElement || this.parentNode;
            if (element && element.id === 'zoom-container' && (value === 'none' || value === '')) {
                console.warn('BLOCKED attempt to hide zoom container!');
                return;
            }
            return originalDisplay.set.call(this, value);
        }
    });
    
    // Run immediately and after DOM loads
    forceZoomSliderVisible();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceZoomSliderVisible);
    } else {
        setTimeout(forceZoomSliderVisible, 100);
        setTimeout(forceZoomSliderVisible, 500);
        setTimeout(forceZoomSliderVisible, 1000);
        setTimeout(forceZoomSliderVisible, 2000);
    }
    
    // Also run periodically to combat any scripts trying to hide it
    setInterval(forceZoomSliderVisible, 3000);
    
})();
