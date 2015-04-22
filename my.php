<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageID = "my";

require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'header.php');
?>
<div class="container-fluid">
	<div class="row">
		<div class="main"><?php
include(WCT_INC_DIR . 'ads.php');
?>
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
				<div class="togglebutton togglebutton-info pull-left">
					<label><span data-i18n="filter.tank.in_garage"></span>
						<input type="checkbox" id="chkInGarage" checked="checked" />
					</label>
				</div>
				<div class="pull-left" style="margin-top:-1em">
					<label><span data-i18n="filter.tank.status" style="font-weight:400"></span>
						<div style="display:inline-block;width:5em;position:relative;top:.75em;margin-left:1em">
							<div data-toggle="tooltip" data-placement="top" class="slider shor slider-default" id="slideTankStatus" data-i18n="[title]tank.status.0;"></div>
						</div>
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
									<th class="tanknation" data-i18n="tank.infos.nation"></th>
									<th class="tankname" data-i18n="tank.infos.name"></th>
									<th class="tanktiers" data-sorted="true" data-sorted-direction="descending" data-i18n="tank.infos.level"></th>
									<th class="tanktype" data-i18n="tank.infos.type"></th>
									<th class="tankbattles" data-i18n="tank.stats.battles"></th>
									<th class="tankwn8" data-i18n="tank.stats.wn8"></th>
									<th class="tankwinratio" data-i18n="tank.stats.winratio"></th>
									<th class="tankstate"><abbr data-i18n="[title]tank.infos.state_title;tank.infos.state"></abbr></th>
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
					<li role="presentation"><a href="#tabTSCommentText" data-toggle="tab" data-i18n="nav.tscommenthtml"></a></li>
				</ul>
				<div id="myTabTSCommentsContent" class="tab-content">
					<div class="tab-pane fade active in" id="tabTSCommentImage">
						<div class="checkbox">
							<label>
								<input type="checkbox" id="chkContourIcons" checked="checked" /> <span data-i18n="tank.resume.chkcontour" style="left:25px;top:8px;width:200px"></span>
							</label>
						</div>
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
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>