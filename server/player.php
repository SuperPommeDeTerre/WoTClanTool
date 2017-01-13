<?php
// Calendar service
require (dirname ( __FILE__ ) . DIRECTORY_SEPARATOR . 'global.php');

// This service must return JSON to page
header ( 'Content-Type: application/json' );

// Gets the WN8 expected vals as requested by the algorithm
$WN8_EXPECTED_VALS = json_decode ( file_get_contents ( WCT_BASE_DATA_DIR . DIRECTORY_SEPARATOR . 'WN8_expected_tank_values.json' ), true );
$WN8_tanksExpectedVals = is_array ( $WN8_EXPECTED_VALS ['data'] ) ? $WN8_EXPECTED_VALS ['data'] : array (
		$WN8_EXPECTED_VALS ['data'] 
);
// Gets the WN9 expected vals as requested by the algorithm
$WN9_EXPECTED_VALS = json_decode ( file_get_contents ( WCT_BASE_DATA_DIR . DIRECTORY_SEPARATOR . 'WN9_expected_tank_values.json' ), true );
$WN9_tanksExpectedVals = is_array ( $WN9_EXPECTED_VALS ['data'] ) ? $WN9_EXPECTED_VALS ['data'] : array (
		$WN9_EXPECTED_VALS ['data'] 
);
$gWN9TierAvg = array ( // from 150816 EU avgs exc scout/arty
		array (
				"win" => 0.477,
				"dmg" => 88.9,
				"frag" => 0.68,
				"spot" => 0.90,
				"def" => 0.53,
				"cap" => 1.0,
				"weight" => 0.40 
		),
		array (
				"win" => 0.490,
				"dmg" => 118.2,
				"frag" => 0.66,
				"spot" => 0.85,
				"def" => 0.65,
				"cap" => 1.0,
				"weight" => 0.41 
		),
		array (
				"win" => 0.495,
				"dmg" => 145.1,
				"frag" => 0.59,
				"spot" => 1.05,
				"def" => 0.51,
				"cap" => 1.0,
				"weight" => 0.44 
		),
		array (
				"win" => 0.492,
				"dmg" => 214.0,
				"frag" => 0.60,
				"spot" => 0.81,
				"def" => 0.55,
				"cap" => 1.0,
				"weight" => 0.44 
		),
		array (
				"win" => 0.495,
				"dmg" => 388.3,
				"frag" => 0.75,
				"spot" => 0.93,
				"def" => 0.63,
				"cap" => 1.0,
				"weight" => 0.60 
		),
		array (
				"win" => 0.497,
				"dmg" => 578.7,
				"frag" => 0.74,
				"spot" => 0.93,
				"def" => 0.52,
				"cap" => 1.0,
				"weight" => 0.70 
		),
		array (
				"win" => 0.498,
				"dmg" => 791.1,
				"frag" => 0.76,
				"spot" => 0.87,
				"def" => 0.58,
				"cap" => 1.0,
				"weight" => 0.82 
		),
		array (
				"win" => 0.497,
				"dmg" => 1098.7,
				"frag" => 0.79,
				"spot" => 0.87,
				"def" => 0.58,
				"cap" => 1.0,
				"weight" => 1.00 
		),
		array (
				"win" => 0.498,
				"dmg" => 1443.2,
				"frag" => 0.86,
				"spot" => 0.94,
				"def" => 0.56,
				"cap" => 1.0,
				"weight" => 1.23 
		),
		array (
				"win" => 0.498,
				"dmg" => 1963.8,
				"frag" => 1.04,
				"spot" => 1.08,
				"def" => 0.61,
				"cap" => 1.0,
				"weight" => 1.60 
		) 
);

/**
 * Compute the WN8 of a tank respect to the algorithm specified here :
 * http://wiki.wnefficiency.net/pages/WN8#The_Steps_of_WN8_-_The_Formula
 *
 * @param $pTanksExpectedVals Tank
 *        	expected values (for all tanks) as needed by the algrithm (http://www.wnefficiency.net/wnexpected/)
 * @param $pTankStats Actual
 *        	tank statistics.
 * @return The WN8 rating of the tank.
 */
function calcTankWN8($pTanksExpectedVals, $pTankStats) {
	$returnVal = 0;
	foreach ( $pTanksExpectedVals as $tankExpectedVals ) {
		if ($tankExpectedVals ['IDNum'] == $pTankStats ['tank_id']) {
			$lTankBattles = $pTankStats ['all'] ['battles'];
			if ($lTankBattles > 0) {
				$avgDmg = $pTankStats ['all'] ['damage_dealt'] / $lTankBattles;
				$avgSpot = $pTankStats ['all'] ['spotted'] / $lTankBattles;
				$avgFrag = $pTankStats ['all'] ['frags'] / $lTankBattles;
				$avgDef = $pTankStats ['all'] ['dropped_capture_points'] / $lTankBattles;
				$avgWinRate = $pTankStats ['all'] ['wins'] * 100 / $lTankBattles;
				// STEP 1
				$rDAMAGE = $avgDmg / $tankExpectedVals ['expDamage'];
				$rSPOT = $avgSpot / $tankExpectedVals ['expSpot'];
				$rFRAG = $avgFrag / $tankExpectedVals ['expFrag'];
				$rDEF = $avgDef / $tankExpectedVals ['expDef'];
				$rWIN = $avgWinRate / $tankExpectedVals ['expWinRate'];
				// STEP 2
				$rWINc = max ( 0, ($rWIN - 0.71) / (1 - 0.71) );
				$rDAMAGEc = max ( 0, ($rDAMAGE - 0.22) / (1 - 0.22) );
				$rFRAGc = max ( 0, min ( $rDAMAGEc + 0.2, ($rFRAG - 0.12) / (1 - 0.12) ) );
				$rSPOTc = max ( 0, min ( $rDAMAGEc + 0.1, ($rSPOT - 0.38) / (1 - 0.38) ) );
				$rDEFc = max ( 0, min ( $rDAMAGEc + 0.1, ($rDEF - 0.10) / (1 - 0.10) ) );
				// STEP 3
				$returnVal = 980 * $rDAMAGEc + 210 * $rDAMAGEc * $rFRAGc + 155 * $rFRAGc * $rSPOTc + 75 * $rDEFc * $rFRAGc + 145 * min ( 1.8, $rWINc );
			}
			break;
		}
	}
	return $returnVal;
}

/**
 * Compute the WN9 of a tank respect to the algorithm specified here :
 * http://jaj22.org.uk/wn9implement.html
 *
 * @param $pTanksExpectedVals Tank
 *        	expected values (for all tanks) as needed by the algrithm (http://jaj22.org.uk/expvals.html)
 * @param $pTankStats Actual
 *        	tank statistics.
 * @return The WN9 rating of the tank.
 */
function calcTankWN9($pTankStats, $pMaxhist) {
	global $gWN9TierAvg, $WN9_tanksExpectedVals;
	$returnVal = 0;
	foreach ( $WN9_tanksExpectedVals as $tankExpectedVals ) {
		if ($tankExpectedVals ['id'] == $pTankStats ['tank_id']) {
			$lTankBattles = $pTankStats ['all'] ['battles'];
			if ($lTankBattles > 0) {
				$avg = $gWN9TierAvg [$tankExpectedVals ['mmrange'] >= 3 ? $tankExpectedVals ['tier'] : $tankExpectedVals ['tier'] - 1];
				$rdmg = $pTankStats ['all'] ['damage_dealt'] / ($lTankBattles * $avg ['dmg']);
				$rfrag = $pTankStats ['all'] ['frags'] / ($lTankBattles * $avg ['frag']);
				$rspot = $pTankStats ['all'] ['spotted'] / ($lTankBattles * $avg ['spot']);
				$rdef = $pTankStats ['all'] ['dropped_capture_points'] / ($lTankBattles * $avg ['def']);
				
				// Calculate raw winrate-correlated wn9base
				// Use different formula for low battle counts
				$wn9base = 0.7 * $rdmg;
				if ($lTankBattles < 5) {
					$wn9base += 0.14 * $rfrag + 0.13 * sqrt ( $rspot ) + 0.03 * sqrt ( $rdef );
				} else {
					$wn9base += 0.25 * sqrt ( $rfrag * $rspot ) + 0.05 * sqrt ( $rfrag * sqrt ( $rdef ) );
				}
				// Adjust expected value if generating maximum historical value
				$wn9exp = $pMaxhist ? $tankExpectedVals ['wn9exp'] * (1 + $tankExpectedVals ['wn9nerf']) : $tankExpectedVals ['wn9exp'];
				// Calculate final WN9 based on tank expected value & skill scaling
				$returnVal = 666 * max ( 0, 1 + ($wn9base / $wn9exp - 1) / $tankExpectedVals ['wn9scale'] );
			}
			break;
		}
	}
	return $returnVal;
}

/**
 * Gets the user's settings from file.
 *
 * @param string $pUserFile
 *        	User's file path
 * @return user's settings array
 */
function getPlayerSettings($pUserFile) {
	$userSettings = array ();
	if (! isset ( $pUserFile ) || $pUserFile == null) {
		if (isset ( $_SESSION ['account_id'] )) {
			$userFile = getUserFile ( $_SESSION ['account_id'] );
			$userSettings = getPlayerSettings ( $userFile );
		}
	} else if (file_exists ( $pUserFile )) {
		$userSettings = json_decode ( file_get_contents ( $pUserFile ), true );
		$userSettings = is_array ( $userSettings ) ? $userSettings : array (
				$userSettings 
		);
	}
	if (! array_key_exists ( 'vacancies', $userSettings )) {
		$userSettings ['vacancies'] = array ();
	}
	if (! array_key_exists ( 'settings', $userSettings )) {
		$userSettings ['settings'] = array ();
	}
	if (! array_key_exists ( 'twitchurl', $userSettings ['settings'] )) {
		$userSettings ['settings'] ['twitchurl'] = null;
	}
	if (! array_key_exists ( 'youtubeurl', $userSettings ['settings'] )) {
		$userSettings ['settings'] ['youtubeurl'] = null;
	}
	return $userSettings;
}

/**
 * Save user's settings
 *
 * @param string $pUserFile
 *        	path to user's file
 * @param array $pVacancies
 *        	List of vacancies
 * @param array $pTankStats
 *        	Player's tanks statistics
 * @param array $pSettings
 *        	Player's settings
 */
function savePlayerSettings($pUserFile = null, $pVacancies, $pTankStats, $pSettings) {
	if (! isset ( $pUserFile ) || $pUserFile == null) {
		if (isset ( $_SESSION ['account_id'] )) {
			$userSettings = savePlayerSettings ( getUserFile ( $_SESSION ['account_id'] ), $pVacancies, $pTankStats, $pSettings );
		}
	} else if (file_exists ( $pUserFile )) {
		$myfile = fopen ( $pUserFile, 'w' ) or die ( 'Unable to open file!' );
		// exclusive lock
		if (flock ( $myfile, LOCK_EX )) {
			fwrite ( $myfile, json_encode ( array (
					'vacancies' => $pVacancies,
					'tankstats' => $pTankStats,
					'settings' => $pSettings 
			) ) );
			// release lock
			flock ( $myfile, LOCK_UN );
		}
		fclose ( $myfile );
	}
}

// Switch between requested action
$userFile = '';
if (isset ( $_SESSION ['account_id'] )) {
	$userFile = getUserFile ( $_SESSION ['account_id'] );
}
$result = array ();
switch ($_REQUEST ['action']) {
	case 'getwn8expectedvals' :
		$result ['data'] = $WN8_tanksExpectedVals;
		break;
	case 'getwn9expectedvals' :
		$result ['data'] = $WN9_tanksExpectedVals;
		break;
	case 'setclanid' :
		$_SESSION ["clan_id"] = $_REQUEST ["clan_id"];
		break;
	case 'setrole' :
		$_SESSION ["USER_ROLE"] = $_REQUEST ["role"];
		break;
	case 'setcluster' :
		$_SESSION ["cluster"] = $_REQUEST ["cluster"];
		break;
	case 'purge' :
		$usersToPurge = array ();
		if (array_key_exists ( 'account_id', $_REQUEST )) {
			$usersToPurge = explode ( ',', $_REQUEST ['account_id'] );
		} else {
			$usersToPurge [] = $_SESSION ['account_id'];
		}
		foreach ( $usersToGet as $userId ) {
			$userFile = getUserFile ( $userId );
			if (file_exists ( $userFile )) {
				unlink ( $userFile );
			}
		}
		break;
	case 'gettanksstats' :
		$usersToGet = array ();
		$myTanksStats = array ();
		if (array_key_exists ( 'account_id', $_REQUEST )) {
			$usersToGet = explode ( ',', $_REQUEST ['account_id'] );
		} else {
			array_push ( $usersToGet, $_SESSION ['account_id'] );
		}
		// If the request passes data, then we are also setting data
		$doParseData = false;
		if (array_key_exists ( 'data', $_REQUEST )) {
			$myTanksStats = json_decode ( $_REQUEST ['data'], true );
			$myTanksStats = is_array ( $myTanksStats ) ? $myTanksStats : array (
					$myTanksStats 
			);
			$doParseData = true;
		}
		$playerTanksStats = array ();
		$playerTanksStatsToStore = array ();
		foreach ( $usersToGet as $userId ) {
			$userFile = getUserFile ( $userId );
			if (file_exists ( $userFile )) {
				$playerTanksStats [$userId] = json_decode ( file_get_contents ( $userFile ), true );
			} else {
				$playerTanksStats [$userId] = array ();
			}
			$playerVacancies = array ();
			$playerSettings = array ();
			if (array_key_exists ( 'tankstats', $playerTanksStats [$userId] )) {
				// Store vacancies to preserve them.
				$playerVacancies = $playerTanksStats [$userId] ['vacancies'];
				// Store settings to preserve them.
				$playerSettings = $playerTanksStats [$userId] ['settings'];
				$playerTanksStats [$userId] = $playerTanksStats [$userId] ['tankstats'];
			}
			$playerTanksStatsToStore [$userId] = array ();
			if ($doParseData) {
				// Handle modifications
				if (file_exists ( $userFile )) {
					$valueToStore = array ();
					foreach ( $myTanksStats [$userId] as &$valueWG ) {
						$isTankFound = false;
						foreach ( $playerTanksStats [$userId] as $valueStored ) {
							if ($valueStored ['tank_id'] == $valueWG ['tank_id']) {
								// It's the same tank. Process it...
								$valueToStore ['tank_id'] = $valueWG ['tank_id'];
								if (array_key_exists ( 'is_full', $valueStored )) {
									$valueToStore ['is_full'] = $valueStored ['is_full'];
								}
								if (array_key_exists ( 'is_ready', $valueStored )) {
									$valueToStore ['is_ready'] = $valueStored ['is_ready'];
								}
								$valueToStore ['in_garage'] = $valueWG ['in_garage'] != null ? $valueWG ['in_garage'] : false;
								// Calculate stats if battles have been recorded since last storage
								if ($valueStored ['battles'] != $valueWG ['all'] ['battles']) {
									$valueToStore ['wn8'] = calcTankWN8 ( $WN8_tanksExpectedVals, $valueWG );
									$valueToStore ['wn9'] = calcTankWN9 ( $valueWG, false );
								} else {
									// Gets the old stats if the tank has not been played
									if (! array_key_exists ( 'wn8', $valueStored )) {
										$valueToStore ['wn8'] = calcTankWN8 ( $WN8_tanksExpectedVals, $valueWG );
									} else {
										$valueToStore ['wn8'] = $valueStored ['wn8'];
									}
									if (! array_key_exists ( 'wn9', $valueStored )) {
										$valueToStore ['wn9'] = calcTankWN9 ( $valueWG, false );
									} else {
										$valueToStore ['wn9'] = $valueStored ['wn9'];
									}
								}
								$valueToStore ['battles'] = $valueWG ['all'] ['battles'];
								$isTankFound = true;
								break;
							}
						}
						if (! $isTankFound) {
							// The tank is not found in the player data. Add it.
							$valueToStore ['tank_id'] = $valueWG ['tank_id'];
							$valueToStore ['battles'] = $valueWG ['all'] ['battles'];
							$valueToStore ['in_garage'] = $valueWG ['in_garage'] != null ? $valueWG ['in_garage'] : false;
							$valueToStore ['is_full'] = false;
							$valueToStore ['is_ready'] = false;
							$valueToStore ['wn8'] = calcTankWN8 ( $WN8_tanksExpectedVals, $valueWG );
							$valueToStore ['wn9'] = calcTankWN9 ( $valueWG, false );
						}
						$playerTanksStatsToStore [$userId] [] = $valueToStore;
					}
				} else {
					foreach ( $myTanksStats [$userId] as &$valueWG ) {
						$valueToStore = array ();
						$valueToStore ['tank_id'] = $valueWG ['tank_id'];
						$valueToStore ['battles'] = $valueWG ['all'] ['battles'];
						$valueToStore ['in_garage'] = $valueWG ['in_garage'] != null ? $valueWG ['in_garage'] : false;
						$valueToStore ['is_full'] = false;
						$valueToStore ['is_ready'] = false;
						$valueToStore ['wn8'] = calcTankWN8 ( $WN8_tanksExpectedVals, $valueWG );
						$valueToStore ['wn9'] = calcTankWN9 ( $valueWG, false );
						$playerTanksStatsToStore [$userId] [] = $valueToStore;
					}
				}
				$myfile = fopen ( $userFile, 'w' ) or die ( 'Unable to open file!' );
				$playerInfos = array (
						'vacancies' => $playerVacancies,
						'tankstats' => $playerTanksStatsToStore [$userId],
						'settings' => $playerSettings 
				);
				fwrite ( $myfile, json_encode ( $playerInfos ) );
				fclose ( $myfile );
			}
		}
		if (array_key_exists ( 'data', $_REQUEST )) {
			$playerTanksStats = $playerTanksStatsToStore;
		}
		$result ['data'] = $playerTanksStats;
		break;
	case 'settankprops' :
		$tankId = $_REQUEST ['tank_id'];
		$playerTanksStats = file_get_contents ( $userFile );
		$playerTanksStats = json_decode ( $playerTanksStats, true );
		$playerTanksStats = is_array ( $playerTanksStats ) ? $playerTanksStats : array (
				$playerTanksStats 
		);
		// Handle file version format
		if (array_key_exists ( 'tankstats', $playerTanksStats )) {
			// Store vacancies to preserve them.
			$playerVacancies = $playerTanksStats ['vacancies'];
			// Store settings to preserve them.
			$playerSettings = $playerTanksStats ['settings'];
			$playerTanksStats = $playerTanksStats ['tankstats'];
		}
		foreach ( $playerTanksStats as &$valueStored ) {
			if ($valueStored ['tank_id'] == $tankId) {
				if (isset ( $_REQUEST ['is_full'] )) {
					$valueStored ['is_full'] = $_REQUEST ['is_full'] === 'true' ? true : false;
				}
				if (isset ( $_REQUEST ['is_ready'] )) {
					$valueStored ['is_ready'] = $_REQUEST ['is_ready'] === 'true' ? true : false;
				}
				$result ['data'] = $valueStored;
				break;
			}
		}
		$myfile = fopen ( $userFile, 'w' ) or die ( 'Unable to open file!' );
		$playerInfos = array (
				'vacancies' => $playerVacancies,
				'tankstats' => $playerTanksStats,
				'settings' => $playerSettings 
		);
		fwrite ( $myfile, json_encode ( $playerInfos ) );
		fclose ( $myfile );
		break;
	case 'addvacancy' :
		// Define vacancy for player
		if (array_key_exists ( 'startdate', $_REQUEST ) && array_key_exists ( 'enddate', $_REQUEST )) {
			$playerVacancies = array ();
			$playerTankStats = array ();
			$playerInfos = file_get_contents ( $userFile );
			$playerInfos = json_decode ( $playerInfos, true );
			$playerInfos = is_array ( $playerInfos ) ? $playerInfos : array (
					$playerInfos 
			);
			// Handle file version format
			if (array_key_exists ( 'vacancies', $playerInfos )) {
				$playerVacancies = $playerInfos ['vacancies'];
				// Store settings to preserve them.
				$playerSettings = $playerInfos ['settings'];
				$playerTankStats = $playerInfos ['tankstats'];
			}
			array_push ( $playerVacancies, array (
					'startdate' => $_REQUEST ['startdate'],
					'enddate' => $_REQUEST ['enddate'],
					'reason' => $_REQUEST ['reason'] 
			) );
			// Persist data
			$myfile = fopen ( $userFile, 'w' ) or die ( 'Unable to open file!' );
			fwrite ( $myfile, json_encode ( array (
					'vacancies' => $playerVacancies,
					'tankstats' => $playerTankStats,
					'settings' => $playerSettings 
			) ) );
			fclose ( $myfile );
		}
		break;
	case 'delvacancy' :
		// Define vacancy for player
		if (array_key_exists ( 'startdate', $_REQUEST ) && array_key_exists ( 'enddate', $_REQUEST )) {
			$playerVacancies = array ();
			$playerTankStats = array ();
			$playerInfos = file_get_contents ( $userFile );
			$playerInfos = json_decode ( $playerInfos, true );
			$playerInfos = is_array ( $playerInfos ) ? $playerInfos : array (
					$playerInfos 
			);
			$isVacancyDeleted = false;
			// Handle file version format
			if (array_key_exists ( 'vacancies', $playerInfos )) {
				$playerVacancies = $playerInfos ['vacancies'];
				$playerVacanciesToStore = array ();
				// Store settings to preserve them.
				$playerSettings = $playerInfos ['settings'];
				$playerTankStats = $playerInfos ['tankstats'];
				foreach ( $playerVacancies as $vacancy ) {
					if ($vacancy ['startdate'] == $_REQUEST ['startdate'] && $vacancy ['enddate'] == $_REQUEST ['enddate']) {
						// Vacancy found. Delete it.
						$isVacancyDeleted = true;
						$result ['data'] = $vacancy;
					} else {
						$playerVacanciesToStore [] = $vacancy;
					}
				}
			}
			// Persist data
			if ($isVacancyDeleted == true) {
				$myfile = fopen ( $userFile, 'w' ) or die ( 'Unable to open file!' );
				fwrite ( $myfile, json_encode ( array (
						'vacancies' => $playerVacanciesToStore,
						'tankstats' => $playerTankStats,
						'settings' => $playerSettings 
				) ) );
				fclose ( $myfile );
			}
		}
		break;
	case 'getvacancies' :
		// Get vacancies for player(s)
		$playerIds = array ();
		$playerVacancies = array ();
		if (array_key_exists ( 'account_id', $_REQUEST )) {
			$playerIds = explode ( ',', $_REQUEST ['account_id'] );
		} else {
			$playerIds [] = $_SESSION ['account_id'];
		}
		foreach ( $playerIds as $userId ) {
			$userFile = getUserFile ( $userId );
			$playerVacancies [$userId] = array ();
			if (file_exists ( $userFile )) {
				$playerInfos = file_get_contents ( $userFile );
				$playerInfos = json_decode ( $playerInfos, true );
				$playerInfos = is_array ( $playerInfos ) ? $playerInfos : array (
						$playerInfos 
				);
				if (array_key_exists ( 'vacancies', $playerInfos )) {
					$playerVacancies [$userId] = $playerInfos ['vacancies'];
				}
			}
		}
		$result ['data'] = $playerVacancies;
		break;
	case 'getsettings' :
		// Get settings
		$result ['data'] = getPlayerSettings ( $userFile ) ['settings'];
		break;
	case 'savesettings' :
		// Save settings
		$settingsToSave = array ();
		$needSaveSettings = false;
		// Gets actual data.
		$playerInfos = file_get_contents ( $userFile );
		$playerInfos = json_decode ( $playerInfos, true );
		$playerInfos = is_array ( $playerInfos ) ? $playerInfos : array (
				$playerInfos 
		);
		if (array_key_exists ( 'vacancies', $playerInfos )) {
			$playerVacancies = $playerInfos ['vacancies'];
		} else {
			$playerVacancies = array ();
		}
		if (array_key_exists ( 'tankstats', $playerInfos )) {
			$playerTankStats = $playerInfos ['tankstats'];
		} else {
			$playerTankStats = array ();
		}
		if (array_key_exists ( 'settings', $playerInfos )) {
			$playerSettings = $playerInfos ['settings'];
		} else {
			$playerSettings = array ();
		}
		if (! array_key_exists ( 'twitchurl', $playerSettings )) {
			$playerSettings ['twitchurl'] = null;
		}
		if (! array_key_exists ( 'youtubeurl', $playerSettings )) {
			$playerSettings ['youtubeurl'] = null;
		}
		if (array_key_exists ( 'twitchurl', $_REQUEST ) && $playerSettings ['twitchurl'] != $_REQUEST ['twitchurl']) {
			$playerSettings ['twitchurl'] = $_REQUEST ['twitchurl'];
			$needSaveSettings = true;
		} else if ($playerSettings ['twitchurl'] != $_REQUEST ['twitchurl']) {
			$playerSettings ['twitchurl'] = null;
			$needSaveSettings = true;
		}
		if (array_key_exists ( 'youtubeurl', $_REQUEST ) && $playerSettings ['youtubeurl'] != $_REQUEST ['youtubeurl']) {
			$playerSettings ['youtubeurl'] = $_REQUEST ['youtubeurl'];
			$needSaveSettings = true;
		} else if ($playerSettings ['youtubeurl'] != $_REQUEST ['youtubeurl']) {
			$playerSettings ['youtubeurl'] = null;
			$needSaveSettings = true;
		}
		// Persist data
		if ($needSaveSettings == true) {
			$myfile = fopen ( $userFile, 'w' ) or die ( 'Unable to open file!' );
			fwrite ( $myfile, json_encode ( array (
					'vacancies' => $playerVacancies,
					'tankstats' => $playerTankStats,
					'settings' => $playerSettings 
			) ) );
			fclose ( $myfile );
		}
		break;
	case 'getstreams':
		// Find twitch and youtube configured streams
		$result ['streams'] = array('twitch' => array(), 'youtube' => array());
		$usersToGet = array ();
		if (array_key_exists ( 'account_id', $_REQUEST )) {
			$usersToGet = explode ( ',', $_REQUEST ['account_id'] );
		} else {
			array_push ( $usersToGet, $_SESSION ['account_id'] );
		}
		// Add clan channels
		$clanConfigFile = getClanConfigFile();
		$clanConfig = file_get_contents ( $clanConfigFile );
		$clanConfig = json_decode ( $clanConfig, true );
		$clanConfig = is_array ( $clanConfig ) ? $clanConfig : array (
				$clanConfig
		);
		if (array_key_exists('twitchurl', $clanConfig) && $clanConfig['twitchurl'] != null) {
			array_push($result ['streams']['twitch'], $clanConfig['twitchurl']);
		}
		if (array_key_exists('youtubeurl', $clanConfig) && $clanConfig['youtubeurl'] != null) {
			array_push($result ['streams']['youtube'], $clanConfig['youtubeurl']);
		}
		// Add players channels
		foreach ( $usersToGet as $userId ) {
			$playerInfos = getPlayerSettings(getUserFile ( $userId ));
			if (array_key_exists('twitchurl', $playerInfos['settings']) && $playerInfos['settings']['twitchurl'] != null) {
				array_push($result ['streams']['twitch'], $playerInfos['settings']['twitchurl']);
			}
			if (array_key_exists('youtubeurl', $playerInfos['settings']) && $playerInfos['settings']['youtubeurl'] != null) {
				array_push($result ['streams']['youtube'], $playerInfos['settings']['youtubeurl']);
			}
		}
		break;
}
$result ['result'] = 'ok';

echo json_encode ( $result );