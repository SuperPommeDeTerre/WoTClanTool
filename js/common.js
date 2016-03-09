var gMaps = null,
	gSortedMaps = [];

function getClanMember(pAccountId) {
	for (var i=0; i<gClanInfos.members.length; i++) {
		if (gClanInfos.members[i].account_id == pAccountId) {
			return gClanInfos.members[i];
		}
	}
};

function getTanksTypesString(pSelectedTypes) {
	var myTypesSelectedString = $.t('tank.alltypes'),
		i = 0;
	if (pSelectedTypes.length > 0 && pSelectedTypes[0] != 'all') {
		// Sort tank types
		pSelectedTypes.sort(function(a, b) {
			var returnVal = 0;
			switch (a) {
				case 'lightTank':
					switch (b) {
						case 'mediumTank':
						case 'heavyTank':
						case 'AT-SPG':
						case 'SPG':
							returnVal = -1;
							break;
					}
					break;
				case 'mediumTank':
					switch (b) {
						case 'lightTank':
							returnVal = 1;
							break;
						case 'heavyTank':
						case 'AT-SPG':
						case 'SPG':
							returnVal = -1;
							break;
					}
					break;
				case 'heavyTank':
					switch (b) {
						case 'lightTank':
						case 'mediumTank':
							returnVal = 1;
							break;
						case 'AT-SPG':
						case 'SPG':
							returnVal = -1;
							break;
					}
					break;
				case 'AT-SPG':
					switch (b) {
						case 'lightTank':
						case 'mediumTank':
						case 'heavyTank':
							returnVal = 1;
							break;
						case 'SPG':
							returnVal = -1;
							break;
					}
					break;
				case 'SPG':
					switch (b) {
						case 'lightTank':
						case 'mediumTank':
						case 'heavyTank':
						case 'AT-SPG':
							returnVal = 1;
							break;
					}
					break;
			}
			return returnVal;
		});
		myTypesSelectedString = '';
		for (i in pSelectedTypes) {
			if (i != 0) {
				myTypesSelectedString += ', ';
			}
			myTypesSelectedString += $.t('tank.type.' + pSelectedTypes[i]);
		}
	}
	return myTypesSelectedString;
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
		gTankLevelsRestriction = ($('.eventDetails').data('restriction-tanklevel') + '').split(/,/g),
		gTankTypesRestriction = ($('.eventDetails').data('restriction-tanktype') + '').split(/,/g),
		gEventType = $('.eventDetails').data('event-type'),
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
			gDisplayPanel.find('#eventMapThumb').data('map', pStratProps.mapName).attr('src', './res/wot/maps/' + myMapThumb).attr('alt', $.t('strat.maps.' + pStratProps.mapName)).next().text($.t('strat.maps.' + pStratProps.mapName));
			gDisplayPanel.find('.eventMapSize').text($.t('install.strategies.maps.size') + ': ' + $.t('install.strategies.maps.metrics', { sizex: myMapInfos.size.x, sizey: myMapInfos.size.y }));
			gDisplayPanel.find('.eventMapType').text($.t('strat.camos.title') + ': ' + $.t('strat.camos.' + myMapInfos.camo));
			myStratLinkContainer.data('stratid', pStratProps.strategyId);
			if (pStratProps.strategyId != -1 && pStratProps.strategyId != '') {
				myStratLinkContainer.show().children().text($.t('event.strat')).attr('href', './strats/show/' + pStratProps.strategyId);
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
					return $.t('strat.maps.' + a).localeCompare($.t('strat.maps.' + b));
				});
			}
		});
	}
	pDialog.localize();
	gEventStartDate = moment(pDialog.find('.eventStartDate').data('date') * 1);
	gEventEndDate = moment(pDialog.find('.eventEndDate').data('date') * 1);
	$.material.init(pDialog);
	if (gDisplayPanel.find('#eventMapThumb').data('map') != '') {
		var mapName = gDisplayPanel.find('#eventMapThumb').data('map'),
			myMapInfos = gMaps[mapName],
			myMapThumb = myMapInfos.file.substring(0, myMapInfos.file.lastIndexOf('.')) + '_thumb' + myMapInfos.file.substring(myMapInfos.file.lastIndexOf('.')),
			myStratLinkContainer = gDisplayPanel.find('.eventStrategy');
		gDisplayPanel.find('#eventMapThumb').attr('src', './res/wot/maps/' + myMapThumb).attr('alt', $.t('strat.maps.' + mapName)).next().text($.t('strat.maps.' + mapName));
		gDisplayPanel.find('.eventMapSize').text($.t('install.strategies.maps.size') + ': ' + $.t('install.strategies.maps.metrics', { sizex: myMapInfos.size.x, sizey: myMapInfos.size.y }));
		gDisplayPanel.find('.eventMapType').text($.t('strat.camos.title') + ': ' + $.t('strat.camos.' + myMapInfos.camo));
		if ((typeof(myStratLinkContainer.data('stratid')) === 'number' && myStratLinkContainer.data('stratid') != -1)
				|| (typeof(myStratLinkContainer.data('stratid')) !== 'number' && myStratLinkContainer.data('stratid') != '-1' && myStratLinkContainer.data('stratid') != '')) {
			myStratLinkContainer.show().children().text($.t('event.strat')).attr('href', './strats/show/' + myStratLinkContainer.data('stratid'));
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
	var replayFiles = null;
	$('#replayFile').on('change', function(e) {
		replayFiles = e.target.files;
	});
	pDialog.find('#btnAddReplay').on('click', function(evt) {
		evt.preventDefault();
		var myButton = $(this),
			data = new FormData();
		$.each(replayFiles, function(key, value) {
			data.append(key, value);
		});
		$.ajax({
			url: './server/analysereplay.php',
			type: 'POST',
			data: data,
			cache: false,
			dataType: 'json',
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			success: function(data, textStatus, jqXHR) {
				if (data.result == 'success') {
					// Success so call function to process the form
					
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// Handle errors here
				console.log('ERRORS: ' + textStatus);
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
			modifyPanelHtml += '<div class="form-group">';
			modifyPanelHtml += '<label class="sr-only" for="modifyEventTitle">' + $.t('action.calendar.prop.title') + '</label>';
			modifyPanelHtml += '<input id="modifyEventTitle" type="text" class="form-control" placeholder="' + $.t('action.calendar.prop.title') + '" aria-describedby="sizing-addon1" value="' + pDialog.find('.modal-header h3 .eventTitle').text() + '" />';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="form-group">';
			modifyPanelHtml += '<label class="sr-only" for="modifyEventDescription">' + $.t('action.calendar.prop.description') + '</label>';
			modifyPanelHtml += '<textarea id="modifyEventDescription" class="form-control" placeholder="' + $.t('action.calendar.prop.description') + '" aria-describedby="sizing-addon1">' + pDialog.find('.eventDescription').text() + '</textarea>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="input-group">';
			modifyPanelHtml += '<span class="input-group-addon glyphicon glyphicon-asterisk"></span>';
			modifyPanelHtml += '<div class="btn-group">';
			modifyPanelHtml += '<button type="button" id="modifyEventType" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" data-value="' + gEventType + '" aria-expanded="false"><span class="btnVal">' + $.t('action.calendar.prop.types.clanwar') + '</span> <span class="caret"></span></button>';
			modifyPanelHtml += '<ul class="dropdown-menu" role="menu">';
			modifyPanelHtml += '<li data-value="clanwar"><a href="#">' + $.t('action.calendar.prop.types.clanwar') + '</a></li>';
			modifyPanelHtml += '<li data-value="compa"><a href="#">' + $.t('action.calendar.prop.types.compa') + '</a></li>';
			modifyPanelHtml += '<li data-value="stronghold"><a href="#">' + $.t('action.calendar.prop.types.stronghold') + '</a></li>';
			modifyPanelHtml += '<li data-value="7vs7"><a href="#">' + $.t('action.calendar.prop.types.7vs7') + '</a></li>';
			modifyPanelHtml += '<li data-value="training"><a href="#">' + $.t('action.calendar.prop.types.training') + '</a></li>';
			modifyPanelHtml += '<li data-value="other"><a href="#">' + $.t('action.calendar.prop.types.other') + '</a></li>';
			modifyPanelHtml += '</ul>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="container-fluid">';
			modifyPanelHtml += '<div class="row">';
			modifyPanelHtml += '<div class="col-xs-6">';
			modifyPanelHtml += '<div class="input-group date eventDatePicker" id="modifyEventStartDate">';
			modifyPanelHtml += '<input type="text" class="form-control" placeholder="' + $.t('action.calendar.prop.startdate') + '" value="' + gEventStartDate.format('LL') + '" />';
			modifyPanelHtml += '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="col-xs-6">';
			modifyPanelHtml += '<div class="input-group date eventTimePicker" id="modifyEventStartTime">';
			modifyPanelHtml += '<input type="text" class="form-control" placeholder="' + $.t('action.calendar.prop.starttime') + '" value="' + gEventStartDate.format('LT') + '" />';
			modifyPanelHtml += '<span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="row">';
			modifyPanelHtml += '<div class="col-xs-6">';
			modifyPanelHtml += '<div class="input-group date eventDatePicker hidden" id="modifyEventEndDate">';
			modifyPanelHtml += '<input type="text" class="form-control" placeholder="' + $.t('action.calendar.prop.enddate') + '" value="' + gEventEndDate.format('LL') + '" />';
			modifyPanelHtml += '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="col-xs-6">';
			modifyPanelHtml += '<div class="input-group date eventTimePicker" id="modifyEventEndTime">';
			modifyPanelHtml += '<input type="text" class="form-control" placeholder="' + $.t('action.calendar.prop.endtime') + '" value="' + gEventEndDate.format('LT') + '" />';
			modifyPanelHtml += '<span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="togglebutton">';
			modifyPanelHtml += '<label><span>' + $.t('action.calendar.prop.allowspare') + '</span>';
			modifyPanelHtml += '<input type="checkbox" id="modifyEventSpareAllowed" value="true"' + (pDialog.find('.btnEnrol[data-attendance="spare"]').is(':visible')?' checked="checked"':'') + ' />';
			modifyPanelHtml += '</label>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="container-fluid">';
			modifyPanelHtml += '<div class="row">';
			modifyPanelHtml += '<div class="col-md-6 col-xs-6 col-lg-6">';
			modifyPanelHtml += '<h3>' + $.t('event.restrictions') + '</h3>';
			modifyPanelHtml += '<div class="input-group">';
			modifyPanelHtml += '<span class="input-group-addon glyphicon glyphicon-tasks"></span>';
			modifyPanelHtml += '<div class="btn-group">';
			modifyPanelHtml += '<button type="button" id="modifyEventTankLevel" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" data-value="' + gTankLevelsRestriction[0] + '" aria-expanded="false"><span class="btnVal">' + ((gTankLevelsRestriction[0] == 'all') || (gTankLevelsRestriction[0] == '')?$.t('tank.alllevels'):$.t('tank.level.' + (gTankLevelsRestriction[0] - 1))) + '</span> <span class="caret"></span></button>';
			modifyPanelHtml += '<ul class="dropdown-menu" role="menu">';
			modifyPanelHtml += '<li data-value="all"><a href="#">' + $.t('tank.alllevels') + '</a></li>';
			modifyPanelHtml += '<li class="divider"></li>';
			modifyPanelHtml += '<li data-value="1"><a href="#">' + $.t('tank.level.0') + '</a></li>';
			modifyPanelHtml += '<li data-value="2"><a href="#">' + $.t('tank.level.1') + '</a></li>';
			modifyPanelHtml += '<li data-value="3"><a href="#">' + $.t('tank.level.2') + '</a></li>';
			modifyPanelHtml += '<li data-value="4"><a href="#">' + $.t('tank.level.3') + '</a></li>';
			modifyPanelHtml += '<li data-value="5"><a href="#">' + $.t('tank.level.4') + '</a></li>';
			modifyPanelHtml += '<li data-value="6"><a href="#">' + $.t('tank.level.5') + '</a></li>';
			modifyPanelHtml += '<li data-value="7"><a href="#">' + $.t('tank.level.6') + '</a></li>';
			modifyPanelHtml += '<li data-value="8"><a href="#">' + $.t('tank.level.7') + '</a></li>';
			modifyPanelHtml += '<li data-value="9"><a href="#">' + $.t('tank.level.8') + '</a></li>';
			modifyPanelHtml += '<li data-value="10"><a href="#">' + $.t('tank.level.9') + '</a></li>';
			modifyPanelHtml += '</ul>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="input-group">';
			modifyPanelHtml += '<span class="input-group-addon glyphicon glyphicon-knight"></span>';
			modifyPanelHtml += '<div class="btn-group">';
			modifyPanelHtml += '<button type="button" id="modifyEventTankTypes" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" data-value="' + gTankTypesRestriction.join(',') + '" aria-expanded="false"><span class="btnVal">' + getTanksTypesString(gTankTypesRestriction) + '</span> <span class="caret"></span></button>';
			modifyPanelHtml += '<ul class="dropdown-menu" role="menu">';
			modifyPanelHtml += '<li data-value="all"><a href="#">' + $.t('tank.alltypes') + '</a></li>';
			modifyPanelHtml += '<li class="divider"></li>';
			modifyPanelHtml += '<li data-value="lightTank"><a href="#"><span class="glyphicon glyphicon-' + (gTankTypesRestriction.indexOf('lightTank') >= 0?'check':'unchecked') + '"></span> <span>' + $.t('tank.type.lightTank') + '</span></a></li>';
			modifyPanelHtml += '<li data-value="mediumTank"><a href="#"><span class="glyphicon glyphicon-' + (gTankTypesRestriction.indexOf('mediumTank') >= 0?'check':'unchecked') + '"></span> <span>' + $.t('tank.type.mediumTank') + '</span></a></li>';
			modifyPanelHtml += '<li data-value="heavyTank"><a href="#"><span class="glyphicon glyphicon-' + (gTankTypesRestriction.indexOf('heavyTank') >= 0?'check':'unchecked') + '"></span> <span>' + $.t('tank.type.heavyTank') + '</span></a></li>';
			modifyPanelHtml += '<li data-value="AT-SPG"><a href="#"><span class="glyphicon glyphicon-' + (gTankTypesRestriction.indexOf('AT-SPG') >= 0?'check':'unchecked') + '"></span> <span>' + $.t('tank.type.AT-SPG') + '</span></a></li>';
			modifyPanelHtml += '<li data-value="SPG"><a href="#"><span class="glyphicon glyphicon-' + (gTankTypesRestriction.indexOf('SPG') >= 0?'check':'unchecked') + '"></span> <span>' + $.t('tank.type.SPG') + '</span></a></li>';
			modifyPanelHtml += '</ul>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '<div class="col-md-6 col-xs-6 col-lg-6">';
			modifyPanelHtml += '<h4>' + $.t('strat.map.select') + '</h4>';
			modifyPanelHtml += '<select class="form-control" id="modifyEventMapName">';
			modifyPanelHtml += '<option value=""' + (curMapName!=''?'':' selected="selected"') + '></option>';
			for (var mapIndex in gSortedMaps) {
				var mapName = gSortedMaps[mapIndex],
					myMapInfos = gMaps[mapName];
				modifyPanelHtml += '<option value="' + mapName + '"' + (curMapName!=mapName?'':' selected="selected"') + '>' + $.t('strat.maps.' + mapName) + '</option>';
			}
			modifyPanelHtml += '</select>';
			modifyPanelHtml += '<img src="" alt="" class="img-thumbnail" />';
			modifyPanelHtml += '<h4>' + $.t('event.strat') + '</h4>';
			modifyPanelHtml += '<select class="form-control" id="modifyEventStrategy">';
			modifyPanelHtml += '<option value="-1"' + (curStratId!=-1?'':' selected="selected"') + '></option>';
			modifyPanelHtml += '</select>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
			modifyPanelHtml += '</div>';
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
					mySelect.parent().next().attr('src', './res/wot/maps/' + myMapThumb).attr('alt', $.t('strat.maps.' + mySelect.val()));
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
			var selEventType = gModifyPanel.find('#modifyEventType'),
				selTankLevel = gModifyPanel.find('#modifyEventTankLevel'),
				selTankType = gModifyPanel.find('#modifyEventTankTypes');
			selEventType.add(selTankLevel).parent().on('click', 'a', function(evt) {
				evt.preventDefault();
				var myLink = $(this);
				myLink.parent().parent().prev().data('value', myLink.parent().data('value')).find('.btnVal').text(myLink.text());
			});
			selTankType.parent().on('click', 'a', function(evt) {
				evt.preventDefault();
				var myLink = $(this),
					myTypesSelectedContainer = myLink.parent().parent().prev(),
					myTypesSelected = (myTypesSelectedContainer.data('value') + '').split(/,/g),
					myChoosenType = myLink.parent().data('value'),
					i = 0,
					myTypesSelectedString = '',
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
				}
				if (myTypesSelected.length == 0 || myChoosenType == 'all') {
					myTypesSelected = [ 'all' ];
				}
				myTypesSelectedContainer.data('value', myTypesSelected.join(',')).find('.btnVal').text(getTanksTypesString(myTypesSelected));
			});
		}
		gDisplayPanel.hide();
		$('#btnModifyEventOk').removeClass('hidden');
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
			eventType: $('#modifyEventType').data('value'),
			eventDescription: $('#modifyEventDescription').val(),
			eventStartDate: startDateToSent.unix(),
			eventEndDate: endDateToSent.unix(),
			eventAllowSpare: $('#modifyEventSpareAllowed').is(':checked'),
			eventMapName: $('#modifyEventMapName').val(),
			eventStrategyId: $('#modifyEventStrategy').val(),
			eventRestrictTankLevel: $('#modifyEventTankLevel').data('value'),
			eventRestrictTankType: $('#modifyEventTankTypes').data('value')
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
				gTankLevelsRestriction = myResultEvent.tanksLevelsAllowed,
				gTankTypesRestriction = myResultEvent.tanksTypesAllowed,
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
					pDialog.find('.eventEnrolment').text($.t('event.enrol.state.' + myButton.data('attendance')));
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
								+ '</span></td><td class="tank">' + $.t('event.notank') + '</td></tr>');
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
						var playerTankAdditionalInfos = playerTanksAdditionalInfos[i],
							j = 0,
							doAddTank = true,
							isTankLevelFound = false,
							isTankTypeFound = false;
						if (playerTankAdditionalInfos.in_garage && playerTankAdditionalInfos.is_ready) {
							isTankLevelFound = true;
							isTankTypeFound = true;
							if (gTankLevelsRestriction.length > 0 && gTankLevelsRestriction[0] != 'all' && gTankLevelsRestriction[0] != '') {
								// Restrict tank levels.
								isTankLevelFound = false;
								for (j in gTankLevelsRestriction) {
									if (gTankopedia[playerTankAdditionalInfos.tank_id].tier <= (gTankLevelsRestriction[j] * 1)) {
										isTankLevelFound = true;
										break;
									}
								}
							}
							if (gTankTypesRestriction.length > 0 && gTankTypesRestriction[0] != 'all' && gTankTypesRestriction[0] != '') {
								// Restrict tank types.
								isTankTypeFound = false;
								for (j in gTankTypesRestriction) {
									if (gTankopedia[playerTankAdditionalInfos.tank_id].type == gTankTypesRestriction[j]) {
										isTankTypeFound = true;
										break;
									}
								}
							}
							if (isTankTypeFound && isTankLevelFound) {
								listTanksHtml += '<li><span class="playerTank" data-tank-id="' + playerTankAdditionalInfos.tank_id + '"><img src="' + gTankopedia[playerTankAdditionalInfos.tank_id].images.contour_icon + '" /><span class="label label-' + getWN8Class(playerTankAdditionalInfos.wn8) + '">' + (Math.round(playerTankAdditionalInfos.wn8 * 100) / 100) + '</span> ' + gTankopedia[playerTankAdditionalInfos.tank_id].short_name + '</span></li>';
							}
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

