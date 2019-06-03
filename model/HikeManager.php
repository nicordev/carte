<?php

class HikeManager extends Manager {

	/**
	 *	Ajoute un parcours à la base de données
	 */
	public function add(Hike $hike) {
		$reqSQL = 'INSERT INTO hikes(name, waypoints, creationDate)
			VALUES (:name, :waypoints, NOW())';
		$q = $this->db->prepare($reqSQL);
		$q->execute(array(
			'name' => $hike->name(),
			'waypoints' => $hike->waypoints()
		));
	}

	/**
	 *	Retourne un tableau contenant tous les parcours enregistrés
	 *	@return un tableau contenant tous les parcours enregistrés
	 */
	public function getAllHikes() {
		$hikes = array();
		$i = 0;
		$reqSQL = 'SELECT *
			FROM hikes';
		$q = $this->db->query($reqSQL);
		while ($data = $q->fetch()) {
			$hikes[$i] = new Hike($data);
			$i++;
		}
		return $hikes;
	}

	/**
	 *	Retourne un parcours à partir de son id
	 *	@return le parcours
	 */
	public function getAHike($id) {
		$reqSQL = 'SELECT *
			FROM hikes
			WHERE id = ?';
		$q = $this->db->prepare($reqSQL);
		$q->execute(array($id));
		$data = $q->fetch();
		$hike = new Hike($data);
		return $hike;
	}
}