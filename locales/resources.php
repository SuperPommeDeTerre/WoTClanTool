<?php
header('Content-Type: application/json');

$langs = explode(' ', $_REQUEST['lng']);

$response = array();
switch ($_REQUEST['a']) {
	case 'get':
		foreach($langs as $langIndex => $langVal) {
			$i18nFile = dirname(__FILE__) . DIRECTORY_SEPARATOR . $langVal . DIRECTORY_SEPARATOR . 'translation.json';
			if (file_exists($i18nFile)) {
				$response[$langVal] = json_decode(file_get_contents($i18nFile), true);
			} else {
				$response[$langVal] = array();
			}
		}
		break;
	case 'change':
		break;
	case 'remove':
		break;
}
echo json_encode($response);
?>