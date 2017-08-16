var cloneObject;

(function ($) {

  /**
   * @function cloneObject
   * @description Cloner un objet
   *
   * @param {object} datas - Objet à cloner
   *
   * @return {object} - Objet cloné
   */

  cloneObject = function (datas) {

    var output = {};
    $.each(datas, function (key, data) {
      output[key] = data;
    });

    return output;

  };

})(jQuery);

