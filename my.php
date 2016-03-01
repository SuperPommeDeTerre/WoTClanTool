<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageProps = array(
	"id" => "my",
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
			<h1 class="page-header" data-i18n="page.my.title"></h1>
			<h2 class="sub-header" id="calendar"><span class="glyphicon glyphicon-calendar"></span> <span data-i18n="elems.calendar"></span></h2>
			<div id="myCalendar" class="container-fluid">
				<div class="row">
					<div class="col-xs-12 col-md-6 col-lg-4 placeholder">
						<h3 data-i18n="action.calendar.today"></h3>
					</div>
					<div class="col-xs-12 col-md-6 col-lg-4 placeholder">
						<h3></h3>
					</div>
					<div class="clearfix visible-md-block"></div>
					<div class="col-xs-12 col-md-6 col-lg-4 placeholder">
						<h3></h3>
					</div>
					<div class="clearfix visible-lg-block"></div>
					<div class="col-xs-12 col-md-6 col-lg-4 placeholder">
						<h3></h3>
					</div>
					<div class="clearfix visible-md-block"></div>
					<div class="col-xs-12 col-md-6 col-lg-4 placeholder">
						<h3></h3>
					</div>
					<div class="col-xs-12 col-md-6 col-lg-4 placeholder">
						<h3></h3>
					</div>
				</div>
			</div>
			<h3 class="page-header"><span class="glyphicon glyphicon-send"></span> <span data-i18n="elems.vacancies"></span></h3>
			<div id="myVacancies">
				<p id="noVacancy" data-i18n="vacancy.novacancy"></p>
				<div class="row">
					<div class="togglebutton togglebutton-info pull-right">
						<label><span data-i18n="vacancy.showpast"></span>
							<input type="checkbox" id="chkPastVacancies" />
						</label>
					</div>
				</div>
				<div class="row">
					<div class="table-responsive" id="myVacanciesTableContainer">
						<table class="table table-hover header-fixed" id="myVacanciesTable" data-sortable="true">
							<thead>
								<tr>
									<th class="startdate" data-i18n="event.startdate"></th>
									<th class="enddate" data-i18n="event.enddate"></th>
									<th class="reason" data-i18n="vacancy.reason"></th>
									<th class="delete" data-sortable="false">&nbsp;</th>
								</tr>
							</thead>
							<tbody>
							</tbody>
						</table>
					</div>
				</div>
				<div class="row">
					<button type="button" id="btnAddVacancy" class="btn btn-default btn-material-grey-500" data-target="#vacancy-dialog" data-toggle="modal"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> <span data-i18n="vacancy.add"></span></button>
				</div>
			</div>
			<h2 class="sub-header" id="garage"><span class="glyphicon glyphicon-oil"></span> <span data-i18n="elems.garage"></span></h2>
			<div class="btn-group" role="group">
				<button type="button" id="btnShowTanksTable" class="btn btn-default btn-material-grey-500 active"><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span></button>
				<button type="button" id="btnShowTanksListSmall" class="btn btn-default btn-material-grey-500"><span class="glyphicon glyphicon-th" aria-hidden="true"></span></button>
				<button type="button" id="btnShowTanksListLarge" class="btn btn-default btn-material-grey-500"><span class="glyphicon glyphicon-th-large" aria-hidden="true"></span></button>
			</div>
			<div class="btn-group" role="group">
				<button type="button" id="btnShowTanksResume" class="btn btn-default btn-material-green-300" data-target="#my-dialog" data-toggle="modal"><span class="glyphicon glyphicon-headphones" aria-hidden="true"></span></button>
			</div>
			<div class="pull-right form-inline">
				<div class="input-group pull-left">
					<span class="input-group-addon glyphicon glyphicon-tasks"></span>
					<div class="btn-group">
						<button type="button" id="tankFilterLevel" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" data-value="all" aria-expanded="false"><span class="btnVal" data-i18n="tank.alllevels"></span> <span class="caret"></span></button>
						<ul class="dropdown-menu" role="menu">
							<li data-value="all"><a href="#" data-i18n="tank.alllevels"></a></li>
							<li class="divider"></li>
							<li data-value="1"><a href="#" data-i18n="tank.level.0"></a></li>
							<li data-value="2"><a href="#" data-i18n="tank.level.1"></a></li>
							<li data-value="3"><a href="#" data-i18n="tank.level.2"></a></li>
							<li data-value="4"><a href="#" data-i18n="tank.level.3"></a></li>
							<li data-value="5"><a href="#" data-i18n="tank.level.4"></a></li>
							<li data-value="6"><a href="#" data-i18n="tank.level.5"></a></li>
							<li data-value="7"><a href="#" data-i18n="tank.level.6"></a></li>
							<li data-value="8"><a href="#" data-i18n="tank.level.7"></a></li>
							<li data-value="9"><a href="#" data-i18n="tank.level.8"></a></li>
							<li data-value="10"><a href="#" data-i18n="tank.level.9"></a></li>
						</ul>
					</div>
				</div>
				<div class="input-group pull-left" style="margin-right:.25em">
					<span class="input-group-addon glyphicon glyphicon-knight"></span>
					<div class="btn-group">
						<button type="button" id="tankFilterType" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" data-value="all" aria-expanded="false"><span class="btnVal" data-i18n="tank.alltypes"></span> <span class="caret"></span></button>
						<ul class="dropdown-menu" role="menu">
							<li data-value="all"><a href="#" data-i18n="tank.alltypes"></a></li>
							<li class="divider"></li>
							<li data-value="lightTank"><a href="#" data-i18n="tank.type.lightTank"></a></li>
							<li data-value="mediumTank"><a href="#" data-i18n="tank.type.mediumTank"></a></li>
							<li data-value="heavyTank"><a href="#" data-i18n="tank.type.heavyTank"></a></li>
							<li data-value="AT-SPG"><a href="#" data-i18n="tank.type.AT-SPG"></a></li>
							<li data-value="SPG"><a href="#" data-i18n="tank.type.SPG"></a></li>
						</ul>
					</div>
				</div>
				<div class="togglebutton togglebutton-info pull-left" style="margin-top: 0.75em">
					<label><span data-i18n="filter.tank.in_garage"></span>
						<input type="checkbox" id="chkInGarage" checked="checked" />
					</label>
				</div>
				<div class="pull-left" style="margin-top:-.25em">
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
			<h2 class="sub-header" id="stats"><span class="glyphicon glyphicon-stats"></span> <span data-i18n="elems.stats"></span></h2>
			<div class="row placeholders">
				<div class="col-xs-12 col-sm-4 placeholder">
					<div id="chartTanksTiers" style="height:200px"></div>
					<h4 data-i18n="stats.global.battlesbylevel"></h4>
				</div>
				<div class="col-xs-12 col-sm-4 placeholder">
					<div id="chartTanksType" style="height:200px"></div>
					<h4 data-i18n="stats.global.battlesbytype"></h4>
				</div>
				<div class="col-xs-12 col-sm-4 placeholder">
					<div id="chartTanksNation" style="height:200px"></div>
					<h4 data-i18n="stats.global.battlesbynation"></h4>
				</div>
			</div>
			<div class="row placeholders">
				<div class="col-xs-12 col-sm-4 placeholder">
					<div id="chartWRTiers" style="height:200px"></div>
					<h4 data-i18n="stats.global.winratiobylevel"></h4>
				</div>
				<div class="col-xs-12 col-sm-4 placeholder">
					<div id="chartWRType" style="height:200px"></div>
					<h4 data-i18n="stats.global.winratiobytype"></h4>
				</div>
				<div class="col-xs-12 col-sm-4 placeholder">
					<div id="chartWRNation" style="height:200px"></div>
					<h4 data-i18n="stats.global.winratiobynation"></h4>
				</div>
			</div>
		</div>
	</div>
</div>
<div id="my-dialog" class="modal fade" tabindex="-1">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button class="close" aria-hidden="true" data-dismiss="modal" type="button">&times;</button>
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
				<div class="input-group pull-left">
					<span class="input-group-addon glyphicon glyphicon-tasks"></span>
					<div class="btn-group dropup">
						<button type="button" id="tankFilterLevelTS" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" data-value="[4,6,7,8,10]" aria-expanded="false"><span class="btnVal" data-i18n="tank.alllevels"></span> <span class="caret"></span></button>
						<ul class="dropdown-menu" role="menu">
							<li data-value="all"><a href="#" data-i18n="tank.alllevels"></a></li>
							<li class="divider"></li>
							<li data-value="1"><a href="#" data-i18n="tank.level.0"></a></li>
							<li data-value="2"><a href="#" data-i18n="tank.level.1"></a></li>
							<li data-value="3"><a href="#" data-i18n="tank.level.2"></a></li>
							<li data-value="4"><a href="#" data-i18n="tank.level.3"></a></li>
							<li data-value="5"><a href="#" data-i18n="tank.level.4"></a></li>
							<li data-value="6"><a href="#" data-i18n="tank.level.5"></a></li>
							<li data-value="7"><a href="#" data-i18n="tank.level.6"></a></li>
							<li data-value="8"><a href="#" data-i18n="tank.level.7"></a></li>
							<li data-value="9"><a href="#" data-i18n="tank.level.8"></a></li>
							<li data-value="10"><a href="#" data-i18n="tank.level.9"></a></li>
						</ul>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-primary" data-dismiss="modal" data-i18n="btn.ok"></button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="events-modal">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h3></h3>
			</div>
			<div class="modal-body">
			</div>
			<div class="modal-footer">
				<a href="#" data-dismiss="modal" class="btn" data-i18n="btn.close"></a>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="vacancy-dialog">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h3 data-i18n="vacancy.add"></h3>
			</div>
			<div class="modal-body">
				<div class="input-group date eventDatePicker" id="vacancyStartDate">
					<input type="text" class="form-control" data-i18n="[placeholder]event.startdate;" />
					<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
				</div>
				<div class="input-group date eventDatePicker" id="vacancyEndDate">
					<input type="text" class="form-control" data-i18n="[placeholder]event.enddate;" />
					<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
				</div>
				<textarea id="vacancyReason" class="form-control" data-i18n="[placeholder]action.calendar.prop.description;" aria-describedby="sizing-addon1"></textarea>
			</div>
			<div class="modal-footer">
				<button class="btn btn-default" data-dismiss="modal" data-i18n="btn.cancel"></button>
				<button class="btn btn-primary" id="btnVacancyOk" data-i18n="btn.ok"></button>
			</div>
		</div>
	</div>
</div>
<?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>