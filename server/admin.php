<?php
// Administration service
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'global.php');

require(WCT_SERVER_DIR . DIRECTORY_SEPARATOR . 'classes' . DIRECTORY_SEPARATOR . 'wct.event.inc');

define('WCT_BASE_EVENT_DIR', WCT_DATA_DIR . 'clan' . DIRECTORY_SEPARATOR . $_SESSION['clan_id'] . DIRECTORY_SEPARATOR . 'events');
if (!is_dir(WCT_BASE_EVENT_DIR)) {
	mkdir(WCT_BASE_EVENT_DIR, 0755, true);
}

// Initialize result
$result = [
	'status' => 'success'
];

// Configuration file
$configFile = WCT_CONFIG_DIR . DIRECTORY_SEPARATOR . 'config.json';

if (!WctRights::isUserAdmin()) {
	// If the user is not an administrator, refuse action
	$result['status'] = 'error';
	$result['message'] = 'error.notadmin';
} else {
	switch ($_REQUEST['a']) {
		case 'saveGeneral':
			// Save configuration parameters
			// Init config
			$configToWrite = [
				"WG" => [
					"clusters" => []
				],
				"app" => [
					"theme" => "default",
					"admins" => [],
					"showads" => true,
					"keepreplays" => false
				],
				"clans" => [
					"restric_to" => []
				],
				"player" => [
					"max_battle_time" => intval($_REQUEST['inactivitythreshold'])
				]
			];
			// Parse POST data
			$clusterArray = [];
			if (!isset($_REQUEST['clusters'])) {
				foreach ($pClusters as $lClusterId => $lClusterProps) {
					array_push($clusterArray, $lClusterId);
				}
			} else {
				$clusterArray = $_REQUEST['clusters'];
			}
			$configToWrite["WG"]["clusters"] = $clusterArray;
			$configToWrite["app"]["admins"] = array();
			$configToWrite["app"]["showads"] = (isset($_REQUEST['showads'])?($_REQUEST['showads']=='true'?true:false):true);
			$configToWrite["app"]["keepreplays"] = (isset($_REQUEST['keepreplays'])?($_REQUEST['keepreplays']=='true'?true:false):false);
			$configToWrite["clans"]["restric_to"] = array();
			foreach ($clusterArray as $lClusterId) {
				$configToWrite["app"]["admins"][$lClusterId] = array();
				if (isset($_REQUEST['admins' . $lClusterId])) {
					foreach($_REQUEST['admins' . $lClusterId] as $playerId) {
						array_push($configToWrite["app"]["admins"][$lClusterId], $playerId);
					}
				}
				$configToWrite["clans"]["restric_to"][$lClusterId] = array();
				if (isset($_REQUEST['clans' . $lClusterId])) {
					foreach($_REQUEST['clans' . $lClusterId] as $clanId) {
						array_push($configToWrite["clans"]["restric_to"][$lClusterId], $clanId);
					}
				}
			}
			if (!@file_put_contents($configFile, json_encode($configToWrite, true), LOCK_EX)) {
				// Error while writing config file
				$result["status"] = "error";
				$result["message"] = "error.configfilewrite";
				$result['config'] = $configToWrite;
			} else {
				$result['status'] = 'success';
				$result['config'] = $configToWrite;
			}
			break;
	}
}
header('Content-Type: application/json');
echo json_encode($result);
?>