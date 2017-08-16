// responsive slider

// Prérequis: Le slider dois être mis en forme avant d'appliquer le script. Le script se base sur les tailles constatées.
// Prérequis: Le slider et ses enfants directs ne doivent pas avoir d'attribut "style"
// Prérequis: Modernizr doit être présent avec l'option Modernizr.touch activé pour les terminaux tactiles

(function ($) {

  $.fn.extend({

    // Mémoriser les valeurs en pourcentage natives ou calculées
    responsiveSliderMemorizeOffset: function (value) {

      if (typeof this[0].sliderResponsive === 'undefined') {
        this[0].sliderResponsive = {};
      }
      this[0].sliderResponsive.offset = value;

      return this;
    },

    // Lire les valeurs en pourcentage natives ou calculées
    responsiveSliderReadOffset: function () {

      var value;
      if (typeof this[0].sliderResponsive.offset !== 'undefined') {
        value = this[0].sliderResponsive.offset;
      }

      return value;
    },

    // Mémoriser les valeurs en pourcentage natives ou calculées
    responsiveSliderMemorizeData: function (type, value) {

      if (typeof this[0].sliderResponsive === 'undefined') {
        this[0].sliderResponsive = {};
      }
      this[0].sliderResponsive[type] = value;

      return this;
    },

    // Lire les valeurs en pourcentage natives ou calculées
    responsiveSliderReadData: function (type) {

      var value;
      if (typeof this[0].sliderResponsive !== 'undefined' && typeof this[0].sliderResponsive[type] !== 'undefined') {
        value = this[0].sliderResponsive[type];
      }

      return value;
    },

    // Mémoriser la hauteur forcée du slider
    responsiveSliderMemorizeSliderAdaptativeHeight: function (value) {

      if (typeof this[0].sliderResponsive === 'undefined') {
        this[0].sliderResponsive = {};
      }
      this[0].sliderResponsive.adaptativeHeight = value;

      return this;
    },

    // Mémoriser la hauteur forcée du slider
    responsiveSliderReadSliderAdaptativeHeight: function () {

      var value;
      if (typeof this[0].sliderResponsive.adaptativeHeight !== 'undefined') {
        value = this[0].sliderResponsive.adaptativeHeight;
      }

      return value;
    },

    // Remettre à zéro la hauteur forcée du slider
    responsiveSliderResetSliderAdaptativeHeight: function () {

      if (typeof this[0].sliderResponsive === 'undefined') {
        this[0].sliderResponsive = {};
      }
      if (typeof this[0].sliderResponsive.adaptativeHeight !== 'undefined') {
        this[0].sliderResponsive.adaptativeHeight = void 0;
      }

      return this;
    },

    // Neutraliser la dimension visible d'un item
    responsiveSliderNeutralizeItemSize: function () {

      this.css({
        height: '1px',
        visibility: 'hidden'
      });

      return this;
    },

    // Désactiver la neutralisation de la dimension visible d'un item
    responsiveSliderRecoverItemSize: function () {

      this.css({
        height: 'auto',
        visibility: 'visible'
      });

      return this;
    },

    // Vérifier si un élément ou un de ses parents est masqué ou non
    checkHidden: function () {

      var output = false;

      if (this.css('display') === 'none') {
        output = true;
      }
      this.parents().each(function () {
        if ($(this).css('display') === 'none') {
          output = true;
        }
      });

      return output;
    },

    /**
     * @function responsiveSlider_pager_fn
     * @param {object} this - Objet insignSlider
     * @param {jQuery} $prev - Bouton précédent
     * @param {jQuery} $next - Bouton suivant
     * @param {jQuery} $dotsHolder - DOM elt comportant la pagination
     */

    /**
     * @typedef {object} responsiveSlider_options - Options de configuration de responsiveSlider
     *
     * @property {boolean} bypass=false - Court-circuiter le déclenchement du slider ou non
     * @property {fade|slide|flex} mode=slide - Mode de défilement du slider
     * @property {string} cssPrefix=responsive-slider - Préfixe CSS des classes générées
     * @property {boolean|responsiveSlider_pager_fn} pager=true - Insérer ou non la pagination (s'insère après l'élément ciblé par défault) | Fonction personnalisée
     * @property {number} sliderRange=1 - Nombre d'items à faire défiler (Si mode='fade', sliderRange est forcé à 1)
     * @property {boolean} fitSlides=false - Ajuster au bord droit les derniers slides
     * @property {boolean} adaptativeHeight=true - Ajuster la hauteur au plus grand visible
     * @property {number} duration=500 - Durée de l'animation entre 2 slides (en millisecondes)
     * @property {string} easing=null - Type d'animation jQuery easing
     * @property {string} classCurrent=current - Nom de la classe CSS d'un item en cours
     * @property {string} classDisabled=off - Nom de la classe CSS d'un item désactivé
     * @property {boolean} autoPlay=false - Activation du défilement auto
     * @property {number} autoPlayDuration=5 - Temps entre chaque défilement auto (en secondes)
     * @property {boolean} resumeAutoPlay=true - Ré-activation du défilement auto après un stop
     * @property {number} resumeAutoPlayDuration=5 - Temps avant la ré-activation du défilement auto (en secondes)
     * @property {object.<responsiveSlider_options>} responsive - Objet jSON dont la clef est le point de rupture, et la valeur un Objet jSON redéfinissant la configuration du slider pour une taille d'écran inférieur ou égale (desktop first)
     */

    /**
     * @class external:"jQuery.fn".responsiveSlider
     * @description Calculer une largeur en pourcentage
     *
     * @param {responsiveSlider_options} [cfg] - Options de configuration du slider
     *
     * @return {jQuery}
     */

    responsiveSlider: function (cfg) {

      var defaults = {
        // Options
        bypass: false,
        mode: 'slide',
        cssPrefix: 'responsive-slider',
        pager: true,
        sliderRange: 1,
        fitSlides: false,
        adaptativeHeight: true,
        duration: typeof _duration !== 'undefined' ? _duration : 500,
        easing: null,
        classCurrent: 'current',
        classDisabled: 'off',
        responsive: {},
        autoPlay: false,
        autoPlayDuration: 5,
        resumeAutoPlay: true,
        resumeAutoPlayDuration: 5,

        /** Méthodes **/
        onBeforeSlide: function () {
        },
        onAfterSlide: function () {
        },

        /** Configuration privée **/
        // _round: Nombre de chiffres après la virgule
        _round: Math.pow(10, 4),
        // _resizeTimeout: Temps, en secondes, de recalcul du slider au resize
        _resizeTimeout: 0.25,
        // _offsetTrigger: Largeur, en pixels, au delà de laquelle on active le swipe/slide
        _offsetTrigger: 20
      };

      // Stockage de l'objet
      var _self = this;

      // Item en cours de lecture
      var hasBeenInitialized = false;

      // Item en cours de lecture
      var _current = 0;
      var _currentDot;
      var _previous;
      // var _previousDot;

      // Futures options finales de configuration
      var options;

      // On déclare le setTimeout de l'application du resize
      var resize;

      // On déclare le setInterval de défilement auto
      var autoPlay;

      // On déclare le setTimeout de reprise du défilement auto
      var resumeAutoPlay;

      // On mémorise la largeur du viewport à chaque réinitialisation du slider
      var viewportWidth;

      // Référenciel de l'origine d'un swipe
      var swipeOrigin = {
        x: 0,
        y: 0
      };

      // Le swipe a-t-il été horizontal
      var swipeAxisX = false;

      // On déclare un wrapper pour le slider
      var $wrapper;

      // Eléments de pagination
      var $prev;
      var $next;
      var $dotsHolder;
      var $dots;

      // Enfants directs
      var $children;

      // On mémorise le premier et le dernier slide du slider
      // var slideFirst;
      var slideLast;

      // PRIVATE FUNCTIONS
      // Initialisation du slider
      var init = function () {

        // Slide en cours: 0
        _current = 0;
        _currentDot = void 0;
        _previous = void 0;
        // _previousDot = void 0;
        options = void 0;
        resize = void 0;
        autoPlay = void 0;
        resumeAutoPlay = void 0;
        viewportWidth = void 0;
        // slideFirst = void 0;
        slideLast = void 0;
        _self.responsiveSliderResetSliderAdaptativeHeight();

        if (typeof window.navigator.msPointerEnabled !== 'undefined') {
          _self[0].removeEventListener('MSPointerDown', swipeStart);
          _self[0].removeEventListener('MSPointerMove', swipeMove);
          _self[0].removeEventListener('MSPointerUp', swipeEnd);
        }
        _self[0].removeEventListener('touchstart', swipeStart);
        _self[0].removeEventListener('touchmove', swipeMove);
        _self[0].removeEventListener('touchend', swipeEnd);

        // Gestion des options de configuration
        options = cfgManager(defaults, cfg);

        // On force sliderRange à 1 si on est en mode fade
        if (options.mode === 'fade') {
          options.sliderRange = 1;
        }

        // Mémorisation de la taille du viewport
        viewportWidth = getViewportWidth();

        // Détection du redimensionnement
        $(window).bind('resize', _self.reloadSlider);

        // Si on ne souhaite pas bypasser l'activation
        if (!options.bypass) {

          // On va chercher les enfant directs
          $children = $('> *', _self);

          // On vérifie que le slider n'est masqué
          var trigger = _self.checkHidden();

          // On vérifie que le nombre de slides est bien supérieur au nombre à slider
          if ($children.length > options.sliderRange && !trigger) {

            // On spécifie que le slider a été initialisé au moins une fois
            hasBeenInitialized = true;

            // Touch events pour les terminaux tactiles
            if
            (
              typeof Modernizr !== 'undefined' &&
              (
                (typeof Modernizr.touch !== 'undefined' && Modernizr.touch) ||
                (typeof Modernizr.touchevents !== 'undefined' && Modernizr.touchevents)
              ) &&
              (
                options.mode === 'slide' ||
                options.mode === 'flex'
              )
            ) {
              initTouchEvents();
            }

            // On déclare un wrapper pour le slider
            $wrapper = $('<div />', {
              class: options.cssPrefix + '--wrapper',
              style: 'overflow:hidden;'
            });

            // Style CSS sur le slider
            _self.css({
              overflow: 'hidden',
              position: 'relative'
            });

            // On mémorise la largeur native
            var selfWidth = _self.widthPercentage();
            _self.responsiveSliderMemorizeData('native', selfWidth);

            // Initialisation conditionnée au mode 'slide' ou 'fade'
            switch (options.mode) {
              case 'fade':
                // Mode fade ou flex
                initModeFade();

                break;
              // Case "slide" ou "flex"
              default:
                // Mode slide
                initModeSlide();

                break;
            }

            // Construction de la pagination
            buildPager();

            // Défilement auto
            if (options.autoPlay) {
              _self.startAutoPlay();
            }

          }
        }
      };

      // Finalisation de l'initialisation en mode SLIDE
      var initModeFade = function () {

        // Wrapping
        _self.wrap($wrapper);

        // On masque les suivants
        $children.filter(':nth-child(n+2)').css({
          width: '100%',
          position: 'absolute',
          left: '0',
          top: '0',
          display: 'none'
        });

      };

      // Finalisation de l'initialisation en mode SLIDE
      var initModeSlide = function () {

        // On mémorise la largeur native
        var selfWidth = _self.widthPercentage();
        _self.responsiveSliderMemorizeData('native', selfWidth);

        // Stockage de la largeur en pourcentage
        var totalWidth = 0;
        $children.each(function () {
          var $elt = $(this);
          var width = $elt.widthPercentage();

          $elt.responsiveSliderMemorizeData('native', width);
          $elt.responsiveSliderMemorizeOffset(totalWidth);
          $elt.responsiveSliderMemorizeData('offset-visible', totalWidth);

          totalWidth += width;
        });

        // On mémorise la largeur du slider calculée
        _self.responsiveSliderMemorizeData('relative', totalWidth);

        // Wrapping
        $wrapper.css('width', _self.responsiveSliderReadData('native') + '%');
        _self.wrap($wrapper);

        // Application de la largeur du slider
        _self.css('width', totalWidth + '%');
        if (options.mode === 'flex') {
          _self.attr('style', _self.attr('style') + ' display: -ms-flexbox; display: flex;');
        }

        // Remise à la bonne échelle des slides
        $children.each(function () {
          var $elt = $(this);
          var relativeWidth = Math.round((($elt.responsiveSliderReadData('native') * 100) / totalWidth) * options._round) / options._round;

          $elt.responsiveSliderMemorizeData('relative', relativeWidth);

          if (options.mode === 'slide') {
            $elt.css({
              float: 'left',
              clear: 'none',
              width: relativeWidth + '%'
            });
          }
          else if (options.mode === 'flex') {
            $elt.css({
              width: relativeWidth + '%'
            });
          }
        });

        // Si on souhaite ajuster les derniers slides
        if (options.fitSlides) {

          var maxLeft = Math.abs(100 - _self.responsiveSliderReadData('relative'));
          var maxLeftRounded = Math.abs(100 - Math.round(_self.responsiveSliderReadData('relative')));

          var isOutOfRange = false;
          $children.each(function () {
            var $elt = $(this);

            var offset = Math.round($elt.responsiveSliderReadOffset());

            if (isOutOfRange) {
              $elt.responsiveSliderMemorizeData('isOutOfRange', true);
            }

            if (offset >= maxLeftRounded) {
              $elt.responsiveSliderMemorizeOffset(maxLeft);

              // On indique que c'est le dernier éléments à atteindre
              if (!isOutOfRange) {
                $elt.responsiveSliderMemorizeData('isLast', true);
              }

              isOutOfRange = true;
            }
          });
        }
        else {
          $children.each(function () {
            var $elt = $(this);

            $elt.responsiveSliderMemorizeData('isOutOfRange', false);
            $elt.responsiveSliderMemorizeData('isLast', false);
          });
        }

        // On masque les slides non affichés
        var slidesOut = _self.getSlidesOut();
        if (options.adaptativeHeight) {
          slidesOut.responsiveSliderNeutralizeItemSize();
        }

      };

      // Gestion des options de configuration
      var initTouchEvents = function () {

        if (typeof window.navigator.msPointerEnabled !== 'undefined') {
          _self[0].addEventListener('MSPointerDown', swipeStart, false);
          _self[0].addEventListener('MSPointerMove', swipeMove, false);
          _self[0].addEventListener('MSPointerUp', swipeEnd, false);
        }
        _self[0].addEventListener('touchstart', swipeStart, false);
        _self[0].addEventListener('touchmove', swipeMove, false);
        _self[0].addEventListener('touchend', swipeEnd, false);

      };

      // Construction de la pagination
      var buildPager = function () {

        // Eléments de pagination
        $prev = $('<div />', {
          class: options.cssPrefix + '--pager-prev'
        });
        $next = $('<div />', {
          class: options.cssPrefix + '--pager-next'
        });
        $dotsHolder = $('<ul />', {
          class: options.cssPrefix + '--pager-dots'
        });

        // Le bouton précédent est désactivé par défaut
        $prev.addClass(options.classDisabled);

        // Gestion du click
        $prev.click(_self.prevSlide);
        $next.click(_self.nextSlide);

        var indexLast = 0;
        $children.each(function (i) {
          var $elt = $(this);

          // Création de l'élément du DOM
          var $dot = $('<li />', {
            class: options.cssPrefix + '--pager-dot'
          });
          if (!i) {
            $dot.addClass(options.classCurrent);
          }

          // On mémorise l'index auquel est lié le dot
          $dot.responsiveSliderMemorizeData('slideIndex', i);

          // Gestion du click
          $dot.click(function () {
            _self.triggerDot(i, $dot);
          });

          var isLast = $elt.responsiveSliderReadData('isLast');
          var isOutOfRange = $elt.responsiveSliderReadData('isOutOfRange');
          // Si le point correspond à "sliderRange", on l'insère
          // Ou si c'est le dernier à atteindre
          if (((i % options.sliderRange) === 0 || isLast) && !isOutOfRange) {
            indexLast = i;
            $dotsHolder.append(
              $dot
            );
          }
        });
        $dots = $('> li', $dotsHolder);

        // On mémorise le premier et le dernier slide du slider
        // slideFirst = $children.eq(0);
        slideLast = $children.eq(indexLast);

        // On mémorize le current
        _currentDot = $dots.first();
        // _previousDot = $dots.last();

        // Si on a aucun slide masqué, on a pas de pagination, donc on peut détruire le slider
        if (_self.getSlidesOut().length) {
          // On exécute la pagination standard ou une fonction spécifique
          if (typeof options.pager === 'boolean' && options.pager) {
            insertPager();
          }
          if (typeof options.pager === 'function') {
            options.pager(_self, $prev, $next, $dotsHolder);
          }
        }

      };

      // Insertion standard de la pagination
      var insertPager = function () {

        // On récupère le wrapper, car il est impossible d'insérer dans le DOM HTML en ciblant un élément qui a été utilisé en .wrap()
        var wrapper = _self.parent();
        wrapper.after(
          $dotsHolder
        ).after(
          $next
        ).after(
          $prev
        );

      };

      // Procéder à l'animation
      var animateSlider = function (target) {

        // Elément précédemment affiché
        var previous = $children.eq(_previous);

        // Datas au callback des infos du slider
        var datas = {
          slider: _self,
          previous: {
            index: _previous,
            elt: previous
          },
          target: {
            index: _current,
            elt: target
          }
        };

        // Custom function "onBeforeSlide"
        options.onBeforeSlide(datas);

        // Configuration commune par défaut
        var animationCommon = {
          duration: options.duration,
          complete: function () {
            options.onAfterSlide(datas);
          }
        };

        // On vérifie si options.easing est déclaré et que la méthode d'easing existe bien
        if (typeof options.easing === 'string' && typeof jQuery.easing[options.easing] !== 'undefined') {
          animationCommon.easing = options.easing;
        }

        // Bascule en fonction du mode de slide
        switch (options.mode) {
          case 'fade':

            // Initialisation de la cible pour calcul de la hauteur
            target.css({
              width: '100%',
              position: 'absolute',
              left: '0',
              top: '0',
              display: 'block',
              opacity: 0
            });

            // Mémorisation de la hauteur
            var height = target.innerHeight();

            // Initialisation de la cible
            target.removeAttr('style').css({
              width: '100%',
              position: 'absolute',
              left: '0',
              top: '0',
              display: 'none'
            });

            // Mode fade
            var animationCfgSlider = cloneObject(animationCommon);
            animationCfgSlider = $.extend(animationCfgSlider, {
              complete: function () {
              }
            });
            var animationCfgPrevious = cloneObject(animationCommon);
            animationCfgPrevious = $.extend(animationCfgPrevious, {
              complete: function () {
                previous.css({
                  position: 'absolute'
                });
              }
            });
            var animationCfgTarget = cloneObject(animationCommon);
            animationCfgTarget = $.extend(animationCfgTarget, {
              complete: function () {
                target.removeAttr('style');
                options.onAfterSlide(datas);
              }
            });

            // Animation
            previous.fadeOut(animationCfgPrevious);
            target.fadeIn(animationCfgTarget);

            if (options.adaptativeHeight) {
              _self.animate({
                height: height + 'px'
              }, animationCfgSlider);
            }

            break;

          // Case "slide" ou "flex"
          default:

            // On mémorise les slides actuellement visibles
            var slidesOut = _self.getSlidesOut();

            // Mode slide
            var offset = target.responsiveSliderReadOffset();
            var animationCfg = cloneObject(animationCommon);
            animationCfg = $.extend(animationCfg, {
              complete: function () {
                if (options.adaptativeHeight) {
                  slidesOut.responsiveSliderNeutralizeItemSize();
                }
                options.onAfterSlide(datas);
              }
            });

            // On refixe la hauteur du slider
            var formerHeight = _self.responsiveSliderReadSliderAdaptativeHeight();
            if (typeof formerHeight === 'undefined') {
              formerHeight = _self.innerHeight();
            }

            // On réaffiche tous les slides
            $children.responsiveSliderRecoverItemSize();

            // On cherche, parmis les futurs slides, le plus grand
            var higher = _self.getSlidesInHigher();

            // On mémorise la hauteur calculée
            _self.responsiveSliderMemorizeSliderAdaptativeHeight(higher);

            // Animation
            var css = {
              left: '-' + offset + '%'
            };
            if (higher !== formerHeight && options.adaptativeHeight) {
              _self.css({
                height: formerHeight + 'px'
              });
              css.height = higher + 'px';
            }
            _self.animate(css, animationCfg);

            break;

        }

      };

      // Swipe start
      var swipeStart = function () {

        // Si on touche avec 1 seul doigt
        if (event.touches.length === 1) {

          // On récupère la valeur
          var touch = event.touches[0];
          swipeOrigin.x = touch.pageX;
          swipeOrigin.y = touch.pageY;

          // offsetOrigin = ctx.position();

          // On stope une éventuelle animation en cours
          _self.stop(true, true);

          // On cherche, parmis les futurs slides, le plus grand
          var higher = _self.getSlidesInHigher();

          // On fixe la hauteur du slider
          if (options.adaptativeHeight) {
            _self.css({
              height: higher + 'px'
            });
          }

          // On réaffiche tous les slides
          $children.responsiveSliderRecoverItemSize();

          // Arrêt du défilement auto
          if (options.autoPlay) {
            clearInterval(autoPlay);
          }

          // Arrêt de la reprise du défilement auto
          if (options.resumeAutoPlay) {
            clearTimeout(resumeAutoPlay);
          }

          // event.preventDefault();
        }

      };

      // Swipe move
      var swipeMove = function () {

        // Si on touche avec 1 seul doigt
        if (event.touches.length === 1) {

          // On récupère la valeur
          var touch = event.touches[0];

          // Si on swipe plus horizontalement que verticalement
          if (Math.abs(swipeOrigin.y - touch.pageY) < Math.abs(swipeOrigin.x - touch.pageX)) {

            var swipeOffset = swipeOrigin.x - touch.pageX;

            // Si on swipe au delà du seuil de déclenchement
            if (Math.abs(swipeOffset) > options._offsetTrigger) {
              swipeAxisX = true;

              // Calcul de swipeOffset en relatif
              swipeOffset = (swipeOffset * _self.responsiveSliderReadData('relative') / 100) / _self.width();

              // Passage en % et arrondi
              swipeOffset = Math.round(swipeOffset * 100 * options._round) / options._round;

              var sliderOffset = -_self.getCurrent().elt.responsiveSliderReadOffset();
              var swipeOffsetPercent = sliderOffset - swipeOffset;

              // On vérifie que l'offset ne dépasse pas 0
              if (swipeOffsetPercent > 0) {
                swipeOffsetPercent = 0;
              }

              // On vérifie que l'offset ne dépasse pas le dernier slide
              var maxOffset = -slideLast.responsiveSliderReadOffset();
              if (swipeOffsetPercent < maxOffset) {
                swipeOffsetPercent = maxOffset;
              }

              _self.css({
                left: swipeOffsetPercent + '%'
              });

              // On stoppe le scroll vertical qui bloque l'affichage
              event.stopPropagation();
              event.preventDefault();
            }
            else {
              swipeAxisX = false;
            }

          }
        }

      };

      // Swipe end
      var swipeEnd = function () {

        // Si on touche avec 1 seul doigt
        if (event.changedTouches.length === 1) {

          // On récupère la valeur
          var touch = event.changedTouches[0];

          // Sens du swipe
          var swipeOffset = swipeOrigin.x - touch.pageX;

          // Si on a swipé au delà du seuil de déclenchement
          if (swipeAxisX && Math.abs(swipeOffset) > options._offsetTrigger) {

            if (swipeOffset > 0) {
              _self.nextSlide();
            }
            else {
              _self.prevSlide();
            }

          }
        }

      };

      // PUBLIC FUNCTIONS

      /**
       * @method external:"jQuery.fn".responsiveSlider.reachSlide
       * @description Atteindre un slide donné
       *
       * @param {number} index - Index du slide ciblé
       * @param {number} trigger - Index de pagination cliblé
       */

      _self.reachSlide = function (index, trigger) {

        // On mémorise les précédents/suivants
        _previous = _current;
        _current = index;
        // _previousDot = _currentDot;
        _currentDot = trigger;

        if (!_currentDot.next().length) {
          $next.addClass(options.classDisabled);
        }
        else {
          $next.removeClass(options.classDisabled);
        }
        if (!_currentDot.prev().length) {
          $prev.addClass(options.classDisabled);
        }
        else {
          $prev.removeClass(options.classDisabled);
        }

        // On stope les animations
        _self.stop(true, true);
        $children.stop(true, true);

        // On démarre l'animation
        var target = $children.eq(trigger.responsiveSliderReadData('slideIndex'));
        animateSlider(target);

      };

      /**
       * @method external:"jQuery.fn".responsiveSlider.prevSlide
       * @description Atteindre le slide suivant
       */

      _self.prevSlide = function () {

        var prev = _currentDot.prev();
        if (prev.length) {
          prev.click();
        }

      };

      /**
       * @method external:"jQuery.fn".responsiveSlider.nextSlide
       * @description Atteindre le slide suivant
       */

      _self.nextSlide = function () {

        var next = _currentDot.next();
        if (next.length) {
          next.click();
        }

      };

      /**
       * @method external:"jQuery.fn".responsiveSlider.triggerDot
       * @description Atteindre un slide à partir de la pagination
       *
       * @param {number} index - Index du slide ciblé
       * @param {number} trigger - Index de pagination cliblé
       */

      _self.triggerDot = function (index, trigger) {

        if (!trigger.hasClass(options.classCurrent)) {

          // On ajoute la classe current
          $dots.removeClass(options.classCurrent);
          trigger.addClass(options.classCurrent);

          // Défilement auto stoppé si existant
          if (options.autoPlay) {
            _self.stopAutoPlay();
          }

          _self.reachSlide(index, trigger);

        }

      };

      /**
       * @method external:"jQuery.fn".responsiveSlider.nextSlideEndless
       * @description Atteindre le slide suivant récursivement (revenient au premier si on a atteind la fin)
       */

      _self.nextSlideEndless = function () {

        var next = _currentDot.next();
        if (!next.length) {
          next = $dots.first();
        }

        // On déclenche le slide
        next.click();
      };

      /**
       * @typedef {object} responsiveSlider_getCurrent_return
       *
       * @property {number} index - Index du slide courrant
       * @property {jQuery} elt - Objet jQuery du slide courrant
       */

      /**
       * @method external:"jQuery.fn".responsiveSlider.getCurrent
       * @description Connaître le slide en cours
       *
       * @return {responsiveSlider_getCurrent_return}
       */

      _self.getCurrent = function () {

        return {
          index: _current,
          elt: $children.eq(_current)
        };

      };

      /**
       * @method external:"jQuery.fn".responsiveSlider.getSlides
       * @description Connaître les éléments HTML correspondants aux slides
       *
       * @return {jQuery} - Objet jQuery
       */

      _self.getSlides = function () {

        return $children;

      };

      /**
       * @method external:"jQuery.fn".responsiveSlider.getSlidesIn
       * @description Connaître ceux actuellement visibles
       *
       * @return {jQuery} - Objet jQuery
       */

      _self.getSlidesIn = function () {

        var output;

        // Eléments qui matchent
        var filtered = [];

        // On cherche le premier item visible
        var targetMin;
        if (typeof _currentDot === 'undefined') {
          targetMin = $children.first();
        }
        else {
          targetMin = $children.eq(_currentDot.responsiveSliderReadData('slideIndex'));
        }

        filtered.push(targetMin[0]);
        var cumulativeWidth = targetMin.responsiveSliderReadData('native');
        targetMin.nextAll().each(function () {
          var $item = $(this);

          if (Math.round(cumulativeWidth) < 100) {
            filtered.push(this);
          }

          cumulativeWidth += $item.responsiveSliderReadData('native');
        });

        output = $(filtered);

        return output;
      };

      /**
       * @method external:"jQuery.fn".responsiveSlider.getSlidesOut
       * @description Connaître ceux actuellement non-visibles
       *
       * @return {jQuery} - Objet jQuery
       */

      _self.getSlidesOut = function () {

        var output;

        // On ne garde que les éléments entre l'index en cours et le nombre d'items à slider
        var filtered = [];

        var slidesIn = _self.getSlidesIn();
        slidesIn.first().prevAll().each(function () {
          filtered.push(this);
        });
        slidesIn.last().nextAll().each(function () {
          filtered.push(this);
        });

        output = $(filtered);

        return output;
      };

      /**
       * @method external:"jQuery.fn".responsiveSlider.getSlidesInHigher
       * @description Connaître le plus grand slide parmis ceux actuellement visibles
       *
       * @return {jQuery} - Objet jQuery
       */

      _self.getSlidesInHigher = function () {

        var higher = 0;

        var slidesIn = _self.getSlidesIn();
        slidesIn.each(function () {
          var item = $(this);
          var height = item.innerHeight();
          if (height > higher) {
            higher = height;
          }
        });

        return higher;
      };

      /**
       * @method external:"jQuery.fn".responsiveSlider.startAutoPlay
       * @description Lancer la lecture auto
       */

      _self.startAutoPlay = function () {

        autoPlay = setInterval(function () {
          _self.nextSlideEndless();
        }, (options.autoPlayDuration * 1000));

      };

      /**
       * @method external:"jQuery.fn".responsiveSlider.stopAutoPlay
       * @description Stopper la lecture auto
       *
       * @param {boolean} [preventResume=false] - Empêcher le redémarrage automatique
       */

      _self.stopAutoPlay = function (preventResume) {

        if (!(typeof preventResume === 'boolean' && preventResume)) {
          preventResume = false;
        }

        clearInterval(autoPlay);
        clearTimeout(resumeAutoPlay);

        // Défilement auto stoppé si existant
        if (options.resumeAutoPlay && !preventResume) {
          resumeAutoPlay = setTimeout(function () {
            _self.startAutoPlay();
          }, (options.resumeAutoPlayDuration * 1000));
        }

      };

      /**
       * @method external:"jQuery.fn".responsiveSlider.reloadSlider
       * @description Reconstruire le slider
       */

      _self.reloadSlider = function () {

        clearTimeout(resize);
        resize = setTimeout(function () {
          var instantViewport = getViewportWidth();
          if (instantViewport !== viewportWidth) {

            // Si la largeur a changé, on mémorise la nouvelle largeur et on ajuste le margin-top de la greybox
            viewportWidth = instantViewport;

            _self.destroySlider();
            init();
          }

        }, (options._resizeTimeout * 1000));

      };

      /**
       * @method external:"jQuery.fn".responsiveSlider.destroySlider
       * @description Destruction du slider
       */

      _self.destroySlider = function () {

        if (hasBeenInitialized) {
          // Arrêt de la détection du redimensionnement
          $(window).unbind('resize', _self.reloadSlider);

          // Arrêt des évènements swipe
          if (typeof Modernizr !== 'undefined' && typeof Modernizr.touch !== 'undefined' && Modernizr.touch) {
            if (typeof window.navigator.msPointerEnabled !== 'undefined') {
              _self[0].removeEventListener('MSPointerDown', swipeStart);
              _self[0].removeEventListener('MSPointerMove', swipeMove);
              _self[0].removeEventListener('MSPointerUp', swipeEnd);
            }
            _self[0].removeEventListener('touchstart', swipeStart);
            _self[0].removeEventListener('touchmove', swipeMove);
            _self[0].removeEventListener('touchend', swipeEnd);
          }

          // Arrêt du défilement auto
          if (options.autoPlay) {
            clearInterval(autoPlay);
          }

          // Arrêt de la reprise du défilement auto
          if (options.resumeAutoPlay) {
            clearTimeout(resumeAutoPlay);
          }

          // Arrêt des animations
          _self.stop(true, true);
          $children.stop(true, true);

          // Suppression des éléments de pagination
          if (typeof $prev !== 'undefined') {
            $prev.remove();
          }
          if (typeof $next !== 'undefined') {
            $next.remove();
          }
          if (typeof $dotsHolder !== 'undefined') {
            $dotsHolder.remove();
          }
          if (typeof $dots !== 'undefined') {
            $dots.remove();
          }

          // Supression des styles ajoutés
          _self.removeAttr('style');

          // Suppression du wrapper
          if (_self.parent().is('div.' + options.cssPrefix + '--wrapper')) {
            _self.unwrap($wrapper);
          }

          // Remise à la bonne échelle des slides
          $children.removeAttr('style');
        }

      };

      // Lancement de l'initialisation
      init();

      return _self;
    }
  });

})(jQuery);
