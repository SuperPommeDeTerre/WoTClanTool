var onLoad = function() {
	checkConnected();
	progressNbSteps = 3;
	advanceProgress($.t('loading.claninfos'));
	setNavBrandWithClan(function() {
		var membersList = '',
			isFirst = true;
		for (var i=0 in gClanInfos.members) {
			if (isFirst) {
				isFirst = false;
			} else {
				membersList += ',';
			}
			membersList += gClanInfos.members[i].account_id;
		}
		advanceProgress($.t('loading.membersinfos'));
		$.post(gConfig.WG_API_URL + 'wot/account/info/', {
			application_id: gConfig.WG_APP_ID,
			language: gConfig.G_API_LANG,
			access_token: gConfig.ACCESS_TOKEN,
			account_id: membersList
		}, function(dataPlayersResponse) {
			gDataPlayers = dataPlayersResponse.data;
			advanceProgress($.t('loading.getvacancies'));
			$.post('./server/player.php', {
				'action': 'getvacancies',
				'account_id': membersList
			}, function(dataMyVacanciesResponse) {
				advanceProgress($.t('loading.generating'));
				var tableContent = '',
					tableContent2 = '',
					nbVacancies = 0,
					curTime = moment();
					curTimeUnix = curTime.unix(),
					periodStart = curTime.clone(),
					periodEnd = curTime.clone().add(1, 'months'),
					periodNumberOfDays = periodEnd.diff(periodStart, 'days'),
					lastEndMoment = periodStart.clone();
				tableContent2 = '';
				for (var i = 0; i<periodNumberOfDays; i++) {
					var curDay = periodStart.clone().add(i, 'days');
					//tableContent2 += '<th data-sortable="false" title="' + curDay.format('LL') + '"' + (curTime.diff(curDay, 'days') == 0?' class="info"':'') + '>&nbsp;</th>';
					tableContent2 += '<th data-sortable="false" title="' + curDay.format('LL') + '">&nbsp;</th>';
				}
				$('#listVacanciesTable thead tr').append(tableContent2);
				tableContent2 = '';
				for (var memberId in dataMyVacanciesResponse.data) {
					var myPlayerInfos = gDataPlayers[memberId],
						myPlayerVacancies = dataMyVacanciesResponse.data[memberId],
						playerNbVacanciesInPeriod = 0;
					for (var myVacancyIndex in myPlayerVacancies) {
						var myVacancy = myPlayerVacancies[myVacancyIndex];
						if (periodStart.unix() < myVacancy.enddate || periodEnd.unix() > myVacancy.startdate) {
							playerNbVacanciesInPeriod++;
						}
					}
					if (playerNbVacanciesInPeriod > 0) {
						myPlayerVacancies.sort(function(a, b) {
							return a.startdate - b.startdate;
						});
						tableContent += '<tr>';
						tableContent += '<td>' + myPlayerInfos.nickname + '</td>';
						for (var myVacancyIndex in myPlayerVacancies) {
							var myVacancy = myPlayerVacancies[myVacancyIndex];
							if (periodStart.unix() < myVacancy.enddate) {
								var myVacancyStartMoment = moment.unix(myVacancy.startdate),
									myVacancyEndMoment = moment.unix(myVacancy.enddate),
									colSpanBefore = 0,
									colSpanInner = 0,
									daysAfterVacancy = periodEnd.diff(myVacancyEndMoment, 'days'),
									isActive = (myVacancy.startdate < curTimeUnix) && (myVacancy.enddate > curTimeUnix);
								colSpanBefore = myVacancyStartMoment.diff(lastEndMoment, 'days');
								colSpanInner = myVacancyEndMoment.clone().add(1, 'days').startOf('day').diff(myVacancyStartMoment, 'days');
								if (colSpanBefore > 0) {
									tableContent += '<td colspan="' + colSpanBefore + '">&nbsp;</td>';
								} else if (colSpanBefore < 0) {
									colSpanInner += colSpanBefore;
								}
								if (daysAfterVacancy < 0) {
									colSpanInner += daysAfterVacancy;
								}
								if (colSpanInner > 0) {
									tableContent += '<td colspan="' + colSpanInner + '"><div class="progress progress-centered" data-toggle="tooltip" data-placement="top" title="' + myVacancyStartMoment.format('L') + ' - ' + myVacancyEndMoment.format('L') + (myVacancy.reason!=''?' (' + myVacancy.reason + ')':'') + '"><div class="progress-bar progress-bar-' + (isActive==true?'success':'info') + '" style="width:100%"></div></div></td>';
								}
								lastEndMoment = myVacancyEndMoment.clone().add(1, 'days').startOf('day');
							}
							nbVacancies++;
						}
						colSpanAfter = periodEnd.diff(lastEndMoment, 'days');
						if (colSpanAfter > 0) {
							tableContent += '<td colspan="' + colSpanAfter + '">&nbsp;</td>';
						}
						tableContent += '</tr>';
					}
				}
				$('#listVacanciesTable tbody').append(tableContent);
				if (nbVacancies > 0) {
					$('#noVacancy').remove();
				} else {
					$('#noVacancy').attr('colspan', periodNumberOfDays + 1);
				}
				afterLoad();
			}, 'json');
		}, 'json');
	});
	gCalendar = $('#clanCalendar').calendar({
		tmpl_path: './js/calendar-tmpls/',
		language: gLangMapping[gConfig.LANG],
		view: 'month',
		modal: '#events-modal',
		modal_type: 'ajax',
		display_week_numbers: false,
		weekbox: false,
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
		// Reset form
		$('#eventTitle').val('');
		$('#eventDescription').val('');
		$('#eventStartDate').data('DateTimePicker').date(moment());
		$('#eventEndDate input').val('');
		$('#eventStartTime').data('DateTimePicker').date(moment().add(1, 'hour').startOf('hour'));
		$('#eventSpareAllowed').removeAttr('checked');
		$('#eventType').next().find('[data-value="clanwar"] a').trigger('click');
		$('#eventPeriodicity').next().find('[data-value="no"] a').trigger('click');
		$('#eventTankLevel').next().find('[data-value="all"] a').trigger('click');
		$('#eventTankTypes').next().find('[data-value="all"] a').trigger('click');
		$('#eventTankTypes').next().find('.glyphicon').removeClass('glyphicon-check').addClass('glyphicon-unchecked')
	});

	// Init date time pickers
	$('.eventDatePicker').datetimepicker({
		locale: gConfig.LANG,
		format: 'LL',
		minDate: moment()
	});
	$('.eventTimePicker').datetimepicker({
		locale: gConfig.LANG,
		format: 'LT',
		minDate: moment()
	});
	// Handle min and max dates
	$('#eventStartDate').on('dp.change', function(e) {
		if ($(this).val() == '') {
			$('#eventEndDate').data('DateTimePicker').minDate($(this).data('DateTimePicker').date());
		} else {
			$('#eventEndDate').data('DateTimePicker').minDate(e.date);
		}
	}).trigger('dp.change');
	$('#eventEndDate').on('dp.change', function(e) {
		if ($(this).val() == '') {
			$('#eventStartDate').data('DateTimePicker').maxDate(false);
		} else {
			$('#eventStartDate').data('DateTimePicker').maxDate(e.date);
		}
	}).trigger('dp.change');
	$('#eventStartTime').on('dp.change', function(e) {
		if ($(this).val() == '') {
			$('#eventEndTime').data('DateTimePicker').minDate($(this).data('DateTimePicker').date());
		} else {
			$('#eventEndTime').data('DateTimePicker').minDate(e.date);
		}
	}).trigger('dp.change');
	$('#eventEndTime').on('dp.change', function(e) {
		if ($(this).val() == '') {
			$('#eventStartTime').data('DateTimePicker').maxDate(false);
		} else {
			$('#eventStartTime').data('DateTimePicker').maxDate(e.date);
		}
	}).trigger('dp.change');
	$('#eventStartDate input, #eventEndDate input, #eventStartTime input, #eventEndTime input').on('focus', function(evt) {
		$(this).closest('.date').data('DateTimePicker').show();
	});
	var periodicityDaysHtml = '',
		dayOfWeek = moment().startOf('week'),
		isPeriodic = false;
	for (var i=0; i<7; i++) {
		periodicityDaysHtml += '<li data-value="' + dayOfWeek.format('d') + '"><a href="#">' + $.t('action.calendar.prop.periodicityday', { dayname: dayOfWeek.format('dddd') }) + '</a></li>';
		dayOfWeek = dayOfWeek.add(1, 'days');
	}
	$('#eventPeriodicity').next().append(periodicityDaysHtml);
	// Submit of event
	$('#btnEventOk').on('click', function(evt) {
		// Prevent default action of button
		evt.preventDefault();
		// Post data to server
		var lStartDate = $('#eventStartDate').data('DateTimePicker').date(),
			lStartTime = $('#eventStartTime').data('DateTimePicker').date(),
			lEndDate = $('#eventEndDate').data('DateTimePicker').date(),
			lEndTime = $('#eventEndTime').data('DateTimePicker').date(),
			startDateToSent = lStartDate,
			endDateToSent = lEndDate;
		// Compute start and end final dates.
		startDateToSent = startDateToSent.hour(lStartTime.hour());
		startDateToSent = startDateToSent.minute(lStartTime.minute());
		startDateToSent = startDateToSent.second(0);
		if (!isPeriodic) {
			endDateToSent = moment(lStartDate);
		}
		endDateToSent = endDateToSent.hour(lEndTime.hour());
		endDateToSent = endDateToSent.minute(lEndTime.minute());
		endDateToSent = endDateToSent.second(0);
		$.post('./server/calendar.php', {
			a: 'save',
			eventTitle: $('#eventTitle').val(),
			eventType: $('#eventType').data('value'),
			eventDescription: $('#eventDescription').val(),
			eventIsRecurrent: isPeriodic,
			eventRecurrencyDay: $('#eventPeriodicity').data('value'),
			eventStartDate: startDateToSent.unix(),
			eventEndDate: endDateToSent.unix(),
			eventAllowSpare: $('#eventSpareAllowed').is(':checked'),
			eventRestrictTankLevel: $('#eventTankLevel').data('value'),
			eventRestrictTankType: $('#eventTankTypes').data('value')
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
	var selEventType = $('#eventType'),
		selTankLevel = $('#eventTankLevel'),
		selTankType = $('#eventTankTypes'),
		selPeriodicity = $('#eventPeriodicity');
	selEventType.add(selTankLevel).parent().on('click', 'a', function(evt) {
		evt.preventDefault();
		var myLink = $(this);
		myLink.parent().parent().prev().data('value', myLink.parent().data('value')).find('.btnVal').text(myLink.text());
	});
	selPeriodicity.parent().on('click', 'a', function(evt) {
		evt.preventDefault();
		var myLink = $(this),
			myPeriodicitySelected = myLink.parent().data('value');
		if (myPeriodicitySelected != 'no') {
			$('#eventEndDate').fadeIn('fast');
			var listDaysToDisable = [];
			for (var i = 0; i<7; i++) {
				if (i != myPeriodicitySelected) {
					listDaysToDisable[listDaysToDisable.length] = i;
				}
			}
			$('#eventStartDate').data('DateTimePicker').daysOfWeekDisabled(listDaysToDisable);
			$('#eventEndDate').data('DateTimePicker').daysOfWeekDisabled(listDaysToDisable);
			isPeriodic = true;
		} else {
			$('#eventEndDate').fadeOut('fast').data('DateTimePicker').daysOfWeekDisabled([]);
			$('#eventStartDate').data('DateTimePicker').daysOfWeekDisabled([]);
			isPeriodic = false;
		}
		myLink.parent().parent().prev().data('value', myLink.parent().data('value')).find('.btnVal').text(myLink.text());
	});
	selTankType.parent().on('click', 'a', function(evt) {
		evt.preventDefault();
		var myLink = $(this),
			myTypesSelectedContainer = myLink.parent().parent().prev(),
			myTypesSelected = myTypesSelectedContainer.data('value').split(/,/g),
			myChoosenType = myLink.parent().data('value'),
			i = 0,
			indexOfAll = 0,
			indexOfType = 0;
		if (myChoosenType != 'all') {
			indexOfType = myTypesSelected.indexOf(myChoosenType);
			myLink.find('.glyphicon').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
			if (indexOfType >= 0) {
				myTypesSelected.splice(indexOfType, 1);
			} else {
				myTypesSelected.push(myChoosenType);
			}
			indexOfAll = myTypesSelected.indexOf('all');
			if (myTypesSelected.length > 1 && indexOfAll >= 0) {
				myTypesSelected.splice(indexOfAll, 1);
			}
		} else {
			myLink.parent().parent().find('.glyphicon').removeClass('glyphicon-check').addClass('glyphicon-unchecked');
		}
		if (myTypesSelected.length == 0 || myChoosenType == 'all') {
			myTypesSelected = [ 'all' ];
		}
		myTypesSelectedContainer.data('value', myTypesSelected.join(',')).find('.btnVal').text(getTanksTypesString(myTypesSelected));
	});
};