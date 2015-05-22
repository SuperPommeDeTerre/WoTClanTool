<?php
// Export as CSV service

// Disable Output Buffering
@ob_end_clean();

define('CSV_SEPARATOR', ',');
define('CSV_FILE_EXTENSION', 'csv');

// Compute output
$jsonData = json_decode($_REQUEST['data'], true);

// Add UTF-8 BOM
$output = '\xEF\xBB\xBF';

// Add headers
$output .= implode(CSV_SEPARATOR, $jsonData['headers']) . PHP_EOL;

// Add lines
foreach($jsonData['lines'] as $line) {
	$output .= implode(CSV_SEPARATOR, $line) . PHP_EOL;
}

// required for IE, otherwise Content-disposition is ignored
if(ini_get('zlib.output_compression')) {
	ini_set('zlib.output_compression', 'Off');
}

// Set file name
$fileName = 'export';
if (array_key_exists('filename', $_REQUEST) && (trim($_REQUEST['filename']) != '')) {
	$fileName = trim($_REQUEST['filename']);
}
$fileName .= '_' . date('YmdHis') . '.' . CSV_FILE_EXTENSION;

// Prepare headers
header('HTTP/1.1 200 OK');
// This service must return attached CSV to page
header('Content-Type: text/csv; charset=utf-8');
// It's an attachment (to force download)
header('Content-Disposition: attachment; filename="' . $fileName . '"');

// Send Headers: Prevent Caching of File
//header('Cache-Control: private');
header('Pragma: private');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
header('Content-Length: ' . strlen($output));

// Output result to browser
echo($output);
?>