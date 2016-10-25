<?php
// Clan service
require_once(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'global.php');

// This service must return JSON to page
header('Content-Type: application/json');

// If the connected user has no clan, then do nothing
$result = array();
if (!(in_array($_SESSION["account_id"], $gAdmins) || WctRights::isUserHasProfile('commander'))) {
	// If the user is not an administrator or the clan commander, refuse action
	$result['status'] = 'error';
	if (!WctRights::isUserHasProfile('commander'))) {
		$result['message'] = 'error.notallowed';
	} elseif (!in_array($_SESSION["account_id"], $gAdmins)) {
		$result['message'] = 'error.notadmin';
	}
} else {
	$result['status'] = 'ok';
	$needSaveConfig = false;
	if (!empty($gClanConfig)) {
		switch ($_REQUEST['a']) {
			case 'savesettings':
				// TODO: Handle security
				if (array_key_exists('forumurl', $_REQUEST) && !empty(trim($_REQUEST['forumurl']))) {
					$gClanConfig['forumurl'] = $_REQUEST['forumurl'];
				} else {
					$gClanConfig['forumurl'] = null;
				}
				if (array_key_exists('inactivitythreshold', $_REQUEST) && !empty(trim($_REQUEST['inactivitythreshold']))) {
					$gClanConfig['inactivitythreshold'] = $_REQUEST['inactivitythreshold'];
				} else {
					$gClanConfig['inactivitythreshold'] = null;
				}
				$needSaveConfig = true;
				break;
		}
		// Perform save of configuration only when needed
		if ($needSaveConfig) {
			$myClanConfigFile = fopen(getClanConfigFile(), 'w') or die('Unable to open file!');
			fwrite($myClanConfigFile, json_encode($gClanConfig));
			fclose($myClanConfigFile);
		}
	}
}

echo json_encode($result);
