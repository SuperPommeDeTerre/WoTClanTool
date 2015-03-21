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
			<div class="table-responsive" id="myTanksContainerTable">
				<table class="table table-hover" id="tableMyTanks">
					<thead>
						<tr>
							<th>Char</th>
							<th>Tiers</th>
							<th>Type</th>
							<th>Au garage</th>
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