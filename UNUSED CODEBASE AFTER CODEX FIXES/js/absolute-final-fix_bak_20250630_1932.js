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
        
        /* CRITICAL: Smart canvas scaling - preview size with perfect circles */
        #star-map-canvas {
            object-fit: contain !important;
            max-width: 90% !important;
            max-height: 70vh !important;
            width: auto !important;
            height: auto !important;
            display: block !important;
            margin: 0 auto !important;
            border: none !important;
            background: transparent !important;
        }
        
        /* Fix canvas container to fit content */
        .canvas-container {
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            display: block !important;
            text-align: center !important;
            padding: 20px !important;
            background-color: #FFFCE8 !important;
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
    
    // 7. SYNC FIXED LAYERS DATE AND COORDINATES
    function syncFixedLayersValues() {
        console.log('Setting up Fixed Layers value sync...');
        
        // Add the blue "Fixed Layers" title if it doesn't exist - WITH PROPER WIDTH CONSTRAINTS
        function addFixedLayersTitle() {
            const fixedDateValue = document.getElementById('fixed-date-value');
            if (fixedDateValue) {
                // Find the Fixed Layers section (the parent of the date input group)
                const dateInputGroup = fixedDateValue.closest('.input-group') || fixedDateValue.closest('div');
                if (dateInputGroup && !dateInputGroup.previousElementSibling?.classList?.contains('fixed-layers-title')) {
                    const title = document.createElement('h3');
                    title.className = 'fixed-layers-title';
                    title.textContent = 'Fixed Layers';
                    title.style.cssText = `
                        font-weight: bold !important;
                        font-size: 1.15em !important;
                        color: #0056b3 !important;
                        border: none !important;
                        border-bottom: none !important;
                        padding: 0 5px 2px 5px !important;
                        margin: 5px auto 5px auto !important;
                        width: auto !important;
                        max-width: calc(100% - 10px) !important;
                        text-align: center !important;
                        display: block !important;
                        box-sizing: border-box !important;
                    `;
                    
                    // ALSO FIX THE CONTAINER WIDTH TO PREVENT STRETCHING
                    const fixedTextContent = dateInputGroup.closest('.fixed-text-content');
                    if (fixedTextContent) {
                        fixedTextContent.style.cssText = `
                            margin-top: 5px !important;
                            padding: 10px !important;
                            background-color: #f9f9f9 !important;
                            border-radius: 6px !important;
                            border: 1px solid #e0e0e0 !important;
                            max-width: 100% !important;
                            width: 100% !important;
                            box-sizing: border-box !important;
                            overflow: hidden !important;
                        `;
                    }
                    
                    // FORCE PROPER WIDTH ON INPUT GROUPS
                    const allInputGroups = dateInputGroup.parentNode.querySelectorAll('.input-group');
                    allInputGroups.forEach(group => {
                        group.style.cssText = `
                            display: flex !important;
                            align-items: center !important;
                            gap: 8px !important;
                            margin-bottom: 8px !important;
                            min-height: 24px !important;
                            max-width: 100% !important;
                            box-sizing: border-box !important;
                            overflow: hidden !important;
                        `;
                        
                        // Fix display values width - WIDER FOR FULL COORDINATES
                        const displayValue = group.querySelector('.display-value, #fixed-date-value, #fixed-coords-value');
                        if (displayValue) {
                            displayValue.style.cssText = `
                                width: 220px !important;
                                min-width: 220px !important;
                                max-width: 220px !important;
                                height: 24px !important;
                                min-height: 24px !important;
                                max-height: 24px !important;
                                padding: 2px 8px !important;
                                background-color: #ddd !important;
                                border: none !important;
                                border-radius: 3px !important;
                                font-size: 0.95em !important;
                                line-height: 20px !important;
                                display: flex !important;
                                align-items: center !important;
                                box-sizing: border-box !important;
                                overflow: hidden !important;
                                text-overflow: ellipsis !important;
                                white-space: nowrap !important;
                            `;
                        }
                        
                        // FIX FONT CONTROLS ALIGNMENT - PERFECT ALIGNMENT BETWEEN ROWS
                        const fontControls = group.querySelector('.font-controls');
                        if (fontControls) {
                            fontControls.style.cssText = `
                                display: flex !important;
                                flex-wrap: nowrap !important;
                                align-items: center !important;
                                gap: 22px !important;
                                margin-left: 0 !important;
                            `;
                            
                            // Fix font family dropdown
                            const fontFamily = fontControls.querySelector('select[id*="font-family"]');
                            if (fontFamily) {
                                fontFamily.style.cssText = `
                                    width: 120px !important;
                                    min-width: 120px !important;
                                    max-width: 120px !important;
                                    height: 24px !important;
                                    padding: 4px 8px !important;
                                    border: 1px solid #ccc !important;
                                    border-radius: 4px !important;
                                    background-color: white !important;
                                    box-sizing: border-box !important;
                                `;
                            }
                            
                            // Fix font size dropdown
                            const fontSize = fontControls.querySelector('select[id*="font-size"]');
                            if (fontSize) {
                                fontSize.style.cssText = `
                                    width: 70px !important;
                                    min-width: 70px !important;
                                    max-width: 70px !important;
                                    height: 24px !important;
                                    padding: 4px 8px !important;
                                    border: 1px solid #ccc !important;
                                    border-radius: 4px !important;
                                    background-color: white !important;
                                    box-sizing: border-box !important;
                                `;
                            }
                            
                            // Fix style options (Bold/Italic) - MATCH SST1 MOCKUP TIGHT SPACING
                            const styleOptions = fontControls.querySelector('.style-options');
                            if (styleOptions) {
                                styleOptions.style.cssText = `
                                    display: flex !important;
                                    align-items: center !important;
                                    gap: 12px !important;
                                    margin: 0 !important;
                                `;
                                
                                // Fix individual labels
                                const labels = styleOptions.querySelectorAll('label');
                                labels.forEach(label => {
                                    label.style.cssText = `
                                        width: auto !important;
                                        margin: 0 !important;
                                        text-align: left !important;
                                        font-weight: normal !important;
                                        display: flex !important;
                                        align-items: center !important;
                                        gap: 3px !important;
                                        white-space: nowrap !important;
                                    `;
                                });
                            }
                            
                            // Fix color swatch - REMOVE EXTRA MARGIN, LET MAIN GAP HANDLE SPACING
                            const colorSwatch = fontControls.querySelector('.color-swatch');
                            if (colorSwatch) {
                                colorSwatch.style.cssText = `
                                    width: 24px !important;
                                    height: 24px !important;
                                    min-width: 24px !important;
                                    min-height: 24px !important;
                                    border-radius: 50% !important;
                                    border: 1px solid #ccc !important;
                                    cursor: pointer !important;
                                    background-color: #FFCC00 !important;
                                    margin: 0 !important;
                                    flex-shrink: 0 !important;
                                `;
                            }
                        }
                    });
                    
                    // Insert the title RIGHT BEFORE the Date input group
                    dateInputGroup.parentNode.insertBefore(title, dateInputGroup);
                    console.log('✓ Fixed Layers title added with proper width constraints');
                }
            }
        }
        
        function updateFixedLayersDisplay() {
            // Update date value
            const dateInput = document.getElementById('date');
            const timeInput = document.getElementById('time');
            const showTimeToggle = document.getElementById('show-time-toggle');
            const fixedDateValue = document.getElementById('fixed-date-value');
            
            if (dateInput && fixedDateValue) {
                let dateText = '';
                if (dateInput.value) {
                    // FIX: Parse date correctly to avoid "out by one" bug
                    const dateParts = dateInput.value.split('-');
                    const year = parseInt(dateParts[0]);
                    const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
                    const day = parseInt(dateParts[2]);
                    const date = new Date(year, month, day);
                    
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    dateText = date.toLocaleDateString('en-US', options);
                    
                    // Add time if enabled and available
                    if (showTimeToggle && showTimeToggle.checked && timeInput && timeInput.value) {
                        const [hours, minutes] = timeInput.value.split(':');
                        const hour = parseInt(hours);
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        const hour12 = hour % 12 || 12;
                        dateText += `, ${hour12}:${minutes} ${ampm}`;
                    }
                }
                fixedDateValue.textContent = dateText;
                console.log('✓ Fixed Layers date updated:', dateText);
            }
            
            // Update coordinates value
            const latLongDisplay = document.getElementById('latLongDisplay');
            const fixedCoordsValue = document.getElementById('fixed-coords-value');
            
            if (latLongDisplay && fixedCoordsValue) {
                const coordsText = latLongDisplay.textContent.trim();
                if (coordsText && coordsText !== 'Lat: ... | Long: ...') {
                    fixedCoordsValue.textContent = coordsText;
                    console.log('✓ Fixed Layers coords updated:', coordsText);
                }
            }
            
            // ALSO UPDATE TEXT PLACEMENTS SECTION
            updateTextPlacementsDisplay();
        }
        
        function updateTextPlacementsDisplay() {
            // Update Text Placements date value - TARGET EXACT ELEMENT
            const dateInput = document.getElementById('date');
            const timeInput = document.getElementById('time');
            const showTimeToggle = document.getElementById('show-time-toggle');
            const textPlacementDateField = document.getElementById('text-placement-content-date');
            
            if (dateInput && textPlacementDateField) {
                let dateText = '';
                if (dateInput.value) {
                    // FIX: Parse date correctly to avoid "out by one" bug
                    const dateParts = dateInput.value.split('-');
                    const year = parseInt(dateParts[0]);
                    const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
                    const day = parseInt(dateParts[2]);
                    const date = new Date(year, month, day);
                    
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    dateText = date.toLocaleDateString('en-US', options);
                    
                    // Add time if enabled and available
                    if (showTimeToggle && showTimeToggle.checked && timeInput && timeInput.value) {
                        const [hours, minutes] = timeInput.value.split(':');
                        const hour = parseInt(hours);
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        const hour12 = hour % 12 || 12;
                        dateText += `, ${hour12}:${minutes} ${ampm}`;
                    }
                }
                
                textPlacementDateField.textContent = dateText;
                console.log('✓ Text Placements date updated:', dateText);
            }
            
            // Update Text Placements coordinates value - TARGET EXACT ELEMENT
            const latLongDisplay = document.getElementById('latLongDisplay');
            const textPlacementCoordsField = document.getElementById('text-placement-content-coords');
            
            if (latLongDisplay && textPlacementCoordsField) {
                const coordsText = latLongDisplay.textContent.trim();
                if (coordsText && coordsText !== 'Lat: ... | Long: ...') {
                    textPlacementCoordsField.textContent = coordsText;
                    console.log('✓ Text Placements coords updated:', coordsText);
                }
            }
        }
        
        // Set up event listeners
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const showTimeToggle = document.getElementById('show-time-toggle');
        const latInput = document.getElementById('latitude');
        const longInput = document.getElementById('longitude');
        
        if (dateInput) {
            dateInput.addEventListener('change', updateFixedLayersDisplay);
            dateInput.addEventListener('input', updateFixedLayersDisplay);
        }
        
        if (timeInput) {
            timeInput.addEventListener('change', updateFixedLayersDisplay);
            timeInput.addEventListener('input', updateFixedLayersDisplay);
        }
        
        if (showTimeToggle) {
            showTimeToggle.addEventListener('change', updateFixedLayersDisplay);
        }
        
        if (latInput) {
            latInput.addEventListener('input', () => setTimeout(updateFixedLayersDisplay, 100));
        }
        
        if (longInput) {
            longInput.addEventListener('input', () => setTimeout(updateFixedLayersDisplay, 100));
        }
        
        // Watch for coordinate display changes
        const latLongDisplay = document.getElementById('latLongDisplay');
        if (latLongDisplay) {
            const observer = new MutationObserver(updateFixedLayersDisplay);
            observer.observe(latLongDisplay, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
        
        // Add the title first - REDUCED DELAY TO ELIMINATE STUTTER
        setTimeout(addFixedLayersTitle, 50);
        
        // Initial update
        updateFixedLayersDisplay();
        
        // Periodic sync as backup
        setInterval(updateFixedLayersDisplay, 3000);
        
        console.log('✓ Fixed Layers sync setup complete');
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
        syncFixedLayersValues();
        
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
