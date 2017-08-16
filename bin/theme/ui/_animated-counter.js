(function ($) {

  /**
   * @typedef {object} animatedCounter_options
   * @description Options de configuration possible de la classe animatedCounter
   *
   * @property {number} start=0 - Nombre d'où débute le compteur
   * @property {number} end=parseFloat(this.text()) - Nombre de fin du compteur
   * @property {number} decimals=0 - Nombre de chiffres après la virgule
   * @property {number} duration=_duration|500 - Durée de l'animation (en milisecondes)
   * @property {function} onComplete=null Callback déclenché après l'animation
   * @property {function} onChange=null Callback déclenché à chaque step de l'animation
   * @property {object.<animatedCounter_options>} responsive={} Redéfinition des options pour le responsive (Mobile first). La clé de l'objet correspond à la largeur de l'écran à partir de laquelle on surcharge les options précédemment déclarées.
   *
   * */

  /**
   * @class external:"jQuery.fn".animatedCounter
   *
   * @param {animatedCounter_options} [cfg] - Options de configuration du compteur animé
   *
   * @return {jQuery}
   */

  $.fn.extend({

    animatedCounter: function (cfg) {

      // Stockage de l'objet
      var _self = this;

      if (typeof cfg !== 'object') {
        cfg = {};
      }

      var defaults = {
        start: 0,
        end: parseFloat($.trim(_self.text())),
        decimals: 0,
        duration: typeof _duration !== 'undefined' ? _duration : 500,
        onComplete: null,
        onChange: null
      };

      // Configuration
      var options;

      var initialStatus;

      // PRIVATE FUNCTIONS
      // Initialisation de l'animation
      var init = function () {

        // Gestion des options de configuration
        options = cfgManager(defaults, cfg);

        if (_self.length && !isNaN(options.start) && !isNaN(options.end)) {
          initialStatus = _self.html();
          _self.startAnimation();
        }
      };

      // PUBLIC FUNCTIONS
      /**
       * @method external:"jQuery.fn".animatedCounter.setStart
       * @description Redéfinir l'option start du compteur
       *
       * @param {number} start=0 - Nombre d'où débute le compteur
       *
       */

      _self.setStart = function (start) {
        var number = parseFloat($.trim(start));
        if (!isNaN(number)) {
          options.start = number;
        }
      };

      /**
       * @method external:"jQuery.fn".animatedCounter.getStart
       * @description Retourner l'option start du compteur
       *
       * @return {number} - Option start du compteur
       *
       */

      _self.getStart = function () {
        return options.start;
      };

      /**
       * @method external:"jQuery.fn".animatedCounter.setEnd
       * @description Redéfinir l'option end du compteur
       *
       * @param {number} end=0 - Nombre de fin du compteur
       *
       */

      _self.setEnd = function (end) {
        var number = parseFloat($.trim(end));
        if (!isNaN(number)) {
          options.end = number;
        }
      };

      /**
       * @method external:"jQuery.fn".animatedCounter.getEnd
       * @description Retourner l'option end du compteur
       *
       * @return {number} - Option end du compteur
       *
       */

      _self.getEnd = function () {
        return options.end;
      };

      /**
       * @method external:"jQuery.fn".animatedCounter.startAnimation
       * @description Relancer l'animation
       *
       * @return {object} - this
       */

      _self.startAnimation = function () {
        // mettre à zéro le contenu du champ
        _self.text(options.start);

        // paramètres de la fonction startAnimation jQuery
        var params = {
          duration: options.duration,
          easing: 'swing',
          step: function () {
            var value;
            if (options.decimals > 0) {
              var rounder = Math.pow(10, options.decimals);
              value = Math.round(this.Counter * rounder) / rounder;
            }
            else {
              value = Math.ceil(this.Counter);
            }

            if (typeof options.onChange === 'function') {
              options.onChange(_self, value);
            }
            else {
              _self.text(value);
            }
          },
          complete: function () {
            if (typeof options.onComplete === 'function') {
              options.onComplete(_self, options.end);
            }
            else {
              _self.text(options.end);
            }
          }
        };

        // animate jQuery
        $({Counter: options.start}).animate({
          Counter: options.end
        }, params);

        return _self;
      };

      /**
       * @method external:"jQuery.fn".animatedCounter.destroy
       * @description Détruire le compteur
       *
       * @return {object} - this
       */

      _self.destroy = function () {
        _self.setStart = void 0;
        _self.setEnd = void 0;
        _self.getStart = void 0;
        _self.getEnd = void 0;
        _self.startAnimation = void 0;
        options = void 0;

        _self.html(initialStatus);
        initialStatus = void 0;

        return _self;
      };

      // Lancement de l'initialisation
      init();

      return _self;
    }

  });

})(jQuery);
