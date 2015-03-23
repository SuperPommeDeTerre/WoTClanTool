<?php
require(dirname(__FILE__) . '/server/global.php');

$gPageID = "home";

include(dirname(__FILE__) . '/themes/' . $gThemeName . '/header.php');
?>
<!-- Main component for a primary marketing message or call to action -->
<div class="container-fluid">
	<div class="row">
		<div class="main">
			<h1 class="page-header" id="clansInfosTitle"></h1>
			<h3><a class="btn btn-lg btn-primary btn-material-blue-500" href="#navPlayers" role="button" id="clanTotalPlayers"></a>
				<a class="btn btn-lg btn-primary btn-material-teal-500" href="./garage.php" role="button" id="clanTotalVehicles"></a>
				<a class="btn btn-lg btn-primary btn-material-green-500" href="http://worldoftanks.eu/clanwars/maps/globalmap/" role="button" id="clanTotalProvinces"></a>
				<a class="btn btn-lg btn-primary btn-material-orange-800" href="./events.php" role="button" id="clanTotalEvents"></a>
				<a class="btn btn-lg btn-primary btn-material-grey-500" href="./strats.php" role="button" id="clanTotalStrats"></a></h3>
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
			<h2 class="sub-header" id="navAgenda" data-i18n="elems.calendar"></h2>
			<div class="container-fuild">
				<div class="row">
					<div class="col-md-7">
						<div id="clanCalendar"></div>
					</div>
					<div class="col-md-5">
						<h3 id="agendaTitle"></h3>
						<div class="form-inline">
							<div class="btn-group btn-group-agenda">
								<button class="btn btn-primary" data-calendar-nav="prev" data-i18n="action.calendar.previous"></button>
								<button class="btn" data-calendar-nav="today" data-i18n="action.calendar.today"></button>
								<button class="btn btn-primary" data-calendar-nav="next" data-i18n="action.calendar.next"></button>
							</div>
							<div class="btn-group btn-group-agenda">
								<button class="btn btn-warning" data-calendar-view="year" data-i18n="action.calendar.view.year"></button>
								<button class="btn btn-warning active" data-calendar-view="month" data-i18n="action.calendar.view.month"></button>
								<button class="btn btn-warning" data-calendar-view="week" data-i18n="action.calendar.view.week"></button>
								<button class="btn btn-warning" data-calendar-view="day" data-i18n="action.calendar.view.day"></button>
							</div>
						</div>
						<h3 id="agendaTitleTody" data-i18n="action.calendar.today"></h3>
						<h4><span class="label label-default">20:00</span> Clan War</h4>
						<p>Description de l'évènement</p>
						<h5 data-i18n="action.calendar.prop.participants"></p>
					</div>
				</div>
			</div>
			<h2 class="sub-header" id="navPlayers">Joueurs</h2>
			<div class="table-responsive">
				<table class="table table-hover header-fixed" id="tableClanPlayers">
					<thead>
						<tr>
							<th>Joueur</th>
							<th data-sorted="true" data-sorted-direction="descending">Position</th>
							<th>Jours dans le clan</th>
							<th>Nombre de batailles</th>
							<th>Cote personnelle</th>
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
				<h4 class="modal-title"></h4>
			</div>
			<div class="modal-body"></div>
			<div class="modal-footer">
				<button class="btn btn-primary" data-dismiss="modal" data-i18n="btn.ok"></button>
			</div>
		</div>
	</div>
</div>
<?php
include(dirname(__FILE__) . '/themes/' . $gThemeName . '/footer.php');
?>