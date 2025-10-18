<?php
/**
 * Settings Manager PHP Script for Star Map Generator
 * 
 * This script handles storing and retrieving settings data for the Star Map Generator application.
 * It supports both GET (retrieve) and POST (save) operations.
 * 
 * GET: Retrieves settings data
 * POST: Saves settings data
 * 
 * Data is stored in a JSON file in the current directory.
 */

// Set appropriate headers
header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Create error log file for debugging
$errorLogFile = __DIR__ . '/php_errorlog';
error_log("Settings Manager PHP Script started.");

// Handle CORS if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle OPTIONS request (for CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Settings storage (supports per-user directories with robust fallbacks)
$baseSettingsDir = __DIR__ . '/data';
if (!file_exists($baseSettingsDir)) {
    if (!@mkdir($baseSettingsDir, 0755, true)) {
        error_log("Could not create base settings dir: $baseSettingsDir. Will use legacy fallback files.");
    }
}

function get_user_settings_path($baseDir, $userId) {
    if ($userId && preg_match('/^[a-zA-Z0-9_-]+$/', $userId)) {
        $userDir = $baseDir . '/' . $userId;
        if (!file_exists($userDir)) {
            @mkdir($userDir, 0755, true);
        }
        return $userDir . '/settings.json';
    }
    return null; // Explicitly signal to use legacy fallback
}

$requestedUserId = isset($_GET['userId']) ? $_GET['userId'] : null;
$userSettingsPath = get_user_settings_path($baseSettingsDir, $requestedUserId);
$legacyPrimary = __DIR__ . '/settings.json';
$legacySecondary = __DIR__ . '/saved_settings.json';

// Handle GET request (retrieve settings)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    error_log("GET request received for settings");

// Resolve readable path for GET
$settingsFilePath = null;
if ($userSettingsPath && file_exists($userSettingsPath)) {
    $settingsFilePath = $userSettingsPath;
} elseif (file_exists($legacyPrimary)) {
    $settingsFilePath = $legacyPrimary;
} elseif (file_exists($legacySecondary)) {
    $settingsFilePath = $legacySecondary;
}

if (!$settingsFilePath) {
    error_log("Settings file not found in any location (user/legacy)");
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'No settings file found']);
    exit;
}

    $data = file_get_contents($settingsFilePath);
    if ($data === false) {
        error_log("Error reading settings file: $settingsFilePath");
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error reading settings file']);
        exit;
    }

    // Return the raw JSON data
    echo $data;
    exit;
}

// Handle POST request (save settings)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_log("POST request received for settings");
    
    // Get JSON data from request body
    $jsonData = file_get_contents('php://input');
    error_log("Request body length: " . strlen($jsonData));
    
    $data = json_decode($jsonData, true);
    
    if (!$data) {
        error_log("Failed to decode JSON: " . json_last_error_msg());
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        exit;
    }

    // Determine user file path; if per-user path fails, fallback to legacy file.
    $userId = isset($data['userId']) ? $data['userId'] : null;
    $targetPath = null;
    $tryUserPath = get_user_settings_path($baseSettingsDir, $userId);
    if ($tryUserPath) {
        $targetDir = dirname($tryUserPath);
        if (!file_exists($targetDir)) { @mkdir($targetDir, 0755, true); }
        if (is_dir($targetDir) && is_writable($targetDir)) {
            $targetPath = $tryUserPath;
        } else {
            error_log("User settings dir not writable: $targetDir. Will fallback to legacy path.");
        }
    }
    if (!$targetPath) {
        // Legacy fallback path
        $targetPath = $legacyPrimary;
    }

    // Save data to file
    $result = @file_put_contents($targetPath, $jsonData);

    if ($result === false) {
        error_log("Failed to write to settings file: $settingsFilePath");
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error saving settings data']);
        exit;
    }

    error_log("Successfully saved settings data to file: $targetPath (" . $result . " bytes)");
    echo json_encode(['success' => true, 'message' => 'Settings saved successfully', 'path' => $targetPath]);
    exit;
}

// Handle unsupported request methods
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
exit;
