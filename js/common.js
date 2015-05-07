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
		gOffsetListTanks = {};

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
					|| gROLE_POSITION[getClanMember(curPlayerId).role] >= gROLE_POSITION['intelligence_officer']) {
				listTanksHtml += '<style type="text/css">';
				listTanksHtml += '.eventParticipantTanks{position:absolute}';
				listTanksHtml += '.eventParticipantTanks:after{top:' + Math.floor(myElemOffset.top - gOffsetListParticipants.top + 1) + 'px}';
				listTanksHtml += '.eventParticipantTanks:before{top:' + Math.floor(myElemOffset.top - gOffsetListParticipants.top) + 'px}';
				listTanksHtml += '</style>';
				listTanksHtml += '<div class="eventParticipantTanks">';
				listTanksHtml += '<div style="overflow-y:auto;height:100%">';
				listTanksHtml += '<ul class="list-unstyled">';
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
};

