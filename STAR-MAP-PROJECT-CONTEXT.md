/* START OF CODE - Cline - 2025-06-23 11:08 File: STAR-MAP-PROJECT-CONTEXT.md */

# STAR-MAP PROJECT CONTEXT & RECOVERY GUIDE
## Created: 2025-06-23 11:08 AM
## Purpose: AI Context Recovery for Cline/AI Model Crashes

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
