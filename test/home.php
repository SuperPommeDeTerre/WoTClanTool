<?php
include("./config.php");

$gPageID = "home";

include("./themes/default/header.php");
?>
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
<?php
include("./themes/default/footer.php");
?>