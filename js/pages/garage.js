/**
 * Authorized chars by WG for IGN
 */
var gIGNLeadingChars = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_' ];

var onLoad = function() {
	checkConnected();
	progressNbSteps = 7;
	var ignPills = '',
		i = 0,
		membersGroups = {},
		myTanksTable = $('#tableMyTanks'),
		myFilterLevels = [],
		myFilterTypes = [],
		myFilterOwners = [],
		myPlayersDetailsContainer = $('#playersDetails');
	// Define event handlers
	for (i=0; i<gIGNLeadingChars.length; i++) {
		ignPills += '<li role="presentation" id="lnkChooseIGN' + gIGNLeadingChars[i] + '"><a href="#">' + gIGNLeadingChars[i] + '</a></li>';
	}
	$('#pillsIGN').append(ignPills).on('click', 'a', function(evt) {
		evt.preventDefault();
		var myLink = $(this),
			myElem = myLink.parent(),
			myOwnerContainer = $('#btnsFilterTankOwner' + myLink.text());
		if (!myElem.hasClass('disabled')) {
			myElem.siblings('.active').removeClass('active');
			myElem.toggleClass('active');
			myOwnerContainer.siblings('div').hide();
			myOwnerContainer.toggle();
		}
	});
	var applyFilter = function() {
		var myRows = myTanksTable.find('tbody > tr'),
			i = 0,
			myFilter = '';
		myRows.hide();
		myRows.find('span[data-value] .ign').removeClass('active');
		// Filter rows by level
		if (myFilterLevels.length != 0 && myFilterLevels.length != 10) {
			for (i=0; i<myFilterLevels.length; i++) {
				if (myFilter != '') {
					myFilter += ',';
				}
				myFilter += '>td.tanklevel[data-value="' + myFilterLevels[i] + '"]';
			}
		}
		if (myFilter != '') {
			myRows = myRows.has(myFilter);
		}
		// Filter rows by type
		myFilter = '';
		if (myFilterTypes.length != 0 && myFilterTypes.length != 5) {
			for (i=0; i<myFilterTypes.length; i++) {
				if (myFilter != '') {
					myFilter += ',';
				}
				myFilter += '>td.tanktype[data-value="' + myFilterTypes[i] + '"]';
			}
		}
		if (myFilter != '') {
			myRows = myRows.has(myFilter);
		}
		// Filter rows by owner
		myFilter = '';
		if (myFilterOwners.length != 0 && myFilterOwners.length != 5) {
			for (i=0; i<myFilterOwners.length; i++) {
				if (myFilter != '') {
					myFilter += ',';
				}
				myFilter += '>td.tankowners>span[data-value="' + myFilterOwners[i] + '"]';
			}
		}
		if (myFilter != '') {
			myRows = myRows.has(myFilter);
		}
		myRows.show();
		myRows.find(myFilter).find('.ign').addClass('active');
	};
	$('#linkFilter').on('click', function(evt) {
		evt.preventDefault();
		$(this).parent().next().slideToggle('fast');
	});
	$('#btnsFilterTankLevel button').on('click', function(evt) {
		var myButton = $(this),
			isActive = !myButton.hasClass('active'),
			myButtonIndex = $.inArray(myButton.val(), myFilterLevels);
		if (!isActive && myButtonIndex >= 0) {
			myFilterLevels.splice(myButtonIndex, 1);
		} else if (isActive) {
			myFilterLevels.push(myButton.val());
		}
		myButton.toggleClass('active');
		applyFilter();
	});
	$('#btnsFilterTankType button').on('click', function(evt) {
		var myButton = $(this),
			isActive = !myButton.hasClass('active'),
			myButtonIndex = $.inArray(gTANKS_TYPES[myButton.val()], myFilterTypes);
		if (!isActive && myButtonIndex >= 0) {
			myFilterTypes.splice(myButtonIndex, 1);
		} else if (isActive) {
			myFilterTypes.push(gTANKS_TYPES[myButton.val()]);
		}
		myButton.toggleClass('active');
		applyFilter();
	});
	// Load data
	advanceProgress(i18n.t('loading.claninfos'));
	$.post(gConfig.WG_API_URL + 'wgn/clans/info/', {
		application_id: gConfig.WG_APP_ID,
		language: gConfig.LANG,
		access_token: gConfig.ACCESS_TOKEN,
		clan_id: gPersonalInfos.clan_id
	}, function(dataClanResponse) {
		gClanInfos = dataClanResponse.data[gPersonalInfos.clan_id];
		setNavBrandWithClan();
		var membersList = '',
			isFirst = true,
			clanMembers = gClanInfos.members,
			i = 0,
			j = 0,
			tempContentHtml = '';
		for (i=0; i<gClanInfos.members_count; i++) {
			if (isFirst) {
				isFirst = false;
			} else {
				membersList += ',';
			}
			membersList += gClanInfos.members[i].account_id;
		}
		clanMembers.sort(function(a, b) {
			return (a.account_name.localeCompare(b.account_name));
		});
		for (i=0; i<clanMembers.length; i++) {
			var myMember = clanMembers[i],
				myIGNFirstChar = myMember.account_name.substr(0, 1).toUpperCase();
			if (typeof(membersGroups[myIGNFirstChar]) == 'undefined') {
				membersGroups[myIGNFirstChar] = [];
			}
			membersGroups[myIGNFirstChar].push(myMember);
		}
		tempContentHtml = '';
		for (i=0; i<gIGNLeadingChars.length; i++) {
			var memberInGroup = membersGroups[gIGNLeadingChars[i]];
			if (memberInGroup == null) {
				$('#lnkChooseIGN' + gIGNLeadingChars[i]).addClass('disabled hidden');
			} else {
				tempContentHtml += '<div id="btnsFilterTankOwner' + gIGNLeadingChars[i] + '" style="display:none">';
				for (j=0; j<memberInGroup.length; j++) {
					var myMember = memberInGroup[j];
					tempContentHtml += '<button type="button" class="btn btn-material-grey" value="' + myMember.account_id + '">' + myMember.account_name + '</button>';
				}
				tempContentHtml += '</div>';
			}
		}
		$('#pillsIGN').after(tempContentHtml).parent().find('button').on('click', function(evt) {
			var myButton = $(this),
				isActive = !myButton.hasClass('active'),
				myButtonIndex = $.inArray(myButton.val(), myFilterOwners);
			if (!isActive && myButtonIndex >= 0) {
				myFilterOwners.splice(myButtonIndex, 1);
			} else if (isActive) {
				myFilterOwners.push(myButton.val());
			}
			myButton.toggleClass('active');
			applyFilter();
		});
		advanceProgress(i18n.t('loading.membersinfos'));
		$.post(gConfig.WG_API_URL + 'wot/account/info/', {
			application_id: gConfig.WG_APP_ID,
			language: gConfig.G_API_LANG,
			access_token: gConfig.ACCESS_TOKEN,
			account_id: membersList
		}, function(dataPlayersResponse) {
			var dataPlayers = dataPlayersResponse.data;
			advanceProgress(i18n.t('loading.tanksinfos'));
			$.post(gConfig.WG_API_URL + 'wot/encyclopedia/tanks/', {
				application_id: gConfig.WG_APP_ID,
				access_token: gConfig.ACCESS_TOKEN,
				language: gConfig.LANG
			}, function(dataTankopediaResponse) {
				var dataTankopedia = dataTankopediaResponse.data;
				advanceProgress(i18n.t('loading.membertanksinfos'));
				$.post(gConfig.WG_API_URL + 'wot/account/tanks/', {
					application_id: gConfig.WG_APP_ID,
					language: gConfig.LANG,
					access_token: gConfig.ACCESS_TOKEN,
					account_id: membersList
				}, function(dataPlayersVehiclesResponse) {
					var dataPlayersVehicles = dataPlayersVehiclesResponse.data;
					advanceProgress(i18n.t('loading.tanksadditionalinfos'));
					$.post('./server/player.php', {
						action: 'gettanksstats',
						account_id: membersList
					}, function(dataStoredPlayersTanksResponse) {
						advanceProgress(i18n.t('loading.generating'));
						var dataStoredPlayersTanks = dataStoredPlayersTanksResponse.data,
							listToDisplay = [],
							dataToAdd = {},
							curTank = {},
							i = 0,
							j = 0,
							playerAdditionalInfos = [],
							playerTankAdditionalInfos = {},
							tankDetails = {};
							playerId = '',
							isTankInList = false,
							indexTankInList = 0,
							tanksListHtml = '',
							myElemToDisplay = {};
						for (playerId in dataStoredPlayersTanks) {
							playerAdditionalInfos = dataStoredPlayersTanks[playerId];
							if (playerAdditionalInfos.length > 0) {
								// We have data for this player. Process it.
								for (i=0; i<playerAdditionalInfos.length; i++) {
									playerTankAdditionalInfos = playerAdditionalInfos[i];
									if (playerTankAdditionalInfos.in_garage && playerTankAdditionalInfos.is_ready) {
										// The tank is ready to fight. Add it to list
										isTankInList = false;
										for (curTank in listToDisplay) {
											if (listToDisplay[curTank].tank_id == playerTankAdditionalInfos.tank_id) {
												isTankInList = true;
												dataToAdd = listToDisplay[curTank];
												break;
											}
										}
										if (!isTankInList) {
											tankDetails = dataTankopedia[playerTankAdditionalInfos.tank_id];
											dataToAdd = tankDetails;
											dataToAdd['owners'] = {};
										}
										dataToAdd.owners[playerId] = playerTankAdditionalInfos;
										isTankInList = false;
										for (j=0; j<listToDisplay.length; j++) {
											if (listToDisplay[j].tank_id == playerTankAdditionalInfos.tank_id) {
												isTankInList = true;
												indexTankInList = j;
												break;
											}
										}
										if (!isTankInList) {
											listToDisplay.push(dataToAdd);
										} else {
											listToDisplay[indexTankInList] = dataToAdd;
										}
									}
								}
							}
						}
						// Sort tanks by level and by type
						listToDisplay.sort(function(a, b) {
							if (a.level > b.level) {
								return -1;
							}
							if (a.level < b.level) {
								return 1;
							}
							if (gTANKS_TYPES[a.type] < gTANKS_TYPES[b.type]) {
								return -1;
							}
							if (gTANKS_TYPES[a.type] > gTANKS_TYPES[b.type]) {
								return 1;
							}
							return 0;
						});
						// Perform display
						for (i=0; i<listToDisplay.length; i++) {
							myElemToDisplay = listToDisplay[i];
							tanksListHtml += '<tr>';
							tanksListHtml += '<td><img src="' + myElemToDisplay.contour_image + '" alt="' + myElemToDisplay.short_name_i18n + '" /></td>';
							tanksListHtml += '<td data-value="' + myElemToDisplay.nation_i18n + '"><img src="./themes/' + gConfig.THEME + '/style/images/nation_' + myElemToDisplay.nation + '.png" alt="' + myElemToDisplay.nation_i18n + '" title="' + myElemToDisplay.nation_i18n + '" width="24" height="24" /></td>';
							tanksListHtml += '<td class="' + (myElemToDisplay.is_premium?'ispremium':'') + '"><span class="tankname">' + myElemToDisplay.short_name_i18n + '</span></td>';
							tanksListHtml += '<td class="tanklevel" data-value="' + myElemToDisplay.level + '"><img src="./themes/' + gConfig.THEME + '/style/images/Tier_' + myElemToDisplay.level + '_icon.png" alt="' + gTANKS_LEVEL[myElemToDisplay.level - 1] + '" title="' + myElemToDisplay.level + '" /></td>';
							tanksListHtml += '<td class="tanktype" data-value="' + gTANKS_TYPES[myElemToDisplay.type] + '"><img src="./themes/' + gConfig.THEME + '/style/images/type-' + myElemToDisplay.type + '.png" alt="' + myElemToDisplay.type_i18n + '" title="' + myElemToDisplay.type_i18n + '" /></td>';
							tanksListHtml += '<td class="tankowners">';
							isFirst = true;
							for (var userId in myElemToDisplay.owners) {
								playerTankAdditionalInfos = myElemToDisplay.owners[userId];
								if (isFirst) {
									isFirst = false;
								} else {
									tanksListHtml += ', ';
								}
								tanksListHtml += '<span data-value="' + userId + '"><span class="label label-' + getWN8Class(playerTankAdditionalInfos.wn8) + '">' + (Math.round(playerTankAdditionalInfos.wn8 * 100) / 100) + '</span>&nbsp;<a href="#playerDetails' + userId + '" class="ign">' + dataPlayers[userId].nickname + '</a></span>';
							}
							tanksListHtml += '</td>';
							tanksListHtml += '</tr>';
						}
						myTanksTable.attr('data-sortable', 'true');
						myTanksTable.find('tbody').html(tanksListHtml);
						myTanksTable.on('click', '.ign', function(evt) {
							evt.preventDefault();
							// Show user details when click on its IGN.
							var myLink = $(this),
								userId = myLink.closest('span').data('value'),
								playersDetailsHtml = '';
							if (myPlayersDetailsContainer.find('#playerDetails' + userId).length == 0) {
								playersDetailsHtml += '<div class="pull-left playerdetails" id="playerDetails' + userId + '">';
								playersDetailsHtml += '<button class="close" aria-hidden="true" data-dismiss="modal" type="button" aria-label="' + i18n.t('btn.close') + '">&times;</button>';
								playersDetailsHtml += '<h4>' + $(this).text() + '</h4>';
								playersDetailsHtml += '<ul class="list-unstyled">';
								for (i=0; i<listToDisplay.length; i++) {
									myElemToDisplay = listToDisplay[i];
									for (var tankOwnerId in myElemToDisplay.owners) {
										if (tankOwnerId == userId) {
											// The player owns this tanks. Process it.
											playersDetailsHtml += '<li class="' + (myElemToDisplay.is_premium?'ispremium':'') + '">';
											playersDetailsHtml += '<img src="' + myElemToDisplay.contour_image + '"  alt="' + myElemToDisplay.short_name_i18n + '" /> ' + myElemToDisplay.short_name_i18n;
											playersDetailsHtml += '</li>';
											// Exit loop. We don't need to look up further owners...
											break;
										}
									}
								}
								playersDetailsHtml += '</ul>';
								playersDetailsHtml += '</div>';
								myPlayersDetailsContainer.append(playersDetailsHtml);
							}
						});
						Sortable.initTable(myTanksTable[0]);
						advanceProgress(i18n.t('loading.complete'));
						afterLoad();
					}, 'json');
				}, 'json');
			}, 'json');
		}, 'json');
	}, 'json');
};