<?php
/**
 * History Data Migration Script
 * 
 * This script migrates existing history data from the flat structure to the new directory-based structure.
 * It handles:
 * - Finding existing history files
 * - Extracting user IDs from filenames
 * - Creating user-specific directories
 * - Moving history files to the appropriate directories
 */

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuration
$dataDir = __DIR__ . '/data';

// Function to extract user ID from storage key
function extractUserId($filename) {
    // Remove .json extension
    $storageKey = pathinfo($filename, PATHINFO_FILENAME);
    
    // Check if the key has a user ID prefix (format: userId_baseKey)
    if (preg_match('/^([a-zA-Z0-9_-]+)_(.+)$/', $storageKey, $matches)) {
        return $matches[1]; // Return the user ID part
    }
    return null; // No user ID found
}

// Function to extract base key from storage key
function extractBaseKey($filename) {
    // Remove .json extension
    $storageKey = pathinfo($filename, PATHINFO_FILENAME);
    
    // Check if the key has a user ID prefix (format: userId_baseKey)
    if (preg_match('/^([a-zA-Z0-9_-]+)_(.+)$/', $storageKey, $matches)) {
        return $matches[2]; // Return the base key part
    }
    return $storageKey; // No prefix, return the whole key
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

// Function to migrate a history file
function migrateHistoryFile($dataDir, $filename) {
    $userId = extractUserId($filename);
    $baseKey = extractBaseKey($filename);
    
    // Skip files that don't have a user ID prefix
    if (!$userId) {
        return [
            'success' => false,
            'message' => "No user ID found in filename: {$filename}. Skipping."
        ];
    }
    
    // Create user directory if it doesn't exist
    $userDir = $dataDir . '/' . $userId;
    if (!file_exists($userDir)) {
        if (!mkdir($userDir, 0755, true)) {
            return [
                'success' => false,
                'message' => "Failed to create user directory: {$userDir}"
            ];
        }
    }
    
    // Source and destination paths
    $sourcePath = $dataDir . '/' . $filename;
    $destPath = $userDir . '/' . $baseKey . '.json';
    
    // Check if source file exists
    if (!file_exists($sourcePath)) {
        return [
            'success' => false,
            'message' => "Source file not found: {$sourcePath}"
        ];
    }
    
    // Read the source file
    $jsonData = file_get_contents($sourcePath);
    if ($jsonData === false) {
        return [
            'success' => false,
            'message' => "Failed to read source file: {$sourcePath}"
        ];
    }
    
    // Parse the JSON data
    $historyData = json_decode($jsonData, true);
    if ($historyData === null) {
        return [
            'success' => false,
            'message' => "Failed to parse JSON data from: {$sourcePath}"
        ];
    }
    
    // Save to destination file
    $result = file_put_contents($destPath, $jsonData);
    if ($result === false) {
        return [
            'success' => false,
            'message' => "Failed to write to destination file: {$destPath}"
        ];
    }
    
    // Delete the source file (optional)
    // Comment this out if you want to keep the original files as backup
    // unlink($sourcePath);
    
    return [
        'success' => true,
        'message' => "Successfully migrated {$filename} to {$destPath}",
        'items_count' => count($historyData)
    ];
}

// Main execution
echo "<html><head><title>History Data Migration</title>";
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
    .button { 
        display: inline-block; 
        padding: 10px 20px; 
        background-color: #0056b3; 
        color: white; 
        text-decoration: none; 
        border-radius: 4px; 
        cursor: pointer;
        border: none;
        font-size: 16px;
    }
    .button:hover {
        background-color: #003d82;
    }
</style>";
echo "</head><body>";
echo "<h1>History Data Migration</h1>";

// Check if the data directory exists
if (!is_dir($dataDir)) {
    echo "<p class='error'>Data directory not found: {$dataDir}</p>";
    echo "</body></html>";
    exit;
}

// Get all JSON files in the data directory
$jsonFiles = getJsonFiles($dataDir);
if (empty($jsonFiles)) {
    echo "<p class='warning'>No JSON files found in the data directory.</p>";
    echo "</body></html>";
    exit;
}

// Group files by user ID
$filesByUser = [];
$filesWithoutUserId = [];

foreach ($jsonFiles as $file) {
    $userId = extractUserId($file);
    if ($userId) {
        if (!isset($filesByUser[$userId])) {
            $filesByUser[$userId] = [];
        }
        $filesByUser[$userId][] = $file;
    } else {
        $filesWithoutUserId[] = $file;
    }
}

// Display migration form
echo "<form method='post'>";
echo "<h2>Files to Migrate</h2>";

// Display files with user ID
if (!empty($filesByUser)) {
    echo "<h3>Files with User ID</h3>";
    echo "<table>";
    echo "<tr><th>User ID</th><th>Files</th></tr>";
    
    foreach ($filesByUser as $userId => $files) {
        echo "<tr>";
        echo "<td>{$userId}</td>";
        echo "<td>" . implode("<br>", $files) . "</td>";
        echo "</tr>";
    }
    
    echo "</table>";
}

// Display files without user ID
if (!empty($filesWithoutUserId)) {
    echo "<h3>Files without User ID</h3>";
    echo "<p class='warning'>These files will be skipped during migration:</p>";
    echo "<ul>";
    foreach ($filesWithoutUserId as $file) {
        echo "<li>{$file}</li>";
    }
    echo "</ul>";
}

echo "<p><input type='submit' name='migrate' value='Migrate Files' class='button'></p>";
echo "</form>";

// Process migration
if (isset($_POST['migrate'])) {
    echo "<h2>Migration Results</h2>";
    
    if (empty($filesByUser)) {
        echo "<p class='warning'>No files to migrate.</p>";
    } else {
        echo "<table>";
        echo "<tr><th>File</th><th>Status</th><th>Message</th></tr>";
        
        $migratedCount = 0;
        $errorCount = 0;
        
        foreach ($filesByUser as $userId => $files) {
            foreach ($files as $file) {
                $result = migrateHistoryFile($dataDir, $file);
                
                echo "<tr>";
                echo "<td>{$file}</td>";
                if ($result['success']) {
                    echo "<td class='success'>Success</td>";
                    echo "<td>{$result['message']} ({$result['items_count']} items)</td>";
                    $migratedCount++;
                } else {
                    echo "<td class='error'>Error</td>";
                    echo "<td>{$result['message']}</td>";
                    $errorCount++;
                }
                echo "</tr>";
            }
        }
        
        echo "</table>";
        
        echo "<p>Migration complete: {$migratedCount} files migrated, {$errorCount} errors.</p>";
    }
}

// Display current directory structure
echo "<h2>Current Directory Structure</h2>";

// Get all directories in the data directory
$directories = [];
if (is_dir($dataDir)) {
    $dirHandle = opendir($dataDir);
    while (($item = readdir($dirHandle)) !== false) {
        if ($item !== '.' && $item !== '..' && is_dir($dataDir . '/' . $item)) {
            $directories[] = $item;
        }
    }
    closedir($dirHandle);
}

if (empty($directories)) {
    echo "<p class='info'>No user directories found yet.</p>";
} else {
    echo "<ul>";
    foreach ($directories as $dir) {
        echo "<li>{$dir}/";
        
        // Get files in this directory
        $dirFiles = getJsonFiles($dataDir . '/' . $dir);
        if (!empty($dirFiles)) {
            echo "<ul>";
            foreach ($dirFiles as $file) {
                echo "<li>{$file}</li>";
            }
            echo "</ul>";
        }
        
        echo "</li>";
    }
    echo "</ul>";
}

echo "</body></html>";
