<?php
class WctRights
{
	const CLAN_SETTINGS = 0;
	const STRAT_CREATE = 1;
	const STRAT_VALIDATE = 1;

	/**
	 * Determine if the user has the selected role
	 *
	 * @param $pProfileName
	 *    Profile name
	 * @param $pUserId
	 *    User ID
	 * @return <code>true</code> if the user has the selected profile and <code>false</code> elsewhere.
	 */
	public static function isUserHasProfile($pProfileName, $pUserId = null) {
		return in_array($_SESSION["USER_ROLE"], array($pProfileName));
	}

	/**
	 *
	 */
	public static function isUserHasRight($pRightName, $pUserId = null) {
		return in_array($_SESSION["USER_ROLE"], array($pProfileName));
	}
}
