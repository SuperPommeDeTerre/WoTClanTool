var onLoad = function() {
	checkConnected();
	setNavBrandWithClan();
	advanceProgress(i18n.t('loading.complete'));
	afterLoad();
};