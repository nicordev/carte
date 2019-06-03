<?php
ob_start();
?>

<h2 class="pageTitle">Téléchargement d'un parcours</h2>

<p><?= $hike->name() ?></p>

<p><a href="waypoints.mdt" download>Télécharger le parcours au format .mdt</a></p>
<p><a href="waypoints.txt" download>Télécharger le parcours au format .txt</a></p>

<?php
include("include/backToHome.php");

$content = ob_get_clean();

require ('template.php');
?>