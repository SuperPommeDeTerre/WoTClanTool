<?php
// Session lifetime (14 days = 14*24*3600 seconds = 1209600)
session_set_cookie_params(1209600);

session_start();

require(dirname(__FILE__) . '/../config.php');

$gLang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
?>