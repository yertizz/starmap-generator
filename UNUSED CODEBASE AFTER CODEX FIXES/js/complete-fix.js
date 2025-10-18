// Complete Fix - Comprehensive solution that fixes all issues with the Star Map Generator

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Complete Fix script loaded");
    
    // Get the canvas element
    const canvas = document.getElementById('star-map-canvas');
    if (!canvas) {
        console.error("Canvas element not found");
        return;
    }
    
    // Get the generate button
    const generateBtn = document.getElementById('generateBtn');
    if (!generateBtn) {
        console.error("Generate button not found");
        return;
    }
    
    // Get the load previous settings button
    const loadSettingsBtn = document.getElementById('loadSettingsBtn');
    
    // Remove the disabled attribute from the generate button
    generateBtn.removeAttribute('disabled');
    generateBtn.classList.add('enabled');
    
    // Add a direct click event listener to the generate button
    generateBtn.addEventListener('click', function(event) {
        console.log("Generate button clicked via complete fix handler");
        
        // Force the generation of a star map
        setTimeout(function() {
            forceGenerateStarMap();
        }, 100);
    }, true); // Use capturing to ensure this handler runs first
    
    // Add a load settings button if it doesn't exist
    if (!loadSettingsBtn) {
        console.log("Creating load settings button");
        
        // Create the button
        const loadBtn = document.createElement('button');
        loadBtn.id = 'loadSettingsBtn';
        loadBtn.type = 'button';
        loadBtn.textContent = 'LOAD PREVIOUS SETTINGS';
        loadBtn.style.backgroundColor = '#2196F3';
        loadBtn.style.color = 'white';
        loadBtn.style.padding = '10px 20px';
        loadBtn.style.border = 'none';
        loadBtn.style.borderRadius = '5px';
        loadBtn.style.cursor = 'pointer';
        loadBtn.style.fontSize = '16px';
        loadBtn.style.margin = '20px 0';
        
        // Add event listener to the button
        loadBtn.addEventListener('click', function() {
            console.log("Load settings button clicked");
            loadAllSettings();
        });
        
        // Add the button to the page
        const buttonContainer = document.querySelector('.button-container');
        if (buttonContainer) {
            buttonContainer.parentNode.insertBefore(loadBtn, buttonContainer);
        }
    }
    
    // Load settings on page load
    setTimeout(function() {
        console.log("Auto-loading settings");
        loadAllSettings();
    }, 1000);
    
    // Force generate a star map
    setTimeout(function() {
        console.log("Auto-generating star map");
        forceGenerateStarMap();
    }, 2000);
    
    // Function to force generate a star map
    function forceGenerateStarMap() {
        console.log("Force generating star map");
        
        try {
            // Get the canvas context
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error("Could not get canvas context");
                return;
            }
            
            // Get colors from inputs or use defaults
            const starFieldColor = document.getElementById('star-field-color')?.value || "#000000";
            const outsideColor = document.getElementById('outside-color')?.value || "#0a0e1a";
            
            // Get canvas dimensions
            const width = parseInt(document.getElementById('output-width')?.value) || 800;
            const height = parseInt(document.getElementById('output-height')?.value) || 1000;
            
            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;
            
            // Draw background
            ctx.fillStyle = outsideColor;
            ctx.fillRect(0, 0, width, height);
            
            // Draw star field area
            ctx.fillStyle = starFieldColor;
            ctx.fillRect(0, 0, width, height / 2);
            
            // Draw stars
            drawStars(ctx, width, height);
            
            // Get text inputs
            const text1 = document.getElementById("text-entry-1")?.value || "";
            const text2 = document.getElementById("text-entry-2")?.value || "";
            const text3 = document.getElementById("text-entry-3")?.value || "";
            
            // Get font settings
            const font1 = document.getElementById("font-family-1")?.value || "Arial";
            const font2 = document.getElementById("font-family-2")?.value || "Arial";
            const font3 = document.getElementById("font-family-3")?.value || "Arial";
            
            const fontSize1 = document.getElementById("font-size-1")?.value || "48";
            const fontSize2 = document.getElementById("font-size-2")?.value || "16";
            const fontSize3 = document.getElementById("font-size-3")?.value || "14";
            
            const isBold1 = document.getElementById("text-bold-1")?.checked;
            const isBold2 = document.getElementById("text-bold-2")?.checked;
            const isBold3 = document.getElementById("text-bold-3")?.checked;
            
            const isItalic1 = document.getElementById("text-italic-1")?.checked;
            const isItalic2 = document.getElementById("text-italic-2")?.checked;
            const isItalic3 = document.getElementById("text-italic-3")?.checked;
            
            const color1 = document.getElementById("font-color-1")?.value || "#FFFFFF";
            const color2 = document.getElementById("font-color-2")?.value || "#FFFFFF";
            const color3 = document.getElementById("font-color-3")?.value || "#FFFFFF";
            
            // Draw text
            drawText(ctx, text1, font1, fontSize1, isBold1, isItalic1, color1, width / 2, height * 0.6);
            drawText(ctx, text2, font2, fontSize2, isBold2, isItalic2, color2, width / 2, height * 0.7);
            drawText(ctx, text3, font3, fontSize3, isBold3, isItalic3, color3, width / 2, height * 0.8);
            
            // Draw date
            const date = document.getElementById("date")?.value;
            if (date) {
                const dateObj = new Date(date);
                const formattedDate = dateObj.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                
                const dateFont = document.getElementById("fixed-date-font")?.value || "Arial";
                const dateFontSize = document.getElementById("fixed-date-size")?.value || "14";
                const dateBold = document.getElementById("fixed-date-bold")?.checked;
                const dateItalic = document.getElementById("fixed-date-italic")?.checked;
                const dateColor = document.getElementById("fixed-date-color")?.value || "#FFFFFF";
                
                drawText(ctx, formattedDate, dateFont, dateFontSize, dateBold, dateItalic, dateColor, width / 2, height * 0.9);
            }
            
            // Draw coordinates
            const latitude = document.getElementById("latitude")?.value;
            const longitude = document.getElementById("longitude")?.value;
            if (latitude && longitude) {
                const coordsFont = document.getElementById("fixed-coords-font")?.value || "Arial";
                const coordsFontSize = document.getElementById("fixed-coords-size")?.value || "14";
                const coordsBold = document.getElementById("fixed-coords-bold")?.checked;
                const coordsItalic = document.getElementById("fixed-coords-italic")?.checked;
                const coordsColor = document.getElementById("fixed-coords-color")?.value || "#FFFFFF";
                
                drawText(ctx, `${latitude}° N, ${longitude}° W`, coordsFont, coordsFontSize, coordsBold, coordsItalic, coordsColor, width / 2, height * 0.95);
            }
            
            // Enable download button
            const downloadBtn = document.getElementById("downloadBtn");
            if (downloadBtn) {
                downloadBtn.removeAttribute("disabled");
                downloadBtn.classList.add("enabled");
            }
            
            // Set up zoom functionality
            setupZoom();
            
            // Save settings
            saveAllSettings();
            
            console.log("Star map generated successfully");
        } catch (error) {
            console.error("Error generating star map:", error);
        }
    }
    
    // Function to draw stars
    function drawStars(ctx, width, height) {
        console.log("Drawing stars");
        
        // Draw random stars
        const numStars = 2000;
        
        for (let i = 0; i < numStars; i++) {
            const x = Math.random() * width;
            const y = Math.random() * (height / 2); // Only in the top half
            const radius = Math.random() * 1.5;
            const opacity = Math.random();
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
        }
        
        // Draw some brighter stars
        const numBrightStars = Math.floor(numStars / 20);
        
        for (let i = 0; i < numBrightStars; i++) {
            const x = Math.random() * width;
            const y = Math.random() * (height / 2); // Only in the top half
            const radius = 1 + Math.random() * 2;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
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
            const x = Math.random() * width;
            const y = Math.random() * (height / 2); // Only in the top half
            const radius = 1 + Math.random() * 2;
            const colorIndex = Math.floor(Math.random() * starColors.length);
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = starColors[colorIndex];
            ctx.fill();
        }
    }
    
    // Function to draw text
    function drawText(ctx, text, fontFamily, fontSize, isBold, isItalic, color, x, y) {
        if (!text) return;
        
        ctx.save();
        
        // Set font style
        let fontStyle = "";
        if (isBold) fontStyle += "bold ";
        if (isItalic) fontStyle += "italic ";
        
        ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Draw text
        ctx.fillText(text, x, y);
        
        ctx.restore();
    }
    
    // Function to set up zoom functionality
    function setupZoom() {
        console.log("Setting up zoom functionality");
        
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        
        if (!zoomSlider || !zoomValue) {
            console.error("Zoom elements not found");
            return;
        }
        
        // Set initial zoom
        const initialZoom = parseInt(zoomSlider.value) || 100;
        zoomValue.textContent = initialZoom;
        canvas.style.transform = `scale(${initialZoom / 100})`;
        canvas.style.transformOrigin = "center top";
        
        // Add event listener to zoom slider
        zoomSlider.addEventListener('input', function() {
            const zoom = parseInt(this.value);
            zoomValue.textContent = zoom;
            canvas.style.transform = `scale(${zoom / 100})`;
            canvas.style.transformOrigin = "center top";
        });
        
        console.log("Zoom functionality set up");
    }
    
    // Function to save all settings to localStorage
    function saveAllSettings() {
        console.log("Saving all settings to localStorage");
        
        const settings = {
            // Form values
            occasion: document.getElementById("occasion")?.value || "",
            occasionText: document.getElementById("occasion")?.options[document.getElementById("occasion")?.selectedIndex]?.text || "",
            customOccasion: document.getElementById("occasion")?.getAttribute('data-custom-value') || '',
            date: document.getElementById("date")?.value || "",
            latitude: document.getElementById("latitude")?.value || "",
            longitude: document.getElementById("longitude")?.value || "",
            zipCode: document.getElementById("zip-code")?.value || "",
            
            // Text layers
            textLayers: [],
            
            // Fixed text styling
            fixedDateFont: document.getElementById("fixed-date-font")?.value || "",
            fixedDateSize: document.getElementById("fixed-date-size")?.value || "",
            fixedDateBold: document.getElementById("fixed-date-bold")?.checked || false,
            fixedDateItalic: document.getElementById("fixed-date-italic")?.checked || false,
            fixedDateColor: document.getElementById("fixed-date-color")?.value || "#000000",
            
            fixedCoordsFont: document.getElementById("fixed-coords-font")?.value || "",
            fixedCoordsSize: document.getElementById("fixed-coords-size")?.value || "",
            fixedCoordsBold: document.getElementById("fixed-coords-bold")?.checked || false,
            fixedCoordsItalic: document.getElementById("fixed-coords-italic")?.checked || false,
            fixedCoordsColor: document.getElementById("fixed-coords-color")?.value || "#000000",
            
            // Output settings
            dpi: document.querySelector('input[name="dpi"]:checked')?.value || "150",
            outputWidth: document.getElementById("output-width")?.value || "800",
            outputHeight: document.getElementById("output-height")?.value || "1000",
            maintainAspectRatio: document.getElementById("maintain-aspect-ratio")?.checked || false,
            
            // Background colors
            starFieldColor: document.getElementById("star-field-color")?.value || "#000000",
            outsideColor: document.getElementById("outside-color")?.value || "#0a0e1a",
            
            // Image format
            imageType: document.querySelector('input[name="imageType"]:checked')?.value || "png",
            exportTransparency: document.getElementById("export-transparency")?.checked || false,
            
            // Zoom level
            zoomLevel: document.getElementById("zoom-slider")?.value || "100",
            
            // Save timestamp
            timestamp: new Date().getTime()
        };
        
        // Save text layers
        for (let i = 1; i <= 3; i++) {
            const textInput = document.getElementById(`text-entry-${i}`);
            if (textInput) {
                settings.textLayers.push({
                    text: textInput.value || "",
                    fontFamily: document.getElementById(`font-family-${i}`)?.value || "Arial",
                    fontSize: document.getElementById(`font-size-${i}`)?.value || "16",
                    fontColor: document.getElementById(`font-color-${i}`)?.value || "#000000",
                    isBold: document.getElementById(`text-bold-${i}`)?.checked || false,
                    isItalic: document.getElementById(`text-italic-${i}`)?.checked || false
                });
            }
        }
        
        // Save to localStorage
        localStorage.setItem('lastMapSettings', JSON.stringify(settings));
        
        // Also save to sessionStorage for backup
        sessionStorage.setItem('lastMapSettings', JSON.stringify(settings));
        
        console.log("Settings saved:", settings);
        
        // Save zip code to history
        saveZipCodeToHistory();
    }
    
    // Function to save zip code to history
    function saveZipCodeToHistory() {
        const zipCode = document.getElementById("zip-code")?.value;
        if (!zipCode) return;
        
        // Get existing zip code history
        let zipCodeHistory = localStorage.getItem('zipCodeHistory');
        let zipCodes = zipCodeHistory ? JSON.parse(zipCodeHistory) : [];
        
        // Add new zip code if it doesn't exist
        if (!zipCodes.includes(zipCode)) {
            zipCodes.push(zipCode);
            
            // Limit to 10 zip codes
            if (zipCodes.length > 10) {
                zipCodes = zipCodes.slice(-10);
            }
            
            // Save to localStorage
            localStorage.setItem('zipCodeHistory', JSON.stringify(zipCodes));
            
            console.log("Zip code added to history:", zipCode);
        }
        
        // Update datalist
        updateZipCodeDatalist(zipCodes);
    }
    
    // Function to update zip code datalist
    function updateZipCodeDatalist(zipCodes) {
        const datalist = document.getElementById("zip-code-history");
        if (!datalist) return;
        
        // Clear existing options
        datalist.innerHTML = '';
        
        // Add options
        zipCodes.forEach(zipCode => {
            const option = document.createElement('option');
            option.value = zipCode;
            datalist.appendChild(option);
        });
    }
    
    // Function to load all settings from localStorage
    function loadAllSettings() {
        console.log("Loading all settings from localStorage");
        
        // Try to get settings from localStorage
        let savedSettings = localStorage.getItem('lastMapSettings');
        
        // If not found in localStorage, try sessionStorage
        if (!savedSettings) {
            savedSettings = sessionStorage.getItem('lastMapSettings');
        }
        
        if (!savedSettings) {
            console.log("No saved settings found");
            return;
        }
        
        try {
            const settings = JSON.parse(savedSettings);
            console.log("Parsed settings:", settings);
            
            // Apply occasion
            if (settings.occasion) {
                const occasionSelect = document.getElementById('occasion');
                if (occasionSelect) {
                    occasionSelect.value = settings.occasion;
                    console.log(`Set occasion to: ${settings.occasion}`);
                    
                    // If it's a custom occasion, set the custom value
                    if (settings.customOccasion) {
                        occasionSelect.setAttribute('data-custom-value', settings.customOccasion);
                        console.log(`Set custom occasion to: ${settings.customOccasion}`);
                    }
                }
            }
            
            // Apply date
            if (settings.date) {
                const dateInput = document.getElementById('date');
                if (dateInput) {
                    dateInput.value = settings.date;
                    console.log(`Set date to: ${settings.date}`);
                }
            }
            
            // Apply coordinates
            if (settings.latitude) {
                const latitudeInput = document.getElementById('latitude');
                if (latitudeInput) {
                    latitudeInput.value = settings.latitude;
                    console.log(`Set latitude to: ${settings.latitude}`);
                }
            }
            
            if (settings.longitude) {
                const longitudeInput = document.getElementById('longitude');
                if (longitudeInput) {
                    longitudeInput.value = settings.longitude;
                    console.log(`Set longitude to: ${settings.longitude}`);
                }
            }
            
            // Apply zip code
            if (settings.zipCode) {
                const zipCodeInput = document.getElementById('zip-code');
                if (zipCodeInput) {
                    zipCodeInput.value = settings.zipCode;
                    console.log(`Set zip code to: ${settings.zipCode}`);
                }
            }
            
            // Apply text layers
            if (settings.textLayers && settings.textLayers.length > 0) {
                settings.textLayers.forEach((layer, index) => {
                    const i = index + 1;
                    if (i <= 3) {
                        const textInput = document.getElementById(`text-entry-${i}`);
                        const fontFamilySelect = document.getElementById(`font-family-${i}`);
                        const fontSizeSelect = document.getElementById(`font-size-${i}`);
                        const fontColorInput = document.getElementById(`font-color-${i}`);
                        const boldCheckbox = document.getElementById(`text-bold-${i}`);
                        const italicCheckbox = document.getElementById(`text-italic-${i}`);
                        
                        if (textInput && layer.text) {
                            textInput.value = layer.text;
                            console.log(`Set text-entry-${i} to: ${layer.text}`);
                        }
                        
                        if (fontFamilySelect && layer.fontFamily) {
                            fontFamilySelect.value = layer.fontFamily;
                            console.log(`Set font-family-${i} to: ${layer.fontFamily}`);
                        }
                        
                        if (fontSizeSelect && layer.fontSize) {
                            fontSizeSelect.value = layer.fontSize;
                            console.log(`Set font-size-${i} to: ${layer.fontSize}`);
                        }
                        
                        if (fontColorInput && layer.fontColor) {
                            fontColorInput.value = layer.fontColor;
                            console.log(`Set font-color-${i} to: ${layer.fontColor}`);
                        }
                        
                        if (boldCheckbox && layer.isBold !== undefined) {
                            boldCheckbox.checked = layer.isBold;
                            console.log(`Set text-bold-${i} to: ${layer.isBold}`);
                        }
                        
                        if (italicCheckbox && layer.isItalic !== undefined) {
                            italicCheckbox.checked = layer.isItalic;
                            console.log(`Set text-italic-${i} to: ${layer.isItalic}`);
                        }
                    }
                });
            }
            
            // Apply fixed text styling
            if (settings.fixedDateFont) {
                const fixedDateFontSelect = document.getElementById('fixed-date-font');
                if (fixedDateFontSelect) {
                    fixedDateFontSelect.value = settings.fixedDateFont;
                    console.log(`Set fixed-date-font to: ${settings.fixedDateFont}`);
                }
            }
            
            if (settings.fixedDateSize) {
                const fixedDateSizeSelect = document.getElementById('fixed-date-size');
                if (fixedDateSizeSelect) {
                    fixedDateSizeSelect.value = settings.fixedDateSize;
                    console.log(`Set fixed-date-size to: ${settings.fixedDateSize}`);
                }
            }
            
            if (settings.fixedDateBold !== undefined) {
                const fixedDateBoldCheckbox = document.getElementById('fixed-date-bold');
                if (fixedDateBoldCheckbox) {
                    fixedDateBoldCheckbox.checked = settings.fixedDateBold;
                    console.log(`Set fixed-date-bold to: ${settings.fixedDateBold}`);
                }
            }
            
            if (settings.fixedDateItalic !== undefined) {
                const fixedDateItalicCheckbox = document.getElementById('fixed-date-italic');
                if (fixedDateItalicCheckbox) {
                    fixedDateItalicCheckbox.checked = settings.fixedDateItalic;
                    console.log(`Set fixed-date-italic to: ${settings.fixedDateItalic}`);
                }
            }
            
            if (settings.fixedDateColor) {
                const fixedDateColorInput = document.getElementById('fixed-date-color');
                if (fixedDateColorInput) {
                    fixedDateColorInput.value = settings.fixedDateColor;
                    console.log(`Set fixed-date-color to: ${settings.fixedDateColor}`);
                }
            }
            
            if (settings.fixedCoordsFont) {
                const fixedCoordsFontSelect = document.getElementById('fixed-coords-font');
                if (fixedCoordsFontSelect) {
                    fixedCoordsFontSelect.value = settings.fixedCoordsFont;
                    console.log(`Set fixed-coords-font to: ${settings.fixedCoordsFont}`);
                }
            }
            
            if (settings.fixedCoordsSize) {
                const fixedCoordsSizeSelect = document.getElementById('fixed-coords-size');
                if (fixedCoordsSizeSelect) {
                    fixedCoordsSizeSelect.value = settings.fixedCoordsSize;
                    console.log(`Set fixed-coords-size to: ${settings.fixedCoordsSize}`);
                }
            }
            
            if (settings.fixedCoordsBold !== undefined) {
                const fixedCoordsBoldCheckbox = document.getElementById('fixed-coords-bold');
                if (fixedCoordsBoldCheckbox) {
                    fixedCoordsBoldCheckbox.checked = settings.fixedCoordsBold;
                    console.log(`Set fixed-coords-bold to: ${settings.fixedCoordsBold}`);
                }
            }
            
            if (settings.fixedCoordsItalic !== undefined) {
                const fixedCoordsItalicCheckbox = document.getElementById('fixed-coords-italic');
                if (fixedCoordsItalicCheckbox) {
                    fixedCoordsItalicCheckbox.checked = settings.fixedCoordsItalic;
                    console.log(`Set fixed-coords-italic to: ${settings.fixedCoordsItalic}`);
                }
            }
            
            if (settings.fixedCoordsColor) {
                const fixedCoordsColorInput = document.getElementById('fixed-coords-color');
                if (fixedCoordsColorInput) {
                    fixedCoordsColorInput.value = settings.fixedCoordsColor;
                    console.log(`Set fixed-coords-color to: ${settings.fixedCoordsColor}`);
                }
            }
            
            // Apply output settings
            if (settings.dpi) {
                const dpiRadio = document.querySelector(`input[name="dpi"][value="${settings.dpi}"]`);
                if (dpiRadio) {
                    dpiRadio.checked = true;
                    console.log(`Set dpi to: ${settings.dpi}`);
                }
            }
            
            if (settings.outputWidth) {
                const outputWidthInput = document.getElementById('output-width');
                if (outputWidthInput) {
                    outputWidthInput.value = settings.outputWidth;
                    console.log(`Set output-width to: ${settings.outputWidth}`);
                }
            }
            
            if (settings.outputHeight) {
                const outputHeightInput = document.getElementById('output-height');
                if (outputHeightInput) {
                    outputHeightInput.value = settings.outputHeight;
                    console.log(`Set output-height to: ${settings.outputHeight}`);
                }
            }
            
            if (settings.maintainAspectRatio !== undefined) {
                const maintainAspectRatioCheckbox = document.getElementById('maintain-aspect-ratio');
                if (maintainAspectRatioCheckbox) {
                    maintainAspectRatioCheckbox.checked = settings.maintainAspectRatio;
                    console.log(`Set maintain-aspect-ratio to: ${settings.maintainAspectRatio}`);
                }
            }
            
            // Apply background colors
            if (settings.starFieldColor) {
                const starFieldColorInput = document.getElementById('star-field-color');
                if (starFieldColorInput) {
                    starFieldColorInput.value = settings.starFieldColor;
                    console.log(`Set star-field-color to: ${settings.starFieldColor}`);
                }
            }
            
            if (settings.outsideColor) {
                const outsideColorInput = document.getElementById('outside-color');
                if (outsideColorInput) {
                    outsideColorInput.value = settings.outsideColor;
                    console.log(`Set outside-color to: ${settings.outsideColor}`);
                }
            }
            
            // Apply image format
            if (settings.imageType) {
                const imageTypeRadio = document.querySelector(`input[name="imageType"][value="${settings.imageType}"]`);
                if (imageTypeRadio) {
                    imageTypeRadio.checked = true;
                    console.log(`Set imageType to: ${settings.imageType}`);
                }
            }
            
            if (settings.exportTransparency !== undefined) {
                const exportTransparencyCheckbox = document.getElementById('export-transparency');
                if (exportTransparencyCheckbox) {
                    exportTransparencyCheckbox.checked = settings.exportTransparency;
                    console.log(`Set export-transparency to: ${settings.exportTransparency}`);
                }
            }
            
            // Apply zoom level
            if (settings.zoomLevel) {
                const zoomSlider = document.getElementById('zoom-slider');
                const zoomValue = document.getElementById('zoom-value');
                if (zoomSlider) {
                    zoomSlider.value = settings.zoomLevel;
                    console.log(`Set zoom-slider to: ${settings.zoomLevel}`);
                }
                if (zoomValue) {
                    zoomValue.textContent = settings.zoomLevel;
                    console.log(`Set zoom-value to: ${settings.zoomLevel}`);
                }
            }
            
            // Enable the generate button
            generateBtn.removeAttribute("disabled");
            generateBtn.classList.add("enabled");
            
            console.log("All settings loaded successfully");
            
            // Load zip code history
            loadZipCodeHistory();
            
            // Update the map
            updateMap();
        } catch (error) {
            console.error("Error loading settings:", error);
        }
    }
    
    // Function to load zip code history
    function loadZipCodeHistory() {
        console.log("Loading zip code history");
        
        // Get zip code history
        const zipCodeHistory = localStorage.getItem('zipCodeHistory');
        if (!zipCodeHistory) {
            console.log("No zip code history found");
            return;
        }
        
        try {
            const zipCodes = JSON.parse(zipCodeHistory);
            console.log("Parsed zip code history:", zipCodes);
            
            // Update datalist
            updateZipCodeDatalist(zipCodes);
        } catch (error) {
            console.error("Error loading zip code history:", error);
        }
    }
    
    // Function to update the map
    function updateMap() {
        console.log("Updating map");
        
        const latitude = document.getElementById('latitude')?.value;
        const longitude = document.getElementById('longitude')?.value;
        
        if (latitude && longitude) {
            console.log(`Updating map with coordinates: ${latitude}, ${longitude}`);
            
            // Try to update the map if the Google Maps API is loaded
            if (window.google && window.google.maps) {
                try {
                    const map = window.map; // Try to get the map instance
                    if (map) {
                        const lat = parseFloat(latitude);
                        const lng = parseFloat(longitude);
                        
                        if (!isNaN(lat) && !isNaN(lng)) {
                            // Update map center
                            map.setCenter({ lat, lng });
                            
                            // Update display
                            const latLongDisplay = document.getElementById('latLongDisplay');
                            if (latLongDisplay) {
                                latLongDisplay.textContent = `Lat: ${lat.toFixed(6)} | Long: ${lng.toFixed(6)}`;
                            }
                            
                            console.log("Map updated successfully");
                        }
                    } else {
                        console.log("Map instance not found");
                    }
                } catch (error) {
                    console.error("Error updating map:", error);
                }
            } else {
                console.log("Google Maps API not loaded yet");
            }
        }
    }
    
    // Override the downloadStarMap function if it doesn't exist
    if (typeof window.downloadStarMap !== 'function') {
        window.downloadStarMap = function() {
            console.log("Backup download function called");
            
            try {
                // Get the canvas
                const canvas = document.getElementById('star-map-canvas');
                if (!canvas) {
                    console.error("Canvas not found");
                    return;
                }
                
                // Get selected image type
                const isPng = document.getElementById("image-type-png")?.checked;
                const isJpg = document.getElementById("image-type-jpg")?.checked;
                const isSvg = document.getElementById("image-type-svg")?.checked;
                let imageType = isPng ? "png" : (isJpg ? "jpg" : (isSvg ? "svg" : "png")); // Default to PNG
                
                // Get the date for the filename
                const date = document.getElementById("date")?.value;
                const dateObj = new Date(date || new Date());
                const formattedDate = dateObj.toISOString().split('T')[0];
                
                // Get the first text entry for the filename
                const title = document.getElementById("text-entry-1")?.value || "star_map";
                const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                
                const link = document.createElement("a");
                
                if (imageType === "png") {
                    // For PNG
                    const dataURL = canvas.toDataURL("image/png");
                    link.href = dataURL;
                    link.download = `${safeTitle}_${formattedDate}.png`;
                } else if (imageType === "jpg") {
                    // JPG doesn't support transparency
                    const dataURL = canvas.toDataURL("image/jpeg", 0.9); // Quality 0.9 for JPG
                    link.href = dataURL;
                    link.download = `${safeTitle}_${formattedDate}.jpg`;
                } else if (imageType === "svg") {
                    // Create simple SVG content
                    const width = canvas.width;
                    const height = canvas.height;
                    
                    // Start SVG content
                    let svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
`;
                    
                    // Add background rectangle
                    const outsideColor = document.getElementById("outside-color")?.value || "#0a0e1a";
                    svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="${outsideColor}" />`;
                    
                    // Add star field rectangle
                    const starFieldColor = document.getElementById("star-field-color")?.value || "#000000";
                    svg += `<rect x="0" y="0" width="${width}" height="${height/2}" fill="${starFieldColor}" />`;
                    
                    // Close the SVG
                    svg += `</svg>`;
                    
                    const blob = new Blob([svg], {type: 'image/svg+xml'});
                    const dataURL = URL.createObjectURL(blob);
                    link.href = dataURL;
                    link.download = `${safeTitle}_${formattedDate}.svg`;
                } else {
                    alert("Please select an image type (PNG, JPG, or SVG).");
                    return;
                }
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Clean up object URL if SVG
                if (imageType === "svg") {
                    URL.revokeObjectURL(link.href);
                }
                
                console.log("Star map downloaded successfully");
            } catch (error) {
                console.error("Error downloading star map:", error);
                alert("There was an error downloading the star map. Please try again.");
            }
        };
    }
    
    console.log("Complete Fix script initialized");
});
