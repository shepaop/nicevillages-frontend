(function ($) {

  var passwordStrength = function (context, settings) {

    // Drupal environment (context est la portion du DOM concernée par le page load ou l'ajax)
    if (typeof context !== 'undefined') {
      context = $(context);
    }

    // Development environment (context et settings sont undefined)
    else {
      context = $(document);
    }

    var lowest = {
      r: 213,
      g: 32,
      b: 39
    };

    var highest = {
      r: 144,
      g: 184,
      b: 62
    };

    $('.password-strength', context).each(function () {
      var $target = $(this);
      if (!$target.data('init-password-strength')) {
        $target.data('init-password-strength', true);

        var $indicator = $('.password-indicator .indicator', $target);

        var $input = $target.nextAll('input.password-field');
        $input.keyup(function () {
          var ratio = $indicator.widthPercentage();
          var color = mixRgbColors(lowest, highest, ratio);
          $indicator.css('background-color', 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')');
        });
      }
    });

  };

  // Drupal environment
  if (typeof Drupal !== 'undefined') {
    Drupal.behaviors.passwordStrength = {
      attach: passwordStrength
    };
  }
  // Development environment
  else {
    $(document).ready(function () {
      passwordStrength();
    });
  }

})(jQuery);
