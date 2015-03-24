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
			$avgWinRate = $pTankStats['all']['wins'] / $lTankBattles;
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
		$doCalcWN8 = false;
		// Handle modifications
		if (file_exists($userFile)) {
			$playerTanksStats = json_decode(file_get_contents($userFile), true);
			$playerTanksStats = is_array($playerTanksStats) ? $playerTanksStats : array($playerTanksStats);
			foreach ($myTanksStats as &$valueToStore) {
				$isTankFound = false;
				foreach ($playerTanksStats as $valueStored) {
					if ($valueStored['tank_id'] == $valueToStore['tank_id']) {
						// It's the same tank. Process it...
						if (array_key_exists('is_full', $valueStored)) {
							$valueToStore['is_full'] = $valueStored['is_full'];
						}
						// Calculate WN8 if battles have been recorded since last storage
						if ($valueStored['all']['battles'] != $valueToStore['all']['battles']) {
							$valueToStore['wn8'] = calcTankWN8($tanksExpectedVals, $valueToStore);
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
					$myTanksStats[] = $valueToStore;
				}
			}
		} else {
			foreach ($myTanksStats as &$valueToStore) {
				$valueToStore['is_full'] = false;
				$valueToStore['wn8'] = calcTankWN8($tanksExpectedVals, $valueToStore);
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