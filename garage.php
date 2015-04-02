<?php
require(dirname(__FILE__) . '/server/global.php');

$gPageID = "garage";

require(dirname(__FILE__) . '/themes/' . $gThemeName . '/header.php');
?>
<div class="container-fluid">
	<div class="row">
		<div class="page-header">
			<h1 data-i18n="nav.garage"></h1>
		</div>
		<fieldset>
			<legend><a href="#" id="linkFilter"><span class="glyphicon glyphicon-filter" aria-hidden="true"></span> <span data-i18n="action.filter"></span></a></legend>
			<div style="display:none">
				<div class="container-fluid">
					<div class="row">
						<div class="col-md-8">
							<label data-i18n="filter.tank.level"></label>
							<div class="btn-group" role="group" id="btnsFilterTankLevel">
								<button type="button" class="btn btn-material-grey" value="1" data-i18n="tank.level.0"></button>
								<button type="button" class="btn btn-material-grey" value="2" data-i18n="tank.level.1"></button>
								<button type="button" class="btn btn-material-grey" value="3" data-i18n="tank.level.2"></button>
								<button type="button" class="btn btn-material-grey" value="4" data-i18n="tank.level.3"></button>
								<button type="button" class="btn btn-material-grey" value="5" data-i18n="tank.level.4"></button>
								<button type="button" class="btn btn-material-grey" value="6" data-i18n="tank.level.5"></button>
								<button type="button" class="btn btn-material-grey" value="7" data-i18n="tank.level.6"></button>
								<button type="button" class="btn btn-material-grey" value="8" data-i18n="tank.level.7"></button>
								<button type="button" class="btn btn-material-grey" value="9" data-i18n="tank.level.8"></button>
								<button type="button" class="btn btn-material-grey" value="10" data-i18n="tank.level.9"></button>
							</div>
						</div>
						<div class="col-md-4">
							<label data-i18n="filter.tank.type"></label>
							<div class="btn-group" role="group" id="btnsFilterTankType">
								<button type="button" class="btn btn-material-grey" value="lightTank"><img src="./themes/<?php echo($gThemeName); ?>/style/images/type-lightTank.png" data-i18n="[title]tank.type.lightTank;[alt]tank.type.lightTank;" /></button>
								<button type="button" class="btn btn-material-grey" value="mediumTank"><img src="./themes/<?php echo($gThemeName); ?>/style/images/type-mediumTank.png" data-i18n="[title]tank.type.mediumTank;[alt]tank.type.mediumTank;" /></button>
								<button type="button" class="btn btn-material-grey" value="heavyTank"><img src="./themes/<?php echo($gThemeName); ?>/style/images/type-heavyTank.png" data-i18n="[title]tank.type.heavyTank;[alt]tank.type.heavyTank;" /></button>
								<button type="button" class="btn btn-material-grey" value="AT-SPG"><img src="./themes/<?php echo($gThemeName); ?>/style/images/type-AT-SPG.png" data-i18n="[title]tank.type.AT-SPG;[alt]tank.type.AT-SPG;" /></button>
								<button type="button" class="btn btn-material-grey" value="SPG"><img src="./themes/<?php echo($gThemeName); ?>/style/images/type-SPG.png" data-i18n="[title]tank.type.SPG;[alt]tank.type.SPG;" /></button>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<label for="" data-i18n="filter.tank.owner"></label>
							<ul class="nav nav-pills nav-pills-material-grey" id="pillsIGN">
							</ul>
						</div>
					</div>
				</div>
			</div>
		</fieldset>
		<div class="table-responsive" id="myTanksContainerTable">
			<table class="table table-hover header-fixed tableTanks" id="tableMyTanks">
				<thead>
					<tr>
						<th class="tankcontour" data-sortable="false">&nbsp;</th>
						<th class="tankname" data-i18n="tank.infos.name"></th>
						<th class="tanknation" data-i18n="tank.infos.nation"></th>
						<th class="tanktiers" data-sorted="true" data-sorted-direction="descending" data-i18n="tank.infos.level"></th>
						<th class="tanktype" data-i18n="tank.infos.type"></th>
						<th class="tankowners" data-sortable="false" data-i18n="tank.stats.owners"></th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</div>
</div>
<?php
require(dirname(__FILE__) . '/themes/' . $gThemeName . '/footer.php');
?>