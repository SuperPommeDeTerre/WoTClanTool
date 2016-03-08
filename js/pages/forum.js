var onLoad = function() {
	checkConnected();
	setNavBrandWithClan();
	advanceProgress($.t('loading.complete'));
	afterLoad();
};