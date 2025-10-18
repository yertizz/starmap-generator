# Combined View Settings - HTML Implementation

## Where to Add

Add this HTML code in your `Star_Map_Generator.html` file, inside the **"Star Map Image Settings"** container, right after the Border Color row.

Look for this section:
```html
<div class="settings-row">
    <label>Border (px):</label>
    <input type="number" id="border-width" value="15" min="0" max="50">
    <label>Color:</label>
    <input type="color" id="border-color" value="#FFD700">
</div>
```

## HTML Code to Add

Add this immediately AFTER the border settings row:

```html
<!-- Combined View Settings -->
<div class="settings-row" style="margin-top: 15px;">
    <div style="width: 100%; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
        <div style="font-weight: bold; margin-bottom: 10px; color: #333;">Combined View Options:</div>
        
        <!-- Overlap Control -->
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <label style="min-width: 120px;">Circle Overlap:</label>
            <input type="range" id="circle-overlap-percent" min="0" max="50" value="30" 
                   style="flex: 1; margin: 0 10px;">
            <span id="overlap-value" style="min-width: 40px; font-weight: bold;">30%</span>
        </div>
        
        <!-- Map Order Control -->
        <div style="display: flex; align-items: center; flex-wrap: wrap;">
            <label style="min-width: 120px;">Map Order:</label>
            <div style="display: flex; gap: 20px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="radio" name="map-order" value="street-first" checked 
                           style="margin-right: 5px;">
                    Street Map First
                </label>
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="radio" name="map-order" value="star-first" 
                           style="margin-right: 5px;">
                    Star Map First
                </label>
            </div>
        </div>
        
        <div style="margin-top: 8px; font-size: 11px; color: #666; font-style: italic;">
            These settings apply to Combined (Landscape) and Combined (Portrait) views
        </div>
    </div>
</div>
```

## JavaScript Code to Add

Add this JavaScript code at the end of your existing `<script>` section or create a new one before `</body>`:

```javascript
// Combined View Settings Handler
(function() {
    // Initialize settings
    window.combinedViewSettings = {
        overlapPercent: 30,
        streetMapFirst: true
    };
    
    // Wait for DOM
    document.addEventListener('DOMContentLoaded', function() {
        // Overlap slider
        const overlapSlider = document.getElementById('circle-overlap-percent');
        const overlapValue = document.getElementById('overlap-value');
        
        if (overlapSlider && overlapValue) {
            overlapSlider.addEventListener('input', function() {
                const value = parseInt(this.value);
                overlapValue.textContent = value + '%';
                window.combinedViewSettings.overlapPercent = value;
            });
        }
        
        // Map order radios
        const mapOrderRadios = document.querySelectorAll('input[name="map-order"]');
        mapOrderRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                window.combinedViewSettings.streetMapFirst = (this.value === 'street-first');
            });
        });
    });
})();
```

## How It Will Look

The controls will appear as:
- A slider for overlap percentage (0-50%)
- Radio buttons for map order selection
- Styled to match your existing interface with a light gray background

## Usage in Combined Views

The `combined-views-fix.js` file will automatically use these settings:
- `window.combinedViewSettings.overlapPercent` - for circle overlap amount
- `window.combinedViewSettings.streetMapFirst` - for map order

The settings are stored globally and will be used whenever the user clicks the Combined view buttons.
