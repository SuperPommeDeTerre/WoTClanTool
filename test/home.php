<?php
session_start();
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
	</head>
	<body id="home">
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

		<!-- Main component for a primary marketing message or call to action -->
		<div class="container-fluid">
			<div class="row">
				<div class="main">
					<h1 class="page-header" id="clansInfosTitle"></h1>
					<h3><a class="btn btn-lg btn-primary btn-material-blue-500" href="#navPlayers" role="button" id="clanTotalPlayers"></a>
						<a class="btn btn-lg btn-primary btn-material-teal-500" href="./garage.php" role="button" id="clanTotalVehicles"></a>
						<a class="btn btn-lg btn-primary btn-material-green-500" href="http://worldoftanks.eu/clanwars/maps/globalmap/" role="button" id="clanTotalProvinces">0 province</a>
						<a class="btn btn-lg btn-primary btn-material-orange-800" href="./events.php" role="button" id="clanTotalEvents">0 &eacute;v&egrave;nement</a>
						<a class="btn btn-lg btn-primary btn-material-grey-500" href="./strats.php" role="button" id="clanTotalStrats">0 strat&eacute;gie</a></h3>
					<div class="row placeholders">
						<div class="col-xs-6 col-sm-3 placeholder">
							<div id="chartTanksTiers" style="height:200px"></div>
							<h4>Chars par tiers</h4>
							<span class="text-muted">Chars du clan par tiers</span>
						</div>
						<div class="col-xs-6 col-sm-3 placeholder">
							<div id="chartTanksType" style="height:200px"></div>
							<h4>Chars par type</h4>
							<span class="text-muted">Chars du clan par type</span>
						</div>
						<div class="col-xs-6 col-sm-3 placeholder">
							<div id="chartBattlesOverall" style="height:200px"></div>
							<h4>Victoires/D&eacute;faites</h4>
							<span class="text-muted">Nombre de victoires/d&eacute;faites global</span>
						</div>
						<div class="col-xs-6 col-sm-3 placeholder">
							<div id="chartBattles" style="height:200px;widh:200px"></div>
							<h4>Victoires/D&eacute;faites</h4>
							<span class="text-muted">Evolutions des victoires/d&eacute;faites</span>
						</div>
					</div>
					<h2 class="sub-header" id="navAgenda">Agenda</h2>
					<div id="clanCalendar"></div>
					<h2 class="sub-header" id="navPlayers">Joueurs</h2>
					<div class="table-responsive">
						<table class="table table-striped" id="tableClanPlayers">
							<thead>
								<tr>
									<th>Joueur</th>
									<th>Position</th>
									<th>Jours dans le clan</th>
								</tr>
							</thead>
							<tbody>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<div id="my-dialog" class="modal fade" tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button class="close" aria-hidden="true" data-dismiss="modal" type="button">×</button>
						<h4 class="modal-title">Dialogue</h4>
					</div>
					<div class="modal-body"></div>
					<div class="modal-footer">
						<button class="btn btn-primary" data-dismiss="modal">Ok</button>
					</div>
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
		<script type="text/javascript" src="./js/raphael-min.js"></script>
		<script type="text/javascript" src="./js/morris.min.js"></script>
		<script type="text/javascript" src="./js/moment-with-locales.min.js"></script>
		<script type="text/javascript" src="./js/fullcalendar.min.js"></script>
		<script type="text/javascript" src='./js/fullcalendar.lang-all.js'></script>
		<script type="text/javascript" src="./js/gcal.js"></script>
		<script type="text/javascript" src="./js/sortable.min.js"></script>
		<script type="text/javascript" src="./js/URI.js"></script>
		<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
		<script type="text/javascript" src="./js/ie10-viewport-bug-workaround.js"></script>
		<script type="text/javascript" src="./js/pages/home.js"></script>
		<script type="text/javascript" src="./js/app.js"></script>
	</body>
</html>