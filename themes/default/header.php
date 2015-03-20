<!DOCTYPE html>
<html lang="<?php echo($gLang); ?>">
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="description" data-i18n="app.description" content="Outil de gestion de clan pour World of Tanks" />
		<meta name="author" content="J&eacute;r&eacute;mie Langlade" />
		<link rel="icon" href="./themes/<?php echo($gThemeName); ?>/style/favicon.ico" />
		<link href="./themes/<?php echo($gThemeName); ?>/style/favicon.png" type="image/x-icon" rel="icon" />
		<title data-i18n="app.name"></title>
		<!-- CSS -->
		<link href="./themes/<?php echo($gThemeName); ?>/style/style.css" rel="stylesheet" />
		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
	</head>
	<body id="<?php echo($gPageID); ?>">
		<div id="progressDialog">
			<div class="progress">
				<div id="progressBar" class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">0 %</div>
			</div>
			<p id="progressInfoMessage">&nbsp;</p>
		</div>
		<div id="content">
			<!-- Static navbar -->
			<nav class="navbar navbar-default navbar-fixed-top navbar-material-grey-700 shadow-z-2">
				<div class="container-fluid">
					<div class="navbar-header">
						<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
							<span class="sr-only" data-i18n="nav.toggle"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
						<a class="navbar-brand" href="./home.php" data-i18n="app.name"></a>
					</div>
					<div id="navbar" class="navbar-collapse collapse">
						<ul class="nav navbar-nav navbar-right">
							<li class="dropdown<?php if ($gPageID == 'my') { echo(' active'); } ?>">
								<a href="./my.php" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span id="playerNickName"><?php echo($_SESSION["nickname"]); ?></span> <span class="caret"></span></a>
								<ul class="dropdown-menu" role="menu">
									<li><a href="./my.php#calendar" data-i18n="nav.my.calendar"></a></li>
									<li><a href="./my.php#garage" data-i18n="nav.my.garage"></a></li>
									<li><a href="./my.php#strats" data-i18n="nav.my.strats"></a></li>
									<li><a href="./my.php#stats" data-i18n="nav.my.stats"></a></li>
									<li class="divider"></li>
									<li><a href="./logout.php" id="linkLogout" data-i18n="action.logout"></a></li>
								</ul>
							</li>
							<li<?php if ($gPageID == 'garage') { echo(' class="active"'); } ?>><a href="garage.php" data-i18n="nav.garage"></a></li>
							<li<?php if ($gPageID == 'events') { echo(' class="active"'); } ?>><a href="events.php" data-i18n="nav.events"></a></li>
							<li class="dropdown<?php if ($gPageID == 'strats') { echo(' active'); } ?>">
								<a href="./strats.php" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span data-i18n="nav.strats.title"></span> <span class="caret"></span></a>
								<ul class="dropdown-menu" role="menu">
									<li><a href="./strats.php#new" data-i18n="nav.strats.new"></a></li>
									<li class="divider"></li>
									<li class="dropdown-header" data-i18n="nav.strats.shared"></li>
									<li><a href="./strats.php#valid" data-i18n="nav.strats.valid"></a></li>
									<li><a href="./strats.php#review" data-i18n="nav.strats.review"></a></li>
								</ul>
							</li>
						</ul>
					</div><!--/.nav-collapse -->
				</div><!--/.container-fluid -->
			</nav>