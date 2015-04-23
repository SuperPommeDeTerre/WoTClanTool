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
		}
		/*
		for($i=1; $i<=13; $i++){   //from day 01 to day 15
			$date = date('Y-m-d', strtotime("+".$i." days"));
			$data = new wctEvent();
			$data->setId($i);
			$data->setDateStart(strtotime(date('Y-m-d', strtotime("+" . $i . " days"))) + (12*3600));
			$data->setDateEnd($data->getDateStart() + 7200);
			if ($i < 2) {
				$data->setType('compa');
				$data->setTitle('Compagnie '.$i);
				$data->setDescription('Compagnie description '.$i);
			} else if ($i < 6) {
				$data->setType('clanwar');
				$data->setTitle('Clan War '.$i);
				$data->setDescription('Clan War description '.$i);
			} else if ($i < 8) {
				$data->setType('stronghold');
				$data->setTitle('Bastion '.$i);
				$data->setDescription('Bastion description '.$i);
			} else if ($i < 10) {
				$data->setType('training');
				$data->setTitle('Entraînement '.$i);
				$data->setDescription('Entraînement description '.$i);
			} else if ($i < 12) {
				$data->setType('7vs7');
				$data->setTitle('7vs7 '.$i);
				$data->setDescription('7vs7 description '.$i);
			} else if ($i < 14) {
				$data->setType('other');
				$data->setTitle('Autre '.$i);
				$data->setDescription('Autre description '.$i);
			}
			$out[] = $data->toCalendarArray();
		}
		*/
		echo json_encode(array('success' => 1, 'result' => $out));
		exit;
		break;
	case 'add':
		// This service must return JSON to page
		header('Content-Type: application/json');
		// Parse event from request
		$myEvent = new wctEvent();
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
		/*
		if (isset($_REQUEST['eventPrivate'])) {
			$myEvent['private'] = $_REQUEST['eventPrivate'];
		}
		if (isset($_REQUEST['eventPeriodic'])) {
			$myEvent['periodic'] = $_REQUEST['eventPeriodic'];
			$myEvent['periodicity'] = array();
		}
		if (isset($_REQUEST['eventPeriodicityDays'])) {
			$myEvent['periodicity']['days'] = $_REQUEST['eventPeriodicityDays'];
		}
		*/
		$saveFile = wctEvent::getFileFromDate($myEvent->getDateStart());
		$result['result'] = 'ok';
		$result['data'] = $myEvent->toCalendarArray();
		break;
	case 'modify':
		// This service must return JSON to page
		header('Content-Type: application/json');
		$result['result'] = 'ok';
		if (isset($_REQUEST['eventId'])) {
			$myEventId = $_REQUEST['eventId'];
		} else {
			$result['result'] = 'error';
			$result['code'] = 'error.idrequired';
		}
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
		$result = "<p data-i18n=\"\">Contenu de l'évènement " . $myEventId . "</p>";
		break;
}
if ($isJsonResult) {
	echo json_encode($result);
} else {
	echo ($result);
}
?>