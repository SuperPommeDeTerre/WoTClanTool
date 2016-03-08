var onLoad = function() {
	checkConnected();
	advanceProgress($.t('loading.claninfos'));
	var now = moment();
	// Get events on 6 days (because of 12 columns grid system of bootstrap)
	$.post('./server/calendar.php', {
		a: 'list',
		from: now.valueOf(),
		to: moment(now).add(6, 'days').valueOf()
	}, function(calendarDataResponse) {
		var myEvents = calendarDataResponse.result;
		$('#myCalendar .placeholder').each(function(idx, elem) {
			var myElem = $(elem),
				myDayEventsHtml = '',
				myEvent = {},
				startOfDay = moment(now).add(idx, 'days').startOf('day'),
				endOfDay = moment(startOfDay).endOf('day');
			if (idx != 0) {
				myElem.find('h3').text(startOfDay.format('LL'));
			}
			for (var i=0; i<myEvents.length; i++) {
				myEvent = myEvents[i];
				var myEventStartDate = moment(myEvent.start * 1),
					myEventEndDate = moment(myEvent.end * 1);
				if (myEventStartDate.isBetween(startOfDay, endOfDay)) {
					myDayEventsHtml += '<div class="eventContainer" data-event-id="' + myEvent.id + '" data-participants="' + Object.keys(myEvent.participants).length + '">';
					myDayEventsHtml += '<h4><span class="label label-default">' + myEventStartDate.format('LT') + '</span> ' + myEvent.title + '</h4>';
					myDayEventsHtml += '<p>' + myEvent.description + '</p>';
					if (typeof(myEvent.participants[gConfig.PLAYER_ID]) === 'undefined') {
						myDayEventsHtml += '<div class="btn-group btnEnrolContainer" role="group">';
						myDayEventsHtml += '<button type="button" class="btn btn-default btn-success btnEnrol" data-attendance="yes" title="' + $.t('event.enrol.yes') + '" data-event-id="' + myEvent.id + '"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';
						if (myEvent.spareallowed) {
							myDayEventsHtml += '<button type="button" class="btn btn-default btn-info btnEnrol" data-attendance="spare" title="' + $.t('event.enrol.spare') + '" data-event-id="' + myEvent.id + '"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button>';
						}
						myDayEventsHtml += '</div>';
					} else {
						myDayEventsHtml += '<p>' + $.t('event.participants', { count: Object.keys(myEvent.participants).length }) + '</p>';
					}
					myDayEventsHtml += '</div>';
				}
			}
			if (myDayEventsHtml == '') {
				// No events for this day.
				myDayEventsHtml = '<p>' + $.t('event.noevent') + '</p>';
			}
			myElem.find('h3').after(myDayEventsHtml);
		});
		$('#myCalendar').on('click', '.btnEnrol', function(evt) {
			evt.preventDefault();
			var myButton = $(this);
			$.post('./server/calendar.php', {
				a: 'enrol',
				eventId: myButton.data('event-id'),
				attendance: myButton.data('attendance')
			}, function(enrolResponse) {
				if (enrolResponse.result == 'ok') {
					var myEventContainer = myButton.closest('div.eventContainer');
					myEventContainer.data('participants', (myEventContainer.data('participants') * 1) + 1);
					myEventContainer.append('<p>' + $.t('event.participants', { count: myEventContainer.data('participants') }) + '</p>');
					myEventContainer.find('.btnEnrolContainer').parent().remove();
				}
			}, 'json');
		});
		afterLoad();
	}, 'json');
};