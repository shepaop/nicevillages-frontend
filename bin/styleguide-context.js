// Exécution du registre des fonctions déclarées au DOM Ready
if (typeof domReadyRegistry !== 'undefined') {

  (function ($) {

    var triggerFn = function () {

      $.each(domReadyRegistry, function (key, fn) {
        fn();
      });
    };
    $(window).on('styleguide:onRendered', triggerFn);
    $(document).ready(triggerFn);

  })(jQuery);

}

// Exécution des behaviors Drupal
if (typeof Drupal === 'undefined') {

  Drupal = {
    t: function (input) {
      return input;
    },
    behaviors: {}
  };

  (function ($) {

    var triggerFn = function () {

      $.each(Drupal.behaviors, function (key, behavior) {
        if (typeof behavior.attach === 'function') {
          behavior.attach();
        }
      });
    };
    $(window).on('styleguide:onRendered', triggerFn);
    $(document).ready(triggerFn);

  })(jQuery);

}

// Instance de Greybox du thème Insign Drupal
if (typeof gb === 'undefined' && typeof Greybox === 'function') {

  (function ($) {

    $(document).ready(function () {
      gb = new Greybox();
    });

  })(jQuery);

}

// Fonction de mise en exergue la grille
var gridReveal;

(function ($) {

  gridReveal = function (divider) {

    if (typeof divider === 'undefined') {
      divider = 12;
    }

    var unitWidth = Math.round((100 / divider) * 1000) / 1000;

    var holder = $('<div style="z-index:100;position:fixed;left:0;top:0;width:100%;height:100%;"></div>');
    var container = $('<div class="container" style="height:100%"></div>');
    var opacity;
    for (var i = 0; i < divider; i++) {

      if (i % 2 === 0) {
        opacity = '0.24';
      }

      else {
        opacity = '0.16';
      }
      var unit = $('<div style="float:left;width:' + unitWidth + '%;height:100%;background:rgba(255,0,0,' + opacity + ');outline:0;"></div>');
      container.append(unit);
    }
    holder.append(container);
    $('body').append(holder);
  };

})(jQuery);

// Fonction de mise en exergue la grille de ligne de base
var baselineReveal;

(function ($) {

  baselineReveal = function (elt) {


    if (typeof elt !== 'string') {
      elt = $('body');
    }
    else {
      elt = $(elt);
    }

    if (elt.css('position') === 'static') {
      elt.css({position: 'relative'});
    }

    var $container = $('<div />', {
      class: 'baseline-highlighter',
      style: 'z-index:1;position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;opacity:.5;'
    });

    var adjuster = function () {
      elt.each(function () {

        var $children = $('*:not(.baseline-highlighter):not(.baseline-highlighter-item)', $(this));
        var lowest = Number.POSITIVE_INFINITY;
        $children.each(function () {
          var lh = parseFloat($(this).css('line-height'));
          if (lh < lowest) {
            lowest = lh;
          }
        });

        $container.empty();

        for (var i = 0; i < 100; i++) {
          $container.append($('<div />', {
            style: 'box-sizing:border-box;border-bottom:1px solid #cc0000;height:' + lowest + 'px'
          }));
        }
      });
    };

    var intval;
    $(window).resize(function () {
      if (typeof intval !== 'undefined') {
        clearTimeout(intval);
      }
      intval = setTimeout(adjuster, 500);
    });

    elt.append($container);

    adjuster();
  };

})(jQuery);
