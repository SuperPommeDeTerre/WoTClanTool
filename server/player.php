<?php
// Calendar service
require(dirname(__FILE__) . '/global.php');

// This service must return JSON to page
header('Content-Type: application/json');

$WN8_EXPECTED_VALS = json_decode(file_get_contents(WCT_DATA_DIR . 'WN8_expected_tank_values.json'), true);
$tanksExpectedVals = is_array($WN8_EXPECTED_VALS['data']) ? $WN8_EXPECTED_VALS['data'] : array($WN8_EXPECTED_VALS['data']);

function calcTankWN8($pTanksExpectedVals, $pTankStats) {
	$returnVal = 0;
	foreach ($pTanksExpectedVals as $tankExpectedVals) {
		if ($tankExpectedVals['IDNum'] == $pTankStats['tank_id']) {
			$lTankBattles = $pTankStats['all']['battles'];
			$avgDmg = $pTankStats['all']['damage_dealt'] / $lTankBattles;
			$avgSpot = $pTankStats['all']['spotted'] / $lTankBattles;
			$avgFrag = $pTankStats['all']['frags'] / $lTankBattles;
			$avgDef = $pTankStats['all']['dropped_capture_points'] / $lTankBattles;
			$avgWinRate = $pTankStats['all']['wins'] * 100 / $lTankBattles; // We need a percentage
			// STEP 1
			$rDAMAGE = $avgDmg     / $tankExpectedVals['expDamage'];
			$rSPOT   = $avgSpot    / $tankExpectedVals['expSpot'];
			$rFRAG   = $avgFrag    / $tankExpectedVals['expFrag'];
			$rDEF    = $avgDef     / $tankExpectedVals['expDef'];
			$rWIN    = $avgWinRate / $tankExpectedVals['expWinRate'];
			// STEP 2
			$rWINc    = max(0,                      ($rWIN    - 0.71) / (1 - 0.71) );
			$rDAMAGEc = max(0,                      ($rDAMAGE - 0.22) / (1 - 0.22) );
			$rFRAGc   = max(0, min($rDAMAGEc + 0.2, ($rFRAG   - 0.12) / (1 - 0.12)));
			$rSPOTc   = max(0, min($rDAMAGEc + 0.1, ($rSPOT   - 0.38) / (1 - 0.38)));
			$rDEFc    = max(0, min($rDAMAGEc + 0.1, ($rDEF    - 0.10) / (1 - 0.10)));
			// STEP 3
			$returnVal = 980*$rDAMAGEc + 210*$rDAMAGEc*$rFRAGc + 155*$rFRAGc*$rSPOTc + 75*$rDEFc*$rFRAGc + 145*min(1.8, $rWINc);
			break;
		}
	}
	return $returnVal;
}

// Switch between requested action
$userFile = WCT_DATA_DIR . 'user/' . $_SESSION['account_id'] . '.json';
$result = array();
$result['result'] = 'ok';
switch ($_REQUEST['action']) {
	case 'gettanksstats':
		$usersToGet = array();
		if (array_key_exists('account_id', $_REQUEST)) {
			$usersToGet = explode(',', $_REQUEST['account_id']);
		} else {
			$usersToGet[] = $_SESSION['account_id'];
		}
		$playerTanksStats = array();
		$needStore = false;
		foreach ($usersToGet as $userId) {
			// Gets WG infos
			$wgPlayerTanksStats = json_decode(file_get_contents($gWG_API_URL . 'wot/tanks/stats/?application_id=' . $gWG_APP_ID_SERVER
					. '&language=' . $gLang
					. '&access_token='
					. $_SESSION["access_token"]
					. '&account_id=' . $userId
				), true);
			$wgPlayerTanksStats = is_array($wgPlayerTanksStats) ? $wgPlayerTanksStats : array($wgPlayerTanksStats);
			$wgPlayerTanksStats = $wgPlayerTanksStats['data'][$userId];
			// Gets stored infos
			$userFile = WCT_DATA_DIR . 'user/' . $userId . '.json';
			$storedPlayerTanksStats = array();
			if (file_exists($userFile)) {
				$storedPlayerTanksStats = json_decode(file_get_contents($userFile), true);
				$storedPlayerTanksStats = is_array($storedPlayerTanksStats) ? $storedPlayerTanksStats : array($storedPlayerTanksStats);
				foreach ($wgPlayerTanksStats as &$valueToStore) {
					$isTankFound = false;
					foreach ($storedPlayerTanksStats as $valueStored) {
						if ($valueStored['tank_id'] == $valueToStore['tank_id']) {
							// It's the same tank. Process it...
							if (array_key_exists('is_full', $valueStored)) {
								$valueToStore['is_full'] = $valueStored['is_full'];
							}
							if (array_key_exists('in_garage', $valueStored)) {
								$valueToStore['in_garage'] = ($valueToStore['in_garage'] == null?$valueStored['in_garage']?$valueToStore['in_garage']);
							}
							// Calculate WN8 if battles have been recorded since last storage
							if ($valueStored['all']['battles'] != $valueToStore['all']['battles']) {
								$valueToStore['wn8'] = calcTankWN8($tanksExpectedVals, $valueToStore);
								$needStore = true;
							} else {
								// Gets the old WN8 if the tank has not been played
								$valueToStore['wn8'] = $valueStored['wn8'];
							}
							$isTankFound = true;
							break;
						}
					}
					if (!$isTankFound) {
						// The tank is not found in the player data. Add it.
						$valueToStore['is_full'] = false;
						$valueToStore['wn8'] = calcTankWN8($tanksExpectedVals, $valueToStore);
						$storedPlayerTanksStats[] = $valueToStore;
						$needStore = true;
					}
				}
			} else {
				$storedPlayerTanksStats = $wgPlayerTanksStats;
				$needStore = true;
				foreach ($storedPlayerTanksStats as &$valueToStore) {
					$valueToStore['is_full'] = false;
					$valueToStore['in_garage'] = false;
					$valueToStore['wn8'] = calcTankWN8($tanksExpectedVals, $valueToStore);
				}
			}
			// Merge...
			if ($needStore) {
				$myfile = fopen($userFile, 'w') or die('Unable to open file!');
				fwrite($myfile, json_encode($storedPlayerTanksStats));
				fclose($myfile);
			}
			// Store infos if needed
			// Append result to result array
			$playerTanksStats[$userId] = $storedPlayerTanksStats;
		}
		$result['data'] = $storedPlayerTanksStats;
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
	default:
		$result['result'] = 'error';
		$result['errorcode'] =  '404';
		$result['errormsg'] =  'unknownmethod';
		break;
}


echo json_encode($result);