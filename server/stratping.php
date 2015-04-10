<?php
require(dirname(__FILE__) . '/global.php');

// store new message in the file
$stratid = isset($_REQUEST['stratid']) ? $_REQUEST['stratid'] : 'default';
$coords = isset($_REQUEST['coords']) ? $_REQUEST['coords'] : '';
$filename = WCT_DATA_DIR . 'clan/' . $_SESSION['clan_id'] . '/strats/' . $stratid . '.ping';

// This service must return JSON to page
header('Content-Type: application/json');

$response = array();
$response['status'] = 'ok';
if ($coords != '') {
	// If coordinates are passed, store them.
	$response['coords'] = $coords;
	file_put_contents($filename, $coords);
} else {
	// Response to comet service
	// Create file if it doesn't exists
	if (!file_exists($filename)) {
		touch($filename);
	}

	// infinite loop until the data file is not modified
	$lastmodif    = isset($_REQUEST['timestamp']) ? intval($_REQUEST['timestamp']) : 0;
	$currentmodif = filemtime($filename);
	// check if the data file has been modified
	while ($currentmodif <= $lastmodif) {
		usleep(10000); // sleep 10ms to unload the CPU
		clearstatcache();
		$currentmodif = filemtime($filename);
	}
	 
	// return a json array
	if ($lastmodif != 0) {
		$response['coords'] = json_decode(file_get_contents($filename), true);
	}
	$response['timestamp'] = $currentmodif;
}
echo json_encode($response);
flush();
die();
?>