/**
 * Canvas Zoom Slider Implementation
 * Matches the previous implementation style shown in the screenshot
 */

(function() {
    'use strict';
    
    console.log('Canvas Zoom Slider: Initializing...');
    
    // Force create zoom if it doesn't exist
    function ensureZoomExists() {
        let zoomContainer = document.getElementById('zoom-container');
        if (!zoomContainer) {
            console.log('Zoom container missing, checking for insertion point...');
            
            // Find where to insert (after Image Format)
            const imageFormatRow = Array.from(document.querySelectorAll('.settings-row')).find(row => 
                row.textContent.includes('Image Format:')
            );
            
            if (imageFormatRow) {
                console.log('Creating zoom slider HTML...');
                const zoomHTML = `
                <div class="form-section zoom-section" id="zoom-container" style="background-color: #e8e8e8; padding: 10px 20px; margin: 10px 0; border-radius: 5px; border: 1px solid #ccc;">
                    <div style="display: flex; align-items: center; gap: 15px; width: 100%; max-width: 600px; margin: 0 auto;">
                        <label style="font-weight: bold; min-width: 60px;">Zoom:</label>
                        <input type="range" id="zoom-slider" min="50" max="200" value="100" style="flex: 1;">
                        <span id="zoom-value" style="min-width: 40px; text-align: right;">100</span>
                        <span style="font-weight: bold;">%</span>
                    </div>
                </div>`;
                
                imageFormatRow.insertAdjacentHTML('afterend', zoomHTML);
                console.log('Zoom slider HTML created!');
            }
        }
        
        // Now check if elements exist
        const slider = document.getElementById('zoom-slider');
        const value = document.getElementById('zoom-value');
        
        if (!slider || !value) {
            console.error('Zoom elements still missing after creation attempt');
            return false;
        }
        
        return true;
    }
    
    // Initialize zoom functionality
    function initializeZoomSlider() {
        // First ensure zoom exists
        if (!ensureZoomExists()) {
            console.error('Failed to ensure zoom exists');
            return;
        }
        
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        const canvas = document.getElementById('star-map-canvas');
        
        if (!zoomSlider || !zoomValue) {
            console.error('Zoom slider elements not found after creation');
            return;
        }
        
        // Style the zoom container to match the screenshot
        const zoomContainer = zoomSlider.closest('.form-section');
        if (zoomContainer) {
            zoomContainer.style.cssText = `
                background-color: #e8e8e8;
                padding: 10px 20px;
                margin: 10px 0;
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            // Update the inner div styling
            const innerDiv = zoomContainer.querySelector('div');
            if (innerDiv) {
                innerDiv.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    max-width: 600px;
                `;
            }
        }
        
        // Style the slider to match the screenshot
        zoomSlider.style.cssText = `
            flex: 1;
            height: 5px;
            background: #ddd;
            outline: none;
            -webkit-appearance: none;
            appearance: none;
            cursor: pointer;
        `;
        
        // Add slider thumb styling
        const style = document.createElement('style');
        style.textContent = `
            #zoom-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                background: #007bff;
                cursor: pointer;
                border-radius: 50%;
                border: 2px solid #fff;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            #zoom-slider::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background: #007bff;
                cursor: pointer;
                border-radius: 50%;
                border: 2px solid #fff;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            #zoom-slider::-webkit-slider-runnable-track {
                width: 100%;
                height: 5px;
                background: #ddd;
                border-radius: 3px;
            }
            
            #zoom-slider::-moz-range-track {
                width: 100%;
                height: 5px;
                background: #ddd;
                border-radius: 3px;
            }
        `;
        document.head.appendChild(style);
        
        // Update zoom value display when slider changes
        zoomSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            zoomValue.textContent = value;
            
            // Apply zoom to canvas if it exists
            if (canvas) {
                applyZoom(canvas, value);
            }
        });
        
        // Also update on change event for better compatibility
        zoomSlider.addEventListener('change', function() {
            const value = parseInt(this.value);
            zoomValue.textContent = value;
            
            if (canvas) {
                applyZoom(canvas, value);
            }
        });
        
        console.log('Canvas Zoom Slider: Initialized successfully');
    }
    
    /**
     * Apply zoom to canvas
     * @param {HTMLCanvasElement} canvas - The canvas element
     * @param {number} zoomPercent - Zoom percentage (50-200)
     */
    function applyZoom(canvas, zoomPercent) {
        const scale = zoomPercent / 100;
        
        // Apply transform
        canvas.style.transform = `scale(${scale})`;
        canvas.style.transformOrigin = 'center center';
        
        // Adjust container if needed
        const container = canvas.parentElement;
        if (container && container.classList.contains('canvas-container')) {
            if (zoomPercent > 100) {
                container.style.overflow = 'auto';
                const padding = 20 + (scale - 1) * 100;
                container.style.padding = `${padding}px`;
            } else {
                container.style.overflow = 'visible';
                container.style.padding = '20px';
            }
        }
        
        console.log(`Canvas Zoom: Applied ${zoomPercent}% zoom`);
    }
    
    // Store zoom functions globally for other scripts to use
    window.canvasZoom = {
        apply: applyZoom,
        reset: function() {
            const zoomSlider = document.getElementById('zoom-slider');
            const zoomValue = document.getElementById('zoom-value');
            if (zoomSlider && zoomValue) {
                zoomSlider.value = 100;
                zoomValue.textContent = '100';
                const canvas = document.getElementById('star-map-canvas');
                if (canvas) {
                    applyZoom(canvas, 100);
                }
            }
        },
        getCurrent: function() {
            const zoomSlider = document.getElementById('zoom-slider');
            return zoomSlider ? parseInt(zoomSlider.value) : 100;
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeZoomSlider);
    } else {
        // DOM already loaded
        setTimeout(initializeZoomSlider, 100);
    }
    
    // Also try to initialize after a longer delay as backup
    setTimeout(function() {
        if (!document.getElementById('zoom-slider')) {
            console.log('Zoom slider still missing after delay, trying to initialize...');
            initializeZoomSlider();
        }
    }, 1000);
    
})();
