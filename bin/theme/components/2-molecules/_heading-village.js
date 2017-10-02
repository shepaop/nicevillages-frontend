(function ($) {

  var headingVillage = function (context, settings) {

    if (typeof context === 'undefined') {
      context = document;
    }

    var cssClass = 'heading-village';
    var $targets = $('.' + cssClass, context);

    $targets.each(function () {
      var $target = $(this);
      if (!$target.data('init-' + cssClass)) {
        $target.data('init-' + cssClass, true);

        // JS behavior button creation
        var $title = $('.' + cssClass + '--title', $target);
        var $toggler = $('<p />', {
          class: cssClass + '--toggler'
        });
        var $togglerButton = $('<button />', {
          class: 'button-action'
        });
        $togglerButton.text(Drupal.t('Pictures'));

        // Slider
        var $pictures = $('.' + cssClass + '--picture > ul', $target);
        $('> li', $pictures).show();
        $pictures.responsiveSlider({
          autoPlay: true,
          autoPlayDuration: 5,
          mode: 'slide',
          sliderRange: 1,
          responsive: {
            960: {
              mode: 'fade'
            }
          }
        });

        // Click behavior
        $togglerButton.click(function () {
          $target.addClass('focus');
        });

        // DOM HTML insertion
        $title.append(
          $toggler.append(
            $togglerButton
          )
        );
      }
    });
  };

  Drupal.behaviors.headingVillage = {
    attach: headingVillage
  };

})(jQuery);
