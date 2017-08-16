var classifyBy;

(function ($) {

  /**
   * @function classifyBy
   * @description Trie un tableau d'objet par une clé donnée
   *
   * @param {array.<object>} datas - Tableau d'objets à trier
   * @param {function} key - Nom de la clé pour le tri.
   *
   * @return {object.<array>} - Objet comportant autant de "key" que trouvées. Chaque "key" étant un tableau avec les objets issus de "datas" correspondant à la clé trouvée.
   */

  classifyBy = function (datas, key) {

    var output = {};

    // On recherche les catégories uniques
    $.each(datas, function (i, data) {

      // On recherche la clé, et elle doit être sous forme de string
      if (typeof data[key] === 'string' && typeof output[data[key]] === 'undefined') {

        output[data[key]] = [];

      }

    });

    // On catégorise les donées
    $.each(datas, function (i, data) {

      if (typeof data[key] === 'string') {

        output[data[key]].push(data);

      }

    });

    return output;

  };

})(jQuery);
