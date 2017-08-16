var animatedScrollTo;

(function ($) {

  /**
   * @function animatedScrollTo
   *
   * @description Animer le scroll vertical du navigateur
   *
   * @param {(string|object|number)} param - Règle CSS cible | Objet jQuery | Valeur du scroll à atteindre
   * @param {function} callback - Callback
   * @return false
   */

  animatedScrollTo = function (param, callback) {

    var top;

    if (typeof param === 'string' || typeof param === 'object') {
      var target = $(param).eq(0);
      if (target.length) {
        top = target.offset().top;
      }
    }
    else if (typeof param === 'number') {
      top = param;
    }

    if (typeof top === 'number') {
      var params = {
        duration: (typeof _duration === 'number') ? _duration : 500,
        easing: (typeof jQuery.easing.easeInOutQuad === 'function') ? 'easeInOutQuad' : 'linear'
      };
      if (typeof callback === 'function') {
        params.complete = callback;
      }

      $('html, body').stop(true).animate({
        scrollTop: top
      }, params);
    }
    return false;
  };

})(jQuery);
