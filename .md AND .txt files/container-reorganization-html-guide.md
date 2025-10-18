# Container Reorganization - HTML Changes Guide

## Overview

This guide provides the exact HTML changes needed to properly combine the "Customizable Text Layers" and "Fixed Text Styling" containers, as well as the "Star Map Canvas Settings" and "Star Map Image Settings" containers.

## HTML Changes Required

### 1. Combine "Customizable Text Layers" and "Fixed Text Styling" Containers

Find the "Customizable Text Layers" container (fieldset with legend "Customizable Text Layers") and make these changes:

1. Change its legend to "Customizable Text Layers + Fixed Layers"
2. At the end of this container (before the closing `</fieldset>` tag), add:
   - An `<hr>` separator
   - A div with class "fixed-text-content" containing the content from the "Fixed Text Styling" container
3. Remove the entire "Fixed Text Styling" container (the entire fieldset)

#### Example:

```html
<!-- BEFORE -->
<fieldset>
    <legend>Customizable Text Layers (Max 50 Chars)</legend>
    <!-- Customizable text content here -->
</fieldset>

<fieldset>
    <legend>Fixed Text Styling</legend>
    <div>
        <label for="date-text-font">Date Text:</label>
        <!-- Date text styling content here -->
    </div>
    <div>
        <label for="coordinates-text-font">Coordinates Text:</label>
        <!-- Coordinates text styling content here -->
    </div>
</fieldset>

<!-- AFTER -->
<fieldset>
    <legend>Customizable Text Layers + Fixed Layers</legend>
    <!-- Customizable text content here -->
    
    <hr>
    <div class="fixed-text-content">
        <div>
            <label for="date-text-font">Date Text:</label>
            <!-- Date text styling content here -->
        </div>
        <div>
            <label for="coordinates-text-font">Coordinates Text:</label>
            <!-- Coordinates text styling content here -->
        </div>
    </div>
</fieldset>

<!-- The Fixed Text Styling fieldset is completely removed -->
```

### 2. Combine "Star Map Canvas Settings" and "Star Map Image Settings" Containers

Find the "Star Map Canvas Settings" container and make these changes:

1. Change its legend to "Star Map Canvas + Image Settings"
2. At the end of this container (before the closing `</fieldset>` tag), add:
   - An `<hr>` separator
   - A div with class "image-settings-content" containing:
     - An h3 heading with text "Star Map Image Settings"
     - The content from the "Star Map Image Settings" container
3. Remove the entire "Star Map Image Settings" container (the entire fieldset)

#### Example:

```html
<!-- BEFORE -->
<fieldset>
    <legend>Star Map Canvas Settings</legend>
    <!-- Canvas settings content here -->
</fieldset>

<fieldset>
    <legend>Star Map Image Settings</legend>
    <div>
        <!-- Image settings content here -->
    </div>
</fieldset>

<!-- AFTER -->
<fieldset>
    <legend>Star Map Canvas + Image Settings</legend>
    <!-- Canvas settings content here -->
    
    <hr>
    <div class="image-settings-content">
        <h3>Star Map Image Settings</h3>
        <div>
            <!-- Image settings content here -->
        </div>
    </div>
</fieldset>

<!-- The Star Map Image Settings fieldset is completely removed -->
```

## Important Notes

1. Make sure to preserve all the original content, attributes, and IDs in the elements you move.
2. The CSS and JavaScript files have been updated to work with these HTML changes.
3. The JavaScript file will handle:
   - Fixing text entry field widths
   - Ensuring row labels show "#1", "#2", "#3", and "#4"
   - Standardizing field sizes
   - Adding the heading to the image settings content if needed
4. The CSS file will handle:
   - Styling the fixed text content
   - Styling the image settings heading
   - Standardizing field sizes
   - Fixing text entry field widths
