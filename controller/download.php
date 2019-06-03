<?php

/**
 *  Créé un fichier .mdt et place les waypoints dedans
 *
 *  @param {array} waypoints le tableau contenant les waypoints
 *  @return {File} le fichier contenant les waypoints
 */
function writeWaypointsFileMDT($waypoints) {

    $file = fopen('waypoints.mdt', 'w+');
    $newLine = "";
    $waypointNumber = 0;
    $x93 = 0;
    $y93 = 0;

    for ($i = 0; $i < count($waypoints); $i++) {
        $waypointNumber++;
        convertGeoToL93($waypoints[$i]->lat, $waypoints[$i]->lng, $x93, $y93);
        $x93 = round($x93, 3);
        $y93 = round($y93, 3);
        $newLine = "\t" . $waypointNumber . "\t" . $x93 . "\t" . $y93 . "\t" . $waypoints[$i]->alt . "\n";
        fputs($file, $newLine);
    }
}

/**
 *  Créé un fichier .txt et place les waypoints dedans
 *
 *  @param {array} waypoints le tableau contenant les waypoints
 *  @return {File} le fichier contenant les waypoints
 */
function writeWaypointsFileTXT($waypoints) {

    $file = fopen('waypoints.txt', 'w+');
    $newLine = "";
    $waypointNumber = 0;

    for ($i = 0; $i < count($waypoints); $i++) {
        $waypointNumber++;
        $newLine = $waypointNumber . "\t" . $waypoints[$i]->note . "\n";
        fputs($file, $newLine);
    }
}

/**
 *  Convertit les coordonnées géographiques d'un point en lambert 93
 *
 *  @param {float} $latitude la latitude du point
 *  @param {float} $longitude la longitude du point
 *  @param {float} $x93 l'abscisse du point qui sera remplie par la fonction
 *  @param {float} $y93 l'ordonnée du point qui sera remplie par la fonction
 */
function convertGeoToL93($latitude, $longitude, &$x93, &$y93) {

    /* Conversion latitude,longitude en coordonée lambert 93 */
    // Projection conforme sécante, algo détailler dans NTG_71.pdf

    //variables:
    $a = 6378137; //demi grand axe de l'ellipsoide (m)
    $e = 0.08181919106; //première excentricité de l'ellipsoide
    $l0 = $lc = deg2rad(3);
    $phi0 = deg2rad(46.5); //latitude d'origine en radian
    $phi1 = deg2rad(44); //1er parallele automécoïque
    $phi2 = deg2rad(49); //2eme parallele automécoïque

    $x0 = 700000; //coordonnées à l'origine
    $y0 = 6600000; //coordonnées à l'origine

    $phi = deg2rad($latitude);
    $l = deg2rad($longitude);

    //calcul des grandes normales
    $gN1 = $a / sqrt(1 - $e * $e * sin($phi1) * sin($phi1));
    $gN2 = $a / sqrt(1 - $e * $e * sin($phi2) * sin($phi2));

    //calculs des latitudes isométriques
    $gl1 = log(tan(pi() / 4 + $phi1 / 2) * pow((1 - $e * sin($phi1)) / (1 + $e * sin($phi1)), $e / 2));
    $gl2 = log(tan(pi() / 4 + $phi2 / 2) * pow((1 - $e * sin($phi2)) / (1 + $e * sin($phi2)), $e / 2));
    $gl0 = log(tan(pi() / 4 + $phi0 / 2) * pow((1 - $e * sin($phi0)) / (1 + $e * sin($phi0)), $e / 2));
    $gl = log(tan(pi() / 4 + $phi / 2) * pow((1 - $e * sin($phi)) / (1 + $e * sin($phi)), $e / 2));

    //calcul de l'exposant de la projection
    $n = (log(($gN2 * cos($phi2)) / ($gN1 * cos($phi1)))) / ($gl1 - $gl2);//ok

    //calcul de la constante de projection
    $c = (($gN1 * cos($phi1)) / $n) * exp($n * $gl1);//ok

    //calcul des coordonnées
    $ys = $y0 + $c * exp(-1 * $n * $gl0);

    $x93 = $x0 + $c * exp(-1 * $n * $gl) * sin($n * ($l - $lc));
    $y93 = $ys - $c * exp(-1 * $n * $gl) * cos($n * ($l - $lc));
}


// Récupération du parcours à télécharger et appel de la vue
if (isset($_GET['action']) AND isset($_GET['hikeId']) AND
	$_GET['action'] === "downloadHike" AND is_numeric($_GET['hikeId']) AND $_GET['hikeId'] > 0) {

	$hike = $hikeManager->getAHike($_GET['hikeId']);
	$waypoints = json_decode($hike->waypoints());
    writeWaypointsFileMDT($waypoints);
    writeWaypointsFileTXT($waypoints);

	require ('view/downloadView.php');

} else {
	$msg = "Erreur : vous avez tenté un truc non autorisé ! Voyou !";
	require ('view/mainView.php');
}
