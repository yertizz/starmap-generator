/* START OF CODE - Cline - 2025-06-24 12:33 File: js/sst1-ui-fixes.js */

/**
 * SST #1 UI Fixes
 * 
 * This script fixes the specific UI issues reported in SST #1:
 * A. Excessive padding/spacing in Combined View Options
 * B. Circle Overlap slider position not matching percentage display
 * C. Right border still cut off on form sections
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Applying SST #1 UI fixes...');
    
    // Wait a bit for all elements to load
    setTimeout(function() {
        fixCircleOverlapSlider();
        fixExcessivePadding();
        fixFormBorderCutoff();
        console.log('✅ All SST #1 UI fixes applied');
    }, 500);
});

/**
 * Fix A & B: Circle Overlap Slider - Fix percentage display and position mismatch
 */
function fixCircleOverlapSlider() {
    const overlapSlider = document.getElementById('circle-overlap-percent');
    const overlapValue = document.getElementById('overlap-value');
    
    if (overlapSlider && overlapValue) {
        console.log('🎚️ Fixing Circle Overlap slider...');
        
        // Fix the slider range and value
        overlapSlider.setAttribute('min', '0');
        overlapSlider.setAttribute('max', '100');
        overlapSlider.setAttribute('step', '1');
        
        // Set a reasonable default value
        overlapSlider.value = 10;
        overlapValue.textContent = '10%';
        
        // Update the global setting
        if (window.combinedViewSettings) {
            window.combinedViewSettings.overlapPercent = 10;
        }
        
        // Fix the event listener to properly sync slider position with display
        overlapSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            overlapValue.textContent = value + '%';
            
            // Update global setting
            if (window.combinedViewSettings) {
                window.combinedViewSettings.overlapPercent = value;
            }
            
            console.log(`🎚️ Circle overlap set to: ${value}%`);
        });
        
        console.log('✅ Circle Overlap slider fixed');
    } else {
        console.warn('⚠️ Circle overlap slider elements not found');
    }
}

/**
 * Fix A: Excessive Padding/Spacing in Combined View Options
 */
function fixExcessivePadding() {
    console.log('📏 Fixing excessive padding...');
    
    // Find Combined View Options container
    const combinedViewContainers = document.querySelectorAll('div');
    let combinedViewContainer = null;
    
    for (let container of combinedViewContainers) {
        if (container.textContent && container.textContent.includes('Combined View Options')) {
            combinedViewContainer = container.closest('.settings-row');
            break;
        }
    }
    
    if (combinedViewContainer) {
        // Reduce top margin
        combinedViewContainer.style.marginTop = '-5px';
        
        // Find the inner container with background
        const innerContainer = combinedViewContainer.querySelector('div[style*="background-color: #f8f9fa"]');
        if (innerContainer) {
            // Reduce padding
            innerContainer.style.padding = '5px';
            
            // Find the title div
            const titleDiv = innerContainer.querySelector('div[style*="text-align: center"]');
            if (titleDiv) {
                titleDiv.style.marginBottom = '2px';
            }
        }
        
        // Find overlap control div
        const overlapDiv = combinedViewContainer.querySelector('div[style*="margin-bottom: 5px"]');
        if (overlapDiv) {
            overlapDiv.style.marginBottom = '2px';
        }
        
        // Find map order control div
        const mapOrderDivs = combinedViewContainer.querySelectorAll('div[style*="display: flex"]');
        for (let div of mapOrderDivs) {
            if (div.textContent && div.textContent.includes('Map Order')) {
                div.style.marginTop = '-3px';
                break;
            }
        }
        
        console.log('✅ Excessive padding fixed');
    } else {
        console.warn('⚠️ Combined View Options container not found');
    }
}

/**
 * Fix C: Form Border Cut Off on Right Side
 */
function fixFormBorderCutoff() {
    console.log('🖼️ Fixing form border cutoff...');
    
    // Find all form sections
    const formSections = document.querySelectorAll('.form-section');
    
    formSections.forEach(function(section, index) {
        // Reduce width to prevent cutoff
        section.style.maxWidth = '870px';
        section.style.width = '870px';
        
        // Ensure borders are visible
        section.style.overflow = 'visible';
        section.style.boxSizing = 'border-box';
        
        // Ensure proper centering
        section.style.marginLeft = 'auto';
        section.style.marginRight = 'auto';
        
        console.log(`✅ Fixed form section ${index + 1} border`);
    });
    
    // Also fix the main container if needed
    const container = document.querySelector('.container');
    if (container) {
        container.style.maxWidth = '900px';
        container.style.width = '900px';
        container.style.overflow = 'visible';
        console.log('✅ Fixed main container');
    }
    
    console.log('✅ Form border cutoff fixed');
}

/* END OF CODE - Cline - 2025-06-24 12:33 File: js/sst1-ui-fixes.js */
