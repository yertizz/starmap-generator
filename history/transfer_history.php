<?php
/**
 * History Data Transfer Script
 * 
 * This script safely transfers history data from the old project (/starmap/history/data/)
 * to the new project (/star-map/history/data/).
 * 
 * It handles:
 * - Only copying compatible history files
 * - Properly handling user ID prefixes
 * - Not overwriting existing history data
 * - Providing clear feedback
 */

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuration
$oldProjectPath = 'C:/Users/phili/E-DRIVE/AnythingPOD/starmap/history/data/';
$newProjectPath = 'C:/Users/phili/E-DRIVE/AnythingPOD/star-map/history/data/';

// List of compatible history keys (files we know are safe to transfer)
$compatibleKeys = [
    'zipCodeHistory',
    'history_text-entry-1',
    'history_text-entry-2',
    'history_text-entry-3',
    'history_text-entry-4',
    'test_history_key'
];

// Function to safely transfer a history file
function transferHistoryFile($oldPath, $newPath, $filename, $userId = null) {
    // Check if the old file exists
    if (!file_exists($oldPath . $filename)) {
        return [
            'success' => false,
            'message' => "Source file not found: {$oldPath}{$filename}"
        ];
    }
    
    // Read the old file
    $jsonData = file_get_contents($oldPath . $filename);
    if ($jsonData === false) {
        return [
            'success' => false,
            'message' => "Failed to read source file: {$oldPath}{$filename}"
        ];
    }
    
    // Parse the JSON data
    $historyData = json_decode($jsonData, true);
    if ($historyData === null) {
        return [
            'success' => false,
            'message' => "Failed to parse JSON data from: {$oldPath}{$filename}"
        ];
    }
    
    // Determine the new filename (with user ID prefix if provided)
    $newFilename = $filename;
    if ($userId !== null) {
        // Extract the base key from the filename (remove .json extension)
        $baseKey = pathinfo($filename, PATHINFO_FILENAME);
        $newFilename = "{$userId}_{$baseKey}.json";
    }
    
    // Check if the new file already exists
    $newFilePath = $newPath . $newFilename;
    $existingData = [];
    if (file_exists($newFilePath)) {
        // Read the existing file
        $existingJsonData = file_get_contents($newFilePath);
        if ($existingJsonData !== false) {
            $existingData = json_decode($existingJsonData, true);
            if ($existingData === null) {
                $existingData = [];
            }
        }
    }
    
    // Merge the old data with the existing data (if any)
    // Remove duplicates and keep the order (newer items first)
    $mergedData = $existingData;
    foreach ($historyData as $item) {
        if (!in_array($item, $mergedData)) {
            $mergedData[] = $item;
        }
    }
    
    // Limit to 30 items
    if (count($mergedData) > 30) {
        $mergedData = array_slice($mergedData, 0, 30);
    }
    
    // Save the merged data to the new file
    $result = file_put_contents($newFilePath, json_encode($mergedData));
    if ($result === false) {
        return [
            'success' => false,
            'message' => "Failed to write to destination file: {$newFilePath}"
        ];
    }
    
    return [
        'success' => true,
        'message' => "Successfully transferred {$filename} to {$newFilename}",
        'items_transferred' => count($historyData),
        'items_total' => count($mergedData)
    ];
}

// Function to get all JSON files in a directory
function getJsonFiles($directory) {
    $files = [];
    if (is_dir($directory)) {
        $dirHandle = opendir($directory);
        while (($file = readdir($dirHandle)) !== false) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'json') {
                $files[] = $file;
            }
        }
        closedir($dirHandle);
    }
    return $files;
}

// Main execution
echo "<html><head><title>History Data Transfer</title>";
echo "<style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1, h2 { color: #0056b3; }
    .success { color: green; }
    .error { color: red; }
    .warning { color: orange; }
    .info { color: blue; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    tr:nth-child(even) { background-color: #f9f9f9; }
</style>";
echo "</head><body>";
echo "<h1>History Data Transfer</h1>";

// Check if the directories exist
if (!is_dir($oldProjectPath)) {
    echo "<p class='error'>Old project directory not found: {$oldProjectPath}</p>";
    echo "<p>Please update the \$oldProjectPath variable in this script.</p>";
    echo "</body></html>";
    exit;
}

if (!is_dir($newProjectPath)) {
    echo "<p class='error'>New project directory not found: {$newProjectPath}</p>";
    echo "<p>Please update the \$newProjectPath variable in this script.</p>";
    echo "</body></html>";
    exit;
}

// Get all JSON files in the old project
$oldFiles = getJsonFiles($oldProjectPath);
if (empty($oldFiles)) {
    echo "<p class='warning'>No JSON files found in the old project directory.</p>";
    echo "</body></html>";
    exit;
}

// Display form for user ID input
echo "<form method='post'>";
echo "<h2>Transfer Options</h2>";
echo "<p><label for='user_id'>User ID (optional, leave empty to keep original filenames):</label><br>";
echo "<input type='text' name='user_id' id='user_id' style='width: 300px;'></p>";

echo "<p><label for='selected_files'>Select files to transfer:</label><br>";
echo "<select name='selected_files[]' id='selected_files' multiple style='width: 300px; height: 200px;'>";
foreach ($oldFiles as $file) {
    $baseKey = pathinfo($file, PATHINFO_FILENAME);
    $isCompatible = in_array($baseKey, $compatibleKeys);
    echo "<option value='{$file}'";
    if ($isCompatible) {
        echo " selected";
    }
    echo ">{$file}";
    if (!$isCompatible) {
        echo " (may not be compatible)";
    }
    echo "</option>";
}
echo "</select></p>";
echo "<p><small>Hold Ctrl/Cmd to select multiple files. Compatible files are pre-selected.</small></p>";

echo "<p><input type='submit' name='transfer' value='Transfer Selected Files'></p>";
echo "</form>";

// Process form submission
if (isset($_POST['transfer'])) {
    $userId = !empty($_POST['user_id']) ? $_POST['user_id'] : null;
    $selectedFiles = isset($_POST['selected_files']) ? $_POST['selected_files'] : [];
    
    if (empty($selectedFiles)) {
        echo "<p class='warning'>No files selected for transfer.</p>";
    } else {
        echo "<h2>Transfer Results</h2>";
        echo "<table>";
        echo "<tr><th>File</th><th>Status</th><th>Message</th></tr>";
        
        foreach ($selectedFiles as $file) {
            $result = transferHistoryFile($oldProjectPath, $newProjectPath, $file, $userId);
            
            echo "<tr>";
            echo "<td>{$file}</td>";
            if ($result['success']) {
                echo "<td class='success'>Success</td>";
                echo "<td>{$result['message']} ({$result['items_transferred']} items transferred, {$result['items_total']} items total)</td>";
            } else {
                echo "<td class='error'>Error</td>";
                echo "<td>{$result['message']}</td>";
            }
            echo "</tr>";
        }
        
        echo "</table>";
    }
}

echo "<h2>Current Files in New Project</h2>";
$newFiles = getJsonFiles($newProjectPath);
if (empty($newFiles)) {
    echo "<p class='info'>No JSON files found in the new project directory yet.</p>";
} else {
    echo "<table>";
    echo "<tr><th>File</th><th>Size</th><th>Last Modified</th></tr>";
    
    foreach ($newFiles as $file) {
        $filePath = $newProjectPath . $file;
        $fileSize = filesize($filePath);
        $fileModified = date("Y-m-d H:i:s", filemtime($filePath));
        
        echo "<tr>";
        echo "<td>{$file}</td>";
        echo "<td>" . number_format($fileSize) . " bytes</td>";
        echo "<td>{$fileModified}</td>";
        echo "</tr>";
    }
    
    echo "</table>";
}

echo "</body></html>";
