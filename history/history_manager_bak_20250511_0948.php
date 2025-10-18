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
    // Get JSON data from request body
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);

    if (!$data || !isset($data['key']) || !isset($data['data'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid request data']);
        exit;
    }

    $key = sanitizeKey($data['key']);
    $historyData = $data['data'];

    // Validate that history data is an array
    if (!is_array($historyData)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'History data must be an array']);
        exit;
    }

    // Save data to file
    $filePath = $dataDir . '/' . $key . '.json';
    $result = file_put_contents($filePath, json_encode($historyData));

    if ($result === false) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error saving history data']);
        exit;
    }

    echo json_encode(['success' => true, 'message' => 'History saved successfully']);
    exit;
}

// Handle unsupported request methods
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
exit;
