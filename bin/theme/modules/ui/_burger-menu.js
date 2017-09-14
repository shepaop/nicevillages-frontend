var BurgerMenu;

(function ($) {

  /**
   * @typedef {object} BurgerMenu_options
   * @description Options de configuration possible de la classe BurgerMenu
   *
   * @property {boolean} bypass=false Court-circuiter l'activation du menu
   * @property {string} prefix='burger-menu' Préfixe CSS du menu (syntaxe BEM)
   * @property {string|function} trigger='body' Règle CSS d'insertion (append) du trigger 'body'(default) | function
   * @property {string} openClass='open' Classe CSS ajoutée sur le trigger lorsque le menu est ouvert
   * @property {number} duration=_duration|500 Durée de l'animation (en milisecondes)
   * @property {string} easing='easeInOut' Type de transition pour l'animation
   * @property {string} side='right' Côté d'apparition ('right' | 'left')
   * @property {string} scroll=false Laisser la barre de scroll du body ou non
   * @property {object} structure={} Key : Suffixe CSS du <div /> englobant | Value : Règle CSS des éléments à cloner
   * @property {function} onStructureChanged=function(_self.structure,_self){} Callback déclenché à chaque modification de la structure du menu
   * @property {function} onBeforeOpen=function(_self){} Callback déclenché avant l'ouverture
   * @property {function} onAfterOpen=function(_self){} Callback déclenché après l'ouverture
   * @property {function} onBeforeClose=function(_self){} Callback déclenché avant la fermeture
   * @property {function} onAfterClose=function(_self){} Callback déclenché après la fermeture
   * @property {object.<BurgerMenu_options>} responsive={} Redéfinition des options pour le responsive (Mobile first). La clé de l'objet correspond à la largeur de l'écran à partir de laquelle on surcharge les options précédemment déclarées.
   *
   * */

  /**
   * @typedef {object} BurgerMenu_output
   * @description Données renvoyées par la classe BurgerMenu
   *
   * @property {jQuery} $container - Container du menu
   * @property {jQuery} $overlay - Overlay en fond
   * @property {jQuery} $trigger - Bouton d'ouverture/fermeture
   * @property {jQuery} structure - Mémorisation de la structure HTML du container
   *
   * */

  /**
   * @class BurgerMenu
   *
   * @param {BurgerMenu_options} [cfg] Options de configuration du BurgerMenu
   *
   * @return {BurgerMenu_output}
   */

  BurgerMenu = function (cfg) {

    // Sécurité si cfg n'a pas été spécifié
    if (typeof cfg !== 'object') {
      cfg = {};
    }

    // Variables par défaut
    var defaults = {
      bypass: false,
      prefix: 'burger-menu',
      trigger: 'body',
      openClass: 'open',
      duration: (typeof _duration === 'number') ? _duration : 500,
      easing: 'linear',
      side: 'right',
      scroll: false,
      structure: {},

      /** Events **/
      onStructureChanged: function () {
      },
      onBeforeOpen: function () {
      },
      onAfterOpen: function () {
      },
      onBeforeClose: function () {
      },
      onAfterClose: function () {
      },

      // _resizeTimeout: Temps, en secondes, de recalcul du slider au resize
      _resizeTimeout: 0.25
    };

    // Stockage de l'objet
    var _self = this;

    // Configuration
    var options;

    // Mémorisation du body
    var $body = $('body');

    // Mémorisation de la structure HTML du container
    _self.structure = {};

    // Le menu est-il ouvert ou non
    var isOpen = false;

    // Le menu est-il en cours d'animation ou non
    var isAnimating = false;

    // On mémorise la largeur du viewport à chaque réinitialisation du slider
    var viewportWidth;

    // On déclare le setTimeout de l'application du resize
    var resize;

    // PRIVATE FUNCTIONS

    // Initialisation du menu burger
    var init = function () {

      // Détection du redimensionnement
      $(window).bind('resize', _self.reload);

      // Gestion des options de configuration
      options = cfgManager(defaults, cfg);

      // On mémorise la taille du viewport
      viewportWidth = getViewportWidth();

      if (typeof options.bypass === 'boolean' && !options.bypass) {

        // Création du container
        _self.$container = $('<div />', {class: options.prefix + '--container'}).hide();

        // Création du container
        _self.$overlay = $('<div />', {class: options.prefix + '--overlay'}).hide();

        // Création du bouton trigger
        _self.$trigger = $('<div />', {class: options.prefix + '--trigger'});

        // Comportements
        _self.$trigger.click(function () {
          if (!isOpen) {
            _self.open();
          }
          else {
            _self.close();
          }
        });
        _self.$overlay.click(_self.close);

        // Si le menu était précedement ouvert, on le rouvre
        if (isOpen) {
          // On neutralise "isOpen" pour permettre l'ouverture
          isOpen = false;
          _self.open();
        }

        // Gestion de l'insertion du bouton trigger
        switch (typeof options.trigger) {
          case 'string':
          case 'object':
            $(options.trigger).append(_self.$trigger);
            break;
          case 'function':
            options.trigger(_self.$trigger);
            break;
          default:
            break;
        }
      }
      else {
        isOpen = false;
      }

    };

    // Activer le menu
    var prepareBeforeOpen = function () {
      if (!options.scroll) {
        $body.css('overflow-y', 'hidden');
      }
      // Insertion du contenu
      _self.addStructure(options.structure);
      // Insertion dans le DOM
      $body.append(_self.$overlay).append(_self.$container);
    };

    // Désactiver le menu
    var cleanAfterClose = function () {
      if (!options.scroll) {
        $body.css('overflow-y', 'auto');
      }
      // Suppression du contenu
      _self.empty();
      // Retrait du DOM
      _self.$overlay.detach().hide();
      _self.$container.detach().hide();
    };

    // PUBLIC FUNCTIONS
    /**
     * @method BurgerMenu.addStructure
     * @description Ajouter un éléments dans la structure du menu
     *
     * @param {object} struture - Key : Suffixe CSS du <div /> englobant | Value : Règle CSS des éléments à cloner
     *
     */

    _self.addStructure = function (struture) {
      if (typeof struture === 'object') {

        $.each(struture, function (suffix, cssRule) {

          var $div = $('<div />', {class: options.prefix + '--' + suffix});

          // Memorisation des éléments
          // var index = _self.structure.length;
          _self.structure[suffix] = {
            container: $div,
            clones: []
          };

          if (typeof cssRule === 'string') {
            $(cssRule).each(function (i) {
              var $clone = $(this).clone();

              // Memorisation des éléments
              _self.structure[suffix].clones[i] = $clone;

              // Insertion dans le DOM
              $clone.appendTo($div);
            });
          }

          // Insertion dans le DOM
          _self.$container.append($div);

          // index++;
        });

        options.onStructureChanged(_self.structure, _self);
      }
    };

    /**
     * @method BurgerMenu.empty
     * @description Vider le container
     *
     */

    _self.empty = function () {
      _self.$container.empty();
      _self.structure = {};
      options.onStructureChanged(_self.structure, _self);
    };

    /**
     * @method BurgerMenu.open
     * @description Ouverture du menu
     *
     */

    _self.open = function () {
      if (!isOpen && !isAnimating) {
        isAnimating = true;

        prepareBeforeOpen();

        options.onBeforeOpen(_self);

        _self.$trigger.addClass(options.openClass);

        // Gestion du côté d'affichage
        var css = {right: '0px'};
        var side = defaults.side;
        if (options.side === 'left') {
          side = 'left';
          css = {left: '0px'};
        }

        // On affiche le menu en dehors de l'écran pour pouvoir calculer sa largeur
        _self.$container.css(side, '150%').show();
        var width = _self.$container.width();
        _self.$container.css(side, '-' + width + 'px');

        // Annimation
        _self.$overlay.stop(true, true).fadeIn({
          duration: options.duration
        });
        _self.$container.stop(true, true).animate(css, {
          duration: options.duration,
          easing: options.easing,
          complete: function () {

            isAnimating = false;
            isOpen = true;
            options.onAfterOpen(_self);
          }
        });
      }
    };

    /**
     * @method BurgerMenu.close
     * @description Fermeture du menu
     *
     */

    _self.close = function () {
      if (isOpen && !isAnimating) {
        isAnimating = true;

        options.onBeforeClose(_self);

        _self.$trigger.removeClass(options.openClass);
        var width = _self.$container.width();

        // Gestion du côté d'affichage
        var css = {right: '-' + width + 'px'};
        if (options.side === 'left') {
          css = {left: '-' + width + 'px'};
        }

        _self.$overlay.stop(true, true).fadeOut({
          duration: options.duration
        });
        _self.$container.stop(true, true).animate(css, {
          duration: options.duration,
          easing: options.easing,
          complete: function () {

            cleanAfterClose();

            isAnimating = false;
            isOpen = false;
            options.onAfterClose(_self);
          }
        });
      }
    };

    /**
     * @method BurgerMenu.reload
     * @description Recharger le menu
     *
     */

    _self.reload = function () {

      clearTimeout(resize);
      resize = setTimeout(function () {
        var instantViewport = getViewportWidth();
        if (instantViewport !== viewportWidth) {

          // Si la largeur a changé, on mémorise la nouvelle largeur et on ajuste le margin-top de la greybox
          viewportWidth = instantViewport;

          _self.destroy();
          init();

        }

      }, (options._resizeTimeout * 1000));

    };

    /**
     * @method BurgerMenu.destroy
     * @description Détruire l'accordéon
     *
     */

    _self.destroy = function () {

      if (typeof options === 'object') {
        options.onAfterClose(_self);
      }

      if (typeof _self.$container !== 'undefined') {
        _self.$container.remove();
      }
      if (typeof _self.$overlay !== 'undefined') {
        _self.$overlay.remove();
      }
      if (typeof _self.$trigger !== 'undefined') {
        _self.$trigger.remove();
      }

      options = void 0;
      _self.$container = void 0;
      _self.$overlay = void 0;
      _self.$trigger = void 0;

      _self.structure = {};

      isAnimating = false;

      resize = void 0;

    };

    // Lancement de l'initialisation
    init();

    return _self;

  };

})(jQuery);
