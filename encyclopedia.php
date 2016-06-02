<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageProps = array(
	"id" => "encyclopedia",
	"authenticated" => true,
	"role" => array(),
	"blocks" => array (
		"ads" => true,
		"nav" => true,
		"footer" => true
	)
);

require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'header.php');
?>
<div class="container-fluid">
	<div class="row">
		<div class="main"><?php
include(WCT_INC_DIR . 'ads.php');
?>
			<h1 class="page-header" data-i18n="page.encyclopedia.title"></h1>
			<h2 class="page-header" data-i18n="nav.encyclopedia.tanks"></h2>
			<h2 class="page-header" data-i18n="nav.encyclopedia.wn8" id="wn8"></h2>
			<div class="table-responsive" id="wn8ExpectedValsContainer">
				<table class="table table-hover header-fixed tableTanks" id="wn8ExpectedVals">
					<thead>
						<tr>
							<th class="tankcontour" data-sortable="false">&nbsp;</th>
							<th class="tanknation" data-i18n="tank.infos.nation"></th>
							<th class="tankname" data-i18n="tank.infos.name"></th>
							<th class="tanktiers" data-sorted="true" data-sorted-direction="descending" data-i18n="tank.infos.level"></th>
							<th class="tanktype" data-i18n="tank.infos.type"></th>
							<th>Expected Frag</th>
							<th>Expected Damage</th>
							<th>Expected Spot</th>
							<th>Expected Def</th>
							<th>Expected WinRate</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
<?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>