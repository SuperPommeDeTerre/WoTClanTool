<?php
// Indique à PHP que nous allons effectivement manipuler du texte UTF-8
//mb_internal_encoding('UTF-8');
 
// indique à PHP que nous allons afficher du texte UTF-8 dans le navigateur web
//mb_http_output('UTF-8');

require_once(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'version.php');

// Include rights matrix
require_once(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'classes' . DIRECTORY_SEPARATOR . 'wct.rights.php');

/**
 * Returns the path to the clan's configuration file.
 *
 * @param $pClanId
 *     Identifier of the clan. By default, it use the logged user clan id.
 * @param $pClusterId
 *     Identifier of the cluster. By default, it use the logged user cluster id.
 * @return The path to the clan configuration file.
 */
function getClanConfigFile($pClanId = null, $pClusterId = WCT_DEFAULT_CLUSTER) {
	$lClanId = $pClanId;
	if ($lClanId == null) {
		$lClanId = $_SESSION['clan_id'];
	}
	$lClusterId = $pClusterId;
	if (strlen($lClanId) < 9) {
		// Pad clan id for low ids
		$lClanId = str_pad($lClanId, 9, '0', STR_PAD_LEFT);
	}
	$clanConfigFileName = WCT_BASE_DATA_DIR . DIRECTORY_SEPARATOR . $lClusterId . DIRECTORY_SEPARATOR . 'clan' . DIRECTORY_SEPARATOR . $lClanId . DIRECTORY_SEPARATOR . 'config.json';
	$dirName = dirname($clanConfigFileName);
	if (!is_dir($dirName)) {
		// If the clan directory don't exists, create it.
		mkdir($dirName, 0755, true);
	}
	if (!file_exists($clanConfigFileName)) {
		// If the clan's configuration file doesn't exists, create it by copying the default clan configuration.
		copy(WCT_CONFIG_DIR . DIRECTORY_SEPARATOR . 'default.clan.config.json', $clanConfigFileName);
	}
	return $clanConfigFileName;
}

/**
 * Returns the path to the player's configuration file.
 *
 * @param $pUserId
 *     Identifier of the player. By default, it use the logged user id.
 * @param $pClusterId
 *     Identifier of the cluster. By default, it use the logged user cluster id.
 * @return The path to the user file.
 */
function getUserFile($pUserId, $pClusterId = WCT_DEFAULT_CLUSTER) {
	$lUserId = $pUserId;
	if (strlen($lUserId) < 9) {
		// Pad user id for low ids
		$lUserId = str_pad($lUserId, 9, '0', STR_PAD_LEFT);
	}
	$userFileName = WCT_DATA_DIR . 'user' . DIRECTORY_SEPARATOR . substr($lUserId, 0, 3) . DIRECTORY_SEPARATOR . substr($lUserId, 3, 3) . DIRECTORY_SEPARATOR . $lUserId . '.json';
	$dirName = dirname($userFileName);
	if (!is_dir($dirName)) {
		mkdir($dirName, 0755, true);
	}
	return $userFileName;
}

/**
 * Test connected user right to do specified action
 *
 * @param $pActionCode
 *     Code of the action to test
 */
function isUserAllowed($pActionCode = null) {
	// Return false by default
	$returnVal = false;
	// Global admins are allowed to do everything ! ("With great powers came great responsability")
	if (WctRights::isUserAdmin()) {
		$returnVal = true;
	} elseif (!empty($pActionCode)) {
		// Test the right against settings and user's role
	}
	return $returnVal;
}

// Session lifetime (14 days = 14*24*3600 seconds = 1209600)
session_set_cookie_params(1209600);
session_start();

// Clusters definition
require_once(WCT_SERVER_DIR . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'clusters.php');

// If the configuration file doesn't exists, then proceed to install...
if (!file_exists(WCT_CONFIG_DIR . DIRECTORY_SEPARATOR . 'config.json')) {
	header('Location: ./install.php');
	exit;
}

$gConfig = json_decode(file_get_contents(WCT_CONFIG_DIR . DIRECTORY_SEPARATOR . 'config.json'), true);
$gConfig = is_array($gConfig) ? $gConfig : array($gConfig);

// Define cluster (default to EU)
$gCluster = isset($_SESSION["cluster"]) ? $_SESSION["cluster"] : WCT_DEFAULT_CLUSTER;

// Define the WG application ID.
$gWG_APP_ID_CLIENT = $gClusters[$gCluster]["key"];

// URL of WG API
$gWG_API_URL = $gClusters[$gCluster]["url"];

// List of authorized clans ID (empty for no restrictions)
$gCLAN_ID = $gConfig["clans"]["restric_to"][$gCluster];

// Max number of days before a player is marked as inactive
$gMAX_BATTLE_TIME = $gConfig["player"]["max_battle_time"];

// Name of theme to use
$gThemeName = $gConfig["app"]["theme"];

// Administrators
$gAdmins = $gConfig["app"]["admins"][$gCluster];

// Keep replays ? (No, by default)
$gKeepReplays = false;
if (array_key_exists('keepreplays', $gConfig["app"])) {
	$gKeepReplays = $gConfig['app']['keepreplays'];
}

// Initialize clan configuration
$gClanConfig = array();
if (array_key_exists('clan_id', $_SESSION)) {
	$gClanConfig = json_decode(file_get_contents(getClanConfigFile(null, $gCluster)), true);
}

// Handle advertisement
$gShowAds = true;
if (array_key_exists('showads', $gConfig["app"])) {
	$gShowAds = $gConfig['app']['showads'];
	if ($gShowAds) {
		if (array_key_exists('showads', $gClanConfig)) {
			$gShowAds = $gClanConfig['showads'];
		}
	}
}
// Handle inactivity thresold
if (!array_key_exists('inactivitythreshold', $gClanConfig)) {
	$gClanConfig['inactivitythreshold'] = $gMAX_BATTLE_TIME;
} else {
	$gMAX_BATTLE_TIME = $gClanConfig['inactivitythreshold'];
}

// Define the data dir (depends on cluster)
define('WCT_DATA_DIR', WCT_BASE_DATA_DIR . DIRECTORY_SEPARATOR . $gCluster . DIRECTORY_SEPARATOR);

// Define CW cache file
define('CW_CACHE_FILE', WCT_DATA_DIR . 'cwcache.json');

// Langs definition
require_once(WCT_SERVER_DIR . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'langs.php');
?>