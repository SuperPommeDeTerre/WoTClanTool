/**
 * Wargaming Application ID
 * This is used for wargaming API calls.
 */
var WG_APP_ID = '65d48624959befe37494ffa27e085450',
	WG_BASE_URI = 'https://api.worldoftanks.eu';

function dateFormat(pDate) {
	var returnValue = '';
	if (pDate != null) {
		var str = "" + pDate.getDate(),
			pad = "00";
		returnValue += pad.substring(0, pad.length - str.length) + str + "/";
		str = "" + (pDate.getMonth() + 1);
		returnValue += pad.substring(0, pad.length - str.length) + str + "/";
		returnValue += pDate.getFullYear();
	}
	return returnValue;
};

$(document).ready(function() {
	$.tablesorter.addParser({
		// set a unique id
		id: 'wottimestamp',
		is: function(s) {
			// return false so this parser is not auto detected
			return false;
		},
		format: function(s) {
			// format your data for normalization
			return s.substr(6, 4) + s.substr(3, 2) + s.substr(0, 2);
		},
		// set type, either numeric or text 
		type: 'numeric'
	});
	// Testing URI search to ensure the user is connected to WG
	var myURIParams = URI(window.location.href).search(true),
		userInfos = {},
		tankopedia = {};
	if (myURIParams['access_token']) {
		// URI search part parsing
		userInfos['token'] = myURIParams['access_token'];
		userInfos['id'] = myURIParams['account_id'];
		userInfos['name'] = myURIParams['nickname'];
		userInfos['expires'] = myURIParams['expires_at'];
		// TODO: Transformation de l'URL pour masquer les parametres
		//window.history.pushState("", window.title, URI(window.location.href).removeSearch().href());
		$("#userInfos").empty();
		$.post(WG_BASE_URI + '/wot/encyclopedia/tanks/', {
			'application_id': WG_APP_ID,
			'language': $('html').attr('lang')
		}, function(data) {
			tankopedia = data.data;
		}, 'json');
		// Clan info retrieval
		$.post(WG_BASE_URI + '/wot/clan/membersinfo/', {
			'application_id': WG_APP_ID,
			'language': $('html').attr('lang'),
			'member_id': userInfos['id']
		}, function(data) {
			var userInfosStruct = data.data[userInfos['id']],
				htmlInject = '<p><a id=\"userName\" href=\"/user/\"><span>' + userInfos['name'] + '</span></a></p>';
			htmlInject += '<div id=\"userDetails\">';
			htmlInject += '  <ul>';
			htmlInject += '    <li><span data-i18n-key="user.info.clan">Clan :</span><span>' + userInfosStruct.clan_name + ' (' + data.data[userInfos['id']].abbreviation + ')</span></li>';
			htmlInject += '    <li><span data-i18n-key="user.info.clan.role">Rôle :</span><span>' + userInfosStruct.role_i18n + '</span></li>';
			htmlInject += '  </ul>';
			htmlInject += '</div>';
			$('#userInfos').append(htmlInject).find('#userName');
			//.append('<img src=\"' + data.data[userInfos['id']].emblems.large + '\" />');
			$.post(WG_BASE_URI + '/wot/clan/info/', {
				'application_id': WG_APP_ID,
				'language': $('html').attr('lang'),
				'token': userInfos['token'],
				'clan_id': userInfosStruct['clan_id']
			}, function(data) {
				var clanDetailsStruct = data.data[userInfosStruct['clan_id']],
					membersTableContent = $('#clanMembers tbody'),
					curMember = {};
				$('#clanMembersCount').text(clanDetailsStruct.members_count);
				htmlInject = '';
				for (var member in clanDetailsStruct.members) {
					curMember = clanDetailsStruct.members[member];
					htmlInject += '<tr>';
					htmlInject += '<td id=\"' + curMember.account_id + '\"><a href=\"http://worldoftanks.eu/community/accounts/' + curMember.account_id + '-' + curMember.account_name + '/\" class=\"clanMemberDetails\">' + curMember.account_name + '</a></td>';
					htmlInject += '<td>' + curMember.role_i18n + '</td>';
					htmlInject += '<td>' + dateFormat(new Date(curMember.created_at * 1000)) + '</td>';
					htmlInject += '</tr>';
				}
				membersTableContent.empty().html(htmlInject);
				$('#clanMembers').tablesorter({
					sortList: [[1,0], [0,0]],
					headers: {
							2: {
									sorter: 'wottimestamp'
								}
						}
					});
			}, 'json');
		}, 'json');
	} else {
		$('#btnLogin').show();
	}
	$('#clanMembers').on('click', '.clanMemberDetails', function(evt) {
		evt.preventDefault();
		htmlInject = '';
		var memberId = $(this).closest('td').attr('id');
		$('#memberTanks').tablesorter();
		$.post(WG_BASE_URI + '/wot/tanks/stats/', {
			'application_id': WG_APP_ID,
			'language': $('html').attr('lang'),
			'account_id': memberId,
			'access_token': userInfos['token']
		}, function(data) {
			var playersTanks = data.data[memberId],
				tankInfos = {};
			htmlInject = '';
			for (var i=0; i<playersTanks.length; i++) {
				tankInfos = tankopedia[playersTanks[i].tank_id];
				htmlInject += '<tr>';
				htmlInject += '<td>' + tankInfos.name_i18n + '</td>';
				htmlInject += '<td>' + tankInfos.level + '</td>';
				htmlInject += '<td>' + tankInfos.type_i18n + '</td>';
				htmlInject += '<td>' + tankInfos.nation_i18n + '</td>';
				htmlInject += '<td>' + playersTanks[i].all.battles + '</td>';
				htmlInject += '<td>' + playersTanks[i].mark_of_mastery + '</td>';
				htmlInject += '<td>' + (playersTanks[i].in_garage?'Oui':'Non') + '</td>';
				htmlInject += '</tr>';
			}
			$('#memberTanks tbody').empty().html(htmlInject);
			$('#memberTanks').trigger('update');
		}, 'json');
	});
	$('#btnLogin').on('click', function(evt) {
		evt.preventDefault();
		$.post(WG_BASE_URI + '/wot/auth/login/', {
				'application_id': WG_APP_ID,
				'language': $('html').attr('lang'),
				'redirect_uri': window.location.href,
				'nofollow': 1,
				'expires_at': 600,
				'display': 'page'
			}, function(data) {
				if (data.data.location.indexOf(window.location.href) == -1) {
					window.location.href = data.data.location;
				}
			}, 'json');
	});
});
