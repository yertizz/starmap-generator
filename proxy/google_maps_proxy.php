<?php
/**
 * Google Maps Static API Proxy - 2025-10-21 [19:09:09-EST]
 * 
 * Purpose: Fetch Google Maps images and serve with proper CORS headers
 * to prevent canvas tainting when used in Combined Landscape/Portrait views
 */

// Set CORS headers to allow canvas export
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: image/png');
header('Cache-Control: public, max-age=86400'); // Cache for 24 hours

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get parameters
$lat = isset($_GET['lat']) ? floatval($_GET['lat']) : null;
$lng = isset($_GET['lng']) ? floatval($_GET['lng']) : null;
$size = isset($_GET['size']) ? intval($_GET['size']) : 640;
$zoom = isset($_GET['zoom']) ? intval($_GET['zoom']) : 12;

// Validate required parameters
if ($lat === null || $lng === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing lat/lng parameters']);
    exit;
}

// Validate size (max 640x640 for free tier)
$size = min(max($size, 100), 640);

// Google Maps API key (from existing code)
$apiKey = 'AIzaSyCpvv1IJYxwGVMh24MLFDH6LmupseApSZU';

// Build Google Maps Static API URL
$markers = urlencode("color:red|{$lat},{$lng}");
$url = "https://maps.googleapis.com/maps/api/staticmap?" . http_build_query([
    'center' => "{$lat},{$lng}",
    'zoom' => $zoom,
    'size' => "{$size}x{$size}",
    'maptype' => 'roadmap',
    'markers' => "color:red|{$lat},{$lng}",
    'key' => $apiKey
]);

// Fetch the image using cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'User-Agent: StarMapGenerator/1.0'
]);

$imageData = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// Check for errors
if ($imageData === false || $httpCode !== 200) {
    http_response_code($httpCode ?: 500);
    echo json_encode(['error' => 'Failed to fetch Google Maps image', 'details' => $error]);
    exit;
}

// Output the image
echo $imageData;
exit;
