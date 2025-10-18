# Star Map Canvas Button Functions - Issues and Requirements

## Date: May 24, 2025

## Canvas Display Behavior Explanation (Added 5/25/2025)

### How the Canvas Display Works:

When you select a paper size (e.g., 11" x 17" portrait), the canvas maintains the exact aspect ratio of your chosen dimensions. This results in:

1. **Portrait Orientation (11" x 17")**:
   - Width: 11 inches
   - Height: 17 inches
   - Aspect ratio: 11:17 (taller than wide)
   - The canvas appears centered with blank columns on left/right because most screens are wider than this portrait ratio

2. **Display Behavior**:
   - The gray background shows the actual canvas bounds
   - Blank areas on sides maintain proper aspect ratio
   - Canvas is centered within the display area
   - All circles remain perfect (not oval)
   - Text scales proportionally to canvas size

3. **Download Behavior**:
   - Downloaded images are exactly the specified size (e.g., 11" x 17" at chosen DPI)
   - Gray background areas are NOT included in downloads
   - Only the canvas content is saved

This is **intentional and correct behavior** to ensure your star maps maintain proper proportions regardless of screen size.

---

### COMPLETED WORK
1. Fixed Layers styling is now complete with proper font-family and font-size dropdowns matching Customizable Text entries

### OUTSTANDING ITEMS NOT YET ADDRESSED
a. "Advanced Options" button functionality in "Star Map Image Settings" container
b. PDF download capability in "Settings + Preview + Download" container
c. Full testing of save/load settings functionality (to be done after all issues resolved)
d. Firebase integration beyond authentication

---

## NEXT CHALLENGE: STAR MAP CANVAS FORMATTING AND STYLING

### PROJECT OBJECTIVES
- Produce a star map image on the "Star Map Canvas" 
- Generate Google Street Map views
- Create combinations of both map types
- Enable viewing and downloading of styled images via "View Options" and "Download Options" buttons

### BUTTON FUNCTIONS OVERVIEW

#### View Options (Gold Buttons):
- Star Map
- Street Map  
- Canvas Layout  
- Combined (Landscape)  
- Combined (Portrait)

#### Download Options (Green Buttons):
- Star Map
- Street Map  
- Canvas Layout  
- Combined (Landscape)  
- Combined (Portrait)

### STYLING PARAMETERS
The project must use various dimension and attribute settings to calculate and style an aesthetically correct star map canvas image:

#### From "Star Map Canvas + Image Settings":
- Paper Auto-Size (connected to width & height dimensions)
- DPI setting
- Circle Radius %
- Border width (px)
- Border Color
- Star Map API image

---

## DETAILED BUTTON FUNCTION SPECIFICATIONS

### 1. Star Map Button
**Image only - no text layers**
- ONLY the Star Map image clipped inside radiused circle
- Selected background color (or transparency)
- Border width and color
- For viewing/downloading star map image independently

### 2. Street Map Button
**Image only - no text layers**
- ONLY the Google Street Map image clipped inside radiused circle
- Selected background color (or transparency)
- Border width and color
- For viewing/downloading street map image independently

### 3. Canvas Layout Button
**Primary function - includes all text layers**
- Star Map image clipped inside radiused circle with:
  - Selected background color (or transparency)
  - Border width and color
- Customizable Text Entries (max 4)
- Fixed Layer values:
  - Date/Time (with font family, size, color attributes)
  - Lat/Long coordinates (with font family, size, color attributes)
- Text placement controlled by "Text Placements On Star Map Canvas" container
- Maximum 6 text layers total
- User controls order and position (above/below star map)

### 4. Combined (Landscape) Button
**Horizontal layout with overlapping circles**
- BOTH Google Street Map AND Star Map images
- Each image in its own overlapping radiused circle
- Each with selected background color (or transparency)
- Border width and color for each circle
- Text layers placed according to "Text Placements On Star Map Canvas"
- Maximum 6 text layers
- User controls order and position

### 5. Combined (Portrait) Button
**Vertical layout with overlapping circles**
- BOTH Google Street Map AND Star Map images
- Each image in its own overlapping radiused circle
- Each with selected background color (or transparency)
- Border width and color for each circle
- Text layers placed according to "Text Placements On Star Map Canvas"
- Maximum 6 text layers
- User controls order and position

---

## CURRENT ISSUES WITH BUTTON FUNCTIONS

### Test Settings Used:
- Paper Auto-Size: 11 x 17"
- DPI: 300 (Hi-Res)
- Dimensions: 3300px × 5100px
- Map Style: Default
- Radius: 60% (default)
- Border: 15px
- Border Color: #FFD700 (Gold)
- Image Format: PNG with Transparency

### Screenshots Reference:
*Note: Screenshots taken at 50% zoom to capture entire content*
*Note: There are 5 View buttons and 5 corresponding Download buttons (10 total, not 12)*

1. **SST 1**: Canvas Layout issue (includes text layers with star map)
2. **SST 2**: Star Map only issue (no text layers)
3. **SST 3**: Street Map only issue (no text layers)
4. **SST 4**: Combined Landscape issue (both maps horizontal)
5. **SST 5**: Combined Portrait issue (both maps vertical)

### Known Issues:
- Text layers not appearing correctly on canvas
- Circle clipping not working properly
- Border styling inconsistent
- Overlapping circles in combined views not rendering correctly
- Background color/transparency issues
- Scaling problems with different paper sizes

---

## TECHNICAL REQUIREMENTS

### Canvas Rendering Requirements:
1. Proper circle clipping with specified radius percentage
2. Border rendering with correct width and color
3. Background color or transparency support
4. Text layer positioning (above/below map)
5. Proper scaling for different paper sizes and DPI settings

### Combined View Requirements:
1. Overlapping circle geometry calculations
2. Proper spacing between circles
3. Maintain aspect ratio for both maps
4. Text placement across combined layout

### Export Requirements:
1. PNG with optional transparency
2. JPG support
3. SVG vector format
4. PDF generation (not yet implemented)

---

## NEXT STEPS
1. Debug canvas rendering functions
2. Fix circle clipping algorithms
3. Implement proper text layer positioning
4. Test with various paper sizes and DPI settings
5. Implement PDF export functionality
6. Complete Advanced Options integration
