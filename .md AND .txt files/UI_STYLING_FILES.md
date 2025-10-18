# UI Styling Files in Star Map Generator

This document lists all the files that affect the UI/styling in each container of the Star Map Generator application.

## CSS Files (Styling)

### Core CSS Files
- `css/general.css` - General styling for the entire application
- `css/responsive.css` - Responsive design rules for different screen sizes
- `css/modules.css` - Styling for modular components

### Container-Specific CSS Files
- `css/map.css` - Styling for the map container and map elements
- `css/text-layers.css` - Styling for the Customizable Text Layers container
- `css/coordinate-fields.css` - Styling for the coordinate input fields in Map Location container
- `css/zip-code-history.css` - Styling for the zip code history dropdown
- `css/text-entry-history.css` - Styling for the text entry history dropdowns
- `css/color-picker.css` - Styling for color picker components
- `css/generate-button.css` - Styling for the generate button
- `css/settings-button.css` - Styling for settings buttons
- `css/starmap-canvas.css` - Styling for the star map canvas
- `css/star-map-styles.css` - Styling for the star map itself
- `css/fixes.css` - Custom fixes for specific UI issues (overrides other styles)

## JavaScript Files (UI Functionality)

### Core UI Files
- `js/main_app.js` - Main application file that creates and initializes all UI components
- `js/app/core/initialization.js` - Core initialization of the application
- `js/app/core/events.js` - Event handlers for UI interactions

### Map Location Container
- `js/map.js` - Main map module that coordinates all map functionality
- `js/map/initialization.js` - Initializes the map
- `js/map/coordinates.js` - Handles coordinate formatting and parsing
- `js/map/geocoding.js` - Handles geocoding of zip codes and coordinates
- `js/map/events.js` - Event handlers for map interactions
- `js/map/config.js` - Configuration for the map

### Customizable Text Layers Container
- `js/app/text/formatting.js` - Text formatting functionality
- `js/app/text/placement.js` - Text placement on the star map
- `js/app/text/history.js` - Text history functionality for dropdowns
- `js/app/text/character-count.js` - Character count functionality
- `js/app/text/font-init.js` - Font initialization

### Fixed Text Styling Container
- (Uses the same files as Customizable Text Layers)

### Canvas Settings Container
- `js/app/ui/canvas-settings.js` - Canvas settings functionality
- `js/app/ui/image-format.js` - Image format selection
- `js/app/ui/advanced-options.js` - Advanced options panel

### Star Map Image Settings Container
- `js/app/ui/image-settings.js` - Image settings functionality

### Action Buttons Container
- `js/app/ui/action-buttons.js` - Action buttons functionality
- `js/app/settings/load.js` - Load settings functionality
- `js/app/settings/save.js` - Save settings functionality
- `js/app/settings/defaults.js` - Default settings

### Preview Section
- `js/app/ui/zoom.js` - Zoom functionality
- `js/app/starmap/preview.js` - Preview functionality
- `js/app/starmap/generator.js` - Star map generation
- `js/app/starmap/download.js` - Download functionality

### Color Picker
- `js/color-picker.js` - External color picker library
- `js/picker_init.js` - Color picker initialization
- `js/app/ui/color-picker.js` - Color picker integration

## HTML Structure

The HTML structure is primarily created by JavaScript in the `main_app.js` file, which contains the following functions that create the UI components:

- `createEventDetailsComponents()` - Creates the Event Details container
- `createCoordinatesComponents()` - Creates the Map Location container
- `createTextLayerComponents()` - Creates the Customizable Text Layers container
- `createFixedTextStylingComponents()` - Creates the Fixed Text Styling container
- `createCanvasSettingsComponents()` - Creates the Canvas Settings container
- `createImageFormatComponents()` - Creates the Image Format container
- `createTextPlacementComponents()` - Creates the Text Placement container
- `createAdvancedOptionsComponents()` - Creates the Advanced Options panel
- `createImageSettingsComponents()` - Creates the Image Settings container
- `createActionButtonsComponents()` - Creates the Action Buttons container
- `createZoomComponents()` - Creates the Zoom container

The base HTML structure is in `index-new.html`, which contains the container elements that are populated by the JavaScript functions.
