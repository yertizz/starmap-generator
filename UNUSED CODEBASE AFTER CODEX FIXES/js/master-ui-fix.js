/* Master UI Fix - Comprehensive solution for all UI issues */

(function() {
    console.log('Master UI Fix loading...');
    
    // Track initialization to prevent overwrites
    const initialized = {
        fixedLayers: false,
        combinedOptions: false,
        zoom: false
    };
    
    // 1. Fix Fixed Layers completely
    function fixFixedLayers() {
        if (initialized.fixedLayers) return;
        
        const fixedTextContent = document.querySelector('.fixed-text-content');
        if (!fixedTextContent) return;
        
        // Add title if missing
        if (!fixedTextContent.querySelector('h3')) {
            const title = document.createElement('h3');
            title.textContent = 'Fixed Layers';
            title.style.cssText = `
                font-weight: bold !important;
                font-size: 1.15em !important;
                color: #0056b3 !important;
                border-bottom: 1px solid #eee !important;
                padding: 0 15px 10px 15px !important;
                margin-bottom: 15px !important;
                text-align: center !important;
                display: block !important;
            `;
            fixedTextContent.insertBefore(title, fixedTextContent.firstChild);
        }
        
        // Ensure font-size dropdowns exist
        const fontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '48px', '56px', '64px', '72px', '80px', '96px', '112px', '128px'];
        
        // Add date font-size if missing
        if (!document.getElementById('fixed-font-size-date')) {
            const dateFontFamily = document.getElementById('fixed-font-family-date');
            if (dateFontFamily) {
                const fontSizeSelect = document.createElement('select');
                fontSizeSelect.id = 'fixed-font-size-date';
                fontSizeSelect.className = 'font-size-select';
                fontSizeSelect.style.cssText = 'width: 70px; margin-left: 5px;';
                
                fontSizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    if (size === '72px') option.selected = true;
                    fontSizeSelect.appendChild(option);
                });
                
                dateFontFamily.parentNode.insertBefore(fontSizeSelect, dateFontFamily.nextSibling);
            }
        }
        
        // Add coords font-size if missing
        if (!document.getElementById('fixed-font-size-coords')) {
            const coordsFontFamily = document.getElementById('fixed-font-family-coords');
            if (coordsFontFamily) {
                const fontSizeSelect = document.createElement('select');
                fontSizeSelect.id = 'fixed-font-size-coords';
                fontSizeSelect.className = 'font-size-select';
                fontSizeSelect.style.cssText = 'width: 70px; margin-left: 5px;';
                
                fontSizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    if (size === '14px') option.selected = true;
                    fontSizeSelect.appendChild(option);
                });
                
                coordsFontFamily.parentNode.insertBefore(fontSizeSelect, coordsFontFamily.nextSibling);
            }
        }
        
        // Sync date and coordinates values
        syncFixedLayerValues();
        
        initialized.fixedLayers = true;
    }
    
    // Sync Fixed Layer values
    function syncFixedLayerValues() {
        // Date sync
        const dateInput = document.getElementById('date');
        const fixedDateValue = document.getElementById('fixed-date-value');
        
        if (dateInput && fixedDateValue) {
            const updateDate = () => {
                if (!dateInput.value) return;
                
                try {
                    // Parse date parts
                    const dateParts = dateInput.value.split('-');
                    const year = parseInt(dateParts[0]);
                    const month = parseInt(dateParts[1]);
                    const day = parseInt(dateParts[2]);
                    
                    // Format date manually to avoid timezone issues
                    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                                   'July', 'August', 'September', 'October', 'November', 'December'];
                    const formattedDate = `${months[month - 1]} ${day}, ${year}`;
                    
                    fixedDateValue.textContent = formattedDate;
                    
                    // Also update Text Placements date
                    const textPlacementDate = document.getElementById('text-placement-content-date');
                    if (textPlacementDate) {
                        textPlacementDate.textContent = formattedDate;
                    }
                } catch (e) {
                    console.error('Date format error:', e);
                }
            };
            
            dateInput.addEventListener('change', updateDate);
            updateDate();
        }
        
        // Coordinates sync
        const latLongDisplay = document.getElementById('latLongDisplay');
        const fixedCoordsValue = document.getElementById('fixed-coords-value');
        
        if (latLongDisplay && fixedCoordsValue) {
            const updateCoords = () => {
                const coords = latLongDisplay.textContent.trim();
                if (coords && coords !== 'Lat: ... | Long: ...') {
                    fixedCoordsValue.textContent = coords;
                }
            };
            
            const observer = new MutationObserver(updateCoords);
            observer.observe(latLongDisplay, { childList: true, characterData: true, subtree: true });
            updateCoords();
        }
    }
    
    // 2. Fix Combined View Options properly
    function fixCombinedViewOptions() {
        if (initialized.combinedOptions) return;
        
        // Apply styles immediately to prevent visual jump
        const style = document.createElement('style');
        style.textContent = `
            /* Combined View Options styling */
            .settings-row > div:has(div:contains("Combined View Options:")) {
                text-align: center !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
            }
            
            /* Title styling */
            .settings-row > div > div:first-child:contains("Combined View Options:") {
                font-weight: bold !important;
                font-size: 1.15em !important;
                color: #0056b3 !important;
                border-bottom: 1px solid #eee !important;
                padding: 0 15px 10px 15px !important;
                margin-bottom: 15px !important;
                text-align: center !important;
                width: 100% !important;
            }
            
            /* Slider row */
            .settings-row > div > div:has(#circle-overlap-percent) {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                width: 100% !important;
                margin-bottom: 10px !important;
            }
            
            /* Slider width */
            #circle-overlap-percent {
                width: 200px !important;
                max-width: 200px !important;
            }
            
            /* Map order row */
            .settings-row > div > div:has(input[name="map-order"]) {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                width: 100% !important;
                gap: 20px !important;
            }
        `;
        document.head.appendChild(style);
        
        // Set default overlap to 10%
        const overlapSlider = document.getElementById('circle-overlap-percent');
        const overlapValue = document.getElementById('overlap-value');
        if (overlapSlider && overlapValue) {
            overlapSlider.value = '10';
            overlapValue.textContent = '10%';
            if (window.combinedViewSettings) {
                window.combinedViewSettings.overlapPercent = 10;
            }
        }
        
        initialized.combinedOptions = true;
    }
    
    // 3. Fix zoom to only affect images inside circles
    function fixZoomProperly() {
        if (initialized.zoom) return;
        
        // Remove duplicate zoom sliders
        const zoomSliders = document.querySelectorAll('#zoom-slider');
        if (zoomSliders.length > 1) {
            for (let i = 1; i < zoomSliders.length; i++) {
                zoomSliders[i].closest('.settings-row')?.remove();
            }
        }
        
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        
        if (!zoomSlider) return;
        
        // Reset to 100%
        zoomSlider.value = '100';
        if (zoomValue) zoomValue.textContent = '100';
        
        // Override existing zoom handlers
        zoomSlider.oninput = null;
        zoomSlider.onchange = null;
        
        // New zoom handler that only affects images
        function handleZoom() {
            const scale = zoomSlider.value / 100;
            if (zoomValue) zoomValue.textContent = zoomSlider.value;
            
            // Store zoom scale globally for drawing functions to use
            window.imageZoomScale = scale;
            
            // Dispatch event for any listeners
            window.dispatchEvent(new CustomEvent('zoomChanged', { detail: { scale: scale } }));
            
            console.log('Zoom changed to:', zoomSlider.value + '%');
        }
        
        zoomSlider.addEventListener('input', handleZoom);
        
        initialized.zoom = true;
    }
    
    // Initialize everything
    function initialize() {
        console.log('Master UI Fix initializing...');
        
        // Fix everything immediately
        fixFixedLayers();
        fixCombinedViewOptions();
        fixZoomProperly();
        
        // Set up observers to maintain fixes
        const observer = new MutationObserver(() => {
            if (!initialized.fixedLayers) fixFixedLayers();
            if (!initialized.combinedOptions) fixCombinedViewOptions();
            if (!initialized.zoom) fixZoomProperly();
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        console.log('Master UI Fix complete');
    }
    
    // Start when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Expose for debugging
    window.masterUIFix = {
        reset: () => {
            Object.keys(initialized).forEach(key => initialized[key] = false);
            initialize();
        }
    };
})();
