<?php
// Clan service
require_once(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'global.php');

// This service must return JSON to page
header('Content-Type: application/json');

// Initialize result
$result = array();

// If the connected user has no clan, then do nothing
if (!WctRights::isUserHasRight("clansettings.modify")) {
	// If the user is not an administrator or the clan commander, refuse action
	$result['status'] = 'error';
	$result['message'] = 'error.notallowed';
} else {
	$result['status'] = 'ok';
	$needSaveConfig = false;
	if (!empty($gClanConfig)) {
		switch ($_REQUEST['a']) {
			case 'savesettings':
				if (array_key_exists('forumurl', $_REQUEST) && !empty(trim($_REQUEST['forumurl']))) {
					$gClanConfig['forumurl'] = $_REQUEST['forumurl'];
				} else {
					$gClanConfig['forumurl'] = null;
				}
				if (array_key_exists('youtubeurl', $_REQUEST) && !empty(trim($_REQUEST['youtubeurl']))) {
					$gClanConfig['youtubeurl'] = $_REQUEST['youtubeurl'];
				} else {
					$gClanConfig['youtubeurl'] = null;
				}
				if (array_key_exists('inactivitythreshold', $_REQUEST) && !empty(trim($_REQUEST['inactivitythreshold']))) {
					$gClanConfig['inactivitythreshold'] = $_REQUEST['inactivitythreshold'];
				} else {
					$gClanConfig['inactivitythreshold'] = 14;
				}
				if (array_key_exists('rights', $_REQUEST) && !empty(trim($_REQUEST['rights']))) {
					$gClanConfig['rights'] = json_decode($_REQUEST['rights'], true);
				}
				$needSaveConfig = true;
				break;
		}
		// Perform save of configuration only when needed
		if ($needSaveConfig) {
			$myClanConfigFile = fopen(getClanConfigFile(null, $gCluster), 'w') or die('Unable to open file!');
			fwrite($myClanConfigFile, json_encode($gClanConfig));
			fclose($myClanConfigFile);
		}
	}
}

echo json_encode($result);
