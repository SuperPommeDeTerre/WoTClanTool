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
		if (!@file_put_contents(CW_CACHE_FILE, json_encode($dataToWrite, true), LOCK_EX)) {
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

/*
$typeselection = '';
if (isset($_POST['typeselection'])) {
	$typeselection = $_POST['typeselection'];
}
$feature = '';
if (isset($_POST['feature'])) {
	$feature = $_POST['feature'];
}
$clanid = '';
if (array_key_exists('clan_id', $_SESSION)) {
	$clanid = $_SESSION['clan_id'];
}
if (isset($_POST['clanid'])) {
	$clanid = $_POST['clanid'];
}

// Traitements
if (isset($typeselection) && $typeselection == "clanproperty" && $clanid != '') {
	$pageidp = $gWG_API_URL . "/wot/globalmap/clanprovinces/?application_id=" . $gWG_APP_ID_CLIENT . "&clan_id=" . $clanid;
	$dataClan = get_page($pageidp);
	$information_clan = json_decode($dataClan, true);
	if (isset($information_clan['data'][$clanid])) {
		$info = array_keys($information_clan['data'][$clanid]);
		$i = 0;
		foreach ($info as $province) {
			$provinceid = $information_clan['data'][$clanid][$province]['province_id'];
			$pageidp2 = "https://cwxstatic-eu.wargaming.net/v25/provinces_geojson/" . $provinceid . ".json";
			$data2 = get_page($pageidp2);
			$data2 = json_decode($data2, true);
			if ($data2['alias'] > ' ') {
				$geom = $data2['geom'];
				$center = $data2['center'];
			}
			$parameter = array(
				'province_id' => $provinceid,
				'geom' => $geom,
				'center' => $center
			);

			$parametres[$i] = $parameter;
			$i++;
		}
	} else {
		$parametres = [];
	}
	$parametretransmis = (json_encode($parametres));
} elseif (isset($typeselection) && $typeselection == "clanbattles" && $clanid != '') {
	$pageidp = "https://eu.wargaming.net/globalmap/game_api/clan/" . $clanid . "/battles";
	$dataClan = get_page($pageidp);
	$information_clan = json_decode($dataClan, true);
	$info = array();
	if ($information_clan != null && $information_clan['planned_battles'] != null) {
		$info = array_keys($information_clan['planned_battles']);
	}
	$i = 0;
	$parametres = array();
	foreach ($info as $province) {
		$provinceid = $information_clan['planned_battles'][$province]['province_id'];
		$province_owner_id = $information_clan['planned_battles'][$province]['province_owner_id'];
		$pageidp2 = "https://cwxstatic-eu.wargaming.net/v25/provinces_geojson/" . $provinceid . ".json";
		$data2 = get_page($pageidp2);
		$data2 = json_decode($data2, true);
		if ($data2['alias'] > ' ') {
			$geom = $data2['geom'];
			$center = $data2['center'];
		}
		$parameter = array(
			'province_id' => $provinceid,
			'geom' => $geom,
			'center' => $center,
			'province_owner_id' => $province_owner_id
		);
		$parametres[$i] = $parameter;
		$i++;
	}
	$parametretransmis = (json_encode($parametres));
} else {
	$parametretransmis = '{"error":"' . $typeselection . $clanid . '"}';
}

// Envoi du retour (on renvoi le tableau $retour encod� en JSON)
header('Content-type: application/json');
echo ($parametretransmis);

// fonction permettant de récuperer le fichier
function get_page($url) {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_HEADER, 0);
	//curl_setopt ($ch, CURLOPT_HTTPHEADER, array('Accept-Language: ru_ru,ru'));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_TIMEOUT, 60);
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HTTPGET, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	$data = curl_exec($ch);
	curl_close($ch);
	return $data;
}
*/
