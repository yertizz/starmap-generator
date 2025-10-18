# Star Map Generator Settings Storage Analysis

## Current Settings Storage Implementation

The Star Map Generator currently uses a PHP-based server-side storage system (`settings/settings_manager.php`) that saves settings to a JSON file (`settings/settings.json`). The settings are saved and loaded through JavaScript functions in `js/settings.js`.

## Comprehensive List of Settings

Based on my analysis of the codebase, here is a comprehensive list of all settings that are currently stored or should be stored:

### Event Details
- [x] Occasion (dropdown selection)
- [x] Custom Occasion Text (if custom occasion is selected)
- [x] Date
- [ ] Time (stored indirectly through date display format)
- [x] Time Toggle Position (ON/OFF)

### Map Location
- [x] Latitude
- [x] Longitude
- [x] Zip/Postal Code
- [ ] Address (stored in history but not in settings)

### Customizable Text Layers
- [x] Text Entry #1 (content)
- [x] Text Entry #2 (content)
- [x] Text Entry #3 (content)
- [x] Text Entry #4 (content)
- [x] Font Family for each text entry
- [x] Font Size for each text entry
- [x] Bold status for each text entry
- [x] Italic status for each text entry
- [x] Color for each text entry

### Fixed Layers
- [x] Fixed Date Font Family
- [x] Fixed Date Font Size
- [x] Fixed Date Bold status
- [x] Fixed Date Italic status
- [x] Fixed Date Color
- [x] Fixed Coordinates Font Family
- [x] Fixed Coordinates Font Size
- [x] Fixed Coordinates Bold status
- [x] Fixed Coordinates Italic status
- [x] Fixed Coordinates Color
- [x] Fixed Place Font Family (if implemented)
- [x] Fixed Place Font Size (if implemented)
- [x] Fixed Place Bold status (if implemented)
- [x] Fixed Place Italic status (if implemented)
- [x] Fixed Place Color (if implemented)

### Canvas Settings
- [x] Output Width (px)
- [x] Output Height (px)
- [x] Maintain Aspect Ratio (checkbox)
- [x] Canvas Background Color
- [x] DPI Setting (300, 150, etc.)
- [x] Image Format (PNG, JPG, etc.)
- [x] PNG Transparency (checkbox)

### Star Map Image Settings
- [x] Map Style (dropdown)
- [x] Circle Radius Percentage
- [x] Border Width (px)
- [x] Border Color

### Combined View Options
- [ ] Circle Overlap Percentage (default 30%)
- [ ] Map Order (Street Map First or Star Map First)

### Text Placements
- [x] Text Entry #1 Order (1-6)
- [x] Text Entry #1 Position (Above/Below)
- [x] Text Entry #2 Order (1-6)
- [x] Text Entry #2 Position (Above/Below)
- [x] Text Entry #3 Order (1-6)
- [x] Text Entry #3 Position (Above/Below)
- [x] Text Entry #4 Order (1-6)
- [x] Text Entry #4 Position (Above/Below)
- [x] Date Order (1-6)
- [x] Date Position (Above/Below)
- [x] Coordinates Order (1-6)
- [x] Coordinates Position (Above/Below)

### Zoom Settings
- [x] Canvas Zoom Level (default 100%)

### Advanced Options
- [x] Any advanced style options (stored in advancedStyleOptions object)

## Missing Settings

The following settings are currently not being stored but should be:

1. **Time** - While the date is stored, the time component should be explicitly stored
2. **Address** - Currently stored in history but not in settings
3. **Circle Overlap Percentage** - For combined views
4. **Map Order** - For combined views (Street Map First or Star Map First)

## Implementation Recommendations

To ensure all settings are properly saved and loaded:

1. **Update the `saveCurrentSettings()` function** in `js/settings.js` to include:
   ```javascript
   // Add to settings object
   settings.timeValue = getVal("time", "");
   settings.address = getVal("address", "");
   settings.circleOverlapPercent = getVal("circle-overlap-percent", "30");
   settings.mapOrder = getRadioVal("map-order", "street-first");
   ```

2. **Update the `loadSavedSettings()` function** to apply these values:
   ```javascript
   // Add to loading section
   setVal("time", settings.timeValue);
   setVal("address", settings.address);
   setVal("circle-overlap-percent", settings.circleOverlapPercent);
   setRadio("map-order", settings.mapOrder);
   ```

3. **Ensure the new zoom slider value is properly saved and loaded**:
   ```javascript
   // When saving
   settings.zoomLevel = getVal("zoom-slider", "100");
   
   // When loading
   setVal("zoom-slider", settings.zoomLevel);
   if (zoomSlider && zoomValue) {
       zoomSlider.value = settings.zoomLevel;
       zoomValue.textContent = settings.zoomLevel;
       // Apply zoom transformation
       const scale = settings.zoomLevel / 100;
       const starMapCircles = document.querySelectorAll('.star-map-circle, .street-map-circle');
       starMapCircles.forEach(circle => {
           if (circle) {
               circle.style.transform = `scale(${scale})`;
               circle.style.transformOrigin = 'center center';
           }
       });
   }
   ```

## Conclusion

The Star Map Generator has a robust settings storage system that captures most of the important settings. With the few additions mentioned above, it will provide a complete and seamless experience for users who want to save and load their configurations.

The current implementation using PHP and server-side JSON storage is appropriate for this application, providing persistent storage that works across browser sessions.
