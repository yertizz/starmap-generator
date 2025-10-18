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
        
        // Add event listeners to Combined view buttons
        const landscapeViewBtn = document.getElementById('view-star-street-landscape-btn');
        const portraitViewBtn = document.getElementById('view-star-street-portrait-btn');
        const landscapeDownloadBtn = document.getElementById('download-star-street-landscape-btn');
        const portraitDownloadBtn = document.getElementById('download-star-street-portrait-btn');
        
        if (landscapeViewBtn) {
            landscapeViewBtn.addEventListener('click', function() {
                handleOrientationChange('landscape');
            });
            console.log('[Paper Size Fix] Added listener to Landscape View button');
        }
        
        if (portraitViewBtn) {
            portraitViewBtn.addEventListener('click', function() {
                handleOrientationChange('portrait');
            });
            console.log('[Paper Size Fix] Added listener to Portrait View button');
        }
        
        if (landscapeDownloadBtn) {
            landscapeDownloadBtn.addEventListener('click', function() {
                handleOrientationChange('landscape');
            });
            console.log('[Paper Size Fix] Added listener to Landscape Download button');
        }
        
        if (portraitDownloadBtn) {
            portraitDownloadBtn.addEventListener('click', function() {
                handleOrientationChange('portrait');
            });
            console.log('[Paper Size Fix] Added listener to Portrait Download button');
        }
        
        // Initial label update
        updateDimensionsLabel();
        
        // Set up a MutationObserver to protect the label from being overwritten
        setupLabelProtection();
        
        console.log('[Paper Size Fix] Setup complete');
    }
    
    /**
     * Set up protection for the dimensions label to prevent overwrites
     */
    function setupLabelProtection() {
        // Find the label element
        const findLabelElement = function() {
            const selectors = [
                '.canvas-container + .dimensions-label',
                '#dimensions-label',
                '.dimensions-display',
                '#canvas-dimensions-label'
            ];
            
            for (let selector of selectors) {
                const el = document.querySelector(selector);
                if (el) return el;
            }
            
            // Look for any element with dimension text
            const allTextElements = document.querySelectorAll('div, p, span');
            for (let el of allTextElements) {
                const text = el.textContent.trim();
                if (text.startsWith('Dimensions') && text.includes('pixels')) {
                    return el;
                }
            }
            
            return null;
        };
        
        const checkAndUpdate = function() {
            const labelElement = findLabelElement();
            if (!labelElement) return;
            
            const correctFormat = labelElement.getAttribute('data-correct-format');
            if (!correctFormat) return;
            
            // Check if the label has been changed by another script
            if (labelElement.textContent !== correctFormat) {
                console.log('[Paper Size Fix] Label was overwritten, restoring correct format...');
                labelElement.textContent = correctFormat;
                labelElement.style.color = '#0066cc';
                labelElement.style.fontWeight = 'bold';
                labelElement.style.textAlign = 'center';
            }
        };
        
        // Check every 100ms to see if label was overwritten
        setInterval(checkAndUpdate, 100);
        
        // Also use MutationObserver for immediate detection
        const labelElement = findLabelElement();
        if (labelElement) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        checkAndUpdate();
                    }
                });
            });
            
            observer.observe(labelElement, {
                childList: true,
                characterData: true,
                subtree: true
            });
            
            console.log('[Paper Size Fix] Label protection active');
        }
    }
    
    /**
     * Handle orientation change from view/download buttons
     */
    function handleOrientationChange(orientation) {
        console.log('[Paper Size Fix] Orientation change requested:', orientation);
        
        const widthInput = document.getElementById('output-width');
        const heightInput = document.getElementById('output-height');
        
        if (!widthInput || !heightInput) {
            console.warn('[Paper Size Fix] Width or height input not found');
            return;
        }
        
        const currentWidth = parseInt(widthInput.value) || 2550;
        const currentHeight = parseInt(heightInput.value) || 3300;
        
        if (orientation === 'landscape') {
            // Ensure width > height for landscape
            if (currentHeight > currentWidth) {
                // Swap dimensions
                widthInput.value = currentHeight;
                heightInput.value = currentWidth;
                
                // Trigger change events
                widthInput.dispatchEvent(new Event('change', { bubbles: true }));
                heightInput.dispatchEvent(new Event('change', { bubbles: true }));
                
                console.log('[Paper Size Fix] Swapped to landscape:', heightInput.value, 'x', widthInput.value);
            } else {
                console.log('[Paper Size Fix] Already in landscape orientation');
            }
        } else if (orientation === 'portrait') {
            // Ensure height > width for portrait
            if (currentWidth > currentHeight) {
                // Swap dimensions
                widthInput.value = currentHeight;
                heightInput.value = currentWidth;
                
                // Trigger change events
                widthInput.dispatchEvent(new Event('change', { bubbles: true }));
                heightInput.dispatchEvent(new Event('change', { bubbles: true }));
                
                console.log('[Paper Size Fix] Swapped to portrait:', widthInput.value, 'x', heightInput.value);
            } else {
                console.log('[Paper Size Fix] Already in portrait orientation');
            }
        }
        
        // Update the dimensions label
        updateDimensionsLabel();
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
        
        // Determine orientation
        const isLandscape = width > height;
        const orientation = isLandscape ? 'Landscape' : 'Portrait';
        
        // Calculate paper size in inches
        const widthInches = (width / dpi).toFixed(1);
        const heightInches = (height / dpi).toFixed(1);
        
        // Build the label text with orientation mode
        let labelText = `Dimensions [${orientation}]: ${width}w x ${height}h pixels | Paper: ${widthInches}x${heightInches} | DPI: ${dpi}`;
        
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
            
            // Store the current label text for persistence
            labelElement.setAttribute('data-correct-format', labelText);
            
            // Hide any duplicate dimension labels
            hideDuplicateDimensionLabels(labelElement);
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
    
    /**
     * Hide any duplicate dimension labels to prevent confusion
     */
    function hideDuplicateDimensionLabels(keepLabel) {
        console.log('[Paper Size Fix] Checking for duplicate dimension labels...');
        
        // Find all elements that might be dimension labels
        const allElements = document.querySelectorAll('div, p, span');
        
        let foundDuplicates = 0;
        
        allElements.forEach(function(el) {
            // Skip the label we want to keep
            if (el === keepLabel) return;
            
            const text = el.textContent.trim();
            
            // Check if this element contains dimension text
            if (text.startsWith('Dimensions') && text.includes('pixels') && text.includes('DPI')) {
                // Check if it's NOT our formatted label (doesn't have orientation tag)
                if (!text.includes('[Landscape]') && !text.includes('[Portrait]')) {
                    console.log('[Paper Size Fix] Found duplicate label, hiding:', text);
                    el.style.display = 'none';
                    foundDuplicates++;
                } else if (el !== keepLabel) {
                    // It has orientation tag but it's not our main label - still hide it
                    console.log('[Paper Size Fix] Found another formatted label, hiding:', text);
                    el.style.display = 'none';
                    foundDuplicates++;
                }
            }
        });
        
        if (foundDuplicates > 0) {
            console.log('[Paper Size Fix] Hid', foundDuplicates, 'duplicate label(s)');
        } else {
            console.log('[Paper Size Fix] No duplicate labels found');
        }
    }
    
    // Expose functions globally for testing
    window.paperSizeFix = {
        updateDimensionsLabel: updateDimensionsLabel,
        handlePaperSizeChange: handlePaperSizeChange,
        handleOrientationChange: handleOrientationChange
    };
    
})();
/* END OF CODE - AI Fix - 2025-10-15 - Paper Size Auto-Selector Fix */
