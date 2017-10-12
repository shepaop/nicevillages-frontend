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
      }
    });
  };

  Drupal.behaviors.mainMenu = {
    attach: mainMenu
  };

})(jQuery);
