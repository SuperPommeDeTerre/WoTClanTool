<?php
header('Content-Type: text/html');
echo(file_get_contents($_REQUEST['url']));
?>