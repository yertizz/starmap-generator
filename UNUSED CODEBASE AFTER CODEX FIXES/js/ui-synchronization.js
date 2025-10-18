/* UI Synchronization Module - Handles Fixed Layers and View Coordination */

(function() {
    console.log('UI Synchronization Module loading...');
    
    // 1. Fixed Layers Initialization
    function initializeFixedLayers() {
        // Add Fixed Layers title if missing
        const fixedTextContent = document.querySelector('.fixed-text-content');
        if (fixedTextContent && !fixedTextContent.querySelector('h3')) {
            const title = document.createElement('h3');
            title.textContent = 'Fixed Layers';
            title.style.cssText = `
                font-weight: bold !important;
                font-size: 1.15em !important;
                color: #0056b3 !important;
                border: none !important;
                border-bottom: 1px solid #eee !important;
                padding: 0 15px 10px 15px !important;
                margin-bottom: 15px !important;
                text-align: center !important;
                display: block !important;
                margin-left: auto !important;
                margin-right: auto !important;
            `;
            fixedTextContent.insertBefore(title, fixedTextContent.firstChild);
        }
        
        // Clear initial placeholder values
        const fixedDateValue = document.getElementById('fixed-date-value');
        const fixedCoordsValue = document.getElementById('fixed-coords-value');
        
        if (fixedDateValue) {
            fixedDateValue.textContent = '';
            fixedDateValue.dataset.initialized = 'true';
        }
        
        if (fixedCoordsValue) {
            fixedCoordsValue.textContent = '';
            fixedCoordsValue.dataset.initialized = 'true';
        }
    }
    
    // 2. Date and Coordinate Synchronization
    function setupDataSynchronization() {
        // Date synchronization
        function updateDateDisplays() {
            const dateInput = document.getElementById('date');
            const timeInput = document.getElementById('time');
            const showTimeToggle = document.getElementById('show-time-toggle');
            
            if (!dateInput || !dateInput.value) return;
            
            try {
                // Parse date correctly to avoid timezone issues
                const dateParts = dateInput.value.split('-');
                const year = parseInt(dateParts[0]);
                const month = parseInt(dateParts[1]) - 1; // JavaScript months are 0-based
                const day = parseInt(dateParts[2]);
                
                const date = new Date(year, month, day);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                let formattedDate = date.toLocaleDateString('en-US', options);
                
                // Add time if toggle is checked
                if (showTimeToggle && showTimeToggle.checked && timeInput && timeInput.value) {
                    const [hours, minutes] = timeInput.value.split(':');
                    const hour = parseInt(hours);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const hour12 = hour % 12 || 12;
                    formattedDate += `, ${hour12}:${minutes} ${ampm}`;
                }
                
                // Update all date displays
                const fixedDateValue = document.getElementById('fixed-date-value');
                const textPlacementDate = document.getElementById('text-placement-content-date');
                
                if (fixedDateValue && fixedDateValue.dataset.initialized) {
                    fixedDateValue.textContent = formattedDate;
                }
                
                if (textPlacementDate) {
                    textPlacementDate.textContent = formattedDate;
                }
                
                console.log('Date synchronized:', formattedDate);
            } catch (e) {
                console.error('Date sync error:', e);
            }
        }
        
        // Coordinate synchronization
        function updateCoordinateDisplays() {
            const latLongDisplay = document.getElementById('latLongDisplay');
            if (!latLongDisplay) return;
            
            const coordsText = latLongDisplay.textContent.trim();
            
            // Only update if we have actual coordinates
            if (coordsText && coordsText !== 'Lat: ... | Long: ...') {
                const fixedCoordsValue = document.getElementById('fixed-coords-value');
                const textPlacementCoords = document.getElementById('text-placement-content-coords');
                
                if (fixedCoordsValue && fixedCoordsValue.dataset.initialized) {
                    fixedCoordsValue.textContent = coordsText;
                }
                
                if (textPlacementCoords) {
                    textPlacementCoords.textContent = coordsText;
                }
                
                console.log('Coordinates synchronized:', coordsText);
            }
        }
        
        // Set up event listeners
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const showTimeToggle = document.getElementById('show-time-toggle');
        
        if (dateInput) {
            ['change', 'input', 'blur'].forEach(event => {
                dateInput.addEventListener(event, updateDateDisplays);
            });
        }
        
        if (timeInput) {
            ['change', 'input', 'blur'].forEach(event => {
                timeInput.addEventListener(event, updateDateDisplays);
            });
        }
        
        if (showTimeToggle) {
            showTimeToggle.addEventListener('change', updateDateDisplays);
        }
        
        // Watch for coordinate changes
        const latLongDisplay = document.getElementById('latLongDisplay');
        if (latLongDisplay) {
            const observer = new MutationObserver(updateCoordinateDisplays);
            observer.observe(latLongDisplay, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
        
        // Manual coordinate input listeners
        ['latitude', 'longitude'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                ['input', 'change', 'blur'].forEach(event => {
                    input.addEventListener(event, () => {
                        setTimeout(updateCoordinateDisplays, 100);
                    });
                });
            }
        });
        
        // Initial synchronization
        setTimeout(() => {
            updateDateDisplays();
            updateCoordinateDisplays();
        }, 500);
    }
    
    // 3. Canvas View Management
    function setupCanvasViewManagement() {
        // Handle combined view canvas orientation
        function adjustCanvasOrientation(isLandscape) {
            const canvas = document.getElementById('star-map-canvas');
            const widthInput = document.getElementById('output-width');
            const heightInput = document.getElementById('output-height');
            
            if (!canvas || !widthInput || !heightInput) return;
            
            const width = parseInt(widthInput.value);
            const height = parseInt(heightInput.value);
            
            // Adjust canvas for combined views
            if (isLandscape) {
                // Ensure landscape orientation
                canvas.width = Math.max(width, height);
                canvas.height = Math.min(width, height);
            } else {
                // Ensure portrait orientation
                canvas.width = Math.min(width, height);
                canvas.height = Math.max(width, height);
            }
            
            // Update canvas display
            const maxDisplayHeight = window.innerHeight * 0.6;
            const aspectRatio = canvas.width / canvas.height;
            
            if (canvas.height > maxDisplayHeight) {
                canvas.style.height = maxDisplayHeight + 'px';
                canvas.style.width = (maxDisplayHeight * aspectRatio) + 'px';
            } else {
                canvas.style.height = 'auto';
                canvas.style.width = '100%';
                canvas.style.maxWidth = '100%';
            }
            
            console.log(`Canvas adjusted for ${isLandscape ? 'landscape' : 'portrait'} view`);
        }
        
        // Set up view button handlers
        const viewHandlers = {
            'view-star-street-landscape-btn': () => adjustCanvasOrientation(true),
            'view-star-street-portrait-btn': () => adjustCanvasOrientation(false),
            'download-star-street-landscape-btn': () => adjustCanvasOrientation(true),
            'download-star-street-portrait-btn': () => adjustCanvasOrientation(false)
        };
        
        Object.keys(viewHandlers).forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', viewHandlers[btnId]);
            }
        });
    }
    
    // 4. Zoom Functionality
    function setupZoomFunctionality() {
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        
        if (!zoomSlider) return;
        
        // Set default to 100%
        zoomSlider.value = '100';
        if (zoomValue) zoomValue.textContent = '100';
        
        // Handle zoom changes
        zoomSlider.addEventListener('input', function() {
            const scale = this.value / 100;
            if (zoomValue) zoomValue.textContent = this.value;
            
            // Apply zoom to canvas and all image containers
            const elements = [
                document.getElementById('star-map-canvas'),
                ...document.querySelectorAll('.canvas-container img'),
                ...document.querySelectorAll('.canvas-container canvas'),
                ...document.querySelectorAll('.map-image-container'),
                ...document.querySelectorAll('.combined-view-container')
            ];
            
            elements.forEach(element => {
                if (element) {
                    element.style.transform = `scale(${scale})`;
                    element.style.transformOrigin = 'center center';
                }
            });
        });
    }
    
    // 5. Fix Combined View Options alignment
    function fixCombinedViewOptionsAlignment() {
        // Wait for elements to be ready
        setTimeout(() => {
            // Find the Combined View Options container
            const containers = document.querySelectorAll('.settings-row > div');
            containers.forEach(container => {
                if (container.textContent.includes('Combined View Options:')) {
                    // Apply container-wide centering
                    container.style.cssText += `
                        text-align: center !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                    `;
                    
                    // Fix title
                    const titleDiv = container.querySelector('div:first-child');
                    if (titleDiv && titleDiv.textContent.includes('Combined View Options:')) {
                        titleDiv.style.cssText = `
                            font-weight: bold !important;
                            font-size: 1.15em !important;
                            color: #0056b3 !important;
                            border-bottom: 1px solid #eee !important;
                            padding: 0 15px 10px 15px !important;
                            margin-bottom: 15px !important;
                            text-align: center !important;
                            width: 100% !important;
                        `;
                    }
                    
                    // Fix overlap slider row
                    const overlapDiv = container.querySelector('div:nth-child(2)');
                    if (overlapDiv) {
                        overlapDiv.style.cssText += `
                            display: flex !important;
                            justify-content: center !important;
                            align-items: center !important;
                            width: 100% !important;
                            margin-bottom: 10px !important;
                        `;
                        
                        // Fix the slider itself - reduce width by 50%
                        const overlapSlider = document.getElementById('circle-overlap-percent');
                        if (overlapSlider) {
                            overlapSlider.style.cssText += `
                                width: 200px !important;
                                max-width: 200px !important;
                            `;
                            // Set default to 10%
                            overlapSlider.value = '10';
                            const overlapValue = document.getElementById('overlap-value');
                            if (overlapValue) {
                                overlapValue.textContent = '10%';
                            }
                            if (window.combinedViewSettings) {
                                window.combinedViewSettings.overlapPercent = 10;
                            }
                        }
                    }
                    
                    // Fix map order row
                    const mapOrderDiv = container.querySelector('div:nth-child(3)');
                    if (mapOrderDiv) {
                        mapOrderDiv.style.cssText += `
                            display: flex !important;
                            justify-content: center !important;
                            align-items: center !important;
                            width: 100% !important;
                            gap: 20px !important;
                        `;
                    }
                }
            });
        }, 1000);
    }
    
    // Initialize all modules
    function initialize() {
        console.log('Initializing UI Synchronization...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(runInitialization, 500);
            });
        } else {
            setTimeout(runInitialization, 500);
        }
    }
    
    function runInitialization() {
        initializeFixedLayers();
        setupDataSynchronization();
        setupCanvasViewManagement();
        setupZoomFunctionality();
        fixCombinedViewOptionsAlignment();
        
        console.log('UI Synchronization initialized successfully');
    }
    
    // Start initialization
    initialize();
    
    // Expose API for debugging
    window.uiSync = {
        reinitialize: runInitialization,
        syncDate: () => {
            const event = new Event('change');
            const dateInput = document.getElementById('date');
            if (dateInput) dateInput.dispatchEvent(event);
        },
        syncCoords: () => {
            const latLongDisplay = document.getElementById('latLongDisplay');
            if (latLongDisplay) {
                const event = new Event('change');
                latLongDisplay.dispatchEvent(event);
            }
        }
    };
})();
