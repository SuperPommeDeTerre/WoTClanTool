var onLoad = function() {
	checkConnected();
	progressNbSteps = 3;
	advanceProgress(i18n.t('loading.claninfos'));
	setNavBrandWithClan(function() {
		var membersList = '',
			isFirst = true;
		for (var i=0; i<gClanInfos.members_count; i++) {
			if (isFirst) {
				isFirst = false;
			} else {
				membersList += ',';
			}
			membersList += gClanInfos.members[i].account_id;
		}
		advanceProgress(i18n.t('loading.membersinfos'));
		$.post(gConfig.WG_API_URL + 'wot/account/info/', {
			application_id: gConfig.WG_APP_ID,
			language: gConfig.G_API_LANG,
			access_token: gConfig.ACCESS_TOKEN,
			account_id: membersList
		}, function(dataPlayersResponse) {
			advanceProgress(i18n.t('loading.generating'));
			gDataPlayers = dataPlayersResponse.data;
		}, 'json');
	});
	gCalendar = $('#clanCalendar').calendar({
		tmpl_path: './js/calendar-tmpls/',
		language: gLangMapping[gConfig.LANG],
		view: 'month',
		modal: '#events-modal',
		modal_type: 'ajax',
		modal_title : function (e) {
			return '<span class="eventTitle">' + e.title + '</span>'
				+ ' <span class="label label-default eventStartDate" data-date="' + e.start + '">' + moment(e.start * 1).format('LT')
				+ '</span> - <span class="label label-default eventEndDate" data-date="' + e.end + '">' + moment(e.end * 1).format('LT') + '</span>';
		},
		onAfterViewLoad: function(view) {
			$('#agendaTitle').text(this.getTitle());
		},
		onAfterModalShown: function(events) {
			fillEventDialog($("#events-modal"), events);
		},
		events_source: './server/calendar.php?a=list'
	});
	$('.btn-group button[data-calendar-nav]').each(function() {
		var $this = $(this);
		$this.click(function() {
			gCalendar.navigate($this.data('calendar-nav'));
		});
	});

	$('.btn-group button[data-calendar-view]').each(function() {
		var $this = $(this);
		$this.click(function() {
			$this.siblings('.active').removeClass('active');
			$this.addClass('active');
			gCalendar.view($this.data('calendar-view'));
		});
	});

	// Prevent default action on add event button
	$('#addEvent').on('click', function(evt) {
		evt.preventDefault();
		$('#eventTitle').val('');
		$('#eventDescription').val('');
		$('#eventStartDate input').val('');
		$('#eventEndDate input').val('');
	});

	// Init date time pickers
	$('.eventDateTimePicker').datetimepicker({
		locale: gConfig.LANG,
		stepping: 5,
		format: 'LLL',
		sideBySide: true,
		minDate: moment()
	});
	// Handle min and max dates
	$('#eventStartDate').on('dp.change', function (e) {
		$('#eventEndDate').data('DateTimePicker').minDate(e.date);
	});
	$('#eventEndDate').on('dp.change', function (e) {
		$('#eventStartDate').data('DateTimePicker').maxDate(e.date);
	});

	$('#btnEventOk').on('click', function(evt) {
		// Prevent default action of button
		evt.preventDefault();
		// Post data to server
		$.post('./server/calendar.php', {
			a: 'save',
			eventTitle: $('#eventTitle').val(),
			eventType: $('[name=eventType]:checked').val(),
			eventDescription: $('#eventDescription').val(),
			eventStartDate: moment($('#eventStartDate input').val(), 'LLL').unix(),
			eventEndDate: moment($('#eventEndDate input').val(), 'LLL').unix(),
			eventAllowSpare: $('#eventSpareAllowed').is(':checked')
		}, function(addEventResult) {
			// Handle result
			if (addEventResult.result == 'ok') {
				// Hide dialog
				$('#eventDialog').modal('hide');
				// Refresh calendar
				gCalendar.view();
			}
		}, 'json');
	});
	afterLoad();
};