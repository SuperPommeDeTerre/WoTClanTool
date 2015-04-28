<?php
// Administration service
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'global.php');

require(WCT_SERVER_DIR . DIRECTORY_SEPARATOR . 'classes' . DIRECTORY_SEPARATOR . 'wct.event.inc');

define('WCT_BASE_EVENT_DIR', WCT_DATA_DIR . 'clan' . DIRECTORY_SEPARATOR . $_SESSION['clan_id'] . DIRECTORY_SEPARATOR . 'events');
if (!is_dir(WCT_BASE_EVENT_DIR)) {
	mkdir(WCT_BASE_EVENT_DIR, 0755, true);
}
$result = array();
switch ($_REQUEST['a']) {
	case 'save':
		// Save configuration parameters
		$result['status'] = 'success';
		break;
}
header('Content-Type: application/json');
echo json_encode($result);
?>