<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageProps = array(
	"id" => "events",
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
			<h1 class="page-header"data-i18n="elems.calendar"></h1>
			<div class="pull-right form-inline">
				<div class="btn-group btn-group-agenda">
					<button class="btn btn-primary" data-calendar-nav="prev"><span class="glyphicon glyphicon-chevron-left"></span></button>
					<button class="btn" data-calendar-nav="today" data-i18n="action.calendar.today"></button>
					<button class="btn btn-primary" data-calendar-nav="next"><span class="glyphicon glyphicon-chevron-right"></span></button>
				</div>
				<div class="btn-group btn-group-agenda">
					<button class="btn btn-warning" data-calendar-view="year" data-i18n="action.calendar.view.year"></button>
					<button class="btn btn-warning active" data-calendar-view="month" data-i18n="action.calendar.view.month"></button>
					<button class="btn btn-warning" data-calendar-view="week" data-i18n="action.calendar.view.week"></button>
				</div>
			</div>
			<h3 id="agendaTitle"></h3>
			<div id="clanCalendar"></div>
			<div style="text-align:center"><a class="btn btn-lg btn-primary btn-material-grey-500" href="#" role="button" id="addEvent" data-id="-1" data-target="#eventDialog" data-toggle="modal"><span class="mdi-action-alarm-add" aria-hidden="true"></span> <span data-i18n="action.event.add"></span></a></div>
			<h2 class="page-header"><span class="glyphicon glyphicon-send"></span> <span data-i18n="elems.vacancies"></span></h2>
			<div id="listVacancies">
				<div class="table-responsive" id="listVacanciesTableContainer">
					<table class="table table-hover header-fixed table-condensed" id="listVacanciesTable" data-sortable="true">
						<thead>
							<tr>
								<th class="player" data-i18n="player.headers.nickname"></th>
							</tr>
						</thead>
						<tbody>
							<tr id="noVacancy">
								<td style="text-align:center" data-i18n="vacancy.novacancy"></td>
							</tr>
						</tbody>
					</table>
				</div>
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
				<button class="btn btn-default" data-dismiss="modal" data-i18n="btn.close"></button>
				<button class="btn btn-primary hidden" id="btnModifyEventOk" data-i18n="btn.ok"></button>
			</div>
		</div>
	</div>
</div>
<form id="frmEvent" method="post" action="./server/calendar.php?a=add">
	<div id="eventDialog" class="modal fade" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button class="close" aria-hidden="true" data-dismiss="modal" type="button" data-i18n="[aria-label]btn.close;">&times;</button>
					<h4 class="modal-title" data-i18n="elems.event"></h4>
				</div>
				<div class="modal-body"><?php /*
					<nav class="navbar navbar-default navbar-material-indigo-600">
						<div class="container-fluid">
							<div class="collapse navbar-collapse">
								<ul class="nav navbar-nav">
									<li role="presentation" class="active"><a href="#" data-i18n="elems.event"></a></li>
									<li role="presentation"><a href="#" data-i18n="action.calendar.prop.periodicity"></a></li>
									<li role="presentation"><a href="#" data-i18n="action.calendar.prop.participants"></a></li>
								</ul>
							</div>
						</div>
					</nav>
*/ ?>
					<div id="containerEventMain">
						<input id="eventTitle" type="text" class="form-control" data-i18n="[placeholder]action.calendar.prop.title;" aria-describedby="sizing-addon1" />
						<textarea id="eventDescription" class="form-control" data-i18n="[placeholder]action.calendar.prop.description;" aria-describedby="sizing-addon1"></textarea>
						<div class="container-fluid">
							<div class="row">
								<div class="col-xs-6">
									<div class="input-group date eventDatePicker" id="eventStartDate">
										<input type="text" class="form-control" data-i18n="[placeholder]action.calendar.prop.date;" />
										<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
									</div>
								</div>
								<div class="col-xs-6">
									<div class="input-group date eventTimePicker" id="eventStartTime">
										<input type="text" class="form-control" data-i18n="[placeholder]action.calendar.prop.starttime;" />
										<span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-xs-6">
									<div class="input-group date eventDatePicker" id="eventEndDate">
										<input type="text" class="form-control" data-i18n="[placeholder]action.calendar.prop.enddate;" />
										<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
									</div>
								</div>
								<div class="col-xs-6">
									<div class="input-group date eventTimePicker" id="eventEndTime">
										<input type="text" class="form-control" data-i18n="[placeholder]action.calendar.prop.endtime;" />
										<span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span>
									</div>
								</div>
							</div>
						</div>
						<div class="container-fluid">
							<div id="eventsRestrictionsContainer">
								<div class="form-inline">
									<div class="input-group pull-left">
										<span class="input-group-addon glyphicon glyphicon-asterisk"></span>
										<div class="btn-group">
											<button type="button" id="eventType" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" data-value="all" aria-expanded="false"><span class="btnVal" data-i18n="action.calendar.prop.types.clanwar"></span> <span class="caret"></span></button>
											<ul class="dropdown-menu" role="menu">
												<li data-value="clanwar"><a href="#" data-i18n="action.calendar.prop.types.clanwar"></a></li>
												<li data-value="compa"><a href="#" data-i18n="action.calendar.prop.types.compa"></a></li>
												<li data-value="stronghold"><a href="#" data-i18n="action.calendar.prop.types.stronghold"></a></li>
												<li data-value="7vs7"><a href="#" data-i18n="action.calendar.prop.types.7vs7"></a></li>
												<li data-value="training"><a href="#" data-i18n="action.calendar.prop.types.training"></a></li>
												<li data-value="other"><a href="#" data-i18n="action.calendar.prop.types.other"></a></li>
											</ul>
										</div>
									</div>
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
								</div>
							</div>
							<div class="togglebutton">
								<label><span data-i18n="action.calendar.prop.periodic"></span>:
									<input type="checkbox" id="eventRecurrent" value="true" />
								</label>
							</div>
							<div class="form-inline">
								<div id="containerEventPeriodicity" class="pull-left">
								</div>
							</div>
						</div>
						<div class="togglebutton">
							<label><span data-i18n="action.calendar.prop.allowspare"></span>
								<input type="checkbox" id="eventSpareAllowed" value="true" />
							</label>
						</div><?php /*
						<div class="togglebutton">
							<label><span data-i18n="action.calendar.prop.private"></span>
								<input type="checkbox" id="eventPrivate" value="true" />
							</label>
						</div>
*/ ?>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-default" data-dismiss="modal" data-i18n="btn.cancel"></button>
					<button class="btn btn-primary" id="btnEventOk" data-i18n="btn.ok"></button>
				</div>
			</div>
		</div>
	</div>
</form>
<?php
require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'footer.php');
?>