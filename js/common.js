// Fill the event window and add event handlers
function fillEventDialog(pDialog, pEvents) {
	pDialog.i18n();
	$("[data-date]").each(function(idx, elem) {
		var myElem = $(elem);
		myElem.siblings('.date').text(moment(myElem.data('date')).format('LLL'));
	});
	var myParticipants = [];
	$('[data-player-id]').each(function(idx, elem) {
		var myParticipantId = $(elem).data('player-id');
		// Don't get players infos that are already available
		if (typeof(gDataPlayers[myParticipantId]) === 'undefined') {
			myParticipants.push(myParticipantId);
		} else {
			for (var j=0; j<gClanInfos.members.length; j++) {
				clanMemberInfo = gClanInfos.members[j];
				if (clanMemberInfo.account_id == myParticipantId) {
					$('[data-player-id="' + myParticipantId + '"]').html('<span class="role role_' + clanMemberInfo.role + '">' + gDataPlayers[myParticipantId].nickname + '</span>');
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
				$('[data-player-id="' + participantId + '"]').text(dataParticipants[participantId].nickname);
			}
		}, 'json');
	}
};

// Handle deletion of an event
$(document).on('click', '#btnDeleteEvent', function(evt) {
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
$(document).on('click', '#btnModifyEvent', function(evt) {
	evt.preventDefault();
});
