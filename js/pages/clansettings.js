var onLoad = function() {
	checkConnected();
	setNavBrandWithClan();
	advanceProgress($.t('loading.complete'));
	afterLoad();
	$("#btnSaveClanClanSettings").on("click", function(e) {
		e.preventDefault();
	});
};