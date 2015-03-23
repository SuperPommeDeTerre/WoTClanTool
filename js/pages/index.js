var onLoad = function() {
	var myURI = URI(window.location.href);
	$('#btnLogin').on('click', function(evt) {
		evt.preventDefault();
		$.post(gConfig.WG_API_URL + 'wot/auth/login/', {
				'application_id': gConfig.WG_APP_ID,
				'language': gConfig.LANG,
				'redirect_uri': myURI.href(),
				'nofollow': 1,
				// Expires in 2 weeks (maximum session time)
				'expires_at': Math.floor((new Date() / 1000) + 8690400),
				'display': 'page'
			}, function(data) {
				if (data.data.location.indexOf(window.location.href) == -1) {
					window.location.href = data.data.location;
				}
			}, 'json');
	});
};
