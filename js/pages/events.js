var onLoad = function() {
	checkConnected();
	advanceProgress(i18n.t('loading.claninfos'));
	setNavBrandWithClan();
	var myCalendar = $('#clanCalendar').calendar({
		tmpl_path: './js/calendar-tmpls/',
		language: gLangMapping[gConfig.LANG],
		view: 'month',
		modal: '#events-modal',
		modal_type: 'ajax',
		modal_title : function (e) { return e.title },
		onAfterViewLoad: function(view) {
			$('#agendaTitle').text(this.getTitle());
		},
		onAfterModalShown: function(events) {
			// Fill the event window and add event handlers
			$("#events-modal").i18n();
			$("[data-date]").each(function(idx, elem) {
				var myElem = $(elem);
				myElem.siblings('.date').text(moment(myElem.data('date')).format('LLL'));
			});
			var myParticipants = [];
			$('[data-player-id]').each(function(idx, elem) {
				myParticipants.push($(elem).data('player-id'));
			});
			$.post(gConfig.WG_API_URL + 'wot/account/info/', {
				application_id: gConfig.WG_APP_ID,
				language: gConfig.G_API_LANG,
				access_token: gConfig.ACCESS_TOKEN,
				fields: 'nickname',
				account_id: myParticipants.join(',')
			}, function(dataPlayersResponse) {
				var dataPlayers = dataPlayersResponse.data;
				for (var playerId in dataPlayers) {
					$('[data-player-id="' + playerId + '"]').text(dataPlayers[playerId].nickname);
				}
			}, 'json');
			$('#btnDeleteEvent').on('click', function(evt) {
				evt.preventDefault();
				$.post('./server/calendar.php', {
					a: 'delete',
					eventId: $('#eventId').val()
				}, function(deleteResponse) {
					// Handle result
					if (deleteResponse.result == 'ok') {
						// Hide dialog
						$('#events-modal').modal('hide');
						// Refresh calendar
						myCalendar.view();
					}
				}, 'json');
			});
		},
		events_source: './server/calendar.php?a=list'
	});
	$('.btn-group button[data-calendar-nav]').each(function() {
		var $this = $(this);
		$this.click(function() {
			myCalendar.navigate($this.data('calendar-nav'));
		});
	});

	$('.btn-group button[data-calendar-view]').each(function() {
		var $this = $(this);
		$this.click(function() {
			$this.siblings('.active').removeClass('active');
			$this.addClass('active');
			myCalendar.view($this.data('calendar-view'));
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
		sideBySide: true
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
				myCalendar.view();
			}
		}, 'json');
	});
	afterLoad();
};