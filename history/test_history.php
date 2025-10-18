<?php
/**
 * Test script for history system
 * 
 * This script tests the history_manager.php script by sending test requests
 * and displaying the results.
 */

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Function to make a POST request to the history manager
function saveHistory($key, $data) {
    $url = 'history_manager.php';
    $postData = json_encode([
        'key' => $key,
        'data' => $data
    ]);
    
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => $postData
        ]
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    return $result;
}

// Function to make a GET request to the history manager
function getHistory($key) {
    $url = 'history_manager.php?key=' . urlencode($key);
    
    $options = [
        'http' => [
            'method' => 'GET',
            'header' => 'Accept: application/json'
        ]
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    return $result;
}

// Test key and data
$testKey = 'test_history_key_' . time();
$testData = ['Test item 1', 'Test item 2', 'Test item 3'];

// Display test information
echo "<h1>History System Test</h1>";
echo "<h2>Test Information</h2>";
echo "<p>Test Key: $testKey</p>";
echo "<p>Test Data: " . json_encode($testData) . "</p>";

// Test saving history
echo "<h2>Test Saving History</h2>";
try {
    $saveResult = saveHistory($testKey, $testData);
    echo "<p>Save Result: $saveResult</p>";
    
    // Parse the result
    $saveResultData = json_decode($saveResult, true);
    if ($saveResultData && isset($saveResultData['success']) && $saveResultData['success']) {
        echo "<p style='color: green;'>Save Test: SUCCESS</p>";
    } else {
        echo "<p style='color: red;'>Save Test: FAILED</p>";
        if ($saveResultData && isset($saveResultData['message'])) {
            echo "<p>Error: " . $saveResultData['message'] . "</p>";
        }
    }
} catch (Exception $e) {
    echo "<p style='color: red;'>Save Test: EXCEPTION</p>";
    echo "<p>Error: " . $e->getMessage() . "</p>";
}

// Test retrieving history
echo "<h2>Test Retrieving History</h2>";
try {
    $getResult = getHistory($testKey);
    echo "<p>Get Result: $getResult</p>";
    
    // Parse the result
    $getResultData = json_decode($getResult, true);
    if ($getResultData && is_array($getResultData) && count($getResultData) === count($testData)) {
        echo "<p style='color: green;'>Get Test: SUCCESS</p>";
    } else {
        echo "<p style='color: red;'>Get Test: FAILED</p>";
        if (is_string($getResult) && strpos($getResult, 'success') !== false) {
            $errorData = json_decode($getResult, true);
            if ($errorData && isset($errorData['message'])) {
                echo "<p>Error: " . $errorData['message'] . "</p>";
            }
        }
    }
} catch (Exception $e) {
    echo "<p style='color: red;'>Get Test: EXCEPTION</p>";
    echo "<p>Error: " . $e->getMessage() . "</p>";
}

// Check if data directory exists and is writable
echo "<h2>Directory Check</h2>";
$dataDir = __DIR__ . '/data';
echo "<p>Data Directory: $dataDir</p>";
if (file_exists($dataDir)) {
    echo "<p style='color: green;'>Directory exists: YES</p>";
} else {
    echo "<p style='color: red;'>Directory exists: NO</p>";
}

if (is_writable($dataDir)) {
    echo "<p style='color: green;'>Directory is writable: YES</p>";
} else {
    echo "<p style='color: red;'>Directory is writable: NO</p>";
}

// List files in the data directory
echo "<h2>Files in Data Directory</h2>";
if (file_exists($dataDir)) {
    $files = scandir($dataDir);
    if ($files) {
        echo "<ul>";
        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..') {
                echo "<li>$file</li>";
            }
        }
        echo "</ul>";
    } else {
        echo "<p>No files found.</p>";
    }
} else {
    echo "<p>Data directory does not exist.</p>";
}

// Check PHP error log
echo "<h2>PHP Error Log</h2>";
$errorLogFile = __DIR__ . '/php_errorlog';
if (file_exists($errorLogFile)) {
    echo "<p>Error log file exists: YES</p>";
    $errorLog = file_get_contents($errorLogFile);
    if ($errorLog) {
        echo "<pre>" . htmlspecialchars($errorLog) . "</pre>";
    } else {
        echo "<p>Error log is empty or could not be read.</p>";
    }
} else {
    echo "<p>Error log file does not exist.</p>";
}
