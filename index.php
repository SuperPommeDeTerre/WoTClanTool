<?php
require(dirname(__FILE__) . '/server/global.php');

// Get the URI params
if (isset($_REQUEST["access_token"])) {
	$_SESSION["access_token"] = $_REQUEST["access_token"];
	$_SESSION["nickname"] = $_REQUEST["nickname"];
	$_SESSION["account_id"] = $_REQUEST["account_id"];
	$_SESSION["expires_at"] = $_REQUEST["expires_at"];
}
// Handle WG session expiration
$curTime = time();
if (isset($_SESSION["expires_at"]) && $_SESSION["expires_at"] < $curTime) {
	session_unset();
	session_destroy();
	setcookie('PHPSESSID', '', time()-1);
	session_start();
}
// Redirect to home if WG session is active
if (isset($_SESSION["access_token"])) {
	header('Location: home.php');
	exit;
}
?><!DOCTYPE html>
<html lang="fr">
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="description" data-i18n="app.description" content="Outil de gestion de clan pour World of Tanks" />
		<meta name="author" content="J&eacute;r&eacute;mie Langlade &lt;jlanglade@pixbuf.net&gt;" />
		<link rel="icon" href="./themes/<?php echo($gThemeName); ?>/style/favicon.ico" />
		<link href="./themes/<?php echo($gThemeName); ?>/style/favicon.png" type="image/x-icon" rel="icon" />
		<title data-i18n="app.name">WoT Clan Tool</title>
		<!-- CSS -->
		<link href="./themes/<?php echo($gThemeName); ?>/style/style.css" rel="stylesheet" />
		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
	</head>
	<body id="index">
		<nav class="navbar navbar-default navbar-fixed-top navbar-material-grey-700 shadow-z-2">
			<div class="container-fluid">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
						<span class="sr-only" data-i18n="nav.toggle">Basculer navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="./" data-i18n="app.name">WoT Clan Tool</a>
				</div>
				<div id="navbar" class="navbar-collapse collapse">
				</div>
			</div>
		</nav>

		<!-- Main component for a primary marketing message or call to action -->
		<div class="container-fluid">
			<div class="row">
				<div class="main">
					<h1 data-i18n="app.name"></h1>
					<p>Bienvenue sur cet outil de gestion de clan.</p>
					<p>Cet outil vous permettra d'effectuer bon nombre d'op&eacute;rations concernant votre clan de World of Tanks. Notamment&nbsp;:</p>
					<ul>
						<li>Voir les membres</li>
						<li>Voir les chars disponibles</li>
						<li>Définir des évènements et gérer les inscriptions des membres à ceux-ci</li>
						<li>Préparer des stratégies</li>
						<li>etc.</li>
					</ul>
					<p>Pour commencer, veuillez vous connecter avec vos identifiants Wargaming&nbsp;:</p>
					<p style="text-align:center"><a href="#" class="btn btn-lg btn-primary btn-material-grey-500" id="btnLogin" data-i18n="action.identification">Se connecter</a></p>
				</div>
			</div>
			<!--
			<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
				<input type="hidden" name="cmd" value="_s-xclick" />
				<input type="hidden" name="hosted_button_id" value="E8HN2BNZ5HSUA" />
				<input type="image" src="https://www.paypalobjects.com/en_GB/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online." />
				<img alt="" border="0" src="https://www.paypalobjects.com/fr_FR/i/scr/pixel.gif" width="1" height="1" />
			</form>
			-->
		</div>
		<!-- Bootstrap core JavaScript
		================================================== -->
		<!-- Placed at the end of the document so the pages load faster -->
		<script type="text/javascript" src="./server/config.js.php"></script>
		<script type="text/javascript" src="./js/jquery-2.1.3.min.js"></script>
		<script type="text/javascript" src="./js/i18next-1.8.0.min.js"></script>
		<script type="text/javascript" src="./js/bootstrap.min.js"></script>
		<script type="text/javascript" src="./js/material.min.js"></script>
		<script type="text/javascript" src="./js/ripples.min.js"></script>
		<script type="text/javascript" src="./js/moment-with-locales.min.js"></script>
		<script type="text/javascript" src="./js/URI.js"></script>
		<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
		<script type="text/javascript" src="./js/ie10-viewport-bug-workaround.js"></script>
		<script type="text/javascript" src="./js/pages/index.js"></script>
		<script type="text/javascript" src="./js/app.js"></script>
	</body>
</html>