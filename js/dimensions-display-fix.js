/* START OF CODE - Emergent - 2025-10-17 [03:38-PM-EST] File: js/dimensions-display-fix.js.txt */

/**
 * Lightweight Dimensions Display Fix
 * 
 * PURPOSE: Updates ONLY the dimensions label text - does NOT touch canvas rendering
 * 
 * This script:
 * - Listens to paper size, width, height, and DPI changes
 * - Calculates correct pixel dimensions
 * - Updates the blue dimensions label below the zoom slider
 * - Does NOT interfere with canvas rendering or view buttons
 */

(function() {
    'use strict';
    
    console.log('[Dimensions Display Fix] Initializing...');
    
    // Paper size definitions in inches
    const PAPER_SIZES = {
        'letter': { width: 8.5, height: 11 },
        'legal': { width: 8.5, height: 14 },
        'tabloid': { width: 11, height: 17 },
        'a4': { width: 8.27, height: 11.69 },
        'a3': { width: 11.69, height: 16.54 },
        'a2': { width: 16.54, height: 23.39 },
        'a1': { width: 23.39, height: 33.11 },
        'a0': { width: 33.11, height: 46.81 },
        '4x6': { width: 4, height: 6 },
        '5x7': { width: 5, height: 7 },
        '8x10': { width: 8, height: 10 },
        '11x14': { width: 11, height: 14 },
        '16x20': { width: 16, height: 20 },
        '20x30': { width: 20, height: 30 },
        '24x36': { width: 24, height: 36 },
        '8.5x11_in': { width: 8.5, height: 11 },
        '20x30_photo': { width: 20, height: 30 }
    };
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    function initialize() {
        console.log('[Dimensions Display Fix] DOM ready, setting up listeners...');
        
        // Get element references
        const paperAutoSize = document.getElementById('paper-auto-size');
        const widthInput = document.getElementById('output-width');
        const heightInput = document.getElementById('output-height');
        const dpiSelector = document.getElementById('dpi-selector');
        
        if (!paperAutoSize || !widthInput || !heightInput || !dpiSelector) {
            console.warn('[Dimensions Display Fix] Required elements not found');
            return;
        }
        
        // Listen to paper size dropdown changes
        paperAutoSize.addEventListener('change', function() {
            const selectedValue = this.value;
            console.log('[Dimensions Display Fix] Paper size changed to:', selectedValue);
            
            if (selectedValue && selectedValue !== 'custom') {
                // Update width/height inputs AND label
                updateDimensionsFromPaperSize(selectedValue);
            } else {
                // Just update label for custom
                setTimeout(updateDimensionsLabel, 100);
            }
        });
        
        // Listen to manual width/height changes (both user input and programmatic)
        widthInput.addEventListener('change', () => {
            setTimeout(updateDimensionsLabel, 50);
        });
        widthInput.addEventListener('input', () => {
            setTimeout(updateDimensionsLabel, 50);
        });
        heightInput.addEventListener('change', () => {
            setTimeout(updateDimensionsLabel, 50);
        });
        heightInput.addEventListener('input', () => {
            setTimeout(updateDimensionsLabel, 50);
        });
        
        // Listen to DPI changes
        dpiSelector.addEventListener('change', function() {
            setTimeout(updateDimensionsLabel, 100);
        });
        
        // Listen to view button clicks - swap dimensions if needed for orientation
        const landscapeBtn = document.getElementById('view-star-street-landscape-btn');
        const portraitBtn = document.getElementById('view-star-street-portrait-btn');
        
        if (landscapeBtn) {
            landscapeBtn.addEventListener('click', () => {
                console.log('[Dimensions Display Fix] Landscape button clicked');
                setTimeout(() => {
                    ensureLandscapeOrientation();
                    updateDimensionsLabel();
                }, 100);
            });
        }
        
        if (portraitBtn) {
            portraitBtn.addEventListener('click', () => {
                console.log('[Dimensions Display Fix] Portrait button clicked');
                setTimeout(() => {
                    ensurePortraitOrientation();
                    updateDimensionsLabel();
                }, 100);
            });
        }
        
        // Listen to Load Settings button
        const loadSettingsBtn = document.getElementById('load-settings-btn');
        if (loadSettingsBtn) {
            loadSettingsBtn.addEventListener('click', () => {
                console.log('[Dimensions Display Fix] Load Settings clicked');
                setTimeout(updateDimensionsLabel, 1000); // Wait for settings to load
            });
        }
        
        // Initial update - delay longer to allow auto-load of saved settings
        setTimeout(updateDimensionsLabel, 2000);
        
        console.log('[Dimensions Display Fix] Listeners attached successfully');
    }
    
    /**
     * Ensure inputs are in landscape orientation (width > height)
     * Does NOT trigger canvas redraw - only updates inputs and label
     */
    function ensureLandscapeOrientation() {
        const widthInput = document.getElementById('output-width');
        const heightInput = document.getElementById('output-height');
        
        if (!widthInput || !heightInput) return;
        
        const width = parseInt(widthInput.value) || 2550;
        const height = parseInt(heightInput.value) || 3300;
        
        // If currently portrait (width < height), swap them silently
        if (width < height) {
            console.log('[Dimensions Display Fix] Swapping to landscape:', height, 'x', width);
            widthInput.value = height;
            heightInput.value = width;
            // DO NOT trigger change events - would cause canvas redraw and lose bg color
        }
    }
    
    /**
     * Ensure inputs are in portrait orientation (width < height)
     * Does NOT trigger canvas redraw - only updates inputs and label
     */
    function ensurePortraitOrientation() {
        const widthInput = document.getElementById('output-width');
        const heightInput = document.getElementById('output-height');
        
        if (!widthInput || !heightInput) return;
        
        const width = parseInt(widthInput.value) || 2550;
        const height = parseInt(heightInput.value) || 3300;
        
        // If currently landscape (width > height), swap them silently
        if (width > height) {
            console.log('[Dimensions Display Fix] Swapping to portrait:', height, 'x', width);
            widthInput.value = height;
            heightInput.value = width;
            // DO NOT trigger change events - would cause canvas redraw and lose bg color
        }
    }
    
    /**
     * Update width/height inputs based on paper size selection
     * Maintains current orientation (landscape vs portrait)
     */
    function updateDimensionsFromPaperSize(paperSizeKey) {
        const dpiSelector = document.getElementById('dpi-selector');
        const widthInput = document.getElementById('output-width');
        const heightInput = document.getElementById('output-height');
        
        const dpi = parseInt(dpiSelector?.value) || 300;
        
        // Get paper size definition
        let paperSize = PAPER_SIZES[paperSizeKey];
        
        // If not found, try parsing from the key (e.g., "20x30_photo" or "24x36")
        if (!paperSize) {
            const match = paperSizeKey.match(/(\d+\.?\d*)x(\d+\.?\d*)/);
            if (match) {
                paperSize = {
                    width: parseFloat(match[1]),
                    height: parseFloat(match[2])
                };
            }
        }
        
        if (!paperSize) {
            console.warn('[Dimensions Display Fix] Unknown paper size:', paperSizeKey);
            updateDimensionsLabel();
            return;
        }
        
        // Detect CURRENT orientation from input fields
        const currentWidth = parseInt(widthInput.value) || 2550;
        const currentHeight = parseInt(heightInput.value) || 3300;
        const isCurrentlyLandscape = currentWidth > currentHeight;
        
        console.log(`[Dimensions Display Fix] Current: ${currentWidth}w x ${currentHeight}h (Landscape: ${isCurrentlyLandscape})`);
        
        // Calculate pixel dimensions from paper size
        let widthPixels = Math.round(paperSize.width * dpi);
        let heightPixels = Math.round(paperSize.height * dpi);
        
        // Check if paper size is naturally landscape
        const isPaperNaturallyLandscape = paperSize.width > paperSize.height;
        
        // Swap dimensions if current orientation doesn't match paper's natural orientation
        if (isCurrentlyLandscape && !isPaperNaturallyLandscape) {
            console.log('[Dimensions Display Fix] Current is landscape, paper is portrait -> swapping to landscape');
            [widthPixels, heightPixels] = [heightPixels, widthPixels];
        } else if (!isCurrentlyLandscape && isPaperNaturallyLandscape) {
            console.log('[Dimensions Display Fix] Current is portrait, paper is landscape -> swapping to portrait');
            [widthPixels, heightPixels] = [heightPixels, widthPixels];
        }
        
        console.log(`[Dimensions Display Fix] Setting: ${widthPixels}w x ${heightPixels}h pixels (${paperSize.width}" x ${paperSize.height}" @ ${dpi} DPI)`);
        
        // Update input fields
        widthInput.value = widthPixels;
        heightInput.value = heightPixels;
        
        // Trigger change events for other scripts
        widthInput.dispatchEvent(new Event('change', { bubbles: true }));
        heightInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Update label after a small delay
        setTimeout(updateDimensionsLabel, 50);
    }
    
    /**
     * Update the dimensions label ONLY
     * Reads current values from inputs - does NOT modify them
     */
    function updateDimensionsLabel(overrideWidth, overrideHeight, overridePaperW, overridePaperH, overrideDPI) {
        const widthInput = document.getElementById('output-width');
        const heightInput = document.getElementById('output-height');
        const dpiSelector = document.getElementById('dpi-selector');
        
        if (!widthInput || !heightInput) {
            return;
        }
        
        // Use overrides if provided, otherwise read from inputs
        const width = overrideWidth || (parseInt(widthInput.value) || 2550);
        const height = overrideHeight || (parseInt(heightInput.value) || 3300);
        const dpi = overrideDPI || (dpiSelector ? (parseInt(dpiSelector.value) || 300) : 300);
        
        // Determine orientation
        const isLandscape = width > height;
        const orientation = isLandscape ? 'Landscape' : 'Portrait';
        
        // Calculate paper size in inches
        const widthInches = overridePaperW || (width / dpi).toFixed(1);
        const heightInches = overridePaperH || (height / dpi).toFixed(1);
        
        // Build the label text with orientation indicator and inch symbols
        const labelText = `Dimensions [${orientation}]: ${width}w x ${height}h pixels | Paper: ${widthInches}" x ${heightInches}" | DPI: ${dpi}`;
        
        // Find or create the dimensions label element
        let labelElement = findDimensionsLabel();
        
        if (!labelElement) {
            // Create the dimensions label if it doesn't exist
            labelElement = createDimensionsLabel();
        }
        
        if (labelElement) {
            labelElement.textContent = labelText;
            console.log('[Dimensions Display Fix] Updated label:', labelText);
        } else {
            console.warn('[Dimensions Display Fix] Could not create dimensions label element');
        }
    }
    
    /**
     * Create the dimensions label element
     */
    function createDimensionsLabel() {
        console.log('[Dimensions Display Fix] Creating dimensions label...');
        
        // Find the zoom container or canvas container
        const zoomContainer = document.getElementById('zoom-container');
        const canvasContainer = document.querySelector('.canvas-container');
        
        if (!zoomContainer && !canvasContainer) {
            console.warn('[Dimensions Display Fix] Cannot find container for dimensions label');
            return null;
        }
        
        // Create the label element
        const labelElement = document.createElement('div');
        labelElement.id = 'dimensions-label';
        labelElement.style.color = '#0066cc';
        labelElement.style.fontWeight = 'bold';
        labelElement.style.textAlign = 'center';
        labelElement.style.marginTop = '10px';
        labelElement.style.fontSize = '14px';
        labelElement.textContent = 'Dimensions: Loading...';
        
        // Insert after zoom container or canvas container
        if (zoomContainer) {
            if (zoomContainer.nextElementSibling) {
                zoomContainer.parentNode.insertBefore(labelElement, zoomContainer.nextElementSibling);
            } else {
                zoomContainer.parentNode.appendChild(labelElement);
            }
        } else if (canvasContainer) {
            if (canvasContainer.nextElementSibling) {
                canvasContainer.parentNode.insertBefore(labelElement, canvasContainer.nextElementSibling);
            } else {
                canvasContainer.parentNode.appendChild(labelElement);
            }
        }
        
        console.log('[Dimensions Display Fix] Dimensions label created successfully');
        return labelElement;
    }
    
    /**
     * Find the dimensions label element in the DOM
     */
    function findDimensionsLabel() {
        // Try multiple selectors to find the label
        const selectors = [
            '#dimensions-label',
            '.dimensions-label',
            '.dimensions-display',
            '#canvas-dimensions-label'
        ];
        
        for (let selector of selectors) {
            const el = document.querySelector(selector);
            if (el) return el;
        }
        
        // Look for any element containing "Dimensions:" and "pixels"
        const allElements = document.querySelectorAll('div, p, span');
        for (let el of allElements) {
            const text = el.textContent.trim();
            if (text.startsWith('Dimensions:') && text.includes('pixels')) {
                return el;
            }
        }
        
        return null;
    }
    
})();

/* END OF CODE - Emergent - 2025-10-17 [03:38-PM-EST] */
