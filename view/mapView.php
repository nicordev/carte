<?php
ob_start();
?>

<!-- Points du parcours à afficher -->
<div id="hike_info">
	<?php
	if (isset($hike)) {
		echo '<h2>' . $hike->name() . '</h2>';
	}
	?>
	<form>
		<input id="waypointsLoaded" name="waypointsLoaded" type="hidden" value=<?php if (isset($hike)) { echo '\'' . $hike->waypoints() . '\''; } ?> />
	</form>
</div>

<!-- Un élément HTML pour recueillir la carte -->
<div id="map"></div>

<!-- Affichage des infos de position de l'utilisateur -->
<div class="info_window" id="user_info_window"></div>

<!-- Affichage des infos du waypoint sélectionné -->
<div class="info_window" id="waypoint_info_window"></div>

<!-- Fenêtre d'ajout de note du waypoint sélectionné -->
<div class="info_window" id="add_note_window"></div>

<!-- Bouton de centrage de la carte -->
<figure class="imageBtn" id="center_btn"><img src="images/center_btn.png" alt="Centrer sur vous" /></figure>

<!-- Bouton d'affichage des infos de position -->
<figure class="imageBtn" id="user_info_btn"><img src="images/user_info.png" alt="Afficher vos coordonnées" /></figure>

<!-- Bouton d'affichage des infos du waypoint sélectionné -->
<figure class="imageBtn" id="waypoint_info_btn"><img src="images/waypoint_info.png" alt="Afficher les coordonnées du point" /></figure>

<!-- Bouton d'affichage du menu -->
<button id="mapMenuBtn" class="niceButton">Menu</button>

<!-- Fenêtre d'aide -->
<div class="info_window" id="help_window">
	<h4>Mais comment ça marche ?</h4>
	<ul class="justify">
		<li>Double-cliquez sur la carte pour créer un waypoint</li>
		<li>Cliquez sur un waypoint pour afficher ses informations et ses commandes</li>
		<li>Cliquez sur le bouton en haut à gauche pour afficher ou masquer les informations du waypoint sélectionné</li>
		<li>Cliquez sur le bouton en haut à droite pour afficher ou masquer vos informations</li>
		<li>Une fois tous vos waypoints en place, vous pouvez les enregistrer dans "Menu->Enregistrer le parcours"</li>
	</ul>
	<button class="niceButton" id="help_window_btn_ok">J'ai compris !</button>
</div>

<!-- Boîte de dialogue pour reprendre le parcours enregistré dans le cookie -->
<div class="info_window" id="continue_hike">
	<p>
		Un parcours en cours d'enregistrement existe dans vos cookies.<br />
		Voulez-vous le poursuivre ?
	</p>
	<div class="window_btns_wrapper">
		<button class="niceButton" id="continue_hike_yes">Oui</button>
		<button class="niceButton" id="continue_hike_no">Non</button>
	</div>
</div>

<!-- Menu -->
<div class="info_window" id="mapMenu">
	<div id="mapMenuWrapper">
		<!-- Enregistrement du parcours -->
		<form id="savePath" method="post" action="index.php?page=history&action=savePath">
			<p class="center">
				<input type='hidden' name='waypoints' id='waypoints' />
				<input type="text" name="hikeName" id="hikeName" value="Parcours n°" /><br />
				<input class="menuButton" type='submit' value='Enregistrer le parcours' />
			</p>
		</form>
		<!-- Affichage de l'aide -->
		<button class="menuButton" id="map_help">Aide</button>
		<!-- Retour à l'accueil -->
		<p class="center" id="back_to_home"><a href="index.php"><button class="menuButton">Accueil</button></a></p>
	</div>
</div>

<!-- Chargement de l'API Google maps -->
<script src=<?= 'https://maps.google.com/maps/api/js?key=' . $keys->keys['googlemaps.key'][0] ?>></script>
<script type="text/javascript" src=<?= 'https://maps.google.com/maps/api/js?key=' . $keys->keys['googlemaps.key'][0] . '&libraries=places' ?>></script>
<script type="text/javascript" src=<?= 'https://maps.google.com/maps/api/js?key=' . $keys->keys['googlemaps.key'][0] . '&libraries=drawing' ?>></script>

<!-- Chargement de la carte -->
<script src="js/calculations.js"></script>
<script src="js/map.js"></script>

<?php
$content = ob_get_clean();

require ('template.php');
?>