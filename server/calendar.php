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
		$dateStart = floor($_REQUEST['from'] / 1000);
		$dateEnd = floor($_REQUEST['to'] / 1000);
		$files = wctEvent::getFilesFromRange($dateStart, $dateEnd);
		$out = array();
		foreach ($files as $eventsFile) {
			$fileContent = json_decode(file_get_contents($eventsFile), true);
			$fileContent = is_array($fileContent) ? $fileContent : array($fileContent);
			foreach ($fileContent as $eventData) {
				$myEvent = wctEvent::fromJson($eventData);
				if ($myEvent->getDateStart() < $dateEnd && $myEvent->getDateEnd() > $dateStart) {
					array_push($out, $myEvent->toCalendarArray());
				}
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
		$myEvent->setOwner($_SESSION['account_id']);
		if ($eventId != '') {
			$myEvent->setId($eventId);
		} else {
			$myEvent->setDateCreation(time());
			$myEvent->setDateModification(time());
		}
		$myEvent->setTitle($_REQUEST['eventTitle']);
		$myEvent->setType($_REQUEST['eventType']);
		if (isset($_REQUEST['eventDescription'])) {
			$myEvent->setDescription($_REQUEST['eventDescription']);
		}
		if (isset($_REQUEST['eventAllowSpare'])) {
			$myEvent->setSpareAllowed($_REQUEST['eventAllowSpare'] == 'true' ? true : false);
		}
		// Dates are passed as UNIX timestamps
		$myEvent->setDateStart(intval($_REQUEST['eventStartDate']));
		if (isset($_REQUEST['eventEndDate'])) {
			$myEvent->setDateEnd(intval($_REQUEST['eventEndDate']));
		}
		// If the start date has changed, verify if the id must be computed again...
		if ($eventId != '') {
			if (wctEvent::computeBaseId($myEvent->getDateStart()) != wctEvent::getBaseIdFromId($eventId)) {
				$saveFile = wctEvent::getFileFromId($eventId);
				$fileContents = json_decode(file_get_contents($saveFile), true);
				$fileContents = is_array($fileContents) ? $fileContents : array($fileContents);
				if (count($fileContents) == 1 && $fileContents[0] == NULL) {
					array_splice($fileContents, 0, 1);
				}
				foreach ($fileContents as $eventIndex => &$eventData) {
					$tmpEvent = wctEvent::fromJson($eventData);
					if ($eventId == $tmpEvent->getId()) {
						// The actual event is found. Update it.
						array_splice($fileContents, $eventIndex, 1);
						break;
					}
				}
				file_put_contents($saveFile, json_encode($fileContents), LOCK_EX);
				$eventId = '';
			}
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
				if ($eventId == $tmpEvent->getId()) {
					// The actual event is found. Update it.
					array_splice($fileContents, $eventIndex, 1);
					break;
				}
			} else {
				$localId = max($localId, $tmpEvent->getLocalId());
			}
		}
		// Add event if it's a new event
		if ($eventId == '') {
			$eventId = wctEvent::computeBaseId($myEvent->getDateStart()) . ($localId + 1);
			$myEvent->setId($eventId);
		}
		// Replace event
		array_push($fileContents, $myEvent->toCalendarArray(true));
		file_put_contents($saveFile, json_encode($fileContents), LOCK_EX);
		$result['result'] = 'ok';
		$result['data'] = $myEvent->toCalendarArray();
		break;
	case 'delete':
		// This service must return JSON to page
		header('Content-Type: application/json');
		if (isset($_REQUEST['eventId'])) {
			$eventId = $_REQUEST['eventId'];
			$myEvent = wctEvent::fromId($eventId);
			if ($myEvent->getOwner() == $_SESSION['account_id']) {
				// The owner is the user. Process with the deletion of event.
				$myEventsFile = wctEvent::getFileFromDate($myEvent->getDateStart());
				$fileContents = json_decode(file_get_contents($myEventsFile), true);
				$fileContents = is_array($fileContents) ? $fileContents : array($fileContents);
				foreach ($fileContents as $eventIndex => $eventData) {
					$tmpEvent = wctEvent::fromJson($eventData);
					if ($eventId == $tmpEvent->getId()) {
						array_splice($fileContents, $eventIndex, 1);
						break;
					}
				}
				file_put_contents($myEventsFile, json_encode($fileContents), LOCK_EX);
			}
		}
		$result['result'] = 'ok';
		break;
	// Enrolment to an event
	case 'enrol':
		// This service must return JSON to page
		header('Content-Type: application/json');
		if (isset($_REQUEST['eventId'])) {
			$eventId = $_REQUEST['eventId'];
			$myEvent = wctEvent::fromId($eventId);
			$myParticipants = $myEvent->getParticipants();
			$myTanks = $myEvent->getTanks();
			$myAttendance = $_REQUEST['attendance'];
			if ($myAttendance == 'no') {
				// If the user don't participate, then remove it
				if (array_key_exists($_SESSION['account_id'], $myParticipants)) {
					unset($myParticipants[$_SESSION['account_id']]);
				}
				if (array_key_exists($_SESSION['account_id'], $myTanks)) {
					unset($myTanks[$_SESSION['account_id']]);
				}
				$myEvent->setParticipants($myParticipants);
				$myEvent->setTanks($myTanks);
			} else {
				$myParticipants[$_SESSION['account_id']] = $myAttendance;
				$myEvent->setParticipants($myParticipants);
			}
			// Perform save...
			$myEventsFile = wctEvent::getFileFromDate($myEvent->getDateStart());
			$fileContents = json_decode(file_get_contents($myEventsFile), true);
			$fileContents = is_array($fileContents) ? $fileContents : array($fileContents);
			foreach ($fileContents as $eventIndex => $eventData) {
				$tmpEvent = wctEvent::fromJson($eventData);
				if ($eventId == $tmpEvent->getId()) {
					// The actual event is found. Update it.
					array_splice($fileContents, $eventIndex, 1);
					break;
				}
			}
			array_push($fileContents, $myEvent->toCalendarArray(true));
			file_put_contents($myEventsFile, json_encode($fileContents), LOCK_EX);
		}
		$result['result'] = 'ok';
		break;
	case 'setparticipanttank':
		// This service must return JSON to page
		header('Content-Type: application/json');
		$isJsonResult = true;
		$result['result'] = 'ok';
		if (isset($_REQUEST['eventId'])) {
			$eventId = $_REQUEST['eventId'];
			$myEvent = wctEvent::fromId($eventId);
			$myTanks = $myEvent->getTanks();
			if (isset($_REQUEST['playerid'])) {
				$playerId = $_REQUEST['playerid'];
				if (isset($_REQUEST['tankid'])) {
					$tankId = $_REQUEST['tankid'];
					$myTanks[$playerId] = $tankId;
					$myEvent->setTanks($myTanks);
					// Perform save...
					$myEventsFile = wctEvent::getFileFromDate($myEvent->getDateStart());
					$fileContents = json_decode(file_get_contents($myEventsFile), true);
					$fileContents = is_array($fileContents) ? $fileContents : array($fileContents);
					foreach ($fileContents as $eventIndex => $eventData) {
						$tmpEvent = wctEvent::fromJson($eventData);
						if ($eventId == $tmpEvent->getId()) {
							// The actual event is found. Update it.
							array_splice($fileContents, $eventIndex, 1);
							break;
						}
					}
					array_push($fileContents, $myEvent->toCalendarArray(true));
					file_put_contents($myEventsFile, json_encode($fileContents), LOCK_EX);
					$result['data'] = $myEvent->toCalendarArray();
				}
			}
		}
		break;
	case 'get':
		// This service must return HTML to page
		header('Content-Type: text/html');
		$result = '';
		$isJsonResult = false;
		$myEventId = $_REQUEST['id'];
		$myEvent = wctEvent::fromId($_REQUEST['id']);
		$result .= '<div id="eventDetails' . $myEvent->getId() . '" class="eventDetails" data-event-id="' . $myEvent->getId() . '" data-owner="' . $myEvent->getOwner() . '" data-event-type="' . $myEvent->getType() . '">';
		$result .= '<div class="eventDetailsDisplay">';
		if ($myEvent->getDateStart() > time()) {
			$result .= '<div class="eventActions pull-right">';
			$userAttendance = "no";
			if (count($myEvent->getParticipants()) > 0 && array_key_exists($_SESSION['account_id'], $myEvent->getParticipants())) {
				$userAttendance = $myEvent->getParticipants()[$_SESSION['account_id']];
			}
			if ($_SESSION['account_id'] == $myEvent->getOwner()) {
				// Add modify / Delete buttons only for owner
				$result .= '<div class="btn-group pull-right" role="group">';
				$result .= '<button type="button" id="btnModifyEvent" class="btn btn-default btn-material-grey-500" data-i18n="[title]action.modify;" data-event-id="' . $myEvent->getId() . '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>';
				$result .= '<button type="button" id="btnDeleteEvent" class="btn btn-default btn-material-grey-500" data-i18n="[title]action.delete;" data-event-id="' . $myEvent->getId() . '"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>';
				$result .= '</div>';
			}
			$result .= '<div class="btn-group pull-right" role="group">';
			$result .= '<button type="button" class="btn btn-default btn-success btnEnrol' . ($userAttendance == 'yes'?' active':'') . '" data-attendance="yes" data-i18n="[title]event.enrol.yes;" data-event-id="' . $myEvent->getId() . '"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';
			$result .= '<button type="button"' . ($myEvent->isSpareAllowed()?'':' style="display:none"') .' class="btn btn-default btn-info btnEnrol' . ($userAttendance == 'spare'?' active':'') . '" data-attendance="spare" data-i18n="[title]event.enrol.spare;" data-event-id="' . $myEvent->getId() . '"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button>';
			$result .= '<button type="button" class="btn btn-default btn-danger btnEnrol' . ($userAttendance == 'no'?' active':'') . '" data-attendance="no" data-i18n="[title]event.enrol.no;" data-event-id="' . $myEvent->getId() . '"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>';
			$result .= '</div>';
			$result .= '<div class="clearfix"></div>';
			$result .= '<p><span data-i18n="event.enrol.state.title"></span>: <span data-i18n="event.enrol.state.' . $userAttendance . '" class="eventEnrolment"></span></p>';
			$result .= '</div>';
		}
		$result .= '<p class="eventDescription">' . $myEvent->getDescription() . '</p>';
		$result .= '<dl>';
		$result .= '<p class="eventStartDate"><span data-i18n="event.startdate" data-date="' . $myEvent->getDateStart() . '000"></span>: <span class="date"></span></p>';
		$result .= '<p class="eventEndDate"><span data-i18n="event.enddate" data-date="' . $myEvent->getDateEnd() . '000"></span>: <span class="date"></span></p>';
		$result .= '</dl>';
		$result .= '<div class="container-fluid">';
		$result .= '<div class="row">';
		$result .= '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">';
		$result .= '<h3 data-i18n="event.participants" data-i18n-options="{&quot;count&quot;:' . count($myEvent->getParticipants()) . '}"></h3>';
		$result .= '<ul class="list-unstyled eventParticipantsList">';
		if (count($myEvent->getParticipants()) > 0) {
			foreach($myEvent->getParticipants() as $playerId => $attendance) {
				$result .= '<li data-player-id="' . $playerId . '" class="attendance-' . $attendance . '">' . $playerId . '</li>';
			}
		} else {
			$result .= '<li data-i18n="event.noparticipant"></li>';
		}
		$result .= '</ul></div>';
		$result .= '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">';
		$result .= '<h3 data-i18n="event.tanks"></h3>';
		$result .= '<ul class="list-unstyled eventLineUp">';
		if (count($myEvent->getParticipants()) > 0) {
			foreach($myEvent->getParticipants() as $playerId => $attendance) {
				if (array_key_exists($playerId, $myEvent->getTanks())) {
					$result .= '<li data-player-id="' . $playerId . '" data-tank-id="' . $myEvent->getTanks()[$playerId] . '">&nbsp;</li>';
				} else {
					$result .= '<li data-player-id="' . $playerId . '" data-i18n="event.notank"></li>';
				}
			}
		} else {
			$result .= '<li data-i18n="event.notank"></li>';
		}
		$result .= '</ul>';
		$result .= '</div>';
		$result .= '</div></div>';
		$result .= '</div>';
		if ($_SESSION['account_id'] == $myEvent->getOwner()) {
			$result .= '<div class="eventDetailsModify">';
			$result .= '</div>';
		}
		break;
}
if ($isJsonResult) {
	echo json_encode($result);
} else {
	echo ($result);
}
?>