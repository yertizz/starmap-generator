# Time Display Toggle Implementation Guide

## Overview

This guide explains how to implement the time display toggle feature for the Star Map Generator. This feature allows users to show or hide the time on the star map, as requested in the enhancement plan.

## Files Created

1. **css/time-display-toggle.css**: Contains the styles for the time display toggle
2. **js/time-display-toggle.js**: Contains the JavaScript functionality for the time display toggle
3. **time-display-toggle-html.html**: Contains the HTML markup for the time display toggle

## Implementation Steps

### Step 1: Add CSS Link to Head Section

Add the following link to the `<head>` section of `Star_Map_Generator.html`:

```html
<!-- Time Display Toggle CSS -->
<link rel="stylesheet" href="css/time-display-toggle.css?v=1.0">
```

### Step 2: Replace the Time Input in the Event Details Section

Find the existing time input in the Event Details section of `Star_Map_Generator.html`. It should look something like this:

```html
<div class="input-group" style="margin-bottom: 0; flex-grow: 0; width: auto;">
    <label for="date">Date/Time:</label>
    <input type="date" id="date" required style="width: 110px; min-width: 110px;">
    <input type="time" id="time" required style="width: 100px; min-width: 100px;">
</div>
```

Replace it with the content from `time-display-toggle-html.html`:

```html
<div class="input-group" style="margin-bottom: 0; flex-grow: 0; width: auto;">
    <label for="date">Date/Time:</label>
    <input type="date" id="date" required style="width: 110px; min-width: 110px;">
    <input type="time" id="time" required style="width: 100px; min-width: 100px;">
    
    <!-- Time Display Toggle -->
    <div class="time-toggle-container">
        <label class="time-toggle-label">
            <span class="time-toggle-tooltip">Show/hide time on star map</span>
            <i class="fas fa-clock time-toggle-icon"></i>
            <span class="time-toggle-switch">
                <input type="checkbox" id="show-time-toggle" checked>
                <span class="time-toggle-slider"></span>
            </span>
        </label>
    </div>
</div>
```

### Step 3: Add JavaScript File Reference

Add the following script tag to the bottom of the `<body>` section, just before the closing `</body>` tag:

```html
<!-- Time Display Toggle Functionality -->
<script src="js/time-display-toggle.js?v=1.0"></script>
```

### Step 4: Update Map Generation Code

To ensure the time toggle state is respected when generating the star map, you'll need to modify the map generation code. Look for the function that formats the date for display on the star map (likely in `js/map.js` or `js/settings-preview-download.js`).

Replace any date formatting code with a call to the `getFormattedDateTime` function from `time-display-toggle.js`:

```javascript
// Example modification to the date formatting code
const dateValue = document.getElementById('date').value;
const timeValue = document.getElementById('time').value;
const formattedDate = getFormattedDateTime(dateValue, timeValue);
```

## Key Features

1. **Toggle Switch**: A visually appealing toggle switch with a clock icon
2. **Tooltip**: Hovering over the toggle shows a tooltip explaining its purpose
3. **Persistence**: The toggle state is saved in localStorage so it persists between sessions
4. **Live Preview**: The date/time display in the text placement section updates in real-time when the toggle is changed
5. **Locale Support**: The date is formatted according to the user's locale

## Testing

After implementing the time display toggle feature, test the following:

1. **Toggle Functionality**: The toggle should show/hide the time in the preview
2. **Persistence**: The toggle state should persist after page refresh
3. **Date/Time Updates**: Changing the date or time should update the preview
4. **Star Map Generation**: The time should be included or excluded in the generated star map based on the toggle state

## Next Steps

After implementing this change, you can proceed with the next items in Phase 1 of the enhancement plan:

1. ✅ Button container redesign
2. ✅ Time display options
3. ⬜ Canvas size presets
4. ⬜ SVG/PDF download capability
5. ⬜ Advanced options implementation
