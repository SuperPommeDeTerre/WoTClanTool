<?php
// Calendar service
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'global.php');

require(WCT_SERVER_DIR . DIRECTORY_SEPARATOR . 'classes' . DIRECTORY_SEPARATOR . 'wct.event.inc');

$baseDataDir = WCT_DATA_DIR;
$isReadOnly = false;
if (array_key_exists("cluster", $_REQUEST)) {
	if (array_key_exists($_REQUEST["cluster"], $gClusters)) {
		$isReadOnly = true;
		$baseDataDir = WCT_BASE_DATA_DIR . DIRECTORY_SEPARATOR . $_REQUEST["cluster"] . DIRECTORY_SEPARATOR;
	}
}

if (array_key_exists("clanid", $_REQUEST)) {
	$isReadOnly = true;
	define('WCT_BASE_EVENT_DIR', WCT_DATA_DIR . 'clan' . DIRECTORY_SEPARATOR . $_REQUEST['clanid'] . DIRECTORY_SEPARATOR . 'events');
} else {
	define('WCT_BASE_EVENT_DIR', WCT_DATA_DIR . 'clan' . DIRECTORY_SEPARATOR . $_SESSION['clan_id'] . DIRECTORY_SEPARATOR . 'events');
}
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
		if (isset($_REQUEST['eventMapName'])) {
			$myEvent->setMapName($_REQUEST['eventMapName']);
		}
		if (isset($_REQUEST['eventStrategyId'])) {
			$myEvent->setStrategyId($_REQUEST['eventStrategyId']);
		}
		if (isset($_REQUEST['eventIsRecurrent'])) {
			$myEvent->setRecurrent($_REQUEST['eventIsRecurrent'] == 'true' ? true : false);
		}
		if (isset($_REQUEST['eventRecurrencyDay'])) {
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
		if (!$isReadOnly) {
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
			} else {
				$result .= '<div class="pull-right">';
				$result .= '<a href="#" class="button btn btn-default" id="btnAddReplay" data-i18n="[title]event.addreplay;" data-event-id="' . $myEvent->getId() . '"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>';
				$result .= '</div>';
				$result .= '<div class="clearfix"></div>';
			}
		}
		$result .= '<p class="eventDescription">' . $myEvent->getDescription() . '</p>';
		$result .= '<div class="eventMap">';
		$result .= '<img src="" alt="" class="img-thumbnail pull-left" id="eventMapThumb" data-map="' . $myEvent->getMapName() . '" width="120" />';
		$result .= '<h4></h4>';
		$result .= '<p class="eventMapSize"></p>';
		$result .= '<p class="eventMapType"></p>';
		if (!$isReadOnly) {
			$result .= '<p class="eventStrategy" data-stratid="' . $myEvent->getStrategyId() . '"><a href="./strats/show/id=' . $myEvent->getStrategyId() . '"></a></p>';
		}
		$result .= '</div>';
		$result .= '<div class="clearfix"></div>';
		$result .= '<div class="table-responsive eventParticipantsContainer">';
		if (!$isReadOnly) {
			$result .= '<table class="table table-hover header-fixed eventParticipantsList">';
			$result .= '<thead>';
			$result .= '<tr><th data-i18n="event.participants" data-i18n-options="{&quot;count&quot;:' . count($myEvent->getParticipants()) . '}" style="width:50%"></th>';
			$result .= '<th data-i18n="event.tanks" class="eventLineUp"></th>';
			if ($myEvent->getDateStart() < time()) {
				$result .= '<th class="eventParticipation" data-i18n="action.calendar.prop.present"></th>';
				$result .= '<th class="eventReplays" data-i18n="event.replay"></th>';
			}
			$result .= '</tr>';
			$result .= '</thead>';
			$result .= '<tbody>';
			$result .= '<tr class="noparticipant"><td colspan="2" class="participant" data-i18n="event.noparticipant"></td></tr>';
			if (count($myEvent->getParticipants()) > 0) {
				foreach($myEvent->getParticipants() as $playerId => $attendance) {
					$result .= '<tr data-player-id="' . $playerId . '"><td class="participant attendance-' . $attendance . '">' . $playerId . '</td>';
					if (array_key_exists($playerId, $myEvent->getTanks())) {
						$result .= '<td class="tank" data-tank-id="' . $myEvent->getTanks()[$playerId] . '">&nbsp;</td>';
					} else {
						$result .= '<td class="tank" data-i18n="event.notank"></td>';
					}
					if ($myEvent->getDateStart() < time()) {
						$result .= '<td><div class="checkbox" style="margin-top:-5px;margin-bottom:-10px"><label><input type="checkbox" id="eventPlayerPresent' . $playerId . '" value="true" />&nbsp;</label></div></td>';
						$result .= '<td>&nbsp;</td>';
					}
					$result .= '</tr>';
				}
			}
			$result .= '</tbody>';
			$result .= '</table></div>';
		} else {
			$result .= '<h3 data-i18n="event.participants" data-i18n-options="{&quot;count&quot;:' . count($myEvent->getParticipants()) . '}"></h3>';
		}
		$result .= '</div>';
		$result .= '</div>';
		if (!$isReadOnly && $_SESSION['account_id'] == $myEvent->getOwner()) {
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