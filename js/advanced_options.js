// Advanced Star Map Options UI and Logic

// Assumes global 'advancedStyleOptions' object exists (defined in main_app.js)
// Assumes utility functions like saveCurrentSettings, generateStarMap exist globally or are imported

function createAdvancedOptionsUI() {
    const starMapStyleSelect = document.getElementById('star-map-style');
    const styleContainer = starMapStyleSelect ? starMapStyleSelect.closest('.form-section') : null; // Use form-section as anchor
    if (!styleContainer || document.getElementById('advanced-options-panel')) {
         console.log("Advanced options UI anchor not found or UI already exists.");
        return; // Exit if anchor not found or panel exists
    }

    const panel = document.createElement('div');
    panel.id = 'advanced-options-panel';
    // panel.className = 'grouped-sections-container advanced-options'; // Removed grouped-sections-container
    panel.className = 'advanced-options'; // Simpler class
    panel.style.display = 'none'; // Initially hidden

    // Restructured 4-Quadrant Structure (2x2 Grid) based on HTML structure
    // Note: IDs in this generated HTML MUST match the IDs used in load/update functions
    panel.innerHTML = `
        <div class="section-title">Advanced Star Map Options</div>
        <div class="advanced-options-grid">
            <!-- Quadrant N/W: Features -->
            <fieldset class="advanced-options-quadrant">
                <legend>Features</legend>
                <label><input type="checkbox" id="adv-show-milky-way" data-api-param="showMilkyWay"> Milky Way</label><br>
                <label><input type="checkbox" id="adv-show-constellation-lines" data-api-param="showConstellationLines"> Constellation Lines</label><br>
                <label><input type="checkbox" id="adv-show-stars-glow" data-api-param="showStarsGlow"> Stars Glow</label><br>
            </fieldset>

            <!-- Quadrant N/E: Celestial Bodies -->
             <fieldset class="advanced-options-quadrant">
                <legend>Celestial Bodies</legend>
                <label><input type="checkbox" id="adv-show-moon" data-api-param="showMoon"> Moon</label><br>
                <label><input type="checkbox" id="adv-show-sun" data-api-param="showSun"> Sun</label><br>
                <label><input type="checkbox" id="adv-show-planets" data-api-param="showPlanets"> Planets</label><br>
                <label><input type="checkbox" id="adv-show-ecliptic-path" data-api-param="showEclipticPath"> Ecliptic Path</label><br>
            </fieldset>

            <!-- Quadrant S/W: Labels -->
            <fieldset class="advanced-options-quadrant">
                <legend>Labels</legend>
                <label><input type="checkbox" id="adv-show-planet-labels" data-api-param="showPlanetLabels"> Planet Labels</label><br>
                <label><input type="checkbox" id="adv-show-constellation-labels" data-api-param="showConstellationLabels"> Constellation Labels</label><br>
            </fieldset>

            <!-- Quadrant S/E: Star Settings -->
           <fieldset class="advanced-options-quadrant">
                <legend>Star Settings</legend>
                <label for="adv-star-size">Star Size: <span id="adv-star-size-value">1.0</span></label>
                <input type="range" id="adv-star-size" data-api-param="starSize" min="0.1" max="5" step="0.1" value="1.0"><br>
                <label for="adv-star-number">Star Number: <span id="adv-star-number-value">2000</span></label>
                <input type="range" id="adv-star-number" data-api-param="starNumber" min="500" max="10000" step="100" value="2000"><br>
                <label for="adv-const-line-width">Const. Line Width: <span id="adv-const-line-width-value">1.0</span></label>
                <input type="range" id="adv-const-line-width" data-api-param="constellationLineWidth" min="0.1" max="3" step="0.1" value="1.0"><br>
            </fieldset>
        </div>
        <div class="advanced-options-buttons">
            <button type="button" id="apply-advanced-options" class="apply-button">Apply & Close</button>
            <button type="button" id="cancel-advanced-options" class="cancel-button">Cancel</button>
        </div>
    `;

    // Insert the panel *inside* the fieldset containing the style dropdown
    const appearanceFieldset = document.querySelector('#star-map-style')?.closest('fieldset.form-section');
    if (appearanceFieldset) {
        appearanceFieldset.appendChild(panel);
        console.log("Advanced Options panel added to the correct fieldset.");
    } else {
        console.error("Could not find the 'Star Map Appearance' fieldset to insert the panel.");
        // Fallback: insert after the style container (might break layout)
        if (styleContainer) {
             styleContainer.parentNode.insertBefore(panel, styleContainer.nextSibling);
             console.warn("Inserted advanced panel after style container as fallback.");
        }
    }

    // --- No need to create toggle button, it exists in HTML ---
    // let toggleBtn = document.getElementById('advanced-options-toggle');
    // if (!toggleBtn) { ... }

    console.log("Advanced Options UI structure verified/updated.");

    // Add CSS styles if they don't exist (keep this)
     const styleId = 'advanced-options-styles';
     if (!document.getElementById(styleId)) {
         const styleSheet = document.createElement("style");
         styleSheet.id = styleId;
         styleSheet.innerText = `
             /* Styles remain the same */
             .advanced-options { border: 1px solid #ccc; border-radius: 5px; padding: 15px; margin-top: 15px; background-color: #f9f9f9; }
             .advanced-options .section-title { color: #0056b3; text-align: center; margin-bottom: 15px; font-size: 1.1em; border-bottom: 1px solid #eee; padding-bottom: 5px; }
             .advanced-options .advanced-options-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
             .advanced-options .advanced-options-quadrant { padding: 15px; border: 1px solid #eee; border-radius: 4px; background-color: #fff; }
             .advanced-options .advanced-options-quadrant legend { font-weight: bold; margin-bottom: 10px; font-size: 1em; color: #444; }
             .advanced-options label { display: block; margin-bottom: 8px; font-size: 0.9em; }
             .advanced-options input[type=range] { width: 100%; vertical-align: middle; }
             .advanced-options .advanced-options-buttons { text-align: right; margin-top: 20px; }
             .advanced-options .advanced-options-buttons button { padding: 8px 15px; margin-left: 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9em; }
             .advanced-options .apply-button { background-color: #28a745; color: white; }
             .advanced-options .cancel-button { background-color: #dc3545; color: white; }
         `;
         document.head.appendChild(styleSheet);
         console.log("Advanced Options CSS styles added/verified.");
     }
}

function setupAdvancedOptionsEventListeners() {
    // Use correct ID for the toggle button from HTML
    const toggleBtn = document.getElementById('advanced-options-toggle');
    const panel = document.getElementById('advanced-options-panel');
    // Use correct IDs for Apply/Cancel buttons from HTML
    const applyBtn = document.getElementById('apply-advanced-options');
    const closeBtn = document.getElementById('cancel-advanced-options');

    if (toggleBtn && panel) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = panel.style.display === 'none';
            panel.style.display = isHidden ? 'block' : 'none';
            // Update icon within the button
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.className = isHidden ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
            }
             if (isHidden) loadAdvancedOptionsUI(advancedStyleOptions); // Load current settings when opening
        });
         console.log("Event listener added to Advanced Options toggle button.");
    } else {
        console.error("Could not find toggle button (#advanced-options-toggle) or panel (#advanced-options-panel).");
    }

    if (applyBtn && panel) {
        applyBtn.addEventListener('click', () => {
            updateAdvancedOptionsFromUI();
            if (typeof saveCurrentSettings === 'function') saveCurrentSettings(); // Save settings when applying
            panel.style.display = 'none';
            const icon = toggleBtn?.querySelector('i'); // Update toggle button icon
            if (icon) icon.className = 'fas fa-chevron-down';
            if (typeof generateStarMap === 'function') generateStarMap(); // Regenerate map on apply
        });
         console.log("Event listener added to Apply Advanced Options button.");
    } else {
         console.error("Could not find apply button (#apply-advanced-options).");
    }

     if (closeBtn && panel) {
        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none';
             const icon = toggleBtn?.querySelector('i'); // Update toggle button icon
             if (icon) icon.className = 'fas fa-chevron-down';
            // Optionally reload UI from saved state if cancelling changes is desired
            // loadAdvancedOptionsUI(advancedStyleOptions);
        });
         console.log("Event listener added to Cancel Advanced Options button.");
    } else {
         console.error("Could not find cancel button (#cancel-advanced-options).");
    }

    // Add event listeners for sliders to update their value display
    // Use correct IDs for sliders and value spans from HTML
    const sliders = [
        { id: 'adv-star-size', valueId: 'adv-star-size-value' },
        { id: 'adv-star-number', valueId: 'adv-star-number-value' },
        { id: 'adv-const-line-width', valueId: 'adv-const-line-width-value' },
    ];
    sliders.forEach(s => {
        const slider = document.getElementById(s.id);
        const valueDisplay = document.getElementById(s.valueId);
        if (slider && valueDisplay) {
            // Update display immediately and on input change
            valueDisplay.textContent = parseFloat(slider.value).toFixed(1); // Show initial value formatted
            slider.addEventListener('input', () => {
                 valueDisplay.textContent = parseFloat(slider.value).toFixed(1); // Format to one decimal place
            });
        } else {
            console.warn(`Slider (#${s.id}) or value display (#${s.valueId}) not found.`);
        }
    });
     console.log("Event listeners added to sliders.");
}

// Function to update the global advancedStyleOptions object from the UI elements
function updateAdvancedOptionsFromUI() {
    if (typeof advancedStyleOptions === 'undefined') {
        console.error("advancedStyleOptions is not defined globally.");
        window.advancedStyleOptions = {}; // Initialize if missing
    }
    try {
        // Use correct IDs from HTML
        advancedStyleOptions.showMilkyWay = document.getElementById('adv-show-milky-way')?.checked ?? false;
        advancedStyleOptions.showConstellationLines = document.getElementById('adv-show-constellation-lines')?.checked ?? false;
        advancedStyleOptions.showStarsGlow = document.getElementById('adv-show-stars-glow')?.checked ?? false;
        advancedStyleOptions.showMoon = document.getElementById('adv-show-moon')?.checked ?? false;
        advancedStyleOptions.showSun = document.getElementById('adv-show-sun')?.checked ?? false;
        advancedStyleOptions.showPlanets = document.getElementById('adv-show-planets')?.checked ?? false;
        advancedStyleOptions.showEclipticPath = document.getElementById('adv-show-ecliptic-path')?.checked ?? false;
        advancedStyleOptions.showPlanetLabels = document.getElementById('adv-show-planet-labels')?.checked ?? false;
        advancedStyleOptions.showConstellationLabels = document.getElementById('adv-show-constellation-labels')?.checked ?? false;
        // Use correct IDs for sliders
        advancedStyleOptions.starSize = parseFloat(document.getElementById('adv-star-size')?.value ?? 1.0);
        advancedStyleOptions.starNumber = parseInt(document.getElementById('adv-star-number')?.value ?? 2000);
        advancedStyleOptions.constellationLineWidth = parseFloat(document.getElementById('adv-const-line-width')?.value ?? 1.0);
        console.log("Advanced options updated from UI:", advancedStyleOptions);
    } catch (error) {
        console.error("Error updating advanced options from UI:", error);
    }
}

// Function to load values from the global options object into the UI
function loadAdvancedOptionsUI(options) {
    if (!options || !document.getElementById('advanced-options-panel')) {
        console.warn("Cannot load Advanced Options UI: Options object or panel not found.");
        return;
    }
    const check = (id, value) => { const el = document.getElementById(id); if (el) el.checked = value ?? false; };
    try {
         // Use correct IDs from HTML
        check('adv-show-milky-way', options.showMilkyWay);
        check('adv-show-constellation-lines', options.showConstellationLines);
        check('adv-show-stars-glow', options.showStarsGlow);
        check('adv-show-moon', options.showMoon);
        check('adv-show-sun', options.showSun);
        check('adv-show-planets', options.showPlanets);
        check('adv-show-ecliptic-path', options.showEclipticPath);
        check('adv-show-planet-labels', options.showPlanetLabels);
        check('adv-show-constellation-labels', options.showConstellationLabels);

        const updateSlider = (id, valueId, value, defaultValue) => {
            const slider = document.getElementById(id);
            const valueDisplay = document.getElementById(valueId);
            const val = value ?? defaultValue;
            if (slider) slider.value = val;
            if (valueDisplay) valueDisplay.textContent = parseFloat(val).toFixed(1); // Format to one decimal place
        };
         // Use correct IDs for sliders
        updateSlider('adv-star-size', 'adv-star-size-value', options.starSize, 1.0);
        updateSlider('adv-star-number', 'adv-star-number-value', options.starNumber, 2000);
        updateSlider('adv-const-line-width', 'adv-const-line-width-value', options.constellationLineWidth, 1.0);
        console.log("Advanced Options UI updated from loaded settings.");
    } catch (error) {
        console.error("Error loading advanced options UI:", error);
    }
}

// Function to load options from localStorage into the global object
function loadAdvancedOptions() {
     const savedOptions = localStorage.getItem('advancedStarMapOptions');
     if (savedOptions) {
         try {
             const options = JSON.parse(savedOptions);
             // Ensure global object exists before merging
             if (typeof advancedStyleOptions === 'undefined') window.advancedStyleOptions = {};
             // Merge saved options into the global object
             for (const key in options) {
                 if (options.hasOwnProperty(key)) {
                     advancedStyleOptions[key] = options[key];
                 }
             }
             console.log("Advanced options loaded from localStorage:", advancedStyleOptions);
         } catch (error) {
             console.error("Error loading advanced options from localStorage:", error);
             // Initialize with defaults if loading fails
             if (typeof advancedStyleOptions === 'undefined') window.advancedStyleOptions = {};
         }
     } else {
         // Initialize with defaults if nothing is saved
         if (typeof advancedStyleOptions === 'undefined') window.advancedStyleOptions = {};
         console.log("No advanced options found in localStorage, using defaults.");
     }
}

// Initial setup call (ensure this is called after the DOM is ready, e.g., in main_app.js)
// We need to make sure this file's functions are defined before main_app calls them.
// Consider calling createAdvancedOptionsUI and setupAdvancedOptionsEventListeners
// directly from main_app.js's DOMContentLoaded if needed, or ensure this script loads first.
// For now, assuming main_app.js calls setupAdvancedOptionsEventListeners.

console.log("advanced_options.js loaded");