(function ($) {

  var mainMenu = function (context, settings) {

    if (typeof context === 'undefined') {
      context = document;
    }

    var cssClass = 'main-menu';
    var $targets = $('.' + cssClass, context);

    $targets.each(function () {
      var $target = $(this);

      if (typeof $target.data('init-' + cssClass) === 'undefined') {
        $target.data('init-' + cssClass, true);

        var $menu = $('.' + cssClass + '--menu', $target);
        $menu.rsAccordion({
          group: '> li',
          trigger: '> span, > a',
          section: '> .menu-simple',
          startOpened: '',
          easing: 'easeInOutQuart',
          duration: _duration,
          oneByOne: true,
          atLeastOne: false,
          expandedClass: 'expanded',
          collapsedClass: 'collapsed',
          accordionEnabled: 'accordion-enabled',
          scrollTo: false,
          tabs: false
        });

        var $trigger = $('.site-header .burger-menu--trigger');

        console.log($trigger);
        if ($trigger.length) {

          var $overlay = $('.' + cssClass + '--overlay', $target);
          var $panel = $('.' + cssClass + '--panel', $target);
          $trigger.unbind('click');

          // Click sur le trigger
          $trigger.click(function () {

            $overlay.hide();
            $panel.hide();
            $target.show();

            $overlay.stop(true, true).fadeIn(_duration);
            $panel.css('right', '-' + $panel.css('width')).show();
            $panel.stop(true, true).animate({
              right: '0'
            }, {
              duration: _duration,
              easing: 'easeInOutQuart'
            });
          });

          // Click sur l'overlay
          $overlay.click(function () {
            $panel.stop(true, true).animate({
              right: '-' + $panel.css('width')
            }, {
              duration: _duration,
              easing: 'easeInOutQuart',
              complete: function () {
                $target.hide();
              }
            });
            $overlay.stop(true, true).fadeOut(_duration);
          });
        }
      }
    });
  };

  Drupal.behaviors.mainMenu = {
    attach: mainMenu
  };

})(jQuery);
