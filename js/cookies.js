/**
 * 	cookies.js
 * 	----------
 *
 * 	Contient des fonctions pour gérer des cookies
 */

/**
 *  Créé un cookie
 *  @param  cname le nom à donner au cookie
 *  @param  cvalue la valeur du cookie
 *  @param  exdays la durée du cookie en jours
 */
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 *  Récupère la valeur d'un cookie
 *  @param  cname le nom du cookie
 *  @return la valeur du cookie ou "" si le cookie n'a pas été trouvé
 */
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 *  Supprime un cookie
 *  @param  cname le nom du cookie à supprimer
 */
function deleteCookie(cname) {
    setCookie(cname, "", -999);
}