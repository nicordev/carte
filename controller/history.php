<?php

/**
 *	Ajoute des lignes à un tableau html correspondant aux parcours
 */
function fillHtmlArrayWithHikes(array $hikes) {
	foreach ($hikes as $hike) {
		fillHtmlRowWithAHike($hike);
	}
}

/**
 *	Ajoute une ligne contenant un parcours à un tableau html
 */
function fillHtmlRowWithAHike(Hike $hike) {
	echo '<tr>
		<td>' . $hike->name() . '</td>
		<td>
			<form method="post" action="index.php?page=recording&action=showHike&hikeId=' . $hike->id() . '">
				<input type="hidden" value="' . $hike->waypoints() .'" />
				<input class="smallButton" type="submit" value="Charger le parcours" />
			</form>
		</td>
		<td>
			<form method="post" action="index.php?page=download&action=downloadHike&hikeId=' . $hike->id() . '">
				<input type="hidden" value="' . $hike->waypoints() .'" />
				<input class="smallButton" type="submit" value="Télécharger le parcours" />
			</form>
		</td>
	</tr>';
}


// Sauvegarde du parcours dans la base de données
if (isset($_GET['action'])) {
	switch ($_GET['action']) {
		case 'savePath':
			if (isset($_POST['waypoints']) AND isset($_POST['hikeName'])) {
				$newHike = new Hike(array(
					'name' => htmlspecialchars($_POST['hikeName']),
					'waypoints' => $_POST['waypoints'] // On ne peut pas utiliser htmlspecialchars() car ça empêcherait l'enregistrement du parcours dans la base de données.
				));
				$hikeManager->add($newHike);
			}
			$msg = htmlspecialchars($_POST['hikeName']) . ' enregistré';
			break;
	}
}

// Récupération des parcours enregistrés
$hikes = $hikeManager->getAllHikes();

require ('view/historyView.php');