<?php
// Postal code polygon via Overpass with robust fallbacks
header('Content-Type: application/json');
header('Cache-Control: no-cache');

function fail($code, $msg){ http_response_code($code); echo json_encode(['error'=> $msg]); exit; }

$postal = isset($_GET['postalcode']) ? trim($_GET['postalcode']) : '';
$country = isset($_GET['country']) ? trim($_GET['country']) : '';
if ($postal === '') fail(400, 'missing postalcode');

// Cache
$cacheRoot = __DIR__ . '/cache/zip';
if (!file_exists($cacheRoot)) { @mkdir($cacheRoot, 0755, true); }
$key = strtolower(($country !== '' ? $country : 'xx') . '_' . preg_replace('/[^a-zA-Z0-9]/', '', $postal));
$cacheFile = $cacheRoot . '/' . $key . '.json';
if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < 30*24*3600) { readfile($cacheFile); exit; }

// Overpass endpoints (try several)
$endpoints = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter'
];

// Query: search in country area (if provided) for relation boundary=postal_code
$qBase = '[out:json][timeout:25];';
if ($country !== '') {
  $q = $qBase . 'area["ISO3166-1"="'.addslashes($country).'"];(rel(area)["boundary"="postal_code"]["postal_code"="'.addslashes($postal).'"];);out geom;';
} else {
  $q = $qBase . 'rel["boundary"="postal_code"]["postal_code"="'.addslashes($postal).'"];out geom;';
}

function http_post_overpass($url, $data){
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(['data'=>$data]));
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded',
    'Accept: application/json',
    'User-Agent: StarMap/1.0 (+https://anythingpod.com)'
  ]);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_TIMEOUT, 25);
  $resp = curl_exec($ch);
  $err = curl_error($ch);
  $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  return [$resp, $err, $code];
}

$resp = false; $err=''; $code=0;
foreach ($endpoints as $ep) {
  list($resp,$err,$code) = http_post_overpass($ep, $q);
  if ($resp !== false && $resp !== '' && $code >= 200 && $code < 300) break;
}

if ($resp === false || $resp === '' || $code < 200 || $code >= 300) {
  // Server-side rectangle fallback if lat/lng provided
  $lat = isset($_GET['lat']) ? floatval($_GET['lat']) : null;
  $lng = isset($_GET['lng']) ? floatval($_GET['lng']) : null;
  if ($lat !== null && $lng !== null) {
    $d = 0.02;
    $ring = [
      [ $lng + $d, $lat + $d ],
      [ $lng + $d, $lat - $d ],
      [ $lng - $d, $lat - $d ],
      [ $lng - $d, $lat + $d ],
      [ $lng + $d, $lat + $d ]
    ];
    $feature = [
      'type' => 'Feature',
      'properties' => [ 'postal_code' => $postal, 'source' => 'fallback-rectangle' ],
      'geometry' => [ 'type' => 'Polygon', 'coordinates' => [ $ring ] ]
    ];
    echo json_encode($feature);
    exit;
  }
  fail(404, 'overpass fetch failed');
}

$json = json_decode($resp, true);
if (!$json || !isset($json['elements']) || !is_array($json['elements'])) fail(404, 'no elements');

// Build polygon from relation geometry if available
$coords = [];
foreach ($json['elements'] as $el) {
  if ($el['type'] === 'relation' && isset($el['tags']['boundary']) && $el['tags']['boundary'] === 'postal_code') {
    $ring = [];
    if (isset($el['members'])) {
      foreach ($el['members'] as $m) {
        if ($m['type'] === 'way' && isset($m['geometry'])) {
          foreach ($m['geometry'] as $pt) { $ring[] = [ $pt['lon'], $pt['lat'] ]; }
        }
      }
    }
    if (count($ring) > 2) { $coords = [$ring]; break; }
  }
}

if (empty($coords)) {
  // No relation polygon; fallback rectangle if lat/lng provided
  $lat = isset($_GET['lat']) ? floatval($_GET['lat']) : null;
  $lng = isset($_GET['lng']) ? floatval($_GET['lng']) : null;
  if ($lat !== null && $lng !== null) {
    $d = 0.02;
    $ring = [
      [ $lng + $d, $lat + $d ],
      [ $lng + $d, $lat - $d ],
      [ $lng - $d, $lat - $d ],
      [ $lng - $d, $lat + $d ],
      [ $lng + $d, $lat + $d ]
    ];
    $feature = [
      'type' => 'Feature',
      'properties' => [ 'postal_code' => $postal, 'source' => 'fallback-rectangle' ],
      'geometry' => [ 'type' => 'Polygon', 'coordinates' => [ $ring ] ]
    ];
    echo json_encode($feature);
    exit;
  }
  fail(404, 'no polygon');
}

$feature = [
  'type' => 'Feature',
  'properties' => [ 'postal_code' => $postal, 'source' => 'overpass' ],
  'geometry' => [ 'type' => 'Polygon', 'coordinates' => $coords ]
];

@file_put_contents($cacheFile, json_encode($feature));
echo json_encode($feature);
exit;
