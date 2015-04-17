<?php
// Clusters definition
$gClusters = array(
	"EU"	=> array("url" => "https://api.worldoftanks.eu/",		"key" => "e6ecba5f5af3a16603e38f3b40b1a84e"),
	"RU"	=> array("url" => "https://api.worldoftanks.ru/",		"key" => "09593f389cc88f0d270ef6e35c0bcd3f"),
	"NA"	=> array("url" => "https://api.worldoftanks.com/",		"key" => "c9439de189fc787041c215d2a9b2ecb9"),
	"ASIA"	=> array("url" => "https://api.worldoftanks.asia/",	"key" => "eb10c43e770620cf9b276f4f305bd4ab")
	//,
	// No key for Korea, because I can't found a way to create an account (don't speak Korean...)
	//"KR"	=> array("url" => "https://api.worldoftanks.kr/",		"key" => "")
);
// Defines the default cluster
$gDefaultCluster = "EU";
?>