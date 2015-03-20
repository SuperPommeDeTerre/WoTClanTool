<?php
require(dirname(__FILE__) . "/server/global.php");

$gPageID = "events";

include(dirname(__FILE__) . '/themes/' . $gThemeName . '/header.php');
?>
		<!-- Main component for a primary marketing message or call to action -->
		<div class="container-fluid">
			<div class="row">
				<div class="main">
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
							<button class="btn btn-warning" data-calendar-view="day" data-i18n="action.calendar.view.day"></button>
						</div>
					</div>
					<h3 id="agendaTitle"></h3>
					<div id="clanCalendar"></div>
					<p><a class="btn btn-lg btn-primary btn-material-grey-500" href="./events.php?a=add" role="button" id="addEvent" data-i18n="action.event.add"></a></p>
				</div>
			</div>
		</div>
<?php
include(dirname(__FILE__) . '/themes/' . $gThemeName . '/footer.php');
?>