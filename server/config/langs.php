<?php
// Defines the authorized lang codes
$gAuthorizedLang = array("en", "ru", "pl", "de", "fr", "es", "zh", "tr", "cs", /*"th", "vi",*/ "ko");

// Sets the lang code for the user from its preferences
$gLang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
if (!array_search($gLang, $gAuthorizedLang)) {
	// If the lang is not found, default it to english (first in array)
	$gLang = $gAuthorizedLang[0];
}
?>