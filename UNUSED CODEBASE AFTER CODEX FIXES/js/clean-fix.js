// Clean Fix - A single, clean implementation to fix all issues

document.addEventListener('DOMContentLoaded', function() {
    console.log("Clean Fix loaded");
    
    // Fix 1: Make the PREVIEW button work
    fixPreviewButton();
    
    // Fix 2: Fix the styling issues
    fixStylingIssues();
    
    // Fix 3: Fix the color pickers
    fixColorPickers();
    
    // Fix 4: Fix the Advanced Options panel
    fixAdvancedOptions();
    
    // Fix 5: Fix the custom alerts
    fixCustomAlerts();
    
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
            console.log("Generate button clicked - Clean Fix");
            generateStarMapClean();
            return false;
        });
        
        // Auto-trigger the generate function on page load
        setTimeout(function() {
            console.log("Auto-triggering generate button click - Clean Fix");
            generateStarMapClean();
        }, 1000);
    }
    
    // Function to generate the star map
    function generateStarMapClean() {
        console.log("Generating star map with Clean Fix");
        
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
            drawStars(ctx, canvas.width, canvas.height);
            
            // Draw text
            drawText(ctx, canvas.width, canvas.height);
            
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
    
    // Function to draw stars
    function drawStars(ctx, width, height) {
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
        const advancedOptions2 = window.advancedStyleOptions || {};
        if (advancedOptions2.constellationBounds) {
            drawConstellationBounds(ctx, centerX, centerY, radius, advancedOptions2.constellationLineWidth || 1.0);
        }
        
        // Draw constellation labels if enabled
        if (advancedOptions2.constellationLabels) {
            drawConstellationLabels(ctx, centerX, centerY, radius);
        }
        
        // Draw star labels if enabled
        if (advancedOptions2.starLabels) {
            drawStarLabels(ctx, centerX, centerY, radius);
        }
    }
    
    // Function to draw constellation bounds
    function drawConstellationBounds(ctx, centerX, centerY, radius, lineWidth) {
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
    
    // Function to draw constellation labels
    function drawConstellationLabels(ctx, centerX, centerY, radius) {
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
    
    // Function to draw star labels
    function drawStarLabels(ctx, centerX, centerY, radius) {
        ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        const stars = [
            { name: 'Polaris', angle: Math.PI * 0.1, distance: 0.3 },
            { name: 'Vega', angle: Math.PI * 0.5, distance: 0.4 },
            { name: 'Sirius', angle: Math.PI * 0.9, distance: 0.7 },
            { name: 'Betelgeuse', angle: Math.PI * 1.3, distance: 0.5 },
            { name: 'Antares', angle: Math.PI * 1.7, distance: 0.6 }
        ];
        
        stars.forEach(star => {
            const x = centerX + Math.cos(star.angle) * star.distance * radius;
            const y = centerY + Math.sin(star.angle) * star.distance * radius;
            
            // Draw a small circle for the star
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
            ctx.fill();
            
            // Draw the star name
            ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
            ctx.fillText(star.name, x, y + 15);
        });
    }
    
    // Function to draw text
    function drawText(ctx, width, height) {
        // Get text inputs
        const text1 = document.getElementById('text-entry-1')?.value || "";
        const text2 = document.getElementById('text-entry-2')?.value || "";
        const text3 = document.getElementById('text-entry-3')?.value || "";
        
        // Draw text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        if (text1) {
            // Get font settings
            const fontFamily = document.getElementById('font-family-1')?.value || "Arial";
            const fontSize = document.getElementById('font-size-1')?.value || "48";
            const isBold = document.getElementById('text-bold-1')?.checked || false;
            const isItalic = document.getElementById('text-italic-1')?.checked || false;
            const fontColor = document.getElementById('font-color-1')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            ctx.fillText(text1, width / 2, height * 0.7);
        }
        
        if (text2) {
            // Get font settings
            const fontFamily = document.getElementById('font-family-2')?.value || "Arial";
            const fontSize = document.getElementById('font-size-2')?.value || "24";
            const isBold = document.getElementById('text-bold-2')?.checked || false;
            const isItalic = document.getElementById('text-italic-2')?.checked || false;
            const fontColor = document.getElementById('font-color-2')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            ctx.fillText(text2, width / 2, height * 0.8);
        }
        
        if (text3) {
            // Get font settings
            const fontFamily = document.getElementById('font-family-3')?.value || "Arial";
            const fontSize = document.getElementById('font-size-3')?.value || "16";
            const isBold = document.getElementById('text-bold-3')?.checked || false;
            const isItalic = document.getElementById('text-italic-3')?.checked || false;
            const fontColor = document.getElementById('font-color-3')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            ctx.fillText(text3, width / 2, height * 0.85);
        }
        
        // Draw date
        const date = document.getElementById('date')?.value;
        if (date) {
            // Get font settings
            const fontFamily = document.getElementById('fixed-date-font')?.value || "Arial";
            const fontSize = document.getElementById('fixed-date-size')?.value || "14";
            const isBold = document.getElementById('fixed-date-bold')?.checked || false;
            const isItalic = document.getElementById('fixed-date-italic')?.checked || false;
            const fontColor = document.getElementById('fixed-date-color')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            ctx.fillText(formattedDate, width / 2, height * 0.9);
        }
        
        // Draw coordinates
        const latitude = document.getElementById('latitude')?.value;
        const longitude = document.getElementById('longitude')?.value;
        if (latitude && longitude) {
            // Get font settings
            const fontFamily = document.getElementById('fixed-coords-font')?.value || "Arial";
            const fontSize = document.getElementById('fixed-coords-size')?.value || "14";
            const isBold = document.getElementById('fixed-coords-bold')?.checked || false;
            const isItalic = document.getElementById('fixed-coords-italic')?.checked || false;
            const fontColor = document.getElementById('fixed-coords-color')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            ctx.fillText(`${latitude}° N, ${longitude}° W`, width / 2, height * 0.95);
        }
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
    
    // Function to fix Advanced Options panel
    function fixAdvancedOptions() {
        console.log("Fixing Advanced Options panel");
        
        // Fix the Advanced Options container
        const advancedOptionsContainer = document.getElementById('advanced-options-container');
        if (advancedOptionsContainer) {
            advancedOptionsContainer.style.width = "60%";
            advancedOptionsContainer.style.marginLeft = "auto";
            advancedOptionsContainer.style.marginRight = "auto";
        }
    }
    
    // Function to fix custom alerts
    function fixCustomAlerts() {
        console.log("Fixing custom alerts");
        
        // Get the load and save settings buttons
        const loadSettingsBtn = document.getElementById('loadSettingsBtn');
        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        
        // Add event listeners to the buttons
        if (loadSettingsBtn) {
            // Store the original click handler
            const originalLoadClick = loadSettingsBtn.onclick;
            
            // Replace with our custom handler
            loadSettingsBtn.onclick = function(event) {
                // Show custom alert
                showCustomAlert("Create Your Star Map", "Loading settings...", function() {
                    // Call the original handler if it exists
                    if (typeof originalLoadClick === 'function') {
                        originalLoadClick.call(loadSettingsBtn, event);
                    }
                });
                
                // Prevent default
                return false;
            };
        }
        
        if (saveSettingsBtn) {
            // Store the original click handler
            const originalSaveClick = saveSettingsBtn.onclick;
            
            // Replace with our custom handler
            saveSettingsBtn.onclick = function(event) {
                // Show custom alert
                showCustomAlert("Create Your Star Map", "Saving settings...", function() {
                    // Call the original handler if it exists
                    if (typeof originalSaveClick === 'function') {
                        originalSaveClick.call(saveSettingsBtn, event);
                    }
                });
                
                // Prevent default
                return false;
            };
        }
        
        // Function to show a custom alert
        function showCustomAlert(title, message, callback) {
            // Create the alert container
            const alertContainer = document.createElement('div');
            alertContainer.className = 'custom-alert';
            alertContainer.style.position = 'fixed';
            alertContainer.style.top = '20px';
            alertContainer.style.left = '50%';
            alertContainer.style.transform = 'translateX(-50%)';
            alertContainer.style.backgroundColor = '#f8f9fa';
            alertContainer.style.border = '1px solid #ddd';
            alertContainer.style.borderRadius = '4px';
            alertContainer.style.padding = '15px 20px';
            alertContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            alertContainer.style.zIndex = '9999';
            alertContainer.style.fontFamily = 'Arial, sans-serif';
            alertContainer.style.maxWidth = '400px';
            alertContainer.style.textAlign = 'center';
            
            // Create the title
            const alertTitle = document.createElement('div');
            alertTitle.className = 'custom-alert-title';
            alertTitle.textContent = title;
            alertTitle.style.fontWeight = 'bold';
            alertTitle.style.marginBottom = '10px';
            alertTitle.style.color = '#2196F3';
            
            // Create the content
            const alertContent = document.createElement('div');
            alertContent.className = 'custom-alert-content';
            alertContent.textContent = message;
            alertContent.style.marginBottom = '15px';
            
            // Create the button
            const alertButton = document.createElement('button');
            alertButton.className = 'custom-alert-button';
            alertButton.textContent = 'OK';
            alertButton.style.backgroundColor = '#2196F3';
            alertButton.style.color = 'white';
            alertButton.style.border = 'none';
            alertButton.style.padding = '8px 15px';
            alertButton.style.borderRadius = '4px';
            alertButton.style.cursor = 'pointer';
            alertButton.onclick = function() {
                // Remove the alert
                document.body.removeChild(alertContainer);
                
                // Call the callback
                if (typeof callback === 'function') {
                    callback();
                }
            };
            
            // Add everything to the container
            alertContainer.appendChild(alertTitle);
            alertContainer.appendChild(alertContent);
            alertContainer.appendChild(alertButton);
            
            // Add the container to the body
            document.body.appendChild(alertContainer);
            
            // Focus the button
            alertButton.focus();
        }
        
        // Override the default alert function
        const originalAlert = window.alert;
        window.alert = function(message) {
            showCustomAlert("Create Your Star Map", message);
        };
    }
    
    console.log("Clean Fix applied");
});

// Make the function globally available
window.generateStarMapClean = function() {
    console.log("generateStarMapClean called from global scope");
    // The actual implementation is inside the DOMContentLoaded event handler
};
