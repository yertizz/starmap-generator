/* RECREATED WORKING CANVAS FIXES - Based on successful fixes from 11:29 AM */
/* START OF CODE - Cline - 2025-06-24 17:20 File: js/absolute-final-fix.js */

(function() {
    console.log('Absolute Final Fix - RECREATED WORKING VERSION starting...');
    
    // 1. CRITICAL CANVAS DIMENSION PROTECTION
    function resetCanvasToUserDimensions() {
        console.log('Resetting canvas to user dimensions...');
        
        const canvas = document.getElementById('star-map-canvas');
        if (!canvas) return null;
        
        // Get user-specified dimensions
        const widthInput = document.getElementById('width');
        const heightInput = document.getElementById('height');
        
        if (widthInput && heightInput && widthInput.value && heightInput.value) {
            const userWidth = parseInt(widthInput.value);
            const userHeight = parseInt(heightInput.value);
            
            // Force canvas to user dimensions
            canvas.width = userWidth;
            canvas.height = userHeight;
            
            // Set display style to prevent hijacking
            canvas.style.width = 'auto';
            canvas.style.height = 'auto';
            canvas.style.maxWidth = '100%';
            canvas.style.maxHeight = '70vh';
            canvas.style.objectFit = 'contain';
            canvas.style.display = 'block';
            canvas.style.margin = '0 auto';
            
            console.log('✓ Canvas reset to user dimensions:', userWidth, 'x', userHeight);
            return { width: userWidth, height: userHeight };
        }
        
        return null;
    }
    
    // 2. FIX CANVAS LAYOUT HIJACKING
    function fixCanvasLayoutHijacking() {
        console.log('Fixing Canvas Layout hijacking...');
        
        const canvasLayoutBtn = document.getElementById('view-star-map-canvas-btn');
        if (!canvasLayoutBtn) return;
        
        // Store original handler
        const originalHandler = canvasLayoutBtn.onclick;
        
        // Replace with protected version
        canvasLayoutBtn.onclick = function(e) {
            console.log('Canvas Layout button clicked - PROTECTED VERSION');
            
            // Set protection flag
            window.canvasProtectionActive = true;
            
            // Reset canvas to user dimensions FIRST
            resetCanvasToUserDimensions();
            
            // Call generateStarMap if it exists to get text overlays
            if (typeof generateStarMap === 'function') {
                console.log('Calling generateStarMap for text overlays...');
                generateStarMap();
                
                // Restore user dimensions after generateStarMap runs
                setTimeout(() => {
                    if (window.canvasProtectionActive) {
                        resetCanvasToUserDimensions();
                        window.canvasProtectionActive = false;
                        console.log('✓ Canvas dimensions restored after generateStarMap');
                    }
                }, 100);
            } else {
                console.warn('generateStarMap function not found - using fallback');
                // Fallback: just ensure canvas has correct dimensions
                resetCanvasToUserDimensions();
                window.canvasProtectionActive = false;
            }
        };
        
        console.log('✓ Canvas Layout hijacking protection installed');
    }
    
    // 3. MOVE CONTAINERS INSIDE WHITE FORM STRUCTURE
    function moveContainersInsideForm() {
        console.log('Moving containers 3,4,5 inside white form structure...');
        
        // Find the main form container
        const mainForm = document.querySelector('form') || document.querySelector('.container');
        if (!mainForm) {
            console.warn('Main form container not found');
            return;
        }
        
        // Find insertion point (after Map Location container)
        let insertionPoint = null;
        const formChildren = Array.from(mainForm.children);
        for (const child of formChildren) {
            if (child.textContent && child.textContent.includes('Map Location')) {
                insertionPoint = child;
                break;
            }
        }
        
        if (!insertionPoint) {
            console.warn('Could not find Map Location container for insertion point');
            return;
        }
        
        // Containers to move
        const containersToMove = [
            { text: 'Customizable Text Layers', name: 'Container 3' },
            { text: 'Star Map Canvas', name: 'Container 4' },
            { text: 'Settings + Preview + Download', name: 'Container 5' }
        ];
        
        containersToMove.forEach(selector => {
            // Find the container
            const allElements = document.querySelectorAll('*');
            let targetContainer = null;
            
            for (const element of allElements) {
                if (element.textContent && element.textContent.includes(selector.text)) {
                    targetContainer = element.closest('fieldset') || 
                                    element.closest('section') || 
                                    element.closest('.settings-row') ||
                                    element.closest('div[style*="background"]');
                    if (targetContainer && !mainForm.contains(targetContainer)) {
                        break;
                    }
                    targetContainer = null;
                }
            }
            
            if (targetContainer) {
                console.log(`Moving ${selector.name} inside form...`);
                
                // Style to match other containers
                targetContainer.style.cssText = `
                    background-color: #f8f9fa !important;
                    border: 2px solid #ccc !important;
                    border-radius: 5px !important;
                    padding: 15px !important;
                    margin-bottom: 15px !important;
                    box-sizing: border-box !important;
                    width: 100% !important;
                `;
                
                // Move into form
                mainForm.insertBefore(targetContainer, insertionPoint.nextSibling);
                insertionPoint = targetContainer;
                
                console.log(`✓ ${selector.name} moved inside form`);
            } else {
                console.warn(`Could not find ${selector.name}`);
            }
        });
        
        console.log('✓ Containers moved inside white form structure');
    }
    
    // 4. FIX COMBINED VIEW OPTIONS STYLING
    function fixCombinedViewOptionsUI() {
        console.log('Fixing Combined View Options UI styling...');
        
        // Find Combined View Options section
        const rows = document.querySelectorAll('.settings-row');
        let combinedRow = null;
        
        rows.forEach(row => {
            if (row.textContent.includes('Combined View Options:')) {
                combinedRow = row;
            }
        });
        
        if (!combinedRow) {
            console.warn('Combined View Options section not found');
            return;
        }
        
        // Style the main container
        const container = combinedRow.querySelector('div[style*="background-color"]');
        if (container) {
            container.style.cssText = `
                width: 100% !important;
                padding: 10px !important;
                background-color: white !important;
                border: 2px solid #ccc !important;
                border-radius: 5px !important;
                margin-bottom: 10px !important;
                box-sizing: border-box !important;
            `;
            
            // Style title
            const title = container.querySelector('div:first-child');
            if (title) {
                title.style.cssText = `
                    font-weight: bold !important;
                    font-size: 1.1em !important;
                    color: #0056b3 !important;
                    text-align: center !important;
                    margin-bottom: 10px !important;
                    padding-bottom: 5px !important;
                    border-bottom: 1px solid #eee !important;
                `;
            }
            
            // Style Circle Overlap section
            const circleOverlapDiv = container.querySelector('div');
            if (circleOverlapDiv && circleOverlapDiv.querySelector('#circle-overlap-percent')) {
                circleOverlapDiv.style.cssText = `
                    background-color: white !important;
                    border: 1px solid #ddd !important;
                    border-radius: 3px !important;
                    padding: 8px !important;
                    margin-bottom: 8px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 10px !important;
                `;
            }
            
            // Style Map Order section
            const mapOrderDivs = container.querySelectorAll('div');
            for (const div of mapOrderDivs) {
                if (div.querySelector('input[name="map-order"]')) {
                    div.style.cssText = `
                        background-color: white !important;
                        border: 1px solid #ddd !important;
                        border-radius: 3px !important;
                        padding: 8px !important;
                        margin-top: 8px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        gap: 15px !important;
                    `;
                    break;
                }
            }
            
            console.log('✓ Combined View Options styled with white containers');
        }
    }
    
    // 5. REMOVE FAINT HR LINES
    function removeFaintHRLines() {
        console.log('Removing faint HR lines...');
        
        // Remove all HR elements
        const allHRs = document.querySelectorAll('hr');
        allHRs.forEach(hr => hr.remove());
        
    // Add CSS to prevent HR lines AND FORCE PERFECT CIRCLES
    const style = document.createElement('style');
    style.textContent = `
        hr { display: none !important; }
        div[style*="border-top"], div[style*="border-bottom"] {
            border-top: none !important;
            border-bottom: none !important;
        }
        
        /* CRITICAL: Force perfect circles instead of ovals */
        #star-map-canvas {
            aspect-ratio: auto !important;
            object-fit: contain !important;
            max-width: 100% !important;
            max-height: 70vh !important;
            width: auto !important;
            height: auto !important;
        }
        
        /* Force any circular elements to be perfectly round */
        .star-map-circle, .street-map-circle, [class*="circle"] {
            border-radius: 50% !important;
            aspect-ratio: 1 / 1 !important;
            overflow: hidden !important;
        }
    `;
    document.head.appendChild(style);
        
        console.log('✓ Faint HR lines removed');
    }
    
    // 6. PROTECT ALL VIEW FUNCTIONS FROM HIJACKING
    function protectViewFunctions() {
        console.log('Installing view function protection...');
        
        const viewButtons = [
            'view-star-map-btn',
            'view-street-map-btn',
            'view-star-street-landscape-btn',
            'view-star-street-portrait-btn'
        ];
        
        viewButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                const originalHandler = btn.onclick;
                
                btn.onclick = function(e) {
                    console.log(`${btnId} clicked - PROTECTED VERSION`);
                    
                    // Reset canvas dimensions before any view operation
                    resetCanvasToUserDimensions();
                    
                    // Call original handler
                    if (originalHandler) {
                        originalHandler.call(this, e);
                    }
                    
                    // Ensure canvas stays at user dimensions
                    setTimeout(() => {
                        resetCanvasToUserDimensions();
                    }, 100);
                };
                
                console.log(`✓ Protection installed for ${btnId}`);
            }
        });
    }
    
    // INITIALIZE ALL FIXES
    function initialize() {
        console.log('Initializing all canvas and UI fixes...');
        
        // Apply fixes in order
        fixCanvasLayoutHijacking();
        moveContainersInsideForm();
        fixCombinedViewOptionsUI();
        removeFaintHRLines();
        protectViewFunctions();
        
        // Set up periodic checks
        setInterval(() => {
            // Ensure canvas dimensions stay correct
            if (!window.canvasProtectionActive) {
                resetCanvasToUserDimensions();
            }
        }, 2000);
        
        console.log('✓ All fixes initialized successfully');
    }
    
    // Start immediately
    initialize();
    
    // Also run on DOM ready and window load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    }
    
    window.addEventListener('load', () => {
        setTimeout(initialize, 500);
    });
    
})();

/* END OF CODE - Cline - 2025-06-24 17:20 File: js/absolute-final-fix.js */
