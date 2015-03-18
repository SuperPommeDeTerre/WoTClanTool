<!DOCTYPE html>
<html lang="<?php echo($gLang); ?>">
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
	</head>
	<body id="<?php echo($gPageID); ?>">
		<!-- Static navbar -->
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
					<ul class="nav navbar-nav navbar-right">
						<li class="active"><a href="./home.php" data-i18n="nav.home">Accueil</a></li>
						<li class="dropdown">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span id="playerNickName"><?php echo($_SESSION["nickname"]) ?></span> <span class="caret"></span></a>
							<ul class="dropdown-menu" role="menu">
								<li><a href="#" data-i18n="nav.my.garage">Mon garage</a></li>
								<li><a href="#" data-i18n="nav.my.strats">Mes strat&eacute;gies</a></li>
								<li><a href="#" data-i18n="nav.my.stats">Mes statistiques</a></li>
							</ul>
						</li>
						<li><a href="garage.php" data-i18n="nav.garage">Garage</a></li>
						<li><a href="#" data-i18n="nav.events">&Eacute;v&egrave;nements</a></li>
						<li class="dropdown">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Strat&eacute;gies <span class="caret"></span></a>
							<ul class="dropdown-menu" role="menu">
								<li><a href="#">Nouvelle</a></li>
								<li><a href="#">Mes strat&eacute;gies</a></li>
								<li class="divider"></li>
								<li class="dropdown-header">Partag&eacute;es</li>
								<li><a href="#">Valid&eacute;es</a></li>
								<li><a href="#">A revoir</a></li>
							</ul>
						</li>
					</ul>
				</div><!--/.nav-collapse -->
			</div><!--/.container-fluid -->
		</nav>