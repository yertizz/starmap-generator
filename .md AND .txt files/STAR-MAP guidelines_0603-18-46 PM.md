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


STAR-MAP RULES AND GUIDELINES : 06/23/ 10:00 AM
=============================

AI CODING MESSAGING GUIDELINES AND RULES I WANT YOU TO FOLLOW:
=============================================================
ROOT FOLDER:
"C:\Users\phili\E-DRIVE\AnythingPOD\star-map"

"C:\Users\phili\E-DRIVE\AnythingPOD\star-map\Star_Map_Generator.html"
JS: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\js"
CSS: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\css"
PROXY: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\proxy"
SETTINGS: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\settings"
HISTORY: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\history"
ASSETS-IMAGES: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\assets\images"
BACKUP: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\backup\create-star-map-backup.bat" ~~~ From VS Code Terminal local"  .\backup\create-backup.bat TO:
"C:\Users\phili\E-DRIVE\AnythingPOD\STAR-MAP-SOURCE_BACKUPS_050825"

1. PLACE A COMMENT AT THE START AND THE END OF EVERY FILE WE WRITE TO - AN EXAMPLE FOLLOWS:
-  /* START OF CODE - Cline - 2025-04-09 17:20 File: js/map.js */
-  /* END OF CODE - Cline - 2025-04-09 17:20 File: js/map.js */

2. INSTEAD OF ME TYPING EACH RESPONSE WITH "SEE ATTACHED SCREENSHOTS" - I WILL BE USING THE ABBREVIATION "SST" or SST# or SST # etc. etc. etc.

3. WE HAVE BACKUP BATCH FILE WE CAN RUN THAT SAVES A GOOD POINT IN TIME WITH ALL CODE UNDER THE ROOT FOLDER: THIS IS CALLED:  "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\backup\create-star-map-backup.bat"

*** BACKUP FOLDERS ARE STORED IN THE FOLDER:
"C:\Users\phili\E-DRIVE\AnythingPOD\STAR-MAP-SOURCE_BACKUPS_050825"
*** SEE ALSO #10

4. IF YOU NEED CONSOLE LOGS... PLEASE MAKE A POINT OF REQUESTING THEM IN YOUR RESPONSE TO TEST ETC - ELSE I WILL NOT SEND THEM.

5. ALWAYS USE THE write_to_file FUNCTION WHEN EVER YOU WRITE TO 'ANY' FILE - 'NEVER' USE THE replace-in_file function "IT NEVER WORKS" AND IS TOTALLY UNRELIABLE.
*** YOU PERISTENTLY FAIL WITH "READ IN PLACE" !!

6. SAFEGUARDING TRUNCATED OR CORRUPTS "OVERWRITES" BEFORE SAVING A FILE:
Simplest Safeguard Task: The simplest, most direct action to take before each write_to_file call is to perform a read_file on the target file immediately beforehand. This ensures you have the absolute latest version as your starting point for constructing the new content, reducing the risk of errors caused by working from outdated information in your context window. While it doesn't guarantee against truncation during content generation, it makes the input to that generation process as accurate as possible.

Notice:
I understand that you cannot guarantee no truncation due to internal limitations, but the best safeguard is to always read the file immediately before constructing the full content for the write operation.

*** USE read_file immediately before every write_to_file as an acceptable safeguard step ***

7. ACRONYM TO CUT DOWN ON TYPING FOR: "CODE MANUALLY UPDATED AND IS NOW 'LIVE ON THE SERVER":
I WILL USE THE FOLLOWING: CMU or CMU+ or CMU + ~ COMMENTS MAY FOLLOW

8. "NEVER" SEND CODE SNIPPETS... SEND "COMPLETE" SOURCE CODE FOR EACH FILE! UNLESS WE ARE 100% STUCK, THEN YOU MAY REQUEST THAT "I" EDIT WITH A SNIPPET MANUALLY IN VS CODE TO TO GET US BACK ON TRACK.

9. DO NOT INCLUDE ENVIRONMENT DETAILS AT END OF CODE.
*** REPEAT****  !!!!!!!!!!!!!! DO NOT INCLUDE ENVIRONMENT DETAILS AT END OF CODE!!!!!!!!!!!!!

10. BACKUPS: *** CRITICAL RULE : ****
THIS PREVENTS SPAWNING *NEW* FILES  ALL THE TIME, BACKS UP THE FILE YOU ARE ABOUT TO WRITE, THEN OVERWRITES. THIS WAY, IF CASE OF A DISASTER WITH WRITING, WE CAN REVERT TO THE FILE AS IT WAS SAVED ONLY SECONDS BEFORE!!
*** ACKNOWLEDGE AND AGREE TO USE!!!

"C:\Users\phili\E-DRIVE\AnythingPOD\star-map\backup\create-star-map-backup.bat"
AFTER YOU HAVE "READ" A FILE, FOR MORE BACKUP PROTECTION-GRANULARITY, YOU ARE TO:
a. IF THE FILE YOU HAVE READ, REQUIRES EDITING OR CHANGING OR RE-WRITING/SAVING, PERFORM A BACKUP OF THE FILE FIRST IN ITS FOLDER, WITH THE FOLLOWING FORMATTTING FOR EXAMPLE, BACKUPPING UP THE js/main_app.js FILE USE:
main_app_[SIGNIFIES ITS A "LOCAL" BACKUP FILE]_[YEARMONTHDAY]_[HOURSMINUTES_SECONDS].js 
BACKUP FOLDER: "C:\Users\phili\E-DRIVE\AnythingPOD\STAR-MAP-SOURCE_BACKUPS_050825"

i.e main_app_[bak]_[20250508]_[1631_49].js 
Complete example: main_app_bak_20250504_1631_49.js 

STAR MAP CENTER-FORMATTING:
// First part (e.g., N38° 6.09015′)
// Second part (e.g., W94° 41.60395′)

************************************************************************
ACKNOWLEDGE AND CONFIRM YOU UNDERSTAND AND WILL ABIDE MY THE GUIDELINES
AT ALL TIMES. IF YOU FEEL AN EXCEPTION IS WARRANTED, ASK ME FIRST
CONFIRM??
************************************************************************

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Google Maps API 05/07/25 :
Maps API : AIzaSyCpvv1IJYxwGVMh24MLFDH6LmupseApSZU


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
Google Maps API 05/07/25 :
Maps API : AIzaSyCpvv1IJYxwGVMh24MLFDH6LmupseApSZU 
Billing ID:  4366-4804-7508
Billing account ID: 010E79-60C176-2CDE58


------------------------
GeoApify. 4/29/2025
Geocoding API: 0464276dd8224f90bff827b91e995e2a
https://apidocs.geoapify.com/docs/geocoding/
------------------------

THE PRIMARY TASK IS NOW AS FOLLOWS:
1. WE MUST COMPLETELY REPLACE ALL "GOOGLE MAP API" FUNCTIONALITY WITH THE "GEOAPIFY" API.
GEOAPIFY KEY: GeoApify. 4/29/2025
- Geocoding API: 0464276dd8224f90bff827b91e995e2a
- DOCS: https://apidocs.geoapify.com/docs/geocoding/

https://anythingpod.com/star-map/index-new.html

2. THE FOLLOWING ROOT FOLDERS ARE TO BE USED TO READ AND EDIT FOR THIS PROJECT FROM NOW ON.
ROOT FOLDER:
"C:\Users\phili\E-DRIVE\AnythingPOD\star-map"
HTML FILE: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\Star_Map_Generator.html"
JS: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\js"
CSS: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\css"
PROXY: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\proxy"
SETTINGS: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\settings"
HISTORY: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\history"
ASSETS-IMAGES: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\assets\images"
BACKUP: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\backup"

*** NOTE MY GUIDELINES FOR DEVELOPING TOGETHER SENT MINUTES AGO. ACKNOWLEDGE AND CONFIRM.

VIP: THE "PRIMARY" FILES THAT ARE USED FOR THE GEOCODING FUNCTIONS ARE (NOT NECESSARILY "ALL" THE FILES):
A. "C:\Users\phili\E-DRIVE\$1 AnythingPOD\star-map\Star_Map_Generator.html"
B. "C:\Users\phili\E-DRIVE\$1 AnythingPOD\star-map\js\main_app.js"
C. "C:\Users\phili\E-DRIVE\$1 AnythingPOD\star-map\js\map.js"

NOTE: ONCE ALL THE GOOGLE MAP FUNCTIONS ARE REPLACED WITH THOSE OF GEOAPIFY, WILL THEN INVESTIGATE CREATING THE STAR MAP.

AI CODING MESSAGING GUIDELINES AND RULES I WANT YOU TO FOLLOW:
=============================================================
ROOT FOLDER:
"C:\Users\phili\E-DRIVE\AnythingPOD\star-map"

HTML FILE: *** CURENTLY: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\index-new.html"
JS: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\js"
CSS: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\css"
PROXY: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\proxy"
SETTINGS: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\settings"
HISTORY: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\history"
ASSETS-IMAGES: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\assets\images"
BACKUP: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\backup" : From VS Code Terminal local"  .\backup\modular-backup.bat
c:\Users\phili\E-DRIVE\AnythingPOD\star-map\WIKI-SKY_star-map-SOURCE_BACKUPS

1. PLACE A COMMENT AT THE START AND THE END OF EVERY FILE WE WRITE TO - AN EXAMPLE FOLLOWS:
-  /* START OF CODE - Cline - 2025-04-09 17:20 File: js/map.js */
-  /* END OF CODE - Cline - 2025-04-09 17:20 File: js/map.js */

2. INSTEAD OF ME TYPING EACH RESPONSE WITH "SEE ATTACHED SCREENSHOTS" - I WILL BE USING THE ABBREVIATION "SST" AND SST# ETC ETC

3. WE HAVE BACKUP BATCH FILE WE CAN RUN THAT SAVES A GOOD POINT IN TIME WITH ALL CODE UNDER THE ROOT FOLDER: THIS IS CALLED:  "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\backup\modular-backup.bat

*** BACKUP FOLDERS ARE STORED IN THE FOLDER:
c:\Users\phili\E-DRIVE\AnythingPOD\star-map\WIKI-SKY_star-map-SOURCE_BACKUPS
*** SEE ALSO #10

4. IF YOU NEED CONSOLE LOGS... PLEASE MAKE A POINT OF REQUESTING THEM IN YOUR RESPONSE TO TEST ETC - ELSE I WILL NOT SEND THEM.

5. ALWAYS USE THE write_to_file FUNCTION WHEN EVER YOU WRITE TO 'ANY' FILE - 'NEVER' USE THE replace-in_file function "IT NEVER WORKS" AND IS TOTALLY UNRELIABLE.
*** YOU PERISTENTLY FAIL WITH READ IN PLACE !!

6. SAFEGUARDING TRUNCATED OR CORRUPTS "OVERWRITES" BEFORE SAVING A FILE:
Simplest Safeguard Task: The simplest, most direct action to take before each write_to_file call is to perform a read_file on the target file immediately beforehand. This ensures you have the absolute latest version as your starting point for constructing the new content, reducing the risk of errors caused by working from outdated information in your context window. While it doesn't guarantee against truncation during content generation, it makes the input to that generation process as accurate as possible.

Notice:
I understand that you cannot guarantee no truncation due to internal limitations, but the best safeguard is to always read the file immediately before constructing the full content for the write operation.

*** USE read_file immediately before every write_to_file as an acceptable safeguard step ***

7. ACRONYM TO CUT DOWN ON TYPING FOR: "CODE MANUALLY UPDATED AND IS NOW 'LIVE ON THE SERVER":
I WILL USE THE FOLLOWING: CMU OR CMU+ IF COMMENTS WILL FOLLOW

8. "NEVER" SEND CODE SNIPPETS... SEND "COMPLETE" SOUCRE CODE FOR EACH FILE! UNLESS WE ARE 100% STUCK, THEN YOU MAY REQUEST THAT "I" EDIT WITH A SNIPPET MANUALLY IN VS CODE TO TO GET US BACK ON TRACK.

9. DO NOT INCLUDE ENVIRONMENT DETAILS AT END OF CODE.
*** REPEAT****  !!!!!!!!!!!!!! DO NOT INCLUDE ENVIRONMENT DETAILS AT END OF CODE!!!!!!!!!!!!!

10. AFTER YOU HAVE "READ" A FILE, FOR MORE BACKUP PROTECTION-GRANULARITY, YOU ARE TO:
a. IF THE FILE YOU HAVE READ, REQUIRES EDITING OR CHANGING OR RE-WRITING/SAVING, PERFORM A BACKUP OF THE FILE FIRST IN ITS FOLDER, WITH THE FOLLOWING FORMATTTING FOR EXAMPLE, BACKUPING UP THE js/main_app.js FILE USE:
main_app_[SIGNIFIES ITS A "LOCAL" BACKUP FILE]_[YEARMONTHDAY]_[HOURSMINUTES_SECONDS].js 
i.e main_app_[bak]_[20250503]_[1631_49_17].js 
Complete example: main_app_bak_20250504_1631_49.js 

STAR MAP CENTER-FORMATTING:
// First part (e.g., N38° 6.09015′)
// Second part (e.g., W94° 41.60395′)


Stat Map API:https://myprojects.geoapify.com/login


THE COLONNADES, ST. PETE
N27° 46.49142′ W82° 42.75539′
--------------------
https://myprojects.geoapify.com/login
yzz
GraCie2107!!

---------------



STAR-MAP guidelines:  06/23/ 10:00 AM
===================


I HAVE REVERTED TO THE PREVIOUS *** NON-MODULARIZED" VERSION OF MY star mapping PROJECT BECUASE OF YOUR INAEDQUACIES TO SOLVE BASIC STYLING ISSUES WHICH WERE WORKING CORRECTLY IN THE PREVIOUS PRE-MODULARIZED PROJECT LOCATED LOCALLY AT:
"C:\Users\phili\E-DRIVE\AnythingPOD\star-map\ !! THIS IS WHERE WE SHALL BE WORKING USING THE HTML FILE: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\Star_Map_Generator.html"

SO, NOW WE WILL WORK ON THIS EARLIER PROJECT TO COMPLETE THAT WITH SOME MODOR UI FIZES AND BY ADDING A FEW MORE BUTTON FEATURES.

*** I WILL CREATE A BACKUP FILE FIRST BEFORE YOU BEGIN.

*** FIRST, A SUCCESSFUL BACK WAS PERFORMED:
USING : "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\backup\create-star-map-backup.bat" AT : 2025-05-08_11-01-53 IN THE FOLLOWING FOLDER:
"C:\Users\phili\E-DRIVE\AnythingPOD\STAR-MAP-SOURCE_BACKUPS_050825"


THE PRIMARY TASK IS NOW AS FOLLOWS:
1. WE MUST ENSURE THAT MY *** NEW *** GOOGLE MAPS API KEY IS UPDATED TO REPLACE ANY PREVIOUS CALL TO A PREVIOUS "GOOGLE MAP API":
*** THE NEW GOOGLE MAPS "API" KEY IS: AIzaSyCpvv1IJYxwGVMh24MLFDH6LmupseApSZU

FYI: *** I HAVE LOADED THE FILE AND THE GOOGLE MAP AND THE PROJECT IS WPORKING TO PRODUCE A PREVIEW AND DOWNLOAD STARMAP!!! 

2. THE FOLLOWING ROOT FOLDERS ARE TO BE USED TO READ AND EDIT FOR THIS PROJECT FROM NOW ON.

ROOT FOLDER:
"C:\Users\phili\E-DRIVE\AnythingPOD\star-map"

HTML FILE: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\Star_Map_Generator.html"
JS: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\js"
CSS: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\css"
PROXY: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\proxy"
SETTINGS: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\settings"
HISTORY: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\history"
ASSETS-IMAGES: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\assets\images"
BACKUP: "C:\Users\phili\E-DRIVE\AnythingPOD\star-map\backup\create-star-map-backup.bat"


*** NOTE MY GUIDELINES FOR DEVELOPING TOGETHER. ACKNOWLEDGE AND CONFIRM.
VIP: THE "PRIMARY" FILES THAT ARE USED FOR THE GEOCODING FUNCTIONS ARE (NOT NECESSARILY "ALL" THE FILES):
A. "C:\Users\phili\E-DRIVE\$1 AnythingPOD\star-map\Star_Map_Generator.html"
B. "C:\Users\phili\E-DRIVE\$1 AnythingPOD\star-map\js\main_app.js"
C. "C:\Users\phili\E-DRIVE\$1 AnythingPOD\star-map\js\map.js"

NOTE: ONCE THE FIRST TASK OF REPLACING THE GOOGLE MAP "API" IS WORKING WE WILL TEST "PREVIEWING" A STAR MAP.

