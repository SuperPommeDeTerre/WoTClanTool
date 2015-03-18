var gGOOGLE_API_KEY = 'AIzaSyAdKm0Y8JnlzOXm-DvH_12wEqZRiIp3Rto';
	gUserLang = navigator.language || navigator.userLanguage,
	gWG_API_LANG = gUserLang.split('-')[0],
	gTANKS_LEVEL = [ 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X' ];

// Wait for the DOM to finish its initialization before appending data to it.
$(document).ready(function() {
	moment.locale(gUserLang);
	i18n.init(function(t) {
		// translate nav
		$("html").i18n();
	});
	if (typeof(gPLAYER_ID) != "undefined") {
		$.post(gWG_API_URL + 'account/info/', {
			application_id: gWG_APP_ID,
			language: gWG_API_LANG,
			account_id: gPLAYER_ID
		}, function(dataPlayersResponse) {
			if (dataPlayersResponse.data[gPLAYER_ID].clan_id != gCLAN_ID) {
				window.location = 'unauthorized.php';
			} else {
				onLoad();
			}
		}, 'json');
	} else {
	onLoad();
	}
});
