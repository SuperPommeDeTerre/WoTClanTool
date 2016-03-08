<?php
// Clan service
require_once(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'global.php');

// This service must return JSON to page
header('Content-Type: application/json');

// If the connected user has no clan, then do nothing
$result = array();
$result['result'] = 'ok';
$needSaveConfig = false;
if (!empty($gClanConfig)) {
	switch ($_REQUEST['a']) {
		case 'setforumurl':
			// TODO: Handle security
			if (array_key_exists('forumurl', $_REQUEST) && !empty(trim($_REQUEST['forumurl']))) {
				$gClanConfig['forumurl'] = $_REQUEST['forumurl'];
			} else {
				$gClanConfig['forumurl'] = null;
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

echo json_encode($result);
