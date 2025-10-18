<?php
// Postal code polygon via Google (viewport) → Overpass → rectangle fallback
header('Content-Type: application/json');
header('Cache-Control: no-cache');

function fail($code, $msg){ http_response_code($code); echo json_encode(['error'=> $msg]); exit; }

$postal = isset($_GET['postalcode']) ? trim($_GET['postalcode']) : '';
$country = isset($_GET['country']) && $_GET['country'] !== '' ? trim($_GET['country']) : 'US';
if ($postal === '') fail(400, 'missing postalcode');

// Cache
$cacheRoot = __DIR__ . '/cache/zip';
if (!file_exists($cacheRoot)) { @mkdir($cacheRoot, 0755, true); }
$key = strtolower(($country !== '' ? $country : 'xx') . '_' . preg_replace('/[^a-zA-Z0-9]/', '', $postal));
$cacheFile = $cacheRoot . '/' . $key . '.json';
if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < 30*24*3600) { readfile($cacheFile); exit; }

// Google API key (reuse the same key as client; already public in HTML)
$GOOGLE_API_KEY = 'AIzaSyCpvv1IJYxwGVMh24MLFDH6LmupseApSZU';

// Helper: raw HTTP for services that return Esri pjson
function http_get_raw($url){
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_TIMEOUT, 20);
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'User-Agent: StarMap/1.0 (+https://anythingpod.com)'
  ]);
  $resp = curl_exec($ch);
  $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  return [ 'ok' => ($code>=200 && $code<300 && $resp), 'code'=>$code, 'body'=>$resp ];
}

// Tier 1 (US only): ArcGIS ZCTA polygon (true ZIP polygon) — tries multiple public services
function arcgis_zcta_polygon($postal, $country){
  if (strtoupper($country) !== 'US') return null;
  $services = [
    [ 'url' => 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_ZIP_Code_Areas/FeatureServer/0/query',
      'fields' => ['ZIP_CODE','ZIP'] ],
    [ 'url' => 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Census_ZIP_Codes/FeatureServer/0/query',
      'fields' => ['ZIP','POSTAL'] ],
    [ 'url' => 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/All_ZCTA5/MapServer/0/query',
      'fields' => ['ZCTA5','ZCTA5CE10'] ],
  ];
  foreach ($services as $svc){
    $whereParts = [];
    foreach ($svc['fields'] as $f){ $whereParts[] = $f."='".addslashes($postal)."'"; }
    $where = implode(' OR ', $whereParts);
    $params = http_build_query([
      'where' => $where,
      'outFields' => '*',
      'outSR' => '4326',
      'returnGeometry' => 'true',
      'f' => 'pjson'
    ]);
    $url = $svc['url'].'?'.$params;
    $res = http_get_raw($url);
    if (!$res['ok']) continue;
    $json = json_decode($res['body'], true);
    if (!$json || !isset($json['features']) || !is_array($json['features']) || count($json['features'])===0) continue;
    $f = $json['features'][0];
    if (!isset($f['geometry'])) continue;
    $g = $f['geometry'];
    // Convert Esri rings to GeoJSON Polygon
    if (isset($g['rings']) && is_array($g['rings'])){
      $coords = [];
      foreach ($g['rings'] as $ring){
        $c = [];
        foreach ($ring as $pt){
          // Esri pjson uses x=lon, y=lat for 4326
          $c[] = [ $pt['x'], $pt['y'] ];
        }
        $coords[] = $c;
      }
      return [
        'type' => 'Feature',
        'properties' => [ 'postal_code' => $postal, 'source' => 'arcgis-zcta' ],
        'geometry' => [ 'type'=>'Polygon', 'coordinates'=>$coords ]
      ];
    }
    // Some services might return MultiPolygon as array of rings arrays
    if (isset($g['rings']) && is_array($g['rings']) && is_array($g['rings'][0]) && is_array($g['rings'][0][0])){
      $coordsMP = [];
      foreach ($g['rings'] as $ring){
        $c=[]; foreach ($ring as $pt){ $c[]=[ $pt['x'],$pt['y'] ]; } $coordsMP[]=$c;
      }
      return [ 'type'=>'Feature', 'properties'=>['postal_code'=>$postal,'source'=>'arcgis-zcta'], 'geometry'=>['type'=>'Polygon','coordinates'=>$coordsMP] ];
    }
  }
  return null;
}

// Tier 2: Google Geocode viewport as polygon rectangle
function http_get_json($url){
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_TIMEOUT, 15);
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'User-Agent: StarMap/1.0 (+https://anythingpod.com)'
  ]);
  $resp = curl_exec($ch);
  $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($code >=200 && $code < 300 && $resp) return json_decode($resp, true);
  return null;
}

function google_viewport_polygon($postal, $country, $apiKey){
  $addr = urlencode($postal);
  $comp = urlencode('country:'.$country);
  $url = "https://maps.googleapis.com/maps/api/geocode/json?address={$addr}&components={$comp}&key={$apiKey}";
  $json = http_get_json($url);
  if (!$json || !isset($json['results'][0])) return null;
  $res = $json['results'][0];
  if (!isset($res['geometry'])) return null;
  $geom = $res['geometry'];
  // Prefer viewport; fall back to bounds if provided
  $box = null;
  if (isset($geom['viewport'])) $box = $geom['viewport'];
  elseif (isset($geom['bounds'])) $box = $geom['bounds'];
  if (!$box || !isset($box['northeast']) || !isset($box['southwest'])) return null;
  $ne = $box['northeast'];
  $sw = $box['southwest'];
  $ring = [
    [ $ne['lng'], $ne['lat'] ],
    [ $ne['lng'], $sw['lat'] ],
    [ $sw['lng'], $sw['lat'] ],
    [ $sw['lng'], $ne['lat'] ],
    [ $ne['lng'], $ne['lat'] ]
  ];
  return [
    'type' => 'Feature',
    'properties' => [ 'postal_code' => $postal, 'source' => 'google-viewport' ],
    'geometry' => [ 'type' => 'Polygon', 'coordinates' => [ $ring ] ]
  ];
}

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

// Try ArcGIS ZCTA polygon first (US only)
$feature = arcgis_zcta_polygon($postal, $country);
if (is_array($feature)) { echo json_encode($feature); exit; }

// Then Google viewport rectangle
$feature = google_viewport_polygon($postal, $country, $GOOGLE_API_KEY);
if (is_array($feature)) {
  // Return immediately and allow client to replace with higher fidelity if Overpass succeeds later
  // But we still try Overpass below only if explicitly requested; for now, serve Google result.
  echo json_encode($feature);
  exit;
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
