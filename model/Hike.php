<?php

class Hike {
	protected $id;
	protected $name;
	protected $description;
	protected $creationDate;
	protected $waypoints;

	// Constructeur
	public function __construct($data) {
		$this->hydrate($data);
	}

	// Hydratation
	public function hydrate(array $data) {
		foreach ($data as $key => $value) {
			$method = 'set' . ucfirst($key);
			if (method_exists($this, $method)) {
				$this->$method($value);
			}
		}
	}

	// Getters
	public function id() { return $this->id; }
	public function name() { return $this->name; }
	public function description() { return $this->description; }
	public function creationDate() { return $this->creationDate; }
	public function waypoints() { return $this->waypoints; }

	// Setters
	public function setId($id) {
		if (is_numeric($id))
			$this->id = $id;
	}
	public function setName($name) {
		if (!is_numeric($name))
			$this->name = $name;
	}
	public function setdescription($description) {
		if (!is_numeric($description))
			$this->description = $description;
	}
	public function setCreationDate($creationDate) {
		$this->creationDate = $creationDate;
	}
	public function setWaypoints($waypoints) {
		$this->waypoints = $waypoints;
	}
}