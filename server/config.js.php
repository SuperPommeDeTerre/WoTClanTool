<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'global.php');

header('Content-Type: text/javascript');
$confArray = array(
	'WG_APP_ID' => $gWG_APP_ID_CLIENT,
	'WG_API_URL' => $gWG_API_URL,
	'THEME' => $gThemeName,
	'CLAN_IDS' => $gCLAN_ID,
	'LANG' => $gLang,
	'THRESHOLDS_MAX_BATTLES' => $gMAX_BATTLE_TIME,
	'CLUSTERS' => $gClusters,
	'SHOW_ADS' => $gShowAds,
	'KEEP_REPLAYS' => $gKeepReplays
);
if (isset($_SESSION["access_token"])) {
	$confArray['ACCESS_TOKEN'] = $_SESSION["access_token"];
	$confArray['PLAYER_ID'] = $_SESSION["account_id"];
	$confArray['IS_ADMIN'] = WctRights::isUserAdmin();
}
if (isset($_SESSION["cluster"])) {
	$confArray['CLUSTER'] = $_SESSION["cluster"];
} else {
	$confArray['CLUSTER'] = $gCluster;
}
if (isset($_SESSION['clan_id'])) {
	$confArray['USER_CLAN_ID'] = $_SESSION['clan_id'];
} else {
	$confArray['USER_CLAN_ID'] = '';
}
if (isset($_SESSION['USER_ROLE'])) {
	$confArray['USER_ROLE'] = $_SESSION['USER_ROLE'];
} else {
	$confArray['USER_ROLE'] = '';
}
$confArray['CLAN_CONFIG'] = $gClanConfig;

echo 'var gConfig = ' . json_encode($confArray) . ';';
?>