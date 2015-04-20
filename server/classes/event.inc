<?php
require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'eventType.inc');

class Event {
	var $id;
	var $title;
	var $description;
	var $type;
	var $dateStart;
	var $dateEnd;
	var $isPrivate;
	var $owner;
	var $dateCreation;
	var $dateModification;
	var $isRecurrent;
	var $participants;

	public function __construct() {
		$this->id = -1;
		$this->title = '';
		$this->description = '';
		$this->dateStart = -1;
		$this->dateEnd = -1;
		$this->isPrivate = false;
		$this->dateCreation = -1;
		$this->dateModification = -1;
		$this->isRecurrent = false;
		$this->participants = array("50000000" => "unsure", "50000001" => "sure", "50000002" => "no");
	}

	public static function fromJson($json) {
		$instance = new self();
		$instance->loadByID( $id );
		return $instance;
	}

	public function toCalendarArray() {
		$result = array();
		$result['id'] = $this->id;
		$result['title'] = $this->title;
		$result['description'] = $this->description;
		$result['start'] = $this->dateStart . '000';
		$result['end'] = $this->dateEnd . '000';
		$result['class'] = 'event-type-' . $this->type;
		$result['participants'] = $this->participants;
		$result['url'] = './server/calendar.php?a=get&id=' . $this->id;
		return $result;
	}

	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getTitle() {
		return $this->title;
	}

	public function setTitle($title) {
		$this->title = $title;
	}

	public function getDescription() {
		return $this->description;
	}

	public function setDescription($description) {
		$this->description = $description;
	}

	public function getType() {
		return $this->type;
	}

	public function setType($type) {
		$this->type = $type;
	}

	public function getDateStart() {
		return $this->dateStart;
	}

	public function setDateStart($dateStart) {
		$this->dateStart = $dateStart;
	}

	public function getDateEnd() {
		return $this->dateEnd;
	}

	public function setDateEnd($dateEnd) {
		$this->dateEnd = $dateEnd;
	}

	public function getDateCreation() {
		return $this->dateCreation;
	}

	public function setDateCreation($dateCreation) {
		$this->dateCreation = $dateCreation;
	}

	public function getDateModification() {
		return $this->dateModification;
	}

	public function setDateModification($dateModification) {
		$this->dateModification = $dateModification;
	}

	public function isPrivate() {
		return $this->isPrivate;
	}

	public function setPrivate($isPrivate) {
		$this->isPrivate = $isPrivate;
	}

	public function isRecurrent() {
		return $this->isRecurrent;
	}

	public function setReccurent($isRecurrent) {
		$this->isRecurrent = $isRecurrent;
	}
}
?>