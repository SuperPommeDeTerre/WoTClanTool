<?php
// Calendar service
require(dirname(__FILE__) . '/global.php');

// This service must return JSON to page
header('Content-Type: application/json');

// Switch between requested action
$userFile = WCT_DATA_DIR . 'user/' . $_SESSION['account_id'] . '.json';
$result = array();
switch ($_REQUEST['action']) {
	case 'gettanksstats':
		$usersToGet = array();
		if (array_key_exists('account_id', $_REQUEST)) {
			$usersToGet = explode(',', $_REQUEST['account_id']);
		} else {
			$usersToGet[] = $_SESSION['account_id'];
		}
		$playerTanksStats = array();
		foreach ($usersToGet as $userId) {
			$userFile = WCT_DATA_DIR . 'user/' . $userId . '.json';
			if (file_exists($userFile)) {
				$playerTanksStats[$userId] = json_decode(file_get_contents($userFile), true);
			} else {
				$playerTanksStats[$userId] = array();
			}
		}
		$result['data'] = $playerTanksStats;
		break;
	case 'settanksstats':
		$myTanksStats = json_decode($_REQUEST['data'], true);
		$myTanksStats = is_array($myTanksStats) ? $myTanksStats : array($myTanksStats);
		// Handle modifications
		if (file_exists($userFile)) {
			$playerTanksStats = json_decode(file_get_contents($userFile), true);
			$playerTanksStats = is_array($playerTanksStats) ? $playerTanksStats : array($playerTanksStats);
			foreach ($playerTanksStats as $valueStored) {
				foreach ($myTanksStats as &$valueToStore) {
					if ($valueStored['tank_id'] == $valueToStore['tank_id']) {
						// It's the same tank. Process it...
						if (array_key_exists('is_full', $valueStored)) {
							$valueToStore['is_full'] = $valueStored['is_full'];
						}
						break;
					}
				}
			}
		}
		$myfile = fopen($userFile, 'w') or die('Unable to open file!');
		fwrite($myfile, json_encode($myTanksStats));
		fclose($myfile);
		break;
	case 'settankisfull':
		$tankId = $_REQUEST['tank_id'];
		$tankIsFull = $_REQUEST['is_full'];
		$playerTanksStats = file_get_contents($userFile);
		$playerTanksStats = json_decode($playerTanksStats, true);
		$playerTanksStats = is_array($playerTanksStats) ? $playerTanksStats : array($playerTanksStats);
		foreach ($playerTanksStats as &$valueStored) {
			if ($valueStored['tank_id'] == $tankId) {
				$valueStored['is_full'] = $tankIsFull;
				break;
			}
		}
		$myfile = fopen($userFile, 'w') or die('Unable to open file!');
		fwrite($myfile, json_encode($playerTanksStats));
		fclose($myfile);
		$result['data'] = $playerTanksStats;
		break;
}
$result['result'] = 'ok';

echo json_encode($result);