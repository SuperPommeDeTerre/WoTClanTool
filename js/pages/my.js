var applyTableTanksFilters = function(pTableTanks, filter) {
	var myRows = pTableTanks.find('tbody tr'),
		myFilteredRows = myRows;
	// Reduce rows by filter
	if (filter.isfull) {
		myFilteredRows = myFilteredRows.filter('.isfull');
	}
	if (filter.ingarage) {
		myFilteredRows = myFilteredRows.filter('.ingarage');
	}
	// Hide all rows
	myRows.addClass('hidden');
	// And show filtered rows
	myFilteredRows.removeClass('hidden')
};

var onLoad = function() {
	var myTanksTable = $('#tableMyTanks');
	checkConnected();
	progressNbSteps = 5;
	advanceProgress(i18n.t('loading.claninfos'));
	setNavBrandWithClan();
	advanceProgress(i18n.t('loading.tanksinfos'));
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
			var dataMyTanks = dataMyTanksResponse.data[gConfig.PLAYER_ID],
				tableContent = '',
				listContent = '',
				listLargeContent = '',
				myTank = null,
				tankInfos = null,
				winRatio = 0,
				chkInGarage = $('#chkInGarage'),
				chkIsFull = $('#chkIsFull');
			advanceProgress(i18n.t('loading.generating'));
			// Sort tanks by tiers
			dataMyTanks.sort(function(a, b) {
				var tankInfosA = dataTankopedia[a.tank_id],
					tankInfosB = dataTankopedia[b.tank_id];
				if (tankInfosA.level > tankInfosB.level) {
					return -1;
				}
				if (tankInfosA.level < tankInfosB.level) {
					return 1;
				}
				return 0;
			});
			for (var i=0; i<dataMyTanks.length; i++) {
				myTank = dataMyTanks[i];
				tankInfos = dataTankopedia[myTank.tank_id];
				winRatio = myTank.all.wins * 100 / myTank.all.battles;
				tableContent += '<tr class="tank ' + (myTank.in_garage?' ingarage':' hidden') + (tankInfos.is_premium?' ispremium isfull':'') +'">';
				tableContent += '<td><img src="' + tankInfos.contour_image + '" /></td>';
				tableContent += '<td data-value="' + myTank.mark_of_mastery + '" class="tankmastery' + myTank.mark_of_mastery + '">&nbsp;</td>';
				tableContent += '<td class="tankname">' + tankInfos.short_name_i18n + '</td>';
				tableContent += '<td data-value="' + tankInfos.level  + '">' + gTANKS_LEVEL[tankInfos.level - 1] + '</td>';
				tableContent += '<td>' + tankInfos.type_i18n + '</td>';
				tableContent += '<td>' + myTank.all.battles + '</td>';
				tableContent += '<td data-value="' + winRatio + '">' + (Math.round(winRatio * 100) / 100) + ' %</td>';
				tableContent += '<td data-value="0"><div class="togglebutton"><label><input type="checkbox" class="chkTanksIsFull" id="chkTanksIsFull' + myTank.tank_id + '" value="true"' + (tankInfos.is_premium?' checked="checked" disabled="disabled"':'') + ' /><span class="toggle"></span></label></div></td>';
				tableContent += '</tr>';
			}
			myTanksTable.attr('data-sortable', 'true');
			myTanksTable.find('tbody').append(tableContent);
			Sortable.initTable(myTanksTable[0]);
			myTanksTable.find('.chkTanksIsFull').on('change', function(evt) {
				$(this).closest('tr').toggleClass('isfull');
			});
			chkInGarage.on('change', function(evt) {
				applyTableTanksFilters(myTanksTable, {
					isfull: chkIsFull.is(':checked'),
					ingarage: chkInGarage.is(':checked')
				});
			});
			chkIsFull.on('change', function(evt) {
				applyTableTanksFilters(myTanksTable, {
					isfull: chkIsFull.is(':checked'),
					ingarage: chkInGarage.is(':checked')
				});
			});
			advanceProgress(i18n.t('loading.complete'));
			afterLoad();
		}, 'json');
	}, 'json');
};