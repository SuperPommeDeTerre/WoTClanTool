<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

// If the connected user is not an admin, redirect to home page
if (!in_array($_SESSION["account_id"], $gAdmins)) {
	header('Location: index.php');
}

$gPageID = "admin";

require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'header.php');
?>
<style type="text/css">
	#dlgModifyMap .togglebutton label{width:200px}
	#dlgModifyMap .togglebutton label .toggle{float:right}
</style>
<div class="container-fluid">
	<div class="row">
		<div class="main">
			<h1 class="page-header" data-i18n="install.config"></h1>
			<nav class="navbar navbar-material-grey-800 navbar-static-top">
				<div class="container">
					<div class="navbar-header">
						<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-admin-navbar-collapse">
							<span class="sr-only" data-i18n="nav.toggle"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
					</div>
					<div class="collapse navbar-collapse" id="bs-admin-navbar-collapse">
						<button type="button" class="btn btn-info navbar-btn pull-right" id="btnSave"><span class="glyphicon glyphicon-floppy-disk"></span> <span data-i18n="btn.save"></span></button>
						<ul class="nav navbar-nav" role="tablist">
							<li role="presentation" class="active"><a href="#configGeneral" role="tab" aria-controls="configGeneral" data-toggle="tab" data-i18n="install.category.general"></a></li>
							<li role="presentation"><a href="#configClans" role="tab" aria-controls="configClans" data-toggle="tab" data-i18n="install.category.clans"></a></li>
							<li role="presentation"><a href="#configPlayers" role="tab" aria-controls="configPlayers" data-toggle="tab" data-i18n="install.category.players"></a></li>
							<li role="presentation"><a href="#configEvents" role="tab" aria-controls="configEvents" data-toggle="tab" data-i18n="install.category.events"></a></li>
							<li role="presentation"><a href="#configStrats" role="tab" aria-controls="configStrats" data-toggle="tab" data-i18n="install.category.strategies"></a></li>
						</ul>
					</div>
				</div>
			</nav>
			<div class="tab-content">
				<div role="tabpanel" class="tab-pane active" id="configGeneral">
					<h2 data-i18n="install.category.general"></h2>
					<div class="form-group">
						<div class="togglebutton togglebutton-info">
							<label><span data-i18n="install.showads"></span>
								<input type="checkbox" id="showads"<?php echo($gShowAds?' checked="checked"':''); ?> />
							</label>
						</div>
					</div>
					<label data-i18n="install.clusters"></label>
					<div class="form-group">
						<div class="btn-group" data-i18n="[aria-label]install.clusters;" id="btnClusters"><?php
foreach ($gClusters as $clusterId => $clusterProps) {
?>
							<a href="#" class="btn btn-material-grey<?php echo (in_array($clusterId, $gConfig["WG"]["clusters"])?" active":""); ?>" data-cluster="<?php echo($clusterId); ?>" data-i18n="clusters.<?php echo($clusterId); ?>"></a><?php
}
?>
						</div>
					</div>
					<div>
						<label data-i18n="install.clan.restrictions"></label>
						<div id="restrictedClans"><?php
foreach ($gClusters as $clusterId => $clusterProps) {
	if (in_array($clusterId, $gConfig["WG"]["clusters"])) {
		foreach ($gConfig["clans"]["restric_to"][$clusterId] as $clanIndex => $clandId) { ?>
							<div class="alert alert-material-grey alert-dismissible clan cluster<?php echo($clusterId); ?>" role="alert" data-clan-id="<?php echo($clandId); ?>" data-cluster="<?php echo($clusterId); ?>">
								<button type="button" class="close" data-dismiss="alert" data-i18n="[aria-label]btn.close;"><span aria-hidden="true">&times;</span></button>
							</div><?php
		}
	}
}
?>
						</div>
						<button class="btn btn-default" data-i18n="" data-target="#dlgSearchClan" data-toggle="modal" id="btnAddClan"><span class="glyphicon glyphicon-plus"></span></button>
					</div>
					<div>
						<label data-i18n="install.admins"></label>
						<div id="listAdmins"><?php
foreach ($gClusters as $clusterId => $clusterProps) {
	if (in_array($clusterId, $gConfig["WG"]["clusters"])) {
		foreach ($gConfig["app"]["admins"][$clusterId] as $playerIndex => $playerId) { ?>
							<div class="alert alert-material-grey alert-dismissible player cluster<?php echo($clusterId); ?>" role="alert" data-account-id="<?php echo($playerId); ?>" data-cluster="<?php echo($clusterId); ?>"><?php
			if ($playerId != $_SESSION['account_id']) { ?>
								<button type="button" class="close" data-dismiss="alert" data-i18n="[aria-label]btn.close;"><span aria-hidden="true">&times;</span></button><?php
			} ?>
							</div><?php
		}
	}
}
?>
						</div>
						<button class="btn btn-default" data-target="#dlgSearchPlayer" data-toggle="modal" id="btnAddAdmin"><span class="glyphicon glyphicon-plus"></span></button>
					</div>
					<div>
						<label><span data-i18n="install.inactivitythreshold.title"></span> <span class="badge" id="badgeInactivityThreshold" data-i18n="install.inactivitythreshold.value" data-i18n-options="{&quot;count&quot;:14}"></span></label>
						<div id="sliderInactivityThreshold" style="background-color:#4caf50" class="slider shor slider-material-green"></div>
					</div>
				</div>
				<div role="tabpanel" class="tab-pane" id="configClans">
					<h2 data-i18n="install.category.clans"></h2>
				</div>
				<div role="tabpanel" class="tab-pane" id="configPlayers">
					<h2 data-i18n="install.category.players"></h2>
				</div>
				<div role="tabpanel" class="tab-pane" id="configEvents">
					<h2 data-i18n="install.category.events"></h2>
				</div>
				<div role="tabpanel" class="tab-pane" id="configStrats">
					<h2 data-i18n="install.category.strategies"></h2>
					<h3 data-i18n="install.strategies.elements.title"></h3>
					<h3 data-i18n="install.strategies.maps.title"></h3>
					<div id="listMaps" class="container-fluid">
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div id="dlgSearchClan" class="modal fade" tabindex="-1">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button class="close" aria-hidden="true" data-dismiss="modal" type="button" data-i18n="[aria-label]btn.close;">&times;</button>
				<h4 class="modal-title" data-i18n="install.searchclan.title"></h4>
			</div>
			<div class="modal-body" style="padding-top:1em">
				<div class="form-group selCluster">
					<select class="form-control floating-label" data-i18n="[placeholder]install.cluster.title;[data-hint]install.cluster.hint;"><?php
foreach ($gClusters as $clusterId => $clusterProps) {
?>
						<option value="<?php echo($clusterId); ?>" data-i18n="clusters.<?php echo($clusterId); ?>"></option><?php
}
?>
					</select>
				</div>
				<div class="form-group">
					<input type="text" id="txtSearchClan" class="form-control floating-label" data-i18n="[placeholder]install.clan.title;[data-hint]install.clan.hint;" />
				</div>
				<ul id="searchClanResult" class="searchresult">
				</ul>
			</div>
			<div class="modal-footer">
				<button class="btn btn-primary" data-i18n="btn.search" id="btnSearchClan"></button>
			</div>
		</div>
	</div>
</div>
<div id="dlgSearchPlayer" class="modal fade" tabindex="-1">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button class="close" aria-hidden="true" data-dismiss="modal" type="button" data-i18n="[aria-label]btn.close;">&times;</button>
				<h4 class="modal-title" data-i18n="install.searchplayer.title"></h4>
			</div>
			<div class="modal-body" style="padding-top:1em">
				<div class="form-group selCluster">
					<select class="form-control floating-label" data-i18n="[placeholder]install.cluster.title;[data-hint]install.cluster.hint;"><?php
foreach ($gClusters as $clusterId => $clusterProps) {
?>
						<option value="<?php echo($clusterId); ?>" data-i18n="clusters.<?php echo($clusterId); ?>"></option><?php
}
?>
					</select>
				</div>
				<div class="form-group">
					<input type="text" id="txtSearchPlayer" class="form-control floating-label" data-i18n="[placeholder]install.player.title;[data-hint]install.player.hint;" />
				</div>
				<ul id="searchPlayerResult" class="searchresult">
				</ul>
			</div>
			<div class="modal-footer">
				<button class="btn btn-primary" data-i18n="btn.search" id="btnSearchPlayer"></button>
			</div>
		</div>
	</div>
</div>
<div id="dlgModifyMap" class="modal fade" tabindex="-1">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<button class="close" aria-hidden="true" data-dismiss="modal" type="button" data-i18n="[aria-label]btn.close;">&times;</button>
				<h4 class="modal-title"></h4>
			</div>
			<div class="modal-body">
				<form class="form-inline">
					<div role="tabpanel">
						<ul class="nav nav-pills" role="tablist">
							<li role="presentation" class="active"><a href="#mapGeneral" aria-controls="mapGeneral" role="tab" data-toggle="tab" data-i18n="install.category.general"></a></li>
							<li role="presentation" class="disabled"><a href="#mapModeStandard" aria-controls="mapModeStandard" role="tab" data-toggle="tab" data-i18n="strat.modes.standard"></a></li>
							<li role="presentation" class="disabled"><a href="#mapModeEncounter" aria-controls="mapModeEncounter" role="tab" data-toggle="tab" data-i18n="strat.modes.encounter"></a></li>
							<li role="presentation" class="disabled"><a href="#mapModeAssault" aria-controls="mapModeAssault" role="tab" data-toggle="tab" data-i18n="strat.modes.assault"></a></li>
							<li role="presentation" class="disabled"><a href="#mapModeConfrontation" aria-controls="mapModeConfrontation" role="tab" data-toggle="tab" data-i18n="strat.modes.confrontation"></a></li>
						</ul>
						<div class="tab-content" style="margin-top:1em">
							<div role="tabpanel" class="tab-pane fade in active" id="mapGeneral">
								<h4 data-i18n="install.strategies.maps.size"></h4>
								<div class="form-group">
									<label class="sr-only" for="mapSizeX" data-i18n="install.strategies.maps.props.sizex.title"></label>
									<div class="input-group">
										<div class="input-group-addon"><span class="glyphicon glyphicon-resize-horizontal"></span></div>
										<input class="form-control floating-label" data-i18n="[data-hint]install.strategies.maps.props.sizex.hint;[placeholder]install.strategies.maps.props.sizex.title;" id="mapSizeX" type="number" />
									</div>
									<label class="sr-only" for="mapSizeY" data-i18n="install.strategies.maps.props.sizey.title"></label>
									<div class="input-group">
										<div class="input-group-addon"><span class="glyphicon glyphicon-resize-vertical"></span></div>
										<input class="form-control floating-label" data-i18n="[data-hint]install.strategies.maps.props.sizey.hint;[placeholder]install.strategies.maps.props.sizey.title;" id="mapSizeY" type="number" />
									</div>
								</div>
								<div class="clearfix" style="margin-top:1em"></div>
								<h4 data-i18n="strat.modes.title"></h4>
								<div class="form-group">
									<div class="togglebutton">
										<label style="width:200px;"><span data-i18n="strat.modes.standard"></span> <input id="gameModeStandard" type="checkbox" /></label>
									</div>
									<div class="togglebutton">
										<label style="width:200px;"><span data-i18n="strat.modes.encounter"></span> <input id="gameModeEncounter" type="checkbox" /></label>
									</div>
									<div class="togglebutton">
										<label style="width:200px;"><span data-i18n="strat.modes.assault"></span> <input id="gameModeAssault" type="checkbox" /></label>
									</div>
									<div class="togglebutton">
										<label style="width:200px;"><span data-i18n="strat.modes.confrontation"></span> <input id="gameModeConfrontation" type="checkbox" /></label>
									</div>
								</div>
							</div>
							<div role="tabpanel" class="tab-pane fade" id="mapModeStandard">
								<h4 data-i18n="install.strategies.maps.props.teams.0"></h4>
								<div class="neutral">
								</div>
								<button class="btn btn-default btnAddSpawnPoint"><span class="glyphicon glyphicon-plus"></span></button>
								<h4 data-i18n="install.strategies.maps.props.teams.1"></h4>
								<div class="allies">
								</div>
								<button class="btn btn-default btnAddSpawnPoint"><span class="glyphicon glyphicon-plus"></span></button>
								<h4 data-i18n="install.strategies.maps.props.teams.2"></h4>
								<div class="enemies">
								</div>
								<button class="btn btn-default btnAddSpawnPoint"><span class="glyphicon glyphicon-plus"></span></button>
							</div>
							<div role="tabpanel" class="tab-pane fade" id="mapModeEncounter">
								<h4 data-i18n="install.strategies.maps.props.teams.0"></h4>
								<div class="neutral">
								</div>
								<button class="btn btn-default btnAddSpawnPoint"><span class="glyphicon glyphicon-plus"></span></button>
								<h4 data-i18n="install.strategies.maps.props.teams.1"></h4>
								<div class="allies">
								</div>
								<button class="btn btn-default btnAddSpawnPoint"><span class="glyphicon glyphicon-plus"></span></button>
								<h4 data-i18n="install.strategies.maps.props.teams.2"></h4>
								<div class="enemies">
								</div>
								<button class="btn btn-default btnAddSpawnPoint"><span class="glyphicon glyphicon-plus"></span></button>
							</div>
							<div role="tabpanel" class="tab-pane fade" id="mapModeAssault">
								<h4 data-i18n="install.strategies.maps.props.teams.0"></h4>
								<div class="neutral">
								</div>
								<button class="btn btn-default btnAddSpawnPoint"><span class="glyphicon glyphicon-plus"></span></button>
								<h4 data-i18n="install.strategies.maps.props.teams.1"></h4>
								<div class="allies">
								</div>
								<button class="btn btn-default btnAddSpawnPoint"><span class="glyphicon glyphicon-plus"></span></button>
								<h4 data-i18n="install.strategies.maps.props.teams.2"></h4>
								<div class="enemies">
								</div>
								<button class="btn btn-default btnAddSpawnPoint"><span class="glyphicon glyphicon-plus"></span></button>
							</div>
							<div role="tabpanel" class="tab-pane fade" id="mapModeConfrontation">
								<h4 data-i18n="install.strategies.maps.props.teams.0"></h4>
								<div class="neutral">
								</div>
								<button class="btn btn-default btnAddSpawnPoint"><span class="glyphicon glyphicon-plus"></span></button>
								<h4 data-i18n="install.strategies.maps.props.teams.1"></h4>
								<div class="allies">
								</div>
								<button class="btn btn-default btnAddSpawnPoint"><span class="glyphicon glyphicon-plus"></span></button>
								<h4 data-i18n="install.strategies.maps.props.teams.2"></h4>
								<div class="enemies">
								</div>
								<button class="btn btn-default btnAddSpawnPoint"><span class="glyphicon glyphicon-plus"></span></button>
							</div>
						</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button class="btn btn-default" data-i18n="btn.cancel" id="btnCancel" data-dismiss="modal"></button>
				<button class="btn btn-primary" data-i18n="btn.modify" id="btnModifyMap"></button>
			</div>
		</div>
	</div>
</div>
<?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>