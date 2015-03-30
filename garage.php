<?php
require(dirname(__FILE__) . '/server/global.php');

$gPageID = "garage";

include(dirname(__FILE__) . '/themes/' . $gThemeName . '/header.php');
?>
<div class="container-fluid">
	<div class="row">
		<div class="col-md-9">
			<h1 id="global">Aperçu global</h1>
			<div class="table-responsive" id="myTanksContainerTable">
				<table class="table table-hover header-fixed tableTanks" id="tableMyTanks">
					<thead>
						<tr>
							<th class="tankcontour" data-sortable="false">&nbsp;</th>
							<th class="tankname" data-i18n="tank.infos.name"></th>
							<th class="tanktiers" data-sorted="true" data-sorted-direction="descending" data-i18n="tank.infos.level"></th>
							<th class="tanktype" data-i18n="tank.infos.type"></th>
							<th class="tankownerscount" data-i18n="tank.stats.ownerscount"></th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
			<h1 id="perPlayer">Par joueur</h1>
		</div>
		<div class="col-md-3" role="complementary" id="pageNavbar"	>
			<nav class="bs-docs-sidebar hidden-print hidden-xs hidden-sm" data-spy="affix" data-offset-top="60">
				<ul class="nav bs-docs-sidenav">
					<li><a href="#global">Aperçu global</a></li>
					<li><a href="#perPlayer">Par joueur</a></li>
				</ul>
			</nav>
		</div>
	</div>
</div>
<?php
include(dirname(__FILE__) . '/themes/' . $gThemeName . '/footer.php');
?>