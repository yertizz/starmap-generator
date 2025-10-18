<?php
/* START OF CODE - Cline - 2025-04-22 09:18 File: proxy/star_map_proxy.php */
// proxy/star_map_proxy.php
// MODIFIED: Handles direct SVG response from API

set_time_limit(300); // Increase script execution time limit to 300 seconds (5 minutes)
ini_set('display_errors', 1); // Enable error display for debugging
error_reporting(E_ALL);     // Report all PHP errors

// Your AstronomyAPI credentials
$applicationId = 'b90c69b0-6c00-42eb-932b-73fcacc99815';
$secret = 'abd2322a27f4c9703d9ccade4094c79af38ce11b193bd00b1cc6890dc7f46be8804ec7f5a1612ab5a891448df9837a5c58ea9f72f3da93fdc47d0f691e2212c2c9b72ebcf3f2e101ba6685bef9c3c592d92a1c4b83d24d133282af875bc5c275d38d56d2341ac0856de805358b62c64c';

// Read POST body
$jsonPayload = file_get_contents('php://input');
if (!$jsonPayload) {
    http_response_code(400);
    header('Content-Type: text/plain'); // Set content type for error message
    echo 'Missing POST data';
    exit;
}

// --- First cURL: Call AstronomyAPI to generate star chart ---
$authString = base64_encode("$applicationId:$secret");
$ch_generate = curl_init('https://api.astronomyapi.com/api/v2/studio/star-chart');
curl_setopt($ch_generate, CURLOPT_POST, true);
curl_setopt($ch_generate, CURLOPT_POSTFIELDS, $jsonPayload);
curl_setopt($ch_generate, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch_generate, CURLOPT_HEADER, true); // Include headers in the output
curl_setopt($ch_generate, CURLOPT_HTTPHEADER, [
    'Authorization: Basic ' . $authString,
    'Content-Type: application/json',
    'Accept: image/svg+xml, application/json' // Accept SVG or JSON
]);
// Increased timeout
curl_setopt($ch_generate, CURLOPT_TIMEOUT, 240); // Set cURL timeout to 240 seconds (4 minutes)
curl_setopt($ch_generate, CURLOPT_CONNECTTIMEOUT, 20); // Keep connection timeout at 20 seconds

$apiResponseWithHeaders = curl_exec($ch_generate);
$httpCode = curl_getinfo($ch_generate, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch_generate); // Get cURL specific error
$headerSize = curl_getinfo($ch_generate, CURLINFO_HEADER_SIZE); // Get header size
curl_close($ch_generate);

// Separate headers and body
$apiHeaders = substr($apiResponseWithHeaders, 0, $headerSize);
$apiResponseBody = substr($apiResponseWithHeaders, $headerSize);

// Function to extract Content-Type from headers
function getContentType($headers) {
    $contentType = null;
    $headerLines = explode("\r\n", $headers);
    foreach ($headerLines as $line) {
        if (stripos($line, 'Content-Type:') === 0) {
            $contentType = trim(substr($line, strlen('Content-Type:')));
            // Remove charset if present
            if (($pos = strpos($contentType, ';')) !== false) {
                $contentType = trim(substr($contentType, 0, $pos));
            }
            break;
        }
    }
    return $contentType;
}

$apiContentType = getContentType($apiHeaders);
error_log("Proxy: API Response HTTP Code: " . $httpCode);
error_log("Proxy: API Response Content-Type: " . ($apiContentType ?: 'Not Found'));


if ($curlError) {
    http_response_code(504); // Gateway timeout likely
    header('Content-Type: text/plain');
    echo 'cURL Error (Generate Chart): ' . $curlError;
    exit;
}

if ($httpCode !== 200) {
    http_response_code($httpCode);
    header('Content-Type: text/plain'); // Set content type for error message
    echo 'Error from AstronomyAPI (Generate Chart): ' . $apiResponseBody; // Use body for error message
    exit;
}

// --- Handle Response Based on Content Type ---

// CASE 1: Direct SVG Response
if ($apiContentType && strtolower($apiContentType) === 'image/svg+xml') {
    error_log("Proxy: Received SVG directly from API. Outputting SVG.");
    header('Content-Type: image/svg+xml');
    echo $apiResponseBody;
    exit;
}

// CASE 2: JSON Response (containing imageUrl for PNG/JPG)
elseif ($apiContentType && strtolower($apiContentType) === 'application/json') {
    error_log("Proxy: Received JSON from API. Processing for image URL.");
    $data = json_decode($apiResponseBody, true);
    if (!$data || !isset($data['data']['imageUrl'])) {
        http_response_code(500);
        header('Content-Type: text/plain');
        echo 'Invalid JSON response structure from AstronomyAPI: ' . $apiResponseBody;
        exit;
    }

    $imageUrl = $data['data']['imageUrl'];
    error_log("Proxy: Image URL received: " . $imageUrl);

    // --- Second cURL: Fetch the image data server-side ---
    $ch_fetch = curl_init($imageUrl);
    curl_setopt($ch_fetch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch_fetch, CURLOPT_FOLLOWLOCATION, true);
    // Increased timeout
    curl_setopt($ch_fetch, CURLOPT_TIMEOUT, 240); // Set cURL timeout to 240 seconds (4 minutes)
    curl_setopt($ch_fetch, CURLOPT_CONNECTTIMEOUT, 20); // Keep connection timeout at 20 seconds

    $imageData = curl_exec($ch_fetch);
    $httpCodeFetch = curl_getinfo($ch_fetch, CURLINFO_HTTP_CODE);
    $curlErrorFetch = curl_error($ch_fetch); // Get cURL specific error
    $imageContentType = curl_getinfo($ch_fetch, CURLINFO_CONTENT_TYPE); // Get actual image content type
    curl_close($ch_fetch);

    if ($curlErrorFetch) {
        http_response_code(504); // Gateway timeout likely
        header('Content-Type: text/plain');
        echo 'cURL Error (Fetch Image): ' . $curlErrorFetch;
        exit;
    }

    if ($httpCodeFetch !== 200 || !$imageData) {
        http_response_code(502); // Bad Gateway
        header('Content-Type: text/plain');
        echo 'Failed to fetch image from AstronomyAPI URL. HTTP Code: ' . $httpCodeFetch;
        exit;
    }

    // Return the image data with the correct Content-Type header
    error_log("Proxy: Fetched image data. Content-Type: " . ($imageContentType ?: 'Unknown'));
    if ($imageContentType) {
         header('Content-Type: ' . $imageContentType);
    } else {
         // Fallback based on original request if fetch didn't provide type
         $requestData = json_decode($jsonPayload, true);
         $imageFormat = 'png'; // Default
         if (isset($requestData['output']['format'])) {
             $imageFormat = strtolower($requestData['output']['format']);
         }
         if ($imageFormat === 'jpg' || $imageFormat === 'jpeg') {
             header('Content-Type: image/jpeg');
         } else {
             header('Content-Type: image/png'); // Default to PNG
         }
    }
    echo $imageData;
    exit;
}

// CASE 3: Unexpected Content Type
else {
     http_response_code(500);
     header('Content-Type: text/plain');
     echo 'Unexpected Content-Type received from AstronomyAPI: ' . ($apiContentType ?: 'None');
     exit;
}

/* END OF CODE - Cline - 2025-04-22 09:18 File: proxy/star_map_proxy.php */
?>
