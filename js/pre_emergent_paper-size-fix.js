/* START OF CODE - AI Fix - 2025-10-15 - Paper Size Auto-Selector Fix */
/**
 * This script fixes the paper size dropdown functionality
 * - Updates canvas dimensions when paper size is selected
 * - Updates the dimensions label with full info (pixels, paper size, DPI)
 * - Handles aspect ratio and landscape/portrait orientation
 */

(function() {
    'use strict';
    
    console.log('[Paper Size Fix] Initializing...');
    
    // Paper size definitions in inches
    const PAPER_SIZES = {
        'letter': { width: 8.5, height: 11, name: 'Letter' },
        'legal': { width: 8.5, height: 14, name: 'Legal' },
        'tabloid': { width: 11, height: 17, name: 'Tabloid' },
        'a4': { width: 8.27, height: 11.69, name: 'A4' },
        'a3': { width: 11.69, height: 16.54, name: 'A3' },
        'a2': { width: 16.54, height: 23.39, name: 'A2' },
        'a1': { width: 23.39, height: 33.11, name: 'A1' },
        'a0': { width: 33.11, height: 46.81, name: 'A0' },
        '4x6': { width: 4, height: 6, name: '4x6' },
        '5x7': { width: 5, height: 7, name: '5x7' },
        '8x10': { width: 8, height: 10, name: '8x10' },
        '11x14': { width: 11, height: 14, name: '11x14' },
        '16x20': { width: 16, height: 20, name: '16x20' },
        '20x30': { width: 20, height: 30, name: '20x30' },
        '24x36': { width: 24, height: 36, name: '24x36' }
    };
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    function initialize() {
        console.log('[Paper Size Fix] DOM ready, setting up...');
        
        // Get element references
        const paperAutoSize = document.getElementById('paper-auto-size');
        const widthInput = document.getElementById('output-width');
        const heightInput = document.getElementById('output-height');
        const dpiSelector = document.getElementById('dpi-selector');
        const maintainAspectRatio = document.getElementById('maintain-aspect-ratio');
        
        if (!paperAutoSize || !widthInput || !heightInput || !dpiSelector) {
            console.error('[Paper Size Fix] Required elements not found');
            return;
        }
        
        console.log('[Paper Size Fix] All elements found, adding event listeners...');
        
        // Add event listener to paper size dropdown
        paperAutoSize.addEventListener('change', handlePaperSizeChange);
        
        // Add event listeners to width/height inputs to update label
        widthInput.addEventListener('input', updateDimensionsLabel);
        heightInput.addEventListener('input', updateDimensionsLabel);
        
        // Add event listener to DPI selector
        dpiSelector.addEventListener('change', function() {
            // Re-apply paper size if one is selected
            if (paperAutoSize.value && paperAutoSize.value !== '') {
                handlePaperSizeChange();
            } else {
                updateDimensionsLabel();
            }
        });
        
        // Add event listener to aspect ratio checkbox
        if (maintainAspectRatio) {
            maintainAspectRatio.addEventListener('change', function() {
                if (paperAutoSize.value && paperAutoSize.value !== '') {
                    handlePaperSizeChange();
                }
            });
        }
        
        // Initial label update
        updateDimensionsLabel();
        
        console.log('[Paper Size Fix] Setup complete');
    }
    
    /**
     * Handle paper size dropdown change
     */
    function handlePaperSizeChange() {
        const paperAutoSize = document.getElementById('paper-auto-size');
        const widthInput = document.getElementById('output-width');
        const heightInput = document.getElementById('output-height');
        const dpiSelector = document.getElementById('dpi-selector');
        const maintainAspectRatio = document.getElementById('maintain-aspect-ratio');
        
        const selectedSize = paperAutoSize.value;
        
        console.log('[Paper Size Fix] Paper size changed to:', selectedSize);
        
        if (!selectedSize || selectedSize === '' || selectedSize === 'custom') {
            console.log('[Paper Size Fix] Custom size selected or empty, updating label only');
            updateDimensionsLabel();
            return;
        }
        
        const paperSize = PAPER_SIZES[selectedSize];
        if (!paperSize) {
            console.warn('[Paper Size Fix] Unknown paper size:', selectedSize);
            return;
        }
        
        const dpi = parseInt(dpiSelector.value) || 300;
        
        // Calculate pixel dimensions
        let widthInches = paperSize.width;
        let heightInches = paperSize.height;
        
        // Determine if landscape orientation is needed
        const currentWidth = parseInt(widthInput.value) || 2550;
        const currentHeight = parseInt(heightInput.value) || 3300;
        const currentIsLandscape = currentWidth > currentHeight;
        const paperIsPortrait = widthInches < heightInches;
        
        // Check if we should swap to landscape
        let shouldSwapToLandscape = false;
        
        // Method 1: Check if current canvas is already in landscape
        if (currentIsLandscape && paperIsPortrait) {
            shouldSwapToLandscape = true;
            console.log('[Paper Size Fix] Current canvas is landscape, will swap paper dimensions');
        }
        
        // Method 2: Check if aspect ratio checkbox is checked
        if (maintainAspectRatio && maintainAspectRatio.checked && currentIsLandscape && paperIsPortrait) {
            shouldSwapToLandscape = true;
            console.log('[Paper Size Fix] Aspect ratio checked and landscape mode detected');
        }
        
        // Swap dimensions if needed
        if (shouldSwapToLandscape) {
            [widthInches, heightInches] = [heightInches, widthInches];
            console.log('[Paper Size Fix] Swapped to landscape orientation:', widthInches, 'x', heightInches);
        }
        
        const widthPixels = Math.round(widthInches * dpi);
        const heightPixels = Math.round(heightInches * dpi);
        
        console.log('[Paper Size Fix] Calculated dimensions:', {
            widthInches,
            heightInches,
            dpi,
            widthPixels,
            heightPixels
        });
        
        // Update the input fields
        widthInput.value = widthPixels;
        heightInput.value = heightPixels;
        
        // Trigger change events
        widthInput.dispatchEvent(new Event('change', { bubbles: true }));
        heightInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Update the dimensions label
        updateDimensionsLabel();
        
        console.log('[Paper Size Fix] Canvas dimensions updated successfully');
    }
    
    /**
     * Update the dimensions label with full info
     * Format: "Dimensions: 2550w x 3300h pixels | Paper: 8.5x11_in | DPI: 300"
     */
    function updateDimensionsLabel() {
        const widthInput = document.getElementById('output-width');
        const heightInput = document.getElementById('output-height');
        const dpiSelector = document.getElementById('dpi-selector');
        const paperAutoSize = document.getElementById('paper-auto-size');
        
        if (!widthInput || !heightInput) {
            console.warn('[Paper Size Fix] Width or height input not found');
            return;
        }
        
        const width = parseInt(widthInput.value) || 2550;
        const height = parseInt(heightInput.value) || 3300;
        const dpi = dpiSelector ? (parseInt(dpiSelector.value) || 300) : 300;
        
        // Calculate paper size in inches
        const widthInches = (width / dpi).toFixed(1);
        const heightInches = (height / dpi).toFixed(1);
        
        // Build the label text
        let labelText = `Dimensions: ${width}w x ${height}h pixels | Paper: ${widthInches}x${heightInches}_in | DPI: ${dpi}`;
        
        // Find all potential label elements
        const labelElements = [
            document.querySelector('.canvas-container + .dimensions-label'),
            document.querySelector('#dimensions-label'),
            document.querySelector('.dimensions-display'),
            document.getElementById('canvas-dimensions-label')
        ];
        
        // Try to find the label in multiple ways
        let labelElement = null;
        for (let el of labelElements) {
            if (el) {
                labelElement = el;
                break;
            }
        }
        
        // If no label element exists, try to find it near the canvas or create one
        if (!labelElement) {
            // Look for the canvas container
            const canvasContainer = document.querySelector('.canvas-container');
            if (canvasContainer) {
                // Check if there's already a text node or div after it
                const nextElement = canvasContainer.nextElementSibling;
                if (nextElement && (nextElement.textContent.includes('Dimensions') || nextElement.id === 'dimensions-label')) {
                    labelElement = nextElement;
                } else {
                    // Look for any element with dimension info
                    const allDivs = document.querySelectorAll('.canvas-container ~ div, .canvas-container ~ p');
                    for (let div of allDivs) {
                        if (div.textContent.includes('Dimensions') || div.textContent.includes('pixels')) {
                            labelElement = div;
                            break;
                        }
                    }
                }
            }
        }
        
        // If still not found, look for blue text near zoom slider
        if (!labelElement) {
            const allTextElements = document.querySelectorAll('div, p, span');
            for (let el of allTextElements) {
                const text = el.textContent.trim();
                if (text.startsWith('Dimensions:') && text.includes('pixels')) {
                    labelElement = el;
                    break;
                }
            }
        }
        
        if (labelElement) {
            labelElement.textContent = labelText;
            labelElement.style.color = '#0066cc';
            labelElement.style.fontWeight = 'bold';
            labelElement.style.textAlign = 'center';
            labelElement.style.marginTop = '10px';
            console.log('[Paper Size Fix] Updated dimensions label:', labelText);
        } else {
            // Create a new label element as last resort
            const canvasContainer = document.querySelector('.canvas-container');
            const zoomSection = document.getElementById('zoom-container');
            
            if (zoomSection) {
                // Create label after zoom section
                labelElement = document.createElement('div');
                labelElement.id = 'dimensions-label';
                labelElement.textContent = labelText;
                labelElement.style.color = '#0066cc';
                labelElement.style.fontWeight = 'bold';
                labelElement.style.textAlign = 'center';
                labelElement.style.marginTop = '10px';
                labelElement.style.fontSize = '14px';
                
                // Insert after zoom section
                if (zoomSection.nextElementSibling) {
                    zoomSection.parentNode.insertBefore(labelElement, zoomSection.nextElementSibling);
                } else {
                    zoomSection.parentNode.appendChild(labelElement);
                }
                
                console.log('[Paper Size Fix] Created new dimensions label');
            } else {
                console.warn('[Paper Size Fix] Could not find location to place dimensions label');
            }
        }
    }
    
    // Expose functions globally for testing
    window.paperSizeFix = {
        updateDimensionsLabel: updateDimensionsLabel,
        handlePaperSizeChange: handlePaperSizeChange
    };
    
})();
/* END OF CODE - AI Fix - 2025-10-15 - Paper Size Auto-Selector Fix */
