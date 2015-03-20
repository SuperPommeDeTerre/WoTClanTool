// Define some global variables
var gTANKS_LEVEL = [ 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X' ],
	gLangMapping = {
		'fr': 'fr-FR'
	};

var advanceProgress = function(pProgress, pMessage) {
	gProgressMessage.text(pMessage);
	gProgressPar.attr('aria-valuenow', pProgress)
		.css('width', pProgress + '%')
		.text(pProgress + ' %');
};

// Wait for the DOM to finish its initialization before appending data to it.
$(document).ready(function() {
	gProgressPar = $('#progressBar');
	gProgressMessage = $('#progressInfoMessage');
	moment.locale(gConfig.LANG);
	i18n.init(function(t) {
		// translate nav
		$("html").i18n();
	});
	if (typeof(gConfig.PLAYER_ID) != 'undefined') {
		$.post(gConfig.WG_API_URL + 'account/info/', {
			application_id: gConfig.WG_APP_ID,
			language: gConfig.LANG,
			account_id: gConfig.PLAYER_ID
		}, function(dataPlayersResponse) {
			var me = dataPlayersResponse.data[gConfig.PLAYER_ID],
				isClanFound = false;
			for (var i=0; i<gConfig.CLAN_IDS.length; i++) {
				if (me.clan_id == gConfig.CLAN_IDS[i]) {// || me.nickname == 'SuperPommeDeTerre') {
					onLoad();
					isClanFound = true;
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
		$.post(gConfig.WG_API_URL + 'auth/logout/', {
			application_id: gConfig.WG_APP_ID,
			access_token: gConfig.ACCESS_TOKEN
		}, function(data) {
			document.location = "./logout.php";
		}, 'json');
	});
});

var afterLoad = function() {
	$('#progressDialog').fadeOut('fast');
};

