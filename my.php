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
			<div class="table-responsive">
				<table class="table table-hover" id="tableClanPlayers">
					<thead>
						<tr>
							<th>Char</th>
							<th>Tiers</th>
							<th>Type</th>
							<th>Au garage</th>
							<th>Cote personnelle</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
			<h2 class="sub-header" id="strats" data-i18n="elems.strats"></h2>
			<h2 class="sub-header" id="stats" data-i18n="elems.stats"></h2>
		</div>
	</div>
</div>
<?php
require(dirname(__FILE__) . '/themes/' . $gThemeName . '/footer.php');
?>