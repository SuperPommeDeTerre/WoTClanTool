<?php
// Calendar service
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'global.php');

require(WCT_SERVER_DIR . DIRECTORY_SEPARATOR . 'classes' . DIRECTORY_SEPARATOR . 'wct.event.inc');

define('WCT_BASE_EVENT_DIR', WCT_DATA_DIR . 'clan' . DIRECTORY_SEPARATOR . $_SESSION['clan_id'] . DIRECTORY_SEPARATOR . 'events');
if (!is_dir(WCT_BASE_EVENT_DIR)) {
	mkdir(WCT_BASE_EVENT_DIR, 0755, true);
}

// Switch between requested action
$isJsonResult = true;
$result = array();
switch ($_REQUEST['a']) {
	case 'list':
		// This service must return JSON to page
		header('Content-Type: application/json');
		$files = wctEvent::getFilesFromRange(floor($_REQUEST['from'] / 1000), floor($_REQUEST['to'] / 1000));
		$out = array();
		foreach ($files as $eventsFile) {
			$fileContent = json_decode(file_get_contents($eventsFile), true);
			$fileContent = is_array($fileContent) ? $fileContent : array($fileContent);
			foreach ($fileContent as $eventData) {
				array_push($out, wctEvent::fromJson($eventData)->toCalendarArray());
			}
		}
		echo json_encode(array('success' => 1, 'result' => $out));
		exit;
		break;
	case 'save':
		// This service must return JSON to page
		header('Content-Type: application/json');
		// Parse event from request
		$myEvent = new wctEvent();
		$eventId = '';
		if (isset($_REQUEST['eventId'])) {
			$eventId = $_REQUEST['eventId'];
		}
		if ($eventId != '') {
			$myEvent->setId($eventId);
		} else {
			$myEvent->setOwner($_SESSION['account_id']);
			$myEvent->setDateCreation(time());
			$myEvent->setDateModification(time());
		}
		$myEvent->setTitle($_REQUEST['eventTitle']);
		$myEvent->setType($_REQUEST['eventType']);
		if (isset($_REQUEST['eventDescription'])) {
			$myEvent->setDescription($_REQUEST['eventDescription']);
		}
		// Dates are passed as UNIX timestamps
		$myEvent->setDateStart(intval($_REQUEST['eventStartDate']));
		if (isset($_REQUEST['eventEndDate'])) {
			$myEvent->setDateEnd(intval($_REQUEST['eventEndDate']));
		}
		// Load events from data file
		$saveFile = wctEvent::getFileFromDate($myEvent->getDateStart());
		$fileContents = json_decode(file_get_contents($saveFile), true);
		$fileContents = is_array($fileContents) ? $fileContents : array($fileContents);
		if (count($fileContents) == 1 && $fileContents[0] == NULL) {
			array_splice($fileContents, 0, 1);
		}
		// Find a free id or locate actual event to update it.
		$localId = 0;
		$tmpEvent = array();
		foreach ($fileContents as $eventIndex => &$eventData) {
			$tmpEvent = wctEvent::fromJson($eventData);
			if ($eventId != '') {
				if ($eventId == $eventData->getId()) {
					// The actual event is found. Update it.
					array_splice($fileContents, $eventIndex, 1);
					break;
				}
			} else {
				$localId = $tmpEvent->getLocalId();
			}
		}
		// Add event if it's a new event
		if ($eventId == '') {
			$eventId = wctEvent::computeBaseId($myEvent->getDateStart()) . ($localId + 1);
			$myEvent->setId($eventId);
		}
		// Replace event
		array_push($fileContents, $myEvent->toCalendarArray(true));
		file_put_contents($saveFile, json_encode($fileContents));
		$result['result'] = 'ok';
		$result['data'] = $myEvent->toCalendarArray();
		break;
	case 'delete':
		// This service must return JSON to page
		header('Content-Type: application/json');
		$result['result'] = 'ok';
		break;
	case 'get':
		// This service must return HTML to page
		header('Content-Type: text/html');
		$isJsonResult = false;
		$myEventId = $_REQUEST['id'];
		$myEvent = wctEvent::fromId($_REQUEST['id']);
		$result = "<p><span data-i18n=\"event.description\"></span>: <span>" . $myEvent->getDescription() . "</span></p>";
		$result .= "<p><span data-i18n=\"event.startdate\" data-date=\"" . $myEvent->getDateStart() . "000\"></span>: <span class=\"date\"></span></p>";
		$result .= "<p><span data-i18n=\"event.enddate\" data-date=\"" . $myEvent->getDateEnd() . "000\"></span>: <span class=\"date\"></span></p>";
		$result .= "<p><span data-i18n=\"event.participants\"></span>:</p>";
		break;
}
if ($isJsonResult) {
	echo json_encode($result);
} else {
	echo ($result);
}
?>