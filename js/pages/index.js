var doLogin = function(pDestURI) {
	$.post(gConfig.CLUSTERS[gConfig.CLUSTER].url + 'wot/auth/login/', {
			'application_id': gConfig.CLUSTERS[gConfig.CLUSTER].key,
			'language': gConfig.LANG,
			'redirect_uri': pDestURI.href(),
			'nofollow': 1,
			// Expires in 2 weeks (maximum session time)
			'expires_at': Math.floor((new Date() / 1000) + 8690400),
			'display': 'page'
		}, function(data) {
			if (data.data.location.indexOf(window.location.href) == -1) {
				window.location.href = data.data.location;
			}
		}, 'json');
};

var onLoad = function() {
	var myURI = URI(window.location.href),
		destURI = myURI;
	if (myURI.search(true)['returnUrl']) {
		destURI = URI(myURI.search(true)['returnUrl']);
	}
	$('.cluster').on('click', function(evt) {
		var destCluster = $(this).data('region');
		$.post('./server/player.php', {
			'action': 'setcluster',
			'cluster': destCluster
		}, function(dataResponseSetClusterData) {
			gConfig.CLUSTER = destCluster;
			doLogin(destURI);
		}, 'json');
	});
	$('#btnLogin').on('click', function(evt) {
		evt.preventDefault();
		if (typeof($(this).data('target')) == 'undefined') {
			// Only one cluster is defined. Process with login
			doLogin(destURI);
		}
	});
};
