var gIMAGE_PARAMS = {
		offsetElem: 180,
		offsetLine: 25,
		nbTanksByLine: 3
	},
	gTankTiersAllowedForResume = [4, 6, 7, 8, 10];

var applyTableTanksFilters = function(filter) {
	var myElems = $('.tank'),
		myFilteredElems = myElems;
	// Reduce elements by filter
	if (filter.isfull) {
		myFilteredElems = myFilteredElems.filter('.isfull');
	}
	if (filter.ingarage) {
		myFilteredElems = myFilteredElems.filter('.ingarage');
	}
	// Hide all elements
	myElems.addClass('hidden');
	// And show filtered elements
	myFilteredElems.removeClass('hidden')
};

var getTankAdditionalInfos = function(pTankID, pTanksAdditionalInfos) {
	var i = 0;
	for (i=0; i<pTanksAdditionalInfos.length; i++) {
		if (pTanksAdditionalInfos[i].tank_id == pTankID) {
			return pTanksAdditionalInfos[i];
		}
	}
};

var onLoad = function() {
	checkConnected();
	progressNbSteps = 5;
	advanceProgress(i18n.t('loading.claninfos'));
	setNavBrandWithClan();
	advanceProgress(i18n.t('loading.tanksinfos'));
	var myTanksTable = $('#tableMyTanks'),
		myTanksSmallContainer = $('#myTanksContainerSmall'),
		myTanksBigContainer = $('#myTanksContainerBig');
	$('#btnShowTanksTable').on('click', function(evt) {
		var myButton = $(this);
		myButton.siblings().removeClass('active');
		myButton.addClass('active');
		myTanksTable.removeClass('hidden');
		myTanksSmallContainer.addClass('hidden');
		myTanksBigContainer.addClass('hidden');
	});
	$('#btnShowTanksListSmall').on('click', function(evt) {
		var myButton = $(this);
		myButton.siblings().removeClass('active');
		myButton.addClass('active');
		myTanksTable.addClass('hidden');
		myTanksSmallContainer.removeClass('hidden');
		myTanksBigContainer.addClass('hidden');
	});
	$('#btnShowTanksListLarge').on('click', function(evt) {
		var myButton = $(this);
		myButton.siblings().removeClass('active');
		myButton.addClass('active');
		myTanksTable.addClass('hidden');
		myTanksSmallContainer.addClass('hidden');
		myTanksBigContainer.removeClass('hidden');
	});
	$.post(gConfig.WG_API_URL + 'wot/encyclopedia/tanks/', {
		application_id: gConfig.WG_APP_ID,
		access_token: gConfig.ACCESS_TOKEN,
		language: gConfig.LANG
	}, function(dataTankopediaResponse) {
		var dataTankopedia = dataTankopediaResponse.data;
		advanceProgress(i18n.t('loading.mytanksinfos'));
		$.post(gConfig.WG_API_URL + 'wot/tanks/stats/', {
			application_id: gConfig.WG_APP_ID,
			language: gConfig.LANG,
			access_token: gConfig.ACCESS_TOKEN,
			account_id: gConfig.PLAYER_ID
		}, function(dataMyTanksResponse) {
			var dataMyTanks = dataMyTanksResponse.data,
				myTanksTable = $('#tableMyTanks'),
				myTanksSmallContainer = $('#myTanksContainerSmall'),
				myTanksBigContainer = $('#myTanksContainerBig'),
				tableContent = '',
				listContent = '',
				listLargeContent = '',
				myTank = null,
				tankInfos = null,
				tankAdditionalInfos = null,
				winRatio = 0,
				chkInGarage = $('#chkInGarage'),
				chkIsFull = $('#chkIsFull');
			// Save tanks infos
			$.post('./server/player.php', {
				'action': 'gettanksstats',
				'data': JSON.stringify(dataMyTanks)
			}, function(dataMyTanksResponse) {
				var dataMyTanksAdditionalInfos = dataMyTanksResponse.data[gConfig.PLAYER_ID];
				dataMyTanks = dataMyTanks[gConfig.PLAYER_ID];
				advanceProgress(i18n.t('loading.generating'));
				// Sort tanks by tiers
				dataMyTanks.sort(function(a, b) {
					var tankInfosA = dataTankopedia[a.tank_id],
						tankInfosB = dataTankopedia[b.tank_id];
					// Sort by tiers
					if (tankInfosA.level > tankInfosB.level) {
						return -1;
					}
					if (tankInfosA.level < tankInfosB.level) {
						return 1;
					}
					// Then by type
					if (gTANKS_TYPES[tankInfosA.type] < gTANKS_TYPES[tankInfosB.type]) {
						return -1;
					}
					if (gTANKS_TYPES[tankInfosA.type] > gTANKS_TYPES[tankInfosB.type]) {
						return 1;
					}
					return 0;
				});
				for (var i=0; i<dataMyTanks.length; i++) {
					myTank = dataMyTanks[i];
					tankInfos = dataTankopedia[myTank.tank_id];
					tankAdditionalInfos = getTankAdditionalInfos(myTank.tank_id, dataMyTanksAdditionalInfos);
					winRatio = -1;
					if (myTank.all.battles > 0) {
						winRatio = myTank.all.wins * 100 / myTank.all.battles;
					}
					tableContent += '<tr class="tank ' + (tankAdditionalInfos.in_garage?'ingarage':'hidden') + (tankInfos.is_premium?' ispremium':'') + (tankInfos.is_premium||tankAdditionalInfos.is_full?' isfull':'') +'">';
					tableContent += '<td><img src="' + tankInfos.contour_image + '" /></td>';
					tableContent += '<td data-value="' + myTank.mark_of_mastery + '" class="tankmastery' + myTank.mark_of_mastery + '">&nbsp;</td>';
					tableContent += '<td class="tankname">' + tankInfos.short_name_i18n + '</td>';
					tableContent += '<td data-value="' + tankInfos.level  + '"><img src="./themes/' + gConfig.THEME + '/style/images/Tier_' + tankInfos.level + '_icon.png" alt="' + gTANKS_LEVEL[tankInfos.level - 1] + '" title="' + tankInfos.level + '" /></td>';
					tableContent += '<td data-value="' + gTANKS_TYPES[tankInfos.type] + '"><img src="./themes/' + gConfig.THEME + '/style/images/type-' + tankInfos.type + '.png" alt="' + tankInfos.type_i18n + '" title="' + tankInfos.type_i18n + '" /></td>';
					tableContent += '<td>' + myTank.all.battles + '</td>';
					tableContent += '<td><span class="label label-' + getWN8Class(tankAdditionalInfos.wn8) + '">' + (Math.round(tankAdditionalInfos.wn8 * 100) / 100) + '</span></td>';
					tableContent += '<td data-value="' + winRatio + '">' + (winRatio > -1?(Math.round(winRatio * 100) / 100) + ' %':'-') + '</td>';
					tableContent += '<td data-value="' + (tankInfos.is_premium?'1':'0') + '"><div class="togglebutton' + (tankInfos.is_premium?' togglebutton-material-amber':'') + '"><label>&nbsp;<input type="checkbox" class="chkTanksIsFull" id="chkTanksIsFull' + myTank.tank_id + '" value="' + myTank.tank_id + '"' + (tankInfos.is_premium||tankAdditionalInfos.is_full?' checked="checked"':'') + (tankInfos.is_premium?' disabled="disabled"':'') + ' /></label></div></td>';
					tableContent += '<td data-value="' + (tankAdditionalInfos.is_ready?'1':'0') + '"><div class="togglebutton"><label>&nbsp;<input type="checkbox" class="chkTanksIsReady" id="chkTanksIsReady' + myTank.tank_id + '" value="' + myTank.tank_id + '"' + (tankAdditionalInfos.is_ready?' checked="checked"':'') + ' /></label></div></td>';
					tableContent += '</tr>';
					listContent += '<div class="small tank tankcontainer tankmastery' + myTank.mark_of_mastery +  (tankAdditionalInfos.in_garage?' ingarage':' hidden') + (tankInfos.is_premium?' ispremium':'') + (tankInfos.is_premium||tankAdditionalInfos.is_full?' isfull':'') +'">';
					listContent += '<div class="tanklevel' + tankInfos.level + '"><img src="' + tankInfos.image_small + '" /></div>';
					listContent += '<p class="tankname">' + tankInfos.short_name_i18n + '</p>';
					listContent += '</div>';
					listLargeContent += '<div class="big tank tankcontainer tankmastery' + myTank.mark_of_mastery + (tankAdditionalInfos.in_garage?' ingarage':' hidden') + (tankInfos.is_premium?' ispremium':'') + (tankInfos.is_premium||tankAdditionalInfos.is_full?' isfull':'') +'">';
					listLargeContent += '<div class="tanklevel' + tankInfos.level + '"><img src="' + tankInfos.image + '" /></div>';
					listLargeContent += '<p class="tankname">' + tankInfos.short_name_i18n + '</p>';
					listLargeContent += '</div>';
				}
				myTanksTable.attr('data-sortable', 'true');
				myTanksTable.find('tbody').append(tableContent);
				myTanksSmallContainer.html(listContent);
				myTanksBigContainer.html(listLargeContent);
				Sortable.initTable(myTanksTable[0]);
				myTanksTable.find('.chkTanksIsFull').on('change', function(evt) {
					var myChk = $(this);
					$.post('./server/player.php', {
						'action': 'settankisfull',
						'tank_id': myChk.val(),
						'is_full': myChk.is(':checked')
					}, function(dataSaveTanksResponse) {
						tankAdditionalInfos = getTankAdditionalInfos(myChk.val(), dataMyTanksAdditionalInfos);
						tankAdditionalInfos.is_full = myChk.is(':checked');
					}, 'json');
					$(this).closest('tr').toggleClass('isfull');
				});
				myTanksTable.find('.chkTanksIsReady').on('change', function(evt) {
					var myChk = $(this);
					$.post('./server/player.php', {
						'action': 'settankisready',
						'tank_id': myChk.val(),
						'is_ready': myChk.is(':checked')
					}, function(dataSaveTanksResponse) {
						tankAdditionalInfos = getTankAdditionalInfos(myChk.val(), dataMyTanksAdditionalInfos);
						tankAdditionalInfos.is_ready = myChk.is(':checked');
					}, 'json');
					$(this).closest('tr').toggleClass('isfull');
				});
				$('#btnShowTanksResume').on('click', function(evt) {
					var myCanvas = $('#canvasRecapPlayer'),
						canvasRealHeight = 0,
						basePosX = 0,
						basePosY = 0,
						textColor = '#000';
						curTankLevel = 0,
						curTankType = '',
						nbTanksOnLine = 0,
						commentText = '',
						generationDate = moment().format('LLL');
					// Compute canvas real height
					for (var i=0; i<dataMyTanks.length; i++) {
						myTank = dataMyTanks[i];
						tankInfos = dataTankopedia[myTank.tank_id];
						tankAdditionalInfos = getTankAdditionalInfos(myTank.tank_id, dataMyTanksAdditionalInfos);
						if (dataMyTanks[i].in_garage) {
							if (($.inArray(tankInfos.level, gTankTiersAllowedForResume) >= 0) && tankAdditionalInfos.is_ready) {
								if (curTankLevel != tankInfos.level) {
									canvasRealHeight += gIMAGE_PARAMS.offsetLine;
									curTankLevel = tankInfos.level;
								}
								if (curTankType != tankInfos.type) {
									canvasRealHeight += gIMAGE_PARAMS.offsetLine;
									curTankType = tankInfos.type;
								} else {
									if (nbTanksOnLine >= gIMAGE_PARAMS.nbTanksByLine) {
										canvasRealHeight += gIMAGE_PARAMS.offsetLine;
										nbTanksOnLine = 0;
									}
								}
								nbTanksOnLine++;
							}
						}
					}
					myCanvas.clearCanvas();
					myCanvas.attr('height', canvasRealHeight);
					myCanvas.attr('width', gIMAGE_PARAMS.nbTanksByLine * gIMAGE_PARAMS.offsetElem);
					curTankLevel = 0;
					curTankType = '';
					nbTanksOnLine = 0;
					nbTanksOfType = 0;
					for (var i=0; i<dataMyTanks.length; i++) {
						myTank = dataMyTanks[i];
						tankInfos = dataTankopedia[myTank.tank_id];
						tankAdditionalInfos = getTankAdditionalInfos(myTank.tank_id, dataMyTanksAdditionalInfos);
						winRatio = -1;
						if (myTank.all.battles > 0) {
							winRatio = myTank.all.wins * 100 / myTank.all.battles;
						}
						if (tankAdditionalInfos.in_garage) {
							// Draw only tanks that are in garage for Mumble/TS canvas
							if (($.inArray(tankInfos.level, gTankTiersAllowedForResume) >= 0) && tankAdditionalInfos.is_ready) {
								// And only useful tanks...
								if (curTankLevel != tankInfos.level) {
									if (curTankLevel != 0) {
										basePosY += gIMAGE_PARAMS.offsetLine;
										commentText += '</td>';
										switch (curTankType) {
											case 'lightTank':
												commentText += '<td>&nbsp;</td>';
											case 'mediumTank':
												commentText += '<td>&nbsp;</td>';
											case 'heavyTank':
												commentText += '<td>&nbsp;</td>';
											case 'AT-SPG':
												commentText += '<td>&nbsp;</td>';
												break;
										}
										commentText += '</tr>\n';
									} else {
										// It's the first tank to draw. Add generation date
										myCanvas.drawText({
											fillStyle: '#666',
											fontStyle: 'normal',
											fontSize: 10,
											fontFamily: 'RobotoDraft, Roboto, Verdana, sans-serif',
											text: generationDate,
											//fromCenter: false,
											x: myCanvas.attr('width'), y: 15,
											respectAlign: true,
											align: 'right'
										});
										commentText = '<p style="color:#666">' + generationDate + '</p><table border="1"><thead><tr><th>&nbsp;</th><th>' + i18n.t('tank.type.lightTank')
											+ '</th><th>' + i18n.t('tank.type.mediumTank')
											+ '</th><th>'+ i18n.t('tank.type.heavyTank')
											+ '</th><th>' + i18n.t('tank.type.AT-SPG')
											+ '</th><th>' + i18n.t('tank.type.SPG')
											+ '</th></tr></thead><tbody>\n';
									}
									curTankLevel = tankInfos.level;
									curTankType = '';
									nbTanksOnLine = 0;
									myCanvas.drawImage({
										source: './themes/' + gConfig.THEME + '/style/images/Tier_' + tankInfos.level + '_icon.png',
										fromCenter: false,
										x: 10, y: basePosY + 5
									});
									myCanvas.drawLine({
										strokeStyle: '#333',
										strokeWidth: 1,
										x1: 0, y1: basePosY + gIMAGE_PARAMS.offsetLine - 3,
										x2: myCanvas.attr('width'), y2: basePosY + gIMAGE_PARAMS.offsetLine - 3
									});
									commentText += '<tr><th>' + gTANKS_LEVEL[tankInfos.level - 1] + '</th>';
								}
								if (curTankType != tankInfos.type) {
									if (curTankType != '') {
										commentText += '</td>';
									} else {
										switch (tankInfos.type) {
											case 'SPG':
												commentText += '<td>&nbsp;</td>';
											case 'AT-SPG':
												commentText += '<td>&nbsp;</td>';
											case 'heavyTank':
												commentText += '<td>&nbsp;</td>';
											case 'mediumTank':
												commentText += '<td>&nbsp;</td>';
												break;
										}
									}
									basePosY += gIMAGE_PARAMS.offsetLine;
									basePosX = 0;
									curTankType = tankInfos.type;
									nbTanksOnLine = 0;
									nbTanksOfType = 0;
									commentText += '<td>';
								} else {
									// Handle line change
									if (nbTanksOnLine >= gIMAGE_PARAMS.nbTanksByLine) {
										nbTanksOnLine = 0;
										basePosX = 0;
										basePosY += gIMAGE_PARAMS.offsetLine;
									} else {
										basePosX += gIMAGE_PARAMS.offsetElem;
									}
								}
								myCanvas.drawImage({
									source: tankInfos.contour_image,
									fromCenter: false,
									x: basePosX, y: basePosY
								});
								myCanvas.drawImage({
									source: './themes/' + gConfig.THEME + '/style/images/type-' + tankInfos.type + '.png',
									x: basePosX + 10, y: basePosY + 5
								});
								if (tankInfos.is_premium) {
									textColor = '#ffc107';
								} else if (tankAdditionalInfos.is_full) {
									textColor = '#000';
								} else {
									textColor = '#666';
								}
								myCanvas.drawText({
									fillStyle: textColor,
									x: basePosX + 79, y: basePosY + 5,
									fromCenter: false,
									fontSize: 12,
									fontFamily: 'RobotoDraft, Roboto, Verdana, sans-serif',
									text: tankInfos.short_name_i18n
								});
								commentText += (nbTanksOfType != 0?', ':'') + '<span style="color:' + textColor + '">' + tankInfos.short_name_i18n + '</span>';
								nbTanksOfType++;
								nbTanksOnLine++;
							}
						}
					}
					// Add missing cols for last row
					commentText += '</td>';
					switch (curTankType) {
						case 'lightTank':
							commentText += '<td>&nbsp;</td>';
						case 'mediumTank':
							commentText += '<td>&nbsp;</td>';
						case 'heavyTank':
							commentText += '<td>&nbsp;</td>';
						case 'AT-SPG':
							commentText += '<td>&nbsp;</td>';
							break;
					}
					commentText += '</tr>\n</tbody></table>';
					$('#textResumePlayer').text(commentText);
				});
				chkInGarage.on('change', function(evt) {
					applyTableTanksFilters({
						isfull: chkIsFull.is(':checked'),
						ingarage: chkInGarage.is(':checked')
					});
				});
				chkIsFull.on('change', function(evt) {
					applyTableTanksFilters({
						isfull: chkIsFull.is(':checked'),
						ingarage: chkInGarage.is(':checked')
					});
				});
				advanceProgress(i18n.t('loading.complete'));
				new ZeroClipboard($('#copy-button'));
				afterLoad();
			}, 'json');
		}, 'json');
	}, 'json');
};