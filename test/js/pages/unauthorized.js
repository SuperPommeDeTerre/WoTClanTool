$('#btnLogout').on('click', function(evt) {
	evt.preventDefault();
	$.post(gWG_API_URL + 'auth/logout/', {
		application_id: gWG_APP_ID,
		access_token: gACCESS_TOKEN
	}, function(data) {
		document.location = "./index.php";
	}, 'json');
});