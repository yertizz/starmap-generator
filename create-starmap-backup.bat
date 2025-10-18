@echo off
REM Get current timestamp for folder name (YYYY-MM-DD_HH-MM-SS)
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set timestamp=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,2%-%datetime:~10,2%-%datetime:~12,2%

REM Define source and destination directories
set source_dir="C:/Users/phili/E-DRIVE/$1 AnythingPOD/sandbox-maps"
set backup_base_dir=STARMAP-SOURCE_BACKUP
set destination_dir=%backup_base_dir%\%timestamp%

REM Create the base backup directory if it doesn't exist
if not exist "%backup_base_dir%" mkdir "%backup_base_dir%"

REM Create the timestamped destination directory
mkdir "%destination_dir%"

REM Copy files using robocopy, excluding the backup directory itself and other specified items
echo Backing up files to %destination_dir%...
robocopy "%source_dir%" "%destination_dir%" /E /NFL /NDL /NJH /NJS /nc /ns /np
echo Backup complete.
pause
