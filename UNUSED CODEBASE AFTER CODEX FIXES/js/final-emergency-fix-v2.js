// Final Emergency Fix V2 - Comprehensive fix for all issues

document.addEventListener('DOMContentLoaded', function() {
    console.log("Final Emergency Fix V2 loaded");
    
    // Fix 1: Make the PREVIEW button work
    fixPreviewButton();
    
    // Fix 2: Fix the color pickers to use HEX as default
    fixColorPickers();
    
    // Fix 3: Fix the styling issues
    fixStylingIssues();
    
    // Fix 4: Ensure the Advanced Star Map Options button works
    fixAdvancedOptions();
    
    // Function to fix the PREVIEW button
    function fixPreviewButton() {
        console.log("Fixing PREVIEW button");
        
        // Get the generate button
        const generateBtn = document.getElementById('generateBtn');
        if (!generateBtn) {
            console.error("Generate button not found");
            return;
        }
        
        // Remove any existing event listeners and onclick attribute
        const newBtn = generateBtn.cloneNode(true);
        generateBtn.parentNode.replaceChild(newBtn, generateBtn);
        
        // Add a direct click event listener
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Generate button clicked - Final Emergency Fix V2");
            
            // Try to call the original generateStarMap function if it exists
            if (typeof window.generateStarMap === 'function') {
                window.generateStarMap();
            } else {
                // Fallback to our own implementation
                generateStarMapEmergency();
            }
            
            return false;
        });
        
        // Force generate the star map immediately
        setTimeout(function() {
            console.log("Forcing star map generation");
            if (typeof window.generateStarMap === 'function') {
                window.generateStarMap();
            } else {
                generateStarMapEmergency();
            }
        }, 1000);
    }
    
    // Function to fix color pickers
    function fixColorPickers() {
        console.log("Fixing color pickers");
        
        // Check if vanilla-picker is loaded
        if (typeof Picker !== 'undefined') {
            console.log("Vanilla Picker found, applying HEX fix");
            
            // Override the Picker prototype to make HEX the default
            const originalShow = Picker.prototype.show;
            
            Picker.prototype.show = function() {
                // Call the original show method
                const result = originalShow.apply(this, arguments);
                
                // Find the color mode select element
                const modeSelect = this._domEdit.querySelector('.picker_editor select');
                if (modeSelect) {
                    // Find the HEX option
                    for (let i = 0; i < modeSelect.options.length; i++) {
                        if (modeSelect.options[i].value === 'hex') {
                            // Select the HEX option
                            modeSelect.selectedIndex = i;
                            
                            // Trigger the change event
                            const event = new Event('change');
                            modeSelect.dispatchEvent(event);
                            
                            console.log("HEX mode selected as default");
                            break;
                        }
                    }
                }
                
                return result;
            };
            
            // Initialize color pickers for all color inputs
            const colorInputs = document.querySelectorAll('input[type="color"]');
            colorInputs.forEach(input => {
                // Check if a picker is already attached
                if (!input._picker) {
                    // Create a new picker
                    const picker = new Picker({
                        parent: input,
                        popup: 'right',
                        color: input.value,
                        alpha: false,
                        editor: true,
                        editorFormat: 'hex',
                        onDone: function(color) {
                            input.value = color.hex;
                            
                            // Trigger change event
                            const event = new Event('change', { bubbles: true });
                            input.dispatchEvent(event);
                        }
                    });
                    
                    // Store the picker on the input
                    input._picker = picker;
                    
                    // Override the click event
                    input.addEventListener('click', function(e) {
                        e.preventDefault();
                        picker.show();
                    });
                }
            });
            
            console.log("Color pickers initialized with HEX as default");
        } else {
            console.error("Vanilla Picker not found");
        }
    }
    
    // Function to fix styling issues
    function fixStylingIssues() {
        console.log("Fixing styling issues");
        
        // Fix 1: Adjust date input width to match occasion field
        const dateInput = document.querySelector('.top-row .form-group:nth-child(2) input[type="date"]');
        if (dateInput) {
            dateInput.style.width = "calc(100% - 20px)";
            dateInput.style.boxSizing = "border-box";
            dateInput.style.paddingRight = "0";
            dateInput.style.maxWidth = "100%";
        }
        
        // Fix 2: Fix styling in Fixed Text Styling container
        const fixedTextStylingWrappers = document.querySelectorAll('.fixed-text-styling .text-entry-wrapper');
        fixedTextStylingWrappers.forEach(wrapper => {
            wrapper.style.display = "flex";
            wrapper.style.flexWrap = "wrap";
            wrapper.style.alignItems = "center";
            wrapper.style.gap = "5px";
            wrapper.style.marginBottom = "10px";
            wrapper.style.padding = "5px";
        });
        
        // Fix 3: Remove extra line break above Output Dimensions
        const inputSections = document.querySelectorAll('.grouped-sections-container .input-section');
        inputSections.forEach(section => {
            section.style.marginTop = "0";
            section.style.marginBottom = "10px";
        });
        
        // Fix 4: Center align the button container
        const buttonContainer = document.querySelector('.button-container');
        if (buttonContainer) {
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "center";
            buttonContainer.style.alignItems = "center";
            buttonContainer.style.gap = "10px";
            buttonContainer.style.margin = "20px auto";
        }
        
        // Add event listener for zoom slider
        const zoomSlider = document.getElementById('zoom-slider');
        if (zoomSlider) {
            zoomSlider.addEventListener('input', updateZoom);
        }
    }
    
    // Function to fix Advanced Options panel
    function fixAdvancedOptions() {
        console.log("Fixing Advanced Options panel");
        
        // Check if the Star Map Style dropdown exists
        const starMapStyleSelect = document.getElementById('star-map-style');
        if (!starMapStyleSelect) {
            console.log("Star Map Style select not found, creating it");
            
            // Find the container for the Star Map Style
            const container = document.querySelector('.grouped-sections-container');
            if (!container) {
                console.error("Container not found for Star Map Style");
                return;
            }
            
            // Create a new div for the Star Map Style
            const starMapStyleDiv = document.createElement('div');
            starMapStyleDiv.className = 'input-section';
            starMapStyleDiv.innerHTML = `
                <label class="center-align">Star Map Style:</label>
                <div class="star-map-style-container">
                    <select id="star-map-style" class="star-map-style-select">
                        <option value="standard">Standard</option>
                        <option value="minimal">Minimal</option>
                        <option value="detailed">Detailed</option>
                        <option value="vintage">Vintage</option>
                        <option value="modern">Modern</option>
                    </select>
                    <button type="button" id="advanced-options-btn" class="settings-button">Advanced Options</button>
                </div>
            `;
            
            // Insert the div before the Image Format section
            const imageFormatSection = document.querySelector('.grouped-sections-container:last-of-type');
            if (imageFormatSection) {
                container.parentNode.insertBefore(starMapStyleDiv, imageFormatSection);
            } else {
                container.parentNode.appendChild(starMapStyleDiv);
            }
            
            // Style the Star Map Style dropdown
            const starMapStyleSelectNew = document.getElementById('star-map-style');
            if (starMapStyleSelectNew) {
                starMapStyleSelectNew.style.width = "150px";
                starMapStyleSelectNew.style.maxWidth = "150px";
                starMapStyleSelectNew.style.marginRight = "10px";
            }
            
            // Style the Advanced Options button
            const advancedOptionsBtn = document.getElementById('advanced-options-btn');
            if (advancedOptionsBtn) {
                advancedOptionsBtn.style.marginTop = "10px";
                advancedOptionsBtn.style.backgroundColor = "#2196F3";
                advancedOptionsBtn.style.color = "white";
                advancedOptionsBtn.style.border = "none";
                advancedOptionsBtn.style.padding = "8px 15px";
                advancedOptionsBtn.style.borderRadius = "4px";
                advancedOptionsBtn.style.cursor = "pointer";
            }
        }
        
        // Check if the Advanced Options button exists
        const advancedOptionsBtn = document.getElementById('advanced-options-btn');
        if (!advancedOptionsBtn) {
            console.error("Advanced Options button not found");
            return;
        }
        
        // Check if the Advanced Options container exists
        let advancedOptionsContainer = document.getElementById('advanced-options-container');
        if (!advancedOptionsContainer) {
            console.log("Advanced Options container not found, creating it");
            
            // Create the Advanced Options container
            advancedOptionsContainer = document.createElement('div');
            advancedOptionsContainer.id = 'advanced-options-container';
            advancedOptionsContainer.style.display = 'none';
            advancedOptionsContainer.style.marginTop = '10px';
            advancedOptionsContainer.style.padding = '15px';
            advancedOptionsContainer.style.border = '1px solid #ddd';
            advancedOptionsContainer.style.borderRadius = '4px';
            advancedOptionsContainer.style.backgroundColor = '#f9f9f9';
            advancedOptionsContainer.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
            advancedOptionsContainer.style.width = '60%';
            advancedOptionsContainer.style.marginLeft = 'auto';
            advancedOptionsContainer.style.marginRight = 'auto';
            
            // Create the Advanced Options content
            advancedOptionsContainer.innerHTML = `
                <h3 style="margin-top: 0; text-align: center;">Advanced Star Map Options</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <!-- Quadrant N/W Container #1: Features -->
                    <div class="options-container" style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9;">
                        <h4 style="color: #2196F3; margin-top: 0; margin-bottom: 10px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Features</h4>
                        <div>
                            <label><input type="checkbox" id="milky-way-toggle"> Milky Way</label>
                        </div>
                        <div>
                            <label><input type="checkbox" id="constellation-bounds-toggle"> Constellation Bounds</label>
                        </div>
                        <div>
                            <label><input type="checkbox" id="stars-glow-toggle"> Stars Glow</label>
                        </div>
                    </div>
                    
                    <!-- Quadrant N/E Container #3: Star Settings -->
                    <div class="options-container" style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9;">
                        <h4 style="color: #2196F3; margin-top: 0; margin-bottom: 10px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Star Settings</h4>
                        <div>
                            <label>Star Size: <input type="range" id="star-size-slider" min="0.5" max="3" step="0.1" value="1.0"> <span id="star-size-value">1.0</span></label>
                        </div>
                        <div>
                            <label>Star Number: <input type="range" id="star-number-slider" min="500" max="5000" step="100" value="2000"> <span id="star-number-value">2000</span></label>
                        </div>
                        <div>
                            <label>Const. Line Width: <input type="range" id="constellation-line-width-slider" min="0.1" max="3" step="0.1" value="1.0"> <span id="constellation-line-width-value">1.0</span></label>
                        </div>
                    </div>
                    
                    <!-- Quadrant S/W Container #2: Celestial Bodies -->
                    <div class="options-container" style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9;">
                        <h4 style="color: #2196F3; margin-top: 0; margin-bottom: 10px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Celestial Bodies</h4>
                        <div>
                            <label><input type="checkbox" id="moon-toggle"> Moon</label>
                        </div>
                        <div>
                            <label><input type="checkbox" id="sun-toggle"> Sun</label>
                        </div>
                        <div>
                            <label><input type="checkbox" id="planets-toggle"> Planets</label>
                        </div>
                        <div>
                            <label><input type="checkbox" id="ecliptic-path-toggle"> Ecliptic Sun Path</label>
                        </div>
                    </div>
                    
                    <!-- Quadrant S/E Container #4: Labels -->
                    <div class="options-container" style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9;">
                        <h4 style="color: #2196F3; margin-top: 0; margin-bottom: 10px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Labels</h4>
                        <div>
                            <label><input type="checkbox" id="planet-labels-toggle"> Planet Labels</label>
                        </div>
                        <div>
                            <label><input type="checkbox" id="constellation-labels-toggle"> Constellation Labels</label>
                        </div>
                        <div>
                            <label><input type="checkbox" id="star-labels-toggle"> Star Labels</label>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 10px; text-align: center;">
                    <button type="button" id="apply-advanced-options-btn" class="settings-button">Apply Changes</button>
                    <button type="button" id="close-advanced-options-btn" class="settings-button" style="background-color: #f44336;">Close</button>
                </div>
            `;
            
            // Add the Advanced Options container after the Star Map Style dropdown
            const starMapStyleSelect = document.getElementById('star-map-style');
            if (starMapStyleSelect) {
                const parentContainer = starMapStyleSelect.closest('.input-section');
                if (parentContainer) {
                    parentContainer.appendChild(advancedOptionsContainer);
                }
            }
        }
        
        // Add event listener to the Advanced Options button
        advancedOptionsBtn.addEventListener('click', function() {
            const container = document.getElementById('advanced-options-container');
            if (container) {
                container.style.display = container.style.display === 'none' ? 'block' : 'none';
            }
        });
        
        // Add event listener to the Close button
        const closeBtn = document.getElementById('close-advanced-options-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                const container = document.getElementById('advanced-options-container');
                if (container) {
                    container.style.display = 'none';
                }
            });
        }
        
        // Add event listener to the Apply button
        const applyBtn = document.getElementById('apply-advanced-options-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', function() {
                updateAdvancedOptions();
                
                // Regenerate the star map
                if (typeof window.generateStarMap === 'function') {
                    window.generateStarMap();
                } else {
                    generateStarMapEmergency();
                }
                
                // Close the Advanced Options container
                const container = document.getElementById('advanced-options-container');
                if (container) {
                    container.style.display = 'none';
                }
            });
        }
        
        // Add event listeners for sliders
        const starSizeSlider = document.getElementById('star-size-slider');
        const starSizeValue = document.getElementById('star-size-value');
        if (starSizeSlider && starSizeValue) {
            starSizeSlider.addEventListener('input', function() {
                starSizeValue.textContent = this.value;
            });
        }
        
        const starNumberSlider = document.getElementById('star-number-slider');
        const starNumberValue = document.getElementById('star-number-value');
        if (starNumberSlider && starNumberValue) {
            starNumberSlider.addEventListener('input', function() {
                starNumberValue.textContent = this.value;
            });
        }
        
        const constellationLineWidthSlider = document.getElementById('constellation-line-width-slider');
        const constellationLineWidthValue = document.getElementById('constellation-line-width-value');
        if (constellationLineWidthSlider && constellationLineWidthValue) {
            constellationLineWidthSlider.addEventListener('input', function() {
                constellationLineWidthValue.textContent = this.value;
            });
        }
    }
    
    // Function to update advanced options
    function updateAdvancedOptions() {
        // Create the advancedStyleOptions object if it doesn't exist
        if (!window.advancedStyleOptions) {
            window.advancedStyleOptions = {};
        }
        
        // Features
        window.advancedStyleOptions.milkyWay = document.getElementById('milky-way-toggle')?.checked || false;
        window.advancedStyleOptions.constellationBounds = document.getElementById('constellation-bounds-toggle')?.checked || false;
        window.advancedStyleOptions.starsGlow = document.getElementById('stars-glow-toggle')?.checked || false;
        
        // Star settings
        window.advancedStyleOptions.starSize = parseFloat(document.getElementById('star-size-slider')?.value || 1.0);
        window.advancedStyleOptions.starNumber = parseInt(document.getElementById('star-number-slider')?.value || 2000);
        window.advancedStyleOptions.constellationLineWidth = parseFloat(document.getElementById('constellation-line-width-slider')?.value || 1.0);
        
        // Celestial bodies
        window.advancedStyleOptions.moon = document.getElementById('moon-toggle')?.checked || false;
        window.advancedStyleOptions.sun = document.getElementById('sun-toggle')?.checked || false;
        window.advancedStyleOptions.planets = document.getElementById('planets-toggle')?.checked || false;
        window.advancedStyleOptions.eclipticPath = document.getElementById('ecliptic-path-toggle')?.checked || false;
        
        // Labels
        window.advancedStyleOptions.planetLabels = document.getElementById('planet-labels-toggle')?.checked || false;
        window.advancedStyleOptions.constellationLabels = document.getElementById('constellation-labels-toggle')?.checked || false;
        window.advancedStyleOptions.starLabels = document.getElementById('star-labels-toggle')?.checked || false;
        
        console.log("Advanced options updated:", window.advancedStyleOptions);
    }
    
    // Function to update zoom
    function updateZoom() {
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        const canvas = document.getElementById('star-map-canvas');
        
        if (zoomSlider && zoomValue && canvas) {
            const zoom = parseInt(zoomSlider.value);
            zoomValue.textContent = zoom;
            canvas.style.transform = `scale(${zoom / 100})`;
            canvas.style.transformOrigin = "center top";
        }
    }
    
    // Emergency implementation of star map generation
    function generateStarMapEmergency() {
        console.log("Generating star map with Emergency Implementation");
        
        try {
            // Get canvas and context
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                console.error("Canvas not found");
                return;
            }
            
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions
            const width = parseInt(document.getElementById('output-width')?.value || 800);
            const height = parseInt(document.getElementById('output-height')?.value || 800);
            
            canvas.width = width;
            canvas.height = height;
            
            // Get colors
            const starFieldColor = document.getElementById('star-field-color')?.value || '#000000';
            const outsideColor = document.getElementById('outside-color')?.value || '#0a0e1a';
            
            // Draw background
            ctx.fillStyle = outsideColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw star field area (circular)
            ctx.fillStyle = starFieldColor;
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2 - 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw stars
            drawStarsEmergency(ctx, canvas.width, canvas.height);
            
            // Draw text
            drawTextEmergency(ctx, canvas.width, canvas.height);
            
            // Enable the download button
            const downloadBtn = document.getElementById('downloadBtn');
            if (downloadBtn) {
                downloadBtn.disabled = false;
            }
            
            // Update zoom
            updateZoom();
            
            console.log("Star map generated successfully");
        } catch (error) {
            console.error("Error generating star map:", error);
            alert("Error generating star map: " + error.message);
        }
    }
    
    // Function to draw stars (emergency implementation)
    function drawStarsEmergency(ctx, width, height) {
        // Calculate center and radius
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;
        
        // Get advanced options if available
        const advancedOptions = window.advancedStyleOptions || {
            starNumber: 2000,
            starSize: 1.0,
            starsGlow: false
        };
        
        // Draw random stars
        const numStars = advancedOptions.starNumber || 2000;
        const starSizeMultiplier = advancedOptions.starSize || 1.0;
        const starsGlow = advancedOptions.starsGlow || false;
        
        for (let i = 0; i < numStars; i++) {
            // Generate random angle and distance from center
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;
            
            // Calculate x and y coordinates
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            const starRadius = Math.random() * 1.5 * starSizeMultiplier;
            const opacity = Math.random();
            
            ctx.beginPath();
            ctx.arc(x, y, starRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
            
            // Add glow effect if enabled
            if (starsGlow && Math.random() > 0.8) {
                ctx.beginPath();
                ctx.arc(x, y, starRadius * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
                ctx.fill();
            }
        }
        
        // Draw some brighter stars
        const numBrightStars = Math.floor(numStars / 20);
        
        for (let i = 0; i < numBrightStars; i++) {
            // Generate random angle and distance from center
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;
            
            // Calculate x and y coordinates
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            const starRadius = (1 + Math.random() * 2) * starSizeMultiplier;
            
            ctx.beginPath();
            ctx.arc(x, y, starRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
            
            // Add glow effect if enabled
            if (starsGlow) {
                ctx.beginPath();
                ctx.arc(x, y, starRadius * 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fill();
            }
        }
        
        // Draw some colored stars
        const numColoredStars = Math.floor(numStars / 50);
        const starColors = [
            'rgba(255, 200, 200, 0.8)', // Red
            'rgba(200, 200, 255, 0.8)', // Blue
            'rgba(255, 255, 200, 0.8)', // Yellow
            'rgba(200, 255, 200, 0.8)'  // Green
        ];
        
        for (let i = 0; i < numColoredStars; i++) {
            // Generate random angle and distance from center
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;
            
            // Calculate x and y coordinates
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            const starRadius = (1 + Math.random() * 2) * starSizeMultiplier;
            const colorIndex = Math.floor(Math.random() * starColors.length);
            
            ctx.beginPath();
            ctx.arc(x, y, starRadius, 0, Math.PI * 2);
            ctx.fillStyle = starColors[colorIndex];
            ctx.fill();
            
            // Add glow effect if enabled
            if (starsGlow) {
                ctx.beginPath();
                ctx.arc(x, y, starRadius * 3, 0, Math.PI * 2);
                const glowColor = starColors[colorIndex].replace('0.8', '0.2');
                ctx.fillStyle = glowColor;
                ctx.fill();
            }
        }
        
        // Draw constellation bounds if enabled
        if (advancedOptions.constellationBounds) {
            drawConstellationBoundsEmergency(ctx, centerX, centerY, radius, advancedOptions.constellationLineWidth || 1.0);
        }
        
        // Draw constellation labels if enabled
        if (advancedOptions.constellationLabels) {
            drawConstellationLabelsEmergency(ctx, centerX, centerY, radius);
        }
        
        // Draw star labels if enabled
        if (advancedOptions.starLabels) {
            drawStarLabelsEmergency(ctx, centerX, centerY, radius);
        }
    }
    
    // Function to draw constellation bounds (emergency implementation)
    function drawConstellationBoundsEmergency(ctx, centerX, centerY, radius, lineWidth) {
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
        ctx.lineWidth = lineWidth;
        
        // Draw some random constellation bounds
        const numConstellations = 5;
        
        for (let i = 0; i < numConstellations; i++) {
            const numPoints = 4 + Math.floor(Math.random() * 4);
            const points = [];
            
            // Generate random points for the constellation
            for (let j = 0; j < numPoints; j++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = (0.3 + Math.random() * 0.6) * radius;
                
                points.push({
                    x: centerX + Math.cos(angle) * distance,
                    y: centerY + Math.sin(angle) * distance
                });
            }
            
            // Draw the constellation
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            
            for (let j = 1; j < points.length; j++) {
                ctx.lineTo(points[j].x, points[j].y);
            }
            
            ctx.closePath();
            ctx.stroke();
        }
    }
    
    // Function to draw constellation labels (emergency implementation)
    function drawConstellationLabelsEmergency(ctx, centerX, centerY, radius) {
        ctx.fillStyle = 'rgba(200, 200, 255, 0.8)';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        
        const constellations = [
            { name: 'Orion', angle: Math.PI * 0.2, distance: 0.6 },
            { name: 'Ursa Major', angle: Math.PI * 0.7, distance: 0.7 },
            { name: 'Cassiopeia', angle: Math.PI * 1.2, distance: 0.5 },
            { name: 'Cygnus', angle: Math.PI * 1.7, distance: 0.6 }
        ];
        
        constellations.forEach(constellation => {
            const x = centerX + Math.cos(constellation.angle) * constellation.distance * radius;
            const y = centerY + Math.sin(constellation.angle) * constellation.distance * radius;
            
            ctx.fillText(constellation.name, x, y);
        });
    }
    
    // Function to draw star labels (emergency implementation)
    function drawStarLabelsEmergency(ctx, centerX, centerY,
