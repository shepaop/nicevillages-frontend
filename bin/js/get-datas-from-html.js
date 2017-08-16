var getDatasFromHtml;

(function ($) {

  /**
   * @typedef {object} getDatasFromHtml_options_advanced - Configuration avancée d'options de parsage de l'HTML
   *
   * @property {object} rule - Règle CSS de l'élément ciblé
   * @property {object} cfg - Configuration avancée
   * @property {string} cfg.attribute - Attribut HTML ciblé
   * @property {boolean} cfg.html=false - Retourner le contenu HTML plutôt que le text_node
   * @property {boolean} cfg.int=false - Demander de retourner l'attribut sous un typage number
   * @property {boolean} cfg.json=false - Demander de parser le format jSON d'un attribut
   */

  /**
   * @typedef {object} getDatasFromHtml_options - Options de parsage de l'HTML
   *
   * @property {(string|getDatasFromHtml_options_advanced)} - Règle CSS de l'élément ciblé | Configuration avancée
   */

  /**
   * @function getDatasFromHtml
   * @description Fonction permettant de parcourir une liste d'éléments dans la DOM HTML, et de retourner une liste de jSON avec les données parsées
   *
   * @param {jQuery} $targets - Eléments jQuery à parcourir
   * @param {array.<getDatasFromHtml_options>} cfg - Tableau Objets décrivant des données à parser
   *
   * @return {array} - Retourne un tableau d'objet comportant, pour chaque élément du DOM trouvé, les données recherchées associées
   */

  getDatasFromHtml = function ($targets, cfg) {

    // Modèle de données en sortie
    var output = [];

    // Configuration par défaut
    var defaults = {
      html: false,
      int: false,
      json: false
    };

    // Cloner un objet
    var cloneObject = function (datas) {

      var output = {};
      $.each(datas, function (key, data) {
        output[key] = data;
      });

      return output;

    };

    // On parcours la liste
    $targets.each(function () {
      // Item de liste
      var $item = $(this);

      // On créee un jSON pour stoker les données
      var entry = {
        $elt: $item
      };

      // On parcours la configuration
      $.each(cfg, function (key, unit) {

        // En fonction de l'info qui est recherchée, on applique un traitement différents
        switch (typeof unit) {

          // Si c'est un objet. Configuration avancée
          case 'object':

            // On vérifie que les 2 clés pré-requises pour la config complexes sont bien présentes
            if (typeof unit.rule === 'string' && typeof unit.cfg === 'object') {

              // On récupère la cible
              var $target;
              if (unit.rule === ':self') {
                $target = $item;
              }
              else {
                $target = $(unit.rule + ':first', $item);
              }

              // On vérifie qu'on ait bien trouvé la cible
              if ($target.length) {

                var output;

                // On clone la configuration par défaut
                var options = cloneObject(defaults);
                options = $.extend(options, unit.cfg);

                // On vérifie si c'est un attribut HTML que l'on cible ou non
                if (typeof options.attribute === 'string') {

                  // On récupère l'attribut
                  output = $target.attr(options.attribute);

                }
                // Sinon, c'est qu'on cherche le contenu d'un élément du DOM HTML
                else {

                  // Si on cherche du contenu au format HTML
                  if (typeof options.html === 'boolean' && options.html) {

                    // On récupère l'HTML
                    output = $target.html();

                  }
                  else {

                    // On récupère l'HTML
                    output = $.trim($target.text());

                  }

                }

                // On cherche un flottant
                if (typeof options.int === 'boolean' && options.int) {

                  // On parse un float
                  output = parseFloat(output);

                }

                // On cherche un json
                else if (typeof options.json === 'boolean' && options.json) {

                  // On parse un float
                  output = $.parseJSON(output);

                }

                // On ajoute le contenu
                entry[key] = output;
              }
              else {
                entry[key] = null;
              }

            }

            break;

          // string: Accès simple. Règle CSS (à partir de l'élément de liste), pour pour récupérer le texte du DOM
          default:

            // On récupère la cible
            var $targetElt = $(unit + ':first', $item);

            // Si un élément a été trouvé, on ajoute le contenu HTML
            if ($targetElt.length) {
              entry[key] = $.trim($targetElt.text());
            }
            // Sinon, on renvoie un empty
            else {
              entry[key] = null;
            }

            break;
        }
      });

      // On ajoute à OUTPUT
      output.push(entry);
    });

    // OUTPUT
    return output;
  };

})(jQuery);
