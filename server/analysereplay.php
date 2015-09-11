<?php
foreach ($_FILES["wotreplay"]["error"] as $key => $error) {
	if ($error == UPLOAD_ERR_OK) {
		$tmp_name = $_FILES["wotreplay"]["tmp_name"][$key];
		$name = $_FILES["wotreplay"]["name"][$key];
		move_uploaded_file($tmp_name, "data/$name");
	}
}
header('Content-Type: application/json');
//echo(file_get_contents($_REQUEST['url']));
$handle = fopen("C:/14313447533725_usa_T20_ensk.wotreplay", "r");
// Skip first 8 bytes
$contents = fread($handle, 8);
$chunkLength = unpack("V", fread($handle, 4));
// Read meta informations
$metaInfos = fread($handle, $chunkLength[1]);
// Read match results
$chunkLength =  unpack("V", fread($handle, 4));
$matchResults = fread($handle, $chunkLength[1]);
fclose($handle);
?>{"metaInfos":<?php echo($metaInfos); ?>,"battleResults":<?php echo($matchResults); ?>}