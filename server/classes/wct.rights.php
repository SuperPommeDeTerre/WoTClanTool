<?php
class WctRights {
	/**
	 * Special role "self"
	 *
	 * @var string
	 */
	const SPECIAL_ROLE_SELF = "self";
	/**
	 * Special role "owner"
	 *
	 * @var string
	 */
	const SPECIAL_ROLE_OWNER = "owner";

	const ROLE_COMMANDER = "commander";
	const ROLE_EXECUTIVE_OFFICER = "executive_officer";
	const ROLE_PERSONNEL_OFFICER = "personnel_officer";
	const ROLE_INTELLIGENCE_OFFICER = "intelligence_officer";
	const ROLE_QUARTERMASTER = "quartermaster";
	const ROLE_COMBAT_OFFICER = "combat_officer";
	const ROLE_JUNIOR_OFFICER = "junior_officer";
	const ROLE_RECRUITMENT_OFFICER = "recruitment_officer";
	const ROLE_PRIVATE = "private";
	const ROLE_RESERVIST = "reservist";
	const ROLE_RECRUIT = "recruit";

	/**
	 * Clan's roles
	 * 
	 * @var array
	 */
	public static $ROLES = [
			WctRights::ROLE_COMMANDER,
			WctRights::ROLE_EXECUTIVE_OFFICER,
			WctRights::ROLE_PERSONNEL_OFFICER,
			WctRights::ROLE_INTELLIGENCE_OFFICER,
			WctRights::ROLE_QUARTERMASTER,
			WctRights::ROLE_COMBAT_OFFICER,
			WctRights::ROLE_JUNIOR_OFFICER,
			WctRights::ROLE_RECRUITMENT_OFFICER,
			WctRights::ROLE_PRIVATE,
			WctRights::ROLE_RESERVIST,
			WctRights::ROLE_RECRUIT
		];

	/**
	 * Clan's default rights
	 *
	 * @var array
	 */
	private static $DEFAULT_RIGHTS = [
			"clansettings" => [
					"view" => [ WctRights::ROLE_COMMANDER ],
					"modify" => [ WctRights::ROLE_COMMANDER ]
				],
			"events" => [
				"create" => [
					WctRights::ROLE_COMMANDER,
					WctRights::ROLE_EXECUTIVE_OFFICER,
					WctRights::ROLE_PERSONNEL_OFFICER,
					WctRights::ROLE_INTELLIGENCE_OFFICER,
					WctRights::ROLE_QUARTERMASTER,
					WctRights::ROLE_COMBAT_OFFICER,
					WctRights::ROLE_JUNIOR_OFFICER,
					WctRights::ROLE_RECRUITMENT_OFFICER,
					WctRights::ROLE_PRIVATE,
					WctRights::ROLE_RESERVIST,
					WctRights::ROLE_RECRUIT
				],
				"modify" => [ WctRights::SPECIAL_ROLE_OWNER, WctRights::ROLE_COMMANDER ],
				"assigntanks" => [
					WctRights::SPECIAL_ROLE_SELF,
					WctRights::SPECIAL_ROLE_OWNER,
					WctRights::ROLE_COMMANDER,
					WctRights::ROLE_EXECUTIVE_OFFICER,
					WctRights::ROLE_INTELLIGENCE_OFFICER,
					WctRights::ROLE_QUARTERMASTER,
					WctRights::ROLE_COMBAT_OFFICER
				],
				"assignmap" => [
					WctRights::SPECIAL_ROLE_OWNER,
					WctRights::ROLE_COMMANDER,
					WctRights::ROLE_EXECUTIVE_OFFICER,
					WctRights::ROLE_INTELLIGENCE_OFFICER,
					WctRights::ROLE_QUARTERMASTER,
					WctRights::ROLE_COMBAT_OFFICER
				]
			],
			"strategy" => [
				"create" => [
					WctRights::ROLE_COMMANDER,
					WctRights::ROLE_EXECUTIVE_OFFICER,
					WctRights::ROLE_PERSONNEL_OFFICER,
					WctRights::ROLE_INTELLIGENCE_OFFICER,
					WctRights::ROLE_QUARTERMASTER,
					WctRights::ROLE_COMBAT_OFFICER,
					WctRights::ROLE_JUNIOR_OFFICER,
					WctRights::ROLE_RECRUITMENT_OFFICER,
					WctRights::ROLE_PRIVATE,
					WctRights::ROLE_RESERVIST,
					WctRights::ROLE_RECRUIT
				],
				"modify" => [
					"owner",
					WctRights::ROLE_COMMANDER,
					WctRights::ROLE_EXECUTIVE_OFFICER,
					WctRights::ROLE_INTELLIGENCE_OFFICER,
					WctRights::ROLE_QUARTERMASTER,
					WctRights::ROLE_COMBAT_OFFICER
				],
				"validate" => [
					WctRights::ROLE_COMMANDER,
					WctRights::ROLE_EXECUTIVE_OFFICER,
					WctRights::ROLE_INTELLIGENCE_OFFICER,
					WctRights::ROLE_QUARTERMASTER,
					WctRights::ROLE_COMBAT_OFFICER
				]
			]
		];

	/**
	 * Rights matrix
	 */
	public static $RIGHTS_MATRIX = [
			"clansettings" => [
					"view" => [ "requiredroles" => [ WctRights::ROLE_COMMANDER ] ],
					"modify" => [ "requiredroles" => [ WctRights::ROLE_COMMANDER ], "need" => [ "clansettings.view" ] ]
				],
			"events" => [
					"create" => [ "requiredroles" => [] ],
					"modify" => [ "requiredroles" => [], "special" => [ WctRights::SPECIAL_ROLE_OWNER ] ],
					"assigntanks" => [ "requiredroles" => [], "special" => [ WctRights::SPECIAL_ROLE_OWNER, WctRights::SPECIAL_ROLE_SELF ] ],
					"assignmap" => [ "requiredroles" => [], "special" => [ WctRights::SPECIAL_ROLE_OWNER ] ]
				],
			"strategy" => [
					"create" => [ "requiredroles" => [] ],
					"modify" => [ "requiredroles" => [] ],
					"validate" => [ "requiredroles" => [] ]
				]
		];

	/**
	 * Gets the user ID from parameter or from session.
	 * 
	 * @param int $pUserId User ID
	 * @return int User ID
	 */
	private static function getRealUserId($pUserId = null) {
		$lUserId = $pUserId;
		if ($pUserId == null) {
			$lUserId = $_SESSION['account_id'];
		}
		return $lUserId;
	}

	/**
	 * Gets the clan rights configuration.
	 *
	 * @param unknownint $pClanId Clan's ID
	 * @return array Clan's rights matrix
	 */
	public static function getClanRights($pClanId = null) {
		// TODO Gets the specified clan infos and not only the connected user's one.
		global $gClanConfig;
		$lEffectiveRights = WctRights::$DEFAULT_RIGHTS;
		if (array_key_exists("rights", $gClanConfig)) {
			$lEffectiveRights = $gClanConfig["rights"];
		}
		return $lEffectiveRights;
	}

	/**
	 * Determine if the specified user is an administrator.
	 * 
	 * @param int $pUserId User ID
	 * @return boolean <code>true</code> if the user is an administrator and <code>false</code> elsewhere.
	 */
	public static function isUserAdmin($pUserId = null) {
		global $gAdmins;
		return in_array(WctRights::getRealUserId($pUserId), $gAdmins);
	}
	
	/**
	 * Get the user's role.
	 * 
	 * @param int $pUserId User ID
	 * @return string The user's role.
	 */
	public static function getUserRole($pUserId = null) {
		// TODO Gets the specified user role and not only the connected user's one.
		return $_SESSION["USER_ROLE"];
	}

	/**
	 * Return the effective rights array of the user.
	 * 
	 * @param int $pUserId User ID
	 * @return array Array of the user's allowed rights
	 */
	public static function getUserRights($pUserId = null) {
		// TODO Implementes it, stupid !
		return WctRights::$DEFAULT_RIGHTS;
	}
	
	/**
	 * Determine if the user has the selected role
	 *
	 * @param string $pProfileName Profile name
	 * @param int $pUserId User ID
	 * @return boolean <code>true</code> if the user has the selected profile and <code>false</code> elsewhere.
	 */
	public static function isUserHasRole($pProfileName, $pUserId = null) {
		$lUserId = WctRights::getRealUserId($pUserId);
		$isRoleAssigned = false;
		if (is_array($pProfileName)) {
			foreach($pProfileName as $roleName) {
				if (WctRights::isUserHasRole($pProfileName, $pProfileName)) {
					$isRoleAssigned = true;
					break;
				}
			}
		}
		return $isRoleAssigned || WctRights::isUserAdmin($lUserId) || WctRights::getUserRole($lUserId) == $pProfileName;
	}

	/**
	 * Determine if the user has the specified right
	 * 
	 * @param string $pRightName Right name
	 * @param int $pUserId The user id to test (if not provided, then use the connected user id)
	 * @return boolean <code>true</code> if the the user has the right and <code>false</code> elsewhere
	 */
	public static function isUserHasRight($pRightName, $pUserId = null) {
		$lUserId = WctRights::getRealUserId($pUserId);
		$isRightAllowed = false;
		if (WctRights::isUserAdmin($lUserId)) {
			$isRightAllowed = true;
		} else {
			$rightElements = explode(".", $pRightName);
			// Get the rights assigned to the user
			$userAssignedRights = WctRights::getUserRights($lUserId);
			// Ensure the right is in the assigned rights matrix
			$isRightAllowed = array_key_exists($rightElements[0], $userAssignedRights) && array_key_exists($rightElements[1], $userAssignedRights[$rightElements[0]]);
		}
		return $isRightAllowed;
	}
}
