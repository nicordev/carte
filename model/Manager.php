<?php

class Manager {
	protected $db;

	// Constructeur
	public function __construct($db) {
		$this->setDb($db);
	}

	// Setters
	public function setDb($db) {
		$this->db = $db;
	}
}