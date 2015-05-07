<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'server' . DIRECTORY_SEPARATOR . 'global.php');

$gPageID = "events";

require(WCT_THEMES_DIR . DIRECTORY_SEPARATOR . $gThemeName . DIRECTORY_SEPARATOR . 'header.php');
?>
<!-- Main component for a primary marketing message or call to action -->
<div class="container-fluid">
	<div class="row">
		<div class="main"><?php
include(WCT_INC_DIR . 'ads.php');
?>
			<h1 class="page-header"data-i18n="elems.calendar"></h1>
			<div class="pull-right form-inline">
				<div class="btn-group btn-group-agenda">
					<button class="btn btn-primary" data-calendar-nav="prev" data-i18n="action.calendar.previous"></button>
					<button class="btn" data-calendar-nav="today" data-i18n="action.calendar.today"></button>
					<button class="btn btn-primary" data-calendar-nav="next" data-i18n="action.calendar.next"></button>
				</div>
				<div class="btn-group btn-group-agenda">
					<button class="btn btn-warning" data-calendar-view="year" data-i18n="action.calendar.view.year"></button>
					<button class="btn btn-warning active" data-calendar-view="month" data-i18n="action.calendar.view.month"></button>
					<button class="btn btn-warning" data-calendar-view="week" data-i18n="action.calendar.view.week"></button>
				</div>
			</div>
			<h3 id="agendaTitle"></h3>
			<div id="clanCalendar"></div>
			<div style="text-align:center"><a class="btn btn-lg btn-primary btn-material-grey-500" href="#" role="button" id="addEvent" data-id="-1" data-target="#eventDialog" data-toggle="modal" data-i18n="action.event.add"></a></div>
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
<form id="frmEvent" method="post" action="./server/calendar.php?a=add">
	<div id="eventDialog" class="modal fade" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button class="close" aria-hidden="true" data-dismiss="modal" type="button" data-i18n="[aria-label]btn.close;">&times;</button>
					<h4 class="modal-title" data-i18n="elems.event"></h4>
				</div>
				<div class="modal-body">
				<!--
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
				-->
					<div id="containerEventMain">
						<input id="eventTitle" type="text" class="form-control" data-i18n="[placeholder]action.calendar.prop.title;" aria-describedby="sizing-addon1" />
						<textarea id="eventDescription" class="form-control" data-i18n="[placeholder]action.calendar.prop.description;" aria-describedby="sizing-addon1"></textarea>
						<div class="input-group date eventDateTimePicker" id="eventStartDate">
							<input type="text" class="form-control" data-i18n="[placeholder]action.calendar.prop.startdate;" />
							<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
						</div>
						<div class="input-group date eventDateTimePicker" id="eventEndDate">
							<input type="text" class="form-control" data-i18n="[placeholder]action.calendar.prop.enddate;" />
							<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
						</div>
						<div class="togglebutton">
							<label><span data-i18n="action.calendar.prop.allowspare"></span>
								<input type="checkbox" id="eventSpareAllowed" value="true" />
							</label>
						</div>
			<!--
						<div class="togglebutton">
							<label><span data-i18n="action.calendar.prop.periodic"></span>
								<input type="checkbox" id="eventRecurrent" value="true" />
							</label>
						</div>
						<div class="togglebutton">
							<label><span data-i18n="action.calendar.prop.private"></span>
								<input type="checkbox" id="eventPrivate" value="true" />
							</label>
						</div>
			-->
					</div>
				<!--
					<div id="containerEventPeriodicity">
					</div>
				-->
					<div id="containerEventType">
						<div class="input-group">
							<div class="eventType">
								<h5 data-i18n="action.calendar.prop.type"></h5>
								<div class="radio radio-material-black">
									<label>
										<input type="radio" checked="checked" value="clanwar" name="eventType">
										<abbr data-i18n="action.calendar.prop.types.clanwar"></abbr>
									</label>
								</div>
								<div class="radio radio-material-red-800">
									<label>
										<input type="radio" value="compa" name="eventType">
										<abbr data-i18n="action.calendar.prop.types.compa"></abbr>
									</label>
								</div>
								<div class="radio radio-material-purple-600">
									<label>
										<input type="radio" value="stronghold" name="eventType">
										<abbr data-i18n="action.calendar.prop.types.stronghold"></abbr>
									</label>
								</div>
								<div class="radio radio-material-blue-700">
									<label>
										<input type="radio" value="7vs7" name="eventType">
										<abbr data-i18n="action.calendar.prop.types.7vs7"></abbr>
									</label>
								</div>
								<div class="radio radio-material-green-600">
									<label>
										<input type="radio" value="training" name="eventType">
										<abbr data-i18n="action.calendar.prop.types.training"></abbr>
									</label>
								</div>
								<div class="radio radio-material-grey-500">
									<label>
										<input type="radio" value="other" name="eventType">
										<abbr data-i18n="action.calendar.prop.types.other"></abbr>
									</label>
								</div>
							</div>
						</div>
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