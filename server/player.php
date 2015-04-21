<?php
// Calendar service
require(dirname(__FILE__) . '/global.php');

// This service must return JSON to page
header('Content-Type: application/json');

// Gets the WN8 expected vals as requested by the algorithm
$WN8_EXPECTED_VALS = json_decode(file_get_contents(WCT_DATA_DIR . '../WN8_expected_tank_values.json'), true);
$tanksExpectedVals = is_array($WN8_EXPECTED_VALS['data']) ? $WN8_EXPECTED_VALS['data'] : array($WN8_EXPECTED_VALS['data']);

/**
 * Compute the WN8 of a tank respect to the algorithm specified here :
 * http://wiki.wnefficiency.net/pages/WN8#The_Steps_of_WN8_-_The_Formula
 *
 * @param $pTanksExpectedVals
 *     Tank expected values (for all tanks) as needed by the algrithm (http://www.wnefficiency.net/wnexpected/)
 * @param $pTankStats
 *     Actual tank staistics.
 * @return The WN8 rating of the tank.
 */
function calcTankWN8($pTanksExpectedVals, $pTankStats) {
	$returnVal = 0;
	foreach ($pTanksExpectedVals as $tankExpectedVals) {
		if ($tankExpectedVals['IDNum'] == $pTankStats['tank_id']) {
			$lTankBattles = $pTankStats['all']['battles'];
			$avgDmg = $pTankStats['all']['damage_dealt'] / $lTankBattles;
			$avgSpot = $pTankStats['all']['spotted'] / $lTankBattles;
			$avgFrag = $pTankStats['all']['frags'] / $lTankBattles;
			$avgDef = $pTankStats['all']['dropped_capture_points'] / $lTankBattles;
			$avgWinRate = $pTankStats['all']['wins'] * 100 / $lTankBattles;
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
$userFile = '';
if (isset($_SESSION['account_id'])) {
	$userFile = getUserFile($_SESSION['account_id']);
}
$result = array();
switch ($_REQUEST['action']) {
	case 'setclanid':
		$_SESSION["clan_id"] = $_REQUEST["clan_id"];
		break;
	case 'setcluster':
		$_SESSION["cluster"] = $_REQUEST["cluster"];
		break;
	case 'purge':
		$usersToPurge = array();
		if (array_key_exists('account_id', $_REQUEST)) {
			$usersToPurge = explode(',', $_REQUEST['account_id']);
		} else {
			$usersToPurge[] = $_SESSION['account_id'];
		}
		foreach ($usersToGet as $userId) {
			$userFile = getUserFile($userId);
			if (file_exists($userFile)) {
				unlink($userFile);
			}
		}
		break;
	case 'gettanksstats':
		$usersToGet = array();
		$myTanksStats = array();
		if (array_key_exists('account_id', $_REQUEST)) {
			$usersToGet = explode(',', $_REQUEST['account_id']);
		} else {
			array_push($usersToGet, $_SESSION['account_id']);
		}
		// If the request passes data, then we are also setting data
		$doParseData = false;
		if (array_key_exists('data', $_REQUEST)) {
			$myTanksStats = json_decode($_REQUEST['data'], true);
			$myTanksStats = is_array($myTanksStats) ? $myTanksStats : array($myTanksStats);
			$doParseData = true;
		}
		$playerTanksStats = array();
		$playerTanksStatsToStore = array();
		foreach ($usersToGet as $userId) {
			$userFile = getUserFile($userId);
			if (file_exists($userFile)) {
				$playerTanksStats[$userId] = json_decode(file_get_contents($userFile), true);
			} else {
				$playerTanksStats[$userId] = array();
			}
			$playerTanksStatsToStore[$userId] = array();
			if ($doParseData) {
				$doCalcWN8 = false;
				// Handle modifications
				if (file_exists($userFile)) {
					$valueToStore = array();
					foreach ($myTanksStats[$userId] as &$valueWG) {
						$isTankFound = false;
						foreach ($playerTanksStats[$userId] as $valueStored) {
							if ($valueStored['tank_id'] == $valueWG['tank_id']) {
								// It's the same tank. Process it...
								$valueToStore['tank_id'] = $valueWG['tank_id'];
								if (array_key_exists('is_full', $valueStored)) {
									$valueToStore['is_full'] = $valueStored['is_full'];
								}
								if (array_key_exists('is_ready', $valueStored)) {
									$valueToStore['is_ready'] = $valueStored['is_ready'];
								}
								$valueToStore['in_garage'] = $valueWG['in_garage'] != null?$valueWG['in_garage']:false;
								// Calculate WN8 if battles have been recorded since last storage
								if ($valueStored['battles'] != $valueWG['all']['battles']) {
									$valueToStore['wn8'] = calcTankWN8($tanksExpectedVals, $valueWG);
								} else {
									// Gets the old WN8 if the tank has not been played
									$valueToStore['wn8'] = $valueStored['wn8'];
								}
								$valueToStore['battles'] = $valueWG['all']['battles'];
								$isTankFound = true;
								break;
							}
						}
						if (!$isTankFound) {
							// The tank is not found in the player data. Add it.
							$valueToStore['tank_id'] = $valueWG['tank_id'];
							$valueToStore['battles'] = $valueWG['all']['battles'];
							$valueToStore['in_garage'] = $valueWG['in_garage'] != null?$valueWG['in_garage']:false;
							$valueToStore['is_full'] = false;
							$valueToStore['is_ready'] = false;
							$valueToStore['wn8'] = calcTankWN8($tanksExpectedVals, $valueToStore);
						}
						$playerTanksStatsToStore[$userId][] = $valueToStore;
					}
				} else {
					foreach ($myTanksStats[$userId] as &$valueWG) {
						$valueToStore = array();
						$valueToStore['tank_id'] = $valueWG['tank_id'];
						$valueToStore['battles'] = $valueWG['all']['battles'];
						$valueToStore['in_garage'] = $valueWG['in_garage'] != null?$valueWG['in_garage']:false;
						$valueToStore['is_full'] = false;
						$valueToStore['is_ready'] = false;
						$valueToStore['wn8'] = calcTankWN8($tanksExpectedVals, $valueWG);
						$playerTanksStatsToStore[$userId][] = $valueToStore;
					}
				}
				$myfile = fopen($userFile, 'w') or die('Unable to open file!');
				fwrite($myfile, json_encode($playerTanksStatsToStore[$userId]));
				fclose($myfile);
			}
		}
		if (array_key_exists('data', $_REQUEST)) {
			$playerTanksStats = $playerTanksStatsToStore;
		}
		$result['data'] = $playerTanksStats;
		break;
	case 'settankprops':
		$tankId = $_REQUEST['tank_id'];
		$playerTanksStats = file_get_contents($userFile);
		$playerTanksStats = json_decode($playerTanksStats, true);
		$playerTanksStats = is_array($playerTanksStats) ? $playerTanksStats : array($playerTanksStats);
		foreach ($playerTanksStats as &$valueStored) {
			if ($valueStored['tank_id'] == $tankId) {
				if (isset($_REQUEST['is_full'])) {
					$valueStored['is_full'] = $_REQUEST['is_full'] === 'true'? true: false;
				}
				if (isset($_REQUEST['is_ready'])) {
					$valueStored['is_ready'] = $_REQUEST['is_ready'] === 'true'? true: false;
				}
				$result['data'] = $valueStored;
				break;
			}
		}
		$myfile = fopen($userFile, 'w') or die('Unable to open file!');
		fwrite($myfile, json_encode($playerTanksStats));
		fclose($myfile);
		break;
}
$result['result'] = 'ok';

echo json_encode($result);
?>