<?php
// Clusters definition
$gClusters = array(
	"EU"	=> array("url" => "https://api.worldoftanks.eu/",   "key" => "e6ecba5f5af3a16603e38f3b40b1a84e", "cwgeojsonbaseurl" => "https://cwxstatic-eu.wargaming.net/v25/provinces_geojson/", "cwapibase" => "https://eu.wargaming.net/"),
	"RU"	=> array("url" => "https://api.worldoftanks.ru/",   "key" => "09593f389cc88f0d270ef6e35c0bcd3f", "cwgeojsonbaseurl" => "https://cwxstatic-ru.wargaming.net/v25/provinces_geojson/", "cwapibase" => "https://ru.wargaming.net/"),
	"NA"	=> array("url" => "https://api.worldoftanks.com/",  "key" => "c9439de189fc787041c215d2a9b2ecb9", "cwgeojsonbaseurl" => "https://cwxstatic-na.wargaming.net/v25/provinces_geojson/", "cwapibase" => "https://na.wargaming.net/"),
	"ASIA"	=> array("url" => "https://api.worldoftanks.asia/", "key" => "eb10c43e770620cf9b276f4f305bd4ab", "cwgeojsonbaseurl" => "https://cwxstatic-asia.wargaming.net/v25/provinces_geojson/", "cwapibase" => "https://asia.wargaming.net/")
	//,
	// No key for Korea, because I can't found a way to create an account (don't speak Korean...)
	//"KR"	=> array("url" => "https://api.worldoftanks.kr/",		"key" => "")
);
// Defines the default cluster
$gDefaultCluster = "EU";

// Defines more API keys
// Twicth
$gTwitchAPIKey = "f48qj4dfi3k138rijzzlgezhrqzcqo";
?>