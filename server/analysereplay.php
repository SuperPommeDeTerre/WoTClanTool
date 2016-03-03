<?php
header('Content-Type: application/json');
$data = array();
$error = false;
$files = array();
$data = array();

$uploaddir = '../uploads/';
foreach($_FILES as $file) {
	if (move_uploaded_file($file['tmp_name'], $uploaddir . basename($file['name']))) {
		$files[] = $uploaddir . $file['name'];
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
	}
	$data['result'] = 'success';
} else {
	$data['result'] = 'error';
}
echo json_encode($data);