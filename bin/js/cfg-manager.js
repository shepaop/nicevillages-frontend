var cfgManager;

(function ($) {

  /**
   * @function cfgManager
   * @description Gestion des options de configuration
   *
   * @return {object}
   */

  cfgManager = function (defaults, cfg) {

    var output = {};

    var clonedDefaults = cloneObject(defaults);
    output = $.extend(clonedDefaults, cfg);

    // Mémorisation de la largeur d'écran
    var viewportWidth = getViewportWidth();

    if (typeof output.responsive === 'object') {
      $.each(output.responsive, function (breakpoint, inheritCfg) {
        var intBreakpoint = parseInt(breakpoint);
        // Si le breakpoint est bien un "number"
        // Et si la largeur du navigateur est inférieure au breakpoint déclaré
        if (!isNaN(intBreakpoint) && viewportWidth >= intBreakpoint) {
          output = $.extend(output, inheritCfg);
        }
      });
    }

    return output;
  };

})(jQuery);
