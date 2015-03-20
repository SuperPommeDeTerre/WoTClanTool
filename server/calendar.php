<?php
// Calendar service
require(dirname(__FILE__) . '/global.php');

require(dirname(__FILE__) . '/classes/event.inc');

// This service must return JSON to page
header('Content-Type: application/json');

// Switch between requested action
$result = array();
switch ($_REQUEST['a']) {
	case 'list':
		$out = array();
		for($i=1; $i<=16; $i++){   //from day 01 to day 15
			$date = date('Y-m-d', strtotime("+".$i." days"));
			$data = new Event();
			$data->setId($i);
			$data->setDateStart(strtotime(date('Y-m-d', strtotime("+".$i." days"))) + (12*3600));
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
				$data->setType('historical');
			} else if ($i < 16) {
				$data->setType('other');
				$data->setTitle('Autre '.$i);
				$data->setDescription('Autre description '.$i);
			}
			$out[] = $data->toCalendarArray();
		}
		echo json_encode(array('success' => 1, 'result' => $out));
		exit;
		break;
	case 'add':
		// Parse event frm request
		$myEvent = array();
		$myEvent['title'] = $_REQUEST['eventTitle'];
		$myEvent['type'] = $_REQUEST['eventType'];
		if (isset($_REQUEST['eventDescription'])) {
			$myEvent['description'] = $_REQUEST['eventDescription'];
		}
		if (isset($_REQUEST['eventStartDate'])) {
			$myEvent['start'] = $_REQUEST['eventStartDate'];
		}
		if (isset($_REQUEST['eventEndDate'])) {
			$myEvent['end'] = $_REQUEST['eventEndDate'];
		}
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
		$result['result'] = 'ok';
		break;
	case 'modify':
		$result['result'] = 'ok';
		if (isset($_REQUEST['eventId'])) {
			$myEventId = $_REQUEST['eventId'];
		} else {
			$result['result'] = 'error';
			$result['code'] = 'error.idrequired';
		}
		break;
	case 'delete':
		break;
}
echo json_encode($result);
?>