// Define some global variables
var gTANKS_LEVEL = [ 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X' ],
	gTANKS_TYPES =  { 'lightTank': 1, 'mediumTank': 2, 'heavyTank': 3, 'AT-SPG': 4, 'SPG': 5 },
	gROLE_POSITION = { 'commander': 1, 'executive_officer': 2, 'personnel_officer': 3, 'combat_officer': 4, 'intelligence_officer': 5, 'recruitment_officer': 6, 'junior_officer': 7, 'private': 8, 'recruit': 9, 'reservist': 10 },
	gLangMapping = {
		'fr': 'fr-FR'
	},
	gWN8_CLASSES = {
		'material-black': { min: 0, max: 300 },
		'material-red-900': { min: 300, max: 600 },
		'material-orange-900': { min: 600, max: 900 },
		'material-yellow-500': { min: 900, max: 1250 },
		'material-green-500': { min: 1250, max: 1600 },
		'material-green-900': { min: 1600, max: 1900 },
		'material-blue-500': { min: 1900, max: 2350 },
		'material-purple-300': { min: 2350, max: 2900 },
		'material-purple-800': { min: 2900, max: -1 }
	},
	gPersonalInfos = null;

var gProgressBar,
	gProgressMessage,
	progressNbSteps = 0,
	progressCurStep = 0;
var advanceProgress = function(pMessage) {
	var progressToSet = (++progressCurStep * (100 / progressNbSteps));
	gProgressMessage.text(pMessage);
	gProgressBar.attr('aria-valuenow', progressToSet)
		.css('width', progressToSet + '%')
		.text(progressToSet + ' %');
};

var getWN8Class = function(pWN8Rating) {
	var returnVal = '';
	for (lClass in gWN8_CLASSES) {
		var lClassObj = gWN8_CLASSES[lClass];
		// Handle last case
		if (lClassObj.max < 0 && pWN8Rating >= lClassObj.min) {
			returnVal = lClass;
			break;
		} else if (pWN8Rating >= lClassObj.min && pWN8Rating < lClassObj.max) {
			returnVal = lClass;
			break;
		}
	}
	return returnVal;
};

var checkConnected = function() {
	var isUserValid = false;
	if (typeof(gConfig.PLAYER_ID) == 'undefined') {
		// User is not connected, redirect to home
		document.location = './index.php';
	} else {
		isUserValid = false;
		for (var i=0; i<gConfig.CLAN_IDS.length; i++) {
			if (gPersonalInfos.clan_id == gConfig.CLAN_IDS[i])
			isUserValid = true;
			break;
		}
		if (!isUserValid) {
			document.location = './unauthorized.php';
		}
	}
};

var setNavBrandWithClan = function() {
	$.post(gConfig.WG_API_URL + 'wgn/clans/info/', {
		application_id: gConfig.WG_APP_ID,
		language: gConfig.LANG,
		access_token: gConfig.ACCESS_TOKEN,
		clan_id: gConfig.CLAN_IDS.join(',')
	}, function(dataClanResponse) {
		var dataClan = dataClanResponse.data[gConfig.CLAN_IDS[0]],
			clanEmblem = dataClan.emblems.x32.portal;
		$('#mainNavBar .navbar-brand').html('<span style="color:' + dataClan.color + '">[' + dataClan.tag + ']</span> ' + dataClan.name + ' <small>' + dataClan.motto + '</small>')
			// Set clan emblem with CSS because it causes problems with inline HTML.
			.css('background', 'url(\'' + clanEmblem + '\') no-repeat 15px center')
			// Add padding to avoid overlap of emblem and text
			.css('padding-left', '51px');
	}, 'json');
};

// Wait for the DOM to finish its initialization before appending data to it.
$(document).ready(function() {
	gProgressBar = $('#progressBar');
	gProgressMessage = $('#progressInfoMessage');
	moment.locale(gConfig.LANG);
	i18n.init({ lng: gConfig.LANG, fallbackLng: 'fr' }, function(t) {
		$(document).i18n();
	});
	if (typeof(gConfig.PLAYER_ID) != 'undefined') {
		// Verify that user is member of one of the handled clans...
		$.post(gConfig.WG_API_URL + 'wot/account/info/', {
			application_id: gConfig.WG_APP_ID,
			language: gConfig.LANG,
			access_token: gConfig.ACCESS_TOKEN,
			account_id: gConfig.PLAYER_ID
		}, function(dataPlayersResponse) {
			var me = dataPlayersResponse.data[gConfig.PLAYER_ID],
				isClanFound = false;
			for (var i=0; i<gConfig.CLAN_IDS.length; i++) {
				if (me.clan_id == gConfig.CLAN_IDS[i]) {
					isClanFound = true;
					gPersonalInfos = me;
					onLoad();
					break;
				}
			}
			if (!isClanFound) {
				// Clan is not found. Redirect to unauthorized
				window.location = 'unauthorized.php';
			}
		}, 'json');
	} else {
		onLoad();
	}
	$('#linkLogout').on('click', function(evt) {
		evt.preventDefault();
		$.post(gConfig.WG_API_URL + 'wot/auth/logout/', {
			application_id: gConfig.WG_APP_ID,
			access_token: gConfig.ACCESS_TOKEN
		}, function(data) {
			document.location = "./logout.php";
		}, 'json');
	});
});

var afterLoad = function() {
	$('#progressDialog').fadeOut('fast');
	$('.header-fixed').stickyTableHeaders({fixedOffset: $('#mainNavBar')});
	$.material.init();
};
