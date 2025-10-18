@echo off
setlocal enabledelayedexpansion

echo Creating COMPLETE backup of Star Map project...

REM Define Source and Base Backup Directory using Absolute Paths
set "SOURCE_DIR=C:\Users\phili\E-DRIVE\AnythingPOD\star-map"
set "BACKUP_BASE_DIR=C:\Users\phili\E-DRIVE\AnythingPOD\STAR-MAP-SOURCE_BACKUPS_050825"

REM Check if source directory exists
if not exist "%SOURCE_DIR%" (
    echo ERROR: Source directory not found: %SOURCE_DIR%
    goto ErrorExit
)

REM Check if base backup directory exists
if not exist "%BACKUP_BASE_DIR%" (
    echo ERROR: Base backup directory not found: %BACKUP_BASE_DIR%
    goto ErrorExit
)

REM Get timestamp using PowerShell (YYYY-MM-DD_HH-MM-SS)
for /f "usebackq tokens=*" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'"`) do set "TIMESTAMP=%%i"

REM Construct full target directory path
set "TARGET_DIR=%BACKUP_BASE_DIR%\%TIMESTAMP%"

echo Source Directory: %SOURCE_DIR%
echo Target Directory: %TARGET_DIR%

REM Create base target directory
if not exist "%TARGET_DIR%" (
    echo Creating target directory: %TARGET_DIR%
    mkdir "%TARGET_DIR%"
    if errorlevel 1 (
        echo Failed to create target directory: %TARGET_DIR%
        goto ErrorExit
    )
) else (
    echo Target directory already exists: %TARGET_DIR%
    REM Optional: Add logic here to abort or overwrite if needed
)

REM --- Copy ALL files and folders ---

REM Copy root files only (using robocopy with /LEV:1)
echo Copying root files...
robocopy "%SOURCE_DIR%" "%TARGET_DIR%" *.* /LEV:1 /XJ /R:2 /W:5
REM /LEV:1 :: copy only the top N levels (1=root files only).
REM /XJ :: Exclude Junction points (important for system dirs).
REM /R:2 :: Retry 2 times on failure.
REM /W:5 :: Wait 5 seconds between retries.

REM Copy ALL folders recursively
echo Copying js folder...
robocopy "%SOURCE_DIR%\js" "%TARGET_DIR%\js" /E /XJ /R:2 /W:5

echo Copying css folder...
robocopy "%SOURCE_DIR%\css" "%TARGET_DIR%\css" /E /XJ /R:2 /W:5

echo Copying proxy folder...
robocopy "%SOURCE_DIR%\proxy" "%TARGET_DIR%\proxy" /E /XJ /R:2 /W:5

echo Copying backup folder...
robocopy "%SOURCE_DIR%\backup" "%TARGET_DIR%\backup" /E /XJ /R:2 /W:5

echo Copying assets folder...
robocopy "%SOURCE_DIR%\assets" "%TARGET_DIR%\assets" /E /XJ /R:2 /W:5

echo Copying history folder...
robocopy "%SOURCE_DIR%\history" "%TARGET_DIR%\history" /E /XJ /R:2 /W:5

echo Copying json-diagnostics folder...
robocopy "%SOURCE_DIR%\json-diagnostics" "%TARGET_DIR%\json-diagnostics" /E /XJ /R:2 /W:5

echo Copying settings folder...
robocopy "%SOURCE_DIR%\settings" "%TARGET_DIR%\settings" /E /XJ /R:2 /W:5

echo Copying .md AND .txt files folder...
robocopy "%SOURCE_DIR%\.md AND .txt files" "%TARGET_DIR%\.md AND .txt files" /E /XJ /R:2 /W:5

echo Copying OLD_Star_Map_Generator FILES folder...
if exist "%SOURCE_DIR%\OLD_Star_Map_Generator FILES" (
    robocopy "%SOURCE_DIR%\OLD_Star_Map_Generator FILES" "%TARGET_DIR%\OLD_Star_Map_Generator FILES" /E /XJ /R:2 /W:5
)

echo.
echo Backup process finished for timestamp: %TIMESTAMP%
echo ALL folders and files have been backed up successfully!
goto :eof

:ErrorExit
echo Backup failed.
exit /b 1

endlocal
