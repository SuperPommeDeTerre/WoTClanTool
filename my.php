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
				<button type="button" id="btnShowTanksTable" class="btn btn-default btn-material-grey-500 active"><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span></button>
				<button type="button" id="btnShowTanksListSmall" class="btn btn-default btn-material-grey-500"><span class="glyphicon glyphicon-th" aria-hidden="true"></span></button>
				<button type="button" id="btnShowTanksListLarge" class="btn btn-default btn-material-grey-500"><span class="glyphicon glyphicon-th-large" aria-hidden="true"></span></button>
			</div>
			<div class="btn-group" role="group">
				<button type="button" id="btnShowTanksResume" class="btn btn-default btn-material-green-300" data-target="#my-dialog" data-toggle="modal"><span class="glyphicon glyphicon-headphones" aria-hidden="true"></span></button>
			</div>
			<div class="pull-right form-inline">
				<div class="togglebutton" style="float:left">
					<label><span data-i18n="filter.tank.in_garage"></span>
						<input type="checkbox" id="chkInGarage" checked="checked" />
					</label>
				</div>
				<div class="togglebutton" style="float:left">
					<label><span data-i18n="filter.tank.is_full"></span>
						<input type="checkbox" id="chkIsFull" />
					</label>
				</div>
			</div>
			<div class="container-fluid">
				<div class="row">
					<div class="table-responsive" id="myTanksContainerTable">
						<table class="table table-hover header-fixed tableTanks" id="tableMyTanks">
							<thead>
								<tr>
									<th class="tankcontour" data-sortable="false">&nbsp;</th>
									<th class="tankmastery" data-i18n="tank.stats.mastery"></th>
									<th class="tankname" data-i18n="tank.infos.name"></th>
									<th class="tanktiers" data-sorted="true" data-sorted-direction="descending" data-i18n="tank.infos.level"></th>
									<th class="tanktype" data-i18n="tank.infos.type"></th>
									<th class="tankbattles" data-i18n="tank.stats.battles"></th>
									<th class="tankwn8" data-i18n="tank.stats.wn8"></th>
									<th class="tankwinratio" data-i18n="tank.stats.winratio"></th>
									<th class="tankisfull"><abbr data-i18n="[title]tank.infos.is_full_title;tank.infos.is_full"></abbr></th>
									<th class="tankisready"><abbr data-i18n="[title]tank.infos.is_ready_title;tank.infos.is_ready"></abbr></th>
								</tr>
							</thead>
							<tbody>
							</tbody>
						</table>
					</div>
					<div id="myTanksContainerSmall" class="hidden"></div>
					<div id="myTanksContainerBig" class="hidden"></div>
				</div>
			</div>
			<h2 class="sub-header" id="strats" data-i18n="elems.strats"></h2>
			<h2 class="sub-header" id="stats" data-i18n="elems.stats"></h2>
		</div>
	</div>
</div>
<div id="my-dialog" class="modal fade" tabindex="-1">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button class="close" aria-hidden="true" data-dismiss="modal" type="button">×</button>
				<h4 class="modal-title" data-i18n="nav.tscomments"></h4>
			</div>
			<div class="modal-body">
				<ul class="nav nav-pills nav-pills-material-grey">
					<li role="presentation" class="active"><a href="#tabTSCommentImage" data-toggle="tab" data-i18n="nav.tscommentimage"></a></li>
					<li role="presentation"><a href="#tabTSCommentText" data-toggle="tab" data-i18n="nav.tscommenttext"></a></li>
				</ul>
				<div id="myTabTSCommentsContent" class="tab-content">
					<div class="tab-pane fade active in" id="tabTSCommentImage">
						<canvas width="300" height="150" id="canvasRecapPlayer"></canvas>
					</div>
					<div class="tab-pane fade in" id="tabTSCommentText">
						<pre id="textResumePlayer"></pre>
						<button id="copy-button" class="btn btn-default btn-material-grey-500" data-clipboard-target="textResumePlayer" data-i18n="[title]action.copy;"><span class="glyphicon glyphicon-copy" aria-hidden="true"></span></button>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-primary" data-dismiss="modal" data-i18n="btn.ok"></button>
			</div>
		</div>
	</div>
</div>
<?php
require(dirname(__FILE__) . '/themes/' . $gThemeName . '/footer.php');
?>