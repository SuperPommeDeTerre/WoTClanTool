<?php
session_start();

require(dirname(__FILE__) . '/../config.php');

$gLang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
?>