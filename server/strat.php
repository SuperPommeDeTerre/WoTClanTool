<?php
require(dirname(__FILE__) . '/global.php');

define('WCT_STRAT_DIR', WCT_DATA_DIR . 'clan/' . $_SESSION['clan_id'] . '/strats/');

if (!is_dir(WCT_STRAT_DIR)) {
	mkdir(WCT_STRAT_DIR, 0755, true);
}

// File format :
// [
//     {
//         "id": [STRAT_ID],
//         "dateadd": [DATE_ADD],
//         "datemod": [DATE_MOD],
//         "state": [STRAT_ID],
//         "creator": [WG_USER_ID],
//         "name": [STRAT_NAME],
//         "description": [STRAT_DESC],
//         "map": [STRAT_MAP],
//     },
//     ...
// ]
// Load strats list
$listStratsFile = WCT_STRAT_DIR . 'list.json';
$listStrats = array();
if (file_exists($listStratsFile)) {
	$listStrats = json_decode(file_get_contents($listStratsFile), true);
}

// This service must return JSON to page
header('Content-Type: application/json');

// Initialize result
$result = array();
$result['result'] = 'ok';
$needSave = false;

// Perform requested action
switch ($_REQUEST['action']) {
case 'get':
	$data = json_decode(file_get_contents(WCT_STRAT_DIR . $_REQUEST['id'] . '.json'), true);
	$result['data'] = $data;
	break;
case 'list':
	$resultData = array();
	foreach ($listStrats as $myStrat) {
		// Only push personal and public strategies
		if ($myStrat['creator'] == $_SESSION['account_id'] || $myStrat['state'] == 'public' || $myStrat['state'] == 'review') {
			array_push($resultData, $myStrat);
		}
	}
	$result['data'] = $resultData;
	break;
case 'save':
	$data = json_decode($_REQUEST['data'], true);
	$stratId = -1;
	$stratMeta = array();
	if (array_key_exists('id', $_REQUEST)) {
		$stratId = intval($_REQUEST['id']);
		$isStratFound = false;
		foreach ($listStrats as &$myStrat) {
			if ($stratId == intval($myStrat['id'])) {
				$isStratFound = true;
				$myStrat['datemod'] = time();
				$myStrat['map'] = $data['map'];
				$myStrat['name'] = $data['name'];
				$myStrat['description'] = $data['desc'];
				$stratMeta = $myStrat;
				break;
			}
		}
		if (!$isStratFound) {
			$stratId = -1;
		}
	}
	// Compute a new strat id
	if ($stratId == -1) {
		for ($i = 0; $i<PHP_INT_MAX; $i++) {
			$isStratFound = false;
			foreach ($listStrats as $myStrat) {
				if ($i == intval($myStrat['id'])) {
					$isStratFound = true;
					break;
				}
			}
			if (!$isStratFound) {
				$stratId = $i;
				break;
			}
		}
		$stratMeta['id'] = $stratId;
		$stratMeta['creator'] = $_SESSION['account_id'];
		$stratMeta['dateadd'] = time();
		$stratMeta['state'] = 'private';
		$stratMeta['map'] = $data['map'];
		$stratMeta['name'] = $data['name'];
		$stratMeta['description'] = $data['desc'];
		array_push($listStrats, $stratMeta);
	}
	$myfile = fopen(WCT_STRAT_DIR . $stratId . '.json', 'w') or die('Unable to open file!');
	fwrite($myfile, json_encode($data));
	fclose($myfile);
	$needSave = true;
	$result['data'] = $stratMeta;
	break;
case 'delete':
	$stratId = -1;
	if (array_key_exists('id', $_REQUEST)) {
		$stratId = intval($_REQUEST['id']);
	}
	// The identifier of the strat is defined. Search it in the list.
	if ($stratId != -1) {
		unlink(WCT_STRAT_DIR . $stratId . '.json');
		foreach ($listStrats as $key => $myStrat) {
			if ($stratId == intval($myStrat['id'])) {
				$result['data'] = $myStrat;
				array_splice($listStrats, $key, 1);
				$needSave = true;
				break;
			}
		}
	}
	break;
case 'setstratprops':
	$stratId = $_REQUEST['id'];
	$state = $_REQUEST['state'];
	$needSave = false;
	foreach ($listStrats as &$myStrat) {
		if ($stratId == intval($myStrat['id'])) {
			$myStrat['state'] = $state;
			$needSave = true;
			break;
		}
	}
	break;
}

// Perform save of the main strats file
if ($needSave) {
	$myfile = fopen($listStratsFile, 'w') or die('Unable to open file!');
	fwrite($myfile, json_encode($listStrats));
	fclose($myfile);
}

// Output result to client
echo json_encode($result);
?>