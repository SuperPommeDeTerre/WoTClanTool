/**
 * Authorized chars by WG for IGN
 */
var gIGNLeadingChars = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_' ];

var onLoad = function() {
	checkConnected();
	progressNbSteps = 7;
	var ignPills = '',
		i = 0,
		membersGroups = {};
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
	$('#linkFilter').on('click', function(evt) {
		evt.preventDefault();
		$(this).parent().next().slideToggle('fast');
	});
	$('#btnsFilterTankLevel button').on('click', function(evt) {
		$(this).toggleClass('active');
	});
	$('#btnsFilterTankType button').on('click', function(evt) {
		$(this).toggleClass('active');
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
			$(this).toggleClass('active');
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
					advanceProgress(i18n.t('loading.generating'));
					var dataPlayersVehicles = dataPlayersVehiclesResponse.data;
					advanceProgress(i18n.t('loading.generating'));
					advanceProgress(i18n.t('loading.complete'));
					afterLoad();
				}, 'json');
			}, 'json');
		}, 'json');
	}, 'json');
};