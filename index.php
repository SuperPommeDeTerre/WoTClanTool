<?php
require_once('./config.php');
?><!doctype html>
<html lang="fr">
<head>
	<title data-i18n-key="app.title">WoT Clan Tool</title>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<link rel="stylesheet" type="text/css" href="./style/default/style.css" media="all" title="Default" />
	<link href="./style/default/favicon.ico" rel="shortcut icon" />
	<link href="./style/default/favicon.png" type="image/x-icon" rel="icon" />
	<!--[if lt IE 9]>
	<script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->
	<script type="text/javascript" src="./js/jquery-2.1.1.min.js"></script>
	<script type="text/javascript" src="./js/jquery-ui-1.10.4.custom.min.js"></script>
	<script type="text/javascript" src="./js/jquery.tablesorter.min.js"></script> 
	<script type="text/javascript" src="./js/URI.js"></script>
	<script type="text/javascript" src="./js/app.js"></script>
</head>
<body>
	<header>
		<aside id="userInfos">
			<p id="identBlock"><a href="#" id="btnLogin" data-i18n-key="action.identification" title="Se connecter avec votre compte Wargaming">Se connecter</a></p>
		</aside>
		<h1><span data-i18n-key="app.title">WoT Clan Tool</span></h1>
		<nav id="menu">
			<ul>
				<li><a href="./tanks/" data-i18n-key="menu.tanks"><span>Chars</span></a></li>
				<li class="sel"><a href="./players/" data-i18n-key="menu.players"><span>Joueurs</span></a></li>
				<li><a href="./events/" data-i18n-key="menu.events"><span>Ev&egrave;nements</span></a></li>
				<li><a href="./stats/" data-i18n-key="menu.stats"><span>Statistiques</span></a></li>
			</ul>
		</nav>
	</header>
	<section id="main">
		<article id="tanksPane">
		</article>
		<article id="playersPane">
			<h1 data-i18n-key="pane.players.title">Liste des membres du clan</h1>
			<table id="clanMembers" class="tablesorter">
				<thead>
					<tr>
						<th>Nom</th>
						<th>R&ocirc;le</th>
						<th>Date d'int&eacute;gration</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
				<tfoot>
					<tr>
						<td colspan="3">Nombre de membres : <span id="clanMembersCount"></span></td>
					</tr>
				</tfoot>
			</table>
			<h1 data-i18n-key="pane.players.details.title">D&eacute;tail d'un membre</h1>
			<table id="memberTanks" class="tablesorter">
				<thead>
					<tr>
						<th>Char</th>
						<th>Tiers</th>
						<th>Type</th>
						<th>Nation</th>
						<th>Nb batailles</th>
						<th>Ma&icirc;trise</th>
						<th>Au garage</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
				<tfoot>
				</tfoot>
			</table>
		</article>
		<article id="eventsPane">
		</article>
		<article id="statsPane">
		</article>
	</section>
	<footer>
		<p><span data-i18n-key="app.version">Version <?php echo($VERSION) ?></span></p>
	</footer>
</body>
</html>