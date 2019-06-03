/**
 *  MsgBox.js
 *  ---------
 *
 *  Affiche un message dans un élément html
 */

/**
 *  Constructeur
 *  @param {string} className = "msg_box" le nom de la classe pour la mise en forme CSS
 *  @param {string} id = "" l'id de l'élément de la MsbBox
 */
function MsgBox(className = "msg_box", id = "") {

    this.elt = document.createElement('div');
    this.elt.classList.add(className);
    if (id !== "") {
        if (document.getElementById(id))
            this.elt = document.getElementById(id);
        else
            this.elt.id = id;
    }
    this.visible = false;

    /**
     *  Affiche un message dans l'élément html de la MsgBox indéfiniment ou pendant un laps de temps donné
     *  @param {string} content le message à afficher ou du code HTML
     *  @param {integer} duration = -1 la durée d'affichage en millisecondes // -1 : permanent
     */
    this.show = function(content, duration = -1) {

        document.body.appendChild(this.elt);
        this.elt.style.display = 'block';
        this.elt.innerHTML = content;
        var that = this;
        if (duration >= 0) {
            setTimeout(function() { that.delete(); }, duration);
        }
    }

    /**
     *  Supprime la MsgBox
     */
    this.delete = function() {

        this.elt.parentNode.removeChild(this.elt);
    }

    /**
     *  Affiche ou masque la MsgBox à chaque appel de la méthode
     */
    this.showHide = function(content) {

        if (this.visible)
            this.delete();
        else
            this.show(content);
        this.visible = !this.visible;
    }
}