<?php
// Clan wars service
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'global.php');

set_time_limit(10000);

// This service must return JSON to page
header('Content-Type: application/json');

// Initialize result
$result = [
		'status' => 'ok'
	];

// Do specified action
switch ($_REQUEST['a']) {
	case 'updatecwmap':
		// Update clan wars map geometry
		$dataToWrite = json_decode($_REQUEST['data'], true);
		$dataToWrite = is_array($dataToWrite) ? $dataToWrite : array($dataToWrite);
		if (!@file_put_contents(CW_CACHE_FILE, json_encode($dataToWrite), LOCK_EX)) {
			$result["status"] = "error";
			$result["message"] = "error.configfilewrite";
			$result['cwinfos'] = $configToWrite;
		}
		break;
	case 'getcwmap':
		if (!file_exists(CW_CACHE_FILE)) {
			$result['status'] = 'error';
			$result['message'] = 'error.missingcwmap';
		} else {
			$lCWInfos = json_decode(file_get_contents(CW_CACHE_FILE), true);
			is_array($lCWInfos) ? $lCWInfos : array($lCWInfos);
			$result['data'] = $lCWInfos;
		}
		break;
	default:
		$result['status'] = 'error';
		$result['message'] = 'error.unknownaction';
		break;
}

echo json_encode($result);
