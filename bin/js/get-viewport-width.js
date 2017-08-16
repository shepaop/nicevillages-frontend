var getViewportWidth;

(function ($) {

  /**
   * @function getViewportWidth
   * @description Connaître la largeur de la fenêtre du navigateur
   *
   * @return {number}
   */

  getViewportWidth = function () {

    // Vérification de la largeur d'écran
    var viewportWidth;

    // Pour la plupart des navigateurs
    if (typeof window.outerWidth !== 'undefined') {
      viewportWidth = window.outerWidth;
    }

    // Pour IE8 et du même type, on court-circuite le mode responsive
    else {
      viewportWidth = -Number.NEGATIVE_INFINITY;
    }

    // Pour iOs window.outerWidth retourne 0
    if (viewportWidth === 0) {

      // Si on est en portrait
      if (typeof window.orientation !== 'undefined') {
        if (window.orientation === 0 || window.orientation === 180) {
          viewportWidth = screen.width;
        }
        else if (window.orientation === 90 || window.orientation === -90) {
          if (screen.availWidth > screen.width) {
            viewportWidth = screen.availWidth;
          }
          else {
            viewportWidth = $(window).width();
          }
        }
      }
    }

    return viewportWidth;
  };

})(jQuery);
