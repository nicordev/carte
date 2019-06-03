<?php

// Chargement des clés
$keys = new KeyManager();

// Affichage d'un parcours
if (isset($_GET['action']) AND isset($_GET['hikeId'])) {
	$hikeId = htmlspecialchars($_GET['hikeId']);
	$hike = $hikeManager->getAHike($hikeId);
}

require ('view/mapView.php');