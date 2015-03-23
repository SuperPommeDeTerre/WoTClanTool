<?php
require(dirname(__FILE__) . '/server/global.php');

$gPageID = "my";

require(dirname(__FILE__) . '/themes/' . $gThemeName . '/header.php');
?>
<div class="container-fluid">
	<div class="row">
		<div class="main">
			<h1 class="page-header" data-i18n="page.my.title"></h1>
			<h2 class="sub-header" id="calendar" data-i18n="elems.calendar"></h2>
			<div id="myCalendar"></div>
			<h2 class="sub-header" id="garage" data-i18n="elems.garage"></h2>
			<div class="btn-group" role="group">
				<button type="button" class="btn btn-default btn-material-grey-500 active"><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span></button>
				<button type="button" class="btn btn-default btn-material-grey-500"><span class="glyphicon glyphicon-th" aria-hidden="true"></span></button>
				<button type="button" class="btn btn-default btn-material-grey-500"><span class="glyphicon glyphicon-th-large" aria-hidden="true"></span></button>
			</div>
			<div class="pull-right form-inline">
				<div class="togglebutton" style="float:left">
					<label><span>Au garage</span>
					<input type="checkbox" id="chkInGarage" checked="checked" />
					<span class="toggle"></span>
					</label>
				</div>
				<div class="togglebutton" style="float:left">
					<label><span>Full</span>
					<input type="checkbox" id="chkIsFull" />
					<span class="toggle"></span>
					</label>
				</div>
			</div>
			<div class="table-responsive" id="myTanksContainerTable">
				<table class="table table-hover header-fixed tableTanks" id="tableMyTanks">
					<thead>
						<tr>
							<th class="tankcontour" data-sortable="false"></th>
							<th class="tankmastery">M</th>
							<th class="tankname">Char</th>
							<th class="tanktiers">Tiers</th>
							<th class="tanktype">Type</th>
							<th class="tankbattles">Batailles</th>
							<th class="tankwinratio">% victoires</th>
							<th class="tankisfull">Full ?</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
			<div class="table-responsive" id="myTanksContainerSmall">
			</div>
			<div class="table-responsive" id="myTanksContainerBig">
			</div>
			<h2 class="sub-header" id="strats" data-i18n="elems.strats"></h2>
			<h2 class="sub-header" id="stats" data-i18n="elems.stats"></h2>
		</div>
	</div>
</div>
<?php
require(dirname(__FILE__) . '/themes/' . $gThemeName . '/footer.php');
?>