<?php
include "../config.php";
echo("1");
$fields = array(
	'application_id' => $gWG_APP_ID,
	'language' => $gLang,
	'clan_id' => $gCLAN_ID
);
echo("2");
// Création d'une nouvelle ressource cURL
$ch = curl_init();

// Configuration de l'URL et d'autres options
curl_setopt($ch, CURLOPT_URL, $gWG_API_URL . "clan/info/");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);

// Récupération de l'URL et affichage sur le navigateur
curl_exec($ch);

// Fermeture de la session cURL
curl_close($ch);

echo("3");
?>