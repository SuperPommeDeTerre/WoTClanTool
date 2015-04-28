<?php
// Indique à PHP que nous allons effectivement manipuler du texte UTF-8
//mb_internal_encoding('UTF-8');
 
// indique à PHP que nous allons afficher du texte UTF-8 dans le navigateur web
//mb_http_output('UTF-8');

require_once(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'version.php');

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
$gCluster = isset($_SESSION["cluster"]) ? $_SESSION["cluster"] : "EU";

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

// Handle advertisement
$gShowAds = true;
if (array_key_exists('showads', $gConfig["app"])) {
	$gShowAds = $gConfig['app']['showads'];
}

// Define the data dir (depends on cluster)
define('WCT_DATA_DIR', WCT_BASE_DATA_DIR . DIRECTORY_SEPARATOR . $gCluster . DIRECTORY_SEPARATOR);

// Langs definition
require_once(WCT_SERVER_DIR . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'langs.php');

function getUserFile($pUserId) {
	$userFileName = WCT_DATA_DIR . 'user' . DIRECTORY_SEPARATOR . substr($pUserId, 0, 3) . DIRECTORY_SEPARATOR . substr($pUserId, 3, 3) . DIRECTORY_SEPARATOR . $pUserId . '.json';
	$dirName = dirname($userFileName);
	if (!is_dir($dirName)) {
		mkdir($dirName, 0755, true);
	}
	return $userFileName;
}
?>