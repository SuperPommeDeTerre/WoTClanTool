var onLoad = function() {
	checkConnected();
	setNavBrandWithClan();
	advanceProgress($.t('loading.complete'));
	afterLoad();
	$("#btnSaveClanClanSettings").on("click", function(e) {
		e.preventDefault();
		$.post('./server/clan.php', { 'a': 'setforumurl', 'forumurl': $('#clanForumURL').val() }, function(result) {
			
		}, 'json');
	});
};