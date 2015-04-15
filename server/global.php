<?php
// Indique à PHP que nous allons effectivement manipuler du texte UTF-8
//mb_internal_encoding('UTF-8');
 
// indique à PHP que nous allons afficher du texte UTF-8 dans le navigateur web
//mb_http_output('UTF-8');

// Session lifetime (14 days = 14*24*3600 seconds = 1209600)
session_set_cookie_params(1209600);
session_start();

// Clusters definition
$gClusters = array(
	"RU"	=> array("url" => "https://api.worldoftanks.ru/",		"key" => "09593f389cc88f0d270ef6e35c0bcd3f"),
	"NA"	=> array("url" => "https://api.worldoftanks.com/",		"key" => "c9439de189fc787041c215d2a9b2ecb9"),
	"EU"	=> array("url" => "https://api.worldoftanks.eu/",		"key" => "e6ecba5f5af3a16603e38f3b40b1a84e"),
	"ASIA"	=> array("url" => "https://api.worldoftanks.asia/",	"key" => "eb10c43e770620cf9b276f4f305bd4ab")
	//,
	// No key for Korea, because I can't found a way to create an account (don't speak Korean...)
	//"KR"	=> array("url" => "https://api.worldoftanks.kr/",		"key" => "")
);

// If the configuration file doesn't exists, then proceed to install...
if (!file_exists(dirname(__FILE__) . '/../config/config.json')) {
	header('Location: ./install.php');
	exit;
}

$gConfig = json_decode(file_get_contents(dirname(__FILE__) . '/../config/config.json'), true);
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
$gMAX_BATTLE_TIME = $gConfig["player"]["max_battle_time"];;

// Name of theme to use
$gThemeName = $gConfig["app"]["theme"];

// Administrators
$gAdmins = $gConfig["app"]["admins"][$gCluster];

define('WCT_DATA_DIR', dirname(__FILE__) . '/../data/' . $gCluster . '/');

$gAuthorizedLang = array("en", "ru", "pl", "de", "fr", "es", "zh", "tr", "cs", /*"th", "vi",*/ "ko");
$gLang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
if (!array_search($gLang, $gAuthorizedLang)) {
	$gLang = $gAuthorizedLang[0];
}

function getUserFile($pUserId) {
	$userFileName = WCT_DATA_DIR . 'user/' . substr($pUserId, 0, 3) . '/' . substr($pUserId, 3, 3) . '/' . $pUserId . '.json';
	$dirName = dirname($userFileName);
	if (!is_dir($dirName)) {
		mkdir($dirName, 0755, true);
	}
	return $userFileName;
}
?>