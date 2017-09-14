var Countdown;

(function ($) {

  /**
   * @typedef {object} Countdown_options
   * @description Options de configuration possible de la classe Countdown
   *
   * @property {date} deadline=null Date de fin du compteur
   * @property {date} startTime=new Date() Date de début du compteur
   * @property {function} callback=function(){} Callback déclenché à chaque interval
   * @property {number} interval=1 Interval de calcul du temps restant (en secondes)
   *
   * */

  /**
   * @class Countdown
   * @description Système de décompte
   *
   * @param {Countdown_options} [cfg] Options de configuration du Countdown
   *
   * @return {jQuery} this
   */

  Countdown = function (cfg) {

    // Sécurité si cfg n'a pas été spécifié
    if (typeof cfg !== 'object') {
      cfg = {};
    }

    // Variables par défaut
    var defaults = {
      deadline: null,
      startTime: new Date(),
      callback: function () {
      },
      interval: 1 // en secondes
    };

    // Stockage de l'objet
    var _self = this;

    // Stockage de l'interval
    var intval;

    // Configuration
    var options = cfgManager(defaults, cfg);

    // Stockage des variables de temps
    var oneSecond = 1000;
    var oneMinute = oneSecond * 60;
    var oneHour = oneMinute * 60;
    var oneDay = oneHour * 24;

    // Temps restant
    var remainingTime;

    // Initialisation du compteur et calcul du temps restant
    var init = function () {

      if (options.deadline instanceof Date && !isNaN(options.deadline.valueOf()) && options.startTime instanceof Date && !isNaN(options.startTime.valueOf())) {

        remainingTime = options.deadline.getTime() - options.startTime.getTime();
        start();
      }
    };

    // Démarrage du compteur
    var start = function () {

      var exec = function () {
        var days = Math.floor(remainingTime / oneDay);
        var hours = Math.floor((remainingTime % oneDay) / oneHour);
        var minutes = Math.floor((remainingTime % oneHour) / oneMinute);
        var seconds = Math.floor((remainingTime % oneMinute) / oneSecond);

        var output = {
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds,
          milliseconds: (remainingTime % oneSecond)
        };

        options.callback(output);
      };

      intval = setInterval(function () {
        remainingTime -= options.interval * 1000;
        exec();
      }, (options.interval * 1000));
      exec();

      return _self;
    };

    // PUBLIC FUNCTIONS
    /**
     * @method Countdown.destroy
     * @description Détruire le compteur
     *
     */

    _self.destroy = function () {

      clearInterval(intval);

      return _self;
    };

    init();

    return _self;

  };

})(jQuery);
