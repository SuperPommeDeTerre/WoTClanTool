<?php
// Indique à PHP que nous allons effectivement manipuler du texte UTF-8
//mb_internal_encoding('UTF-8');
 
// indique à PHP que nous allons afficher du texte UTF-8 dans le navigateur web
//mb_http_output('UTF-8');

// Session lifetime (14 days = 14*24*3600 seconds = 1209600)
session_set_cookie_params(1209600);
session_start();

require(dirname(__FILE__) . '/../config.php');

define('WCT_DATA_DIR', dirname(__FILE__) . '/../data/');

$gLang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);

function getUserFile($pUserId) {
	return WCT_DATA_DIR . 'user/' . $pUserId . '.json';
}
?>