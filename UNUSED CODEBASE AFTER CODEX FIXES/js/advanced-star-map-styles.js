// Advanced Star Map Styles - Provides additional customization options for star maps

document.addEventListener('DOMContentLoaded', function() {
    console.log("Advanced Star Map Styles loaded");
    
    // Create the advanced options container
    createAdvancedOptionsUI();
    
    // Set up event listeners
    setupEventListeners();
    
    console.log("Advanced Star Map Styles initialized");
});

// Global variables to store advanced style options
const advancedStyleOptions = {
    milkyWay: false,
    constellationBounds: false,
    starsGlow: false,
    starSize: 1.0,
    starNumber: 2000,
    constellationLineWidth: 1.0,
    moon: false,
    sun: false,
    planets: false,
    eclipticPath: false,
    celestialBodySize: 1.0,
    sunShape: 'circle',
    planetShape: 'circle',
    planetLabels: false,
    constellationLabels: false,
    starLabels: false,
    labelFont: 'Arial',
    labelFontSize: 12,
    labelStrokeWidth: 0.5
};

// Function to create the advanced options UI
function createAdvancedOptionsUI() {
    // Find the Star Map Style dropdown
    const starMapStyleSelect = document.getElementById('star-map-style');
    if (!starMapStyleSelect) {
        console.error("Star Map Style select not found");
        return;
    }
    
    // Find the parent container
    const parentContainer = starMapStyleSelect.closest('.form-group') || starMapStyleSelect.parentNode;
    if (!parentContainer) {
        console.error("Parent container not found");
        return;
    }
    
    // Create advanced options button
    const advancedOptionsBtn = document.createElement('button');
    advancedOptionsBtn.type = 'button';
    advancedOptionsBtn.id = 'advanced-options-btn';
    advancedOptionsBtn.textContent = 'Advanced Options';
    advancedOptionsBtn.className = 'settings-button';
    advancedOptionsBtn.style.marginTop = '10px';
    advancedOptionsBtn.style.backgroundColor = '#2196F3';
    
    // Create advanced options container
    const advancedOptionsContainer = document.createElement('div');
    advancedOptionsContainer.id = 'advanced-options-container';
    advancedOptionsContainer.style.display = 'none';
    advancedOptionsContainer.style.marginTop = '10px';
    advancedOptionsContainer.style.padding = '10px';
    advancedOptionsContainer.style.border = '1px solid #ddd';
    advancedOptionsContainer.style.borderRadius = '4px';
    advancedOptionsContainer.style.backgroundColor = '#f9f9f9';
    
    // Create advanced options content
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
    
    // Append elements to the parent container
    parentContainer.appendChild(advancedOptionsBtn);
    parentContainer.appendChild(advancedOptionsContainer);
}

// Function to set up event listeners
function setupEventListeners() {
    // Advanced options button
    const advancedOptionsBtn = document.getElementById('advanced-options-btn');
    if (advancedOptionsBtn) {
        advancedOptionsBtn.addEventListener('click', function() {
            const container = document.getElementById('advanced-options-container');
            if (container) {
                container.style.display = container.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
    
    // Close button
    const closeBtn = document.getElementById('close-advanced-options-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const container = document.getElementById('advanced-options-container');
            if (container) {
                container.style.display = 'none';
            }
        });
    }
    
    // Apply button
    const applyBtn = document.getElementById('apply-advanced-options-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            updateAdvancedOptions();
            
            // Regenerate the star map if it's already been generated
            if (typeof generateStarMap === 'function') {
                generateStarMap();
            } else if (typeof directGenerateStarMap === 'function') {
                directGenerateStarMap();
            }
            
            // Close the advanced options container
            const container = document.getElementById('advanced-options-container');
            if (container) {
                container.style.display = 'none';
            }
        });
    }
    
    // Star size slider
    const starSizeSlider = document.getElementById('star-size-slider');
    const starSizeValue = document.getElementById('star-size-value');
    if (starSizeSlider && starSizeValue) {
        starSizeSlider.addEventListener('input', function() {
            starSizeValue.textContent = this.value;
        });
    }
    
    // Star number slider
    const starNumberSlider = document.getElementById('star-number-slider');
    const starNumberValue = document.getElementById('star-number-value');
    if (starNumberSlider && starNumberValue) {
        starNumberSlider.addEventListener('input', function() {
            starNumberValue.textContent = this.value;
        });
    }
    
    // Constellation line width slider
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
    // Features
    advancedStyleOptions.milkyWay = document.getElementById('milky-way-toggle')?.checked || false;
    advancedStyleOptions.constellationBounds = document.getElementById('constellation-bounds-toggle')?.checked || false;
    advancedStyleOptions.starsGlow = document.getElementById('stars-glow-toggle')?.checked || false;
    
    // Star settings
    advancedStyleOptions.starSize = parseFloat(document.getElementById('star-size-slider')?.value || 1.0);
    advancedStyleOptions.starNumber = parseInt(document.getElementById('star-number-slider')?.value || 2000);
    advancedStyleOptions.constellationLineWidth = parseFloat(document.getElementById('constellation-line-width-slider')?.value || 1.0);
    
    // Celestial bodies
    advancedStyleOptions.moon = document.getElementById('moon-toggle')?.checked || false;
    advancedStyleOptions.sun = document.getElementById('sun-toggle')?.checked || false;
    advancedStyleOptions.planets = document.getElementById('planets-toggle')?.checked || false;
    advancedStyleOptions.eclipticPath = document.getElementById('ecliptic-path-toggle')?.checked || false;
    
    // Labels
    advancedStyleOptions.planetLabels = document.getElementById('planet-labels-toggle')?.checked || false;
    advancedStyleOptions.constellationLabels = document.getElementById('constellation-labels-toggle')?.checked || false;
    advancedStyleOptions.starLabels = document.getElementById('star-labels-toggle')?.checked || false;
    
    console.log("Advanced options updated:", advancedStyleOptions);
    
    // Save to localStorage
    localStorage.setItem('advancedStarMapOptions', JSON.stringify(advancedStyleOptions));
}

// Function to load advanced options from localStorage
function loadAdvancedOptions() {
    const savedOptions = localStorage.getItem('advancedStarMapOptions');
    if (savedOptions) {
        try {
            const options = JSON.parse(savedOptions);
            
            // Update global variable
            Object.assign(advancedStyleOptions, options);
            
            // Update UI
            document.getElementById('milky-way-toggle').checked = options.milkyWay;
            document.getElementById('constellation-bounds-toggle').checked = options.constellationBounds;
            document.getElementById('stars-glow-toggle').checked = options.starsGlow;
            
            document.getElementById('star-size-slider').value = options.starSize;
            document.getElementById('star-size-value').textContent = options.starSize;
            
            document.getElementById('star-number-slider').value = options.starNumber;
            document.getElementById('star-number-value').textContent = options.starNumber;
            
            document.getElementById('constellation-line-width-slider').value = options.constellationLineWidth;
            document.getElementById('constellation-line-width-value').textContent = options.constellationLineWidth;
            
            document.getElementById('moon-toggle').checked = options.moon;
            document.getElementById('sun-toggle').checked = options.sun;
            document.getElementById('planets-toggle').checked = options.planets;
            document.getElementById('ecliptic-path-toggle').checked = options.eclipticPath;
            
            document.getElementById('planet-labels-toggle').checked = options.planetLabels;
            document.getElementById('constellation-labels-toggle').checked = options.constellationLabels;
            document.getElementById('star-labels-toggle').checked = options.starLabels;
            
            console.log("Advanced options loaded:", options);
        } catch (error) {
            console.error("Error loading advanced options:", error);
        }
    }
}

// Export the advanced style options for use in other scripts
window.advancedStyleOptions = advancedStyleOptions;
