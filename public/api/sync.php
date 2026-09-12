<?php
/**
 * GTCAT Calendar — Hostinger Cloud Sync API
 * Provides lightweight, secure persistent cloud storage on Hostinger PHP servers.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
    // Protect data directory from direct browser listing
    file_put_contents($dataDir . '/.htaccess', "Deny from all\n");
}

$dataFile = $dataDir . '/schedule.json';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (file_exists($dataFile)) {
        echo file_get_contents($dataFile);
    } else {
        echo json_encode([
            'status' => 'empty',
            'message' => 'Henüz kayıtlı bulut verisi yok.',
            'slots' => []
        ]);
    }
    exit;
}

if ($method === 'POST') {
    $input = file_get_contents('php://input');
    $decoded = json_decode($input, true);

    if ($decoded === null) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Geçersiz JSON verisi.']);
        exit;
    }

    // Save with timestamp
    $decoded['savedAt'] = date('c');
    $decoded['server'] = 'Hostinger LiteSpeed';

    if (file_put_contents($dataFile, json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Veriler Hostinger bulut veritabanına başarıyla kaydedildi.',
            'savedAt' => $decoded['savedAt']
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Dosya yazılamadı. Klasör izinlerini (0755) kontrol ediniz.']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Desteklenmeyen istek metodu.']);
