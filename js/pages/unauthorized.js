$(document).ready(function() {
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