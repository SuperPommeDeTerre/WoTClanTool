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

var displayTanks = function(dataMyTanks, dataTankopedia) {
	var myTanksTable = $('#tableMyTanks'),
		myTanksSmallContainer = $('#myTanksContainerSmall'),
		myTanksBigContainer = $('#myTanksContainerBig'),
		tableContent = '',
		listContent = '',
		listLargeContent = '',
		myTank = null,
		tankInfos = null,
		winRatio = 0,
		chkInGarage = $('#chkInGarage'),
		chkIsFull = $('#chkIsFull');
	// Save tanks infos
	$.post('./server/player.php', {
		'action': 'settanksstats',
		'data': JSON.stringify(dataMyTanks)
	}, function(dataSaveTanksResponse) {
		// Then reget it with WN8 calculation
		$.post('./server/player.php', {
			'action': 'gettanksstats'
		}, function(dataMyTanksResponse) {
			var dataMyTanks = dataMyTanksResponse.data[gConfig.PLAYER_ID];
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
				winRatio = -1;
				if (myTank.all.battles > 0) {
					winRatio = myTank.all.wins * 100 / myTank.all.battles;
				}
				tableContent += '<tr class="tank ' + (myTank.in_garage?' ingarage':' hidden') + (tankInfos.is_premium?' ispremium':'') + (tankInfos.is_premium||myTank['is_full']?' isfull':'') +'">';
				tableContent += '<td><img src="' + tankInfos.contour_image + '" /></td>';
				tableContent += '<td data-value="' + myTank.mark_of_mastery + '" class="tankmastery' + myTank.mark_of_mastery + '">&nbsp;</td>';
				tableContent += '<td class="tankname">' + tankInfos.short_name_i18n + '</td>';
				tableContent += '<td data-value="' + tankInfos.level  + '">' + gTANKS_LEVEL[tankInfos.level - 1] + '</td>';
				tableContent += '<td>' + tankInfos.type_i18n + '</td>';
				tableContent += '<td>' + myTank.all.battles + '</td>';
				tableContent += '<td><label class="label label-' + getWN8Class(myTank.wn8) + '">' + (Math.round(myTank.wn8 * 100) / 100) + '</label></td>';
				tableContent += '<td data-value="' + winRatio + '">' + (winRatio > -1?(Math.round(winRatio * 100) / 100) + ' %':'-') + '</td>';
				tableContent += '<td data-value="' + (tankInfos.is_premium?'1':'0') + '"><div class="togglebutton' + (tankInfos.is_premium?' togglebutton-material-amber':'') + '"><label>&nbsp;<input type="checkbox" class="chkTanksIsFull" id="chkTanksIsFull' + myTank.tank_id + '" value="' + myTank.tank_id + '"' + (tankInfos.is_premium||myTank['is_full']?' checked="checked"':'') + (tankInfos.is_premium?' disabled="disabled"':'') + ' /></label></div></td>';
				tableContent += '</tr>';
				listContent += '<div class="small tank tankcontainer tankmastery' + myTank.mark_of_mastery +  (myTank.in_garage?' ingarage':' hidden') + (tankInfos.is_premium?' ispremium':'') + (tankInfos.is_premium||myTank['is_full']?' isfull':'') +'">';
				listContent += '<div class="tanklevel' + tankInfos.level + '"><img src="' + tankInfos.image_small + '" /></div>';
				listContent += '<p class="tankname">' + tankInfos.short_name_i18n + '</p>';
				listContent += '</div>';
				listLargeContent += '<div class="big tank tankcontainer tankmastery' + myTank.mark_of_mastery + (myTank.in_garage?' ingarage':' hidden') + (tankInfos.is_premium?' ispremium':'') + (tankInfos.is_premium||myTank['is_full']?' isfull':'') +'">';
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
				$.post('./server/player.php', {
					'action': 'settankisfull',
					'tank_id': $(this).val(),
					'is_full': $(this).is(':checked')
				}, function(dataSaveTanksResponse) {
				}, 'json');
				$(this).closest('tr').toggleClass('isfull');
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
			afterLoad();
		}, 'json');
	}, 'json');
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
			dataMyTanks = dataMyTanksResponse.data[gConfig.PLAYER_ID];
			displayTanks(dataMyTanks, dataTankopedia);
		}, 'json');
	}, 'json');
};