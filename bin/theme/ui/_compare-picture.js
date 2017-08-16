// Compare picture

// Prérequis: Modernizr doit être présent avec l'option Modernizr.touch activé pour les terminaux tactiles

(function ($) {

  $.fn.extend({

    /**
     * @function comparePicture
     *
     * @description Compare deux photographies superposées à l'aide d'une "réglette" déplaçable à la souris et au touch.
     *
     * @param {(string)} before - Image à comparer (ex : état avant)
     * @param {(string)} after - Image de comparaison qui s'adaptera en largeur en fonction de la position de la "réglette" (ex : état après)
     * @param {(string)} labelBefore - label pour le paramètre before (ex : 'avant')
     * @param {(string)} labelAfter - label pour le paramètre after (ex : 'après')
     * @return {jQuery}
     */

    comparePicture: function (before, after, labelBefore, labelAfter) {

      // Paramètres de l'objet
      var _self = this;
      var $imgBefore = before;
      var $imgAfter = after;
      var $labelBefore = labelBefore;
      var $labelAfter = labelAfter;

      // Variables globales pour le positionnement des éléments de démo
      var $eltDemoAfter;
      var $eltDemoBefore;

      var _positionEltDemo;
      var _widthEltDemo;
      var _newWidth;
      var _deltaPosition;
      var _triggerX;
      var swipeOrigin = {
        x: 0,
        y: 0
      };

      // Construction du HTML de démo
      var buildDemo = function () {

        // Construction du swipe
        var $overflow = $('<div />', {class: 'teaser-skin-result-demo--visual-after-overflow'});
        var $swipe = $('<div />', {class: 'teaser-skin-result-demo--swipe'});

        // On wrappe les images actuelles pour créer l'effet de superposition
        $eltDemoBefore = $('<div />', {class: 'teaser-skin-result-demo--visual-before'}).append($imgBefore);
        $eltDemoAfter = $('<div />', {class: 'teaser-skin-result-demo--visual-after'}).append($overflow.append($imgAfter));

        // Construction/Insertion des labels des images
        var $eltLabelBefore = $('<span />', {class: 'teaser-skin-result-demo--before'}).text($labelBefore);
        var $eltLabelAfter = $('<span />', {class: 'teaser-skin-result-demo--after'}).text($labelAfter);

        $swipe.append($eltLabelBefore).append($eltLabelAfter);
        $eltDemoAfter.append($swipe);
        _self.append($eltDemoAfter).append($eltDemoBefore);
      };

      // Initialisation des écouteurs pour déclencher la fonction au click
      var init = function () {

        // Detect mousemove
        _self.bind('mousedown', function (e) {
          setSize(e);
          e.preventDefault();

          // Au mousemove on lance le setSize
          _self.bind('mousemove', function (e) {
            setSize(e);
            e.preventDefault();
          });
        });

        // Fin du déclenchement du calcul au mouseup
        _self.bind('mouseup', function (e) {
          setSize(e);
          _self.unbind('mousemove');
        });
      };

      // Initialisation des écouteurs pour déclencher la fonction au touch
      var initTouchEvents = function () {

        // Debug IE
        if (typeof window.navigator.msPointerEnabled !== 'undefined') {
          _self[0].addEventListener('MSPointerDown', swipeStart);
          _self[0].addEventListener('MSPointerMove', swipeMove);
          _self[0].addEventListener('MSPointerUp', swipeMove);
        }
        _self[0].addEventListener('touchstart', swipeStart, false);
        _self[0].addEventListener('touchmove', swipeMove, false);
        _self[0].addEventListener('touchend', swipeMove, false);
      };


      var swipeStart = function () {

        // Si on touche avec 1 seul doigt
        if (event.touches.length === 1) {

          var touch = event.touches[0];
          swipeOrigin.x = touch.pageX;
          swipeOrigin.y = touch.pageY;

          // On lance le calcul de la taille de l'élément comparé
          setSize(event);
        }
      };

      var swipeMove = function () {

        // Si on touche avec 1 seul doigt
        if (event.touches.length === 1) {
          var touch = event.touches[0];

          // Si on swipe plus horizontalement que verticalement
          if (Math.abs(swipeOrigin.y - touch.pageY) < Math.abs(swipeOrigin.x - touch.pageX)) {

            // On lance le calcul de la taille de l'élément comparé
            setSize(event);
            event.preventDefault();
          }
        }
      };

      // Calcul de la nouvelle taille de l'élément comparé en fonction du touchmove/mousemove
      var setSize = function (e) {
        _positionEltDemo = $(_self).offset().left;
        _widthEltDemo = parseFloat($(_self).css('width'));

        if (typeof Modernizr !== 'undefined' && typeof Modernizr.touch !== 'undefined' && Modernizr.touch) {
          _triggerX = e.changedTouches[0].pageX;
        }
        else {
          _triggerX = e.clientX;
        }

        if (!isNaN(_widthEltDemo)) {
          _deltaPosition = _triggerX - _positionEltDemo;

          // Calcul du ratio pour en définir la nouvelle taille
          _newWidth = (1 - (_deltaPosition / _widthEltDemo)) * 100;
          $eltDemoAfter.width(_newWidth + '%');
        }
      };

      // Ajout de la  nouvelle structure HTML
      buildDemo();

      // Lancement de l'initialisation
      if (typeof Modernizr !== 'undefined' && typeof Modernizr.touch !== 'undefined' && Modernizr.touch) {
        initTouchEvents();
      }
      else {
        init();
      }

      return _self;
    }

  });

})(jQuery);
