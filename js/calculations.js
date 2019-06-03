/**
 * 	calculations.js
 * 	---------------
 *
 * 	Contient des fonctions pour calculer des trucs
 */


// Distance
// --------

/**
 *  Retourne la distance entre 2 points avec des coordonnées géographiques en mètres ou kilomètres
 *  @param lat1 la latitude du point 1
 *  @param lng1 la longitude du point 1
 *  @param lat2 la latitude du point 2
 *  @param lng2 la longitude du point 2
 *  @param [unit] 'k' pour un résultat en kilomètre
 *  @return la distance en mètres ou kilomètres
 */
function calculateDistanceLatLng(lat1, lng1, lat2, lng2, unit = 'm') {

    earth_radius = 6378137;   // Terre = sphère de 6378km de rayon
    rlo1 = deg2rad(lng1);
    rla1 = deg2rad(lat1);
    rlo2 = deg2rad(lng2);
    rla2 = deg2rad(lat2);
    dlo = (rlo2 - rlo1) / 2;
    dla = (rla2 - rla1) / 2;
    a = (Math.sin(dla) * Math.sin(dla)) + Math.cos(rla1) * Math.cos(rla2) * (Math.sin(dlo) * Math.sin(dlo));
    d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    meter = (earth_radius * d);
    if (unit == 'k') {
        return meter / 1000;
    }
    return meter;
}


// Cartographie
// ------------

/**
 *  Calcul l'azimut entre 2 points de coordonnées géographiques connues
 *  @param lat1 la latitude du point 1
 *  @param lng1 la longitude du point 1
 *  @param lat2 la latitude du point 2
 *  @param lng2 la longitude du point 2
 *  @return l'azimut en degrés (en anglais azimuth)
 */
function calculateAzimuth(lat1, lng1, lat2, lng2) {

    // Conversions
    lat1 = deg2rad(lat1);
    lng1 = deg2rad(lng1);
    lat2 = deg2rad(lat2);
    lng2 = deg2rad(lng2);

    function calculateX(lat1, lng1, lat2, lng2) {
        return Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
    }

    function calculateY(lat1, lng1, lat2, lng2) {
        return Math.sin(lng2 - lng1) * Math.cos(lat2);
    }

    // Juste pour être sûr, j'aurais pu utiliser Math.atan2()
    function atan2(y, x) {
        return 2 * Math.atan(y / (Math.sqrt(x * x + y * y) + x));
    }

    function convertNegativeAngle(angle) {
        return (angle + 360) % 360;
    }

    var x = calculateX(lat1, lng1, lat2, lng2);
    var y = calculateY(lat1, lng1, lat2, lng2);

    return convertNegativeAngle(rad2deg(atan2(y, x)));
}


// Conversion
// ----------

/**
 *  Converti un angle exprimé en degrés en radians
 */
function deg2rad(deg) {

    return Math.PI * deg / 180;
}

/**
 *  Converti un angle exprimé en degrés en radians
 */
function rad2deg(rad) {

    return rad * 180 / Math.PI;
}


// Maths
// -----

/**
 *  Retourne le nombre arrondi
 *  @param  number le nombre à arrondir
 *  @param  precision le nombre de chiffres après la virgule
 *  @return le nombre arrondi
 */
function myRoundFunction(number, precision = 2) {

    var tmp = Math.pow(10, precision);
    return Math.round(number * tmp) / tmp;
}

