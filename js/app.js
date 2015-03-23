// Define some global variables
var gTANKS_LEVEL = [ 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X' ],
	gLangMapping = {
		'fr': 'fr-FR'
	},
	gPersonalInfos = '';

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

var checkConnected = function() {
	if (typeof(gConfig.PLAYER_ID) == 'undefined') {
		document.location = './unauthorized.php';
	}
};

var setNavBrandWithClan = function(clanInfos) {
	var clanEmblem = '';
	// Get the 32x32 emblem
	for (var i=0; i<clanInfos.emblems.length; i++) {
		if (clanInfos.emblems[i].type == '32x32') {
			clanEmblem = clanInfos.emblems[i].url;
			break;
		}
	}
	$('#mainNavBar .navbar-brand').html('<span style="color:' + clanInfos.color + '">[' + clanInfos.tag + ']</span> ' + clanInfos.name + ' <small>' + clanInfos.motto + '</small>')
		// Set clan emblem with CSS because it causes problems with inline HTML.
		.css('background', 'url(\'' + clanEmblem + '\') no-repeat 15px center')
		// Add padding to avoid overlap of emblem and text
		.css('padding-left', '51px');
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
					onLoad();
					isClanFound = true;
					gPersonalInfos = me;
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
};
