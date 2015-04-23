<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageID = "home";

require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'header.php');
?>
<div class="container-fluid">
	<div class="row">
		<div class="main"><?php
include(WCT_INC_DIR . 'ads.php');
?>
			<h1 class="page-header" id="clansInfosTitle"></h1>
			<h3><a class="btn btn-lg btn-primary btn-material-blue-500" href="#navPlayers" role="button" id="clanTotalPlayers"></a>
				<a class="btn btn-lg btn-primary btn-material-teal-500" href="./garage.php" role="button" id="clanTotalVehicles"></a>
				<a class="btn btn-lg btn-primary btn-material-green-500" href="http://worldoftanks.eu/clanwars/maps/globalmap/" role="button" id="clanTotalProvinces"></a>
				<a class="btn btn-lg btn-primary btn-material-orange-800" href="./events.php" role="button" id="clanTotalEvents"></a>
				<a class="btn btn-lg btn-primary btn-material-grey-500" href="./strats.php" role="button" id="clanTotalStrats"></a></h3>
			<div class="row placeholders">
				<div class="col-xs-6 col-sm-3 placeholder">
					<div id="chartTanksTiers" style="height:200px"></div>
					<h4 data-i18n="stats.global.tanksbylevel"></h4>
					<span class="text-muted" data-i18n="stats.global.tanksbyleveldescription"></span>
				</div>
				<div class="col-xs-6 col-sm-3 placeholder">
					<div id="chartTanksType" style="height:200px"></div>
					<h4 data-i18n="stats.global.tanksbytype"></h4>
					<span class="text-muted" data-i18n="stats.global.tanksbytypedescription"></span>
				</div>
				<div class="col-xs-6 col-sm-3 placeholder">
					<div id="chartBattlesOverall" style="height:200px"></div>
					<h4 data-i18n="stats.global.winratio"></h4>
					<span class="text-muted" data-i18n="stats.global.winratiodescription"></span>
				</div>
				<div class="col-xs-6 col-sm-3 placeholder">
					<div id="chartBattles" style="height:200px;widh:200px"></div>
					<h4 data-i18n="stats.global.battles"></h4>
					<span class="text-muted" data-i18n="stats.global.battlesdescription"></span>
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
							</div>
						</div>
						<h3 id="agendaTitleTody" data-i18n="action.calendar.today"></h3>
						<h4><span class="label label-default">20:00</span> Clan War</h4>
						<p>Description de l'&eacute;v&egrave;nement</p>
						<h5 data-i18n="action.calendar.prop.participants"></p>
					</div>
				</div>
			</div>
			<h2 class="sub-header" id="navPlayers" data-i18n="elems.players"></h2>
			<div class="table-responsive">
				<table class="table table-hover header-fixed" id="tableClanPlayers">
					<thead>
						<tr>
							<th data-i18n="player.headers.nickname"></th>
							<th data-i18n="player.headers.role" data-sorted="true" data-sorted-direction="descending"></th>
							<th data-i18n="player.headers.daysinclan"></th>
							<th data-i18n="player.headers.battles"></th>
							<th data-i18n="player.headers.personal_rating"></th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="events-modal">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h3></h3>
			</div>
			<div class="modal-body" style="height: 400px">
			</div>
			<div class="modal-footer">
				<a href="#" data-dismiss="modal" class="btn" data-i18n="btn.close"></a>
			</div>
		</div>
	</div>
</div>
<div id="my-dialog" class="modal fade" tabindex="-1">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button class="close" aria-hidden="true" data-dismiss="modal" type="button">&times;</button>
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
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>