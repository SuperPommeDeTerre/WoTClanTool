<?php
include("./config.php");
?><!DOCTYPE html>
<html lang="fr">
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="description" data-i18n="app.description" content="Outil de gestion de clan pour World of Tanks" />
		<meta name="author" content="J&eacute;r&eacute;mie Langlade" />
		<link rel="icon" href="./style/default/favicon.ico" />
		<link href="./style/default/favicon.png" type="image/x-icon" rel="icon" />
		<title data-i18n="app.name">WoT Clan Tool</title>
		<!-- CSS -->
		<link href="./style/default/style.css" rel="stylesheet" />
		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
		<script type="text/javascript">
		<!--//--><![CDATA[//><!--
		var gACCESS_TOKEN = '<?php echo($_SESSION["access_token"]); ?>';
		//--><!]]>
		</script>
	</head>
	<body id="unauthorized">
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

		<div class="container-fluid">
			<div class="row">
				<div class="main">
					<h1>Non autorisé !</h1>
					<p>Vous n'êtes pas autorisé à accéder à ce site.</p>
					<p style="text-align:center"><?php echo(SID); ?><a href="#" class="btn btn-lg btn-primary btn-material-grey-500" id="btnLogout" data-i18n="action.logout">Se déconnecter</a></p>
				</div>
			</div>
		</div>
		<!-- Bootstrap core JavaScript
		================================================== -->
		<!-- Placed at the end of the document so the pages load faster -->
		<script type="text/javascript" src="./config.js"></script>
		<script type="text/javascript" src="./js/jquery-2.1.3.min.js"></script>
		<script type="text/javascript" src="./js/i18next-1.8.0.min.js"></script>
		<script type="text/javascript" src="./js/bootstrap.min.js"></script>
		<script type="text/javascript" src="./js/material.min.js"></script>
		<script type="text/javascript" src="./js/ripples.min.js"></script>
		<script type="text/javascript" src="./js/moment-with-locales.min.js"></script>
		<script type="text/javascript" src="./js/URI.js"></script>
		<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
		<script type="text/javascript" src="./js/ie10-viewport-bug-workaround.js"></script>
		<script type="text/javascript" src="./js/pages/unauthorized.js"></script>
	</body>
</html><?php
// End session
session_unset();
?>