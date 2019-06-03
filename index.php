<?php

/**
 * Permet de charger les classes avec l'autoload
 *
 * @param $classname le nom de la classe à charger
*/
function classLoad($classname)
{
  require 'model/' . $classname .'.php';
}

// Permet de créer un objet connecté à la base de données
function dbConnect()
{
	try {
	    $db = new \PDO('mysql:host=localhost;dbname=carte;charset=utf8', 'root', '');
	}
	catch(Exception $e) {
		exit('<b>Catched exception at line '. $e->getLine() .' :</b> '. $e->getMessage());
	}
    
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING); // On émet une alerte à chaque fois qu'une requête a échoué.
    return $db;
}

// Autoload
spl_autoload_register('classLoad');

// Base de données
$db = dbConnect();

// Gestionnaire de parcours
$hikeManager = new HikeManager($db);

// Routeur
if (isset($_GET['page'])) {
	switch ($_GET['page']) {
		case 'recording':
			require ('controller/map.php');
			break;
		case 'history':
			require ('controller/history.php');
			break;
		case 'download':
			require ('controller/download.php');
			break;
		default:
			require ('view/mainView.php');
	}
} else {
	require ('view/mainView.php');
}