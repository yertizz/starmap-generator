<?php
// Simple PHP proxy for AstronomyAPI Star Chart - Enhanced Error Reporting

// --- Configuration ---
$astronomyApiUrl = 'https://api.astronomyapi.com/api/v2/studio/star-chart';
$applicationId = 'bb7be673-12be-4dad-8620-adcfa45fde7c';
$secret = ''; // Assuming no secret needed for Basic Auth with App ID only
// ---------------------

// --- Error Reporting (Enable for debugging) ---
// ini_set('display_errors', 1); // Uncomment temporarily if needed, but check server logs first
// ini_set('display_startup_errors', 1); // Uncomment temporarily if needed
// error_reporting(E_ALL); // Uncomment temporarily if needed
// ---------------------------------------------

header('Content-Type: application/json'); // Set response header for JSON

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Invalid request method. Only POST is allowed.']);
    exit;
}

// Get the raw POST data sent from JavaScript
$jsonPayload = file_get_contents('php://input');
$requestData = json_decode($jsonPayload, true); // Decode JSON into PHP array

// Basic validation of incoming data
if (!$requestData || !isset($requestData['observer']) || !isset($requestData['view']) || !isset($requestData['style'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Proxy received invalid or missing request body data.']);
    exit;
}

// --- Prepare cURL request to AstronomyAPI ---
$authString = base64_encode($applicationId . ':' . $secret);
$headers = [
    'Authorization: Basic ' . $authString,
    'Content-Type: application/json',
    'Accept: application/json' // Explicitly accept JSON
];

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $astronomyApiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonPayload);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true); // Keep SSL verification enabled
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
// curl_setopt($ch, CURLOPT_VERBOSE, true); // Uncomment for very detailed cURL output in logs (if logs accessible)

// --- Execute cURL request ---
$apiResponse = curl_exec($ch);
$httpStatusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErrno = curl_errno($ch); // Get cURL error number
$curlError = curl_error($ch); // Get cURL error message

curl_close($ch);

// --- Handle Response ---
if ($curlErrno > 0) { // Check specifically for cURL errors
    http_response_code(502); // Bad Gateway - Proxy couldn't connect/communicate
    echo json_encode([
        'error' => 'Proxy cURL Error',
        'details' => 'Failed to connect or communicate with the AstronomyAPI.',
        'curl_errno' => $curlErrno,
        'curl_error' => $curlError
    ]);
} elseif ($httpStatusCode >= 400) {
    // Forward the API's error status code and response body
    http_response_code($httpStatusCode);
    $decodedError = json_decode($apiResponse);
    if (json_last_error() === JSON_ERROR_NONE) {
        echo json_encode(['error' => 'AstronomyAPI Error', 'details' => $decodedError]);
    } else {
        // Send raw text if API error response wasn't valid JSON
        echo json_encode(['error' => 'AstronomyAPI Error', 'details_raw' => $apiResponse]);
    }
} elseif ($apiResponse === false) {
    // Handle cases where curl_exec returns false but curl_errno is 0 (less common)
     http_response_code(500);
     echo json_encode(['error' => 'Proxy Error', 'details' => 'curl_exec returned false without a specific cURL error number.']);
} else {
    // Success - forward the successful API response
    echo $apiResponse;
}

exit;
?>