<?php
// File system service
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'global.php');

// Initialize result
$result = array();
// Configuration file
$configFile = WCT_CONFIG_DIR . DIRECTORY_SEPARATOR . 'config.json';

// Define root directory for browsing
define('FS_ROOT_DIR', WCT_BASE_DATA_DIR);

if (!in_array($_SESSION["account_id"], $gAdmins)) {
	// If the user is not an administrator, refuse action
	$result['status'] = 'error';
	$result['message'] = 'error.notadmin';
} else {
	switch ($_REQUEST['a']) {
		case 'ls':
			$listFiles = glob(FS_ROOT_DIR, GLOB_MARK);
			$result['status'] = 'ok';
			$result['data'] = $listFiles;
			break;
		case 'cat':
			break;
		case 'rm':
			break;
		case 'mv':
			break;
		case 'cp':
			break;
		case 'fileinfo':
			break;
		case 'save':
			break;
	}
}
header('Content-Type: application/json');
echo json_encode($result);
?>