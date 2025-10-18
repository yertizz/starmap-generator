<?php
/**
 * History Manager PHP Script for Star Map Generator
 * 
 * This script handles storing and retrieving history data for the Star Map Generator application.
 * It supports both GET (retrieve) and POST (save) operations.
 * 
 * GET: Retrieves history data for a specific key
 * POST: Saves history data for a specific key
 * 
 * Data is stored in JSON files in the 'data' subdirectory.
 */

// Set appropriate headers
header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Create data directory if it doesn't exist
$dataDir = __DIR__ . '/data';
if (!file_exists($dataDir)) {
    $result = mkdir($dataDir, 0755, true);
    if (!$result) {
        error_log("Failed to create data directory: $dataDir");
    } else {
        error_log("Successfully created data directory: $dataDir");
    }
}

// Create error log file for debugging
$errorLogFile = __DIR__ . '/php_errorlog';
error_log("History Manager PHP Script started. Data directory: $dataDir");

// Handle CORS if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle OPTIONS request (for CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Function to sanitize key for filename
function sanitizeKey($key) {
    // Remove any characters that might be problematic in filenames
    $key = preg_replace('/[^a-zA-Z0-9_-]/', '_', $key);
    // Limit length to prevent excessively long filenames
    return substr($key, 0, 100);
}

// Handle GET request (retrieve history)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['key'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing key parameter']);
        exit;
    }

    $key = sanitizeKey($_GET['key']);
    $filePath = $dataDir . '/' . $key . '.json';

    if (!file_exists($filePath)) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'No history found for this key']);
        exit;
    }

    $data = file_get_contents($filePath);
    if ($data === false) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error reading history file']);
        exit;
    }

    // Return the raw JSON data
    echo $data;
    exit;
}

// Handle POST request (save history)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_log("POST request received");
    
    // Get JSON data from request body
    $jsonData = file_get_contents('php://input');
    error_log("Request body: " . $jsonData);
    
    $data = json_decode($jsonData, true);
    
    if (!$data) {
        error_log("Failed to decode JSON: " . json_last_error_msg());
    }

    if (!$data || !isset($data['key']) || !isset($data['data'])) {
        error_log("Invalid request data: missing key or data");
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid request data']);
        exit;
    }

    $key = sanitizeKey($data['key']);
    $historyData = $data['data'];
    error_log("Sanitized key: " . $key);
    error_log("History data count: " . count($historyData));

    // Validate that history data is an array
    if (!is_array($historyData)) {
        error_log("History data is not an array");
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'History data must be an array']);
        exit;
    }

    // Save data to file
    $filePath = $dataDir . '/' . $key . '.json';
    error_log("Saving to file: " . $filePath);
    
    // Create directory if it doesn't exist (just to be sure)
    $dirPath = dirname($filePath);
    if (!file_exists($dirPath)) {
        error_log("Creating directory: " . $dirPath);
        $mkdirResult = mkdir($dirPath, 0755, true);
        if (!$mkdirResult) {
            error_log("Failed to create directory: " . $dirPath);
        }
    }
    
    // Check if directory is writable
    if (!is_writable($dirPath)) {
        error_log("Directory is not writable: " . $dirPath);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Directory is not writable']);
        exit;
    }
    
    $jsonData = json_encode($historyData);
    if ($jsonData === false) {
        error_log("Failed to encode history data to JSON: " . json_last_error_msg());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to encode history data to JSON']);
        exit;
    }
    
    $result = file_put_contents($filePath, $jsonData);

    if ($result === false) {
        error_log("Failed to write to file: " . $filePath);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error saving history data']);
        exit;
    }

    error_log("Successfully saved history data to file: " . $filePath . " (" . $result . " bytes)");
    echo json_encode(['success' => true, 'message' => 'History saved successfully']);
    exit;
}

// Handle unsupported request methods
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
exit;
