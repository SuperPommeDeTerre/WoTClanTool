<?php
// Analyse replay
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'global.php');

$baseUploadDir = '..' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $_SESSION['account_id'] . DIRECTORY_SEPARATOR;

header('Content-Type: application/json');
$data = array();
$error = false;
$files = array();
$data = array();

if (!is_dir($baseUploadDir)) {
	mkdir($baseUploadDir);
}
foreach($_FILES as $file) {
	if (move_uploaded_file($file['tmp_name'], $baseUploadDir . basename($file['name']))) {
		$files[] = $baseUploadDir . $file['name'];
	} else {
		$error = true;
	}
}
if (!$error) {
	$data['data'] = array();
	foreach($files as $file) {
		$handle = fopen($file, "r");
		// Skip first 8 bytes
		$contents = fread($handle, 8);
		$chunkLength = unpack("V", fread($handle, 4));
		// Read meta informations
		$metaInfos = fread($handle, $chunkLength[1]);
		// Read match results
		$chunkLength =  unpack("V", fread($handle, 4));
		$matchResults = fread($handle, $chunkLength[1]);
		fclose($handle);
		$data['data'][] = array("metaInfos" => json_decode($metaInfos, true), "battleResults" => json_decode($matchResults, true));
		// Delete replay as it is no longer needed...
		unlink($file);
	}
	// Delete upload folder
	rmdir($baseUploadDir);
	$data['result'] = 'success';
} else {
	$data['result'] = 'error';
}
echo json_encode($data);