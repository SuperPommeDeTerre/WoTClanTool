var onLoad = function() {
	checkConnected();
	advanceProgress(i18n.t('loading.claninfos'));
	setNavBrandWithClan();
	afterLoad();
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
					myDayEventsHtml += '<div data-event-id="' + myEvent.id + '" data-participants="' + Object.keys(myEvent.participants).length + '">';
					myDayEventsHtml += '<h4><span class="label label-default">' + myEventStartDate.format('LT') + '</span> ' + myEvent.title + '</h4>';
					myDayEventsHtml += '<p>' + myEvent.description + '</p>';
					if (typeof(myEvent.participants[gConfig.PLAYER_ID]) === 'undefined') {
						myDayEventsHtml += '<a class="btn btn-lg btn-material-lime-300 btnEnrol" href="#enrol-' + myEvent.id + '" role="button" data-attendance="yes">' + i18n.t('event.enrol.yes') + '</a>';
						if (myEvent.spareallowed) {
							myDayEventsHtml += '<a class="btn btn-lg btn-material-lime-300 btnEnrol" href="#enrol-' + myEvent.id + '" role="button" data-attendance="spare">' + i18n.t('event.enrol.spare') + '</a>';
						}
					} else {
						myDayEventsHtml += '<p>' + i18n.t('event.participants', { count: Object.keys(myEvent.participants).length }) + '</p>';
					}
					myDayEventsHtml += '</div>';
				}
			}
			if (myDayEventsHtml == '') {
				// No events for this day.
				myDayEventsHtml = '<p>' + i18n.t('event.noevent') + '</p>';
			}
			myElem.find('h3').after(myDayEventsHtml);
		});
		$('#myCalendar').on('click', '.btnEnrol', function(evt) {
			evt.preventDefault();
			var myButton = $(this);
			$.post('./server/calendar.php', {
				a: 'enrol',
				eventId: myButton.closest('div').data('event-id'),
				attendance: myButton.data('attendance')
			}, function(enrolResponse) {
				if (enrolResponse.result == 'ok') {
					var myEventContainer = myButton.closest('div');
					myEventContainer.data('participants', (myEventContainer.data('participants') * 1) + 1);
					myEventContainer.append('<p>' + i18n.t('event.participants', { count: myEventContainer.data('participants') }) + '</p>');
					myEventContainer.find('.btnEnrol').remove();
				}
			}, 'json');
		});
	}, 'json');
};