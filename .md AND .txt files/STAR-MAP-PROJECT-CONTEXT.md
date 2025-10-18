/* START OF CODE - Cline - 2025-06-23 11:08 File: STAR-MAP-PROJECT-CONTEXT.md */

# STAR-MAP PROJECT CONTEXT & RECOVERY GUIDE
## Created: 2025-06-23 11:08 AM
## Purpose: AI Context Recovery for Cline/AI Model Crashes

---
STAR-MAP PROJECT SUMMARY: 06/25/ 10:00 AM
========================
The purpose of this app is to allow a user to create a final image product namely, 5 different images of a star map image provided by the STAR-MAP API.

This project is a web app made up of html, js, and css files. Firebase is used for auth and currently. json files saves settings/histories.

A single html form page is used to provide the user interface for the user to customize and control the pre-requisites required to produce the star map image and the Google js API interfaces permit the setup and creation of a google street map for combined landscape and portrait canvases complete with star map AND a street map.

The form page basically comprises features and configuration functions in a series of flowing "containers":

1. The "Event Details" ~ Container #1:
This container has 4 main functions:
a. The selection from a drop down list of pre-configured "event" items e.g. Birthday, Father's Day, Sweet 16, and a list-item to that allows the user to "Add Your Own".
b. Date: The Date entry allows the user to enter the date manually or use the calendar icon to display a calendar where the date can be set.
c. Time: The Time entry allows the user to select the time via a drop down list of hours and minutes an AM/PM
d. Time Toggle Button: The Time Toggle button allows the user to "disable or enable the time for eventual display later in the Canvas-Layout image. Essentially, whether the time appears in a text overlay or not.

2. Map Location: This Map-Canvas" ~ Container #2:
This container has 3 main "street map" functions and is the [2nd] mandatory-prerequisite for the app to function!
NOTE: This is a CRITICAL container - if the Map ceases to work, so does the App! This is because the exact coordinates location along with the date and time, are required by the Star Map API in order to "calculate, create, then fetch" the star map image which is displayed in a circle. Standard Google Maps functions are provide the user to select their final latitude and Longitude Coordinates. this can be achieved in 4 ways.
a. The user can enter Lat and Long coordinates in the entry fields directly (in degrees, minutes, and up to 5 decimal places of minutes)
b. The user can enter a valid Zip Code into the [Zip/Postal:] field which moves the map to the crosshairs center using the Zip's polygon center-coordinates. A drop-down list can remember up to the 30 entries and also the capability to right-click to remove a specific zip-code from the list.
c. By Address: the user can enter manually a "valid" street address into the [By Address:] field. A drop-down list can remember up to the 30 entries and also the capability to right-click to remove a specific address from the list.
d. The user can use their mouse to move the map by dragging or zooming the map to where their desired coordinates sit over the center of the map-display's center-crosshairs.

3. Customizable Text Layers + Fixed Layers ~ Container #3:
This container comprises 2 separate sections namely [Customizable Text Layers] and [Fixed Layers].
a. Customizable Text Layers Section: This allows the user to enter up to 4 customized text entries to a max of 50 characters. They can select the desired font-family, font-size, Bold/Italic and color attributes for each of the maximum of 4 lines. 
b. Fixed Layers Section: This section does not allow any "VALUES" interaction with the user hence, "Fixed Layers"!. The section has 2 rows namely "Date" and "Lat/Long".
b1. The [Date] value is captured from the date setting in the Event Detail's container #1 and is an "app dependent" value! No date, no anything! However, the user may make attribute selections via font-family, font-size, Bold/Italic and text color.
b2. The [Lat/Long] is captured from the map display coordinates in container #2 and is an "app dependent" value! No Lat/Long, no anything!. However, the user may make attribute selections via font-family, font-size, Bold/Italic and text color.

4. Star Map Canvas + Image Settings ~ Container #4:
This container has [3] sections in it and is used to configure the final image-display canvas dimensions, Viewing Options, and Text Placements on the Canvas:

a.[Star Map Canvas] section: This is the first of [3] separate sections withing this container namely the canvas Dimensions entry/selection, Resolution (DPI), Aspect Ratio and Star Map canvas background color-picker.
a1. The width(w) and height(h) dimensions can be entered manuakly or, by selection from a drop-down list, a series of standard USA/Imperial or European/metric standard paper sizes. Along with the selected DPI setting (72, 150, 200 or 300(hi-res) selected, the app calculates and then inserts the dimensions into the width and height entry fields automatically.
a2. The "Aspect Ratio" check box if checked, merely overwrite the "height value with the width value making it essentially, a square.
a3. The canvas Bg color-picker allows the user to seelct a background color for the ultimate final image display later selcted.

b1. [Combined View Options] section: This is the 2nd of the 3 sections and allows the user to select via a slider bar, the percentage overlap of the street map and the star map later used in the "Combined  Landscape and Portrait" view features later explained. The default is 5%.
b2. The "Map Order" and final row of this section, allows the user to select via a radio-button choice, whether to have the star map or street map appear first in the "Combined  Landscape and Portrait" view features later explained.

c. [Star Map Image Settings] section: This final section of Container #3 is used to configure the [6] text layers that can be written on the star map image. They comprise the 4 customizable text layers and the 2 fixed-layers namley, text layer 1,2,3, and 4, Date and finally Coordinates. All 6 of the "text" fields are *not* user-accessible here. There are 3 features in this section that may be modified by the user and as follows:
c1. Order: This allows the user via a drop-down list to select the "order" of the text layers/placements via a drop-down selctor of First, Second, Thrid, Fourth, Fifth, and Sixth. Essentially, the order that the text layers get "placed" onto the star map image.
c2. Above Map: This permits the user via a radio-button to chose whether the text layer apears [Above] the star map image on the final canvas layout.
c3. Below Map: This permits the user via a radio-button to chose whether the text layer apears [Below] the star map image on the final canvas layout.


5. Settings + Preview + Download ~ Container #5:
This container has [6] sections to it:
a. Load and Save Settings BLUE buttons Section #1: These button functions allow the user to SAVE or Re-LOAD all app settings.

b. View Options - Section #2: There are 5  [VIEW] and [DOWNLOAD] buttons:
b1. Star Map: This presents [ONLY] the Star Map image on the star map canvas for the user to approve. 
b2. Street Map: This presents [ONLY] the Street Map image on the star map canvas for the user to approve.
b3. Canvas Layout: This presents [ONLY] the Street Map image on the star map canvas for the user to approve.
b4. Combined LANDSCAPE: This presents [BOTH] the Star Map AND the Street Map image in their circles along with their configured overlap and border color attributes on the star map canvas for the user to approve.
NOTE: There is logic that determines the canvas aspect (Landscape or Portrait) that if the dims that are set are of a Portrait aspect, the Landscape feature will flip its dimensions and display the view accordingly.
b5. Combined PORTRAIT: This presents [BOTH] the Star Map AND the Street Map image in their circles along with their configured overlap and border color attributes on the star map canvas for the user to approve.
NOTE: There is logic that determines the canvas aspect (Landscape or Portrait) that if the dims that are set are of a Landscape aspect, the Portrait feature will flip its dimensions and display the view accordingly.

c. View Options - Section #2 ~ 2nd row: There are 5 [DOWNLOAD] buttons:
Each of these download buttons merely downloads what the view buttons display and to local storage.

d. Image Format - the 4th and final row of this container #5: There are [5] options presented on this final container row which comprise 4 radio buttons and one checkbox:
d1. PNG radio button. This sets the image format when downloading to the PNG format. 
d2. TRANSPARENCY PNG ONLY. This is a checkbox that is available to the user BUT, only if the PNG radio button is selected. This check box becomes disabled when any of the other radio buttons are used.

d3. JPG radio button. This sets the image format when downloading to the JPG format and disables the PNG and its associated transparency checkbox. 
d4. SVG radio button. This sets the image format when downloading to the SVG format and disables the PNG and its associated transparency checkbox. 
d5. PDF radio button. This sets the image format when downloading to the PDF format and disables the PNG and its associated transparency checkbox. 


e. Zoom section: This is a Zoom Slider that allows the user to zoom in/out of the current "viewed" button image to check for errors or refinement endeavors. Default is 100% and max is 200%

f. Canvas Display feature: This is the final destination of the entire app. this is the end product that the user used the app for in the first pace! without this, the app is useless!!
NOTE: The [Canvas Display] is where the ultimate image/end product is displayed to the user. Above the Canvas Display is a "text" line that tells the user the Dimensions used and also, if a Paper-Size was used to configure the dimensions. If no paper-Size is selected, the text tip will just show the dimensions for example:Dimensions: 2550w x 3300h pixels. 
---

## PROJECT OVERVIEW
**Root Folder:** `C:\Users\phili\E-DRIVE\AnythingPOD\star-map`

**Purpose:** Web application to create 5 different star map images using Star-Map API, combining star maps with Google Street Maps, with full customization capabilities.

**Tech Stack:** HTML, JavaScript, CSS, Firebase Auth, JSON settings/history

---

## FOLDER STRUCTURE
```
C:\Users\phili\E-DRIVE\AnythingPOD\star-map\
├── Star_Map_Generator.html (Main HTML file)
├── js/ (JavaScript files)
├── css/ (CSS files)
├── proxy/ (Proxy files)
├── settings/ (Settings JSON files)
├── history/ (History JSON files)
├── assets/images/ (Image assets)
└── backup/ (Backup scripts and files)
    └── create-star-map-backup.bat
```

**Backup Destination:** `C:\Users\phili\E-DRIVE\AnythingPOD\STAR-MAP-SOURCE_BACKUPS_050825`



---

## APPLICATION CONTAINERS & FUNCTIONALITY

### Container #1: Event Details
**Functions:**
- Event selection dropdown (Birthday, Father's Day, Sweet 16, Add Your Own)
- Date entry (manual or calendar picker)
- Time selection (hours/minutes/AM-PM dropdown)
- Time Toggle Button (enable/disable time display in final image)

### Container #2: Map Location (CRITICAL - App depends on this!)
**Functions:**
- Direct Lat/Long coordinate entry (degrees, minutes, 5 decimal places)
- Zip Code entry with 30-item memory dropdown + right-click removal
- Address entry with 30-item memory dropdown + right-click removal
- Interactive Google Maps with drag/zoom to center crosshairs
**Note:** Exact coordinates + date/time required for Star Map API calculations

### Container #3: Customizable Text Layers + Fixed Layers
**Customizable Text Layers:**
- Up to 4 custom text entries (50 char max each)
- Font family, size, bold/italic, color selection per line

**Fixed Layers (No user value input):**
- Date layer (from Container #1) - styling only
- Lat/Long layer (from Container #2) - styling only

### Container #4: Star Map Canvas + Image Settings
**Section A - Star Map Canvas:**
- Width/Height dimensions (manual or standard paper sizes)
- Resolution: 72, 150, 200, 300 DPI
- Aspect Ratio checkbox (makes square)
- Background color picker

**Section B - Combined View Options:**
- Overlap percentage slider (default 5%)
- Map order radio buttons (star map or street map first)

**Section C - Star Map Image Settings:**
- 6 text layers: 4 custom + Date + Coordinates
- Order selection (First through Sixth)
- Above/Below map radio button placement

### Container #5: Settings + Preview + Download
**Section A - Load/Save Settings:**
- Blue SAVE/LOAD buttons for all app settings

**Section B - View Options (5 buttons):**
- Star Map (star map only)
- Street Map (street map only)
- Canvas Layout (canvas layout only)
- Combined LANDSCAPE (both maps with overlap)
- Combined PORTRAIT (both maps with overlap)
**Note:** Logic auto-flips dimensions based on aspect ratio

**Section C - Download Options:**
- 5 download buttons matching view options

**Section D - Image Format:**
- PNG radio + Transparency checkbox (PNG only)
- JPG radio (disables PNG transparency)
- SVG radio (disables PNG transparency)
- PDF radio (disables PNG transparency)

**Section E - Zoom:**
- Zoom slider 100%-200% for current viewed image

**Section F - Canvas Display:**
- Final destination display area
- Dimension text display above canvas

---

## CRITICAL CODING RULES & GUIDELINES

### MANDATORY RULES (NEVER BREAK THESE):

1. **File Headers:** Always include at start and end of every file:
   ```
   /* START OF CODE - Cline - YYYY-MM-DD HH:MM File: path/filename */
   /* END OF CODE - Cline - YYYY-MM-DD HH:MM File: path/filename */
   ```

2. **File Writing Protocol:**
   - **ALWAYS use `write_to_file` - NEVER use `replace_in_file`**
   - **ALWAYS use `read_file` immediately before `write_to_file`**
   - **ALWAYS create local backup before writing using format:**
     `filename_bak_YYYYMMDD_HHMMSS.ext`

3. **Code Delivery:**
   - Send COMPLETE source code for each file
   - NO code snippets unless 100% stuck
   - NO environment details at end of code

4. **Backup Protocol:**
   - Use `create-star-map-backup.bat` for full project backups
   - Create local file backups before any write operation
   - Backup naming: `filename_bak_YYYYMMDD_HHMMSS.ext`

### ABBREVIATIONS:
- **SST** = "See attached screenshots"
- **CMU** = "Code manually updated and is now live on server"

### COORDINATE FORMAT:
```
// First part (e.g., N38° 6.09015′)
// Second part (e.g., W94° 41.60395′)
```

---

## RECOVERY CHECKLIST FOR AI CRASHES:

1. **Read this entire document first**
2. **Check current project state:**
   - Read main HTML file: `Star_Map_Generator.html`
   - Check recent JS files in `/js/` folder
   - Look for any error patterns in file names
3. **Identify last working state:**
   - Check backup folder timestamps
   - Review recent file modifications
4. **Follow all coding rules above**
5. **Ask for console logs if debugging needed**
6. **Create backup before any changes**

---

## COMMON ISSUES TO WATCH FOR:
- Google Maps API functionality (Container #2 is critical)
- Star Map API coordinate calculations
- Canvas rendering and display issues
- File write/read operations
- Image format and download functionality

---

## EMERGENCY CONTACTS:
- User prefers complete file rewrites over partial fixes
- Always request console logs for debugging
- User will use "SST" for screenshot references
- User will use "CMU" for manual code updates

---

**Last Updated:** 2025-06-23 11:08 AM
**Created by:** Cline AI Assistant
**Purpose:** Context recovery for AI model crashes/restarts

/* END OF CODE - Cline - 2025-06-23 11:08 File: STAR-MAP-PROJECT-CONTEXT.md */
