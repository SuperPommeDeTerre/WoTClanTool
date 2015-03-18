var gWG_API_URL = "https://api.worldoftanks.eu/wot/",
	gWG_APP_ID = '65d48624959befe37494ffa27e085450',
	gGOOGLE_API_KEY = 'AIzaSyAdKm0Y8JnlzOXm-DvH_12wEqZRiIp3Rto';
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
	onLoad();
});
