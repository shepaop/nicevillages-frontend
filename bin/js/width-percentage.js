(function ($) {

  $.fn.extend({

    /**
     * @function external:"jQuery.fn".widthPercentage
     * @description Calculer une largeur en pourcentage
     *
     * @return {number} valeur en pourcentage par rapport au parent
     */

    widthPercentage: function () {

      // Nombre de chiffres après la virgule
      var round = 5;

      var parent = this.parent();

      return Math.round((this.width() * 100) / parent.width() * Math.pow(10, round)) / Math.pow(10, round);
    }
  });

})(jQuery);
