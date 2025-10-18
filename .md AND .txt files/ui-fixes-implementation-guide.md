# UI Fixes Implementation Guide

## Overview

This guide explains how to implement additional UI fixes for the Star Map Generator. These changes address the following issues:

1. Fix the Event Details container to keep Event/Occasion and Date/Time on one row
2. Fix the button container layout to properly align buttons
3. Fix the Image Format row layout and logic:
   - Position the PNG transparency checkbox right after the PNG radio button
   - Disable the PNG transparency checkbox when JPG or SVG is selected
   - Prepare for future PDF format implementation

## Files Created

1. **css/ui-fixes.css**: Contains CSS fixes for various UI issues
2. **js/image-format-fix.js**: Contains JavaScript to fix the image format selection logic

## Implementation Steps

### Step 1: Add CSS Link to Head Section

Add the following link to the `<head>` section of `Star_Map_Generator.html`:

```html
<!-- UI Fixes CSS -->
<link rel="stylesheet" href="css/ui-fixes.css?v=1.0">
```

### Step 2: Add JavaScript File Reference

Add the following script tag to the bottom of the `<body>` section, just before the closing `</body>` tag:

```html
<!-- Image Format Fix -->
<script src="js/image-format-fix.js?v=1.0"></script>
```

## Key Changes

### 1. Event Details Container Fix

The CSS fixes ensure that the Event/Occasion and Date/Time fields stay on one row:

```css
#event-details-fieldset > div {
    display: flex !important;
    flex-wrap: nowrap !important; /* Prevent wrapping */
    align-items: center !important;
    justify-content: center !important;
    gap: 15px !important;
}

#occasion {
    width: 300px !important; /* Further reduced from 350px */
    min-width: 250px !important; /* Further reduced from 300px */
}
```

### 2. Button Container Layout Fix

The CSS fixes properly align the buttons in the button container:

```css
.button-list {
    display: flex !important;
    flex-direction: row !important; /* Arrange buttons horizontally */
    flex-wrap: wrap !important;
    gap: 10px !important;
}

.action-button {
    padding: 8px 10px !important;
    font-size: 13px !important;
    min-width: auto !important;
    flex: 0 0 auto !important;
}
```

### 3. Image Format Row Fix

The CSS and JavaScript fixes ensure that:
- The PNG transparency checkbox is positioned right after the PNG radio button
- The PNG transparency checkbox is disabled when JPG or SVG is selected

```css
/* Position the PNG transparency checkbox right after the PNG radio button */
#png-transparency-label {
    order: 1 !important; /* Place right after PNG radio */
    margin-left: -10px !important; /* Move closer to PNG radio */
}
```

```javascript
// Function to update the PNG transparency checkbox state
function updatePngTransparencyState() {
    const selectedFormat = document.querySelector('input[name="image-format"]:checked').value;
    
    if (selectedFormat === 'png') {
        // Enable PNG transparency checkbox
        pngTransparencyCheckbox.disabled = false;
        pngTransparencyLabel.classList.remove('disabled-option');
    } else {
        // Disable PNG transparency checkbox
        pngTransparencyCheckbox.disabled = true;
        pngTransparencyCheckbox.checked = false;
        pngTransparencyLabel.classList.add('disabled-option');
    }
}
```

## Testing

After implementing these changes, test the following:

1. **Event Details Container**: The Event/Occasion and Date/Time fields should appear on the same row without wrapping
2. **Button Container Layout**: The buttons should be properly aligned and all View buttons should be on one row, and all Download buttons should be on one row
3. **Image Format Row**:
   - The PNG transparency checkbox should be positioned right after the PNG radio button
   - The PNG transparency checkbox should be disabled when JPG or SVG is selected
   - The PNG transparency checkbox should be enabled when PNG is selected

## Next Steps

After implementing these changes, you can proceed with the next items in Phase 1 of the enhancement plan:

1. ✅ Button container redesign
2. ✅ Time display options
3. ⬜ Canvas size presets
4. ⬜ SVG/PDF download capability
5. ⬜ Advanced options implementation
