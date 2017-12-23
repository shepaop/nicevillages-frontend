(function ($) {

  var contentTabSystem = function (context, settings) {

    if (typeof context === 'undefined') {
      context = document;
    }

    var cssClass = 'content-tab-system';
    var $targets = $('.' + cssClass, context);

    $targets.each(function () {
      var $target = $(this);

      if (typeof $target.data('init-' + cssClass) === 'undefined') {
        $target.data('init-' + cssClass, true);

        var $lis = $('> .' + cssClass + '--group', $target);
        $target.rsAccordion({
          group: '> .' + cssClass + '--group',
          trigger: '> .' + cssClass + '--heading',
          section: '> .' + cssClass + '--section',
          startOpened: '',
          easing: 'easeInOutQuart',
          duration: _duration,
          oneByOne: true,
          atLeastOne: false,
          expandedClass: 'expanded',
          collapsedClass: 'collapsed',
          accordionEnabled: 'accordion-enabled',
          scrollTo: true,
          tabs: false,
          responsive: {
            960: {
              tabs: function (tabs) {
                tabs.addClass('content-tabs');
                $('> li', tabs).each(function (i) {
                  var cssClasses = $lis.eq(i).find('.content-tab-system--heading').attr('class');
                  var splitClasses = cssClasses.split('content-tab-system--heading');
                  if (typeof splitClasses[1] === 'string') {
                    $(this).attr('class', $(this).attr('class') + ' ' + $.trim(splitClasses[1]));
                  }
                });
                $target.before(tabs);
              },
              atLeastOne: true,
              startOpened: ':first',
              duration: 0,
              expandedClass: 'active'
            }
          }
        });
      }
    });
  };

  Drupal.behaviors.contentTabSystem = {
    attach: contentTabSystem
  };

})(jQuery);
