/**
 * map.js
 * ------
 *
 * Contient toutes les fonctions et les instructions pour afficher la carte
 */

// IIFE
(function() {
	// Constantes
	// ----------

	// Nom du cookie utilisé en cas de markers positionnés mais non enregistrés
	const RECORDING_COOKIE = "recording";
	// id de la <div> de la carte
	const MAP_ID = "map";
	// id de la <div> des infos de position
	const USER_INFO_WINDOW_ID = 'user_info_window';
	// id de la <div> des infos du waypoint sélectionné
	const WAYPOINT_INFO_WINDOW_ID = 'waypoint_info_window';
	// id de la <div> du menu de la carte
	const MAP_MENU_ID = "mapMenu";
	// innerHTML en cas d'absence de waypoints
	const NO_WAYPOINT_HTML = "<p>Aucun waypoint de sélectionné.<br />Pour en créé un, double-cliquez sur la carte.</p>";
	// Noms des google.maps.MapTypeId
	const IGN_SOFT_MAP_TYPE_ID = "ign_soft";
	const IGN_SCANS_MAP_TYPE_ID = "ign_scans";
	// Tolérance de la géolocalisation
	const GEOLOC_TOLERANCE = 30;
	// Marqueur imprécis
	const IMPRECISE_MARKER = 'images/imprecise.png';
	// Marqueur précis
	const PRECISE_MARKER = 'images/precise.png';
	// Marqueur de waypoint
	const WAYPOINT_MARKER = 'images/waypoint.png';
	// Durée de la géolocalisation en millisecondes
	const GEOLOC_DURATION = 10000;
	// Clé géoportail
	const IGN_KEY = "k81gswufyozu38e49nfkcepg";
	// Texte du bouton de choix de calcul de l'altitude
	const ALT_CHOICE_API = "api";
	const ALT_CHOICE_GPS = "gps";
	// Durée d'appui pour créer un waypoint
	const CLICK_DURATION = 0.5;


	// Classes
	// -------

	/**
	 *	Point identifié par ses coordonnées géographiques
	 *
	 *	@param {float} lat la latitude
	 *	@param {float} lng la longitude
	 */
	function Point(lat = 0, lng = 0) {
		this.lat = lat;
		this.lng = lng;
	}

	/**
	 *	Créé un waypoint composé d'un identifiant unique et d'un Marker
	 *
	 *	@param {Object} waypointData les coordonnées, l'altitude et les notes du waypoint
	 *	@param {Point} userPosition = { lat: 0, lng: 0 } la position de l'utilisateur
	 * 	@param {string} note les notes du waypoint
	 */
	function Waypoint(waypointData, userPosition = { lat: 0, lng: 0 }) {

		/**
		 *	Calcule l'azimut du waypoint par rapport à la position de l'utilisateur
		 *
		 *	@param {Point} userPosition la position de l'utilisateur {lat, lng}
		 */
		this.calculateAzimuth = function(userPosition) {

			return myRoundFunction(calculateAzimuth(userPosition.lat, userPosition.lng, this.position.lat, this.position.lng), 0);
		}

		/**
		 *	Calcule la distance du waypoint par rapport à la position de l'utilisateur
		 *
		 *	@param {Point} userPosition la position de l'utilisateur {lat, lng}
		 */
		this.calculateDistance = function(userPosition) {

			return myRoundFunction(calculateDistanceLatLng(userPosition.lat, userPosition.lng, this.position.lat, this.position.lng), 0);
		}

		/**
		 *	Utilise l'API de géoportail pour déterminer l'altitude du point
		 *
		 *	@param {Element} elt = null l'élément du DOM où va s'afficher l'altitude
		 */
		this.getAltitude = function(elt = null) {

			var that = this;
		    var xhr = new XMLHttpRequest();
		    xhr.open("GET", "https://wxs.ign.fr/" + IGN_KEY + "/alti/rest/elevation.json?lat=" + this.position.lat + "&lon=" + this.position.lng + "&indent=true");
		    xhr.addEventListener('load', function() {
		        var point = JSON.parse(xhr.responseText);
		        var alt = myRoundFunction(point.elevations[0].z, 0);
		        that.altitude = alt;
		        if (elt)
		        	elt.textContent = "Altitude : " + alt + " m";
		    });
		    xhr.send(null);
		}

		// Met à jour la distance et l'azimut par rapport à la position de l'utilisateur
		this.update = function(userPosition) {

			this.azimuth = this.calculateAzimuth(userPosition);
			this.distance = this.calculateDistance(userPosition);
		}

		// Initialisation
		this.init = function() {

			var that = this;
			waypointSelectedId = that.id;
			waypointSelectedNumber = that.number;
			this.marker.addListener('click', function (event) {
				waypointSelectedId = that.id;
				waypointSelectedNumber = that.number;
				document.getElementById('add_note_window').style.display = 'none'; // On masque la fenêtre d'ajout de note
				that.showInfo();
				waypointInfoWindowElt.style.display = "block";
			});
			/* A remplacer par un bouton
			this.marker.addListener('dblclick', function (event) {
				deleteWaypoint(that.id);
				if (waypoints.length === 0) {
					waypointInfoWindowElt.style.display = "none";
					waypointInfoWindowElt.innerHTML = NO_WAYPOINT_HTML;
				}
			});*/
		}

		// Affichage des infos du waypoint
		this.showInfo = function() {

			var that = this;

			var mainDivElt = document.getElementById(WAYPOINT_INFO_WINDOW_ID);
			var titleWrapperElt = createOrGetElementById('waypoint_title_wrapper', 'div');
			var numberElt = createOrGetElementById('waypoint_number', 'p');
			var listElt = createOrGetElementById('waypoint_list', 'ul');
			var latitudeElt = createOrGetElementById('waypoint_latitude', 'li');
			var longitudeElt = createOrGetElementById('waypoint_longitude', 'li');
			var azimuthElt = createOrGetElementById('waypoint_azimuth', 'li');
			var distanceElt = createOrGetElementById('waypoint_distance', 'li');
			var altitudeElt = createOrGetElementById('waypoint_altitude', 'li');
			var btnAddNoteElt = createAddNoteBtn(); // Bouton d'écriture de note pour le waypoint
			var btnDeleteElt = createDeleteBtn(that); // Bouton de suppression du waypoint

			mainDivElt.innerHTML = "";
			numberElt.textContent = "Waypoint " + this.number;
			latitudeElt.textContent = "Latitude : " + this.position.lat;
			longitudeElt.textContent = "Longitude : " + this.position.lng;
			azimuthElt.textContent = "Azimut : " + this.azimuth + "°";
			distanceElt.textContent = "Distance : " + this.distance + " m";
			altitudeElt.textContent = 'Altitude : ⏳'; // Pour faire patienter en attendant la fin de la requête asynchrone...
			this.getAltitude(altitudeElt);

			titleWrapperElt.appendChild(numberElt);
			titleWrapperElt.appendChild(btnDeleteElt);
			mainDivElt.appendChild(titleWrapperElt);
			listElt.appendChild(latitudeElt);
			listElt.appendChild(longitudeElt);
			listElt.appendChild(azimuthElt);
			listElt.appendChild(distanceElt);
			listElt.appendChild(altitudeElt);
			mainDivElt.appendChild(listElt);
			mainDivElt.appendChild(btnAddNoteElt);
		}

		this.id = waypointId++;
		this.number = waypointNumber;
		this.marker = createMarker(waypointData, currentMap);
		this.position = {
			lat: myRoundFunction(waypointData.lat, 4),
			lng: myRoundFunction(waypointData.lng, 4)
		};
		this.azimuth = this.calculateAzimuth(userPosition);
		this.distance = this.calculateDistance(userPosition);
		if (waypointData.altitude)
			this.altitude = waypointData.altitude;
		else
			this.altitude = this.getAltitude();
		if (waypointData.note)
			this.note = waypointData.note;
		else
			this.note = "";
	}

	/**
	 *	Objet contenant les infos de position de l'utilisateur
	 *
	 *	@param {Point} position les coordonnées de la position de l'utilisateur
	 *	@param {float} altitude l'altitude donnée par la géolocalisation
	 *	@param {float} precision la précision de la géolocalisation
	 */
	function UserInfo(position = { lat: 0, lng: 0 }, altitude = 0, precision = 0) {
		this.position = position;
		this.altitude = altitude;
		this.precision = precision;

		// Setters
		this.setPosition = function(position) {
			this.position = position;
		}
		this.setAltitude = function(altitude) {
			this.altitude = altitude;
		}
		this.setPrecision = function(precision) {
			this.precision = precision;
		}

		// Initialisation
		this.init = function(position = { lat: 0, lng: 0 }, altitude = 0, precision = 0) {
			this.setPosition(position);
			this.setLat(altitude);
			this.setLat(precision);
		}
	}


	// Fonctions
	// ---------

	/**
	 *	Créé un élément du DOM pour faire le bouton de suppression d'un waypoint
	 *
	 *	@return	{Element} le bouton à placer
	 */
	function createDeleteBtn() {

		var btnDeleteElt = createOrGetElementById('waypoint_btn_delete', 'button');
		btnDeleteElt.textContent = "Supprimer";
		btnDeleteElt.classList.add('windowButton');
		btnDeleteElt.addEventListener('click', function() {
			deleteWaypoint(waypointSelectedId);
			waypointInfoWindowElt.style.display = "none";
			if (waypoints.length === 0) {
				waypointInfoWindowElt.innerHTML = NO_WAYPOINT_HTML;
			}
		});

		return btnDeleteElt;
	}

	/**
	 *	Créé un élément du DOM pour faire le bouton d'ajout de notes d'un waypoint
	 *
	 *	@return	{Element} le bouton à placer
	 */
	function createAddNoteBtn() {

		var btnAddNoteElt = createOrGetElementById('waypoint_btn_note', 'button');
		btnAddNoteElt.textContent = "✎🗒";
		btnAddNoteElt.classList.add('windowButton');
		btnAddNoteElt.addEventListener('click', showAddNoteWindow);

		return btnAddNoteElt;
	}

	/**
	 *	Affiche une fenêtre pour écrire une note pour le waypoint
	 *
	 *	@param {Event} evt l'évènement
	 */
	function showAddNoteWindow(evt) {

		var mainDivElt = document.getElementById('add_note_window');
		var titleElt = createOrGetElementById('add_note_title', 'p');
		var formElt = createOrGetElementById('add_note_form', 'form');
		var textElt = createOrGetElementById('add_note_text', 'textarea');
		var btnValidateElt = createOrGetElementById('add_note_ok_btn', 'input');
		var btnCloseElt = createOrGetElementById('add_note_close_btn', 'button');

		titleElt.textContent = "Ecrire une note pour le waypoint " + waypoints[waypointSelectedNumber - 1].number + " :";

		btnValidateElt.setAttribute('type', 'submit');
		btnValidateElt.value = "Valider";
		btnValidateElt.classList.add('smallButton');

		textElt.textContent = waypoints[waypointSelectedNumber - 1].note;

		btnCloseElt.textContent = "❌";
		btnCloseElt.classList.add('smallButton');

		formElt.appendChild(textElt);
		formElt.appendChild(btnValidateElt);
		mainDivElt.appendChild(titleElt);
		mainDivElt.appendChild(formElt);
		mainDivElt.appendChild(btnCloseElt);

		btnCloseElt.addEventListener('click', function() {
			mainDivElt.style.display = "none";
		});

		btnValidateElt.addEventListener('click', function(evt) {
			/**
			 *	Retire les gillemets doubles et les apostrophes
			 *
			 *	@return la note sans guillemets doubles ni apostrophes
			 */
			function prepareWaypointsNote(note) {
				
				note = note.replace(/'/g, "");
				note = note.replace(/"/g, "");

				return note;
			}

			evt.preventDefault();
			waypoints[waypointSelectedNumber - 1].note = prepareWaypointsNote(textElt.value);
			mainDivElt.style.display = "none";
		});

		mainDivElt.style.display = "block";
	}

	/**
	 * Créé un élément du DOM si il n'existe pas
	 *
	 * @param id l'id de l'élément à créer
	 * @param eltType le type d'élément à créer
	 * @param txt le texte de l'élément
	 * @return l'élément créé ou sélectionné
	 */
	function createOrGetElementById(id, eltType, txt = '') {
		var elt = document.getElementById(id);
		if (elt === null) { // L'élément n'existe pas, on le créé
			elt = document.createElement(eltType);
			elt.id = id;
			elt.appendChild(document.createTextNode(txt));
		} else {
			elt.textContent = '';
			elt.appendChild(document.createTextNode(txt));
		}
		return elt;
	}

	/**
	 * Créé une carte google à partir d'un élément HTML
	 *
	 * @param mapId l'id de l'élément HTML
	 * @return l'objet Map
	 */
    function initMap(mapId) {

        // Configuration des identifiants des cartes à afficher
        var mapTypeIds = [];
        for (var type in google.maps.MapTypeId)
            mapTypeIds.push(google.maps.MapTypeId[type]);
        mapTypeIds.push(IGN_SOFT_MAP_TYPE_ID);
        mapTypeIds.push(IGN_SCANS_MAP_TYPE_ID);

        var mapElt = document.getElementById(mapId);

        var mapOptions = {
            mapTypeId: 'roadmap',
            mapTypeControl: true,
            mapTypeControlOptions: {
                mapTypeIds: mapTypeIds,
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR, // DROPDOWN_MENU
                position: google.maps.ControlPosition.TOP_CENTER
            },
            center: {lat: 45.909933, lng: 5.958954},
            zoom: 16,
            disableDoubleClickZoom : true
        };

        var map = new google.maps.Map(
          mapElt, mapOptions);

        // Ajout des calques de carte IGN
        map.mapTypes.set(IGN_SOFT_MAP_TYPE_ID, initIGNMapType("GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD", "IGN", 21));
        map.mapTypes.set(IGN_SCANS_MAP_TYPE_ID, initIGNMapType("GEOGRAPHICALGRIDSYSTEMS.MAPS", "Cartes IGN scannées", 21));

        mapOptions = {
            mapTypeId: IGN_SCANS_MAP_TYPE_ID //IGN_SCANS_MAP_TYPE_ID
        };
        map.setOptions(mapOptions);

        return map;
    }

	/**
	 * Créé un calque de carte IGN
	 *
	 * @param layer le nom de la carte IGN : "GEOGRAPHICALGRIDSYSTEMS.MAPS", "GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD"
	 * @param name le nom que l'on veut donner au calque
	 * @param maxZoom le zoom maximum du calque
	 * @return l'objet ImageMapType correspondant au calque
	 */
	function initIGNMapType(layer, name, maxZoom) {

	 	var ignLayer = new google.maps.ImageMapType({
	        getTileUrl: function(coord, zoom) {
	            return "https://wxs.ign.fr/" + IGN_KEY + "/geoportail/wmts?" +
	            "LAYER=" + layer +
	            "&EXCEPTIONS=text/xml&FORMAT=image/jpeg&SERVICE=WMTS&VERSION=1.0.0" +
	            "&REQUEST=GetTile"+
	            "&STYLE=normal"+
	            "&TILEMATRIXSET=PM"+
	            "&TILEMATRIX=" + zoom +
	            "&TILEROW=" + coord.y +
	            "&TILECOL=" + coord.x;
	        },
	        tileSize: new google.maps.Size(256,256),
	        name: name,
	        maxZoom: maxZoom
	    });

	    return ignLayer;
	}

	/**
	 * Fonction appelée en cas de succés de la géolocalisation
	 *
	 * @param position l'argument automatiquement rempli par watchPosition() ou getCurrentPosition()
	 */
	function geolocationSuccess(position) {

		var coordinates = position.coords;

		// Affichage de la position de l'utilisateur
		var position = {
			lat: coordinates.latitude,
			lng: coordinates.longitude
		};
		userInfo.precision = coordinates.accuracy;
		if (userInfo.precision <= GEOLOC_TOLERANCE) {
			userMarker.setIcon(PRECISE_MARKER);
		} else {
			userMarker.setIcon(IMPRECISE_MARKER);
		}
		userMarker.setPosition(position); // On déplace le marker
		
		// Centrage de la carte sur la position de l'utilisateur
		currentMap.panTo(position);

		// Affichage des infos de la balade
		showUserInfo(coordinates);

		// Renseignement de la position et de l'altitude de l'utilisateur pour les autres fonctions
		userInfo.position = position;
		userInfo.altitude = coordinates.altitude;

		// Mettre à jour les infos des waypoints
		if (waypoints.length > 0) {
			for (var i = 0; i < waypoints.length; i++) {
				waypoints[i].update(position);
			}
			if (waypointSelectedId >= 0) {
				var waypointSelected = getWaypoint(waypointSelectedId);
				waypointSelected.showInfo();
			}
		}
	}

	/**
	 * Fonction appelée en cas d'échec de la géolocalisation
	 *
	 * @param err l'argument automatiquement rempli par watchPosition() ou getCurrentPosition()
	 */
	 function geolocationFailed(err) {

	 	// Eléments
	 	var positionElt = document.getElementById(USER_INFO_WINDOW_ID);
	 	positionElt.innerHTML = '';
		var titleElt = createOrGetElementById("position_title", 'h3');
	 	var linkElt = createOrGetElementById("refresh_link", 'a');
	 	// Noeuds textuels
	 	var textNodeBegin = document.createTextNode("Impossible de vous localiser. Veuillez ");
	 	var textNodeLink = document.createTextNode("cliquer ici");
	 	var textNodeEnd = document.createTextNode(" pour relancer la page.");

	 	linkElt.href = "https://carte.ovh?page=recording";

	 	titleElt.appendChild(textNodeBegin);
	 	linkElt.appendChild(textNodeLink);
	 	titleElt.appendChild(linkElt);
	 	titleElt.appendChild(textNodeEnd);
	 	positionElt.appendChild(titleElt);

	 	console.warn(`ERROR(${err.code}): ${err.message}`);
	 }

	/**
	 *	Affiche les infos de position de l'utilisateur
	 *
	 *	@param coordinates les coordonnées de l'utilisateur issues de la géolocalisation
	 */
	function showUserInfo(coordinates) {

		var positionElt = document.getElementById(USER_INFO_WINDOW_ID);
	 	positionElt.innerHTML = '';
		var titleElt = createOrGetElementById("user_position_title", 'p');
		var coordElt = createOrGetElementById("user_coord_list", "ul");
		var latElt = createOrGetElementById('user_latitude', 'li');
		var longElt = createOrGetElementById('user_longitude', 'li');
		var altElt = createOrGetElementById('user_altitude', 'li');
		var precisionElt = createOrGetElementById('user_precision', 'li');
		var btnAltChoiceElt = createOrGetElementById('alt_choice_btn', 'button');

		btnAltChoiceElt.classList.add('windowButton');

		titleElt.appendChild(document.createTextNode("Vous êtes ici :"));
		latElt.appendChild(document.createTextNode('Latitude : ' + myRoundFunction(coordinates.latitude, 4)));
		longElt.appendChild(document.createTextNode('Longitude : ' + myRoundFunction(coordinates.longitude, 4)));
		altElt.appendChild(document.createTextNode('Altitude : ' + myRoundFunction(coordinates.altitude, 0) + " m"));
		precisionElt.appendChild(document.createTextNode('Précision : ' + myRoundFunction(coordinates.accuracy, 0) + " m"));
		btnAltChoiceElt.appendChild(document.createTextNode(ALT_CHOICE_GPS));

		btnAltChoiceElt.addEventListener('click', switchUserAltitude);

		positionElt.appendChild(titleElt);
		coordElt.appendChild(latElt);
		coordElt.appendChild(longElt);
		coordElt.appendChild(precisionElt);
		coordElt.appendChild(altElt);
		coordElt.appendChild(btnAltChoiceElt);
		positionElt.appendChild(coordElt);
	}

	/**
	 *	Passe de l'altitude de l'utilisateur obtenue par géolocalisation à celle obtenue par l'API de géoportail et inversement
	 *
	 *	@param {event} evt l'évènement
	 */
	function switchUserAltitude(evt) {

		switch (evt.target.textContent) {

			case ALT_CHOICE_GPS:
				getUserAltitude();
	    		evt.target.textContent = ALT_CHOICE_API;
				break;

			case ALT_CHOICE_API:
				document.getElementById('user_altitude').textContent = "Altitude : " + myRoundFunction(userInfo.altitude, 0) + " m";
	    		evt.target.textContent = ALT_CHOICE_GPS;
				break;

			default:
				console.log('Erreur : le bouton n\'a pas le bon texte.');
		}
	}

	/**
	 *	Affiche l'altitude de l'api géoportail
	 */
	function getUserAltitude() {

		var xhr = new XMLHttpRequest();
	    xhr.open("GET", "https://wxs.ign.fr/" + IGN_KEY + "/alti/rest/elevation.json?lat=" + userInfo.position.lat + "&lon=" + userInfo.position.lng + "&indent=true");
	    xhr.addEventListener('load', function() {
	        var point = JSON.parse(xhr.responseText);
	        if (point)
	        	document.getElementById('user_altitude').textContent = "Altitude : " + myRoundFunction(point.elevations[0].z, 0) + " m";
	    });
	    xhr.send(null);
	}

	/**
	 * Créé un marqueur
	 *
	 * @return l'objet Marker
	 */
	function createMarker(position, map) {

		var markerOptions = {
			position: position,
			map: map
		};
		var marker = new google.maps.Marker(markerOptions);
		marker.setIcon(WAYPOINT_MARKER);
		return marker;
	}

	/**
	 * Centre la carte sur la position de l'utilisateur
	 */
	function locateUser() {

		locatingId = navigator.geolocation.watchPosition(geolocationSuccess, geolocationFailed, geolocationOptions);
		// MsgBox
		var msgBox = new MsgBox();
		msgBox.show("Géolocalisation en cours...", GEOLOC_DURATION);
		setTimeout(stopLocalisation, GEOLOC_DURATION, locatingId);
		console.log('Géolocalisation en cours...');
	}

	/**
	 *	Arrête la géolocalisation
	 *
	 *	@param id l'id venant de la méthode watchPosition
	 */
	function stopLocalisation(id) {

		navigator.geolocation.clearWatch(id);
		console.log('Géolocalisation arrêtée !');
	}

	/**
	 *	Charge les waypoints à charger ou ceux du cookie
	 */
	function loadWaypoints() {

		var mainDivElt = document.getElementById('continue_hike');
		var yesBtnElt = document.getElementById('continue_hike_yes');
		var noBtnElt = document.getElementById('continue_hike_no');
		// Waypoints à charger
		var waypointsStr = document.getElementById('waypointsLoaded').value;
		if (waypointsStr !== '' && waypointsStr[0] !== '/') {
			showWaypoints(JSON.parse(waypointsStr));
		} else {
			// Waypoints du cookie
			waypointsStr = getCookie(RECORDING_COOKIE);
			if (waypointsStr !== '') {
				mainDivElt.style.display = "block";

				yesBtnElt.addEventListener('click', function() {
					// Affichage des waypoints du cookie
					showWaypoints(JSON.parse(waypointsStr));
					// On masque la fenêtre
					mainDivElt.style.display = "none";
				});

				noBtnElt.addEventListener('click', function() {
					// Suppression du cookie
					deleteCookie(RECORDING_COOKIE);
					// Chargement du parcours à charger si besoin
					waypointsStr = document.getElementById('waypointsLoaded').value;
					if (waypointsStr !== '' && waypointsStr[0] !== '/') {
						showWaypoints(JSON.parse(waypointsStr));
					}
					// On masque la fenêtre
					mainDivElt.style.display = "none";
				});
			}
		}
	}

	/**
	 *	Affiche les markers des waypoints sur la carte
	 *
	 *	@param waypoints un tableau contenant les coordonnées des markers
	 */
	function showWaypoints(waypointsCoord) {

		for (var i = 0; i < waypointsCoord.length; i++) {
			waypointNumber++; // Incrémentation du nombre de waypoints créés
			var waypoint = new Waypoint(waypointsCoord[i], userInfo.position);
			waypoint.init();
			waypoints.push(waypoint);
		}
	}

	/**
	 *	Place un waypoint sur la carte lorsqu'on a cliqué
	 *
	 *	@param event l'objet correspondant à l'évènement
	 */
	function createWaypoint(event) {

		var position = {
			lat: event.latLng.lat(),
			lng: event.latLng.lng()
		}
		waypointNumber++; // Incrémentation du nombre de waypoints
		var waypoint = new Waypoint(position, userInfo.position);
		waypoint.init();
		waypoints.push(waypoint);
		waypoint.showInfo();
		waypointInfoWindowElt.style.display = "block";
	}

	/**
	 *	Récupère un waypoint
	 *
	 *	@param {integer} id l'identifiant du waypoint
	 *	@return {Waypoint} le waypoint recherché
	 */
	function getWaypoint(id) {
		for (var i = 0; i < waypoints.length; i++) {
			if (waypoints[i].id === id) {
				return waypoints[i];
			}
		}
		return null;
	}

	/**
	 *	Enlève un waypoint
	 *
	 *	@param id l'identifiant du waypoint
	 */
	function deleteWaypoint(id) {

		for (var i = 0; i < waypoints.length; i++) {
			if (id === waypoints[i].id) {
				waypoints[i].marker.setMap(null);
				waypoints.splice(i, 1);
				waypointNumber--;
				renumberWaypoints();
			}
		}
	}

	/**
	 *	Récupère les coordonnées et altitudes des waypoints
	 *
	 *	@return un tableau contenant les coordonnées et altitudes des waypoints
	 */
	function getWaypointsData() {

		var waypointsData = [];
		for (var i = 0; i < waypoints.length; i++) {
			waypointsData.push({
				lat: waypoints[i].position.lat,
				lng: waypoints[i].position.lng,
				alt: waypoints[i].altitude,
				note: waypoints[i].note
			});
		}
		return waypointsData;
	}

	/**
	 *	Renumérote les waypoints
	 */
	function renumberWaypoints() {

		for (var i = 0; i < waypoints.length; i++) {
			waypoints[i].number = i + 1;
		}
	}


	// Instructions
	// ------------

	// Identifiant du waypoint sélectionné
	var waypointSelectedId = -1;

	// Numéro du waypoint sélectionné
	var waypointSelectedNumber = -1;

	// Numérotation des waypoints
	var waypointNumber = 0;

	// Options de la géolocalisation
	var geolocationOptions = {
	  enableHighAccuracy: true,
	  timeout: 5000,
	  maximumAge: 0
	};

	// Création de la carte
	var currentMap = initMap(MAP_ID);

	// Création d'un marqueur de position de l'utilisateur
	var userMarker = createMarker({lat: 0, lng: 0}, currentMap);

	// Infos de position de l'utilisateur
	var userInfo = new UserInfo();

	// Création d'un tableau regroupant les markers des waypoints et affichage sur la carte
	var waypointId = 0;
	var waypoints = [];
	loadWaypoints();

	// Centrage sur la position de l'utilisateur
	var locatingId; // id pour stopper la géolocalisation

	if (waypoints.length > 0) {
		let position = waypoints[0].position;
		currentMap.panTo(position);
	} else {
		locateUser();
	}

	// Bouton de centrage de la carte
	var centerBtnElt = document.getElementById("center_btn");
	centerBtnElt.addEventListener('click', locateUser);

	// Affichage des infos de l'utilisateur
	var userInfoBtnElt = document.getElementById('user_info_btn');
	var userInfoWindowElt = document.getElementById(USER_INFO_WINDOW_ID);
	userInfoWindowElt.innerHTML = "<p>Ici s'affichera les informations relatives à votre position.</p>";
	userInfoBtnElt.addEventListener('click', function() {
		if (userInfoWindowElt.style.display !== "none")
			userInfoWindowElt.style.display = "none";
		else
			userInfoWindowElt.style.display = "block";
	});

	// Affichage des infos du waypoint sélectionné
	var waypointInfoBtnElt = document.getElementById('waypoint_info_btn');
	var waypointInfoWindowElt = document.getElementById(WAYPOINT_INFO_WINDOW_ID);
	waypointInfoWindowElt.style.display = "none";
	waypointInfoWindowElt.innerHTML = NO_WAYPOINT_HTML;
	waypointInfoBtnElt.addEventListener('click', function() {
		if (waypointInfoWindowElt.style.display !== "none")
			waypointInfoWindowElt.style.display = "none";
		else
			waypointInfoWindowElt.style.display = "block";
	});

	// Affichage du menu de la carte
	var mapMenuBtnElt = document.getElementById('mapMenuBtn');
	var mapMenuWindowElt = document.getElementById(MAP_MENU_ID);
	mapMenuWindowElt.style.display = "none";
	mapMenuBtnElt.addEventListener('click', function() {
		if (mapMenuWindowElt.style.display !== "none")
			mapMenuWindowElt.style.display = "none";
		else
			mapMenuWindowElt.style.display = "block";
	});

	// Affichage de la fenêtre d'aide
	var helpWindowElt = document.getElementById('help_window');
	var helpShowBtnElt = document.getElementById('map_help');
	helpWindowElt.style.display = "none";
	helpShowBtnElt.addEventListener('click', function() {
		if (helpWindowElt.style.display !== "none")
			helpWindowElt.style.display = "none";
		else
			helpWindowElt.style.display = "block";
	});
	var helpWindowBtnOkElt = document.getElementById('help_window_btn_ok');
	helpWindowBtnOkElt.addEventListener('click', function() {
		helpWindowElt.style.display = "none";
	});

	// Création d'un waypoint quand on double-clique sur la carte
	currentMap.addListener('dblclick', createWaypoint);

	// Formulaire d'enregistrement du parcours
	var saveFormElt = document.getElementById("savePath");
	var hikeNameElt = document.getElementById("hikeName");
	var waypointsElt = document.getElementById("waypoints");

	// Enregistrement du parcours
	saveFormElt.addEventListener("submit", function(event) {
		event.preventDefault();
		if (waypoints.length > 0) {
			if (hikeNameElt.value !== "") {
				waypointsElt.value = JSON.stringify(getWaypointsData()); // On enregistre les données des waypoints dans le formulaire
				deleteCookie(RECORDING_COOKIE);
				saveFormElt.submit();
			} else {
				var msgBox = new MsgBox();
				msgBox.show('Vous devez entrer le nom du parcours pour l\'enregistrer.', 2000);
			}
		} else {
			var msgBox = new MsgBox();
			msgBox.show('Vous n\'avez pas placé de marqueurs.', 2000);
		}
	});

	// On garde les waypoints dans un cookie si l'utilisateur quitte la page alors qu'il a déjà mis des waypoints
	window.addEventListener("beforeunload", function(event) {
		if (waypoints.length > 0)
			setCookie(RECORDING_COOKIE, JSON.stringify(getWaypointsData(waypoints)), 365);
	});
})();
