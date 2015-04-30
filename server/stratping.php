<?php
$cluster = isset($_REQUEST['cluster']) ? $_REQUEST['cluster'] : 'EU';
$clanid = isset($_REQUEST['clanid']) ? $_REQUEST['clanid'] : 'default';
$stratid = isset($_REQUEST['stratid']) ? $_REQUEST['stratid'] : 'default';
$coords = isset($_REQUEST['coords']) ? $_REQUEST['coords'] : '';
$filename = dirname(__FILE__)
	. DIRECTORY_SEPARATOR . '..'
	. DIRECTORY_SEPARATOR . 'data'
	. DIRECTORY_SEPARATOR . $cluster
	. DIRECTORY_SEPARATOR . 'clan'
	. DIRECTORY_SEPARATOR . $clanid
	. DIRECTORY_SEPARATOR . 'strats'
	. DIRECTORY_SEPARATOR . $stratid . '.ping';

// This service must return JSON to page
header('Content-Type: application/json');

$response = array();
$response['status'] = 'ok';
if ($coords != '') {
	// If coordinates are passed, store them.
	$response['coords'] = json_decode($coords, true);
	$myfile = fopen($filename, 'w') or die('Unable to open file!');
	fwrite($myfile, $coords);
	fclose($myfile);
} else {
	// Response to comet service
	// Create file if it doesn't exists
	if (!file_exists($filename)) {
		touch($filename) or die('Error touching file!');
	}

	// infinite loop until the data file is not modified
	$lastmodif    = isset($_REQUEST['timestamp']) ? intval($_REQUEST['timestamp']) : 0;
	$currentmodif = filemtime($filename) or die('Unable to read file mtime!');
	// check if the data file has been modified
	while ($currentmodif <= $lastmodif) {
		usleep(10000); // sleep 10ms to unload the CPU
		clearstatcache();
		$currentmodif = filemtime($filename) or die('Unable to read file mtime!');;
	}

	// return a json array
	if ($lastmodif != 0) {
		$response['coords'] = json_decode(file_get_contents($filename), true);
	}
	$response['lastmodif'] = $lastmodif;
	$response['test'] = $currentmodif <= $lastmodif;
	$response['timestamp'] = $currentmodif;
}
echo json_encode($response);
?>