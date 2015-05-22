<?php
// Export as CSV service

// Disable Output Buffering
@ob_end_clean();

define('CSV_SEPARATOR', ',');
// Compute output
$jsonData = json_decode($_REQUEST['data'], true);
$output = '';

$output .= implode(CSV_SEPARATOR, $jsonData['headers']) . PHP_EOL;

foreach($jsonData['lines'] as $line) {
	$output .= implode(CSV_SEPARATOR, $line) . PHP_EOL;
}

// required for IE, otherwise Content-disposition is ignored
if(ini_get('zlib.output_compression')) {
	ini_set('zlib.output_compression', 'Off');
}

$fileName = 'export.csv';

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
header('Content-Length: ' . (strlen($output) + 3));

// Output result to browser
echo "\xEF\xBB\xBF";
echo($output);
?>