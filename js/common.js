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
			myElem.html(myElemHtml);
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
	gOffsetListParticipants = pDialog.find('.eventParticipantsList').offset();
	gOffsetListTanks = pDialog.find('.eventLineUp').offset();
	pDialog.find('.eventParticipantsList li').on('click', function(evt) {
		if (pDialog.find('.eventParticipantTanks').length > 0) {
			pDialog.find('.eventParticipantTanks').remove();
		} else {
			var curPlayerId = $(this).data('player-id'),
				playerTanks = participantsTanks[curPlayerId],
				playersInfos = gDataPlayers[curPlayerId],
				playerTanksAdditionalInfos = participantsTanksAdditionalInfos[curPlayerId],
				tanksInfos = {},
				myElemOffset = $(this).offset(),
				listTanksHtml = '';
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
				$(this).remove();
			});
		}
	});
};

