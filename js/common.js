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
		gOffsetListParticipants = {},
		gOffsetListTanks = {},
		gEventStartDate = 0,
		gEventEndDate = 0,
		gModifyPanel = pDialog.find('.eventDetailsModify'),
		gDisplayPanel = pDialog.find('.eventDetailsDisplay');

	function loadTanks() {
		// Load tankopedia if it is not loaded
		if (gTankopedia == null) {
			$.post(gConfig.WG_API_URL + 'wot/encyclopedia/tanks/', {
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

	function doFillTanks() {
		pDialog.find('.eventLineUp [data-player-id]').each(function(idx, elem) {
			var myElemHtml = '',
				myElem = $(elem),
				tankId = myElem.data('tank-id') * 1,
				playerTanksAdditionalInfos = participantsTanksAdditionalInfos[myElem.data('player-id')],
				playerTankAdditionalInfos = {};
			for (var i=0; i<playerTanksAdditionalInfos.length; i++) {
				playerTankAdditionalInfos = playerTanksAdditionalInfos[i];
				if (playerTankAdditionalInfos.tank_id == tankId) {
					myElemHtml += '<span class="playerTank" data-tank-id="' + tankId + '"><img src="' + gTankopedia[tankId].contour_image + '" /><span class="label label-' + getWN8Class(playerTankAdditionalInfos.wn8) + '">' + (Math.round(playerTankAdditionalInfos.wn8 * 100) / 100) + '</span> ' + gTankopedia[tankId].name_i18n + '</span>';
					break;
				}
			}
			if (myElemHtml != '') {
				myElem.html(myElemHtml);
			}
		});
	};

	pDialog.i18n();
	$("[data-date]").each(function(idx, elem) {
		var myElem = $(elem);
		myElem.siblings('.date').text(moment(myElem.data('date')).format('LLL'));
		if (myElem.parent().hasClass('eventStartDate')) {
			gEventStartDate = moment(myElem.data('date'));
		} else if (myElem.parent().hasClass('eventEndDate')) {
			gEventEndDate = moment(myElem.data('date'));
		}
	});
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
					$('.eventParticipantsList [data-player-id="' + myParticipantId + '"]').html('<span class="role role_' + clanMemberInfo.role + '">' + gDataPlayers[myParticipantId].nickname + '</span>');
					break;
				}
			}
		}
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
				pDialog.find('.eventParticipantsList [data-player-id="' + participantId + '"]').text(dataParticipants[participantId].nickname);
			}
		}, 'json');
	}
	if (allParticipants.length > 0) {
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
				currentType = pDialog.find('.eventDetails').data('event-type');
			modifyPanelHtml += '<input id="modifyEventTitle" type="text" class="form-control" placeholder="' + i18n.t('action.calendar.prop.title') + '" aria-describedby="sizing-addon1" value="' + pDialog.find('.modal-header h3').text() + '" />';
			modifyPanelHtml += '<textarea id="modifyEventDescription" class="form-control" placeholder="' + i18n.t('action.calendar.prop.description') + '" aria-describedby="sizing-addon1">' + pDialog.find('.eventDescription').text() + '</textarea>';
			modifyPanelHtml += '<div class="input-group date eventDateTimePicker" id="modifyEventStartDate">';
			modifyPanelHtml += '<input type="text" class="form-control" placeholder="' + i18n.t('action.calendar.prop.startdate') + '" value="' + gEventStartDate.format('LLL') + '" />';
			modifyPanelHtml += '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="input-group date eventDateTimePicker" id="modifyEventEndDate">';
			modifyPanelHtml += '<input type="text" class="form-control" placeholder="' + i18n.t('action.calendar.prop.enddate') + '" value="' + gEventEndDate.format('LLL') + '" />';
			modifyPanelHtml += '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="togglebutton">';
			modifyPanelHtml += '<label><span>' + i18n.t('action.calendar.prop.allowspare') + '</span>';
			modifyPanelHtml += '<input type="checkbox" id="modifyEventSpareAllowed" value="true"' + (pDialog.find('.btnEnrol[data-attendance="spare"]').is(':visible')?' checked="checked"':'') + ' />';
			modifyPanelHtml += '</label>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="input-group">';
			modifyPanelHtml += '<div class="eventType">';
			modifyPanelHtml += '<h5>' + i18n.t('action.calendar.prop.type') + '</h5>';
			modifyPanelHtml += '<div class="radio radio-material-black"><label><input type="radio"' + (currentType=='clanwar'?' checked="checked"':'') + ' value="clanwar" name="modifyEventType"><abbr>' + i18n.t('action.calendar.prop.types.clanwar') + '</abbr></label></div>';
			modifyPanelHtml += '<div class="radio radio-material-red-800"><label><input type="radio"' + (currentType=='compa'?' checked="checked"':'') + ' value="compa" name="modifyEventType"><abbr>' + i18n.t('action.calendar.prop.types.compa') + '</abbr></label></div>';
			modifyPanelHtml += '<div class="radio radio-material-purple-600"><label><input type="radio"' + (currentType=='stronghold'?' checked="checked"':'') + ' value="stronghold" name="modifyEventType"><abbr>' + i18n.t('action.calendar.prop.types.stronghold') + '</abbr></label></div>';
			modifyPanelHtml += '<div class="radio radio-material-blue-700"><label><input type="radio"' + (currentType=='7vs7'?' checked="checked"':'') + ' value="7vs7" name="modifyEventType"><abbr>' + i18n.t('action.calendar.prop.types.7vs7') + '</abbr></label></div>';
			modifyPanelHtml += '<div class="radio radio-material-green-600"><label><input type="radio"' + (currentType=='training'?' checked="checked"':'') + ' value="training" name="modifyEventType"><abbr>' + i18n.t('action.calendar.prop.types.training') + '</abbr></label></div>';
			modifyPanelHtml += '<div class="radio radio-material-grey-500"><label><input type="radio"' + (currentType=='other'?' checked="checked"':'') + ' value="other" name="modifyEventType"><abbr>' + i18n.t('action.calendar.prop.types.other') + '</abbr></label></div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<button type="button" id="modifyEventOk" class="btn btn-default btn-success">' + i18n.t('btn.ok') + '</button>';
			gModifyPanel.html(modifyPanelHtml);
			$.material.init(modifyPanelHtml);
			// Init date time pickers
			gModifyPanel.find('.eventDateTimePicker').datetimepicker({
				locale: gConfig.LANG,
				stepping: 5,
				format: 'LLL',
				sideBySide: true,
				minDate: moment()
			});
			// Handle min and max dates
			gModifyPanel.find('#modifyEventStartDate').on('dp.change', function (e) {
				gModifyPanel.find('#modifyEventEndDate').data('DateTimePicker').minDate(e.date);
			});
			gModifyPanel.find('#modifyEventEndDate').on('dp.change', function (e) {
				gModifyPanel.find('#modifyEventStartDate').data('DateTimePicker').maxDate(e.date);
			});
			gModifyPanel.find('#modifyEventOk').on('click', function(evt) {
				// Prevent default action of button
				evt.preventDefault();
				// Post data to server
				$.post('./server/calendar.php', {
					a: 'save',
					eventId: pDialog.find('.eventDetails').data('event-id'),
					eventTitle: $('#modifyEventTitle').val(),
					eventType: $('[name=modifyEventType]:checked').val(),
					eventDescription: $('#modifyEventDescription').val(),
					eventStartDate: moment($('#modifyEventStartDate input').val(), 'LLL').unix(),
					eventEndDate: moment($('#modifyEventEndDate input').val(), 'LLL').unix(),
					eventAllowSpare: $('#modifyEventSpareAllowed').is(':checked')
				}, function(addEventResult) {
					// Handle result
					if (addEventResult.result == 'ok') {
						// Update display pane
						pDialog.find('.modal-header h3').text(addEventResult.data.title);
						pDialog.find('.eventDetails').data('event-type', addEventResult.data.type);
						gDisplayPanel.find('.eventDescription').text(addEventResult.data.description);
						gDisplayPanel.find('.eventStartDate').data('date', addEventResult.data.start).find('.date').text(moment(addEventResult.data.start * 1).format('LLL'));
						gDisplayPanel.find('.eventEndDate').data('date', addEventResult.data.end).find('.date').text(moment(addEventResult.data.end * 1).format('LLL'));
						if (addEventResult.data.spareallowed) {
							pDialog.find('.btnEnrol[data-attendance="spare"]').show();
						} else {
							pDialog.find('.btnEnrol[data-attendance="spare"]').hide();
						}
						// Show display pane
						gModifyPanel.hide();
						gDisplayPanel.fadeIn('fast');
						// Refresh calendar
						if (typeof(gCalendar) != 'undefined') {
							gCalendar.view();
						}
					}
				}, 'json');
			});
		}
		gDisplayPanel.hide();
		gModifyPanel.fadeIn('fast');
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
						pDialog.find('.eventParticipantsList li[data-player-id="' + gConfig.PLAYER_ID + '"], .eventLineUp li[data-player-id="' + gConfig.PLAYER_ID + '"]').remove();
						pDialog.find('.eventParticipantTanks').remove();
					} else {
						var myCurrentPlayerInfos = pDialog.find('.eventParticipantsList li[data-player-id="' + gConfig.PLAYER_ID + '"]');
						if (myCurrentPlayerInfos.length > 0) {
							myCurrentPlayerInfos.removeAttr('class');
							myCurrentPlayerInfos.addClass('attendance-' + myButton.data('attendance'));
						} else {
							pDialog.find('.eventParticipantsList').append('<li data-player-id="' + gConfig.PLAYER_ID + '" class="attendance-' + myButton.data('attendance') + '"><span class="role role_' + getClanMember(gConfig.PLAYER_ID).role + '">' + gPersonalInfos.nickname + '</span></li>');
							pDialog.find('.eventLineUp').append('<li data-player-id="' + gConfig.PLAYER_ID + '">' + i18n.t('event.notank') + '</li>');
						}
					}
				}
			}, 'json');
		}
	});
	gOffsetListParticipants = pDialog.find('.eventParticipantsList').offset();
	gOffsetListTanks = pDialog.find('.eventLineUp').offset();
	if (gEventStartDate.isAfter(moment())) {
		pDialog.find('.eventParticipantsList').on('click', 'li', function(evt) {
			var myPlayerItem = $(this);
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
					listTanksHtml += '.eventParticipantTanks:after{top:' + Math.floor(myElemOffset.top - gOffsetListParticipants.top + 1) + 'px}';
					listTanksHtml += '.eventParticipantTanks:before{top:' + Math.floor(myElemOffset.top - gOffsetListParticipants.top) + 'px}';
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
						return (gTankopedia[b.tank_id].level - gTankopedia[a.tank_id].level);
					});
					for (var i=0; i<playerTanksAdditionalInfos.length; i++) {
						var playerTankAdditionalInfos = playerTanksAdditionalInfos[i];
						if (playerTankAdditionalInfos.in_garage && playerTankAdditionalInfos.is_ready) {
							listTanksHtml += '<li><span class="playerTank" data-tank-id="' + playerTankAdditionalInfos.tank_id + '"><img src="' + gTankopedia[playerTankAdditionalInfos.tank_id].contour_image + '" /><span class="label label-' + getWN8Class(playerTankAdditionalInfos.wn8) + '">' + (Math.round(playerTankAdditionalInfos.wn8 * 100) / 100) + '</span> ' + gTankopedia[playerTankAdditionalInfos.tank_id].name_i18n + '</span></li>';
						}
					}
					listTanksHtml += '</ul>';
					listTanksHtml += '</div>';
					listTanksHtml += '</div>';
					pDialog.find('.eventDetailsDisplay').append(listTanksHtml);
					pDialog.find('.eventParticipantTanks').offset({top: gOffsetListTanks.top, left: gOffsetListTanks.left - 20}).height(pDialog.find('.modal-footer').offset().top - gOffsetListTanks.top);
					myPlayerItem.addClass('active');
					pDialog.find('.eventParticipantTanks .playerTank').on('click', function(evt) {
						// Add tank to list
						$('.eventLineUp li[data-player-id="' + curPlayerId + '"]').empty().append($(this).detach());
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

