# Font Handling References in Star Map Generator

This document lists all files and code sections that handle font families and font sizes in the Star Map Generator project.

## JavaScript Files

### 1. js/absolute-final-fix.js
- Contains `fixFixedLayersFontSizes()` function that creates and manages font size dropdowns
- Sets up font size options from 8px to 128px
- Attempts to set default font size for date to 72px
- Adds event listeners and continuous monitoring for font size changes

### 2. js/download.js
- Handles font settings during download/export
- References:
  ```javascript
  { id: 'entry1', text: getVal('text-entry-1', ''), fontFamily: getVal('font-family-1', 'Montserrat'), fontSize: parseInt(getVal('font-size-1', '28')) }
  { id: 'date', text: formatDate(dateValue), fontFamily: getVal('fixed-font-family-date', 'Arial'), fontSize: parseInt(getVal('fixed-font-size-date', '14')) }
  { id: 'coords', text: coords, fontFamily: getVal('fixed-font-family-coords', 'Arial'), fontSize: parseInt(getVal('fixed-font-size-coords', '14')) }
  ```
- Scales font sizes for download:
  ```javascript
  const fontSizeScale = tempCanvas.width / previewCanvasWidth;
  const baseSizeNum = parseInt(style.fontSize) || 14;
  const scaledSize = Math.max(1, Math.round(baseSizeNum * fontSizeScale));
  ```

### 3. js/final-working-solution.js
- Contains `fixFontSizeDropdowns()` function
- Sets up font size options from 8px to 128px
- Attempts to set font size for date to 72px:
  ```javascript
  const select = document.getElementById('fixed-font-size-date');
  if (select) select.value = '72px';
  ```

### 4. js/fixed-layers-fix-exact.js
- Comprehensive handling of fixed layers font styling
- Creates and styles font family and font size dropdowns
- References:
  ```javascript
  const dateFontFamily = document.getElementById('fixed-font-family-date');
  const coordsFontFamily = document.getElementById('fixed-font-family-coords');
  const dateFontSize = document.getElementById('fixed-font-size-date');
  const coordsFontSize = document.getElementById('fixed-font-size-coords');
  ```
- Applies styling to font dropdowns:
  ```javascript
  fontFamily.style.width = '120px';
  fontSize.style.width = '70px';
  ```

### 5. js/fixed-layers-fix-final.js
- Similar to fixed-layers-fix-exact.js but with different implementation
- Copies options from existing font dropdowns in the customizable text section
- References:
  ```javascript
  const sourceFontFamily = document.querySelector('.text-entry-row select.font-family-select');
  const sourceFontSize = document.querySelector('.text-entry-row select.font-size-select');
  ```

### 6. js/fixed-layers-fix-minimal.js
- Minimal implementation for font handling
- Defines font size options:
  ```javascript
  const fontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '48px', '56px', '64px', '72px'];
  ```

### 7. js/fixed-layers-fix_2.js
- Different approach to font handling
- Defines font options with styling:
  ```javascript
  const fontOptions = [
      { value: 'Oswald', label: 'Oswald', style: 'font-family: "Oswald", sans-serif;' },
      { value: 'Arial', label: 'Arial', style: 'font-family: Arial, sans-serif;' },
      // ...more options
  ];
  ```
- Defines font sizes in reverse order (largest first):
  ```javascript
  const fontSizes = ['72px', '60px', '48px', '36px', '24px', '18px', '16px', '14px', '12px', '10px'];
  ```

### 8. js/container-reorganization-v2.js
- Handles width synchronization between customizable and fixed text font selects
- References:
  ```javascript
  const fontFamilySelect = customizableSelects[i];
  const fontSizeSelect = customizableSelects[i + 1];
  fontFamilyWidth = fontFamilyStyle.width;
  fontSizeWidth = fontSizeStyle.width;
  ```

## CSS Files

### 1. css/text-layers.css
- Defines styling for font selects:
  ```css
  .font-family-select {
      width: 80px !important;
  }
  .font-size-select {
      width: 30px !important;
  }
  .fixed-text-group .font-family-select {
      width: 80px !important;
  }
  .fixed-text-group .font-size-select {
      width: 30px !important;
  }
  ```

### 2. css/inline-styles.css
- Contains styling for font family options:
  ```css
  .font-family-select option[value="Bebas Neue"] { font-family: 'Bebas Neue', sans-serif; }
  .font-family-select option[value="Lora"] { font-family: 'Lora', serif; }
  ```
- Defines font select widths:
  ```css
  .font-family-select {
      width: 80px !important;
  }
  .font-size-select {
      width: 50px !important;
  }
  ```

### 3. css/fixes.css
- Contains fixes for font selects:
  ```css
  .font-size-select, .font-family-select {
      width: auto !important;
  }
  .fixed-text-styling .font-family-select {
      width: 120px !important;
  }
  select.font-size-select {
      width: 70px !important;
  }
  #font-size-1, #font-size-2, #font-size-3 {
      width: 70px !important;
  }
  ```

### 4. css/master-override.css
- Contains important overrides for font selects:
  ```css
  .fixed-text-content .font-size-select {
      width: 70px !important;
  }
  ```

### 5. css/responsive.css
- Handles font select styling for mobile:
  ```css
  .font-family-select,
  .font-size-select {
      height: 36px;
      font-size: 16px;
  }
  .font-family-select {
      width: 100% !important;
  }
  .font-size-select {
      width: 80px !important;
  }
  ```

## HTML Structure

The font selects are structured as follows in the DOM:

1. **Fixed Layers Section**:
   ```html
   <div class="fixed-text-content">
     <div class="input-group">
       <label>Date:</label>
       <select id="fixed-font-family-date" class="font-family-select">...</select>
       <select id="fixed-font-size-date" class="font-size-select">...</select>
       <!-- Other controls -->
     </div>
     <div class="input-group">
       <label>Lat/Long:</label>
       <select id="fixed-font-family-coords" class="font-family-select">...</select>
       <select id="fixed-font-size-coords" class="font-size-select">...</select>
       <!-- Other controls -->
     </div>
   </div>
   ```

2. **Customizable Text Section**:
   ```html
   <div class="text-entry-row">
     <select id="font-family-1" class="font-family-select">...</select>
     <select id="font-size-1" class="font-size-select">...</select>
     <!-- Other controls -->
   </div>
   ```

## Key Observations

1. Multiple scripts attempt to manage the font size dropdowns, which may cause conflicts
2. The font size dropdown for date should have 72px selected by default
3. CSS rules from multiple files affect the width and appearance of the dropdowns
4. The font size options are defined in multiple places with slight variations
5. Some scripts copy styles from customizable text dropdowns to fixed layers dropdowns

## Potential Issues

1. **Race conditions**: Multiple scripts trying to set the font size at different times
2. **CSS specificity conflicts**: Multiple CSS rules targeting the same elements
3. **Event handling**: Changes to the dropdowns may not trigger necessary updates
4. **DOM timing issues**: Scripts may run before the DOM is fully loaded
5. **Selector specificity**: Some selectors may be too generic or too specific

## Recommended Approach

1. Consolidate font handling into a single script
2. Use more specific selectors with !important flags
3. Add event listeners to detect and correct any changes
4. Use a MutationObserver to monitor for DOM changes
5. Implement a continuous monitoring solution that periodically checks and corrects the font size selection
