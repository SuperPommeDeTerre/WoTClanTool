var gMaps = null,
	gSortedMaps = [];

function getClanMember(pAccountId) {
	for (var i=0; i<gClanInfos.members.length; i++) {
		if (gClanInfos.members[i].account_id == pAccountId) {
			return gClanInfos.members[i];
		}
	}
};

// Fill the event window and add event handlers
function fillEventDialog(pDialog, pEvents) {
	var myParticipants = [],
		allParticipants = [],
		participantsTanks = {},
		participantsTanksAdditionalInfos = {},
		gOffsetListParticipants = null,
		gEventStartDate = 0,
		gEventEndDate = 0,
		gModifyPanel = pDialog.find('.eventDetailsModify'),
		gDisplayPanel = pDialog.find('.eventDetailsDisplay');

	function loadTanks() {
		// Load tankopedia if it is not loaded
		if (gTankopedia == null) {
			$.post(gConfig.WG_API_URL + 'wot/encyclopedia/vehicles/', {
				application_id: gConfig.WG_APP_ID,
				access_token: gConfig.ACCESS_TOKEN,
				language: gConfig.LANG
			}, function(dataTankopediaResponse) {
				gTankopedia = dataTankopediaResponse.data;
				doFillTanks();
			}, 'json');
		} else {
			doFillTanks();
		}
	}

	function doFillMapsInfos(pStratProps) {
		if (pStratProps.mapName != '') {
			var myStratLinkContainer = gDisplayPanel.find('.eventStrategy'),
				myMapInfos = gMaps[pStratProps.mapName],
				myMapThumb = myMapInfos.file.substring(0, myMapInfos.file.lastIndexOf('.')) + '_thumb' + myMapInfos.file.substring(myMapInfos.file.lastIndexOf('.'));
			gDisplayPanel.find('#eventMapThumb').data('map', pStratProps.mapName).attr('src', './res/wot/maps/' + myMapThumb).attr('alt', i18n.t('strat.maps.' + pStratProps.mapName)).next().text(i18n.t('strat.maps.' + pStratProps.mapName));
			gDisplayPanel.find('.eventMapSize').text(i18n.t('install.strategies.maps.size') + ': ' + i18n.t('install.strategies.maps.metrics', { sizex: myMapInfos.size.x, sizey: myMapInfos.size.y }));
			gDisplayPanel.find('.eventMapType').text(i18n.t('strat.camos.title') + ': ' + i18n.t('strat.camos.' + myMapInfos.camo));
			myStratLinkContainer.data('stratid', pStratProps.strategyId);
			if (pStratProps.strategyId != -1 && pStratProps.strategyId != '') {
				myStratLinkContainer.show().children().text(i18n.t('event.strat')).attr('href', './strats/show/' + pStratProps.strategyId);
			} else {
				myStratLinkContainer.hide();
			}
			gDisplayPanel.find('.eventMap').show();
		} else {
			gDisplayPanel.find('.eventMap').hide();
		}
	}

	function doFillTanks() {
		pDialog.find('.eventParticipantsList [data-player-id] .tank').each(function(idx, elem) {
			var myElemHtml = '',
				myElem = $(elem),
				tankId = myElem.data('tank-id') * 1,
				playerTanksAdditionalInfos = participantsTanksAdditionalInfos[myElem.parent().data('player-id')],
				playerTankAdditionalInfos = {};
			for (var i=0; i<playerTanksAdditionalInfos.length; i++) {
				playerTankAdditionalInfos = playerTanksAdditionalInfos[i];
				if (playerTankAdditionalInfos.tank_id == tankId) {
					myElemHtml += '<span class="playerTank" data-tank-id="' + tankId + '"><img src="' + gTankopedia[tankId].images.contour_icon + '" /><span class="label label-' + getWN8Class(playerTankAdditionalInfos.wn8) + '">' + (Math.round(playerTankAdditionalInfos.wn8 * 100) / 100) + '</span> ' + gTankopedia[tankId].name + '</span>';
					break;
				}
			}
			if (myElemHtml != '') {
				myElem.html(myElemHtml);
			}
		});
	};

	// Loads maps
	if (gMaps == null) {
		$.ajax({
			url: './res/wot/game.json',
			method: 'POST',
			data: {},
			async: false,
			dataType: 'json',
			success: function(dataMaps) {
				gMaps = dataMaps.maps;
				gSortedMaps = Object.keys(gMaps);
				gSortedMaps.sort(function(a, b) {
					return i18n.t('strat.maps.' + a).localeCompare(i18n.t('strat.maps.' + b));
				});
			}
		});
	}
	pDialog.i18n();
	gEventStartDate = moment(pDialog.find('.eventStartDate').data('date') * 1);
	gEventEndDate = moment(pDialog.find('.eventEndDate').data('date') * 1);
	$.material.init(pDialog);
	if (gDisplayPanel.find('#eventMapThumb').data('map') != '') {
		var mapName = gDisplayPanel.find('#eventMapThumb').data('map'),
			myMapInfos = gMaps[mapName],
			myMapThumb = myMapInfos.file.substring(0, myMapInfos.file.lastIndexOf('.')) + '_thumb' + myMapInfos.file.substring(myMapInfos.file.lastIndexOf('.')),
			myStratLinkContainer = gDisplayPanel.find('.eventStrategy');
		gDisplayPanel.find('#eventMapThumb').attr('src', './res/wot/maps/' + myMapThumb).attr('alt', i18n.t('strat.maps.' + mapName)).next().text(i18n.t('strat.maps.' + mapName));
		gDisplayPanel.find('.eventMapSize').text(i18n.t('install.strategies.maps.size') + ': ' + i18n.t('install.strategies.maps.metrics', { sizex: myMapInfos.size.x, sizey: myMapInfos.size.y }));
		gDisplayPanel.find('.eventMapType').text(i18n.t('strat.camos.title') + ': ' + i18n.t('strat.camos.' + myMapInfos.camo));
		if ((typeof(myStratLinkContainer.data('stratid')) === 'number' && myStratLinkContainer.data('stratid') != -1)
				|| (typeof(myStratLinkContainer.data('stratid')) !== 'number' && myStratLinkContainer.data('stratid') != '-1' && myStratLinkContainer.data('stratid') != '')) {
			myStratLinkContainer.show().children().text(i18n.t('event.strat')).attr('href', './strats/show/' + myStratLinkContainer.data('stratid'));
		} else {
			myStratLinkContainer.hide();
		}
		gDisplayPanel.find('.eventMap').show();
	} else {
		gDisplayPanel.find('.eventMap').hide();
	}
	pDialog.find('.eventParticipantsList [data-player-id]').each(function(idx, elem) {
		var myParticipantId = $(elem).data('player-id');
		allParticipants.push(myParticipantId);
		// Don't get players infos that are already available
		if (typeof(gDataPlayers[myParticipantId]) === 'undefined') {
			myParticipants.push(myParticipantId);
		} else {
			for (var j=0; j<gClanInfos.members.length; j++) {
				clanMemberInfo = gClanInfos.members[j];
				if (clanMemberInfo.account_id == myParticipantId) {
					$('.eventParticipantsList [data-player-id="' + myParticipantId + '"] .participant').html('<span class="role role_' + clanMemberInfo.role + '">' + gDataPlayers[myParticipantId].nickname + '</span>');
					break;
				}
			}
		}
	});
	pDialog.find('#btnAddReplay').on('click', function(evt) {
		evt.preventDefault();
		var myButton = $(this);
		myButton.hide();
		myButton.after('<div class="pull-right form-inline form-group"><input type="text" class="form-control" placeholder="Replay URL" /><button class="btn btn-default" id="btnAddReplayOk"><span class="glyphicon glyphicon-ok"></button></div>');
		myButton.parent().find('#btnAddReplayOk').on('click', function(evtAddReplay) {
			evtAddReplay.preventDefault();
			var myButtonAddReplay = $(this),
				myRegexURL = /(http(s?))\:\/\//gi;
			if (myRegexURL.test(myButtonAddReplay.prev().val())) {
				// Analyse replay
				$.get('./server/getreplay.php', { url: myButtonAddReplay.prev().val() }, function(response) {
					var myReplayResponse = $(this.contentWindow.document).contents(),
						myPlayer = myReplayResponse.find('.combat_effect .result_map_user_name, .personal .result-left .username').text();
						//.wtst_team .wtst_half__left [uid]
					alert(myPlayer);
					// Add replay link to players table
					// .html('<a href="' + myButtonAddReplay.prev().val() + '"><span class="glyphicon glyphicon-film"></span></a>');
				}, 'html')
				.always(function() {
					myButton.show();
					myButton.next().remove();
				});
			} else {
				myButton.show();
				myButton.next().remove();
			}
		});
	});
	if (myParticipants.length > 0) {
		$.post(gConfig.WG_API_URL + 'wot/account/info/', {
			application_id: gConfig.WG_APP_ID,
			language: gConfig.G_API_LANG,
			access_token: gConfig.ACCESS_TOKEN,
			fields: 'nickname',
			account_id: myParticipants.join(',')
		}, function(dataParticipantResponse) {
			var dataParticipants = dataParticipantResponse.data;
			for (var participantId in dataParticipants) {
				pDialog.find('.eventParticipantsList [data-player-id="' + participantId + '"] .participant').text(dataParticipants[participantId].nickname);
			}
		}, 'json');
	}
	if (allParticipants.length > 0) {
		pDialog.find('.eventParticipantsList .noparticipant').hide();
		$.post(gConfig.WG_API_URL + 'wot/account/tanks/', {
			application_id: gConfig.WG_APP_ID,
			language: gConfig.G_API_LANG,
			access_token: gConfig.ACCESS_TOKEN,
			account_id: allParticipants.join(',')
		}, function(playerTanksResponse) {
			participantsTanks = playerTanksResponse.data;
			$.post('./server/player.php', {
				action: 'gettanksstats',
				account_id: allParticipants.join(',')
			}, function(dataStoredPlayersTanksResponse) {
				participantsTanksAdditionalInfos = dataStoredPlayersTanksResponse.data;
				loadTanks();
			}, 'json');
		}, 'json');
	} else {
		loadTanks();
	}
	// Handle deletion of an event
	pDialog.find('#btnDeleteEvent').on('click', function(evt) {
		evt.preventDefault();
		$.post('./server/calendar.php', {
			a: 'delete',
			eventId: $(this).data('event-id')
		}, function(deleteResponse) {
			// Handle result
			if (deleteResponse.result == 'ok') {
				// Hide dialog
				$('#events-modal').modal('hide');
				// Refresh calendar
				if (gCalendar != null) {
					gCalendar.view();
				}
			}
		}, 'json');
	});
	// Handle click on modify event button
	pDialog.find('#btnModifyEvent').on('click', function(evt) {
		evt.preventDefault();
		// Fill modify panel if empty
		if (gModifyPanel.html() == '') {
			var modifyPanelHtml = '',
				currentType = pDialog.find('.eventDetails').data('event-type'),
				curMapName = gDisplayPanel.find('#eventMapThumb').data('map'),
				curStratId = gDisplayPanel.find('.eventStrategy').data('stratid');
			modifyPanelHtml += '<input id="modifyEventTitle" type="text" class="form-control" placeholder="' + i18n.t('action.calendar.prop.title') + '" aria-describedby="sizing-addon1" value="' + pDialog.find('.modal-header h3 .eventTitle').text() + '" />';
			modifyPanelHtml += '<textarea id="modifyEventDescription" class="form-control" placeholder="' + i18n.t('action.calendar.prop.description') + '" aria-describedby="sizing-addon1">' + pDialog.find('.eventDescription').text() + '</textarea>';
			modifyPanelHtml += '<div class="container-fluid">';
			modifyPanelHtml += '<div class="row">';
			modifyPanelHtml += '<div class="col-xs-6">';
			modifyPanelHtml += '<div class="input-group date eventDatePicker" id="modifyEventStartDate">';
			modifyPanelHtml += '<input type="text" class="form-control" placeholder="' + i18n.t('action.calendar.prop.startdate') + '" value="' + gEventStartDate.format('LL') + '" />';
			modifyPanelHtml += '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="col-xs-6">';
			modifyPanelHtml += '<div class="input-group date eventTimePicker" id="modifyEventStartTime">';
			modifyPanelHtml += '<input type="text" class="form-control" placeholder="' + i18n.t('action.calendar.prop.starttime') + '" value="' + gEventStartDate.format('LT') + '" />';
			modifyPanelHtml += '<span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="row">';
			modifyPanelHtml += '<div class="col-xs-6">';
			modifyPanelHtml += '<div class="input-group date eventDatePicker hidden" id="modifyEventEndDate">';
			modifyPanelHtml += '<input type="text" class="form-control" placeholder="' + i18n.t('action.calendar.prop.enddate') + '" value="' + gEventEndDate.format('LL') + '" />';
			modifyPanelHtml += '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="col-xs-6">';
			modifyPanelHtml += '<div class="input-group date eventTimePicker" id="modifyEventEndTime">';
			modifyPanelHtml += '<input type="text" class="form-control" placeholder="' + i18n.t('action.calendar.prop.endtime') + '" value="' + gEventEndDate.format('LT') + '" />';
			modifyPanelHtml += '<span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="togglebutton">';
			modifyPanelHtml += '<label><span>' + i18n.t('action.calendar.prop.allowspare') + '</span>';
			modifyPanelHtml += '<input type="checkbox" id="modifyEventSpareAllowed" value="true"' + (pDialog.find('.btnEnrol[data-attendance="spare"]').is(':visible')?' checked="checked"':'') + ' />';
			modifyPanelHtml += '</label>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="container-fluid">';
			modifyPanelHtml += '<div class="row">';
			modifyPanelHtml += '<div class="col-md-6 col-xs-6 col-lg-6">';
			modifyPanelHtml += '<div class="input-group">';
			modifyPanelHtml += '<div class="eventType">';
			modifyPanelHtml += '<h4>' + i18n.t('action.calendar.prop.type') + '</h4>';
			modifyPanelHtml += '<div class="radio radio-material-black"><label><input type="radio"' + (currentType=='clanwar'?' checked="checked"':'') + ' value="clanwar" name="modifyEventType"><abbr>' + i18n.t('action.calendar.prop.types.clanwar') + '</abbr></label></div>';
			modifyPanelHtml += '<div class="radio radio-material-red-800"><label><input type="radio"' + (currentType=='compa'?' checked="checked"':'') + ' value="compa" name="modifyEventType"><abbr>' + i18n.t('action.calendar.prop.types.compa') + '</abbr></label></div>';
			modifyPanelHtml += '<div class="radio radio-material-purple-600"><label><input type="radio"' + (currentType=='stronghold'?' checked="checked"':'') + ' value="stronghold" name="modifyEventType"><abbr>' + i18n.t('action.calendar.prop.types.stronghold') + '</abbr></label></div>';
			modifyPanelHtml += '<div class="radio radio-material-blue-700"><label><input type="radio"' + (currentType=='7vs7'?' checked="checked"':'') + ' value="7vs7" name="modifyEventType"><abbr>' + i18n.t('action.calendar.prop.types.7vs7') + '</abbr></label></div>';
			modifyPanelHtml += '<div class="radio radio-material-green-600"><label><input type="radio"' + (currentType=='training'?' checked="checked"':'') + ' value="training" name="modifyEventType"><abbr>' + i18n.t('action.calendar.prop.types.training') + '</abbr></label></div>';
			modifyPanelHtml += '<div class="radio radio-material-grey-500"><label><input type="radio"' + (currentType=='other'?' checked="checked"':'') + ' value="other" name="modifyEventType"><abbr>' + i18n.t('action.calendar.prop.types.other') + '</abbr></label></div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="col-md-6 col-xs-6 col-lg-6">';
			modifyPanelHtml += '<h4>' + i18n.t('strat.map.select') + '</h4>';
			modifyPanelHtml += '<select class="form-control" id="modifyEventMapName">';
			modifyPanelHtml += '<option value=""' + (curMapName!=''?'':' selected="selected"') + '></option>';
			for (var mapIndex in gSortedMaps) {
				var mapName = gSortedMaps[mapIndex],
					myMapInfos = gMaps[mapName];
				modifyPanelHtml += '<option value="' + mapName + '"' + (curMapName!=mapName?'':' selected="selected"') + '>' + i18n.t('strat.maps.' + mapName) + '</option>';
			}
			modifyPanelHtml += '</select>';
			modifyPanelHtml += '<img src="" alt="" class="img-thumbnail" />';
			modifyPanelHtml += '<h4>' + i18n.t('event.strat') + '</h4>';
			modifyPanelHtml += '<select class="form-control" id="modifyEventStrategy">';
			modifyPanelHtml += '<option value="-1"' + (curStratId!=-1?'':' selected="selected"') + '></option>';
			modifyPanelHtml += '</select>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			//modifyPanelHtml += '<button type="button" id="modifyEventOk" class="btn btn-default btn-success">' + i18n.t('btn.ok') + '</button>';
			$('#btnModifyEventOk').removeClass('hidden');
			gModifyPanel.html(modifyPanelHtml);
			$.material.init(gModifyPanel);
			// Init date time pickers
			gModifyPanel.find('#modifyEventStartDate').datetimepicker({
				locale: gConfig.LANG,
				format: 'LL',
				defaultDate: gEventStartDate
			});
			gModifyPanel.find('#modifyEventEndDate').datetimepicker({
				locale: gConfig.LANG,
				format: 'LL',
				defaultDate: gEventEndDate
			});
			gModifyPanel.find('#modifyEventStartTime').datetimepicker({
				locale: gConfig.LANG,
				format: 'LT',
				defaultDate: gEventStartDate
			});
			gModifyPanel.find('#modifyEventEndTime').datetimepicker({
				locale: gConfig.LANG,
				format: 'LT',
				defaultDate: gEventEndDate
			});

			// Handle min and max dates
			gModifyPanel.find('#modifyEventStartDate').on('dp.change', function(e) {
				if ($(this).val() == '') {
					gModifyPanel.find('#modifyEventEndDate').data('DateTimePicker').minDate($(this).data('DateTimePicker').date());
				} else {
					gModifyPanel.find('#modifyEventEndDate').data('DateTimePicker').minDate(e.date);
				}
			}).trigger('dp.change');
			gModifyPanel.find('#modifyEventEndDate').on('dp.change', function(e) {
				if ($(this).val() == '') {
					gModifyPanel.find('#modifyEventStartDate').data('DateTimePicker').maxDate(false);
				} else {
					gModifyPanel.find('#modifyEventStartDate').data('DateTimePicker').maxDate(e.date);
				}
			}).trigger('dp.change');
			gModifyPanel.find('#modifyEventStartTime').on('dp.change', function(e) {
				if ($(this).val() == '') {
					gModifyPanel.find('#modifyEventEndTime').data('DateTimePicker').minDate($(this).data('DateTimePicker').date());
				} else {
					gModifyPanel.find('#modifyEventEndTime').data('DateTimePicker').minDate(e.date);
				}
			}).trigger('dp.change');
			gModifyPanel.find('#modifyEventEndTime').on('dp.change', function(e) {
				if ($(this).val() == '') {
					gModifyPanel.find('#modifyEventStartTime').data('DateTimePicker').maxDate(false);
				} else {
					gModifyPanel.find('#modifyEventStartTime').data('DateTimePicker').maxDate(e.date);
				}
			}).trigger('dp.change');
			gModifyPanel.find('#modifyEventStartDate input, #modifyEventEndDate input, #modifyEventStartTime input, #modifyEventEndTime input').on('focus', function(evt) {
				$(this).closest('.date').data('DateTimePicker').show();
			});
			gModifyPanel.find('#modifyEventMapName').on('change', function(evt) {
				var stratsSelect = $('#modifyEventStrategy');
				if ($(this).val() != '') {
					var mySelect = $(this),
						myMapInfos = gMaps[mySelect.val()],
						myMapThumb = myMapInfos.file.substring(0, myMapInfos.file.lastIndexOf('.')) + '_thumb' + myMapInfos.file.substring(myMapInfos.file.lastIndexOf('.'));
					mySelect.parent().next().attr('src', './res/wot/maps/' + myMapThumb).attr('alt', i18n.t('strat.maps.' + mySelect.val()));
					$.post('./server/strat.php', {
						action: 'list',
						filtername: 'valid'
					}, function(getStratsResponse) {
						var stratsList = getStratsResponse.data,
							stratsSelectOptions = '<option value="-1"' + (curStratId!=-1?'':' selected="selected"') + '></option>',
							myStrat = {};
						if (stratsList.length > 0) {
							for (var i=0; i<stratsList.length; i++) {
								myStrat = stratsList[i];
								if (myStrat.map == mySelect.val()) {
									stratsSelectOptions += '<option value="' + myStrat.id + '"' + (curStratId!=myStrat.id?'':' selected="selected"') + '>' + myStrat.name + '</option>';
								}
							}
						}
						stratsSelect.html(stratsSelectOptions);
					}, 'json');
				} else {
					stratsSelect.html('<option value="-1" selected="selected"></option>').val('');
				}
			});
			if (curMapName != '') {
				gModifyPanel.find('#modifyEventMapName').change();
			}
		}
		gDisplayPanel.hide();
		gModifyPanel.fadeIn('fast');
	});
	$('#btnModifyEventOk').on('click', function(evt) {
		// Prevent default action of button
		evt.preventDefault();
		gModifyPanel = pDialog.find('.eventDetailsModify');
		var lStartDate = gModifyPanel.find('#modifyEventStartDate').data('DateTimePicker').date(),
			lStartTime = gModifyPanel.find('#modifyEventStartTime').data('DateTimePicker').date(),
			lEndDate = gModifyPanel.find('#modifyEventEndDate').data('DateTimePicker').date(),
			lEndTime = gModifyPanel.find('#modifyEventEndTime').data('DateTimePicker').date(),
			startDateToSent = lStartDate,
			endDateToSent = lEndDate;
		// Compute start and end final dates.
		startDateToSent = startDateToSent.hour(lStartTime.hour());
		startDateToSent = startDateToSent.minute(lStartTime.minute());
		endDateToSent = moment(lStartDate);
		endDateToSent = endDateToSent.hour(lEndTime.hour());
		endDateToSent = endDateToSent.minute(lEndTime.minute());
		// Post data to server
		$.post('./server/calendar.php', {
			a: 'save',
			eventId: pDialog.find('.eventDetails').data('event-id'),
			eventTitle: $('#modifyEventTitle').val(),
			eventType: $('[name=modifyEventType]:checked').val(),
			eventDescription: $('#modifyEventDescription').val(),
			eventStartDate: startDateToSent.unix(),
			eventEndDate: endDateToSent.unix(),
			eventAllowSpare: $('#modifyEventSpareAllowed').is(':checked'),
			eventMapName: $('#modifyEventMapName').val(),
			eventStrategyId: $('#modifyEventStrategy').val()
		}, function(addEventResult) {
			// Handle result
			if (addEventResult.result == 'ok') {
				// Update display pane
				var myResultEvent = addEventResult.data[0];
				pDialog.find('.modal-header h3 .eventTitle').text(myResultEvent.title);
				pDialog.find('.eventDetails').data('event-type', myResultEvent.type);
				gDisplayPanel.find('.eventDescription').text(myResultEvent.description);
				pDialog.find('.eventStartDate').data('date', myResultEvent.start).text(moment(myResultEvent.start * 1).format('LT'));
				pDialog.find('.eventEndDate').data('date', myResultEvent.end).text(moment(myResultEvent.end * 1).format('LT'));
				if (myResultEvent.spareallowed) {
					pDialog.find('.btnEnrol[data-attendance="spare"]').show();
				} else {
					pDialog.find('.btnEnrol[data-attendance="spare"]').hide();
				}
				doFillMapsInfos(myResultEvent);
				// Show display pane
				$('#btnModifyEventOk').addClass('hidden');
				gModifyPanel.hide();
				gDisplayPanel.fadeIn('fast');
				// Refresh calendar
				if (typeof(gCalendar) != 'undefined') {
					gCalendar.view();
				}
			}
		}, 'json');
	});
	// Handle enrolment
	pDialog.find('.btnEnrol').on('click', function(evt) {
		evt.preventDefault();
		var myButton = $(this);
		if (!myButton.hasClass('active')) {
			$.post('./server/calendar.php', {
				a: 'enrol',
				eventId: myButton.data('event-id'),
				attendance: myButton.data('attendance')
			}, function(enrolResponse) {
				if (enrolResponse.result == 'ok') {
					var myEnrolChooseContainer = myButton.closest('div');
					myEnrolChooseContainer.find('.active').removeClass('active');
					myButton.addClass('active');
					pDialog.find('.eventEnrolment').text(i18n.t('event.enrol.state.' + myButton.data('attendance')));
					// Handle new attendance state
					if (myButton.data('attendance') == 'no') {
						pDialog.find('.eventParticipantsList [data-player-id="' + gConfig.PLAYER_ID + '"]').remove();
						pDialog.find('.eventParticipantTanks').remove();
						if (pDialog.find('.eventParticipantsList [data-player-id="' + gConfig.PLAYER_ID + '"]').length == 0) {
							pDialog.find('.eventParticipantsList .noparticipant').show();
						}
					} else {
						var myCurrentPlayerInfos = pDialog.find('.eventParticipantsList [data-player-id="' + gConfig.PLAYER_ID + '"] .participant');
						pDialog.find('.eventParticipantsList .noparticipant').hide();
						if (myCurrentPlayerInfos.length > 0) {
							myCurrentPlayerInfos.removeAttr('class');
							myCurrentPlayerInfos.addClass('participant attendance-' + myButton.data('attendance'));
						} else {
							pDialog.find('.eventParticipantsList tbody').append('<tr data-player-id="' + gConfig.PLAYER_ID + '"><td class="participant attendance-' + myButton.data('attendance') + '"><span class="role role_' + getClanMember(gConfig.PLAYER_ID).role + '">' + gPersonalInfos.nickname
								+ '</span></td><td class="tank">' + i18n.t('event.notank') + '</td></tr>');
						}
					}
				}
			}, 'json');
		}
	});
	if (gEventStartDate.isAfter(moment())) {
		pDialog.find('.eventParticipantsList').on('click', '.participant', function(evt) {
			if (gOffsetListParticipants == null) {
				gOffsetListParticipants = pDialog.find('.eventParticipantsList tbody').offset();
			}
			var myPlayerItem = $(this).parent();
			if (myPlayerItem.hasClass('active')) {
				pDialog.find('.eventParticipantTanks').remove();
				myPlayerItem.removeClass('active');
			} else {
				myPlayerItem.siblings().removeClass('active');
				var curPlayerId = myPlayerItem.data('player-id'),
					playerTanks = participantsTanks[curPlayerId],
					playersInfos = gDataPlayers[curPlayerId],
					playerTanksAdditionalInfos = participantsTanksAdditionalInfos[curPlayerId],
					tanksInfos = {},
					myElemOffset = myPlayerItem.offset(),
					listTanksHtml = '';
				// Allow selection of tanks only for self, event creator, intelligence officer or higher role.
				if (curPlayerId == gConfig.PLAYER_ID
						|| gConfig.PLAYER_ID == pDialog.find('.eventDetails').data('owner')
						|| gROLE_POSITION[getClanMember(gConfig.PLAYER_ID).role] <= gROLE_POSITION['intelligence_officer']) {
					listTanksHtml += '<style type="text/css">';
					listTanksHtml += '.eventParticipantTanks{position:absolute}';
					listTanksHtml += '.eventParticipantTanks:after{top:' + Math.floor(myElemOffset.top + 5 - gOffsetListParticipants.top + 1) + 'px}';
					listTanksHtml += '.eventParticipantTanks:before{top:' + Math.floor(myElemOffset.top + 5 - gOffsetListParticipants.top) + 'px}';
					listTanksHtml += '</style>';
					listTanksHtml += '<div class="eventParticipantTanks">';
					listTanksHtml += '<div style="overflow-y:auto;height:100%">';
					listTanksHtml += '<ul class="list-unstyled">';
					if (typeof(playerTanksAdditionalInfos) == 'undefined') {
						$.ajax({
							url: gConfig.WG_API_URL + 'wot/account/tanks/',
							method: 'POST',
							data: {
								application_id: gConfig.WG_APP_ID,
								language: gConfig.G_API_LANG,
								access_token: gConfig.ACCESS_TOKEN,
								account_id: curPlayerId
							},
							async: false,
							dataType: 'json',
							success: function(playerTanksResponse) {
								participantsTanks[curPlayerId] = playerTanksResponse.data[curPlayerId];
								$.ajax({
									url: './server/player.php',
									method: 'POST',
									data: {
										action: 'gettanksstats',
										account_id: curPlayerId
									},
									async: false,
									dataType: 'json',
									success: function(dataStoredPlayersTanksResponse) {
										participantsTanksAdditionalInfos[curPlayerId] = dataStoredPlayersTanksResponse.data[curPlayerId];
										playerTanksAdditionalInfos = participantsTanksAdditionalInfos[curPlayerId];
									}
								});
							}
						});
					}
					playerTanksAdditionalInfos.sort(function(a, b) {
						return (gTankopedia[b.tank_id].tier - gTankopedia[a.tank_id].tier);
					});
					for (var i=0; i<playerTanksAdditionalInfos.length; i++) {
						var playerTankAdditionalInfos = playerTanksAdditionalInfos[i];
						if (playerTankAdditionalInfos.in_garage && playerTankAdditionalInfos.is_ready) {
							listTanksHtml += '<li><span class="playerTank" data-tank-id="' + playerTankAdditionalInfos.tank_id + '"><img src="' + gTankopedia[playerTankAdditionalInfos.tank_id].images.contour_icon + '" /><span class="label label-' + getWN8Class(playerTankAdditionalInfos.wn8) + '">' + (Math.round(playerTankAdditionalInfos.wn8 * 100) / 100) + '</span> ' + gTankopedia[playerTankAdditionalInfos.tank_id].short_name + '</span></li>';
						}
					}
					listTanksHtml += '</ul>';
					listTanksHtml += '</div>';
					listTanksHtml += '</div>';
					pDialog.find('.eventDetailsDisplay').append(listTanksHtml);
					pDialog.find('.eventParticipantTanks').offset({top: gOffsetListParticipants.top, left: pDialog.find('.eventLineUp').offset().left - 20}).height(pDialog.find('.modal-footer').offset().top - gOffsetListParticipants.top);
					myPlayerItem.addClass('active');
					pDialog.find('.eventParticipantTanks .playerTank').on('click', function(evt) {
						// Add tank to list
						myPlayerItem.find('.tank').empty().append($(this).detach());
						// Save selection
						$.post('./server/calendar.php', {
							a: 'setparticipanttank',
							eventId: pDialog.find('.eventDetails').data('event-id'),
							playerid: curPlayerId,
							tankid: $(this).data('tank-id')
						}, function(savePlayerTankResponse) {
						}, 'json');
					});
					pDialog.find('.eventParticipantTanks').on('click', function(evt) {
						myPlayerItem.removeClass('active');
						$(this).remove();
					});
				}
			}
		});
	}
};

