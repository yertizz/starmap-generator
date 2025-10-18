(function() {
    console.log('Dimensions Fix v2 - FINAL VERSION - Initializing');
    
    // Flag to track initialization status
    let initialized = false;
    
    // Store original dimensions to protect views
    let originalDimensions = { width: 2550, height: 3300 };
    let currentView = 'standard';
    let lastKnownGoodDimensions = { width: 2550, height: 3300 };
    
    // Get user dimensions
    function getUserDimensions() {
        const widthInput = document.getElementById('width') || document.getElementById('output-width');
        const heightInput = document.getElementById('height') || document.getElementById('output-height');
        
        let width = 2550, height = 3300;
        if (widthInput && heightInput && widthInput.value && heightInput.value) {
            width = parseInt(widthInput.value);
            height = parseInt(heightInput.value);
        }
        
        // Also check if paper-size-dimensions.js has stored dimensions
        if (window.currentDimensions) {
            width = window.currentDimensions.width;
            height = window.currentDimensions.height;
        }
        
        console.log(`User dimensions: ${width}w x ${height}h`);
        return { width, height };
    }
    
    // Create dimensions display
    function createDimensionsDisplay() {
        try {
            // Remove any existing dimensions display
            document.querySelectorAll('[id^="canvas-dimensions"], .canvas-dimensions-display').forEach(el => {
                if (el && el.parentNode) el.parentNode.removeChild(el);
            });
            
            // Create the display element
            const dimensionsDisplay = document.createElement('div');
            dimensionsDisplay.id = 'canvas-dimensions-display';
            dimensionsDisplay.style.cssText = `
                text-align: center;
                font-weight: bold;
                color: #0056b3;
                margin: 10px 0;
                padding: 5px;
                background-color: #f8f9fa;
                border-radius: 5px;
                width: 100%;
                z-index: 9999;
                position: relative;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            `;
            
            // AGGRESSIVE INSERTION - Try multiple locations
            let inserted = false;
            
            // 1. Try after zoom container
            const zoomContainer = document.getElementById('zoom-container');
            if (zoomContainer && zoomContainer.parentNode) {
                zoomContainer.parentNode.insertBefore(dimensionsDisplay, zoomContainer.nextSibling);
                inserted = true;
                console.log('✓ Dimensions display inserted after zoom container');
            }
            
            // 2. Try in settings-preview-download-section
            if (!inserted) {
                const settingsSection = document.querySelector('.settings-preview-download-section');
                if (settingsSection) {
                    settingsSection.appendChild(dimensionsDisplay);
                    inserted = true;
                    console.log('✓ Dimensions display inserted in settings section');
                }
            }
            
            // 3. Try before canvas container
            if (!inserted) {
                const canvasContainer = document.querySelector('.canvas-container');
                if (canvasContainer && canvasContainer.parentNode) {
                    canvasContainer.parentNode.insertBefore(dimensionsDisplay, canvasContainer);
                    inserted = true;
                    console.log('✓ Dimensions display inserted before canvas container');
                }
            }
            
            // 4. Last resort - append to body
            if (!inserted) {
                document.body.appendChild(dimensionsDisplay);
                inserted = true;
                console.log('✓ Dimensions display inserted in body (last resort)');
            }
            
            if (inserted) {
                console.log('✓ Dimensions display element created and inserted successfully');
                return dimensionsDisplay;
            } else {
                console.error('✗ Failed to insert dimensions display anywhere');
                return null;
            }
            
        } catch (error) {
            console.error('Error creating dimensions display:', error);
            return null;
        }
    }
    
    // Update dimensions display
    function updateDimensionsDisplay(width, height) {
        try {
            // Create or get the dimensions display
            let dimensionsDisplay = document.getElementById('canvas-dimensions-display');
            if (!dimensionsDisplay) {
                dimensionsDisplay = createDimensionsDisplay();
            }
            
            if (!dimensionsDisplay) {
                console.warn('Could not create or find dimensions display');
                return;
            }
            
            // Check if we're in landscape combined view and need to flip dimensions
            let displayWidth = width;
            let displayHeight = height;
            
            // Detect if Combined Landscape button is active/highlighted
            const landscapeBtn = document.querySelector('.btn-warning[onclick*="viewStarStreetLandscape"]') || 
                                document.getElementById('view-star-street-landscape-btn');
            
            if (landscapeBtn && (landscapeBtn.classList.contains('active') || 
                                landscapeBtn.style.backgroundColor === 'orange' ||
                                landscapeBtn.style.backgroundColor === '#ffc107')) {
                // Landscape mode active, flip dimensions
                displayWidth = height;
                displayHeight = width;
                console.log('Landscape button active - flipping dimensions to:', displayWidth + 'w x ' + displayHeight + 'h');
            }
            
            // Format dimensions text
            let dimensionsText;
            const paperSizeSelect = document.getElementById('paper-auto-size');
            if (paperSizeSelect && paperSizeSelect.value && 
                paperSizeSelect.value !== 'default' && 
                paperSizeSelect.value !== 'Select A Paper Size...') {
                const paperSize = paperSizeSelect.value;
                const dpiSelector = document.getElementById('dpi-selector') || document.getElementById('dpi');
                const dpi = dpiSelector && dpiSelector.value ? dpiSelector.value : '300';
                dimensionsText = `Dimensions: ${displayWidth}w x ${displayHeight}h pixels | Paper: ${paperSize} | DPI: ${dpi}`;
            } else {
                dimensionsText = `Dimensions: ${displayWidth}w x ${displayHeight}h pixels`;
            }
            
            // Update the display
            dimensionsDisplay.textContent = dimensionsText;
            
            // Force visibility
            dimensionsDisplay.style.display = 'block';
            dimensionsDisplay.style.visibility = 'visible';
            dimensionsDisplay.style.opacity = '1';
            
            console.log('Updated dimensions display:', dimensionsText);
        } catch (error) {
            console.error('Error updating dimensions display:', error);
        }
    }
    
    // Track current view mode
    let isLandscapeMode = false;
    
    // Listen for dimension changes
    function listenForDimensionChanges() {
        try {
            const widthInput = document.getElementById('width') || document.getElementById('output-width');
            const heightInput = document.getElementById('height') || document.getElementById('output-height');
            
            if (widthInput) {
                widthInput.addEventListener('change', function() {
                    const dimensions = getUserDimensions();
                    updateDimensionsDisplay(dimensions.width, dimensions.height);
                });
                widthInput.addEventListener('input', function() {
                    const dimensions = getUserDimensions();
                    updateDimensionsDisplay(dimensions.width, dimensions.height);
                });
            }
            
            if (heightInput) {
                heightInput.addEventListener('change', function() {
                    const dimensions = getUserDimensions();
                    updateDimensionsDisplay(dimensions.width, dimensions.height);
                });
                heightInput.addEventListener('input', function() {
                    const dimensions = getUserDimensions();
                    updateDimensionsDisplay(dimensions.width, dimensions.height);
                });
            }
            
            // Listen for paper size changes
            const paperSizeSelect = document.getElementById('paper-auto-size');
            if (paperSizeSelect) {
                paperSizeSelect.addEventListener('change', function() {
                    setTimeout(function() {
                        const dimensions = getUserDimensions();
                        updateDimensionsDisplay(dimensions.width, dimensions.height);
                    }, 100);
                });
            }
            
            // Listen for DPI changes
            const dpiSelect = document.getElementById('dpi-selector') || document.getElementById('dpi');
            if (dpiSelect) {
                dpiSelect.addEventListener('change', function() {
                    const dimensions = getUserDimensions();
                    updateDimensionsDisplay(dimensions.width, dimensions.height);
                });
            }
            
            // Listen for Combined View button clicks
            setTimeout(function() {
                // Use known IDs from the current HTML to avoid invalid selectors
                const byId = id => document.getElementById(id);
                const btns = {
                    landscape: byId('view-star-street-landscape-btn'),
                    portrait: byId('view-star-street-portrait-btn'),
                    star: byId('view-star-map-btn'),
                    street: byId('view-street-map-btn'),
                    canvas: byId('view-star-map-canvas-btn')
                };

                if (btns.landscape) {
                    btns.landscape.addEventListener('click', function() {
                        console.log('Landscape button clicked!');
                        isLandscapeMode = true;
                        setTimeout(function() {
                            const dimensions = getUserDimensions();
                            updateDimensionsDisplay(dimensions.width, dimensions.height);
                        }, 500);
                    });
                }
                if (btns.portrait) {
                    btns.portrait.addEventListener('click', function() {
                        console.log('Portrait button clicked!');
                        isLandscapeMode = false;
                        setTimeout(function() {
                            const dimensions = getUserDimensions();
                            updateDimensionsDisplay(dimensions.width, dimensions.height);
                        }, 500);
                    });
                }
                ['star','street','canvas'].forEach(key => {
                    const b = btns[key];
                    if (b) {
                        b.addEventListener('click', function() {
                            console.log('Other view button clicked - resetting to normal');
                            isLandscapeMode = false;
                            setTimeout(function() {
                                const dimensions = getUserDimensions();
                                updateDimensionsDisplay(dimensions.width, dimensions.height);
                            }, 500);
                        });
                    }
                });
            }, 1000);
            
            return true;
        } catch (error) {
            console.error('Error listening for dimension changes:', error);
            return false;
        }
    }
    
    // Initialize
    function initialize() {
        console.log('Initializing dimensions display...');
        
        // Set up event listeners
        listenForDimensionChanges();
        
        // Create initial display
        const dimensions = getUserDimensions();
        updateDimensionsDisplay(dimensions.width, dimensions.height);
        
        // Mark as initialized
        initialized = true;
        
        console.log('✓ Dimensions display initialized successfully');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
})();

/* END OF CODE - Cline - 2025-06-22 17:17 File: js/dimensions-fix-v2.js */
