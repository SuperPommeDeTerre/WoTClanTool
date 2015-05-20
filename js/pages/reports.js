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
			advanceProgress(i18n.t('loading.events'));
			gDataPlayers = dataPlayersResponse.data;
			var now = moment(),
				endDate = moment(now).startOf('day'),
				startDate = moment(startDate).subtract(3, 'month');
			$.post('./server/calendar.php', {
				a: 'list',
				from: startDate.valueOf(),
				to: endDate.valueOf()
			}, function(calendarDataResponse) {
				advanceProgress(i18n.t('loading.generating'));
				var myEvents = calendarDataResponse.result,
					i = 0,
					j = 0,
					myEvent = {},
					myEventsHtml = '',
					myParticipantId = 0,
					myParticipant = {},
					myParticipationsTable = $('#tableParticipations');
				for (i=0; i<myEvents.length; i++) {
					myEvent = myEvents[i];
					for (myParticipantId in myEvent.participants) {
						myEventsHtml += '<tr>';
						myEventsHtml += '<td>' + gDataPlayers[myParticipantId].nickname + '</td>';
						myEventsHtml += '<td>' + i18n.t('event.enrol.state.' + myEvent.participants[myParticipantId]) + '</td>';
						myEventsHtml += '<td>' + myEvent.title + '</td>';
						myEventsHtml += '<td>' + i18n.t('action.calendar.prop.types.' + myEvent.type) + '</td>';
						myEventsHtml += '<td data-value="' + myEvent.start + '">' + moment(myEvent.start * 1).format('LLL') + '</td>';
						myEventsHtml += '<td data-value="' + myEvent.end + '">' + moment(myEvent.end * 1).format('LLL') + '</td>';
						myEventsHtml += '</tr>';
					}
				}
				myParticipationsTable.attr('data-sortable', 'true');
				myParticipationsTable.find('tbody').html(myEventsHtml);
				Sortable.initTable(myParticipationsTable[0]);
				afterLoad();
			}, 'json');
		}, 'json');
	});

	$('.export.csv').on('click', function(evt) {
		evt.preventDefault();
		var dataToExport = { headers: [], lines: [] },
			relatedTable = $($(this).data('rel'));
		// Process headers
		relatedTable.find('thead th').each(function(idx, elem) {
			dataToExport.headers.push($(elem).text());
		});
		// Process lines
		relatedTable.find('tbody tr').each(function(idx, elem) {
			var cells = $(elem).find('td'),
				lineVals = [];
			for (var i=0; i<cells.length; i++) {
				lineVals.push($(cells[i]).text());
			}
			dataToExport.lines.push(lineVals);
		});
		$('#data').val(JSON.stringify(dataToExport));
		$('#frmExport').submit();
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
};